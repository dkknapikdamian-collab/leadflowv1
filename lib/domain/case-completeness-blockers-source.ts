export const CASE_COMPLETENESS_STAGE_SOURCES = [
  "Case",
  "CaseItem",
  "Attachment",
  "Approval",
] as const

export const CASE_COMPLETENESS_SYSTEM_GUARDS = [
  "missing_from_client",
  "missing_approval",
  "days_stuck",
  "needs_reminder",
  "blocked",
  "ready_to_start",
] as const

export function getCaseCompletenessStageSummary() {
  return {
    sourcesOfTruth: [...CASE_COMPLETENESS_STAGE_SOURCES],
    systemGuards: [...CASE_COMPLETENESS_SYSTEM_GUARDS],
  }
}

export function caseNeedsCompletenessReminder(input: { daysStuck: number; blocked: boolean; readyToStart: boolean }) {
  if (input.readyToStart) return false
  if (input.blocked) return true
  return input.daysStuck >= 3
}

export function caseIsOperationallyBlocked(input: {
  missingFromClient: boolean
  missingApproval: boolean
  blockedFlag: boolean
}) {
  return input.missingFromClient || input.missingApproval || input.blockedFlag
}

export function caseCanBeReadyToStart(input: {
  missingFromClient: boolean
  missingApproval: boolean
  blockedFlag: boolean
}) {
  return !caseIsOperationallyBlocked(input)
}
