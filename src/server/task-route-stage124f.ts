// STAGE124F_VERCEL_HOBBY_CONSOLIDATED_TASK_ROUTE
// STAGE124D_SUPABASE_EGRESS_LIGHT_TASK_ROUTE
import { deleteByIdScoped, insertWithVariants, selectFirstAvailable, updateByIdScoped, updateWhere } from './_supabase.js';
import { requireRequestIdentity, resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from './_request-scope.js';
import { RequestAuthError } from './_supabase-auth.js';
import { normalizeTaskListContract } from '../lib/data-contract.js';
import { normalizeTaskStatus } from '../lib/domain-statuses.js';
import { normalizeCloseFlowDateTimeToUtcIso } from '../lib/calendar-timezone-contract.js';
import { markGoogleCalendarMutationSyncState } from './google-calendar-mutation-sync-state-marker.js';
import {
  buildGoogleCalendarCreateSyncStateInsertPayload,
} from '../lib/google-calendar-create-sync-state-insert-payload.js';

const STAGE228R17_MISSING_ITEM_DELETE_CONTRACT = 'Task route does not promote deleted/done/missing_item records to lead next action and clears matching deleted next_action_item_id';
const STAGE232A_R8_TASK_ROUTE_MISSING_ITEM_STATUS_BRIDGE = 'Task route preserves missing_item/blocking_missing_item status and description bridge for LeadDetail Braki UI';
const STAGE232I4_R16_TASK_ROUTE_STATUS_DOMAIN_SAFE = 'Task route stores missing items with DB-safe status while preserving missing/blocking status in the application contract';
void STAGE232A_R8_TASK_ROUTE_MISSING_ITEM_STATUS_BRIDGE;
void STAGE232I4_R16_TASK_ROUTE_STATUS_DOMAIN_SAFE;
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

function parseTaskRoutePayloadStage232I4R16(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

function readTaskRouteBooleanStage232I4R16(value: unknown, keys: string[]) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return keys.some((key) => {
    const raw = record[key];
    return raw === true || raw === 'true' || raw === 1 || raw === '1' || raw === 'yes';
  });
}

function isMissingItemTaskStage232I4R16(body: Record<string, unknown> = {}, row: Record<string, unknown> = {}) {
  const bodyPayload = parseTaskRoutePayloadStage232I4R16(body.payload);
  const rowPayload = parseTaskRoutePayloadStage232I4R16(row.payload);
  const values = [
    body.type,
    body.status,
    body.recordType,
    body.record_type,
    body.kind,
    bodyPayload.type,
    bodyPayload.status,
    bodyPayload.kind,
    row.type,
    row.status,
    row.record_type,
    row.recordType,
    rowPayload.type,
    rowPayload.status,
    rowPayload.kind,
  ].map((value) => asText(value).toLowerCase());
  return values.some((value) => value.includes('missing') || value.includes('block'))
    || readTaskRouteBooleanStage232I4R16(body, ['blocksProgress', 'blocks_progress'])
    || readTaskRouteBooleanStage232I4R16(bodyPayload, ['blocksProgress', 'blocks_progress'])
    || readTaskRouteBooleanStage232I4R16(row, ['blocksProgress', 'blocks_progress'])
    || readTaskRouteBooleanStage232I4R16(rowPayload, ['blocksProgress', 'blocks_progress']);
}

function isBlockingMissingItemStage232I4R16(body: Record<string, unknown> = {}, row: Record<string, unknown> = {}) {
  const bodyPayload = parseTaskRoutePayloadStage232I4R16(body.payload);
  const rowPayload = parseTaskRoutePayloadStage232I4R16(row.payload);
  const rawStatus = asText(body.status ?? row.status).toLowerCase();
  const rawPriority = asText(body.priority ?? row.priority).toLowerCase();
  return readTaskRouteBooleanStage232I4R16(body, ['blocksProgress', 'blocks_progress'])
    || readTaskRouteBooleanStage232I4R16(bodyPayload, ['blocksProgress', 'blocks_progress'])
    || readTaskRouteBooleanStage232I4R16(row, ['blocksProgress', 'blocks_progress'])
    || readTaskRouteBooleanStage232I4R16(rowPayload, ['blocksProgress', 'blocks_progress'])
    || rawStatus === 'blocking_missing_item'
    || rawPriority === 'high';
}

function normalizeMissingItemDbStatusStage232I4R16(body: Record<string, unknown> = {}, row: Record<string, unknown> = {}) {
  const rawStatus = asText(body.status ?? row.status).toLowerCase();
  if (rawStatus === 'done' || rawStatus === 'completed' || rawStatus === 'complete' || rawStatus === 'resolved') {
    return normalizeTaskStatus(rawStatus);
  }
  // work_items_status_domain_check accepts only the persisted task domain.
  // missing_item/blocking_missing_item remain application-level meaning carried by type/priority/source.
  return normalizeTaskStatus('todo');
}

function isClosedTaskRouteStatusStage232I4R16(value: unknown) {
  return new Set(['done', 'completed', 'complete', 'finished', 'closed', 'archived', 'deleted', 'cancelled', 'canceled'])
    .has(asText(value).toLowerCase());
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

  const rawStatusStage232AR8 = asText(row.status).toLowerCase();

  const normalizedStatusStage232AR8 = String((normalized as any).status || row.status || 'todo');

  const isMissingItemRowStage232I4R16 = isMissingItemTaskStage232I4R16({}, row);
  const isClosedMissingItemRowStage232I4R16 = isClosedTaskRouteStatusStage232I4R16(rawStatusStage232AR8);
  const taskStatusStage232AR8 = rawStatusStage232AR8.includes('missing') || rawStatusStage232AR8.includes('block')

    ? rawStatusStage232AR8

    : isMissingItemRowStage232I4R16 && !isClosedMissingItemRowStage232I4R16
      ? (isBlockingMissingItemStage232I4R16({}, row) ? 'blocking_missing_item' : 'missing_item')
      : normalizedStatusStage232AR8;

  return {
    ...normalized,
    id: String((normalized as any).id || row.id || crypto.randomUUID()),
    title: String((normalized as any).title || row.title || ''),
    type: String((normalized as any).type || row.type || row.task_type || 'task'),
    date: scheduledAt.slice(0, 10),
    scheduledAt,
    dueAt: scheduledAt,
    status: taskStatusStage232AR8,
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


const CALENDAR_HIDDEN_TASK_STATUSES_STAGE229A = new Set(['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed']);
function shouldHideTaskFromCalendarStage229A(value: unknown) { return CALENDAR_HIDDEN_TASK_STATUSES_STAGE229A.has(asText(value).toLowerCase()); }
function shouldHideTaskFromTasksStage229A(value: unknown) { return ['deleted', 'archived', 'removed'].includes(asText(value).toLowerCase()); }
const CALENDAR_RESTORED_TASK_STATUSES_STAGE232T_R3 = new Set(['todo', 'in_progress', 'open', 'pending', 'scheduled']);
function shouldRestoreTaskVisibilityStage232T_R3(value: unknown) { return CALENDAR_RESTORED_TASK_STATUSES_STAGE232T_R3.has(asText(value).toLowerCase()); }

function getTaskRouteSourceTextStage232T_R5(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const record = value as Record<string, unknown>;
  const payload = record.payload && typeof record.payload === 'object' ? record.payload as Record<string, unknown> : {};
  return [
    record.source,
    record.action,
    record.description,
    payload.source,
    payload.action,
    payload.idempotencyKey,
  ].filter(Boolean).map((part) => asText(part).toLowerCase()).join(' ');
}

function shouldKeepCompletedLeadCalendarActionVisibleStage232T_R5(body: unknown) {
  return getTaskRouteSourceTextStage232T_R5(body).includes('calendar_lead_done_persist_after_refresh');
}

function preserveTaskDatePatchTimeStage232T_R3(dateValue: unknown, currentRow: Record<string, unknown> | null | undefined) {
  const date = asText(dateValue);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date ? normalizeCloseFlowDateTimeToUtcIso(String(date) + 'T09:00') : null;
  const existing = asText(
    currentRow?.scheduled_at
    || currentRow?.due_at
    || currentRow?.start_at
    || currentRow?.time,
  );
  const timeMatch = existing.match(/T(\d{2}:\d{2})(?::\d{2}(?:\.\d{1,3})?)?/);
  const plainTimeMatch = existing.match(/^(\d{2}:\d{2})$/);
  const preservedTime = timeMatch?.[1] || plainTimeMatch?.[1] || '09:00';
  return normalizeCloseFlowDateTimeToUtcIso(date + 'T' + preservedTime);
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

type TaskRelationKeyStageFRT019 = 'leadId' | 'caseId' | 'clientId';
type TaskRelationRowsStageFRT019 = Partial<Record<TaskRelationKeyStageFRT019, Record<string, unknown>>>;

const TASK_RELATION_RULES_STAGEFRT019 = [
  ['leadId', 'lead_id', 'leads', 'TASK_LEAD_WORKSPACE_RELATION_NOT_FOUND'],
  ['caseId', 'case_id', 'cases', 'TASK_CASE_WORKSPACE_RELATION_NOT_FOUND'],
  ['clientId', 'client_id', 'clients', 'TASK_CLIENT_WORKSPACE_RELATION_NOT_FOUND'],
] as const;

function sameTaskRelationIdStageFRT019(left: unknown, right: unknown) {
  const normalizedLeft = asText(left).toLowerCase();
  const normalizedRight = asText(right).toLowerCase();
  return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}

function readTaskRelationIdStageFRT019(row: Record<string, unknown> | undefined, keys: string[]) {
  if (!row) return '';
  for (const key of keys) {
    const value = asText(row[key]);
    if (value) return value;
  }
  return '';
}

function taskRelationBodyValueStageFRT019(body: Record<string, unknown>, camelCaseKey: string, snakeCaseKey: string) {
  if (body[camelCaseKey] !== undefined) return body[camelCaseKey];
  return body[snakeCaseKey];
}

async function validateTaskRelationsStageFRT019(
  body: Record<string, unknown>,
  workspaceId: string,
) {
  const relationIds: Record<TaskRelationKeyStageFRT019, string | null> = {
    leadId: null,
    caseId: null,
    clientId: null,
  };
  const relationRows: TaskRelationRowsStageFRT019 = {};

  for (const [camelCaseKey, snakeCaseKey, table, notFoundCode] of TASK_RELATION_RULES_STAGEFRT019) {
    const rawValue = taskRelationBodyValueStageFRT019(body, camelCaseKey, snakeCaseKey);
    if (rawValue === undefined) continue;

    const relationId = asText(rawValue);
    relationIds[camelCaseKey] = relationId || null;
    if (!relationId) continue;

    relationRows[camelCaseKey] = await requireScopedRow(
      table,
      relationId,
      workspaceId,
      notFoundCode,
    );
  }

  const leadId = relationIds.leadId;
  const caseId = relationIds.caseId;
  const clientId = relationIds.clientId;
  const leadRow = relationRows.leadId;
  const caseRow = relationRows.caseId;

  const leadCaseId = readTaskRelationIdStageFRT019(leadRow, ['linked_case_id', 'linkedCaseId', 'case_id', 'caseId']);
  const caseLeadId = readTaskRelationIdStageFRT019(caseRow, ['lead_id', 'leadId']);
  const leadClientId = readTaskRelationIdStageFRT019(leadRow, ['client_id', 'clientId']);
  const caseClientId = readTaskRelationIdStageFRT019(caseRow, ['client_id', 'clientId']);

  if (leadId && caseId) {
    if ((leadCaseId && !sameTaskRelationIdStageFRT019(leadCaseId, caseId))
      || (caseLeadId && !sameTaskRelationIdStageFRT019(caseLeadId, leadId))) {
      throw new RequestAuthError(409, 'TASK_LEAD_CASE_RELATION_MISMATCH');
    }
    if (!sameTaskRelationIdStageFRT019(leadCaseId, caseId)
      && !sameTaskRelationIdStageFRT019(caseLeadId, leadId)) {
      throw new RequestAuthError(409, 'TASK_LEAD_CASE_RELATION_UNCONFIRMED');
    }
  }

  if (caseId && clientId) {
    if (caseClientId && !sameTaskRelationIdStageFRT019(caseClientId, clientId)) {
      throw new RequestAuthError(409, 'TASK_CASE_CLIENT_RELATION_MISMATCH');
    }
    if (!sameTaskRelationIdStageFRT019(caseClientId, clientId)) {
      throw new RequestAuthError(409, 'TASK_CASE_CLIENT_RELATION_UNCONFIRMED');
    }
  }

  if (leadId && clientId) {
    if (leadClientId && !sameTaskRelationIdStageFRT019(leadClientId, clientId)) {
      throw new RequestAuthError(409, 'TASK_LEAD_CLIENT_RELATION_MISMATCH');
    }

    const confirmedThroughCase = Boolean(
      caseId
      && sameTaskRelationIdStageFRT019(caseClientId, clientId)
      && (sameTaskRelationIdStageFRT019(leadCaseId, caseId) || sameTaskRelationIdStageFRT019(caseLeadId, leadId)),
    );
    if (!sameTaskRelationIdStageFRT019(leadClientId, clientId) && !confirmedThroughCase) {
      throw new RequestAuthError(409, 'TASK_LEAD_CLIENT_RELATION_UNCONFIRMED');
    }
  }

  return relationIds;
}

async function readTasks(req: any, workspaceId: string) {
  const limit = capLimit(queryValue(req, 'limit'));
  const from = asIsoDate(queryValue(req, 'from') || queryValue(req, 'start') || queryValue(req, 'dateFrom'));
  const to = asIsoDate(queryValue(req, 'to') || queryValue(req, 'end') || queryValue(req, 'dateTo'));
  const caseId = queryValue(req, 'caseId') || queryValue(req, 'case_id');

  const baseQueries = [
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&show_in_tasks=is.true&order=scheduled_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D_MIN + '&show_in_tasks=is.true&order=scheduled_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + TASK_LIST_SELECT_STAGE124D_MIN + '&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,
  ];

  const queries = baseQueries
    .map((query) => addDateRange(query, 'scheduled_at', from, to))
    .map((query) => caseId ? query + '&case_id=eq.' + encodeURIComponent(caseId) : query)
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
      const STAGE228R23R3_TASK_GET_FILTER_DELETED_WORK_ITEMS = 'Task GET hides soft-deleted work_items after R23';
      void STAGE228R23R3_TASK_GET_FILTER_DELETED_WORK_ITEMS;
      const activeRowsStage228R23R3 = rows.filter((row) => {
        const status = asText((row as any).status).toLowerCase();
        return !['deleted', 'archived', 'removed'].includes(status) && (row as any).show_in_tasks !== false;
      });
      res.status(200).json(activeRowsStage228R23R3.map(normalizeTask));
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);
    const requestIdentityStage232GR3 = await requireRequestIdentity(req, body);
    const requestUserIdStage232GR3 = asText(requestIdentityStage232GR3.userId || requestIdentityStage232GR3.uid || '');

    if (req.method === 'PATCH') {
      if (!body.id) {
        res.status(400).json({ error: 'TASK_ID_REQUIRED' });
        return;
      }

      const existingTaskStage232T_R3 = await selectFirstAvailable([
        withWorkspaceFilter(
          'work_items?select=id,scheduled_at,due_at,start_at,time,type,status,priority,show_in_tasks,show_in_calendar&id=eq.' + encodeURIComponent(String(body.id)) + '&limit=1',
          workspaceId,
        ),
      ]).catch(() => null);
      const existingTaskRowStage232T_R3 = Array.isArray(existingTaskStage232T_R3?.data)
        ? existingTaskStage232T_R3.data[0] as Record<string, unknown> | undefined
        : undefined;
      const isMissingItemPatchStage232I4R16 = isMissingItemTaskStage232I4R16(body, existingTaskRowStage232T_R3 || {});
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.title !== undefined) payload.title = body.title;
      if (body.type !== undefined) payload.type = isMissingItemPatchStage232I4R16 ? 'missing_item' : body.type;
      if (body.status !== undefined) {
        payload.status = isMissingItemPatchStage232I4R16
          ? normalizeMissingItemDbStatusStage232I4R16(body, existingTaskRowStage232T_R3 || {})
          : normalizeTaskStatus(body.status);
      }
      if (body.priority !== undefined) payload.priority = body.priority;
      if (body.date !== undefined) payload.scheduled_at = preserveTaskDatePatchTimeStage232T_R3(body.date, existingTaskRowStage232T_R3);
      if (body.scheduledAt !== undefined) payload.scheduled_at = body.scheduledAt ? normalizeCloseFlowDateTimeToUtcIso(body.scheduledAt) : null;
      if (body.dueAt !== undefined) payload.scheduled_at = body.dueAt ? normalizeCloseFlowDateTimeToUtcIso(body.dueAt) : null;
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
      if (shouldRestoreTaskVisibilityStage232T_R3(nextStatusForCalendarStage229A)) {
        payload.show_in_calendar = true;
        payload.show_in_tasks = true;
      }
      if (shouldHideTaskFromCalendarStage229A(nextStatusForCalendarStage229A)) payload.show_in_calendar = false;
      if (shouldHideTaskFromTasksStage229A(nextStatusForCalendarStage229A)) payload.show_in_tasks = false;
      if (isMissingItemPatchStage232I4R16) payload.show_in_calendar = false;
      if (shouldKeepCompletedLeadCalendarActionVisibleStage232T_R5(body)) {
        payload.show_in_calendar = true;
        payload.show_in_tasks = true;
      }

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
      const googleCalendarSyncStateStageG10 =
        await markGoogleCalendarMutationSyncState({
          workItemId: String(body.id),
          workspaceId,
          mutationKind: 'update',
        });

      if (googleCalendarSyncStateStageG10.found === false) {
        throw new Error(
          'TASK_PATCH_GCAL_MUTATION_SNAPSHOT_NOT_FOUND',
        );
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

      if (!requestUserIdStage232GR3) {
        res.status(401).json({ error: 'TASK_DELETE_VERIFIED_USER_ID_REQUIRED' });
        return;
      }

      const selectPathStage228R23 = 'work_items?select=id,workspace_id,created_by_user_id,lead_id,client_id,case_id,record_type,type,status,title,show_in_tasks,show_in_calendar&id=eq.' + encodeURIComponent(id) + '&limit=1';
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
      const rowOwnerUserIdStageG15R3 = asText((rowStage228R23 as any).created_by_user_id);
      const normalizedRowOwnerUserIdStageG15R3 = rowOwnerUserIdStageG15R3.toLowerCase();
      const verifiedRequestUserIdStageG15R3 = requestUserIdStage232GR3.toLowerCase();
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
        if (!normalizedRowOwnerUserIdStageG15R3 || normalizedRowOwnerUserIdStageG15R3 !== verifiedRequestUserIdStageG15R3) {
          res.status(403).json({ error: 'TASK_DELETE_LEGACY_OWNER_EVIDENCE_REQUIRED' });
          return;
        }

        const legacyOwnerScopedUpdatePathStageG15R3 = 'work_items?id=eq.' + encodeURIComponent(id)
          + '&workspace_id=is.null&created_by_user_id=eq.' + encodeURIComponent(rowOwnerUserIdStageG15R3);
        await updateWhere(legacyOwnerScopedUpdatePathStageG15R3, payloadStage228R23);
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

      if (rowWorkspaceIdStage228R23) {
        await clearLeadNextActionIfMatchingTaskStage228R17(workspaceId, (rowStage228R23 as any).lead_id, id);
      }
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
    const taskRelationsStageFRT019 = await validateTaskRelationsStageFRT019(body, workspaceId);
    const isMissingItemInsertStage232I4R16 = isMissingItemTaskStage232I4R16(body);
    const isBlockingMissingItemInsertStage232I4R16 = isBlockingMissingItemStage232I4R16(body);

    const taskInsertBaseStageG14 = {
      workspace_id: workspaceId,
      // STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP
      // Outbound Google Calendar sync is user-scoped and checks created_by_user_id.
      // New tasks must be stamped with the authenticated request user, not null.
      created_by_user_id: requestUserIdStage232GR3 || null,
      lead_id: taskRelationsStageFRT019.leadId,
      case_id: taskRelationsStageFRT019.caseId,
      client_id: taskRelationsStageFRT019.clientId,
      record_type: 'task',
      type: isMissingItemInsertStage232I4R16 ? 'missing_item' : (body.type || 'task'),
      title: body.title,
      description:
        body.description
        || (
          body.payload && typeof body.payload === 'object'
            ? String(body.payload.note || '')
            : ''
        )
        || '',
      status: isMissingItemInsertStage232I4R16
        ? normalizeMissingItemDbStatusStage232I4R16(body)
        : (body.status || 'todo'),
      priority: isMissingItemInsertStage232I4R16 && isBlockingMissingItemInsertStage232I4R16
        ? 'high'
        : (body.priority || 'medium'),
      scheduled_at: scheduledAt,
      start_at: null,
      end_at: null,
      recurrence: body.recurrenceRule || 'none',
      reminder: body.reminderAt || 'none',
      show_in_tasks: true,
      show_in_calendar: isMissingItemInsertStage232I4R16 ? false : true,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const googleCalendarCreateSyncStateStageG14 =
      buildGoogleCalendarCreateSyncStateInsertPayload({
        recordType: taskInsertBaseStageG14.record_type,
        type: taskInsertBaseStageG14.type,
        status: taskInsertBaseStageG14.status,
        showInCalendar: taskInsertBaseStageG14.show_in_calendar,
        hasCalendarTime: Boolean(
          taskInsertBaseStageG14.scheduled_at
          || taskInsertBaseStageG14.start_at
        ),
        createdByUserId: taskInsertBaseStageG14.created_by_user_id,
        googleCalendarEventId: null,
        currentGoogleSyncStatus: null,
      });

    const payload = {
      ...taskInsertBaseStageG14,
      ...googleCalendarCreateSyncStateStageG14.insertPayload,
    };

    const result = await insertWithVariants(['work_items'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    if (taskRelationsStageFRT019.leadId && !isMissingItemTypeForLeadNextActionStage228R17(body.type || payload.type)) {
      await syncLeadNextAction(workspaceId, taskRelationsStageFRT019.leadId, {
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
