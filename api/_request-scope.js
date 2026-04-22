import { findWorkspaceId, selectFirstAvailable } from './_supabase.js';

export function asText(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return asText(value[0]);
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function getHeader(req, name) {
  return asText(req?.headers?.[name]);
}

export function getRequestIdentity(req, body = {}) {
  return {
    userId: getHeader(req, 'x-user-id') || asText(body.userId) || asText(req?.query?.uid),
    email: getHeader(req, 'x-user-email') || asText(body.ownerEmail) || asText(body.email) || asText(req?.query?.email),
    fullName: getHeader(req, 'x-user-name') || asText(body.fullName) || asText(req?.query?.fullName),
    workspaceId:
      getHeader(req, 'x-workspace-id') || asText(body.workspaceId) || asText(req?.query?.workspaceId),
  };
}

async function findWorkspaceIdByEmail(email) {
  const normalizedEmail = asText(email).toLowerCase();
  if (!normalizedEmail) return null;

  try {
    const result = await selectFirstAvailable([
      `profiles?email=eq.${encodeURIComponent(normalizedEmail)}&select=id,workspace_id&limit=1`,
    ]);
    const row = Array.isArray(result.data) && result.data[0] ? result.data[0] : null;
    return asText(row?.workspace_id) || null;
  } catch {
    return null;
  }
}

async function findWorkspaceIdByProfileId(profileId) {
  const normalizedProfileId = asText(profileId);
  if (!normalizedProfileId) return null;

  try {
    const result = await selectFirstAvailable([
      `profiles?id=eq.${encodeURIComponent(normalizedProfileId)}&select=id,workspace_id&limit=1`,
    ]);
    const row = Array.isArray(result.data) && result.data[0] ? result.data[0] : null;
    return asText(row?.workspace_id) || null;
  } catch {
    return null;
  }
}

export async function resolveRequestWorkspaceId(req, body = {}) {
  const identity = getRequestIdentity(req, body);

  if (identity.workspaceId) {
    try {
      const explicitWorkspace = await findWorkspaceId(identity.workspaceId);
      if (explicitWorkspace) return explicitWorkspace;
    } catch {
      // ignore and continue
    }
  }

  if (identity.email) {
    const byEmail = await findWorkspaceIdByEmail(identity.email);
    if (byEmail) return byEmail;
  }

  if (identity.userId) {
    const byProfileId = await findWorkspaceIdByProfileId(identity.userId);
    if (byProfileId) return byProfileId;

    try {
      const directWorkspace = await findWorkspaceId(identity.userId);
      if (directWorkspace) return directWorkspace;
    } catch {
      // ignore and continue
    }
  }

  return null;
}

export function withWorkspaceFilter(path, workspaceId) {
  const normalizedWorkspaceId = asText(workspaceId);
  if (!normalizedWorkspaceId) return path;
  const joiner = path.includes('?') ? '&' : '?';
  return `${path}${joiner}workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}`;
}

export async function fetchSingleScopedRow(table, id, workspaceId) {
  const normalizedId = asText(id);
  const normalizedWorkspaceId = asText(workspaceId);
  if (!normalizedId || !normalizedWorkspaceId) return null;

  const result = await selectFirstAvailable([
    `${table}?select=*&id=eq.${encodeURIComponent(normalizedId)}&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&limit=1`,
  ]);

  return Array.isArray(result.data) && result.data[0] ? result.data[0] : null;
}

export async function requireScopedRow(table, id, workspaceId, errorCode = 'SCOPED_ROW_NOT_FOUND') {
  const row = await fetchSingleScopedRow(table, id, workspaceId);
  if (!row) {
    throw new Error(errorCode);
  }
  return row;
}
