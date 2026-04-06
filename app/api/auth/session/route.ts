import { NextRequest, NextResponse } from "next/server"
import { evaluateAccessStatusDecision } from "@/lib/access/decision"
import {
  clearAuthCookies,
  getAccessTokenFromRequest,
  getAuthProviderFromRequest,
} from "@/lib/auth/cookies"
import { mapSupabaseUserToSessionUser } from "@/lib/auth/session"
import { getServerAccessStatusForUser, sanitizeAccessStatusForClient } from "@/lib/repository/access-state.server"
import { getUser } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return NextResponse.json({ session: null })
  }

  const result = await getUser(accessToken)
  if (!result.data) {
    const response = NextResponse.json({ session: null }, { status: 401 })
    clearAuthCookies(response)
    return response
  }

  const accessStatusResult = await getServerAccessStatusForUser(result.data.id)
  const decision = evaluateAccessStatusDecision({
    accessStatus: accessStatusResult.data,
    isEmailVerified: Boolean(result.data.email_confirmed_at),
    now: new Date(),
  })

  return NextResponse.json({
    session: {
      user: mapSupabaseUserToSessionUser(result.data, getAuthProviderFromRequest(request)),
      access: {
        record: accessStatusResult.data ? sanitizeAccessStatusForClient(accessStatusResult.data) : null,
        decision,
      },
    },
  })
}
