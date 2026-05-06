import { insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';
import { asText, requireRequestIdentity, resolveRequestWorkspaceId, withWorkspaceFilter, fetchSingleScopedRow } from './_request-scope.js';

const RESEND_API_URL = 'https://api.resend.com/emails';

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeReply(entry: any) {
  if (!entry || typeof entry !== 'object') return null;
  return {
    id: asText(entry.id) || crypto.randomUUID(),
    authorType: asText(entry.authorType) || 'system',
    authorLabel: asText(entry.authorLabel) || '',
    message: asText(entry.message),
    createdAt: entry.createdAt || entry.created_at || new Date().toISOString(),
  };
}

function normalizeReplies(value: any) {
  return Array.isArray(value) ? value.map(normalizeReply).filter(Boolean) : [];
}

function normalizeTicket(row: any) {
  return {
    id: asText(row.id) || crypto.randomUUID(),
    workspaceId: row.workspace_id ? String(row.workspace_id) : null,
    ownerId: asText(row.owner_id),
    ownerEmail: asText(row.owner_email) || null,
    kind: asText(row.kind) || 'support',
    subject: asText(row.subject),
    message: asText(row.message),
    status: asText(row.status) || 'new',
    source: asText(row.source) || 'app',
    adminReply: asText(row.admin_reply) || null,
    replies: normalizeReplies(row.replies),
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || row.created_at || null,
    closedAt: row.closed_at || null,
  };
}

async function buildTicketQuery(req: any, workspaceId: string) {
  const identity = await requireRequestIdentity(req);
  const includeAll = asText(req.query?.includeAll) === '1';
  const ownerId = asText(req.query?.ownerId) || identity.userId;
  const ownerEmail = asText(req.query?.ownerEmail) || identity.email;
  const status = asText(req.query?.status);
  const kind = asText(req.query?.kind || req.query?.kindFilter || req.query?.ticketKind);
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

function routeKind(req: any, body: any) {
  const raw = req?.query?.route ?? req?.query?.kind ?? body?.routeKind ?? '';
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

async function handleForward(req: any, res: any, body: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const supportForwardEmail = process.env.SUPPORT_FORWARD_EMAIL;
  const supportFromEmail = process.env.SUPPORT_FROM_EMAIL || 'Close Flow <onboarding@resend.dev>';

  const kind = asString(body.kind) || 'support';
  const subject = asString(body.subject) || 'Nowe zgłoszenie closeflow';
  const message = asString(body.message) || 'Brak treści';
  const ownerEmail = asString(body.ownerEmail) || 'brak';
  const ownerId = asString(body.ownerId) || 'brak';
  const workspaceId = asString(await resolveRequestWorkspaceId(req)) || 'brak';

  if (!resendApiKey || !supportForwardEmail) {
    res.status(200).json({ forwarded: false, reason: 'EMAIL_NOT_CONFIGURED' });
    return;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: supportFromEmail,
        to: [supportForwardEmail],
        subject: `[closeflow] ${kind.toUpperCase()} • ${subject}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>Nowe zgłoszenie z aplikacji closeflow</h2>
            <p><strong>Kategoria:</strong> ${escapeHtml(kind)}</p>
            <p><strong>Temat:</strong> ${escapeHtml(subject)}</p>
            <p><strong>Użytkownik:</strong> ${escapeHtml(ownerEmail)}</p>
            <p><strong>Owner ID:</strong> ${escapeHtml(ownerId)}</p>
            <p><strong>Workspace ID:</strong> ${escapeHtml(workspaceId)}</p>
            <hr />
            <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      res.status(200).json({ forwarded: false, reason: 'EMAIL_PROVIDER_ERROR', details: responseText });
      return;
    }

    res.status(200).json({ forwarded: true });
  } catch (error: any) {
    res.status(200).json({ forwarded: false, reason: 'EMAIL_REQUEST_FAILED', details: error?.message || 'UNKNOWN' });
  }
}

async function handleRequests(req: any, res: any, body: any) {
  const workspaceId = await resolveRequestWorkspaceId(req);

  if (req.method === 'GET') {
    if (!workspaceId) { res.status(401).json({ error: 'SUPPORT_WORKSPACE_REQUIRED' }); return; }
    const result = await selectFirstAvailable([await buildTicketQuery(req, workspaceId)]);
    res.status(200).json((result.data || []).map(normalizeTicket));
    return;
  }

  if (req.method === 'POST') {
    const identity = await requireRequestIdentity(req);
    const subject = asText(body.subject);
    const message = asText(body.message);
    const ownerId = asText(body.ownerId) || identity.userId;
    const ownerEmail = asText(body.ownerEmail) || identity.email;
    if (!subject || !message || !workspaceId) { res.status(400).json({ error: 'SUPPORT_REQUEST_REQUIRED_FIELDS_MISSING' }); return; }
    const payload = {
      workspace_id: workspaceId,
      owner_id: ownerId || null,
      owner_email: ownerEmail || null,
      kind: asText(body.kind) || 'support',
      subject,
      message,
      status: 'new',
      source: 'app',
      admin_reply: null,
      replies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      closed_at: null,
    };
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
      const nextReply = normalizeReply({
        id: crypto.randomUUID(),
        authorType: actorType,
        authorLabel: actorType === 'admin' ? 'Support' : 'Ty',
        message,
        createdAt: new Date().toISOString(),
      });
      const nextReplies = [...normalizeReplies(current.replies), nextReply];
      const nextStatus = actorType === 'admin' ? 'answered' : 'in_progress';
      const payload = {
        replies: nextReplies,
        status: nextStatus,
        admin_reply: actorType === 'admin' ? message : current.adminReply,
        updated_at: new Date().toISOString(),
        closed_at: null,
      };
      const updatedRows = await updateById('support_requests', id, payload);
      const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { ...currentRow, ...payload };
      res.status(200).json(normalizeTicket(updated));
      return;
    }

    if (action === 'status' || asText(body.status)) {
      const status = asText(body.status) || 'new';
      const payload = {
        status,
        updated_at: new Date().toISOString(),
        closed_at: status === 'closed' ? new Date().toISOString() : null,
      };
      const updatedRows = await updateById('support_requests', id, payload);
      const updated = Array.isArray(updatedRows) && updatedRows[0] ? updatedRows[0] : { ...currentRow, ...payload };
      res.status(200).json(normalizeTicket(updated));
      return;
    }

    res.status(400).json({ error: 'SUPPORT_REQUEST_PATCH_ACTION_REQUIRED' });
    return;
  }

  res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
}

export default async function handler(req: any, res: any) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const kind = routeKind(req, body);

  if (kind === 'forward') {
    await handleForward(req, res, body);
    return;
  }

  if (kind === 'requests') {
    await handleRequests(req, res, body);
    return;
  }

  res.status(400).json({ error: 'SUPPORT_KIND_REQUIRED' });
}
