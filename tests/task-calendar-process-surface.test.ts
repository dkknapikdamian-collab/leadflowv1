import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import {
  addItemSnapshot,
  addLeadSnapshot,
  startCaseFromLeadSnapshot,
} from "../lib/snapshot"
import {
  buildTaskCalendarProcessSurface,
  buildTaskCalendarProcessSurfaceMap,
} from "../lib/domain/task-calendar-process-surface"

test("task bez leada dostaje stan bez procesu", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addItemSnapshot(snapshot, {
    leadId: null,
    leadLabel: "",
    recordType: "task",
    type: "task",
    title: "Zadanie ogólne",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: "2026-04-14T09:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })

  const item = snapshot.items[0]
  const surface = buildTaskCalendarProcessSurface(snapshot, item)

  assert.equal(surface.hasLinkedLead, false)
  assert.equal(surface.processStage, null)
  assert.equal(surface.nextMoveLabel, "Brak powiązanego leada")
})

test("task dla wygranego leada bez case pokazuje gotowosc do operacji", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead gotowy",
    company: "Ready Co",
    email: "ready@example.com",
    phone: "111",
    source: "Inne",
    value: 5000,
    summary: "",
    notes: "",
    status: "won",
    priority: "high",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const lead = snapshot.leads[0]
  snapshot = addItemSnapshot(snapshot, {
    leadId: lead.id,
    leadLabel: lead.name,
    recordType: "task",
    type: "task",
    title: "Uruchom sprawę",
    description: "",
    status: "todo",
    priority: "high",
    scheduledAt: "2026-04-14T12:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })

  const item = snapshot.items[0]
  const surface = buildTaskCalendarProcessSurface(snapshot, item)

  assert.equal(surface.hasLinkedLead, true)
  assert.equal(surface.processStage, "ready_for_operations")
  assert.equal(surface.canStartOperations, true)
  assert.equal(surface.nextMoveLabel, "Utwórz sprawę")
})

test("event dla leada z case pokazuje etap operacyjny", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead operacyjny",
    company: "Ops Co",
    email: "ops@example.com",
    phone: "222",
    source: "Inne",
    value: 8000,
    summary: "",
    notes: "",
    status: "won",
    priority: "high",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const leadId = snapshot.leads[0].id
  snapshot = startCaseFromLeadSnapshot(snapshot, { leadId, mode: "empty" })
  const lead = snapshot.leads.find((entry) => entry.id === leadId)!

  snapshot = addItemSnapshot(snapshot, {
    leadId: lead.id,
    leadLabel: lead.name,
    recordType: "event",
    type: "meeting",
    title: "Kickoff",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: "",
    startAt: "2026-04-16T10:00:00.000Z",
    endAt: "2026-04-16T10:30:00.000Z",
    recurrence: "none",
    reminder: "1h_before",
    showInTasks: false,
    showInCalendar: true,
  })

  const surfaceMap = buildTaskCalendarProcessSurfaceMap(snapshot)
  const item = snapshot.items[0]
  const surface = surfaceMap[item.id]

  assert.equal(surface.hasLinkedLead, true)
  assert.equal(surface.processStage, "in_operations")
  assert.equal(surface.nextMoveLabel, "Prowadź sprawę (collecting_materials)")
  assert.equal(surface.canStartOperations, true)
})
