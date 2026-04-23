import { deleteById, findWorkspaceId, insertWithVariants, isUuid, selectFirstAvailable, updateById } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from './_request-scope.js';

const SOURCE_ALIASES: Record<string, string> = {
  instagram: 'instagram',
  facebook: 'facebook',
  messenger: 'messenger',
  whatsapp: 'whatsapp',
  'whats app': 'whatsapp',
  'e-mail': 'email',
  email: 'email',
  mail: 'email',
  formularz: 'form',
  form: 'form',
  telefon: 'phone',
  phone: 'phone',
  polecenie: 'referral',
  referral: 'referral',
  'cold outreach': 'cold_outreach',
  cold_outreach: 'cold_outreach',
  inne: 'other',
  other: 'other',
};

const LEAD_STATUSES = new Set([
  'new',
  'contacted',
  'qualification',
  'proposal_sent',
  'negotiation',
  'waiting_response',
  'accepted',
  'accepted_waiting_start',
  'active_service',
  'won',
  'lost',
  'archived',
]);
const BILLING_STATUSES = new Set(['not_applicable', 'not_started', 'awaiting_payment', 'deposit_paid', 'partially_paid', 'fully_paid', 'commission_pending', 'commission_due', 'paid', 'refunded', 'written_off']);
const START_RULES = new Set(['on_acceptance', 'on_deposit', 'on_full_payment', 'on_manual_approval', 'on_documents_ready', 'on_contract_signed', 'custom']);
const WIN_RULES = new Set(['on_case_started', 'on_full_payment', 'on_case_completed', 'on_commission_received', 'manual']);
const BILLING_MODELS = new Set(['upfront_full', 'deposit_then_rest', 'after_completion', 'success_fee', 'recurring', 'manual']);

const OPTIONAL_LEAD_COLUMNS = new Set([
  'is_at_risk',
  'partial_payments',
  'summary',
  'notes',
  'priority',
  'next_action_title',
  'next_action_at',
  'next_action_item_id',
  'linked_case_id',
  'client_id',
  'service_profile_id',
  'accepted_at',
  'case_eligible_at',
  'case_started_at',
  'billing_status',
  'billing_model_snapshot',
  'start_rule_snapshot',
  'win_rule_snapshot',
  'closed_at',
]);

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableUuid(value: unknown) {
  const normalized = asText(value);
  return normalized && isUuid(normalized) ? normalized : null;
}

function normalizePartialPayments(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const amount = Number(row.amount || 0);
      if (!Number.isFinite(amount) || amount < 0) return null;
      return {
        id: String(row.id || `payment-${index}`),
        amount,
        paidAt: typeof row.paidAt === 'string' && row.paidAt.trim() ? row.paidAt : undefined,
        createdAt: typeof row.createdAt === 'string' && row.createdAt.trim() ? row.createdAt : new Date().toISOString(),
      };
    })
    .filter(Boolean);
}

function normalizeSource(value: unknown) {
  const normalized = asText(value).toLowerCase();
  return SOURCE_ALIASES[normalized] || 'other';
}

