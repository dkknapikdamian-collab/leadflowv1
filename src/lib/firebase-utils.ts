import { auth, db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  getDocFromServer,
  addDoc
} from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function seedTemplates() {
  if (!auth.currentUser) return;
  
  const templatesRef = collection(db, 'templates');
  const q = query(templatesRef, where('ownerId', '==', auth.currentUser.uid));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    const defaultTemplates = [
      {
        name: 'Strona WWW',
        ownerId: auth.currentUser.uid,
        items: [
          { title: 'Logo w formacie SVG', description: 'Potrzebujemy logotypu w wersji wektorowej.', type: 'file', isRequired: true },
          { title: 'Dostępy do hostingu/domeny', description: 'Login i hasło do panelu zarządzania.', type: 'text', isRequired: true },
          { title: 'Teksty na stronę główną', description: 'Przygotuj treść dla sekcji O nas, Usługi itp.', type: 'file', isRequired: true },
          { title: 'Zdjęcia zespołu/realizacji', description: 'Wysokiej jakości zdjęcia do galerii.', type: 'file', isRequired: false },
          { title: 'Akceptacja makiety', description: 'Czy akceptujesz układ strony?', type: 'decision', isRequired: true },
        ],
        createdAt: Timestamp.now(),
      },
      {
        name: 'Branding / Identyfikacja',
        ownerId: auth.currentUser.uid,
        items: [
          { title: 'Brief projektowy', description: 'Wypełniony dokument z Twoimi preferencjami.', type: 'file', isRequired: true },
          { title: 'Przykłady inspiracji', description: 'Linki lub pliki z projektami, które Ci się podobają.', type: 'text', isRequired: false },
          { title: 'Wybór wariantu kolorystycznego', description: 'Która paleta barw najbardziej Ci odpowiada?', type: 'decision', isRequired: true },
          { title: 'Akceptacja logotypu', description: 'Czy finalny projekt logotypu jest gotowy?', type: 'decision', isRequired: true },
        ],
        createdAt: Timestamp.now(),
      },
      {
        name: 'Kampania Ads',
        ownerId: auth.currentUser.uid,
        items: [
          { title: 'Dostęp do konta reklamowego', description: 'Nadaj uprawnienia administratora.', type: 'access', isRequired: true },
          { title: 'Materiały graficzne/wideo', description: 'Kreacje do reklam.', type: 'file', isRequired: true },
          { title: 'Lista słów kluczowych', description: 'Na jakie frazy chcesz się wyświetlać?', type: 'text', isRequired: true },
          { title: 'Akceptacja budżetu', description: 'Czy zatwierdzasz miesięczny budżet kampanii?', type: 'decision', isRequired: true },
        ],
        createdAt: Timestamp.now(),
      }
    ];

    for (const template of defaultTemplates) {
      await addDoc(templatesRef, template);
    }
    console.log('Templates seeded');
  }
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
