import { buildDailyDigestPayload, buildDigestEmail, shouldSendDigestNow } from './_digest.js';
import { insertWithVariants, selectFirstAvailable, updateWhere } from './_supabase.js';
import { withWorkspaceFilter } from './_request-scope.js';

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_TZ = 'Europe/Warsaw';
const DEFAULT_DIGEST_HOUR = 7;

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asNullableText(value: unknown) {
  const normalized = asText(value);
  return normalized || null;
}

function asBool(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  }
  return fallback;
}

function asInt(value: unknown, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(23, Math.floor(parsed)));
}

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}');
    } catch {
      return {};
    }
  }
  return req.body;
}

function extractBearerToken(req: any) {
  const auth = asText(req?.headers?.authorization || req?.headers?.Authorization);
  if (!auth.toLowerCase().startsWith('bearer ')) return '';
  return auth.slice(7).trim();
}

function getDateKey(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function getAppUrl(req: any) {
  const configured = asNullableText(process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL);
  if (configured) return configured.replace(/\/+$/, '');
  const host = asNullableText(req?.headers?.host);
  if (!host) return 'https://closeflowapp.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

function isDuplicateLogError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('23505') || message.includes('duplicate key value');
}

async function readDigestWorkspaces() {
  const result = await selectFirstAvailable([
    'workspaces?select=*&daily_digest_enabled=is.true&daily_digest_recipient_email=not.is.null&limit=2000',
    'workspaces?select=*&daily_digest_recipient_email=not.is.null&limit=2000',
    'workspaces?select=*&limit=2000',
  ]);
  return Array.isArray(result.data) ? result.data.filter((row) => row && typeof row === 'object') : [];
}

async function alreadySentToday(profileEmail: string, sentForDate: string) {
  try {
    const result = await selectFirstAvailable([
      `digest_logs?select=id&profile_email=eq.${encodeURIComponent(profileEmail)}&sent_for_date=eq.${encodeURIComponent(sentForDate)}&limit=1`,
    ]);
    return Array.isArray(result.data) && result.data.length > 0;
  } catch {
    return false;
  }
}

function normalizeTaskRows(rows: Record<string, unknown>[]) {
  return rows.filter((row) => {
    const recordType = asText(row.record_type || row.recordType).toLowerCase();
    const showInTasks = row.show_in_tasks === true || row.showInTasks === true;
    const hasStartAt = Boolean(row.start_at || row.startAt || row.end_at || row.endAt);
    if (recordType === 'event') return false;
    if (recordType === 'task') return true;
    if (showInTasks) return true;
    if (hasStartAt && !showInTasks) return false;
    return true;
  });
}

function normalizeEventRows(rows: Record<string, unknown>[]) {
  return rows.filter((row) => {
    const recordType = asText(row.record_type || row.recordType).toLowerCase();
    const showInCalendar = row.show_in_calendar === true || row.showInCalendar === true;
    const showInTasks = row.show_in_tasks === true || row.showInTasks === true;
    const hasStartAt = Boolean(row.start_at || row.startAt || row.end_at || row.endAt);
    if (recordType === 'task') return false;
    if (recordType === 'event') return true;
    if (hasStartAt) return true;
    if (showInCalendar && !showInTasks) return true;
    return false;
  });
}

async function loadWorkspaceBundle(workspaceId: string) {
  const [leadsResult, workItemsForTasks, workItemsForEvents] = await Promise.all([
    selectFirstAvailable([
      withWorkspaceFilter('leads?select=*&order=updated_at.desc.nullslast&limit=1000', workspaceId),
      withWorkspaceFilter('leads?select=*&order=created_at.desc.nullslast&limit=1000', workspaceId),
    ]),
    selectFirstAvailable([
      withWorkspaceFilter('work_items?select=*&show_in_tasks=is.true&order=created_at.desc.nullslast&limit=2000', workspaceId),
      withWorkspaceFilter('work_items?select=*&record_type=eq.task&order=created_at.desc.nullslast&limit=2000', workspaceId),
      withWorkspaceFilter('work_items?select=*&type=eq.task&order=created_at.desc.nullslast&limit=2000', workspaceId),
      withWorkspaceFilter('work_items?select=*&order=created_at.desc.nullslast&limit=2000', workspaceId),
    ]),
    selectFirstAvailable([
      withWorkspaceFilter('work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=2000', workspaceId),
      withWorkspaceFilter('work_items?select=*&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=2000', workspaceId),
      withWorkspaceFilter('work_items?select=*&order=start_at.asc.nullslast&limit=2000', workspaceId),
    ]),
  ]);

  const leads = Array.isArray(leadsResult.data) ? leadsResult.data : [];
  const taskRows = Array.isArray(workItemsForTasks.data) ? workItemsForTasks.data : [];
  const eventRows = Array.isArray(workItemsForEvents.data) ? workItemsForEvents.data : [];

  return {
    leads,
    tasks: normalizeTaskRows(taskRows as Record<string, unknown>[]),
    events: normalizeEventRows(eventRows as Record<string, unknown>[]),
  };
}

async function sendDigestEmail({
  to,
  subject,
  plain,
  html,
}: {
  to: string;
  subject: string;
  plain: string;
  html: string;
}) {
  const resendApiKey = asNullableText(process.env.RESEND_API_KEY);
  const digestFromEmail = asNullableText(process.env.DIGEST_FROM_EMAIL) || 'CloseFlow <onboarding@resend.dev>';
  if (!resendApiKey) {
    return { ok: false, error: 'RESEND_API_KEY_MISSING' };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: digestFromEmail,
        to: [to],
        subject,
        text: plain,
        html,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return { ok: false, error: `RESEND_SEND_FAILED:${details || response.status}` };
    }

    return { ok: true, error: null as string | null };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'RESEND_REQUEST_FAILED' };
  }
}

