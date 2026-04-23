import { getRequestIdentity, asText } from '../_request-scope.js';
import { insertWithVariants, selectFirstAvailable, updateWhere } from '../_supabase.js';

const DEFAULT_ADMIN_EMAILS = ['dk.knapikdamian@gmail.com'];

function asNullableString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

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
  const isAdmin = Boolean(profile?.is_admin ?? profile?.isAdmin) || String(profile?.role || '').toLowerCase() === 'admin';
  if (!isAdmin) return { ok: false, error: 'ADMIN_FORBIDDEN' };
  return { ok: true, requesterEmail };
}

function getWorkspaceIdFromRow(row: Record<string, unknown>) {
  const workspaceId = asNullableString(row.workspace_id ?? row.workspaceId);
  return workspaceId || null;
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
    const workspaceId = asNullableString(row.id);
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
    const target = ensureWorkspace(workspaceId);
    target.leadsCount += 1;
    touchLastActivity(target, row.updated_at ?? row.updatedAt ?? row.created_at);
  }

  for (const row of workItemRows) {
    const workspaceId = getWorkspaceIdFromRow(row);
    if (!workspaceId) continue;
    const target = ensureWorkspace(workspaceId);
    const recordType = String(row.record_type || row.recordType || '').toLowerCase();
    const isTask = recordType === 'task' || row.show_in_tasks === true || row.showInTasks === true;
    const isEvent = recordType === 'event' || row.show_in_calendar === true || row.showInCalendar === true;
    if (isTask) target.tasksCount += 1;
    if (isEvent) target.eventsCount += 1;
    touchLastActivity(target, row.updated_at ?? row.updatedAt ?? row.created_at);
  }

  for (const row of caseRows) {
    const workspaceId = getWorkspaceIdFromRow(row);
    if (!workspaceId) continue;
    const target = ensureWorkspace(workspaceId);
    target.casesCount += 1;
    touchLastActivity(target, row.updated_at ?? row.updatedAt ?? row.created_at);
  }

  const metrics = [...map.values()].map((item) => {
    const totalCount = item.leadsCount + item.tasksCount + item.eventsCount + item.casesCount;
    const score =
      (item.leadsCount * 4)
      + (item.tasksCount * 2)
      + (item.eventsCount * 2)
      + (item.casesCount * 3)
      + Math.floor(parseTimestamp(item.lastActivityAt) / 1000_000);
    return { ...item, totalCount, score };
  });

  metrics.sort((a, b) => b.score - a.score);
  return metrics;
}

async function findTargetProfile(targetEmail: string | null, targetUid: string | null) {
  const queries: string[] = [];

  if (targetEmail) {
    queries.push(`profiles?email=eq.${encodeURIComponent(targetEmail)}&select=*&limit=1`);
  }
  if (targetUid) {
    queries.push(`profiles?firebase_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1`);
    queries.push(`profiles?auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1`);
    queries.push(`profiles?external_auth_uid=eq.${encodeURIComponent(targetUid)}&select=*&limit=1`);
  }

  for (const query of queries) {
    const rows = await safeSelect(query);
    if (rows[0]) return rows[0];
  }

  return null;
}

function getTargetIdentityCandidates(targetProfileRow: Record<string, unknown> | null, targetUid: string | null) {
  const uuids = uniqueUuidStrings([
    targetProfileRow?.id,
    targetProfileRow?.firebase_uid,
    targetProfileRow?.firebaseUid,
    targetProfileRow?.auth_uid,
    targetProfileRow?.authUid,
    targetProfileRow?.external_auth_uid,
    targetProfileRow?.externalAuthUid,
    targetUid,
  ]);

  const raw = uniqueStrings([
    targetProfileRow?.id,
    targetProfileRow?.firebase_uid,
    targetProfileRow?.firebaseUid,
    targetProfileRow?.auth_uid,
    targetProfileRow?.authUid,
    targetProfileRow?.external_auth_uid,
    targetProfileRow?.externalAuthUid,
    targetUid,
    targetProfileRow?.email,
  ]);

  return { uuids, raw };
}

