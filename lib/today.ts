import type { AppSnapshot, WorkItem } from "./types"
import {
  buildLeadsWithComputedState,
  DEFAULT_LEAD_STATE_SETTINGS,
  type LeadWithComputedState,
} from "./domain/lead-state"
import { buildCasesDashboard, type CaseDashboardCard } from "./domain/cases-dashboard"
import {
  getCurrentDateKey,
  getWeekDays,
  isCalendarVisibleItem,
  isOverdue,
  isToday,
  toDateKey,
  formatDateKeyLong,
  getItemPrimaryDate,
  type DateContextOptions,
} from "./utils"

export type TodaySectionKey =
  | "overdue"
  | "missing_next_step"
  | "waiting_too_long"
  | "today"
  | "this_week"
  | "high_value_at_risk"
  | "stale"
  | "top_moves_today"

export type TodayTopStatKey =
  | "overdue"
  | "missing_next_step"
  | "waiting_too_long"
  | "today"
  | "high_value_at_risk"

export interface TodayTopStat {
  key: TodayTopStatKey
  label: string
  value: number
  color: string
}

export interface TodayItemsSection {
  key: TodaySectionKey
  title: string
  color: string
  kind: "items"
  count: number
  items: WorkItem[]
}

export interface TodayLeadsSection {
  key: TodaySectionKey
  title: string
  color: string
  kind: "leads"
  count: number
  leads: LeadWithComputedState[]
}

export type TodaySection = TodayItemsSection | TodayLeadsSection

export interface TodayViewModel {
  dateLabel: string
  isEmptyWorkspace: boolean
  sections: TodaySection[]
  topStats: TodayTopStat[]
  commandCenter: TodayCommandCenter
}

export type TodayCommandTopStatKey =
  | "leads_to_move_today"
  | "cases_waiting_for_client"
  | "cases_blocked"
  | "cases_ready_to_start"

export interface TodayCommandTopStat {
  key: TodayCommandTopStatKey
  label: string
  value: number
  color: string
}

export interface TodayCommandCenter {
  topStats: TodayCommandTopStat[]
  sections: {
    salesRequiresAction: LeadWithComputedState[]
    realizationBlockedByClient: CaseDashboardCard[]
    readyToStart: CaseDashboardCard[]
    executionQueue: {
      overdueItems: WorkItem[]
      todayItems: WorkItem[]
      thisWeekItems: WorkItem[]
      leadsWithoutNextStep: LeadWithComputedState[]
    }
  }
}

export const TODAY_SECTION_ORDER: TodaySectionKey[] = [
  "overdue",
  "missing_next_step",
  "waiting_too_long",
  "today",
  "this_week",
  "high_value_at_risk",
  "stale",
  "top_moves_today",
]

export const TODAY_DEFAULT_COLLAPSED: Record<TodaySectionKey, boolean> = {
  overdue: false,
  missing_next_step: false,
  waiting_too_long: false,
  today: false,
  this_week: false,
  high_value_at_risk: false,
  stale: false,
  top_moves_today: false,
}

const TODAY_SECTION_META: Record<TodaySectionKey, { title: string; color: string; kind: TodaySection["kind"] }> = {
  overdue: {
    title: "Zaległe",
    color: "#f87171",
    kind: "items",
  },
  missing_next_step: {
    title: "Bez next step",
    color: "#fb7185",
    kind: "leads",
  },
  waiting_too_long: {
    title: "Bez odpowiedzi za dlugo",
    color: "#f97316",
    kind: "leads",
  },
  today: {
    title: "Dziś",
    color: "#f59e0b",
    kind: "items",
  },
  this_week: {
    title: "Ten tydzień",
    color: "#38bdf8",
    kind: "items",
  },
  high_value_at_risk: {
    title: "High value at risk",
    color: "#facc15",
    kind: "leads",
  },
  stale: {
    title: "Zaniedbane leady",
    color: "#6b7280",
    kind: "leads",
  },
  top_moves_today: {
    title: "Najważniejsze ruchy dziś",
    color: "#4ade80",
    kind: "leads",
  },
}

export function getTodaySectionMeta(key: TodaySectionKey) {
  return TODAY_SECTION_META[key]
}

