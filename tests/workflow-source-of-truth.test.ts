import test from "node:test"
import assert from "node:assert/strict"
import {
  ACTIVE_LEAD_STATUSES,
  CASE_ENTRY_CASE_STATUSES,
  CASE_ENTRY_LEAD_STATUSES,
  CLOSED_LEAD_STATUSES,
  CUSTOMER_LIFECYCLE,
  DELIVERY_SYSTEM_BRANCH,
  LEAD_REQUIRED_PROCESS_FIELDS,
  PRODUCT_SOURCE_OF_TRUTH,
  PRODUCT_SOURCE_OF_TRUTH_DOCUMENTS,
  canEnterCaseLifecycle,
  getCustomerLifecycleLabel,
  isActiveLeadStatus,
  isClosedLeadStatus,
  requiresLeadExecutionGuard,
} from "../lib/domain/workflow-source-of-truth"

test("branch source of truth wskazuje dev-rollout-freeze", () => {
  assert.equal(DELIVERY_SYSTEM_BRANCH, "dev-rollout-freeze")
})

test("produkt ma jeden nadrzędny kierunek i spis dokumentów source of truth", () => {
  assert.equal(PRODUCT_SOURCE_OF_TRUTH.name, "jeden system do domykania i uruchamiania klienta")
  assert.equal(PRODUCT_SOURCE_OF_TRUTH.scopeDocument, "product-scope-v2.md")
  assert.equal(PRODUCT_SOURCE_OF_TRUTH_DOCUMENTS.includes("docs/data-model-lead-case-v2.md"), true)
})

test("cykl klienta jest zapisany jako jedna ścieżka od contact do start_realization", () => {
  assert.deepEqual(CUSTOMER_LIFECYCLE, [
    "contact",
    "lead",
    "won_or_ready_to_start",
    "case",
    "completeness",
    "start_realization",
  ])
  assert.equal(
    getCustomerLifecycleLabel(),
    "contact -> lead -> won_or_ready_to_start -> case -> completeness -> start_realization",
  )
})

test("statusy leada dzielą się na aktywne i zamknięte", () => {
  assert.deepEqual(ACTIVE_LEAD_STATUSES, ["new", "contacted", "qualification", "offer_sent", "follow_up"])
  assert.deepEqual(CLOSED_LEAD_STATUSES, ["won", "lost"])
  assert.equal(isActiveLeadStatus("new"), true)
  assert.equal(isActiveLeadStatus("won"), false)
  assert.equal(isClosedLeadStatus("lost"), true)
  assert.equal(isClosedLeadStatus("contacted"), false)
})

test("wejście do case lifecycle jest dozwolone po won albo ready_to_start", () => {
  assert.deepEqual(CASE_ENTRY_LEAD_STATUSES, ["won"])
  assert.deepEqual(CASE_ENTRY_CASE_STATUSES, ["ready_to_start"])
  assert.equal(canEnterCaseLifecycle({ leadStatus: "won" }), true)
  assert.equal(canEnterCaseLifecycle({ leadStatus: "contacted", caseStatus: "ready_to_start" }), true)
  assert.equal(canEnterCaseLifecycle({ leadStatus: "contacted" }), false)
})

test("lead execution guard wykrywa brak next step, ryzyko albo priorytet dnia", () => {
  assert.deepEqual(LEAD_REQUIRED_PROCESS_FIELDS, [
    "nextStep",
    "nextStepAt",
    "lastTouchAt",
    "riskState",
    "riskReason",
    "dailyPriorityScore",
  ])
  assert.equal(requiresLeadExecutionGuard({ hasNextStep: false, riskState: "ok", dailyPriorityScore: 0 }), true)
  assert.equal(requiresLeadExecutionGuard({ hasNextStep: true, riskState: "at_risk", dailyPriorityScore: 0 }), true)
  assert.equal(requiresLeadExecutionGuard({ hasNextStep: true, riskState: "ok", dailyPriorityScore: 12 }), true)
  assert.equal(requiresLeadExecutionGuard({ hasNextStep: true, riskState: "ok", dailyPriorityScore: 0 }), false)
})
