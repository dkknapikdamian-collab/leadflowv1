import { deleteById, insertWithVariants, selectFirstAvailable, updateById } from '../src/server/_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow, asText } from '../src/server/_request-scope.js';
import { assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';
import { normalizeTaskContract, toIsoDateTime } from '../src/lib/data-contract.js';

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}');
    } catch {
      return {};
    }
  }
  return req.body;
}

function asNullableText(value: unknown) {
  const normalized = asText(value);
  return normalized || null;
}

function asSchedule(value: unknown) {
  return toIsoDateTime(value);
}

function scheduleFromBody(body: Record<string, unknown>) {
  if (body.scheduledAt !== undefined) return asSchedule(body.scheduledAt);
  if (body.dueAt !== undefined) return asSchedule(body.dueAt);
  if (body.date !== undefined) return asSchedule(body.date);
  return null;
}

function normalizeRows(rows: unknown) {
  return Array.isArray(rows) ? rows.map((row) => normalizeTaskContract(row as Record<string, unknown>)) : [];
}

function buildTaskPayload(body: Record<string, unknown>, workspaceId: string, mode: 'insert' | 'patch') {
  const nowIso = new Date().toISOString();
  const scheduledAt = scheduleFromBody(body);
  const payload: Record<string, unknown> = {
    updated_at: nowIso,
  };

  if (mode === 'insert') {
    payload.workspace_id = workspaceId;
    payload.created_by_user_id = asNullableText(body.ownerId || body.owner_id);
    payload.record_type = 'task';
    payload.show_in_tasks = true;
    payload.show_in_calendar = true;
    payload.created_at = nowIso;
    payload.description = asText(body.description || body.note);
  }

  if (body.title !== undefined || mode === 'insert') payload.title = asText(body.title) || 'Zadanie';
  if (body.type !== undefined || mode === 'insert') payload.type = asText(body.type) || 'task';
  if (body.status !== undefined || mode === 'insert') payload.status = asText(body.status) || 'todo';
  if (body.priority !== undefined || mode === 'insert') payload.priority = asText(body.priority) || 'medium';
  if (body.leadId !== undefined) payload.lead_id = asNullableText(body.leadId);
  if (body.caseId !== undefined) payload.case_id = asNullableText(body.caseId);
  if (body.clientId !== undefined) payload.client_id = asNullableText(body.clientId);
  if (body.reminderAt !== undefined) payload.reminder_at = asSchedule(body.reminderAt);
  if (body.recurrenceRule !== undefined) payload.recurrence_rule = asText(body.recurrenceRule) || 'none';
  if (scheduledAt !== null || body.scheduledAt !== undefined || body.dueAt !== undefined || body.date !== undefined) {
    payload.scheduled_at = scheduledAt;
    payload.due_at = scheduledAt;
  }

  if (mode === 'insert') {
    if (payload.reminder_at === undefined) payload.reminder_at = null;
    if (payload.recurrence_rule === undefined) payload.recurrence_rule = 'none';
    if (payload.scheduled_at === undefined) {
      payload.scheduled_at = null;
      payload.due_at = null;
    }
  }

  return payload;
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) {
        res.status(401).json({ error: 'TASK_WORKSPACE_REQUIRED' });
        return;
      }

      const requestedId = asText(req.query?.id);
      const requestedLeadId = asText(req.query?.leadId || req.query?.lead_id);
      const requestedCaseId = asText(req.query?.caseId || req.query?.case_id);
      const requestedClientId = asText(req.query?.clientId || req.query?.client_id);
      const filters = [
        requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : '',
        requestedLeadId ? `lead_id=eq.${encodeURIComponent(requestedLeadId)}&` : '',
        requestedCaseId ? `case_id=eq.${encodeURIComponent(requestedCaseId)}&` : '',
        requestedClientId ? `client_id=eq.${encodeURIComponent(requestedClientId)}&` : '',
      ].filter(Boolean).join('');
      const limit = requestedId ? 1 : 300;

      const result = await selectFirstAvailable([
        withWorkspaceFilter(`work_items?select=*&${filters}record_type=eq.task&order=scheduled_at.asc.nullslast&limit=${limit}`, workspaceId),
        withWorkspaceFilter(`work_items?select=*&${filters}type=eq.task&order=scheduled_at.asc.nullslast&limit=${limit}`, workspaceId),
        withWorkspaceFilter(`work_items?select=*&${filters}show_in_tasks=is.true&order=scheduled_at.asc.nullslast&limit=${limit}`, workspaceId),
      ]);

      const normalized = normalizeRows(result.data);
      if (requestedId) {
        const match = normalized.find((task) => String(task.id) === requestedId);
        if (!match) {
          res.status(404).json({ error: 'TASK_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }
      res.status(200).json(normalized);
      return;
    }

    const body = parseBody(req);
    const workspaceId = await resolveRequestWorkspaceId(req, body);
    if (!workspaceId) {
      res.status(400).json({ error: 'TASK_WORKSPACE_REQUIRED' });
      return;
    }

    if (req.method !== 'GET') {
      await assertWorkspaceWriteAccess(workspaceId);
    }

    if (req.method === 'POST') {
      const payload = buildTaskPayload(body, workspaceId, 'insert');
      const result = await insertWithVariants(['work_items'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeTaskContract(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      const taskId = asText(body.id);
      if (!taskId) {
        res.status(400).json({ error: 'TASK_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('work_items', taskId, workspaceId, 'TASK_NOT_FOUND');
      const payload = buildTaskPayload(body, workspaceId, 'patch');
      const updated = await updateById('work_items', taskId, payload);
      const row = Array.isArray(updated) && updated[0] ? updated[0] : { id: taskId, ...payload };
      res.status(200).json(normalizeTaskContract(row as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const taskId = asText(req.query?.id || body.id);
      if (!taskId) {
        res.status(400).json({ error: 'TASK_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('work_items', taskId, workspaceId, 'TASK_NOT_FOUND');
      await deleteById('work_items', taskId);
      res.status(200).json({ ok: true, id: taskId });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'TASK_API_FAILED' });
  }
}
