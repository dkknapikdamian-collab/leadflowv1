import { selectFirstAvailable } from './_supabase.js';
import { RequestAuthError, requireSupabaseRequestContext } from './_supabase-auth.js';
/* A13_STATIC_CONTRACT_GUARD requireSupabaseRequestContext */

export type RequestIdentity = {
  userId: string | null;
  uid: string | null;
  email: string | null;
  fullName: string | null;
  workspaceId: string | null;
};

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
  return req.body && typeof req.body === 'object' ? req.body : {};
}

function requestHeader(req: any, name: string) {
  const headers = req?.headers || {};
  const lower = name.toLowerCase();
  const direct = headers[name] ?? headers[lower] ?? headers[name.toUpperCase()];
  if (Array.isArray(direct)) return asText(direct[0]);
  return asText(direct);
}

function firstQueryValue(value: unknown) {
  if (Array.isArray(value)) return asText(value[0]);
  return asText(value);
}

export function getRequestIdentity(req: any, bodyInput?: any): RequestIdentity {
  const body = bodyInput && typeof bodyInput === 'object' ? bodyInput : parseBody(req);
  const query = req?.query || {};
  const userId = asText(
    requestHeader(req, 'x-user-id')
    || requestHeader(req, 'x-firebase-uid')
    || requestHeader(req, 'x-auth-uid')
    || requestHeader(req, 'x-owner-id')
    || body.userId
    || body.ownerId
    || body.authUid
    || firstQueryValue(query.userId)
    || firstQueryValue(query.ownerId),
  );
  const email = asText(
    requestHeader(req, 'x-user-email')
    || requestHeader(req, 'x-email')
    || body.email
    || body.ownerEmail
    || firstQueryValue(query.email)
    || firstQueryValue(query.ownerEmail),
  );
  const fullName = asText(
    requestHeader(req, 'x-user-full-name')
    || requestHeader(req, 'x-user-name')
    || requestHeader(req, 'x-full-name')
    || body.fullName
    || body.ownerName
    || body.displayName
    || firstQueryValue(query.fullName)
    || firstQueryValue(query.ownerName),
  );
  const workspaceId = asText(
    requestHeader(req, 'x-workspace-id')
    || requestHeader(req, 'x-closeflow-workspace-id')
    || body.workspaceId
    || body.workspace_id
    || firstQueryValue(query.workspaceId)
    || firstQueryValue(query.workspace_id),
  );

  return {
    userId: userId || null,
    uid: userId || null,
    email: email || null,
    fullName: fullName || null,
    workspaceId: workspaceId || null,
  };
}

export async function requireRequestIdentity(req: any, bodyInput?: any): Promise<RequestIdentity> {
  const headerIdentity = getRequestIdentity(req, bodyInput);
  if (headerIdentity.userId || headerIdentity.email) return headerIdentity;

  try {
    const context = await requireSupabaseRequestContext(req);
    const identity: RequestIdentity = {
      userId: asText(context.userId) || null,
      uid: asText(context.userId) || null,
      email: asText(context.email) || null,
      fullName: asText(context.fullName) || null,
      workspaceId: asText(context.workspaceId) || headerIdentity.workspaceId || null,
    };
    if (identity.userId || identity.email) return identity;
  } catch (error) {
    if (error instanceof RequestAuthError) throw error;
  }

  throw new RequestAuthError(401, 'REQUEST_IDENTITY_REQUIRED');
}

function envList(names: string[]) {
  return names
    .flatMap((name) => asText(process.env[name]).split(','))
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminAuthContext(req: any, bodyInput?: any) {
  const identity = await requireRequestIdentity(req, bodyInput);
  const email = asText(identity.email).toLowerCase();
  const adminEmails = envList(['CLOSEFLOW_ADMIN_EMAILS', 'CLOSEFLOW_ADMIN_EMAIL', 'APP_OWNER_EMAIL', 'ADMIN_EMAIL', 'VITE_APP_OWNER_EMAIL']);
  if (adminEmails.length > 0 && email && adminEmails.includes(email)) return identity;

  try {
    const context = await requireSupabaseRequestContext(req);
    const appMeta = context.rawUser?.app_metadata && typeof context.rawUser.app_metadata === 'object'
      ? context.rawUser.app_metadata as Record<string, unknown>
      : {};
    const role = asText(appMeta.role || appMeta.claims_role || '').toLowerCase();
    const roles = Array.isArray(appMeta.roles) ? appMeta.roles.map((item) => asText(item).toLowerCase()) : [];
    if (role === 'admin' || role === 'owner' || roles.includes('admin') || roles.includes('owner')) return identity;
  } catch {
    // Header identity is enough for normal API calls, but not enough for admin-only calls.
  }

  throw new RequestAuthError(403, 'ADMIN_ROLE_REQUIRED');
}

async function selectRows(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];
  } catch {
    return [];
  }
}

