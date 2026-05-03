import { deleteById, insertWithVariants, supabaseRequest, updateById } from './_supabase.js';
import { getGoogleCalendarAccessToken, getGoogleCalendarConnection } from './google-calendar-sync.js';

type InboundSyncInput = {
  workspaceId: string;
  userId?: string;
  daysBack?: number;
  daysForward?: number;
};

type GoogleCalendarEventItem = {
  id?: string;
  status?: string;
  summary?: string;
  description?: string;
  updated?: string;
  htmlLink?: string;
  iCalUID?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  extendedProperties?: { private?: Record<string, string>; shared?: Record<string, string> };
};

type CalendarWindow = { startAt: string; endAt: string };

const GOOGLE_CALENDAR_STAGE10J_INBOUND_BACKEND = 'GOOGLE_CALENDAR_STAGE10J_INBOUND_BACKEND';
const GOOGLE_CALENDAR_STAGE10J_UPDATED_MIN_CURSOR = 'GOOGLE_CALENDAR_STAGE10J_UPDATED_MIN_CURSOR';
void GOOGLE_CALENDAR_STAGE10J_INBOUND_BACKEND;
void GOOGLE_CALENDAR_STAGE10J_UPDATED_MIN_CURSOR;

function asText(value: unknown) { return typeof value === 'string' ? value.trim() : ''; }
function isUuid(value: unknown) { return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
function parseDate(value: unknown) { const raw = asText(value); if (!raw) return null; const parsed = new Date(raw); return Number.isFinite(parsed.getTime()) ? parsed : null; }
function iso(value: unknown) { const parsed = parseDate(value); return parsed ? parsed.toISOString() : null; }

function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  if (match?.[1]) return match[1];
  const alt = message.match(/column "([^"]+)" does not exist/i);
  return alt?.[1] || null;
}

async function safeUpdateWorkItem(id: string, payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try { return await updateById('work_items', id, current); }
    catch (error) { const missingColumn = extractMissingColumn(error); if (!missingColumn || !(missingColumn in current)) throw error; delete current[missingColumn]; }
  }
  throw new Error('GOOGLE_INBOUND_SAFE_UPDATE_EXHAUSTED');
}

async function safeInsertWorkItem(payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try { return await insertWithVariants(['work_items'], [current]); }
    catch (error) { const missingColumn = extractMissingColumn(error); if (!missingColumn || !(missingColumn in current)) throw error; delete current[missingColumn]; }
  }
  throw new Error('GOOGLE_INBOUND_SAFE_INSERT_EXHAUSTED');
}

async function safeConnectionUpdate(connectionId: unknown, payload: Record<string, unknown>) {
  const id = asText(connectionId);
  if (!id) return null;
  let current = { ...payload };
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try { return await updateById('google_calendar_connections', id, current); }
    catch (error) { const missingColumn = extractMissingColumn(error); if (!missingColumn || !(missingColumn in current)) return null; delete current[missingColumn]; }
  }
  return null;
}

function googleEventStart(event: GoogleCalendarEventItem) { return iso(event.start?.dateTime) || iso(event.start?.date) || null; }
function googleEventEnd(event: GoogleCalendarEventItem, startAt: string) { const explicit = iso(event.end?.dateTime) || iso(event.end?.date); if (explicit && new Date(explicit).getTime() > new Date(startAt).getTime()) return explicit; return new Date(new Date(startAt).getTime() + 60 * 60_000).toISOString(); }
function getCloseFlowIdFromGoogle(event: GoogleCalendarEventItem) { const privateProps = event.extendedProperties?.private || {}; const sharedProps = event.extendedProperties?.shared || {}; return asText(privateProps.closeflowId || privateProps.closeFlowId || sharedProps.closeflowId || sharedProps.closeFlowId || ''); }
function rowStartAt(row: Record<string, unknown>) { return iso(row.start_at) || iso(row.scheduled_at) || iso(row.startAt) || null; }
function rowEndAt(row: Record<string, unknown>, startAt: string) { const explicit = iso(row.end_at) || iso(row.endAt); if (explicit && new Date(explicit).getTime() > new Date(startAt).getTime()) return explicit; return new Date(new Date(startAt).getTime() + 60 * 60_000).toISOString(); }
function overlap(a: CalendarWindow, b: CalendarWindow) { return new Date(a.startAt).getTime() < new Date(b.endAt).getTime() && new Date(b.startAt).getTime() < new Date(a.endAt).getTime(); }

