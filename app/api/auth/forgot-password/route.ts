import { NextRequest, NextResponse } from "next/server"
import { normalizeAndValidateEmail } from "@/lib/auth/email"
import { getRequestFingerprint } from "@/lib/auth/request"
import { checkAuthRateLimit } from "@/lib/auth/rate-limit"
import { AUTH_RESET_SENT_MESSAGE } from "@/lib/auth/messages"
import { sendPasswordReset } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { email?: string }
  const { email, isValid } = normalizeAndValidateEmail(body.email ?? "")

  if (!isValid) {
    return NextResponse.json({ error: "Podaj poprawny e-mail." }, { status: 400 })
  }

  const rateLimit = checkAuthRateLimit("forgot-password", `${getRequestFingerprint(request)}:${email}`)
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: `Poczekaj około ${rateLimit.retryAfterSeconds}s przed kolejną próbą.` },
      { status: 429 },
    )
  }

  await sendPasswordReset(email)

  return NextResponse.json({ ok: true, message: AUTH_RESET_SENT_MESSAGE })
}
