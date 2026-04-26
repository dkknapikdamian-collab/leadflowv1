import { supabaseRequest } from './_supabase.js';

type WorkspaceAccessRow = {
  id?: string | null;
  subscription_status?: string | null;
  subscriptionStatus?: string | null;
  trial_ends_at?: string | null;
  trialEndsAt?: string | null;
  next_billing_at?: string | null;
  nextBillingAt?: string | null;
};

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parseDate(value: unknown) {
  const raw = asText(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isFinite(date.getTime()) ? date : null;
}

function isFutureDate(value: unknown) {
  const date = parseDate(value);
  return !!date && date.getTime() > Date.now();
}

function isPastDate(value: unknown) {
  const date = parseDate(value);
  return !!date && date.getTime() < Date.now();
}

export function getWorkspaceWriteAccess(workspace: WorkspaceAccessRow | null) {
  if (!workspace) {
    return {
      hasWriteAccess: false,
      status: 'workspace_missing',
    };
  }

  const status = asText(workspace.subscription_status ?? workspace.subscriptionStatus) || 'inactive';
  const trialEndsAt = workspace.trial_ends_at ?? workspace.trialEndsAt ?? null;
  const nextBillingAt = workspace.next_billing_at ?? workspace.nextBillingAt ?? null;

  if (status === 'paid_active') {
    if (isPastDate(nextBillingAt)) {
      return {
        hasWriteAccess: false,
        status: 'payment_failed',
      };
    }

    return {
      hasWriteAccess: true,
      status: 'paid_active',
    };
  }

  if (status === 'trial_active' || status === 'trial_ending') {
    return {
      hasWriteAccess: isFutureDate(trialEndsAt),
      status: isFutureDate(trialEndsAt) ? status : 'trial_expired',
    };
  }

  return {
    hasWriteAccess: false,
    status,
  };
}

export async function fetchWorkspaceWriteAccess(workspaceId: string) {
  const rows = await supabaseRequest(
    `workspaces?select=id,subscription_status,trial_ends_at,next_billing_at&id=eq.${encodeURIComponent(workspaceId)}&limit=1`,
    {
      method: 'GET',
      headers: { Prefer: 'return=representation' },
    },
  );

  const workspace = Array.isArray(rows) && rows[0] && typeof rows[0] === 'object'
    ? rows[0] as WorkspaceAccessRow
    : null;

  return getWorkspaceWriteAccess(workspace);
}

export async function assertWorkspaceWriteAccess(workspaceId: string) {
  const access = await fetchWorkspaceWriteAccess(workspaceId);

  if (!access.hasWriteAccess) {
    throw new Error(`WORKSPACE_WRITE_ACCESS_REQUIRED:${access.status}`);
  }

  return access;
}
