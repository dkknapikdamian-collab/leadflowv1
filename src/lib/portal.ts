import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function createToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function isPortalTokenActive(data: Record<string, any> | undefined, token?: string) {
  if (!data || !token) return false;
  if (data.revokedAt) return false;

  const expiresAt = data.expiresAt?.toDate?.() ?? null;
  if (expiresAt && expiresAt.getTime() < Date.now()) return false;

  return data.token === token;
}

export async function ensurePortalToken(caseId: string) {
  const tokenRef = doc(db, 'client_portal_tokens', caseId);
  const tokenSnap = await getDoc(tokenRef);

  if (tokenSnap.exists()) {
    const data = tokenSnap.data() as Record<string, any>;
    if (isPortalTokenActive(data, data.token)) {
      await updateDoc(doc(db, 'cases', caseId), {
        portalToken: data.token,
        portalReadyAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return data.token as string;
    }
  }

  const token = createToken();
  await setDoc(tokenRef, {
    caseId,
    token,
    createdAt: serverTimestamp(),
    issuedAt: serverTimestamp(),
    revokedAt: null,
    expiresAt: null,
  });

  await updateDoc(doc(db, 'cases', caseId), {
    portalToken: token,
    portalReadyAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return token;
}
