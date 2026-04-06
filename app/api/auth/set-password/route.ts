import { NextRequest, NextResponse } from "next/server"
import { getAccessTokenFromRequest } from "@/lib/auth/cookies"
import { updateUserPassword } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { password?: string; confirmPassword?: string }
  const password = body.password ?? ""
  const confirmPassword = body.confirmPassword ?? ""

  if (password.length < 8) {
    return NextResponse.json({ error: "Hasło musi mieć co najmniej 8 znaków." }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Hasła muszą być identyczne." }, { status: 400 })
  }

  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return NextResponse.json({ error: "Sesja odzyskiwania wygasła. Poproś o nowy link." }, { status: 401 })
  }

  const result = await updateUserPassword(accessToken, password)
  if (result.error) {
    return NextResponse.json({ error: "Nie udało się ustawić nowego hasła." }, { status: 400 })
  }

  return NextResponse.json({ ok: true, redirectTo: "/today" })
}