async function selectRows(path: string) { try { const rows = await supabaseRequest(path, { method: 'GET' }); return Array.isArray(rows) ? rows as Record<string, unknown>[] : []; } catch { return []; } }

async function findExistingWorkItem(input: { workspaceId: string; googleEventId: string; closeflowId?: string }) {
  const workspaceFilter = 'workspace_id=eq.' + encodeURIComponent(input.workspaceId);
  const queries = [
    input.closeflowId && isUuid(input.closeflowId) ? 'work_items?' + workspaceFilter + '&id=eq.' + encodeURIComponent(input.closeflowId) + '&select=*&limit=1' : '',
    'work_items?' + workspaceFilter + '&google_calendar_event_id=eq.' + encodeURIComponent(input.googleEventId) + '&select=*&limit=1',
    'work_items?' + workspaceFilter + '&source_provider=eq.google_calendar&source_external_id=eq.' + encodeURIComponent(input.googleEventId) + '&select=*&limit=1',
  ].filter(Boolean);
  for (const query of queries) { const rows = await selectRows(query); if (rows[0]) return rows[0]; }
  return null;
}

async function listConflictCandidates(workspaceId: string) { return selectRows('work_items?workspace_id=eq.' + encodeURIComponent(workspaceId) + '&select=*&limit=1000'); }

function findConflicts(input: { candidates: Record<string, unknown>[]; window: CalendarWindow; excludeId?: string; googleEventId: string }) {
  const conflicts: Record<string, unknown>[] = [];
  for (const row of input.candidates) {
    const id = asText(row.id);
    if (input.excludeId && id === input.excludeId) continue;
    const rowGoogleId = asText(row.google_calendar_event_id || row.source_external_id);
    if (rowGoogleId && rowGoogleId === input.googleEventId) continue;
    const startAt = rowStartAt(row);
    if (!startAt) continue;
    const endAt = rowEndAt(row, startAt);
    if (overlap(input.window, { startAt, endAt })) conflicts.push(row);
  }
  return conflicts;
}

async function listGoogleEvents(input: { connection: any; accessToken: string; timeMin: string; timeMax: string; updatedMin?: string | null }) {
  const calendarId = encodeURIComponent(String(input.connection.google_calendar_id || 'primary'));
  const params = new URLSearchParams();
  params.set('singleEvents', 'true');
  params.set('showDeleted', 'true');
  params.set('maxResults', '2500');
  params.set('timeMin', input.timeMin);
  params.set('timeMax', input.timeMax);
  params.set('orderBy', 'updated');
  if (input.updatedMin) params.set('updatedMin', input.updatedMin);
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?' + params.toString(), { headers: { Authorization: 'Bearer ' + input.accessToken } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(String((data as any)?.error?.message || 'GOOGLE_INBOUND_EVENTS_LIST_FAILED'));
  return Array.isArray((data as any).items) ? (data as any).items as GoogleCalendarEventItem[] : [];
}

function buildInboundPayload(input: { event: GoogleCalendarEventItem; workspaceId: string; startAt: string; endAt: string; conflictCount: number; conflictSummary: string }) {
  const nowIso = new Date().toISOString();
  return {
    workspace_id: input.workspaceId,
    record_type: 'event',
    type: 'external_google_event',
    title: asText(input.event.summary) || 'Google Calendar',
    description: asText(input.event.description),
    status: 'scheduled',
    priority: 'medium',
    scheduled_at: input.startAt,
    start_at: input.startAt,
    end_at: input.endAt,
    recurrence: 'none',
    reminder: 'none',
    show_in_tasks: false,
    show_in_calendar: true,
    google_calendar_id: 'primary',
    google_calendar_event_id: asText(input.event.id),
    google_calendar_event_etag: null,
    google_calendar_html_link: asText(input.event.htmlLink) || null,
    google_calendar_synced_at: nowIso,
    google_calendar_sync_status: 'synced',
    google_calendar_sync_error: null,
    source_provider: 'google_calendar',
    source_external_id: asText(input.event.id),
    source_calendar_id: 'primary',
    source_synced_at: nowIso,
    source_updated_at: iso(input.event.updated),
    inbound_conflict_detected: input.conflictCount > 0,
    inbound_conflict_count: input.conflictCount,
    inbound_conflict_summary: input.conflictSummary || null,
    created_at: nowIso,
    updated_at: nowIso,
  };
}

