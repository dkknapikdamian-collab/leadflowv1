import { insertWithVariants, supabaseRpc } from './_supabase.js';
import { asText, requireScopedRow } from './_request-scope.js';

type RecordMap = Record<string, unknown>;

export type AiDraftConfirmationInput = {
  recordType?: unknown;
  title?: unknown;
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  source?: unknown;
  dealValue?: unknown;
  body?: unknown;
  scheduledAt?: unknown;
  endAt?: unknown;
  priority?: unknown;
  taskType?: unknown;
  eventType?: unknown;
  leadId?: unknown;
  caseId?: unknown;
  clientId?: unknown;
};

const CONFIRMATION_TYPES = new Set(['lead', 'task', 'event', 'note']);

function asObject(value: unknown): RecordMap {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as RecordMap : {};
}

function normalizeType(value: unknown, fallback = 'lead') {
  const normalized = asText(value).toLowerCase();
  return CONFIRMATION_TYPES.has(normalized) ? normalized : fallback;
}

function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const normalized = asText(value).replace(/\s+/g, '').replace(/zł|pln/gi, '').replace(',', '.').replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function assertRelation(table: string, id: string, workspaceId: string, code: string) {
  if (!id) return;
  await requireScopedRow(table, id, workspaceId, code);
}

function resultId(result: { data?: unknown }) {
  const row = Array.isArray(result.data) && result.data[0] && typeof result.data[0] === 'object'
    ? result.data[0] as RecordMap
    : {};
  return asText(row.id || row.record_id || row.recordId) || null;
}

export async function claimAiDraftConfirmation(draftId: string, workspaceId: string) {
  const result = await supabaseRpc('claim_ai_draft_confirmation', {
    p_draft_id: draftId,
    p_workspace_id: workspaceId,
  });
  if (typeof result === 'boolean') return result;
  if (Array.isArray(result) && typeof result[0] === 'boolean') return result[0];
  if (result && typeof result === 'object' && 'claimed' in result) return Boolean((result as RecordMap).claimed);
  throw new Error('AI_DRAFT_CONFIRMATION_CLAIM_INVALID_RESPONSE');
}

export async function releaseAiDraftConfirmation(draftId: string, workspaceId: string) {
  await supabaseRpc('release_ai_draft_confirmation', {
    p_draft_id: draftId,
    p_workspace_id: workspaceId,
  });
}

export async function createFinalRecordFromAiDraft(
  draft: RecordMap,
  workspaceId: string,
  input: AiDraftConfirmationInput = {},
) {
  const parsed = asObject(draft.parsed_data ?? draft.parsedData);
  const type = normalizeType(input.recordType ?? draft.type);
  const title = asText(input.title) || asText(parsed.title ?? parsed.name ?? draft.raw_text) || (type === 'event' ? 'Wydarzenie ze szkicu' : type === 'task' ? 'Zadanie ze szkicu' : type === 'note' ? 'Notatka AI' : 'Lead ze szkicu');
  const name = asText(input.name) || asText(parsed.name ?? parsed.contactName ?? title) || title;
  const company = asText(input.company) || asText(parsed.company);
  const email = asText(input.email) || asText(parsed.email);
  const phone = asText(input.phone) || asText(parsed.phone);
  const leadId = asText(input.leadId) || asText(parsed.leadId ?? parsed.lead_id);
  const caseId = asText(input.caseId) || asText(parsed.caseId ?? parsed.case_id);
  const clientId = asText(input.clientId) || asText(parsed.clientId ?? parsed.client_id);
  const nowIso = new Date().toISOString();

  await assertRelation('leads', leadId, workspaceId, 'AI_DRAFT_LEAD_NOT_FOUND');
  await assertRelation('cases', caseId, workspaceId, 'AI_DRAFT_CASE_NOT_FOUND');
  await assertRelation('clients', clientId, workspaceId, 'AI_DRAFT_CLIENT_NOT_FOUND');

  if (type === 'lead') {
    const result = await insertWithVariants(['leads'], [{
      workspace_id: workspaceId,
      name,
      company,
      email: email || null,
      phone: phone || null,
      source: asText(input.source) || asText(parsed.source) || 'ai_draft',
      status: asText(parsed.status) || 'new',
      deal_value: asNumber(input.dealValue ?? parsed.dealValue ?? parsed.value),
      next_action_at: asText(input.scheduledAt) || asText(parsed.scheduledAt ?? parsed.startAt) || null,
      client_id: clientId || null,
      linked_case_id: caseId || null,
      created_at: nowIso,
      updated_at: nowIso,
    }]);
    return { id: resultId(result), type: 'lead' as const };
  }

  if (type === 'note') {
    const noteBody = asText(input.body) || asText(parsed.body ?? parsed.description ?? draft.raw_text);
    if (!noteBody) throw new Error('AI_DRAFT_NOTE_BODY_REQUIRED');
    if (!leadId && !caseId && !clientId) throw new Error('AI_DRAFT_NOTE_RELATION_REQUIRED');
    const result = await insertWithVariants(['activities'], [{
      workspace_id: workspaceId,
      lead_id: leadId || null,
      case_id: caseId || null,
      client_id: clientId || null,
      actor_type: 'operator',
      event_type: 'ai_note_approved',
      payload: { note: noteBody, title, source: 'ai_draft_approval' },
      created_at: nowIso,
      updated_at: nowIso,
    }]);
    return { id: resultId(result), type: 'note' as const };
  }

  const result = await insertWithVariants(['work_items'], [{
    workspace_id: workspaceId,
    title,
    status: asText(parsed.status) || (type === 'event' ? 'scheduled' : 'todo'),
    priority: asText(input.priority) || asText(parsed.priority) || 'medium',
    record_type: type,
    type: type === 'event'
      ? asText(input.eventType) || asText(parsed.eventType) || 'meeting'
      : asText(input.taskType) || asText(parsed.taskType) || 'follow_up',
    description: asText(input.body) || asText(parsed.body ?? parsed.description),
    scheduled_at: asText(input.scheduledAt) || asText(parsed.scheduledAt ?? parsed.startAt) || null,
    start_at: asText(input.scheduledAt) || asText(parsed.startAt ?? parsed.scheduledAt) || null,
    end_at: asText(input.endAt) || asText(parsed.endAt) || null,
    lead_id: leadId || null,
    case_id: caseId || null,
    client_id: clientId || null,
    show_in_tasks: type === 'task',
    show_in_calendar: type === 'event',
    created_at: nowIso,
    updated_at: nowIso,
  }]);
  return { id: resultId(result), type: type as 'task' | 'event' };
}
