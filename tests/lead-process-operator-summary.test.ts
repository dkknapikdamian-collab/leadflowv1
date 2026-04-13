import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { addLeadSnapshot, startCaseFromLeadSnapshot, updateLeadSnapshot } from "../lib/snapshot"
import { buildLeadProcessOperatorSummary } from "../lib/domain/lead-process-operator-summary"

const dateOptions = { timeZone: "Europe/Warsaw", now: "2026-04-16T09:00:00.000Z" }

test("operator summary keeps no-next-step lead in sales mode", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead bez kroku",
    company: "Acme",
    email: "",
    phone: "",
    source: "Inne",
    value: 1000,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const summary = buildLeadProcessOperatorSummary(snapshot, snapshot.leads[0], dateOptions)
  assert.equal(summary.stage, "sales_attention")
  assert.equal(summary.stageLabel, "Sprzedaż wymaga ruchu")
  assert.equal(summary.operatorMode, "sales")
  assert.equal(summary.shouldSellNow, true)
  assert.equal(summary.shouldCreateCase, false)
  assert.equal(summary.shouldRunCase, false)
  assert.equal(summary.shouldTreatAsClosed, false)
})

test("operator summary says won without case should create case", () => {
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

  const summary = buildLeadProcessOperatorSummary(snapshot, snapshot.leads[0], dateOptions)
  assert.equal(summary.stage, "ready_for_operations")
  assert.equal(summary.operatorMode, "operations")
  assert.equal(summary.shouldSellNow, false)
  assert.equal(summary.shouldCreateCase, true)
  assert.equal(summary.shouldRunCase, false)
})

test("operator summary says ready_to_start with case should run case", () => {
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

  const lead = snapshot.leads.find((entry) => entry.id === leadId)
  assert.ok(lead)
  const summary = buildLeadProcessOperatorSummary(snapshot, lead, dateOptions)
  assert.equal(summary.stage, "ready_for_operations")
  assert.equal(summary.operatorMode, "operations")
  assert.equal(summary.shouldCreateCase, false)
  assert.equal(summary.shouldRunCase, true)
})

test("operator summary says in_operations stays in operations mode", () => {
  let snapshot = createInitialSnapshot()
  snapshot = addLeadSnapshot(snapshot, {
    name: "Lead operacyjny",
    company: "Ops Co",
    email: "",
    phone: "",
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
  snapshot = startCaseFromLeadSnapshot(snapshot, { leadId, mode: "empty" })
  const lead = snapshot.leads.find((entry) => entry.id === leadId)
  assert.ok(lead)
  const summary = buildLeadProcessOperatorSummary(snapshot, lead, dateOptions)
  assert.equal(summary.stage, "in_operations")
  assert.equal(summary.stageLabel, "W operacjach")
  assert.equal(summary.operatorMode, "operations")
  assert.equal(summary.shouldCreateCase, false)
  assert.equal(summary.shouldRunCase, true)
})

test("operator summary says lost lead is closed", () => {
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
  const lead = snapshot.leads.find((entry) => entry.id === leadId)
  assert.ok(lead)
  const summary = buildLeadProcessOperatorSummary(snapshot, lead, dateOptions)
  assert.equal(summary.stage, "closed")
  assert.equal(summary.stageLabel, "Proces zamknięty")
  assert.equal(summary.operatorMode, "closed")
  assert.equal(summary.shouldSellNow, false)
  assert.equal(summary.shouldCreateCase, false)
  assert.equal(summary.shouldRunCase, false)
  assert.equal(summary.shouldTreatAsClosed, true)
})
