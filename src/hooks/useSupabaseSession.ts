import { useEffect, useState } from 'react';
import {
  getSupabaseSession,
  isSupabaseAuthConfigured,
  mapSupabaseUser,
  onSupabaseSessionChange,
  type SupabaseSessionUser,
} from '../lib/supabase-auth';

export function useSupabaseSession() {
  const [user, setUser] = useState<SupabaseSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseAuthConfigured()) {
      setUser(null);
      setLoading(false);
      return () => undefined;
    }

    const bootstrap = async () => {
      setLoading(true);
      try {
        const session = await getSupabaseSession();
        if (!cancelled) setUser(mapSupabaseUser(session?.user || null));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void bootstrap();

    const unsubscribe = onSupabaseSessionChange((session) => {
      setUser(mapSupabaseUser(session?.user || null));
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return [user, loading] as const;
}
