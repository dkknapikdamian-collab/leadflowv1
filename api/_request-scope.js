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
          if (row && typeof row === 'object') {
            rows.push(row);
          }
        }
      }
    } catch {
      // ignore and continue
    }
  }

  return rows;
}

function pickBestProfileRow(rows, identity = {}) {
  const email = normalizeEmail(identity.email);
  const userId = asText(identity.userId);

  let bestRow = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const row of rows) {
    const workspaceId = asText(row?.workspace_id || row?.workspaceId);
    const rowEmail = normalizeEmail(row?.email);
    const firebaseUid = asText(row?.firebase_uid || row?.firebaseUid);
    const authUid = asText(row?.auth_uid || row?.authUid);
    const externalAuthUid = asText(row?.external_auth_uid || row?.externalAuthUid);
    const profileId = asText(row?.id);

    let score = 0;

    if (workspaceId && isUuid(workspaceId)) score += 1000;
    if (userId && firebaseUid === userId) score += 600;
    if (userId && authUid === userId) score += 550;
    if (userId && externalAuthUid === userId) score += 500;
    if (email && rowEmail === email) score += 300;
    if (profileId && isUuid(profileId)) score += 50;

    score += Math.floor(asTimestamp(row?.updated_at || row?.updatedAt) / 1000);
    score += Math.floor(asTimestamp(row?.created_at || row?.createdAt) / 1000);

    if (score > bestScore) {
      bestScore = score;
      bestRow = row;
    }
  }

  return bestRow;
}

async function findWorkspaceIdFromProfileRow(row) {
  const workspaceId = asText(row?.workspace_id || row?.workspaceId);
  if (workspaceId && isUuid(workspaceId)) return workspaceId;

  const profileId = asText(row?.id);
  if (!isUuid(profileId)) return null;

  const ownerRow = pickBestProfileRow(await queryRows([
    `workspaces?owner_user_id=eq.${encodeURIComponent(profileId)}&select=id,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`,
    `workspaces?owner_id=eq.${encodeURIComponent(profileId)}&select=id,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`,
    `workspaces?created_by_user_id=eq.${encodeURIComponent(profileId)}&select=id,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`,
  ]));

  const ownerWorkspaceId = asText(ownerRow?.id);
  if (ownerWorkspaceId && isUuid(ownerWorkspaceId)) return ownerWorkspaceId;

  const memberRows = await queryRows([
    `workspace_members?user_id=eq.${encodeURIComponent(profileId)}&select=workspace_id,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`,
  ]);

  for (const memberRow of memberRows) {
    const memberWorkspaceId = asText(memberRow?.workspace_id);
    if (memberWorkspaceId && isUuid(memberWorkspaceId)) {
      return memberWorkspaceId;
    }
  }

  return null;
}

async function findWorkspaceIdByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  const rows = await queryRows([
    `profiles?email=eq.${encodeURIComponent(normalizedEmail)}&select=id,email,workspace_id,firebase_uid,auth_uid,external_auth_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`,
    `profiles?email=eq.${encodeURIComponent(asText(email))}&select=id,email,workspace_id,firebase_uid,auth_uid,external_auth_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`,
  ]);

  const row = pickBestProfileRow(rows, { email: normalizedEmail });
  return await findWorkspaceIdFromProfileRow(row);
}

async function findWorkspaceIdByProfileIdentity(profileIdentity, email = '') {
  const normalizedIdentity = asText(profileIdentity);
  if (!normalizedIdentity) return null;

  const queries = [];
  if (isUuid(normalizedIdentity)) {
    queries.push(`profiles?id=eq.${encodeURIComponent(normalizedIdentity)}&select=id,email,workspace_id,firebase_uid,auth_uid,external_auth_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`);
  }
  queries.push(`profiles?firebase_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=id,email,workspace_id,firebase_uid,auth_uid,external_auth_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`);
  queries.push(`profiles?auth_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=id,email,workspace_id,firebase_uid,auth_uid,external_auth_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`);
  queries.push(`profiles?external_auth_uid=eq.${encodeURIComponent(normalizedIdentity)}&select=id,email,workspace_id,firebase_uid,auth_uid,external_auth_uid,updated_at,created_at&order=updated_at.desc.nullslast&limit=20`);

  const row = pickBestProfileRow(await queryRows(queries), {
    userId: normalizedIdentity,
    email,
  });

  return await findWorkspaceIdFromProfileRow(row);
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
    const byProfileIdentity = await findWorkspaceIdByProfileIdentity(identity.userId, identity.email);
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
