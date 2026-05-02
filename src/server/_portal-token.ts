import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { findWorkspaceId, selectFirstAvailable, supabaseRequest } from './_supabase.js';
import { resolveRequestWorkspaceId, requireScopedRow } from './_request-scope.js';
import { RequestAuthError } from './_supabase-auth.js';

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asNullable(value: unknown) {
  const normalized = asText(value);
  return normalized || null;
}

function safeIso(value: unknown) {
  const normalized = asText(value);
  if (!normalized) return null;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function nowIso() {
  return new Date().toISOString();
}

function isProductionRuntime() {
  const nodeEnv = asText(process.env.NODE_ENV).toLowerCase();
  const vercelEnv = asText(process.env.VERCEL_ENV).toLowerCase();
  return nodeEnv === 'production' || vercelEnv === 'production';
}

function requirePortalSecret(envName: 'PORTAL_TOKEN_PEPPER' | 'PORTAL_SESSION_SECRET') {
  const direct = asText(process.env[envName]);
  if (direct) return direct;

  if (isProductionRuntime()) {
    throw new RequestAuthError(500, 'PORTAL_SECRET_CONFIG_MISSING');
  }

  return '';
}

function tokenPepper() {
  return requirePortalSecret('PORTAL_TOKEN_PEPPER') || asText(process.env.SUPABASE_SERVICE_ROLE_KEY || 'closeflow-portal-dev-token-pepper');
}

function portalSessionSecret() {
  return requirePortalSecret('PORTAL_SESSION_SECRET') || asText(process.env.SUPABASE_SERVICE_ROLE_KEY || 'closeflow-portal-dev-session-secret');
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

export function hashPortalToken(token: string) {
  return createHash('sha256').update(`${tokenPepper()}:${token}`).digest('hex');
}

export function createPortalToken() {
  return randomBytes(24).toString('base64url');
}

export function readPortalToken(req: any, body?: Record<string, unknown>) {
  const headerToken = asNullable(req?.headers?.['x-portal-token'] || req?.headers?.['X-Portal-Token']);
  const queryToken = asNullable(req?.query?.token || req?.query?.portalToken);
  const bodyToken = asNullable(body?.token || body?.portalToken);
  return headerToken || queryToken || bodyToken || '';
}

export function readPortalSession(req: any, body?: Record<string, unknown>) {
  const headerSession = asNullable(req?.headers?.['x-portal-session'] || req?.headers?.['X-Portal-Session']);
  const querySession = asNullable(req?.query?.portalSession);
  const bodySession = asNullable(body?.portalSession);
  return headerSession || querySession || bodySession || '';
}

export async function requireOperatorCaseAccess(req: any, caseId: string) {
  const workspaceId = await resolveRequestWorkspaceId(req);
  if (!workspaceId) {
    throw new Error('AUTH_WORKSPACE_REQUIRED');
  }
  await requireScopedRow('cases', caseId, workspaceId, 'CASE_NOT_FOUND');
  return workspaceId;
}

async function findCaseById(caseId: string) {
  const result = await selectFirstAvailable([`cases?select=*&id=eq.${encodeURIComponent(caseId)}&limit=1`]);
  const rows = Array.isArray(result.data) ? result.data : [];
  return (rows[0] || null) as Record<string, unknown> | null;
}

async function findTokenRow(caseId: string, tokenHash: string) {
  const result = await selectFirstAvailable([
    `client_portal_tokens?select=*&case_id=eq.${encodeURIComponent(caseId)}&token_hash=eq.${encodeURIComponent(tokenHash)}&order=created_at.desc&limit=1`,
  ]);
  const rows = Array.isArray(result.data) ? result.data : [];
  return (rows[0] || null) as Record<string, unknown> | null;
}

export async function requirePortalContext(caseId: string, token: string) {
  if (!caseId || !token) {
    throw new Error('PORTAL_TOKEN_REQUIRED');
  }

  const tokenHash = hashPortalToken(token);
  const tokenRow = await findTokenRow(caseId, tokenHash);
  if (!tokenRow) {
    throw new Error('PORTAL_TOKEN_INVALID');
  }

  const revokedAt = safeIso(tokenRow.revoked_at);
  const expiresAt = safeIso(tokenRow.expires_at);
  if (revokedAt) throw new Error('PORTAL_TOKEN_REVOKED');
  if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) throw new Error('PORTAL_TOKEN_EXPIRED');

  const caseRow = await findCaseById(caseId);
  if (!caseRow) throw new Error('CASE_NOT_FOUND');

  const workspaceId = await findWorkspaceId(caseRow.workspace_id);
  await supabaseRequest(`client_portal_tokens?id=eq.${encodeURIComponent(asText(tokenRow.id))}`, {
    method: 'PATCH',
    body: JSON.stringify({ last_used_at: nowIso(), updated_at: nowIso() }),
  }).catch(() => null);

  return { caseRow, tokenRow, workspaceId };
}

type PortalSessionPayload = {
  sid: string;
  tokenId: string;
  caseId: string;
  workspaceId: string | null;
  exp: number;
};

export function createPortalSession(input: { tokenId: string; caseId: string; workspaceId: string | null }, ttlSeconds = 900) {
  const payload: PortalSessionPayload = {
    sid: randomBytes(12).toString('hex'),
    tokenId: asText(input.tokenId),
    caseId: asText(input.caseId),
    workspaceId: asNullable(input.workspaceId),
    exp: Math.floor(Date.now() / 1000) + Math.max(60, Math.min(3600, Math.floor(ttlSeconds))),
  };
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac('sha256', portalSessionSecret()).update(payloadEncoded).digest('base64url');
  return `${payloadEncoded}.${signature}`;
}

function parsePortalSession(sessionToken: string): PortalSessionPayload {
  const [payloadEncoded, signature] = String(sessionToken || '').split('.');
  if (!payloadEncoded || !signature) throw new Error('PORTAL_SESSION_INVALID');

  const expected = createHmac('sha256', portalSessionSecret()).update(payloadEncoded).digest('base64url');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    throw new Error('PORTAL_SESSION_INVALID');
  }

  let payload: PortalSessionPayload;
  try {
    payload = JSON.parse(base64UrlDecode(payloadEncoded)) as PortalSessionPayload;
  } catch {
    throw new Error('PORTAL_SESSION_INVALID');
  }

  if (!payload?.tokenId || !payload?.caseId || !payload?.exp) throw new Error('PORTAL_SESSION_INVALID');
  if (payload.exp <= Math.floor(Date.now() / 1000)) throw new Error('PORTAL_SESSION_EXPIRED');
  return payload;
}

