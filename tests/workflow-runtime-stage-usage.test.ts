import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { buildLeadComputedState, leadNeedsExecutionAttention } from "../lib/domain/lead-state"
import { buildCasesDashboard } from "../lib/domain/cases-dashboard"
import { buildTodayViewModel } from "../lib/today"
import type { Lead } from "../lib/types"

function buildLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_runtime_1",
    workspaceId: "workspace_local",
    contactId: null,
    caseId: null,
    name: "Runtime Lead",
    company: "Runtime Studio",
    email: "runtime@example.com",
    phone: "+48 600 100 200",
    source: "Inne",
    value: 6000,
    summary: "",
    notes: "",
    status: "follow_up",
    priority: "high",
    nextActionTitle: "",
    nextActionAt: "",
    nextActionItemId: null,
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-01T09:00:00.000Z",
    ...overrides,
  }
}

test("runtime: lead-state używa execution guard do wykrycia ruchu sprzedażowego", () => {
  const snapshot = createInitialSnapshot()
  const lead = buildLead()
  snapshot.leads = [lead]
  snapshot.items = []

  const computed = buildLeadComputedState(snapshot, lead, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(computed.hasNextStep, false)
  assert.equal(computed.riskState, "at_risk")
  assert.equal(leadNeedsExecutionAttention(computed), true)
})

test("runtime: cases-dashboard daje ruch Uruchom sprawę dla gotowego case", () => {
  const snapshot = createInitialSnapshot()
  snapshot.contacts = [
    {
      id: "contact_ready",
      workspaceId: "workspace_local",
      createdByUserId: null,
      name: "Ready Client",
      company: "Ready Client Sp. z o.o.",
      email: "ready@example.com",
      phone: "",
      normalizedEmail: "ready@example.com",
      normalizedPhone: "",
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.cases = [
    {
      id: "case_ready_1",
      workspaceId: "workspace_local",
      contactId: "contact_ready",
      sourceLeadId: "lead_ready_1",
      templateId: "tpl_onboarding",
      createdByUserId: null,
      ownerUserId: null,
      title: "Realizacja: Ready Client",
      description: "",
      status: "ready_to_start",
      blockedByMissingRequired: false,
      priority: "high",
      value: 9000,
      startAt: null,
      dueAt: null,
      closedAt: null,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.caseItems = [
    {
      id: "case_item_ready_1",
      workspaceId: "workspace_local",
      caseId: "case_ready_1",
      templateItemId: null,
      createdByUserId: null,
      ownerUserId: null,
      sortOrder: 100,
      kind: "approval",
      title: "Akceptacja",
      description: "",
      status: "accepted",
      required: true,
      dueAt: null,
      completedAt: "2026-04-01T10:00:00.000Z",
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T10:00:00.000Z",
    },
  ]

  const dashboard = buildCasesDashboard(snapshot, { now: "2026-04-10T08:00:00.000Z" })
  assert.equal(dashboard.cards[0]?.nextMove, "Uruchom sprawę")
  assert.equal(dashboard.cards[0]?.needsActionToday, true)

  const today = buildTodayViewModel(snapshot, { now: "2026-04-10T08:00:00.000Z" })
  assert.equal(today.commandCenter.sections.readyToStart.length, 1)
  assert.equal(today.commandCenter.sections.readyToStart[0]?.id, "case_ready_1")
})
