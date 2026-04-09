import type { LeadAlarmReason } from "../types"

export const SALES_STAGE_ACTIONS = [
  "first_contact",
  "follow_up",
  "proposal",
  "meeting",
  "waiting_for_reply",
  "negotiation",
  "deal_close",
] as const

export const SALES_STAGE_OWNER = "Lead" as const

export const SALES_STAGE_RELATED_OBJECTS = ["WorkItem", "task", "event"] as const

export const SALES_STAGE_SCREENS = [
  "Today",
  "Leads",
  "Lead Detail",
  "Tasks",
  "Calendar",
] as const

export const SALES_STAGE_SYSTEM_GUARDS: readonly LeadAlarmReason[] = [
  "missing_next_step",
  "next_step_overdue",
  "waiting_too_long",
  "no_followup_after_proposal",
  "no_followup_after_meeting",
  "high_value_stale",
  "too_many_open_actions",
  "inactive_too_long",
] as const

export function hasSalesStageConsciousGuard(hasNextStep: boolean, reasons: LeadAlarmReason[]) {
  return hasNextStep || reasons.includes("missing_next_step")
}
