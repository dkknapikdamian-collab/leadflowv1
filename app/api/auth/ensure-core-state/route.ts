import { NextRequest, NextResponse } from "next/server"
import { clearAuthCookies, getAccessTokenFromRequest } from "@/lib/auth/cookies"
import { ensureUserCoreState } from "@/lib/repository/access-state.server"
import { getAccessStatusForUser } from "@/lib/supabase/access-status"
import { getUser } from "@/lib/supabase/server"

function toRelativePath(next: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/today"
  }
  return next
}

export async function GET(request: NextRequest) {
  const nextPath = toRelativePath(request.nextUrl.searchParams.get("next"))
  const accessToken = getAccessTokenFromRequest(request)

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", nextPath)
    const response = NextResponse.redirect(loginUrl)
    clearAuthCookies(response)
    return response
  }

  const userResult = await getUser(accessToken)
  if (!userResult.data?.id) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", nextPath)
    const response = NextResponse.redirect(loginUrl)
    clearAuthCookies(response)
    return response
  }

  await ensureUserCoreState(userResult.data.id).catch(() => null)
  const accessStatusResult = await getAccessStatusForUser(accessToken, userResult.data.id)

  if (accessStatusResult.data) {
    const redirectUrl = new URL(nextPath, request.url)
    redirectUrl.searchParams.set("core_state_checked", "1")
    return NextResponse.redirect(redirectUrl)
  }

  const blockedUrl = new URL("/access-blocked", request.url)
  blockedUrl.searchParams.set("reason", "missing-access-status")
  blockedUrl.searchParams.set("core_state_checked", "1")
  return NextResponse.redirect(blockedUrl)
}
