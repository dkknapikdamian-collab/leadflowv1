import { NextRequest, NextResponse } from "next/server"
import { buildGoogleOAuthUrl } from "@/lib/supabase/server"

function toRelativePath(next: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/today"
  }
  return next
}

export async function GET(request: NextRequest) {
  const nextPath = toRelativePath(request.nextUrl.searchParams.get("next"))
  return NextResponse.redirect(buildGoogleOAuthUrl(nextPath))
}
