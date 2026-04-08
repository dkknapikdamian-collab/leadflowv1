import { NextResponse, type NextRequest } from "next/server"
import { resolveWorkspaceAccessPolicy } from "@/lib/access/policy"
import {
  clearAuthCookies,
  getAccessTokenFromRequest,
  getEmailFromRequest,
  getRefreshTokenFromRequest,
  isJwtExpired,
  setAuthCookies,
  type CookieSessionInput,
} from "@/lib/auth/cookies"
import { getAccessStatusForUser } from "@/lib/supabase/access-status"
import { getUser, refreshSession } from "@/lib/supabase/server"

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/check-email",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/auth/confirm",
  "/portal",
  "/api/client-portal",
]

const AUTH_ENTRY_PATHS = ["/login", "/signup"]

const ALLOWED_WHEN_BLOCKED = ["/access-blocked", "/billing", "/api/access/redeem-code"]

function isStaticPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg"
  )
}

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function isAuthEntryPath(pathname: string) {
  return AUTH_ENTRY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function isAllowedWhenBlocked(pathname: string) {
  return ALLOWED_WHEN_BLOCKED.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function toRelativePath(next: string | null, fallback = "/today") {
  if (!next || !next.startsWith("/")) {
    return fallback
  }
  return next
}

function sanitizePostLoginPath(next: string | null) {
  const candidate = toRelativePath(next, "/today")

  if (
    isAuthEntryPath(candidate) ||
    candidate === "/auth/callback" ||
    candidate === "/auth/confirm" ||
    candidate === "/check-email" ||
    candidate === "/forgot-password" ||
    candidate === "/reset-password"
  ) {
    return "/today"
  }

  return candidate
}

function withSessionCookies(response: NextResponse, sessionCookies: CookieSessionInput | null) {
  if (sessionCookies) {
    setAuthCookies(response, sessionCookies)
  }
  return response
}

function buildLoginRedirect(request: NextRequest, sessionCookies: CookieSessionInput | null) {
  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`)
  const response = NextResponse.redirect(loginUrl)
  clearAuthCookies(response)
  return withSessionCookies(response, sessionCookies)
}

function buildCheckEmailRedirect(request: NextRequest, email: string | null, sessionCookies: CookieSessionInput | null) {
  const checkEmailUrl = new URL("/check-email", request.url)
  if (email) {
    checkEmailUrl.searchParams.set("email", email)
  }
  const response = NextResponse.redirect(checkEmailUrl)
  return withSessionCookies(response, sessionCookies)
}

function buildAccessBlockedRedirect(request: NextRequest, reason: string, sessionCookies: CookieSessionInput | null) {
  const blockedUrl = new URL("/access-blocked", request.url)
  blockedUrl.searchParams.set("reason", reason)
  const response = NextResponse.redirect(blockedUrl)
  return withSessionCookies(response, sessionCookies)
}

function buildEnsureCoreStateRedirect(
  request: NextRequest,
  sessionCookies: CookieSessionInput | null,
  nextOverride?: string,
) {
  const ensureUrl = new URL("/api/auth/ensure-core-state", request.url)
  ensureUrl.searchParams.set(
    "next",
    nextOverride ?? `${request.nextUrl.pathname}${request.nextUrl.search}`,
  )
  const response = NextResponse.redirect(ensureUrl)
  return withSessionCookies(response, sessionCookies)
}

function buildAuthenticatedRedirect(
  request: NextRequest,
  sessionCookies: CookieSessionInput | null,
  nextOverride?: string,
) {
  const redirectUrl = new URL(nextOverride ?? "/today", request.url)
  const response = NextResponse.redirect(redirectUrl)
  return withSessionCookies(response, sessionCookies)
}

function buildAuthEntryResponse(sessionCookies: CookieSessionInput | null, clearCookies = false) {
  const response = NextResponse.next()
  if (clearCookies) {
    clearAuthCookies(response)
  }
  return withSessionCookies(response, sessionCookies)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticPath(pathname)) {
    return NextResponse.next()
  }

  let accessToken = getAccessTokenFromRequest(request)
  const refreshToken = getRefreshTokenFromRequest(request)
  let sessionCookies: CookieSessionInput | null = null

  if (!accessToken || isJwtExpired(accessToken)) {
    if (refreshToken) {
      const refreshed = await refreshSession(refreshToken)
      if (refreshed.data?.access_token && refreshed.data?.refresh_token) {
        accessToken = refreshed.data.access_token
        sessionCookies = {
          accessToken: refreshed.data.access_token,
          refreshToken: refreshed.data.refresh_token,
          email: refreshed.data.user?.email ?? null,
          provider:
            typeof refreshed.data.user?.app_metadata?.provider === "string"
              ? refreshed.data.user.app_metadata.provider
              : null,
          expiresIn: refreshed.data.expires_in,
        }
      }
    }
  }

  if (isAuthEntryPath(pathname)) {
    if (!accessToken) {
      return buildAuthEntryResponse(sessionCookies)
    }

    const userResult = await getUser(accessToken)
    if (!userResult.data) {
      return buildAuthEntryResponse(sessionCookies, true)
    }

    const email = userResult.data.email ?? getEmailFromRequest(request)
    const accessStatusResult = await getAccessStatusForUser(accessToken, userResult.data.id)

    if (accessStatusResult.data === null && accessStatusResult.error === null) {
      return buildEnsureCoreStateRedirect(
        request,
        sessionCookies,
        sanitizePostLoginPath(request.nextUrl.searchParams.get("next")),
      )
    }

    const accessPolicy = resolveWorkspaceAccessPolicy({
      isEmailVerified: Boolean(userResult.data.email_confirmed_at),
      accessStatus: accessStatusResult.data,
      now: new Date(),
    })

    if (accessPolicy.reason === "email-not-verified") {
      return buildCheckEmailRedirect(request, email, sessionCookies)
    }

    if (accessPolicy.canViewData) {
      return buildAuthenticatedRedirect(
        request,
        sessionCookies,
        sanitizePostLoginPath(request.nextUrl.searchParams.get("next")),
      )
    }

    return buildAccessBlockedRedirect(request, accessPolicy.reason, sessionCookies)
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  if (!accessToken) {
    return buildLoginRedirect(request, sessionCookies)
  }

  const userResult = await getUser(accessToken)
  if (!userResult.data) {
    return buildLoginRedirect(request, sessionCookies)
  }

  const email = userResult.data.email ?? getEmailFromRequest(request)
  const accessStatusResult = await getAccessStatusForUser(accessToken, userResult.data.id)

  if (accessStatusResult.data === null && accessStatusResult.error === null) {
    if (request.nextUrl.searchParams.get("core_state_checked") === "1") {
      if (isAllowedWhenBlocked(pathname)) {
        return withSessionCookies(NextResponse.next(), sessionCookies)
      }
      return buildAccessBlockedRedirect(request, "missing-access-status", sessionCookies)
    }

    return buildEnsureCoreStateRedirect(request, sessionCookies)
  }

  const accessPolicy = resolveWorkspaceAccessPolicy({
    isEmailVerified: Boolean(userResult.data.email_confirmed_at),
    accessStatus: accessStatusResult.data,
    now: new Date(),
  })

  if (accessPolicy.reason === "email-not-verified") {
    return buildCheckEmailRedirect(request, email, sessionCookies)
  }

  if (accessPolicy.canViewData) {
    if (pathname === "/access-blocked") {
      const response = NextResponse.redirect(new URL("/today", request.url))
      return withSessionCookies(response, sessionCookies)
    }

    return withSessionCookies(NextResponse.next(), sessionCookies)
  }

  if (isAllowedWhenBlocked(pathname)) {
    return withSessionCookies(NextResponse.next(), sessionCookies)
  }

  return buildAccessBlockedRedirect(request, accessPolicy.reason, sessionCookies)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
