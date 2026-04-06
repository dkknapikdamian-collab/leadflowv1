import { NextRequest, NextResponse } from "next/server"
import { normalizeAndValidateEmail } from "@/lib/auth/email"
import { checkAuthRateLimit } from "@/lib/auth/rate-limit"
import { AUTH_GENERIC_LOGIN_ERROR } from "@/lib/auth/messages"
import { setAuthCookies } from "@/lib/auth/cookies"
import { signInWithPassword } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string }
  const { email, isValid } = normalizeAndValidateEmail(body.email ?? "")
  const password = (body.password ?? "").trim()

  if (!isValid || !password) {
    return NextResponse.json({ error: AUTH_GENERIC_LOGIN_ERROR }, { status: 400 })
  }

  const rateLimit = checkAuthRateLimit("login", `${request.ip ?? "unknown"}:${email}`)
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

  const response = NextResponse.json({ ok: true, redirectTo: "/today" })
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
