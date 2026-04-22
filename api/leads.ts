import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from './_request-scope.js';

const SOURCE_ALIASES = { instagram:'instagram', facebook:'facebook', messenger:'messenger', whatsapp:'whatsapp', 'whats app':'whatsapp', 'e-mail':'email', email:'email', mail:'email', formularz:'form', form:'form', telefon:'phone', phone:'phone', polecenie:'referral', referral:'referral', 'cold outreach':'cold_outreach', cold_outreach:'cold_outreach', inne:'other', other:'other' };
const OPTIONAL_LEAD_COLUMNS = new Set(['is_at_risk','partial_payments','summary','notes','priority','next_action_title','next_action_at','next_action_item_id','linked_case_id']);

function normalizePartialPayments(value) { if (!Array.isArray(value)) return []; return value.map((item, index) => { if (!item || typeof item !== 'object') return null; const row = item; const amount = Number(row.amount || 0); if (!Number.isFinite(amount) || amount < 0) return null; return { id: String(row.id || `payment-${index}`), amount, paidAt: typeof row.paidAt === 'string' && row.paidAt.trim() ? row.paidAt : undefined, createdAt: typeof row.createdAt === 'string' && row.createdAt.trim() ? row.createdAt : new Date().toISOString() }; }).filter(Boolean); }
function normalizeSource(value) { if (typeof value !== 'string') return 'other'; const normalized = value.trim().toLowerCase(); return SOURCE_ALIASES[normalized] || 'other'; }
function toIsoDateTime(value) { if (typeof value !== 'string' || !value.trim()) return null; const trimmed = value.trim(); const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T09:00:00` : trimmed; const parsed = new Date(normalized); if (Number.isNaN(parsed.getTime())) return null; return parsed.toISOString(); }
function normalizeLead(row) { return { id: String(row.id || crypto.randomUUID()), name: String(row.name || row.title || row.person_name || ''), company: String(row.company || row.company_name || ''), email: String(row.email || ''), phone: String(row.phone || ''), source: normalizeSource(row.source || row.source_label || row.source_type || 'other'), status: String(row.status || 'new'), nextStep: String(row.next_action_title || row.next_step || row.nextStep || ''), nextActionAt: String(row.next_action_at || row.next_step_due_at || row.nextActionAt || ''), nextActionItemId: String(row.next_action_item_id || row.nextActionItemId || ''), dealValue: Number(row.deal_value || row.value || row.dealValue || 0), partialPayments: normalizePartialPayments(row.partial_payments || row.partialPayments), isAtRisk: Boolean(row.is_at_risk ?? row.isAtRisk ?? (String(row.priority || '').toLowerCase() === 'high')), updatedAt: row.updated_at || row.updatedAt || null }; }
function extractMissingColumn(error) { const message = error instanceof Error ? error.message : String(error || ''); const match = message.match(/Could not find the '([^']+)' column/i); return match?.[1] || null; }
function omitMissingColumn(payload, column) { const nextPayload = { ...payload }; delete nextPayload[column]; return nextPayload; }
async function insertLeadWithSchemaFallback(payload) { let currentPayload = { ...payload }; for (let attempt=0; attempt<10; attempt+=1) { try { return await insertWithVariants(['leads'], [currentPayload]); } catch (error) { const missingColumn = extractMissingColumn(error); if (!missingColumn || !OPTIONAL_LEAD_COLUMNS.has(missingColumn) || !(missingColumn in currentPayload)) throw error; currentPayload = omitMissingColumn(currentPayload, missingColumn); } } throw new Error('LEAD_INSERT_SCHEMA_FALLBACK_EXHAUSTED'); }
async function updateLeadWithSchemaFallback(id, payload) { let currentPayload = { ...payload }; for (let attempt=0; attempt<10; attempt+=1) { try { return await updateById('leads', id, currentPayload); } catch (error) { const missingColumn = extractMissingColumn(error); if (!missingColumn || !OPTIONAL_LEAD_COLUMNS.has(missingColumn) || !(missingColumn in currentPayload)) throw error; currentPayload = omitMissingColumn(currentPayload, missingColumn); } } throw new Error('LEAD_UPDATE_SCHEMA_FALLBACK_EXHAUSTED'); }

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) { res.status(401).json({ error: 'LEAD_WORKSPACE_REQUIRED' }); return; }
      const requestedId = String(req.query?.id || '').trim();
      const base = withWorkspaceFilter(`leads?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}order=updated_at.desc.nullslast&limit=${requestedId ? 1 : 200}`, workspaceId);
      const fallback = withWorkspaceFilter(`leads?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}order=created_at.desc.nullslast&limit=${requestedId ? 1 : 200}`, workspaceId);
      const result = await selectFirstAvailable([base, fallback]);
      const normalized = (result.data || []).map(normalizeLead);
      if (requestedId) {
        const match = normalized.find((lead) => lead.id === requestedId);
        if (!match) { res.status(404).json({ error: 'LEAD_NOT_FOUND' }); return; }
        res.status(200).json(match); return;
      }
      res.status(200).json(normalized); return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);

    if (req.method === 'PATCH') {
      if (!body.id || !workspaceId) { res.status(400).json({ error: 'LEAD_ID_REQUIRED' }); return; }
      await requireScopedRow('leads', String(body.id), workspaceId, 'LEAD_NOT_FOUND');
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.name !== undefined) payload.name = body.name;
      if (body.company !== undefined) payload.company = body.company;
      if (body.email !== undefined) payload.email = body.email;
      if (body.phone !== undefined) payload.phone = body.phone;
      if (body.source !== undefined) payload.source = normalizeSource(body.source);
      if (body.dealValue !== undefined) payload.value = Number(body.dealValue) || 0;
      if (body.partialPayments !== undefined) payload.partial_payments = normalizePartialPayments(body.partialPayments);
      if (body.status !== undefined) payload.status = body.status;
      if (body.nextStep !== undefined) payload.next_action_title = body.nextStep || '';
      if (body.nextActionAt !== undefined) payload.next_action_at = toIsoDateTime(body.nextActionAt);
      if (body.isAtRisk !== undefined) { payload.is_at_risk = Boolean(body.isAtRisk); payload.priority = body.isAtRisk ? 'high' : 'medium'; }
      const data = await updateLeadWithSchemaFallback(String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      res.status(200).json(normalizeLead(updated)); return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '');
      if (!id || !workspaceId) { res.status(400).json({ error: 'LEAD_ID_REQUIRED' }); return; }
      await requireScopedRow('leads', id, workspaceId, 'LEAD_NOT_FOUND');
      await deleteById('leads', id);
      res.status(200).json({ ok: true, id }); return;
    }

    if (req.method !== 'POST') { res.status(405).json({ error: 'METHOD_NOT_ALLOWED' }); return; }
    const finalWorkspaceId = workspaceId || await findWorkspaceId(body.workspaceId);
    if (!finalWorkspaceId) throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
    const nowIso = new Date().toISOString();
    const amount = Number(body.dealValue) || 0;
    const dueAt = toIsoDateTime(body.nextActionAt);
    const source = normalizeSource(body.source);
    const status = typeof body.status === 'string' && body.status.trim() ? body.status : 'new';
    const isAtRisk = Boolean(body.isAtRisk);
    const payload = { workspace_id: finalWorkspaceId, created_by_user_id: body.ownerId && isUuid(body.ownerId) ? body.ownerId : null, name: body.name, company: body.company || '', email: body.email || '', phone: body.phone || '', source, value: amount, partial_payments: normalizePartialPayments(body.partialPayments), summary: '', notes: '', status, priority: isAtRisk ? 'high' : 'medium', is_at_risk: isAtRisk, next_action_title: body.nextStep || '', next_action_at: dueAt, next_action_item_id: null, created_at: nowIso, updated_at: nowIso };
    const result = await insertLeadWithSchemaFallback(payload);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    res.status(200).json(normalizeLead(inserted));
  } catch (error) {
    const message = error?.message || 'LEAD_INSERT_FAILED';
    res.status(message === 'LEAD_NOT_FOUND' ? 404 : 500).json({ error: message });
  }
}
