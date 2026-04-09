export const CASE_READY_STAGE_REQUIREMENTS = [
  "all_required_submitted",
  "all_required_verified",
  "all_required_accepted",
] as const

export const CASE_READY_STAGE_EFFECTS = [
  "remove_blocker",
  "set_ready_to_start",
  "show_in_today_ready_queue",
  "create_operator_next_move",
] as const

export const CASE_EXECUTION_STATUSES = ["ready_to_start", "in_progress"] as const

export function caseCanMoveToReadyToStart(input: {
  allRequiredSubmitted: boolean
  allRequiredVerified: boolean
  allRequiredAccepted: boolean
}) {
  return input.allRequiredSubmitted && input.allRequiredVerified && input.allRequiredAccepted
}

export function getCaseExecutionStatus(input: {
  allRequiredSubmitted: boolean
  allRequiredVerified: boolean
  allRequiredAccepted: boolean
  startedByOperator?: boolean
}) {
  if (!caseCanMoveToReadyToStart(input)) {
    return "blocked"
  }

  if (input.startedByOperator) {
    return "in_progress"
  }

  return "ready_to_start"
}

export function getReadyToStartAutomation(input: {
  allRequiredSubmitted: boolean
  allRequiredVerified: boolean
  allRequiredAccepted: boolean
}) {
  const ready = caseCanMoveToReadyToStart(input)

  return {
    removeBlocker: ready,
    nextStatus: ready ? "ready_to_start" : "blocked",
    showInTodayReadyQueue: ready,
    createOperatorNextMove: ready,
  }
}
