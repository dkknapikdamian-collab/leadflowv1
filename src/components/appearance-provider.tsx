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
import { auth } from '../firebase';
import { DEFAULT_SKIN, getSkinOption, isSkinId, SKIN_OPTIONS, type SkinId } from '../lib/appearance';
import { fetchMeFromSupabase, isSupabaseConfigured, updateProfileSettingsInSupabase } from '../lib/supabase-fallback';

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
    if (!isReady || !activeUserId || !isSupabaseConfigured()) {
      return;
    }

    let cancelled = false;

    const hydrateSkin = async () => {
      try {
        const me = await fetchMeFromSupabase({
          uid: activeUserId,
          email: auth.currentUser?.email || undefined,
          fullName: auth.currentUser?.displayName || undefined,
        });
        if (cancelled) return;
        const nextSkin = me?.profile?.appearanceSkin;
        if (isSkinId(nextSkin)) {
          setSkinState(nextSkin);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('APPEARANCE_PROFILE_READ_FAILED', error);
        }
      }
    };

    void hydrateSkin();

    const handleRefresh = () => {
      void hydrateSkin();
    };

    window.addEventListener('focus', handleRefresh);
    document.addEventListener('visibilitychange', handleRefresh);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', handleRefresh);
      document.removeEventListener('visibilitychange', handleRefresh);
    };
  }, [activeUserId, isReady]);

  const setSkin = useCallback(async (nextSkin: SkinId) => {
    setSkinState(nextSkin);
    applySkinToDocument(nextSkin);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextSkin);
    }

    if (!activeUserId || !isSupabaseConfigured()) {
      return;
    }

    await updateProfileSettingsInSupabase({
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
