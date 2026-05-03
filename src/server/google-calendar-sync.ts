import crypto from 'crypto';
import { supabaseRequest } from './_supabase.js';

type GoogleCalendarConfigStatus = {
  configured: boolean;
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasRedirectUri: boolean;
  hasTokenEncryptionKey: boolean;
  redirectUri: string;
  missing: string[];
};

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleCalendarConnection = {
  id?: string;
  workspace_id?: string;
  workspaceId?: string;
  user_id?: string;
  userId?: string;
  google_calendar_id?: string;
  googleCalendarId?: string;
  google_account_email?: string;
  access_token_ciphertext?: string | null;
  refresh_token_ciphertext?: string | null;
  token_expires_at?: string | null;
  sync_enabled?: boolean;
};

type CloseFlowCalendarEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt?: string | null;
  reminderAt?: string | null;
  recurrenceRule?: string | null;
};

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_CALENDAR_SCOPES = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/calendar.events',
];

function env(name: string) {
  return String(process.env[name] || '').trim();
}

export function getGoogleCalendarConfigStatus(): GoogleCalendarConfigStatus {
  const hasClientId = Boolean(env('GOOGLE_CLIENT_ID'));
  const hasClientSecret = Boolean(env('GOOGLE_CLIENT_SECRET'));
  const redirectUri = env('GOOGLE_REDIRECT_URI') || env('GOOGLE_CALENDAR_REDIRECT_URI');
  const hasRedirectUri = Boolean(redirectUri);
  const hasTokenEncryptionKey = Boolean(env('GOOGLE_TOKEN_ENCRYPTION_KEY') || env('CRON_SECRET'));
  const missing: string[] = [];
  if (!hasClientId) missing.push('GOOGLE_CLIENT_ID');
  if (!hasClientSecret) missing.push('GOOGLE_CLIENT_SECRET');
  if (!hasRedirectUri) missing.push('GOOGLE_REDIRECT_URI');
  if (!hasTokenEncryptionKey) missing.push('GOOGLE_TOKEN_ENCRYPTION_KEY');
  return {
    configured: hasClientId && hasClientSecret && hasRedirectUri && hasTokenEncryptionKey,
    hasClientId,
    hasClientSecret,
    hasRedirectUri,
    hasTokenEncryptionKey,
    redirectUri,
    missing,
  };
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function signState(payload: string) {
  const secret = env('GOOGLE_OAUTH_STATE_SECRET') || env('CRON_SECRET') || env('GOOGLE_TOKEN_ENCRYPTION_KEY');
  if (!secret) throw new Error('GOOGLE_OAUTH_STATE_SECRET_REQUIRED');
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createGoogleOAuthState(input: { workspaceId: string; userId: string; returnTo?: string }) {
  const payload = base64url(JSON.stringify({
    workspaceId: input.workspaceId,
    userId: input.userId,
    returnTo: input.returnTo || '/settings',
    createdAt: Date.now(),
  }));
  return `${payload}.${signState(payload)}`;
}

export function verifyGoogleOAuthState(state: string) {
  const [payload, signature] = String(state || '').split('.');
  if (!payload || !signature) throw new Error('GOOGLE_OAUTH_STATE_INVALID');
  const expected = signState(payload);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error('GOOGLE_OAUTH_STATE_INVALID');
  }
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!data?.workspaceId || !data?.userId) throw new Error('GOOGLE_OAUTH_STATE_INVALID');
  if (Date.now() - Number(data.createdAt || 0) > 15 * 60 * 1000) throw new Error('GOOGLE_OAUTH_STATE_EXPIRED');
  return data as { workspaceId: string; userId: string; returnTo?: string; createdAt: number };
}

