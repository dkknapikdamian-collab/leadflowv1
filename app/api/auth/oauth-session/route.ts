import { NextRequest, NextResponse } from "next/server"
import { setAuthCookies } from "@/lib/auth/cookies"
import { ensureUserCoreState } from "@/lib/repository/access-state.server"
import { getUser } from "@/lib/supabase/server"

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

  const userResult = await getUser(body.accessToken)

  if (userResult.data?.id) {
    await ensureUserCoreState(userResult.data.id).catch(() => null)
  }

  const response = NextResponse.json({ ok: true, redirectTo: "/today" })
  setAuthCookies(response, {
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    email: userResult.data?.email ?? body.email ?? null,
    provider:
      typeof userResult.data?.app_metadata?.provider === "string"
        ? userResult.data.app_metadata.provider
        : body.provider ?? "google",
    expiresIn: body.expiresIn ?? null,
  })

  return response
}
