import { createHash } from 'node:crypto';
import { insertWithVariants, isUuid, selectFirstAvailable, updateByIdScoped, updateWhere, withWorkspaceFilter } from './_supabase.js';
import { requireRequestIdentity, requireScopedRow } from './_request-scope.js';
import { RequestAuthError } from './_supabase-auth.js';
import { createPortalToken, upsertPortalTokenForCase } from './_portal-token.js';
import { getAppUrlFromRequest, getMailDiagnostics, sendResendEmail } from './_mail.js';
import { normalizeLeadContract } from '../lib/data-contract.js';

type Row = Record<string, unknown>;

export const LEAD_START_SERVICE_SOURCE = 'frt020_lead_start_service';
const PROVISIONING_CLAIM_TABLE = 'lead_start_service_provisioning_claims';
const PROVISIONING_CLAIM_TTL_MS = 10 * 60 * 1000;
const FIRST_TASK_TITLE = 'Kick-off i zebranie wymagań';
const OPTIONAL_CASE_COLUMNS = new Set([
  'contract_value',
  'expected_revenue',
  'paid_amount',
  'remaining_amount',
  'currency',
  'portal_ready',
  'updated_at',
]);
const OPTIONAL_LEAD_COLUMNS = new Set([
  'next_action_title',
  'next_action_at',
  'next_action_item_id',
  'updated_at',
]);

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asRecord(value: unknown): Row {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Row : {};
}

function hasOwn(row: Row, key: string) {
  return Object.prototype.hasOwnProperty.call(row, key);
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  const normalized = asText(value).toLowerCase();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return fallback;
}

function normalizeCurrency(value: unknown) {
  const normalized = asText(value).toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'PLN';
}

function parseNumber(value: unknown) {
  const normalized = typeof value === 'string' ? value.replace(/\s/g, '').replace(',', '.') : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }
  return '';
}

function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.match(/Could not find the '([^']+)' column/i)?.[1] || null;
}

function removeColumn(payload: Row, column: string) {
  const next = { ...payload };
  delete next[column];
  return next;
}

async function safeSelectRows(query: string | string[]) {
  const queries = Array.isArray(query) ? query.filter(Boolean) : [query];
  if (!queries.length) return [] as Row[];
  try {
    const result = await selectFirstAvailable(queries);
    return Array.isArray(result.data) ? result.data as Row[] : [];
  } catch {
    return [] as Row[];
  }
}

async function selectRowsRequired(query: string | string[]) {
  const queries = Array.isArray(query) ? query.filter(Boolean) : [query];
  if (!queries.length) throw new Error('SUPABASE_SELECT_QUERY_REQUIRED');
  const result = await selectFirstAvailable(queries);
  return Array.isArray(result.data) ? result.data as Row[] : [];
}

async function updateCaseWithSchemaFallback(caseId: string, workspaceId: string, payload: Row) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      return await updateByIdScoped('cases', caseId, workspaceId, current);
    } catch (error) {
      const missing = extractMissingColumn(error);
      if (!missing || !(missing in current) || !OPTIONAL_CASE_COLUMNS.has(missing)) throw error;
      current = removeColumn(current, missing);
    }
  }
  throw new Error('CASE_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

async function updateLeadWithSchemaFallback(leadId: string, workspaceId: string, payload: Row) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      return await updateByIdScoped('leads', leadId, workspaceId, current);
    } catch (error) {
      const missing = extractMissingColumn(error);
      if (!missing || !(missing in current) || !OPTIONAL_LEAD_COLUMNS.has(missing)) throw error;
      current = removeColumn(current, missing);
    }
  }
  throw new Error('LEAD_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

function normalizeTemplateItems(value: unknown) {
  if (!Array.isArray(value)) return [] as Array<{ title: string; description: string; type: string; isRequired: boolean }>;
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const row = asRecord(item);
      return {
        title: asText(row.title || row.name),
        description: asText(row.description),
        type: asText(row.type) || 'file',
        isRequired: row.isRequired !== false && row.is_required !== false,
      };
    })
    .filter((item) => item.title);
}

function parseDateParts(value: string) {
  const ddmmyyyy = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const yyyymmdd = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const day = ddmmyyyy ? Number(ddmmyyyy[1]) : yyyymmdd ? Number(yyyymmdd[3]) : 0;
  const month = ddmmyyyy ? Number(ddmmyyyy[2]) : yyyymmdd ? Number(yyyymmdd[2]) : 0;
  const year = ddmmyyyy ? Number(ddmmyyyy[3]) : yyyymmdd ? Number(yyyymmdd[1]) : 0;
  if (!day || !month || !year) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  const isoDate = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const taskDate = new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000);
  taskDate.setUTCHours(9, 0, 0, 0);
  return { isoDate, taskScheduledAt: taskDate.toISOString() };
}

