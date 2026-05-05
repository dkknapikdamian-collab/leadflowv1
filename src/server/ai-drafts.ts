import { deleteById, insertWithVariants, isUuid, selectFirstAvailable, updateById } from './_supabase.js';
import { asText, requireRequestIdentity, requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';
import { assertWorkspaceAiAllowed, assertWorkspaceEntityLimit, assertWorkspaceWriteAccess } from './_access-gate.js';

type RecordMap = Record<string, unknown>;

const A26_AI_DRAFTS_SUPABASE_CONTRACT_LOCK = 'ai_drafts stores temporary raw_text and clears it after confirmed cancelled expired';

const STATUSES = new Set(['pending', 'draft', 'confirmed', 'converted', 'archived', 'cancelled', 'expired', 'failed']);
const SOURCES = new Set(['quick_capture', 'voice_capture', 'today_assistant', 'manual', 'assistant']);
const PROVIDERS = new Set(['local', 'rule_parser', 'gemini', 'cloudflare', 'mixed', 'none', 'today_assistant']);
const TYPES = new Set(['lead', 'task', 'event', 'note']);
const KINDS = new Set(['lead_capture', 'task_capture', 'event_capture', 'note_capture']);
const LINKED_RECORD_TYPES = new Set(['lead', 'task', 'event', 'note', 'case', 'client']);

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

function isAiDraftCleanupMutation(req: any, body: RecordMap) {
  if (req?.method === 'DELETE') return true;
  if (req?.method !== 'PATCH') return false;

  const action = asText(body.action).toLowerCase();
  const status = asText(body.status).toLowerCase();

  return (
    action === 'cancel'
    || action === 'archive'
    || action === 'expire'
    || status === 'archived'
    || status === 'cancelled'
    || status === 'expired'
  );
}

function normalizeRawText(row: RecordMap) {
  return asText(row.raw_text ?? row.rawText ?? '');
}

function normalizeStoredStatus(value: unknown) {
  return normalizeEnum(value, STATUSES, 'draft');
}

function normalizeClientStatus(value: unknown) {
  const status = normalizeStoredStatus(value);
  if (status === 'confirmed' || status === 'converted') return 'converted';
  if (status === 'cancelled' || status === 'expired' || status === 'archived') return 'archived';
  if (status === 'pending') return 'draft';
  return status;
}

function normalizeDbStatus(value: unknown, fallback = 'draft') {
  const status = normalizeStoredStatus(value || fallback);
  if (status === 'converted') return 'confirmed';
  if (status === 'archived') return 'cancelled';
  if (status === 'pending') return 'draft';
  return status;
}

function normalizeKind(type: string, value?: unknown) {
  return normalizeEnum(value, KINDS, type === 'task' ? 'task_capture' : type === 'event' ? 'event_capture' : type === 'note' ? 'note_capture' : 'lead_capture');
}

function normalizeDraft(row: RecordMap) {
  const storedStatus = normalizeStoredStatus(row.status);
  const status = normalizeClientStatus(storedStatus);
  const type = normalizeEnum(row.type, TYPES, 'lead');
  const kind = normalizeKind(type, row.kind);
  const parsedData = asJsonObject(row.parsed_data ?? row.parsedData ?? row.parsedDraft ?? {});

  return {
    id: asText(row.id),
    workspaceId: asText(row.workspace_id ?? row.workspaceId),
    userId: asText(row.user_id ?? row.userId) || null,
    type,
    kind,
    rawText: shouldClearRawText(storedStatus) ? '' : normalizeRawText(row),
    parsedData,
    parsedDraft: parsedData,
    provider: normalizeEnum(row.provider, PROVIDERS, 'local'),
    source: normalizeEnum(row.source, SOURCES, 'manual'),
    status,
    createdAt: asText(row.created_at ?? row.createdAt) || new Date().toISOString(),
    updatedAt: asText(row.updated_at ?? row.updatedAt) || asText(row.created_at ?? row.createdAt) || new Date().toISOString(),
    expiresAt: row.expires_at ?? row.expiresAt ?? null,
    confirmedAt: row.confirmed_at ?? row.confirmedAt ?? row.converted_at ?? row.convertedAt ?? null,
    cancelledAt: row.cancelled_at ?? row.cancelledAt ?? null,
    convertedAt: row.converted_at ?? row.convertedAt ?? row.confirmed_at ?? row.confirmedAt ?? null,
    linkedRecordId: row.linked_record_id ?? row.linkedRecordId ?? null,
    linkedRecordType: row.linked_record_type ?? row.linkedRecordType ?? null,
  };
}

function toIsoOrNull(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function defaultExpiresAt(status: string, input: unknown) {
  const explicit = toIsoOrNull(input);
  if (explicit) return explicit;
  if (shouldClearRawText(status)) return null;
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

function shouldClearRawText(status: string) {
  const normalized = normalizeStoredStatus(status);
  return normalized === 'confirmed' || normalized === 'converted' || normalized === 'cancelled' || normalized === 'expired' || normalized === 'archived';
}

function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  if (match?.[1]) return match[1];
  const altMatch = message.match(/column \"([^\"]+)\" does not exist/i);
  return altMatch?.[1] || null;
}

async function safeInsertAiDraft(payload: RecordMap) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 16; attempt += 1) {
    try {
      return await insertWithVariants(['ai_drafts'], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !(missingColumn in currentPayload)) throw error;
      delete currentPayload[missingColumn];
    }
  }
  throw new Error('AI_DRAFT_SAFE_INSERT_EXHAUSTED');
}

async function safeUpdateAiDraft(id: string, payload: RecordMap) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 16; attempt += 1) {
    try {
      return await updateById('ai_drafts', id, currentPayload);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !(missingColumn in currentPayload)) throw error;
      delete currentPayload[missingColumn];
    }
  }
  throw new Error('AI_DRAFT_SAFE_UPDATE_EXHAUSTED');
}

