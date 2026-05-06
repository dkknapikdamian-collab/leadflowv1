import { insertWithVariants, selectFirstAvailable, updateById, withWorkspaceFilter } from './_supabase.js';
import { asText, requireRequestIdentity, requireScopedRow, resolveRequestWorkspaceId } from './_request-scope.js';
import { assertWorkspaceWriteAccess, assertWorkspaceAiAllowed } from './_access-gate.js';

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}');
    } catch {
      return {};
    }
  }
  return req.body as Record<string, unknown>;
}

function asObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {} as Record<string, unknown>;
  return value as Record<string, unknown>;
}

function normalizeStatus(value: unknown) {
  const normalized = asText(value).toLowerCase();
  if (normalized === 'confirmed' || normalized === 'converted') return 'confirmed';
  if (normalized === 'cancelled' || normalized === 'archived') return 'cancelled';
  if (normalized === 'expired') return 'expired';
  if (normalized === 'failed') return 'failed';
  return 'pending';
}

function mapStatusToDb(value: string) {
  if (value === 'pending') return 'draft';
  if (value === 'confirmed') return 'confirmed';
  if (value === 'cancelled') return 'cancelled';
  if (value === 'expired') return 'expired';
  if (value === 'failed') return 'failed';
  return 'draft';
}

function normalizeType(value: unknown) {
  const normalized = asText(value).toLowerCase();
  if (normalized === 'task' || normalized === 'event' || normalized === 'note') return normalized;
  return 'lead';
}

function normalizeDraft(row: Record<string, unknown>) {
  const status = normalizeStatus(row.status);
  const createdAt = asText(row.created_at ?? row.createdAt) || new Date().toISOString();
  const updatedAt = asText(row.updated_at ?? row.updatedAt) || createdAt;
  return {
    id: asText(row.id),
    workspaceId: asText(row.workspace_id ?? row.workspaceId),
    userId: asText(row.user_id ?? row.userId) || null,
    type: normalizeType(row.type),
    rawText: status === 'pending' ? (asText(row.raw_text ?? row.rawText) || null) : null,
    parsedData: asObject(row.parsed_data ?? row.parsedData),
    provider: asText(row.provider) || 'local',
    status,
    createdAt,
    updatedAt,
    expiresAt: asText(row.expires_at ?? row.expiresAt) || null,
    confirmedAt: asText(row.confirmed_at ?? row.confirmedAt ?? row.converted_at ?? row.convertedAt) || null,
    cancelledAt: asText(row.cancelled_at ?? row.cancelledAt) || null,
  };
}

async function loadDraftById(id: string, workspaceId: string) {
  const query = withWorkspaceFilter(`ai_drafts?id=eq.${encodeURIComponent(id)}&select=*&limit=1`, workspaceId);
  const result = await selectFirstAvailable([query]);
  const rows = Array.isArray(result.data) ? (result.data as Record<string, unknown>[]) : [];
  return rows[0] || null;
}

async function createFinalRecordFromDraft(draft: Record<string, unknown>, workspaceId: string) {
  const parsed = asObject(draft.parsed_data ?? draft.parsedData);
  const type = normalizeType(draft.type);
  const nowIso = new Date().toISOString();

  if (type === 'lead') {
    const payload = {
      workspace_id: workspaceId,
      name: asText(parsed.name ?? parsed.title ?? draft.raw_text) || 'Lead ze szkicu',
      company: asText(parsed.company) || null,
      email: asText(parsed.email) || null,
      phone: asText(parsed.phone) || null,
      source: asText(parsed.source) || 'ai_draft',
      status: asText(parsed.status) || 'new',
      created_at: nowIso,
      updated_at: nowIso,
    };
    const result = await insertWithVariants(['leads'], [payload]);
    return { id: (result.data as any[])?.[0]?.id || null, type: 'lead' };
  }

  if (type === 'note') {
    const payload = {
      workspace_id: workspaceId,
      title: asText(parsed.title) || 'Notatka ze szkicu',
      details: asText(parsed.body ?? parsed.description ?? draft.raw_text) || '',
      status: 'done',
      record_type: 'note',
      created_at: nowIso,
      updated_at: nowIso,
    };
    const result = await insertWithVariants(['activities'], [payload]);
    return { id: (result.data as any[])?.[0]?.id || null, type: 'note' };
  }

  const workItemPayload = {
    workspace_id: workspaceId,
    title: asText(parsed.title ?? draft.raw_text) || (type === 'event' ? 'Wydarzenie ze szkicu' : 'Zadanie ze szkicu'),
    status: asText(parsed.status) || (type === 'event' ? 'planned' : 'todo'),
    priority: asText(parsed.priority) || 'medium',
    record_type: type,
    item_type: type,
    scheduled_at: asText(parsed.scheduledAt ?? parsed.startAt) || null,
    start_at: asText(parsed.startAt ?? parsed.scheduledAt) || null,
    end_at: asText(parsed.endAt) || null,
    lead_id: asText(parsed.leadId) || null,
    case_id: asText(parsed.caseId) || null,
    client_id: asText(parsed.clientId) || null,
    created_at: nowIso,
    updated_at: nowIso,
  };
  const result = await insertWithVariants(['work_items'], [workItemPayload]);
  return { id: (result.data as any[])?.[0]?.id || null, type };
}