function parsePlannedDate(value: unknown) {
  const raw = asText(value);
  if (!raw) return null;
  const parts = parseDateParts(raw);
  if (parts) return parts;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  const isoDate = parsed.toISOString().slice(0, 10);
  const taskDate = new Date(parsed.getTime() + 2 * 24 * 60 * 60 * 1000);
  taskDate.setUTCHours(9, 0, 0, 0);
  return { isoDate, taskScheduledAt: taskDate.toISOString() };
}

function isNoChecklist(value: string) {
  return ['bez checklisty', 'brak checklisty', 'none', 'no checklist', 'no checklisty'].includes(value.trim().toLowerCase());
}

function ownerIdentityFromProfile(row: Row) {
  const canonicalUserId = asText(row.user_id);
  if (canonicalUserId) return isUuid(canonicalUserId) ? canonicalUserId : null;

  // Transitional compatibility for installs that have not yet backfilled
  // profiles.user_id. auth_user_id is still an auth.users identity; profiles.id
  // is deliberately never accepted as an owner identity.
  const transitionalUserId = asText(row.auth_user_id);
  return isUuid(transitionalUserId) ? transitionalUserId : null;
}

async function assertOwnerWorkspaceMembership(ownerId: string, workspaceId: string) {
  try {
    const rows = await selectRowsRequired(withWorkspaceFilter(
      `workspace_members?select=user_id&user_id=eq.${encodeURIComponent(ownerId)}&limit=1`,
      workspaceId,
    ));
    if (!rows.some((row) => asText(row.user_id) === ownerId)) {
      throw new RequestAuthError(422, 'CASE_OWNER_NOT_WORKSPACE_MEMBER');
    }
  } catch (error) {
    if (error instanceof RequestAuthError) throw error;
    throw new RequestAuthError(503, 'CASE_OWNER_MEMBERSHIP_LOOKUP_UNAVAILABLE');
  }
}

async function resolveOwnerId(body: Row, workspaceId: string, owner: string) {
  const explicitOwnerId = firstText(body.ownerId, body.owner_id);
  if (explicitOwnerId) {
    if (!isUuid(explicitOwnerId)) throw new RequestAuthError(422, 'CASE_OWNER_ID_INVALID');
    const profileQueries = [
      `profiles?select=user_id,workspace_id&user_id=eq.${encodeURIComponent(explicitOwnerId)}&limit=1`,
      `profiles?select=auth_user_id,workspace_id&auth_user_id=eq.${encodeURIComponent(explicitOwnerId)}&limit=1`,
    ].map((query) => withWorkspaceFilter(query, workspaceId));
    for (const query of profileQueries) {
      try {
        const rows = await selectRowsRequired(query);
        const resolvedOwnerId = ownerIdentityFromProfile(rows[0] || {});
        if (resolvedOwnerId === explicitOwnerId) {
          await assertOwnerWorkspaceMembership(resolvedOwnerId, workspaceId);
          return resolvedOwnerId;
        }
      } catch (error) {
        if (error instanceof RequestAuthError) throw error;
      }
    }
    throw new RequestAuthError(422, 'CASE_OWNER_NOT_FOUND');
  }

  const ownerFilter = encodeURIComponent(owner);
  const queries = [
    `profiles?select=user_id,full_name,email&full_name=eq.${ownerFilter}&limit=1`,
    `profiles?select=user_id,name,email&name=eq.${ownerFilter}&limit=1`,
    `profiles?select=user_id,email&email=eq.${ownerFilter.toLowerCase()}&limit=1`,
    `profiles?select=auth_user_id,full_name,email&full_name=eq.${ownerFilter}&limit=1`,
    `profiles?select=auth_user_id,name,email&name=eq.${ownerFilter}&limit=1`,
    `profiles?select=auth_user_id,email&email=eq.${ownerFilter.toLowerCase()}&limit=1`,
  ].map((query) => withWorkspaceFilter(query, workspaceId));
  for (const query of queries) {
    try {
      const rows = await selectRowsRequired(query);
      const ownerId = ownerIdentityFromProfile(rows[0] || {});
      if (ownerId) {
        await assertOwnerWorkspaceMembership(ownerId, workspaceId);
        return ownerId;
      }
    } catch (error) {
      if (error instanceof RequestAuthError) throw error;
      // Profile schemas differ between the legacy and canonical installs. A
      // missing optional display column must not turn into an unverified ID.
    }
  }
  return null;
}

