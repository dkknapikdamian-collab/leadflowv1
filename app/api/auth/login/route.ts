import { NextRequest, NextResponse } from "next/server"
import { normalizeAndValidateEmail } from "@/lib/auth/email"
import { getRequestFingerprint } from "@/lib/auth/request"
import { checkAuthRateLimit } from "@/lib/auth/rate-limit"
import { AUTH_GENERIC_LOGIN_ERROR } from "@/lib/auth/messages"
import { setAuthCookies } from "@/lib/auth/cookies"
import { ensureUserCoreState } from "@/lib/repository/access-state.server"
import { signInWithPassword } from "@/lib/supabase/server"

function toRelativePath(next: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/today"
  }
  return next
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string; next?: string }
  const { email, isValid } = normalizeAndValidateEmail(body.email ?? "")
  const password = (body.password ?? "").trim()
  const nextPath = toRelativePath(body.next ?? null)

  if (!isValid || !password) {
    return NextResponse.json({ error: AUTH_GENERIC_LOGIN_ERROR }, { status: 400 })
  }

  const rateLimit = checkAuthRateLimit("login", `${getRequestFingerprint(request)}:${email}`)
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: `Spróbuj ponownie za około ${rateLimit.retryAfterSeconds}s.` },
      { status: 429 },
    )
  }

  const result = await signInWithPassword(email, password)
  if (!result.data?.access_token || !result.data?.refresh_token) {
    return NextResponse.json({ error: AUTH_GENERIC_LOGIN_ERROR }, { status: 400 })
  }

  if (result.data.user?.id) {
    await ensureUserCoreState(result.data.user.id).catch(() => null)
  }

  const response = NextResponse.json({
    ok: true,
    redirectTo: `/api/auth/ensure-core-state?next=${encodeURIComponent(nextPath)}`,
  })
  setAuthCookies(response, {
    accessToken: result.data.access_token,
    refreshToken: result.data.refresh_token,
    email: result.data.user?.email ?? email,
    provider:
      typeof result.data.user?.app_metadata?.provider === "string"
        ? result.data.user.app_metadata.provider
        : "email",
    expiresIn: result.data.expires_in,
  })

  return response
}
