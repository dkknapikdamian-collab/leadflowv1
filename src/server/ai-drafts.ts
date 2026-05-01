import { deleteById, insertWithVariants, isUuid, selectFirstAvailable, updateById } from './_supabase.js';
import { asText, requireRequestIdentity, requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';
import { assertWorkspaceAiAllowed, assertWorkspaceEntityLimit, assertWorkspaceWriteAccess } from './_access-gate.js';

type RecordMap = Record<string, unknown>;

const STATUSES = new Set(['draft', 'converted', 'archived', 'cancelled', 'expired', 'failed']);
const SOURCES = new Set(['quick_capture', 'today_assistant', 'manual', 'assistant']);
const PROVIDERS = new Set(['local', 'rule_parser', 'gemini', 'cloudflare', 'mixed', 'none', 'today_assistant']);
const TYPES = new Set(['lead', 'task', 'event', 'note']);
const KINDS = new Set(['lead_capture', 'task_capture', 'event_capture', 'note_capture']);

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = asText(value).toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}

function parseBody(req: any): RecordMap {
  const body = req?.body;
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body || '{}') as RecordMap;
    } catch {
      return {};
    }
  }
  return body as RecordMap;
}

function asJsonObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as RecordMap;
}

function normalizeRawText(row: RecordMap) {
  return asText(row.raw_text ?? row.rawText ?? '');
}

function normalizeDraft(row: RecordMap) {
  const status = normalizeEnum(row.status, STATUSES, 'draft');
  const type = normalizeEnum(row.type, TYPES, 'lead');
  const kind = normalizeEnum(row.kind, KINDS, type === 'task' ? 'task_capture' : type === 'event' ? 'event_capture' : type === 'note' ? 'note_capture' : 'lead_capture');
  const parsedData = asJsonObject(row.parsed_data ?? row.parsedData ?? row.parsedDraft ?? {});

  return {
    id: asText(row.id),
    workspaceId: asText(row.workspace_id ?? row.workspaceId),
    userId: asText(row.user_id ?? row.userId) || null,
    type,
    kind,
    rawText: normalizeRawText(row),
    parsedData,
    parsedDraft: parsedData,
    provider: normalizeEnum(row.provider, PROVIDERS, 'local'),
    source: normalizeEnum(row.source, SOURCES, 'manual'),
    status,
    createdAt: asText(row.created_at ?? row.createdAt) || new Date().toISOString(),
    updatedAt: asText(row.updated_at ?? row.updatedAt) || asText(row.created_at ?? row.createdAt) || new Date().toISOString(),
    expiresAt: row.expires_at ?? row.expiresAt ?? null,
    confirmedAt: row.confirmed_at ?? row.confirmedAt ?? null,
    cancelledAt: row.cancelled_at ?? row.cancelledAt ?? null,
    convertedAt: row.converted_at ?? row.convertedAt ?? null,
  };
}

function toIsoOrNull(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function shouldClearRawText(status: string) {
  return status === 'converted' || status === 'cancelled' || status === 'expired';
}

async function safeSelectRows(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return Array.isArray(result.data) ? result.data as RecordMap[] : [];
  } catch {
    return [] as RecordMap[];
  }
}

