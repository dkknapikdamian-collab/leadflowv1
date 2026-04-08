import { NextRequest, NextResponse } from "next/server"
import {
  findPortalTokenInSnapshot,
  isPortalTokenActive,
  listAppSnapshotsForPortalLookup,
  upsertAppSnapshotByUserId,
} from "@/lib/supabase/admin"
import { ALLOWED_UPLOAD_MIME_TYPES, MAX_UPLOAD_SIZE_BYTES, validateUploadMeta } from "@/lib/storage/upload-policy"
import { createSignedAttachmentAccess } from "@/lib/storage/signed-access"
import { resolveSnapshotAccessPolicy } from "@/lib/access/policy"
import { checkSecurityRateLimit, getRequestClientIp } from "@/lib/security/rate-limit"
import type {
  AppNotification,
  AppSnapshot,
  ActivityLogEntry,
  Approval,
  ApprovalStatus,
  Case,
  CaseItem,
  CaseItemStatus,
  CaseStatus,
  ClientPortalToken,
  FileAttachment,
  WorkItem,
} from "@/lib/types"
import { createId, nowIso } from "@/lib/utils"

type PortalActionType = "upload_file" | "choose_option" | "approval_decision" | "reply"
type ApprovalDecision = "accepted" | "rejected" | "needs_changes"
type PortalOption = "Opcja A" | "Opcja B" | "Opcja C"

const DONE_STATUSES = new Set<CaseItemStatus>(["accepted", "not_applicable"])
const PENDING_STATUSES = new Set<CaseItemStatus>(["none", "request_sent", "delivered"])

function getCompletionStats(items: CaseItem[]) {
  const done = items.filter((item) => DONE_STATUSES.has(item.status)).length
  const requiredMissing = items.filter((item) => item.required && !DONE_STATUSES.has(item.status)).length
  return {
    completenessPercent: items.length === 0 ? 0 : Math.round((done / items.length) * 100),
    missingCount: requiredMissing,
  }
}

function isValidPortalOption(value: string | undefined): value is PortalOption {
  return value === "Opcja A" || value === "Opcja B" || value === "Opcja C"
}

function decisionToApprovalStatus(decision: ApprovalDecision): ApprovalStatus {
  if (decision === "accepted") return "accepted"
  if (decision === "rejected") return "rejected"
  return "needs_changes"
}

function decisionToCaseItemStatus(decision: ApprovalDecision): CaseItemStatus {
  return decision === "accepted" ? "accepted" : "needs_correction"
}

function deriveCaseStatusAfterPortalAction(caseRecord: Case, nextCaseItems: CaseItem[]): { status: CaseStatus; blockedByMissingRequired: boolean } {
  const requiredItems = nextCaseItems.filter((item) => item.required)
  const hasNeedsCorrection = requiredItems.some((item) => item.status === "needs_correction")
  const hasUnderReview = requiredItems.some((item) => item.status === "under_review")
  const hasPending = requiredItems.some((item) => PENDING_STATUSES.has(item.status))

  if (hasNeedsCorrection) return { status: "blocked", blockedByMissingRequired: true }
  if (hasUnderReview) return { status: "under_review", blockedByMissingRequired: false }
  if (hasPending) return { status: "waiting_for_client", blockedByMissingRequired: true }

  if (requiredItems.length > 0 && requiredItems.every((item) => DONE_STATUSES.has(item.status))) {
    if (
      caseRecord.status === "blocked"
      || caseRecord.status === "waiting_for_client"
      || caseRecord.status === "collecting_materials"
      || caseRecord.status === "not_started"
      || caseRecord.status === "under_review"
    ) {
      return { status: "ready_to_start", blockedByMissingRequired: false }
    }
  }

  return { status: caseRecord.status, blockedByMissingRequired: Boolean(caseRecord.blockedByMissingRequired) }
}

