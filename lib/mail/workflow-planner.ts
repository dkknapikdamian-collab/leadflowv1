import type { AppSnapshot, CaseItemStatus } from "@/lib/types"
import type { WorkflowNotificationKind } from "@/lib/mail/workflow-templates"

export interface WorkflowPlannerJob {
  dedupeKey: string
  kind: WorkflowNotificationKind
  recipient: {
    role: "operator" | "client"
    email: string | null
    displayName: string
  }
  caseId: string
  caseItemId: string | null
  title: string
  body: string
  shouldSendEmail: boolean
  shouldCreateInApp: boolean
  occurredAt: string
}

const DONE_STATUSES = new Set<CaseItemStatus>(["accepted", "not_applicable"])
const PENDING_STATUSES = new Set<CaseItemStatus>(["none", "request_sent", "delivered", "needs_correction"])

function toDaysForReminderFrequency(defaultReminder: AppSnapshot["settings"]["defaultReminder"]) {
  if (defaultReminder === "daily") return 1
  if (defaultReminder === "every_2_days") return 2
  if (defaultReminder === "weekly") return 7
  return 2
}

function daysSince(iso: string, nowIso: string) {
  const diff = Date.parse(nowIso) - Date.parse(iso)
  return Number.isFinite(diff) ? Math.floor(diff / 86_400_000) : 0
}

function hoursSince(iso: string, nowIso: string) {
  const diff = Date.parse(nowIso) - Date.parse(iso)
  return Number.isFinite(diff) ? Math.floor(diff / 3_600_000) : 0
}

function hoursUntil(targetIso: string, nowIso: string) {
  return -hoursSince(targetIso, nowIso)
}

function findCaseLastActivityAt(snapshot: AppSnapshot, caseId: string) {
  return (snapshot.activityLog ?? []).find((entry) => entry.caseId === caseId)?.createdAt ?? null
}

function findContactEmail(snapshot: AppSnapshot, contactId: string) {
  const contact = (snapshot.contacts ?? []).find((entry) => entry.id === contactId)
  const email = contact?.email?.trim() || ""
  return email || null
}

function pushIfUnique(
  jobs: WorkflowPlannerJob[],
  existingDedupeKeys: Set<string>,
  job: WorkflowPlannerJob,
) {
  if (existingDedupeKeys.has(job.dedupeKey)) return
  jobs.push(job)
}

