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

const dateOptions = { timeZone: "Europe/Warsaw" }

test("lead bez next stepu wpada do sales_attention i wymaga ustalenia ruchu", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Brak kroku",
    company: "Acme",
    email: "lead@example.com",
    phone: "123",
    source: "Inne",
    value: 1000,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const lead = snapshot.leads[0]
  const summary = buildLeadProcessSurfaceSummary(snapshot, lead, dateOptions)

  assert.equal(summary.stage, "sales_attention")
  assert.equal(summary.canStartOperations, false)
  assert.equal(summary.nextMoveLabel, "Ustal następny krok")
  assert.equal(summary.openTaskCount, 0)
  assert.equal(summary.timelineCount, 0)
})

test("lead z aktywnymi zadaniami i eventem liczy powierzchnie tasks i calendar", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead z ruchem",
    company: "Studio",
    email: "ruch@example.com",
    phone: "456",
    source: "Inne",
    value: 2200,
    summary: "",
    notes: "",
    status: "contacted",
    priority: "high",
    nextActionTitle: "Oddzwonic",
    nextActionAt: "2026-04-14T09:00:00.000Z",
  })

  const lead = snapshot.leads[0]
  snapshot = addItemSnapshot(snapshot, {
    leadId: lead.id,
    leadLabel: lead.name,
    recordType: "event",
    type: "meeting",
    title: "Spotkanie kickoff",
    description: "",
    status: "todo",
    priority: "high",
    scheduledAt: "",
    startAt: "2026-04-15T10:00:00.000Z",
    endAt: "2026-04-15T10:30:00.000Z",
    recurrence: "none",
    reminder: "1h_before",
    showInTasks: false,
    showInCalendar: true,
  })

  const refreshedLead = snapshot.leads.find((entry) => entry.id === lead.id)!
  const summary = buildLeadProcessSurfaceSummary(snapshot, refreshedLead, dateOptions)

  assert.equal(summary.stage, "sales_attention")
  assert.equal(summary.openTaskCount, 1)
  assert.equal(summary.calendarVisibleCount, 2)
  assert.equal(summary.timelineCount, 2)
  assert.equal(summary.nextMoveLabel, "Oddzwonic")
})

test("lead won bez sprawy przechodzi do ready_for_operations", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead wygrany",
    company: "Win Co",
    email: "won@example.com",
    phone: "789",
    source: "Inne",
    value: 7000,
    summary: "",
    notes: "",
    status: "won",
    priority: "high",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const lead = snapshot.leads[0]
  const summary = buildLeadProcessSurfaceSummary(snapshot, lead, dateOptions)

  assert.equal(summary.stage, "ready_for_operations")
  assert.equal(summary.canStartOperations, true)
  assert.equal(summary.hasCase, false)
  assert.equal(summary.nextMoveLabel, "Utwórz sprawę")
})

test("lead z utworzona sprawa przechodzi do in_operations", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead operacyjny",
    company: "Ops Co",
    email: "ops@example.com",
    phone: "999",
    source: "Inne",
    value: 9000,
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

  const lead = snapshot.leads.find((entry) => entry.id === leadId)!
  const summary = buildLeadProcessSurfaceSummary(snapshot, lead, dateOptions)

  assert.equal(summary.stage, "in_operations")
  assert.equal(summary.canStartOperations, true)
  assert.equal(summary.hasCase, true)
  assert.equal(summary.operationalStatus, "collecting_materials")
  assert.equal(summary.nextMoveLabel, "Prowadź sprawę (collecting_materials)")
})

test("lead przegrany zamyka proces", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead przegrany",
    company: "Loss Co",
    email: "loss@example.com",
    phone: "321",
    source: "Inne",
    value: 1200,
    summary: "",
    notes: "",
    status: "new",
    priority: "low",
    nextActionTitle: "Oddzwonic",
    nextActionAt: "2026-04-14T09:00:00.000Z",
  })

  const leadId = snapshot.leads[0].id
  snapshot = updateLeadSnapshot(snapshot, leadId, { status: "lost" })

  const lead = snapshot.leads.find((entry) => entry.id === leadId)!
  const summary = buildLeadProcessSurfaceSummary(snapshot, lead, dateOptions)

  assert.equal(summary.stage, "closed")
  assert.equal(summary.canStartOperations, false)
  assert.equal(summary.nextMoveLabel, "Proces zamknięty")
})
