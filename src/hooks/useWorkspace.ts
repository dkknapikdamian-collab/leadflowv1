import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAccessSummary } from '../lib/access';
import { auth, db } from '../firebase';

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

    const unsubscribeProfile = onSnapshot(profileRef, (snap) => {
      if (!snap.exists()) {
        unsubscribeWorkspace?.();
        unsubscribeWorkspace = undefined;
        setProfile(null);
        setWorkspace(null);
        setLoading(false);
        return;
      }

      const profileData = snap.data();
      setProfile({ id: snap.id, ...profileData });

      if (!profileData.workspaceId) {
        unsubscribeWorkspace?.();
        unsubscribeWorkspace = undefined;
        setWorkspace(null);
        setLoading(false);
        return;
      }

      unsubscribeWorkspace?.();

      const workspaceRef = doc(db, 'workspaces', profileData.workspaceId);
      unsubscribeWorkspace = onSnapshot(workspaceRef, (wsSnap) => {
        if (wsSnap.exists()) {
          setWorkspace({ id: wsSnap.id, ...wsSnap.data() });
        } else {
          setWorkspace(null);
        }
        setLoading(false);
      });
    });

    return () => {
      unsubscribeWorkspace?.();
      unsubscribeProfile();
    };
  }, [activeUserId]);

  const access = getAccessSummary(workspace);

  return {
    workspace,
    profile,
    loading,
    hasAccess: access.hasAccess,
    isTrialActive: access.status === 'trial_active' || access.status === 'trial_ending',
    isPaidActive: access.status === 'paid_active',
    access,
  };
}
