// STAGE231D2_CASE_COSTS_IN_CASE: API route for durable case-level costs.
import { deleteByIdScoped, insertWithVariants, selectFirstAvailable, supabaseRequest, updateByIdScoped } from '../src/server/_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';
import { RequestAuthError } from '../src/server/_supabase-auth.js';

const ALLOWED_KINDS = new Set(['court_fee','notary','travel','document','office','marketing','other']);
const ALLOWED_STATUSES = new Set(['planned','incurred','submitted','partially_reimbursed','reimbursed','cancelled']);

function text(value: unknown) { return typeof value === 'string' ? value.trim() : ''; }
function money(value: unknown) {
  const parsed = Number(String(value ?? '').replace(/\s+/g, '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : 0;
}
function bool(value: unknown, fallback = true) {
  if (value === true || value === false) return value;
  const normalized = text(value).toLowerCase();
  if (['true','1','yes','tak'].includes(normalized)) return true;
  if (['false','0','no','nie'].includes(normalized)) return false;
  return fallback;
}
function iso(value: unknown) {
  const raw = text(value);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}
function normalizePayload(body: Record<string, unknown>, workspaceId: string) {
  const amount = money(body.amount ?? body.costAmount ?? body.cost_amount);
  const reimbursable = bool(body.reimbursable, true);
  const reimbursableAmount = reimbursable ? money(body.reimbursableAmount ?? body.reimbursable_amount ?? amount) : 0;
  const reimbursedAmount = Math.min(money(body.reimbursedAmount ?? body.reimbursed_amount), reimbursableAmount);
  const kindRaw = text(body.kind ?? body.type ?? body.category).toLowerCase();
  const statusRaw = text(body.status).toLowerCase();
  const currency = text(body.currency).toUpperCase();
  return {
    workspace_id: workspaceId,
    case_id: text(body.caseId ?? body.case_id),
    client_id: text(body.clientId ?? body.client_id) || null,
    kind: ALLOWED_KINDS.has(kindRaw) ? kindRaw : 'other',
    status: ALLOWED_STATUSES.has(statusRaw) ? statusRaw : 'incurred',
    amount,
    reimbursable,
    reimbursable_amount: reimbursableAmount,
    reimbursed_amount: reimbursedAmount,
    currency: /^[A-Z]{3}$/.test(currency) ? currency : 'PLN',
    incurred_at: iso(body.incurredAt ?? body.incurred_at) || new Date().toISOString(),
    reimbursed_at: iso(body.reimbursedAt ?? body.reimbursed_at),
    note: text(body.note) || null,
  };
}
function parseBody(req: any) {
  if (!req.body) return {};
  if (typeof req.body === 'string') { try { return JSON.parse(req.body || '{}'); } catch { return {}; } }
  return req.body && typeof req.body === 'object' ? req.body : {};
}
function send(res: any, status: number, payload: unknown) { res.status(status).json(payload); }
function queryValue(value: unknown) { return Array.isArray(value) ? text(value[0]) : text(value); }

export default async function handler(req: any, res: any) {
  try {
    const method = String(req.method || 'GET').toUpperCase();
    const body = parseBody(req) as Record<string, unknown>;
    const workspaceId = await resolveRequestWorkspaceId(req, body);

    if (method === 'GET') {
      const query = req.query || {};
      const params = new URLSearchParams();
      params.set('select', '*');
      const caseId = queryValue(query.caseId ?? query.case_id);
      const clientId = queryValue(query.clientId ?? query.client_id);
      const status = queryValue(query.status);
      if (caseId) params.set('case_id', 'eq.' + caseId);
      if (clientId) params.set('client_id', 'eq.' + clientId);
      if (status) params.set('status', 'eq.' + status);
      params.set('order', 'incurred_at.desc,created_at.desc');
      const scopedPath = withWorkspaceFilter('case_costs?' + params.toString(), workspaceId);
      const result = await selectFirstAvailable([scopedPath]);
      send(res, 200, Array.isArray(result.data) ? result.data : []);
      return;
    }

    if (method === 'POST') {
      const payload = normalizePayload(body, workspaceId);
      if (!payload.case_id) { send(res, 400, { error: 'CASE_ID_REQUIRED' }); return; }
      const result = await insertWithVariants(['case_costs'], [payload]);
      send(res, 200, Array.isArray(result.data) ? result.data[0] || result.data : result.data);
      return;
    }

    if (method === 'PATCH') {
      const id = text(body.id ?? req.query?.id);
      if (!id) { send(res, 400, { error: 'ID_REQUIRED' }); return; }
      const payload = normalizePayload(body, workspaceId);
      delete (payload as any).workspace_id;
      if (!payload.case_id) delete (payload as any).case_id;
      const data = await updateByIdScoped('case_costs', id, workspaceId, payload);
      send(res, 200, Array.isArray(data) ? data[0] || data : data);
      return;
    }

    if (method === 'DELETE') {
      const id = queryValue(req.query?.id ?? body.id);
      if (!id) { send(res, 400, { error: 'ID_REQUIRED' }); return; }
      const data = await deleteByIdScoped('case_costs', id, workspaceId);
      send(res, 200, Array.isArray(data) ? data[0] || data : data);
      return;
    }

    send(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    const status = error instanceof RequestAuthError ? error.status : 500;
    const code = error instanceof RequestAuthError ? error.code : error instanceof Error ? error.message : 'REQUEST_FAILED';
    send(res, status, { error: code });
  }
}
