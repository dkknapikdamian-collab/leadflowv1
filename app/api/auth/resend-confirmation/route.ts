import { NextRequest, NextResponse } from "next/server"
import { normalizeAndValidateEmail } from "@/lib/auth/email"
import { checkAuthRateLimit } from "@/lib/auth/rate-limit"
import { AUTH_SIGNUP_SENT_MESSAGE } from "@/lib/auth/messages"
import { resendConfirmation } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string }
  const { email, isValid } = normalizeAndValidateEmail(body.email ?? "")

  if (!isValid) {
    return NextResponse.json({ error: "Podaj poprawny e-mail." }, { status: 400 })
  }

  const rateLimit = checkAuthRateLimit("resend-confirmation", `${request.ip ?? "unknown"}:${email}`)
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: `Poczekaj około ${rateLimit.retryAfterSeconds}s przed kolejną próbą.` },
      { status: 429 },
    )
  }

  await resendConfirmation(email)

  return NextResponse.json({ ok: true, message: AUTH_SIGNUP_SENT_MESSAGE })
}
