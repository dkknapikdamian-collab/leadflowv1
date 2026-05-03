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

type GoogleReminderMethod = 'default' | 'popup' | 'email' | 'popup_email';

type CloseFlowCalendarEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt?: string | null;
  reminderAt?: string | null;
  recurrenceRule?: string | null;
  recurrenceEndType?: string | null;
  recurrenceEndAt?: string | null;
  recurrenceCount?: number | null;
  kind?: string | null;
  relationLabel?: string | null;
  description?: string | null;
  sourceType?: string | null;
  sourceUrl?: string | null;
  googleReminderMethod?: GoogleReminderMethod | null;
  googleReminderMinutesBefore?: number | null;
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
  // GOOGLE_CALENDAR_STAGE08D_WORKSPACE_CONNECTION_FALLBACK
  // Runtime writes may arrive with a Supabase profile id while the OAuth state stored a different legacy uid.
  // First try the exact user connection, then safely fall back to the active workspace connection.
  const filters = [
    userId ? [
      `workspace_id=eq.${encodeURIComponent(workspaceId)}`,
      `user_id=eq.${encodeURIComponent(userId)}`,
      'disconnected_at=is.null',
      'select=*',
      'limit=1',
    ].join('&') : '',
    [
      `workspace_id=eq.${encodeURIComponent(workspaceId)}`,
      'disconnected_at=is.null',
      'sync_enabled=eq.true',
      'select=*',
      'limit=1',
    ].join('&'),
    [
      `workspace_id=eq.${encodeURIComponent(workspaceId)}`,
      'disconnected_at=is.null',
      'select=*',
      'limit=1',
    ].join('&'),
  ].filter(Boolean);

  for (const filter of filters) {
    const rows = await supabaseRequest(`google_calendar_connections?${filter}`, { method: 'GET' });
    if (Array.isArray(rows) && rows[0]) return rows[0] as GoogleCalendarConnection;
  }

  return null;
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

function normalizeGoogleReminderMethod(value: unknown): GoogleReminderMethod {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'email') return 'email';
  if (raw === 'popup_email' || raw === 'popup+email' || raw === 'both') return 'popup_email';
  if (raw === 'default') return 'default';
  return 'popup';
}

function clampGoogleReminderMinutes(value: unknown) {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? Number(value)
      : Number.NaN;
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.min(40320, Math.round(parsed)));
}

function minutesFromReminderAt(event: CloseFlowCalendarEvent) {
  if (!event.reminderAt || !event.startAt) return null;
  const startMs = new Date(event.startAt).getTime();
  const reminderMs = new Date(event.reminderAt).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(reminderMs)) return null;
  return Math.max(0, Math.min(40320, Math.round((startMs - reminderMs) / 60000)));
}

// GOOGLE_CALENDAR_SYNC_V1_STAGE05_REMINDER_METHOD_BACKEND
function buildReminderOverrides(event: CloseFlowCalendarEvent) {
  const method = normalizeGoogleReminderMethod(event.googleReminderMethod || (event.reminderAt ? 'popup' : 'default'));
  if (method === 'default') return { useDefault: true };

  const minutes = clampGoogleReminderMinutes(event.googleReminderMinutesBefore) ?? minutesFromReminderAt(event);
  if (minutes === null) return { useDefault: true };

  const overrides = method === 'popup_email'
    ? [{ method: 'popup', minutes }, { method: 'email', minutes }]
    : [{ method, minutes }];

  return {
    useDefault: false,
    overrides,
  };
}

