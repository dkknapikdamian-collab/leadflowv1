import type { AppSnapshot, CaseStatus, Lead, LeadAlarmReason, WorkItem } from "../types"
import {
  compareDateKeys,
  getCurrentDateKey,
  getItemPrimaryDate,
  toDateKey,
  type DateContextOptions,
} from "../utils"
import {
  buildLeadComputedState,
  getLeadLastTouch,
  getLeadNextStep,
} from "./lead-state"
import { isClosedLeadStatus } from "./workflow-source-of-truth"

export type LeadProcessStage =
  | "sales_attention"
  | "sales_scheduled"
  | "ready_for_operations"
  | "in_operations"
  | "closed"

export interface LeadProcessSurfaceSummary {
  leadId: string
  caseId: string | null
  hasCase: boolean
  operationalStatus: CaseStatus
  stage: LeadProcessStage
  canStartOperations: boolean
  nextStepTitle: string
  nextStepAt: string | null
  nextStepOverdue: boolean
  lastTouchAt: string | null
  openTaskCount: number
  overdueTaskCount: number
  calendarVisibleCount: number
  timelineCount: number
  alarmReasons: LeadAlarmReason[]
  nextMoveLabel: string
}

function getLeadItems(snapshot: AppSnapshot, leadId: string) {
  return snapshot.items.filter((item) => item.leadId === leadId)
}

function isActionableSurfaceItem(item: WorkItem) {
  return item.recordType !== "note" && item.type !== "note" && item.status !== "done"
}

function countOpenTasks(items: WorkItem[]) {
  return items.filter((item) => item.showInTasks && isActionableSurfaceItem(item)).length
}

function countOverdueTasks(items: WorkItem[], options: DateContextOptions) {
  const currentDateKey = getCurrentDateKey(options)
  return items.filter((item) => {
    if (!item.showInTasks || !isActionableSurfaceItem(item)) return false
    const itemDateKey = toDateKey(getItemPrimaryDate(item), options)
    return Boolean(itemDateKey) && compareDateKeys(itemDateKey, currentDateKey) < 0
  }).length
}

function countCalendarVisible(items: WorkItem[]) {
  return items.filter((item) => item.showInCalendar && isActionableSurfaceItem(item)).length
}

function resolveOperationalStatus(snapshot: AppSnapshot, lead: Lead): CaseStatus {
  if (!lead.caseId) return "not_started"
  return snapshot.cases?.find((entry) => entry.id === lead.caseId)?.status ?? "not_started"
}

function resolveLeadProcessStage(input: {
  lead: Lead
  operationalStatus: CaseStatus
  hasCase: boolean
  hasNextStep: boolean
  isAtRisk: boolean
  dailyPriorityScore: number
}): LeadProcessStage {
  if (isClosedLeadStatus(input.lead.status)) return "closed"

  if (input.hasCase && input.operationalStatus !== "not_started" && input.operationalStatus !== "ready_to_start") {
    return "in_operations"
  }

  if (input.lead.status === "won" || input.operationalStatus === "ready_to_start") {
    return "ready_for_operations"
  }

  if (!input.hasNextStep || input.isAtRisk || input.dailyPriorityScore > 0) {
    return "sales_attention"
  }

  return "sales_scheduled"
}

function resolveNextMoveLabel(input: {
  stage: LeadProcessStage
  hasCase: boolean
  operationalStatus: CaseStatus
  nextStepTitle: string
}) {
  if (input.stage === "closed") return "Proces zamknięty"
  if (input.stage === "ready_for_operations") {
    return input.hasCase ? "Uruchom sprawę" : "Utwórz sprawę"
  }
  if (input.stage === "in_operations") {
    return `Prowadź sprawę (${input.operationalStatus})`
  }
  return input.nextStepTitle || "Ustal next step"
}

export function buildLeadProcessSurfaceSummary(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
): LeadProcessSurfaceSummary {
  const items = getLeadItems(snapshot, lead.id)
  const computed = buildLeadComputedState(snapshot, lead, options)
  const nextStep = getLeadNextStep(snapshot, lead, options)
  const lastTouch = getLeadLastTouch(snapshot, lead, options)
  const operationalStatus = resolveOperationalStatus(snapshot, lead)
  const hasCase = Boolean(lead.caseId)
  const stage = resolveLeadProcessStage({
    lead,
    operationalStatus,
    hasCase,
    hasNextStep: computed.hasNextStep,
    isAtRisk: computed.isAtRisk,
    dailyPriorityScore: computed.dailyPriorityScore,
  })

  return {
    leadId: lead.id,
    caseId: lead.caseId ?? null,
    hasCase,
    operationalStatus,
    stage,
    canStartOperations: stage === "ready_for_operations" || stage === "in_operations",
    nextStepTitle: nextStep.title,
    nextStepAt: nextStep.at,
    nextStepOverdue: nextStep.isOverdue,
    lastTouchAt: lastTouch.at,
    openTaskCount: countOpenTasks(items),
    overdueTaskCount: countOverdueTasks(items, options),
    calendarVisibleCount: countCalendarVisible(items),
    timelineCount: items.length,
    alarmReasons: computed.alarmReasons,
    nextMoveLabel: resolveNextMoveLabel({
      stage,
      hasCase,
      operationalStatus,
      nextStepTitle: nextStep.title,
    }),
  }
}

export function buildLeadProcessSurfaceSummaryMap(
  snapshot: AppSnapshot,
  options: DateContextOptions = {},
) {
  return Object.fromEntries(
    snapshot.leads.map((lead) => [lead.id, buildLeadProcessSurfaceSummary(snapshot, lead, options)]),
  ) as Record<string, LeadProcessSurfaceSummary>
}
