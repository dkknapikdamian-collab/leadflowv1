import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { buildWorkspaceAccessMeta, hasWorkspaceWriteAccess, resolveWorkspaceAccessState } from '../lib/access';
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

  const accessState = resolveWorkspaceAccessState(workspace);
  const accessMeta = buildWorkspaceAccessMeta(workspace);
  const hasWriteAccess = hasWorkspaceWriteAccess(workspace);
  const isTrialActive = accessState === 'trial_active' || accessState == 'trial_ending';
  const isPaidActive = accessState === 'paid_active';
  const hasAccess = hasWriteAccess;

  return { workspace, profile, loading, hasAccess, hasWriteAccess, isTrialActive, isPaidActive, accessState, accessMeta };
}