export async function requirePortalSessionContext(caseId: string, sessionToken: string) {
  if (!caseId || !sessionToken) throw new Error('PORTAL_SESSION_REQUIRED');
  const session = parsePortalSession(sessionToken);
  if (session.caseId !== caseId) throw new Error('PORTAL_SESSION_CASE_MISMATCH');

  const caseRow = await findCaseById(caseId);
  if (!caseRow) throw new Error('CASE_NOT_FOUND');

  const tokenResult = await selectFirstAvailable([
    `client_portal_tokens?select=*&id=eq.${encodeURIComponent(session.tokenId)}&case_id=eq.${encodeURIComponent(caseId)}&limit=1`,
  ]);
  const tokenRows = Array.isArray(tokenResult.data) ? tokenResult.data as Record<string, unknown>[] : [];
  const tokenRow = tokenRows[0] || null;
  if (!tokenRow) throw new Error('PORTAL_TOKEN_INVALID');

  const revokedAt = safeIso(tokenRow.revoked_at);
  const expiresAt = safeIso(tokenRow.expires_at);
  if (revokedAt) throw new Error('PORTAL_TOKEN_REVOKED');
  if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) throw new Error('PORTAL_TOKEN_EXPIRED');

  const workspaceId = await findWorkspaceId(caseRow.workspace_id);
  await supabaseRequest(`client_portal_tokens?id=eq.${encodeURIComponent(asText(tokenRow.id))}`, {
    method: 'PATCH',
    body: JSON.stringify({ last_used_at: nowIso(), updated_at: nowIso() }),
  }).catch(() => null);

  return { caseRow, tokenRow, workspaceId, session };
}

export async function upsertPortalTokenForCase(caseId: string, plaintextToken: string, expiresAt: string | null) {
  const now = nowIso();
  await supabaseRequest(`client_portal_tokens?case_id=eq.${encodeURIComponent(caseId)}&revoked_at=is.null`, {
    method: 'PATCH',
    body: JSON.stringify({ revoked_at: now, updated_at: now }),
  }).catch(() => null);

  const caseRow = await findCaseById(caseId);
  const workspaceId = caseRow ? await findWorkspaceId((caseRow as Record<string, unknown>).workspace_id) : null;

  const payload = {
    workspace_id: workspaceId,
    case_id: caseId,
    token_hash: hashPortalToken(plaintextToken),
    expires_at: expiresAt,
    revoked_at: null,
    last_used_at: null,
    created_at: now,
    updated_at: now,
    created_by_user_id: null,
  };

  await supabaseRequest('client_portal_tokens', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  await supabaseRequest(`cases?id=eq.${encodeURIComponent(caseId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ portal_ready: true, updated_at: now }),
  }).catch(() => null);
}
