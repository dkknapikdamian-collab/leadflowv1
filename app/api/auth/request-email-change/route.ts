import { NextRequest, NextResponse } from "next/server"
import { validateAccountEmailChange } from "@/lib/account/account-settings"
import { normalizeAndValidateEmail } from "@/lib/auth/email"
import { getAccessTokenFromRequest } from "@/lib/auth/cookies"
import { getUser } from "@/lib/supabase/server"
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/config"

async function updateUserEmail(accessToken: string, email: string) {
  const response = await fetch(`${getSupabaseUrl()}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: getSupabasePublishableKey(),
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  })

  const data = (await response.json().catch(() => ({}))) as { error?: string; msg?: string; message?: string }

  return {
    ok: response.ok,
    error:
      data.error ??
      data.msg ??
      data.message ??
      null,
  }
}

export async function POST(request: NextRequest) {
  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return NextResponse.json({ error: "Sesja wygasła. Zaloguj się ponownie." }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string }
  const { email, isValid } = normalizeAndValidateEmail(body.email ?? "")

  if (!isValid) {
    return NextResponse.json({ error: "Wpisz poprawny adres e-mail." }, { status: 400 })
  }

  const userResult = await getUser(accessToken)
  if (!userResult.data) {
    return NextResponse.json({ error: "Nie udało się odczytać sesji użytkownika." }, { status: 401 })
  }

  const validationError = validateAccountEmailChange(email, userResult.data.email ?? null)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const result = await updateUserEmail(accessToken, email)
  if (!result.ok) {
    return NextResponse.json(
      { error: "Nie udało się rozpocząć zmiany e-maila. Ten adres może być już używany albo chwilowo niedostępny." },
      { status: 400 },
    )
  }

  return NextResponse.json({
    ok: true,
    message: "Wysłaliśmy potwierdzenie zmiany e-maila. Sprawdź nową skrzynkę i potwierdź operację.",
  })
}
