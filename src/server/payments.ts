/*
VERCEL_HOBBY_API_BUDGET_HOTFIX_2026_04_28
Moved from api/ to src/server/ and routed through api/system.ts to keep the Vercel Hobby function budget green.
*/
import { deleteById, insertWithVariants, isUuid, selectFirstAvailable, updateById } from './_supabase.js';
import { requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';
import { assertWorkspaceWriteAccess } from './_access-gate.js';
import { writeAuthErrorResponse } from './_supabase-auth.js';
import { normalizePaymentContract } from '../lib/data-contract.js';

const PAYMENT_TYPES = new Set(['deposit', 'partial', 'final', 'commission', 'recurring', 'manual']);
const PAYMENT_STATUSES = new Set(['not_applicable', 'not_started', 'awaiting_payment', 'deposit_paid', 'partially_paid', 'fully_paid', 'commission_pending', 'commission_due', 'paid', 'refunded', 'written_off']);

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNullableUuid(value: unknown) {
  const normalized = asText(value);
  return normalized && isUuid(normalized) ? normalized : null;
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, parsed);
}

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = asText(value);
  return allowed.has(normalized) ? normalized : fallback;
}

function toIso(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isMissingPaymentsTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.payments'");
}

function normalizePayment(row: Record<string, unknown>) {
  return normalizePaymentContract(row);
}

function normalizeCurrency(value: unknown) {
  const normalized = asText(value).toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'PLN';
}

const PAID_PAYMENT_STATUSES = new Set(['deposit_paid', 'partially_paid', 'fully_paid', 'paid']);