// GOOGLE_CALENDAR_STAGE09_FULL_CALENDAR_PARITY
// Every CloseFlow calendar-visible item should carry its real title, time, reminder and recurrence into Google Calendar.
function buildGoogleRecurrenceRules(event: CloseFlowCalendarEvent) {
  const raw = String(event.recurrenceRule || '').trim().toLowerCase();
  if (!raw || raw === 'none') return undefined;

  const rules: string[] = [];
  if (raw === 'daily') rules.push('FREQ=DAILY');
  else if (raw === 'every_2_days') rules.push('FREQ=DAILY', 'INTERVAL=2');
  else if (raw === 'weekly') rules.push('FREQ=WEEKLY');
  else if (raw === 'monthly') rules.push('FREQ=MONTHLY');
  else if (raw === 'weekday') rules.push('FREQ=WEEKLY', 'BYDAY=MO,TU,WE,TH,FR');
  else return undefined;

  if (event.recurrenceEndType === 'count' && typeof event.recurrenceCount === 'number' && event.recurrenceCount > 0) {
    rules.push('COUNT=' + Math.min(366, Math.round(event.recurrenceCount)));
  }

  if (event.recurrenceEndType === 'until_date' && event.recurrenceEndAt) {
    const until = new Date(event.recurrenceEndAt);
    if (Number.isFinite(until.getTime())) {
      const y = until.getUTCFullYear();
      const m = String(until.getUTCMonth() + 1).padStart(2, '0');
      const d = String(until.getUTCDate()).padStart(2, '0');
      rules.push('UNTIL=' + y + m + d + 'T235959Z');
    }
  }

  return ['RRULE:' + rules.join(';')];
}

function buildGoogleDescription(event: CloseFlowCalendarEvent) {
  const lines = [
    event.description ? String(event.description).trim() : '',
    event.kind ? 'Typ CloseFlow: ' + event.kind : '',
    event.relationLabel ? 'Powiązanie: ' + event.relationLabel : '',
    'Źródło: CloseFlow',
  ].filter(Boolean);
  return lines.join('\n');
}


function normalizeGoogleCalendarRecurrence(rule: unknown) {
  const raw = String(rule || '').trim();
  if (!raw || raw === 'none' || raw === 'null' || raw === 'undefined') return null;
  if (/^RRULE:/i.test(raw)) return [raw.toUpperCase()];
  const normalized = raw.toLowerCase();
  const map: Record<string, string> = {
    daily: 'RRULE:FREQ=DAILY',
    every_2_days: 'RRULE:FREQ=DAILY;INTERVAL=2',
    weekly: 'RRULE:FREQ=WEEKLY',
    monthly: 'RRULE:FREQ=MONTHLY',
    weekday: 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
  };
  return map[normalized] ? [map[normalized]] : null;
}

function buildGoogleExtendedProperties(event: CloseFlowCalendarEvent) {
  return {
    private: {
      closeflowId: event.id || '',
      closeflowKind: event.sourceType || 'calendar_item',
      closeflowSync: 'stage09b_full_calendar_parity',
    },
  };
}

function normalizeGoogleCalendarSourceUrl(input?: string | null) {
  // GOOGLE_CALENDAR_STAGE09E_SAFE_SOURCE_URL
  const raw = String(input || '').trim();
  if (!raw) return '';

  const candidate =
    /^https?:\/\//i.test(raw)
      ? raw
      : (!raw.includes('://') && raw.includes('.'))
        ? 'https://' + raw
        : raw;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    if (!url.hostname || !url.hostname.includes('.')) return '';
    return url.toString();
  } catch {
    return '';
  }
}

function getGoogleCalendarSourceUrl(event: CloseFlowCalendarEvent) {
  const candidates = [
    event.sourceUrl,
    env('APP_URL'),
    env('RELEASE_PREVIEW_URL'),
    env('VERCEL_URL'),
  ];

  for (const candidate of candidates) {
    const normalized = normalizeGoogleCalendarSourceUrl(candidate);
    if (normalized) return normalized;
  }

  return '';
}

function buildGoogleEventBody(event: CloseFlowCalendarEvent) {
  // GOOGLE_CALENDAR_STAGE09B_FULL_BODY_PARITY
  // GOOGLE_CALENDAR_STAGE09E_SAFE_SOURCE_URL_BODY
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : new Date(start.getTime() + 60 * 60 * 1000);
  const body: Record<string, unknown> = {
    summary: event.title || 'CloseFlow event',
    description: event.description || undefined,
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    reminders: buildReminderOverrides(event),
    extendedProperties: buildGoogleExtendedProperties(event),
  };

  const sourceUrl = getGoogleCalendarSourceUrl(event);
  if (sourceUrl) body.source = { title: 'CloseFlow', url: sourceUrl };

  const recurrence = normalizeGoogleCalendarRecurrence(event.recurrenceRule);
  if (recurrence) body.recurrence = recurrence;
  return body;
}

