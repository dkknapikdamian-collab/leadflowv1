import type { AppSnapshot, Lead, WorkItem } from "./types"
import {
  getCurrentDateKey,
  getDateKeyDiff,
  getItemPrimaryDate,
  getTaskListItems,
  isCalendarVisibleItem,
  isMeetingLikeItem,
  isOverdue,
  isToday,
  toDateKey,
  formatDateKeyLong,
  type DateContextOptions,
} from "./utils"

export type TodaySectionKey = "all_leads" | "meetings" | "overdue" | "today" | "stale"
export type TodayTopStatKey = "all_leads" | "today" | "overdue" | "meetings" | "stale"

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
  leads: Lead[]
}

export type TodaySection = TodayItemsSection | TodayLeadsSection

export interface TodayViewModel {
  dateLabel: string
  isEmptyWorkspace: boolean
  sections: TodaySection[]
  topStats: TodayTopStat[]
}

export const TODAY_SECTION_ORDER: TodaySectionKey[] = ["meetings", "overdue", "today", "stale", "all_leads"]
export const TODAY_DEFAULT_COLLAPSED: Record<TodaySectionKey, boolean> = {
  all_leads: true,
  meetings: false,
  overdue: false,
  today: false,
  stale: false,
}

const TODAY_SECTION_META: Record<TodaySectionKey, { title: string; color: string; kind: TodaySection["kind"] }> = {
  all_leads: {
    title: "Wszystkie leady",
    color: "#f0ede8",
    kind: "leads",
  },
  meetings: {
    title: "Spotkania i rozmowy dziś",
    color: "#a78bfa",
    kind: "items",
  },
  overdue: {
    title: "Zaległe — wymagają działania",
    color: "#f87171",
    kind: "items",
  },
  today: {
    title: "Do zrobienia dziś",
    color: "#f59e0b",
    kind: "items",
  },
  stale: {
    title: "Bez kontaktu 5+ dni",
    color: "#6b7280",
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

export function getStaleLeads(snapshot: AppSnapshot, options: DateContextOptions = {}) {
  const dateOptions = getSnapshotDateOptions(snapshot, options)
  const currentDateKey = getCurrentDateKey(dateOptions)

  return snapshot.leads.filter((lead) => {
    if (lead.status === "won" || lead.status === "lost") return false
    const updatedDateKey = toDateKey(lead.updatedAt, dateOptions)
    if (!updatedDateKey) return false
    return getDateKeyDiff(currentDateKey, updatedDateKey) >= 5
  })
}

function getPendingItems(snapshot: AppSnapshot) {
  return snapshot.items.filter((item) => item.status !== "done")
}

function buildTodayTopStatsFromSections(snapshot: AppSnapshot, sections: TodaySection[]): TodayTopStat[] {
  const allLeadsCount = sections.find((section) => section.key === "all_leads")?.count ?? snapshot.leads.length
  const meetingCount = sections.find((section) => section.key === "meetings")?.count ?? 0
  const overdueCount = sections.find((section) => section.key === "overdue")?.count ?? 0
  const todayCount = sections.find((section) => section.key === "today")?.count ?? 0
  const staleCount = sections.find((section) => section.key === "stale")?.count ?? 0

  return [
    {
      key: "all_leads",
      label: "Wszystkie leady",
      value: allLeadsCount,
      color: TODAY_SECTION_META.all_leads.color,
    },
    {
      key: "today",
      label: "Zadania dziś",
      value: todayCount,
      color: TODAY_SECTION_META.today.color,
    },
    {
      key: "overdue",
      label: "Zaległe",
      value: overdueCount,
      color: TODAY_SECTION_META.overdue.color,
    },
    {
      key: "meetings",
      label: "Spotkania dziś",
      value: meetingCount,
      color: TODAY_SECTION_META.meetings.color,
    },
    {
      key: "stale",
      label: "Bez kontaktu",
      value: staleCount,
      color: TODAY_SECTION_META.stale.color,
    },
  ]
}

export function buildTodaySections(snapshot: AppSnapshot, options: DateContextOptions = {}): TodaySection[] {
  const dateOptions = getSnapshotDateOptions(snapshot, options)
  const pendingItems = getPendingItems(snapshot)
  const pendingTaskItems = getTaskListItems(pendingItems)
  const overdueItems = pendingTaskItems.filter((item) => isOverdue(item, dateOptions))
  const overdueIds = new Set(overdueItems.map((item) => item.id))

  const meetingItems = pendingItems.filter((item) => {
    const isTodayValue = isToday(getItemPrimaryDate(item), dateOptions)
    return isCalendarVisibleItem(item) && isTodayValue && isMeetingLikeItem(item) && !overdueIds.has(item.id)
  })
  const meetingIds = new Set(meetingItems.map((item) => item.id))

  const todayItems = pendingTaskItems.filter((item) => {
    return isToday(getItemPrimaryDate(item), dateOptions) && !overdueIds.has(item.id) && !meetingIds.has(item.id)
  })

  const staleLeads = getStaleLeads(snapshot, dateOptions)

  return [
    {
      key: "meetings",
      title: TODAY_SECTION_META.meetings.title,
      color: TODAY_SECTION_META.meetings.color,
      kind: "items",
      count: meetingItems.length,
      items: meetingItems,
    },
    {
      key: "overdue",
      title: TODAY_SECTION_META.overdue.title,
      color: TODAY_SECTION_META.overdue.color,
      kind: "items",
      count: overdueItems.length,
      items: overdueItems,
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
      key: "stale",
      title: TODAY_SECTION_META.stale.title,
      color: TODAY_SECTION_META.stale.color,
      kind: "leads",
      count: staleLeads.length,
      leads: staleLeads,
    },
    {
      key: "all_leads",
      title: TODAY_SECTION_META.all_leads.title,
      color: TODAY_SECTION_META.all_leads.color,
      kind: "leads",
      count: snapshot.leads.length,
      leads: snapshot.leads,
    },
  ]
}

export function buildTodayTopStats(snapshot: AppSnapshot, options: DateContextOptions = {}): TodayTopStat[] {
  const sections = buildTodaySections(snapshot, options)
  return buildTodayTopStatsFromSections(snapshot, sections)
}

export function buildTodayViewModel(snapshot: AppSnapshot, options: DateContextOptions = {}): TodayViewModel {
  const dateOptions = getSnapshotDateOptions(snapshot, options)
  const sections = buildTodaySections(snapshot, dateOptions)

  return {
    dateLabel: formatDateKeyLong(getCurrentDateKey(dateOptions)),
    isEmptyWorkspace: snapshot.leads.length === 0 && snapshot.items.length === 0,
    sections,
    topStats: buildTodayTopStatsFromSections(snapshot, sections),
  }
}

export function getSectionKeyFromTopStat(statKey: TodayTopStat["key"]): TodaySectionKey {
  if (statKey === "all_leads") return "all_leads"
  if (statKey === "meetings") return "meetings"
  if (statKey === "overdue") return "overdue"
  if (statKey === "today") return "today"
  return "stale"
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
