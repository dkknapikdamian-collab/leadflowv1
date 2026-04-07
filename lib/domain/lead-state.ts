import type { AppSnapshot, Lead, SettingsState, WorkItem } from "../types"
import {
  compareDateKeys,
  getCurrentDateKey,
  getDateKeyDiff,
  getItemPrimaryDate,
  toDateKey,
  type DateContextOptions,
} from "../utils"

export type LeadRiskReason =
  | "none"
  | "missing_next_step"
  | "next_step_overdue"
  | "waiting_too_long"
  | "high_value_stale"
  | "inactive_too_long"
  | "too_many_open_actions"
  | "no_followup_after_meeting"
  | "no_followup_after_proposal"

export interface LeadStateSettings {
  waitingTooLongDays: number
  staleLeadDays: number
  highValueThreshold: number
  maxOpenActionsBeforeChaos: number
}

export interface LeadComputedState {
  leadId: string
  hasNextStep: boolean
  nextStepAt: string | null
  nextStepOverdue: boolean
  lastTouchAt: string | null
  daysSinceLastTouch: number
  daysUntilNextStep: number | null
  isWaitingTooLong: boolean
  isAtRisk: boolean
  riskReason: LeadRiskReason
  dailyPriorityScore: number
  openActionsCount: number
}

export interface LeadWithComputedState extends Lead {
  computed: LeadComputedState
}

const ACTIVE_ITEM_STATUSES = new Set<WorkItem["status"]>(["todo", "snoozed"])
const CONTACT_ITEM_TYPES = new Set<WorkItem["type"]>([
  "call",
  "reply",
  "proposal",
  "meeting",
  "follow_up",
  "check_reply",
])
const WAITING_CHECK_TYPES = new Set<WorkItem["type"]>(["follow_up", "check_reply", "reply", "call", "task"])

export const DEFAULT_LEAD_STATE_SETTINGS: LeadStateSettings = {
  waitingTooLongDays: 3,
  staleLeadDays: 5,
  highValueThreshold: 5000,
  maxOpenActionsBeforeChaos: 3,
}

function clampNonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function isClosedLead(lead: Pick<Lead, "status">) {
  return lead.status === "won" || lead.status === "lost"
}

function isActiveLead(lead: Pick<Lead, "status">) {
  return !isClosedLead(lead)
}

function isActionableItem(item: WorkItem) {
  return item.recordType !== "note" && item.type !== "note"
}

function isActiveActionableItem(item: WorkItem) {
  return ACTIVE_ITEM_STATUSES.has(item.status) && isActionableItem(item)
}

function isCompletedContactItem(item: WorkItem) {
  return item.status === "done" && (CONTACT_ITEM_TYPES.has(item.type) || item.recordType === "note" || item.type === "note")
}

function getCompletionLikeDate(item: WorkItem) {
  return item.updatedAt || getItemPrimaryDate(item) || item.createdAt
}

function comparePotentialNextSteps(left: WorkItem, right: WorkItem) {
  const leftDate = getItemPrimaryDate(left)
  const rightDate = getItemPrimaryDate(right)

  if (leftDate && rightDate) {
    return leftDate.localeCompare(rightDate) || left.createdAt.localeCompare(right.createdAt)
  }

  if (leftDate) return -1
  if (rightDate) return 1
  return left.createdAt.localeCompare(right.createdAt)
}

function compareCompletedContacts(left: WorkItem, right: WorkItem) {
  return getCompletionLikeDate(right).localeCompare(getCompletionLikeDate(left)) || right.createdAt.localeCompare(left.createdAt)
}

function getLeadItems(snapshot: AppSnapshot, leadId: string) {
  return snapshot.items.filter((item) => item.leadId === leadId)
}

function getNextStepItems(items: WorkItem[]) {
  return items.filter((item) => isActiveActionableItem(item)).sort(comparePotentialNextSteps)
}

function getLastTouchItem(items: WorkItem[]) {
  return items.filter((item) => isCompletedContactItem(item)).sort(compareCompletedContacts)[0] ?? null
}

function getSpecificMissingFollowupReason(lastTouchItem: WorkItem | null, hasNextStep: boolean): LeadRiskReason | null {
  if (hasNextStep || !lastTouchItem) return null
  if (lastTouchItem.type === "meeting") return "no_followup_after_meeting"
  if (lastTouchItem.type === "proposal") return "no_followup_after_proposal"
  return null
}

function resolveDaysSinceLastTouch(
  lastTouchAt: string | null,
  createdAt: string,
  options: DateContextOptions,
) {
  const currentDateKey = getCurrentDateKey(options)
  const baseDateKey = toDateKey(lastTouchAt || createdAt, options)
  if (!baseDateKey) return 0
  return clampNonNegative(getDateKeyDiff(currentDateKey, baseDateKey))
}

function resolveDaysUntilNextStep(nextStepAt: string | null, options: DateContextOptions) {
  if (!nextStepAt) return null
  const nextStepDateKey = toDateKey(nextStepAt, options)
  if (!nextStepDateKey) return null
  return getDateKeyDiff(nextStepDateKey, getCurrentDateKey(options))
}

function isWaitingCheckOverdue(items: WorkItem[], options: DateContextOptions) {
  const currentDateKey = getCurrentDateKey(options)

  return items.some((item) => {
    if (!WAITING_CHECK_TYPES.has(item.type)) return false
    if (!isActiveActionableItem(item)) return false
    const itemDateKey = toDateKey(getItemPrimaryDate(item), options)
    return Boolean(itemDateKey) && compareDateKeys(itemDateKey, currentDateKey) < 0
  })
}

