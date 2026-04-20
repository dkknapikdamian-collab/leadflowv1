import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';

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

function normalizeIsoString(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString();
}

function normalizeSource(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return 'other';

  const normalized = value.trim().toLowerCase();
  if (normalized === 'inne') return 'other';
  return normalized;
}

function normalizeLead(row: Record<string, unknown>) {
  const partialPayments = normalizePartialPayments(row.partial_payments || row.partialPayments);

  return {
    id: String(row.id || crypto.randomUUID()),
    name: String(row.name || row.title || row.person_name || ''),
    company: String(row.company || row.company_name || ''),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    source: normalizeSource(row.source || row.source_label || row.source_type || 'other'),
    status: String(row.status || 'new'),
    nextStep: String(row.next_action_title || row.next_step || row.nextStep || ''),
    nextActionAt: normalizeIsoString(row.next_action_at || row.next_step_due_at || row.nextActionAt || ''),
    dealValue: Number(row.deal_value || row.value || row.dealValue || 0),
    partialPayments,
    isAtRisk: Boolean(row.is_at_risk ?? row.isAtRisk ?? (String(row.priority || '').toLowerCase() === 'high')),
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

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
]);

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

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      return await insertWithVariants(['leads'], [currentPayload]);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_LEAD_COLUMNS.has(missingColumn) || !(missingColumn in currentPayload)) {
        throw error;
      }
      currentPayload = omitMissingColumn(currentPayload, missingColumn);
    }
  }

  throw new Error('LEAD_INSERT_SCHEMA_FALLBACK_EXHAUSTED');
}

async function updateLeadWithSchemaFallback(id: string, payload: Record<string, unknown>) {
  let currentPayload = { ...payload };

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      return await updateById('leads', id, currentPayload);
    } catch (error) {
      const missingColumn = extractMissingColumn(error);
      if (!missingColumn || !OPTIONAL_LEAD_COLUMNS.has(missingColumn) || !(missingColumn in currentPayload)) {
        throw error;
      }
      currentPayload = omitMissingColumn(currentPayload, missingColumn);
    }
  }

  throw new Error('LEAD_UPDATE_SCHEMA_FALLBACK_EXHAUSTED');
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const requestedId = String(req.query?.id || '').trim();
      const result = await selectFirstAvailable([
        'leads?select=*&order=updated_at.desc.nullslast&limit=200',
        'leads?select=*&order=created_at.desc.nullslast&limit=200',
      ]);
      const normalized = (result.data as Record<string, unknown>[]).map(normalizeLead);
      if (requestedId) {
        const match = normalized.find((lead) => lead.id === requestedId);
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

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!body.id) {
        res.status(400).json({ error: 'LEAD_ID_REQUIRED' });
        return;
      }

      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (body.name !== undefined) payload.name = body.name;
      if (body.company !== undefined) payload.company = body.company;
      if (body.email !== undefined) payload.email = body.email;
      if (body.phone !== undefined) payload.phone = body.phone;
      if (body.source !== undefined) payload.source = normalizeSource(body.source);
      if (body.dealValue !== undefined) payload.value = Number(body.dealValue) || 0;
      if (body.partialPayments !== undefined) payload.partial_payments = normalizePartialPayments(body.partialPayments);
      if (body.status !== undefined) payload.status = body.status;
      if (body.nextStep !== undefined) payload.next_action_title = body.nextStep || '';
      if (body.nextActionAt !== undefined) payload.next_action_at = body.nextActionAt ? new Date(body.nextActionAt).toISOString() : null;
      if (body.isAtRisk !== undefined) {
        payload.is_at_risk = Boolean(body.isAtRisk);
        payload.priority = body.isAtRisk ? 'high' : 'medium';
      }

      const data = await updateLeadWithSchemaFallback(String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      res.status(200).json(normalizeLead(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '');
      if (!id) {
        res.status(400).json({ error: 'LEAD_ID_REQUIRED' });
        return;
      }

      await deleteById('leads', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = await findWorkspaceId(body.workspaceId);
    if (!workspaceId) {
      throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
    }

    const nowIso = new Date().toISOString();
    const amount = Number(body.dealValue) || 0;
    const dueAt = body.nextActionAt ? new Date(body.nextActionAt).toISOString() : null;
    const source = normalizeSource(body.source);
    const isAtRisk = Boolean(body.isAtRisk);
    const status = typeof body.status === 'string' && body.status.trim() ? body.status.trim() : 'new';

    const payload = {
      workspace_id: workspaceId,
      created_by_user_id: body.ownerId || null,
      name: body.name,
      company: body.company || '',
      email: body.email || '',
      phone: body.phone || '',
      source,
      value: amount,
      partial_payments: normalizePartialPayments(body.partialPayments),
      summary: '',
      notes: '',
      status,
      priority: isAtRisk ? 'high' : 'medium',
      is_at_risk: isAtRisk,
      next_action_title: body.nextStep || '',
      next_action_at: dueAt,
      next_action_item_id: null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const result = await insertLeadWithSchemaFallback(payload);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;

    res.status(200).json(normalizeLead(inserted as Record<string, unknown>));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'LEAD_INSERT_FAILED' });
  }
}
