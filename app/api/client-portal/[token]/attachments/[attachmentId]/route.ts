import { NextRequest, NextResponse } from "next/server"
import { verifySignedAttachmentAccess } from "@/lib/storage/signed-access"
import { findPortalTokenInSnapshot, isPortalTokenActive, listAppSnapshotsForPortalLookup } from "@/lib/supabase/admin"
import { nowIso } from "@/lib/utils"

async function findSnapshotByToken(tokenHash: string, now: string) {
  const result = await listAppSnapshotsForPortalLookup()
  if (!result.data) return null

  for (const row of result.data) {
    const token = findPortalTokenInSnapshot(row.snapshot, tokenHash)
    if (!token) continue
    if (!isPortalTokenActive(token, now)) {
      return { row, token, expired: true as const }
    }
    return { row, token, expired: false as const }
  }

  return null
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string; attachmentId: string }> },
) {
  const { token, attachmentId } = await context.params
  const now = nowIso()

  const found = await findSnapshotByToken(token, now)
  if (!found) {
    return NextResponse.json({ error: "Nieprawidlowy link klienta." }, { status: 404 })
  }
  if (found.expired) {
    return NextResponse.json({ error: "Link wygasl lub zostal odwolany." }, { status: 410 })
  }

  const expiresAt = request.nextUrl.searchParams.get("expiresAt") ?? ""
  const sig = request.nextUrl.searchParams.get("sig") ?? ""
  const canAccess = verifySignedAttachmentAccess({ attachmentId, expiresAt, sig }, found.token.tokenHash)
  if (!canAccess) {
    return NextResponse.json({ error: "Brak dostepu do pliku lub podpis wygasl." }, { status: 403 })
  }

  const attachment = (found.row.snapshot.fileAttachments ?? []).find(
    (entry) => entry.id === attachmentId && entry.caseId === found.token.caseId,
  )
  if (!attachment) {
    return NextResponse.json({ error: "Plik nie istnieje." }, { status: 404 })
  }

  return NextResponse.json({
    ok: true,
    file: {
      id: attachment.id,
      name: attachment.fileName,
      type: attachment.fileType,
      sizeBytes: attachment.fileSizeBytes,
      createdAt: attachment.createdAt,
    },
    note: "Dostep przyznany. Publiczny, niepodpisany endpoint do plikow jest zablokowany.",
  })
}
