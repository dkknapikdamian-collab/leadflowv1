/* STAGE_A28_WEEKLY_REPORT: lekki raport tygodniowy bez dokładania ciężkiego dashboardu. */
import { buildWeeklyReportEmail, buildWeeklyReportPayload, getReportWeekRange } from './_digest.js';
import { getAppUrlFromRequest, getMailDiagnostics, sendResendEmail } from './_mail.js';
import { insertWithVariants, selectFirstAvailable, updateWhere } from './_supabase.js';
import { withWorkspaceFilter } from './_request-scope.js';

const DEFAULT_TZ = 'Europe/Warsaw';

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
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  }
  return fallback;
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

function isRequestAuthorized(req: any, body: Record<string, unknown>) {
  const cronSecret = asNullableText(process.env.CRON_SECRET);
  const providedSecret =
    asNullableText(req?.headers?.['x-cron-secret']) ||
    asNullableText(req?.query?.secret) ||
    asNullableText((body as any)?.secret) ||
    asNullableText(extractBearerToken(req));

  const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);
  if (vercelCron) return true;
  if (cronSecret) return providedSecret === cronSecret;
  if (asBool(req?.query?.manual, false)) return true;
  if (asBool((body as any)?.manual, false)) return true;
  return false;
}

function getDateKey(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function isDuplicateLogError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('23505') || message.includes('duplicate key value');
}

function getWeeklyEnabledSetting(row: Record<string, unknown>, fallback = true) {
  const explicit = row.weekly_report_enabled ?? row.weeklyReportEnabled;
  if (explicit !== undefined) return asBool(explicit, fallback);

  const dailyDigestEnabled = row.daily_digest_enabled ?? row.dailyDigestEnabled ?? row.digest_enabled ?? row.digestEnabled;
  return asBool(dailyDigestEnabled, fallback);
}

async function readWeeklyReportWorkspaces() {
  const result = await selectFirstAvailable([
    'workspaces?select=*&daily_digest_recipient_email=not.is.null&limit=2000',
    'workspaces?select=*&limit=2000',
  ]);
  return Array.isArray(result.data) ? result.data.filter((row) => row && typeof row === 'object') as Record<string, unknown>[] : [];
}

