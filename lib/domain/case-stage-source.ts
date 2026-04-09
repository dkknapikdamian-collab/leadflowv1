export const CASE_STAGE_OWNER = "Case" as const

export const CASE_STAGE_TRUTH_FIELDS = [
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
] as const

export const CASE_STAGE_SCREENS = [
  "Cases",
  "Case Detail",
  "Today",
  "Client Portal",
  "Activity",
] as const

export function getCaseStageSummary() {
  return {
    owner: CASE_STAGE_OWNER,
    truthFields: [...CASE_STAGE_TRUTH_FIELDS],
    ownerScreens: [...CASE_STAGE_SCREENS],
  }
}

export function caseOwnsOperationalStage(hasCaseId: boolean) {
  return hasCaseId
}