function encryptionKey() {
  const secret = env('GOOGLE_TOKEN_ENCRYPTION_KEY') || env('CRON_SECRET');
  if (!secret) throw new Error('GOOGLE_TOKEN_ENCRYPTION_KEY_REQUIRED');
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptGoogleSecret(value?: string | null) {
  if (!value) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ['v1', base64url(iv), base64url(tag), base64url(encrypted)].join('.');
}

export function decryptGoogleSecret(value?: string | null) {
  if (!value) return '';
  const [version, ivRaw, tagRaw, dataRaw] = String(value).split('.');
  if (version !== 'v1' || !ivRaw || !tagRaw || !dataRaw) throw new Error('GOOGLE_TOKEN_CIPHERTEXT_INVALID');
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(ivRaw, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(dataRaw, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

export function buildGoogleCalendarOAuthUrl(input: { workspaceId: string; userId: string; returnTo?: string }) {
  const cfg = getGoogleCalendarConfigStatus();
  if (!cfg.configured) throw new Error('GOOGLE_CALENDAR_CONFIG_REQUIRED');
  const state = createGoogleOAuthState(input);
  const params = new URLSearchParams({
    client_id: env('GOOGLE_CLIENT_ID'),
    redirect_uri: cfg.redirectUri,
    response_type: 'code',
    scope: GOOGLE_CALENDAR_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeGoogleCalendarCode(code: string) {
  const cfg = getGoogleCalendarConfigStatus();
  if (!cfg.configured) throw new Error('GOOGLE_CALENDAR_CONFIG_REQUIRED');
  const body = new URLSearchParams({
    code,
    client_id: env('GOOGLE_CLIENT_ID'),
    client_secret: env('GOOGLE_CLIENT_SECRET'),
    redirect_uri: cfg.redirectUri,
    grant_type: 'authorization_code',
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await response.json() as GoogleTokenResponse;
  if (!response.ok || data.error) throw new Error(data.error_description || data.error || 'GOOGLE_TOKEN_EXCHANGE_FAILED');
  return data;
}

export async function refreshGoogleCalendarAccessToken(connection: GoogleCalendarConnection) {
  const refreshToken = decryptGoogleSecret(connection.refresh_token_ciphertext);
  if (!refreshToken) throw new Error('GOOGLE_REFRESH_TOKEN_MISSING');
  const body = new URLSearchParams({
    client_id: env('GOOGLE_CLIENT_ID'),
    client_secret: env('GOOGLE_CLIENT_SECRET'),
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await response.json() as GoogleTokenResponse;
  if (!response.ok || data.error || !data.access_token) throw new Error(data.error_description || data.error || 'GOOGLE_TOKEN_REFRESH_FAILED');

  const expiresAt = new Date(Date.now() + Number(data.expires_in || 3600) * 1000).toISOString();
  await supabaseRequest(
    `google_calendar_connections?id=eq.${encodeURIComponent(String(connection.id || ''))}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        access_token_ciphertext: encryptGoogleSecret(data.access_token),
        token_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
        last_error: null,
      }),
    },
  );

  return { accessToken: data.access_token, expiresAt };
}

export async function getGoogleCalendarConnection(workspaceId: string, userId?: string) {
  const filter = [
    `workspace_id=eq.${encodeURIComponent(workspaceId)}`,
    userId ? `user_id=eq.${encodeURIComponent(userId)}` : '',
    'disconnected_at=is.null',
    'select=*',
    'limit=1',
  ].filter(Boolean).join('&');
  const rows = await supabaseRequest(`google_calendar_connections?${filter}`, { method: 'GET' });
  return Array.isArray(rows) && rows[0] ? rows[0] as GoogleCalendarConnection : null;
}

export async function upsertGoogleCalendarConnection(input: {
  workspaceId: string;
  userId: string;
  tokens: GoogleTokenResponse;
  googleAccountEmail?: string | null;
}) {
  const nowIso = new Date().toISOString();
  const expiresAt = input.tokens.expires_in
    ? new Date(Date.now() + Number(input.tokens.expires_in) * 1000).toISOString()
    : null;

  const current = await getGoogleCalendarConnection(input.workspaceId, input.userId);
  const currentRefresh = current?.refresh_token_ciphertext || null;
  const refreshTokenCiphertext = input.tokens.refresh_token
    ? encryptGoogleSecret(input.tokens.refresh_token)
    : currentRefresh;

  const payload = {
    workspace_id: input.workspaceId,
    user_id: input.userId,
    google_account_email: input.googleAccountEmail || null,
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

export async function disconnectGoogleCalendarConnection(workspaceId: string, userId: string) {
  return supabaseRequest(
    `google_calendar_connections?workspace_id=eq.${encodeURIComponent(workspaceId)}&user_id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        sync_enabled: false,
        disconnected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    },
  );
}

async function getUsableAccessToken(connection: GoogleCalendarConnection) {
  const expiresAt = connection.token_expires_at ? new Date(connection.token_expires_at).getTime() : 0;
  if (expiresAt > Date.now() + 2 * 60 * 1000) {
    return decryptGoogleSecret(connection.access_token_ciphertext);
  }
  return (await refreshGoogleCalendarAccessToken(connection)).accessToken;
}

function buildReminderOverrides(event: CloseFlowCalendarEvent) {
  if (!event.reminderAt || !event.startAt) return { useDefault: true };
  const minutes = Math.max(0, Math.min(40320, Math.round((new Date(event.startAt).getTime() - new Date(event.reminderAt).getTime()) / 60000)));
  return {
    useDefault: false,
    overrides: [{ method: 'popup', minutes }],
  };
}

function buildGoogleEventBody(event: CloseFlowCalendarEvent) {
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : new Date(start.getTime() + 60 * 60 * 1000);
  return {
    summary: event.title || 'CloseFlow event',
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    reminders: buildReminderOverrides(event),
    source: {
      title: 'CloseFlow',
      url: env('APP_URL') || env('RELEASE_PREVIEW_URL') || '',
    },
  };
}

export async function createGoogleCalendarEvent(connection: GoogleCalendarConnection, event: CloseFlowCalendarEvent) {
  const accessToken = await getUsableAccessToken(connection);
  const calendarId = encodeURIComponent(String(connection.google_calendar_id || 'primary'));
  const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/${calendarId}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildGoogleEventBody(event)),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String((data as any)?.error?.message || 'GOOGLE_EVENT_CREATE_FAILED'));
  return data;
}

export async function updateGoogleCalendarEvent(connection: GoogleCalendarConnection, googleEventId: string, event: CloseFlowCalendarEvent) {
  const accessToken = await getUsableAccessToken(connection);
  const calendarId = encodeURIComponent(String(connection.google_calendar_id || 'primary'));
  const eventId = encodeURIComponent(googleEventId);
  const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/${calendarId}/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildGoogleEventBody(event)),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String((data as any)?.error?.message || 'GOOGLE_EVENT_UPDATE_FAILED'));
  return data;
}

export async function deleteGoogleCalendarEvent(connection: GoogleCalendarConnection, googleEventId: string) {
  const accessToken = await getUsableAccessToken(connection);
  const calendarId = encodeURIComponent(String(connection.google_calendar_id || 'primary'));
  const eventId = encodeURIComponent(googleEventId);
  const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/${calendarId}/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok && response.status !== 410 && response.status !== 404) {
    const data = await response.json().catch(() => ({}));
    throw new Error(String((data as any)?.error?.message || 'GOOGLE_EVENT_DELETE_FAILED'));
  }
  return { ok: true };
}
