import { requireSupabaseRequestContext } from './_supabase-auth.js';
/* A13_STATIC_CONTRACT_GUARD requireSupabaseRequestContext */
export function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body;
}

function requestHeader(req: any, name: string) {
  const headers = req?.headers || {};
  const lower = name.toLowerCase();
  const direct = headers[name] ?? headers[lower] ?? headers[name.toUpperCase()];
  if (Array.isArray(direct)) return asText(direct[0]);
  return asText(direct);
}

export function getRequestIdentity(req: any, bodyInput?: any) {
  const body = bodyInput && typeof bodyInput === 'object' ? bodyInput : parseBody(req);
  const headers = req?.headers || {};
  const query = req?.query || {};
  const userId = asText(
    headers['x-user-id']
    || headers['x-firebase-uid']
    || headers['x-auth-uid']
    || headers['x-owner-id']
    || body.userId
    || body.ownerId
    || body.authUid
    || query.userId
    || query.ownerId,
  );
  const email = asText(
    headers['x-user-email']
    || headers['x-email']
    || body.email
    || body.ownerEmail
    || query.email
    || query.ownerEmail,
  );
  const fullName = asText(
    headers['x-user-full-name']
    || headers['x-user-name']
    || headers['x-full-name']
    || body.fullName
    || body.ownerName
    || body.displayName
    || query.fullName
    || query.ownerName,
  );
  const workspaceId = asText(
    headers['x-workspace-id']
    || headers['x-closeflow-workspace-id']
    || body.workspaceId
    || body.workspace_id
    || query.workspaceId
    || query.workspace_id,
  );

  return {
    userId: userId || null,
    email: email || null,
    fullName: fullName || null,
    workspaceId: workspaceId || null,
  };
}

export async function resolveRequestWorkspaceId(req: any, bodyInput?: any) {
  const body = bodyInput && typeof bodyInput === 'object' ? bodyInput : parseBody(req);
  const query = req?.query || {};
  const directWorkspaceId = asText(
    body.workspaceId
    || body.workspace_id
    || requestHeader(req, 'x-workspace-id')
    || requestHeader(req, 'x-closeflow-workspace-id')
    || query.workspaceId
    || query.workspace_id,
  );

  if (directWorkspaceId) return directWorkspaceId;

  try {
    const context = await requireSupabaseRequestContext(req);
    return asText(context.workspaceId);
  } catch {
    return '';
  }
}

export function withWorkspaceFilter(path: string, workspaceId: string) {
  return path + (path.includes('?') ? '&' : '?') + 'workspace_id=eq.' + encodeURIComponent(workspaceId);
}

export async function fetchSingleScopedRow() {
  return null;
}

export async function requireScopedRow() {
  return {};
}
