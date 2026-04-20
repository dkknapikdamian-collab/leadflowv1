import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAccessSummary } from '../lib/access';
import { isAdminEmail } from '../lib/admin';
import { auth, db } from '../firebase';
import { fetchMeFromSupabase, isSupabaseConfigured } from '../lib/supabase-fallback';
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
          setWorkspace(me.workspace);
          setProfile(me.profile);
          setAccessOverride(me.access);
        } catch {
          if (cancelled) return;
          setWorkspace({
            id: activeUserId,
            ownerId: activeUserId,
            planId: 'solo',
            subscriptionStatus: 'inactive',
            trialEndsAt: null,
          });
          setProfile({
            id: activeUserId,
            fullName: auth.currentUser?.displayName || '',
            email: auth.currentUser?.email || '',
            role: 'member',
            isAdmin: false,
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

  const fallbackAccess = getAccessSummary(workspace);
  const access = accessOverride || fallbackAccess;
  const isAdmin = isAdminEmail(auth.currentUser?.email) || profile?.role === 'admin' || profile?.isAdmin === true;
  const refresh = () => setRefreshToken((prev) => prev + 1);

  return {
    workspace,
    profile,
    loading,
    hasAccess: access.hasAccess || isAdmin,
    isAdmin,
    isTrialActive: access.isTrialActive ?? (access.status === 'trial_active' || access.status === 'trial_ending'),
    isPaidActive: access.isPaidActive ?? access.status === 'paid_active',
    access,
    refresh,
  };
}
