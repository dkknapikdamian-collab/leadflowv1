import { findWorkspaceId, selectFirstAvailable } from './_supabase.js';

export function asText(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return asText(value[0]);
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function isUuid(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
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

  const queries = [
    `profiles?email=eq.${encodeURIComponent(normalizedEmail)}&select=id,workspace_id&limit=1`,
    `profiles?email=eq.${encodeURIComponent(asText(email))}&select=id,workspace_id&limit=1`,
  ];

  for (const query of queries) {
    try {
      const result = await selectFirstAvailable([query]);
      const row = Array.isArray(result.data) && result.data[0] ? result.data[0] : null;
      const workspaceId = asText(row?.workspace_id);
      if (workspaceId) return workspaceId;
    } catch {
      // ignore and continue
    }
  }

  return null;
}

async function findWorkspaceIdByProfileIdentity(profileIdentity) {
  const normalizedIdentity = asText(profileIdentity);
  if (!normalizedIdentity) return null;

  const queries = [];
  if (isUuid(normalizedIdentity)) {
    queries.push(`profiles?id=eq.${encodeURIComponent(normalizedIdentity)}&select=id,workspace_id&limit=1`);
  }
  queries.push(`profiles?firebase_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=id,workspace_id&limit=1`);
  queries.push(`profiles?auth_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=id,workspace_id&limit=1`);
  queries.push(`profiles?external_auth_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=id,workspace_id&limit=1`);

  for (const query of queries) {
    try {
      const result = await selectFirstAvailable([query]);
      const row = Array.isArray(result.data) && result.data[0] ? result.data[0] : null;
      const workspaceId = asText(row?.workspace_id);
      if (workspaceId) return workspaceId;
      const profileId = asText(row?.id);
      if (isUuid(profileId)) {
        try {
          const memberResult = await selectFirstAvailable([
            `workspace_members?user_id=eq.${encodeURIComponent(profileId)}&select=workspace_id&limit=1`,
          ]);
          const memberRow = Array.isArray(memberResult.data) && memberResult.data[0] ? memberResult.data[0] : null;
          const memberWorkspaceId = asText(memberRow?.workspace_id);
          if (memberWorkspaceId) return memberWorkspaceId;
        } catch {
          // ignore member lookup failure
        }
      }
    } catch {
      // ignore and continue
    }
  }

  return null;
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
    const byProfileIdentity = await findWorkspaceIdByProfileIdentity(identity.userId);
    if (byProfileIdentity) return byProfileIdentity;

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
