import test from "node:test"
import assert from "node:assert/strict"
import { addLeadSnapshot, updateCaseItemSnapshot, updateLeadSnapshot } from "../lib/snapshot"
import { createInitialSnapshot } from "../lib/seed"

test("zmiana leada na won automatycznie tworzy sprawe i link klienta", () => {
  const withLead = addLeadSnapshot(createInitialSnapshot(), {
    name: "Automatyzacja Lead",
    company: "AL Sp. z o.o.",
    email: "client@example.com",
    phone: "",
    source: "Inne",
    value: 5000,
    summary: "",
    notes: "",
    status: "contacted",
    priority: "medium",
    nextActionTitle: "Domknij sprzedaz",
    nextActionAt: "2026-04-08T10:00:00.000Z",
  })

  const leadId = withLead.leads[0]!.id
  const automated = updateLeadSnapshot(withLead, leadId, { status: "won" })
  const createdCase = automated.cases?.[0]

  assert.ok(createdCase)
  assert.equal(createdCase?.status, "collecting_materials")
  assert.equal((automated.clientPortalTokens ?? []).length > 0, true)
  assert.equal((automated.items ?? []).some((item) => item.description.includes("[auto:case-completeness-check-")), true)
})

test("automatyzacja statusow sprawy pilnuje blocker -> waiting -> ready", () => {
  const snapshot = createInitialSnapshot()
  snapshot.cases = [
    {
      id: "case_1",
      workspaceId: "workspace_local",
      contactId: "contact_1",
      sourceLeadId: null,
      templateId: null,
      createdByUserId: null,
      ownerUserId: "operator_local",
      title: "Case testowy",
      description: "",
      status: "collecting_materials",
      blockedByMissingRequired: false,
      priority: "medium",
      value: 1000,
      startAt: null,
      dueAt: null,
      closedAt: null,
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
  ]
  snapshot.caseItems = [
    {
      id: "item_required_1",
      workspaceId: "workspace_local",
      caseId: "case_1",
      templateItemId: null,
      createdByUserId: null,
      ownerUserId: null,
      sortOrder: 100,
      kind: "file",
      title: "Plik od klienta",
      description: "",
      status: "request_sent",
      required: true,
      dueAt: null,
      completedAt: null,
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
    {
      id: "item_required_2",
      workspaceId: "workspace_local",
      caseId: "case_1",
      templateItemId: null,
      createdByUserId: null,
      ownerUserId: null,
      sortOrder: 200,
      kind: "approval",
      title: "Akceptacja",
      description: "",
      status: "none",
      required: true,
      dueAt: null,
      completedAt: null,
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
  ]

  const waiting = updateCaseItemSnapshot(snapshot, "item_required_1", { status: "request_sent" })
  assert.equal(waiting.cases?.[0]?.status, "waiting_for_client")
  assert.equal(waiting.cases?.[0]?.blockedByMissingRequired, true)

  const blocked = updateCaseItemSnapshot(waiting, "item_required_1", { status: "needs_correction" })
  assert.equal(blocked.cases?.[0]?.status, "blocked")
  assert.equal(blocked.cases?.[0]?.blockedByMissingRequired, true)

  const readyA = updateCaseItemSnapshot(blocked, "item_required_1", { status: "accepted" })
  const readyB = updateCaseItemSnapshot(readyA, "item_required_2", { status: "accepted" })
  assert.equal(readyB.cases?.[0]?.status, "ready_to_start")
  assert.equal(readyB.cases?.[0]?.blockedByMissingRequired, false)
})
