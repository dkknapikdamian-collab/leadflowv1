import { supabaseRequest } from './_supabase.js';
import { encryptGoogleSecret } from './google-calendar-sync.js';

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
};

type GoogleCalendarConnection = Record<string, any>;

function encode(value: unknown) {
  return encodeURIComponent(String(value || ''));
}

export function googleCalendarConnectionUserId(connection?: GoogleCalendarConnection | null) {
  return String(connection?.user_id || connection?.userId || '').trim();
}

export function isUserScopedGoogleCalendarConnection(connection: GoogleCalendarConnection | null | undefined, userId: string) {
  const expected = String(userId || '').trim();
  return Boolean(connection && expected && googleCalendarConnectionUserId(connection) === expected);
}

export async function getGoogleCalendarUserConnection(workspaceId: string, userId: string) {
  const workspace = String(workspaceId || '').trim();
  const user = String(userId || '').trim();
  if (!workspace || !user) return null;

  const filter = [
    `workspace_id=eq.${encode(workspace)}`,
    `user_id=eq.${encode(user)}`,
    'disconnected_at=is.null',
    'select=*',
    'limit=1',
  ].join('&');

  const rows = await supabaseRequest(`google_calendar_connections?${filter}`, { method: 'GET' });
  const connection = Array.isArray(rows) ? rows[0] : null;
  return isUserScopedGoogleCalendarConnection(connection, user) ? connection : null;
}

export async function getGoogleCalendarLegacyWorkspaceConnection(workspaceId: string, userId?: string) {
  const workspace = String(workspaceId || '').trim();
  const user = String(userId || '').trim();
  if (!workspace) return null;

  const filter = [
    `workspace_id=eq.${encode(workspace)}`,
    'disconnected_at=is.null',
    'sync_enabled=eq.true',
    'select=*',
    'limit=20',
  ].join('&');

  const rows = await supabaseRequest(`google_calendar_connections?${filter}`, { method: 'GET' });
  const list = Array.isArray(rows) ? rows : [];
  return list.find((connection) => !user || !isUserScopedGoogleCalendarConnection(connection, user)) || null;
}

export async function upsertGoogleCalendarUserConnection(input: {
  workspaceId: string;
  userId: string;
  tokens: GoogleTokenResponse;
  googleAccountEmail?: string | null;
}) {
  const workspaceId = String(input.workspaceId || '').trim();
  const userId = String(input.userId || '').trim();
  if (!workspaceId) throw new Error('GOOGLE_CALENDAR_WORKSPACE_REQUIRED');
  if (!userId) throw new Error('GOOGLE_CALENDAR_USER_REQUIRED');

  const nowIso = new Date().toISOString();
  const expiresAt = input.tokens.expires_in
    ? new Date(Date.now() + Number(input.tokens.expires_in) * 1000).toISOString()
    : null;

  // STAGE231F_USER_SCOPE_REFRESH_TOKEN_GUARD:
  // Reuse refresh token only from the same workspaceId + userId. Never borrow a workspace fallback token.
  const current = await getGoogleCalendarUserConnection(workspaceId, userId);
  const currentRefresh = current?.refresh_token_ciphertext || null;
  const refreshTokenCiphertext = input.tokens.refresh_token
    ? encryptGoogleSecret(input.tokens.refresh_token)
    : currentRefresh;

  const payload = {
    workspace_id: workspaceId,
    user_id: userId,
    google_account_email: input.googleAccountEmail || current?.google_account_email || null,
    google_calendar_id: 'primary',
    access_token_ciphertext: encryptGoogleSecret(input.tokens.access_token || ''),
    refresh_token_ciphertext: refreshTokenCiphertext,
    token_expires_at: expiresAt,
    scope: input.tokens.scope || null,
    sync_enabled: true,
    disconnected_at: null,
    connected_at: nowIso,
    updated_at: nowIso,
  };

  return supabaseRequest('google_calendar_connections?on_conflict=workspace_id,user_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(payload),
  });
}
