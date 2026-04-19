import { NextRequest, NextResponse } from "next/server"
import { clearAuthCookies, getAccessTokenFromRequest } from "@/lib/auth/cookies"
import {
  ensureUserCoreState,
  getServerAccessStatusForUser,
  sanitizeAccessStatusForClient,
} from "@/lib/repository/access-state.server"
import { getAppSnapshotForUser, upsertAppSnapshotForUser } from "@/lib/supabase/app-snapshot"
import { getUser } from "@/lib/supabase/server"
import type { AppSnapshot } from "@/lib/types"

function unauthorizedResponse() {
  const response = NextResponse.json({ error: "Brak aktywnej sesji." }, { status: 401 })
  clearAuthCookies(response)
  return response
}

export async function GET(request: NextRequest) {
  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return unauthorizedResponse()
  }

  const userResult = await getUser(accessToken)
  if (!userResult.data) {
    return unauthorizedResponse()
  }

  const backfillResult = await ensureUserCoreState(userResult.data.id).catch(() => null)
  const snapshotResult = await getAppSnapshotForUser(accessToken, userResult.data.id)
  if (snapshotResult.error) {
    return NextResponse.json({ error: "Nie udało się pobrać snapshotu." }, { status: 500 })
  }

  const accessStatusResult = await getServerAccessStatusForUser(userResult.data.id)
  const workspaceId =
    snapshotResult.data?.workspaceId ??
    accessStatusResult.data?.workspaceId ??
    backfillResult?.data?.workspaceId ??
    null

  return NextResponse.json({
    snapshot: snapshotResult.data?.snapshot ?? null,
    workspaceId,
    accessStatus: accessStatusResult.data ? sanitizeAccessStatusForClient(accessStatusResult.data) : null,
  })
}

export async function PUT(request: NextRequest) {
  const accessToken = getAccessTokenFromRequest(request)
  if (!accessToken) {
    return unauthorizedResponse()
  }

  const userResult = await getUser(accessToken)
  if (!userResult.data) {
    return unauthorizedResponse()
  }

  const body = (await request.json().catch(() => ({}))) as { snapshot?: AppSnapshot }
  if (!body.snapshot) {
    return NextResponse.json({ error: "Brakuje snapshotu do zapisu." }, { status: 400 })
  }

  const backfillResult = await ensureUserCoreState(userResult.data.id).catch(() => null)
  const accessStatusResult = await getServerAccessStatusForUser(userResult.data.id)
  const workspaceId = accessStatusResult.data?.workspaceId ?? backfillResult?.data?.workspaceId ?? null

  if (!workspaceId) {
    return NextResponse.json({ error: "Brakuje workspace do zapisu snapshotu." }, { status: 400 })
  }

  const nextSnapshot: AppSnapshot = {
    ...body.snapshot,
    context: {
      ...body.snapshot.context,
      userId: userResult.data.id,
      workspaceId,
    },
  }

  const saveResult = await upsertAppSnapshotForUser(accessToken, {
    userId: userResult.data.id,
    workspaceId,
    snapshot: nextSnapshot,
  })

  if (saveResult.error) {
    return NextResponse.json({ error: "Nie udało się zapisać snapshotu." }, { status: 500 })
  }

  return NextResponse.json({ ok: true, workspaceId })
}
