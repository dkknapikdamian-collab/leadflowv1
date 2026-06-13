// STAGE124F_VERCEL_HOBBY_CONSOLIDATED_EVENT_ROUTE
// STAGE124D_SUPABASE_EGRESS_LIGHT_EVENT_ROUTE
import { deleteByIdScoped, insertWithVariants, selectFirstAvailable, updateByIdScoped, updateById } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';
import { normalizeEventListContract } from '../lib/data-contract.js';
import { normalizeCloseFlowDateTimeToUtcIso } from '../lib/calendar-timezone-contract.js';

const EVENT_LIST_SELECT_STAGE124D = [
  'id',
  'workspace_id',
  'lead_id',
  'case_id',
  'client_id',
  'record_type',
  'type',
  'title',
  'status',
  'priority',
  'scheduled_at',
  'start_at',
  'end_at',
  'recurrence',
  'recurrence_rule',
  'recurrence_end_type',
  'recurrence_end_at',
  'recurrence_count',
  'reminder',
  'reminder_at',
  'show_in_tasks',
  'show_in_calendar',
  'created_at',
  'updated_at',
].join(',');

const EVENT_LIST_SELECT_STAGE124D_MIN = [
  'id',
  'workspace_id',
  'lead_id',
  'case_id',
  'client_id',
  'record_type',
  'type',
  'title',
  'status',
  'scheduled_at',
  'start_at',
  'end_at',
  'recurrence',
  'reminder',
  'show_in_calendar',
  'created_at',
  'updated_at',
].join(',');

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return asText(value[0]);
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function queryValue(req: any, name: string) {
  return asText(req?.query?.[name]);
}

function asIsoDate(value: unknown) {
  return normalizeCloseFlowDateTimeToUtcIso(value);
}

function capLimit(value: unknown) {
  const parsed = Number(asText(value) || 200);
  if (!Number.isFinite(parsed) || parsed <= 0) return 200;
  return Math.min(Math.floor(parsed), 200);
}

function addDateRange(path: string, field: string, from?: string | null, to?: string | null) {
  let next = path;
  if (from) next += '&' + field + '=gte.' + encodeURIComponent(from);
  if (to) next += '&' + field + '=lte.' + encodeURIComponent(to);
  return next;
}

function normalizeEvent(row: Record<string, unknown>) {
  const normalized = normalizeEventListContract([row])[0] || row;
  const startAt = asIsoDate((normalized as any).startAt)
    || asIsoDate((normalized as any).scheduledAt)
    || asIsoDate((normalized as any).startsAt)
    || asIsoDate(row.start_at)
    || asIsoDate(row.scheduled_at)
    || new Date().toISOString();

  return {
    ...normalized,
    id: String((normalized as any).id || row.id || crypto.randomUUID()),
    title: String((normalized as any).title || row.title || ''),
    type: String((normalized as any).type || row.type || 'meeting'),
    startAt,
    startsAt: startAt,
    scheduledAt: startAt,
    endAt: asIsoDate((normalized as any).endAt) || asIsoDate(row.end_at) || '',
    status: String((normalized as any).status || row.status || 'scheduled'),
    leadId: (normalized as any).leadId || (row.lead_id ? String(row.lead_id) : undefined),
    caseId: (normalized as any).caseId || (row.case_id ? String(row.case_id) : undefined),
    clientId: (normalized as any).clientId || (row.client_id ? String(row.client_id) : undefined),
    reminderAt: (normalized as any).reminderAt || asIsoDate(row.reminder_at) || (typeof row.reminder === 'string' && row.reminder !== 'none' ? asIsoDate(row.reminder) : null),
    recurrenceRule: String((normalized as any).recurrenceRule || row.recurrence_rule || row.recurrence || 'none'),
  };
}

async function syncLeadNextAction(workspaceId: string, leadId: unknown, item: { id?: unknown; title?: unknown; startAt?: unknown }) {
  const normalizedLeadId = asText(leadId);
  if (!normalizedLeadId) return;
  await updateByIdScoped('leads', normalizedLeadId, workspaceId, {
    next_action_title: String(item.title || ''),
    next_action_at: item.startAt ? normalizeCloseFlowDateTimeToUtcIso(item.startAt) : null,
    next_action_item_id: item.id ? String(item.id) : null,
    updated_at: new Date().toISOString(),
  });
}


