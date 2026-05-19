const fs = require('fs');
const path = require('path');

const root = process.cwd();
const backupRoot = path.join(root, '_backup_local', '2026-05-19_stage124d_restore_tasks_events_light_routes');
fs.mkdirSync(backupRoot, { recursive: true });

function writeIfChanged(rel, content) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(backupRoot, rel.replace(/[\\/]/g, '__')));
  }
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (previous === content) return false;
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

function appendOnce(rel, marker, block) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (previous.includes(marker)) return false;
  fs.writeFileSync(file, previous.replace(/\s*$/, '') + '\n\n' + block.trim() + '\n', 'utf8');
  return true;
}

const tasks = "// STAGE124D_SUPABASE_EGRESS_LIGHT_TASK_ROUTE\nimport { deleteByIdScoped, insertWithVariants, selectFirstAvailable, updateByIdScoped } from '../src/server/_supabase.js';\nimport { resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';\nimport { normalizeTaskListContract } from '../src/lib/data-contract.js';\n\nconst TASK_LIST_SELECT_STAGE124D = [\n  'id',\n  'workspace_id',\n  'lead_id',\n  'case_id',\n  'client_id',\n  'record_type',\n  'type',\n  'title',\n  'status',\n  'priority',\n  'scheduled_at',\n  'due_at',\n  'date',\n  'start_at',\n  'end_at',\n  'recurrence',\n  'recurrence_rule',\n  'recurrence_end_type',\n  'recurrence_end_at',\n  'recurrence_count',\n  'reminder',\n  'reminder_at',\n  'show_in_tasks',\n  'show_in_calendar',\n  'created_at',\n  'updated_at',\n].join(',');\n\nconst TASK_LIST_SELECT_STAGE124D_MIN = [\n  'id',\n  'workspace_id',\n  'lead_id',\n  'record_type',\n  'type',\n  'title',\n  'status',\n  'priority',\n  'scheduled_at',\n  'due_at',\n  'date',\n  'start_at',\n  'end_at',\n  'recurrence',\n  'reminder',\n  'show_in_tasks',\n  'show_in_calendar',\n  'created_at',\n  'updated_at',\n].join(',');\n\nfunction asText(value: unknown) {\n  if (typeof value === 'string') return value.trim();\n  if (Array.isArray(value)) return asText(value[0]);\n  if (value === null || value === undefined) return '';\n  return String(value).trim();\n}\n\nfunction queryValue(req: any, name: string) {\n  return asText(req?.query?.[name]);\n}\n\nfunction asIsoDate(value: unknown) {\n  const text = asText(value);\n  if (!text) return null;\n  const normalized = /^\\d{4}-\\d{2}-\\d{2}$/.test(text) ? text + 'T00:00:00.000Z' : text;\n  const parsed = new Date(normalized);\n  if (Number.isNaN(parsed.getTime())) return null;\n  return parsed.toISOString();\n}\n\nfunction capLimit(value: unknown) {\n  const parsed = Number(asText(value) || 200);\n  if (!Number.isFinite(parsed) || parsed <= 0) return 200;\n  return Math.min(Math.floor(parsed), 200);\n}\n\nfunction addDateRange(path: string, field: string, from?: string | null, to?: string | null) {\n  let next = path;\n  if (from) next += '&' + field + '=gte.' + encodeURIComponent(from);\n  if (to) next += '&' + field + '=lte.' + encodeURIComponent(to);\n  return next;\n}\n\nfunction normalizeTask(row: Record<string, unknown>) {\n  const normalized = normalizeTaskListContract([row])[0] || row;\n  const scheduledAt = asIsoDate((normalized as any).scheduledAt)\n    || asIsoDate((normalized as any).dueAt)\n    || asIsoDate((normalized as any).date)\n    || asIsoDate((normalized as any).startAt)\n    || asIsoDate((normalized as any).createdAt)\n    || new Date().toISOString();\n\n  return {\n    ...normalized,\n    id: String((normalized as any).id || row.id || crypto.randomUUID()),\n    title: String((normalized as any).title || row.title || ''),\n    type: String((normalized as any).type || row.type || row.task_type || 'task'),\n    date: scheduledAt.slice(0, 10),\n    scheduledAt,\n    dueAt: scheduledAt,\n    status: String((normalized as any).status || row.status || 'todo'),\n    priority: String((normalized as any).priority || row.priority || 'medium'),\n    leadId: (normalized as any).leadId || (row.lead_id ? String(row.lead_id) : undefined),\n    caseId: (normalized as any).caseId || (row.case_id ? String(row.case_id) : undefined),\n    clientId: (normalized as any).clientId || (row.client_id ? String(row.client_id) : undefined),\n    reminderAt: (normalized as any).reminderAt || asIsoDate(row.reminder_at) || (typeof row.reminder === 'string' && row.reminder !== 'none' ? asIsoDate(row.reminder) : null),\n    recurrenceRule: String((normalized as any).recurrenceRule || row.recurrence_rule || row.recurrence || 'none'),\n  };\n}\n\nasync function syncLeadNextAction(workspaceId: string, leadId: unknown, item: { id?: unknown; title?: unknown; scheduledAt?: unknown }) {\n  const normalizedLeadId = asText(leadId);\n  if (!normalizedLeadId) return;\n  await updateByIdScoped('leads', normalizedLeadId, workspaceId, {\n    next_action_title: String(item.title || ''),\n    next_action_at: item.scheduledAt ? new Date(String(item.scheduledAt)).toISOString() : null,\n    next_action_item_id: item.id ? String(item.id) : null,\n    updated_at: new Date().toISOString(),\n  });\n}\n\nasync function readTasks(req: any, workspaceId: string) {\n  const limit = capLimit(queryValue(req, 'limit'));\n  const from = asIsoDate(queryValue(req, 'from') || queryValue(req, 'start') || queryValue(req, 'dateFrom'));\n  const to = asIsoDate(queryValue(req, 'to') || queryValue(req, 'end') || queryValue(req, 'dateTo'));\n\n  const baseQueries = [\n    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&show_in_tasks=is.true&order=scheduled_at.asc.nullslast&limit=' + limit,\n    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,\n    'work_items?select=' + TASK_LIST_SELECT_STAGE124D + '&type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,\n    'work_items?select=' + TASK_LIST_SELECT_STAGE124D_MIN + '&show_in_tasks=is.true&order=scheduled_at.asc.nullslast&limit=' + limit,\n    'work_items?select=' + TASK_LIST_SELECT_STAGE124D_MIN + '&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=' + limit,\n  ];\n\n  const queries = baseQueries\n    .map((query) => addDateRange(query, 'scheduled_at', from, to))\n    .map((query) => withWorkspaceFilter(query, workspaceId));\n\n  const result = await selectFirstAvailable(queries);\n  return Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];\n}\n\nfunction sendError(res: any, error: any, fallback: string) {\n  const status = Number(error?.status || 500);\n  res.status(status).json({ error: error?.code || error?.message || fallback });\n}\n\nexport default async function handler(req: any, res: any) {\n  try {\n    if (req.method === 'GET') {\n      const workspaceId = await resolveRequestWorkspaceId(req);\n      const rows = await readTasks(req, workspaceId);\n      res.status(200).json(rows.map(normalizeTask));\n      return;\n    }\n\n    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};\n    const workspaceId = await resolveRequestWorkspaceId(req, body);\n\n    if (req.method === 'PATCH') {\n      if (!body.id) {\n        res.status(400).json({ error: 'TASK_ID_REQUIRED' });\n        return;\n      }\n\n      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };\n      if (body.title !== undefined) payload.title = body.title;\n      if (body.type !== undefined) payload.type = body.type;\n      if (body.status !== undefined) payload.status = body.status;\n      if (body.priority !== undefined) payload.priority = body.priority;\n      if (body.date !== undefined) payload.scheduled_at = body.date ? new Date(String(body.date) + 'T09:00:00').toISOString() : null;\n      if (body.scheduledAt !== undefined) payload.scheduled_at = body.scheduledAt ? new Date(body.scheduledAt).toISOString() : null;\n      if (body.leadId !== undefined) payload.lead_id = body.leadId || null;\n      if (body.caseId !== undefined) payload.case_id = body.caseId || null;\n      if (body.clientId !== undefined) payload.client_id = body.clientId || null;\n      if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';\n      if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';\n\n      const data = await updateByIdScoped('work_items', String(body.id), workspaceId, payload);\n      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };\n      if (body.leadId) {\n        await syncLeadNextAction(workspaceId, body.leadId, {\n          id: body.id,\n          title: body.title ?? payload.title,\n          scheduledAt: body.scheduledAt ?? payload.scheduled_at ?? body.date,\n        });\n      }\n      res.status(200).json(normalizeTask(updated as Record<string, unknown>));\n      return;\n    }\n\n    if (req.method === 'DELETE') {\n      const id = queryValue(req, 'id');\n      if (!id) {\n        res.status(400).json({ error: 'TASK_ID_REQUIRED' });\n        return;\n      }\n      await deleteByIdScoped('work_items', id, workspaceId);\n      res.status(200).json({ ok: true, id });\n      return;\n    }\n\n    if (req.method !== 'POST') {\n      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });\n      return;\n    }\n\n    const nowIso = new Date().toISOString();\n    const scheduledAt = body.scheduledAt\n      ? new Date(body.scheduledAt).toISOString()\n      : body.date\n        ? new Date(String(body.date) + 'T09:00:00').toISOString()\n        : null;\n\n    const payload = {\n      workspace_id: workspaceId,\n      created_by_user_id: null,\n      lead_id: body.leadId || null,\n      case_id: body.caseId || null,\n      client_id: body.clientId || null,\n      record_type: 'task',\n      type: body.type || 'task',\n      title: body.title,\n      description: body.description || '',\n      status: body.status || 'todo',\n      priority: body.priority || 'medium',\n      scheduled_at: scheduledAt,\n      start_at: null,\n      end_at: null,\n      recurrence: body.recurrenceRule || 'none',\n      reminder: body.reminderAt || 'none',\n      show_in_tasks: true,\n      show_in_calendar: true,\n      created_at: nowIso,\n      updated_at: nowIso,\n    };\n\n    const result = await insertWithVariants(['work_items'], [payload]);\n    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;\n    if (body.leadId) {\n      await syncLeadNextAction(workspaceId, body.leadId, {\n        id: (inserted as Record<string, unknown>).id,\n        title: body.title,\n        scheduledAt,\n      });\n    }\n\n    res.status(200).json(normalizeTask(inserted as Record<string, unknown>));\n  } catch (error: any) {\n    sendError(res, error, 'TASK_ROUTE_FAILED');\n  }\n}\n";
const events = "// STAGE124D_SUPABASE_EGRESS_LIGHT_EVENT_ROUTE\nimport { deleteByIdScoped, insertWithVariants, selectFirstAvailable, updateByIdScoped } from '../src/server/_supabase.js';\nimport { resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';\nimport { normalizeEventListContract } from '../src/lib/data-contract.js';\n\nconst EVENT_LIST_SELECT_STAGE124D = [\n  'id',\n  'workspace_id',\n  'lead_id',\n  'case_id',\n  'client_id',\n  'record_type',\n  'type',\n  'title',\n  'status',\n  'priority',\n  'scheduled_at',\n  'start_at',\n  'end_at',\n  'recurrence',\n  'recurrence_rule',\n  'recurrence_end_type',\n  'recurrence_end_at',\n  'recurrence_count',\n  'reminder',\n  'reminder_at',\n  'show_in_tasks',\n  'show_in_calendar',\n  'created_at',\n  'updated_at',\n].join(',');\n\nconst EVENT_LIST_SELECT_STAGE124D_MIN = [\n  'id',\n  'workspace_id',\n  'lead_id',\n  'record_type',\n  'type',\n  'title',\n  'status',\n  'scheduled_at',\n  'start_at',\n  'end_at',\n  'recurrence',\n  'reminder',\n  'show_in_calendar',\n  'created_at',\n  'updated_at',\n].join(',');\n\nfunction asText(value: unknown) {\n  if (typeof value === 'string') return value.trim();\n  if (Array.isArray(value)) return asText(value[0]);\n  if (value === null || value === undefined) return '';\n  return String(value).trim();\n}\n\nfunction queryValue(req: any, name: string) {\n  return asText(req?.query?.[name]);\n}\n\nfunction asIsoDate(value: unknown) {\n  const text = asText(value);\n  if (!text) return null;\n  const normalized = /^\\d{4}-\\d{2}-\\d{2}$/.test(text) ? text + 'T00:00:00.000Z' : text;\n  const parsed = new Date(normalized);\n  if (Number.isNaN(parsed.getTime())) return null;\n  return parsed.toISOString();\n}\n\nfunction capLimit(value: unknown) {\n  const parsed = Number(asText(value) || 200);\n  if (!Number.isFinite(parsed) || parsed <= 0) return 200;\n  return Math.min(Math.floor(parsed), 200);\n}\n\nfunction addDateRange(path: string, field: string, from?: string | null, to?: string | null) {\n  let next = path;\n  if (from) next += '&' + field + '=gte.' + encodeURIComponent(from);\n  if (to) next += '&' + field + '=lte.' + encodeURIComponent(to);\n  return next;\n}\n\nfunction normalizeEvent(row: Record<string, unknown>) {\n  const normalized = normalizeEventListContract([row])[0] || row;\n  const startAt = asIsoDate((normalized as any).startAt)\n    || asIsoDate((normalized as any).scheduledAt)\n    || asIsoDate((normalized as any).startsAt)\n    || asIsoDate(row.start_at)\n    || asIsoDate(row.scheduled_at)\n    || new Date().toISOString();\n\n  return {\n    ...normalized,\n    id: String((normalized as any).id || row.id || crypto.randomUUID()),\n    title: String((normalized as any).title || row.title || ''),\n    type: String((normalized as any).type || row.type || 'meeting'),\n    startAt,\n    startsAt: startAt,\n    scheduledAt: startAt,\n    endAt: asIsoDate((normalized as any).endAt) || asIsoDate(row.end_at) || '',\n    status: String((normalized as any).status || row.status || 'scheduled'),\n    leadId: (normalized as any).leadId || (row.lead_id ? String(row.lead_id) : undefined),\n    caseId: (normalized as any).caseId || (row.case_id ? String(row.case_id) : undefined),\n    clientId: (normalized as any).clientId || (row.client_id ? String(row.client_id) : undefined),\n    reminderAt: (normalized as any).reminderAt || asIsoDate(row.reminder_at) || (typeof row.reminder === 'string' && row.reminder !== 'none' ? asIsoDate(row.reminder) : null),\n    recurrenceRule: String((normalized as any).recurrenceRule || row.recurrence_rule || row.recurrence || 'none'),\n  };\n}\n\nasync function syncLeadNextAction(workspaceId: string, leadId: unknown, item: { id?: unknown; title?: unknown; startAt?: unknown }) {\n  const normalizedLeadId = asText(leadId);\n  if (!normalizedLeadId) return;\n  await updateByIdScoped('leads', normalizedLeadId, workspaceId, {\n    next_action_title: String(item.title || ''),\n    next_action_at: item.startAt ? new Date(String(item.startAt)).toISOString() : null,\n    next_action_item_id: item.id ? String(item.id) : null,\n    updated_at: new Date().toISOString(),\n  });\n}\n\nasync function readEvents(req: any, workspaceId: string) {\n  const limit = capLimit(queryValue(req, 'limit'));\n  const from = asIsoDate(queryValue(req, 'from') || queryValue(req, 'start') || queryValue(req, 'dateFrom'));\n  const to = asIsoDate(queryValue(req, 'to') || queryValue(req, 'end') || queryValue(req, 'dateTo'));\n\n  const baseQueries = [\n    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&record_type=eq.event&order=start_at.asc.nullslast&limit=' + limit,\n    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=' + limit,\n    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D + '&type=eq.event&order=start_at.asc.nullslast&limit=' + limit,\n    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D_MIN + '&record_type=eq.event&order=start_at.asc.nullslast&limit=' + limit,\n    'work_items?select=' + EVENT_LIST_SELECT_STAGE124D_MIN + '&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=' + limit,\n  ];\n\n  const queries = baseQueries\n    .map((query) => addDateRange(query, 'start_at', from, to))\n    .map((query) => withWorkspaceFilter(query, workspaceId));\n\n  const result = await selectFirstAvailable(queries);\n  return Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];\n}\n\nfunction sendError(res: any, error: any, fallback: string) {\n  const status = Number(error?.status || 500);\n  res.status(status).json({ error: error?.code || error?.message || fallback });\n}\n\nexport default async function handler(req: any, res: any) {\n  try {\n    if (req.method === 'GET') {\n      const workspaceId = await resolveRequestWorkspaceId(req);\n      const rows = await readEvents(req, workspaceId);\n      res.status(200).json(rows.map(normalizeEvent));\n      return;\n    }\n\n    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};\n    const workspaceId = await resolveRequestWorkspaceId(req, body);\n\n    if (req.method === 'PATCH') {\n      if (!body.id) {\n        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });\n        return;\n      }\n\n      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };\n      if (body.title !== undefined) payload.title = body.title;\n      if (body.type !== undefined) payload.type = body.type;\n      if (body.status !== undefined) payload.status = body.status;\n      if (body.startAt !== undefined) {\n        const iso = body.startAt ? new Date(body.startAt).toISOString() : null;\n        payload.start_at = iso;\n        payload.scheduled_at = iso;\n      }\n      if (body.endAt !== undefined) payload.end_at = body.endAt ? new Date(body.endAt).toISOString() : null;\n      if (body.leadId !== undefined) payload.lead_id = body.leadId || null;\n      if (body.caseId !== undefined) payload.case_id = body.caseId || null;\n      if (body.clientId !== undefined) payload.client_id = body.clientId || null;\n      if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';\n      if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';\n\n      const data = await updateByIdScoped('work_items', String(body.id), workspaceId, payload);\n      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };\n      if (body.leadId) {\n        await syncLeadNextAction(workspaceId, body.leadId, {\n          id: body.id,\n          title: body.title ?? payload.title,\n          startAt: body.startAt ?? payload.start_at,\n        });\n      }\n      res.status(200).json(normalizeEvent(updated as Record<string, unknown>));\n      return;\n    }\n\n    if (req.method === 'DELETE') {\n      const id = queryValue(req, 'id');\n      if (!id) {\n        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });\n        return;\n      }\n      await deleteByIdScoped('work_items', id, workspaceId);\n      res.status(200).json({ ok: true, id });\n      return;\n    }\n\n    if (req.method !== 'POST') {\n      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });\n      return;\n    }\n\n    const nowIso = new Date().toISOString();\n    const startAt = body.startAt ? new Date(body.startAt).toISOString() : nowIso;\n    const payload = {\n      workspace_id: workspaceId,\n      created_by_user_id: null,\n      lead_id: body.leadId || null,\n      case_id: body.caseId || null,\n      client_id: body.clientId || null,\n      record_type: 'event',\n      type: body.type || 'meeting',\n      title: body.title,\n      description: body.description || '',\n      status: body.status || 'scheduled',\n      priority: 'medium',\n      scheduled_at: startAt,\n      start_at: startAt,\n      end_at: body.endAt ? new Date(body.endAt).toISOString() : null,\n      recurrence: body.recurrenceRule || 'none',\n      reminder: body.reminderAt || 'none',\n      show_in_tasks: false,\n      show_in_calendar: true,\n      created_at: nowIso,\n      updated_at: nowIso,\n    };\n\n    const result = await insertWithVariants(['work_items'], [payload]);\n    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;\n    if (body.leadId) {\n      await syncLeadNextAction(workspaceId, body.leadId, {\n        id: (inserted as Record<string, unknown>).id,\n        title: body.title,\n        startAt,\n      });\n    }\n\n    res.status(200).json(normalizeEvent(inserted as Record<string, unknown>));\n  } catch (error: any) {\n    sendError(res, error, 'EVENT_ROUTE_FAILED');\n  }\n}\n";

