import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAccessSummary } from '../lib/access';
import { isAdminEmail } from '../lib/admin';
import { auth, db } from '../firebase';
import { ensureCurrentUserWorkspace } from '../lib/workspace';

export function useWorkspace() {
  const [activeUserId, setActiveUserId] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
      return;
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
  }, [activeUserId]);

  const access = getAccessSummary(workspace);
  const isAdmin = isAdminEmail(auth.currentUser?.email) || profile?.role === 'admin' || profile?.isAdmin === true;

  return {
    workspace,
    profile,
    loading,
    hasAccess: access.hasAccess || isAdmin,
    isAdmin,
    isTrialActive: access.status === 'trial_active' || access.status === 'trial_ending',
    isPaidActive: access.status === 'paid_active',
    access,
  };
}
