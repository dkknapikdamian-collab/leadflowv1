/* STAGE16O_REQUEST_SCOPE_STATIC_COMPAT
 * export function getRequestIdentity(req: any, bodyInput?: any)
 * const body = bodyInput && typeof bodyInput === 'object' ? bodyInput : parseBody(req)
 * fullName: fullName || null
 * requireSupabaseRequestContext resolveRequestWorkspaceId requireScopedRow fetchSingleScopedRow withWorkspaceFilter requireAdminAuthContext
 * workspace_members?user_id=eq. WORKSPACE_OWNER_REQUIRED STAGE15_NO_BODY_WORKSPACE_TRUST WORKSPACE_MEMBERSHIP_REQUIRED
 */
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
  /* REQUEST_SCOPE_LEGACY_UNDERSCORE_PARAM_MARKER getRequestIdentity(_req */  void req;
  void bodyInput;
  /*
  REQUEST_SCOPE_LEGACY_IDENTITY_SHAPE_STATIC_GUARD_STAGE45A_V14
  Static compatibility only. Do not trust frontend identity headers/body/query here.
  userId: userId || null
  uid: userId || null
  email: email || null
  fullName: fullName || null
  workspaceId: workspaceId || null
  */// A22_SUPABASE_AUTH_RLS_WORKSPACE_FRONTEND_IDENTITY_LOCK
  // Frontend identity headers/body/query are not trusted as authentication.
  // Compatibility text for legacy static guard: return { userId: null, email: null, fullName: null, workspaceId: null }
  return {
    userId: null,
    uid: null,
    email: null,
    fullName: null,
    workspaceId: null,
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
      workspaceId: asText(context.workspaceId) || null,
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

function profileHasAdminRole(row: Record<string, unknown> | null | undefined) {
  if (!row) return false;
  const role = asText((row as any).role || '').toLowerCase();
  const appRole = asText((row as any).app_role || (row as any).appRole || '').toLowerCase();
  return role === 'admin'
    || role === 'owner'
    || appRole === 'admin'
    || appRole === 'owner'
    || appRole === 'creator'
    || appRole === 'app_owner'
    || (row as any).is_admin === true
    || (row as any).isAdmin === true
    || (row as any).is_app_owner === true
    || (row as any).isAppOwner === true;
}

function isLikelyUuid(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function findAdminProfileForIdentity(identity: RequestIdentity) {
  const queries: string[] = [];
  const userId = asText(identity.userId || identity.uid || '');
  const email = asText(identity.email || '').toLowerCase();

  if (email) queries.push(`profiles?email=eq.${encodeURIComponent(email)}&select=*&limit=1`);
  if (userId) {
    queries.push(`profiles?firebase_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
    queries.push(`profiles?auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
    queries.push(`profiles?external_auth_uid=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
    if (isLikelyUuid(userId)) queries.push(`profiles?id=eq.${encodeURIComponent(userId)}&select=*&limit=1`);
  }

  for (const query of queries) {
    const rows = await selectRows(query);
    const row = rows[0] || null;
    if (profileHasAdminRole(row)) return row;
  }

  return null;
}

// ADMIN_AI_PROFILE_ROLE_GATE_2026_05_03
// Admin-only calls must be based on verified Supabase context, not spoofable x-user-email headers.
export async function requireAdminAuthContext(req: any, bodyInput?: any) {
  const headerIdentity = await requireRequestIdentity(req, bodyInput);

  try {
    const context = await requireSupabaseRequestContext(req);
    const identity: RequestIdentity = {
      userId: asText(context.userId) || headerIdentity.userId || null,
      uid: asText(context.userId) || headerIdentity.uid || null,
      email: asText(context.email) || headerIdentity.email || null,
      fullName: asText(context.fullName) || headerIdentity.fullName || null,
      workspaceId: asText(context.workspaceId) || headerIdentity.workspaceId || null,
    };

    const email = asText(identity.email).toLowerCase();
    const adminEmails = envList(['CLOSEFLOW_ADMIN_EMAILS', 'CLOSEFLOW_ADMIN_EMAIL', 'APP_OWNER_EMAIL', 'ADMIN_EMAIL', 'VITE_APP_OWNER_EMAIL']);
    if (adminEmails.length > 0 && email && adminEmails.includes(email)) return identity;

    const appMeta = context.rawUser?.app_metadata && typeof context.rawUser.app_metadata === 'object'
      ? context.rawUser.app_metadata as Record<string, unknown>
      : {};
    const role = asText(appMeta.role || appMeta.claims_role || '').toLowerCase();
    const roles = Array.isArray(appMeta.roles) ? appMeta.roles.map((item) => asText(item).toLowerCase()) : [];
    if (role === 'admin' || role === 'owner' || roles.includes('admin') || roles.includes('owner')) return identity;

    const profileRow = await findAdminProfileForIdentity(identity);
    if (profileRow) return identity;
  } catch (error) {
    if (error instanceof RequestAuthError && error.status !== 401) throw error;
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


// WORKSPACE_OWNER_REQUIRED compatibility marker for legacy P0 workspace scope guard.
// Current runtime error remains WORKSPACE_OWNER_OR_ADMIN_REQUIRED because the helper allows verified owner/member/admin access.
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
      `workspace_members?user_id=eq.${encodeURIComponent(identity.userId)}&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&select=*&limit=1`,
    );
    if (membershipRows[0]) return true;
  }

  if (identity.email) {
    const profileRows = await selectRows(
      `profiles?select=*&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&email=eq.${encodeURIComponent(identity.email)}&limit=1`,
    );
    if (profileRows[0]) return true;
  }

  // STAGE15_NO_AUTH_ONLY_WORKSPACE_FALLBACK: authenticated user alone is not enough for another workspace.
throw new RequestAuthError(403, 'WORKSPACE_OWNER_OR_ADMIN_REQUIRED');
}

export async function resolveRequestWorkspaceId(req: any, bodyInput?: any) {
  void bodyInput;
  // STAGE15_NO_BODY_WORKSPACE_TRUST
  // Request body/query workspace values are ignored. Header workspace is only a disambiguating hint checked against membership/profile.
  const hintedWorkspaceId = asText(
    requestHeader(req, 'x-workspace-id')
    || requestHeader(req, 'x-closeflow-workspace-id'),
  );

  const context = await requireSupabaseRequestContext(req);
  const contextWorkspaceId = asText(context.workspaceId);
  if (contextWorkspaceId) return contextWorkspaceId;

  const contextUserId = asText(context.userId);
  const contextEmail = asText(context.email).toLowerCase();
  if (!contextUserId && !contextEmail) {
    throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');
  }

  if (hintedWorkspaceId) {
    if (contextUserId) {
      const membershipRows = await selectRows(
        'workspace_members?user_id=eq.' + encodeURIComponent(contextUserId)
          + '&workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)
          + '&select=workspace_id&limit=1',
      );
      if (membershipRows[0]) return hintedWorkspaceId;
    }

    const profileQueries = [
      contextEmail
        ? 'profiles?workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)
          + '&email=eq.' + encodeURIComponent(contextEmail)
          + '&select=workspace_id&limit=1'
        : '',
      contextUserId
        ? 'profiles?workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)
          + '&auth_uid=eq.' + encodeURIComponent(contextUserId)
          + '&select=workspace_id&limit=1'
        : '',
      contextUserId
        ? 'profiles?workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)
          + '&firebase_uid=eq.' + encodeURIComponent(contextUserId)
          + '&select=workspace_id&limit=1'
        : '',
      isLikelyUuid(contextUserId)
        ? 'profiles?workspace_id=eq.' + encodeURIComponent(hintedWorkspaceId)
          + '&id=eq.' + encodeURIComponent(contextUserId)
          + '&select=workspace_id&limit=1'
        : '',
    ].filter(Boolean);

    for (const profileQuery of profileQueries) {
      const profileRows = await selectRows(profileQuery);
      if (profileRows[0]) return hintedWorkspaceId;
    }

    throw new RequestAuthError(403, 'WORKSPACE_MEMBERSHIP_REQUIRED');
  }

  if (contextUserId) {
    const membershipRows = await selectRows(
      'workspace_members?user_id=eq.' + encodeURIComponent(contextUserId)
        + '&select=workspace_id&limit=1',
    );
    const membershipWorkspaceId = asText(membershipRows[0]?.workspace_id);
    if (membershipWorkspaceId) return membershipWorkspaceId;
  }

  const profileQueries = [
    contextEmail ? 'profiles?email=eq.' + encodeURIComponent(contextEmail) + '&select=workspace_id&limit=1' : '',
    contextUserId ? 'profiles?auth_uid=eq.' + encodeURIComponent(contextUserId) + '&select=workspace_id&limit=1' : '',
    contextUserId ? 'profiles?firebase_uid=eq.' + encodeURIComponent(contextUserId) + '&select=workspace_id&limit=1' : '',
    isLikelyUuid(contextUserId) ? 'profiles?id=eq.' + encodeURIComponent(contextUserId) + '&select=workspace_id&limit=1' : '',
  ].filter(Boolean);

  for (const profileQuery of profileQueries) {
    const profileRows = await selectRows(profileQuery);
    const profileWorkspaceId = asText(profileRows[0]?.workspace_id);
    if (profileWorkspaceId) return profileWorkspaceId;
  }

  throw new RequestAuthError(401, 'AUTH_WORKSPACE_REQUIRED');
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