const changed = [];
if (writeIfChanged('api/tasks.ts', tasks)) changed.push('api/tasks.ts');
if (writeIfChanged('api/events.ts', events)) changed.push('api/events.ts');

const guard = `const fs = require('fs');
const assert = require('assert');

function read(file) { return fs.readFileSync(file, 'utf8'); }

const tasks = read('api/tasks.ts');
const events = read('api/events.ts');

for (const [name, text] of [['api/tasks.ts', tasks], ['api/events.ts', events]]) {
  assert.match(text, /STAGE124D_SUPABASE_EGRESS_LIGHT_(TASK|EVENT)_ROUTE/, name + ' must carry Stage124D marker');
  assert.doesNotMatch(text, /select=\*/i, name + ' must not use select=*');
  assert.match(text, /resolveRequestWorkspaceId\(req/, name + ' must resolve workspace from request context');
  assert.match(text, /withWorkspaceFilter\(/, name + ' must scope reads by workspace');
  assert.match(text, /updateByIdScoped\(/, name + ' must scope updates by workspace');
  assert.match(text, /deleteByIdScoped\(/, name + ' must scope deletes by workspace');
  assert.match(text, /limit=' \+ limit|limit=\' \+ limit|limit='\+limit|limit=\$\{limit\}/, name + ' must cap list limit');
}

assert.match(tasks, /TASK_LIST_SELECT_STAGE124D/, 'tasks route must use explicit ListDTO select contract');
assert.match(events, /EVENT_LIST_SELECT_STAGE124D/, 'events route must use explicit ListDTO select contract');
assert.match(tasks, /addDateRange\(query, 'scheduled_at'/, 'tasks route must support scheduled_at range');
assert.match(events, /addDateRange\(query, 'start_at'/, 'events route must support start_at range');

console.log('✔ Stage124D task/event API routes are restored with explicit scoped list selects');
`;
if (writeIfChanged('scripts/check-stage124d-task-event-routes.cjs', guard)) changed.push('scripts/check-stage124d-task-event-routes.cjs');

