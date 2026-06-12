import { getClientAuthSnapshot } from './client-auth';
import { isAdminEmail } from './admin';
import { PLAN_IDS, TRIAL_DAYS, TRIAL_MS } from './plans';
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

const STAGE231E2_R5_TRIAL_14D_WORKSPACE_FALLBACK = `Local workspace bootstrap must use central trial contract from plans.ts; TRIAL_DAYS=${TRIAL_DAYS}.`;
void STAGE231E2_R5_TRIAL_14D_WORKSPACE_FALLBACK;

function buildTrialEndsAtFromPlanContract() {
  return new Date(Date.now() + TRIAL_MS).toISOString();
}

function buildWorkspacePayload(input: { uid: string; email?: string | null; fullName?: string | null }) {
  const adminAccess = isAdminEmail(input.email || '');

  return {
    ownerId: input.uid || null,
    name: buildWorkspaceName(input.fullName),
    plan: adminAccess ? PLAN_IDS.pro : PLAN_IDS.trial,
    planId: adminAccess ? PLAN_IDS.pro : PLAN_IDS.trial,
    subscriptionStatus: adminAccess ? 'paid_active' : 'trial_active',
    trialEndsAt: adminAccess ? null : buildTrialEndsAtFromPlanContract(),
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