export default async function handler(req: any, res: any) {
  try {
    const body = parseBody(req);
    const workspaceId = await resolveRequestWorkspaceId(req, body);
    if (!workspaceId) {
      res.status(401).json({ error: 'DRAFT_WORKSPACE_REQUIRED' });
      return;
    }

    if (req.method === 'GET') {
      const query = withWorkspaceFilter('ai_drafts?select=*&order=created_at.desc&limit=300', workspaceId);
      const result = await selectFirstAvailable([query]);
      const rows = Array.isArray(result.data) ? (result.data as Record<string, unknown>[]) : [];
      res.status(200).json(rows.map(normalizeDraft));
      return;
    }

    await assertWorkspaceWriteAccess(workspaceId, req);

    if (req.method === 'POST') {
      await assertWorkspaceAiAllowed(workspaceId);
      const identity = await requireRequestIdentity(req);
      const nowIso = new Date().toISOString();
      const status = normalizeStatus(body.status);
      const payload = {
        workspace_id: workspaceId,
        user_id: asText(body.userId ?? identity.userId) || null,
        type: normalizeType(body.type),
        raw_text: status === 'pending' ? (asText(body.rawText) || null) : null,
        parsed_data: asObject(body.parsedData),
        provider: asText(body.provider) || 'local',
        source: asText(body.source) || 'manual',
        status: mapStatusToDb(status),
        created_at: nowIso,
        updated_at: nowIso,
        expires_at: asText(body.expiresAt) || null,
      } as Record<string, unknown>;
      const result = await insertWithVariants(['ai_drafts'], [payload]);
      const row = (result.data as any[])?.[0] || payload;
      res.status(200).json(normalizeDraft(row));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id || req.query?.id);
      if (!id) {
        res.status(400).json({ error: 'DRAFT_ID_REQUIRED' });
        return;
      }

      await requireScopedRow('ai_drafts', id, workspaceId, 'DRAFT_NOT_FOUND');

      const action = asText(body.action).toLowerCase();
      const nowIso = new Date().toISOString();

      if (action === 'confirm') {
        await assertWorkspaceAiAllowed(workspaceId);
        const draftRow = await loadDraftById(id, workspaceId);
        if (!draftRow) {
          res.status(404).json({ error: 'DRAFT_NOT_FOUND' });
          return;
        }

        const created = await createFinalRecordFromDraft(draftRow, workspaceId);
        const updatedRows = await updateById('ai_drafts', id, {
          status: 'confirmed',
          raw_text: null,
          confirmed_at: nowIso,
          converted_at: nowIso,
          updated_at: nowIso,
          linked_record_id: created.id,
          linked_record_type: created.type,
        });
        const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { ...draftRow, status: 'confirmed', updated_at: nowIso, raw_text: null };
        res.status(200).json({ draft: normalizeDraft(updated), createdRecord: created });
        return;
      }

      if (action === 'cancel') {
        const updatedRows = await updateById('ai_drafts', id, {
          status: 'cancelled',
          raw_text: null,
          cancelled_at: nowIso,
          updated_at: nowIso,
        });
        const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { id, workspace_id: workspaceId, status: 'cancelled', updated_at: nowIso, raw_text: null };
        res.status(200).json({ draft: normalizeDraft(updated) });
        return;
      }

      if (action === 'expire') {
        const updatedRows = await updateById('ai_drafts', id, {
          status: 'expired',
          raw_text: null,
          expires_at: nowIso,
          updated_at: nowIso,
        });
        const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { id, workspace_id: workspaceId, status: 'expired', updated_at: nowIso, raw_text: null };
        res.status(200).json({ draft: normalizeDraft(updated) });
        return;
      }

      const patch: Record<string, unknown> = { updated_at: nowIso };
      if (body.parsedData !== undefined) patch.parsed_data = asObject(body.parsedData);
      if (body.expiresAt !== undefined) patch.expires_at = asText(body.expiresAt) || null;
      const updatedRows = await updateById('ai_drafts', id, patch);
      const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { id, workspace_id: workspaceId, ...patch };
      res.status(200).json(normalizeDraft(updated));
      return;
    }

    if (req.method === 'DELETE') {
      res.status(405).json({ error: 'USE_CANCEL_ACTION_INSTEAD' });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'DRAFTS_API_FAILED' });
  }
}
