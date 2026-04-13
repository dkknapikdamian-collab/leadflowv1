import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { addItemSnapshot, addLeadSnapshot, startCaseFromLeadSnapshot } from "../lib/snapshot"
import { buildLeadDrawerViewModel } from "../lib/domain/lead-drawer-view-model"

const dateOptions = { timeZone: "Europe/Warsaw", now: "2026-04-16T09:00:00.000Z" }

test("lead drawer view model exposes sales state for lead without next step", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead bez kroku",
    company: "Acme",
    email: "",
    phone: "",
    source: "Inne",
    value: 1200,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const vm = buildLeadDrawerViewModel(snapshot, snapshot.leads[0], dateOptions)
  assert.equal(vm.process.stage, "sales_attention")
  assert.equal(vm.process.operatorMode, "sales")
  assert.equal(vm.nextStepLabel, "Ustal następny krok")
  assert.equal(vm.lastTouchLabel, "Brak historii kontaktu")
  assert.equal(vm.openItemsCount, 0)
  assert.equal(vm.timelineCount, 0)
  assert.equal(vm.canStartOperations, false)
})

test("lead drawer view model counts open and overdue items", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead aktywny",
    company: "Active Co",
    email: "",
    phone: "",
    source: "Inne",
    value: 5000,
    summary: "",
    notes: "",
    status: "follow_up",
    priority: "high",
    nextActionTitle: "Oddzwonić",
    nextActionAt: "2026-04-16T12:00:00.000Z",
  })

  const leadId = snapshot.leads[0].id
  snapshot = addItemSnapshot(snapshot, {
    leadId,
    leadLabel: "Lead aktywny",
    recordType: "task",
    type: "follow_up",
    title: "Follow-up",
    description: "",
    status: "todo",
    priority: "high",
    scheduledAt: "2026-04-15T08:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })
  snapshot = addItemSnapshot(snapshot, {
    leadId,
    leadLabel: "Lead aktywny",
    recordType: "event",
    type: "meeting",
    title: "Spotkanie",
    description: "",
    status: "todo",
    priority: "high",
    scheduledAt: "",
    startAt: "2026-04-16T10:00:00.000Z",
    endAt: "2026-04-16T10:30:00.000Z",
    recurrence: "none",
    reminder: "none",
    showInTasks: false,
    showInCalendar: true,
  })

  const lead = snapshot.leads.find((entry) => entry.id === leadId)
  assert.ok(lead)
  const vm = buildLeadDrawerViewModel(snapshot, lead, dateOptions)
  assert.equal(vm.openItemsCount, 3)
  assert.equal(vm.overdueItemsCount, 1)
  assert.equal(vm.timelineCount, 3)
  assert.equal(vm.nextStepLabel, "Follow-up")
})

test("lead drawer view model exposes operations state for won lead with case", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead wygrany",
    company: "Ready Co",
    email: "",
    phone: "",
    source: "Inne",
    value: 9100,
    summary: "",
    notes: "",
    status: "won",
    priority: "high",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const leadId = snapshot.leads[0].id
  snapshot = startCaseFromLeadSnapshot(snapshot, { leadId, mode: "empty" })
  const caseId = snapshot.leads.find((entry) => entry.id === leadId)?.caseId
  assert.ok(caseId)
  const existingCase = snapshot.cases?.find((entry) => entry.id === caseId)
  assert.ok(existingCase)
  existingCase.status = "ready_to_start"

  const lead = snapshot.leads.find((entry) => entry.id === leadId)
  assert.ok(lead)
  const vm = buildLeadDrawerViewModel(snapshot, lead, dateOptions)
  assert.equal(vm.process.operatorMode, "operations")
  assert.equal(vm.process.shouldRunCase, true)
  assert.equal(vm.canStartOperations, true)
  assert.equal(vm.operationalStatus, "ready_to_start")
})