async function collectCandidateWorkspaceIds({
  targetProfileRow,
  targetUid,
  targetEmail,
}: {
  targetProfileRow: Record<string, unknown> | null;
  targetUid: string | null;
  targetEmail: string | null;
}) {
  const candidates = new Set<string>();
  const profileWorkspaceId = asNullableString(targetProfileRow?.workspace_id ?? targetProfileRow?.workspaceId ?? null);
  if (profileWorkspaceId) candidates.add(profileWorkspaceId);

  if (targetEmail) {
    const byEmailRows = await safeSelect(`profiles?email=eq.${encodeURIComponent(targetEmail)}&select=workspace_id&limit=200`);
    for (const row of byEmailRows) {
      const workspaceId = asNullableString(row.workspace_id ?? row.workspaceId);
      if (workspaceId) candidates.add(workspaceId);
    }
  }

  const identity = getTargetIdentityCandidates(targetProfileRow, targetUid);

  for (const actorId of identity.uuids) {
    const [ownerRows, ownerAltRows, creatorRows, memberRows, leadRows, itemRows, caseRows] = await Promise.all([
      safeSelect(`workspaces?owner_user_id=eq.${encodeURIComponent(actorId)}&select=id&limit=200`),
      safeSelect(`workspaces?owner_id=eq.${encodeURIComponent(actorId)}&select=id&limit=200`),
      safeSelect(`workspaces?created_by_user_id=eq.${encodeURIComponent(actorId)}&select=id&limit=200`),
      safeSelect(`workspace_members?user_id=eq.${encodeURIComponent(actorId)}&select=workspace_id&limit=500`),
      safeSelect(`leads?created_by_user_id=eq.${encodeURIComponent(actorId)}&select=workspace_id&limit=5000`),
      safeSelect(`work_items?created_by_user_id=eq.${encodeURIComponent(actorId)}&select=workspace_id&limit=5000`),
      safeSelect(`cases?created_by_user_id=eq.${encodeURIComponent(actorId)}&select=workspace_id&limit=5000`),
    ]);

    for (const row of ownerRows) {
      const id = asNullableString(row.id);
      if (id) candidates.add(id);
    }
    for (const row of ownerAltRows) {
      const id = asNullableString(row.id);
      if (id) candidates.add(id);
    }
    for (const row of creatorRows) {
      const id = asNullableString(row.id);
      if (id) candidates.add(id);
    }
    for (const row of [...memberRows, ...leadRows, ...itemRows, ...caseRows]) {
      const workspaceId = asNullableString(row.workspace_id ?? row.workspaceId);
      if (workspaceId) candidates.add(workspaceId);
    }
  }

  return [...candidates];
}

async function buildMetricsForCandidates(candidateWorkspaceIds: string[]) {
  if (!candidateWorkspaceIds.length) return [];

  const workspaceRows = (
    await Promise.all(
      candidateWorkspaceIds.map((workspaceId) =>
        safeSelect(`workspaces?id=eq.${encodeURIComponent(workspaceId)}&select=id&limit=1`),
      ),
    )
  ).flat();

  const leadsByWorkspace = (
    await Promise.all(
      candidateWorkspaceIds.map((workspaceId) =>
        safeSelect(
          `leads?workspace_id=eq.${encodeURIComponent(workspaceId)}&select=workspace_id,updated_at,created_at&limit=5000`,
        ),
      ),
    )
  ).flat();

  const itemsByWorkspace = (
    await Promise.all(
      candidateWorkspaceIds.map((workspaceId) =>
        safeSelect(
          `work_items?workspace_id=eq.${encodeURIComponent(workspaceId)}&select=workspace_id,record_type,show_in_tasks,show_in_calendar,updated_at,created_at&limit=5000`,
        ),
      ),
    )
  ).flat();

  const casesByWorkspace = (
    await Promise.all(
      candidateWorkspaceIds.map((workspaceId) =>
        safeSelect(
          `cases?workspace_id=eq.${encodeURIComponent(workspaceId)}&select=workspace_id,updated_at,created_at&limit=5000`,
        ),
      ),
    )
  ).flat();

  return buildWorkspaceMetrics({
    workspaceRows,
    leadRows: leadsByWorkspace,
    workItemRows: itemsByWorkspace,
    caseRows: casesByWorkspace,
  });
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

export default async function handler(req: any, res: any) {
  try {
    const body = parseJsonBody(req);
    const admin = await ensureAdmin(req, body);
    if (!admin.ok) {
      res.status(403).json({ error: admin.error || 'ADMIN_FORBIDDEN' });
      return;
    }

    const mode = asText(req.query?.mode || body.mode || 'dry-run').toLowerCase();
    const targetEmail = asNullableString(req.query?.targetEmail || body.targetEmail || null);
    const targetUid = asNullableString(req.query?.targetUid || body.targetUid || null);
    const explicitWorkspaceId = asNullableString(req.query?.workspaceId || body.workspaceId || null);
    const reason = asText(body.reason || req.query?.reason || 'manual_recovery');
    const identity = getRequestIdentity(req, body);
    const fallbackEmail = asNullableString(identity.email || null);

    const effectiveEmail = targetEmail || fallbackEmail;
    const targetProfileRow = await findTargetProfile(effectiveEmail, targetUid);
    if (!targetProfileRow) {
      res.status(404).json({ error: 'TARGET_PROFILE_NOT_FOUND' });
      return;
    }

    const targetProfileId = asText(
      targetProfileRow.id
      || targetProfileRow.firebase_uid
      || targetProfileRow.auth_uid
      || targetProfileRow.external_auth_uid,
    );
    const targetProfileEmail = asNullableString(targetProfileRow.email || effectiveEmail || null);
    const currentWorkspaceId = asNullableString(targetProfileRow.workspace_id ?? targetProfileRow.workspaceId ?? null);

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
      actorEmail: admin.requesterEmail || 'admin',
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
