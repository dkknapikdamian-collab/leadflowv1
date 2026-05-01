import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Firebase runtime is legacy compatibility only during migration.
// Do not add new collections or business data here.
// Supabase Auth/Postgres/Storage is the target stack.
export const storage = getStorage(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

