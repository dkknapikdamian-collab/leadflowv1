import { NextRequest, NextResponse } from "next/server"
import { normalizeAndValidateEmail } from "@/lib/auth/email"
import { AUTH_SIGNUP_SENT_MESSAGE } from "@/lib/auth/messages"
import { getRequestFingerprint } from "@/lib/auth/request"
import { checkAuthRateLimit } from "@/lib/auth/rate-limit"
import { shouldReturnNeutralEmailActionSuccess } from "@/lib/auth/supabase-errors"
import { resendConfirmation } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string }
  const { email, isValid } = normalizeAndValidateEmail(body.email ?? "")

  if (!isValid) {
    return NextResponse.json({ error: "Podaj poprawny e-mail." }, { status: 400 })
  }

  const rateLimit = checkAuthRateLimit("resend-confirmation", `${getRequestFingerprint(request)}:${email}`)
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: `Poczekaj około ${rateLimit.retryAfterSeconds}s przed kolejną próbą.` },
      { status: 429 },
    )
  }

  const result = await resendConfirmation(email)

  if (result.error) {
    if (shouldReturnNeutralEmailActionSuccess(result.status, result.error)) {
      return NextResponse.json({ ok: true, message: AUTH_SIGNUP_SENT_MESSAGE })
    }

    return NextResponse.json(
      { error: "Nie udało się teraz ponowić wysyłki wiadomości." },
      { status: result.status >= 500 ? 500 : 400 },
    )
  }

  return NextResponse.json({ ok: true, message: AUTH_SIGNUP_SENT_MESSAGE })
}
