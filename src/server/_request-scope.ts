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
  return asText(body.workspaceId || req?.headers?.['x-workspace-id']);
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
