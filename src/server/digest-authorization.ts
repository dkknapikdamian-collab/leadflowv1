import { selectFirstAvailable } from './_supabase.js';
import { RequestAuthError } from './_supabase-auth.js';
import { requireRequestIdentity, resolveRequestWorkspaceId, resolveRequestedWorkspaceId } from './_request-scope.js';

type DigestWorkspaceRow = Record<string, unknown>;

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeEmail(value: unknown) {
  return asText(value).toLowerCase();
}

function requestHeader(req: any, name: string) {
  const headers = req?.headers || {};
  return asText(headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()]);
}

function extractBearerToken(req: any) {
  const authorization = requestHeader(req, 'authorization');
  return authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() || '';
}

function requestedBodyWorkspaceId(body: Record<string, unknown>) {
  return resolveRequestedWorkspaceId(body);
}

function requestedBodyRecipient(body: Record<string, unknown>) {
  return normalizeEmail(body.recipientEmail ?? body.recipient_email);
}

function rowWorkspaceId(row: DigestWorkspaceRow) {
  return asText(row.id ?? row.workspace_id ?? row.workspaceId);
}

function configuredRecipient(row: DigestWorkspaceRow) {
  return normalizeEmail(row.daily_digest_recipient_email ?? row.dailyDigestRecipientEmail);
}

export function assertDigestWorkspaceScope(input: {
  authorizedWorkspaceId: unknown;
  requestedWorkspaceId?: unknown;
  workspaceRow?: DigestWorkspaceRow | null;
  requestedRecipientEmail?: unknown;
  requesterEmail?: unknown;
}) {
  const authorizedWorkspaceId = asText(input.authorizedWorkspaceId);
  if (!authorizedWorkspaceId) {
    throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');
  }

  const requestedWorkspaceId = asText(input.requestedWorkspaceId);
  if (requestedWorkspaceId && requestedWorkspaceId !== authorizedWorkspaceId) {
    throw new RequestAuthError(403, 'DIGEST_WORKSPACE_SCOPE_MISMATCH');
  }

  const workspaceRow = input.workspaceRow || null;
  if (!workspaceRow || rowWorkspaceId(workspaceRow) !== authorizedWorkspaceId) {
    throw new RequestAuthError(404, 'DIGEST_WORKSPACE_NOT_FOUND');
  }

  const recipientEmail = configuredRecipient(workspaceRow) || normalizeEmail(input.requesterEmail);
  const requestedRecipientEmail = normalizeEmail(input.requestedRecipientEmail);
  if (requestedRecipientEmail && requestedRecipientEmail !== recipientEmail) {
    throw new RequestAuthError(403, 'DIGEST_RECIPIENT_SCOPE_MISMATCH');
  }

  return {
    workspaceId: authorizedWorkspaceId,
    workspaceRow,
    recipientEmail: recipientEmail || null,
  };
}

export async function getInteractiveDigestScope(req: any, body: Record<string, unknown>) {
  const identity = await requireRequestIdentity(req, body);
  const authorizedWorkspaceId = await resolveRequestWorkspaceId(req, body);
  const workspaceResult = await selectFirstAvailable([
    `workspaces?select=*&id=eq.${encodeURIComponent(authorizedWorkspaceId)}&limit=1`,
  ]);
  const workspaceRow = Array.isArray(workspaceResult.data) && workspaceResult.data[0]
    ? workspaceResult.data[0] as DigestWorkspaceRow
    : null;

  return {
    ...assertDigestWorkspaceScope({
      authorizedWorkspaceId,
      requestedWorkspaceId: requestedBodyWorkspaceId(body),
      workspaceRow,
      requestedRecipientEmail: requestedBodyRecipient(body),
      requesterEmail: identity.email,
    }),
    requesterEmail: normalizeEmail(identity.email),
  };
}

export function isDigestCronAuthorized(req: any) {
  const cronSecret = asText(process.env.CRON_SECRET);
  if (!cronSecret) return false;

  const providedSecret =
    requestHeader(req, 'x-cron-secret')
    || extractBearerToken(req);

  // x-vercel-cron is a routing hint, not a credential. CRON_SECRET remains mandatory.
  return providedSecret === cronSecret;
}