function getSnapshotDateOptions(snapshot: AppSnapshot, options: DateContextOptions = {}): DateContextOptions {
  return {
    timeZone: snapshot.settings.timezone,
    ...options,
  }
}

function isTodayVisibleActionItem(item: WorkItem) {
  return item.recordType !== "note" && item.type !== "note" && (item.showInTasks || isCalendarVisibleItem(item))
}

function getPendingActionItems(snapshot: AppSnapshot) {
  return snapshot.items.filter((item) => item.status !== "done").filter(isTodayVisibleActionItem)
}

export function getStaleLeads(snapshot: AppSnapshot, options: DateContextOptions = {}) {
  const dateOptions = getSnapshotDateOptions(snapshot, options)
  const staleDays = DEFAULT_LEAD_STATE_SETTINGS.staleLeadDays
  const leadsWithComputed = buildLeadsWithComputedState(snapshot, dateOptions)

  return leadsWithComputed
    .filter((lead) => lead.status !== "won" && lead.status !== "lost")
    .filter((lead) => lead.computed.daysSinceLastTouch >= staleDays)
}

function getLeadPrimarySection(lead: LeadWithComputedState): TodaySectionKey | null {
  if (lead.status === "won" || lead.status === "lost") return null

  if (
    lead.computed.alarmReasons.some(
      (reason) =>
        reason === "missing_next_step" || reason === "no_followup_after_meeting" || reason === "no_followup_after_proposal",
    )
  ) {
    return "missing_next_step"
  }

  if (lead.computed.isWaitingTooLong) {
    return "waiting_too_long"
  }

  if (lead.value >= DEFAULT_LEAD_STATE_SETTINGS.highValueThreshold && lead.computed.isAtRisk) {
    return "high_value_at_risk"
  }

  if (lead.computed.daysSinceLastTouch >= DEFAULT_LEAD_STATE_SETTINGS.staleLeadDays) {
    return "stale"
  }

  return null
}

function buildTodayTopStatsFromSections(sections: TodaySection[]): TodayTopStat[] {
  const getCount = (key: TodaySectionKey) => sections.find((section) => section.key === key)?.count ?? 0

  return [
    {
      key: "overdue",
      label: "Zaległe",
      value: getCount("overdue"),
      color: TODAY_SECTION_META.overdue.color,
    },
    {
      key: "missing_next_step",
      label: "Bez next step",
      value: getCount("missing_next_step"),
      color: TODAY_SECTION_META.missing_next_step.color,
    },
    {
      key: "waiting_too_long",
      label: "Bez odpowiedzi",
      value: getCount("waiting_too_long"),
      color: TODAY_SECTION_META.waiting_too_long.color,
    },
    {
      key: "today",
      label: "Dziś",
      value: getCount("today"),
      color: TODAY_SECTION_META.today.color,
    },
    {
      key: "high_value_at_risk",
      label: "High value at risk",
      value: getCount("high_value_at_risk"),
      color: TODAY_SECTION_META.high_value_at_risk.color,
    },
  ]
}