type GoogleCalendarInboundConflict = {
  id: string;
  title: string;
  recordType: string;
  startAt: string;
  endAt: string;
};

type GoogleCalendarInboundChangedItem = {
  id: string;
  title: string;
  googleEventId: string;
  startAt: string;
  endAt: string;
  conflicts: GoogleCalendarInboundConflict[];
};

type GoogleCalendarInboundSyncResult = {
  ok: true;
  connected: boolean;
  imported: number;
  updated: number;
  deleted: number;
  skipped: number;
  conflicts: GoogleCalendarInboundChangedItem[];
  errors: string[];
};

function googleInboundText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function googleInboundIso(value: unknown) {
  const raw = googleInboundText(value);
  if (!raw) return '';
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : '';
}

function googleInboundDateTime(value: unknown, fallbackHour = '09:00:00') {
  if (!value || typeof value !== 'object') return '';
  const row = value as Record<string, unknown>;
  const dateTime = googleInboundIso(row.dateTime);
  if (dateTime) return dateTime;
  const date = googleInboundText(row.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
  return new Date(`${date}T${fallbackHour}`).toISOString();
}

function googleInboundEventStart(event: Record<string, unknown>) {
  return googleInboundDateTime(event.start, '09:00:00');
}

function googleInboundEventEnd(event: Record<string, unknown>, startAt: string) {
  const end = googleInboundDateTime(event.end, '10:00:00');
  if (end && new Date(end).getTime() > new Date(startAt).getTime()) return end;
  return new Date(new Date(startAt).getTime() + 60 * 60_000).toISOString();
}

function googleInboundPrivateProps(event: Record<string, unknown>) {
  const extended = event.extendedProperties && typeof event.extendedProperties === 'object'
    ? event.extendedProperties as Record<string, unknown>
    : {};
  const privateProps = extended.private && typeof extended.private === 'object'
    ? extended.private as Record<string, unknown>
    : {};
  return privateProps;
}

function googleInboundSafeUuid(value: unknown) {
  const raw = googleInboundText(value);
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw) ? raw : '';
}

