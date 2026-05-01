import { findWorkspaceId, selectFirstAvailable, supabaseRequest } from './_supabase.js';
import { fetchWorkspaceWriteAccess } from './_access-gate.js';
import { requireSupabaseAuthContext as requireSupabaseRequestContext } from './_supabase-auth.js';

export function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export function getRequestIdentity(_req: any, _bodyInput?: any) {
  return { userId: null, email: null, fullName: null, workspaceId: null };
}

export async function requireRequestIdentity(req: any) {
  return requireSupabaseRequestContext(req);
}

export async function requireAuthContext(req: any) {
  const context = await requireSupabaseRequestContext(req);
  const workspaceId = await findWorkspaceId(context.userId);
  let role = 'member';
  if (workspaceId) {
    try {
      const profile = await selectFirstAvailable([
        `profiles?select=role&auth_uid=eq.${encodeURIComponent(context.userId)}&limit=1`,
        `profiles?select=role&external_auth_uid=eq.${encodeURIComponent(context.userId)}&limit=1`,
        `profiles?select=role&firebase_uid=eq.${encodeURIComponent(context.userId)}&limit=1`,
        context.email ? `profiles?select=role&email=eq.${encodeURIComponent(context.email)}&limit=1` : '',
      ].filter(Boolean));
      const row = Array.isArray(profile.data) && profile.data[0] ? profile.data[0] as Record<string, unknown> : null;
      role = asText(row?.role) || 'member';
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
  };
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
