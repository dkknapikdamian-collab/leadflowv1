import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, limit, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { addDays } from 'date-fns';
import { getAccessSummary } from '../lib/access';
import { isAdminEmail } from '../lib/admin';
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

    const ensureWorkspaceBinding = async (profileData?: Record<string, any> | null) => {
      const adminAccess = isAdminEmail(auth.currentUser?.email);
      const workspaceQuery = query(collection(db, 'workspaces'), where('ownerId', '==', activeUserId), limit(1));
      const ownedWorkspaceSnapshot = await getDocs(workspaceQuery);

      let workspaceId = ownedWorkspaceSnapshot.docs[0]?.id;

      if (!workspaceId) {
        const workspaceRef = await addDoc(collection(db, 'workspaces'), {
          ownerId: activeUserId,
          name: `${profileData?.fullName || auth.currentUser?.displayName || 'Moj'} Workspace`,
          plan: adminAccess ? 'pro' : 'free',
          planId: adminAccess ? 'pro' : null,
          subscriptionStatus: adminAccess ? 'paid_active' : 'trial_active',
          trialEndsAt: adminAccess ? null : addDays(new Date(), 7).toISOString(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        workspaceId = workspaceRef.id;
      }

      if (profileData) {
        await updateDoc(profileRef, {
          workspaceId,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(profileRef, {
          email: auth.currentUser?.email ?? null,
          fullName: auth.currentUser?.displayName ?? null,
          workspaceId,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      return workspaceId;
    };

    const unsubscribeProfile = onSnapshot(
      profileRef,
      async (snap) => {
        if (!snap.exists()) {
          try {
            await ensureWorkspaceBinding(null);
          } catch {
            setProfile(null);
            setWorkspace(null);
            setLoading(false);
          }
          return;
        }

        const profileData = snap.data();
        setProfile({ id: snap.id, ...profileData });

        if (!profileData.workspaceId) {
          try {
            await ensureWorkspaceBinding(profileData);
          } catch {
            unsubscribeWorkspace?.();
            unsubscribeWorkspace = undefined;
            setWorkspace(null);
            setLoading(false);
          }
          return;
        }

        unsubscribeWorkspace?.();

        const workspaceRef = doc(db, 'workspaces', profileData.workspaceId);
        unsubscribeWorkspace = onSnapshot(
          workspaceRef,
          async (wsSnap) => {
            if (wsSnap.exists()) {
              setWorkspace({ id: wsSnap.id, ...wsSnap.data() });
            } else {
              try {
                await ensureWorkspaceBinding(profileData);
              } catch {
                setWorkspace(null);
              }
            }
            setLoading(false);
          },
          () => {
            setWorkspace(null);
            setLoading(false);
          }
        );
      },
      () => {
        unsubscribeWorkspace?.();
        unsubscribeWorkspace = undefined;
        setProfile(null);
        setWorkspace(null);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeWorkspace?.();
      unsubscribeProfile();
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
