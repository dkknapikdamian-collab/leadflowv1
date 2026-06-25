import { supabaseRequest, updateById } from './_supabase.js';
import { normalizeCloseFlowDateTimeToUtcIso } from '../lib/calendar-timezone-contract.js';
import {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  updateGoogleCalendarEvent,
} from './google-calendar-sync.js';
import { getGoogleCalendarUserConnection } from './google-calendar-user-scope.js';

type WorkItemRow = Record<string, any>;

type GoogleCalendarOutboundMode = 'pending' | 'failed' | 'all';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asIsoDate(value: unknown) {
  // STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT
  // Supabase can return timestamp values without an explicit offset.
  // Treat no-offset CloseFlow calendar times as Europe/Warsaw through the central contract,
  // not as UTC via raw new Date(raw).toISOString().
  return normalizeCloseFlowDateTimeToUtcIso(value);
}

function asNumber(value: unknown, fallback: number) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const raw = value.trim().toLowerCase();
    if (raw === 'true' || raw === '1' || raw === 'yes') return true;
    if (raw === 'false' || raw === '0' || raw === 'no') return false;
  }
  return false;
}

function recordTypeOf(row: WorkItemRow) {
  return asText(row.record_type || row.recordType || row.kind || row.type).toLowerCase();
}

function itemId(row: WorkItemRow) {
  return asText(row.id);
}

function googleEventIdFrom(row: WorkItemRow) {
  return asText(row.google_calendar_event_id || row.googleCalendarEventId);
}

function googleSyncStatusFrom(row: WorkItemRow) {
  return asText(row.google_calendar_sync_status || row.googleCalendarSyncStatus).toLowerCase();
}

function startsAtOf(row: WorkItemRow) {
  return (
    asIsoDate(row.start_at)
    || asIsoDate(row.scheduled_at)
    || asIsoDate(row.startAt)
    || asIsoDate(row.scheduledAt)
    || asIsoDate(row.due_at)
    || asIsoDate(row.dueAt)
  );
}

function endsAtOf(row: WorkItemRow) {
  return asIsoDate(row.end_at) || asIsoDate(row.endAt) || null;
}

function isCalendarVisible(row: WorkItemRow) {
  const type = recordTypeOf(row);
  if (type !== 'task' && type !== 'event') return false;
  if (row.show_in_calendar === false || row.showInCalendar === false) return false;
  return Boolean(startsAtOf(row));
}

const GOOGLE_CALENDAR_PERSONAL_SCOPE_USER_FIELDS_STAGE231F_R1 = [
  'user_id',
  'userId',
  'owner_id',
  'ownerId',
  'owner_user_id',
  'ownerUserId',
  'assigned_user_id',
  'assignedUserId',
  'assignee_id',
  'assigneeId',
  'assigned_to',
  'assignedTo',
  'created_by',
  'createdBy',
  'created_by_user_id',
  'createdByUserId',
  'source_user_id',
  'sourceUserId',
  'google_calendar_user_id',
  'googleCalendarUserId',
];

function googleCalendarPersonalScopeForRowStage231F(row: WorkItemRow, userId: string) {
  const expected = asText(userId);
  const matches: string[] = [];
  const checked: string[] = [];
  if (!expected) return { matched: false, checked, matches };

  for (const field of GOOGLE_CALENDAR_PERSONAL_SCOPE_USER_FIELDS_STAGE231F_R1) {
    const value = asText(row[field]);
    if (!value) continue;
    checked.push(field);
    if (value === expected) matches.push(field);
  }

  return { matched: matches.length > 0, checked, matches };
}

function isDeletedLike(row: WorkItemRow) {
  return Boolean(row.deleted_at || row.archived_at || row.deletedAt || row.archivedAt);
}


const CLOSED_OR_HIDDEN_GOOGLE_DELETE_STATUSES_STAGE229B = new Set(['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed']);

function statusOfStage229B(row: WorkItemRow) {
  return asText(row.status || row.statusRaw).toLowerCase();
}

function isExplicitlyHiddenFromCalendarStage229B(row: WorkItemRow) {
  return row.show_in_calendar === false || row.showInCalendar === false;
}

function shouldRemoteDeleteGoogleCalendarEventStage229B(row: WorkItemRow) {
  if (!googleEventIdFrom(row)) return false;
  if (googleSyncStatusFrom(row) === 'pending_delete') return true;
  if (isExplicitlyHiddenFromCalendarStage229B(row)) return true;
  if (CLOSED_OR_HIDDEN_GOOGLE_DELETE_STATUSES_STAGE229B.has(statusOfStage229B(row))) return true;
  if (isDeletedLike(row)) return true;
  return false;
}

function isGoogleAlreadyGoneStage229B(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /\b(404|410)\b|not\s*found|gone/i.test(message);
}

