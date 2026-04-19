import { NextRequest, NextResponse } from "next/server"
import { getAccessTokenFromRequest, getAuthProviderFromRequest } from "@/lib/auth/cookies"
import { mapSupabaseUserToSessionUser } from "@/lib/auth/session"
import { validateNewPassword } from "@/lib/account/account-settings"
import { getUser, updateUserPassword } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return NextResponse.json({ error: "Sesja wygasła. Zaloguj się ponownie." }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    password?: string
    confirmPassword?: string
    passwordConfirm?: string
  }

  const password = body.password ?? ""
  const confirmPassword = body.confirmPassword ?? body.passwordConfirm ?? ""
  const validationError = validateNewPassword(password, confirmPassword)

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const userResult = await getUser(accessToken)
  if (!userResult.data) {
    return NextResponse.json({ error: "Nie udało się odczytać sesji użytkownika." }, { status: 401 })
  }

  const sessionUser = mapSupabaseUserToSessionUser(
    userResult.data,
    getAuthProviderFromRequest(request),
  )

  const canUseLocalPassword =
    sessionUser.provider === "email" ||
    sessionUser.provider === "email_password" ||
    sessionUser.hasPassword === true

  if (!canUseLocalPassword) {
    return NextResponse.json(
      {
        error:
          "To konto używa Google jako głównej metody logowania. Zmiana lokalnego hasła nie jest teraz dostępna.",
      },
      { status: 400 },
    )
  }

  const result = await updateUserPassword(accessToken, password)
  if (!result.data) {
    return NextResponse.json({ error: result.error ?? "Nie udało się zmienić hasła." }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    message: "Hasło zostało zmienione.",
  })
}
