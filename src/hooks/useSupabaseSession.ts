import { useEffect, useState } from 'react';
import {
  getSupabaseSession,
  isSupabaseAuthConfigured,
  mapSupabaseUser,
  onSupabaseSessionChange,
  type SupabaseSessionUser,
} from '../lib/supabase-auth';
import { clearClientAuthSnapshot, setClientAuthSnapshot } from '../lib/client-auth';

// P0_AUTH_BOOTSTRAP_RACE_FIX
// Supabase session is the source of truth for API authorization. Keep the lightweight
// client auth snapshot in sync immediately, so workspace bootstrap does not depend
// on visiting another tab first.
function syncClientAuthSnapshotFromSessionUser(user: SupabaseSessionUser | null) {
  if (user) {
    setClientAuthSnapshot({
      uid: user.uid,
      email: user.email,
      fullName: user.displayName,
    });
    return;
  }

  clearClientAuthSnapshot();
}

export function useSupabaseSession() {
  const [user, setUser] = useState<SupabaseSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseAuthConfigured()) {
      clearClientAuthSnapshot();
      setUser(null);
      setLoading(false);
      return () => undefined;
    }

    const bootstrap = async () => {
      setLoading(true);
      try {
        const session = await getSupabaseSession();
        const nextUser = mapSupabaseUser(session?.user || null);
        if (!cancelled) {
          syncClientAuthSnapshotFromSessionUser(nextUser);
          setUser(nextUser);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void bootstrap();

    const unsubscribe = onSupabaseSessionChange((session) => {
      const nextUser = mapSupabaseUser(session?.user || null);
      syncClientAuthSnapshotFromSessionUser(nextUser);
      setUser(nextUser);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return [user, loading] as const;
}
