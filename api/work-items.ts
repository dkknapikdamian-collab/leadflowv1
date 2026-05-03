import { deleteById, insertWithVariants, selectFirstAvailable, updateById } from '../src/server/_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from '../src/server/_request-scope.js';
import { normalizeEventStatus, normalizeTaskStatus } from '../src/lib/domain-statuses.js';
import { assertWorkspaceEntityLimit, assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent, getGoogleCalendarConnection, updateGoogleCalendarEvent } from '../src/server/google-calendar-sync.js';

function asIsoDate(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}
function asBoolean(value: unknown) { return value === true || value === 'true'; }
function isUuid(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function asNullableString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function asNullableUuid(value: unknown) {
  const normalized = asNullableString(value);
  return normalized && isUuid(normalized) ? normalized : null;
}


function getRequestUserId(req: any) {
  const raw =
    req.headers?.['x-user-id']
    || req.headers?.['x-auth-uid']
    || req.headers?.['x-firebase-uid']
    || '';
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '').trim();
}

function googleSyncOptedOut(body: any) {
  return body?.googleCalendarSyncEnabled === false || body?.syncToGoogleCalendar === false;
}

function googleEventIdFrom(row: any, body: any) {
  return String(
    row?.google_calendar_event_id
    || row?.googleCalendarEventId
    || body?.googleCalendarEventId
    || body?.google_calendar_event_id
    || ''
  ).trim();
}

function closeFlowEventForGoogle(row: any, body: any) {
  const startAt =
    asIsoDate(row?.start_at)
    || asIsoDate(row?.scheduled_at)
    || asIsoDate(row?.startAt)
    || asIsoDate(body?.startAt)
    || asIsoDate(body?.scheduledAt)
    || new Date().toISOString();
  const endAt =
    asIsoDate(row?.end_at)
    || asIsoDate(row?.endAt)
    || asIsoDate(body?.endAt)
    || null;
  const reminderAt =
    asIsoDate(row?.reminder)
    || asIsoDate(row?.reminder_at)
    || asIsoDate(row?.reminderAt)
    || asIsoDate(body?.reminderAt)
    || null;

  return {
    id: String(row?.id || body?.id || ''),
    title: String(row?.title || body?.title || 'CloseFlow event'),
    startAt,
    endAt,
    reminderAt,
    recurrenceRule: row?.recurrence ? String(row.recurrence) : body?.recurrenceRule ? String(body.recurrenceRule) : null,
  };
}

