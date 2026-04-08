import { NextRequest, NextResponse } from "next/server"
import {
  findPortalTokenInSnapshot,
  isPortalTokenActive,
  listAppSnapshotsForPortalLookup,
  upsertAppSnapshotByUserId,
} from "@/lib/supabase/admin"
import type { AppNotification, AppSnapshot, Approval, CaseItem, CaseItemStatus, ClientPortalToken, FileAttachment } from "@/lib/types"
import { createId, nowIso } from "@/lib/utils"

type PortalActionType = "upload_file" | "choose_option" | "accept" | "reply"

function getCompletionStats(items: CaseItem[]) {
  const doneStatuses = new Set<CaseItemStatus>(["accepted", "not_applicable"])
  const done = items.filter((item) => doneStatuses.has(item.status)).length
  const requiredMissing = items.filter((item) => item.required && !doneStatuses.has(item.status)).length
  return {
    completenessPercent: items.length === 0 ? 0 : Math.round((done / items.length) * 100),
    missingCount: requiredMissing,
  }
}

function findSnapshotByToken(tokenHash: string, now: string) {
  return listAppSnapshotsForPortalLookup().then((result) => {
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
  })
}

function sanitizePortalResponse(snapshot: AppSnapshot, token: ClientPortalToken) {
  const caseRecord = (snapshot.cases ?? []).find((entry) => entry.id === token.caseId)
  if (!caseRecord) return null
  const items = (snapshot.caseItems ?? [])
    .filter((entry) => entry.caseId === caseRecord.id)
    .sort((left, right) => left.sortOrder - right.sortOrder)
  const stats = getCompletionStats(items)

  return {
    case: {
      id: caseRecord.id,
      title: caseRecord.title,
      message: "To prosty panel sprawy. Zrob swoje 3-4 kroki i gotowe.",
      missingText: `Brakuje ${stats.missingCount} rzeczy do startu`,
      completenessPercent: stats.completenessPercent,
    },
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      required: item.required,
      dueAt: item.dueAt,
      status: item.status,
      kind: item.kind,
      actionLabel:
        item.kind === "file"
          ? "Dodaj plik"
          : item.kind === "decision"
            ? "Wybierz opcje"
            : item.kind === "approval"
              ? "Zaakceptuj"
              : item.kind === "response"
                ? "Odpowiedz"
                : "Uzupełnij",
    })),
    summary: {
      done: items.filter((item) => item.status === "accepted" || item.status === "not_applicable").length,
      underReview: items.filter((item) => item.status === "delivered" || item.status === "under_review").length,
      waitingForClient: items.filter((item) => item.status === "none" || item.status === "request_sent" || item.status === "needs_correction").length,
    },
    token: {
      expiresAt: token.expiresAt,
      revokedAt: token.revokedAt,
    },
  }
}

function createPortalNotification(snapshot: AppSnapshot, caseId: string, itemId: string, title: string, body: string): AppNotification {
  const now = nowIso()
  return {
    id: createId("notif"),
    workspaceId: snapshot.context.workspaceId ?? "workspace_local",
    caseId,
    caseItemId: itemId,
    leadId: null,
    contactId: null,
    channel: "in_app",
    status: "queued",
    title,
    body,
    scheduledAt: now,
    sentAt: null,
    readAt: null,
    createdAt: now,
    updatedAt: now,
  }
}

