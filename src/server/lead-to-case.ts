import { buildLeadMovedToServicePayload } from './_lead-service.js';
import { insertWithVariants, isUuid, selectFirstAvailable, updateById, withWorkspaceFilter } from './_supabase.js';
import { normalizeLeadContract } from '../lib/data-contract.js';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableUuid(value: unknown) {
  const normalized = asText(value);
  return normalized && isUuid(normalized) ? normalized : null;
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
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

function normalizeCurrency(value: unknown) {
  const normalized = asText(value).toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'PLN';
}

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = asText(value);
  return allowed.has(normalized) ? normalized : fallback;
}

function sumPartialPayments(value: unknown) {
  if (!Array.isArray(value)) return 0;
  return value.reduce((acc, row) => {
    if (!row || typeof row !== 'object') return acc;
    const amount = Number((row as Record<string, unknown>).amount || 0);
    return Number.isFinite(amount) && amount > 0 ? acc + amount : acc;
  }, 0);
}

async function safeSelectRows(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return Array.isArray(result.data) ? (result.data as Record<string, unknown>[]) : [];
  } catch {
    return [];
  }
}

const PAID_PAYMENT_STATUSES = new Set(['deposit_paid', 'partially_paid', 'fully_paid', 'paid']);
const BILLING_STATUSES = new Set(['not_applicable', 'not_started', 'awaiting_payment', 'deposit_paid', 'partially_paid', 'fully_paid', 'commission_pending', 'commission_due', 'paid', 'refunded', 'written_off']);
const BILLING_MODELS = new Set(['upfront_full', 'deposit_then_rest', 'after_completion', 'success_fee', 'recurring', 'manual']);
const CASE_STATUSES = new Set(['new', 'waiting_on_client', 'blocked', 'to_approve', 'ready_to_start', 'in_progress', 'on_hold', 'completed', 'canceled']);

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

const OPTIONAL_CASE_COLUMNS = new Set(['service_profile_id', 'billing_status', 'billing_model_snapshot', 'started_at', 'completed_at', 'last_activity_at', 'created_from_lead', 'service_started_at', 'expected_revenue', 'paid_amount', 'remaining_amount', 'currency']);
const OPTIONAL_ACTIVITY_COLUMNS = new Set(['owner_id', 'actor_id', 'actor_type', 'event_type', 'payload', 'lead_id', 'case_id', 'workspace_id', 'created_at', 'updated_at']);
const OPTIONAL_LEAD_COLUMNS = new Set(['linked_case_id', 'client_id', 'moved_to_service_at', 'lead_visibility', 'sales_outcome', 'case_started_at', 'next_action_title', 'next_action_at', 'next_action_item_id', 'updated_at']);

function shouldDrop(table: 'leads' | 'cases' | 'activities', column: string | null, payload: Record<string, unknown>) {
  if (!column || !(column in payload)) return false;
  if (table === 'leads') return OPTIONAL_LEAD_COLUMNS.has(column);
  if (table === 'cases') return OPTIONAL_CASE_COLUMNS.has(column);
  return OPTIONAL_ACTIVITY_COLUMNS.has(column);
}

async function updateLeadWithSchemaFallback(id: string, payload: Record<string, unknown>) {
  let currentPayload = { ...payload };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await updateById('leads', id, currentPayload);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!shouldDrop('leads', missingColumn, currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn as string);
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
      if (!shouldDrop('cases', missingColumn, currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn as string);
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
      if (!shouldDrop('activities', missingColumn, currentPayload)) throw error;
      currentPayload = omitMissingColumn(currentPayload, missingColumn as string);
    }
  }
  throw new Error('ACTIVITY_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
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
  return Array.isArray(result.data) && result.data[0] ? (result.data[0] as Record<string, unknown>) : payload;
}

export async function startLeadServiceOperation(input: {
  body: Record<string, unknown>;
  workspaceId: string;
  leadId: string;
  leadRow: Record<string, unknown>;
}) {
  const { body, workspaceId, leadId, leadRow } = input;
  const nowIso = new Date().toISOString();
  const leadContext: Record<string, unknown> = {
    ...leadRow,
    name: asText(body.clientName) || asText(leadRow.name),
    email: asText(body.clientEmail) || asText(leadRow.email),
    phone: asText(body.clientPhone) || asText(leadRow.phone),
  };
  const clientRow = await ensureClientForLead(workspaceId, leadContext);
  const clientId = asNullableUuid(clientRow.id);
  const caseStatus = normalizeEnum(body.caseStatus || body.status, CASE_STATUSES, 'in_progress');
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
    ? (createdCaseResult.data[0] as Record<string, unknown>)
    : casePayload;
  const caseId = asText(createdCase.id);
  if (!caseId) throw new Error('CASE_CREATE_FAILED');

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
    lead: normalizeLeadContract((refreshedLeadRows[0] || { ...leadRow, ...leadPayload, id: leadId }) as Record<string, unknown>),
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
    caseId,
    movedToServiceAt: nowIso,
  };
}
