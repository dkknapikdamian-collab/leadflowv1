import { deleteById, findWorkspaceId, insertWithVariants, isUuid, selectFirstAvailable, updateById } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from './_request-scope.js';
import { buildLeadMovedToServicePayload } from './_lead-service.js';

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
  'moved_to_service',
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
  'moved_to_service_at',
  'lead_visibility',
  'sales_outcome',
]);
const OPTIONAL_CASE_COLUMNS = new Set(['service_profile_id', 'billing_status', 'billing_model_snapshot', 'started_at', 'completed_at', 'last_activity_at', 'created_from_lead', 'service_started_at']);
const OPTIONAL_ACTIVITY_COLUMNS = new Set(['owner_id', 'actor_id', 'actor_type', 'event_type', 'payload', 'lead_id', 'case_id', 'workspace_id', 'created_at', 'updated_at']);

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
  if (normalized === 'accepted_waiting_start') return 'accepted';
  if (normalized === 'active_service') return 'moved_to_service';
  return LEAD_STATUSES.has(normalized) ? normalized : 'new';
}

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = asText(value);
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeNextActionTitle(value: unknown) {
  return asText(value);
}

function normalizeLead(row: Record<string, unknown>) {
  const normalizedStatus = normalizeStatus(row.status);
  const linkedCaseId = asText(row.linked_case_id || row.linkedCaseId) || null;
  const movedToServiceAt = row.moved_to_service_at || row.movedToServiceAt || row.case_started_at || row.caseStartedAt || null;
  const leadVisibility = asText(row.lead_visibility || row.leadVisibility) || (normalizedStatus === 'moved_to_service' || linkedCaseId ? 'archived' : 'active');
  const salesOutcome = asText(row.sales_outcome || row.salesOutcome) || (normalizedStatus === 'moved_to_service' ? 'moved_to_service' : normalizedStatus === 'won' ? 'won' : normalizedStatus === 'lost' ? 'lost' : 'open');
  const movedToService = normalizedStatus === 'moved_to_service' || leadVisibility === 'archived' || Boolean(linkedCaseId);

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
    status: normalizedStatus,
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
    linkedCaseId,
    movedToService,
    movedToServiceAt,
    leadVisibility,
    salesOutcome,
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

async function insertCaseWithSchemaFallback(payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await insertWithVariants(['cases'], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_CASE_COLUMNS.has(missingColumn) || !(missingColumn in currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn);
    }
  }
  throw new Error('CASE_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function insertActivityWithSchemaFallback(payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await insertWithVariants(['activities'], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_ACTIVITY_COLUMNS.has(missingColumn) || !(missingColumn in currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn);
    }
  }
  throw new Error('ACTIVITY_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function safeSelectRows(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return Array.isArray(result.data) ? (result.data as Record<string, unknown>[]) : [];
  } catch {
    return [];
  }
}

async function findExistingClient(workspaceId: string, leadRow: Record<string, unknown>) {
  const explicitClientId = asNullableUuid(leadRow.client_id || leadRow.clientId);
  if (explicitClientId) {
    const rows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&id=eq.${encodeURIComponent(explicitClientId)}&limit=1`, workspaceId));
    if (rows[0]) return rows[0];
  }

  const email = asText(leadRow.email).toLowerCase();
  if (email) {
    const rows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&email=eq.${encodeURIComponent(email)}&limit=1`, workspaceId));
    if (rows[0]) return rows[0];
  }

  const phone = asText(leadRow.phone);
  if (phone) {
    const rows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&phone=eq.${encodeURIComponent(phone)}&limit=1`, workspaceId));
    if (rows[0]) return rows[0];
  }

  const name = asText(leadRow.name || leadRow.company);
  if (name) {
    const rows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&name=ilike.${encodeURIComponent(name)}&limit=1`, workspaceId));
    if (rows[0]) return rows[0];
  }

  return null;
}

