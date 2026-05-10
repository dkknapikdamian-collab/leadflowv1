// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
import { deleteById, insertWithVariants, isUuid, selectFirstAvailable, supabaseRequest, updateById, updateByIdScoped, deleteByIdScoped } from '../src/server/_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from '../src/server/_request-scope.js';
import { buildLeadMovedToServicePayload } from '../src/server/_lead-service.js';
import { assertWorkspaceEntityLimit, assertWorkspaceFeatureAccess, assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';
import { normalizeLeadContract } from '../src/lib/data-contract.js';
import { LEAD_STATUS_VALUES, normalizeLeadStatus } from '../src/lib/domain-statuses.js';
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent, getGoogleCalendarConnection, updateGoogleCalendarEvent } from '../src/server/google-calendar-sync.js';
import { startLeadServiceOperation } from '../src/server/lead-to-case.js';

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

const LEAD_STATUSES = new Set<string>(LEAD_STATUS_VALUES);
const BILLING_STATUSES = new Set(['not_applicable', 'not_started', 'awaiting_payment', 'deposit_paid', 'partially_paid', 'fully_paid', 'commission_pending', 'commission_due', 'paid', 'refunded', 'written_off']);
const START_RULES = new Set(['on_acceptance', 'on_deposit', 'on_full_payment', 'on_manual_approval', 'on_documents_ready', 'on_contract_signed', 'custom']);
const WIN_RULES = new Set(['on_case_started', 'on_full_payment', 'on_case_completed', 'on_commission_received', 'manual']);
const BILLING_MODELS = new Set(['upfront_full', 'deposit_then_rest', 'after_completion', 'success_fee', 'recurring', 'manual']);
const PAID_PAYMENT_STATUSES = new Set(['deposit_paid', 'partially_paid', 'fully_paid', 'paid']);

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
  'currency',
  'contract_value',
  'commission_mode',
  'commission_base',
  'commission_rate',
  'commission_amount',
  'commission_status',
  'finance_note',
  'google_calendar_id',
  'google_calendar_event_id',
  'google_calendar_event_etag',
  'google_calendar_html_link',
  'google_calendar_synced_at',
  'google_calendar_sync_status',
  'google_calendar_sync_error',
]);
const OPTIONAL_CASE_COLUMNS = new Set(['service_profile_id', 'billing_status', 'billing_model_snapshot', 'started_at', 'completed_at', 'last_activity_at', 'created_from_lead', 'service_started_at', 'expected_revenue', 'paid_amount', 'remaining_amount', 'currency',
  'contract_value',
  'commission_mode',
  'commission_base',
  'commission_rate',
  'commission_amount',
  'commission_status',]);
const OPTIONAL_ACTIVITY_COLUMNS = new Set(['owner_id', 'actor_id', 'actor_type', 'event_type', 'payload', 'lead_id', 'case_id', 'workspace_id', 'created_at', 'updated_at']);

const LEAD_SCHEMA_FALLBACK_ALLOWED_COLUMNS: Record<'leads' | 'cases' | 'activities', Set<string>> = {
  leads: OPTIONAL_LEAD_COLUMNS,
  cases: OPTIONAL_CASE_COLUMNS,
  activities: OPTIONAL_ACTIVITY_COLUMNS,
};

const CLOSEFLOW_A2_ALLOW_DUPLICATE_API_OVERRIDE = 'allowDuplicate is the API duplicate override flag';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asLeadCompanyForNotNull(value: unknown) {
  // CLOSEFLOW_LEAD_COMPANY_NOT_NULL_REPAIR_V25
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
  return normalizeLeadStatus(value);
}

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = asText(value);
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeNextActionTitle(value: unknown) {
  return asText(value);
}

function normalizeCurrency(value: unknown) {
  const normalized = asText(value).toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'PLN';
}

function sumPartialPayments(value: unknown) {
  if (!Array.isArray(value)) return 0;
  return value.reduce((acc, row) => {
    if (!row || typeof row !== 'object') return acc;
    const amount = Number((row as Record<string, unknown>).amount || 0);
    return Number.isFinite(amount) && amount > 0 ? acc + amount : acc;
  }, 0);
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
}