function buildTodayCommandCenter(snapshot: AppSnapshot, options: DateContextOptions): TodayCommandCenter {
  const leadsWithComputed = buildLeadsWithComputedState(snapshot, options)
  const pendingActionItems = getPendingActionItems(snapshot)
  const dashboard = buildCasesDashboard(snapshot, options)

  const salesRequiresAction = leadsWithComputed
    .filter((lead) => lead.status !== "won" && lead.status !== "lost")
    .filter((lead) => lead.computed.dailyPriorityScore > 0 || lead.computed.alarmReasons.length > 0)
    .sort((left, right) => {
      return (
        right.computed.dailyPriorityScore - left.computed.dailyPriorityScore
        || right.value - left.value
        || left.name.localeCompare(right.name)
      )
    })

  const realizationBlockedByClient = dashboard.cards
    .filter((card) => card.status === "waiting_for_client" || card.status === "blocked")
    .sort((left, right) => {
      return (
        Number(right.status === "blocked") - Number(left.status === "blocked")
        || right.missingElementsCount - left.missingElementsCount
        || right.daysStuck - left.daysStuck
      )
    })

  const readyToStart = dashboard.cards
    .filter((card) => card.status === "ready_to_start")
    .sort((left, right) => {
      return right.completenessPercent - left.completenessPercent || left.title.localeCompare(right.title)
    })

  const overdueItems = pendingActionItems.filter((item) => isOverdue(item, options))
  const overdueIds = new Set(overdueItems.map((item) => item.id))
  const todayItems = pendingActionItems.filter((item) => !overdueIds.has(item.id) && isToday(getItemPrimaryDate(item), options))
  const todayIds = new Set(todayItems.map((item) => item.id))
  const currentDateKey = getCurrentDateKey(options)
  const weekKeys = new Set(getWeekDays(0, currentDateKey, options))
  const thisWeekItems = pendingActionItems.filter((item) => {
    const itemDateKey = toDateKey(getItemPrimaryDate(item), options)
    if (!itemDateKey) return false
    if (overdueIds.has(item.id) || todayIds.has(item.id)) return false
    return weekKeys.has(itemDateKey)
  })
  const leadsWithoutNextStep = leadsWithComputed
    .filter((lead) => lead.status !== "won" && lead.status !== "lost")
    .filter((lead) => !lead.computed.hasNextStep)
    .sort((left, right) => {
      return right.value - left.value || left.name.localeCompare(right.name)
    })

  return {
    topStats: [
      {
        key: "leads_to_move_today",
        label: "Leady do ruchu dzis",
        value: salesRequiresAction.length,
        color: "#f59e0b",
      },
      {
        key: "cases_waiting_for_client",
        label: "Sprawy czekajace na klienta",
        value: dashboard.stats.waitingForClient,
        color: "#fb923c",
      },
      {
        key: "cases_blocked",
        label: "Sprawy zablokowane",
        value: dashboard.stats.blocked,
        color: "#ef4444",
      },
      {
        key: "cases_ready_to_start",
        label: "Sprawy gotowe do startu",
        value: dashboard.stats.readyToStart,
        color: "#22c55e",
      },
    ],
    sections: {
      salesRequiresAction,
      realizationBlockedByClient,
      readyToStart,
      executionQueue: {
        overdueItems,
        todayItems,
        thisWeekItems,
        leadsWithoutNextStep,
      },
    },
  }
}

