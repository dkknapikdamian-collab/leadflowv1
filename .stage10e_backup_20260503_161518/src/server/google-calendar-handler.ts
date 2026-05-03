import { assertWorkspaceWriteAccess } from './_access-gate.js';
import { deleteById, supabaseRequest } from './_supabase.js';
import { resolveRequestWorkspaceId } from './_request-scope.js';
import {
  buildGoogleCalendarOAuthUrl,
  disconnectGoogleCalendarConnection,
  exchangeGoogleCalendarCode,
  getGoogleCalendarConfigStatus,
  getGoogleCalendarConnection,
  upsertGoogleCalendarConnection,
  verifyGoogleOAuthState,
} from './google-calendar-sync.js';

function getUserId(req: any) {
  const raw =
    req.headers?.['x-user-id']
    || req.headers?.['x-auth-uid']
    || req.headers?.['x-firebase-uid']
    || '';
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '');
}

function getUserEmail(req: any) {
  const raw = req.headers?.['x-user-email'] || '';
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '');
}

function parseBody(req: any) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body;
}

function route(req: any, body: any) {
  const raw = req.query?.route || req.query?.action || body?.route || body?.action || 'status';
  return String(Array.isArray(raw) ? raw[0] : raw || 'status').trim().toLowerCase();
}

function inboundGoogleToIso(value: unknown) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function inboundGoogleEventStart(event: Record<string, any>) {
  const dateTime = inboundGoogleToIso(event?.start?.dateTime);
  if (dateTime) return dateTime;
  const date = typeof event?.start?.date === 'string' ? event.start.date : '';
  return date ? inboundGoogleToIso(`${date}T09:00:00`) : null;
}

function inboundGoogleEventEnd(event: Record<string, any>, startAt: string) {
  const dateTime = inboundGoogleToIso(event?.end?.dateTime);
  if (dateTime) return dateTime;
  const date = typeof event?.end?.date === 'string' ? event.end.date : '';
  const dateEnd = date ? inboundGoogleToIso(`${date}T10:00:00`) : null;
  if (dateEnd && new Date(dateEnd).getTime() > new Date(startAt).getTime()) return dateEnd;
  return new Date(new Date(startAt).getTime() + 60 * 60_000).toISOString();
}

function inboundGoogleWindow(row: Record<string, any>) {
  const start = inboundGoogleToIso(row.start_at || row.scheduled_at || row.startAt || row.scheduledAt);
  if (!start) return null;
  const end = inboundGoogleToIso(row.end_at || row.endAt) || new Date(new Date(start).getTime() + 60 * 60_000).toISOString();
  return { startAt: start, endAt: new Date(end).getTime() > new Date(start).getTime() ? end : new Date(new Date(start).getTime() + 60 * 60_000).toISOString() };
}

function inboundGoogleOverlaps(a: { startAt: string; endAt: string }, b: { startAt: string; endAt: string }) {
  const aStart = new Date(a.startAt).getTime();
  const aEnd = new Date(a.endAt).getTime();
  const bStart = new Date(b.startAt).getTime();
  const bEnd = new Date(b.endAt).getTime();
  return Number.isFinite(aStart) && Number.isFinite(aEnd) && Number.isFinite(bStart) && Number.isFinite(bEnd) && aStart < bEnd && bStart < aEnd;
}

async function inboundGoogleSelectRows(query: string) {
  const rows = await supabaseRequest(query, { method: 'GET' });
  return Array.isArray(rows) ? rows as Record<string, any>[] : [];
}

async function inboundGoogleFindExistingWorkItem(workspaceId: string, googleEventId: string) {
  if (!workspaceId || !googleEventId) return null;
  const rows = await inboundGoogleSelectRows([
    'work_items?select=*',
    `workspace_id=eq.${encodeURIComponent(workspaceId)}`,
    `google_calendar_event_id=eq.${encodeURIComponent(googleEventId)}`,
    'limit=1',
  ].join('&'));
  return rows[0] || null;
}

async function inboundGoogleFetchConflictRows(workspaceId: string) {
  return inboundGoogleSelectRows([
    'work_items?select=id,title,record_type,start_at,end_at,scheduled_at,google_calendar_event_id,status',
    `workspace_id=eq.${encodeURIComponent(workspaceId)}`,
    'show_in_calendar=is.true',
    'limit=1000',
  ].join('&')).catch(() => inboundGoogleSelectRows([
    'work_items?select=id,title,record_type,start_at,end_at,scheduled_at,google_calendar_event_id,status',
    `workspace_id=eq.${encodeURIComponent(workspaceId)}`,
    'limit=1000',
  ].join('&')));
}