async function ensureClientForLead(workspaceId: string, leadRow: Record<string, unknown>) {
  const existing = await findExistingClient(workspaceId, leadRow);
  if (existing) return existing;

  const nowIso = new Date().toISOString();
  const payload: Record<string, unknown> = {
    workspace_id: workspaceId,
    name: asText(leadRow.name || leadRow.company) || 'Klient',
    company: asText(leadRow.company) || null,
    email: asText(leadRow.email).toLowerCase() || null,
    phone: asText(leadRow.phone) || null,
    source_primary: asText(leadRow.source) || 'other',
    created_at: nowIso,
    updated_at: nowIso,
    last_activity_at: nowIso,
  };

  const result = await insertWithVariants(['clients'], [payload]);
  return Array.isArray(result.data) && result.data[0] ? result.data[0] as Record<string, unknown> : payload;
}

async function handleStartService(body: Record<string, unknown>, workspaceId: string) {
  const leadId = asText(body.id || body.leadId);
  if (!leadId) {
    throw new Error('LEAD_ID_REQUIRED');
  }

  await requireScopedRow('leads', leadId, workspaceId, 'LEAD_NOT_FOUND');
  const leadRows = await safeSelectRows(withWorkspaceFilter(`leads?select=*&id=eq.${encodeURIComponent(leadId)}&limit=1`, workspaceId));
  const leadRow = leadRows[0];
  if (!leadRow) {
    throw new Error('LEAD_NOT_FOUND');
  }

  const existingCaseId = asText(leadRow.linked_case_id || leadRow.linkedCaseId);
  if (existingCaseId) {
    throw new Error('LEAD_ALREADY_HAS_CASE');
  }

  const existingCases = await safeSelectRows(withWorkspaceFilter(`cases?select=id&lead_id=eq.${encodeURIComponent(leadId)}&limit=1`, workspaceId));
  if (existingCases[0]) {
    throw new Error('LEAD_ALREADY_HAS_CASE');
  }

  const nowIso = new Date().toISOString();
  const leadContext: Record<string, unknown> = {
    ...leadRow,
    name: asText(body.clientName) || asText(leadRow.name),
    email: asText(body.clientEmail) || asText(leadRow.email),
    phone: asText(body.clientPhone) || asText(leadRow.phone),
  };
  const clientRow = await ensureClientForLead(workspaceId, leadContext);
  const clientId = asNullableUuid(clientRow.id);
  const caseStatus = normalizeEnum(body.caseStatus || body.status, new Set(['new', 'waiting_on_client', 'blocked', 'to_approve', 'ready_to_start', 'in_progress', 'on_hold', 'completed', 'canceled']), 'in_progress');
  const caseTitle = asText(body.title) || asText(leadRow.name) || `${asText(clientRow.name) || 'Klient'} - obsluga`;

  const casePayload: Record<string, unknown> = {
    workspace_id: workspaceId,
    lead_id: leadId,
    client_id: clientId,
    service_profile_id: asNullableUuid(leadRow.service_profile_id || leadRow.serviceProfileId),
    title: caseTitle,
    client_name: asText(clientRow.name || leadContext.name),
    client_email: asText(clientRow.email || leadContext.email),
    client_phone: asText(clientRow.phone || leadContext.phone),
    status: caseStatus,
    billing_status: normalizeEnum(leadRow.billing_status || leadRow.billingStatus, BILLING_STATUSES, 'not_started'),
    billing_model_snapshot: normalizeEnum(leadRow.billing_model_snapshot || leadRow.billingModelSnapshot, BILLING_MODELS, 'manual'),
    completeness_percent: 0,
    portal_ready: false,
    started_at: caseStatus === 'in_progress' ? nowIso : null,
    completed_at: caseStatus === 'completed' ? nowIso : null,
    last_activity_at: nowIso,
    created_from_lead: true,
    service_started_at: nowIso,
    created_at: nowIso,
    updated_at: nowIso,
  };

  const createdCaseResult = await insertCaseWithSchemaFallback(casePayload);
  const createdCase = Array.isArray(createdCaseResult.data) && createdCaseResult.data[0]
    ? createdCaseResult.data[0] as Record<string, unknown>
    : casePayload;
  const caseId = asText(createdCase.id);
  if (!caseId) {
    throw new Error('CASE_CREATE_FAILED');
  }

  const leadPayload = buildLeadMovedToServicePayload({
    caseId,
    clientId,
    occurredAt: nowIso,
    updatedAt: nowIso,
  });
  await updateLeadWithSchemaFallback(leadId, leadPayload);

  await insertActivityWithSchemaFallback({
    workspace_id: workspaceId,
    lead_id: leadId,
    case_id: caseId,
    owner_id: null,
    actor_id: null,
    actor_type: 'operator',
    event_type: 'case_created',
    payload: { caseId, caseTitle, leadName: asText(leadRow.name) },
    created_at: nowIso,
    updated_at: nowIso,
  }).catch(() => null);

  await insertActivityWithSchemaFallback({
    workspace_id: workspaceId,
    lead_id: leadId,
    case_id: caseId,
    owner_id: null,
    actor_id: null,
    actor_type: 'operator',
    event_type: 'lead_moved_to_service',
    payload: { caseId, caseTitle, movedToServiceAt: nowIso },
    created_at: nowIso,
    updated_at: nowIso,
  }).catch(() => null);

  const refreshedLeadRows = await safeSelectRows(withWorkspaceFilter(`leads?select=*&id=eq.${encodeURIComponent(leadId)}&limit=1`, workspaceId));

  return {
    lead: normalizeLead(refreshedLeadRows[0] || { ...leadRow, ...leadPayload, id: leadId }),
    case: {
      id: caseId,
      title: asText(createdCase.title || caseTitle),
      status: caseStatus,
      clientId: clientId || undefined,
      leadId,
      createdFromLead: true,
      serviceStartedAt: nowIso,
    },
    client: {
      id: asText(clientRow.id),
      name: asText(clientRow.name || leadContext.name),
      email: asText(clientRow.email || leadContext.email),
      phone: asText(clientRow.phone || leadContext.phone),
    },
  };
}