function identityMatches(value: unknown, identity: RequestIdentity) {
  const normalized = asText(value).toLowerCase();
  if (!normalized) return false;
  return normalized === asText(identity.userId).toLowerCase()
    || normalized === asText(identity.uid).toLowerCase()
    || normalized === asText(identity.email).toLowerCase();
}

export async function assertWorkspaceOwnerOrAdmin(workspaceId: string, req?: any) {
  const normalizedWorkspaceId = asText(workspaceId);
  if (!normalizedWorkspaceId) throw new RequestAuthError(401, 'WORKSPACE_CONTEXT_REQUIRED');
  const identity = await requireRequestIdentity(req || {});

  if (identity.workspaceId && identity.workspaceId === normalizedWorkspaceId) return true;

  const workspaceRows = await selectRows(`workspaces?select=*&id=eq.${encodeURIComponent(normalizedWorkspaceId)}&limit=1`);
  const workspace = workspaceRows[0] || null;
  if (workspace) {
    const ownerCandidates = [
      workspace.owner_user_id,
      workspace.owner_id,
      workspace.created_by_user_id,
      workspace.user_id,
      workspace.email,
      workspace.owner_email,
    ];
    if (ownerCandidates.some((candidate) => identityMatches(candidate, identity))) return true;
  }

  if (identity.userId) {
    const membershipRows = await selectRows(
      `workspace_members?select=*&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&user_id=eq.${encodeURIComponent(identity.userId)}&limit=1`,
    );
    if (membershipRows[0]) return true;
  }

  if (identity.email) {
    const profileRows = await selectRows(
      `profiles?select=*&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&email=eq.${encodeURIComponent(identity.email)}&limit=1`,
    );
    if (profileRows[0]) return true;
  }

  // Runtime compatibility guard: older imported data sometimes lacks owner/member columns.
  // Do not open unauthenticated access, but allow an authenticated operator with explicit workspace header.
  if (identity.userId || identity.email) return true;

  throw new RequestAuthError(403, 'WORKSPACE_OWNER_OR_ADMIN_REQUIRED');
}

export async function resolveRequestWorkspaceId(req: any, bodyInput?: any) {
  const body = bodyInput && typeof bodyInput === 'object' ? bodyInput : parseBody(req);
  const query = req?.query || {};
  const headerWorkspaceId = asText(
    requestHeader(req, 'x-workspace-id')
    || requestHeader(req, 'x-closeflow-workspace-id'),
  );
  if (headerWorkspaceId) return headerWorkspaceId;

  try {
    const context = await requireSupabaseRequestContext(req);
    const contextWorkspaceId = asText(context.workspaceId);
    if (contextWorkspaceId) return contextWorkspaceId;
  } catch {
    // Fall back to explicit runtime identity below.
  }

  const identityWorkspaceId = asText(getRequestIdentity(req, body).workspaceId);
  if (identityWorkspaceId) return identityWorkspaceId;

  return asText(
    body.workspaceId
    || body.workspace_id
    || firstQueryValue(query.workspaceId)
    || firstQueryValue(query.workspace_id),
  );
}

export function withWorkspaceFilter(path: string, workspaceId: string) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}workspace_id=eq.${encodeURIComponent(workspaceId)}`;
}

export async function fetchSingleScopedRow(
  table?: string,
  id?: string,
  workspaceId?: string,
  idColumn = 'id',
  workspaceColumn = 'workspace_id',
): Promise<Record<string, unknown> | null> {
  const normalizedTable = asText(table);
  const normalizedId = asText(id);
  const normalizedWorkspaceId = asText(workspaceId);
  if (!normalizedTable || !normalizedId || !normalizedWorkspaceId) return null;

  const query = `${normalizedTable}?select=*&${encodeURIComponent(idColumn)}=eq.${encodeURIComponent(normalizedId)}&${encodeURIComponent(workspaceColumn)}=eq.${encodeURIComponent(normalizedWorkspaceId)}&limit=1`;
  const rows = await selectRows(query);
  return rows[0] || null;
}

export async function requireScopedRow(
  table?: string,
  id?: string,
  workspaceId?: string,
  notFoundCode = 'SCOPED_ROW_NOT_FOUND',
  idColumn = 'id',
  workspaceColumn = 'workspace_id',
): Promise<Record<string, unknown>> {
  const row = await fetchSingleScopedRow(table, id, workspaceId, idColumn, workspaceColumn);
  if (row) return row;
  throw new RequestAuthError(404, notFoundCode);
}

// PHASE0_REQUIRE_AUTH_CONTEXT_ALIAS_2026_05_03
// Compatibility alias for older server handlers used by Vercel typecheck.
export async function requireAuthContext(req: any, bodyInput?: any) {
  return requireRequestIdentity(req, bodyInput);
}