function buildRequestKey(leadId: string, body: Row, canonicalOwnerId = '') {
  const explicit = firstText(body.idempotencyKey, body.idempotency_key);
  const material = explicit
    ? JSON.stringify({ leadId, explicit, ownerId: canonicalOwnerId || firstText(body.ownerId, body.owner_id) })
    : JSON.stringify({
      leadId,
      title: asText(body.title),
      serviceType: asText(body.serviceType),
      checklistTemplate: asText(body.checklistTemplate),
      owner: canonicalOwnerId || asText(body.owner),
      startDate: asText(body.startDate),
      value: firstText(body.value, body.caseValue, body.contractValue, body.dealValue),
      currency: normalizeCurrency(body.currency),
      clientPortal: asBoolean(body.clientPortal ?? body.portalReady),
      sendClientLink: asBoolean(body.sendClientLink),
      createFirstTask: asBoolean(body.createFirstTask),
    });
  return createHash('sha256').update(material).digest('hex');
}

export function hasLeadStartServiceOptions(body: Row) {
  return [
    'serviceType',
    'checklistTemplate',
    'owner',
    'ownerId',
    'owner_id',
    'sendClientLink',
    'createFirstTask',
    'startDate',
    'idempotencyKey',
    'idempotency_key',
  ].some((field) => hasOwn(body, field));
}

export type LeadStartServicePlan = {
  requestKey: string;
  strict: boolean;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPortal: boolean;
  sendClientLink: boolean;
  createFirstTask: boolean;
  serviceType: string;
  checklistTemplate: string;
  owner: string;
  startDate: string | null;
  taskScheduledAt: string | null;
  value: number;
  valueProvided: boolean;
  currency: string;
  portalReady: boolean;
  portalReadyProvided: boolean;
  actorId: string | null;
  ownerId: string | null;
  templateId: string | null;
  templateName: string | null;
  templateItems: Array<{ title: string; description: string; type: string; isRequired: boolean }>;
};

export async function validateLeadStartServiceRequest(input: {
  request: any;
  body: Row;
  workspaceId: string;
  leadId: string;
  leadRow: Row;
}) : Promise<LeadStartServicePlan> {
  const { request, body, workspaceId, leadId, leadRow } = input;
  const strict = hasLeadStartServiceOptions(body);
  const title = asText(body.title) || asText(leadRow.name) || `${asText(leadRow.company) || 'Klient'} - obsługa`;
  const clientName = firstText(body.clientName, leadRow.name, leadRow.company);
  const clientEmail = firstText(body.clientEmail, leadRow.email).toLowerCase();
  const valueInputProvided = ['value', 'caseValue', 'contractValue', 'dealValue'].some((key) => hasOwn(body, key));
  const valueInput = valueInputProvided
    ? body.value ?? body.caseValue ?? body.contractValue ?? body.dealValue
    : leadRow.value ?? leadRow.deal_value;
  const parsedValue = parseNumber(valueInput);
  const value = parsedValue ?? 0;
  const currency = normalizeCurrency(body.currency ?? leadRow.currency);
  const portalReadyProvided = hasOwn(body, 'portalReady') || hasOwn(body, 'clientPortal');
  const portalReady = hasOwn(body, 'portalReady')
    ? asBoolean(body.portalReady)
    : asBoolean(body.clientPortal, false);
  const clientPortal = strict ? asBoolean(body.clientPortal ?? body.portalReady, false) : false;
  const sendClientLink = strict ? asBoolean(body.sendClientLink, false) : false;
  const createFirstTask = strict ? asBoolean(body.createFirstTask, false) : false;
  const serviceType = asText(body.serviceType);
  const checklistTemplate = asText(body.checklistTemplate);
  const owner = asText(body.owner);

  if (strict) {
    if (!title) throw new RequestAuthError(422, 'CASE_TITLE_REQUIRED');
    if (!clientName) throw new RequestAuthError(422, 'CLIENT_NAME_REQUIRED');
    if (!serviceType) throw new RequestAuthError(422, 'SERVICE_TYPE_REQUIRED');
    if (!checklistTemplate) throw new RequestAuthError(422, 'CHECKLIST_TEMPLATE_REQUIRED');
    if (!owner) throw new RequestAuthError(422, 'CASE_OWNER_REQUIRED');
    if (!valueInputProvided || parsedValue === null) throw new RequestAuthError(422, 'CASE_VALUE_REQUIRED');
    if (!asText(body.startDate) || !parsePlannedDate(body.startDate)) throw new RequestAuthError(422, 'START_DATE_INVALID');
    if (sendClientLink && !clientPortal) throw new RequestAuthError(422, 'CLIENT_LINK_REQUIRES_PORTAL');
    if (sendClientLink && !clientEmail) throw new RequestAuthError(422, 'CLIENT_EMAIL_REQUIRED_FOR_PORTAL_LINK');
    if (sendClientLink && !getMailDiagnostics().hasResendApiKey) {
      throw new RequestAuthError(503, 'CLIENT_PORTAL_EMAIL_NOT_CONFIGURED');
    }
  }

  let actorId: string | null = null;
  if (createFirstTask) {
    const identity = await requireRequestIdentity(request, body);
    actorId = asText(identity.userId || identity.uid);
    if (!isUuid(actorId)) throw new RequestAuthError(422, 'TASK_CREATOR_ID_REQUIRED');
  }

  const ownerId = strict && owner ? await resolveOwnerId(body, workspaceId, owner) : null;
  if (strict && !ownerId) throw new RequestAuthError(422, 'CASE_OWNER_NOT_RESOLVED');

  let templateId: string | null = null;
  let templateName: string | null = null;
  let templateItems: LeadStartServicePlan['templateItems'] = [];
  if (strict && !isNoChecklist(checklistTemplate)) {
    const templateIdInput = firstText(body.checklistTemplateId, body.checklist_template_id);
    const filter = templateIdInput
      ? `id=eq.${encodeURIComponent(templateIdInput)}&`
      : `name=eq.${encodeURIComponent(checklistTemplate)}&`;
    const activeQuery = withWorkspaceFilter(
      `case_templates?select=id,name,items,is_active&${filter}is_active=is.true&limit=1`,
      workspaceId,
    );
    let templateRows: Row[] = [];
    try {
      const result = await selectFirstAvailable([activeQuery]);
      templateRows = Array.isArray(result.data) ? result.data as Row[] : [];
    } catch {
      const legacyQuery = withWorkspaceFilter(
        `case_templates?select=id,name,items&${filter}limit=1`,
        workspaceId,
      );
      templateRows = await safeSelectRows(legacyQuery);
    }
    const template = templateRows[0];
    if (!template) throw new RequestAuthError(422, 'CASE_TEMPLATE_NOT_FOUND');
    templateId = asText(template.id) || null;
    templateName = asText(template.name) || checklistTemplate;
    templateItems = normalizeTemplateItems(template.items);
    if (!templateItems.length) throw new RequestAuthError(422, 'CASE_TEMPLATE_EMPTY');
  }

  const plannedDate = strict ? parsePlannedDate(body.startDate) : null;
  return {
    requestKey: buildRequestKey(leadId, body, ownerId || ''),
    strict,
    title,
    clientName,
    clientEmail,
    clientPortal,
    sendClientLink,
    createFirstTask,
    serviceType,
    checklistTemplate,
    owner,
    startDate: plannedDate?.isoDate || null,
    taskScheduledAt: plannedDate?.taskScheduledAt || null,
    value,
    valueProvided: valueInputProvided,
    currency,
    portalReady,
    portalReadyProvided,
    actorId,
    ownerId,
    templateId,
    templateName,
    templateItems,
  };
}