export async function listGoogleCalendarEventsForInbound(input: {
  connection: GoogleCalendarConnection;
  timeMin: string;
  timeMax: string;
  updatedMin?: string | null;
}) {
  // GOOGLE_CALENDAR_STAGE10G_INBOUND_LIST_EVENTS_HELPER
  const accessToken = await getUsableAccessToken(input.connection);
  const calendarId = encodeURIComponent(String(input.connection.google_calendar_id || 'primary'));
  const params = new URLSearchParams({
    timeMin: input.timeMin,
    timeMax: input.timeMax,
    singleEvents: 'true',
    orderBy: 'updated',
    showDeleted: 'true',
    maxResults: '2500',
  });
  if (input.updatedMin) params.set('updatedMin', input.updatedMin);

  const response = await fetch(`${GOOGLE_CALENDAR_API_BASE}/calendars/${calendarId}/events?${params.toString()}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(String((data as any)?.error?.message || 'GOOGLE_INBOUND_EVENTS_LIST_FAILED'));
  }
  return Array.isArray((data as any).items) ? (data as any).items as Record<string, unknown>[] : [];
}

async function selectGoogleInboundExistingWorkItem(workspaceId: string, event: Record<string, unknown>) {
  const googleEventId = googleInboundText(event.id);
  const closeflowId = googleInboundSafeUuid(googleInboundPrivateProps(event).closeflowId);
  const calendarQueries = [
    closeflowId ? `work_items?workspace_id=eq.${encodeURIComponent(workspaceId)}&id=eq.${encodeURIComponent(closeflowId)}&select=*&limit=1` : '',
    googleEventId ? `work_items?workspace_id=eq.${encodeURIComponent(workspaceId)}&google_calendar_event_id=eq.${encodeURIComponent(googleEventId)}&select=*&limit=1` : '',
    googleEventId ? `work_items?workspace_id=eq.${encodeURIComponent(workspaceId)}&source_provider=eq.google_calendar&source_external_id=eq.${encodeURIComponent(googleEventId)}&select=*&limit=1` : '',
  ].filter(Boolean);

  for (const query of calendarQueries) {
    try {
      const rows = await supabaseRequest(query, { method: 'GET' });
      if (Array.isArray(rows) && rows[0]) return rows[0] as Record<string, unknown>;
    } catch {
      // Missing optional source columns before migration must not block fallback lookups.
    }
  }
  return null;
}

function buildGoogleInboundWorkItemPayload(input: {
  workspaceId: string;
  event: Record<string, unknown>;
  existing?: Record<string, unknown> | null;
}) {
  const event = input.event;
  const existing = input.existing || {};
  const googleEventId = googleInboundText(event.id);
  const startAt = googleInboundEventStart(event);
  const endAt = googleInboundEventEnd(event, startAt || new Date().toISOString());
  const recordType = googleInboundText(existing.record_type || existing.recordType) || 'event';
  const isTask = recordType === 'task';

  return {
    workspace_id: input.workspaceId,
    record_type: recordType,
    type: googleInboundText(existing.type) || 'external_google_event',
    title: googleInboundText(event.summary) || 'Wydarzenie z Google Calendar',
    description: googleInboundText(event.description),
    status: 'planned',
    priority: googleInboundText(existing.priority) || 'medium',
    scheduled_at: startAt || null,
    start_at: isTask ? (existing.start_at || null) : (startAt || null),
    end_at: isTask ? (existing.end_at || null) : (endAt || null),
    recurrence: 'none',
    reminder: 'none',
    show_in_tasks: isTask ? true : false,
    show_in_calendar: true,
    google_calendar_sync_enabled: true,
    google_calendar_id: 'primary',
    google_calendar_event_id: googleEventId || null,
    google_calendar_event_etag: googleInboundText(event.etag) || null,
    google_calendar_html_link: googleInboundText(event.htmlLink) || null,
    google_calendar_synced_at: new Date().toISOString(),
    google_calendar_sync_status: 'synced',
    google_calendar_sync_error: null,
    source_provider: 'google_calendar',
    source_external_id: googleEventId || null,
    source_calendar_id: 'primary',
    source_updated_at: googleInboundIso(event.updated) || null,
    source_synced_at: new Date().toISOString(),
    source_payload: event,
    updated_at: new Date().toISOString(),
  };
}

function googleInboundWindow(row: Record<string, unknown>) {
  const startRaw = googleInboundIso(row.start_at) || googleInboundIso(row.scheduled_at);
  if (!startRaw) return null;
  const endRaw = googleInboundIso(row.end_at);
  const startMs = new Date(startRaw).getTime();
  const endMs = endRaw ? new Date(endRaw).getTime() : startMs + 60 * 60_000;
  return {
    startAt: new Date(startMs).toISOString(),
    endAt: new Date(Math.max(endMs, startMs + 15 * 60_000)).toISOString(),
  };
}

async function findGoogleInboundConflicts(workspaceId: string, currentId: string, row: Record<string, unknown>) {
  // GOOGLE_CALENDAR_STAGE10G_INBOUND_CONFLICT_DETECTION
  const currentWindow = googleInboundWindow(row);
  if (!currentWindow) return [] as GoogleCalendarInboundConflict[];
  let candidates: Record<string, unknown>[] = [];
  try {
    const rows = await supabaseRequest(
      `work_items?workspace_id=eq.${encodeURIComponent(workspaceId)}&show_in_calendar=eq.true&select=id,title,record_type,start_at,end_at,scheduled_at&limit=500`,
      { method: 'GET' },
    );
    candidates = Array.isArray(rows) ? rows as Record<string, unknown>[] : [];
  } catch {
    return [];
  }

  const draftStart = new Date(currentWindow.startAt).getTime();
  const draftEnd = new Date(currentWindow.endAt).getTime();

  return candidates
    .filter((candidate) => String(candidate.id || '') !== currentId)
    .map((candidate) => ({ candidate, window: googleInboundWindow(candidate) }))
    .filter((item) => item.window)
    .filter((item) => {
      const start = new Date(item.window!.startAt).getTime();
      const end = new Date(item.window!.endAt).getTime();
      return draftStart < end && start < draftEnd;
    })
    .slice(0, 10)
    .map((item) => ({
      id: String(item.candidate.id || ''),
      title: googleInboundText(item.candidate.title) || 'Wpis w CloseFlow',
      recordType: googleInboundText(item.candidate.record_type) || 'event',
      startAt: item.window!.startAt,
      endAt: item.window!.endAt,
    }));
}

async function deleteGoogleInboundWorkItem(workspaceId: string, id: string) {
  return supabaseRequest(
    `work_items?workspace_id=eq.${encodeURIComponent(workspaceId)}&id=eq.${encodeURIComponent(id)}`,
    { method: 'DELETE', headers: { Prefer: 'return=representation' } },
  );
}

async function upsertGoogleInboundWorkItem(workspaceId: string, event: Record<string, unknown>) {
  const existing = await selectGoogleInboundExistingWorkItem(workspaceId, event);
  const payload = buildGoogleInboundWorkItemPayload({ workspaceId, event, existing });
  if (existing?.id) {
    const rows = await supabaseRequest(`work_items?id=eq.${encodeURIComponent(String(existing.id))}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return Array.isArray(rows) && rows[0] ? rows[0] as Record<string, unknown> : { ...existing, ...payload };
  }
  const rows = await supabaseRequest('work_items', {
    method: 'POST',
    body: JSON.stringify({ ...payload, created_at: new Date().toISOString() }),
  });
  return Array.isArray(rows) && rows[0] ? rows[0] as Record<string, unknown> : payload;
}

