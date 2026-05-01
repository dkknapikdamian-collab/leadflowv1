import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

export type SupabaseSessionUser = {
  uid: string;
  id: string;
  email: string;
  displayName: string;
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
  emailVerified: boolean;
  authProvider: string | null;
  authProviders: string[];
  raw: User;
};

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';
const AUTH_ACCESS_TOKEN_RETRY_DELAYS_MS = [0, 120, 240, 480];

let client: SupabaseClient | null = null;

function sleepForAuthBootstrap(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

function getAuthProviders(user: User | null | undefined) {
  if (!user) return [];
  const appMeta = ((user as any).app_metadata && typeof (user as any).app_metadata === 'object') ? (user as any).app_metadata : {};
  const providers = Array.isArray(appMeta.providers) ? appMeta.providers : [];
  const primary = typeof appMeta.provider === 'string' ? appMeta.provider : '';
  const identityProviders = Array.isArray((user as any).identities)
    ? (user as any).identities.map((identity: any) => String(identity?.provider || '').trim()).filter(Boolean)
    : [];
  return [...new Set([primary, ...providers, ...identityProviders].map((provider) => String(provider || '').trim().toLowerCase()).filter(Boolean))];
}

function getPrimaryAuthProvider(user: User | null | undefined) {
  const providers = getAuthProviders(user);
  return providers[0] || null;
}

function getEmailConfirmedAt(user: User | null | undefined) {
  if (!user) return null;
  const raw = user as any;
  const confirmedAt = raw.email_confirmed_at || raw.confirmed_at || null;
  return typeof confirmedAt === 'string' && confirmedAt.trim() ? confirmedAt : null;
}

function hasVerifiedEmail(user: User | null | undefined) {
  if (!user) return false;
  if (getEmailConfirmedAt(user)) return true;

  const meta = ((user as any).user_metadata && typeof (user as any).user_metadata === 'object') ? (user as any).user_metadata : {};
  if (meta.email_verified === true || meta.emailVerified === true) return true;

  const identities = Array.isArray((user as any).identities) ? (user as any).identities : [];
  return identities.some((identity: any) => {
    const identityData = identity?.identity_data && typeof identity.identity_data === 'object' ? identity.identity_data : {};
    return identityData.email_verified === true || identityData.emailVerified === true;
  });
}

export function mapSupabaseUser(user: User | null | undefined): SupabaseSessionUser | null {
  if (!user) return null;
  return {
    uid: user.id,
    id: user.id,
    email: user.email || '',
    displayName: displayNameFromUser(user),
    lastSignInAt: user.last_sign_in_at || null,
    emailConfirmedAt: getEmailConfirmedAt(user),
    emailVerified: hasVerifiedEmail(user),
    authProvider: getPrimaryAuthProvider(user),
    authProviders: getAuthProviders(user),
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
  // P0_AUTH_HEADERS_WAIT_FOR_SESSION
  // After OAuth redirect Supabase can need a short moment to hydrate the browser
  // session. Without this, first Today/API requests may go out without Authorization.
  for (const delayMs of AUTH_ACCESS_TOKEN_RETRY_DELAYS_MS) {
    if (delayMs > 0) await sleepForAuthBootstrap(delayMs);
    const session = await getSupabaseSession();
    if (session?.access_token) return session.access_token;
  }

  return '';
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

export function isSupabaseEmailVerificationRequiredForUser(user: SupabaseSessionUser | null | undefined) {
  if (!user) return false;
  if (user.emailVerified) return false;

  const providers = (user.authProviders || []).map((provider) => String(provider || '').trim().toLowerCase()).filter(Boolean);
  const primary = String(user.authProvider || '').trim().toLowerCase();
  const hasEmailPasswordIdentity = primary === 'email' || providers.includes('email') || providers.includes('password') || (!primary && providers.length === 0);

  return hasEmailPasswordIdentity;
}

export async function resendEmailConfirmation(email: string) {
  const normalizedEmail = String(email || '').trim();
  if (!normalizedEmail) throw new Error('EMAIL_REQUIRED');

  const supabase = requireClient();
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: normalizedEmail,
    options: {
      emailRedirectTo: getAuthRedirectTo(),
    },
  });
  if (error) throw error;
  return data;
}

export async function reloadSupabaseUser() {
  const supabase = requireClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return mapSupabaseUser(data.user || null);
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
