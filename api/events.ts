import { deleteById, insertWithVariants, isUuid, selectFirstAvailable, updateById } from '../src/server/_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow, asText } from '../src/server/_request-scope.js';
import { assertWorkspaceEntityLimit, assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';
import { normalizeEventContract, toIsoDateTime } from '../src/lib/data-contract.js';

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

function asUuidOrNull(value: unknown) {
  const normalized = asText(value);
  return isUuid(normalized) ? normalized : null;
}
function asNullableUuid(value: unknown) {
  const normalized = asText(value);
  return isUuid(normalized) ? normalized : null;
}
function asSchedule(value: unknown) {
  return toIsoDateTime(value);
}

function startFromBody(body: Record<string, unknown>) {
  if (body.startAt !== undefined) return asSchedule(body.startAt);
  if (body.scheduledAt !== undefined) return asSchedule(body.scheduledAt);
  if (body.date !== undefined) return asSchedule(body.date);
  return null;
}

function normalizeRows(rows: unknown) {
  return Array.isArray(rows) ? rows.map((row) => normalizeEventContract(row as Record<string, unknown>)) : [];
}

function buildEventPayload(body: Record<string, unknown>, workspaceId: string, mode: 'insert' | 'patch') {
  const nowIso = new Date().toISOString();
  const startAt = startFromBody(body);
  const payload: Record<string, unknown> = {
    updated_at: nowIso,
  };

  if (mode === 'insert') {
    payload.workspace_id = workspaceId;
    payload.created_by_user_id = asUuidOrNull(body.ownerId || body.owner_id);
    payload.record_type = 'event';
    payload.show_in_tasks = false;
    payload.show_in_calendar = true;
    payload.created_at = nowIso;
    payload.description = asText(body.description || body.note);
  }

  if (body.title !== undefined || mode === 'insert') payload.title = asText(body.title) || 'Wydarzenie';
  if (body.type !== undefined || mode === 'insert') payload.type = asText(body.type) || 'event';
  if (body.status !== undefined || mode === 'insert') payload.status = asText(body.status) || 'scheduled';
  if (body.leadId !== undefined) payload.lead_id = asNullableUuid(body.leadId);
  if (body.caseId !== undefined) payload.case_id = asNullableUuid(body.caseId);
  if (body.clientId !== undefined) payload.client_id = asNullableUuid(body.clientId);
  if (body.reminderAt !== undefined) payload.reminder_at = asSchedule(body.reminderAt);
  if (body.recurrenceRule !== undefined) payload.recurrence_rule = asText(body.recurrenceRule) || 'none';
  if (body.endAt !== undefined) payload.end_at = asSchedule(body.endAt);
  if (startAt !== null || body.startAt !== undefined || body.scheduledAt !== undefined || body.date !== undefined) {
    payload.start_at = startAt;
    payload.scheduled_at = startAt;
  }

  if (mode === 'insert') {
    if (payload.reminder_at === undefined) payload.reminder_at = null;
    if (payload.recurrence_rule === undefined) payload.recurrence_rule = 'none';
    if (payload.start_at === undefined) {
      payload.start_at = null;
      payload.scheduled_at = null;
    }
    if (payload.end_at === undefined) payload.end_at = null;
  }

  return payload;
}

export default async function handler(req: any, res: any) {
  let workspaceId: string | null = null;
  try {
    workspaceId = await resolveRequestWorkspaceId(req);
    if (!workspaceId) {
      res.status(401).json({ error: 'AUTH_WORKSPACE_REQUIRED' });
      return;
    }

    if (req.method === 'GET') {
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
        withWorkspaceFilter(`work_items?select=*&${filters}record_type=eq.event&order=start_at.asc.nullslast&limit=${limit}`, workspaceId),
        withWorkspaceFilter(`work_items?select=*&${filters}type=eq.event&order=start_at.asc.nullslast&limit=${limit}`, workspaceId),
        withWorkspaceFilter(`work_items?select=*&${filters}show_in_calendar=is.true&order=start_at.asc.nullslast&limit=${limit}`, workspaceId),
      ]);

      const normalized = normalizeRows(result.data);
      if (requestedId) {
        const match = normalized.find((event) => String(event.id) === requestedId);
        if (!match) {
          res.status(404).json({ error: 'EVENT_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }
      res.status(200).json(normalized);
      return;
    }

    const body = parseBody(req);

    if (req.method !== 'GET') {
      await assertWorkspaceWriteAccess(workspaceId);
    }

    if (req.method === 'POST') {
      await assertWorkspaceEntityLimit(workspaceId, 'event');
      const payload = buildEventPayload(body, workspaceId, 'insert');
      const result = await insertWithVariants(['work_items'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeEventContract(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      const eventId = asText(body.id);
      if (!eventId) {
        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('work_items', eventId, workspaceId, 'EVENT_NOT_FOUND');
      const payload = buildEventPayload(body, workspaceId, 'patch');
      const updated = await updateById('work_items', eventId, payload);
      const row = Array.isArray(updated) && updated[0] ? updated[0] : { id: eventId, ...payload };
      res.status(200).json(normalizeEventContract(row as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const eventId = asText(req.query?.id || body.id);
      if (!eventId) {
        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('work_items', eventId, workspaceId, 'EVENT_NOT_FOUND');
      await deleteById('work_items', eventId);
      res.status(200).json({ ok: true, id: eventId });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    if (error?.message === 'FREE_LIMIT_EVENTS_REACHED') {
      res.status(403).json({ error: 'FREE_LIMIT_EVENTS_REACHED' });
      return;
    }
    res.status(500).json({ error: error?.message || 'EVENT_API_FAILED' });
  }
}

