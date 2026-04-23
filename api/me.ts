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
  return uniqueStrings([
    profileRow?.id,
    profileRow?.firebase_uid,
    profileRow?.firebaseUid,
    profileRow?.auth_uid,
    profileRow?.authUid,
    profileRow?.external_auth_uid,
    profileRow?.externalAuthUid,
    uid,
    email,
  ]);
}

async function findWorkspaceForProfile(
  profileRow: Record<string, unknown> | null,
  uid: string | null,
  email: string | null,
) {
  const lookupCandidates = getProfileLookupCandidates(profileRow, uid, email);
  if (!lookupCandidates.length) return null;

  const workspaceQueries = lookupCandidates.flatMap((candidate) => ([
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
    for (const candidate of lookupCandidates) {
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
      firebase_uid: uid || null,
      auth_uid: uid || null,
      external_auth_uid: uid || null,
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

  if (uid && !asNullableString(profileRow.firebase_uid ?? profileRow.firebaseUid ?? null)) {
    patch.firebase_uid = uid;
    shouldPatch = true;
  }

  if (uid && !asNullableString(profileRow.auth_uid ?? profileRow.authUid ?? null)) {
    patch.auth_uid = uid;
    shouldPatch = true;
  }

  if (uid && !asNullableString(profileRow.external_auth_uid ?? profileRow.externalAuthUid ?? null)) {
    patch.external_auth_uid = uid;
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
  return (
    asNullableString(profileRow?.owner_user_id)
    || asNullableString(profileRow?.ownerUserId)
    || asNullableString(profileRow?.owner_id)
    || asNullableString(profileRow?.ownerId)
    || asNullableString(profileRow?.created_by_user_id)
    || asNullableString(profileRow?.createdByUserId)
    || asNullableString(profileRow?.firebase_uid)
    || asNullableString(profileRow?.firebaseUid)
    || asNullableString(profileRow?.auth_uid)
    || asNullableString(profileRow?.authUid)
    || asNullableString(profileRow?.external_auth_uid)
    || asNullableString(profileRow?.externalAuthUid)
    || extractUuidCandidate(
      profileRow?.user_uuid,
      profileRow?.userUuid,
      profileRow?.profile_uuid,
      profileRow?.profileUuid,
      profileRow?.workspace_owner_user_id,
      profileRow?.workspaceOwnerUserId,
      profileRow?.id,
      uid,
    )
    || asNullableString(uid)
    || crypto.randomUUID()
  );
}

async function ensureWorkspace(
  workspaceOwnerUserId: string,
  fullName: string | null,
  workspaceId: string | null,
  row: Record<string, unknown> | null,
) {
  const nowIso = new Date().toISOString();
  const trialEndsAt = buildTrialEndsAt();

  if (!row) {
    const payload: Record<string, unknown> = {
      owner_user_id: workspaceOwnerUserId,
      owner_id: workspaceOwnerUserId,
      created_by_user_id: workspaceOwnerUserId,
      name: `${fullName || 'Moj'} Workspace`,
      plan_id: DEFAULT_PLAN_ID,
      subscription_status: DEFAULT_STATUS,
      trial_ends_at: trialEndsAt,
      created_at: nowIso,
      updated_at: nowIso,
    };

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

  if (!asNullableString(row.owner_user_id ?? row.ownerUserId ?? null)) {
    patch.owner_user_id = workspaceOwnerUserId;
    shouldPatch = true;
  }

  if (!asNullableString(row.owner_id ?? row.ownerId ?? null)) {
    patch.owner_id = workspaceOwnerUserId;
    shouldPatch = true;
  }

  if (!asNullableString(row.created_by_user_id ?? row.createdByUserId ?? null)) {
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

    if (!workspaceRow) {
      workspaceRow = await findWorkspaceForProfile(profileRow, uid, email);
      workspaceId = asNullableString(workspaceRow?.id) || workspaceId;
    }

    const ensuredWorkspace = await ensureWorkspace(workspaceOwnerUserId, fullName, workspaceId, workspaceRow);
    workspaceId = ensuredWorkspace.workspaceId;
    workspaceRow = ensuredWorkspace.workspaceRow;

    profileRow = await ensureProfile(profileRow, uid, email, fullName, workspaceId);

    const workspace = normalizeWorkspace(workspaceRow, workspaceId, workspaceOwnerUserId);
    const profile = normalizeProfile(profileRow, uid, email, fullName);
    const access = buildAccess(workspace);

    res.status(200).json({ workspace, profile, access });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'ME_READ_FAILED' });
  }
}
