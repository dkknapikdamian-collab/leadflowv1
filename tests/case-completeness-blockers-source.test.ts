import test from "node:test"
import assert from "node:assert/strict"
import {
  CASE_COMPLETENESS_STAGE_SOURCES,
  CASE_COMPLETENESS_SYSTEM_GUARDS,
  caseCanBeReadyToStart,
  caseIsOperationallyBlocked,
  caseNeedsCompletenessReminder,
  getCaseCompletenessStageSummary,
} from "../lib/domain/case-completeness-blockers-source"

test("ETAP 5 ma poprawne źródła prawdy", () => {
  assert.deepEqual(CASE_COMPLETENESS_STAGE_SOURCES, [
    "Case",
    "CaseItem",
    "Attachment",
    "Approval",
  ])
})

test("ETAP 5 ma poprawne guardy systemowe", () => {
  assert.deepEqual(CASE_COMPLETENESS_SYSTEM_GUARDS, [
    "missing_from_client",
    "missing_approval",
    "days_stuck",
    "needs_reminder",
    "blocked",
    "ready_to_start",
  ])
})

test("ETAP 5 summary zwraca spójny opis etapu", () => {
  assert.deepEqual(getCaseCompletenessStageSummary(), {
    sourcesOfTruth: ["Case", "CaseItem", "Attachment", "Approval"],
    systemGuards: [
      "missing_from_client",
      "missing_approval",
      "days_stuck",
      "needs_reminder",
      "blocked",
      "ready_to_start",
    ],
  })
})

test("system pilnuje przypomnienia gdy stoimy albo sprawa jest zablokowana", () => {
  assert.equal(caseNeedsCompletenessReminder({ daysStuck: 3, blocked: false, readyToStart: false }), true)
  assert.equal(caseNeedsCompletenessReminder({ daysStuck: 1, blocked: true, readyToStart: false }), true)
  assert.equal(caseNeedsCompletenessReminder({ daysStuck: 5, blocked: false, readyToStart: true }), false)
})

test("sprawa jest zablokowana gdy brakuje materiałów, akceptacji albo ma blokadę", () => {
  assert.equal(
    caseIsOperationallyBlocked({ missingFromClient: true, missingApproval: false, blockedFlag: false }),
    true,
  )
  assert.equal(
    caseIsOperationallyBlocked({ missingFromClient: false, missingApproval: true, blockedFlag: false }),
    true,
  )
  assert.equal(
    caseIsOperationallyBlocked({ missingFromClient: false, missingApproval: false, blockedFlag: true }),
    true,
  )
  assert.equal(
    caseIsOperationallyBlocked({ missingFromClient: false, missingApproval: false, blockedFlag: false }),
    false,
  )
})

test("sprawa jest gotowa do startu tylko gdy nie ma braków ani blokady", () => {
  assert.equal(
    caseCanBeReadyToStart({ missingFromClient: false, missingApproval: false, blockedFlag: false }),
    true,
  )
  assert.equal(
    caseCanBeReadyToStart({ missingFromClient: true, missingApproval: false, blockedFlag: false }),
    false,
  )
})
