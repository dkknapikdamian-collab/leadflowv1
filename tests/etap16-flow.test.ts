import assert from "node:assert/strict"
import test from "node:test"
import { createInitialSnapshot } from "../lib/seed"
import {
  addFileAttachmentSnapshot,
  addLeadSnapshot,
  registerPortalOpenedSnapshot,
  revokeClientPortalTokenSnapshot,
  updateItemSnapshot,
} from "../lib/snapshot"
import { buildCasesDashboard } from "../lib/repository/cases-dashboard"

function createWonLeadPayload() {
  return {
    workspaceId: "ws-a",
    name: "Alicja Test",
    company: "Studio A",
    email: "alicja@example.com",
    phone: "+48 500 100 200",
    source: "LinkedIn" as const,
    contactId: null,
    caseId: null,
    value: 12000,
    summary: "Przejscie do realizacji po wygraniu",
    notes: "",
    status: "won" as const,
    priority: "high" as const,
    nextActionTitle: "Start realizacji",
    nextActionAt: "2026-04-12T10:00:00.000Z",
  }
}

test("lead won tworzy case, checklist itemy i token portalu klienta", () => {
  let snapshot = createInitialSnapshot()
  snapshot = {
    ...snapshot,
    context: {
      ...snapshot.context,
      workspaceId: "ws-a",
      userId: "user-a",
    },
    user: {
      ...snapshot.user,
      email: "owner@example.com",
    },
  }

  const next = addLeadSnapshot(snapshot, createWonLeadPayload())
  const lead = next.leads.find((entry) => entry.name === "Alicja Test")

  assert.ok(lead?.caseId)
  assert.ok(lead?.contactId)
  assert.match(lead?.notes ?? "", /\[op_status:(collecting_materials|blocked|waiting_for_client)\]/)

  const relatedItems = next.items.filter((item) => item.leadId === lead?.id)
  assert.ok(relatedItems.length > 0)
  assert.match(lead?.notes ?? "", /\[case_template:[^\]]+\]/)
  assert.ok(relatedItems.some((item) => item.title.includes("[AUTO_CHECK_COMPLETENESS]")))

  assert.ok(next.clientPortalTokens.some((token) => token.caseId === lead?.caseId && !token.revokedAt))
})

test("workflow upload + weryfikacja i ready_to_start domykaja sie automatycznie", () => {
  let snapshot = createInitialSnapshot()
  snapshot = {
    ...snapshot,
    context: {
      ...snapshot.context,
      workspaceId: "ws-a",
      userId: "user-a",
    },
  }

  snapshot = addLeadSnapshot(snapshot, createWonLeadPayload())
  const lead = snapshot.leads.find((entry) => entry.name === "Alicja Test")
  assert.ok(lead?.id)
  assert.ok(lead?.caseId)

  const requiredItem = snapshot.items.find((item) => item.leadId === lead?.id && item.priority === "high")
  assert.ok(requiredItem?.id)

  snapshot = updateItemSnapshot(snapshot, requiredItem!.id, { status: "snoozed" })
  snapshot = addFileAttachmentSnapshot(snapshot, {
    caseId: lead!.caseId!,
    caseItemId: requiredItem!.id,
    fileName: "logo-final.png",
    mimeType: "image/png",
    fileSizeBytes: 1024,
    uploadedByRole: "client",
    uploadedByLabel: "Klient",
  })

  assert.ok(snapshot.fileAttachments.some((entry) => entry.caseId === lead!.caseId))
  assert.ok(snapshot.notifications.some((entry) => entry.kind === "operator_client_uploaded_file"))
  assert.ok(snapshot.items.some((item) => item.leadId === lead!.id && item.title.includes("[AUTO_REVIEW_TODAY]")))

  let finalized = snapshot
  const openItems = finalized.items.filter((item) => item.leadId === lead!.id && item.status !== "done")
  for (const item of openItems) {
    finalized = updateItemSnapshot(finalized, item.id, { status: "done" })
  }

  const finalizedLead = finalized.leads.find((entry) => entry.id === lead!.id)
  assert.match(finalizedLead?.notes ?? "", /\[op_status:ready_to_start\]/)
  assert.ok(finalized.items.some((item) => item.leadId === lead!.id && item.title.includes("[AUTO_READY_NEXT_STEP]")))
  assert.ok(finalized.activityLog.some((entry) => entry.eventType === "auto_case_ready_to_start"))
})

test("token portalu mozna otworzyc i odwolac z audytem", () => {
  let snapshot = createInitialSnapshot()
  snapshot = {
    ...snapshot,
    context: {
      ...snapshot.context,
      workspaceId: "ws-a",
      userId: "user-a",
    },
  }
  snapshot = addLeadSnapshot(snapshot, createWonLeadPayload())
  const token = snapshot.clientPortalTokens[0]
  assert.ok(token?.id)

  const opened = registerPortalOpenedSnapshot(snapshot, token!.id)
  const openedToken = opened.clientPortalTokens.find((entry) => entry.id === token!.id)
  assert.ok(openedToken?.lastOpenedAt)

  const revoked = revokeClientPortalTokenSnapshot(opened, token!.id, "qa-revoke")
  const revokedToken = revoked.clientPortalTokens.find((entry) => entry.id === token!.id)
  assert.ok(revokedToken?.revokedAt)
  assert.equal(revokedToken?.revokedReason, "qa-revoke")
  assert.ok(revoked.activityLog.some((entry) => entry.eventType === "portal_token_revoked"))
})

test("dashboard spraw zwraca tylko rekordy z aktywnego workspace (izolacja user A/B)", () => {
  const snapshot = createInitialSnapshot()
  snapshot.context.workspaceId = "ws-a"

  snapshot.leads = [
    {
      id: "lead-a",
      workspaceId: "ws-a",
      name: "User A",
      company: "A Co",
      email: "",
      phone: "",
      source: "LinkedIn",
      contactId: "contact-a",
      caseId: "case-a",
      value: 1000,
      summary: "",
      notes: "",
      status: "won",
      priority: "high",
      nextActionTitle: "",
      nextActionAt: "",
      nextActionItemId: null,
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
    {
      id: "lead-b",
      workspaceId: "ws-b",
      name: "User B",
      company: "B Co",
      email: "",
      phone: "",
      source: "Polecenie",
      contactId: "contact-b",
      caseId: "case-b",
      value: 2000,
      summary: "",
      notes: "",
      status: "won",
      priority: "high",
      nextActionTitle: "",
      nextActionAt: "",
      nextActionItemId: null,
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
  ]

  snapshot.items = [
    {
      id: "item-a",
      workspaceId: "ws-a",
      leadId: "lead-a",
      leadLabel: "User A",
      recordType: "task",
      type: "task",
      title: "Task A",
      description: "",
      status: "todo",
      priority: "high",
      scheduledAt: "2026-04-09T10:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
    {
      id: "item-b",
      workspaceId: "ws-b",
      leadId: "lead-b",
      leadLabel: "User B",
      recordType: "task",
      type: "task",
      title: "Task B",
      description: "",
      status: "todo",
      priority: "high",
      scheduledAt: "2026-04-09T10:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
  ]

  const dashboard = buildCasesDashboard(snapshot, "all")
  assert.equal(dashboard.all.length, 1)
  assert.equal(dashboard.all[0]?.leadId, "lead-a")
})
