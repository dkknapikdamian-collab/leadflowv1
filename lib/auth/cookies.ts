import type { NextRequest, NextResponse } from "next/server"

export const ACCESS_COOKIE = "ClientPilot_access_token"
export const REFRESH_COOKIE = "ClientPilot_refresh_token"
export const USER_EMAIL_COOKIE = "ClientPilot_user_email"
export const AUTH_PROVIDER_COOKIE = "ClientPilot_auth_provider"

export type CookieSessionInput = {
  accessToken: string
  refreshToken: string
  email?: string | null
  provider?: string | null
  expiresIn?: number | null
}

function isProd() {
  return process.env.NODE_ENV === "production"
}

export function setAuthCookies(response: NextResponse, session: CookieSessionInput) {
  const accessMaxAge = typeof session.expiresIn === "number" && session.expiresIn > 0 ? session.expiresIn : 60 * 60
  const refreshMaxAge = 60 * 60 * 24 * 30

  response.cookies.set(ACCESS_COOKIE, session.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd(),
    path: "/",
    maxAge: accessMaxAge,
  })

  response.cookies.set(REFRESH_COOKIE, session.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd(),
    path: "/",
    maxAge: refreshMaxAge,
  })

  if (session.email) {
    response.cookies.set(USER_EMAIL_COOKIE, session.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd(),
      path: "/",
      maxAge: refreshMaxAge,
    })
  }

  if (session.provider) {
    response.cookies.set(AUTH_PROVIDER_COOKIE, session.provider, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd(),
      path: "/",
      maxAge: refreshMaxAge,
    })
  }
}

export function clearAuthCookies(response: NextResponse) {
  for (const key of [ACCESS_COOKIE, REFRESH_COOKIE, USER_EMAIL_COOKIE, AUTH_PROVIDER_COOKIE]) {
    response.cookies.set(key, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd(),
      path: "/",
      maxAge: 0,
    })
  }
}

export function getAccessTokenFromRequest(request: NextRequest) {
  return request.cookies.get(ACCESS_COOKIE)?.value ?? null
}

export function getRefreshTokenFromRequest(request: NextRequest) {
  return request.cookies.get(REFRESH_COOKIE)?.value ?? null
}

export function getEmailFromRequest(request: NextRequest) {
  return request.cookies.get(USER_EMAIL_COOKIE)?.value ?? null
}

export function getAuthProviderFromRequest(request: NextRequest) {
  return request.cookies.get(AUTH_PROVIDER_COOKIE)?.value ?? null
}

export function getJwtExpiry(token: string | null): number | null {
  if (!token) return null

  const parts = token.split(".")
  if (parts.length < 2) return null

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8")) as { exp?: number }
    return typeof payload.exp === "number" ? payload.exp : null
  } catch {
    return null
  }
}

export function isJwtExpired(token: string | null, skewSeconds = 30) {
  const exp = getJwtExpiry(token)
  if (!exp) return true
  return exp <= Math.floor(Date.now() / 1000) + skewSeconds
}

