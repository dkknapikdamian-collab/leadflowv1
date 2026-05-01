export type SupabaseRequestContext = {
  userId: string;
  email: string | null;
  fullName: string | null;
  workspaceId: string | null;
  emailConfirmedAt: string | null;
  emailVerified: boolean;
  authProvider: string | null;
  authProviders: string[];
  rawUser: Record<string, unknown>;
};

const REQUEST_CONTEXT_CACHE_KEY = '__closeflowSupabaseRequestContext';

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
  const directAuthorization =
    headerValue(req, 'authorization')
    || headerValue(req, 'x-authorization')
    || headerValue(req, 'x-forwarded-authorization');

  const directMatch = directAuthorization.match(/^Bearer\s+(.+)$/i);
  if (directMatch?.[1]?.trim()) {
    return directMatch[1].trim();
  }

  // Vercel may serialize sensitive headers into x-vercel-sc-headers on rewritten routes.
  const vercelSerializedHeaders = headerValue(req, 'x-vercel-sc-headers');
  if (vercelSerializedHeaders) {
    try {
      const parsed = JSON.parse(vercelSerializedHeaders);
      if (parsed && typeof parsed === 'object') {
        const embeddedAuthorization = asText(
          (parsed as Record<string, unknown>).Authorization
          ?? (parsed as Record<string, unknown>).authorization
          ?? '',
        );
        const embeddedMatch = embeddedAuthorization.match(/^Bearer\s+(.+)$/i);
        if (embeddedMatch?.[1]?.trim()) {
          return embeddedMatch[1].trim();
        }
      }
    } catch {
      // ignore malformed header and return empty token
    }
  }

  return '';
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

function arrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function getAuthProviders(rawUser: Record<string, unknown>) {
  const appMetadata = (rawUser.app_metadata && typeof rawUser.app_metadata === 'object' ? rawUser.app_metadata : {}) as Record<string, unknown>;
  const primary = asText(appMetadata.provider).toLowerCase();
  const providers = arrayFromUnknown(appMetadata.providers).map((provider) => asText(provider).toLowerCase()).filter(Boolean);
  const identityProviders = arrayFromUnknown(rawUser.identities)
    .map((identity) => {
      const row = identity && typeof identity === 'object' ? identity as Record<string, unknown> : {};
      return asText(row.provider).toLowerCase();
    })
    .filter(Boolean);

  return [...new Set([primary, ...providers, ...identityProviders].filter(Boolean))];
}

function getPrimaryAuthProvider(rawUser: Record<string, unknown>) {
  return getAuthProviders(rawUser)[0] || null;
}

function getEmailConfirmedAt(rawUser: Record<string, unknown>) {
  return asText(rawUser.email_confirmed_at ?? rawUser.confirmed_at ?? null) || null;
}

function hasVerifiedEmail(rawUser: Record<string, unknown>) {
  if (getEmailConfirmedAt(rawUser)) return true;

  const userMetadata = (rawUser.user_metadata && typeof rawUser.user_metadata === 'object' ? rawUser.user_metadata : {}) as Record<string, unknown>;
  if (userMetadata.email_verified === true || userMetadata.emailVerified === true) return true;

  return arrayFromUnknown(rawUser.identities).some((identity) => {
    const row = identity && typeof identity === 'object' ? identity as Record<string, unknown> : {};
    const identityData = row.identity_data && typeof row.identity_data === 'object' ? row.identity_data as Record<string, unknown> : {};
    return identityData.email_verified === true || identityData.emailVerified === true;
  });
}

function hasEmailPasswordIdentity(rawUser: Record<string, unknown>) {
  const providers = getAuthProviders(rawUser);
  const primary = getPrimaryAuthProvider(rawUser) || '';
  return primary === 'email' || providers.includes('email') || providers.includes('password') || (!primary && providers.length === 0);
}

export function isSupabaseEmailConfirmationRequired(rawUserOrContext: Record<string, unknown>) {
  const rawUser = rawUserOrContext.rawUser && typeof rawUserOrContext.rawUser === 'object'
    ? rawUserOrContext.rawUser as Record<string, unknown>
    : rawUserOrContext;

  if (hasVerifiedEmail(rawUser)) return false;
  return hasEmailPasswordIdentity(rawUser);
}

export function getCachedSupabaseRequestContext(req: any): SupabaseRequestContext | null {
  const cached = req && typeof req === 'object' ? req[REQUEST_CONTEXT_CACHE_KEY] : null;
  return cached && typeof cached === 'object' ? cached as SupabaseRequestContext : null;
}

export async function requireSupabaseRequestContext(req: any): Promise<SupabaseRequestContext> {
  const cached = getCachedSupabaseRequestContext(req);
  if (cached) return cached;

  const token = getBearerToken(req);
  if (!token) throw new RequestAuthError(401, 'AUTHORIZATION_BEARER_REQUIRED');

  const cfg = getSupabaseAuthConfig();
  const user = await verifySupabaseAccessToken(token, cfg.url, cfg.key);

  const appMetadata = (user.app_metadata && typeof user.app_metadata === 'object' ? user.app_metadata : {}) as Record<string, unknown>;
  const userMetadata = (user.user_metadata && typeof user.user_metadata === 'object' ? user.user_metadata : {}) as Record<string, unknown>;

  const context: SupabaseRequestContext = {
    userId: asText(user.user_id || user.sub),
    email: asText(user.email) || null,
    fullName: stringFromMetadata(userMetadata, ['full_name', 'name', 'display_name']),
    workspaceId: stringFromMetadata(appMetadata, ['workspace_id', 'workspaceId']),
    emailConfirmedAt: getEmailConfirmedAt(user),
    emailVerified: hasVerifiedEmail(user),
    authProvider: getPrimaryAuthProvider(user),
    authProviders: getAuthProviders(user),
    rawUser: user,
  };

  if (req && typeof req === 'object') {
    req[REQUEST_CONTEXT_CACHE_KEY] = context;
  }

  return context;
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

export async function assertSupabaseEmailVerifiedForMutation(reqOrContext: any) {
  const context = reqOrContext && typeof reqOrContext === 'object' && 'rawUser' in reqOrContext
    ? reqOrContext as SupabaseRequestContext
    : await requireSupabaseRequestContext(reqOrContext);

  if (!isSupabaseEmailConfirmationRequired(context)) {
    return context;
  }

  throw new RequestAuthError(403, 'EMAIL_CONFIRMATION_REQUIRED');
}

export function writeAuthErrorResponse(res: any, error: unknown) {
  if (error instanceof RequestAuthError) {
    res.status(error.status).json({ error: error.code });
    return;
  }
  res.status(500).json({ error: error instanceof Error ? error.message : 'AUTH_CONTEXT_FAILED' });
}