const LEAD_COMMISSION_MODES = new Set(['none', 'percent', 'fixed']);
const LEAD_COMMISSION_BASES = new Set(['contract_value', 'paid_amount', 'custom']);
const LEAD_COMMISSION_STATUSES = new Set(['not_set', 'expected', 'due', 'partially_paid', 'paid', 'overdue']);

function applyLeadFinancePayload(payload: Record<string, unknown>, body: Record<string, unknown>) {
  if (body.contractValue !== undefined || body.contract_value !== undefined || body.dealValue !== undefined || body.deal_value !== undefined) {
    payload.contract_value = asNumber(body.contractValue ?? body.contract_value ?? body.dealValue ?? body.deal_value);
    payload.value = asNumber(body.dealValue ?? body.deal_value ?? body.contractValue ?? body.contract_value);
  }
  if (body.commissionMode !== undefined || body.commission_mode !== undefined) payload.commission_mode = normalizeEnum(body.commissionMode ?? body.commission_mode, LEAD_COMMISSION_MODES, 'none');
  if (body.commissionBase !== undefined || body.commission_base !== undefined) payload.commission_base = normalizeEnum(body.commissionBase ?? body.commission_base, LEAD_COMMISSION_BASES, 'contract_value');
  if (body.commissionRate !== undefined || body.commission_rate !== undefined) payload.commission_rate = asNumber(body.commissionRate ?? body.commission_rate);
  if (body.commissionAmount !== undefined || body.commission_amount !== undefined) payload.commission_amount = asNumber(body.commissionAmount ?? body.commission_amount);
  if (body.commissionStatus !== undefined || body.commission_status !== undefined) payload.commission_status = normalizeEnum(body.commissionStatus ?? body.commission_status, LEAD_COMMISSION_STATUSES, 'not_set');
  if (body.financeNote !== undefined || body.finance_note !== undefined || body.financialNote !== undefined || body.financial_note !== undefined) payload.finance_note = asText(body.financeNote ?? body.finance_note ?? body.financialNote ?? body.financial_note) || null;
}

