import { findWorkspaceId, isUuid, selectFirstAvailable } from './_supabase.js';

export function asText(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return asText(value[0]);
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function getHeader(req, name) {
  return asText(req?.headers?.[name]);
}

function asTimestamp(value) {
  const normalized = asText(value);
  if (!normalized) return 0;
  const timestamp = new Date(normalized).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function normalizeEmail(value) {
  return asText(value).toLowerCase();
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

async function queryRows(queries) {
  const rows = [];

  for (const query of queries) {
    try {
      const result = await selectFirstAvailable([query]);
      if (Array.isArray(result.data)) {
        for (const row of result.data) {
          if (row && typeof row === 'object') rows.push(row);
        }
      }
    } catch {
      // ignore schema-compatible fallback query failures
    }
  }

  return rows;
}

function pickNewestRow(rows) {
  let bestRow = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const row of rows) {
    const score =
      Math.floor(asTimestamp(row?.updated_at || row?.updatedAt) / 1000) +
      Math.floor(asTimestamp(row?.created_at || row?.createdAt) / 1000);

    if (score > bestScore) {
      bestScore = score;
      bestRow = row;
    }
  }

  return bestRow;
}

function extractWorkspaceId(row) {
  const workspaceId = asText(row?.workspace_id || row?.workspaceId || row?.id);
  return workspaceId && isUuid(workspaceId) ? workspaceId : null;
}

async function findWorkspaceIdFromAuthUserId(userId) {
  const normalizedUserId = asText(userId);
  if (!normalizedUserId || !isUuid(normalizedUserId)) return null;

  const profileRows = await queryRows([
    `profiles?user_id=eq.${encodeURIComponent(normalizedUserId)}&select=user_id,workspace_id,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
  ]);

  for (const row of profileRows) {
    const workspaceId = extractWorkspaceId(row);
    if (workspaceId) return workspaceId;
  }

  const membershipRows = await queryRows([
    `workspace_members?user_id=eq.${encodeURIComponent(normalizedUserId)}&select=workspace_id,role,created_at&order=created_at.desc.nullslast&limit=5`,
  ]);

  for (const row of membershipRows) {
    const workspaceId = extractWorkspaceId(row);
    if (workspaceId) return workspaceId;
  }

  const ownedWorkspaceRows = await queryRows([
    `workspaces?owner_user_id=eq.${encodeURIComponent(normalizedUserId)}&select=id,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
    `workspaces?owner_id=eq.${encodeURIComponent(normalizedUserId)}&select=id,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
    `workspaces?created_by_user_id=eq.${encodeURIComponent(normalizedUserId)}&select=id,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
  ]);

  const ownedRow = pickNewestRow(ownedWorkspaceRows);
  return extractWorkspaceId(ownedRow);
}

async function findWorkspaceIdByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const profileRows = await queryRows([
    `profiles?normalized_email=eq.${encodeURIComponent(normalizedEmail)}&select=user_id,workspace_id,email,normalized_email,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
    `profiles?email=eq.${encodeURIComponent(normalizedEmail)}&select=user_id,workspace_id,email,normalized_email,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
    `profiles?email=eq.${encodeURIComponent(asText(email))}&select=user_id,workspace_id,email,normalized_email,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
  ]);

  for (const row of profileRows) {
    const workspaceId = extractWorkspaceId(row);
    if (workspaceId) return workspaceId;
  }

  const profileRow = pickNewestRow(profileRows);
  const userId = asText(profileRow?.user_id || profileRow?.userId);
  if (userId && isUuid(userId)) {
    return await findWorkspaceIdFromAuthUserId(userId);
  }

  return null;
}

async function findWorkspaceIdByLegacyIdentity(identity) {
  const normalizedIdentity = asText(identity);
  if (!normalizedIdentity) return null;

  const rows = await queryRows([
    `profiles?auth_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=user_id,workspace_id,auth_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
    `profiles?external_auth_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=user_id,workspace_id,external_auth_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
    `profiles?firebase_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=user_id,workspace_id,firebase_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=5`,
  ]);

  for (const row of rows) {
    const workspaceId = extractWorkspaceId(row);
    if (workspaceId) return workspaceId;
  }

  const row = pickNewestRow(rows);
  const userId = asText(row?.user_id || row?.userId);
  if (userId && isUuid(userId)) {
    return await findWorkspaceIdFromAuthUserId(userId);
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

  if (identity.userId && isUuid(identity.userId)) {
    const byAuthUserId = await findWorkspaceIdFromAuthUserId(identity.userId);
    if (byAuthUserId) return byAuthUserId;
  }

  if (identity.email) {
    const byEmail = await findWorkspaceIdByEmail(identity.email);
    if (byEmail) return byEmail;
  }

  if (identity.userId) {
    const byLegacyIdentity = await findWorkspaceIdByLegacyIdentity(identity.userId);
    if (byLegacyIdentity) return byLegacyIdentity;

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
  if (!row) throw new Error(errorCode);
  return row;
}