export async function buildLeadServiceResultFromExisting(input: {
  workspaceId: string;
  leadId: string;
  leadRow: Row;
  caseRow: Row;
}) {
  const { workspaceId, leadId, leadRow, caseRow } = input;
  const caseId = asText(caseRow.id);
  if (!caseId) throw new RequestAuthError(404, 'CASE_NOT_FOUND');
  const clientId = firstText(caseRow.client_id, caseRow.clientId, leadRow.client_id, leadRow.clientId);
  if (!clientId) throw new Error('CLIENT_CREATE_FAILED');
  const clientRows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&id=eq.${encodeURIComponent(clientId)}&limit=1`, workspaceId));
  const clientRow = clientRows[0] || {
    id: clientId,
    name: firstText(caseRow.client_name, leadRow.name, leadRow.company),
    email: firstText(caseRow.client_email, leadRow.email),
    phone: firstText(caseRow.client_phone, leadRow.phone),
  };
  const serviceStartedAt = firstText(
    caseRow.service_started_at,
    caseRow.started_at,
    leadRow.moved_to_service_at,
    leadRow.movedToServiceAt,
    leadRow.case_started_at,
    leadRow.caseStartedAt,
  );
  if (!serviceStartedAt) throw new Error('LEAD_SERVICE_TIMESTAMP_MISSING');
  const title = firstText(caseRow.title, `${asText(clientRow.name) || 'Klient'} - obsługa`);
  const expectedRevenue = parseNumber(caseRow.contract_value ?? caseRow.expected_revenue) ?? 0;
  return {
    reused: true,
    lead: normalizeLeadContract({ ...leadRow, id: leadId }),
    case: {
      ...caseRow,
      id: caseId,
      title,
      status: asText(caseRow.status) || 'in_progress',
      leadId,
      clientId,
      createdFromLead: true,
      serviceStartedAt,
      contractValue: expectedRevenue,
      expectedRevenue,
      currency: normalizeCurrency(caseRow.currency),
      portalReady: asBoolean(caseRow.portal_ready ?? caseRow.portalReady, false),
    },
    client: { ...clientRow, id: clientId },
    caseId,
    clientId,
    movedToServiceAt: serviceStartedAt,
    serviceStartedAt,
  };
}

type ProvisioningClaim = {
  id: string;
  status: 'processing' | 'completed';
  expiresAt: string | null;
};

function isUniqueViolation(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return /23505|duplicate key|unique constraint/i.test(message);
}

function provisioningClaimQuery(workspaceId: string, caseId: string, requestKey: string, id?: string) {
  const filters = id
    ? `id=eq.${encodeURIComponent(id)}&`
    : `case_id=eq.${encodeURIComponent(caseId)}&request_key=eq.${encodeURIComponent(requestKey)}&`;
  return withWorkspaceFilter(
    `${PROVISIONING_CLAIM_TABLE}?select=id,status,expires_at&${filters}limit=1`,
    workspaceId,
  );
}

function readClaimRow(row: Row | null): ProvisioningClaim | null {
  const id = asText(row?.id);
  const status = asText(row?.status);
  if (!id || (status !== 'processing' && status !== 'completed')) return null;
  return {
    id,
    status,
    expiresAt: asText(row?.expires_at) || null,
  };
}

async function readProvisioningClaim(workspaceId: string, caseId: string, requestKey: string) {
  try {
    const rows = await selectRowsRequired(provisioningClaimQuery(workspaceId, caseId, requestKey));
    return readClaimRow(rows[0] || null);
  } catch {
    throw new RequestAuthError(503, 'FRT020_PROVISIONING_IDEMPOTENCY_UNAVAILABLE');
  }
}

async function claimProvisioning(workspaceId: string, leadId: string, caseId: string, requestKey: string) {
  const now = new Date();
  const nowIso = now.toISOString();
  const expiresAt = new Date(now.getTime() + PROVISIONING_CLAIM_TTL_MS).toISOString();
  const payload = {
    workspace_id: workspaceId,
    lead_id: leadId,
    case_id: caseId,
    request_key: requestKey,
    status: 'processing',
    expires_at: expiresAt,
    created_at: nowIso,
    updated_at: nowIso,
  };

  try {
    const inserted = await insertWithVariants([PROVISIONING_CLAIM_TABLE], [payload]);
    const insertedRow = Array.isArray(inserted.data) && inserted.data[0]
      ? readClaimRow(inserted.data[0] as Row)
      : null;
    if (insertedRow) return { state: 'claimed' as const, claim: insertedRow };
    const created = await readProvisioningClaim(workspaceId, caseId, requestKey);
    if (created?.status === 'processing') return { state: 'claimed' as const, claim: created };
    throw new RequestAuthError(503, 'FRT020_PROVISIONING_CLAIM_INVALID');
  } catch (error) {
    if (!isUniqueViolation(error)) {
      if (error instanceof RequestAuthError) throw error;
      throw new RequestAuthError(503, 'FRT020_PROVISIONING_IDEMPOTENCY_UNAVAILABLE');
    }
  }

  const existing = await readProvisioningClaim(workspaceId, caseId, requestKey);
  if (!existing) throw new RequestAuthError(503, 'FRT020_PROVISIONING_CLAIM_MISSING');
  if (existing.status === 'completed') return { state: 'completed' as const, claim: existing };

  const existingExpiry = existing.expiresAt ? Date.parse(existing.expiresAt) : NaN;
  if (!Number.isFinite(existingExpiry) || existingExpiry > now.getTime()) {
    throw new RequestAuthError(409, 'LEAD_SERVICE_PROVISIONING_IN_PROGRESS');
  }

  // A crashed request may leave a lease behind. Take it over only with an
  // exact stale-expiry predicate so two retrying workers cannot both win.
  try {
    const updated = await updateWhere(
      withWorkspaceFilter(
        `${PROVISIONING_CLAIM_TABLE}?id=eq.${encodeURIComponent(existing.id)}&status=eq.processing&expires_at=eq.${encodeURIComponent(existing.expiresAt || '')}`,
        workspaceId,
      ),
      { expires_at: expiresAt, updated_at: nowIso },
    );
    const updatedRow = Array.isArray(updated) && updated[0]
      ? readClaimRow(updated[0] as Row)
      : null;
    if (updatedRow?.status === 'processing') return { state: 'claimed' as const, claim: updatedRow };
  } catch {
    throw new RequestAuthError(503, 'FRT020_PROVISIONING_IDEMPOTENCY_UNAVAILABLE');
  }

  const raced = await readProvisioningClaim(workspaceId, caseId, requestKey);
  if (raced?.status === 'completed') return { state: 'completed' as const, claim: raced };
  if (raced?.status === 'processing' && raced.expiresAt && Date.parse(raced.expiresAt) > Date.now()) {
    throw new RequestAuthError(409, 'LEAD_SERVICE_PROVISIONING_IN_PROGRESS');
  }
  throw new RequestAuthError(503, 'FRT020_PROVISIONING_CLAIM_RACE');
}

async function completeProvisioningClaim(workspaceId: string, claim: ProvisioningClaim) {
  try {
    const updated = await updateByIdScoped(PROVISIONING_CLAIM_TABLE, claim.id, workspaceId, {
      status: 'completed',
      expires_at: new Date(Date.now() + PROVISIONING_CLAIM_TTL_MS).toISOString(),
      updated_at: new Date().toISOString(),
    });
    if (Array.isArray(updated) && updated.length === 0) {
      throw new Error('FRT020_PROVISIONING_CLAIM_NOT_UPDATED');
    }
  } catch {
    throw new RequestAuthError(503, 'FRT020_PROVISIONING_CLAIM_FINALIZE_FAILED');
  }
}

function markerPayload(row: Row | null) {
  const payload = row?.payload;
  if (typeof payload === 'string') {
    try {
      return asRecord(JSON.parse(payload));
    } catch {
      return {};
    }
  }
  return asRecord(payload);
}

async function readProvisionMarker(workspaceId: string, caseId: string, requestKey: string) {
  const rows = await selectRowsRequired(withWorkspaceFilter(
    `activities?select=id,payload&case_id=eq.${encodeURIComponent(caseId)}&event_type=eq.lead_start_service_provisioned&limit=100`,
    workspaceId,
  ));
  const match = rows.find((row) => asText(markerPayload(row).source) === LEAD_START_SERVICE_SOURCE
    && asText(markerPayload(row).requestKey) === requestKey);
  return match || null;
}

function provisioningFromReceipt(receipt: Row, requestKey: string) {
  const warnings = Array.isArray(receipt.warnings)
    ? receipt.warnings.filter((value): value is string => typeof value === 'string')
    : [];
  return {
    source: asText(receipt.source) || LEAD_START_SERVICE_SOURCE,
    requestKey: asText(receipt.requestKey) || requestKey,
    checklist: asRecord(receipt.checklist),
    portal: asRecord(receipt.portal),
    link: asRecord(receipt.link),
    firstTask: asRecord(receipt.firstTask),
    warnings,
  };
}

async function insertChecklistItem(caseId: string, workspaceId: string, item: Row) {
  const nowIso = new Date().toISOString();
  const index = Number(item.index || 0);
  const marker = {
    source: LEAD_START_SERVICE_SOURCE,
    requestKey: asText(item.requestKey),
    templateId: asText(item.templateId) || null,
    templateItemIndex: index,
  };
  const base = {
    workspace_id: workspaceId,
    case_id: caseId,
    title: asText(item.title),
    description: asText(item.description),
    type: asText(item.type) || 'file',
    status: 'missing',
    is_required: item.isRequired !== false,
    sort_order: index,
    payload: marker,
    created_at: nowIso,
    updated_at: nowIso,
  };
  const legacyOrder = { ...base } as Row;
  delete legacyOrder.sort_order;
  legacyOrder.item_order = index;
  return insertWithVariants(['case_items'], [base, legacyOrder]);
}

async function insertFirstTask(input: {
  caseId: string;
  leadId: string;
  workspaceId: string;
  clientId: string;
  actorId: string;
  ownerId: string | null;
  requestKey: string;
  scheduledAt: string;
}) {
  const { caseId, leadId, workspaceId, clientId, actorId, ownerId, requestKey, scheduledAt } = input;
  const exactTaskQuery = withWorkspaceFilter(
    `work_items?select=id,title,scheduled_at,source_key&case_id=eq.${encodeURIComponent(caseId)}&source_type=eq.${encodeURIComponent(LEAD_START_SERVICE_SOURCE)}&source_key=eq.${encodeURIComponent(requestKey)}&limit=1`,
    workspaceId,
  );
  const existingRows = await selectRowsRequired(exactTaskQuery);
  if (existingRows[0]) return { id: asText(existingRows[0].id), status: 'already_exists' as const };
  const nowIso = new Date().toISOString();
  const payload = {
    workspace_id: workspaceId,
    created_by_user_id: actorId,
    owner_id: ownerId,
    assigned_to: ownerId,
    lead_id: leadId,
    case_id: caseId,
    record_type: 'task',
    type: 'task',
    title: FIRST_TASK_TITLE,
    description: 'Pierwszy krok po rozpoczęciu obsługi sprawy.',
    status: 'todo',
    priority: 'medium',
    scheduled_at: scheduledAt,
    start_at: null,
    end_at: null,
    recurrence: 'none',
    reminder: 'none',
    show_in_tasks: true,
    show_in_calendar: true,
    client_id: clientId,
    source_type: LEAD_START_SERVICE_SOURCE,
    source_key: requestKey,
    lead_name: null,
    case_title: null,
    created_at: nowIso,
    updated_at: nowIso,
  };
  let inserted;
  try {
    inserted = await insertWithVariants(['work_items'], [payload]);
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    const racedRows = await selectRowsRequired(exactTaskQuery);
    if (racedRows[0]) return { id: asText(racedRows[0].id), status: 'already_exists' as const };
    throw error;
  }
  const row: Row = Array.isArray(inserted.data) && inserted.data[0] ? inserted.data[0] as Row : payload;
  const taskId = asText(row.id);
  if (!taskId) throw new Error('FIRST_TASK_CREATE_FAILED');
  await updateLeadWithSchemaFallback(leadId, workspaceId, {
    next_action_title: FIRST_TASK_TITLE,
    next_action_at: scheduledAt,
    next_action_item_id: taskId,
    updated_at: nowIso,
  });
  void clientId;
  return { id: taskId, status: 'created' as const };
}

export async function provisionLeadStartService(input: {
  request: any;
  body: Row;
  workspaceId: string;
  leadId: string;
  leadRow: Row;
  result: Row;
  plan: LeadStartServicePlan;
}) {
  const { request, workspaceId, leadId, leadRow, result, plan } = input;
  const resultCase = asRecord(result.case);
  const caseId = firstText(result.caseId, resultCase.id);
  const resultClient = asRecord(result.client);
  const clientId = firstText(result.clientId, resultCase.clientId, resultCase.client_id, resultClient.id);
  if (!caseId) throw new Error('CASE_CREATE_FAILED');
  if (!clientId) throw new Error('CLIENT_CREATE_FAILED');
  const caseRow = await requireScopedRow('cases', caseId, workspaceId, 'CASE_NOT_FOUND');
  const claimResult = await claimProvisioning(workspaceId, leadId, caseId, plan.requestKey);
  const marker = await readProvisionMarker(workspaceId, caseId, plan.requestKey);
  const previous = markerPayload(marker);
  if (claimResult.state === 'completed') {
    if (!marker) throw new RequestAuthError(503, 'FRT020_PROVISIONING_RECEIPT_MISSING');
    if (plan.strict && asText(previous.ownerId) !== plan.ownerId) {
      throw new RequestAuthError(503, 'FRT020_PROVISIONING_OWNER_RECEIPT_MISSING');
    }
    return {
      ...result,
      reused: Boolean(result.reused),
      provisioning: provisioningFromReceipt(previous, plan.requestKey),
    };
  }
  const warnings: string[] = [];
  const existingPaid = parseNumber(caseRow.paid_amount) ?? 0;

  if (plan.strict && plan.ownerId) {
    try {
      await updateByIdScoped('cases', caseId, workspaceId, {
        owner_id: plan.ownerId,
        updated_at: new Date().toISOString(),
      });
    } catch {
      throw new RequestAuthError(503, 'CASE_OWNER_PERSIST_FAILED');
    }
  }

  if (plan.valueProvided || plan.portalReadyProvided) {
    const casePatch: Row = { updated_at: new Date().toISOString() };
    if (plan.valueProvided) {
      casePatch.contract_value = plan.value;
      casePatch.expected_revenue = plan.value;
      casePatch.remaining_amount = Math.max(0, plan.value - existingPaid);
      casePatch.currency = plan.currency;
    }
    if (plan.portalReadyProvided) casePatch.portal_ready = plan.portalReady;
    try {
      await updateCaseWithSchemaFallback(caseId, workspaceId, casePatch);
    } catch {
      warnings.push('CASE_FIELDS_PERSIST_FAILED');
    }
  }

  const previousChecklist = asRecord(previous.checklist);
  const checklist = {
    requested: Boolean(plan.templateId),
    status: 'skipped' as string,
    createdCount: 0,
    totalCount: plan.templateItems.length,
  };
  if (plan.templateId) {
    const existingItems = await selectRowsRequired([
      withWorkspaceFilter(`case_items?select=id,title,payload&case_id=eq.${encodeURIComponent(caseId)}&limit=500`, workspaceId),
      withWorkspaceFilter(`case_items?select=id,title&case_id=eq.${encodeURIComponent(caseId)}&limit=500`, workspaceId),
    ]);
    const existingMarkers = existingItems
      .map((item) => markerPayload(item))
      .filter((item) => asText(item.source) === LEAD_START_SERVICE_SOURCE && asText(item.requestKey) === plan.requestKey);
    let failedCount = 0;
    for (let index = 0; index < plan.templateItems.length; index += 1) {
      if (existingMarkers.some((item) => Number(item.templateItemIndex) === index)) continue;
      const item = plan.templateItems[index];
      try {
        await insertChecklistItem(caseId, workspaceId, {
          ...item,
          index,
          requestKey: plan.requestKey,
          templateId: plan.templateId,
        });
        checklist.createdCount += 1;
      } catch {
        failedCount += 1;
        warnings.push(`CHECKLIST_ITEM_CREATE_FAILED_${index + 1}`);
      }
    }
    const complete = checklist.createdCount + existingMarkers.length >= plan.templateItems.length;
    checklist.status = failedCount > 0
      ? (complete ? 'partial_failed' : checklist.createdCount > 0 ? 'partial_failed' : 'failed')
      : (existingMarkers.length > 0 && checklist.createdCount === 0 ? 'already_exists' : 'created');
    if (previousChecklist.status === 'created' && complete && checklist.createdCount === 0) checklist.status = 'already_exists';
  }

  const previousPortal = asRecord(previous.portal);
  const previousLink = asRecord(previous.link);
  const portal = { requested: plan.clientPortal, status: 'skipped' as string };
  const link = { requested: plan.sendClientLink, status: 'not_requested' as string };
  if (plan.clientPortal) {
    const canReusePriorPortal = ['created', 'already_exists'].includes(asText(previousPortal.status))
      && (!plan.sendClientLink || asText(previousLink.status) === 'sent');
    if (canReusePriorPortal) {
      portal.status = 'already_exists';
      if (plan.sendClientLink) link.status = 'already_sent';
    } else {
      const plaintextToken = createPortalToken();
      try {
        await upsertPortalTokenForCase(caseId, plaintextToken, null, workspaceId);
        portal.status = 'created';
        if (plan.sendClientLink) {
          const portalUrl = `${getAppUrlFromRequest(request)}/portal/${caseId}/${plaintextToken}`;
          const emailResult = await sendResendEmail({
            to: plan.clientEmail,
            subject: `Dostęp do portalu klienta — ${firstText(resultCase.title, plan.title)}`,
            plain: `Otwórz portal klienta: ${portalUrl}`,
            html: `<p>Otwórz portal klienta:</p><p><a href="${portalUrl}">${portalUrl}</a></p>`,
          });
          if (emailResult.ok) {
            link.status = 'sent';
          } else {
            link.status = 'failed';
            warnings.push('CLIENT_PORTAL_LINK_SEND_FAILED');
          }
        }
      } catch {
        portal.status = 'failed';
        warnings.push('CLIENT_PORTAL_TOKEN_CREATE_FAILED');
        if (plan.sendClientLink) link.status = 'failed';
      }
    }
  }

  const previousTask = asRecord(previous.firstTask);
  const firstTask = {
    requested: plan.createFirstTask,
    status: 'skipped' as string,
    taskId: null as string | null,
    assignedTo: plan.ownerId,
    assignmentStatus: plan.createFirstTask
      ? (plan.ownerId ? 'assigned' : 'created_without_selected_owner')
      : 'not_requested',
  };
  if (plan.createFirstTask && !plan.ownerId) warnings.push('FIRST_TASK_OWNER_NOT_RESOLVED');
  if (plan.createFirstTask && plan.actorId && plan.taskScheduledAt) {
    if (['created', 'already_exists'].includes(asText(previousTask.status)) && asText(previousTask.taskId)) {
      firstTask.status = 'already_exists';
      firstTask.taskId = asText(previousTask.taskId);
    } else {
      try {
        const createdTask = await insertFirstTask({
          caseId,
          leadId,
          workspaceId,
          clientId,
          actorId: plan.actorId,
          ownerId: plan.ownerId,
          requestKey: plan.requestKey,
          scheduledAt: plan.taskScheduledAt,
        });
        firstTask.status = createdTask.status;
        firstTask.taskId = createdTask.id || null;
      } catch {
        firstTask.status = 'failed';
        warnings.push('FIRST_TASK_CREATE_FAILED');
      }
    }
  }

  const receipt = {
    source: LEAD_START_SERVICE_SOURCE,
    requestKey: plan.requestKey,
    serviceType: plan.serviceType || null,
    checklistTemplate: plan.templateName || plan.checklistTemplate || null,
    owner: plan.owner || null,
    ownerId: plan.ownerId,
    startDate: plan.startDate,
    currency: plan.currency,
    value: plan.value,
    clientPortal: plan.clientPortal,
    sendClientLink: plan.sendClientLink,
    createFirstTask: plan.createFirstTask,
    checklist,
    portal,
    link,
    firstTask,
    warnings,
  };
  try {
    if (marker) {
      const markerId = asText(marker.id);
      if (!markerId) throw new Error('PROVISIONING_RECEIPT_ID_MISSING');
      await updateByIdScoped('activities', markerId, workspaceId, {
        payload: receipt,
        updated_at: new Date().toISOString(),
      });
    } else {
      await insertWithVariants(['activities'], [{
        workspace_id: workspaceId,
        lead_id: leadId,
        case_id: caseId,
        owner_id: null,
        actor_id: plan.actorId,
        actor_type: 'operator',
        event_type: 'lead_start_service_provisioned',
        payload: receipt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
    }
  } catch {
    throw new RequestAuthError(503, 'PROVISIONING_RECEIPT_WRITE_FAILED');
  }
  await completeProvisioningClaim(workspaceId, claimResult.claim);

  return {
    ...result,
    reused: Boolean(result.reused),
    provisioning: {
      source: LEAD_START_SERVICE_SOURCE,
      requestKey: plan.requestKey,
      checklist,
      portal,
      link,
      firstTask,
      warnings,
    },
  };
}
