import { NextRequest, NextResponse } from "next/server"
import { getAccessTokenFromRequest } from "@/lib/auth/cookies"
import { getRequestFingerprint } from "@/lib/auth/request"
import { checkAuthRateLimit } from "@/lib/auth/rate-limit"
import { updateUserPassword } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    password?: string
    passwordConfirm?: string
  }

  const password = body.password ?? ""
  const passwordConfirm = body.passwordConfirm ?? ""

  if (password.trim().length < 8) {
    return NextResponse.json(
      { error: "Hasło musi mieć co najmniej 8 znaków." },
      { status: 400 },
    )
  }

  if (password !== passwordConfirm) {
    return NextResponse.json(
      { error: "Hasła muszą być identyczne." },
      { status: 400 },
    )
  }

  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return NextResponse.json(
      { error: "Sesja wygasła. Poproś o nowy link resetu albo zaloguj się ponownie." },
      { status: 401 },
    )
  }

  const rateLimit = checkAuthRateLimit("verify-token", getRequestFingerprint(request))
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: `Poczekaj około ${rateLimit.retryAfterSeconds}s przed kolejną próbą.` },
      { status: 429 },
    )
  }

  const result = await updateUserPassword(accessToken, password)
  if (result.error) {
    return NextResponse.json(
      { error: "Nie udało się ustawić nowego hasła." },
      { status: 400 },
    )
  }

  return NextResponse.json({
    ok: true,
    message: "Hasło zostało ustawione.",
    redirectTo: "/today",
  })
}
