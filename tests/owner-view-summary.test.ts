import test from "node:test"
import assert from "node:assert/strict"
import { buildCaseOwnerSummary, buildLeadOwnerSummary } from "../lib/domain/owner-view-summary"
import type { CaseDashboardCard } from "../lib/domain/cases-dashboard"
import type { LeadWithComputedState } from "../lib/domain/lead-state"

function createLead(partial: Partial<LeadWithComputedState>): LeadWithComputedState {
  return {
    id: partial.id ?? "lead-1",
    workspaceId: partial.workspaceId ?? null,
    contactId: partial.contactId ?? null,
    caseId: partial.caseId ?? null,
    source: partial.source ?? "Inne",
    name: partial.name ?? "Jan Kowalski",
    company: partial.company ?? "Acme",
    email: partial.email ?? "jan@example.com",
    phone: partial.phone ?? "123",
    status: partial.status ?? "new",
    priority: partial.priority ?? "medium",
    value: partial.value ?? 1000,
    summary: partial.summary ?? "",
    notes: partial.notes ?? "",
    nextActionTitle: partial.nextActionTitle ?? "",
    nextActionAt: partial.nextActionAt ?? "",
    nextActionItemId: partial.nextActionItemId ?? null,
    createdAt: partial.createdAt ?? "2026-04-13T08:00:00.000Z",
    updatedAt: partial.updatedAt ?? "2026-04-13T08:00:00.000Z",
    computed: partial.computed ?? {
      leadId: partial.id ?? "lead-1",
      hasNextStep: true,
      nextStepAt: null,
      nextStepOverdue: false,
      lastTouchAt: null,
      daysSinceLastTouch: 0,
      daysUntilNextStep: null,
      isWaitingTooLong: false,
      isAtRisk: false,
      riskState: "ok",
      riskReason: "missing_next_step",
      alarmReasons: [],
      dailyPriorityScore: 0,
      openActionsCount: 0,
    },
  }
}

function createCaseCard(partial: Partial<CaseDashboardCard>): CaseDashboardCard {
  return {
    id: partial.id ?? "case-1",
    title: partial.title ?? "Start www",
    clientName: partial.clientName ?? "Acme",
    typeLabel: partial.typeLabel ?? "Landing page",
    status: partial.status ?? "not_started",
    statusLabel: partial.statusLabel ?? "Nie rozpoczęto",
    completenessPercent: partial.completenessPercent ?? 0,
    missingElementsCount: partial.missingElementsCount ?? 0,
    needsActionToday: partial.needsActionToday ?? false,
    isOverdue: partial.isOverdue ?? false,
    reminderSent: partial.reminderSent ?? false,
    dueAt: partial.dueAt ?? null,
    nextMove: partial.nextMove ?? "Brak ruchu",
    lastActivityAt: partial.lastActivityAt ?? "2026-04-13T08:00:00.000Z",
    daysStuck: partial.daysStuck ?? 0,
  }
}

test("buildLeadOwnerSummary liczy wspólne KPI dla widoków operatora", () => {
  const leads = [
    createLead({
      id: "lead-risk",
      priority: "high",
      computed: {
        leadId: "lead-risk",
        hasNextStep: false,
        nextStepAt: null,
        nextStepOverdue: false,
        lastTouchAt: null,
        daysSinceLastTouch: 4,
        daysUntilNextStep: null,
        isWaitingTooLong: true,
        isAtRisk: true,
        riskState: "at_risk",
        riskReason: "missing_next_step",
        alarmReasons: ["missing_next_step", "waiting_too_long"],
        dailyPriorityScore: 75,
        openActionsCount: 0,
      },
    }),
    createLead({
      id: "lead-overdue",
      computed: {
        leadId: "lead-overdue",
        hasNextStep: true,
        nextStepAt: "2026-04-12T09:00:00.000Z",
        nextStepOverdue: true,
        lastTouchAt: null,
        daysSinceLastTouch: 2,
        daysUntilNextStep: -1,
        isWaitingTooLong: false,
        isAtRisk: true,
        riskState: "at_risk",
        riskReason: "next_step_overdue",
        alarmReasons: ["next_step_overdue"],
        dailyPriorityScore: 50,
        openActionsCount: 1,
      },
    }),
    createLead({ id: "lead-ok" }),
  ]

  const summary = buildLeadOwnerSummary(leads)

  assert.equal(summary.total, 3)
  assert.equal(summary.needsAttention, 2)
  assert.equal(summary.missingNextStep, 1)
  assert.equal(summary.overdueNextStep, 1)
  assert.equal(summary.waitingTooLong, 1)
  assert.equal(summary.highPriority, 1)
})

test("buildCaseOwnerSummary liczy wspólne KPI dla spraw", () => {
  const cards = [
    createCaseCard({ id: "blocked", status: "blocked", needsActionToday: true, isOverdue: true }),
    createCaseCard({ id: "waiting", status: "waiting_for_client", needsActionToday: true }),
    createCaseCard({ id: "ready", status: "ready_to_start" }),
    createCaseCard({ id: "progress", status: "in_progress" }),
  ]

  const summary = buildCaseOwnerSummary(cards)

  assert.equal(summary.total, 4)
  assert.equal(summary.blocked, 1)
  assert.equal(summary.waitingForClient, 1)
  assert.equal(summary.readyToStart, 1)
  assert.equal(summary.needsActionToday, 2)
  assert.equal(summary.overdue, 1)
})
