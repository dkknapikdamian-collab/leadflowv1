import { NextRequest, NextResponse } from "next/server"
import { buildAccessDiagnosticsPayload, isPrimaryAdminEmail, normalizeEmail } from "@/lib/access/diagnostics"
import { getAccessTokenFromRequest } from "@/lib/auth/cookies"
import {
  ensureUserCoreState,
  getServerAccessStatusForUser,
  getServerProfileByNormalizedEmail,
} from "@/lib/repository/access-state.server"
import { getUser } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
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
    return NextResponse.json({ error: "Brak dostępu do naprawy admina." }, { status: 403 })
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string | null }
  const requestedEmail = normalizeEmail(body.email) ?? sessionEmail

  if (!requestedEmail) {
    return NextResponse.json({ error: "Brak adresu e-mail do naprawy." }, { status: 400 })
  }

  const ownEmail = sessionEmail === requestedEmail
  const profileResult = await getServerProfileByNormalizedEmail(requestedEmail)

  if (!profileResult.data) {
    return NextResponse.json(
      {
        repaired: false,
        ...buildAccessDiagnosticsPayload({
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
      },
      { status: 404 },
    )
  }

  const repairResult = await ensureUserCoreState(profileResult.data.userId)
  const accessStatusResult = await getServerAccessStatusForUser(profileResult.data.userId)

  return NextResponse.json({
    repaired: Boolean(repairResult.data?.workspaceId),
    repairedWorkspaceId: repairResult.data?.workspaceId ?? null,
    ...buildAccessDiagnosticsPayload({
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
  })
}
