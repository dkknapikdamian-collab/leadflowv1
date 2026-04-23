import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAccessSummary } from '../lib/access';
import { isAdminEmail } from '../lib/admin';
import { auth, db } from '../firebase';
import {
  fetchMeFromSupabase,
  getStoredWorkspaceId,
  isSupabaseConfigured,
  persistWorkspaceId,
} from '../lib/supabase-fallback';
import { ensureCurrentUserWorkspace } from '../lib/workspace';

export function useWorkspace() {
  const [activeUserId, setActiveUserId] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [accessOverride, setAccessOverride] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setActiveUserId(user?.uid ?? null);
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

    if (isSupabaseConfigured()) {
      let cancelled = false;

      const loadContext = async () => {
        setLoading(true);
        try {
          const me = await fetchMeFromSupabase({
            uid: activeUserId,
            email: auth.currentUser?.email || undefined,
            fullName: auth.currentUser?.displayName || undefined,
          });
          if (cancelled) return;
          persistWorkspaceId(me.workspace?.id || null);
          setWorkspace(me.workspace);
          setProfile(me.profile);
          setAccessOverride(me.access);
        } catch {
          if (cancelled) return;
          const storedWorkspaceId = getStoredWorkspaceId();
          setWorkspace(storedWorkspaceId ? {
            id: storedWorkspaceId,
            ownerId: null,
            planId: 'trial_14d',
            subscriptionStatus: 'inactive',
            trialEndsAt: null,
            billingProvider: 'manual',
            providerCustomerId: null,
            providerSubscriptionId: null,
            nextBillingAt: null,
            cancelAtPeriodEnd: false,
            timezone: 'Europe/Warsaw',
            dailyDigestEnabled: true,
            dailyDigestHour: 7,
            dailyDigestTimezone: 'Europe/Warsaw',
            dailyDigestRecipientEmail: auth.currentUser?.email || '',
          } : null);
          setProfile({
            id: activeUserId,
            fullName: auth.currentUser?.displayName || '',
            companyName: '',
            email: auth.currentUser?.email || '',
            role: 'member',
            isAdmin: false,
            appearanceSkin: 'classic-light',
            planningConflictWarningsEnabled: true,
            browserNotificationsEnabled: true,
            forceLogoutAfter: null,
          });
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
    }

    setLoading(true);
    const profileRef = doc(db, 'profiles', activeUserId);
    let unsubscribeWorkspace: (() => void) | undefined;
    let unsubscribeProfile: (() => void) | undefined;

    const startSubscriptions = async () => {
      try {
        const ensuredWorkspace = await ensureCurrentUserWorkspace();
        setWorkspace(ensuredWorkspace);

        unsubscribeProfile = onSnapshot(
          profileRef,
          (snap) => {
            const profileData = snap.exists() ? snap.data() : null;
            setProfile(profileData ? { id: snap.id, ...profileData } : null);

            const workspaceId = profileData?.workspaceId || ensuredWorkspace.id;
            unsubscribeWorkspace?.();

            const workspaceRef = doc(db, 'workspaces', workspaceId);
            unsubscribeWorkspace = onSnapshot(
              workspaceRef,
              (wsSnap) => {
                setWorkspace(wsSnap.exists() ? { id: wsSnap.id, ...wsSnap.data() } : ensuredWorkspace);
                setLoading(false);
              },
              () => {
                setWorkspace(ensuredWorkspace);
                setLoading(false);
              }
            );
          },
          () => {
            unsubscribeWorkspace?.();
            unsubscribeWorkspace = undefined;
            setProfile(null);
            setWorkspace(ensuredWorkspace);
            setLoading(false);
          }
        );
      } catch {
        setProfile(null);
        setWorkspace(null);
        setLoading(false);
      }
    };

    void startSubscriptions();

    return () => {
      unsubscribeWorkspace?.();
      unsubscribeProfile?.();
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

  const isAdmin = isAdminEmail(auth.currentUser?.email) || profile?.role === 'admin' || profile?.isAdmin === true;
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
