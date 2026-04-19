import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { auth, db } from '../firebase';
import { deleteCaseFromSupabase, isSupabaseConfigured } from './supabase-fallback';

async function safeQueryDocs(pathFactory: () => Promise<any>) {
  try {
    return await pathFactory();
  } catch {
    return { docs: [] as any[] };
  }
}

export async function deleteCaseWithRelations(caseId: string) {
  if (isSupabaseConfigured()) {
    await deleteCaseFromSupabase(caseId);
    return;
  }

  const ownerId = auth.currentUser?.uid;
  if (!ownerId) {
    throw new Error('Brak zalogowanego użytkownika.');
  }

  const itemsSnapshot = await getDocs(collection(db, 'cases', caseId, 'items'));
  const activitiesSnapshot = await safeQueryDocs(() => getDocs(query(collection(db, 'activities'), where('caseId', '==', caseId))));
  const tasksSnapshot = await safeQueryDocs(() => getDocs(query(collection(db, 'tasks'), where('ownerId', '==', ownerId), where('caseId', '==', caseId))));
  const eventsSnapshot = await safeQueryDocs(() => getDocs(query(collection(db, 'events'), where('ownerId', '==', ownerId), where('caseId', '==', caseId))));
  const clientsSnapshot = await safeQueryDocs(() => getDocs(query(collection(db, 'clients'), where('ownerId', '==', ownerId), where('linkedCaseIds', 'array-contains', caseId))));
  const leadsSnapshot = await safeQueryDocs(() => getDocs(query(collection(db, 'leads'), where('ownerId', '==', ownerId), where('linkedCaseId', '==', caseId))));

  for (const entry of itemsSnapshot.docs) {
    await deleteDoc(entry.ref);
  }

  for (const entry of activitiesSnapshot.docs) {
    try {
      await deleteDoc(entry.ref);
    } catch {
      // część aktywności mogła powstać z portalu klienta i nie przechodzić reguł delete dla operatora
    }
  }

  for (const entry of tasksSnapshot.docs) {
    await updateDoc(entry.ref, {
      caseId: null,
      caseTitle: null,
    });
  }

  for (const entry of eventsSnapshot.docs) {
    await updateDoc(entry.ref, {
      caseId: null,
      caseTitle: null,
    });
  }

  for (const entry of clientsSnapshot.docs) {
    const currentPrimaryCaseId = entry.data().primaryCaseId;
    await updateDoc(entry.ref, {
      linkedCaseIds: arrayRemove(caseId),
      primaryCaseId: currentPrimaryCaseId === caseId ? null : currentPrimaryCaseId || null,
    });
  }

  for (const entry of leadsSnapshot.docs) {
    await updateDoc(entry.ref, {
      linkedCaseId: null,
    });
  }

  try {
    await deleteDoc(doc(db, 'client_portal_tokens', caseId));
  } catch {
    // token może nie istnieć albo użytkownik może nie mieć do niego dostępu
  }

  await deleteDoc(doc(db, 'cases', caseId));
}
