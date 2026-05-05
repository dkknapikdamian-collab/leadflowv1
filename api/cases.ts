import { deleteById, insertWithVariants, isUuid, selectFirstAvailable, supabaseRequest, updateById } from '../src/server/_supabase.js';
import { requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';
import { buildLeadMovedToServicePayload } from '../src/server/_lead-service.js';
import { normalizeCaseContract } from '../src/lib/data-contract.js';
import { CASE_STATUS_VALUES, normalizeCaseStatus } from '../src/lib/domain-statuses.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';
import { readPortalSession, requirePortalSessionContext } from '../src/server/_portal-token.js';
import { assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';

const CASE_STATUSES = new Set<string>(CASE_STATUS_VALUES);
const BILLING_STATUSES = new Set(['not_applicable', 'not_started', 'awaiting_payment', 'deposit_paid', 'partially_paid', 'fully_paid', 'commission_pending', 'commission_due', 'paid', 'refunded', 'written_off']);
const BILLING_MODELS = new Set(['upfront_full', 'deposit_then_rest', 'after_completion', 'success_fee', 'recurring', 'manual']);
const OPTIONAL_CASE_COLUMNS = new Set(['service_profile_id', 'billing_status', 'billing_model_snapshot', 'started_at', 'completed_at', 'last_activity_at', 'created_from_lead', 'service_started_at', 'expected_revenue', 'paid_amount', 'remaining_amount', 'currency']);

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableUuid(value: unknown) {
  const trimmed = asText(value);
  return trimmed && isUuid(trimmed) ? trimmed : null;
}

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = asText(value);
  return allowed.has(normalized) ? normalized : fallback;
}

function toIso(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
}

function normalizeCurrency(value: unknown) {
  const normalized = asText(value).toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'PLN';
}

function isMissingCasesTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.cases'");
}

function normalizeCase(row: Record<string, unknown>) {
  return normalizeCaseContract(row);
}

function extractMissingColumn(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  const match = message.match(/Could not find the '([^']+)' column/i);
  return match?.[1] || null;
}

function omitMissingColumn(payload: Record<string, unknown>, column: string) {
  const next = { ...payload };
  delete next[column];
  return next;
}

