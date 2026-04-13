import type { CaseDashboardCard } from "./cases-dashboard"
import type { LeadWithComputedState } from "./lead-state"

export interface LeadOwnerSummary {
  total: number
  needsAttention: number
  missingNextStep: number
  overdueNextStep: number
  waitingTooLong: number
  highPriority: number
}

export interface CaseOwnerSummary {
  total: number
  blocked: number
  waitingForClient: number
  readyToStart: number
  needsActionToday: number
  overdue: number
}

export function buildLeadOwnerSummary(leads: LeadWithComputedState[]): LeadOwnerSummary {
  return {
    total: leads.length,
    needsAttention: leads.filter((lead) => lead.computed.dailyPriorityScore > 0 || lead.computed.isAtRisk || !lead.computed.hasNextStep).length,
    missingNextStep: leads.filter((lead) => !lead.computed.hasNextStep).length,
    overdueNextStep: leads.filter((lead) => lead.computed.nextStepOverdue).length,
    waitingTooLong: leads.filter((lead) => lead.computed.isWaitingTooLong).length,
    highPriority: leads.filter((lead) => lead.priority === "high").length,
  }
}

export function buildCaseOwnerSummary(cards: CaseDashboardCard[]): CaseOwnerSummary {
  return {
    total: cards.length,
    blocked: cards.filter((card) => card.status === "blocked").length,
    waitingForClient: cards.filter((card) => card.status === "waiting_for_client").length,
    readyToStart: cards.filter((card) => card.status === "ready_to_start").length,
    needsActionToday: cards.filter((card) => card.needsActionToday).length,
    overdue: cards.filter((card) => card.isOverdue).length,
  }
}