export async function syncGoogleCalendarInbound(input: InboundSyncInput) {
  const workspaceId = asText(input.workspaceId);
  if (!workspaceId) throw new Error('GOOGLE_INBOUND_WORKSPACE_REQUIRED');
  const connection = await getGoogleCalendarConnection(workspaceId, asText(input.userId) || undefined);
  if (!connection || connection.sync_enabled === false) return { imported: 0, updated: 0, deleted: 0, skipped: 0, conflicts: [], connected: false };
  const now = new Date();
  const timeMin = new Date(now.getTime() - Math.max(1, input.daysBack || 30) * 24 * 60 * 60_000).toISOString();
  const timeMax = new Date(now.getTime() + Math.max(1, input.daysForward || 90) * 24 * 60 * 60_000).toISOString();
  const lastInboundSyncAt = iso((connection as any).google_calendar_last_inbound_sync_at) || iso((connection as any).last_inbound_sync_at) || null;
  const updatedMin = lastInboundSyncAt ? new Date(new Date(lastInboundSyncAt).getTime() - 5 * 60_000).toISOString() : null;
  try {
    const accessToken = await getGoogleCalendarAccessToken(connection as any);
    const googleEvents = await listGoogleEvents({ connection, accessToken, timeMin, timeMax, updatedMin });
    const conflictCandidates = await listConflictCandidates(workspaceId);
    const conflicts: Array<{ id: string; title: string; startAt: string; conflictWith: string }> = [];
    let imported = 0; let updated = 0; let deleted = 0; let skipped = 0;
    for (const event of googleEvents) {
      const googleEventId = asText(event.id);
      if (!googleEventId) { skipped += 1; continue; }
      const closeflowId = getCloseFlowIdFromGoogle(event);
      const existing = await findExistingWorkItem({ workspaceId, googleEventId, closeflowId });
      if (event.status === 'cancelled') {
        if (existing?.id) { await deleteById('work_items', String(existing.id)); deleted += 1; } else { skipped += 1; }
        continue;
      }
      const startAt = googleEventStart(event);
      if (!startAt) { skipped += 1; continue; }
      const endAt = googleEventEnd(event, startAt);
      const rowId = existing?.id ? String(existing.id) : '';
      const rowConflicts = findConflicts({ candidates: conflictCandidates, window: { startAt, endAt }, excludeId: rowId, googleEventId });
      const conflictSummary = rowConflicts.slice(0, 3).map((row) => asText(row.title) || 'Wpis w CloseFlow').join(' | ');
      if (rowConflicts.length > 0) conflicts.push({ id: googleEventId, title: asText(event.summary) || 'Google Calendar', startAt, conflictWith: conflictSummary });
      const payload = buildInboundPayload({ event, workspaceId, startAt, endAt, conflictCount: rowConflicts.length, conflictSummary });
      if (existing?.id) { await safeUpdateWorkItem(String(existing.id), { ...payload, created_at: existing.created_at || payload.created_at, updated_at: new Date().toISOString() }); updated += 1; }
      else { await safeInsertWorkItem(payload); imported += 1; }
    }
    await safeConnectionUpdate((connection as any).id, { google_calendar_last_inbound_sync_at: new Date().toISOString(), google_calendar_last_inbound_sync_error: null, google_calendar_last_inbound_sync_count: imported + updated + deleted, updated_at: new Date().toISOString() });
    return { imported, updated, deleted, skipped, conflicts, connected: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || 'GOOGLE_INBOUND_SYNC_FAILED');
    await safeConnectionUpdate((connection as any).id, { google_calendar_last_inbound_sync_error: message.slice(0, 500), updated_at: new Date().toISOString() });
    throw error;
  }
}