const test = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage124D restores lightweight task/event API routes', () => {
  for (const file of ['api/tasks.ts', 'api/events.ts']) {
    assert.equal(fs.existsSync(file), true, file + ' should exist');
    const text = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /select=\\*/i);
    assert.match(text, /resolveRequestWorkspaceId\\(req/);
    assert.match(text, /withWorkspaceFilter\\(/);
    assert.match(text, /updateByIdScoped\\(/);
    assert.match(text, /deleteByIdScoped\\(/);
  }
});
`;
if (writeIfChanged('tests/stage124d-task-event-routes.test.cjs', test)) changed.push('tests/stage124d-task-event-routes.test.cjs');

const toolSelf = fs.readFileSync(__filename, 'utf8');
if (writeIfChanged('tools/patch-stage124d-restore-tasks-events-light-routes.cjs', toolSelf)) changed.push('tools/patch-stage124d-restore-tasks-events-light-routes.cjs');

const pkgPath = path.join(root, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  if (!pkg.scripts['check:stage124d-task-event-routes']) {
    pkg.scripts['check:stage124d-task-event-routes'] = 'node scripts/check-stage124d-task-event-routes.cjs';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    changed.push('package.json');
  }
}

appendOnce('_project/08_CHANGELOG_AI.md', 'STAGE124D_TASK_EVENT_LIGHT_ROUTES', `## 2026-05-19 - STAGE124D_TASK_EVENT_LIGHT_ROUTES

- Restored tracked /api/tasks and /api/events route files.
- Replaced historical work_items select=* task/event reads with explicit Stage124D ListDTO select fields.
- Added workspace-scoped reads/mutations and optional date range filters for future calendar range queries.`);
appendOnce('_project/12_IMPLEMENTATION_LEDGER.md', 'STAGE124D_TASK_EVENT_LIGHT_ROUTES', `## 2026-05-19 - STAGE124D_TASK_EVENT_LIGHT_ROUTES

FACTS:
- Stage124C audit found frontend /api/tasks and /api/events call sites but no tracked route candidates.
- Stage124D restores those route files in api/.

DECISIONS:
- Do not patch supabase-fallback.ts in this stage.
- Do not reduce app functionality; default list limit remains capped at 200, but payloads are lightweight.

TESTS:
- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run build`);
appendOnce('_project/14_TEST_HISTORY.md', 'STAGE124D_TASK_EVENT_LIGHT_ROUTES', `## 2026-05-19 - STAGE124D_TASK_EVENT_LIGHT_ROUTES

Expected tests after local apply:
- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run check:stage124-supabase-egress-contract
- npm run build`);
appendOnce('_project/07_NEXT_STEPS.md', 'STAGE124D_TASK_EVENT_LIGHT_ROUTES', `## STAGE124D_TASK_EVENT_LIGHT_ROUTES - next

- After manual QA, Stage124E should make Calendar pass from/to range params to /api/tasks and /api/events.
- Check Supabase Usage Dashboard after normal app use to verify reduced API egress.`);
appendOnce('_project/06_GUARDS_AND_TESTS.md', 'STAGE124D_TASK_EVENT_LIGHT_ROUTES', `## STAGE124D_TASK_EVENT_LIGHT_ROUTES

Guard:
- scripts/check-stage124d-task-event-routes.cjs

Purpose:
- Prevent /api/tasks and /api/events from regressing to work_items select=*.
- Require workspace scoped reads/mutations.
- Require optional date range support for future Calendar range fetch.`);

const runReport = `# Stage124D - restore tasks/events lightweight API routes

Date: 2026-05-19
Branch: dev-rollout-freeze
Mode: ZIP/local-only, manual commit/push after review

## Goal

Resolve Stage124C blockers by restoring tracked /api/tasks and /api/events route files with lightweight, scoped ListDTO reads.

## What changed

- api/tasks.ts added/restored.
- api/events.ts added/restored.
- Both routes avoid select=*.
- Both routes use explicit list select constants.
- Both routes resolve workspace from request context and apply workspace filters.
- Both routes support optional from/to range params.
- Both routes keep POST/PATCH/DELETE functionality.

## Tests

Run:
- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run check:stage124-supabase-egress-contract
- npm run build

## Obsidian update

CloseFlow Supabase egress P0 memory already exists in Obsidian. This stage adds repo-side run/report and should be summarized there after commit.
`;
if (writeIfChanged('_project/runs/2026-05-19_stage124d_restore_tasks_events_light_routes.md', runReport)) changed.push('_project/runs/2026-05-19_stage124d_restore_tasks_events_light_routes.md');

console.log('Stage124D changed files:');
for (const file of changed) console.log('- ' + file);
console.log('Backup root: ' + backupRoot);
