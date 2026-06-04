import { useEffect, useRef, useState } from 'react';
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

const STAGE220A34_SUPABASE_AUTH_NO_TAB_RETURN_REMOUNT = 'Supabase auth token refresh must not remount CloseFlow routes or close open modals after tab return';
void STAGE220A34_SUPABASE_AUTH_NO_TAB_RETURN_REMOUNT;

function buildStableSessionUserKey(user: SupabaseSessionUser | null) {
  if (!user) return 'none';
  return [
    user.uid || '',
    user.email || '',
    user.displayName || '',
    user.lastSignInAt || '',
    user.emailConfirmedAt || '',
    user.emailVerified ? '1' : '0',
    user.authProvider || '',
    (user.authProviders || []).join('|'),
  ].join('::');
}

export function useSupabaseSession() {
  const [user, setUser] = useState<SupabaseSessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const stableSessionUserKeyRef = useRef('__initial__');

  const applySessionUser = (nextUser: SupabaseSessionUser | null) => {
    const nextKey = buildStableSessionUserKey(nextUser);
    syncClientAuthSnapshotFromSessionUser(nextUser);
    if (stableSessionUserKeyRef.current === nextKey) return;
    stableSessionUserKeyRef.current = nextKey;
    setUser(nextUser);
  };

  useEffect(() => {
    let cancelled = false;

    if (!isSupabaseAuthConfigured()) {
      // Local UI work often does not need a real Supabase session. In dev, when auth
      // is not configured, expose a lightweight fake user so routes (e.g. /today)
      // can be previewed without setting up credentials.
      if (import.meta.env.DEV) {
        const devUser: SupabaseSessionUser = {
          uid: 'dev-local-user',
          id: 'dev-local-user',
          email: 'dev@localhost',
          displayName: 'Dev Local',
          lastSignInAt: new Date().toISOString(),
          emailConfirmedAt: new Date().toISOString(),
          emailVerified: true,
          authProvider: 'dev',
          authProviders: ['dev'],
          raw: {} as any,
        };

        applySessionUser(devUser);
        setLoading(false);
        return () => undefined;
      }

      applySessionUser(null);
      setLoading(false);
      return () => undefined;
    }

    const bootstrap = async () => {
      setLoading(true);
      try {
        const session = await getSupabaseSession();
        const nextUser = mapSupabaseUser(session?.user || null);
        if (!cancelled) {
          applySessionUser(nextUser);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void bootstrap();

    const unsubscribe = onSupabaseSessionChange((session) => {
      const nextUser = mapSupabaseUser(session?.user || null);
      applySessionUser(nextUser);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return [user, loading] as const;
}
