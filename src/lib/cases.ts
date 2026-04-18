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

import { db } from '../firebase';

export async function deleteCaseWithRelations(caseId: string) {
  const [itemsSnapshot, activitiesSnapshot, tasksSnapshot, eventsSnapshot, clientsSnapshot, leadsSnapshot] = await Promise.all([
    getDocs(collection(db, 'cases', caseId, 'items')),
    getDocs(query(collection(db, 'activities'), where('caseId', '==', caseId))),
    getDocs(query(collection(db, 'tasks'), where('caseId', '==', caseId))),
    getDocs(query(collection(db, 'events'), where('caseId', '==', caseId))),
    getDocs(query(collection(db, 'clients'), where('linkedCaseIds', 'array-contains', caseId))),
    getDocs(query(collection(db, 'leads'), where('linkedCaseId', '==', caseId))),
  ]);

  for (const entry of itemsSnapshot.docs) {
    await deleteDoc(entry.ref);
  }

  for (const entry of activitiesSnapshot.docs) {
    await deleteDoc(entry.ref);
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

  await deleteDoc(doc(db, 'cases', caseId));
}