async function writeDigestLog(row: Record<string, unknown>) {
  try {
    await insertWithVariants(['digest_logs'], [row]);
    return;
  } catch (error) {
    if (isDuplicateLogError(error)) {
      return;
    }
    throw error;
  }
}

function isRequestAuthorized(req: any, body: Record<string, unknown>) {
  const cronSecret = asNullableText(process.env.CRON_SECRET);
  const providedSecret =
    asNullableText(req?.headers?.['x-cron-secret'])
    || asNullableText(req?.query?.secret)
    || asNullableText((body as any)?.secret)
    || asNullableText(extractBearerToken(req));

  if (cronSecret) {
    return providedSecret === cronSecret;
  }

  const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);
  if (vercelCron) return true;
  if (asBool(req?.query?.manual, false)) return true;
  if (asBool((body as any)?.manual, false)) return true;
  return false;
}

export default async function handler(req: any, res: any) {
  try {
    if (!['GET', 'POST'].includes(req.method || '')) {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req);
    if (!isRequestAuthorized(req, body)) {
      res.status(401).json({ error: 'DIGEST_CRON_UNAUTHORIZED' });
      return;
    }

    const now = new Date();
    const force = asBool(req.query?.force ?? body.force, false);
    const appUrl = getAppUrl(req);
    const subject = 'CloseFlow - Plan dnia na dzis';
    const workspaces = await readDigestWorkspaces();

    const stats = {
      totalWorkspaces: workspaces.length,
      sent: 0,
      skippedNoEmail: 0,
      skippedNoWorkspace: 0,
      skippedDisabled: 0,
      skippedHour: 0,
      skippedDuplicate: 0,
      failed: 0,
    };

    const errors: Array<{ email: string; error: string }> = [];

    for (const row of workspaces as Record<string, unknown>[]) {
      const workspaceId = asNullableText(row.id ?? row.workspace_id ?? row.workspaceId);
      const recipientEmail = asNullableText(row.daily_digest_recipient_email ?? row.dailyDigestRecipientEmail)?.toLowerCase() || null;
      const enabled = asBool(row.daily_digest_enabled ?? row.dailyDigestEnabled, true);
      const timeZone = asNullableText(row.daily_digest_timezone ?? row.dailyDigestTimezone) || asNullableText(row.timezone) || DEFAULT_TZ;
      const digestHour = asInt(row.daily_digest_hour ?? row.dailyDigestHour, DEFAULT_DIGEST_HOUR);
      const sentForDate = getDateKey(now, timeZone);
      const workspaceName = asNullableText(row.name) || undefined;

      if (!workspaceId) {
        stats.skippedNoWorkspace += 1;
        continue;
      }
      if (!recipientEmail) {
        stats.skippedNoEmail += 1;
        continue;
      }
      if (!enabled) {
        stats.skippedDisabled += 1;
        continue;
      }
      if (!force && !shouldSendDigestNow(timeZone, now, digestHour)) {
        stats.skippedHour += 1;
        continue;
      }
      if (await alreadySentToday(recipientEmail, sentForDate)) {
        stats.skippedDuplicate += 1;
        continue;
      }

      try {
        const bundle = await loadWorkspaceBundle(workspaceId);
        const payload = buildDailyDigestPayload({
          leads: bundle.leads,
          tasks: bundle.tasks,
          events: bundle.events,
          now,
          timeZone,
        });
        const { plain, html } = buildDigestEmail({
          fullName: workspaceName,
          appUrl,
          payload,
          now,
          timeZone,
        });

        const send = await sendDigestEmail({
          to: recipientEmail,
          subject,
          plain,
          html,
        });

        const sentAtIso = new Date().toISOString();
        const status = send.ok ? 'sent' : 'error';

        await writeDigestLog({
          workspace_id: workspaceId,
          profile_id: null,
          profile_email: recipientEmail,
          sent_for_date: sentForDate,
          sent_at: sentAtIso,
          status,
          error: send.error,
          summary_json: payload.summary,
        });

        if (!send.ok) {
          stats.failed += 1;
          errors.push({ email: recipientEmail, error: send.error || 'DIGEST_SEND_FAILED' });
          continue;
        }

        stats.sent += 1;
      } catch (error: any) {
        const failureMessage = error?.message || 'DIGEST_PROFILE_FAILED';
        stats.failed += 1;
        errors.push({ email: recipientEmail, error: failureMessage });

        try {
          await writeDigestLog({
            workspace_id: workspaceId,
            profile_id: null,
            profile_email: recipientEmail,
            sent_for_date: sentForDate,
            sent_at: new Date().toISOString(),
            status: 'error',
            error: failureMessage,
            summary_json: {},
          });
        } catch {
          // skip secondary failure
        }
      }
    }

    res.status(200).json({
      ok: true,
      forced: force,
      ranAt: now.toISOString(),
      stats,
      errors: errors.slice(0, 50),
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'DAILY_DIGEST_FAILED' });
  }
}
