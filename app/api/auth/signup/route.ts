import { NextRequest, NextResponse } from "next/server"
import { normalizeAndValidateEmail } from "@/lib/auth/email"
import { checkAuthRateLimit } from "@/lib/auth/rate-limit"
import { AUTH_SIGNUP_SENT_MESSAGE } from "@/lib/auth/messages"
import { signUpWithPassword } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string }
  const { email, isValid } = normalizeAndValidateEmail(body.email ?? "")
  const password = body.password ?? ""

  if (!isValid || password.trim().length < 8) {
    return NextResponse.json(
      { error: "Podaj poprawny e-mail i hasło o długości co najmniej 8 znaków." },
      { status: 400 },
    )
  }

  const rateLimit = checkAuthRateLimit("signup", `${request.ip ?? "unknown"}:${email}`)
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: `Spróbuj ponownie za około ${rateLimit.retryAfterSeconds}s.` },
      { status: 429 },
    )
  }

  await signUpWithPassword(email, password)

  return NextResponse.json({
    ok: true,
    email,
    message: AUTH_SIGNUP_SENT_MESSAGE,
    redirectTo: `/check-email?email=${encodeURIComponent(email)}`,
  })
}