function deriveCaseEligibility(status: string, startRule: string, billingStatus: string, acceptedAtRaw: unknown, caseEligibleAtRaw: unknown) {
  const acceptedAt = toIsoDateTime(acceptedAtRaw as string) || (typeof acceptedAtRaw === 'string' ? acceptedAtRaw : null);
  const existingEligible = toIsoDateTime(caseEligibleAtRaw as string) || (typeof caseEligibleAtRaw === 'string' ? caseEligibleAtRaw : null);
  if (existingEligible) return existingEligible;
  if (status === 'moved_to_service') return new Date().toISOString();
  if (startRule === 'on_acceptance' && status === 'accepted') {
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

    if (req.method === 'POST' && asText(body.action) === 'start_service') {
      if (!workspaceId) {
        res.status(400).json({ error: 'LEAD_WORKSPACE_REQUIRED' });
        return;
      }
      const data = await handleStartService(body, workspaceId);
      res.status(200).json(data);
      return;
    }

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
      if (body.nextActionAt !== undefined) payload.next_action_at = toIsoDateTime(body.nextActionAt);
      if (body.nextActionTitle !== undefined) payload.next_action_title = normalizeNextActionTitle(body.nextActionTitle);
      if (body.isAtRisk !== undefined) {
        payload.is_at_risk = Boolean(body.isAtRisk);
        payload.priority = body.isAtRisk ? 'high' : 'medium';
      }

      if (body.clientId !== undefined) payload.client_id = asNullableUuid(body.clientId);
      if (body.linkedCaseId !== undefined) payload.linked_case_id = asNullableUuid(body.linkedCaseId);
      if (body.serviceProfileId !== undefined) payload.service_profile_id = asNullableUuid(body.serviceProfileId);
      if (nextBillingStatus !== undefined) payload.billing_status = nextBillingStatus;
      if (body.billingModelSnapshot !== undefined) payload.billing_model_snapshot = normalizeEnum(body.billingModelSnapshot, BILLING_MODELS, 'manual');
      if (nextStartRule !== undefined) payload.start_rule_snapshot = nextStartRule;
      if (body.winRuleSnapshot !== undefined) payload.win_rule_snapshot = normalizeEnum(body.winRuleSnapshot, WIN_RULES, 'manual');
      if (body.acceptedAt !== undefined) payload.accepted_at = toIsoDateTime(body.acceptedAt);
      if (body.caseEligibleAt !== undefined) payload.case_eligible_at = toIsoDateTime(body.caseEligibleAt);
      if (body.caseStartedAt !== undefined) payload.case_started_at = toIsoDateTime(body.caseStartedAt);
      if (body.movedToServiceAt !== undefined) payload.moved_to_service_at = toIsoDateTime(body.movedToServiceAt);
      if (body.leadVisibility !== undefined) payload.lead_visibility = asText(body.leadVisibility) || 'active';
      if (body.salesOutcome !== undefined) payload.sales_outcome = asText(body.salesOutcome) || 'open';
      if (body.closedAt !== undefined) payload.closed_at = toIsoDateTime(body.closedAt);

      if (nextStatus === 'accepted' && body.acceptedAt === undefined) payload.accepted_at = nowIso;
      if (nextStatus === 'moved_to_service') {
        if (body.caseStartedAt === undefined) payload.case_started_at = nowIso;
        if (body.movedToServiceAt === undefined) payload.moved_to_service_at = nowIso;
        if (body.leadVisibility === undefined) payload.lead_visibility = 'archived';
        if (body.salesOutcome === undefined) payload.sales_outcome = 'moved_to_service';
        payload.next_action_title = '';
        payload.next_action_at = null;
        payload.next_action_item_id = null;
      }
      if (nextStatus && ['won', 'lost', 'archived'].includes(nextStatus) && body.closedAt === undefined) payload.closed_at = nowIso;
      if (nextStatus && !['won', 'lost', 'archived', 'moved_to_service'].includes(nextStatus) && body.closedAt === undefined) payload.closed_at = null;

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
    const ensuredClient = await ensureClientForLead(finalWorkspaceId, {
      client_id: body.clientId,
      name: asText(body.name),
      company: asText(body.company),
      email: asText(body.email),
      phone: asText(body.phone),
      source: normalizeSource(body.source),
    });
    const ensuredClientId = asNullableUuid(ensuredClient?.id || body.clientId);
    const nextActionAt = status === 'moved_to_service' ? null : toIsoDateTime(body.nextActionAt);

    const payload: Record<string, unknown> = {
      workspace_id: finalWorkspaceId,
      created_by_user_id: body.ownerId && isUuid(body.ownerId) ? body.ownerId : null,
      client_id: ensuredClientId,
      linked_case_id: asNullableUuid(body.linkedCaseId),
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
      next_action_title: normalizeNextActionTitle(body.nextActionTitle),
      next_action_at: nextActionAt,
      next_action_item_id: null,
      billing_status: billingStatus,
      billing_model_snapshot: normalizeEnum(body.billingModelSnapshot, BILLING_MODELS, 'manual'),
      start_rule_snapshot: startRuleSnapshot,
      win_rule_snapshot: normalizeEnum(body.winRuleSnapshot, WIN_RULES, 'manual'),
      accepted_at: toIsoDateTime(body.acceptedAt) || (status === 'accepted' ? nowIso : null),
      case_eligible_at: deriveCaseEligibility(status, startRuleSnapshot, billingStatus, body.acceptedAt, body.caseEligibleAt),
      case_started_at: toIsoDateTime(body.caseStartedAt) || (status === 'moved_to_service' ? nowIso : null),
      moved_to_service_at: toIsoDateTime(body.movedToServiceAt) || (status === 'moved_to_service' ? nowIso : null),
      lead_visibility: asText(body.leadVisibility) || (status === 'moved_to_service' ? 'archived' : 'active'),
      sales_outcome: asText(body.salesOutcome) || (status === 'moved_to_service' ? 'moved_to_service' : status === 'won' ? 'won' : status === 'lost' ? 'lost' : 'open'),
      closed_at: ['won', 'lost', 'archived', 'moved_to_service'].includes(status) ? nowIso : null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const result = await insertLeadWithSchemaFallback(payload);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    res.status(200).json(normalizeLead(inserted as Record<string, unknown>));
  } catch (error: any) {
    const message = error?.message || 'LEAD_INSERT_FAILED';
    const statusCode = message === 'LEAD_NOT_FOUND' ? 404 : message === 'LEAD_ALREADY_HAS_CASE' ? 409 : 500;
    res.status(statusCode).json({ error: message });
  }
}




