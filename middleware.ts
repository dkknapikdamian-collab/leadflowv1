import { NextResponse, type NextRequest } from "next/server"
import { resolveAccessState } from "@/lib/access/machine"
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
]

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

function isAllowedWhenBlocked(pathname: string) {
  return ALLOWED_WHEN_BLOCKED.some((path) => pathname === path || pathname.startsWith(`${path}/`))
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticPath(pathname) || isPublicPath(pathname)) {
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

  if (!accessToken) {
    return buildLoginRedirect(request, sessionCookies)
  }

  const userResult = await getUser(accessToken)
  if (!userResult.data) {
    return buildLoginRedirect(request, sessionCookies)
  }

  const email = userResult.data.email ?? getEmailFromRequest(request)
  const accessStatusResult = await getAccessStatusForUser(accessToken, userResult.data.id)
  const accessState = resolveAccessState({
    isEmailVerified: Boolean(userResult.data.email_confirmed_at),
    accessStatus: accessStatusResult.data,
    now: new Date(),
  })

  if (accessState.mustVerifyEmail) {
    return buildCheckEmailRedirect(request, email, sessionCookies)
  }

  if (accessState.canUseApp) {
    if (pathname === "/access-blocked") {
      const response = NextResponse.redirect(new URL("/today", request.url))
      return withSessionCookies(response, sessionCookies)
    }

    return withSessionCookies(NextResponse.next(), sessionCookies)
  }

  if (accessStatusResult.data === null && accessStatusResult.error === null) {
    return withSessionCookies(NextResponse.next(), sessionCookies)
  }

  if (isAllowedWhenBlocked(pathname)) {
    return withSessionCookies(NextResponse.next(), sessionCookies)
  }

  return buildAccessBlockedRedirect(request, accessState.reason, sessionCookies)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