async function writeGoogleCalendarSyncState(id: unknown, payload: Record<string, unknown>) {
  const normalizedId = asNullableString(id);
  if (!normalizedId) return;
  try {
    await updateById('work_items', normalizedId, {
      ...payload,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('GOOGLE_CALENDAR_SYNC_STATE_WRITE_FAILED', error instanceof Error ? error.message : String(error));
  }
}

// GOOGLE_CALENDAR_SYNC_V1_STAGE02_EVENT_WIRING
// Non-blocking: CloseFlow event writes must survive Google API failures.
async function syncGoogleCalendarEventAfterMutation(input: {
  action: 'create' | 'update' | 'delete';
  req: any;
  workspaceId: string;
  row: any;
  body: any;
}) {
  const userId = getRequestUserId(input.req);
  const rowId = input.row?.id || input.body?.id;
  if (!input.workspaceId || !userId || !rowId) return;

  if (googleSyncOptedOut(input.body)) {
    await writeGoogleCalendarSyncState(rowId, {
      google_calendar_sync_enabled: false,
      google_calendar_sync_status: 'disabled',
      google_calendar_sync_error: null,
    });
    return;
  }

  let connection: any = null;
  try {
    connection = await getGoogleCalendarConnection(input.workspaceId, userId);
  } catch (error) {
    console.warn('GOOGLE_CALENDAR_CONNECTION_LOOKUP_FAILED', error instanceof Error ? error.message : String(error));
    return;
  }

  if (!connection || connection.sync_enabled === false) return;

  const event = closeFlowEventForGoogle(input.row, input.body);
  const existingGoogleEventId = googleEventIdFrom(input.row, input.body);

  try {
    if (input.action === 'delete') {
      if (existingGoogleEventId) {
        await deleteGoogleCalendarEvent(connection, existingGoogleEventId);
      }
      return;
    }

    const googleEvent = existingGoogleEventId
      ? await updateGoogleCalendarEvent(connection, existingGoogleEventId, event)
      : await createGoogleCalendarEvent(connection, event);

    await writeGoogleCalendarSyncState(rowId, {
      google_calendar_sync_enabled: true,
      google_calendar_id: connection.google_calendar_id || 'primary',
      google_calendar_event_id: googleEvent?.id || existingGoogleEventId || null,
      google_calendar_event_etag: googleEvent?.etag || null,
      google_calendar_html_link: googleEvent?.htmlLink || null,
      google_calendar_synced_at: new Date().toISOString(),
      google_calendar_sync_status: 'synced',
      google_calendar_sync_error: null,
      google_calendar_reminders: googleEvent?.reminders || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || 'GOOGLE_CALENDAR_SYNC_FAILED');
    console.error('GOOGLE_CALENDAR_SYNC_FAILED_NON_BLOCKING', message);
    await writeGoogleCalendarSyncState(rowId, {
      google_calendar_sync_enabled: true,
      google_calendar_sync_status: 'failed',
      google_calendar_sync_error: message.slice(0, 500),
    });
  }
}

function isTaskRow(row: any) {
  const recordType = String(row.record_type || row.recordType || '').toLowerCase();
  const hasStartAt = Boolean(row.start_at || row.startAt || row.end_at || row.endAt);
  if (recordType === 'event') return false;
  if (recordType === 'task') return true;
  if (asBoolean(row.show_in_tasks) || asBoolean(row.showInTasks)) return true;
  if (hasStartAt && !asBoolean(row.show_in_tasks) && !asBoolean(row.showInTasks)) return false;
  return true;
}

function normalizeTask(row: any) {
  const dueAt =
    asIsoDate(row.scheduled_at)
    || asIsoDate(row.due_at)
    || asIsoDate(row.date)
    || asIsoDate(row.dueAt)
    || asIsoDate(row.start_at)
    || asIsoDate(row.created_at)
    || new Date().toISOString();
  const normalizedDate = dueAt.slice(0, 10);
  const reminderAt =
    asIsoDate(row.reminder_at)
    || asIsoDate(row.reminderAt)
    || (typeof row.reminder === 'string' && row.reminder !== 'none' ? asIsoDate(row.reminder) : null);
  const recurrenceRule = String(row.recurrence_rule || row.recurrenceRule || row.recurrence || 'none');
  const reminderMinutes = reminderAt
    ? Math.max(0, Math.round((new Date(dueAt).getTime() - new Date(reminderAt).getTime()) / 60_000))
    : 30;

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    type: String(row.type || row.task_type || 'task'),
    date: normalizedDate,
    dueAt: dueAt.slice(0, 16),
    time: dueAt.slice(11, 16),
    status: normalizeTaskStatus(row.status),
    priority: String(row.priority || 'medium'),
    leadId: row.lead_id ? String(row.lead_id) : row.leadId ? String(row.leadId) : undefined,
    leadName: row.lead_name ? String(row.lead_name) : row.leadName ? String(row.leadName) : undefined,
    caseId: row.case_id ? String(row.case_id) : row.caseId ? String(row.caseId) : undefined,
    reminderAt,
    reminder: reminderAt
      ? { mode: 'once', minutesBefore: reminderMinutes, recurrenceMode: 'daily', recurrenceInterval: 1, until: null }
      : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrenceRule,
    recurrence: { mode: recurrenceRule, interval: 1, until: null, endType: 'never', count: null },
    recurrenceEndType: row.recurrence_end_type ? String(row.recurrence_end_type) : undefined,
    recurrenceEndAt: asIsoDate(row.recurrence_end_at) || null,
    recurrenceCount: typeof row.recurrence_count === 'number' ? row.recurrence_count : null,
  };
}

function isEventRow(row: any) {
  const recordType = String(row.record_type || row.recordType || '').toLowerCase();
  const hasStartAt = Boolean(row.start_at || row.startAt || row.end_at || row.endAt);
  if (recordType === 'task') return false;
  if (recordType === 'event') return true;
  if (hasStartAt) return true;
  if (asBoolean(row.show_in_calendar) && !asBoolean(row.show_in_tasks)) return true;
  return false;
}

function normalizeEvent(row: any) {
  const startAt = row.start_at || row.scheduled_at || row.startAt || null;
  const endAt = row.end_at || row.endAt || null;
  const reminderAt = row.reminder && row.reminder !== 'none' ? String(row.reminder) : '';
  const recurrenceRule = String(row.recurrence || 'none');
  const reminderMinutes = reminderAt && startAt
    ? Math.max(0, Math.round((new Date(String(startAt)).getTime() - new Date(reminderAt).getTime()) / 60_000))
    : 30;

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    type: String(row.type || 'meeting'),
    startAt: String(startAt || ''),
    endAt: endAt ? String(endAt) : '',
    status: normalizeEventStatus(row.status),
    reminderAt,
    reminder: reminderAt
      ? { mode: 'once', minutesBefore: reminderMinutes, recurrenceMode: 'daily', recurrenceInterval: 1, until: null }
      : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrenceRule,
    recurrence: { mode: recurrenceRule, interval: 1, until: null, endType: 'never', count: null },
    leadId: row.lead_id ? String(row.lead_id) : row.leadId ? String(row.leadId) : undefined,
    leadName: row.lead_name ? String(row.lead_name) : row.leadName ? String(row.leadName) : undefined,
    caseId: row.case_id ? String(row.case_id) : row.caseId ? String(row.caseId) : undefined,
  };
}

async function syncLeadNextAction(
  leadId: unknown,
  item: { id?: unknown; title?: unknown; scheduledAt?: unknown; startAt?: unknown },
  workspaceId: string,
) {
  const normalizedLeadId = asNullableUuid(leadId);
  if (!normalizedLeadId || !workspaceId) return;
  await requireScopedRow('leads', normalizedLeadId, workspaceId, 'LEAD_NOT_FOUND');
  const at = item.scheduledAt ?? item.startAt;
  await updateById('leads', normalizedLeadId, {
    next_action_title: String(item.title || ''),
    next_action_at: at ? new Date(String(at)).toISOString() : null,
    next_action_item_id: item.id ? String(item.id) : null,
    updated_at: new Date().toISOString(),
  });
}

async function clearLeadNextActionIfCurrent(leadId: unknown, itemId: unknown, workspaceId: string) {
  const normalizedLeadId = asNullableUuid(leadId);
  const normalizedItemId = asNullableString(itemId);
  if (!normalizedLeadId || !normalizedItemId || !workspaceId) return;
  const row = await requireScopedRow('leads', normalizedLeadId, workspaceId, 'LEAD_NOT_FOUND');
  const currentItemId = row?.next_action_item_id ? String(row.next_action_item_id) : null;
  if (currentItemId !== normalizedItemId) return;
  await updateById('leads', normalizedLeadId, {
    next_action_title: null,
    next_action_at: null,
    next_action_item_id: null,
    updated_at: new Date().toISOString(),
  });
}

function asKind(req: any, body: any) {
  const raw = req?.query?.kind ?? body?.kind ?? '';
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

export default async function handler(req: any, res: any) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);
    const kind = asKind(req, body) || 'tasks';

    if (kind !== 'tasks' && kind !== 'events') {
      res.status(400).json({ error: 'WORK_ITEM_KIND_REQUIRED' });
      return;
    }
    // P0_SERVICE_ROLE_SCOPE_MUTATION_GATE
    // Service role bypasses RLS, so every mutation must use the workspace from auth context only.
    if (req.method !== 'GET') {
      if (!workspaceId) {
        res.status(401).json({ error: kind === 'events' ? 'EVENT_WORKSPACE_REQUIRED' : 'TASK_WORKSPACE_REQUIRED' });
        return;
      }
      await assertWorkspaceWriteAccess(workspaceId, req);
    }

    if (req.method === 'GET') {
      if (!workspaceId) {
        res.status(401).json({ error: kind === 'events' ? 'EVENT_WORKSPACE_REQUIRED' : 'TASK_WORKSPACE_REQUIRED' });
        return;
      }
      if (kind === 'tasks') {
        const result = await selectFirstAvailable([
          withWorkspaceFilter('work_items?select=*&show_in_tasks=is.true&order=created_at.desc.nullslast&limit=200', workspaceId),
          withWorkspaceFilter('work_items?select=*&record_type=eq.task&order=created_at.desc.nullslast&limit=200', workspaceId),
          withWorkspaceFilter('work_items?select=*&type=eq.task&order=created_at.desc.nullslast&limit=200', workspaceId),
          withWorkspaceFilter('work_items?select=*&order=created_at.desc.nullslast&limit=200', workspaceId),
        ]);
        res.status(200).json((result.data || []).filter(isTaskRow).map(normalizeTask));
        return;
      }

      const result = await selectFirstAvailable([
        withWorkspaceFilter('work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=200', workspaceId),
        withWorkspaceFilter('work_items?select=*&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=200', workspaceId),
        withWorkspaceFilter('work_items?select=*&order=start_at.asc.nullslast&limit=200', workspaceId),
      ]);
      res.status(200).json((result.data || []).filter(isEventRow).map(normalizeEvent));
      return;
    }

    if (req.method === 'PATCH') {
      if (!workspaceId) {
        res.status(401).json({ error: kind === 'events' ? 'EVENT_WORKSPACE_REQUIRED' : 'TASK_WORKSPACE_REQUIRED' });
        return;
      }
      if (!body.id) {
        res.status(400).json({ error: kind === 'events' ? 'EVENT_ID_REQUIRED' : 'TASK_ID_REQUIRED' });
        return;
      }

      const currentRow = await requireScopedRow('work_items', String(body.id), workspaceId, kind === 'events' ? 'EVENT_NOT_FOUND' : 'TASK_NOT_FOUND');
      // P0_SERVICE_ROLE_SCOPE_RELATION_GUARD
      if (body.leadId !== undefined && asNullableUuid(body.leadId)) {
        await requireScopedRow('leads', asNullableUuid(body.leadId)!, workspaceId, 'LEAD_NOT_FOUND');
      }
      if (body.caseId !== undefined && asNullableUuid(body.caseId)) {
        await requireScopedRow('cases', asNullableUuid(body.caseId)!, workspaceId, 'CASE_NOT_FOUND');
      }
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (body.title !== undefined) payload.title = body.title;
      if (body.type !== undefined) payload.type = body.type;
      if (body.status !== undefined) payload.status = kind === 'events' ? normalizeEventStatus(body.status) : normalizeTaskStatus(body.status);

      if (kind === 'tasks') {
        if (body.priority !== undefined) payload.priority = body.priority;
        if (body.date !== undefined) payload.scheduled_at = body.date ? new Date(`${body.date}T09:00:00`).toISOString() : null;
        if (body.scheduledAt !== undefined) payload.scheduled_at = body.scheduledAt ? new Date(body.scheduledAt).toISOString() : null;
        if (body.leadId !== undefined) payload.lead_id = asNullableUuid(body.leadId);
        if (body.caseId !== undefined) payload.case_id = asNullableUuid(body.caseId);
        if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';
        if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';
      } else {
        if (body.startAt !== undefined) {
          const iso = body.startAt ? new Date(body.startAt).toISOString() : null;
          payload.start_at = iso;
          payload.scheduled_at = iso;
        }
        if (body.endAt !== undefined) payload.end_at = body.endAt ? new Date(body.endAt).toISOString() : null;
        if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';
        if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';
        if (body.leadId !== undefined) payload.lead_id = asNullableUuid(body.leadId);
        if (body.caseId !== undefined) payload.case_id = asNullableUuid(body.caseId);
      }

      const data = await updateById('work_items', String(body.id), payload);
      const updatedRow = Array.isArray(data) && data[0] ? data[0] : { ...currentRow, ...payload, id: body.id };
      const effectiveLeadId = body.leadId !== undefined ? body.leadId : updatedRow.lead_id;
      const nextStatus = typeof (body.status ?? updatedRow.status) === 'string' ? String(body.status ?? updatedRow.status).toLowerCase() : '';

      if (effectiveLeadId && (nextStatus === 'done' || nextStatus === 'completed')) {
        await clearLeadNextActionIfCurrent(effectiveLeadId, body.id, workspaceId);
      } else if (effectiveLeadId) {
        await syncLeadNextAction(
          effectiveLeadId,
          {
            id: body.id,
            title: body.title ?? payload.title ?? updatedRow.title,
            scheduledAt: kind === 'tasks' ? (body.scheduledAt ?? payload.scheduled_at ?? body.date ?? updatedRow.scheduled_at) : undefined,
            startAt: kind === 'events' ? (body.startAt ?? payload.start_at ?? updatedRow.start_at) : undefined,
          },
          workspaceId,
        );
      }

      if (kind === 'events') {


        await syncGoogleCalendarEventAfterMutation({ action: 'update', req, workspaceId, row: updatedRow as any, body });


      }



      res.status(200).json(kind === 'events' ? normalizeEvent(updatedRow) : normalizeTask(updatedRow));
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '');
      if (!workspaceId) {
        res.status(401).json({ error: kind === 'events' ? 'EVENT_WORKSPACE_REQUIRED' : 'TASK_WORKSPACE_REQUIRED' });
        return;
      }
      if (!id) {
        res.status(400).json({ error: kind === 'events' ? 'EVENT_ID_REQUIRED' : 'TASK_ID_REQUIRED' });
        return;
      }

      const currentRow = await requireScopedRow('work_items', id, workspaceId, kind === 'events' ? 'EVENT_NOT_FOUND' : 'TASK_NOT_FOUND');
      if (kind === 'events') {
        await syncGoogleCalendarEventAfterMutation({ action: 'delete', req, workspaceId, row: currentRow, body: { ...body, id } });
      }
      if (currentRow?.lead_id) await clearLeadNextActionIfCurrent(currentRow.lead_id, id, workspaceId);
      await deleteById('work_items', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const finalWorkspaceId = workspaceId;
    if (!finalWorkspaceId) {
      res.status(401).json({ error: kind === 'events' ? 'EVENT_WORKSPACE_REQUIRED' : 'TASK_WORKSPACE_REQUIRED' });
      return;
    }

    const nowIso = new Date().toISOString();
    await assertWorkspaceEntityLimit(finalWorkspaceId, kind === 'events' ? 'event' : 'task');

    if (kind === 'tasks') {
      const scheduledAt = body.scheduledAt
        ? new Date(body.scheduledAt).toISOString()
        : body.date
          ? new Date(`${body.date}T09:00:00`).toISOString()
          : null;
      if (body.leadId !== undefined && asNullableUuid(body.leadId)) {
        await requireScopedRow('leads', asNullableUuid(body.leadId)!, finalWorkspaceId, 'LEAD_NOT_FOUND');
      }
      if (body.caseId !== undefined && asNullableUuid(body.caseId)) {
        await requireScopedRow('cases', asNullableUuid(body.caseId)!, finalWorkspaceId, 'CASE_NOT_FOUND');
      }
      const payload = {
        workspace_id: finalWorkspaceId,
        created_by_user_id: asNullableUuid(body.ownerId),
        lead_id: asNullableUuid(body.leadId),
        case_id: asNullableUuid(body.caseId),
        record_type: 'task',
        type: body.type || 'task',
        title: body.title,
        description: '',
        status: normalizeTaskStatus(body.status),
        priority: body.priority || 'medium',
        scheduled_at: scheduledAt,
        start_at: null,
        end_at: null,
        recurrence: body.recurrenceRule || 'none',
        reminder: body.reminderAt || 'none',
        show_in_tasks: true,
        show_in_calendar: true,
        created_at: nowIso,
        updated_at: nowIso,
      };
      const result = await insertWithVariants(['work_items'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      if (body.leadId) await syncLeadNextAction(body.leadId, { id: (inserted as any).id, title: body.title, scheduledAt }, finalWorkspaceId);
      res.status(200).json(normalizeTask(inserted));
      return;
    }

    const startAt = body.startAt ? new Date(body.startAt).toISOString() : nowIso;
    if (body.leadId !== undefined && asNullableUuid(body.leadId)) {
      await requireScopedRow('leads', asNullableUuid(body.leadId)!, finalWorkspaceId, 'LEAD_NOT_FOUND');
    }
    if (body.caseId !== undefined && asNullableUuid(body.caseId)) {
      await requireScopedRow('cases', asNullableUuid(body.caseId)!, finalWorkspaceId, 'CASE_NOT_FOUND');
    }
    const payload = {
      workspace_id: finalWorkspaceId,
      created_by_user_id: asNullableUuid(body.ownerId),
      lead_id: asNullableUuid(body.leadId),
      case_id: asNullableUuid(body.caseId),
      record_type: 'event',
      type: body.type || 'meeting',
      title: body.title,
      description: '',
      status: normalizeEventStatus(body.status),
      priority: 'medium',
      scheduled_at: startAt,
      start_at: startAt,
      end_at: body.endAt ? new Date(body.endAt).toISOString() : null,
      recurrence: body.recurrenceRule || 'none',
      reminder: body.reminderAt || 'none',
      show_in_tasks: false,
      show_in_calendar: true,
      created_at: nowIso,
      updated_at: nowIso,
    };
    const result = await insertWithVariants(['work_items'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    if (body.leadId) await syncLeadNextAction(body.leadId, { id: (inserted as any).id, title: body.title, startAt }, finalWorkspaceId);
    await syncGoogleCalendarEventAfterMutation({ action: 'create', req, workspaceId: finalWorkspaceId, row: inserted as any, body });
    res.status(200).json(normalizeEvent(inserted));
  } catch (error: any) {
    const message = error?.message || 'WORK_ITEMS_API_FAILED';
    const notFound = new Set(['TASK_NOT_FOUND', 'EVENT_NOT_FOUND', 'LEAD_NOT_FOUND']);
    const workspaceCodes = new Set(['SUPABASE_WORKSPACE_ID_MISSING', 'EVENT_WORKSPACE_REQUIRED', 'TASK_WORKSPACE_REQUIRED']);
    const isWorkspaceError = workspaceCodes.has(message) || message === 'WORKSPACE_CONTEXT_REQUIRED' || message.endsWith('_WORKSPACE_REQUIRED');
    const statusCode = notFound.has(message) ? 404 : isWorkspaceError ? 401 : 500;
    res.status(statusCode).json({ error: message });
  }
}
