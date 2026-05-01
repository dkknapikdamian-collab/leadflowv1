import { useEffect, useState } from 'react';
import { getAccessSummary } from '../lib/access';
import {
  fetchMeFromSupabase,
  getStoredWorkspaceId,
  isSupabaseConfigured,
  normalizeWorkspaceContextId,
  persistWorkspaceId,
} from '../lib/supabase-fallback';
import { useClientAuthSnapshot } from './useClientAuthSnapshot';

function buildLocalWorkspace(storedWorkspaceId: string, email: string) {
  const workspaceId = normalizeWorkspaceContextId(storedWorkspaceId);
  if (!workspaceId) return null;

  return {
    id: workspaceId,
    ownerId: null,
    planId: 'trial_21d',
    subscriptionStatus: 'trial_active',
    trialEndsAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    billingProvider: 'manual',
    providerCustomerId: null,
    providerSubscriptionId: null,
    nextBillingAt: null,
    cancelAtPeriodEnd: false,
    timezone: 'Europe/Warsaw',
    dailyDigestEnabled: true,
    dailyDigestHour: 7,
    dailyDigestTimezone: 'Europe/Warsaw',
    dailyDigestRecipientEmail: email,
  };
}

function normalizeWorkspaceRecord(workspace: any) {
  const workspaceId = normalizeWorkspaceContextId(workspace?.id);
  if (!workspaceId) return null;
  return { ...workspace, id: workspaceId };
}

function buildLocalProfile(activeUserId: string, fullName: string, email: string) {
  return {
    id: activeUserId,
    fullName,
    companyName: '',
    email,
    role: 'member',
    isAdmin: false,
    appearanceSkin: 'classic-light',
    planningConflictWarningsEnabled: true,
    browserNotificationsEnabled: true,
    forceLogoutAfter: null,
  };
}

export function useWorkspace() {
  const authSnapshot = useClientAuthSnapshot();
  const [workspace, setWorkspace] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [accessOverride, setAccessOverride] = useState<any>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const activeUserId = authSnapshot.uid || '';

    if (!activeUserId) {
      persistWorkspaceId(null);
      setWorkspace(null);
      setProfile(null);
      setAccessOverride(null);
      setWorkspaceError(null);
      setLoading(false);
      return;
    }

    const snapshotEmail = authSnapshot.email || '';
    const snapshotFullName = authSnapshot.fullName || '';

    if (!isSupabaseConfigured()) {
      const storedWorkspaceId = getStoredWorkspaceId();
      setWorkspace(buildLocalWorkspace(storedWorkspaceId, snapshotEmail));
      setProfile(buildLocalProfile(activeUserId, snapshotFullName, snapshotEmail));
      setAccessOverride(null);
      setWorkspaceError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadContext = async () => {
      setLoading(true);
      try {
        const me = await fetchMeFromSupabase({
          uid: activeUserId,
          email: snapshotEmail || undefined,
          fullName: snapshotFullName || undefined,
        });
        if (cancelled) return;
        const normalizedWorkspace = normalizeWorkspaceRecord(me.workspace);
        persistWorkspaceId(normalizedWorkspace?.id || null);
        setWorkspace(normalizedWorkspace);
        setProfile(me.profile);
        setAccessOverride(me.access);
        setWorkspaceError(normalizedWorkspace?.id ? null : 'WORKSPACE_CONTEXT_REQUIRED');
      } catch {
        if (cancelled) return;
        persistWorkspaceId(null);
        setWorkspace(null);
        setProfile(buildLocalProfile(activeUserId, snapshotFullName, snapshotEmail));
        setAccessOverride(null);
        setWorkspaceError('WORKSPACE_BOOTSTRAP_FAILED');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadContext();

    return () => {
      cancelled = true;
    };
  }, [authSnapshot.uid, authSnapshot.email, authSnapshot.fullName, refreshToken]);

  useEffect(() => {
    if (!workspace?.id) return;
    persistWorkspaceId(String(workspace.id));
  }, [workspace?.id]);

  const fallbackAccess = getAccessSummary(workspace);
  const access = accessOverride
    ? {
        ...fallbackAccess,
        status: accessOverride.status ?? fallbackAccess.status,
        hasAccess: typeof accessOverride.hasAccess === 'boolean' ? accessOverride.hasAccess : fallbackAccess.hasAccess,
        isTrialActive:
          typeof accessOverride.isTrialActive === 'boolean' ? accessOverride.isTrialActive : fallbackAccess.isTrialActive,
        isPaidActive:
          typeof accessOverride.isPaidActive === 'boolean' ? accessOverride.isPaidActive : fallbackAccess.isPaidActive,
      }
    : fallbackAccess;
  const isAdmin = profile?.role === 'admin' || profile?.isAdmin === true;
  const refresh = () => setRefreshToken((prev) => prev + 1);
  const workspaceReady = Boolean(workspace?.id);

  return {
    workspace,
    profile,
    loading,
    workspaceReady,
    workspaceError,
    hasAccess: access.hasAccess || isAdmin,
    isAdmin,
    isTrialActive: access.isTrialActive,
    isPaidActive: access.isPaidActive,
    access,
    refresh,
  };
}
