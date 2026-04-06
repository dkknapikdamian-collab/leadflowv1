import { NextRequest, NextResponse } from "next/server"
import { setAuthCookies } from "@/lib/auth/cookies"

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    accessToken?: string
    refreshToken?: string
    email?: string | null
    provider?: string | null
    expiresIn?: number | null
  }

  if (!body.accessToken || !body.refreshToken) {
    return NextResponse.json({ error: "Brakuje tokenów sesji." }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true, redirectTo: "/today" })
  setAuthCookies(response, {
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    email: body.email ?? null,
    provider: body.provider ?? "google",
    expiresIn: body.expiresIn ?? null,
  })

  return response
}