function inboundGoogleBuildPayload(input: { workspaceId: string; connection: any; event: Record<string, any>; startAt: string; endAt: string; nowIso: string }) {
  const summary = String(input.event.summary || '').trim() || 'Wydarzenie Google';
  return {
    workspace_id: input.workspaceId,
    record_type: 'event',
    type: 'external_google_event',
    title: summary,
    description: String(input.event.description || ''),
    status: 'planned',
    priority: 'medium',
    scheduled_at: input.startAt,
    start_at: input.startAt,
    end_at: input.endAt,
    recurrence: 'none',
    reminder: 'none',
    show_in_tasks: false,
    show_in_calendar: true,
    google_calendar_sync_enabled: true,
    google_calendar_id: input.connection.google_calendar_id || 'primary',
    google_calendar_event_id: String(input.event.id || ''),
    google_calendar_event_etag: String(input.event.etag || '') || null,
    google_calendar_html_link: String(input.event.htmlLink || '') || null,
    google_calendar_synced_at: input.nowIso,
    google_calendar_sync_status: 'synced',
    google_calendar_sync_error: null,
    updated_at: input.nowIso,
  };
}

async function syncInboundGoogleCalendarToCloseFlow(input: { workspaceId: string; userId: string; connection: any }) {
  // GOOGLE_CALENDAR_STAGE10B_INBOUND_PULL_SYNC
  const now = new Date();
  const nowIso = now.toISOString();
  const timeMin = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();
  const googleEvents = await listGoogleCalendarEvents(input.connection, { timeMin, timeMax });
  const conflictRows = await inboundGoogleFetchConflictRows(input.workspaceId);
  const conflicts: Record<string, unknown>[] = [];
  let imported = 0;
  let updated = 0;
  let deleted = 0;
  let skipped = 0;

  for (const googleEvent of googleEvents) {
    const googleEventId = String((googleEvent as any).id || '').trim();
    if (!googleEventId) { skipped += 1; continue; }
    const existing = await inboundGoogleFindExistingWorkItem(input.workspaceId, googleEventId);
    const status = String((googleEvent as any).status || '').toLowerCase();

    if (status === 'cancelled') {
      if (existing?.id) {
        await deleteById('work_items', String(existing.id));
        deleted += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    const startAt = inboundGoogleEventStart(googleEvent as Record<string, any>);
    if (!startAt) { skipped += 1; continue; }
    const endAt = inboundGoogleEventEnd(googleEvent as Record<string, any>, startAt);
    const payload = inboundGoogleBuildPayload({ workspaceId: input.workspaceId, connection: input.connection, event: googleEvent as Record<string, any>, startAt, endAt, nowIso });
    const incomingWindow = { startAt, endAt };

    for (const candidate of conflictRows) {
      if (String(candidate.id || '') === String(existing?.id || '')) continue;
      if (String(candidate.google_calendar_event_id || '') === googleEventId) continue;
      const candidateStatus = String(candidate.status || '').toLowerCase();
      if (['done', 'completed', 'cancelled', 'canceled', 'archived'].includes(candidateStatus)) continue;
      const candidateWindow = inboundGoogleWindow(candidate);
      if (!candidateWindow) continue;
      if (inboundGoogleOverlaps(incomingWindow, candidateWindow)) {
        conflicts.push({
          googleEventId,
          googleTitle: payload.title,
          googleStartAt: startAt,
          googleEndAt: endAt,
          conflictId: candidate.id,
          conflictKind: candidate.record_type || 'event',
          conflictTitle: candidate.title || 'Wpis CloseFlow',
          conflictStartAt: candidateWindow.startAt,
          conflictEndAt: candidateWindow.endAt,
        });
      }
    }

    if (existing?.id) {
      await updateById('work_items', String(existing.id), payload);
      updated += 1;
    } else {
      await insertWithVariants(['work_items'], [{ ...payload, created_at: nowIso }]);
      imported += 1;
    }
  }

  return {
    ok: true,
    range: { timeMin, timeMax },
    imported,
    updated,
    deleted,
    skipped,
    conflicts: conflicts.slice(0, 50),
    conflictCount: conflicts.length,
  };
}

function toInboundIso(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function addDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function extractInboundMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  if (match?.[1]) return match[1];
  const alt = message.match(/column \"([^\"]+)\" does not exist/i);
  return alt?.[1] || null;
}

async function safeInboundSelect(query: string) {
  try {
    const rows = await supabaseRequest(query, { method: 'GET' });
    return Array.isArray(rows) ? rows as Record<string, unknown>[] : [];
  } catch {
    return [];
  }
}

async function safeInboundInsertWorkItem(payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 16; attempt += 1) {
    try {
      const rows = await supabaseRequest('work_items', { method: 'POST', body: JSON.stringify(current) });
      return Array.isArray(rows) && rows[0] ? rows[0] as Record<string, unknown> : current;
    } catch (error) {
      const missing = extractInboundMissingColumn(error);
      if (!missing || !(missing in current)) throw error;
      delete current[missing];
    }
  }
  throw new Error('GOOGLE_INBOUND_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function safeInboundUpdateWorkItem(id: string, payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 16; attempt += 1) {
    try {
      const rows = await supabaseRequest('work_items?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify(current) });
      return Array.isArray(rows) && rows[0] ? rows[0] as Record<string, unknown> : { id, ...current };
    } catch (error) {
      const missing = extractInboundMissingColumn(error);
      if (!missing || !(missing in current)) throw error;
      delete current[missing];
    }
  }
  throw new Error('GOOGLE_INBOUND_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

function getGoogleEventStartAt(event: any) {
  return toInboundIso(event?.start?.dateTime) || toInboundIso(event?.start?.date ? String(event.start.date) + 'T09:00:00' : '');
}

function getGoogleEventEndAt(event: any, startAt: string) {
  return toInboundIso(event?.end?.dateTime) || toInboundIso(event?.end?.date ? String(event.end.date) + 'T10:00:00' : '') || new Date(new Date(startAt).getTime() + 60 * 60_000).toISOString();
}

function getCloseFlowIdFromGoogleEvent(event: any) {
  const raw = event?.extendedProperties?.private?.closeflowId || '';
  return typeof raw === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw) ? raw : '';
}

async function findInboundGoogleWorkItem(workspaceId: string, googleEvent: any) {
  const googleEventId = String(googleEvent?.id || '').trim();
  const closeflowId = getCloseFlowIdFromGoogleEvent(googleEvent);
  const queries = [
    closeflowId ? 'work_items?select=*&workspace_id=eq.' + encodeURIComponent(workspaceId) + '&id=eq.' + encodeURIComponent(closeflowId) + '&limit=1' : '',
    googleEventId ? 'work_items?select=*&workspace_id=eq.' + encodeURIComponent(workspaceId) + '&google_calendar_event_id=eq.' + encodeURIComponent(googleEventId) + '&limit=1' : '',
    googleEventId ? 'work_items?select=*&workspace_id=eq.' + encodeURIComponent(workspaceId) + '&source_provider=eq.google_calendar&source_external_id=eq.' + encodeURIComponent(googleEventId) + '&limit=1' : '',
  ].filter(Boolean);

  for (const query of queries) {
    const rows = await safeInboundSelect(query);
    if (rows[0]) return rows[0];
  }
  return null;
}

function buildInboundGooglePayload(workspaceId: string, googleCalendarId: string, event: any) {
  // GOOGLE_CALENDAR_STAGE10D_INBOUND_SOURCE_PROVIDER_WRITE
  // GOOGLE_CALENDAR_STAGE10D_INBOUND_SOURCE_EXTERNAL_ID_WRITE
  const nowIso = new Date().toISOString();
  const startAt = getGoogleEventStartAt(event) || nowIso;
  const endAt = getGoogleEventEndAt(event, startAt);
  return {
    workspace_id: workspaceId,
    record_type: 'event',
    type: 'external_google_event',
    title: String(event?.summary || 'Wydarzenie z Google Calendar'),
    description: String(event?.description || ''),
    status: String(event?.status || '').toLowerCase() === 'cancelled' ? 'cancelled' : 'planned',
    priority: 'medium',
    scheduled_at: startAt,
    start_at: startAt,
    end_at: endAt,
    recurrence: Array.isArray(event?.recurrence) && event.recurrence[0] ? String(event.recurrence[0]) : 'none',
    reminder: 'none',
    show_in_tasks: false,
    show_in_calendar: true,
    google_calendar_sync_enabled: true,
    google_calendar_id: googleCalendarId || 'primary',
    google_calendar_event_id: String(event?.id || ''),
    google_calendar_event_etag: event?.etag || null,
    google_calendar_html_link: event?.htmlLink || null,
    google_calendar_synced_at: nowIso,
    google_calendar_sync_status: 'synced',
    google_calendar_sync_error: null,
    source_provider: 'google_calendar',
    source_external_id: String(event?.id || ''),
    google_calendar_external_updated_at: toInboundIso(event?.updated),
    google_calendar_imported_at: nowIso,
    updated_at: nowIso,
  };
}

function inboundWindow(row: Record<string, unknown>) {
  const startRaw = row.start_at || row.scheduled_at || row.startAt || row.scheduledAt;
  const start = toInboundIso(startRaw);
  if (!start) return null;
  const end = toInboundIso(row.end_at || row.endAt) || new Date(new Date(start).getTime() + 60 * 60_000).toISOString();
  return { startMs: new Date(start).getTime(), endMs: new Date(end).getTime() };
}

async function findInboundGoogleConflicts(workspaceId: string, importedRow: Record<string, unknown>) {
  const importedWindow = inboundWindow(importedRow);
  const importedId = String(importedRow.id || '');
  if (!importedWindow || !Number.isFinite(importedWindow.startMs) || !Number.isFinite(importedWindow.endMs)) return [];
  const rows = await safeInboundSelect('work_items?select=*&workspace_id=eq.' + encodeURIComponent(workspaceId) + '&show_in_calendar=eq.true&limit=500');
  const conflicts: Record<string, unknown>[] = [];
  for (const row of rows) {
    if (String(row.id || '') === importedId) continue;
    const status = String(row.status || '').toLowerCase();
    if (status === 'cancelled' || status === 'canceled' || status === 'deleted' || status === 'done' || status === 'completed') continue;
    const window = inboundWindow(row);
    if (!window) continue;
    if (importedWindow.startMs < window.endMs && window.startMs < importedWindow.endMs) {
      conflicts.push({
        id: row.id,
        title: row.title || 'Bez tytułu',
        recordType: row.record_type || row.type || 'event',
        startAt: row.start_at || row.scheduled_at || null,
        endAt: row.end_at || null,
        googleTitle: importedRow.title || 'Wydarzenie z Google Calendar',
        googleStartAt: importedRow.start_at || importedRow.scheduled_at || null,
      });
    }
  }
  return conflicts;
}

async function syncGoogleCalendarInboundForWorkspace(input: { workspaceId: string; userId: string; updatedMin?: string | null }) {
  // GOOGLE_CALENDAR_STAGE10D_INBOUND_SYNC_BACKEND
  // V1 is pull-based: read Google events from -30d to +90d and mirror them as external_google_event rows.
  const connection = await getGoogleCalendarConnection(input.workspaceId, input.userId || undefined);
  if (!connection || connection.sync_enabled === false) throw new Error('GOOGLE_CALENDAR_CONNECTION_NOT_FOUND');
  const googleCalendarId = String(connection.google_calendar_id || 'primary');
  const timeMin = addDaysIso(-30);
  const timeMax = addDaysIso(90);
  const updatedMin = input.updatedMin || null;
  const events = await listGoogleCalendarEvents(connection, { timeMin, timeMax, updatedMin });
  let created = 0;
  let updated = 0;
  let deleted = 0;
  const conflicts: Record<string, unknown>[] = [];

  for (const event of events) {
    const googleEventId = String(event?.id || '').trim();
    if (!googleEventId) continue;
    const existing = await findInboundGoogleWorkItem(input.workspaceId, event);
    if (String(event?.status || '').toLowerCase() === 'cancelled') {
      if (existing?.id) {
        await deleteById('work_items', String(existing.id));
        deleted += 1;
      }
      continue;
    }

    const payload = buildInboundGooglePayload(input.workspaceId, googleCalendarId, event);
    let row: Record<string, unknown>;
    if (existing?.id) {
      row = await safeInboundUpdateWorkItem(String(existing.id), payload);
      updated += 1;
    } else {
      row = await safeInboundInsertWorkItem({ ...payload, created_at: new Date().toISOString() });
      created += 1;
    }

    const rowConflicts = await findInboundGoogleConflicts(input.workspaceId, row);
    for (const conflict of rowConflicts) conflicts.push(conflict);
  }

  return { ok: true, created, updated, deleted, scanned: events.length, conflicts, updatedMin, timeMin, timeMax };
}



// GOOGLE_CALENDAR_SYSTEM_ROUTE_CONSOLIDATION_2026_05_03
export default async function handler(req: any, res: any) {
  try {
    const body = parseBody(req);
    const action = route(req, body);

    if (action === 'callback') {
      const code = String(req.query?.code || body.code || '');
      const state = String(req.query?.state || body.state || '');
      if (!code || !state) {
        res.status(400).json({ error: 'GOOGLE_CALENDAR_CALLBACK_REQUIRED' });
        return;
      }

      const verified = verifyGoogleOAuthState(state);
      const tokens = await exchangeGoogleCalendarCode(code);
      await upsertGoogleCalendarConnection({
        workspaceId: verified.workspaceId,
        userId: verified.userId,
        tokens,
        googleAccountEmail: null,
      });

      const returnTo = verified.returnTo || '/settings?googleCalendar=connected';
      res.status(302).setHeader('Location', returnTo.includes('?') ? `${returnTo}&googleCalendar=connected` : `${returnTo}?googleCalendar=connected`).end();
      return;
    }

    const workspaceId = await resolveRequestWorkspaceId(req, body);
    if (!workspaceId) {
      res.status(401).json({ error: 'GOOGLE_CALENDAR_WORKSPACE_REQUIRED' });
      return;
    }

    const userId = getUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'GOOGLE_CALENDAR_USER_REQUIRED' });
      return;
    }

    if (req.method === 'GET' && action === 'status') {
      const cfg = getGoogleCalendarConfigStatus();
      const connection = await getGoogleCalendarConnection(workspaceId, userId).catch(() => null);
      res.status(200).json({
        ok: true,
        configured: cfg.configured,
        missing: cfg.missing,
        connected: Boolean(connection),
        connection: connection
          ? {
              googleCalendarId: connection.google_calendar_id || 'primary',
              googleAccountEmail: connection.google_account_email || '',
              syncEnabled: connection.sync_enabled !== false,
            }
          : null,
      });
      return;
    }

    if (req.method === 'POST' && action === 'connect') {
      await assertWorkspaceWriteAccess(workspaceId, req);
      const cfg = getGoogleCalendarConfigStatus();
      if (!cfg.configured) {
        res.status(409).json({ error: 'GOOGLE_CALENDAR_CONFIG_REQUIRED', missing: cfg.missing });
        return;
      }
      const authUrl = buildGoogleCalendarOAuthUrl({
        workspaceId,
        userId,
        returnTo: body.returnTo || '/settings',
      });
      res.status(200).json({ ok: true, authUrl, configured: true, userEmail: getUserEmail(req) });
      return;
    }


    if (req.method === 'POST' && action === 'sync-inbound') {
      // GOOGLE_CALENDAR_STAGE10B_INBOUND_ROUTE
      await assertWorkspaceWriteAccess(workspaceId, req);
      const connection = await getGoogleCalendarConnection(workspaceId, userId).catch(() => null);
      if (!connection || connection.sync_enabled === false) {
        res.status(409).json({ error: 'GOOGLE_CALENDAR_CONNECTION_NOT_FOUND' });
        return;
      }
      const result = await syncInboundGoogleCalendarToCloseFlow({ workspaceId, userId, connection });
      res.status(200).json(result);
      return;
    }
    if ((req.method === 'DELETE' || req.method === 'POST') && action === 'disconnect') {
      await assertWorkspaceWriteAccess(workspaceId, req);
      await disconnectGoogleCalendarConnection(workspaceId, userId);
      res.status(200).json({ ok: true, disconnected: true });
      return;
    }

    res.status(405).json({ error: 'GOOGLE_CALENDAR_ROUTE_NOT_ALLOWED' });
  } catch (error: any) {
    const message = String(error?.message || 'GOOGLE_CALENDAR_API_FAILED');
    const status = message.includes('CONFIG_REQUIRED') ? 409
      : message.includes('REQUIRED') ? 400
      : message.includes('INVALID') || message.includes('EXPIRED') ? 400
      : 500;
    res.status(status).json({ error: message });
  }
}
