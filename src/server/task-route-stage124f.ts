// STAGE124F_VERCEL_HOBBY_CONSOLIDATED_TASK_ROUTE
// STAGE124D_SUPABASE_EGRESS_LIGHT_TASK_ROUTE
import { deleteByIdScoped, insertWithVariants, selectFirstAvailable, updateByIdScoped } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';
import { normalizeTaskListContract } from '../lib/data-contract.js';

const TASK_LIST_SELECT_STAGE124D = [
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
  'due_at',
  'date',
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

const TASK_LIST_SELECT_STAGE124D_MIN = [
  'id',
  'workspace_id',
  'lead_id',
  'record_type',
  'type',
  'title',
  'status',
  'priority',
  'scheduled_at',
  'due_at',
  'date',
  'start_at',
  'end_at',
  'recurrence',
  'reminder',
  'show_in_tasks',
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
  const text = asText(value);
  if (!text) return null;
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(text) ? text + 'T00:00:00.000Z' : text;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
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

function normalizeTask(row: Record<string, unknown>) {
  const normalized = normalizeTaskListContract([row])[0] || row;
  const scheduledAt = asIsoDate((normalized as any).scheduledAt)
    || asIsoDate((normalized as any).dueAt)
    || asIsoDate((normalized as any).date)
    || asIsoDate((normalized as any).startAt)
    || asIsoDate((normalized as any).createdAt)
    || new Date().toISOString();

  return {
    ...normalized,
    id: String((normalized as any).id || row.id || crypto.randomUUID()),
    title: String((normalized as any).title || row.title || ''),
    type: String((normalized as any).type || row.type || row.task_type || 'task'),
    date: scheduledAt.slice(0, 10),
    scheduledAt,
    dueAt: scheduledAt,
    status: String((normalized as any).status || row.status || 'todo'),
    priority: String((normalized as any).priority || row.priority || 'medium'),
    leadId: (normalized as any).leadId || (row.lead_id ? String(row.lead_id) : undefined),
    caseId: (normalized as any).caseId || (row.case_id ? String(row.case_id) : undefined),
    clientId: (normalized as any).clientId || (row.client_id ? String(row.client_id) : undefined),
    reminderAt: (normalized as any).reminderAt || asIsoDate(row.reminder_at) || (typeof row.reminder === 'string' && row.reminder !== 'none' ? asIsoDate(row.reminder) : null),
    recurrenceRule: String((normalized as any).recurrenceRule || row.recurrence_rule || row.recurrence || 'none'),
  };
}

async function syncLeadNextAction(workspaceId: string, leadId: unknown, item: { id?: unknown; title?: unknown; scheduledAt?: unknown }) {
  const normalizedLeadId = asText(leadId);
  if (!normalizedLeadId) return;
  await updateByIdScoped('leads', normalizedLeadId, workspaceId, {
    next_action_title: String(item.title || ''),
    next_action_at: item.scheduledAt ? new Date(String(item.scheduledAt)).toISOString() : null,
    next_action_item_id: item.id ? String(item.id) : null,
    updated_at: new Date().toISOString(),
  });
}

async function readTasks(req: any, workspaceId: string) {
  const limit = capLimit(queryValue(req, 'limit'));
  const from = asIsoDate(queryValue(req, 'from') || queryValue(req, 'start') || queryValue(req, 'dateFrom'));
  const to = asIsoDate(queryValue(req, 'to') || queryValue(req, 'end') || queryValue(req, 'dateTo'));

  const baseQueries = [
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&show_in_tasks=is.true&order=scheduled_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D_MIN + '&show_in_tasks=is.true&order=scheduled_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D_MIN + '&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,
  ];

  const queries = baseQueries
    .map((query) => addDateRange(query, 'scheduled_at', from, to))
    .map((query) => withWorkspaceFilter(query, workspaceId));

  const result = await selectFirstAvailable(queries);
  return Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];
}

function sendError(res: any, error: any, fallback: string) {
  const status = Number(error?.status || 500);
  res.status(status).json({ error: error?.code || error?.message || fallback });
}

export default async function taskRouteStage124FHandler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const workspaceId = await resolveRequestWorkspaceId(req);
      const rows = await readTasks(req, workspaceId);
      res.status(200).json(rows.map(normalizeTask));
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);

    if (req.method === 'PATCH') {
      if (!body.id) {
        res.status(400).json({ error: 'TASK_ID_REQUIRED' });
        return;
      }

      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.title !== undefined) payload.title = body.title;
      if (body.type !== undefined) payload.type = body.type;
      if (body.status !== undefined) payload.status = body.status;
      if (body.priority !== undefined) payload.priority = body.priority;
      if (body.date !== undefined) payload.scheduled_at = body.date ? new Date(String(body.date) + 'T09:00:00').toISOString() : null;
      if (body.scheduledAt !== undefined) payload.scheduled_at = body.scheduledAt ? new Date(body.scheduledAt).toISOString() : null;
      if (body.leadId !== undefined) payload.lead_id = body.leadId || null;
      if (body.caseId !== undefined) payload.case_id = body.caseId || null;
      if (body.clientId !== undefined) payload.client_id = body.clientId || null;
      if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';
      if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';

      const data = await updateByIdScoped('work_items', String(body.id), workspaceId, payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      if (body.leadId) {
        await syncLeadNextAction(workspaceId, body.leadId, {
          id: body.id,
          title: body.title ?? payload.title,
          scheduledAt: body.scheduledAt ?? payload.scheduled_at ?? body.date,
        });
      }
      res.status(200).json(normalizeTask(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = queryValue(req, 'id');
      if (!id) {
        res.status(400).json({ error: 'TASK_ID_REQUIRED' });
        return;
      }
      await deleteByIdScoped('work_items', id, workspaceId);
      res.status(200).json({ ok: true, id });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const nowIso = new Date().toISOString();
    const scheduledAt = body.scheduledAt
      ? new Date(body.scheduledAt).toISOString()
      : body.date
        ? new Date(String(body.date) + 'T09:00:00').toISOString()
        : null;

    const payload = {
      workspace_id: workspaceId,
      created_by_user_id: null,
      lead_id: body.leadId || null,
      case_id: body.caseId || null,
      client_id: body.clientId || null,
      record_type: 'task',
      type: body.type || 'task',
      title: body.title,
      description: body.description || '',
      status: body.status || 'todo',
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
    if (body.leadId) {
      await syncLeadNextAction(workspaceId, body.leadId, {
        id: (inserted as Record<string, unknown>).id,
        title: body.title,
        scheduledAt,
      });
    }

    res.status(200).json(normalizeTask(inserted as Record<string, unknown>));
  } catch (error: any) {
    sendError(res, error, 'TASK_ROUTE_FAILED');
  }
}
