// STAGE124F_VERCEL_HOBBY_CONSOLIDATED_TASK_ROUTE
// STAGE124D_SUPABASE_EGRESS_LIGHT_TASK_ROUTE
import { deleteByIdScoped, insertWithVariants, selectFirstAvailable, updateByIdScoped, updateById } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';
import { normalizeTaskListContract } from '../lib/data-contract.js';
import { normalizeCloseFlowDateTimeToUtcIso } from '../lib/calendar-timezone-contract.js';

const STAGE228R17_MISSING_ITEM_DELETE_CONTRACT = 'Task route does not promote deleted/done/missing_item records to lead next action and clears matching deleted next_action_item_id';
void STAGE228R17_MISSING_ITEM_DELETE_CONTRACT;

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


const CLOSED_TASK_STATUSES_FOR_LEAD_NEXT_ACTION_STAGE228R17 = new Set(['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted']);

function isClosedTaskStatusForLeadNextActionStage228R17(value: unknown) {
  return CLOSED_TASK_STATUSES_FOR_LEAD_NEXT_ACTION_STAGE228R17.has(asText(value).toLowerCase());
}

function isMissingItemTypeForLeadNextActionStage228R17(value: unknown) {
  return asText(value).toLowerCase() === 'missing_item';
}

async function clearLeadNextActionIfMatchingTaskStage228R17(workspaceId: string, leadId: unknown, taskId: unknown) {
  const normalizedLeadId = asText(leadId);
  const normalizedTaskId = asText(taskId);
  if (!normalizedLeadId || !normalizedTaskId) return;

  const current = await selectFirstAvailable([
    withWorkspaceFilter(
      'leads?select=id,next_action_item_id&id=eq.' + encodeURIComponent(normalizedLeadId) + '&next_action_item_id=eq.' + encodeURIComponent(normalizedTaskId) + '&limit=1',
      workspaceId,
    ),
  ]).catch(() => null);
  const row = Array.isArray(current?.data) ? current.data[0] as Record<string, unknown> | undefined : undefined;
  if (!row) return;

  await updateByIdScoped('leads', normalizedLeadId, workspaceId, {
    next_action_title: '',
    next_action_at: null,
    next_action_item_id: null,
    updated_at: new Date().toISOString(),
  });
}

async function syncLeadNextAction(workspaceId: string, leadId: unknown, item: { id?: unknown; title?: unknown; scheduledAt?: unknown }) {
  const normalizedLeadId = asText(leadId);
  if (!normalizedLeadId) return;
  await updateByIdScoped('leads', normalizedLeadId, workspaceId, {
    next_action_title: String(item.title || ''),
    next_action_at: item.scheduledAt ? normalizeCloseFlowDateTimeToUtcIso(item.scheduledAt) : null,
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
      if (body.date !== undefined) payload.scheduled_at = body.date ? normalizeCloseFlowDateTimeToUtcIso(String(body.date) + 'T09:00') : null;
      if (body.scheduledAt !== undefined) payload.scheduled_at = body.scheduledAt ? normalizeCloseFlowDateTimeToUtcIso(body.scheduledAt) : null;
      if (body.leadId !== undefined) payload.lead_id = body.leadId || null;
      if (body.caseId !== undefined) payload.case_id = body.caseId || null;
      if (body.clientId !== undefined) payload.client_id = body.clientId || null;
      if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';
      if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';

      const data = await updateByIdScoped('work_items', String(body.id), workspaceId, payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      if (body.leadId) {
        const nextStatusForLeadAction = body.status ?? payload.status;
        const nextTypeForLeadAction = body.type ?? payload.type;
        if (isClosedTaskStatusForLeadNextActionStage228R17(nextStatusForLeadAction)) {
          await clearLeadNextActionIfMatchingTaskStage228R17(workspaceId, body.leadId, body.id);
        } else if (!isMissingItemTypeForLeadNextActionStage228R17(nextTypeForLeadAction)) {
          await syncLeadNextAction(workspaceId, body.leadId, {
            id: body.id,
            title: body.title ?? payload.title,
            scheduledAt: body.scheduledAt ?? payload.scheduled_at ?? body.date,
          });
        }
      }
      res.status(200).json(normalizeTask(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const STAGE228R23_SOFT_DELETE_WORK_ITEMS_TASKS = 'Task delete is stable soft-delete: status=deleted + hidden flags, including legacy workspace-null rows';
      void STAGE228R23_SOFT_DELETE_WORK_ITEMS_TASKS;
      const STAGE228R20R5_VERIFIED_SQL_TASK_DELETE = 'compat: R23 replaces physical hard delete with verified soft delete';
      const TASK_DELETE_VERIFY_FAILED_COMPAT_STAGE228R20R5 = 'TASK_DELETE_VERIFY_FAILED';
      void STAGE228R20R5_VERIFIED_SQL_TASK_DELETE;
      void TASK_DELETE_VERIFY_FAILED_COMPAT_STAGE228R20R5;

      const id = queryValue(req, 'id') || asText((body as any).id);
      if (!id) {
        res.status(400).json({ error: 'TASK_ID_REQUIRED' });
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
          error: 'TASK_DELETE_WORKSPACE_MISMATCH',
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
        res.status(500).json({ error: 'TASK_DELETE_HIDE_VERIFY_FAILED', id, status: afterStatusStage228R23 });
        return;
      }

      await clearLeadNextActionIfMatchingTaskStage228R17(workspaceId, (rowStage228R23 as any).lead_id, id);
      res.status(200).json({ ok: true, id, deleted: true, hidden: true, verified: true });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const nowIso = new Date().toISOString();
    const scheduledAt = body.scheduledAt
      ? normalizeCloseFlowDateTimeToUtcIso(body.scheduledAt)
      : body.date
        ? normalizeCloseFlowDateTimeToUtcIso(String(body.date) + 'T09:00')
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
    if (body.leadId && !isMissingItemTypeForLeadNextActionStage228R17(body.type || payload.type)) {
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
