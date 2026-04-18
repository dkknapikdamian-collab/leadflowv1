import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { DEFAULT_SKIN, getSkinOption, isSkinId, SKIN_OPTIONS, type SkinId } from '../lib/appearance';
import { isSupabaseConfigured } from '../lib/supabase-fallback';

const STORAGE_KEY = 'forteca-appearance-skin';

type AppearanceContextValue = {
  skin: SkinId;
  setSkin: (skin: SkinId) => Promise<void>;
  toastTheme: 'light' | 'dark';
  skinOptions: typeof SKIN_OPTIONS;
  isReady: boolean;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function resolveStoredSkin(): SkinId {
  if (typeof window === 'undefined') {
    return DEFAULT_SKIN;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isSkinId(stored) ? stored : DEFAULT_SKIN;
}

function applySkinToDocument(skin: SkinId) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.skin = skin;
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [skin, setSkinState] = useState<SkinId>(DEFAULT_SKIN);
  const [isReady, setIsReady] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  useEffect(() => {
    const initialSkin = resolveStoredSkin();
    setSkinState(initialSkin);
    applySkinToDocument(initialSkin);
    setIsReady(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setActiveUserId(user?.uid ?? null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    applySkinToDocument(skin);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, skin);
    }
  }, [isReady, skin]);

  useEffect(() => {
    if (!isReady || !activeUserId) {
      return;
    }

    if (isSupabaseConfigured()) {
      return;
    }

    const profileRef = doc(db, 'profiles', activeUserId);
    let isMounted = true;

    const hydrateFromProfile = async () => {
      const profileSnap = await getDoc(profileRef);
      if (!isMounted || !profileSnap.exists()) {
        return;
      }

      const profileSkin = profileSnap.data()?.appearanceSkin;
      if (isSkinId(profileSkin)) {
        setSkinState(profileSkin);
      }
    };

    hydrateFromProfile();

    const unsubscribe = onSnapshot(profileRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      const profileSkin = snapshot.data()?.appearanceSkin;
      if (isSkinId(profileSkin)) {
        setSkinState(profileSkin);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [activeUserId, isReady]);

  const setSkin = useCallback(async (nextSkin: SkinId) => {
    setSkinState(nextSkin);
    applySkinToDocument(nextSkin);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextSkin);
    }

    if (!activeUserId) {
      return;
    }

    if (isSupabaseConfigured()) {
      return;
    }

    const profileRef = doc(db, 'profiles', activeUserId);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      return;
    }

    await updateDoc(profileRef, {
      appearanceSkin: nextSkin,
    });
  }, [activeUserId]);

  const value = useMemo<AppearanceContextValue>(() => ({
    skin,
    setSkin,
    toastTheme: getSkinOption(skin).toastTheme,
    skinOptions: SKIN_OPTIONS,
    isReady,
  }), [skin, setSkin, isReady]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }

  return context;
}
