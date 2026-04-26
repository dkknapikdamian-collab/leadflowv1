import { findWorkspaceId, insertWithVariants, selectFirstAvailable, supabaseRequest, updateById, updateWhere } from '../src/server/_supabase.js';
import { getRequestIdentity, asText } from '../src/server/_request-scope.js';
import serviceProfilesHandler from '../src/server/service-profiles.js';
import aiConfigHandler from '../src/server/ai-config.js';

function parseBody(body: unknown) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return body as Record<string, unknown>;
}

function asNullableString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function routeKind(req: any, body: Record<string, unknown>) {
  const raw = req?.query?.kind ?? body.kind ?? '';
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  }
  return fallback;
}

function asHour(value: unknown, fallback = 7) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(23, Math.floor(parsed)));
}

function normalizePlanId(value: unknown, subscriptionStatus?: unknown) {
  const normalized = asNullableString(value);
  const status = asNullableString(subscriptionStatus) || 'inactive';

  if (!normalized) {
    return status === 'paid_active' ? 'closeflow_pro' : 'trial_14d';
  }

  if (normalized === 'trial_14d' || normalized === 'closeflow_pro') {
    return normalized;
  }

  if (['solo_mini', 'solo_full', 'team_mini', 'team_full', 'pro'].includes(normalized)) {
    return 'closeflow_pro';
  }

  if (normalized === 'free') {
    return 'trial_14d';
  }

  return status === 'paid_active' ? 'closeflow_pro' : normalized;
}

function toIso(value: unknown) {
  const normalized = asNullableString(value);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  if (match?.[1]) return match[1];
  const altMatch = message.match(/column \"([^\"]+)\" does not exist/i);
  return altMatch?.[1] || null;
}

async function safeUpdateById(table: string, id: string, payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await updateById(table, id, currentPayload);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !(missingColumn in currentPayload)) throw error;
      delete currentPayload[missingColumn];
    }
  }
  throw new Error('SAFE_UPDATE_BY_ID_EXHAUSTED');
}

async function safeUpdateWhere(path: string, payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await updateWhere(path, currentPayload);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !(missingColumn in currentPayload)) throw error;
      delete currentPayload[missingColumn];
    }
  }
  throw new Error('SAFE_UPDATE_WHERE_EXHAUSTED');
}

async function safeInsert(table: string, payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await insertWithVariants([table], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !(missingColumn in currentPayload)) throw error;
      delete currentPayload[missingColumn];
    }
  }
  throw new Error('SAFE_INSERT_EXHAUSTED');
}