export function buildWorkflowNotificationJobs(input: {
  snapshot: AppSnapshot
  operatorEmail: string | null
  operatorDisplayName: string
  existingDedupeKeys: Set<string>
  now?: string | Date
}) {
  const nowIso = typeof input.now === "string" ? input.now : (input.now ?? new Date()).toISOString()
  const jobs: WorkflowPlannerJob[] = []
  const cadenceDays = toDaysForReminderFrequency(input.snapshot.settings.defaultReminder)
  const cases = input.snapshot.cases ?? []
  const caseItems = input.snapshot.caseItems ?? []

  for (const caseRecord of cases) {
    const relatedItems = caseItems.filter((item) => item.caseId === caseRecord.id)
    const requiredItems = relatedItems.filter((item) => item.required)
    const pendingRequired = requiredItems.filter((item) => PENDING_STATUSES.has(item.status))
    const underReview = relatedItems.filter((item) => item.status === "under_review")
    const contactEmail = findContactEmail(input.snapshot, caseRecord.contactId)
    const latestActivityAt = findCaseLastActivityAt(input.snapshot, caseRecord.id)
    const staleByCadence = latestActivityAt ? daysSince(latestActivityAt, nowIso) >= cadenceDays : false

    if ((caseRecord.status === "waiting_for_client" || caseRecord.status === "blocked") && pendingRequired.length > 0 && staleByCadence) {
      pushIfUnique(jobs, input.existingDedupeKeys, {
        dedupeKey: `wf:operator-client-inactive:${caseRecord.workspaceId}:${caseRecord.id}:${nowIso.slice(0, 10)}`,
        kind: "operator_client_inactive",
        recipient: {
          role: "operator",
          email: input.operatorEmail,
          displayName: input.operatorDisplayName,
        },
        caseId: caseRecord.id,
        caseItemId: null,
        title: "Klient nic nie doslal",
        body: `Sprawa "${caseRecord.title}" stoi. Brakuje ${pendingRequired.length} wymaganych elementow.`,
        shouldSendEmail: Boolean(input.snapshot.settings.emailReminders && input.operatorEmail),
        shouldCreateInApp: input.snapshot.settings.inAppReminders,
        occurredAt: nowIso,
      })
    }

    if (underReview.length > 0) {
      pushIfUnique(jobs, input.existingDedupeKeys, {
        dedupeKey: `wf:operator-verification-required:${caseRecord.workspaceId}:${caseRecord.id}:${nowIso.slice(0, 10)}`,
        kind: "operator_verification_required",
        recipient: {
          role: "operator",
          email: input.operatorEmail,
          displayName: input.operatorDisplayName,
        },
        caseId: caseRecord.id,
        caseItemId: underReview[0]?.id ?? null,
        title: "Trzeba zweryfikowac materialy",
        body: `Sprawa "${caseRecord.title}" ma ${underReview.length} element(ow) do weryfikacji.`,
        shouldSendEmail: Boolean(input.snapshot.settings.emailReminders && input.operatorEmail),
        shouldCreateInApp: input.snapshot.settings.inAppReminders,
        occurredAt: nowIso,
      })
    }

    if (caseRecord.status === "ready_to_start") {
      pushIfUnique(jobs, input.existingDedupeKeys, {
        dedupeKey: `wf:operator-case-ready:${caseRecord.workspaceId}:${caseRecord.id}:${nowIso.slice(0, 10)}`,
        kind: "operator_case_ready_to_start",
        recipient: {
          role: "operator",
          email: input.operatorEmail,
          displayName: input.operatorDisplayName,
        },
        caseId: caseRecord.id,
        caseItemId: null,
        title: "Sprawa gotowa do startu",
        body: `Sprawa "${caseRecord.title}" jest kompletna i gotowa do uruchomienia.`,
        shouldSendEmail: Boolean(input.snapshot.settings.emailReminders && input.operatorEmail),
        shouldCreateInApp: input.snapshot.settings.inAppReminders,
        occurredAt: nowIso,
      })
    }

    if (caseRecord.status === "blocked") {
      pushIfUnique(jobs, input.existingDedupeKeys, {
        dedupeKey: `wf:operator-case-blocked:${caseRecord.workspaceId}:${caseRecord.id}:${nowIso.slice(0, 10)}`,
        kind: "operator_case_blocked",
        recipient: {
          role: "operator",
          email: input.operatorEmail,
          displayName: input.operatorDisplayName,
        },
        caseId: caseRecord.id,
        caseItemId: null,
        title: "Sprawa zablokowana",
        body: `Sprawa "${caseRecord.title}" jest zablokowana i wymaga odblokowania przez uzupelnienie brakow.`,
        shouldSendEmail: Boolean(input.snapshot.settings.emailReminders && input.operatorEmail),
        shouldCreateInApp: input.snapshot.settings.inAppReminders,
        occurredAt: nowIso,
      })
    }

    if (contactEmail && (caseRecord.status === "waiting_for_client" || caseRecord.status === "blocked") && pendingRequired.length > 0 && staleByCadence) {
      pushIfUnique(jobs, input.existingDedupeKeys, {
        dedupeKey: `wf:client-missing-items:${caseRecord.workspaceId}:${caseRecord.id}:${nowIso.slice(0, 10)}`,
        kind: "client_missing_items_reminder",
        recipient: {
          role: "client",
          email: contactEmail,
          displayName: "Kliencie",
        },
        caseId: caseRecord.id,
        caseItemId: null,
        title: "Przypomnienie o brakach",
        body: `Do sprawy "${caseRecord.title}" nadal brakuje ${pendingRequired.length} wymaganych rzeczy.`,
        shouldSendEmail: Boolean(input.snapshot.settings.emailReminders),
        shouldCreateInApp: false,
        occurredAt: nowIso,
      })
    }

    const dueSoonItem = requiredItems.find((item) => {
      if (!item.dueAt) return false
      if (DONE_STATUSES.has(item.status)) return false
      const hours = hoursUntil(item.dueAt, nowIso)
      return hours <= 24 && hours >= -2
    })
    if (contactEmail && dueSoonItem) {
      pushIfUnique(jobs, input.existingDedupeKeys, {
        dedupeKey: `wf:client-due-soon:${caseRecord.workspaceId}:${caseRecord.id}:${dueSoonItem.id}:${nowIso.slice(0, 10)}`,
        kind: "client_due_soon",
        recipient: {
          role: "client",
          email: contactEmail,
          displayName: "Kliencie",
        },
        caseId: caseRecord.id,
        caseItemId: dueSoonItem.id,
        title: "Termin mija",
        body: `Element "${dueSoonItem.title}" w sprawie "${caseRecord.title}" ma termin, ktory zaraz mija.`,
        shouldSendEmail: Boolean(input.snapshot.settings.emailReminders),
        shouldCreateInApp: false,
        occurredAt: nowIso,
      })
    }

    const decisionRequired = relatedItems.find((item) => {
      if (!item.required) return false
      if (item.kind !== "approval" && item.kind !== "decision" && item.kind !== "access") return false
      return PENDING_STATUSES.has(item.status)
    })
    if (contactEmail && decisionRequired && staleByCadence) {
      pushIfUnique(jobs, input.existingDedupeKeys, {
        dedupeKey: `wf:client-decision-required:${caseRecord.workspaceId}:${caseRecord.id}:${decisionRequired.id}:${nowIso.slice(0, 10)}`,
        kind: "client_decision_required",
        recipient: {
          role: "client",
          email: contactEmail,
          displayName: "Kliencie",
        },
        caseId: caseRecord.id,
        caseItemId: decisionRequired.id,
        title: "Potrzebna odpowiedz lub decyzja",
        body: `W sprawie "${caseRecord.title}" czekamy na Twoja decyzje: "${decisionRequired.title}".`,
        shouldSendEmail: Boolean(input.snapshot.settings.emailReminders),
        shouldCreateInApp: false,
        occurredAt: nowIso,
      })
    }
  }

  const latestUploads = (input.snapshot.activityLog ?? [])
    .filter((entry) => entry.type === "file_uploaded" && entry.caseId)
    .slice(0, 20)
  for (const upload of latestUploads) {
    const caseRecord = cases.find((entry) => entry.id === upload.caseId)
    if (!caseRecord) continue
    pushIfUnique(jobs, input.existingDedupeKeys, {
      dedupeKey: `wf:operator-client-uploaded-file:${caseRecord.workspaceId}:${upload.id}`,
      kind: "operator_client_uploaded_file",
      recipient: {
        role: "operator",
        email: input.operatorEmail,
        displayName: input.operatorDisplayName,
      },
      caseId: caseRecord.id,
      caseItemId: upload.caseItemId,
      title: "Klient doslal plik",
      body: `W sprawie "${caseRecord.title}" klient doslal nowy plik.`,
      shouldSendEmail: Boolean(input.snapshot.settings.emailReminders && input.operatorEmail),
      shouldCreateInApp: input.snapshot.settings.inAppReminders,
      occurredAt: upload.createdAt,
    })
  }

  const recentTokens = (input.snapshot.clientPortalTokens ?? [])
    .filter((token) => !token.revokedAt)
    .filter((token) => daysSince(token.createdAt, nowIso) <= 1)
  for (const token of recentTokens) {
    const caseRecord = cases.find((entry) => entry.id === token.caseId)
    if (!caseRecord) continue
    const contactEmail = findContactEmail(input.snapshot, caseRecord.contactId)
    if (!contactEmail) continue
    pushIfUnique(jobs, input.existingDedupeKeys, {
      dedupeKey: `wf:client-link-sent:${token.workspaceId}:${token.id}`,
      kind: "client_link_sent",
      recipient: {
        role: "client",
        email: contactEmail,
        displayName: "Kliencie",
      },
      caseId: caseRecord.id,
      caseItemId: null,
      title: "Wyslano link do portalu klienta",
      body: `Dla sprawy "${caseRecord.title}" link do portalu jest aktywny i gotowy do uzycia.`,
      shouldSendEmail: Boolean(input.snapshot.settings.emailReminders),
      shouldCreateInApp: false,
      occurredAt: token.createdAt,
    })
  }

  return jobs
}
