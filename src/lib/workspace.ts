import { addDays } from 'date-fns';
import type { User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { isAdminEmail } from './admin';

type WorkspaceRecord = {
  id: string;
  ownerId: string;
  name: string;
  plan: string;
  planId: string | null;
  subscriptionStatus: string;
  trialEndsAt: string | null;
};

function buildWorkspacePayload(user: User, fullName?: string | null) {
  const adminAccess = isAdminEmail(user.email);

  return {
    ownerId: user.uid,
    name: `${fullName || user.displayName || 'Moj'} Workspace`,
    plan: adminAccess ? 'closeflow_pro' : 'trial_14d',
    planId: adminAccess ? 'closeflow_pro' : 'trial_14d',
    subscriptionStatus: adminAccess ? 'paid_active' : 'trial_active',
    trialEndsAt: adminAccess ? null : addDays(new Date(), 14).toISOString(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function ensureWorkspaceForUser(user: User | null, preferredName?: string | null): Promise<WorkspaceRecord> {
  if (!user) {
    throw new Error('Brak aktywnej sesji.');
  }

  const profileRef = doc(db, 'profiles', user.uid);
  const profileSnap = await getDoc(profileRef);
  const profileData = profileSnap.exists() ? profileSnap.data() : null;
  const profileName = preferredName || profileData?.fullName || user.displayName || null;

  if (profileData?.workspaceId) {
    const workspaceRef = doc(db, 'workspaces', profileData.workspaceId);
    const workspaceSnap = await getDoc(workspaceRef);

    if (workspaceSnap.exists()) {
      const workspaceData = workspaceSnap.data();
      const adminAccess = isAdminEmail(user.email);

      if (
        adminAccess
        && (
          workspaceData.plan !== 'closeflow_pro'
          || workspaceData.planId !== 'closeflow_pro'
          || workspaceData.subscriptionStatus !== 'paid_active'
          || workspaceData.trialEndsAt
        )
      ) {
        await updateDoc(workspaceRef, {
          plan: 'closeflow_pro',
          planId: 'closeflow_pro',
          subscriptionStatus: 'paid_active',
          trialEndsAt: null,
          updatedAt: serverTimestamp(),
        });
      }

      return { id: workspaceSnap.id, ...(workspaceSnap.data() as Omit<WorkspaceRecord, 'id'>) };
    }
  }

  const workspaceQuery = query(collection(db, 'workspaces'), where('ownerId', '==', user.uid), limit(1));
  const workspaceSnapshot = await getDocs(workspaceQuery);

  let workspaceDoc = workspaceSnapshot.docs[0];

  if (!workspaceDoc) {
    const workspaceRef = await addDoc(collection(db, 'workspaces'), buildWorkspacePayload(user, profileName));
    workspaceDoc = await getDoc(workspaceRef);
  }

  await setDoc(profileRef, {
    email: user.email ?? null,
    fullName: profileName,
    workspaceId: workspaceDoc.id,
    timezone: profileData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    createdAt: profileData?.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return { id: workspaceDoc.id, ...(workspaceDoc.data() as Omit<WorkspaceRecord, 'id'>) };
}

export async function ensureCurrentUserWorkspace() {
  return ensureWorkspaceForUser(auth.currentUser);
}