async function alreadySentWeekly(profileEmail: string, sentForDate: string) {
  try {
    const result = await selectFirstAvailable([
      `digest_logs?select=id&profile_email=eq.${encodeURIComponent(profileEmail)}&report_type=eq.weekly&sent_for_date=eq.${encodeURIComponent(sentForDate)}&limit=1`,
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

async function loadWeeklyBundle(workspaceId: string) {
  const [leadsResult, workItemsResult, casesResult] = await Promise.all([
    selectFirstAvailable([
      withWorkspaceFilter('leads?select=*&order=updated_at.desc.nullslast&limit=2000', workspaceId),
      withWorkspaceFilter('leads?select=*&order=created_at.desc.nullslast&limit=2000', workspaceId),
    ]),
    selectFirstAvailable([
      withWorkspaceFilter('work_items?select=*&order=updated_at.desc.nullslast&limit=3000', workspaceId),
      withWorkspaceFilter('work_items?select=*&order=created_at.desc.nullslast&limit=3000', workspaceId),
    ]),
    selectFirstAvailable([
      withWorkspaceFilter('cases?select=*&order=updated_at.desc.nullslast&limit=2000', workspaceId),
      withWorkspaceFilter('cases?select=*&order=created_at.desc.nullslast&limit=2000', workspaceId),
    ]),
  ]);

  let draftRows: Record<string, unknown>[] = [];
  try {
    const aiDraftsResult = await selectFirstAvailable([
      withWorkspaceFilter('ai_drafts?select=*&status=eq.draft&order=created_at.desc.nullslast&limit=200', workspaceId),
      withWorkspaceFilter('ai_drafts?select=*&order=created_at.desc.nullslast&limit=200', workspaceId),
    ]);
    draftRows = Array.isArray(aiDraftsResult.data) ? aiDraftsResult.data as Record<string, unknown>[] : [];
  } catch {
    draftRows = [];
  }

  const workItems = Array.isArray(workItemsResult.data) ? workItemsResult.data as Record<string, unknown>[] : [];

  return {
    leads: Array.isArray(leadsResult.data) ? leadsResult.data as Record<string, unknown>[] : [],
    tasks: normalizeTaskRows(workItems),
    events: normalizeEventRows(workItems),
    cases: Array.isArray(casesResult.data) ? casesResult.data as Record<string, unknown>[] : [],
    drafts: draftRows,
  };
}

async function writeDigestLog(row: Record<string, unknown>) {
  try {
    await insertWithVariants(['digest_logs'], [row]);
  } catch (error) {
    if (isDuplicateLogError(error)) return;
    throw error;
  }
}

async function updateWorkspaceLastWeeklyReportSentAt(workspaceId: string, sentAtIso: string) {
  if (!workspaceId || !sentAtIso) return;

  try {
    await updateWhere(`workspaces?id=eq.${encodeURIComponent(workspaceId)}`, { last_weekly_report_sent_at: sentAtIso });
  } catch {
    // Optional column. Raport ma być wysłany/logowany nawet bez tej kolumny.
  }
}

export default async function handler(req: any, res: any) {
  try {
    if (!['GET', 'POST'].includes(req.method || '')) {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req);
    const mode = asText((body as any)?.mode || (body as any)?.action || req?.query?.mode).toLowerCase();

    if (mode === 'workspace-diagnostics' || mode === 'weekly-report-diagnostics') {
      const workspaceId = asNullableText((body as any)?.workspaceId || req?.headers?.['x-workspace-id']);
      const requesterEmail = asNullableText(req?.headers?.['x-user-email'] || (body as any)?.requesterEmail)?.toLowerCase() || null;

      if (!workspaceId) {
        res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
        return;
      }
      if (!requesterEmail) {
        res.status(401).json({ error: 'REQUESTER_EMAIL_REQUIRED' });
        return;
      }

      const workspaceResult = await selectFirstAvailable([
        `workspaces?select=*&id=eq.${encodeURIComponent(workspaceId)}&limit=1`,
      ]);
      const workspaceRow = Array.isArray(workspaceResult.data) && workspaceResult.data[0]
        ? workspaceResult.data[0] as Record<string, unknown>
        : { id: workspaceId };
      const recipientEmail = asNullableText((body as any)?.recipientEmail || workspaceRow.daily_digest_recipient_email || workspaceRow.dailyDigestRecipientEmail || requesterEmail)?.toLowerCase() || null;
      const diagnostics = getMailDiagnostics();

      res.status(200).json({
        ok: true,
        diagnostics: true,
        canSend: Boolean(diagnostics.hasResendApiKey && diagnostics.hasFromEmail && recipientEmail && getWeeklyEnabledSetting(workspaceRow, true)),
        env: diagnostics,
        workspace: {
          id: workspaceId,
          weeklyReportEnabled: getWeeklyEnabledSetting(workspaceRow, true),
          recipientEmail,
          timeZone: asNullableText(workspaceRow.daily_digest_timezone ?? workspaceRow.dailyDigestTimezone ?? workspaceRow.timezone) || DEFAULT_TZ,
          lastWeeklyReportSentAt: asNullableText(workspaceRow.last_weekly_report_sent_at ?? workspaceRow.lastWeeklyReportSentAt),
        },
      });
      return;
    }

    if (mode === 'workspace-test' || mode === 'send-test-weekly-report') {
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
        return;
      }

      const workspaceId = asNullableText((body as any)?.workspaceId || req?.headers?.['x-workspace-id']);
      const requesterEmail = asNullableText(req?.headers?.['x-user-email'] || (body as any)?.requesterEmail)?.toLowerCase() || null;
      if (!workspaceId) {
        res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
        return;
      }
      if (!requesterEmail) {
        res.status(401).json({ error: 'REQUESTER_EMAIL_REQUIRED' });
        return;
      }

      const workspaceResult = await selectFirstAvailable([
        `workspaces?select=*&id=eq.${encodeURIComponent(workspaceId)}&limit=1`,
      ]);
      const workspaceRow = Array.isArray(workspaceResult.data) && workspaceResult.data[0]
        ? workspaceResult.data[0] as Record<string, unknown>
        : { id: workspaceId };
      const recipientEmail = asNullableText((body as any)?.recipientEmail || workspaceRow.daily_digest_recipient_email || workspaceRow.dailyDigestRecipientEmail || requesterEmail)?.toLowerCase() || null;
      const timeZone = asNullableText((body as any)?.dailyDigestTimezone || workspaceRow.daily_digest_timezone || workspaceRow.dailyDigestTimezone || workspaceRow.timezone) || DEFAULT_TZ;
      if (!recipientEmail) {
        res.status(400).json({ error: 'WEEKLY_REPORT_RECIPIENT_EMAIL_REQUIRED' });
        return;
      }

      const now = new Date();
      const appUrl = getAppUrlFromRequest(req);
      const bundle = await loadWeeklyBundle(workspaceId);
      const payload = buildWeeklyReportPayload({ ...bundle, now, timeZone });
      const { plain, html } = buildWeeklyReportEmail({
        fullName: asNullableText(workspaceRow.name) || undefined,
        appUrl,
        payload,
        now,
        timeZone,
      });
      const send = await sendResendEmail({
        to: recipientEmail,
        subject: 'CloseFlow - test raportu tygodniowego',
        plain,
        html,
      });
      const sentForDate = getReportWeekRange(now, timeZone).reportDateKey;
      await writeDigestLog({
        workspace_id: workspaceId,
        report_type: 'weekly',
        profile_id: null,
        profile_email: recipientEmail,
        sent_for_date: sentForDate,
        sent_at: new Date().toISOString(),
        status: send.ok ? 'test_sent' : 'test_error',
        error: send.error,
        summary_json: payload.summary,
      });

      if (!send.ok) {
        res.status(500).json({ ok: false, test: true, error: send.error, recipientEmail, summary: payload.summary });
        return;
      }

      res.status(200).json({ ok: true, test: true, recipientEmail, sentForDate, summary: payload.summary });
      return;
    }

    if (!isRequestAuthorized(req, body)) {
      res.status(401).json({ error: 'WEEKLY_REPORT_CRON_UNAUTHORIZED' });
      return;
    }

    const now = new Date();
    const force = asBool(req.query?.force ?? body.force, false);
    const appUrl = getAppUrlFromRequest(req);
    const workspaces = await readWeeklyReportWorkspaces();
    const stats = {
      totalWorkspaces: workspaces.length,
      sent: 0,
      skippedNoEmail: 0,
      skippedNoWorkspace: 0,
      skippedDisabled: 0,
      skippedDuplicate: 0,
      failed: 0,
    };
    const errors: Array<{ email: string; error: string }> = [];

    for (const row of workspaces) {
      const workspaceId = asNullableText(row.id ?? row.workspace_id ?? row.workspaceId);
      const recipientEmail = asNullableText(row.daily_digest_recipient_email ?? row.dailyDigestRecipientEmail)?.toLowerCase() || null;
      const timeZone = asNullableText(row.daily_digest_timezone ?? row.dailyDigestTimezone ?? row.timezone) || DEFAULT_TZ;
      const sentForDate = getReportWeekRange(now, timeZone).reportDateKey;
      const enabled = getWeeklyEnabledSetting(row, true);

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
      if (!force && await alreadySentWeekly(recipientEmail, sentForDate)) {
        stats.skippedDuplicate += 1;
        continue;
      }

      try {
        const bundle = await loadWeeklyBundle(workspaceId);
        const payload = buildWeeklyReportPayload({ ...bundle, now, timeZone });
        const { plain, html } = buildWeeklyReportEmail({
          fullName: asNullableText(row.name) || undefined,
          appUrl,
          payload,
          now,
          timeZone,
        });
        const send = await sendResendEmail({
          to: recipientEmail,
          subject: 'CloseFlow - Raport tygodniowy',
          plain,
          html,
        });
        const sentAtIso = new Date().toISOString();
        const status = send.ok ? 'sent' : 'error';

        await writeDigestLog({
          workspace_id: workspaceId,
          report_type: 'weekly',
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
          errors.push({ email: recipientEmail, error: send.error || 'WEEKLY_REPORT_SEND_FAILED' });
          continue;
        }

        await updateWorkspaceLastWeeklyReportSentAt(workspaceId, sentAtIso);
        stats.sent += 1;
      } catch (error: any) {
        const failureMessage = error?.message || 'WEEKLY_REPORT_WORKSPACE_FAILED';
        stats.failed += 1;
        errors.push({ email: recipientEmail, error: failureMessage });
        try {
          await writeDigestLog({
            workspace_id: workspaceId,
            report_type: 'weekly',
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
    res.status(500).json({ error: error?.message || 'WEEKLY_REPORT_FAILED' });
  }
}
