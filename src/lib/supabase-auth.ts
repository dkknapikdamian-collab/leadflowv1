import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

export type SupabaseSessionUser = {
  uid: string;
  id: string;
  email: string;
  displayName: string;
  lastSignInAt: string | null;
  raw: User;
};

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

let client: SupabaseClient | null = null;

export function isSupabaseAuthConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function getSupabaseAuthConfig() {
  return {
    url: SUPABASE_URL,
    hasAnonKey: Boolean(SUPABASE_ANON_KEY),
    configured: isSupabaseAuthConfigured(),
  };
}

export function getSupabaseClient() {
  if (!isSupabaseAuthConfigured()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

function displayNameFromUser(user: User | null | undefined) {
  if (!user) return '';
  const meta = user.user_metadata || {};
  return String(meta.full_name || meta.name || meta.display_name || '').trim();
}

export function mapSupabaseUser(user: User | null | undefined): SupabaseSessionUser | null {
  if (!user) return null;
  return {
    uid: user.id,
    id: user.id,
    email: user.email || '',
    displayName: displayNameFromUser(user),
    lastSignInAt: user.last_sign_in_at || null,
    raw: user,
  };
}

function getAuthRedirectTo() {
  if (typeof window === 'undefined') return undefined;
  return window.location.origin;
}

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('SUPABASE_AUTH_NOT_CONFIGURED');
  return supabase;
}

export async function getSupabaseSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session || null;
}

export async function getSupabaseAccessToken() {
  const session = await getSupabaseSession();
  return session?.access_token || '';
}

export async function refreshSupabaseSession() {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return data.session || null;
}

export async function signInWithGoogle() {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthRedirectTo(),
      queryParams: { prompt: 'select_account' },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithPassword(email: string, password: string, fullName: string) {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthRedirectTo(),
      data: { full_name: fullName, name: fullName },
    },
  });
  if (error) throw error;
  return data;
}

export async function sendPasswordReset(email: string) {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthRedirectTo(),
  });
  if (error) throw error;
  return data;
}

export async function signOutFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onSupabaseSessionChange(listener: (session: Session | null) => void) {
  const supabase = getSupabaseClient();
  if (!supabase) return () => undefined;
  const { data } = supabase.auth.onAuthStateChange((_event, session) => listener(session || null));
  return () => data.subscription.unsubscribe();
}
