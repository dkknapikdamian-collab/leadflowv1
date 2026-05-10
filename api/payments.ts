import { deleteByIdScoped, insertWithVariants, selectFirstAvailable, updateByIdScoped } from '../src/server/_supabase.js';
import { requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';
import { assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';
import { normalizePaymentContract } from '../src/lib/data-contract.js';
import {
  normalizeCurrency,
  normalizeDateTime,
  normalizePaymentStatus,
  normalizePaymentType,
} from '../src/lib/finance/finance-normalize.js';
import { clampFinanceAmount } from '../src/lib/finance/finance-calculations.js';

const FIN2_PAYMENTS_API_CONTRACT = 'FIN-2_DATABASE_API_FINANCE_CONTRACT_V1';
const OPTIONAL_PAYMENT_COLUMNS = new Set([
  'lead_id',
  'client_id',
  'case_id',
  'paid_at',
  'due_at',
  'note',
  'created_at',
  'updated_at',
]);

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeRelationId(value: unknown) {
  const text = asText(value);
  return text || null;
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

function isMissingPaymentsTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.payments'");
}

async function safeSelectRows(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return Array.isArray(result.data) ? (result.data as Record<string, unknown>[]) : [];
  } catch (error) {
    if (isMissingPaymentsTableError(error)) return [];
    throw error;
  }
}

async function insertPaymentWithSchemaFallback(payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await insertWithVariants(['payments'], [current]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_PAYMENT_COLUMNS.has(missingColumn) || !(missingColumn in current)) throw error;
      current = omitMissingColumn(current, missingColumn);
    }
  }
  throw new Error('PAYMENT_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function updatePaymentWithSchemaFallback(id: string, workspaceId: string, payload: Record<string, unknown>) {
  let current = { ...payload };
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await updateByIdScoped('payments', id, workspaceId, current);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_PAYMENT_COLUMNS.has(missingColumn) || !(missingColumn in current)) throw error;
      current = omitMissingColumn(current, missingColumn);
    }
  }
  throw new Error('PAYMENT_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

function buildPaymentPayload(body: Record<string, unknown>, workspaceId: string, nowIso: string, mode: 'create' | 'update') {
  const payload: Record<string, unknown> = {
    updated_at: nowIso,
  };

  if (mode === 'create') {
    payload.workspace_id = workspaceId;
    payload.created_at = nowIso;
    payload.type = normalizePaymentType(body.type);
    payload.status = normalizePaymentStatus(body.status);
    payload.amount = clampFinanceAmount(body.amount ?? body.value ?? body.total ?? body.paidAmount ?? body.paid_amount);
    payload.currency = normalizeCurrency(body.currency);
    payload.lead_id = normalizeRelationId(body.leadId ?? body.lead_id);
    payload.client_id = normalizeRelationId(body.clientId ?? body.client_id);
    payload.case_id = normalizeRelationId(body.caseId ?? body.case_id);
    payload.paid_at = normalizeDateTime(body.paidAt ?? body.paid_at);
    payload.due_at = normalizeDateTime(body.dueAt ?? body.due_at);
    payload.note = asText(body.note ?? body.notes) || null;
    return payload;
  }

  if (body.type !== undefined || body.paymentType !== undefined || body.payment_type !== undefined) {
    payload.type = normalizePaymentType(body.type ?? body.paymentType ?? body.payment_type);
  }
  if (body.status !== undefined || body.paymentStatus !== undefined || body.payment_status !== undefined) {
    payload.status = normalizePaymentStatus(body.status ?? body.paymentStatus ?? body.payment_status);
  }
  if (body.amount !== undefined || body.value !== undefined || body.total !== undefined || body.paidAmount !== undefined || body.paid_amount !== undefined) {
    payload.amount = clampFinanceAmount(body.amount ?? body.value ?? body.total ?? body.paidAmount ?? body.paid_amount);
  }
  if (body.currency !== undefined) payload.currency = normalizeCurrency(body.currency);
  if (body.leadId !== undefined || body.lead_id !== undefined) payload.lead_id = normalizeRelationId(body.leadId ?? body.lead_id);
  if (body.clientId !== undefined || body.client_id !== undefined) payload.client_id = normalizeRelationId(body.clientId ?? body.client_id);
  if (body.caseId !== undefined || body.case_id !== undefined) payload.case_id = normalizeRelationId(body.caseId ?? body.case_id);
  if (body.paidAt !== undefined || body.paid_at !== undefined) payload.paid_at = normalizeDateTime(body.paidAt ?? body.paid_at);
  if (body.dueAt !== undefined || body.due_at !== undefined) payload.due_at = normalizeDateTime(body.dueAt ?? body.due_at);
  if (body.note !== undefined || body.notes !== undefined) payload.note = asText(body.note ?? body.notes) || null;

  return payload;
}

export default async function handler(req: any, res: any) {
  try {
    const workspaceId = await resolveRequestWorkspaceId(req, typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {});
    if (!workspaceId) {
      res.status(401).json({ error: 'PAYMENT_WORKSPACE_REQUIRED' });
      return;
    }

    if (req.method === 'GET') {
      const requestedId = asText(req.query?.id);
      const filters = [
        requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : '',
        asText(req.query?.leadId) ? `lead_id=eq.${encodeURIComponent(asText(req.query?.leadId))}&` : '',
        asText(req.query?.clientId) ? `client_id=eq.${encodeURIComponent(asText(req.query?.clientId))}&` : '',
        asText(req.query?.caseId) ? `case_id=eq.${encodeURIComponent(asText(req.query?.caseId))}&` : '',
        asText(req.query?.status) ? `status=eq.${encodeURIComponent(normalizePaymentStatus(req.query?.status))}&` : '',
      ].filter(Boolean).join('');
      const limit = requestedId ? 1 : 500;
      const rows = await safeSelectRows(
        withWorkspaceFilter(`payments?select=*&${filters}order=paid_at.desc.nullslast,due_at.asc.nullslast,created_at.desc.nullslast&limit=${limit}`, workspaceId),
      );
      const normalized = rows.map((row) => normalizePaymentContract(row));

      if (requestedId) {
        const match = normalized.find((item) => item.id === requestedId);
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

    await assertWorkspaceWriteAccess(workspaceId, req);
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const nowIso = new Date().toISOString();

    if (req.method === 'POST') {
      const payload = buildPaymentPayload(body, workspaceId, nowIso, 'create');
      const result = await insertPaymentWithSchemaFallback(payload);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizePaymentContract(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id);
      if (!id) {
        res.status(400).json({ error: 'PAYMENT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('payments', id, workspaceId, 'PAYMENT_NOT_FOUND');
      const payload = buildPaymentPayload(body, workspaceId, nowIso, 'update');
      const result = await updatePaymentWithSchemaFallback(id, workspaceId, payload);
      const updated = Array.isArray(result) && result[0] ? result[0] : { id, workspace_id: workspaceId, ...payload };
      res.status(200).json(normalizePaymentContract(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id);
      if (!id) {
        res.status(400).json({ error: 'PAYMENT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('payments', id, workspaceId, 'PAYMENT_NOT_FOUND');
      await deleteByIdScoped('payments', id, workspaceId);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    const message = error?.message || 'PAYMENT_API_FAILED';
    res.status(message === 'PAYMENT_NOT_FOUND' ? 404 : 500).json({ error: message, contract: FIN2_PAYMENTS_API_CONTRACT });
  }
}
