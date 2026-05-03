import crypto from 'crypto';
import { deleteById, supabaseRequest } from './_supabase.js';
import {
  getGoogleCalendarConnection,
  listGoogleCalendarEvents,
} from './google-calendar-sync.js';

type InboundSyncInput = {
  workspaceId: string;
  userId?: string;
  daysBack?: number;
  daysForward?: number;
  updatedMin?: string | null;
};

type GoogleEvent = Record<string, any>;
type WorkItemRow = Record<string, any>;

function nowIso() { return new Date().toISOString(); }
function asText(value: unknown) { return typeof value === 'string' ? value.trim() : ''; }
function clampInt(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN;
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.round(parsed)));
}
function encode(value: unknown) { return encodeURIComponent(String(value || '')); }
function parseTime(value: unknown) {
  const raw = asText(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isFinite(date.getTime()) ? date : null;
}
function toIso(value: unknown) {
  const date = parseTime(value);
  return date ? date.toISOString() : null;
}
function googleEventStart(event: GoogleEvent) {
  // GOOGLE_CALENDAR_STAGE11C_ALL_DAY_INBOUND_START
  if (googleEventIsAllDay(event)) {
    const dateOnly = googleEventStartDate(event);
    return dateOnly ? dateOnly + 'T00:00:00.000Z' : null;
  }
  const value = event?.start?.dateTime || '';
  return toIso(value);
}
function googleEventEnd(event: GoogleEvent, startAt: string | null) {
  // GOOGLE_CALENDAR_STAGE11C_ALL_DAY_INBOUND_END
  if (googleEventIsAllDay(event)) {
    const dateOnly = googleEventEndDate(event);
    return dateOnly ? dateOnly + 'T00:00:00.000Z' : startAt;
  }
  const value = event?.end?.dateTime || '';
  const parsed = toIso(value);
  if (parsed) return parsed;
  if (!startAt) return null;
  return new Date(new Date(startAt).getTime() + 60 * 60_000).toISOString();
}
function getPrivateProperty(event: GoogleEvent, key: string) {
  return asText(event?.extendedProperties?.private?.[key]);
}

// GOOGLE_CALENDAR_STAGE11C_INBOUND_REMINDER_ALL_DAY_HELPERS
function googleEventIsAllDay(event: GoogleEvent) {
  return Boolean(event?.start?.date && !event?.start?.dateTime);
}
function googleEventStartDate(event: GoogleEvent) {
  return asText(event?.start?.date);
}
function googleEventEndDate(event: GoogleEvent) {
  return asText(event?.end?.date);
}
function normalizeGoogleReminderOverridesFromEvent(event: GoogleEvent) {
  const overrides = Array.isArray(event?.reminders?.overrides) ? event.reminders.overrides : [];
  return overrides
    .map((item: any) => {
      const method = asText(item?.method).toLowerCase();
      const minutes = typeof item?.minutes === 'number' ? item.minutes : Number(item?.minutes);
      if (method !== 'popup' && method !== 'email') return null;
      if (!Number.isFinite(minutes)) return null;
      return { method, minutes: Math.max(0, Math.min(40320, Math.round(minutes))) };
    })
    .filter(Boolean);
}
function googleReminderAtForLegacyField(event: GoogleEvent, startAt: string | null) {
  if (!startAt || event?.reminders?.useDefault === true) return 'none';
  const first = normalizeGoogleReminderOverridesFromEvent(event)[0] as any;
  if (!first) return 'none';
  return new Date(new Date(startAt).getTime() - Number(first.minutes || 0) * 60_000).toISOString();
}
function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  if (match?.[1]) return match[1];
  const alt = message.match(/column \"([^\"]+)\" does not exist/i);
  return alt?.[1] || null;
}
async function safeSelect(path: string) {
  try {
    const rows = await supabaseRequest(path, { method: 'GET' });
    return Array.isArray(rows) ? rows as WorkItemRow[] : [];
  } catch {
    return [];
  }
}
async function safePatchWorkItem(id: string, payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let i = 0; i < 20; i += 1) {
    try {
      return await supabaseRequest(`work_items?id=eq.${encode(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(current),
      });
    } catch (error) {
      const missing = extractMissingColumn(error);
      if (!missing || !(missing in current)) throw error;
      delete current[missing];
    }
  }
  throw new Error('GOOGLE_INBOUND_SAFE_PATCH_EXHAUSTED');
}
async function safeInsertWorkItem(payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let i = 0; i < 20; i += 1) {
    try {
      return await supabaseRequest('work_items', {
        method: 'POST',
        body: JSON.stringify(current),
      });
    } catch (error) {
      const missing = extractMissingColumn(error);
      if (!missing || !(missing in current)) throw error;
      delete current[missing];
    }
  }
  throw new Error('GOOGLE_INBOUND_SAFE_INSERT_EXHAUSTED');
}
async function findExistingWorkItem(workspaceId: string, googleEvent: GoogleEvent) {
  const googleId = asText(googleEvent?.id);
  const closeflowId = getPrivateProperty(googleEvent, 'closeflowId');
  const queries = [
    closeflowId ? `work_items?workspace_id=eq.${encode(workspaceId)}&id=eq.${encode(closeflowId)}&select=*&limit=1` : '',
    googleId ? `work_items?workspace_id=eq.${encode(workspaceId)}&google_calendar_event_id=eq.${encode(googleId)}&select=*&limit=1` : '',
    googleId ? `work_items?workspace_id=eq.${encode(workspaceId)}&source_provider=eq.google_calendar&source_external_id=eq.${encode(googleId)}&select=*&limit=1` : '',
  ].filter(Boolean);
  for (const query of queries) {
    const rows = await safeSelect(query);
    if (rows[0]) return rows[0];
  }
  return null;
}
function normalizeWindow(row: WorkItemRow) {
  const start = toIso(row.start_at || row.startAt || row.scheduled_at || row.scheduledAt || row.due_at || row.dueAt);
  if (!start) return null;
  const end = toIso(row.end_at || row.endAt) || new Date(new Date(start).getTime() + 60 * 60_000).toISOString();
  return { startAt: start, endAt: end };
}
async function findConflicts(workspaceId: string, input: { selfId?: string | null; startAt: string; endAt: string; googleEventId: string }) {
  const rows = await safeSelect(`work_items?workspace_id=eq.${encode(workspaceId)}&select=*&limit=1000`);
  const startMs = new Date(input.startAt).getTime();
  const endMs = new Date(input.endAt).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return [];
  return rows.filter((row) => {
    const id = asText(row.id);
    if (input.selfId && id === input.selfId) return false;
    if (asText(row.google_calendar_event_id) === input.googleEventId) return false;
    if (asText(row.source_external_id) === input.googleEventId) return false;
    const recordType = asText(row.record_type || row.recordType).toLowerCase();
    if (recordType !== 'task' && recordType !== 'event') return false;
    const win = normalizeWindow(row);
    if (!win) return false;
    const otherStart = new Date(win.startAt).getTime();
    const otherEnd = new Date(win.endAt).getTime();
    return startMs < otherEnd && otherStart < endMs;
  }).slice(0, 10);
}
function buildConflictMessage(event: GoogleEvent, conflicts: WorkItemRow[]) {
  if (!conflicts.length) return null;
  const first = conflicts[0];
  const conflictTitle = asText(first.title) || 'inny wpis w CloseFlow';
  const title = asText(event.summary) || 'Google Calendar';
  return `Wpis z Google Calendar „${title}” nakłada się z: ${conflictTitle}. Sprawdź kalendarz przed potwierdzeniem terminu.`;
}
function basePayload(workspaceId: string, googleEvent: GoogleEvent, existing?: WorkItemRow | null, conflicts: WorkItemRow[] = []) {
  const startAt = googleEventStart(googleEvent);
  const endAt = googleEventEnd(googleEvent, startAt);
  const googleId = asText(googleEvent.id);
  const conflictMessage = buildConflictMessage(googleEvent, conflicts);
  const isExistingTask = asText(existing?.record_type || existing?.recordType).toLowerCase() === 'task';
  const reminderValue = googleReminderAtForLegacyField(googleEvent, startAt);
  const allDay = googleEventIsAllDay(googleEvent);
  const payload: Record<string, unknown> = {
    workspace_id: workspaceId,
    record_type: isExistingTask ? 'task' : 'event',
    type: isExistingTask ? (existing?.type || 'task') : 'external_google_event',
    title: asText(googleEvent.summary) || '(Google Calendar) Bez tytułu',
    description: asText(googleEvent.description),
    status: googleEvent.status === 'cancelled' ? 'cancelled' : (isExistingTask ? (existing?.status || 'todo') : 'scheduled'),
    priority: existing?.priority || 'medium',
    scheduled_at: startAt,
    start_at: isExistingTask ? (existing?.start_at || null) : startAt,
    end_at: isExistingTask ? (existing?.end_at || null) : endAt,
    recurrence: Array.isArray(googleEvent.recurrence) && googleEvent.recurrence[0] ? String(googleEvent.recurrence[0]) : (existing?.recurrence || 'none'),
    reminder: reminderValue,
    show_in_calendar: true,
    show_in_tasks: Boolean(isExistingTask || existing?.show_in_tasks),
    google_calendar_id: 'primary',
    google_calendar_event_id: googleId,
    google_calendar_event_etag: asText(googleEvent.etag) || null,
    google_calendar_html_link: asText(googleEvent.htmlLink) || null,
    google_calendar_synced_at: nowIso(),
    google_calendar_sync_status: 'synced',
    google_calendar_sync_error: null,
    google_calendar_reminders: googleEvent.reminders || null,
    google_reminders_use_default: Boolean(googleEvent?.reminders?.useDefault),
    google_reminders_overrides: normalizeGoogleReminderOverridesFromEvent(googleEvent),
    google_all_day: allDay,
    google_start_date: allDay ? googleEventStartDate(googleEvent) : null,
    google_end_date: allDay ? googleEventEndDate(googleEvent) : null,
    source_provider: 'google_calendar',
    source_external_id: googleId,
    source_updated_at: toIso(googleEvent.updated),
    source_deleted_at: googleEvent.status === 'cancelled' ? nowIso() : null,
    inbound_conflict_status: conflicts.length ? 'conflict' : 'clear',
    inbound_conflict_message: conflictMessage,
    inbound_conflict_count: conflicts.length,
    updated_at: nowIso(),
  };
  if (!existing) payload.created_at = nowIso();
  return payload;
}
async function applyGoogleEvent(workspaceId: string, googleEvent: GoogleEvent) {
  const googleId = asText(googleEvent.id);
  if (!googleId) return { action: 'skipped', conflicts: [] as any[] };
  const existing = await findExistingWorkItem(workspaceId, googleEvent);
  const existingId = asText(existing?.id);

  if (googleEvent.status === 'cancelled') {
    if (existingId) {
      await deleteById('work_items', existingId).catch(async () => {
        await safePatchWorkItem(existingId, { status: 'cancelled', source_deleted_at: nowIso(), updated_at: nowIso() });
      });
      return { action: 'deleted', id: existingId, conflicts: [] as any[] };
    }
    return { action: 'skipped_deleted', conflicts: [] as any[] };
  }

  const startAt = googleEventStart(googleEvent);
  const endAt = googleEventEnd(googleEvent, startAt);
  if (!startAt || !endAt) return { action: 'skipped_no_time', conflicts: [] as any[] };

  const conflicts = await findConflicts(workspaceId, { selfId: existingId || null, startAt, endAt, googleEventId: googleId });
  const payload = basePayload(workspaceId, googleEvent, existing, conflicts);

  if (existingId) {
    const rows = await safePatchWorkItem(existingId, payload);
    return { action: 'updated', id: existingId, conflicts, row: Array.isArray(rows) ? rows[0] : null };
  }

  const rows = await safeInsertWorkItem(payload);
  const row = Array.isArray(rows) ? rows[0] : null;
  return { action: 'created', id: row?.id || null, conflicts, row };
}
export async function syncGoogleCalendarInbound(input: InboundSyncInput) {
  // GOOGLE_CALENDAR_STAGE10K_INBOUND_SYNC_BACKEND
  if (!input.workspaceId) throw new Error('GOOGLE_INBOUND_WORKSPACE_REQUIRED');
  const connection = await getGoogleCalendarConnection(input.workspaceId, input.userId || undefined);
  if (!connection || connection.sync_enabled === false) {
    return { ok: true, connected: false, scanned: 0, created: 0, updated: 0, deleted: 0, conflicts: [] as any[] };
  }
  const daysBack = clampInt(input.daysBack, 30, 0, 365);
  const daysForward = clampInt(input.daysForward, 90, 1, 730);
  const timeMin = new Date(Date.now() - daysBack * 24 * 60 * 60_000).toISOString();
  const timeMax = new Date(Date.now() + daysForward * 24 * 60 * 60_000).toISOString();
  const updatedMin = input.updatedMin ? toIso(input.updatedMin) : null;
  const listed = await listGoogleCalendarEvents(connection, { timeMin, timeMax, updatedMin, maxResults: 2500 });
  let created = 0;
  let updated = 0;
  let deleted = 0;
  const conflicts: any[] = [];
  for (const googleEvent of listed.items || []) {
    const result = await applyGoogleEvent(input.workspaceId, googleEvent);
    if (result.action === 'created') created += 1;
    if (result.action === 'updated') updated += 1;
    if (result.action === 'deleted') deleted += 1;
    if (result.conflicts?.length) {
      conflicts.push({
        googleEventId: googleEvent.id,
        title: googleEvent.summary || '(Google Calendar) Bez tytułu',
        startAt: googleEventStart(googleEvent),
        endAt: googleEventEnd(googleEvent, googleEventStart(googleEvent)),
        conflictCount: result.conflicts.length,
        message: buildConflictMessage(googleEvent, result.conflicts),
      });
    }
  }
  return {
    ok: true,
    connected: true,
    scanned: (listed.items || []).length,
    created,
    updated,
    deleted,
    conflicts,
    nextSyncToken: listed.nextSyncToken || null,
  };
}
