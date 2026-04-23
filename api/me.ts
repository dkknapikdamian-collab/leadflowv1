import { insertWithVariants, selectFirstAvailable, updateById, updateWhere } from './_supabase.js';

const ADMIN_EMAILS = new Set(['dk.knapikdamian@gmail.com']);
const DEFAULT_PLAN_ID = 'trial_14d';
const DEFAULT_STATUS = 'trial_active';
const TRIAL_DAYS = 14;
const TRIAL_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000;
const BROKEN_BOOTSTRAP_REPAIR_WINDOW_MS = 12 * 60 * 60 * 1000;

type NullableString = string | null;

function isUuid(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asString(value: unknown, fallback = '') {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function asNullableString(value: unknown): NullableString {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
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

function uniqueUuidStrings(values: unknown[]) {
  return uniqueStrings(values).filter((value) => isUuid(value));
}

function extractUuidCandidate(...values: unknown[]) {
  for (const value of values) {
    const normalized = asNullableString(value);
    if (normalized && isUuid(normalized)) {
      return normalized;
    }
  }

  return null;
}

function asDate(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isFinite(date.getTime()) ? date : null;
}

function isFutureDate(iso: NullableString) {
  if (!iso) return false;
  const date = new Date(iso);
  return Number.isFinite(date.getTime()) && date.getTime() > Date.now();
}

function isRecentDate(value: unknown, windowMs: number) {
  const date = asDate(value);
  if (!date) return false;
  return Date.now() - date.getTime() <= windowMs;
}

function buildTrialEndsAt() {
  return new Date(Date.now() + TRIAL_MS).toISOString();
}

function isAdminEmail(email: NullableString) {
  return !!email && ADMIN_EMAILS.has(email.trim().toLowerCase());
}

function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  if (match?.[1]) return match[1];
  const altMatch = message.match(/column \"([^\"]+)\" does not exist/i);
  return altMatch?.[1] || null;
}

function normalizeWorkspace(
  row: Record<string, unknown> | null,
  fallbackWorkspaceId: string | null,
  fallbackOwnerId: string | null,
) {
  const workspaceId = asNullableString(row?.id) || fallbackWorkspaceId || '';
  const ownerId =
    asNullableString(row?.owner_user_id) ||
    asNullableString(row?.ownerUserId) ||
    asNullableString(row?.owner_id) ||
    asNullableString(row?.ownerId) ||
    asNullableString(row?.created_by_user_id) ||
    asNullableString(row?.createdByUserId) ||
    fallbackOwnerId;
  const planId = asString(row?.plan_id ?? row?.planId ?? row?.plan ?? DEFAULT_PLAN_ID, DEFAULT_PLAN_ID);
  const subscriptionStatus = asString(
    row?.subscription_status ?? row?.subscriptionStatus ?? row?.status ?? DEFAULT_STATUS,
    DEFAULT_STATUS,
  );
  const trialEndsAt = asNullableString(row?.trial_ends_at ?? row?.trialEndsAt ?? null);
  return { id: workspaceId, ownerId, planId, subscriptionStatus, trialEndsAt };
}

function normalizeProfile(
  row: Record<string, unknown> | null,
  fallbackUid: string | null,
  fallbackEmail: string | null,
  fallbackFullName: string | null,
) {
  const email = asString(row?.email ?? fallbackEmail ?? '');
  const admin = Boolean(row?.is_admin ?? row?.isAdmin ?? false) || isAdminEmail(email);
  return {
    id: asString(
      row?.id
        ?? row?.firebase_uid
        ?? row?.firebaseUid
        ?? row?.auth_uid
        ?? row?.authUid
        ?? row?.external_auth_uid
        ?? row?.externalAuthUid
        ?? fallbackUid
        ?? fallbackEmail
        ?? '',
    ),
    fullName: asString(row?.full_name ?? row?.fullName ?? fallbackFullName ?? ''),
    email,
    role: asString(row?.role ?? (admin ? 'admin' : 'member')),
    isAdmin: admin,
  };
}

function buildAccess(workspace: { subscriptionStatus: string; trialEndsAt: NullableString }) {
  const statusRaw = workspace.subscriptionStatus || 'inactive';
  const trialFuture = isFutureDate(workspace.trialEndsAt);

  if (statusRaw === 'paid_active') {
    return { hasAccess: true, status: 'paid_active', isTrialActive: false, isPaidActive: true };
  }

  if (statusRaw === 'trial_ending') {
    return trialFuture
      ? { hasAccess: true, status: 'trial_ending', isTrialActive: true, isPaidActive: false }
      : { hasAccess: false, status: 'trial_expired', isTrialActive: false, isPaidActive: false };
  }

  if (statusRaw === 'trial_active') {
    return trialFuture
      ? { hasAccess: true, status: 'trial_active', isTrialActive: true, isPaidActive: false }
      : { hasAccess: false, status: 'trial_expired', isTrialActive: false, isPaidActive: false };
  }

  return { hasAccess: false, status: statusRaw, isTrialActive: false, isPaidActive: false };
}

async function fetchProfile(uid: string | null, email: string | null) {
  const queries: string[] = [];

  if (email) {
    queries.push(`profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1`);
  }

  if (uid) {
    queries.push(`profiles?firebase_uid=eq.${encodeURIComponent(uid)}&select=*&limit=1`);
    queries.push(`profiles?auth_uid=eq.${encodeURIComponent(uid)}&select=*&limit=1`);
    queries.push(`profiles?external_auth_uid=eq.${encodeURIComponent(uid)}&select=*&limit=1`);
  }

  if (!queries.length) {
    return null;
  }

  try {
    const result = await selectFirstAvailable(queries);
    const row = Array.isArray(result.data) ? result.data[0] : null;
    return row ? (row as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function fetchWorkspace(workspaceId: string | null) {
  if (!workspaceId || !isUuid(workspaceId)) return null;

  try {
    const result = await selectFirstAvailable([
      `workspaces?id=eq.${encodeURIComponent(workspaceId)}&select=*&limit=1`,
    ]);
    const row = Array.isArray(result.data) ? result.data[0] : null;
    return (row || null) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

function getProfileLookupCandidates(
  profileRow: Record<string, unknown> | null,
  uid: string | null,
  email: string | null,
) {
  return {
    all: uniqueStrings([
      profileRow?.id,
      profileRow?.firebase_uid,
      profileRow?.firebaseUid,
      profileRow?.auth_uid,
      profileRow?.authUid,
      profileRow?.external_auth_uid,
      profileRow?.externalAuthUid,
      uid,
      email,
    ]),
    uuids: uniqueUuidStrings([
      profileRow?.id,
      profileRow?.firebase_uid,
      profileRow?.firebaseUid,
      profileRow?.auth_uid,
      profileRow?.authUid,
      profileRow?.external_auth_uid,
      profileRow?.externalAuthUid,
      uid,
    ]),
  };
}

async function findWorkspaceForProfile(
  profileRow: Record<string, unknown> | null,
  uid: string | null,
  email: string | null,
) {
  const lookupCandidates = getProfileLookupCandidates(profileRow, uid, email);
  if (!lookupCandidates.all.length) return null;

  const workspaceQueries = lookupCandidates.uuids.flatMap((candidate) => ([
    `workspaces?owner_user_id=eq.${encodeURIComponent(candidate)}&select=*&limit=1`,
    `workspaces?owner_id=eq.${encodeURIComponent(candidate)}&select=*&limit=1`,
    `workspaces?created_by_user_id=eq.${encodeURIComponent(candidate)}&select=*&limit=1`,
  ]));

  for (const query of workspaceQueries) {
    try {
      const result = await selectFirstAvailable([query]);
      const row = Array.isArray(result.data) ? result.data[0] : null;
      if (row) {
        return row as Record<string, unknown>;
      }
    } catch {
      // ignore and continue
    }
  }

  try {
    for (const candidate of lookupCandidates.uuids) {
      const memberResult = await selectFirstAvailable([
        `workspace_members?user_id=eq.${encodeURIComponent(candidate)}&select=workspace_id&limit=1`,
      ]);
      const memberRow = Array.isArray(memberResult.data) ? memberResult.data[0] : null;
      const workspaceId = asNullableString(memberRow?.workspace_id);
      if (workspaceId) {
        return await fetchWorkspace(workspaceId);
      }
    }
  } catch {
    return null;
  }

  return null;
}

async function findFallbackWorkspace(email: string | null) {
  if (!isAdminEmail(email)) {
    return null;
  }

  try {
    const result = await selectFirstAvailable([
      'workspaces?select=*&order=updated_at.desc.nullslast&limit=2',
      'workspaces?select=*&order=created_at.desc.nullslast&limit=2',
      'workspaces?select=*&limit=2',
    ]);
    const rows = Array.isArray(result.data) ? result.data.filter((row) => row && typeof row === 'object') : [];
    if (rows.length === 1) {
      return rows[0] as Record<string, unknown>;
    }
    if (rows.length > 0 && isAdminEmail(email)) {
      return rows[0] as Record<string, unknown>;
    }
  } catch {
    // ignore and continue
  }

  return null;
}

function getActivityActorUuids(profileRow: Record<string, unknown> | null, uid: string | null) {
  return uniqueUuidStrings([
    profileRow?.id,
    profileRow?.firebase_uid,
    profileRow?.firebaseUid,
    profileRow?.auth_uid,
    profileRow?.authUid,
    profileRow?.external_auth_uid,
    profileRow?.externalAuthUid,
    uid,
  ]);
}

async function findWorkspaceFromHistoricalActivity(
  profileRow: Record<string, unknown> | null,
  uid: string | null,
) {
  const actorUuids = getActivityActorUuids(profileRow, uid);
  if (!actorUuids.length) {
    return { workspaceRow: null, workspaceId: null, confidence: 'none' as const };
  }

  const scoreByWorkspace = new Map<string, number>();

  const addScore = (workspaceId: string | null, score: number) => {
    if (!workspaceId) return;
    scoreByWorkspace.set(workspaceId, (scoreByWorkspace.get(workspaceId) || 0) + score);
  };

  const safeSelectRows = async (query: string) => {
    try {
      const result = await selectFirstAvailable([query]);
      return Array.isArray(result.data) ? result.data : [];
    } catch {
      return [];
    }
  };

  for (const actorId of actorUuids) {
    const [leadRows, workItemRows, caseRows, membershipRows] = await Promise.all([
      safeSelectRows(`leads?select=workspace_id&created_by_user_id=eq.${encodeURIComponent(actorId)}&limit=1000`),
      safeSelectRows(`work_items?select=workspace_id&created_by_user_id=eq.${encodeURIComponent(actorId)}&limit=1000`),
      safeSelectRows(`cases?select=workspace_id&created_by_user_id=eq.${encodeURIComponent(actorId)}&limit=1000`),
      safeSelectRows(`workspace_members?select=workspace_id&user_id=eq.${encodeURIComponent(actorId)}&limit=100`),
    ]);

    const appendRows = (rows: unknown[], weight: number) => {
      for (const row of rows) {
        if (!row || typeof row !== 'object') continue;
        const workspaceId = asNullableString((row as Record<string, unknown>).workspace_id);
        addScore(workspaceId, weight);
      }
    };

    appendRows(leadRows, 4);
    appendRows(workItemRows, 3);
    appendRows(caseRows, 3);
    appendRows(membershipRows, 2);
  }

  const sorted = [...scoreByWorkspace.entries()].sort((a, b) => b[1] - a[1]);
  if (!sorted.length) {
    return { workspaceRow: null, workspaceId: null, confidence: 'none' as const };
  }

  const [bestWorkspaceId, bestScore] = sorted[0];
  const secondScore = sorted[1]?.[1] || 0;
  const confidence = bestScore > 0 && bestScore >= secondScore + 2 ? 'high' as const : 'low' as const;

  if (!bestWorkspaceId || confidence !== 'high') {
    return { workspaceRow: null, workspaceId: null, confidence };
  }

  const workspaceRow = await fetchWorkspace(bestWorkspaceId);
  return {
    workspaceRow: workspaceRow || null,
    workspaceId: bestWorkspaceId,
    confidence,
  };
}

async function writeRecoveryLog(payload: Record<string, unknown>) {
  try {
    await insertWithVariants(['workspace_recovery_logs'], [payload]);
  } catch {
    // audit log is best-effort
  }
}

async function insertProfileWithFallback(payload: Record<string, unknown>) {
  let currentPayload = { ...payload };

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      return await insertWithVariants(['profiles'], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !(missingColumn in currentPayload)) {
        throw error;
      }
      delete currentPayload[missingColumn];
    }
  }

  throw new Error('PROFILE_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

function buildProfileMatchQueries(
  profileRow: Record<string, unknown> | null,
  uid: string | null,
  email: string | null,
) {
  return uniqueStrings([
    profileRow?.id ? `profiles?id=eq.${encodeURIComponent(String(profileRow.id))}` : null,
    profileRow?.firebase_uid ? `profiles?firebase_uid=eq.${encodeURIComponent(String(profileRow.firebase_uid))}` : null,
    profileRow?.firebaseUid ? `profiles?firebase_uid=eq.${encodeURIComponent(String(profileRow.firebaseUid))}` : null,
    profileRow?.auth_uid ? `profiles?auth_uid=eq.${encodeURIComponent(String(profileRow.auth_uid))}` : null,
    profileRow?.authUid ? `profiles?auth_uid=eq.${encodeURIComponent(String(profileRow.authUid))}` : null,
    profileRow?.external_auth_uid ? `profiles?external_auth_uid=eq.${encodeURIComponent(String(profileRow.external_auth_uid))}` : null,
    profileRow?.externalAuthUid ? `profiles?external_auth_uid=eq.${encodeURIComponent(String(profileRow.externalAuthUid))}` : null,
    email ? `profiles?email=eq.${encodeURIComponent(email)}` : null,
    uid ? `profiles?firebase_uid=eq.${encodeURIComponent(uid)}` : null,
    uid ? `profiles?auth_uid=eq.${encodeURIComponent(uid)}` : null,
    uid ? `profiles?external_auth_uid=eq.${encodeURIComponent(uid)}` : null,
  ]);
}

async function updateProfileWithFallback(
  profileRow: Record<string, unknown> | null,
  uid: string | null,
  email: string | null,
  payload: Record<string, unknown>,
) {
  let currentPayload = { ...payload };
  const matchQueries = buildProfileMatchQueries(profileRow, uid, email);

  if (!matchQueries.length) {
    throw new Error('PROFILE_UPDATE_MATCH_NOT_FOUND');
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    let lastError: unknown = null;

    for (const query of matchQueries) {
      try {
        return await updateWhere(query, currentPayload);
      } catch (error) {
        lastError = error;
      }
    }

    const missingColumn = extractMissingColumn(lastError);
    if (!missingColumn || !(missingColumn in currentPayload)) {
      throw lastError;
    }
    delete currentPayload[missingColumn];
  }

  throw new Error('PROFILE_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

async function insertWorkspaceWithFallback(payload: Record<string, unknown>) {
  let currentPayload = { ...payload };

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      return await insertWithVariants(['workspaces'], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !(missingColumn in currentPayload)) {
        throw error;
      }
      delete currentPayload[missingColumn];
    }
  }

  throw new Error('WORKSPACE_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function updateWorkspaceWithFallback(workspaceId: string, payload: Record<string, unknown>) {
  let currentPayload = { ...payload };

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      return await updateById('workspaces', workspaceId, currentPayload);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !(missingColumn in currentPayload)) {
        throw error;
      }
      delete currentPayload[missingColumn];
    }
  }

  throw new Error('WORKSPACE_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

async function ensureProfile(
  profileRow: Record<string, unknown> | null,
  uid: string | null,
  email: string | null,
  fullName: string | null,
  workspaceId: string | null,
) {
  const nowIso = new Date().toISOString();
  const admin = isAdminEmail(email);
  const normalizedUid = uid && isUuid(uid) ? uid : null;

  if (!profileRow) {
    const generatedId = crypto.randomUUID();
    const payload: Record<string, unknown> = {
      id: generatedId,
      email: email || '',
      full_name: fullName || '',
      workspace_id: workspaceId,
      role: admin ? 'admin' : 'member',
      is_admin: admin,
      created_at: nowIso,
      updated_at: nowIso,
      firebase_uid: normalizedUid,
      auth_uid: normalizedUid,
      external_auth_uid: normalizedUid,
    };

    const result = await insertProfileWithFallback(payload);
    return (Array.isArray(result.data) && result.data[0] ? result.data[0] : payload) as Record<string, unknown>;
  }

  const patch: Record<string, unknown> = { updated_at: nowIso };
  let shouldPatch = false;

  if (email && asNullableString(profileRow.email) !== email) {
    patch.email = email;
    shouldPatch = true;
  }

  if (fullName && asNullableString(profileRow.full_name ?? profileRow.fullName) !== fullName) {
    patch.full_name = fullName;
    shouldPatch = true;
  }

  if (workspaceId && asNullableString(profileRow.workspace_id ?? profileRow.workspaceId) !== workspaceId) {
    patch.workspace_id = workspaceId;
    shouldPatch = true;
  }

  if (normalizedUid && !asNullableString(profileRow.firebase_uid ?? profileRow.firebaseUid ?? null)) {
    patch.firebase_uid = normalizedUid;
    shouldPatch = true;
  }

  if (normalizedUid && !asNullableString(profileRow.auth_uid ?? profileRow.authUid ?? null)) {
    patch.auth_uid = normalizedUid;
    shouldPatch = true;
  }

  if (normalizedUid && !asNullableString(profileRow.external_auth_uid ?? profileRow.externalAuthUid ?? null)) {
    patch.external_auth_uid = normalizedUid;
    shouldPatch = true;
  }

  if (admin && asNullableString(profileRow.role) !== 'admin') {
    patch.role = 'admin';
    shouldPatch = true;
  }

  if (admin && !Boolean(profileRow.is_admin ?? profileRow.isAdmin)) {
    patch.is_admin = true;
    shouldPatch = true;
  }

  if (!shouldPatch) {
    return profileRow;
  }

  const updated = await updateProfileWithFallback(profileRow, uid, email, patch);
  return (Array.isArray(updated) && updated[0] ? updated[0] : { ...profileRow, ...patch }) as Record<string, unknown>;
}

function shouldRepairFreshTrialBootstrap(row: Record<string, unknown> | null) {
  if (!row) return false;

  const currentStatus = asNullableString(row.subscription_status ?? row.subscriptionStatus ?? row.status);
  const currentTrialEndsAt = asNullableString(row.trial_ends_at ?? row.trialEndsAt ?? null);
  const createdRecently = isRecentDate(
    row.created_at ?? row.createdAt ?? row.updated_at ?? row.updatedAt,
    BROKEN_BOOTSTRAP_REPAIR_WINDOW_MS,
  );

  if (!createdRecently) {
    return false;
  }

  if (!currentStatus || !currentTrialEndsAt) {
    return true;
  }

  if (currentStatus === 'inactive') {
    return true;
  }

  if ((currentStatus === 'trial_active' || currentStatus === 'trial_ending') && !isFutureDate(currentTrialEndsAt)) {
    return true;
  }

  if (currentStatus === 'trial_expired') {
    return true;
  }

  return false;
}

function resolveWorkspaceOwnerUserId(profileRow: Record<string, unknown> | null, uid: string | null) {
  return extractUuidCandidate(
    profileRow?.id,
    profileRow?.firebase_uid,
    profileRow?.firebaseUid,
    profileRow?.auth_uid,
    profileRow?.authUid,
    profileRow?.external_auth_uid,
    profileRow?.externalAuthUid,
    uid,
    profileRow?.owner_user_id,
    profileRow?.ownerUserId,
    profileRow?.owner_id,
    profileRow?.ownerId,
    profileRow?.created_by_user_id,
    profileRow?.createdByUserId,
  );
}

async function ensureWorkspace(
  workspaceOwnerUserId: string | null,
  fullName: string | null,
  workspaceId: string | null,
  row: Record<string, unknown> | null,
) {
  const nowIso = new Date().toISOString();
  const trialEndsAt = buildTrialEndsAt();

  if (!row) {
    const payload: Record<string, unknown> = {
      name: `${fullName || 'Moj'} Workspace`,
      plan_id: DEFAULT_PLAN_ID,
      subscription_status: DEFAULT_STATUS,
      trial_ends_at: trialEndsAt,
      created_at: nowIso,
      updated_at: nowIso,
    };
    if (workspaceOwnerUserId) {
      payload.owner_user_id = workspaceOwnerUserId;
      payload.owner_id = workspaceOwnerUserId;
      payload.created_by_user_id = workspaceOwnerUserId;
    }

    const result = await insertWorkspaceWithFallback(payload);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;

    return {
      workspaceId: asNullableString((inserted as Record<string, unknown>).id) || workspaceId || '',
      workspaceRow: inserted as Record<string, unknown>,
    };
  }

  const currentStatus = asNullableString(row.subscription_status ?? row.subscriptionStatus ?? row.status);
  const currentTrialEndsAt = asNullableString(row.trial_ends_at ?? row.trialEndsAt ?? null);
  const currentPlanId = asNullableString(row.plan_id ?? row.planId ?? row.plan ?? null);
  const paidActive = currentStatus === 'paid_active';

  const patch: Record<string, unknown> = { updated_at: nowIso };
  let shouldPatch = false;

  if (!currentPlanId) {
    patch.plan_id = DEFAULT_PLAN_ID;
    shouldPatch = true;
  }

  if (!currentStatus) {
    patch.subscription_status = DEFAULT_STATUS;
    shouldPatch = true;
  }

  if (!currentTrialEndsAt) {
    patch.trial_ends_at = trialEndsAt;
    shouldPatch = true;
  }

  if (workspaceOwnerUserId && !asNullableString(row.owner_user_id ?? row.ownerUserId ?? null)) {
    patch.owner_user_id = workspaceOwnerUserId;
    shouldPatch = true;
  }

  if (workspaceOwnerUserId && !asNullableString(row.owner_id ?? row.ownerId ?? null)) {
    patch.owner_id = workspaceOwnerUserId;
    shouldPatch = true;
  }

  if (workspaceOwnerUserId && !asNullableString(row.created_by_user_id ?? row.createdByUserId ?? null)) {
    patch.created_by_user_id = workspaceOwnerUserId;
    shouldPatch = true;
  }

  if (!paidActive && shouldRepairFreshTrialBootstrap(row)) {
    patch.plan_id = DEFAULT_PLAN_ID;
    patch.subscription_status = DEFAULT_STATUS;
    patch.trial_ends_at = trialEndsAt;
    shouldPatch = true;
  }

  if (!shouldPatch || !workspaceId) {
    return {
      workspaceId: workspaceId || asNullableString(row.id) || '',
      workspaceRow: row,
    };
  }

  const updated = await updateWorkspaceWithFallback(workspaceId, patch);

  return {
    workspaceId,
    workspaceRow: (Array.isArray(updated) && updated[0] ? updated[0] : { ...row, ...patch }) as Record<string, unknown>,
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const uid = asNullableString(req.query?.uid || req.headers?.['x-user-id']);
    const email = asNullableString(req.query?.email || req.headers?.['x-user-email']);
    const fullName = asNullableString(req.query?.fullName || req.headers?.['x-user-name']);

    let profileRow = await fetchProfile(uid, email);
    profileRow = await ensureProfile(profileRow, uid, email, fullName, null);

    const workspaceOwnerUserId = resolveWorkspaceOwnerUserId(profileRow, uid);
    let workspaceId = asNullableString(profileRow?.workspace_id ?? profileRow?.workspaceId ?? null);
    let workspaceRow = await fetchWorkspace(workspaceId);
    let workspaceResolutionMode = 'profile_workspace';

    if (!workspaceRow) {
      workspaceRow = await findWorkspaceForProfile(profileRow, uid, email);
      workspaceId = asNullableString(workspaceRow?.id) || workspaceId;
      if (workspaceRow) workspaceResolutionMode = 'identity_mapping';
    }

    if (!workspaceRow) {
      const historical = await findWorkspaceFromHistoricalActivity(profileRow, uid);
      workspaceRow = historical.workspaceRow;
      workspaceId = historical.workspaceId || workspaceId;
      if (workspaceRow) workspaceResolutionMode = 'historical_mapping';
    }

    const explicitFallback = asString(req.query?.allowWorkspaceFallback || req.headers?.['x-allow-workspace-fallback'] || '').toLowerCase() === 'true';
    if (!workspaceRow && explicitFallback) {
      workspaceRow = await findFallbackWorkspace(email);
      workspaceId = asNullableString(workspaceRow?.id) || workspaceId;
      if (workspaceRow) workspaceResolutionMode = 'explicit_fallback';
    }

    const ensuredWorkspace = await ensureWorkspace(workspaceOwnerUserId, fullName, workspaceId, workspaceRow);
    workspaceId = ensuredWorkspace.workspaceId;
    workspaceRow = ensuredWorkspace.workspaceRow;

    profileRow = await ensureProfile(profileRow, uid, email, fullName, workspaceId);

    const workspace = normalizeWorkspace(workspaceRow, workspaceId, workspaceOwnerUserId);
    const profile = normalizeProfile(profileRow, uid, email, fullName);
    const access = buildAccess(workspace);

    if (workspaceResolutionMode === 'historical_mapping' || workspaceResolutionMode === 'explicit_fallback') {
      await writeRecoveryLog({
        actor_email: profile.email || 'system',
        target_profile: profile.id || profile.email || 'unknown',
        target_email: profile.email || null,
        from_workspace_id: null,
        to_workspace_id: workspace.id || null,
        reason: workspaceResolutionMode,
        payload: {
          source: 'api/me',
          explicitFallback,
        },
        applied_at: new Date().toISOString(),
      });
    }

    res.status(200).json({ workspace, profile, access });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'ME_READ_FAILED' });
  }
}