function createOwnerAutomationTask(input: {
  snapshot: AppSnapshot
  caseRecord: Case
  title: string
  description: string
  marker: string
  at: string
}): WorkItem | null {
  const markerTag = `[auto:${input.marker}]`
  const hasOpenTask = (input.snapshot.items ?? []).some(
    (item) => item.status !== "done" && item.recordType === "task" && item.description.includes(markerTag),
  )
  if (hasOpenTask) return null

  return {
    id: createId("item"),
    workspaceId: input.snapshot.context.workspaceId ?? "workspace_local",
    leadId: input.caseRecord.sourceLeadId,
    leadLabel: "",
    recordType: "task",
    type: "task",
    title: input.title,
    description: `${input.description}\n${markerTag}`,
    status: "todo",
    priority: "high",
    scheduledAt: input.at,
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    createdAt: input.at,
    updatedAt: input.at,
    showInTasks: true,
    showInCalendar: false,
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

function rateLimitedResponse(retryAfterSeconds: number, message = "Za duzo prob. Sprobuj ponownie za chwile.") {
  return NextResponse.json(
    { error: message },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  )
}

function appendPortalOpenedActivity(snapshot: AppSnapshot, token: ClientPortalToken, at: string) {
  const caseRecord = (snapshot.cases ?? []).find((entry) => entry.id === token.caseId)
  if (!caseRecord) return snapshot

  const activity = snapshot.activityLog ?? []
  const lastOpen = activity.find(
    (entry) =>
      entry.type === "portal_opened"
      && entry.caseId === caseRecord.id
      && entry.actorContactId === token.contactId,
  )

  const shouldSkip = lastOpen && (Date.parse(at) - Date.parse(lastOpen.createdAt)) < 5 * 60 * 1000
  if (shouldSkip) {
    return {
      ...snapshot,
      clientPortalTokens: (snapshot.clientPortalTokens ?? []).map((entry) =>
        entry.id === token.id
          ? {
              ...entry,
              lastUsedAt: at,
              updatedAt: at,
            }
          : entry,
      ),
    }
  }

  const portalOpenedEntry: ActivityLogEntry = {
    id: createId("activity"),
    workspaceId: caseRecord.workspaceId,
    actorUserId: null,
    actorContactId: token.contactId,
    source: "system",
    type: "portal_opened",
    leadId: caseRecord.sourceLeadId ?? null,
    caseId: caseRecord.id,
    caseItemId: null,
    attachmentId: null,
    approvalId: null,
    notificationId: null,
    payload: { tokenId: token.id },
    createdAt: at,
  }

  return {
    ...snapshot,
    activityLog: [
      portalOpenedEntry,
      ...activity,
    ],
    clientPortalTokens: (snapshot.clientPortalTokens ?? []).map((entry) =>
      entry.id === token.id
        ? {
            ...entry,
            lastUsedAt: at,
            updatedAt: at,
          }
        : entry,
    ),
  }
}

function sanitizePortalResponse(snapshot: AppSnapshot, token: ClientPortalToken) {
  const caseRecord = (snapshot.cases ?? []).find((entry) => entry.id === token.caseId)
  if (!caseRecord) return null
  const accessPolicy = resolveSnapshotAccessPolicy(snapshot)

  const items = (snapshot.caseItems ?? [])
    .filter((entry) => entry.caseId === caseRecord.id)
    .sort((left, right) => left.sortOrder - right.sortOrder)
  const stats = getCompletionStats(items)
  const attachments = snapshot.fileAttachments ?? []
  const approvals = snapshot.approvals ?? []

  return {
    case: {
      id: caseRecord.id,
      title: caseRecord.title,
      message: "To prosty panel sprawy. Zrob swoje 3-4 kroki i gotowe.",
      missingText: `Brakuje ${stats.missingCount} rzeczy do startu`,
      completenessPercent: stats.completenessPercent,
      status: caseRecord.status,
    },
    items: items.map((item) => {
      const latestAttachment = attachments
        .filter((entry) => entry.caseItemId === item.id)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0] ?? null

      const latestApproval = approvals
        .filter((entry) => entry.caseItemId === item.id)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0] ?? null

      return {
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
                ? "Zatwierdz / odeslij"
                : item.kind === "response"
                  ? "Odpowiedz"
                  : "Uzupelnij",
        latestAttachment: latestAttachment
          ? {
              id: latestAttachment.id,
              fileName: latestAttachment.fileName,
              fileType: latestAttachment.fileType,
              fileSizeBytes: latestAttachment.fileSizeBytes,
              addedAt: latestAttachment.createdAt,
              addedBy: latestAttachment.uploadedByUserId ? "Uzytkownik" : "Klient",
              access: createSignedAttachmentAccess(latestAttachment.id, token.tokenHash, 20),
            }
          : null,
        latestApproval: latestApproval
          ? {
              id: latestApproval.id,
              status: latestApproval.status,
              decidedAt: latestApproval.decidedAt,
              decisionNote: latestApproval.decisionNote,
            }
          : null,
      }
    }),
    summary: {
      done: items.filter((item) => item.status === "accepted" || item.status === "not_applicable").length,
      underReview: items.filter((item) => item.status === "under_review").length,
      waitingForClient: items.filter((item) => item.status === "none" || item.status === "request_sent" || item.status === "needs_correction").length,
    },
    uploads: {
      maxUploadSizeBytes: MAX_UPLOAD_SIZE_BYTES,
      allowedMimeTypes: Array.from(ALLOWED_UPLOAD_MIME_TYPES),
    },
    token: {
      expiresAt: token.expiresAt,
      revokedAt: token.revokedAt,
    },
    policy: {
      mode: accessPolicy.clientPortalPolicy,
      allowActions: accessPolicy.clientPortalPolicy === "active",
      message:
        accessPolicy.clientPortalPolicy === "active"
          ? "Panel klienta działa normalnie dla tej sprawy."
          : accessPolicy.clientPortalPolicy === "read_only"
            ? "Panel klienta pozostaje widoczny dla istniejącej sprawy, ale odpowiedzi i uploady są tymczasowo wyłączone do czasu odnowienia dostępu."
            : "Panel klienta jest wyłączony do czasu przywrócenia dostępu.",
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

function upsertApprovalEntry(input: {
  approvals: Approval[]
  snapshot: AppSnapshot
  token: ClientPortalToken
  caseId: string
  item: CaseItem
  title: string
  description: string
  status: ApprovalStatus
  decisionNote: string
  at: string
}) {
  const existing = input.approvals.find((entry) => entry.caseItemId === input.item.id)
  if (existing) {
    return input.approvals.map((entry) =>
      entry.id === existing.id
        ? {
            ...entry,
            status: input.status,
            decidedAt: input.at,
            decisionNote: input.decisionNote,
            updatedAt: input.at,
          }
        : entry,
    )
  }

  const approval: Approval = {
    id: createId("approval"),
    workspaceId: input.snapshot.context.workspaceId ?? "workspace_local",
    caseId: input.caseId,
    caseItemId: input.item.id,
    requestedByUserId: null,
    reviewerUserId: null,
    reviewerContactId: input.token.contactId,
    status: input.status,
    title: input.title,
    description: input.description,
    dueAt: null,
    decidedAt: input.at,
    decisionNote: input.decisionNote,
    createdAt: input.at,
    updatedAt: input.at,
  }

  return [approval, ...input.approvals]
}

function applyPortalAction(snapshot: AppSnapshot, token: ClientPortalToken, input: {
  action: PortalActionType
  caseItemId: string
  option?: string
  responseText?: string
  fileName?: string
  fileType?: string
  fileSizeBytes?: number
  decision?: ApprovalDecision
}) {
  const now = nowIso()
  const caseRecord = (snapshot.cases ?? []).find((entry) => entry.id === token.caseId)
  if (!caseRecord) return { snapshot, error: "Nie znaleziono sprawy." }

  const item = (snapshot.caseItems ?? []).find((entry) => entry.id === input.caseItemId && entry.caseId === caseRecord.id)
  if (!item) {
    return { snapshot, error: "Element nie nalezy do tej sprawy." }
  }

  if (input.action === "upload_file" && item.kind !== "file") {
    return { snapshot, error: "Ten element nie obsluguje uploadu pliku." }
  }
  if (input.action === "choose_option" && item.kind !== "decision" && item.kind !== "access") {
    return { snapshot, error: "Opcje A/B/C sa dostepne tylko dla decyzji i dostepow." }
  }
  if (input.action === "approval_decision" && item.kind !== "approval") {
    return { snapshot, error: "Ta akcja dotyczy tylko elementow akceptacji." }
  }
  if (input.action === "reply" && item.kind !== "response") {
    return { snapshot, error: "Ta akcja dotyczy tylko elementow odpowiedzi." }
  }

  let nextStatus: CaseItemStatus = item.status
  let uploadMeta: { safeFileName: string; mimeType: string; fileSizeBytes: number } | null = null
  let activityType: "file_uploaded" | "approval_decision" | "case_item_updated" = "case_item_updated"
  const approvalDecision = input.decision

  if (input.action === "upload_file") {
    const upload = validateUploadMeta({
      fileName: input.fileName ?? "",
      mimeType: input.fileType ?? "",
      fileSizeBytes: Number.isFinite(input.fileSizeBytes) ? Number(input.fileSizeBytes) : 0,
    })
    if (!upload.ok || !upload.safeFileName) {
      return { snapshot, error: upload.error || "Nieprawidlowe dane pliku." }
    }
    uploadMeta = {
      safeFileName: upload.safeFileName,
      mimeType: input.fileType ?? "application/octet-stream",
      fileSizeBytes: Number(input.fileSizeBytes ?? 0),
    }
    nextStatus = "under_review"
    activityType = "file_uploaded"
  } else if (input.action === "choose_option") {
    if (!isValidPortalOption(input.option)) {
      return { snapshot, error: "Wybierz poprawna opcje A/B/C." }
    }
    nextStatus = "under_review"
    activityType = "approval_decision"
  } else if (input.action === "approval_decision") {
    if (!approvalDecision) {
      return { snapshot, error: "Brakuje decyzji akceptacji." }
    }
    nextStatus = decisionToCaseItemStatus(approvalDecision)
    activityType = "approval_decision"
  } else if (input.action === "reply") {
    const normalized = (input.responseText ?? "").trim()
    if (!normalized) {
      return { snapshot, error: "Wpisz tresc odpowiedzi." }
    }
    nextStatus = "under_review"
    activityType = "case_item_updated"
  }

  const nextCaseItems = (snapshot.caseItems ?? []).map((entry) => {
    if (entry.id !== item.id) return entry
    return {
      ...entry,
      status: nextStatus,
      completedAt: nextStatus === "accepted" ? now : null,
      updatedAt: now,
    }
  })

  let attachments = snapshot.fileAttachments ?? []
  if (input.action === "upload_file" && uploadMeta) {
    const attachment: FileAttachment = {
      id: createId("att"),
      workspaceId: snapshot.context.workspaceId ?? "workspace_local",
      caseId: caseRecord.id,
      caseItemId: item.id,
      scope: "case_item",
      uploadedByUserId: null,
      fileName: uploadMeta.safeFileName,
      fileType: uploadMeta.mimeType || "application/octet-stream",
      fileSizeBytes: uploadMeta.fileSizeBytes,
      storagePath: `portal-upload/${caseRecord.id}/${createId("file")}-${uploadMeta.safeFileName}`,
      createdAt: now,
    }
    attachments = [attachment, ...attachments]
  }

  let approvals = snapshot.approvals ?? []
  if (input.action === "approval_decision" && approvalDecision) {
    approvals = upsertApprovalEntry({
      approvals,
      snapshot,
      token,
      caseId: caseRecord.id,
      item,
      title: `Akceptacja: ${item.title}`,
      description: "Decyzja klienta z panelu.",
      status: decisionToApprovalStatus(approvalDecision),
      decisionNote:
        approvalDecision === "accepted"
          ? "Zaakceptowano."
          : approvalDecision === "rejected"
            ? "Odrzucono."
            : "Wymaga zmian.",
      at: now,
    })
  }

  if (input.action === "choose_option" && isValidPortalOption(input.option)) {
    approvals = upsertApprovalEntry({
      approvals,
      snapshot,
      token,
      caseId: caseRecord.id,
      item,
      title: `Decyzja: ${item.title}`,
      description: "Wybór opcji klienta.",
      status: "answered",
      decisionNote: `Wybrano ${input.option}.`,
      at: now,
    })
  }

  const nextCaseStatus = deriveCaseStatusAfterPortalAction(caseRecord, nextCaseItems.filter((entry) => entry.caseId === caseRecord.id))
  const nextCases = (snapshot.cases ?? []).map((entry) =>
    entry.id === caseRecord.id
      ? {
          ...entry,
          status: nextCaseStatus.status,
          blockedByMissingRequired: nextCaseStatus.blockedByMissingRequired,
          updatedAt: now,
        }
      : entry,
  )

  const nextActivity = [
    {
      id: createId("activity"),
      workspaceId: snapshot.context.workspaceId ?? "workspace_local",
      actorUserId: null,
      actorContactId: token.contactId,
      source: "system" as const,
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
        decision: approvalDecision ?? null,
        responseText: input.responseText ?? null,
        fileName: uploadMeta?.safeFileName ?? null,
        fileType: uploadMeta?.mimeType ?? null,
        fileSizeBytes: uploadMeta?.fileSizeBytes ?? null,
        caseStatus: nextCaseStatus.status,
        blockedByMissingRequired: nextCaseStatus.blockedByMissingRequired,
      },
      createdAt: now,
    },
    ...(snapshot.activityLog ?? []),
  ]

  const notifications = [
    createPortalNotification(snapshot, caseRecord.id, item.id, "Nowa aktywnosc klienta", `${item.title}: ${input.action}`),
    ...(snapshot.notifications ?? []),
  ]

  const maybeReviewTask =
    nextStatus === "under_review" && item.status !== "under_review"
      ? createOwnerAutomationTask({
          snapshot,
          caseRecord,
          title: `Zweryfikuj doslany element: ${item.title}`,
          description: "Automat po doslaniu od klienta. Sprawdz element jeszcze dzis.",
          marker: `case-item-review-${caseRecord.id}-${item.id}`,
          at: now,
        })
      : null

  const maybeReadyTask =
    nextCaseStatus.status === "ready_to_start" && caseRecord.status !== "ready_to_start"
      ? createOwnerAutomationTask({
          snapshot,
          caseRecord,
          title: `Sprawa gotowa do startu: ${caseRecord.title}`,
          description: "Automat po pelnej kompletnosci. Rozpocznij realizacje.",
          marker: `case-ready-${caseRecord.id}`,
          at: now,
        })
      : null

  const nextItems = [
    ...(maybeReadyTask ? [maybeReadyTask] : []),
    ...(maybeReviewTask ? [maybeReviewTask] : []),
    ...(snapshot.items ?? []),
  ]

  return {
    error: null,
    snapshot: {
      ...snapshot,
      cases: nextCases,
      caseItems: nextCaseItems,
      activityLog: nextActivity,
      fileAttachments: attachments,
      approvals,
      notifications,
      items: nextItems,
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

export async function GET(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params
  const now = nowIso()
  const clientIp = getRequestClientIp(request)
  const viewRateLimit = checkSecurityRateLimit("portal-view", `${clientIp}:${token}`)
  if (!viewRateLimit.ok) {
    return rateLimitedResponse(viewRateLimit.retryAfterSeconds)
  }

  const found = await findSnapshotByToken(token, now)
  if (!found) {
    const invalidRateLimit = checkSecurityRateLimit("portal-invalid-token", `${clientIp}:${token}`)
    if (!invalidRateLimit.ok) {
      return rateLimitedResponse(invalidRateLimit.retryAfterSeconds, "Limit prob dla publicznego linku zostal przekroczony.")
    }
    return NextResponse.json({ error: "Nieprawidlowy link klienta." }, { status: 404 })
  }
  if (found.expired) {
    const invalidRateLimit = checkSecurityRateLimit("portal-invalid-token", `${clientIp}:${token}`)
    if (!invalidRateLimit.ok) {
      return rateLimitedResponse(invalidRateLimit.retryAfterSeconds, "Limit prob dla publicznego linku zostal przekroczony.")
    }
    return NextResponse.json({ error: "Link wygasl lub zostal odwolany." }, { status: 410 })
  }

  const snapshotWithOpenAudit = appendPortalOpenedActivity(found.row.snapshot, found.token, now)
  const save = await upsertAppSnapshotByUserId({
    userId: found.row.userId,
    workspaceId: found.row.workspaceId,
    snapshot: snapshotWithOpenAudit,
  })
  if (save.error) {
    return NextResponse.json({ error: "Nie udalo sie zapisac zdarzenia portalu." }, { status: 500 })
  }

  const payload = sanitizePortalResponse(snapshotWithOpenAudit, found.token)
  if (!payload) {
    return NextResponse.json({ error: "Nie znaleziono sprawy dla tokenu." }, { status: 404 })
  }

  return NextResponse.json(payload)
}

export async function POST(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params
  const now = nowIso()
  const clientIp = getRequestClientIp(request)
  const actionRateLimit = checkSecurityRateLimit("portal-action", `${clientIp}:${token}`)
  if (!actionRateLimit.ok) {
    return rateLimitedResponse(actionRateLimit.retryAfterSeconds)
  }

  const found = await findSnapshotByToken(token, now)
  if (!found) {
    const invalidRateLimit = checkSecurityRateLimit("portal-invalid-token", `${clientIp}:${token}`)
    if (!invalidRateLimit.ok) {
      return rateLimitedResponse(invalidRateLimit.retryAfterSeconds, "Limit prob dla publicznego linku zostal przekroczony.")
    }
    return NextResponse.json({ error: "Nieprawidlowy link klienta." }, { status: 404 })
  }
  if (found.expired) {
    const invalidRateLimit = checkSecurityRateLimit("portal-invalid-token", `${clientIp}:${token}`)
    if (!invalidRateLimit.ok) {
      return rateLimitedResponse(invalidRateLimit.retryAfterSeconds, "Limit prob dla publicznego linku zostal przekroczony.")
    }
    return NextResponse.json({ error: "Link wygasl lub zostal odwolany." }, { status: 410 })
  }

  const accessPolicy = resolveSnapshotAccessPolicy(found.row.snapshot)
  if (accessPolicy.clientPortalPolicy !== "active") {
    return NextResponse.json(
      {
        error:
          accessPolicy.clientPortalPolicy === "read_only"
            ? "Panel klienta jest w trybie podgladu. Akcje sa zablokowane do czasu odnowienia dostepu."
            : "Panel klienta jest tymczasowo niedostepny.",
      },
      { status: 423 },
    )
  }

  const body = (await request.json().catch(() => null)) as {
    action?: PortalActionType
    caseItemId?: string
    option?: string
    responseText?: string
    fileName?: string
    fileType?: string
    fileSizeBytes?: number
    decision?: ApprovalDecision
  } | null

  if (!body?.action || !body.caseItemId) {
    return NextResponse.json({ error: "Brakuje danych akcji." }, { status: 400 })
  }

  if (body.action === "upload_file") {
    const uploadRateLimit = checkSecurityRateLimit("portal-upload", `${clientIp}:${token}`)
    if (!uploadRateLimit.ok) {
      return rateLimitedResponse(uploadRateLimit.retryAfterSeconds, "Limit uploadow zostal przekroczony.")
    }
  }

  if (body.action === "approval_decision" || body.action === "choose_option") {
    const acceptanceRateLimit = checkSecurityRateLimit("portal-acceptance", `${clientIp}:${token}`)
    if (!acceptanceRateLimit.ok) {
      return rateLimitedResponse(acceptanceRateLimit.retryAfterSeconds, "Limit akcji akceptacji zostal przekroczony.")
    }
  }

  const changed = applyPortalAction(found.row.snapshot, found.token, {
    action: body.action,
    caseItemId: body.caseItemId,
    option: body.option,
    responseText: body.responseText,
    fileName: body.fileName,
    fileType: body.fileType,
    fileSizeBytes: body.fileSizeBytes,
    decision: body.decision,
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
    return NextResponse.json({ error: "Nie udalo sie zapisac akcji klienta." }, { status: 500 })
  }

  const payload = sanitizePortalResponse(changed.snapshot, found.token)
  if (!payload) {
    return NextResponse.json({ error: "Nie znaleziono sprawy po zapisie." }, { status: 404 })
  }

  return NextResponse.json({ ok: true, payload })
}
