import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { buildCasesDashboard, filterCaseCards, type CaseDashboardCard } from "../lib/domain/cases-dashboard"

test("buildCasesDashboard liczy KPI i pola kart spraw", () => {
  const snapshot = createInitialSnapshot()
  snapshot.contacts = [
    {
      id: "contact_1",
      workspaceId: "workspace_1",
      createdByUserId: null,
      name: "Anna K.",
      company: "AK Studio",
      email: "anna@example.com",
      phone: "",
      normalizedEmail: "anna@example.com",
      normalizedPhone: "",
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]

  snapshot.cases = [
    {
      id: "case_1",
      workspaceId: "workspace_1",
      contactId: "contact_1",
      sourceLeadId: "lead_1",
      templateId: null,
      createdByUserId: null,
      ownerUserId: null,
      title: "Realizacja: AK Studio",
      description: "",
      status: "waiting_for_client",
      blockedByMissingRequired: false,
      priority: "high",
      value: 8000,
      startAt: null,
      dueAt: "2026-04-07T10:00:00.000Z",
      closedAt: null,
      createdAt: "2026-04-05T09:00:00.000Z",
      updatedAt: "2026-04-05T09:00:00.000Z",
    },
    {
      id: "case_2",
      workspaceId: "workspace_1",
      contactId: "contact_1",
      sourceLeadId: "lead_2",
      templateId: null,
      createdByUserId: null,
      ownerUserId: null,
      title: "Realizacja: AK Studio 2",
      description: "",
      status: "ready_to_start",
      blockedByMissingRequired: false,
      priority: "medium",
      value: 4000,
      startAt: null,
      dueAt: null,
      closedAt: null,
      createdAt: "2026-04-06T09:00:00.000Z",
      updatedAt: "2026-04-06T09:00:00.000Z",
    },
  ]

  snapshot.caseItems = [
    {
      id: "item_1",
      workspaceId: "workspace_1",
      caseId: "case_1",
      templateItemId: null,
      createdByUserId: null,
      ownerUserId: null,
      sortOrder: 100,
      kind: "checklist",
      title: "Materiały od klienta",
      description: "",
      status: "request_sent",
      required: true,
      dueAt: null,
      completedAt: null,
      createdAt: "2026-04-05T09:00:00.000Z",
      updatedAt: "2026-04-05T09:00:00.000Z",
    },
    {
      id: "item_2",
      workspaceId: "workspace_1",
      caseId: "case_1",
      templateItemId: null,
      createdByUserId: null,
      ownerUserId: null,
      sortOrder: 200,
      kind: "checklist",
      title: "Akceptacja",
      description: "",
      status: "accepted",
      required: true,
      dueAt: null,
      completedAt: "2026-04-06T09:00:00.000Z",
      createdAt: "2026-04-05T09:00:00.000Z",
      updatedAt: "2026-04-06T09:00:00.000Z",
    },
  ]

  snapshot.approvals = [
    {
      id: "approval_1",
      workspaceId: "workspace_1",
      caseId: "case_1",
      caseItemId: null,
      requestedByUserId: null,
      reviewerUserId: null,
      reviewerContactId: null,
      status: "reminder_sent",
      title: "Przypomnienie",
      description: "",
      dueAt: null,
      decidedAt: null,
      decisionNote: "",
      createdAt: "2026-04-06T12:00:00.000Z",
      updatedAt: "2026-04-06T12:00:00.000Z",
    },
  ]

  snapshot.activityLog = [
    {
      id: "activity_1",
      workspaceId: "workspace_1",
      actorUserId: null,
      actorContactId: null,
      source: "operations",
      type: "case_updated",
      leadId: "lead_1",
      caseId: "case_1",
      caseItemId: null,
      attachmentId: null,
      approvalId: null,
      notificationId: null,
      payload: {},
      createdAt: "2026-04-07T08:00:00.000Z",
    },
  ]

  const view = buildCasesDashboard(snapshot, { now: "2026-04-08T09:00:00.000Z", timeZone: "Europe/Warsaw" })
  assert.equal(view.stats.active, 2)
  assert.ok(view.cards.some((card) => card.status === "waiting_for_client"))
  assert.ok(view.cards.some((card) => card.status === "ready_to_start"))

  const first = view.cards.find((card) => card.id === "case_1")
  assert.ok(first)
  assert.equal(first?.clientName, "Anna K.")
  assert.equal(first?.completenessPercent, 50)
  assert.equal(first?.missingElementsCount, 1)
  assert.equal(first?.reminderSent, true)
  assert.equal(first?.isOverdue, true)
  assert.equal(first?.needsActionToday, true)
})

test("filterCaseCards filtruje po statusie i overdue", () => {
  const cards: CaseDashboardCard[] = [
    {
      id: "1",
      title: "A",
      clientName: "A",
      typeLabel: "A",
      status: "waiting_for_client",
      statusLabel: "A",
      completenessPercent: 0,
      missingElementsCount: 0,
      dueAt: null,
      isOverdue: false,
      lastActivityAt: "2026-04-08T08:00:00.000Z",
      daysStuck: 0,
      reminderSent: false,
      nextMove: "",
      needsActionToday: true,
    },
    {
      id: "2",
      title: "B",
      clientName: "B",
      typeLabel: "B",
      status: "blocked",
      statusLabel: "B",
      completenessPercent: 0,
      missingElementsCount: 0,
      dueAt: null,
      isOverdue: false,
      lastActivityAt: "2026-04-08T08:00:00.000Z",
      daysStuck: 0,
      reminderSent: false,
      nextMove: "",
      needsActionToday: true,
    },
    {
      id: "3",
      title: "C",
      clientName: "C",
      typeLabel: "C",
      status: "ready_to_start",
      statusLabel: "C",
      completenessPercent: 0,
      missingElementsCount: 0,
      dueAt: null,
      isOverdue: false,
      lastActivityAt: "2026-04-08T08:00:00.000Z",
      daysStuck: 0,
      reminderSent: false,
      nextMove: "",
      needsActionToday: false,
    },
    {
      id: "4",
      title: "D",
      clientName: "D",
      typeLabel: "D",
      status: "in_progress",
      statusLabel: "D",
      completenessPercent: 0,
      missingElementsCount: 0,
      dueAt: "2026-04-07T08:00:00.000Z",
      isOverdue: true,
      lastActivityAt: "2026-04-08T08:00:00.000Z",
      daysStuck: 0,
      reminderSent: false,
      nextMove: "",
      needsActionToday: true,
    },
  ]

  assert.deepEqual(filterCaseCards(cards, "waiting_for_client").map((item) => item.id), ["1"])
  assert.deepEqual(filterCaseCards(cards, "blocked").map((item) => item.id), ["2"])
  assert.deepEqual(filterCaseCards(cards, "ready_to_start").map((item) => item.id), ["3"])
  assert.deepEqual(filterCaseCards(cards, "overdue").map((item) => item.id), ["4"])
})