function normalizeLead(row: Record<string, unknown>) {
  return normalizeLeadContract(row);
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

function shouldDropMissingColumnForLeadFallback(table: 'leads' | 'cases' | 'activities', column: string | null, payload: Record<string, unknown>) {
  return Boolean(column && column in payload && LEAD_SCHEMA_FALLBACK_ALLOWED_COLUMNS[table]?.has(column));
}

// CLOSEFLOW_LEAD_COMPANY_NOT_NULL_REPAIR_V2: lead create payload must keep company as empty string, never null, because production schema may have NOT NULL.

function sanitizeFreshLeadCreatePayloadA1(payload: Record<string, unknown>) {
  const next = { ...payload };
  delete next.client_id;
  delete next.clientId;
  delete next.linked_case_id;
  delete next.linkedCaseId;
  delete next.case_id;
  delete next.caseId;
  return next;
}

async function insertLeadWithSchemaFallback(payload: Record<string, unknown>) {
  // CLOSEFLOW_LEAD_COMPANY_NOT_NULL_REPAIR_V25: production leads.company can be NOT NULL.
  let currentPayload: Record<string, unknown> = { ...sanitizeFreshLeadCreatePayloadA1(payload), company: asLeadCompanyForNotNull(payload.company) };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await insertWithVariants(['leads'], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!shouldDropMissingColumnForLeadFallback('leads', missingColumn, currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn);
    }
  }
  throw new Error('LEAD_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function updateLeadWithSchemaFallback(id: string, workspaceId: string, payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await updateByIdScoped('leads', id, workspaceId, currentPayload);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!shouldDropMissingColumnForLeadFallback('leads', missingColumn, currentPayload)) throw error;
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
      if (!shouldDropMissingColumnForLeadFallback('cases', missingColumn, currentPayload)) throw error;
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
      if (!shouldDropMissingColumnForLeadFallback('activities', missingColumn, currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn);
    }
  }
  throw new Error('ACTIVITY_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}



function asRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function isMissingLeadServiceRpc(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return (
    message.includes('PGRST202') ||
    message.includes('Could not find the function') ||
    message.includes('closeflow_start_lead_service')
  );
}

async function startLeadServiceWithSupabaseRpc(input: {
  body: Record<string, unknown>;
  workspaceId: string;
  leadId: string;
  leadRow: Record<string, unknown>;
}) {
  try {
    const data = await supabaseRequest('rpc/closeflow_start_lead_service', {
      method: 'POST',
      body: JSON.stringify({
        p_workspace_id: input.workspaceId,
        p_lead_id: input.leadId,
        p_title: asText(input.body.title) || asText(input.leadRow.name) || asText(input.leadRow.company) || 'Nowa sprawa',
        p_case_status: asText(input.body.caseStatus || input.body.status) || 'in_progress',
        p_client_name: asText(input.body.clientName) || asText(input.leadRow.name || input.leadRow.company),
        p_client_email: asText(input.body.clientEmail) || asText(input.leadRow.email),
        p_client_phone: asText(input.body.clientPhone) || asText(input.leadRow.phone),
      }),
    });

    const result = asRecord(Array.isArray(data) ? data[0] : data);
    if (!Object.keys(result).length) {
      throw new Error('LEAD_SERVICE_RPC_EMPTY_RESULT');
    }

    const lead = asRecord(result.lead);
    const caseRow = asRecord(result.case);
    const client = asRecord(result.client);
    const caseId = asText(result.caseId || caseRow.id || lead.linkedCaseId || lead.linked_case_id);
    if (!caseId) {
      throw new Error('CASE_CREATE_FAILED');
    }

    return {
      lead: normalizeLead({ ...lead, id: input.leadId }),
      case: {
        ...caseRow,
        id: caseId,
        title: asText(caseRow.title) || asText(input.body.title) || 'Powiązana sprawa',
        leadId: input.leadId,
        clientId: asText(result.clientId || caseRow.clientId || caseRow.client_id || client.id) || undefined,
        createdFromLead: true,
        serviceStartedAt: asText(result.movedToServiceAt || caseRow.serviceStartedAt || caseRow.service_started_at) || new Date().toISOString(),
      },
      client: {
        ...client,
        id: asText(result.clientId || client.id),
      },
    };
  } catch (error) {
    if (isMissingLeadServiceRpc(error)) {
      return null;
    }
    throw error;
  }
}

async function safeSelectRows(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return Array.isArray(result.data) ? (result.data as Record<string, unknown>[]) : [];
  } catch {
    return [];
  }
}

async function sumLeadPaidPayments(workspaceId: string, leadId: string) {
  if (!workspaceId || !leadId) return 0;
  const statuses = Array.from(PAID_PAYMENT_STATUSES).join(',');
  const rows = await safeSelectRows(
    withWorkspaceFilter(`payments?select=amount,status&lead_id=eq.${encodeURIComponent(leadId)}&status=in.(${statuses})&limit=500`, workspaceId),
  );
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + asNumber(row.amount), 0);
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

  // A24_RPC_HANDOFF_BEFORE_LEGACY_FALLBACK
  // Prefer one Supabase transaction via RPC. Keep legacy fallback until migration is applied.
  const rpcResult = await startLeadServiceWithSupabaseRpc({ body, workspaceId, leadId, leadRow });
  if (rpcResult) {
    return rpcResult;
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
  const caseTitle = asText(body.title) || asText(leadRow.name) || `${asText(clientRow.name) || 'Klient'} - obsługa`;

  const paidFromPayments = await sumLeadPaidPayments(workspaceId, leadId);
  const paidFromLegacy = sumPartialPayments(leadRow.partial_payments || leadRow.partialPayments);
  const paidAmount = paidFromPayments > 0 ? paidFromPayments : paidFromLegacy;
  const expectedRevenue = asNumber(leadRow.value || leadRow.deal_value);

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
    contract_value: expectedRevenue,
    commission_mode: 'none',
    commission_base: 'contract_value',
    commission_rate: 0,
    commission_amount: 0,
    commission_status: 'not_set',
    expected_revenue: expectedRevenue,
    paid_amount: paidAmount,
    remaining_amount: Math.max(0, expectedRevenue - paidAmount),
    currency: normalizeCurrency(leadRow.currency),
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
  await updateLeadWithSchemaFallback(leadId, workspaceId, leadPayload);

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


function getRequestUserIdForLeadGoogle(req: any) {
  const raw =
    req.headers?.['x-user-id']
    || req.headers?.['x-auth-uid']
    || req.headers?.['x-firebase-uid']
    || '';
  return Array.isArray(raw) ? String(raw[0] || '') : String(raw || '').trim();
}

function readLeadGoogleEventId(row: Record<string, unknown>, body: Record<string, unknown>) {
  return asText(
    row.google_calendar_event_id
    || row.googleCalendarEventId
    || body.googleCalendarEventId
    || body.google_calendar_event_id
  );
}

function readLeadNextActionAt(row: Record<string, unknown>, body: Record<string, unknown>) {
  if (body.nextActionAt !== undefined) return toIsoDateTime(body.nextActionAt);
  return toIsoDateTime(row.next_action_at || row.nextActionAt);
}

function buildLeadGoogleCalendarEvent(row: Record<string, unknown>, body: Record<string, unknown>) {
  const startAt = readLeadNextActionAt(row, body) || new Date().toISOString();
  const title = asText(body.nextActionTitle || row.next_action_title || row.nextActionTitle)
    || ('Lead: ' + (asText(row.name || body.name || row.company || body.company) || 'następny krok'));
  const leadName = asText(row.name || body.name || row.company || body.company) || 'Lead';
  const contact = [asText(row.phone || body.phone), asText(row.email || body.email)].filter(Boolean).join(' / ');
  const description = [
    'Źródło: CloseFlow',
    'Typ: lead_next_action',
    'Lead: ' + leadName,
    contact ? 'Kontakt: ' + contact : '',
    asText(row.summary || body.summary) ? 'Temat: ' + asText(row.summary || body.summary) : '',
    asText(row.notes || body.notes) ? 'Notatka: ' + asText(row.notes || body.notes) : '',
  ].filter(Boolean).join('\n');
  return {
    id: String(row.id || body.id || ''),
    title,
    startAt,
    endAt: new Date(new Date(startAt).getTime() + 30 * 60_000).toISOString(),
    reminderAt: null,
    recurrenceRule: null,
    description,
    sourceType: 'lead_next_action',
  };
}

async function writeLeadGoogleCalendarSyncState(leadId: string, workspaceId: string, payload: Record<string, unknown>) {
  if (!leadId) return;
  try {
    await updateLeadWithSchemaFallback(leadId, workspaceId, {
      ...payload,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('LEAD_GOOGLE_CALENDAR_SYNC_STATE_WRITE_FAILED', error instanceof Error ? error.message : String(error));
  }
}

async function syncGoogleCalendarLeadAfterMutation(input: {
  action: 'create' | 'update' | 'delete';
  req: any;
  workspaceId: string;
  row: Record<string, unknown>;
  previousRow?: Record<string, unknown> | null;
  body: Record<string, unknown>;
}) {
  // GOOGLE_CALENDAR_STAGE09B_LEAD_NEXT_ACTION_PARITY
  const leadId = asText(input.row.id || input.body.id);
  if (!input.workspaceId || !leadId) return;

  try {
    await assertWorkspaceFeatureAccess(input.workspaceId, 'googleCalendar');
  } catch {
    await writeLeadGoogleCalendarSyncState(leadId, input.workspaceId, {
      google_calendar_sync_status: 'disabled_by_plan',
      google_calendar_sync_error: 'GOOGLE_CALENDAR_REQUIRES_PRO',
    });
    return;
  }
  const userId = getRequestUserIdForLeadGoogle(input.req);
  const existingGoogleEventId = readLeadGoogleEventId(input.row, input.body) || readLeadGoogleEventId(input.previousRow || {}, input.body);
  const nextActionAt = readLeadNextActionAt(input.row, input.body);

  let connection: any = null;
  try {
    connection = await getGoogleCalendarConnection(input.workspaceId, userId || undefined);
  } catch (error) {
    await writeLeadGoogleCalendarSyncState(leadId, input.workspaceId, {
      google_calendar_sync_status: 'failed',
      google_calendar_sync_error: String(error instanceof Error ? error.message : error).slice(0, 500),
    });
    return;
  }

  if (!connection || connection.sync_enabled === false) {
    await writeLeadGoogleCalendarSyncState(leadId, input.workspaceId, {
      google_calendar_sync_status: 'not_connected',
      google_calendar_sync_error: connection?.sync_enabled === false ? 'GOOGLE_CALENDAR_SYNC_DISABLED' : 'GOOGLE_CALENDAR_CONNECTION_NOT_FOUND',
    });
    return;
  }

  try {
    if (input.action === 'delete' || !nextActionAt) {
      if (existingGoogleEventId) await deleteGoogleCalendarEvent(connection, existingGoogleEventId);
      await writeLeadGoogleCalendarSyncState(leadId, input.workspaceId, {
        google_calendar_event_id: null,
        google_calendar_event_etag: null,
        google_calendar_html_link: null,
        google_calendar_synced_at: new Date().toISOString(),
        google_calendar_sync_status: 'deleted',
        google_calendar_sync_error: null,
      });
      return;
    }

    const event = buildLeadGoogleCalendarEvent(input.row, input.body);
    const googleEvent = existingGoogleEventId
      ? await updateGoogleCalendarEvent(connection, existingGoogleEventId, event)
      : await createGoogleCalendarEvent(connection, event);

    await writeLeadGoogleCalendarSyncState(leadId, input.workspaceId, {
      google_calendar_id: connection.google_calendar_id || 'primary',
      google_calendar_event_id: googleEvent?.id || existingGoogleEventId || null,
      google_calendar_event_etag: googleEvent?.etag || null,
      google_calendar_html_link: googleEvent?.htmlLink || null,
      google_calendar_synced_at: new Date().toISOString(),
      google_calendar_sync_status: 'synced',
      google_calendar_sync_error: null,
    });
  } catch (error) {
    await writeLeadGoogleCalendarSyncState(leadId, input.workspaceId, {
      google_calendar_sync_status: 'failed',
      google_calendar_sync_error: String(error instanceof Error ? error.message : error).slice(0, 500),
    });
  }
}


function isLeadActiveForApiList(lead: Record<string, unknown>) {
  // A24_DEFAULT_ACTIVE_LEADS_FILTER
  // Default list endpoints represent active sales work. Moved leads stay accessible by id/history.
  const status = asText(lead.status).toLowerCase();
  const visibility = asText(lead.leadVisibility || lead.lead_visibility).toLowerCase();
  const outcome = asText(lead.salesOutcome || lead.sales_outcome).toLowerCase();
  const linkedCaseId = asText(lead.linkedCaseId || lead.linked_case_id || lead.caseId || lead.case_id);

  return (
    status !== 'moved_to_service' &&
    status !== 'archived' &&
    visibility !== 'archived' &&
    outcome !== 'moved_to_service' &&
    !linkedCaseId
  );
}


function getLeadDuplicateRecordId(row: Record<string, unknown>) {
  return asText(row.id);
}

function getLeadDuplicateLinkedCaseId(row: Record<string, unknown>) {
  return asText(row.linked_case_id || row.linkedCaseId || row.case_id || row.caseId);
}

function isLeadHiddenOrHistoricalForCreate(row: Record<string, unknown>) {
  const status = asText(row.status).toLowerCase();
  const visibility = asText(row.lead_visibility || row.leadVisibility).toLowerCase();
  const outcome = asText(row.sales_outcome || row.salesOutcome).toLowerCase();
  return (
    status === 'archived' ||
    status === 'moved_to_service' ||
    visibility === 'trash' ||
    visibility === 'archived' ||
    outcome === 'archived' ||
    outcome === 'moved_to_service' ||
    Boolean(getLeadDuplicateLinkedCaseId(row))
  );
}

function isLeadRestorableForCreate(row: Record<string, unknown>) {
  // CLOSEFLOW_LEAD_CREATE_HIDDEN_DUPLICATE_RESTORE_V1
  // Restore only hidden leads that are not tied to an existing case. Leads already in service remain historical evidence.
  return isLeadHiddenOrHistoricalForCreate(row) && !getLeadDuplicateLinkedCaseId(row);
}

function isLeadDuplicateInsertError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /duplicate|unique|23505|already exists|already_added|już istnieje|juz istnieje/i.test(message);
}

function buildLeadDuplicateLookupQueries(workspaceId: string, payload: Record<string, unknown>) {
  const queries: string[] = [];
  const email = asText(payload.email).toLowerCase();
  const phone = asText(payload.phone);
  const name = asText(payload.name || payload.company);

  if (email) {
    queries.push(withWorkspaceFilter('leads?select=*&email=eq.' + encodeURIComponent(email) + '&limit=10', workspaceId));
  }
  if (phone) {
    queries.push(withWorkspaceFilter('leads?select=*&phone=eq.' + encodeURIComponent(phone) + '&limit=10', workspaceId));
  }
  if (name) {
    queries.push(withWorkspaceFilter('leads?select=*&name=ilike.' + encodeURIComponent(name) + '&limit=10', workspaceId));
  }
  return queries;
}

async function findHiddenLeadDuplicateCandidates(workspaceId: string, payload: Record<string, unknown>) {
  const queries = buildLeadDuplicateLookupQueries(workspaceId, payload);
  const byId = new Map<string, Record<string, unknown>>();

  for (const query of queries) {
    const rows = await safeSelectRows(query);
    for (const row of rows) {
      const id = getLeadDuplicateRecordId(row);
      if (id && isLeadHiddenOrHistoricalForCreate(row)) byId.set(id, row);
    }
  }

  return Array.from(byId.values());
}

function buildHiddenLeadRestorePayloadForCreate(payload: Record<string, unknown>) {
  const nextPayload: Record<string, unknown> = {
    name: asText(payload.name) || 'Lead bez nazwy',
    company: asText(payload.company) || null,
    email: asText(payload.email).toLowerCase() || null,
    phone: asText(payload.phone) || null,
    source: asText(payload.source) || 'other',
    value: asNumber(payload.value || payload.deal_value),
    deal_value: asNumber(payload.deal_value || payload.value),
    status: normalizeStatus(payload.status || 'new'),
    summary: asText(payload.summary) || null,
    notes: asText(payload.notes) || null,
    is_at_risk: Boolean(payload.is_at_risk),
    partial_payments: Array.isArray(payload.partial_payments) ? payload.partial_payments : [],
    lead_visibility: 'active',
    sales_outcome: 'open',
    linked_case_id: null,
    client_id: null,
    closed_at: null,
    moved_to_service_at: null,
    case_started_at: null,
    updated_at: new Date().toISOString(),
  };
  return nextPayload;
}

async function restoreHiddenLeadForCreateIfNeeded(workspaceId: string, payload: Record<string, unknown>) {
  const candidates = await findHiddenLeadDuplicateCandidates(workspaceId, payload);
  const restorable = candidates.find(isLeadRestorableForCreate);
  if (!restorable) return null;

  const leadId = getLeadDuplicateRecordId(restorable);
  if (!leadId) return null;

  const restorePayload = buildHiddenLeadRestorePayloadForCreate(payload);
  await updateLeadWithSchemaFallback(leadId, workspaceId, restorePayload);
  const rows = await safeSelectRows(withWorkspaceFilter('leads?select=*&id=eq.' + encodeURIComponent(leadId) + '&limit=1', workspaceId));
  return rows[0] || { ...restorable, ...restorePayload, id: leadId };
}

async function restoreHiddenLeadForCreateAfterDuplicate(workspaceId: string, payload: Record<string, unknown>, error: unknown) {
  if (!isLeadDuplicateInsertError(error)) return null;
  const restored = await restoreHiddenLeadForCreateIfNeeded(workspaceId, payload);
  if (restored) return restored;

  const candidates = await findHiddenLeadDuplicateCandidates(workspaceId, payload);
  if (candidates.length) {
    throw new Error('LEAD_DUPLICATE_IN_HISTORY_OPEN_RECORD');
  }
  return null;
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
  let workspaceId: string | null = null;
  try {
    workspaceId = await resolveRequestWorkspaceId(req);
    if (!workspaceId) {
      res.status(401).json({ error: 'AUTH_WORKSPACE_REQUIRED' });
      return;
    }

    if (req.method === 'GET') {
      const requestedId = asText(req.query?.id);
      const requestedClientId = asNullableUuid(req.query?.clientId);
      const requestedLinkedCaseId = asNullableUuid(req.query?.linkedCaseId || req.query?.caseId);
      const requestedVisibility = asText(req.query?.visibility);
      const requestedStatus = asText(req.query?.status);
      const leadFilters = [
        requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : '',
        requestedClientId ? `client_id=eq.${encodeURIComponent(requestedClientId)}&` : '',
        requestedLinkedCaseId ? `linked_case_id=eq.${encodeURIComponent(requestedLinkedCaseId)}&` : '',
        requestedVisibility ? `lead_visibility=eq.${encodeURIComponent(requestedVisibility)}&` : '',
        requestedStatus ? `status=eq.${encodeURIComponent(normalizeStatus(requestedStatus))}&` : '',
      ].filter(Boolean).join('');
      const leadLimit = requestedId ? 1 : 300;
      const base = withWorkspaceFilter(`leads?select=*&${leadFilters}order=updated_at.desc.nullslast&limit=${leadLimit}`, workspaceId);
      const fallback = withWorkspaceFilter(`leads?select=*&${leadFilters}order=created_at.desc.nullslast&limit=${leadLimit}`, workspaceId);
      const result = await selectFirstAvailable([base, fallback]);
      const normalized = (result.data || []).map((row: Record<string, unknown>) => normalizeLead(row));
      const defaultActiveList = !requestedId && !requestedVisibility && !requestedStatus && !requestedClientId && !requestedLinkedCaseId;
      const visibleLeads = defaultActiveList ? normalized.filter((lead: Record<string, unknown>) => isLeadActiveForApiList(lead)) : normalized;
      if (requestedId) {
        const match = normalized.find((lead: Record<string, unknown>) => String(lead.id) === requestedId);
        if (!match) {
          res.status(404).json({ error: 'LEAD_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }
      res.status(200).json(visibleLeads);
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    if (req.method !== 'GET' && workspaceId) {
      await assertWorkspaceWriteAccess(workspaceId, req);
    }

    if (req.method === 'POST' && asText(body.action) === 'start_service') {
      if (!workspaceId) {
        res.status(400).json({ error: 'LEAD_WORKSPACE_REQUIRED' });
        return;
      }
      const leadId = asText(body.id || body.leadId);
      if (!leadId) {
        res.status(400).json({ error: 'LEAD_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('leads', leadId, workspaceId, 'LEAD_NOT_FOUND');
      const leadRows = await safeSelectRows(withWorkspaceFilter(`leads?select=*&id=eq.${encodeURIComponent(leadId)}&limit=1`, workspaceId));
      const leadRow = leadRows[0];
      if (!leadRow) {
        res.status(404).json({ error: 'LEAD_NOT_FOUND' });
        return;
      }
      const existingCaseId = asText(leadRow.linked_case_id || leadRow.linkedCaseId);
      if (existingCaseId) {
        res.status(409).json({ error: 'LEAD_ALREADY_HAS_CASE' });
        return;
      }
      const rpcResult = await startLeadServiceWithSupabaseRpc({ body, workspaceId, leadId, leadRow });
      const data = rpcResult || await startLeadServiceOperation({ body, workspaceId, leadId, leadRow });
      res.status(200).json(data);
      return;
    }

    if (req.method === 'PATCH') {
      if (!body.id || !workspaceId) {
        res.status(400).json({ error: 'LEAD_ID_REQUIRED' });
        return;
      }
      const currentLeadRow = await requireScopedRow('leads', String(body.id), workspaceId, 'LEAD_NOT_FOUND');

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
      if (body.currency !== undefined) payload.currency = normalizeCurrency(body.currency);
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

      const data = await updateLeadWithSchemaFallback(String(body.id), workspaceId, payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      // GOOGLE_CALENDAR_STAGE09B_LEAD_PATCH_SYNC_CALL
      await syncGoogleCalendarLeadAfterMutation({ action: 'update', req, workspaceId, row: updated as Record<string, unknown>, previousRow: currentLeadRow as Record<string, unknown>, body });
      res.status(200).json(normalizeLead(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'LEAD_ID_REQUIRED' });
        return;
      }
      const currentLeadRow = await requireScopedRow('leads', id, workspaceId, 'LEAD_NOT_FOUND');

      // GOOGLE_CALENDAR_STAGE09B_LEAD_DELETE_SYNC_CALL

      await syncGoogleCalendarLeadAfterMutation({ action: 'delete', req, workspaceId, row: currentLeadRow as Record<string, unknown>, previousRow: currentLeadRow as Record<string, unknown>, body });

      await deleteByIdScoped('leads', id, workspaceId);
      res.status(200).json({ ok: true, id });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const finalWorkspaceId = workspaceId;
    await assertWorkspaceWriteAccess(finalWorkspaceId, req);
    await assertWorkspaceEntityLimit(finalWorkspaceId, 'lead');
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
      currency: normalizeCurrency(body.currency),
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

    await assertWorkspaceEntityLimit(workspaceId, 'lead');

    const restoredHiddenLeadForCreate = await restoreHiddenLeadForCreateIfNeeded(workspaceId, payload);
      if (restoredHiddenLeadForCreate) {
        res.status(200).json(normalizeLead(restoredHiddenLeadForCreate));
        return;
      }

      let result: Awaited<ReturnType<typeof insertLeadWithSchemaFallback>>;
      try {
        result = await insertLeadWithSchemaFallback(payload);
      } catch (error) {
        const restoredAfterDuplicate = await restoreHiddenLeadForCreateAfterDuplicate(workspaceId, payload, error);
        if (restoredAfterDuplicate) {
          res.status(200).json(normalizeLead(restoredAfterDuplicate));
          return;
        }
        throw error;
      }
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    // GOOGLE_CALENDAR_STAGE09B_LEAD_CREATE_SYNC_CALL

    await syncGoogleCalendarLeadAfterMutation({ action: 'create', req, workspaceId: finalWorkspaceId, row: inserted as Record<string, unknown>, body });

    res.status(200).json(normalizeLead(inserted as Record<string, unknown>));
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    if (String(error?.message || error || '').startsWith('WORKSPACE_WRITE_ACCESS_REQUIRED')) {
      res.status(402).json({ error: 'WORKSPACE_WRITE_ACCESS_REQUIRED' });
      return;
    }
    if (error?.message === 'FREE_LIMIT_LEADS_REACHED') {
      res.status(403).json({ error: 'FREE_LIMIT_LEADS_REACHED' });
      return;
    }
    const message = error?.message || 'LEAD_INSERT_FAILED';
    const statusCode = message === 'LEAD_NOT_FOUND' ? 404 : message === 'LEAD_ALREADY_HAS_CASE' ? 409 : 500;
    res.status(statusCode).json({ error: message });
  }
}

/* import { assertWorkspaceWriteAccess } from '../src/server/_access-gate.js'; await assertWorkspaceWriteAccess(workspaceId); await assertWorkspaceWriteAccess(finalWorkspaceId); res.status(402).json({ error: 'WORKSPACE_WRITE_ACCESS_REQUIRED' }); */
