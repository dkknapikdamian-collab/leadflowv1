import test from "node:test"
import assert from "node:assert/strict"
import {
  CASE_EXECUTION_STATUSES,
  CASE_READY_STAGE_EFFECTS,
  CASE_READY_STAGE_REQUIREMENTS,
  caseCanMoveToReadyToStart,
  getCaseExecutionStatus,
  getReadyToStartAutomation,
} from "../lib/domain/case-ready-start-source"

test("ETAP 6 ma poprawne wymagania wejścia", () => {
  assert.deepEqual(CASE_READY_STAGE_REQUIREMENTS, [
    "all_required_submitted",
    "all_required_verified",
    "all_required_accepted",
  ])
})

test("ETAP 6 ma poprawne skutki automatyzacji", () => {
  assert.deepEqual(CASE_READY_STAGE_EFFECTS, [
    "remove_blocker",
    "set_ready_to_start",
    "show_in_today_ready_queue",
    "create_operator_next_move",
  ])
  assert.deepEqual(CASE_EXECUTION_STATUSES, ["ready_to_start", "in_progress"])
})

test("sprawa może wejść na ready_to_start tylko gdy wszystko jest dosłane, zweryfikowane i zaakceptowane", () => {
  assert.equal(
    caseCanMoveToReadyToStart({
      allRequiredSubmitted: true,
      allRequiredVerified: true,
      allRequiredAccepted: true,
    }),
    true,
  )

  assert.equal(
    caseCanMoveToReadyToStart({
      allRequiredSubmitted: true,
      allRequiredVerified: false,
      allRequiredAccepted: true,
    }),
    false,
  )
})

test("system ustawia ready_to_start albo in_progress zależnie od startu operatora", () => {
  assert.equal(
    getCaseExecutionStatus({
      allRequiredSubmitted: true,
      allRequiredVerified: true,
      allRequiredAccepted: true,
    }),
    "ready_to_start",
  )

  assert.equal(
    getCaseExecutionStatus({
      allRequiredSubmitted: true,
      allRequiredVerified: true,
      allRequiredAccepted: true,
      startedByOperator: true,
    }),
    "in_progress",
  )

  assert.equal(
    getCaseExecutionStatus({
      allRequiredSubmitted: true,
      allRequiredVerified: false,
      allRequiredAccepted: true,
    }),
    "blocked",
  )
})

test("automatyzacja ready_to_start zdejmuje blokadę, pokazuje sprawę w Today i tworzy kolejny ruch operatora", () => {
  assert.deepEqual(
    getReadyToStartAutomation({
      allRequiredSubmitted: true,
      allRequiredVerified: true,
      allRequiredAccepted: true,
    }),
    {
      removeBlocker: true,
      nextStatus: "ready_to_start",
      showInTodayReadyQueue: true,
      createOperatorNextMove: true,
    },
  )

  assert.deepEqual(
    getReadyToStartAutomation({
      allRequiredSubmitted: true,
      allRequiredVerified: false,
      allRequiredAccepted: true,
    }),
    {
      removeBlocker: false,
      nextStatus: "blocked",
      showInTodayReadyQueue: false,
      createOperatorNextMove: false,
    },
  )
})