function toIsoDateTime(value: unknown) {
  const trimmed = asText(value);
  if (!trimmed) return null;
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T09:00:00` : trimmed;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function normalizeStatus(value: unknown) {
  const normalized = asText(value);
  if (normalized === 'follow_up') return 'waiting_response';
  return LEAD_STATUSES.has(normalized) ? normalized : 'new';
}

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = asText(value);
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeLead(row: Record<string, unknown>) {
  return {
    id: String(row.id || crypto.randomUUID()),
    workspaceId: asText(row.workspace_id || row.workspaceId),
    clientId: asText(row.client_id || row.clientId) || undefined,
    serviceProfileId: asText(row.service_profile_id || row.serviceProfileId) || undefined,
    name: asText(row.name || row.title || row.person_name),
    company: asText(row.company || row.company_name),
    email: asText(row.email),
    phone: asText(row.phone),
    source: normalizeSource(row.source || row.source_label || row.source_type || 'other'),
    status: normalizeStatus(row.status),
    nextStep: asText(row.next_action_title || row.next_step || row.nextStep),
    nextActionAt: asText(row.next_action_at || row.next_step_due_at || row.nextActionAt),
    nextActionItemId: asText(row.next_action_item_id || row.nextActionItemId),
    dealValue: Number(row.deal_value || row.value || row.dealValue || 0),
    partialPayments: normalizePartialPayments(row.partial_payments || row.partialPayments),
    billingStatus: normalizeEnum(row.billing_status || row.billingStatus, BILLING_STATUSES, 'not_started'),
    billingModelSnapshot: normalizeEnum(row.billing_model_snapshot || row.billingModelSnapshot, BILLING_MODELS, 'manual'),
    startRuleSnapshot: normalizeEnum(row.start_rule_snapshot || row.startRuleSnapshot, START_RULES, 'on_acceptance'),
    winRuleSnapshot: normalizeEnum(row.win_rule_snapshot || row.winRuleSnapshot, WIN_RULES, 'manual'),
    isAtRisk: Boolean(row.is_at_risk ?? row.isAtRisk ?? (asText(row.priority).toLowerCase() === 'high')),
    acceptedAt: row.accepted_at || row.acceptedAt || null,
    caseEligibleAt: row.case_eligible_at || row.caseEligibleAt || null,
    caseStartedAt: row.case_started_at || row.caseStartedAt || null,
    linkedCaseId: asText(row.linked_case_id || row.linkedCaseId) || null,
    closedAt: row.closed_at || row.closedAt || null,
    updatedAt: row.updated_at || row.updatedAt || null,
    createdAt: row.created_at || row.createdAt || null,
  };
}

function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  return match?.[1] || null;
}

function omitMissingColumn(payload: Record<string, unknown>, column: string) {
  const nextPayload = { ...payload };
  delete nextPayload[column];
  return nextPayload;
}

async function insertLeadWithSchemaFallback(payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await insertWithVariants(['leads'], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_LEAD_COLUMNS.has(missingColumn) || !(missingColumn in currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn);
    }
  }
  throw new Error('LEAD_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function updateLeadWithSchemaFallback(id: string, payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await updateById('leads', id, currentPayload);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_LEAD_COLUMNS.has(missingColumn) || !(missingColumn in currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn);
    }
  }
  throw new Error('LEAD_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

function deriveCaseEligibility(status: string, startRule: string, billingStatus: string, acceptedAtRaw: unknown, caseEligibleAtRaw: unknown) {
  const acceptedAt = toIsoDateTime(acceptedAtRaw as string) || (typeof acceptedAtRaw === 'string' ? acceptedAtRaw : null);
  const existingEligible = toIsoDateTime(caseEligibleAtRaw as string) || (typeof caseEligibleAtRaw === 'string' ? caseEligibleAtRaw : null);
  if (existingEligible) return existingEligible;
  if (status === 'active_service') return new Date().toISOString();
  if (startRule === 'on_acceptance' && (status === 'accepted' || status === 'accepted_waiting_start')) {
    return acceptedAt || new Date().toISOString();
  }
  if (startRule === 'on_deposit' && (billingStatus === 'deposit_paid' || billingStatus === 'partially_paid' || billingStatus === 'fully_paid' || billingStatus === 'paid')) {
    return new Date().toISOString();
  }
  if (startRule === 'on_full_payment' && (billingStatus === 'fully_paid' || billingStatus === 'paid')) {
    return new Date().toISOString();
  }
  return null;
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) {
        res.status(401).json({ error: 'LEAD_WORKSPACE_REQUIRED' });
        return;
      }
      const requestedId = asText(req.query?.id);
      const base = withWorkspaceFilter(`leads?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}order=updated_at.desc.nullslast&limit=${requestedId ? 1 : 300}`, workspaceId);
      const fallback = withWorkspaceFilter(`leads?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}order=created_at.desc.nullslast&limit=${requestedId ? 1 : 300}`, workspaceId);
      const result = await selectFirstAvailable([base, fallback]);
      const normalized = (result.data || []).map((row: Record<string, unknown>) => normalizeLead(row));
      if (requestedId) {
        const match = normalized.find((lead: Record<string, unknown>) => String(lead.id) === requestedId);
        if (!match) {
          res.status(404).json({ error: 'LEAD_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }
      res.status(200).json(normalized);
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);

    if (req.method === 'PATCH') {
      if (!body.id || !workspaceId) {
        res.status(400).json({ error: 'LEAD_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('leads', String(body.id), workspaceId, 'LEAD_NOT_FOUND');

      const nextStatus = body.status !== undefined ? normalizeStatus(body.status) : undefined;
      const nextStartRule = body.startRuleSnapshot !== undefined ? normalizeEnum(body.startRuleSnapshot, START_RULES, 'on_acceptance') : undefined;
      const nextBillingStatus = body.billingStatus !== undefined ? normalizeEnum(body.billingStatus, BILLING_STATUSES, 'not_started') : undefined;
      const nowIso = new Date().toISOString();

      const payload: Record<string, unknown> = { updated_at: nowIso };
      if (body.name !== undefined) payload.name = asText(body.name);
      if (body.company !== undefined) payload.company = asText(body.company);
      if (body.email !== undefined) payload.email = asText(body.email);
      if (body.phone !== undefined) payload.phone = asText(body.phone);
      if (body.source !== undefined) payload.source = normalizeSource(body.source);
      if (body.dealValue !== undefined) payload.value = Number(body.dealValue) || 0;
      if (body.partialPayments !== undefined) payload.partial_payments = normalizePartialPayments(body.partialPayments);
      if (nextStatus !== undefined) payload.status = nextStatus;
      if (body.nextStep !== undefined) payload.next_action_title = body.nextStep || '';
      if (body.nextActionAt !== undefined) payload.next_action_at = toIsoDateTime(body.nextActionAt);
      if (body.isAtRisk !== undefined) {
        payload.is_at_risk = Boolean(body.isAtRisk);
        payload.priority = body.isAtRisk ? 'high' : 'medium';
      }

      if (body.clientId !== undefined) payload.client_id = asNullableUuid(body.clientId);
      if (body.serviceProfileId !== undefined) payload.service_profile_id = asNullableUuid(body.serviceProfileId);
      if (nextBillingStatus !== undefined) payload.billing_status = nextBillingStatus;
      if (body.billingModelSnapshot !== undefined) payload.billing_model_snapshot = normalizeEnum(body.billingModelSnapshot, BILLING_MODELS, 'manual');
      if (nextStartRule !== undefined) payload.start_rule_snapshot = nextStartRule;
      if (body.winRuleSnapshot !== undefined) payload.win_rule_snapshot = normalizeEnum(body.winRuleSnapshot, WIN_RULES, 'manual');
      if (body.acceptedAt !== undefined) payload.accepted_at = toIsoDateTime(body.acceptedAt);
      if (body.caseEligibleAt !== undefined) payload.case_eligible_at = toIsoDateTime(body.caseEligibleAt);
      if (body.caseStartedAt !== undefined) payload.case_started_at = toIsoDateTime(body.caseStartedAt);
      if (body.closedAt !== undefined) payload.closed_at = toIsoDateTime(body.closedAt);

      if (nextStatus === 'accepted' && body.acceptedAt === undefined) payload.accepted_at = nowIso;
      if (nextStatus === 'active_service' && body.caseStartedAt === undefined) payload.case_started_at = nowIso;
      if (nextStatus && ['won', 'lost', 'archived'].includes(nextStatus) && body.closedAt === undefined) payload.closed_at = nowIso;
      if (nextStatus && !['won', 'lost', 'archived'].includes(nextStatus) && body.closedAt === undefined) payload.closed_at = null;

      const derivedEligibleAt = deriveCaseEligibility(
        nextStatus || normalizeStatus(body.currentStatus),
        nextStartRule || normalizeEnum(body.currentStartRuleSnapshot, START_RULES, 'on_acceptance'),
        nextBillingStatus || normalizeEnum(body.currentBillingStatus, BILLING_STATUSES, 'not_started'),
        payload.accepted_at ?? body.acceptedAt,
        payload.case_eligible_at ?? body.caseEligibleAt,
      );
      if (derivedEligibleAt && body.caseEligibleAt === undefined) payload.case_eligible_at = derivedEligibleAt;

      const data = await updateLeadWithSchemaFallback(String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      res.status(200).json(normalizeLead(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'LEAD_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('leads', id, workspaceId, 'LEAD_NOT_FOUND');
      await deleteById('leads', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const finalWorkspaceId = workspaceId || await findWorkspaceId(body.workspaceId);
    if (!finalWorkspaceId) throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
    const nowIso = new Date().toISOString();
    const status = normalizeStatus(body.status || 'new');
    const startRuleSnapshot = normalizeEnum(body.startRuleSnapshot, START_RULES, 'on_acceptance');
    const billingStatus = normalizeEnum(body.billingStatus, BILLING_STATUSES, 'not_started');

    const payload: Record<string, unknown> = {
      workspace_id: finalWorkspaceId,
      created_by_user_id: body.ownerId && isUuid(body.ownerId) ? body.ownerId : null,
      client_id: asNullableUuid(body.clientId),
      service_profile_id: asNullableUuid(body.serviceProfileId),
      name: asText(body.name),
      company: asText(body.company),
      email: asText(body.email),
      phone: asText(body.phone),
      source: normalizeSource(body.source),
      value: Number(body.dealValue) || 0,
      partial_payments: normalizePartialPayments(body.partialPayments),
      summary: asText(body.summary),
      notes: asText(body.notes),
      status,
      priority: body.isAtRisk ? 'high' : 'medium',
      is_at_risk: Boolean(body.isAtRisk),
      next_action_title: asText(body.nextStep),
      next_action_at: toIsoDateTime(body.nextActionAt),
      next_action_item_id: null,
      billing_status: billingStatus,
      billing_model_snapshot: normalizeEnum(body.billingModelSnapshot, BILLING_MODELS, 'manual'),
      start_rule_snapshot: startRuleSnapshot,
      win_rule_snapshot: normalizeEnum(body.winRuleSnapshot, WIN_RULES, 'manual'),
      accepted_at: toIsoDateTime(body.acceptedAt) || (status === 'accepted' ? nowIso : null),
      case_eligible_at: deriveCaseEligibility(status, startRuleSnapshot, billingStatus, body.acceptedAt, body.caseEligibleAt),
      case_started_at: toIsoDateTime(body.caseStartedAt) || (status === 'active_service' ? nowIso : null),
      closed_at: ['won', 'lost', 'archived'].includes(status) ? nowIso : null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const result = await insertLeadWithSchemaFallback(payload);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    res.status(200).json(normalizeLead(inserted as Record<string, unknown>));
  } catch (error: any) {
    const message = error?.message || 'LEAD_INSERT_FAILED';
    res.status(message === 'LEAD_NOT_FOUND' ? 404 : 500).json({ error: message });
  }
}
