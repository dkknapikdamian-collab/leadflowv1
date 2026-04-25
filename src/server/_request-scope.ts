import { findWorkspaceId, supabaseRequest } from './_supabase.js';

export function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function firstHeaderValue(value: unknown) {
  if (Array.isArray(value)) return asText(value[0]);
  return asText(value);
}

function headerValue(req: any, name: string) {
  const headers = req?.headers || {};
  const lower = name.toLowerCase();

  return firstHeaderValue(
    headers[name]
      ?? headers[lower]
      ?? headers[name.toUpperCase()]
      ?? headers[name.replace(/-/g, '_')]
      ?? headers[lower.replace(/-/g, '_')],
  );
}

function queryValue(req: any, name: string) {
  return firstHeaderValue(req?.query?.[name]);
}

function bodyValue(body: any, name: string) {
  if (!body || typeof body !== 'object') return '';

  return firstHeaderValue(body[name]);
}

function parseBody(req: any) {
  const body = req?.body;

  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body || '{}');
    } catch {
      return {};
    }
  }

  return body;
}

export function getRequestIdentity(req: any, bodyInput?: any) {
  const body = bodyInput && typeof bodyInput === 'object' ? bodyInput : parseBody(req);

  const userId =
    headerValue(req, 'x-user-id')
    || headerValue(req, 'x-firebase-uid')
    || headerValue(req, 'x-owner-user-id')
    || queryValue(req, 'userId')
    || queryValue(req, 'ownerUserId')
    || bodyValue(body, 'userId')
    || bodyValue(body, 'ownerUserId')
    || bodyValue(body, 'owner_user_id');

  const email =
    headerValue(req, 'x-user-email')
    || headerValue(req, 'x-email')
    || queryValue(req, 'email')
    || bodyValue(body, 'email')
    || bodyValue(body, 'userEmail')
    || bodyValue(body, 'ownerEmail')
    || bodyValue(body, 'owner_email');

  const fullName =
    headerValue(req, 'x-user-name')
    || headerValue(req, 'x-full-name')
    || queryValue(req, 'fullName')
    || queryValue(req, 'name')
    || bodyValue(body, 'fullName')
    || bodyValue(body, 'full_name')
    || bodyValue(body, 'name')
    || bodyValue(body, 'displayName')
    || bodyValue(body, 'display_name');

  const workspaceId =
    headerValue(req, 'x-workspace-id')
    || headerValue(req, 'x-closeflow-workspace-id')
    || queryValue(req, 'workspaceId')
    || queryValue(req, 'workspace_id')
    || bodyValue(body, 'workspaceId')
    || bodyValue(body, 'workspace_id');

  return {
    userId: userId || null,
    email: email || null,
    fullName: fullName || null,
    workspaceId: workspaceId || null,
  };
}

export async function resolveRequestWorkspaceId(req: any, bodyInput?: any) {
  const body = bodyInput && typeof bodyInput === 'object' ? bodyInput : parseBody(req);

  const candidates = [
    headerValue(req, 'x-workspace-id'),
    headerValue(req, 'x-closeflow-workspace-id'),
    queryValue(req, 'workspaceId'),
    queryValue(req, 'workspace_id'),
    bodyValue(body, 'workspaceId'),
    bodyValue(body, 'workspace_id'),
    bodyValue(body, 'id'),
    headerValue(req, 'x-user-id'),
    headerValue(req, 'x-firebase-uid'),
    queryValue(req, 'userId'),
    bodyValue(body, 'userId'),
    bodyValue(body, 'ownerUserId'),
    bodyValue(body, 'owner_user_id'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const workspaceId = await findWorkspaceId(candidate);
    if (workspaceId) return workspaceId;
  }

  return null;
}

export function withWorkspaceFilter(path: string, workspaceId: string) {
  const normalizedWorkspaceId = asText(workspaceId);

  if (!normalizedWorkspaceId) return path;
  if (/(^|[?&])workspace_id=/.test(path)) return path;

  const [base, query = ''] = String(path).split('?');
  const filter = `workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}`;

  if (!query) {
    return `${base}?${filter}`;
  }

  return `${base}?${filter}&${query.replace(/^&+/, '')}`;
}

export async function fetchSingleScopedRow(table: string, id: string, workspaceId: string, select = '*') {
  const encodedId = encodeURIComponent(asText(id));
  const scopedPath = withWorkspaceFilter(
    `${table}?select=${encodeURIComponent(select)}&id=eq.${encodedId}&limit=1`,
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

  if (!row) {
    throw new Error(errorCode);
  }

  return row;
}
