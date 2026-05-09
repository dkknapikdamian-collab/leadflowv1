// CLOSEFLOW_VERCEL_HOBBY_FUNCTION_LIMIT_ENTITY_CONFLICTS_V1
// CLOSEFLOW_ENTITY_CONFLICTS_API_V1
import { selectFirstAvailable } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';
import { assertWorkspaceWriteAccess } from './_access-gate.js';

function asText(value: unknown) { return typeof value === 'string' ? value.trim() : ''; }
function normalizeText(value: unknown) {
  return asText(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
}
function normalizePhone(value: unknown) { return asText(value).replace(/\D/g, ''); }
function safeField(row: Record<string, unknown>, ...keys: string[]) { for (const key of keys) { const value = asText(row[key]); if (value) return value; } return ''; }
async function safeRows(query: string) { try { const result = await selectFirstAvailable([query]); return Array.isArray(result.data) ? result.data as Record<string, unknown>[] : []; } catch { return []; } }
function leadHiddenReason(row: Record<string, unknown>) {
  const status = normalizeText(row.status);
  const visibility = normalizeText(row.lead_visibility || row.leadVisibility);
  const outcome = normalizeText(row.sales_outcome || row.salesOutcome);
  const linkedCaseId = asText(row.linked_case_id || row.linkedCaseId || row.case_id || row.caseId);
  if (visibility === 'trash' || status === 'archived') return 'trash';
  if (status === 'moved_to_service' || outcome === 'moved_to_service' || linkedCaseId) return 'service_history';
  if (visibility === 'archived') return 'archived';
  return 'active';
}
function clientHiddenReason(row: Record<string, unknown>) { return asText(row.archived_at || row.archivedAt) ? 'trash' : 'active'; }
function hiddenReasonLabel(reason: string) {
  if (reason === 'trash') return 'w koszu / ukryty';
  if (reason === 'service_history') return 'przeniesiony do obsługi / historii';
  if (reason === 'archived') return 'archiwalny';
  return 'aktywny';
}
function matchFields(input: Record<string, unknown>, row: Record<string, unknown>) {
  const matches: string[] = [];
  const inputEmail = normalizeText(input.email);
  const rowEmail = normalizeText(row.email || row.client_email || row.clientEmail);
  if (inputEmail && rowEmail && inputEmail === rowEmail) matches.push('email');
  const inputPhone = normalizePhone(input.phone);
  const rowPhone = normalizePhone(row.phone || row.client_phone || row.clientPhone);
  if (inputPhone && rowPhone && inputPhone.length >= 5 && inputPhone === rowPhone) matches.push('phone');
  const inputName = normalizeText(input.name);
  const rowName = normalizeText(row.name || row.client_name || row.clientName || row.company);
  if (inputName && rowName && inputName.length >= 3 && inputName === rowName) matches.push('name');
  const inputCompany = normalizeText(input.company);
  const rowCompany = normalizeText(row.company);
  if (inputCompany && rowCompany && inputCompany.length >= 3 && inputCompany === rowCompany) matches.push('company');
  return matches;
}
function buildLeadCandidate(row: Record<string, unknown>, input: Record<string, unknown>) {
  const matches = matchFields(input, row); if (!matches.length) return null;
  const reason = leadHiddenReason(row);
  const linkedCaseId = asText(row.linked_case_id || row.linkedCaseId || row.case_id || row.caseId);
  const status = asText(row.status) || 'new';
  const id = asText(row.id); if (!id) return null;
  return { id, entityType: 'lead', label: safeField(row, 'name', 'company') || 'Lead bez nazwy', name: safeField(row, 'name'), company: safeField(row, 'company'), email: safeField(row, 'email'), phone: safeField(row, 'phone'), status, statusLabel: hiddenReasonLabel(reason), hiddenReason: reason, matchFields: matches, canRestore: (reason === 'trash' || reason === 'archived') && !linkedCaseId && status !== 'moved_to_service', url: '/leads/' + encodeURIComponent(id) };
}
function buildClientCandidate(row: Record<string, unknown>, input: Record<string, unknown>) {
  const matches = matchFields(input, row); if (!matches.length) return null;
  const reason = clientHiddenReason(row);
  const id = asText(row.id); if (!id) return null;
  return { id, entityType: 'client', label: safeField(row, 'name', 'company') || 'Klient', name: safeField(row, 'name'), company: safeField(row, 'company'), email: safeField(row, 'email'), phone: safeField(row, 'phone'), status: asText(row.status) || '', statusLabel: hiddenReasonLabel(reason), hiddenReason: reason, matchFields: matches, canRestore: reason === 'trash', url: '/clients/' + encodeURIComponent(id) };
}
function sortCandidates(a: any, b: any) {
  const score = (candidate: any) => { const fields = Array.isArray(candidate.matchFields) ? candidate.matchFields : []; let value = 0; if (fields.includes('email')) value += 100; if (fields.includes('phone')) value += 90; if (fields.includes('name')) value += 20; if (fields.includes('company')) value += 10; if (candidate.hiddenReason !== 'active') value += 5; return value; };
  return score(b) - score(a);
}
export default async function entityConflictsHandler(req: any, res: any) {
  try {
    if (req.method !== 'POST') { res.status(405).json({ error: 'METHOD_NOT_ALLOWED' }); return; }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);
    if (!workspaceId) { res.status(401).json({ error: 'ENTITY_CONFLICT_WORKSPACE_REQUIRED' }); return; }
    await assertWorkspaceWriteAccess(workspaceId, req);
    const input = { targetType: asText(body.targetType || body.entityType || 'lead'), name: asText(body.name), company: asText(body.company), email: asText(body.email).toLowerCase(), phone: asText(body.phone) };
    if (!input.name && !input.company && !input.email && !input.phone) { res.status(200).json({ ok: true, candidates: [] }); return; }
    const leadRows = await safeRows(withWorkspaceFilter('leads?select=id,name,company,email,phone,status,lead_visibility,sales_outcome,linked_case_id,client_id,updated_at,created_at&order=updated_at.desc.nullslast&limit=1000', workspaceId));
    const clientRows = await safeRows(withWorkspaceFilter('clients?select=id,name,company,email,phone,archived_at,updated_at,created_at&order=updated_at.desc.nullslast&limit=1000', workspaceId));
    const candidates = [...leadRows.map((row) => buildLeadCandidate(row, input)).filter(Boolean), ...clientRows.map((row) => buildClientCandidate(row, input)).filter(Boolean)].sort(sortCandidates).slice(0, 12);
    res.status(200).json({ ok: true, candidates });
  } catch (error: any) { res.status(500).json({ error: error?.message || 'ENTITY_CONFLICTS_FAILED' }); }
}
