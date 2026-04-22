import { findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';

const ADMIN_EMAILS = new Set(['dk.knapikdamian@gmail.com']);
const DEFAULT_PLAN_ID = 'solo';
const DEFAULT_STATUS = 'trial_active';
const TRIAL_MS = 14 * 24 * 60 * 60 * 1000;

type NullableString = string | null;

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

function isFutureDate(iso: NullableString) {
  if (!iso) return false;
  const date = new Date(iso);
  return Number.isFinite(date.getTime()) && date.getTime() > Date.now();
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
  const altMatch = message.match(/column \\"([^\"]+)\\" does not exist/i);
  return altMatch?.[1] || null;
}

function normalizeWorkspace(
  row: Record<string, unknown> | null,
  fallbackWorkspaceId: string | null,
  fallbackOwnerId: string | null,
) {
  const workspaceId = asNullableString(row?.id) || fallbackWorkspaceId || fallbackOwnerId || '';
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
    id: asString(row?.id ?? fallbackUid ?? ''),
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
  if (uid) {
    try {
      const byId = await selectFirstAvailable([
        `profiles?id=eq.${encodeURIComponent(uid)}&select=*&limit=1`,
      ]);
      const row = Array.isArray(byId.data) ? byId.data[0] : null;
      if (row) return row as Record<string, unknown>;
    } catch {
      // ignore
    }
  }

  if (email) {
    try {
      const byEmail = await selectFirstAvailable([
        `profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1`,
      ]);
      const row = Array.isArray(byEmail.data) ? byEmail.data[0] : null;
      if (row) return row as Record<string, unknown>;
    } catch {
      // ignore
    }
  }

  return null;
}

async function fetchWorkspace(workspaceId: string | null) {
  if (!workspaceId) return null;

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

async function insertWorkspaceWithFallback(payload: Record<string, unknown>) {
  let currentPayload = { ...payload };

  for (let attempt = 0; attempt < 8; attempt += 1) {
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

  for (let attempt = 0; attempt < 8; attempt += 1) {
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

async function ensureWorkspace(
  uid: string | null,
  fullName: string | null,
  workspaceId: string | null,
  row: Record<string, unknown> | null,
) {
  const nowIso = new Date().toISOString();
  const trialEndsAt = buildTrialEndsAt();

  if (!row) {
    const payload = {
      owner_user_id: uid || null,
      owner_id: uid || null,
      created_by_user_id: uid || null,
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
      workspaceId: asNullableString((inserted as Record<string, unknown>).id) || workspaceId || uid || '',
      workspaceRow: inserted as Record<string, unknown>,
    };
  }

  const patch: Record<string, unknown> = { updated_at: nowIso };
  let shouldPatch = false;

  if (!asNullableString(row.plan_id ?? row.planId ?? row.plan)) {
    patch.plan_id = DEFAULT_PLAN_ID;
    shouldPatch = true;
  }

  if (!asNullableString(row.subscription_status ?? row.subscriptionStatus ?? row.status)) {
    patch.subscription_status = DEFAULT_STATUS;
    shouldPatch = true;
  }

  if (!asNullableString(row.trial_ends_at ?? row.trialEndsAt ?? null)) {
    patch.trial_ends_at = trialEndsAt;
    shouldPatch = true;
  }

  if (!asNullableString(row.owner_user_id ?? row.ownerUserId ?? null) && uid) {
    patch.owner_user_id = uid;
    shouldPatch = true;
  }

  if (!asNullableString(row.owner_id ?? row.ownerId ?? null) && uid) {
    patch.owner_id = uid;
    shouldPatch = true;
  }

  if (!asNullableString(row.created_by_user_id ?? row.createdByUserId ?? null) && uid) {
    patch.created_by_user_id = uid;
    shouldPatch = true;
  }

  if (!shouldPatch || !workspaceId) {
    return {
      workspaceId: workspaceId || asNullableString(row.id) || uid || '',
      workspaceRow: row,
    };
  }

  const updated = await updateWorkspaceWithFallback(workspaceId, patch);

  return {
    workspaceId,
    workspaceRow: (Array.isArray(updated) && updated[0] ? updated[0] : { ...row, ...patch }) as Record<string, unknown>,
  };
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
    const payload = {
      id: uid || crypto.randomUUID(),
      email: email || '',
      full_name: fullName || '',
      workspace_id: workspaceId,
      role: admin ? 'admin' : 'member',
      is_admin: admin,
      created_at: nowIso,
      updated_at: nowIso,
    };
    const result = await insertWithVariants(['profiles'], [payload]);
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

  const updated = await updateById('profiles', String(profileRow.id), patch);
  return (Array.isArray(updated) && updated[0] ? updated[0] : { ...profileRow, ...patch }) as Record<string, unknown>;
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
    const stableOwnerId = asNullableString(profileRow?.id) || uid || email || null;
    const profileWorkspaceId = asNullableString(profileRow?.workspace_id ?? profileRow?.workspaceId ?? null);
    const resolvedWorkspaceId = profileWorkspaceId || (uid ? await findWorkspaceId(uid) : null);

    let workspaceId = profileWorkspaceId || asNullableString(resolvedWorkspaceId);
    let workspaceRow = await fetchWorkspace(workspaceId);

    const ensuredWorkspace = await ensureWorkspace(stableOwnerId, fullName, workspaceId, workspaceRow);
    workspaceId = ensuredWorkspace.workspaceId;
    workspaceRow = ensuredWorkspace.workspaceRow;

    profileRow = await ensureProfile(profileRow, uid, email, fullName, workspaceId);

    const finalOwnerId = asNullableString(profileRow?.id) || stableOwnerId;
    const workspace = normalizeWorkspace(workspaceRow, workspaceId, finalOwnerId);
    const profile = normalizeProfile(profileRow, uid, email, fullName);
    const access = buildAccess(workspace);

    res.status(200).json({ workspace, profile, access });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'ME_READ_FAILED' });
  }
}