async function writeSyncDeletedStage229B(row: WorkItemRow, calendarId: string) {
  await updateById('work_items', itemId(row), {
    google_calendar_sync_enabled: true,
    google_calendar_id: calendarId || 'primary',
    google_calendar_event_id: null,
    google_calendar_event_etag: null,
    google_calendar_html_link: null,
    google_calendar_synced_at: new Date().toISOString(),
    google_calendar_sync_status: 'deleted',
    google_calendar_sync_error: null,
    updated_at: new Date().toISOString(),
  });
}
function shouldIncludeByMode(row: WorkItemRow, mode: GoogleCalendarOutboundMode) {
  const status = googleSyncStatusFrom(row);
  const googleEventId = googleEventIdFrom(row);
  if (mode === 'all') return true;
  if (mode === 'failed') return status === 'failed' || status === 'not_connected';
  return !googleEventId || status === 'failed' || status === 'not_connected' || status === 'pending';
}

function isWithinRange(row: WorkItemRow, minMs: number, maxMs: number) {
  const startsAt = startsAtOf(row);
  if (!startsAt) return false;
  const time = new Date(startsAt).getTime();
  return Number.isFinite(time) && time >= minMs && time <= maxMs;
}

function parseReminderOverrides(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeGoogleCalendarEvent(row: WorkItemRow) {
  const startsAt = startsAtOf(row) || new Date().toISOString();
  const type = recordTypeOf(row) === 'task' ? 'task' : 'event';
  const title = asText(row.title) || (type === 'task' ? 'CloseFlow task' : 'CloseFlow event');
  const leadLabel = asText(row.lead_name || row.leadName);
  const caseLabel = asText(row.case_title || row.caseTitle);
  const descriptionParts = [
    asText(row.description),
    'Źródło: CloseFlow',
    'Typ: ' + type,
    leadLabel ? 'Lead: ' + leadLabel : '',
    caseLabel ? 'Sprawa: ' + caseLabel : '',
  ].filter(Boolean);

  return {
    id: itemId(row),
    title,
    startAt: startsAt,
    endAt: endsAtOf(row),
    reminderAt: row.reminder && row.reminder !== 'none' ? asIsoDate(row.reminder) : asIsoDate(row.reminder_at || row.reminderAt),
    recurrenceRule: asText(row.recurrence || row.recurrence_rule || row.recurrenceRule || 'none') || 'none',
    recurrenceEndType: row.recurrence_end_type || row.recurrenceEndType || null,
    recurrenceEndAt: asIsoDate(row.recurrence_end_at || row.recurrenceEndAt),
    recurrenceCount: typeof row.recurrence_count === 'number' ? row.recurrence_count : null,
    kind: type,
    relationLabel: caseLabel || leadLabel || '',
    description: descriptionParts.join('\n'),
    sourceType: type,
    googleCalendarReminders: row.google_calendar_reminders || row.googleCalendarReminders || null,
    googleRemindersUseDefault: row.google_reminders_use_default ?? row.googleRemindersUseDefault ?? null,
    googleRemindersOverrides: parseReminderOverrides(row.google_reminders_overrides || row.googleRemindersOverrides),
    googleAllDay: asBoolean(row.google_all_day || row.googleAllDay),
    googleStartDate: row.google_start_date || row.googleStartDate || null,
    googleEndDate: row.google_end_date || row.googleEndDate || null,
  };
}

async function fetchWorkspaceCalendarItems(workspaceId: string, limit: number) {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  const rows = await supabaseRequest(
    'work_items?workspace_id=eq.' + encodedWorkspaceId + '&select=*&order=updated_at.desc.nullslast&limit=' + encodeURIComponent(String(limit)),
    { method: 'GET' },
  );
  return Array.isArray(rows) ? rows as WorkItemRow[] : [];
}

async function writeSyncSuccess(row: WorkItemRow, googleEvent: any, existingGoogleEventId: string, calendarId: string) {
  await updateById('work_items', itemId(row), {
    google_calendar_sync_enabled: true,
    google_calendar_id: calendarId || 'primary',
    google_calendar_event_id: googleEvent?.id || existingGoogleEventId || null,
    google_calendar_event_etag: googleEvent?.etag || null,
    google_calendar_html_link: googleEvent?.htmlLink || null,
    google_calendar_synced_at: new Date().toISOString(),
    google_calendar_sync_status: 'synced',
    google_calendar_sync_error: null,
    google_calendar_reminders: googleEvent?.reminders || null,
    google_reminders_use_default: Boolean(googleEvent?.reminders?.useDefault),
    google_reminders_overrides: Array.isArray(googleEvent?.reminders?.overrides) ? googleEvent.reminders.overrides : [],
    google_all_day: Boolean(googleEvent?.start?.date && !googleEvent?.start?.dateTime),
    google_start_date: googleEvent?.start?.date || null,
    google_end_date: googleEvent?.end?.date || null,
    updated_at: new Date().toISOString(),
  });
}

async function writeSyncFailure(row: WorkItemRow, message: string) {
  await updateById('work_items', itemId(row), {
    google_calendar_sync_enabled: true,
    google_calendar_sync_status: 'failed',
    google_calendar_sync_error: message.slice(0, 500),
    updated_at: new Date().toISOString(),
  });
}

// GOOGLE_CALENDAR_STAGE12_OUTBOUND_BACKFILL
export async function syncGoogleCalendarOutbound(input: {
  workspaceId: string;
  userId: string;
  mode?: unknown;
  limit?: unknown;
  daysBack?: unknown;
  daysForward?: unknown;
}) {
  const workspaceId = asText(input.workspaceId);
  const userId = asText(input.userId);
  if (!workspaceId) throw new Error('GOOGLE_CALENDAR_WORKSPACE_REQUIRED');
  if (!userId) throw new Error('GOOGLE_CALENDAR_USER_REQUIRED');

  // STAGE231F_R1: ordinary user sync must never use a silent workspace fallback token.
  const connection = await getGoogleCalendarUserConnection(workspaceId, userId);
  if (!connection || connection.sync_enabled === false) {
    return { ok: true, connected: false, connectionScope: 'none', reason: 'user_not_connected', scanned: 0, created: 0, updated: 0, deleted: 0, skipped: 0, failed: 0, personalScopeSkipped: 0, errors: [] };
  }

  const modeRaw = asText(input.mode).toLowerCase();
  const mode: GoogleCalendarOutboundMode = modeRaw === 'failed' || modeRaw === 'all' ? modeRaw : 'pending';
  const limit = Math.max(1, Math.min(500, Math.floor(asNumber(input.limit, 200))));
  const daysBack = Math.max(0, Math.min(365, Math.floor(asNumber(input.daysBack, 30))));
  const daysForward = Math.max(1, Math.min(730, Math.floor(asNumber(input.daysForward, 365))));
  const now = Date.now();
  const minMs = now - daysBack * 24 * 60 * 60 * 1000;
  const maxMs = now + daysForward * 24 * 60 * 60 * 1000;

  const rows = await fetchWorkspaceCalendarItems(workspaceId, limit);
  const errors: Array<{ id?: string; title?: string; error?: string }> = [];
  let created = 0;
  let updated = 0;
  let deleted = 0;
  let skipped = 0;
  let failed = 0;
  let personalScopeSkipped = 0;

  for (const row of rows) {
    const personalScope = googleCalendarPersonalScopeForRowStage231F(row, userId);
    if (!personalScope.matched) {
      // STAGE231F_R1: fail closed. Do not push the entire workspace into a member's private calendar.
      personalScopeSkipped += 1;
      skipped += 1;
      continue;
    }

    const existingGoogleEventIdStage229B = googleEventIdFrom(row);
    if (shouldRemoteDeleteGoogleCalendarEventStage229B(row)) {
      try {
        await deleteGoogleCalendarEvent(connection, existingGoogleEventIdStage229B);
        await writeSyncDeletedStage229B(row, String(connection.google_calendar_id || 'primary'));
        deleted += 1;
      } catch (error) {
        if (isGoogleAlreadyGoneStage229B(error)) {
          await writeSyncDeletedStage229B(row, String(connection.google_calendar_id || 'primary'));
          deleted += 1;
        } else {
          const message = error instanceof Error ? error.message : String(error || 'GOOGLE_CALENDAR_REMOTE_DELETE_FAILED');
          failed += 1;
          errors.push({ id: itemId(row), title: asText(row.title), error: message.slice(0, 300) });
          try {
            await writeSyncFailure(row, 'REMOTE_DELETE_FAILED: ' + message);
          } catch (writeError) {
            errors.push({ id: itemId(row), title: asText(row.title), error: 'SYNC_STATE_WRITE_FAILED: ' + (writeError instanceof Error ? writeError.message : String(writeError)) });
          }
        }
      }
      continue;
    }    if (!itemId(row) || isDeletedLike(row) || !isCalendarVisible(row) || !isWithinRange(row, minMs, maxMs) || !shouldIncludeByMode(row, mode)) {
      skipped += 1;
      continue;
    }

    const existingGoogleEventId = googleEventIdFrom(row);
    const event = normalizeGoogleCalendarEvent(row);

    try {
      const googleEvent = existingGoogleEventId
        ? await updateGoogleCalendarEvent(connection, existingGoogleEventId, event)
        : await createGoogleCalendarEvent(connection, event);
      await writeSyncSuccess(row, googleEvent, existingGoogleEventId, String(connection.google_calendar_id || 'primary'));
      if (existingGoogleEventId) updated += 1;
      else created += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || 'GOOGLE_CALENDAR_OUTBOUND_SYNC_FAILED');
      failed += 1;
      errors.push({ id: itemId(row), title: asText(row.title), error: message.slice(0, 300) });
      try {
        await writeSyncFailure(row, message);
      } catch (writeError) {
        errors.push({ id: itemId(row), title: asText(row.title), error: 'SYNC_STATE_WRITE_FAILED: ' + (writeError instanceof Error ? writeError.message : String(writeError)) });
      }
    }
  }

  return {
    ok: true,
    connected: true,
    connectionScope: 'user',
    personalScope: 'user',
    workspaceWideDefault: false,
    mode,
    connectedCalendarId: String(connection.google_calendar_id || 'primary'),
    scanned: rows.length,
    created,
    updated,
    deleted,
    skipped,
    personalScopeSkipped,
    failed,
    errors,
  };
}
