import type {
  AppSnapshot,
  Lead,
  LeadAlarmReason,
  LeadRiskState,
  SettingsState,
  WorkItem,
} from "../types"
import {
  compareDateKeys,
  getCurrentDateKey,
  getDateKeyDiff,
  getItemPrimaryDate,
  toDateKey,
  type DateContextOptions,
} from "../utils"

export type LeadRiskReason = LeadAlarmReason | "none"

export interface LeadStateSettings {
  waitingTooLongDays: number
  staleLeadDays: number
  highValueThreshold: number
  maxOpenActionsBeforeChaos: number
}

export interface LeadLastTouchInfo {
  item: WorkItem | null
  itemId: string | null
  itemType: WorkItem["type"] | null
  at: string | null
}

export interface LeadNextStepInfo {
  item: WorkItem | null
  itemId: string | null
  itemType: WorkItem["type"] | null
  title: string
  at: string | null
  hasNextStep: boolean
  isOverdue: boolean
  daysUntil: number | null
}

export interface LeadRiskInfo {
  state: LeadRiskState
  isAtRisk: boolean
  primaryReason: LeadRiskReason
  reasons: LeadAlarmReason[]
  isWaitingTooLong: boolean
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
  riskState: LeadRiskState
  riskReason: LeadRiskReason
  alarmReasons: LeadAlarmReason[]
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

export function getLeadItems(snapshot: AppSnapshot, leadId: string) {
  return snapshot.items.filter((item) => item.leadId === leadId)
}

function getNextStepItems(items: WorkItem[]) {
  return items.filter((item) => isActiveActionableItem(item)).sort(comparePotentialNextSteps)
}

function getLastTouchItem(items: WorkItem[]) {
  return items.filter((item) => isCompletedContactItem(item)).sort(compareCompletedContacts)[0] ?? null
}

function getSpecificMissingFollowupReason(lastTouchItem: WorkItem | null, hasNextStep: boolean): LeadAlarmReason | null {
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

export function formatLeadAlarmReasonLabel(reason?: LeadRiskReason | null) {
  switch (reason) {
    case "missing_next_step":
      return "Brak kolejnego kroku"
    case "next_step_overdue":
      return "Termin kolejnego kroku minął"
    case "waiting_too_long":
      return "Lead w waiting za długo"
    case "high_value_stale":
      return "Wysoka wartość i brak ruchu"
    case "inactive_too_long":
      return "Brak aktywności od dłuższego czasu"
    case "too_many_open_actions":
      return "Za dużo otwartych działań"
    case "no_followup_after_meeting":
      return "Brak follow-up po spotkaniu"
    case "no_followup_after_proposal":
      return "Brak follow-up po ofercie"
    default:
      return ""
  }
}

export function getLeadLastTouch(
  snapshot: AppSnapshot,
  lead: Lead,
  _options: DateContextOptions = {},
): LeadLastTouchInfo {
  const lastTouchItem = getLastTouchItem(getLeadItems(snapshot, lead.id))
  const lastTouchAt = lastTouchItem ? getCompletionLikeDate(lastTouchItem) : null

  return {
    item: lastTouchItem,
    itemId: lastTouchItem?.id ?? null,
    itemType: lastTouchItem?.type ?? null,
    at: lastTouchAt,
  }
}

export function getLeadNextStep(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
): LeadNextStepInfo {
  const nextStepItem = getNextStepItems(getLeadItems(snapshot, lead.id))[0] ?? null
  const nextStepAt = nextStepItem ? getItemPrimaryDate(nextStepItem) || null : null
  const hasNextStep = Boolean(nextStepItem)
  const isOverdue = Boolean(nextStepAt) && compareDateKeys(toDateKey(nextStepAt, options), getCurrentDateKey(options)) < 0

  return {
    item: nextStepItem,
    itemId: nextStepItem?.id ?? null,
    itemType: nextStepItem?.type ?? null,
    title: nextStepItem?.title ?? "",
    at: nextStepAt,
    hasNextStep,
    isOverdue,
    daysUntil: resolveDaysUntilNextStep(nextStepAt, options),
  }
}

export function getLeadAlarmReasons(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
): LeadAlarmReason[] {
  if (!isActiveLead(lead)) return []

  const settings = resolveLeadStateSettings(snapshot.settings)
  const leadItems = getLeadItems(snapshot, lead.id)
  const lastTouch = getLeadLastTouch(snapshot, lead, options)
  const nextStep = getLeadNextStep(snapshot, lead, options)
  const daysSinceLastTouch = resolveDaysSinceLastTouch(lastTouch.at, lead.createdAt, options)
  const waitingCheckOverdue = lead.status === "waiting" && isWaitingCheckOverdue(leadItems, options)
  const isWaitingTooLong =
    lead.status === "waiting" &&
    (daysSinceLastTouch >= settings.waitingTooLongDays || waitingCheckOverdue)
  const isHighValueStale = lead.value >= settings.highValueThreshold && daysSinceLastTouch >= settings.staleLeadDays
  const isInactiveTooLong = daysSinceLastTouch >= settings.staleLeadDays
  const openActionsCount = getNextStepItems(leadItems).length
  const hasTooManyOpenActions = openActionsCount > settings.maxOpenActionsBeforeChaos
  const specificMissingFollowupReason = getSpecificMissingFollowupReason(lastTouch.item, nextStep.hasNextStep)

  const reasons: LeadAlarmReason[] = []

  if (nextStep.isOverdue) reasons.push("next_step_overdue")
  if (specificMissingFollowupReason) {
    reasons.push(specificMissingFollowupReason)
  } else if (!nextStep.hasNextStep) {
    reasons.push("missing_next_step")
  }
  if (isWaitingTooLong) reasons.push("waiting_too_long")
  if (isHighValueStale) reasons.push("high_value_stale")
  if (isInactiveTooLong) reasons.push("inactive_too_long")
  if (hasTooManyOpenActions) reasons.push("too_many_open_actions")

  return reasons
}

export function getLeadRiskState(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
): LeadRiskInfo {
  const alarmReasons = getLeadAlarmReasons(snapshot, lead, options)
  const state: LeadRiskState = alarmReasons.length > 0 ? "at_risk" : "ok"
  const primaryReason: LeadRiskReason = alarmReasons[0] ?? "none"
  const isWaitingTooLong = alarmReasons.includes("waiting_too_long")

  return {
    state,
    isAtRisk: state === "at_risk",
    primaryReason,
    reasons: alarmReasons,
    isWaitingTooLong,
  }
}

export function getLeadDailyPriority(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
) {
  if (!isActiveLead(lead)) return 0

  const settings = resolveLeadStateSettings(snapshot.settings)
  const nextStep = getLeadNextStep(snapshot, lead, options)
  const risk = getLeadRiskState(snapshot, lead, options)
  const lastTouch = getLeadLastTouch(snapshot, lead, options)
  const daysSinceLastTouch = resolveDaysSinceLastTouch(lastTouch.at, lead.createdAt, options)
  const openActionsCount = getNextStepItems(getLeadItems(snapshot, lead.id)).length

  let dailyPriorityScore = 0

  if (nextStep.isOverdue) dailyPriorityScore += 50
  if (!nextStep.hasNextStep) dailyPriorityScore += 40
  if (risk.isWaitingTooLong) dailyPriorityScore += 30
  if (nextStep.daysUntil === 0) dailyPriorityScore += 20
  if (lead.priority === "high") dailyPriorityScore += 15
  if (lead.value >= settings.highValueThreshold) dailyPriorityScore += 15
  dailyPriorityScore += Math.min(daysSinceLastTouch * 2, 20)
  if (openActionsCount > settings.maxOpenActionsBeforeChaos) dailyPriorityScore += 10

  return dailyPriorityScore
}

export function buildLeadComputedState(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
): LeadComputedState {
  const leadItems = getLeadItems(snapshot, lead.id)
  const nextStep = getLeadNextStep(snapshot, lead, options)
  const lastTouch = getLeadLastTouch(snapshot, lead, options)
  const risk = getLeadRiskState(snapshot, lead, options)
  const daysSinceLastTouch = resolveDaysSinceLastTouch(lastTouch.at, lead.createdAt, options)
  const openActionsCount = getNextStepItems(leadItems).length

  return {
    leadId: lead.id,
    hasNextStep: nextStep.hasNextStep,
    nextStepAt: nextStep.at,
    nextStepOverdue: nextStep.isOverdue,
    lastTouchAt: lastTouch.at,
    daysSinceLastTouch,
    daysUntilNextStep: nextStep.daysUntil,
    isWaitingTooLong: risk.isWaitingTooLong,
    isAtRisk: risk.isAtRisk,
    riskState: risk.state,
    riskReason: risk.primaryReason,
    alarmReasons: risk.reasons,
    dailyPriorityScore: getLeadDailyPriority(snapshot, lead, options),
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
