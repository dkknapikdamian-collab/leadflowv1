import { getClientAuthSnapshot } from './client-auth';
import { isAdminEmail } from './admin';
import { getStoredWorkspaceId, persistWorkspaceId } from './supabase-fallback';

type WorkspaceRecord = {
  id: string;
  ownerId: string | null;
  name: string;
  plan: string;
  planId: string | null;
  subscriptionStatus: string;
  trialEndsAt: string | null;
};

function buildWorkspaceName(fullName?: string | null) {
  const normalized = typeof fullName === 'string' ? fullName.trim() : '';
  return `${normalized || 'Mój'} Workspace`;
}

function buildWorkspacePayload(input: { uid: string; email?: string | null; fullName?: string | null }) {
  const adminAccess = isAdminEmail(input.email || '');

  return {
    ownerId: input.uid || null,
    name: buildWorkspaceName(input.fullName),
    plan: adminAccess ? 'closeflow_pro' : 'trial_21d',
    planId: adminAccess ? 'closeflow_pro' : 'trial_21d',
    subscriptionStatus: adminAccess ? 'paid_active' : 'trial_active',
    trialEndsAt: adminAccess ? null : new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  } satisfies Omit<WorkspaceRecord, 'id'>;
}

export async function ensureWorkspaceForUser(
  user: { uid?: string | null; email?: string | null; displayName?: string | null } | null,
  preferredName?: string | null,
): Promise<WorkspaceRecord> {
  const uid = typeof user?.uid === 'string' ? user.uid.trim() : '';
  if (!uid) {
    throw new Error('Brak aktywnej sesji.');
  }

  const storedWorkspaceId = getStoredWorkspaceId() || `local-${uid}`;
  persistWorkspaceId(storedWorkspaceId);

  return {
    id: storedWorkspaceId,
    ...buildWorkspacePayload({
      uid,
      email: user?.email || '',
      fullName: preferredName || user?.displayName || '',
    }),
  };
}

export async function ensureCurrentUserWorkspace() {
  const snapshot = getClientAuthSnapshot();
  return ensureWorkspaceForUser({
    uid: snapshot.uid,
    email: snapshot.email,
    displayName: snapshot.fullName,
  });
}
