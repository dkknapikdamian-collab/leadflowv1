import { createVerify } from 'node:crypto';

export type SupabaseRequestContext = {
  userId: string;
  email: string | null;
  fullName: string | null;
  workspaceId: string | null;
  rawUser: Record<string, unknown>;
};

export class RequestAuthError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

function asText(value: unknown) {
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
  return firstHeaderValue(headers[name] ?? headers[lower] ?? headers[name.toUpperCase()]);
}

export function getBearerToken(req: any) {
  const authorization = headerValue(req, 'authorization');
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || '';
}

function getSupabaseAuthConfig() {
  const projectId =
    asText(process.env.FIREBASE_PROJECT_ID)
    || asText(process.env.GOOGLE_CLOUD_PROJECT)
    || asText(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
    || asText(process.env.VITE_FIREBASE_PROJECT_ID)
    || 'gen-lang-client-0457467667';

  if (!projectId) {
    throw new RequestAuthError(500, 'FIREBASE_PROJECT_ID_MISSING');
  }

  return { projectId };
}

function stringFromMetadata(meta: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = asText(meta[key]);
    if (value) return value;
  }
  return null;
}

export async function requireSupabaseRequestContext(req: any): Promise<SupabaseRequestContext> {
  const token = getBearerToken(req);
  if (!token) throw new RequestAuthError(401, 'AUTHORIZATION_BEARER_REQUIRED');

  const cfg = getSupabaseAuthConfig();
  const user = await verifyFirebaseIdToken(token, cfg.projectId);

  const appMetadata = (user.app_metadata && typeof user.app_metadata === 'object' ? user.app_metadata : {}) as Record<string, unknown>;
  const userMetadata = (user.user_metadata && typeof user.user_metadata === 'object' ? user.user_metadata : {}) as Record<string, unknown>;

  return {
    userId: asText(user.user_id || user.sub),
    email: asText(user.email) || null,
    fullName: stringFromMetadata(userMetadata, ['full_name', 'name', 'display_name']),
    workspaceId: stringFromMetadata(appMetadata, ['workspace_id', 'workspaceId']),
    rawUser: user,
  };
}

type JwtHeader = { alg?: string; kid?: string; typ?: string };
type JwtPayload = { [key: string]: unknown; sub?: string; aud?: string; iss?: string; exp?: number; iat?: number; auth_time?: number };

type KeyCache = { expiresAt: number; keys: Record<string, string> };
let googleCertCache: KeyCache | null = null;

function decodeBase64Url(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice((base64.length + 3) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function parseJwt(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new RequestAuthError(401, 'INVALID_FIREBASE_ID_TOKEN');

  let header: JwtHeader;
  let payload: JwtPayload;
  try {
    header = JSON.parse(decodeBase64Url(parts[0])) as JwtHeader;
    payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
  } catch {
    throw new RequestAuthError(401, 'INVALID_FIREBASE_ID_TOKEN');
  }

  return { header, payload, signingInput: `${parts[0]}.${parts[1]}`, signature: parts[2] };
}

function parseMaxAge(cacheControl: string) {
  const match = cacheControl.match(/max-age=(\d+)/i);
  if (!match) return 300;
  const seconds = Number(match[1]);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 300;
}

async function loadGoogleCerts() {
  if (googleCertCache && googleCertCache.expiresAt > Date.now()) {
    return googleCertCache.keys;
  }

  const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
  if (!response.ok) {
    throw new RequestAuthError(401, 'FIREBASE_CERTS_FETCH_FAILED');
  }

  const keys = (await response.json()) as Record<string, string>;
  const maxAgeSeconds = parseMaxAge(asText(response.headers.get('cache-control')));
  googleCertCache = {
    keys,
    expiresAt: Date.now() + maxAgeSeconds * 1000,
  };
  return keys;
}

function verifySignature(signingInput: string, signatureBase64Url: string, pem: string) {
  const verifier = createVerify('RSA-SHA256');
  verifier.update(signingInput);
  verifier.end();

  const signature = Buffer.from(signatureBase64Url.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  return verifier.verify(pem, signature);
}

async function verifyFirebaseIdToken(token: string, projectId: string): Promise<Record<string, unknown>> {
  const { header, payload, signingInput, signature } = parseJwt(token);
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (header.alg !== 'RS256' || !asText(header.kid)) {
    throw new RequestAuthError(401, 'INVALID_FIREBASE_ID_TOKEN_HEADER');
  }

  const aud = asText(payload.aud);
  const iss = asText(payload.iss);
  const sub = asText(payload.sub);
  const exp = Number(payload.exp);
  const iat = Number(payload.iat);

  if (aud !== projectId || iss !== `https://securetoken.google.com/${projectId}`) {
    throw new RequestAuthError(401, 'FIREBASE_PROJECT_MISMATCH');
  }

  if (!sub || sub.length > 128) {
    throw new RequestAuthError(401, 'INVALID_FIREBASE_SUBJECT');
  }

  if (!Number.isFinite(exp) || exp <= nowSeconds) {
    throw new RequestAuthError(401, 'FIREBASE_ID_TOKEN_EXPIRED');
  }

  if (!Number.isFinite(iat) || iat > nowSeconds + 300) {
    throw new RequestAuthError(401, 'INVALID_FIREBASE_ISSUED_AT');
  }

  const certs = await loadGoogleCerts();
  const keyId = asText(header.kid);
  const cert = certs[keyId];
  if (!cert) {
    throw new RequestAuthError(401, 'FIREBASE_SIGNING_KEY_NOT_FOUND');
  }

  if (!verifySignature(signingInput, signature, cert)) {
    throw new RequestAuthError(401, 'INVALID_FIREBASE_ID_TOKEN_SIGNATURE');
  }

  return payload as Record<string, unknown>;
}

export function writeAuthErrorResponse(res: any, error: unknown) {
  if (error instanceof RequestAuthError) {
    res.status(error.status).json({ error: error.code });
    return;
  }
  res.status(500).json({ error: error instanceof Error ? error.message : 'AUTH_CONTEXT_FAILED' });
}