export function buildTodaySections(snapshot: AppSnapshot, options: DateContextOptions = {}): TodaySection[] {
  const dateOptions = getSnapshotDateOptions(snapshot, options)
  const leadsWithComputed = buildLeadsWithComputedState(snapshot, dateOptions)
  const pendingActionItems = getPendingActionItems(snapshot)
  const overdueItems = pendingActionItems.filter((item) => isOverdue(item, dateOptions))
  const overdueIds = new Set(overdueItems.map((item) => item.id))

  const todayItems = pendingActionItems.filter((item) => {
    return !overdueIds.has(item.id) && isToday(getItemPrimaryDate(item), dateOptions)
  })
  const todayIds = new Set(todayItems.map((item) => item.id))

  const currentDateKey = getCurrentDateKey(dateOptions)
  const weekKeys = new Set(getWeekDays(0, currentDateKey, dateOptions))
  const thisWeekItems = pendingActionItems.filter((item) => {
    const itemDateKey = toDateKey(getItemPrimaryDate(item), dateOptions)
    if (!itemDateKey) return false
    if (overdueIds.has(item.id)) return false
    if (todayIds.has(item.id)) return false
    return weekKeys.has(itemDateKey)
  })

  const leadBuckets: Record<Exclude<TodaySectionKey, "overdue" | "today" | "this_week" | "top_moves_today">, LeadWithComputedState[]> = {
    missing_next_step: [],
    waiting_too_long: [],
    high_value_at_risk: [],
    stale: [],
  }

  for (const lead of leadsWithComputed) {
    const primarySection = getLeadPrimarySection(lead)
    if (!primarySection || primarySection === "overdue" || primarySection === "today" || primarySection === "this_week" || primarySection === "top_moves_today") {
      continue
    }
    leadBuckets[primarySection].push(lead)
  }

  const topMovesTodayLeads = leadsWithComputed
    .filter((lead) => lead.status !== "won" && lead.status !== "lost")
    .filter((lead) => lead.computed.dailyPriorityScore > 0)
    .sort((left, right) => {
      return (
        right.computed.dailyPriorityScore - left.computed.dailyPriorityScore ||
        right.value - left.value ||
        left.name.localeCompare(right.name)
      )
    })
    .slice(0, 5)

  return [
    {
      key: "overdue",
      title: TODAY_SECTION_META.overdue.title,
      color: TODAY_SECTION_META.overdue.color,
      kind: "items",
      count: overdueItems.length,
      items: overdueItems,
    },
    {
      key: "missing_next_step",
      title: TODAY_SECTION_META.missing_next_step.title,
      color: TODAY_SECTION_META.missing_next_step.color,
      kind: "leads",
      count: leadBuckets.missing_next_step.length,
      leads: leadBuckets.missing_next_step,
    },
    {
      key: "waiting_too_long",
      title: TODAY_SECTION_META.waiting_too_long.title,
      color: TODAY_SECTION_META.waiting_too_long.color,
      kind: "leads",
      count: leadBuckets.waiting_too_long.length,
      leads: leadBuckets.waiting_too_long,
    },
    {
      key: "today",
      title: TODAY_SECTION_META.today.title,
      color: TODAY_SECTION_META.today.color,
      kind: "items",
      count: todayItems.length,
      items: todayItems,
    },
    {
      key: "this_week",
      title: TODAY_SECTION_META.this_week.title,
      color: TODAY_SECTION_META.this_week.color,
      kind: "items",
      count: thisWeekItems.length,
      items: thisWeekItems,
    },
    {
      key: "high_value_at_risk",
      title: TODAY_SECTION_META.high_value_at_risk.title,
      color: TODAY_SECTION_META.high_value_at_risk.color,
      kind: "leads",
      count: leadBuckets.high_value_at_risk.length,
      leads: leadBuckets.high_value_at_risk,
    },
    {
      key: "stale",
      title: TODAY_SECTION_META.stale.title,
      color: TODAY_SECTION_META.stale.color,
      kind: "leads",
      count: leadBuckets.stale.length,
      leads: leadBuckets.stale,
    },
    {
      key: "top_moves_today",
      title: TODAY_SECTION_META.top_moves_today.title,
      color: TODAY_SECTION_META.top_moves_today.color,
      kind: "leads",
      count: topMovesTodayLeads.length,
      leads: topMovesTodayLeads,
    },
  ]
}

export function buildTodayTopStats(snapshot: AppSnapshot, options: DateContextOptions = {}): TodayTopStat[] {
  const sections = buildTodaySections(snapshot, options)
  return buildTodayTopStatsFromSections(sections)
}

export function buildTodayViewModel(snapshot: AppSnapshot, options: DateContextOptions = {}): TodayViewModel {
  const dateOptions = getSnapshotDateOptions(snapshot, options)
  const sections = buildTodaySections(snapshot, dateOptions)

  return {
    dateLabel: formatDateKeyLong(getCurrentDateKey(dateOptions)),
    isEmptyWorkspace: snapshot.leads.length === 0 && snapshot.items.length === 0,
    sections,
    topStats: buildTodayTopStatsFromSections(sections),
    commandCenter: buildTodayCommandCenter(snapshot, dateOptions),
  }
}

export function getSectionKeyFromTopStat(statKey: TodayTopStat["key"]): TodaySectionKey {
  if (statKey === "overdue") return "overdue"
  if (statKey === "missing_next_step") return "missing_next_step"
  if (statKey === "waiting_too_long") return "waiting_too_long"
  if (statKey === "today") return "today"
  return "high_value_at_risk"
}

export function moveSectionToTop(order: TodaySectionKey[], target: TodaySectionKey) {
  return [target, ...order.filter((item) => item !== target)]
}

export function getEffectiveCollapsed(
  manualCollapsed: Record<TodaySectionKey, boolean>,
  transientExpandedKey: TodaySectionKey | null,
  key: TodaySectionKey,
) {
  if (transientExpandedKey === key) return false
  return manualCollapsed[key]
}

export function getNextManualCollapsedState(
  manualCollapsed: Record<TodaySectionKey, boolean>,
  transientExpandedKey: TodaySectionKey | null,
  key: TodaySectionKey,
) {
  const currentlyCollapsed = getEffectiveCollapsed(manualCollapsed, transientExpandedKey, key)
  return {
    ...manualCollapsed,
    [key]: !currentlyCollapsed,
  }
}

