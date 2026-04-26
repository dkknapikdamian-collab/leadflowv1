import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot, collection, query, where, limit } from 'firebase/firestore';
import { isAfter, parseISO } from 'date-fns';

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const profileRef = doc(db, 'profiles', auth.currentUser.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const profileData = snap.data();
        setProfile({ id: snap.id, ...profileData });

        if (profileData.workspaceId) {
          const workspaceRef = doc(db, 'workspaces', profileData.workspaceId);
          const unsubscribeWorkspace = onSnapshot(workspaceRef, (wsSnap) => {
            if (wsSnap.exists()) {
              setWorkspace({ id: wsSnap.id, ...wsSnap.data() });
            }
            setLoading(false);
          });
          return () => unsubscribeWorkspace();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeProfile();
  }, []);

  const isTrialActive = workspace?.subscriptionStatus === 'trial_active' && 
    workspace?.trialEndsAt && isAfter(parseISO(workspace.trialEndsAt), new Date());
  
  const isPaidActive = workspace?.subscriptionStatus === 'paid_active';
  
  const hasAccess = isTrialActive || isPaidActive;
  const profileRole = String(profile?.role || profile?.workspaceRole || profile?.accessRole || '').toLowerCase();
  const isAdmin = Boolean(
    profile?.isAdmin === true ||
    profileRole === 'admin' ||
    profileRole === 'owner' ||
    workspace?.ownerId === auth.currentUser?.uid ||
    workspace?.ownerUserId === auth.currentUser?.uid
  );

  return { workspace, profile, loading, hasAccess, isTrialActive, isPaidActive, isAdmin };
}
