import test from "node:test"
import assert from "node:assert/strict"
import {
  SALES_STAGE_ACTIONS,
  SALES_STAGE_OWNER,
  SALES_STAGE_RELATED_OBJECTS,
  SALES_STAGE_SCREENS,
  SALES_STAGE_SYSTEM_GUARDS,
  hasSalesStageConsciousGuard,
} from "../lib/domain/sales-stage-source"

test("ETAP 2 ma poprawnego właściciela i właścicielskie ekrany", () => {
  assert.equal(SALES_STAGE_OWNER, "Lead")
  assert.deepEqual(SALES_STAGE_RELATED_OBJECTS, ["WorkItem", "task", "event"])
  assert.deepEqual(SALES_STAGE_SCREENS, ["Today", "Leads", "Lead Detail", "Tasks", "Calendar"])
})

test("ETAP 2 ma pełny zestaw akcji operatora sprzedaży", () => {
  assert.deepEqual(SALES_STAGE_ACTIONS, [
    "first_contact",
    "follow_up",
    "proposal",
    "meeting",
    "waiting_for_reply",
    "negotiation",
    "deal_close",
  ])
})

test("ETAP 2 ma pełny zestaw systemowych guardów", () => {
  assert.deepEqual(SALES_STAGE_SYSTEM_GUARDS, [
    "missing_next_step",
    "next_step_overdue",
    "waiting_too_long",
    "no_followup_after_proposal",
    "no_followup_after_meeting",
    "high_value_stale",
    "too_many_open_actions",
    "inactive_too_long",
  ])
})

test("aktywny lead musi mieć next step albo świadomy alarm bez next stepu", () => {
  assert.equal(hasSalesStageConsciousGuard(true, []), true)
  assert.equal(hasSalesStageConsciousGuard(false, ["missing_next_step"]), true)
  assert.equal(hasSalesStageConsciousGuard(false, ["inactive_too_long"]), false)
})