export default async function handler(req: any, res: any) {
  try {
    const body = parseBody(req);
    const workspaceId = await resolveRequestWorkspaceId(req, body);

    if (!workspaceId) {
      res.status(401).json({ error: 'AI_DRAFT_WORKSPACE_REQUIRED' });
      return;
    }

    if (req.method === 'GET') {
      const requestedStatus = normalizeEnum(req.query?.status, STATUSES, '');
      const limitRaw = Number(req.query?.limit || 200);
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(500, Math.floor(limitRaw))) : 200;
      const statusFilter = requestedStatus ? `status=eq.${encodeURIComponent(requestedStatus)}&` : '';
      const query = withWorkspaceFilter(
        `ai_drafts?select=*&${statusFilter}order=created_at.desc&limit=${limit}`,
        workspaceId,
      );
      const rows = await safeSelectRows(query);
      res.status(200).json(rows.map(normalizeDraft));
      return;
    }

    await assertWorkspaceWriteAccess(workspaceId);
    await assertWorkspaceAiAllowed(workspaceId);

    if (req.method === 'POST') {
      await assertWorkspaceEntityLimit(workspaceId, 'ai_draft');
      const rawText = asText(body.rawText ?? body.raw_text);
      if (!rawText) {
        res.status(400).json({ error: 'AI_DRAFT_RAW_TEXT_REQUIRED' });
        return;
      }

      const identity = await requireRequestIdentity(req);
      const nowIso = new Date().toISOString();
      const type = normalizeEnum(body.type, TYPES, 'lead');
      const status = normalizeEnum(body.status, STATUSES, 'draft');
      const payload: RecordMap = {
        workspace_id: workspaceId,
        user_id: asText(body.userId ?? body.user_id ?? identity.userId) || null,
        type,
        kind: normalizeEnum(body.kind, KINDS, type === 'task' ? 'task_capture' : type === 'event' ? 'event_capture' : type === 'note' ? 'note_capture' : 'lead_capture'),
        raw_text: shouldClearRawText(status) ? null : rawText,
        parsed_data: asJsonObject(body.parsedData ?? body.parsedDraft ?? body.parsed_data),
        provider: normalizeEnum(body.provider, PROVIDERS, 'local'),
        source: normalizeEnum(body.source, SOURCES, 'manual'),
        status,
        created_at: nowIso,
        updated_at: nowIso,
        expires_at: toIsoOrNull(body.expiresAt ?? body.expires_at),
        confirmed_at: status === 'converted' ? nowIso : null,
        cancelled_at: status === 'cancelled' ? nowIso : null,
        converted_at: status === 'converted' ? nowIso : null,
      };

      const result = await insertWithVariants(['ai_drafts'], [payload]);
      const row = Array.isArray(result.data) && result.data[0] ? result.data[0] as RecordMap : payload;
      res.status(200).json(normalizeDraft(row));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id || req.query?.id);
      if (!id || !isUuid(id)) {
        res.status(400).json({ error: 'AI_DRAFT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('ai_drafts', id, workspaceId, 'AI_DRAFT_NOT_FOUND');

      const nowIso = new Date().toISOString();
      const nextStatus = body.status !== undefined ? normalizeEnum(body.status, STATUSES, 'draft') : '';
      const action = asText(body.action).toLowerCase();
      const statusFromAction = action === 'confirm' || action === 'convert'
        ? 'converted'
        : action === 'cancel'
          ? 'cancelled'
          : action === 'archive'
            ? 'archived'
            : '';
      const finalStatus = statusFromAction || nextStatus;
      const payload: RecordMap = { updated_at: nowIso };

      if (body.type !== undefined) payload.type = normalizeEnum(body.type, TYPES, 'lead');
      if (body.kind !== undefined) payload.kind = normalizeEnum(body.kind, KINDS, 'lead_capture');
      if (body.parsedData !== undefined || body.parsedDraft !== undefined || body.parsed_data !== undefined) {
        payload.parsed_data = asJsonObject(body.parsedData ?? body.parsedDraft ?? body.parsed_data);
      }
      if (body.provider !== undefined) payload.provider = normalizeEnum(body.provider, PROVIDERS, 'local');
      if (body.source !== undefined) payload.source = normalizeEnum(body.source, SOURCES, 'manual');
      if (body.expiresAt !== undefined || body.expires_at !== undefined) payload.expires_at = toIsoOrNull(body.expiresAt ?? body.expires_at);
      if (body.rawText !== undefined || body.raw_text !== undefined) payload.raw_text = asText(body.rawText ?? body.raw_text);

      if (finalStatus) {
        payload.status = finalStatus;
        if (shouldClearRawText(finalStatus)) payload.raw_text = null;
        if (finalStatus === 'converted') {
          payload.confirmed_at = nowIso;
          payload.converted_at = nowIso;
        }
        if (finalStatus === 'cancelled') payload.cancelled_at = nowIso;
      }

      const updated = await updateById('ai_drafts', id, payload);
      const row = Array.isArray(updated) && updated[0] ? updated[0] as RecordMap : { id, workspace_id: workspaceId, ...payload };
      res.status(200).json(normalizeDraft(row));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id || body.id);
      if (!id || !isUuid(id)) {
        res.status(400).json({ error: 'AI_DRAFT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('ai_drafts', id, workspaceId, 'AI_DRAFT_NOT_FOUND');
      await deleteById('ai_drafts', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.message === 'AI_NOT_AVAILABLE_ON_FREE') {
      res.status(403).json({ error: 'AI_NOT_AVAILABLE_ON_FREE' });
      return;
    }
    if (error?.message === 'FREE_LIMIT_AI_DRAFTS_REACHED') {
      res.status(403).json({ error: 'FREE_LIMIT_AI_DRAFTS_REACHED' });
      return;
    }
    res.status(500).json({ error: error?.message || 'AI_DRAFTS_API_FAILED' });
  }
}
