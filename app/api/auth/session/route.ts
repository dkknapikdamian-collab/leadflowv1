import { NextRequest, NextResponse } from "next/server"
import {
  clearAuthCookies,
  getAccessTokenFromRequest,
  getAuthProviderFromRequest,
} from "@/lib/auth/cookies"
import { mapSupabaseUserToSessionUser } from "@/lib/auth/session"
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

  return NextResponse.json({
    session: {
      user: mapSupabaseUserToSessionUser(result.data, getAuthProviderFromRequest(request)),
    },
  })
}