const CALENDAR_HIDDEN_EVENT_STATUSES_STAGE229A = new Set(['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed']);
function shouldHideEventFromCalendarStage229A(value: unknown) { return CALENDAR_HIDDEN_EVENT_STATUSES_STAGE229A.has(asText(value).toLowerCase()); }
function shouldHideEventFromTasksStage229A(value: unknown) { return ['deleted', 'archived', 'removed'].includes(asText(value).toLowerCase()); }

async function readEvents(req: any, workspaceId: string) {
  const limit = capLimit(queryValue(req, 'limit'));
  const from = asIsoDate(queryValue(req, 'from') || queryValue(req, 'start') || queryValue(req, 'dateFrom'));
  const to = asIsoDate(queryValue(req, 'to') || queryValue(req, 'end') || queryValue(req, 'dateTo'));
  const caseId = queryValue(req, 'caseId') || queryValue(req, 'case_id');

  const baseQueries = [
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&record_type=eq.event&order=start_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&type=eq.event&order=start_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D_MIN + '&record_type=eq.event&order=start_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D_MIN + '&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=' + limit,
  ];

  const queries = baseQueries
    .map((query) => addDateRange(query, 'start_at', from, to))
    .map((query) => caseId ? query + '&case_id=eq.' + encodeURIComponent(caseId) : query)
    .map((query) => withWorkspaceFilter(query, workspaceId));

  const result = await selectFirstAvailable(queries);
  const rows = Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];
  return rows.filter((row) => {
    const status = asText((row as any).status).toLowerCase();
    return !['deleted', 'archived', 'removed'].includes(status) && (row as any).show_in_calendar !== false;
  });
}

function sendError(res: any, error: any, fallback: string) {
  const status = Number(error?.status || 500);
  res.status(status).json({ error: error?.code || error?.message || fallback });
}

