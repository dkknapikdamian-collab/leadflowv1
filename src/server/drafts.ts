import { insertWithVariants, selectFirstAvailable, updateByWorkspaceAndId, withWorkspaceFilter } from './_supabase.js';
import { RequestAuthError, requireSupabaseRequestContext, writeAuthErrorResponse } from './_supabase-auth.js';
import { asText, requireScopedRow, resolveRequestWorkspaceId } from './_request-scope.js';
import { assertWorkspaceWriteAccess, assertWorkspaceAiAllowed } from './_access-gate.js';
import { claimAiDraftConfirmation, createFinalRecordFromAiDraft, releaseAiDraftConfirmation } from './ai-draft-confirmation.js';

// Compatibility alias: both legacy and canonical draft routes delegate to the same confirmation SOT.
const createFinalRecordFromDraft = createFinalRecordFromAiDraft;

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

function assertDraftConfirmable(row: Record<string, unknown>) {
  const status = normalizeStatus(row.status);
  if (status !== 'pending') throw new RequestAuthError(409, 'DRAFT_NOT_CONFIRMABLE');
  const expiresAt = asText(row.expires_at ?? row.expiresAt);
  if (expiresAt && Number.isFinite(new Date(expiresAt).getTime()) && new Date(expiresAt).getTime() <= Date.now()) {
    throw new RequestAuthError(409, 'DRAFT_EXPIRED');
  }
}

async function loadDraftById(id: string, workspaceId: string) {
  const query = withWorkspaceFilter(`ai_drafts?id=eq.${encodeURIComponent(id)}&select=*&limit=1`, workspaceId);
  const result = await selectFirstAvailable([query]);
  const rows = Array.isArray(result.data) ? (result.data as Record<string, unknown>[]) : [];
  return rows[0] || null;
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
       const verifiedContext = await requireSupabaseRequestContext(req);
       const verifiedUserId = asText(verifiedContext.userId);
       if (!verifiedUserId) throw new RequestAuthError(401, 'DRAFT_USER_CONTEXT_REQUIRED');
      const nowIso = new Date().toISOString();
      const status = normalizeStatus(body.status);
      const payload = {
        workspace_id: workspaceId,
         user_id: verifiedUserId,
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

        const existingLinkedId = asText(draftRow.linked_record_id ?? draftRow.linkedRecordId);
        const existingLinkedType = asText(draftRow.linked_record_type ?? draftRow.linkedRecordType);
        if (normalizeStatus(draftRow.status) === 'confirmed' && existingLinkedId && existingLinkedType) {
          res.status(200).json({ draft: normalizeDraft(draftRow), createdRecord: { id: existingLinkedId, type: existingLinkedType }, idempotent: true });
          return;
        }
        assertDraftConfirmable(draftRow);
        const claimed = await claimAiDraftConfirmation(id, workspaceId);
        if (!claimed) {
          res.status(409).json({ error: 'AI_DRAFT_CONFIRMATION_IN_PROGRESS' });
          return;
        }
        try {
          const created = await createFinalRecordFromAiDraft(draftRow, workspaceId, asObject(body.confirmation));
           const updatedRows = await updateByWorkspaceAndId('ai_drafts', id, workspaceId, {
            status: 'confirmed',
            raw_text: null,
            confirmed_at: nowIso,
            converted_at: nowIso,
            updated_at: nowIso,
            linked_record_id: created.id,
             linked_record_type: created.type,
           });
           await releaseAiDraftConfirmation(id, workspaceId).catch(() => null);
           const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { ...draftRow, status: 'confirmed', updated_at: nowIso, raw_text: null };
          res.status(200).json({ draft: normalizeDraft(updated), createdRecord: created });
          return;
        } catch (error) {
          await releaseAiDraftConfirmation(id, workspaceId).catch(() => null);
          throw error;
        }
      }

      if (action === 'cancel') {
        const updatedRows = await updateByWorkspaceAndId('ai_drafts', id, workspaceId, {
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
        const updatedRows = await updateByWorkspaceAndId('ai_drafts', id, workspaceId, {
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
      const updatedRows = await updateByWorkspaceAndId('ai_drafts', id, workspaceId, patch);
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
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    res.status(500).json({ error: error?.message || 'DRAFTS_API_FAILED' });
  }
}
