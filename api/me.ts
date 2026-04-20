import { findWorkspaceId, selectFirstAvailable } from './_supabase.js';

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

function normalizeWorkspace(row: Record<string, unknown> | null, fallbackWorkspaceId: string | null, fallbackOwnerId: string | null) {
  const workspaceId = asNullableString(row?.id) || fallbackWorkspaceId || fallbackOwnerId || '';
  const ownerId =
    asNullableString(row?.owner_id) ||
    asNullableString(row?.ownerId) ||
    asNullableString(row?.created_by_user_id) ||
    fallbackOwnerId;
  const planId = asString(row?.plan_id ?? row?.planId ?? row?.plan ?? 'solo', 'solo');
  const subscriptionStatus = asString(
    row?.subscription_status ?? row?.subscriptionStatus ?? row?.status ?? 'trial_active',
    'trial_active'
  );
  const trialEndsAt = asNullableString(row?.trial_ends_at ?? row?.trialEndsAt ?? null);

  return {
    id: workspaceId,
    ownerId,
    planId,
    subscriptionStatus,
    trialEndsAt,
  };
}

function normalizeProfile(row: Record<string, unknown> | null, fallbackUid: string | null, fallbackEmail: string | null, fallbackFullName: string | null) {
  return {
    id: asString(row?.id ?? fallbackUid ?? ''),
    fullName: asString(row?.full_name ?? row?.fullName ?? fallbackFullName ?? ''),
    email: asString(row?.email ?? fallbackEmail ?? ''),
    role: asString(row?.role ?? 'member'),
    isAdmin: Boolean(row?.is_admin ?? row?.isAdmin ?? false),
  };
}

function buildAccess(workspace: { subscriptionStatus: string; trialEndsAt: NullableString }) {
  const statusRaw = workspace.subscriptionStatus || 'inactive';
  const trialActive = statusRaw === 'trial_active' && isFutureDate(workspace.trialEndsAt);
  const trialEnding = statusRaw === 'trial_ending' || (statusRaw === 'trial_active' && trialActive);
  const paidActive = statusRaw === 'paid_active';
  const status =
    statusRaw === 'trial_active' && workspace.trialEndsAt && !isFutureDate(workspace.trialEndsAt)
      ? 'trial_expired'
      : statusRaw;

  return {
    hasAccess: paidActive || trialActive || trialEnding,
    status,
    isTrialActive: trialActive || trialEnding,
    isPaidActive: paidActive,
  };
}

async function fetchProfile(uid: string | null, email: string | null) {
  if (uid) {
    try {
      const byId = await selectFirstAvailable([`profiles?id=eq.${encodeURIComponent(uid)}&select=*&limit=1`]);
      const row = Array.isArray(byId.data) ? byId.data[0] : null;
      if (row) return row as Record<string, unknown>;
    } catch {
      // Ignore and continue with fallback queries.
    }
  }

  if (email) {
    try {
      const byEmail = await selectFirstAvailable([`profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1`]);
      const row = Array.isArray(byEmail.data) ? byEmail.data[0] : null;
      if (row) return row as Record<string, unknown>;
    } catch {
      // Ignore and return null profile.
    }
  }

  return null;
}

async function fetchWorkspace(workspaceId: string | null) {
  if (!workspaceId) return null;

  try {
    const result = await selectFirstAvailable([`workspaces?id=eq.${encodeURIComponent(workspaceId)}&select=*&limit=1`]);
    const row = Array.isArray(result.data) ? result.data[0] : null;
    return (row || null) as Record<string, unknown> | null;
  } catch {
    return null;
  }
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

    const profileRow = await fetchProfile(uid, email);
    const profileWorkspaceId = asNullableString(profileRow?.workspace_id ?? profileRow?.workspaceId ?? null);
    const resolvedWorkspaceId = await findWorkspaceId(uid || undefined);
    const workspaceId = profileWorkspaceId || asNullableString(resolvedWorkspaceId);
    const workspaceRow = await fetchWorkspace(workspaceId);

    const workspace = normalizeWorkspace(workspaceRow, workspaceId, uid);
    const profile = normalizeProfile(profileRow, uid, email, fullName);
    const access = buildAccess(workspace);

    res.status(200).json({
      workspace,
      profile,
      access,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'ME_READ_FAILED' });
  }
}
