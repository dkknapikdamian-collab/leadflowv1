import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { addItemSnapshot, addLeadSnapshot, startCaseFromLeadSnapshot, updateLeadSnapshot } from "../lib/snapshot"
import { buildWorkItemProcessContext } from "../lib/domain/work-item-process-context"

const dateOptions = { timeZone: "Europe/Warsaw", now: "2026-04-16T09:00:00.000Z" }

test("work item process context returns neutral state for item without lead", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addItemSnapshot(snapshot, {
    leadId: null,
    leadLabel: "",
    recordType: "task",
    type: "other",
    title: "Samodzielne zadanie",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: "2026-04-16T11:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })

  const context = buildWorkItemProcessContext(snapshot, snapshot.items[0], dateOptions)
  assert.equal(context.hasLead, false)
  assert.equal(context.operatorMode, "none")
  assert.equal(context.stageLabel, "Bez procesu")
  assert.equal(context.nextMoveLabel, "Brak powiązanego leada")
})

test("work item process context says won lead without case should create case", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead wygrany",
    company: "Win Co",
    email: "",
    phone: "",
    source: "Inne",
    value: 7000,
    summary: "",
    notes: "",
    status: "won",
    priority: "high",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const leadId = snapshot.leads[0].id
  snapshot = addItemSnapshot(snapshot, {
    leadId,
    leadLabel: "Lead wygrany",
    recordType: "task",
    type: "other",
    title: "Domknij sprzedaż",
    description: "",
    status: "todo",
    priority: "high",
    scheduledAt: "2026-04-16T11:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })

  const context = buildWorkItemProcessContext(snapshot, snapshot.items[0], dateOptions)
  assert.equal(context.hasLead, true)
  assert.equal(context.operatorMode, "operations")
  assert.equal(context.shouldCreateCase, true)
  assert.equal(context.shouldRunCase, false)
  assert.equal(context.stage, "ready_for_operations")
})

test("work item process context says ready_to_start case should run case", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead do startu",
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

  snapshot = addItemSnapshot(snapshot, {
    leadId,
    leadLabel: "Lead do startu",
    recordType: "event",
    type: "meeting",
    title: "Start sprawy",
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

  const context = buildWorkItemProcessContext(snapshot, snapshot.items[0], dateOptions)
  assert.equal(context.operatorMode, "operations")
  assert.equal(context.shouldCreateCase, false)
  assert.equal(context.shouldRunCase, true)
  assert.equal(context.operationalStatus, "ready_to_start")
})

test("work item process context says lost lead is closed", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead przegrany",
    company: "Loss Co",
    email: "",
    phone: "",
    source: "Inne",
    value: 1200,
    summary: "",
    notes: "",
    status: "new",
    priority: "low",
    nextActionTitle: "Oddzwonić",
    nextActionAt: "2026-04-14T09:00:00.000Z",
  })

  const leadId = snapshot.leads[0].id
  snapshot = updateLeadSnapshot(snapshot, leadId, { status: "lost" })
  snapshot = addItemSnapshot(snapshot, {
    leadId,
    leadLabel: "Lead przegrany",
    recordType: "task",
    type: "other",
    title: "Archiwizacja",
    description: "",
    status: "todo",
    priority: "low",
    scheduledAt: "2026-04-16T11:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })

  const context = buildWorkItemProcessContext(snapshot, snapshot.items[0], dateOptions)
  assert.equal(context.operatorMode, "closed")
  assert.equal(context.shouldTreatAsClosed, true)
  assert.equal(context.stage, "closed")
})