async function safeSelectRows(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return Array.isArray(result.data) ? result.data as RecordMap[] : [];
  } catch {
    return [] as RecordMap[];
  }
}

function getStatusFilterQuery(requestedStatus: string) {
  const normalized = normalizeStoredStatus(requestedStatus);
  if (!requestedStatus) return '';
  if (normalized === 'confirmed' || normalized === 'converted') return 'status=in.(confirmed,converted)&';
  if (normalized === 'archived' || normalized === 'cancelled' || normalized === 'expired') return 'status=in.(archived,cancelled,expired)&';
  if (normalized === 'pending') return 'status=in.(pending,draft)&';
  return `status=eq.${encodeURIComponent(normalized)}&`;
}

function getLinkedRecordType(value: unknown) {
  const normalized = asText(value).toLowerCase();
  return LINKED_RECORD_TYPES.has(normalized) ? normalized : null;
}

function getLinkedTable(linkedType: string | null) {
  if (!linkedType) return null;
  if (linkedType === 'lead') return 'leads';
  if (linkedType === 'task' || linkedType === 'event') return 'work_items';
  if (linkedType === 'case') return 'cases';
  if (linkedType === 'client') return 'clients';
  return null;
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
      const requestedStatus = asText(req.query?.status);
      const limitRaw = Number(req.query?.limit || 200);
      const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(500, Math.floor(limitRaw))) : 200;
      const statusFilter = getStatusFilterQuery(requestedStatus);
      const query = withWorkspaceFilter(
        `ai_drafts?select=*&${statusFilter}order=created_at.desc&limit=${limit}`,
        workspaceId,
      );
      const rows = await safeSelectRows(query);
      res.status(200).json(rows.map(normalizeDraft));
      return;
    }

    await assertWorkspaceWriteAccess(workspaceId, req);
    if (!isAiDraftCleanupMutation(req, body)) {
      await assertWorkspaceAiAllowed(workspaceId);
    }

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
      const status = normalizeDbStatus(body.status, 'draft');
      const linkedRecordType = getLinkedRecordType(body.linkedRecordType ?? body.linked_record_type);
      const linkedRecordId = asText(body.linkedRecordId ?? body.linked_record_id);
      const linkedTable = getLinkedTable(linkedRecordType);
      if (linkedTable && linkedRecordId) {
        await requireScopedRow(linkedTable, linkedRecordId, workspaceId, 'AI_DRAFT_LINKED_RECORD_NOT_FOUND');
      }
      const payload: RecordMap = {
        workspace_id: workspaceId,
        user_id: asText(body.userId ?? body.user_id ?? identity.userId) || null,
        type,
        kind: normalizeKind(type, body.kind),
        raw_text: shouldClearRawText(status) ? null : rawText,
        parsed_data: asJsonObject(body.parsedData ?? body.parsedDraft ?? body.parsed_data),
        provider: normalizeEnum(body.provider, PROVIDERS, 'local'),
        source: normalizeEnum(body.source, SOURCES, 'manual'),
        status,
        created_at: nowIso,
        updated_at: nowIso,
        expires_at: defaultExpiresAt(status, body.expiresAt ?? body.expires_at),
        confirmed_at: status === 'confirmed' ? nowIso : null,
        cancelled_at: status === 'cancelled' ? nowIso : null,
        converted_at: status === 'confirmed' ? nowIso : null,
        linked_record_id: linkedRecordId || null,
        linked_record_type: linkedRecordType,
      };

      const result = await safeInsertAiDraft(payload);
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
      const nextStatus = body.status !== undefined ? normalizeDbStatus(body.status, 'draft') : '';
      const action = asText(body.action).toLowerCase();
      const statusFromAction = action === 'confirm' || action === 'convert'
        ? 'confirmed'
        : action === 'cancel' || action === 'archive'
          ? 'cancelled'
          : action === 'expire'
            ? 'expired'
            : '';
      const finalStatus = statusFromAction || nextStatus;
      const payload: RecordMap = { updated_at: nowIso };

      if (body.type !== undefined) payload.type = normalizeEnum(body.type, TYPES, 'lead');
      if (body.kind !== undefined) payload.kind = normalizeKind(asText(body.type) || 'lead', body.kind);
      if (body.parsedData !== undefined || body.parsedDraft !== undefined || body.parsed_data !== undefined) {
        payload.parsed_data = asJsonObject(body.parsedData ?? body.parsedDraft ?? body.parsed_data);
      }
      if (body.provider !== undefined) payload.provider = normalizeEnum(body.provider, PROVIDERS, 'local');
      if (body.source !== undefined) payload.source = normalizeEnum(body.source, SOURCES, 'manual');
      if (body.expiresAt !== undefined || body.expires_at !== undefined) payload.expires_at = toIsoOrNull(body.expiresAt ?? body.expires_at);
      if (body.rawText !== undefined || body.raw_text !== undefined) payload.raw_text = asText(body.rawText ?? body.raw_text);
      if (body.linkedRecordId !== undefined || body.linked_record_id !== undefined) payload.linked_record_id = asText(body.linkedRecordId ?? body.linked_record_id) || null;
      if (body.linkedRecordType !== undefined || body.linked_record_type !== undefined) payload.linked_record_type = getLinkedRecordType(body.linkedRecordType ?? body.linked_record_type);
      const linkedRecordType = payload.linked_record_type !== undefined
        ? getLinkedRecordType(payload.linked_record_type)
        : getLinkedRecordType(body.linkedRecordType ?? body.linked_record_type);
      const linkedRecordId = payload.linked_record_id !== undefined
        ? asText(payload.linked_record_id)
        : asText(body.linkedRecordId ?? body.linked_record_id);
      const linkedTable = getLinkedTable(linkedRecordType);
      if (linkedTable && linkedRecordId) {
        await requireScopedRow(linkedTable, linkedRecordId, workspaceId, 'AI_DRAFT_LINKED_RECORD_NOT_FOUND');
      }

      if (finalStatus) {
        payload.status = finalStatus;
        if (shouldClearRawText(finalStatus)) payload.raw_text = null;
        if (finalStatus === 'confirmed') {
          payload.confirmed_at = nowIso;
          payload.converted_at = nowIso;
        }
        if (finalStatus === 'cancelled') payload.cancelled_at = nowIso;
        if (finalStatus === 'expired') payload.expires_at = payload.expires_at || nowIso;
      }

      const updated = await safeUpdateAiDraft(id, payload);
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
    const errorCode = error?.code || error?.message || '';
    if (errorCode === 'WORKSPACE_AI_ACCESS_REQUIRED' || errorCode === 'WORKSPACE_FEATURE_ACCESS_REQUIRED') {
      res.status(402).json({ error: errorCode });
      return;
    }
    if (errorCode === 'WORKSPACE_ENTITY_LIMIT_REACHED') {
      res.status(402).json({ error: 'WORKSPACE_ENTITY_LIMIT_REACHED' });
      return;
    }
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
