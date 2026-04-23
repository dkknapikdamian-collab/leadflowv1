import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getAccessSummary } from '../lib/access';
import { isAdminEmail } from '../lib/admin';
import { auth } from '../firebase';
import {
  fetchMeFromSupabase,
  getStoredWorkspaceId,
  isSupabaseConfigured,
  persistWorkspaceId,
} from '../lib/supabase-fallback';
import { clearClientAuthSnapshot, getClientAuthSnapshot, setClientAuthSnapshot } from '../lib/client-auth';

function buildLocalWorkspace(storedWorkspaceId: string, email: string) {
  if (!storedWorkspaceId) return null;

  return {
    id: storedWorkspaceId,
    ownerId: null,
    planId: 'trial_14d',
    subscriptionStatus: 'trial_active',
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
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
  const initialSnapshot = getClientAuthSnapshot();
  const [activeUserId, setActiveUserId] = useState<string | null>(initialSnapshot.uid || auth.currentUser?.uid || null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [accessOverride, setAccessOverride] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        clearClientAuthSnapshot();
        setActiveUserId(null);
        return;
      }

      setClientAuthSnapshot({
        uid: user.uid,
        email: user.email || '',
        fullName: user.displayName || '',
      });
      setActiveUserId(user.uid);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!activeUserId) {
      persistWorkspaceId(null);
      setWorkspace(null);
      setProfile(null);
      setAccessOverride(null);
      setLoading(false);
      return;
    }

    const authSnapshot = getClientAuthSnapshot();
    const snapshotEmail = authSnapshot.email || auth.currentUser?.email || '';
    const snapshotFullName = authSnapshot.fullName || auth.currentUser?.displayName || '';

    if (!isSupabaseConfigured()) {
      const storedWorkspaceId = getStoredWorkspaceId();
      setWorkspace(buildLocalWorkspace(storedWorkspaceId, snapshotEmail));
      setProfile(buildLocalProfile(activeUserId, snapshotFullName, snapshotEmail));
      setAccessOverride(null);
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
        persistWorkspaceId(me.workspace?.id || null);
        setWorkspace(me.workspace);
        setProfile(me.profile);
        setAccessOverride(me.access);
      } catch {
        if (cancelled) return;
        const storedWorkspaceId = getStoredWorkspaceId();
        setWorkspace(buildLocalWorkspace(storedWorkspaceId, snapshotEmail));
        setProfile(buildLocalProfile(activeUserId, snapshotFullName, snapshotEmail));
        setAccessOverride(null);
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
  }, [activeUserId, refreshToken]);

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

  const authSnapshot = getClientAuthSnapshot();
  const currentEmail = authSnapshot.email || auth.currentUser?.email || '';
  const isAdmin = isAdminEmail(currentEmail) || profile?.role === 'admin' || profile?.isAdmin === true;
  const refresh = () => setRefreshToken((prev) => prev + 1);

  return {
    workspace,
    profile,
    loading,
    hasAccess: access.hasAccess || isAdmin,
    isAdmin,
    isTrialActive: access.isTrialActive,
    isPaidActive: access.isPaidActive,
    access,
    refresh,
  };
}
