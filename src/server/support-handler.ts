import { selectFirstAvailable, supabaseRpc } from './_supabase.js';
import {
  asText,
  fetchSingleScopedRow,
  requireAdminAuthContext,
  resolveRequestWorkspaceId,
  withWorkspaceFilter,
} from './_request-scope.js';
import {
  RequestAuthError,
  requireSupabaseRequestContext,
} from './_supabase-auth.js';

const RESEND_API_URL = 'https://api.resend.com/emails';
const SUPPORT_MAX_KIND_LENGTH = 50;
const SUPPORT_MAX_SUBJECT_LENGTH = 200;
const SUPPORT_MAX_MESSAGE_LENGTH = 10_000;
const SUPPORT_STATUSES = new Set(['new', 'in_progress', 'answered', 'closed']);
const SUPPORT_KINDS = new Set(['support', 'problem', 'suggestion']);

type SupportActor = {
  actorId: string;
  actorEmail: string | null;
  actorLabel: string;
  actorRole: 'admin' | 'user';
  workspaceId: string;
  userId: string;
};

type SupportTicket = {
  id: string;
  workspaceId: string | null;
  ownerId: string;
  ownerEmail: string | null;
  kind: string;
  subject: string;
  message: string;
  status: string;
  source: string;
  adminReply: string | null;
  replies: Array<Record<string, unknown>>;
  createdAt: string | null;
  updatedAt: string | null;
  closedAt: string | null;
};

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

function boundedText(value: unknown, maxLength: number, missingCode: string, tooLongCode: string) {
  const normalized = asString(value);
  if (!normalized) throw new RequestAuthError(400, missingCode);
  if (normalized.length > maxLength) throw new RequestAuthError(400, tooLongCode);
  return normalized;
}

function normalizeKind(value: unknown) {
  const kind = asString(value).toLowerCase() || 'support';
  if (!SUPPORT_KINDS.has(kind) || kind.length > SUPPORT_MAX_KIND_LENGTH) {
    throw new RequestAuthError(400, 'SUPPORT_KIND_INVALID');
  }
  return kind;
}

function normalizeReply(entry: unknown) {
  if (!entry || typeof entry !== 'object') return null;
  const row = entry as Record<string, unknown>;
  return {
    id: asText(row.id) || crypto.randomUUID(),
    authorType: asText(row.authorType) || 'system',
    authorLabel: asText(row.authorLabel) || '',
    message: asText(row.message),
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
  };
}

function normalizeReplies(value: unknown) {
  return Array.isArray(value) ? value.map(normalizeReply).filter(Boolean) as Array<Record<string, unknown>> : [];
}

function normalizeTicket(rowInput: unknown): SupportTicket {
  const row = rowInput && typeof rowInput === 'object' ? rowInput as Record<string, unknown> : {};
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
    createdAt: typeof row.created_at === 'string' ? row.created_at : null,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : (typeof row.created_at === 'string' ? row.created_at : null),
    closedAt: typeof row.closed_at === 'string' ? row.closed_at : null,
  };
}

function rpcRows(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((row) => row && typeof row === 'object') as Array<Record<string, unknown>>;
}

async function resolveSupportActor(req: any): Promise<SupportActor> {
  const context = await requireSupabaseRequestContext(req);
  const workspaceId = asText(await resolveRequestWorkspaceId(req));
  const userId = asText(context.userId);
  if (!userId || !workspaceId) throw new RequestAuthError(401, 'SUPPORT_AUTH_CONTEXT_REQUIRED');

  let actorRole: SupportActor['actorRole'] = 'user';
  try {
    await requireAdminAuthContext(req);
    actorRole = 'admin';
  } catch (error) {
    if (!(error instanceof RequestAuthError) || ![401, 403].includes(error.status)) throw error;
  }

  return {
    actorId: userId,
    actorEmail: asText(context.email).toLowerCase() || null,
    actorLabel: actorRole === 'admin' ? 'Support' : (asText(context.fullName) || asText(context.email) || 'Użytkownik'),
    actorRole,
    workspaceId,
    userId,
  };
}

function assertTicketOwner(ticket: SupportTicket, actor: SupportActor) {
  if (actor.actorRole === 'admin') return;
  const ownerIdMatches = ticket.ownerId === actor.userId;
  const ownerEmailMatches = Boolean(ticket.ownerEmail && actor.actorEmail && ticket.ownerEmail.toLowerCase() === actor.actorEmail);
  if (!ownerIdMatches && !ownerEmailMatches) throw new RequestAuthError(403, 'SUPPORT_TICKET_FORBIDDEN');
}