export default async function eventRouteStage124FHandler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const workspaceId = await resolveRequestWorkspaceId(req);
      const rows = await readEvents(req, workspaceId);
      res.status(200).json(rows.map(normalizeEvent));
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);

    if (req.method === 'PATCH') {
      if (!body.id) {
        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });
        return;
      }

      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.title !== undefined) payload.title = body.title;
      if (body.type !== undefined) payload.type = body.type;
      if (body.status !== undefined) payload.status = body.status;
      if (body.startAt !== undefined) {
        const iso = body.startAt ? normalizeCloseFlowDateTimeToUtcIso(body.startAt) : null;
        payload.start_at = iso;
        payload.scheduled_at = iso;
      }
      if (body.endAt !== undefined) payload.end_at = body.endAt ? normalizeCloseFlowDateTimeToUtcIso(body.endAt) : null;
      if (body.leadId !== undefined) payload.lead_id = body.leadId || null;
      if (body.caseId !== undefined) payload.case_id = body.caseId || null;
      if (body.clientId !== undefined) payload.client_id = body.clientId || null;
      if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';
      if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';

      if (body.showInTasks !== undefined) payload.show_in_tasks = Boolean(body.showInTasks);
      if (body.show_in_tasks !== undefined) payload.show_in_tasks = Boolean(body.show_in_tasks);
      if (body.showInCalendar !== undefined) payload.show_in_calendar = Boolean(body.showInCalendar);
      if (body.show_in_calendar !== undefined) payload.show_in_calendar = Boolean(body.show_in_calendar);
      const nextStatusForCalendarStage229A = body.status ?? payload.status;
      if (shouldHideEventFromCalendarStage229A(nextStatusForCalendarStage229A)) payload.show_in_calendar = false;
      if (shouldHideEventFromTasksStage229A(nextStatusForCalendarStage229A)) payload.show_in_tasks = false;

      const data = await updateByIdScoped('work_items', String(body.id), workspaceId, payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      if (body.leadId) {
        await syncLeadNextAction(workspaceId, body.leadId, {
          id: body.id,
          title: body.title ?? payload.title,
          startAt: body.startAt ?? payload.start_at,
        });
      }
      res.status(200).json(normalizeEvent(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const STAGE228R23_SOFT_DELETE_WORK_ITEMS_EVENTS = 'Event delete is stable soft-delete: status=deleted + hidden flags, including legacy workspace-null rows';
      void STAGE228R23_SOFT_DELETE_WORK_ITEMS_EVENTS;
      const STAGE228R22_VERIFIED_SQL_EVENT_DELETE = 'compat: R23 replaces physical event hard delete with verified soft delete';
      const EVENT_DELETE_VERIFY_FAILED_COMPAT_STAGE228R22 = 'EVENT_DELETE_VERIFY_FAILED';
      void STAGE228R22_VERIFIED_SQL_EVENT_DELETE;
      void EVENT_DELETE_VERIFY_FAILED_COMPAT_STAGE228R22;

      const id = queryValue(req, 'id');
      if (!id) {
        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });
        return;
      }

      const selectPathStage228R23 = 'work_items?select=id,workspace_id,lead_id,client_id,case_id,record_type,type,status,title,show_in_tasks,show_in_calendar&id=eq.' + encodeURIComponent(id) + '&limit=1';
      const scopedBeforeStage228R23 = await selectFirstAvailable([withWorkspaceFilter(selectPathStage228R23, workspaceId)]).catch(() => ({ data: [] }));
      let beforeRowsStage228R23 = Array.isArray((scopedBeforeStage228R23 as any)?.data) ? (scopedBeforeStage228R23 as any).data as Record<string, unknown>[] : [];

      if (!beforeRowsStage228R23.length) {
        const unscopedBeforeStage228R23 = await selectFirstAvailable([selectPathStage228R23]).catch(() => ({ data: [] }));
        beforeRowsStage228R23 = Array.isArray((unscopedBeforeStage228R23 as any)?.data) ? (unscopedBeforeStage228R23 as any).data as Record<string, unknown>[] : [];
      }

      if (!beforeRowsStage228R23.length) {
        res.status(200).json({ ok: true, id, alreadyMissing: true, verified: true });
        return;
      }

      const rowStage228R23 = beforeRowsStage228R23[0] || {};
      const rowWorkspaceIdStage228R23 = asText((rowStage228R23 as any).workspace_id);
      const payloadStage228R23 = {
        status: 'deleted',
        show_in_tasks: false,
        show_in_calendar: false,
        updated_at: new Date().toISOString(),
      };

      if (rowWorkspaceIdStage228R23 && rowWorkspaceIdStage228R23 !== workspaceId) {
        res.status(409).json({
          error: 'EVENT_DELETE_WORKSPACE_MISMATCH',
          id,
          workspaceId,
          rowWorkspaceId: rowWorkspaceIdStage228R23,
        });
        return;
      }

      if (rowWorkspaceIdStage228R23) {
        await updateByIdScoped('work_items', id, workspaceId, payloadStage228R23);
      } else {
        await updateById('work_items', id, payloadStage228R23);
      }

      const afterStage228R23 = await selectFirstAvailable([selectPathStage228R23]).catch(() => ({ data: [] }));
      const afterRowsStage228R23 = Array.isArray((afterStage228R23 as any)?.data) ? (afterStage228R23 as any).data as Record<string, unknown>[] : [];
      const afterRowStage228R23 = afterRowsStage228R23[0] || null;
      const afterStatusStage228R23 = asText((afterRowStage228R23 as any)?.status).toLowerCase();
      const hiddenStage228R23 = !afterRowStage228R23 || (['deleted', 'archived', 'removed'].includes(afterStatusStage228R23) && (afterRowStage228R23 as any).show_in_tasks !== true && (afterRowStage228R23 as any).show_in_calendar !== true);

      if (!hiddenStage228R23) {
        res.status(500).json({ error: 'EVENT_DELETE_HIDE_VERIFY_FAILED', id, status: afterStatusStage228R23 });
        return;
      }

      res.status(200).json({ ok: true, id, deleted: true, hidden: true, verified: true });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const nowIso = new Date().toISOString();
    const startAt = body.startAt ? normalizeCloseFlowDateTimeToUtcIso(body.startAt) || nowIso : nowIso;
    const payload = {
      workspace_id: workspaceId,
      created_by_user_id: null,
      lead_id: body.leadId || null,
      case_id: body.caseId || null,
      client_id: body.clientId || null,
      record_type: 'event',
      type: body.type || 'meeting',
      title: body.title,
      description: body.description || '',
      status: body.status || 'scheduled',
      priority: 'medium',
      scheduled_at: startAt,
      start_at: startAt,
      end_at: body.endAt ? normalizeCloseFlowDateTimeToUtcIso(body.endAt) : null,
      recurrence: body.recurrenceRule || 'none',
      reminder: body.reminderAt || 'none',
      show_in_tasks: false,
      show_in_calendar: true,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const result = await insertWithVariants(['work_items'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    if (body.leadId) {
      await syncLeadNextAction(workspaceId, body.leadId, {
        id: (inserted as Record<string, unknown>).id,
        title: body.title,
        startAt,
      });
    }

    res.status(200).json(normalizeEvent(inserted as Record<string, unknown>));
  } catch (error: any) {
    sendError(res, error, 'EVENT_ROUTE_FAILED');
  }
}