async function recalculateCasePaidAmount(workspaceId: string, caseId: string) {
  if (!workspaceId || !caseId) return;
  const statuses = Array.from(PAID_PAYMENT_STATUSES).join(',');
  const result = await selectFirstAvailable([
    withWorkspaceFilter(`payments?select=amount,status,currency&case_id=eq.${encodeURIComponent(caseId)}&status=in.(${statuses})&limit=500`, workspaceId),
  ]).catch(() => ({ data: [] as Record<string, unknown>[] }));
  const rows = Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];
  const paidAmount = rows.reduce((acc, row) => acc + asNumber(row.amount), 0);
  const currency = normalizeCurrency(rows[0]?.currency);
  await updateById('cases', caseId, {
    paid_amount: paidAmount,
    currency,
    updated_at: new Date().toISOString(),
  }).catch(() => null);
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) {
        res.status(401).json({ error: 'PAYMENT_WORKSPACE_REQUIRED' });
        return;
      }
      const requestedId = asText(req.query?.id);
      const leadId = asText(req.query?.leadId);
      const caseId = asText(req.query?.caseId);
      const clientId = asText(req.query?.clientId);
      const status = asText(req.query?.status);

      const filters = [
        requestedId ? `id=eq.${encodeURIComponent(requestedId)}` : null,
        leadId ? `lead_id=eq.${encodeURIComponent(leadId)}` : null,
        caseId ? `case_id=eq.${encodeURIComponent(caseId)}` : null,
        clientId ? `client_id=eq.${encodeURIComponent(clientId)}` : null,
        status ? `status=eq.${encodeURIComponent(status)}` : null,
      ].filter(Boolean).join('&');

      const basePath = `payments?select=*&${filters ? `${filters}&` : ''}order=created_at.desc.nullslast&limit=${requestedId ? 1 : 300}`;
      let normalized: ReturnType<typeof normalizePayment>[] = [];
      try {
        const result = await selectFirstAvailable([withWorkspaceFilter(basePath, workspaceId)]);
        normalized = (result.data || []).map((row: Record<string, unknown>) => normalizePayment(row));
      } catch (error) {
        if (!isMissingPaymentsTableError(error)) throw error;
      }

      if (requestedId) {
        const match = normalized.find((entry: Record<string, unknown>) => String(entry.id) === requestedId);
        if (!match) {
          res.status(404).json({ error: 'PAYMENT_NOT_FOUND' });
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

    if (req.method !== 'GET') {
      if (!workspaceId) {
        res.status(401).json({ error: 'PAYMENT_WORKSPACE_REQUIRED' });
        return;
      }
      await assertWorkspaceWriteAccess(workspaceId, req);
    }

    if (req.method === 'POST') {
      const finalWorkspaceId = workspaceId;
      if (!finalWorkspaceId) throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
      const clientId = asNullableUuid(body.clientId);
      const leadId = asNullableUuid(body.leadId);
      const caseId = asNullableUuid(body.caseId);
      if (clientId) await requireScopedRow('clients', clientId, finalWorkspaceId, 'CLIENT_NOT_FOUND');
      if (leadId) await requireScopedRow('leads', leadId, finalWorkspaceId, 'LEAD_NOT_FOUND');
      if (caseId) await requireScopedRow('cases', caseId, finalWorkspaceId, 'CASE_NOT_FOUND');
      const nowIso = new Date().toISOString();
      const payload = {
        workspace_id: finalWorkspaceId,
        client_id: clientId,
        lead_id: leadId,
        case_id: caseId,
        type: normalizeEnum(body.type, PAYMENT_TYPES, 'partial'),
        status: normalizeEnum(body.status, PAYMENT_STATUSES, 'not_started'),
        amount: asNumber(body.amount),
        currency: normalizeCurrency(body.currency),
        paid_at: toIso(body.paidAt),
        due_at: toIso(body.dueAt),
        note: asText(body.note) || null,
        created_at: nowIso,
        updated_at: nowIso,
      };
      const result = await insertWithVariants(['payments'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      if (caseId) await recalculateCasePaidAmount(finalWorkspaceId, caseId);
      res.status(200).json(normalizePayment(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'PAYMENT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('payments', id, workspaceId, 'PAYMENT_NOT_FOUND');
      const currentPayment = await requireScopedRow('payments', id, workspaceId, 'PAYMENT_NOT_FOUND');
      const clientId = body.clientId !== undefined ? asNullableUuid(body.clientId) : null;
      const leadId = body.leadId !== undefined ? asNullableUuid(body.leadId) : null;
      const caseId = body.caseId !== undefined ? asNullableUuid(body.caseId) : null;
      if (body.clientId !== undefined && clientId) await requireScopedRow('clients', clientId, workspaceId, 'CLIENT_NOT_FOUND');
      if (body.leadId !== undefined && leadId) await requireScopedRow('leads', leadId, workspaceId, 'LEAD_NOT_FOUND');
      if (body.caseId !== undefined && caseId) await requireScopedRow('cases', caseId, workspaceId, 'CASE_NOT_FOUND');
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.clientId !== undefined) payload.client_id = clientId;
      if (body.leadId !== undefined) payload.lead_id = leadId;
      if (body.caseId !== undefined) payload.case_id = caseId;
      if (body.type !== undefined) payload.type = normalizeEnum(body.type, PAYMENT_TYPES, 'partial');
      if (body.status !== undefined) payload.status = normalizeEnum(body.status, PAYMENT_STATUSES, 'not_started');
      if (body.amount !== undefined) payload.amount = asNumber(body.amount);
      if (body.currency !== undefined) payload.currency = normalizeCurrency(body.currency);
      if (body.paidAt !== undefined) payload.paid_at = toIso(body.paidAt);
      if (body.dueAt !== undefined) payload.due_at = toIso(body.dueAt);
      if (body.note !== undefined) payload.note = asText(body.note) || null;
      const data = await updateById('payments', id, payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id, ...payload };
      const previousCaseId = asText(currentPayment.case_id || currentPayment.caseId);
      const nextCaseId = asText(updated.case_id || updated.caseId || caseId);
      if (previousCaseId) await recalculateCasePaidAmount(workspaceId, previousCaseId);
      if (nextCaseId && nextCaseId !== previousCaseId) await recalculateCasePaidAmount(workspaceId, nextCaseId);
      res.status(200).json(normalizePayment(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'PAYMENT_ID_REQUIRED' });
        return;
      }
      const currentPayment = await requireScopedRow('payments', id, workspaceId, 'PAYMENT_NOT_FOUND');
      await deleteById('payments', id);
      const previousCaseId = asText(currentPayment.case_id || currentPayment.caseId);
      if (previousCaseId) await recalculateCasePaidAmount(workspaceId, previousCaseId);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    const message = error?.message || 'PAYMENT_API_FAILED';
    const statusCode =
      message === 'PAYMENT_NOT_FOUND' || message === 'LEAD_NOT_FOUND' || message === 'CASE_NOT_FOUND' || message === 'CLIENT_NOT_FOUND'
        ? 404
        : 500;
    res.status(statusCode).json({ error: message });
  }
}
