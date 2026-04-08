import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { addItemSnapshot, addLeadSnapshot, deleteItemSnapshot } from "../lib/snapshot"
import {
  buildLeadComputedState,
  DEFAULT_LEAD_STATE_SETTINGS,
  formatLeadAlarmReasonLabel,
  getLeadAlarmReasons,
  getLeadDailyPriority,
  getLeadLastTouch,
  getLeadNextStep,
  getLeadRiskState,
} from "../lib/domain/lead-state"
import type { Lead, WorkItem } from "../lib/types"

type SnapshotWithDomainSettings = ReturnType<typeof createInitialSnapshot> & {
  settings: Record<string, unknown>
}

function applyDomainSettings(target: SnapshotWithDomainSettings, patch: Record<string, unknown>) {
  Object.assign(target.settings, patch)
}

function createLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_1",
    workspaceId: null,
    name: "Lead testowy",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "",
    nextActionAt: "",
    nextActionItemId: null,
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-01T09:00:00.000Z",
    ...overrides,
  }
}

function createItem(overrides: Partial<WorkItem> = {}): WorkItem {
  return {
    id: "item_1",
    workspaceId: null,
    leadId: "lead_1",
    leadLabel: "Lead testowy",
    recordType: "task",
    type: "task",
    title: "Task",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: "2026-04-07T10:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    createdAt: "2026-04-06T08:00:00.000Z",
    updatedAt: "2026-04-06T08:00:00.000Z",
    showInTasks: true,
    showInCalendar: false,
    ...overrides,
  }
}