async function updateCaseWithSchemaFallback(id: string, payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await updateById('cases', id, current);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_CASE_COLUMNS.has(missingColumn) || !(missingColumn in current)) throw error;
      current = omitMissingColumn(current, missingColumn);
    }
  }
  throw new Error('CASE_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

async function insertCaseWithSchemaFallback(payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await insertWithVariants(['cases'], [current]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_CASE_COLUMNS.has(missingColumn) || !(missingColumn in current)) throw error;
      current = omitMissingColumn(current, missingColumn);
    }
  }
  throw new Error('CASE_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function bestEffortPatch(path: string, payload: Record<string, unknown>) {
  try {
    await supabaseRequest(path, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  } catch {
    // best effort only
  }
}

async function bestEffortDelete(path: string) {
  try {
    await supabaseRequest(path, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    });
  } catch {
    // best effort only
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

async function findExistingClient(workspaceId: string, input: { clientId?: unknown; clientEmail?: unknown; clientPhone?: unknown; clientName?: unknown }) {
  const explicitClientId = asNullableUuid(input.clientId);
  if (explicitClientId) {
    const rows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&id=eq.${encodeURIComponent(explicitClientId)}&limit=1`, workspaceId));
    if (rows[0]) return rows[0];
  }

  const email = asText(input.clientEmail).toLowerCase();
  if (email) {
    const rows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&email=eq.${encodeURIComponent(email)}&limit=1`, workspaceId));
    if (rows[0]) return rows[0];
  }

  const phone = asText(input.clientPhone);
  if (phone) {
    const rows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&phone=eq.${encodeURIComponent(phone)}&limit=1`, workspaceId));
    if (rows[0]) return rows[0];
  }

  const name = asText(input.clientName);
  if (name) {
    const rows = await safeSelectRows(withWorkspaceFilter(`clients?select=*&name=ilike.${encodeURIComponent(name)}&limit=1`, workspaceId));
    if (rows[0]) return rows[0];
  }

  return null;
}

async function ensureClientForCase(workspaceId: string, input: { clientId?: unknown; clientName?: unknown; clientEmail?: unknown; clientPhone?: unknown }) {
  const existingClient = await findExistingClient(workspaceId, input);
  if (existingClient) return existingClient;

  const name = asText(input.clientName);
  const email = asText(input.clientEmail).toLowerCase();
  const phone = asText(input.clientPhone);
  if (!name && !email && !phone) return null;

  const nowIso = new Date().toISOString();
  const result = await insertWithVariants(['clients'], [{
    workspace_id: workspaceId,
    name: name || email || phone || 'Klient',
    company: null,
    email: email || null,
    phone: phone || null,
    source_primary: 'other',
    created_at: nowIso,
    updated_at: nowIso,
    last_activity_at: nowIso,
  }]);
  return Array.isArray(result.data) && result.data[0] ? result.data[0] as Record<string, unknown> : null;
}

export default async function handler(req: any, res: any) {
  let workspaceId: string | null = null;
  try {
    const portalSession = readPortalSession(req);
    const portalCaseId = asText(req.query?.id || req.query?.caseId);
    const portalMode = req.method === 'GET' && Boolean(portalSession) && Boolean(portalCaseId);
    if (portalMode) {
      const ctx = await requirePortalSessionContext(portalCaseId, portalSession);
      const normalized = normalizeCase(ctx.caseRow as Record<string, unknown>);
      res.status(200).json(normalized);
      return;
    }

    workspaceId = await resolveRequestWorkspaceId(req);
    if (!workspaceId) {
      res.status(401).json({ error: 'AUTH_WORKSPACE_REQUIRED' });
      return;
    }

    if (req.method === 'GET') {
      const requestedId = asText(req.query?.id);
      const requestedClientId = asNullableUuid(req.query?.clientId);
      const requestedLeadId = asNullableUuid(req.query?.leadId);
      const requestedStatus = asText(req.query?.status);
      const caseFilters = [
        requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : '',
        requestedClientId ? `client_id=eq.${encodeURIComponent(requestedClientId)}&` : '',
        requestedLeadId ? `lead_id=eq.${encodeURIComponent(requestedLeadId)}&` : '',
        requestedStatus ? `status=eq.${encodeURIComponent(normalizeCaseStatus(requestedStatus, 'in_progress'))}&` : '',
      ].filter(Boolean).join('');
      const caseLimit = requestedId ? 1 : 250;
      let rows: Record<string, unknown>[] = [];
      try {
        const result = await selectFirstAvailable([
          withWorkspaceFilter(`cases?select=*&${caseFilters}order=updated_at.desc.nullslast&limit=${caseLimit}`, workspaceId),
          withWorkspaceFilter(`cases?select=*&${caseFilters}order=created_at.desc.nullslast&limit=${caseLimit}`, workspaceId),
        ]);
        rows = result.data as Record<string, unknown>[];
      } catch (error) {
        if (!isMissingCasesTableError(error)) throw error;
        rows = [];
      }
      const normalized = rows.map(normalizeCase);

      if (requestedId) {
        const match = normalized.find((item) => item.id === requestedId);
        if (!match) {
          res.status(404).json({ error: 'CASE_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }

      res.status(200).json(normalized);
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // P0_SERVICE_ROLE_SCOPE_MUTATION_GATE
    if (req.method !== 'GET') {
      await assertWorkspaceWriteAccess(workspaceId, req);
    }

    if (req.method === 'POST') {
      const finalWorkspaceId = workspaceId;
      if (!finalWorkspaceId) {
        throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
      }

      const nowIso = new Date().toISOString();
      const normalizedLeadId = asNullableUuid(body.leadId);
      const normalizedStatus = normalizeCaseStatus(body.status, 'in_progress');
      const linkedLeadRows = normalizedLeadId
        ? await safeSelectRows(withWorkspaceFilter(`leads?select=*&id=eq.${encodeURIComponent(normalizedLeadId)}&limit=1`, finalWorkspaceId))
        : [];
      const linkedLead = linkedLeadRows[0] || null;
      // P0_SERVICE_ROLE_SCOPE_RELATION_GUARD
      if (normalizedLeadId && !linkedLead) {
        throw new Error('LEAD_NOT_FOUND');
      }
      const existingLeadCaseId = normalizedLeadId ? asText(linkedLead?.linked_case_id || linkedLead?.linkedCaseId) : '';
      if (normalizedLeadId && existingLeadCaseId) {
        throw new Error('LEAD_ALREADY_HAS_CASE');
      }
      const ensuredClient = await ensureClientForCase(finalWorkspaceId, {
        clientId: body.clientId ?? linkedLead?.client_id ?? linkedLead?.clientId,
        clientName: body.clientName ?? linkedLead?.name ?? linkedLead?.company,
        clientEmail: body.clientEmail ?? linkedLead?.email,
        clientPhone: body.clientPhone ?? linkedLead?.phone,
      });
      if (body.clientId && !ensuredClient) {
        throw new Error('CLIENT_NOT_FOUND');
      }
      const normalizedClientId = asNullableUuid(ensuredClient?.id || body.clientId || linkedLead?.client_id || linkedLead?.clientId);

      const payload: Record<string, unknown> = {
        workspace_id: finalWorkspaceId,
        lead_id: normalizedLeadId,
        client_id: normalizedClientId,
        service_profile_id: asNullableUuid(body.serviceProfileId),
        title: asText(body.title) || 'Nowa sprawa',
        client_name: asText(body.clientName || ensuredClient?.name || linkedLead?.name),
        client_email: asText(body.clientEmail || ensuredClient?.email || linkedLead?.email),
        client_phone: asText(body.clientPhone || ensuredClient?.phone || linkedLead?.phone),
        status: normalizedStatus,
        billing_status: normalizeEnum(body.billingStatus, BILLING_STATUSES, 'not_started'),
        billing_model_snapshot: normalizeEnum(body.billingModelSnapshot, BILLING_MODELS, 'manual'),
        expected_revenue: asNumber(body.expectedRevenue ?? body.dealValue ?? linkedLead?.value ?? linkedLead?.deal_value),
        paid_amount: asNumber(body.paidAmount),
        remaining_amount: asNumber(body.remainingAmount ?? (asNumber(body.expectedRevenue ?? body.dealValue ?? linkedLead?.value ?? linkedLead?.deal_value) - asNumber(body.paidAmount))),
        currency: normalizeCurrency(body.currency ?? linkedLead?.currency),
        completeness_percent: Number(body.completenessPercent || 0),
        portal_ready: Boolean(body.portalReady || false),
        created_from_lead: normalizedLeadId ? true : Boolean(body.createdFromLead),
        service_started_at: toIso(body.serviceStartedAt) || (normalizedLeadId ? nowIso : null),
        started_at: toIso(body.startedAt) || (normalizedStatus === 'in_progress' ? nowIso : null),
        completed_at: toIso(body.completedAt) || (normalizedStatus === 'completed' ? nowIso : null),
        last_activity_at: toIso(body.lastActivityAt) || nowIso,
        created_at: nowIso,
        updated_at: nowIso,
      };

      const result = await insertCaseWithSchemaFallback(payload);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      const insertedId = String((inserted as Record<string, unknown>).id || '');

      if (insertedId) {
        await bestEffortPatch(withWorkspaceFilter(`leads?linked_case_id=eq.${encodeURIComponent(insertedId)}`, finalWorkspaceId), {
          linked_case_id: null,
          updated_at: nowIso,
        });
        if (normalizedLeadId) {
          await bestEffortPatch(
            withWorkspaceFilter(`leads?id=eq.${encodeURIComponent(normalizedLeadId)}`, finalWorkspaceId),
            buildLeadMovedToServicePayload({
              caseId: insertedId,
              clientId: normalizedClientId,
              occurredAt: nowIso,
              updatedAt: nowIso,
            }),
          );
        }
      }

      res.status(200).json(normalizeCase(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      if (!body.id || !workspaceId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('cases', String(body.id), workspaceId, 'CASE_NOT_FOUND');

      const nowIso = new Date().toISOString();
      const normalizedLeadId = body.leadId !== undefined ? asNullableUuid(body.leadId) : undefined;
      const linkedLeadRows = normalizedLeadId
        ? await safeSelectRows(withWorkspaceFilter(`leads?select=*&id=eq.${encodeURIComponent(normalizedLeadId)}&limit=1`, workspaceId))
        : [];
      const linkedLead = linkedLeadRows[0] || null;
      if (normalizedLeadId && !linkedLead) {
        throw new Error('LEAD_NOT_FOUND');
      }
      const ensuredClient = (body.clientId !== undefined || body.clientName !== undefined || body.clientEmail !== undefined || body.clientPhone !== undefined || normalizedLeadId)
        ? await ensureClientForCase(workspaceId, {
            clientId: body.clientId ?? linkedLead?.client_id ?? linkedLead?.clientId,
            clientName: body.clientName ?? linkedLead?.name ?? linkedLead?.company,
            clientEmail: body.clientEmail ?? linkedLead?.email,
            clientPhone: body.clientPhone ?? linkedLead?.phone,
          })
        : null;
      const normalizedClientId = body.clientId !== undefined || ensuredClient
        ? asNullableUuid(ensuredClient?.id || body.clientId || linkedLead?.client_id || linkedLead?.clientId)
        : undefined;
      const nextStatus = body.status !== undefined ? normalizeCaseStatus(body.status, 'in_progress') : undefined;
      const payload: Record<string, unknown> = {
        updated_at: nowIso,
      };

      if (body.title !== undefined) payload.title = asText(body.title) || 'Sprawa bez tytułu';
      if (body.clientName !== undefined || ensuredClient) payload.client_name = asText(body.clientName || ensuredClient?.name || linkedLead?.name);
      if (body.clientEmail !== undefined || ensuredClient) payload.client_email = asText(body.clientEmail || ensuredClient?.email || linkedLead?.email);
      if (body.clientPhone !== undefined || ensuredClient) payload.client_phone = asText(body.clientPhone || ensuredClient?.phone || linkedLead?.phone);
      if (body.clientId !== undefined) payload.client_id = normalizedClientId;
      if (nextStatus !== undefined) payload.status = nextStatus;
      if (body.completenessPercent !== undefined) payload.completeness_percent = Number(body.completenessPercent || 0);
      if (body.leadId !== undefined) payload.lead_id = normalizedLeadId;
      if (body.portalReady !== undefined) payload.portal_ready = Boolean(body.portalReady);
      if (body.createdFromLead !== undefined) payload.created_from_lead = Boolean(body.createdFromLead);
      if (body.serviceProfileId !== undefined) payload.service_profile_id = asNullableUuid(body.serviceProfileId);
      if (body.billingStatus !== undefined) payload.billing_status = normalizeEnum(body.billingStatus, BILLING_STATUSES, 'not_started');
      if (body.billingModelSnapshot !== undefined) payload.billing_model_snapshot = normalizeEnum(body.billingModelSnapshot, BILLING_MODELS, 'manual');
      if (body.expectedRevenue !== undefined || body.dealValue !== undefined) payload.expected_revenue = asNumber(body.expectedRevenue ?? body.dealValue);
      if (body.paidAmount !== undefined) payload.paid_amount = asNumber(body.paidAmount);
      if (body.remainingAmount !== undefined) payload.remaining_amount = asNumber(body.remainingAmount);
      if (body.currency !== undefined) payload.currency = normalizeCurrency(body.currency);
      if (body.serviceStartedAt !== undefined) payload.service_started_at = toIso(body.serviceStartedAt);
      if (body.startedAt !== undefined) payload.started_at = toIso(body.startedAt);
      if (body.completedAt !== undefined) payload.completed_at = toIso(body.completedAt);
      if (body.lastActivityAt !== undefined) payload.last_activity_at = toIso(body.lastActivityAt);
      if (nextStatus === 'in_progress' && body.startedAt === undefined) payload.started_at = nowIso;
      if (nextStatus === 'completed' && body.completedAt === undefined) payload.completed_at = nowIso;

      const data = await updateCaseWithSchemaFallback(String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };

      await bestEffortPatch(withWorkspaceFilter(`leads?linked_case_id=eq.${encodeURIComponent(String(body.id))}`, workspaceId), {
        linked_case_id: null,
        updated_at: nowIso,
      });

      if (normalizedLeadId) {
        await bestEffortPatch(
          withWorkspaceFilter(`leads?id=eq.${encodeURIComponent(normalizedLeadId)}`, workspaceId),
          buildLeadMovedToServicePayload({
            caseId: String(body.id),
            clientId: normalizedClientId,
            occurredAt: nowIso,
            updatedAt: nowIso,
          }),
        );
      }

      res.status(200).json(normalizeCase(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('cases', id, workspaceId, 'CASE_NOT_FOUND');

      const nowIso = new Date().toISOString();

      await bestEffortPatch(withWorkspaceFilter(`work_items?case_id=eq.${encodeURIComponent(id)}`, workspaceId), {
        case_id: null,
        case_title: null,
        updated_at: nowIso,
      });

      await bestEffortPatch(withWorkspaceFilter(`leads?linked_case_id=eq.${encodeURIComponent(id)}`, workspaceId), {
        linked_case_id: null,
        updated_at: nowIso,
      });

      await bestEffortDelete(`client_portal_tokens?case_id=eq.${encodeURIComponent(id)}`);
      await bestEffortDelete(`case_items?case_id=eq.${encodeURIComponent(id)}`);
      await bestEffortDelete(`activities?case_id=eq.${encodeURIComponent(id)}`);
      await deleteById('cases', id);

      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    const message = error?.message || 'CASE_API_FAILED';
    res.status(message === 'CASE_NOT_FOUND' ? 404 : 500).json({ error: message });
  }
}

