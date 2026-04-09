import type { CaseStatus, LeadRiskState, LeadStatus } from "../types"

export const DELIVERY_SYSTEM_BRANCH = "dev-rollout-freeze" as const

export const PRODUCT_SOURCE_OF_TRUTH = {
  name: "jeden system do domykania i uruchamiania klienta",
  salesLayer: "Lead Flow",
  operationsLayer: "Sprawy / kompletność / start realizacji",
  scopeDocument: "product-scope-v2.md",
} as const

export const PRODUCT_SOURCE_OF_TRUTH_DOCUMENTS = [
  "product-scope-v2.md",
  "docs/data-model-lead-case-v2.md",
  "kierunek.txt",
  "kontrola leadów.txt",
  "docs/PAKIET_GLOWNY_HARD_LOCK_DEV_ROLLOUT_FREEZE_2026-04-09.md",
] as const

export const CUSTOMER_LIFECYCLE = [
  "contact",
  "lead",
  "won_or_ready_to_start",
  "case",
  "completeness",
  "start_realization",
] as const

export type CustomerLifecycleStep = (typeof CUSTOMER_LIFECYCLE)[number]

export const ACTIVE_LEAD_STATUSES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "qualification",
  "offer_sent",
  "follow_up",
] as const

export const CLOSED_LEAD_STATUSES: readonly LeadStatus[] = ["won", "lost"] as const

export const CASE_ENTRY_LEAD_STATUSES: readonly LeadStatus[] = ["won"] as const

export const CASE_ENTRY_CASE_STATUSES: readonly CaseStatus[] = ["ready_to_start"] as const

export const LEAD_REQUIRED_PROCESS_FIELDS = [
  "nextStep",
  "nextStepAt",
  "lastTouchAt",
  "riskState",
  "riskReason",
  "dailyPriorityScore",
] as const

export type LeadRequiredProcessField = (typeof LEAD_REQUIRED_PROCESS_FIELDS)[number]

export function isClosedLeadStatus(status: LeadStatus) {
  return CLOSED_LEAD_STATUSES.includes(status)
}

export function isActiveLeadStatus(status: LeadStatus) {
  return ACTIVE_LEAD_STATUSES.includes(status)
}

export function canEnterCaseLifecycle(params: { leadStatus: LeadStatus; caseStatus?: CaseStatus | null }) {
  if (params.caseStatus && CASE_ENTRY_CASE_STATUSES.includes(params.caseStatus)) {
    return true
  }

  return CASE_ENTRY_LEAD_STATUSES.includes(params.leadStatus)
}

export function requiresLeadExecutionGuard(input: {
  hasNextStep: boolean
  riskState: LeadRiskState
  dailyPriorityScore: number
}) {
  return !input.hasNextStep || input.riskState === "at_risk" || input.dailyPriorityScore > 0
}

export function getCustomerLifecycleLabel() {
  return CUSTOMER_LIFECYCLE.join(" -> ")
}