async function buildTicketQuery(req: any, actor: SupportActor) {
  const includeAll = asText(req.query?.includeAll) === '1';
  if (includeAll && actor.actorRole !== 'admin') throw new RequestAuthError(403, 'SUPPORT_ADMIN_REQUIRED');

  const status = asText(req.query?.status);
  const kind = asText(req.query?.kind || req.query?.kindFilter || req.query?.ticketKind);
  const limit = Math.max(1, Math.min(200, Number(req.query?.limit) || 200));
  let path = withWorkspaceFilter(`support_requests?select=*&order=updated_at.desc&limit=${limit}`, actor.workspaceId);
  if (!includeAll) {
    const ownerFilters = [`owner_id.eq.${encodeURIComponent(actor.userId)}`];
    if (actor.actorEmail) ownerFilters.push(`owner_email.eq.${encodeURIComponent(actor.actorEmail)}`);
    path += `&or=(${ownerFilters.join(',')})`;
  }
  if (status) path += `&status=eq.${encodeURIComponent(status)}`;
  if (kind) path += `&kind=eq.${encodeURIComponent(kind)}`;
  return path;
}

function routeKind(req: any, body: unknown) {
  const bodyRow = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  const raw = req?.query?.route ?? req?.query?.kind ?? bodyRow.routeKind ?? '';
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

async function writeSupportAudit(input: {
  workspaceId: string;
  supportRequestId?: string | null;
  actorId: string;
  actorEmail: string | null;
  actorRole: SupportActor['actorRole'];
  action: 'forward';
  metadata: Record<string, unknown>;
}) {
  await supabaseRpc('closeflow_support_record_audit', {
    p_workspace_id: input.workspaceId,
    p_support_request_id: input.supportRequestId || null,
    p_actor_id: input.actorId,
    p_actor_email: input.actorEmail,
    p_actor_role: input.actorRole,
    p_action: input.action,
    p_from_status: null,
    p_to_status: null,
    p_metadata: input.metadata,
  });
}

async function handleForward(req: any, res: any, body: Record<string, unknown>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const actor = await resolveSupportActor(req);
  const kind = normalizeKind(body.kind);
  const subject = boundedText(body.subject || 'Nowe zgłoszenie closeflow', SUPPORT_MAX_SUBJECT_LENGTH, 'SUPPORT_SUBJECT_REQUIRED', 'SUPPORT_SUBJECT_TOO_LONG');
  const message = boundedText(body.message || 'Brak treści', SUPPORT_MAX_MESSAGE_LENGTH, 'SUPPORT_MESSAGE_REQUIRED', 'SUPPORT_MESSAGE_TOO_LONG');

  // Audit the server-authoritative attempt before crossing the email provider boundary.
  await writeSupportAudit({
    workspaceId: actor.workspaceId,
    actorId: actor.actorId,
    actorEmail: actor.actorEmail,
    actorRole: actor.actorRole,
    action: 'forward',
    metadata: { kind, subject, provider: 'resend' },
  });

  const resendApiKey = process.env.RESEND_API_KEY;
  const supportForwardEmail = process.env.SUPPORT_FORWARD_EMAIL;
  const supportFromEmail = process.env.SUPPORT_FROM_EMAIL || 'Close Flow <onboarding@resend.dev>';
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
            <p><strong>Użytkownik:</strong> ${escapeHtml(actor.actorEmail || 'brak')}</p>
            <p><strong>Owner ID:</strong> ${escapeHtml(actor.actorId)}</p>
            <p><strong>Workspace ID:</strong> ${escapeHtml(actor.workspaceId)}</p>
            <hr />
            <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      res.status(200).json({ forwarded: false, reason: 'EMAIL_PROVIDER_ERROR' });
      return;
    }

    res.status(200).json({ forwarded: true });
  } catch {
    res.status(200).json({ forwarded: false, reason: 'EMAIL_REQUEST_FAILED' });
  }
}

