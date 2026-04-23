import { deleteById, findWorkspaceId, insertWithVariants, isUuid, selectFirstAvailable, updateById } from './_supabase.js';
import { requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';

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

function normalizePayment(row: Record<string, unknown>) {
  return {
    id: String(row.id || crypto.randomUUID()),
    workspaceId: asText(row.workspace_id || row.workspaceId),
    clientId: asText(row.client_id || row.clientId) || null,
    leadId: asText(row.lead_id || row.leadId) || null,
    caseId: asText(row.case_id || row.caseId) || null,
    type: normalizeEnum(row.type, PAYMENT_TYPES, 'partial'),
    status: normalizeEnum(row.status, PAYMENT_STATUSES, 'not_started'),
    amount: asNumber(row.amount),
    currency: asText(row.currency) || 'PLN',
    paidAt: row.paid_at || row.paidAt || null,
    dueAt: row.due_at || row.dueAt || null,
    note: asText(row.note),
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null,
  };
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
      const result = await selectFirstAvailable([withWorkspaceFilter(basePath, workspaceId)]);
      const normalized = (result.data || []).map((row: Record<string, unknown>) => normalizePayment(row));

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

    if (req.method === 'POST') {
      const finalWorkspaceId = workspaceId || await findWorkspaceId(body.workspaceId);
      if (!finalWorkspaceId) throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
      const nowIso = new Date().toISOString();
      const payload = {
        workspace_id: finalWorkspaceId,
        client_id: asNullableUuid(body.clientId),
        lead_id: asNullableUuid(body.leadId),
        case_id: asNullableUuid(body.caseId),
        type: normalizeEnum(body.type, PAYMENT_TYPES, 'partial'),
        status: normalizeEnum(body.status, PAYMENT_STATUSES, 'not_started'),
        amount: asNumber(body.amount),
        currency: asText(body.currency) || 'PLN',
        paid_at: toIso(body.paidAt),
        due_at: toIso(body.dueAt),
        note: asText(body.note) || null,
        created_at: nowIso,
        updated_at: nowIso,
      };
      const result = await insertWithVariants(['payments'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
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
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.clientId !== undefined) payload.client_id = asNullableUuid(body.clientId);
      if (body.leadId !== undefined) payload.lead_id = asNullableUuid(body.leadId);
      if (body.caseId !== undefined) payload.case_id = asNullableUuid(body.caseId);
      if (body.type !== undefined) payload.type = normalizeEnum(body.type, PAYMENT_TYPES, 'partial');
      if (body.status !== undefined) payload.status = normalizeEnum(body.status, PAYMENT_STATUSES, 'not_started');
      if (body.amount !== undefined) payload.amount = asNumber(body.amount);
      if (body.currency !== undefined) payload.currency = asText(body.currency) || 'PLN';
      if (body.paidAt !== undefined) payload.paid_at = toIso(body.paidAt);
      if (body.dueAt !== undefined) payload.due_at = toIso(body.dueAt);
      if (body.note !== undefined) payload.note = asText(body.note) || null;
      const data = await updateById('payments', id, payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id, ...payload };
      res.status(200).json(normalizePayment(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = asText(req.query?.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'PAYMENT_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('payments', id, workspaceId, 'PAYMENT_NOT_FOUND');
      await deleteById('payments', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    const message = error?.message || 'PAYMENT_API_FAILED';
    res.status(message === 'PAYMENT_NOT_FOUND' ? 404 : 500).json({ error: message });
  }
}
