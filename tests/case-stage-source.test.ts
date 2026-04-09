import test from "node:test"
import assert from "node:assert/strict"
import {
  CASE_STAGE_OWNER,
  CASE_STAGE_SCREENS,
  CASE_STAGE_TRUTH_FIELDS,
  caseOwnsOperationalStage,
  getCaseStageSummary,
} from "../lib/domain/case-stage-source"

test("ETAP 4 ma poprawnego właściciela", () => {
  assert.equal(CASE_STAGE_OWNER, "Case")
})

test("ETAP 4 ma pełny zestaw pól źródła prawdy", () => {
  assert.deepEqual(CASE_STAGE_TRUTH_FIELDS, [
    "caseType",
    "operationalStatus",
    "completeness",
    "checklist",
    "blockers",
    "deadlines",
    "uploads",
    "approvals",
    "decisions",
    "nextOperationalMove",
  ])
})

test("ETAP 4 ma poprawne ekrany właścicielskie", () => {
  assert.deepEqual(CASE_STAGE_SCREENS, [
    "Cases",
    "Case Detail",
    "Today",
    "Client Portal",
    "Activity",
  ])
})

test("ETAP 4 summary zwraca spójny opis etapu", () => {
  assert.deepEqual(getCaseStageSummary(), {
    owner: "Case",
    truthFields: [
      "caseType",
      "operationalStatus",
      "completeness",
      "checklist",
      "blockers",
      "deadlines",
      "uploads",
      "approvals",
      "decisions",
      "nextOperationalMove",
    ],
    ownerScreens: ["Cases", "Case Detail", "Today", "Client Portal", "Activity"],
  })
})

test("po utworzeniu case to case staje się właścicielem etapu operacyjnego", () => {
  assert.equal(caseOwnsOperationalStage(true), true)
  assert.equal(caseOwnsOperationalStage(false), false)
})
