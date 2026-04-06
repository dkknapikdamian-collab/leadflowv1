import { buildAppUrl, getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/config"

export type SupabaseAuthUser = {
  id: string
  email: string | null
  email_confirmed_at?: string | null
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}

export type SupabaseSessionPayload = {
  access_token: string
  refresh_token: string
  expires_in?: number
  token_type?: string
  user?: SupabaseAuthUser
}

async function authRequest<T>(path: string, init: RequestInit = {}): Promise<{ data: T | null; error: string | null; status: number }> {
  const response = await fetch(`${getSupabaseUrl()}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: getSupabasePublishableKey(),
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  })

  const text = await response.text()
  const json = text ? (JSON.parse(text) as Record<string, unknown>) : {}

  if (!response.ok) {
    const error =
      typeof json.msg === "string"
        ? json.msg
        : typeof json.error_description === "string"
          ? json.error_description
          : typeof json.message === "string"
            ? json.message
            : "auth-error"

    return { data: null, error, status: response.status }
  }

  return { data: json as T, error: null, status: response.status }
}

export async function signInWithPassword(email: string, password: string) {
  return authRequest<SupabaseSessionPayload>("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function signUpWithPassword(email: string, password: string) {
  return authRequest<{ user?: SupabaseAuthUser | null; session?: SupabaseSessionPayload | null }>("/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      options: {
        emailRedirectTo: buildAppUrl("/auth/confirm"),
      },
    }),
  })
}

export async function resendConfirmation(email: string) {
  return authRequest<{ message?: string }>("/resend", {
    method: "POST",
    body: JSON.stringify({
      type: "signup",
      email,
      options: {
        emailRedirectTo: buildAppUrl("/auth/confirm"),
      },
    }),
  })
}

export async function sendPasswordReset(email: string) {
  return authRequest<{ message?: string }>("/recover", {
    method: "POST",
    body: JSON.stringify({
      email,
      options: {
        redirectTo: buildAppUrl("/auth/confirm?next=/reset-password"),
      },
    }),
  })
}

export async function verifyOtp(tokenHash: string, type: string) {
  return authRequest<{ user?: SupabaseAuthUser | null; session?: SupabaseSessionPayload | null }>("/verify", {
    method: "POST",
    body: JSON.stringify({ token_hash: tokenHash, type }),
  })
}

export async function refreshSession(refreshToken: string) {
  return authRequest<SupabaseSessionPayload>("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
}

export async function getUser(accessToken: string) {
  return authRequest<SupabaseAuthUser>("/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export async function updateUserPassword(accessToken: string, password: string) {
  return authRequest<{ user?: SupabaseAuthUser | null }>("/user", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ password }),
  })
}

export function buildGoogleOAuthUrl(nextPath = "/today") {
  const params = new URLSearchParams({
    provider: "google",
    flow_type: "implicit",
    redirect_to: buildAppUrl(`/auth/callback?next=${encodeURIComponent(nextPath)}`),
  })

  return `${getSupabaseUrl()}/auth/v1/authorize?${params.toString()}`
}
