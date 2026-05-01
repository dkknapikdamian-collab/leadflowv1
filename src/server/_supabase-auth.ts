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
  const url =
    asText(process.env.SUPABASE_URL)
    || asText(process.env.NEXT_PUBLIC_SUPABASE_URL)
    || asText(process.env.VITE_SUPABASE_URL);
  const key =
    asText(process.env.SUPABASE_ANON_KEY)
    || asText(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    || asText(process.env.VITE_SUPABASE_ANON_KEY)
    || asText(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !key) {
    throw new RequestAuthError(500, 'SUPABASE_AUTH_CONFIG_MISSING');
  }

  return { url: url.replace(/\/+$/, ''), key };
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
  const user = await verifySupabaseAccessToken(token, cfg.url, cfg.key);

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

async function verifySupabaseAccessToken(token: string, url: string, apiKey: string): Promise<Record<string, unknown>> {
  const response = await fetch(`${url}/auth/v1/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: apiKey,
    },
  });
  if (!response.ok) {
    throw new RequestAuthError(401, 'INVALID_SUPABASE_ACCESS_TOKEN');
  }
  const user = await response.json();
  if (!user || typeof user !== 'object') {
    throw new RequestAuthError(401, 'INVALID_SUPABASE_ACCESS_TOKEN');
  }
  return user as Record<string, unknown>;
}

export const requireSupabaseAuthContext = requireSupabaseRequestContext;

export function writeAuthErrorResponse(res: any, error: unknown) {
  if (error instanceof RequestAuthError) {
    res.status(error.status).json({ error: error.code });
    return;
  }
  res.status(500).json({ error: error instanceof Error ? error.message : 'AUTH_CONTEXT_FAILED' });
}