export async function syncInboundGoogleCalendarToCloseFlow(input: {
  workspaceId: string;
  userId?: string;
  timeMin?: string;
  timeMax?: string;
  updatedMin?: string | null;
}): Promise<GoogleCalendarInboundSyncResult> {
  // GOOGLE_CALENDAR_STAGE10G_INBOUND_SYNC_BACKEND
  const connection = await getGoogleCalendarConnection(input.workspaceId, input.userId || undefined);
  if (!connection || connection.sync_enabled === false) {
    return { ok: true, connected: false, imported: 0, updated: 0, deleted: 0, skipped: 0, conflicts: [], errors: [] };
  }

  const now = Date.now();
  const timeMin = googleInboundIso(input.timeMin) || new Date(now - 30 * 24 * 60 * 60_000).toISOString();
  const timeMax = googleInboundIso(input.timeMax) || new Date(now + 90 * 24 * 60 * 60_000).toISOString();
  const events = await listGoogleCalendarEventsForInbound({
    connection,
    timeMin,
    timeMax,
    updatedMin: input.updatedMin || null,
  });

  let imported = 0;
  let updated = 0;
  let deleted = 0;
  let skipped = 0;
  const conflicts: GoogleCalendarInboundChangedItem[] = [];
  const errors: string[] = [];

  for (const event of events) {
    const googleEventId = googleInboundText(event.id);
    if (!googleEventId) {
      skipped += 1;
      continue;
    }

    try {
      const existing = await selectGoogleInboundExistingWorkItem(input.workspaceId, event);
      const status = googleInboundText(event.status).toLowerCase();
      if (status === 'cancelled') {
        if (existing?.id) {
          await deleteGoogleInboundWorkItem(input.workspaceId, String(existing.id));
          deleted += 1;
        } else {
          skipped += 1;
        }
        continue;
      }

      const startAt = googleInboundEventStart(event);
      if (!startAt) {
        skipped += 1;
        continue;
      }

      const row = await upsertGoogleInboundWorkItem(input.workspaceId, event);
      const rowId = String(row.id || existing?.id || '');
      if (existing?.id) updated += 1;
      else imported += 1;

      const foundConflicts = rowId ? await findGoogleInboundConflicts(input.workspaceId, rowId, row) : [];
      if (foundConflicts.length) {
        const window = googleInboundWindow(row);
        conflicts.push({
          id: rowId,
          title: googleInboundText(row.title) || googleInboundText(event.summary) || 'Wydarzenie z Google Calendar',
          googleEventId,
          startAt: window?.startAt || startAt,
          endAt: window?.endAt || googleInboundEventEnd(event, startAt),
          conflicts: foundConflicts,
        });
      }
    } catch (error) {
      errors.push(String(error instanceof Error ? error.message : error).slice(0, 500));
    }
  }

  return { ok: true, connected: true, imported, updated, deleted, skipped, conflicts, errors };
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
