import { insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';
import { asText, getRequestIdentity, resolveRequestWorkspaceId, withWorkspaceFilter, fetchSingleScopedRow } from './_request-scope.js';

function normalizeReply(entry) {
  if (!entry || typeof entry !== 'object') return null;
  return { id: asText(entry.id) || crypto.randomUUID(), authorType: asText(entry.authorType) || 'system', authorLabel: asText(entry.authorLabel) || '', message: asText(entry.message), createdAt: entry.createdAt || entry.created_at || new Date().toISOString() };
}
function normalizeReplies(value) { return Array.isArray(value) ? value.map(normalizeReply).filter(Boolean) : []; }
function normalizeTicket(row) { return { id: asText(row.id) || crypto.randomUUID(), workspaceId: row.workspace_id ? String(row.workspace_id) : null, ownerId: asText(row.owner_id), ownerEmail: asText(row.owner_email) || null, kind: asText(row.kind) || 'support', subject: asText(row.subject), message: asText(row.message), status: asText(row.status) || 'new', source: asText(row.source) || 'app', adminReply: asText(row.admin_reply) || null, replies: normalizeReplies(row.replies), createdAt: row.created_at || null, updatedAt: row.updated_at || row.created_at || null, closedAt: row.closed_at || null }; }

function buildTicketQuery(req, workspaceId) {
  const identity = getRequestIdentity(req);
  const includeAll = asText(req.query?.includeAll) === '1';
  const ownerId = asText(req.query?.ownerId) || identity.userId;
  const ownerEmail = asText(req.query?.ownerEmail) || identity.email;
  const status = asText(req.query?.status);
  const kind = asText(req.query?.kind);
  const limit = Math.max(1, Math.min(200, Number(req.query?.limit) || 200));
  let path = withWorkspaceFilter(`support_requests?select=*&order=updated_at.desc&limit=${limit}`, workspaceId);
  if (!includeAll) {
    if (ownerEmail) path += `&owner_email=eq.${encodeURIComponent(ownerEmail)}`;
    else if (ownerId) path += `&owner_id=eq.${encodeURIComponent(ownerId)}`;
  }
  if (status) path += `&status=eq.${encodeURIComponent(status)}`;
  if (kind) path += `&kind=eq.${encodeURIComponent(kind)}`;
  return path;
}

export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);

    if (req.method === 'GET') {
      if (!workspaceId) { res.status(401).json({ error: 'SUPPORT_WORKSPACE_REQUIRED' }); return; }
      const result = await selectFirstAvailable([buildTicketQuery(req, workspaceId)]);
      res.status(200).json((result.data || []).map(normalizeTicket));
      return;
    }

    if (req.method === 'POST') {
      const identity = getRequestIdentity(req, body);
      const subject = asText(body.subject);
      const message = asText(body.message);
      const ownerId = asText(body.ownerId) || identity.userId;
      const ownerEmail = asText(body.ownerEmail) || identity.email;
      if (!subject || !message || !workspaceId) { res.status(400).json({ error: 'SUPPORT_REQUEST_REQUIRED_FIELDS_MISSING' }); return; }
      const payload = { workspace_id: workspaceId, owner_id: ownerId || null, owner_email: ownerEmail || null, kind: asText(body.kind) || 'support', subject, message, status: 'new', source: 'app', admin_reply: null, replies: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString(), closed_at: null };
      const result = await insertWithVariants(['support_requests'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeTicket(inserted));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id);
      if (!id || !workspaceId) { res.status(400).json({ error: 'SUPPORT_REQUEST_ID_REQUIRED' }); return; }
      const currentRow = await fetchSingleScopedRow('support_requests', id, workspaceId);
      if (!currentRow) { res.status(404).json({ error: 'SUPPORT_REQUEST_NOT_FOUND' }); return; }
      const current = normalizeTicket(currentRow);
      const action = asText(body.action);

      if (action === 'reply' || action === 'append_reply') {
        const message = asText(body.message);
        const actorType = asText(body.actorType || body.authorType) === 'admin' ? 'admin' : 'user';
        if (!message) { res.status(400).json({ error: 'SUPPORT_REPLY_MESSAGE_REQUIRED' }); return; }
        const nextReply = normalizeReply({ id: crypto.randomUUID(), authorType: actorType, authorLabel: actorType === 'admin' ? 'Support' : 'Ty', message, createdAt: new Date().toISOString() });
        const nextReplies = [...normalizeReplies(current.replies), nextReply];
        const nextStatus = actorType === 'admin' ? 'answered' : 'in_progress';
        const payload = { replies: nextReplies, status: nextStatus, admin_reply: actorType === 'admin' ? message : current.adminReply, updated_at: new Date().toISOString(), closed_at: null };
        const updatedRows = await updateById('support_requests', id, payload);
        const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { ...currentRow, ...payload };
        res.status(200).json(normalizeTicket(updated));
        return;
      }

      if (action === 'status' || asText(body.status)) {
        const status = asText(body.status) || 'new';
        const payload = { status, updated_at: new Date().toISOString(), closed_at: status === 'closed' ? new Date().toISOString() : null };
        const updatedRows = await updateById('support_requests', id, payload);
        const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { ...currentRow, ...payload };
        res.status(200).json(normalizeTicket(updated));
        return;
      }

      res.status(400).json({ error: 'SUPPORT_REQUEST_PATCH_ACTION_REQUIRED' });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    res.status(500).json({ error: error?.message || 'SUPPORT_REQUESTS_API_FAILED' });
  }
}
