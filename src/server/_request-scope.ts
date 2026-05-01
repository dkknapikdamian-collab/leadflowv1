import { findWorkspaceId, selectFirstAvailable, supabaseRequest } from './_supabase.js';
import { fetchWorkspaceWriteAccess } from './_access-gate.js';
import { RequestAuthError, requireSupabaseAuthContext as requireSupabaseRequestContext } from './_supabase-auth.js';

export function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function isUuid(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function getRequestIdentity(_req: any, _bodyInput?: any) {
  return { userId: null, email: null, fullName: null, workspaceId: null };
}

export async function requireRequestIdentity(req: any) {
  return requireSupabaseRequestContext(req);
}

export async function requireAuthContext(req: any) {
  const context = await requireSupabaseRequestContext(req);
  const workspaceFromLookup = await findWorkspaceId(context.userId);
  const workspaceFromToken = asText(context.workspaceId);
  let workspaceId = workspaceFromLookup || (isUuid(workspaceFromToken) ? workspaceFromToken : null);

  // A22_WORKSPACE_MEMBER_DIRECT_LOOKUP
  // Keep membership lookup explicit in request scope so workspace isolation is visible and guarded.
  if (!workspaceId && context.userId) {
    try {
      const membership = await selectFirstAvailable([
        `workspace_members?user_id=eq.${encodeURIComponent(context.userId)}&select=workspace_id&limit=1`,
      ]);
      const row = Array.isArray(membership.data) && membership.data[0] ? membership.data[0] as Record<string, unknown> : null;
      const workspaceFromMembership = asText(row?.workspace_id);
      if (isUuid(workspaceFromMembership)) workspaceId = workspaceFromMembership;
    } catch {
      // keep null and continue fallback lookup below
    }
  }
  if (!workspaceId && context.email) {
    try {
      const profile = await selectFirstAvailable([
        `profiles?select=workspace_id&email=eq.${encodeURIComponent(context.email)}&limit=1`,
      ]);
      const row = Array.isArray(profile.data) && profile.data[0] ? profile.data[0] as Record<string, unknown> : null;
      const workspaceFromProfile = asText(row?.workspace_id);
      if (isUuid(workspaceFromProfile)) workspaceId = workspaceFromProfile;
    } catch {
      // keep null
    }
  }
  let role = 'member';
  if (workspaceId) {
    try {
      const profile = await selectFirstAvailable([
        `profiles?select=role,is_admin&auth_uid=eq.${encodeURIComponent(context.userId)}&limit=1`,
        `profiles?select=role,is_admin&external_auth_uid=eq.${encodeURIComponent(context.userId)}&limit=1`,
        `profiles?select=role,is_admin&firebase_uid=eq.${encodeURIComponent(context.userId)}&limit=1`,
        context.email ? `profiles?select=role,is_admin&email=eq.${encodeURIComponent(context.email)}&limit=1` : '',
      ].filter(Boolean));
      const row = Array.isArray(profile.data) && profile.data[0] ? profile.data[0] as Record<string, unknown> : null;
      const profileRole = asText(row?.role).toLowerCase();
      const profileIsAdmin = row?.is_admin === true || row?.isAdmin === true;
      role = profileRole === 'admin' || profileIsAdmin ? 'admin' : (profileRole || 'member');
    } catch {
      role = 'member';
    }
  }
  const access = workspaceId
    ? await fetchWorkspaceWriteAccess(workspaceId).catch(() => ({ hasWriteAccess: false, status: 'inactive' }))
    : { hasWriteAccess: false, status: 'inactive' };
  return {
    ...context,
    workspaceId,
    role,
    access,
    isAdmin: role === 'admin',
  };
}

export function isAdminRole(role: unknown) {
  return asText(role).toLowerCase() === 'admin';
}

export async function requireAdminAuthContext(req: any) {
  const context = await requireAuthContext(req);
  if (!isAdminRole(context.role)) {
    throw new RequestAuthError(403, 'ADMIN_ROLE_REQUIRED');
  }
  return context;
}
export const requireSupabaseAuthContext = requireAuthContext;

export async function resolveRequestWorkspaceId(req: any, _bodyInput?: any) {
  const context = await requireAuthContext(req);
  return context.workspaceId;
}

export function withWorkspaceFilter(path: string, workspaceId: string) {
  const normalizedWorkspaceId = asText(workspaceId);
  if (!normalizedWorkspaceId) return path;
  if (/(^|[?&])workspace_id=/.test(path)) return path;

  const [base, query = ''] = String(path).split('?');
  const filter = 'workspace_id=eq.' + encodeURIComponent(normalizedWorkspaceId);
  if (!query) return base + '?' + filter;
  return base + '?' + filter + '&' + query.replace(/^&+/, '');
}

export async function fetchSingleScopedRow(table: string, id: string, workspaceId: string, select = '*') {
  const encodedId = encodeURIComponent(asText(id));
  const scopedPath = withWorkspaceFilter(
    table + '?select=' + encodeURIComponent(select) + '&id=eq.' + encodedId + '&limit=1',
    workspaceId,
  );

  const rows = await supabaseRequest(scopedPath, {
    method: 'GET',
    headers: { Prefer: 'return=representation' },
  });

  if (Array.isArray(rows) && rows[0] && typeof rows[0] === 'object') {
    return rows[0] as Record<string, unknown>;
  }

  return null;
}

export async function requireScopedRow(table: string, id: string, workspaceId: string, errorCode = 'ROW_NOT_FOUND') {
  const row = await fetchSingleScopedRow(table, id, workspaceId, 'id');
  if (!row) throw new Error(errorCode);
  return row;
}
