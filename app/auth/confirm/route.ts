import { NextRequest, NextResponse } from "next/server"
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies"
import { verifyOtp } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash")
  const type = request.nextUrl.searchParams.get("type")
  const next = request.nextUrl.searchParams.get("next") || "/today"

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login?error=auth-link-invalid", request.url))
  }

  const result = await verifyOtp(tokenHash, type)
  if (result.error) {
    const invalidResponse = NextResponse.redirect(new URL("/login?error=auth-link-invalid", request.url))
    clearAuthCookies(invalidResponse)
    return invalidResponse
  }

  const redirectPath = type === "recovery" ? "/reset-password" : next
  const response = NextResponse.redirect(new URL(redirectPath, request.url))

  if (result.data?.session?.access_token && result.data?.session?.refresh_token) {
    setAuthCookies(response, {
      accessToken: result.data.session.access_token,
      refreshToken: result.data.session.refresh_token,
      email: result.data.user?.email ?? null,
      provider:
        typeof result.data.user?.app_metadata?.provider === "string"
          ? result.data.user.app_metadata.provider
          : "email",
      expiresIn: result.data.session.expires_in,
    })
  }

  return response
}
