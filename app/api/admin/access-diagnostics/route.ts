import { NextRequest, NextResponse } from "next/server"
import { buildAccessDiagnosticsPayload, isPrimaryAdminEmail, normalizeEmail } from "@/lib/access/diagnostics"
import { getAccessTokenFromRequest } from "@/lib/auth/cookies"
import {
  getServerAccessStatusForUser,
  getServerProfileByNormalizedEmail,
} from "@/lib/repository/access-state.server"
import { getUser } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return NextResponse.json({ error: "Brak aktywnej sesji." }, { status: 401 })
  }

  const sessionUserResult = await getUser(accessToken)
  if (!sessionUserResult.data?.id) {
    return NextResponse.json({ error: "Brak aktywnej sesji." }, { status: 401 })
  }

  const sessionEmail = normalizeEmail(sessionUserResult.data.email)
  if (!isPrimaryAdminEmail(sessionEmail)) {
    return NextResponse.json({ error: "Brak dostępu do diagnostyki admina." }, { status: 403 })
  }

  const requestedEmail = normalizeEmail(request.nextUrl.searchParams.get("email")) ?? sessionEmail

  if (!requestedEmail) {
    return NextResponse.json({ error: "Brak adresu e-mail do diagnozy." }, { status: 400 })
  }

  const ownEmail = sessionEmail === requestedEmail
  const profileResult = await getServerProfileByNormalizedEmail(requestedEmail)

  if (!profileResult.data) {
    return NextResponse.json(
      buildAccessDiagnosticsPayload({
        targetEmail: requestedEmail,
        sessionUserId: sessionUserResult.data.id,
        sessionEmail,
        subjectEmail: requestedEmail,
        userFound: false,
        profileFound: false,
        isEmailVerified: false,
        accessStatus: null,
        now: new Date(),
      }),
    )
  }

  const accessStatusResult = await getServerAccessStatusForUser(profileResult.data.userId)

  return NextResponse.json(
    buildAccessDiagnosticsPayload({
      targetEmail: requestedEmail,
      sessionUserId: sessionUserResult.data.id,
      sessionEmail,
      subjectUserId: profileResult.data.userId,
      subjectEmail: profileResult.data.normalizedEmail,
      userFound: true,
      profileFound: true,
      isEmailVerified: ownEmail
        ? Boolean(sessionUserResult.data.email_confirmed_at)
        : profileResult.data.isEmailVerified,
      accessStatus: accessStatusResult.data,
      now: new Date(),
    }),
  )
}
