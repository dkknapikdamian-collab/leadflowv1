import { NextRequest, NextResponse } from "next/server"
import { getAccessTokenFromRequest } from "@/lib/auth/cookies"
import { redeemPromoCode } from "@/lib/repository/promo-codes.server"
import { ensureUserCoreState } from "@/lib/repository/access-state.server"
import { getUser } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return NextResponse.json({ error: "Brak aktywnej sesji." }, { status: 401 })
  }

  const userResult = await getUser(accessToken)
  if (!userResult.data?.id) {
    return NextResponse.json({ error: "Brak aktywnej sesji." }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { code?: string }
  const code = body.code?.trim() ?? ""

  if (!code) {
    return NextResponse.json({ error: "Podaj kod dostępu." }, { status: 400 })
  }

  await ensureUserCoreState(userResult.data.id).catch(() => null)

  const redeemResult = await redeemPromoCode({
    userId: userResult.data.id,
    code,
  })

  if (redeemResult.error || !redeemResult.data) {
    const message = redeemResult.error || "Nie udało się zrealizować kodu dostępu."
    const status = redeemResult.status && redeemResult.status >= 400 ? redeemResult.status : 400
    return NextResponse.json({ error: message }, { status })
  }

  return NextResponse.json({
    ok: true,
    accessOverrideMode: redeemResult.data.accessOverrideMode,
    accessOverrideExpiresAt: redeemResult.data.accessOverrideExpiresAt,
    accessOverrideNote: redeemResult.data.accessOverrideNote,
    accessStatus: redeemResult.data.accessStatus,
    paidUntil: redeemResult.data.paidUntil,
    effectType: redeemResult.data.effectType,
  })
}
