// STAGE124D_SUPABASE_EGRESS_LIGHT_EVENT_ROUTE
import { deleteByIdScoped, insertWithVariants, selectFirstAvailable, updateByIdScoped } from '../src/server/_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';
import { normalizeEventListContract } from '../src/lib/data-contract.js';

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
    next_action_at: item.startAt ? new Date(String(item.startAt)).toISOString() : null,
    next_action_item_id: item.id ? String(item.id) : null,
    updated_at: new Date().toISOString(),
  });
}

async function readEvents(req: any, workspaceId: string) {
  const limit = capLimit(queryValue(req, 'limit'));
  const from = asIsoDate(queryValue(req, 'from') || queryValue(req, 'start') || queryValue(req, 'dateFrom'));
  const to = asIsoDate(queryValue(req, 'to') || queryValue(req, 'end') || queryValue(req, 'dateTo'));

  const baseQueries = [
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&record_type=eq.event&order=start_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&type=eq.event&order=start_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D_MIN + '&record_type=eq.event&order=start_at.asc.nullslast&limit=' + limit,
    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D_MIN + '&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=' + limit,
  ];

  const queries = baseQueries
    .map((query) => addDateRange(query, 'start_at', from, to))
    .map((query) => withWorkspaceFilter(query, workspaceId));

  const result = await selectFirstAvailable(queries);
  return Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];
}

function sendError(res: any, error: any, fallback: string) {
  const status = Number(error?.status || 500);
  res.status(status).json({ error: error?.code || error?.message || fallback });
}

export default async function handler(req: any, res: any) {
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
        const iso = body.startAt ? new Date(body.startAt).toISOString() : null;
        payload.start_at = iso;
        payload.scheduled_at = iso;
      }
      if (body.endAt !== undefined) payload.end_at = body.endAt ? new Date(body.endAt).toISOString() : null;
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
          startAt: body.startAt ?? payload.start_at,
        });
      }
      res.status(200).json(normalizeEvent(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = queryValue(req, 'id');
      if (!id) {
        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });
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
    const startAt = body.startAt ? new Date(body.startAt).toISOString() : nowIso;
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
