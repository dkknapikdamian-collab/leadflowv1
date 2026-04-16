import { addDays } from 'date-fns';
import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { isAdminEmail } from './admin';

export async function ensureCurrentUserWorkspace() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Brak aktywnej sesji.');
  }

  const profileRef = doc(db, 'profiles', user.uid);
  const profileSnap = await getDoc(profileRef);
  const profileData = profileSnap.exists() ? profileSnap.data() : null;

  if (profileData?.workspaceId) {
    return { id: profileData.workspaceId };
  }

  const workspaceQuery = query(collection(db, 'workspaces'), where('ownerId', '==', user.uid), limit(1));
  const workspaceSnapshot = await getDocs(workspaceQuery);

  let workspaceId = workspaceSnapshot.docs[0]?.id;

  if (!workspaceId) {
    const adminAccess = isAdminEmail(user.email);
    const workspaceRef = await addDoc(collection(db, 'workspaces'), {
      ownerId: user.uid,
      name: `${profileData?.fullName || user.displayName || 'Moj'} Workspace`,
      plan: adminAccess ? 'pro' : 'free',
      planId: adminAccess ? 'pro' : null,
      subscriptionStatus: adminAccess ? 'paid_active' : 'trial_active',
      trialEndsAt: adminAccess ? null : addDays(new Date(), 7).toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    workspaceId = workspaceRef.id;
  }

  await setDoc(profileRef, {
    email: user.email ?? null,
    fullName: profileData?.fullName || user.displayName || null,
    workspaceId,
    timezone: profileData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    createdAt: profileData?.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return { id: workspaceId };
}
