import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Firebase runtime is legacy compatibility only during migration.
// Firestore is intentionally not initialized or exported.
// Supabase Auth/Postgres/Storage is the target stack for business data.
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