test("computed state odświeża się po zmianach CRUD leada i itemów", () => {
  const base = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead CRUD",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const lead = base.leads[0]!
  const before = buildLeadComputedState(base, lead, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(before.hasNextStep, false)

  const withItem = addItemSnapshot(base, {
    leadId: lead.id,
    leadLabel: lead.name,
    recordType: "task",
    type: "follow_up",
    title: "Nowy follow-up",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: "2026-04-08T09:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: true,
  })

  const nextItemId = withItem.items[0]!.id
  const afterAdd = buildLeadComputedState(withItem, withItem.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(afterAdd.hasNextStep, true)
  assert.equal(afterAdd.nextStepAt, "2026-04-08T09:00:00.000Z")

  const afterDelete = deleteItemSnapshot(withItem, nextItemId)
  const recomputed = buildLeadComputedState(afterDelete, afterDelete.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(recomputed.hasNextStep, false)
  assert.equal(recomputed.riskReason, "missing_next_step")
})

test("getLeadLastTouch zwraca ostatni realny kontakt z leadem", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [createLead()]
  snapshot.items = [
    createItem({
      id: "reply_old",
      type: "reply",
      status: "done",
      scheduledAt: "2026-04-03T09:00:00.000Z",
      updatedAt: "2026-04-03T10:00:00.000Z",
    }),
    createItem({
      id: "meeting_new",
      type: "meeting",
      recordType: "event",
      status: "done",
      startAt: "2026-04-05T12:00:00.000Z",
      endAt: "2026-04-05T12:30:00.000Z",
      scheduledAt: "",
      updatedAt: "2026-04-05T12:40:00.000Z",
      showInCalendar: true,
    }),
  ]

  const lastTouch = getLeadLastTouch(snapshot, snapshot.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(lastTouch.itemId, "meeting_new")
  assert.equal(lastTouch.itemType, "meeting")
  assert.equal(lastTouch.at, "2026-04-05T12:40:00.000Z")
})

test("getLeadNextStep zwraca najbliższy aktywny krok i wykrywa overdue", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [createLead()]
  snapshot.items = [
    createItem({ id: "future_step", type: "follow_up", scheduledAt: "2026-04-10T09:00:00.000Z" }),
    createItem({ id: "older_step", type: "task", scheduledAt: "2026-04-05T09:00:00.000Z" }),
  ]

  const nextStep = getLeadNextStep(snapshot, snapshot.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(nextStep.itemId, "older_step")
  assert.equal(nextStep.hasNextStep, true)
  assert.equal(nextStep.isOverdue, true)
  assert.equal(nextStep.daysUntil, -2)
})

test("getLeadAlarmReasons i getLeadRiskState klasyfikują aktywnego leada po next step i ryzyku", () => {
  const snapshot = createInitialSnapshot() as SnapshotWithDomainSettings
  applyDomainSettings(snapshot, { waitingTooLongDays: 3, staleLeadDays: 5, highValueThreshold: 5000 })
  snapshot.leads = [
    createLead({
      status: "offer_sent",
      value: 9000,
      priority: "high",
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    }),
  ]
  snapshot.items = [
    createItem({
      id: "proposal_done",
      type: "proposal",
      status: "done",
      scheduledAt: "2026-04-02T09:00:00.000Z",
      updatedAt: "2026-04-02T10:00:00.000Z",
    }),
  ]

  const reasons = getLeadAlarmReasons(snapshot, snapshot.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  const risk = getLeadRiskState(snapshot, snapshot.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })

  assert.deepEqual(reasons, [
    "no_followup_after_proposal",
    "waiting_too_long",
    "high_value_stale",
    "inactive_too_long",
  ])
  assert.equal(risk.state, "at_risk")
  assert.equal(risk.primaryReason, "no_followup_after_proposal")
  assert.equal(risk.isWaitingTooLong, true)
})

test("getLeadDailyPriority liczy priorytet dnia od nowa na podstawie helperów", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [
    createLead({
      status: "follow_up",
      priority: "high",
      value: 8000,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    }),
  ]
  snapshot.items = [
    createItem({
      id: "overdue_followup",
      type: "follow_up",
      scheduledAt: "2026-04-05T09:00:00.000Z",
      updatedAt: "2026-04-05T09:00:00.000Z",
    }),
  ]

  const score = getLeadDailyPriority(snapshot, snapshot.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(score, 122)
})

test("waiting bez ruchu przez próg dni trafia do waiting_too_long", () => {
  const snapshot = createInitialSnapshot() as SnapshotWithDomainSettings
  applyDomainSettings(snapshot, { waitingTooLongDays: 3 })
  snapshot.leads = [createLead({ status: "offer_sent", createdAt: "2026-04-01T09:00:00.000Z" })]
  snapshot.items = [
    createItem({
      id: "reply_done",
      type: "reply",
      status: "done",
      scheduledAt: "2026-04-03T09:00:00.000Z",
      updatedAt: "2026-04-03T10:00:00.000Z",
    }),
  ]

  const computed = buildLeadComputedState(snapshot, snapshot.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(computed.isWaitingTooLong, true)
  assert.equal(computed.riskReason, "waiting_too_long")
})

test("brak follow-up po zrobionym spotkaniu daje specyficzny powód ryzyka", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [createLead()]
  snapshot.items = [
    createItem({
      id: "meeting_done",
      recordType: "event",
      type: "meeting",
      status: "done",
      startAt: "2026-04-06T12:00:00.000Z",
      endAt: "2026-04-06T12:30:00.000Z",
      scheduledAt: "",
      updatedAt: "2026-04-06T12:40:00.000Z",
      showInCalendar: true,
    }),
  ]

  const computed = buildLeadComputedState(snapshot, snapshot.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(computed.hasNextStep, false)
  assert.equal(computed.riskReason, "no_followup_after_meeting")
})

test("zbyt wiele aktywnych akcji jest liczone w openActionsCount i może podnieść risk", () => {
  const snapshot = createInitialSnapshot() as SnapshotWithDomainSettings
  applyDomainSettings(snapshot, { maxOpenActionsBeforeChaos: 3 })
  snapshot.leads = [createLead()]
  snapshot.items = [
    createItem({ id: "item_1", scheduledAt: "2026-04-08T09:00:00.000Z" }),
    createItem({ id: "item_2", scheduledAt: "2026-04-08T10:00:00.000Z" }),
    createItem({ id: "item_3", scheduledAt: "2026-04-08T11:00:00.000Z" }),
    createItem({ id: "item_4", scheduledAt: "2026-04-08T12:00:00.000Z" }),
  ]

  const computed = buildLeadComputedState(snapshot, snapshot.leads[0]!, { now: "2026-04-07T08:00:00.000Z" })
  assert.equal(computed.openActionsCount, 4)
  assert.equal(computed.riskReason, "too_many_open_actions")
})

test("formatLeadAlarmReasonLabel daje czytelny powód alarmu do UI", () => {
  assert.equal(formatLeadAlarmReasonLabel("missing_next_step"), "Brak kolejnego kroku")
  assert.equal(formatLeadAlarmReasonLabel("next_step_overdue"), "Termin kolejnego kroku minął")
  assert.equal(formatLeadAlarmReasonLabel("none"), "")
})

test("domyślne ustawienia domeny leadów są przewidywalne", () => {
  assert.deepEqual(DEFAULT_LEAD_STATE_SETTINGS, {
    waitingTooLongDays: 3,
    staleLeadDays: 5,
    highValueThreshold: 5000,
    maxOpenActionsBeforeChaos: 3,
  })
})