function applyPortalAction(snapshot: AppSnapshot, token: ClientPortalToken, input: {
  action: PortalActionType
  caseItemId: string
  option?: string
  responseText?: string
  fileName?: string
  fileType?: string
  fileSizeBytes?: number
}) {
  const now = nowIso()
  const caseRecord = (snapshot.cases ?? []).find((entry) => entry.id === token.caseId)
  if (!caseRecord) return { snapshot, error: "Nie znaleziono sprawy." }

  const item = (snapshot.caseItems ?? []).find((entry) => entry.id === input.caseItemId && entry.caseId === caseRecord.id)
  if (!item) {
    return { snapshot, error: "Element nie należy do tej sprawy." }
  }

  const activityType: "file_uploaded" | "approval_decision" | "case_item_updated" =
    input.action === "upload_file"
      ? "file_uploaded"
      : input.action === "accept"
        ? "approval_decision"
        : "case_item_updated"

  const nextCaseItems = (snapshot.caseItems ?? []).map((entry) => {
    if (entry.id !== item.id) return entry
    let nextStatus: CaseItemStatus = entry.status
    if (input.action === "upload_file") nextStatus = "delivered"
    if (input.action === "choose_option") nextStatus = "delivered"
    if (input.action === "accept") nextStatus = "accepted"
    if (input.action === "reply") nextStatus = "delivered"

    return {
      ...entry,
      status: nextStatus,
      completedAt: nextStatus === "accepted" ? now : entry.completedAt,
      updatedAt: now,
    }
  })

  const nextActivity = [
    {
      id: createId("activity"),
      workspaceId: snapshot.context.workspaceId ?? "workspace_local",
      actorUserId: null,
      actorContactId: token.contactId,
      source: "operations" as const,
      type: activityType,
      leadId: null,
      caseId: caseRecord.id,
      caseItemId: item.id,
      attachmentId: null,
      approvalId: null,
      notificationId: null,
      payload: {
        action: input.action,
        option: input.option ?? null,
        responseText: input.responseText ?? null,
        fileName: input.fileName ?? null,
      },
      createdAt: now,
    },
    ...(snapshot.activityLog ?? []),
  ]

  const notifications = [
    createPortalNotification(snapshot, caseRecord.id, item.id, "Nowa aktywność klienta", `${item.title}: ${input.action}`),
    ...(snapshot.notifications ?? []),
  ]

  let attachments = snapshot.fileAttachments ?? []
  if (input.action === "upload_file" && input.fileName) {
    const attachment: FileAttachment = {
      id: createId("att"),
      workspaceId: snapshot.context.workspaceId ?? "workspace_local",
      caseId: caseRecord.id,
      caseItemId: item.id,
      scope: "case_item",
      uploadedByUserId: null,
      fileName: input.fileName,
      fileType: input.fileType || "application/octet-stream",
      fileSizeBytes: Number.isFinite(input.fileSizeBytes) ? Number(input.fileSizeBytes) : 0,
      storagePath: `portal-upload/${caseRecord.id}/${createId("file")}-${input.fileName}`,
      createdAt: now,
    }
    attachments = [attachment, ...attachments]
  }

  let approvals = snapshot.approvals ?? []
  if (input.action === "accept") {
    const existing = approvals.find((entry) => entry.caseItemId === item.id)
    if (existing) {
      approvals = approvals.map((entry) =>
        entry.id === existing.id
          ? {
              ...entry,
              status: "answered",
              decidedAt: now,
              decisionNote: "Akceptacja z panelu klienta.",
              updatedAt: now,
            }
          : entry,
      )
    } else {
      const approval: Approval = {
        id: createId("approval"),
        workspaceId: snapshot.context.workspaceId ?? "workspace_local",
        caseId: caseRecord.id,
        caseItemId: item.id,
        requestedByUserId: null,
        reviewerUserId: null,
        reviewerContactId: token.contactId,
        status: "answered",
        title: `Akceptacja: ${item.title}`,
        description: "Klient zaakceptował element w panelu publicznym.",
        dueAt: null,
        decidedAt: now,
        decisionNote: "Akceptacja z panelu klienta.",
        createdAt: now,
        updatedAt: now,
      }
      approvals = [approval, ...approvals]
    }
  }

  return {
    error: null,
    snapshot: {
      ...snapshot,
      caseItems: nextCaseItems,
      activityLog: nextActivity,
      fileAttachments: attachments,
      approvals,
      notifications,
      clientPortalTokens: (snapshot.clientPortalTokens ?? []).map((entry) =>
        entry.id === token.id
          ? {
              ...entry,
              lastUsedAt: now,
              updatedAt: now,
            }
          : entry,
      ),
    },
  }
}

export async function GET(_request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params
  const now = nowIso()
  const found = await findSnapshotByToken(token, now)
  if (!found) {
    return NextResponse.json({ error: "Nieprawidłowy link klienta." }, { status: 404 })
  }
  if (found.expired) {
    return NextResponse.json({ error: "Link wygasł lub został odwołany." }, { status: 410 })
  }

  const payload = sanitizePortalResponse(found.row.snapshot, found.token)
  if (!payload) {
    return NextResponse.json({ error: "Nie znaleziono sprawy dla tokenu." }, { status: 404 })
  }

  return NextResponse.json(payload)
}

export async function POST(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params
  const now = nowIso()
  const found = await findSnapshotByToken(token, now)
  if (!found) {
    return NextResponse.json({ error: "Nieprawidłowy link klienta." }, { status: 404 })
  }
  if (found.expired) {
    return NextResponse.json({ error: "Link wygasł lub został odwołany." }, { status: 410 })
  }

  const body = (await request.json().catch(() => null)) as {
    action?: PortalActionType
    caseItemId?: string
    option?: string
    responseText?: string
    fileName?: string
    fileType?: string
    fileSizeBytes?: number
  } | null

  if (!body?.action || !body.caseItemId) {
    return NextResponse.json({ error: "Brakuje danych akcji." }, { status: 400 })
  }

  const changed = applyPortalAction(found.row.snapshot, found.token, {
    action: body.action,
    caseItemId: body.caseItemId,
    option: body.option,
    responseText: body.responseText,
    fileName: body.fileName,
    fileType: body.fileType,
    fileSizeBytes: body.fileSizeBytes,
  })

  if (changed.error) {
    return NextResponse.json({ error: changed.error }, { status: 400 })
  }

  const save = await upsertAppSnapshotByUserId({
    userId: found.row.userId,
    workspaceId: found.row.workspaceId,
    snapshot: changed.snapshot,
  })
  if (save.error) {
    return NextResponse.json({ error: "Nie udało się zapisać akcji klienta." }, { status: 500 })
  }

  const payload = sanitizePortalResponse(changed.snapshot, found.token)
  if (!payload) {
    return NextResponse.json({ error: "Nie znaleziono sprawy po zapisie." }, { status: 404 })
  }

  return NextResponse.json({ ok: true, payload })
}
