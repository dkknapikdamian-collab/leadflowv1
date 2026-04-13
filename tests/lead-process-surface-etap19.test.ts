import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import {
  addItemSnapshot,
  addLeadSnapshot,
  startCaseFromLeadSnapshot,
  updateLeadSnapshot,
} from "../lib/snapshot"
import { buildLeadProcessSurfaceSummary } from "../lib/domain/lead-process-surface"

const dateOptions = {
  timeZone: "Europe/Warsaw",
  now: "2026-04-16T09:00:00.000Z",
}

test("ETAP 19: lead z overdue next step zachowuje stage sales_attention i sygnal overdue", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead overdue",
    company: "Overdue Co",
    email: "overdue@example.com",
    phone: "111",
    source: "Inne",
    value: 3500,
    summary: "",
    notes: "",
    status: "contacted",
    priority: "medium",
    nextActionTitle: "Oddzwonić dziś rano",
    nextActionAt: "2026-04-15T08:00:00.000Z",
  })

  const lead = snapshot.leads[0]
  const summary = buildLeadProcessSurfaceSummary(snapshot, lead, dateOptions)

  assert.equal(summary.stage, "sales_attention")
  assert.equal(summary.nextStepTitle, "Oddzwonić dziś rano")
  assert.equal(summary.nextStepOverdue, true)
  assert.equal(summary.canStartOperations, false)
  assert.equal(summary.nextMoveLabel, "Oddzwonić dziś rano")
  assert.ok(summary.alarmReasons.includes("next_step_overdue"))
})

test("ETAP 19: lead z taskiem i eventem ma jedno wspólne summary procesu", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead procesowy",
    company: "Process Co",
    email: "process@example.com",
    phone: "222",
    source: "Inne",
    value: 4800,
    summary: "",
    notes: "",
    status: "meeting_scheduled",
    priority: "high",
    nextActionTitle: "Wyślij follow-up po spotkaniu",
    nextActionAt: "2026-04-16T12:00:00.000Z",
  })

  const leadId = snapshot.leads[0].id

  snapshot = addItemSnapshot(snapshot, {
    leadId,
    leadLabel: "Lead procesowy",
    recordType: "task",
    type: "follow_up",
    title: "Follow-up po spotkaniu",
    description: "",
    status: "todo",
    priority: "high",
    scheduledAt: "2026-04-16T12:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "1h_before",
    showInTasks: true,
    showInCalendar: false,
  })

  snapshot = addItemSnapshot(snapshot, {
    leadId,
    leadLabel: "Lead procesowy",
    recordType: "event",
    type: "meeting",
    title: "Spotkanie online",
    description: "",
    status: "todo",
    priority: "high",
    scheduledAt: "",
    startAt: "2026-04-16T10:00:00.000Z",
    endAt: "2026-04-16T10:30:00.000Z",
    recurrence: "none",
    reminder: "1h_before",
    showInTasks: false,
    showInCalendar: true,
  })

  const lead = snapshot.leads.find((entry) => entry.id === leadId)!
  const summary = buildLeadProcessSurfaceSummary(snapshot, lead, dateOptions)

  assert.equal(summary.stage, "sales_attention")
  assert.equal(summary.openTaskCount, 2)
  assert.equal(summary.calendarVisibleCount, 2)
  assert.equal(summary.timelineCount, 3)
  assert.equal(summary.nextMoveLabel, "Wyślij follow-up po spotkaniu")
})

test("ETAP 19: lead won z case ready_to_start wraca jako ready_for_operations, nie in_operations", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead do startu",
    company: "Ready Co",
    email: "ready@example.com",
    phone: "333",
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
  snapshot = startCaseFromLeadSnapshot(snapshot, {
    leadId,
    mode: "empty",
  })

  const caseId = snapshot.leads.find((entry) => entry.id === leadId)!.caseId!
  const existingCase = snapshot.cases.find((entry) => entry.id === caseId)!
  existingCase.status = "ready_to_start"

  const lead = snapshot.leads.find((entry) => entry.id === leadId)!
  const summary = buildLeadProcessSurfaceSummary(snapshot, lead, dateOptions)

  assert.equal(summary.hasCase, true)
  assert.equal(summary.operationalStatus, "ready_to_start")
  assert.equal(summary.stage, "ready_for_operations")
  assert.equal(summary.canStartOperations, true)
  assert.equal(summary.nextMoveLabel, "Uruchom sprawę")
})

test("ETAP 19: lead lost pozostaje zamknięty nawet jeśli ma stare działania", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead zamknięty",
    company: "Closed Co",
    email: "closed@example.com",
    phone: "444",
    source: "Inne",
    value: 2100,
    summary: "",
    notes: "",
    status: "contacted",
    priority: "low",
    nextActionTitle: "Stary follow-up",
    nextActionAt: "2026-04-14T09:00:00.000Z",
  })

  const leadId = snapshot.leads[0].id
  snapshot = addItemSnapshot(snapshot, {
    leadId,
    leadLabel: "Lead zamknięty",
    recordType: "task",
    type: "follow_up",
    title: "Stary follow-up",
    description: "",
    status: "todo",
    priority: "low",
    scheduledAt: "2026-04-14T09:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })

  snapshot = updateLeadSnapshot(snapshot, leadId, { status: "lost" })

  const lead = snapshot.leads.find((entry) => entry.id === leadId)!
  const summary = buildLeadProcessSurfaceSummary(snapshot, lead, dateOptions)

  assert.equal(summary.stage, "closed")
  assert.equal(summary.canStartOperations, false)
  assert.equal(summary.nextMoveLabel, "Proces zamknięty")
})