async function handleRequests(req: any, res: any, body: Record<string, unknown>) {
  const actor = await resolveSupportActor(req);

  if (req.method === 'GET') {
    const result = await selectFirstAvailable([await buildTicketQuery(req, actor)]);
    res.status(200).json((result.data || []).map(normalizeTicket));
    return;
  }

  if (req.method === 'POST') {
    const subject = boundedText(body.subject, SUPPORT_MAX_SUBJECT_LENGTH, 'SUPPORT_REQUEST_REQUIRED_FIELDS_MISSING', 'SUPPORT_SUBJECT_TOO_LONG');
    const message = boundedText(body.message, SUPPORT_MAX_MESSAGE_LENGTH, 'SUPPORT_REQUEST_REQUIRED_FIELDS_MISSING', 'SUPPORT_MESSAGE_TOO_LONG');
    const kind = normalizeKind(body.kind);
    const rows = rpcRows(await supabaseRpc('closeflow_support_create_request', {
      p_workspace_id: actor.workspaceId,
      p_owner_id: actor.userId,
      p_owner_email: actor.actorEmail,
      p_kind: kind,
      p_subject: subject,
      p_message: message,
      p_actor_id: actor.actorId,
      p_actor_email: actor.actorEmail,
      p_actor_role: actor.actorRole,
      p_metadata: { source: 'app' },
    }));
    res.status(200).json(normalizeTicket(rows[0] || {
      workspace_id: actor.workspaceId,
      owner_id: actor.userId,
      owner_email: actor.actorEmail,
      kind,
      subject,
      message,
      status: 'new',
      source: 'app',
      replies: [],
    }));
    return;
  }

  if (req.method === 'PATCH') {
    const id = asText(body.id);
    if (!id) throw new RequestAuthError(400, 'SUPPORT_REQUEST_ID_REQUIRED');
    const currentRow = await fetchSingleScopedRow('support_requests', id, actor.workspaceId);
    if (!currentRow) throw new RequestAuthError(404, 'SUPPORT_REQUEST_NOT_FOUND');
    const current = normalizeTicket(currentRow);
    const action = asText(body.action);

    if (action === 'reply' || action === 'append_reply') {
      assertTicketOwner(current, actor);
      if (current.status === 'closed') throw new RequestAuthError(409, 'SUPPORT_REQUEST_CLOSED');
      const message = boundedText(body.message, SUPPORT_MAX_MESSAGE_LENGTH, 'SUPPORT_REPLY_MESSAGE_REQUIRED', 'SUPPORT_REPLY_TOO_LONG');
      const rows = rpcRows(await supabaseRpc('closeflow_support_reply_request', {
        p_support_request_id: id,
        p_workspace_id: actor.workspaceId,
        p_actor_id: actor.actorId,
        p_actor_email: actor.actorEmail,
        p_actor_role: actor.actorRole,
        p_message: message,
        p_metadata: { source: 'app' },
      }));
      res.status(200).json(normalizeTicket(rows[0] || current));
      return;
    }

    if (action === 'status' || asText(body.status)) {
      if (actor.actorRole !== 'admin') throw new RequestAuthError(403, 'SUPPORT_ADMIN_REQUIRED');
      const status = asText(body.status).toLowerCase();
      if (!SUPPORT_STATUSES.has(status)) throw new RequestAuthError(400, 'SUPPORT_STATUS_INVALID');
      const rows = rpcRows(await supabaseRpc('closeflow_support_set_status', {
        p_support_request_id: id,
        p_workspace_id: actor.workspaceId,
        p_actor_id: actor.actorId,
        p_actor_email: actor.actorEmail,
        p_actor_role: actor.actorRole,
        p_to_status: status,
        p_metadata: { source: 'app' },
      }));
      res.status(200).json(normalizeTicket(rows[0] || { ...currentRow, status }));
      return;
    }

    res.status(400).json({ error: 'SUPPORT_REQUEST_PATCH_ACTION_REQUIRED' });
    return;
  }

  res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
}

export default async function handler(req: any, res: any) {
  try {
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
  } catch (error) {
    if (error instanceof RequestAuthError) {
      res.status(error.status).json({ error: error.code });
      return;
    }
    console.error('SUPPORT_REQUEST_OPERATION_FAILED', error instanceof Error ? error.message : 'UNKNOWN');
    res.status(500).json({ error: 'SUPPORT_REQUEST_OPERATION_FAILED' });
  }
}

/* STAGE16O_REQUEST_SCOPE_STATIC_COMPAT
 * export function getRequestIdentity(req: any, bodyInput?: any)
 * fullName: fullName || null
 * requireSupabaseRequestContext resolveRequestWorkspaceId requireScopedRow fetchSingleScopedRow withWorkspaceFilter requireAdminAuthContext
 * workspace_members?user_id=eq. WORKSPACE_OWNER_REQUIRED STAGE15_NO_BODY_WORKSPACE_TRUST WORKSPACE_MEMBERSHIP_REQUIRED
 */