export function resolveLeadStateSettings(settings?: Partial<SettingsState> | null): LeadStateSettings {
  const candidate = settings as Record<string, unknown> | null | undefined

  return {
    waitingTooLongDays:
      typeof candidate?.waitingTooLongDays === "number" && candidate.waitingTooLongDays > 0
        ? candidate.waitingTooLongDays
        : DEFAULT_LEAD_STATE_SETTINGS.waitingTooLongDays,
    staleLeadDays:
      typeof candidate?.staleLeadDays === "number" && candidate.staleLeadDays > 0
        ? candidate.staleLeadDays
        : DEFAULT_LEAD_STATE_SETTINGS.staleLeadDays,
    highValueThreshold:
      typeof candidate?.highValueThreshold === "number" && candidate.highValueThreshold > 0
        ? candidate.highValueThreshold
        : DEFAULT_LEAD_STATE_SETTINGS.highValueThreshold,
    maxOpenActionsBeforeChaos:
      typeof candidate?.maxOpenActionsBeforeChaos === "number" && candidate.maxOpenActionsBeforeChaos > 0
        ? candidate.maxOpenActionsBeforeChaos
        : DEFAULT_LEAD_STATE_SETTINGS.maxOpenActionsBeforeChaos,
  }
}

export function buildLeadComputedState(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
): LeadComputedState {
  const settings = resolveLeadStateSettings(snapshot.settings)
  const leadItems = getLeadItems(snapshot, lead.id)
  const nextStepItems = getNextStepItems(leadItems)
  const nextStepItem = nextStepItems[0] ?? null
  const nextStepAt = nextStepItem ? getItemPrimaryDate(nextStepItem) || null : null
  const hasNextStep = nextStepItems.length > 0
  const nextStepOverdue =
    Boolean(nextStepAt) &&
    compareDateKeys(toDateKey(nextStepAt, options), getCurrentDateKey(options)) < 0
  const lastTouchItem = getLastTouchItem(leadItems)
  const lastTouchAt = lastTouchItem ? getCompletionLikeDate(lastTouchItem) : null
  const daysSinceLastTouch = resolveDaysSinceLastTouch(lastTouchAt, lead.createdAt, options)
  const daysUntilNextStep = resolveDaysUntilNextStep(nextStepAt, options)
  const openActionsCount = nextStepItems.length
  const waitingCheckOverdue = lead.status === "waiting" && isWaitingCheckOverdue(leadItems, options)
  const isWaitingTooLong =
    lead.status === "waiting" &&
    (daysSinceLastTouch >= settings.waitingTooLongDays || waitingCheckOverdue)
  const isHighValueStale = lead.value >= settings.highValueThreshold && daysSinceLastTouch >= settings.staleLeadDays
  const isInactiveTooLong = daysSinceLastTouch >= settings.staleLeadDays
  const hasTooManyOpenActions = openActionsCount > settings.maxOpenActionsBeforeChaos
  const specificMissingFollowupReason = getSpecificMissingFollowupReason(lastTouchItem, hasNextStep)

  let riskReason: LeadRiskReason = "none"

  if (isActiveLead(lead)) {
    if (nextStepOverdue) {
      riskReason = "next_step_overdue"
    } else if (specificMissingFollowupReason) {
      riskReason = specificMissingFollowupReason
    } else if (isWaitingTooLong) {
      riskReason = "waiting_too_long"
    } else if (!hasNextStep) {
      riskReason = "missing_next_step"
    } else if (isHighValueStale) {
      riskReason = "high_value_stale"
    } else if (isInactiveTooLong) {
      riskReason = "inactive_too_long"
    } else if (hasTooManyOpenActions) {
      riskReason = "too_many_open_actions"
    }
  }

  let dailyPriorityScore = 0

  if (isActiveLead(lead)) {
    if (nextStepOverdue) dailyPriorityScore += 50
    if (!hasNextStep) dailyPriorityScore += 40
    if (isWaitingTooLong) dailyPriorityScore += 30
    if (daysUntilNextStep === 0) dailyPriorityScore += 20
    if (lead.priority === "high") dailyPriorityScore += 15
    if (lead.value >= settings.highValueThreshold) dailyPriorityScore += 15
    dailyPriorityScore += Math.min(daysSinceLastTouch * 2, 20)
    if (hasTooManyOpenActions) dailyPriorityScore += 10
  }

  return {
    leadId: lead.id,
    hasNextStep,
    nextStepAt,
    nextStepOverdue: Boolean(nextStepOverdue),
    lastTouchAt,
    daysSinceLastTouch,
    daysUntilNextStep,
    isWaitingTooLong,
    isAtRisk: riskReason !== "none",
    riskReason,
    dailyPriorityScore,
    openActionsCount,
  }
}

export function buildLeadComputedStateMap(snapshot: AppSnapshot, options: DateContextOptions = {}) {
  return Object.fromEntries(
    snapshot.leads.map((lead) => [lead.id, buildLeadComputedState(snapshot, lead, options)]),
  ) as Record<string, LeadComputedState>
}

export function buildLeadsWithComputedState(
  snapshot: AppSnapshot,
  options: DateContextOptions = {},
): LeadWithComputedState[] {
  return snapshot.leads.map((lead) => ({
    ...lead,
    computed: buildLeadComputedState(snapshot, lead, options),
  }))
}