async function findProfileRow(identity: { userId?: string; email?: string }) {
  const queries: string[] = [];
  const userId = asNullableString(identity.userId || null);
  const email = asNullableString(identity.email || null);

  if (email) {
    queries.push(`profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1`);
  }
  if (userId) {
    queries.push(`profiles?firebase_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
    queries.push(`profiles?auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
    queries.push(`profiles?external_auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
    if (isUuid(userId)) queries.push(`profiles?id=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
  }

  for (const query of queries) {
    const rows = await safeSelect(query);
    if (rows[0]) return rows[0];
  }
  return null;
}

async function ensureProfileRow(identity: { userId?: string; email?: string; fullName?: string; workspaceId?: string | null }) {
  const nowIso = new Date().toISOString();
  const existing = await findProfileRow(identity);
  const normalizedUserId = asNullableString(identity.userId || null);

  if (existing) return existing;

  const payload: Record<string, unknown> = {
    id: crypto.randomUUID(),
    email: asNullableString(identity.email || null) || '',
    full_name: asNullableString(identity.fullName || null) || '',
    company_name: '',
    workspace_id: asNullableString(identity.workspaceId || null),
    role: 'member',
    is_admin: false,
    appearance_skin: 'classic-light',
    planning_conflict_warnings_enabled: true,
    browser_notifications_enabled: true,
    force_logout_after: null,
    created_at: nowIso,
    updated_at: nowIso,
    firebase_uid: normalizedUserId,
    auth_uid: normalizedUserId,
    external_auth_uid: normalizedUserId,
  };
  const inserted = await safeInsert('profiles', payload);
  return Array.isArray(inserted.data) && inserted.data[0] ? inserted.data[0] : payload;
}

async function handleProfileSettings(req: any, res: any) {
  try {
    if (req.method !== 'PATCH') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req.body);
    const identity = getRequestIdentity(req, body);
    if (!asNullableString(identity.userId || null) && !asNullableString(identity.email || null)) {
      res.status(401).json({ error: 'PROFILE_IDENTITY_REQUIRED' });
      return;
    }

    const workspaceId = (await findWorkspaceId((body as any).workspaceId)) || asNullableString((body as any).workspaceId) || null;
    const row = await ensureProfileRow({
      userId: identity.userId,
      email: identity.email,
      fullName: identity.fullName,
      workspaceId,
    });

    const id = asNullableString((row as any).id);
    const profileSettingsMatchQueries = uniqueStrings([
      id ? `profiles?id=eq.${encodeURIComponent(id)}` : null,
      identity.userId ? `profiles?firebase_uid=eq.${encodeURIComponent(identity.userId)}` : null,
      identity.userId ? `profiles?auth_uid=eq.${encodeURIComponent(identity.userId)}` : null,
      identity.userId ? `profiles?external_auth_uid=eq.${encodeURIComponent(identity.userId)}` : null,
      identity.email ? `profiles?email=eq.${encodeURIComponent(identity.email)}` : null,
    ]);
    // PROFILE_SETTINGS_MATCH_QUERIES_V2: row id is optional because some Supabase profile schemas do not expose id.

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if ((body as any).fullName !== undefined) payload.full_name = asNullableString((body as any).fullName) || '';
    if ((body as any).companyName !== undefined) payload.company_name = asNullableString((body as any).companyName) || '';
    if ((body as any).email !== undefined) payload.email = asNullableString((body as any).email) || '';
    if ((body as any).appearanceSkin !== undefined) payload.appearance_skin = asNullableString((body as any).appearanceSkin) || 'classic-light';
    if ((body as any).planningConflictWarningsEnabled !== undefined) payload.planning_conflict_warnings_enabled = asBoolean((body as any).planningConflictWarningsEnabled, true);
    if ((body as any).browserNotificationsEnabled !== undefined) payload.browser_notifications_enabled = asBoolean((body as any).browserNotificationsEnabled, true);
    if ((body as any).forceLogoutAfter !== undefined) payload.force_logout_after = toIso((body as any).forceLogoutAfter);
    if ((body as any).workspaceId !== undefined) payload.workspace_id = workspaceId;

    let updated: unknown = null;

    if (id) {
      updated = await safeUpdateById('profiles', id, payload);
    } else {
      let lastUpdateError: unknown = null;
      for (const query of profileSettingsMatchQueries) {
        try {
          updated = await safeUpdateWhere(query, payload);
          break;
        } catch (error) {
          lastUpdateError = error;
        }
      }

      if (!updated) {
        throw lastUpdateError || new Error('PROFILE_SETTINGS_MATCH_NOT_FOUND');
      }
    }

    const nextRow = Array.isArray(updated) && updated[0] ? updated[0] : { ...row, ...payload, id };
    const responseProfileId = id || asNullableString((nextRow as any).id) || identity.userId || identity.email || '';

    res.status(200).json({
      ok: true,
      profile: {
        id: responseProfileId,
        fullName: (nextRow as any).full_name ?? (body as any).fullName ?? '',
        companyName: (nextRow as any).company_name ?? (body as any).companyName ?? '',
        email: (nextRow as any).email ?? (body as any).email ?? identity.email ?? '',
        appearanceSkin: (nextRow as any).appearance_skin ?? (body as any).appearanceSkin ?? 'classic-light',
        planningConflictWarningsEnabled: Boolean((nextRow as any).planning_conflict_warnings_enabled ?? (body as any).planningConflictWarningsEnabled ?? true),
        browserNotificationsEnabled: Boolean((nextRow as any).browser_notifications_enabled ?? (body as any).browserNotificationsEnabled ?? true),
        forceLogoutAfter: (nextRow as any).force_logout_after ?? (body as any).forceLogoutAfter ?? null,
        workspaceId: (nextRow as any).workspace_id ?? workspaceId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'PROFILE_SETTINGS_UPDATE_FAILED' });
  }
}

async function handleWorkspaceSettings(req: any, res: any) {
  try {
    if (req.method !== 'PATCH') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req.body);
    const workspaceId = (await findWorkspaceId((body as any).workspaceId)) || asNullableString((body as any).workspaceId);
    if (!workspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED' });
      return;
    }

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if ((body as any).planId !== undefined) payload.plan_id = normalizePlanId((body as any).planId, (body as any).subscriptionStatus);
    if ((body as any).subscriptionStatus !== undefined) payload.subscription_status = (body as any).subscriptionStatus;
    if ((body as any).trialEndsAt !== undefined) payload.trial_ends_at = toIso((body as any).trialEndsAt);
    if ((body as any).billingProvider !== undefined) payload.billing_provider = asNullableString((body as any).billingProvider) || 'manual';
    if ((body as any).providerCustomerId !== undefined) payload.provider_customer_id = asNullableString((body as any).providerCustomerId);
    if ((body as any).providerSubscriptionId !== undefined) payload.provider_subscription_id = asNullableString((body as any).providerSubscriptionId);
    if ((body as any).nextBillingAt !== undefined) payload.next_billing_at = toIso((body as any).nextBillingAt);
    if ((body as any).cancelAtPeriodEnd !== undefined) payload.cancel_at_period_end = asBoolean((body as any).cancelAtPeriodEnd, false);
    if ((body as any).dailyDigestEnabled !== undefined) payload.daily_digest_enabled = asBoolean((body as any).dailyDigestEnabled, true);
    if ((body as any).dailyDigestHour !== undefined) payload.daily_digest_hour = asHour((body as any).dailyDigestHour, 7);
    if ((body as any).dailyDigestTimezone !== undefined) payload.daily_digest_timezone = asNullableString((body as any).dailyDigestTimezone) || 'Europe/Warsaw';
    if ((body as any).dailyDigestRecipientEmail !== undefined) payload.daily_digest_recipient_email = asNullableString((body as any).dailyDigestRecipientEmail);
    if ((body as any).timezone !== undefined) payload.timezone = asNullableString((body as any).timezone) || 'Europe/Warsaw';

    const updated = await safeUpdateById('workspaces', String(workspaceId), payload);
    const row = Array.isArray(updated) && updated[0] ? updated[0] : { ...payload, id: workspaceId };

    res.status(200).json({
      ok: true,
      workspace: {
        id: workspaceId,
        planId: normalizePlanId((row as any)?.plan_id ?? (body as any).planId ?? null, (row as any)?.subscription_status ?? (body as any).subscriptionStatus ?? null),
        subscriptionStatus: (row as any)?.subscription_status ?? (body as any).subscriptionStatus ?? null,
        trialEndsAt: (row as any)?.trial_ends_at ?? (body as any).trialEndsAt ?? null,
        billingProvider: (row as any)?.billing_provider ?? (body as any).billingProvider ?? 'manual',
        providerCustomerId: (row as any)?.provider_customer_id ?? (body as any).providerCustomerId ?? null,
        providerSubscriptionId: (row as any)?.provider_subscription_id ?? (body as any).providerSubscriptionId ?? null,
        nextBillingAt: (row as any)?.next_billing_at ?? (body as any).nextBillingAt ?? null,
        cancelAtPeriodEnd: Boolean((row as any)?.cancel_at_period_end ?? (body as any).cancelAtPeriodEnd ?? false),
        dailyDigestEnabled: Boolean((row as any)?.daily_digest_enabled ?? (body as any).dailyDigestEnabled ?? true),
        dailyDigestHour: Number((row as any)?.daily_digest_hour ?? (body as any).dailyDigestHour ?? 7),
        dailyDigestTimezone: (row as any)?.daily_digest_timezone ?? (body as any).dailyDigestTimezone ?? 'Europe/Warsaw',
        dailyDigestRecipientEmail: (row as any)?.daily_digest_recipient_email ?? (body as any).dailyDigestRecipientEmail ?? null,
        timezone: (row as any)?.timezone ?? (body as any).timezone ?? 'Europe/Warsaw',
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'WORKSPACE_SETTINGS_UPDATE_FAILED' });
  }
}

// --- workspace-subscription (PATCH)
async function handleWorkspaceSubscription(req: any, res: any) {
  await handleWorkspaceSettings(req, res);
}

// --- client-portal-tokens (GET/POST)
function createToken() {
  return `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

async function bestEffortPatchCase(caseId: string) {
  try {
    await supabaseRequest(`cases?id=eq.${encodeURIComponent(caseId)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        portal_ready: true,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // best effort only
  }
}

async function handleClientPortalTokens(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const caseId = String(req.query?.caseId || '').trim();
      const token = String(req.query?.token || '').trim();

      if (!caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      const path = token
        ? `client_portal_tokens?select=*&case_id=eq.${encodeURIComponent(caseId)}&token=eq.${encodeURIComponent(token)}&order=created_at.desc&limit=1`
        : `client_portal_tokens?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=created_at.desc&limit=1`;

      const result = await selectFirstAvailable([path]);
      const rows = result.data as Record<string, unknown>[];
      const row = rows[0] || null;

      if (!row) {
        res.status(token ? 404 : 200).json(token ? { error: 'PORTAL_TOKEN_NOT_FOUND' } : {});
        return;
      }

      res.status(200).json({
        id: String((row as any).id || crypto.randomUUID()),
        caseId: String((row as any).case_id || caseId),
        token: String((row as any).token || ''),
        createdAt: (row as any).created_at || null,
        isValid: token ? true : undefined,
      });
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const caseId = String(body.caseId || '').trim();
      if (!caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      await supabaseRequest(`client_portal_tokens?case_id=eq.${encodeURIComponent(caseId)}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=representation' },
      });

      const nowIso = new Date().toISOString();
      const payload = {
        case_id: caseId,
        token: createToken(),
        created_at: nowIso,
      };

      const result = await insertWithVariants(['client_portal_tokens'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;

      await bestEffortPatchCase(caseId);

      res.status(200).json({
        id: String((inserted as any).id || crypto.randomUUID()),
        caseId,
        token: String((inserted as any).token || payload.token),
        createdAt: (inserted as any).created_at || nowIso,
      });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'CLIENT_PORTAL_TOKEN_API_FAILED' });
  }
}

// --- workspace-recovery (admin)
const DEFAULT_ADMIN_EMAILS = ['dk.knapikdamian@gmail.com'];

function parseJsonBody(req: any) {
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

function getAdminEmails() {
  const envRaw = asNullableString(process.env.ADMIN_EMAILS || '');
  if (!envRaw) return new Set(DEFAULT_ADMIN_EMAILS);
  return new Set(
    envRaw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function parseTimestamp(value: unknown) {
  const normalized = asNullableString(value);
  if (!normalized) return 0;
  const parsed = new Date(normalized).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function safeArray(data: unknown) {
  return Array.isArray(data) ? data.filter((row) => row && typeof row === 'object') as Record<string, unknown>[] : [];
}

async function safeSelect(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return safeArray(result.data);
  } catch {
    return [];
  }
}

async function ensureAdmin(req: any, body: Record<string, unknown>) {
  const identity = getRequestIdentity(req, body);
  const requesterEmail = asText(identity.email).toLowerCase();
  const allowlist = getAdminEmails();
  const configuredSecret = asNullableString(process.env.ADMIN_API_SECRET);
  const providedSecret = asNullableString(
    req?.headers?.['x-admin-secret']
      || req?.query?.adminSecret
      || (body as Record<string, unknown>)?.adminSecret,
  );

  if (configuredSecret && configuredSecret !== providedSecret) {
    return { ok: false, error: 'ADMIN_SECRET_REQUIRED' };
  }

  if (requesterEmail && allowlist.has(requesterEmail)) {
    return { ok: true, requesterEmail };
  }

  if (!requesterEmail) {
    return { ok: false, error: 'ADMIN_EMAIL_REQUIRED' };
  }

  const profileRows = await safeSelect(`profiles?email=eq.${encodeURIComponent(requesterEmail)}&select=*&limit=1`);
  const profile = profileRows[0] || null;
  const isAdmin = Boolean((profile as any)?.is_admin ?? (profile as any)?.isAdmin) || String((profile as any)?.role || '').toLowerCase() === 'admin';
  if (!isAdmin) return { ok: false, error: 'ADMIN_FORBIDDEN' };
  return { ok: true, requesterEmail };
}

function uniqueStrings(values: unknown[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const normalized = asNullableString(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

function isUuid(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function uniqueUuidStrings(values: unknown[]) {
  return uniqueStrings(values).filter((item) => isUuid(item));
}

function getWorkspaceIdFromRow(row: Record<string, unknown>) {
  const workspaceId = asNullableString((row as any).workspace_id ?? (row as any).workspaceId);
  return workspaceId || null;
}

type WorkspaceMetrics = {
  workspaceId: string;
  leadsCount: number;
  tasksCount: number;
  eventsCount: number;
  casesCount: number;
  totalCount: number;
  lastActivityAt: string | null;
  score: number;
};

function buildWorkspaceMetrics({
  workspaceRows,
  leadRows,
  workItemRows,
  caseRows,
}: {
  workspaceRows: Record<string, unknown>[];
  leadRows: Record<string, unknown>[];
  workItemRows: Record<string, unknown>[];
  caseRows: Record<string, unknown>[];
}) {
  const map = new Map<string, WorkspaceMetrics>();

  const ensureWorkspace = (workspaceId: string) => {
    if (!map.has(workspaceId)) {
      map.set(workspaceId, {
        workspaceId,
        leadsCount: 0,
        tasksCount: 0,
        eventsCount: 0,
        casesCount: 0,
        totalCount: 0,
        lastActivityAt: null,
        score: 0,
      });
    }
    return map.get(workspaceId)!;
  };

  for (const row of workspaceRows) {
    const workspaceId = asNullableString((row as any).id);
    if (workspaceId) ensureWorkspace(workspaceId);
  }

  const touchLastActivity = (target: WorkspaceMetrics, candidate: unknown) => {
    const candidateIso = asNullableString(candidate);
    if (!candidateIso) return;
    if (!target.lastActivityAt || parseTimestamp(candidateIso) > parseTimestamp(target.lastActivityAt)) {
      target.lastActivityAt = candidateIso;
    }
  };

  for (const row of leadRows) {
    const workspaceId = getWorkspaceIdFromRow(row);
    if (!workspaceId) continue;
    const metrics = ensureWorkspace(workspaceId);
    metrics.leadsCount += 1;
    metrics.totalCount += 1;
    touchLastActivity(metrics, (row as any).updated_at ?? (row as any).updatedAt ?? (row as any).created_at);
  }

  for (const row of workItemRows) {
    const workspaceId = getWorkspaceIdFromRow(row);
    if (!workspaceId) continue;
    const metrics = ensureWorkspace(workspaceId);
    metrics.totalCount += 1;
    const recordType = asNullableString((row as any).record_type ?? (row as any).recordType);
    if (recordType === 'task') metrics.tasksCount += 1;
    else if (recordType === 'event') metrics.eventsCount += 1;
    touchLastActivity(metrics, (row as any).updated_at ?? (row as any).updatedAt ?? (row as any).created_at);
  }

  for (const row of caseRows) {
    const workspaceId = getWorkspaceIdFromRow(row);
    if (!workspaceId) continue;
    const metrics = ensureWorkspace(workspaceId);
    metrics.casesCount += 1;
    metrics.totalCount += 1;
    touchLastActivity(metrics, (row as any).updated_at ?? (row as any).updatedAt ?? (row as any).created_at);
  }

  for (const metrics of map.values()) {
    metrics.score = metrics.totalCount + (metrics.casesCount * 2) + (metrics.leadsCount * 2) + metrics.tasksCount + metrics.eventsCount;
  }

  return [...map.values()].sort((a, b) => b.score - a.score);
}

async function collectCandidateWorkspaceIds({
  targetProfileRow,
  targetUid,
  targetEmail,
}: {
  targetProfileRow: Record<string, unknown>;
  targetUid: string | null;
  targetEmail: string | null;
}) {
  const candidates: unknown[] = [
    (targetProfileRow as any).workspace_id,
    (targetProfileRow as any).workspaceId,
    (targetProfileRow as any).legacy_workspace_id,
    (targetProfileRow as any).legacyWorkspaceId,
  ];

  if (targetUid) {
    candidates.push((targetProfileRow as any).firebase_uid, (targetProfileRow as any).auth_uid, (targetProfileRow as any).external_auth_uid);
  }

  if (targetEmail) {
    candidates.push(targetEmail);
  }

  const workspaceRows = await safeSelect('workspaces?select=id&limit=2000');
  for (const row of workspaceRows) candidates.push((row as any).id);

  return uniqueUuidStrings(candidates);
}

async function buildMetricsForCandidates(candidateWorkspaceIds: string[]) {
  const workspaceRows = candidateWorkspaceIds.length
    ? await safeSelect(`workspaces?select=*&id=in.(${candidateWorkspaceIds.map((id) => `"${id}"`).join(',')})&limit=2000`)
    : await safeSelect('workspaces?select=*&limit=2000');
  const leadRows = await safeSelect('leads?select=workspace_id,updated_at,created_at&limit=2000');
  const workItemRows = await safeSelect('work_items?select=workspace_id,record_type,updated_at,created_at&limit=2000');
  const caseRows = await safeSelect('cases?select=workspace_id,updated_at,created_at&limit=2000');
  return buildWorkspaceMetrics({ workspaceRows, leadRows, workItemRows, caseRows });
}

async function findTargetProfile(targetEmail: string | null, targetUid: string | null) {
  const queries: string[] = [];
  if (targetUid) {
    queries.push(
      `profiles?firebase_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1`,
      `profiles?auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1`,
      `profiles?external_auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1`,
    );
  }
  if (targetEmail) queries.push(`profiles?email=eq.${encodeURIComponent(targetEmail)}&select=*&limit=1`);
  for (const query of queries) {
    const rows = await safeSelect(query);
    if (rows[0]) return rows[0];
  }
  return null;
}

async function writeRecoveryLog({
  actorEmail,
  targetProfile,
  targetEmail,
  fromWorkspaceId,
  toWorkspaceId,
  reason,
  payload,
}: {
  actorEmail: string;
  targetProfile: string;
  targetEmail: string | null;
  fromWorkspaceId: string | null;
  toWorkspaceId: string | null;
  reason: string;
  payload?: Record<string, unknown>;
}) {
  try {
    await insertWithVariants(['workspace_recovery_logs'], [{
      actor_email: actorEmail,
      target_profile: targetProfile,
      target_email: targetEmail,
      from_workspace_id: fromWorkspaceId,
      to_workspace_id: toWorkspaceId,
      reason,
      payload: payload || {},
      applied_at: new Date().toISOString(),
    }]);
  } catch {
    // best effort audit log
  }
}

async function handleWorkspaceRecovery(req: any, res: any) {
  try {
    const body = parseJsonBody(req);
    const admin = await ensureAdmin(req, body);
    if (!admin.ok) {
      res.status(403).json({ error: (admin as any).error || 'ADMIN_FORBIDDEN' });
      return;
    }

    const mode = asText(req.query?.mode || (body as any).mode || 'dry-run').toLowerCase();
    const targetEmail = asNullableString(req.query?.targetEmail || (body as any).targetEmail || null);
    const targetUid = asNullableString(req.query?.targetUid || (body as any).targetUid || null);
    const explicitWorkspaceId = asNullableString(req.query?.workspaceId || (body as any).workspaceId || null);
    const reason = asText((body as any).reason || req.query?.reason || 'manual_recovery');
    const identity = getRequestIdentity(req, body);
    const fallbackEmail = asNullableString(identity.email || null);

    const effectiveEmail = targetEmail || fallbackEmail;
    const targetProfileRow = await findTargetProfile(effectiveEmail, targetUid);
    if (!targetProfileRow) {
      res.status(404).json({ error: 'TARGET_PROFILE_NOT_FOUND' });
      return;
    }

    const targetProfileId = asText(
      (targetProfileRow as any).id
      || (targetProfileRow as any).firebase_uid
      || (targetProfileRow as any).auth_uid
      || (targetProfileRow as any).external_auth_uid,
    );
    const targetProfileEmail = asNullableString((targetProfileRow as any).email || effectiveEmail || null);
    const currentWorkspaceId = asNullableString((targetProfileRow as any).workspace_id ?? (targetProfileRow as any).workspaceId ?? null);

    const candidateWorkspaceIds = await collectCandidateWorkspaceIds({
      targetProfileRow,
      targetUid,
      targetEmail: targetProfileEmail,
    });
    const metrics = await buildMetricsForCandidates(candidateWorkspaceIds);

    const recommendedWorkspaceId =
      explicitWorkspaceId
      || (metrics[0] ? metrics[0].workspaceId : null)
      || currentWorkspaceId
      || null;

    if (mode !== 'apply') {
      res.status(200).json({
        mode: 'dry-run',
        targetProfile: {
          id: targetProfileId,
          email: targetProfileEmail,
          currentWorkspaceId,
        },
        candidateWorkspaceIds,
        recommendedWorkspaceId,
        candidates: metrics.slice(0, 25),
      });
      return;
    }

    if (!recommendedWorkspaceId) {
      res.status(400).json({ error: 'WORKSPACE_ID_REQUIRED_FOR_APPLY' });
      return;
    }

    const updatePayload = {
      workspace_id: recommendedWorkspaceId,
      updated_at: new Date().toISOString(),
    };

    let updated = null;
    const matchQueries = [
      targetProfileId ? `profiles?id=eq.${encodeURIComponent(targetProfileId)}` : null,
      targetProfileEmail ? `profiles?email=eq.${encodeURIComponent(targetProfileEmail)}` : null,
      targetUid ? `profiles?firebase_uid=eq.${encodeURIComponent(targetUid)}` : null,
      targetUid ? `profiles?auth_uid=eq.${encodeURIComponent(targetUid)}` : null,
      targetUid ? `profiles?external_auth_uid=eq.${encodeURIComponent(targetUid)}` : null,
    ].filter(Boolean) as string[];

    for (const query of matchQueries) {
      try {
        const rows = await updateWhere(query, updatePayload);
        const first = Array.isArray(rows) && rows[0] ? rows[0] : null;
        if (first) {
          updated = first;
          break;
        }
      } catch {
        // try next matcher
      }
    }

    if (!updated) {
      res.status(500).json({ error: 'PROFILE_UPDATE_FAILED' });
      return;
    }

    await writeRecoveryLog({
      actorEmail: (admin as any).requesterEmail || 'admin',
      targetProfile: targetProfileId || targetProfileEmail || 'unknown',
      targetEmail: targetProfileEmail,
      fromWorkspaceId: currentWorkspaceId,
      toWorkspaceId: recommendedWorkspaceId,
      reason: reason || 'manual_recovery',
      payload: { mode: 'apply' },
    });

    res.status(200).json({
      ok: true,
      targetProfile: {
        id: targetProfileId,
        email: targetProfileEmail,
      },
      fromWorkspaceId: currentWorkspaceId,
      toWorkspaceId: recommendedWorkspaceId,
      reason: reason || 'manual_recovery',
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'WORKSPACE_RECOVERY_FAILED' });
  }
}

export default async function handler(req: any, res: any) {
  const body = parseBody(req.body);
  const kind = routeKind(req, body);

  if (kind === 'ai-config') {
    await aiConfigHandler(req, res);
    return;
  }


      if (kind === 'service-profiles') {
      return serviceProfilesHandler(req, res);
    }
if (kind === 'workspace-subscription') {
    await handleWorkspaceSubscription(req, res);
    return;
  }

  if (kind === 'profile-settings') {
    await handleProfileSettings(req, res);
    return;
  }

  if (kind === 'workspace-settings') {
    await handleWorkspaceSettings(req, res);
    return;
  }

  if (kind === 'client-portal-tokens') {
    await handleClientPortalTokens(req, res);
    return;
  }

  if (kind === 'workspace-recovery') {
    await handleWorkspaceRecovery(req, res);
    return;
  }

  res.status(400).json({ error: 'SYSTEM_KIND_REQUIRED' });
}
