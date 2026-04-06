import { NextResponse, type NextRequest } from "next/server"
import {
  clearAuthCookies,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
  isJwtExpired,
  setAuthCookies,
} from "@/lib/auth/cookies"
import { refreshSession } from "@/lib/supabase/server"

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/check-email",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/auth/confirm",
]

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

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (isStaticPath(pathname) || isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const accessToken = getAccessTokenFromRequest(request)
  const refreshToken = getRefreshTokenFromRequest(request)

  if (accessToken && !isJwtExpired(accessToken)) {
    return NextResponse.next()
  }

  if (refreshToken) {
    const refreshed = await refreshSession(refreshToken)
    if (refreshed.data?.access_token && refreshed.data?.refresh_token) {
      const response = NextResponse.next()
      setAuthCookies(response, {
        accessToken: refreshed.data.access_token,
        refreshToken: refreshed.data.refresh_token,
        email: refreshed.data.user?.email ?? null,
        provider: typeof refreshed.data.user?.app_metadata?.provider === "string" ? refreshed.data.user.app_metadata.provider : null,
        expiresIn: refreshed.data.expires_in,
      })
      return response
    }
  }

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("next", `${pathname}${search}`)

  const response = NextResponse.redirect(loginUrl)
  clearAuthCookies(response)
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
