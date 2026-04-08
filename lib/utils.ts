import { ITEM_TYPE_OPTIONS, LEAD_STATUS_OPTIONS } from "./constants"
import type { AppSnapshot, Lead, Priority, WorkItem } from "./types"

export const STORAGE_KEY = "clientpilot-snapshot-v2"

export interface DateContextOptions {
  timeZone?: string | null
  now?: string | Date | null
}

export interface SnoozeDateContextOptions extends DateContextOptions {
  fallbackHour?: number
  fallbackMinute?: number
}

const DAY_MS = 86400000
const DATE_KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/

function getResolvedTimeZone(timeZone?: string | null) {
  return timeZone && timeZone !== "local" ? timeZone : undefined
}

function getNowDate(options: DateContextOptions = {}) {
  return asDate(options.now ?? new Date()) ?? new Date()
}

function getFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions,
  context: DateContextOptions = {},
) {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: getResolvedTimeZone(context.timeZone),
  })
}

function getDateParts(date: Date, options: DateContextOptions = {}) {
  const formatter = getFormatter(
    "en-CA",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
    options,
  )

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === "year")?.value ?? "0000"
  const month = parts.find((part) => part.type === "month")?.value ?? "01"
  const day = parts.find((part) => part.type === "day")?.value ?? "01"

  return { year, month, day }
}

function getDateTimeParts(date: Date, options: DateContextOptions = {}) {
  const formatter = getFormatter(
    "en-CA",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    },
    options,
  )

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === "year")?.value ?? "0000"
  const month = parts.find((part) => part.type === "month")?.value ?? "01"
  const day = parts.find((part) => part.type === "day")?.value ?? "01"
  const hour = parts.find((part) => part.type === "hour")?.value ?? "00"
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00"
  const second = parts.find((part) => part.type === "second")?.value ?? "00"

  return { year, month, day, hour, minute, second }
}

function asDate(input: string | Date | null | undefined) {
  if (!input) return null
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : new Date(input)
  }

  if (DATE_KEY_RE.test(input)) {
    return dateKeyToDate(input)
  }

  const parsed = new Date(input)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function dateKeyToUtcDate(dateKey: string) {
  const parts = getDateKeyParts(dateKey)
  if (!parts) return new Date(Number.NaN)
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12, 0, 0, 0))
}

function formatDateKeyFromUtc(
  dateKey: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  const date = dateKeyToUtcDate(dateKey)
  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: "UTC",
  }).format(date)
}

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function getDateKeyParts(dateKey: string) {
  const match = DATE_KEY_RE.exec(dateKey)
  if (!match) return null

  const [, year, month, day] = match
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  }
}

export function dateKeyToDate(dateKey: string) {
  const parts = getDateKeyParts(dateKey)
  if (!parts) return new Date(Number.NaN)
  return new Date(parts.year, parts.month - 1, parts.day, 0, 0, 0, 0)
}

export function toDateKey(input: string | Date | null | undefined, options: DateContextOptions = {}) {
  if (typeof input === "string" && DATE_KEY_RE.test(input)) {
    return input
  }

  const date = asDate(input)
  if (!date) return ""
  const { year, month, day } = getDateParts(date, options)
  return `${year}-${month}-${day}`
}

export function getCurrentDateKey(options: DateContextOptions = {}) {
  return toDateKey(getNowDate(options), options)
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const date = dateKeyToUtcDate(dateKey)
  if (Number.isNaN(date.getTime())) return ""

  date.setUTCDate(date.getUTCDate() + days)
  const year = String(date.getUTCFullYear()).padStart(4, "0")
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function compareDateKeys(left: string, right: string) {
  if (left === right) return 0
  return left < right ? -1 : 1
}

export function getDateKeyDiff(targetDateKey: string, baseDateKey: string) {
  const target = dateKeyToUtcDate(targetDateKey)
  const base = dateKeyToUtcDate(baseDateKey)
  if (Number.isNaN(target.getTime()) || Number.isNaN(base.getTime())) return 0
  return Math.round((target.getTime() - base.getTime()) / DAY_MS)
}

export function getMonthIndex(input: string | Date | null | undefined, options: DateContextOptions = {}) {
  const key = toDateKey(input, options)
  const parts = getDateKeyParts(key)
  return parts ? parts.month - 1 : -1
}

export function getDayOfMonth(input: string | Date | null | undefined, options: DateContextOptions = {}) {
  const key = toDateKey(input, options)
  return getDateKeyParts(key)?.day ?? 0
}

export function getWeekStartDateKey(anchor: string | Date = new Date(), options: DateContextOptions = {}) {
  const anchorKey = toDateKey(anchor, options)
  const anchorDate = dateKeyToUtcDate(anchorKey)
  if (Number.isNaN(anchorDate.getTime())) return ""

  const day = anchorDate.getUTCDay()
  const mondayShift = day === 0 ? -6 : 1 - day
  return addDaysToDateKey(anchorKey, mondayShift)
}

export function getWeekOffsetFromCurrent(anchor: string | Date, options: DateContextOptions = {}) {
  const targetWeekStart = getWeekStartDateKey(anchor, options)
  const currentWeekStart = getWeekStartDateKey(getCurrentDateKey(options), options)
  if (!targetWeekStart || !currentWeekStart) return 0
  return Math.round(getDateKeyDiff(targetWeekStart, currentWeekStart) / 7)
}

export function addDays(days: number) {
  return addDaysAt(days, 9, 0)
}

export function addDaysAt(days: number, hour: number, minute = 0) {
  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function addHours(hours: number) {
  const date = new Date()
  date.setMinutes(0, 0, 0)
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

function hasExplicitTime(input: string | Date | null | undefined) {
  return input instanceof Date || (typeof input === "string" && input.includes("T"))
}

function toLocalDateTimeIso(dateKey: string, hour: number, minute: number, options: DateContextOptions = {}) {
  const parts = getDateKeyParts(dateKey)
  if (!parts) return ""

  if (!getResolvedTimeZone(options.timeZone)) {
    return new Date(parts.year, parts.month - 1, parts.day, hour, minute, 0, 0).toISOString()
  }

  const targetUtcMs = Date.UTC(parts.year, parts.month - 1, parts.day, hour, minute, 0, 0)
  let guessMs = targetUtcMs

  for (let step = 0; step < 4; step += 1) {
    const zoned = getDateTimeParts(new Date(guessMs), options)
    const zonedUtcMs = Date.UTC(
      Number(zoned.year),
      Number(zoned.month) - 1,
      Number(zoned.day),
      Number(zoned.hour),
      Number(zoned.minute),
      0,
      0,
    )
    const diffMs = targetUtcMs - zonedUtcMs
    if (diffMs === 0) break
    guessMs += diffMs
  }

  return new Date(guessMs).toISOString()
}

export function getSnoozeBaseDateTime(dateLike: string | Date | null | undefined, options: DateContextOptions = {}) {
  const nowDate = getNowDate(options)
  const itemDate = asDate(dateLike)
  if (!itemDate) return nowDate.toISOString()
  return itemDate.getTime() > nowDate.getTime() ? itemDate.toISOString() : nowDate.toISOString()
}

export function getNextSnoozeByHours(
  dateLike: string | Date | null | undefined,
  hours: number,
  options: DateContextOptions = {},
) {
  const baseDate = asDate(getSnoozeBaseDateTime(dateLike, options)) ?? getNowDate(options)
  return new Date(baseDate.getTime() + hours * 60 * 60 * 1000).toISOString()
}

export function getNextDaySnoozeAtPreferredTime(
  dateLike: string | Date | null | undefined,
  options: SnoozeDateContextOptions = {},
) {
  const baseDate = asDate(getSnoozeBaseDateTime(dateLike, options)) ?? getNowDate(options)
  const nextDateKey = addDaysToDateKey(toDateKey(baseDate, options), 1)
  const fallbackHour = options.fallbackHour ?? 9
  const fallbackMinute = options.fallbackMinute ?? 0

  let hour = fallbackHour
  let minute = fallbackMinute

  if (hasExplicitTime(dateLike)) {
    const sourceDate = asDate(dateLike)
    if (sourceDate) {
      const parts = getDateTimeParts(sourceDate, options)
      hour = Number(parts.hour)
      minute = Number(parts.minute)
    }
  }

  return toLocalDateTimeIso(nextDateKey, hour, minute, options)
}

export function nowIso() {
  return new Date().toISOString()
}

// Instant values may be stored as ISO/UTC later, but form inputs always represent
// the user's local civil time. These helpers keep that round-trip stable.
export function toInputValue(input: string | null | undefined) {
  const date = asDate(input)
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day}T${hour}:${minute}`
}

export function fromInputValue(input: string | null | undefined) {
  if (!input) return ""
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(input)
  if (match) {
    const [, year, month, day, hour, minute] = match
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), 0, 0).toISOString()
  }

  const parsed = new Date(input)
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString()
}

export function getItemPrimaryDate(item: WorkItem) {
  return item.startAt || item.scheduledAt || item.createdAt
}

export function normalizeSearchValue(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
}

export function findLeadByText(value: string, leads: Lead[]) {
  const normalizedValue = normalizeSearchValue(value)
  if (!normalizedValue) return undefined

  return leads.find((lead) => normalizeSearchValue(lead.name) === normalizedValue)
}

export function getItemLeadLabel(item: WorkItem, leads: Lead[]) {
  if (!item.leadId) return ""

  const linkedLead = leads.find((lead) => lead.id === item.leadId)
  if (linkedLead) return linkedLead.name

  return item.leadLabel?.trim() ?? ""
}

export function isMeetingLikeItem(item: WorkItem) {
  return item.type === "meeting" || item.type === "call"
}

export function isCalendarVisibleItem(item: WorkItem) {
  return item.showInCalendar && Boolean(getItemPrimaryDate(item))
}

export function isTaskListVisibleItem(item: WorkItem) {
  if (!item.showInTasks) return false
  if (isMeetingLikeItem(item) && isCalendarVisibleItem(item)) return false
  return true
}

export function getCalendarItems(items: WorkItem[]) {
  return items.filter((item) => isCalendarVisibleItem(item))
}

export function getTaskListItems(items: WorkItem[]) {
  return items.filter((item) => isTaskListVisibleItem(item))
}

export function isDone(item: WorkItem) {
  return item.status === "done"
}

export function isOverdue(item: WorkItem, options: DateContextOptions = {}) {
  const value = getItemPrimaryDate(item)
  if (!value || item.status === "done") return false
  return compareDateKeys(toDateKey(value, options), getCurrentDateKey(options)) < 0
}

export function isToday(dateLike: string, options: DateContextOptions = {}) {
  return toDateKey(dateLike, options) === getCurrentDateKey(options)
}

export function isTomorrow(dateLike: string, options: DateContextOptions = {}) {
  return toDateKey(dateLike, options) === addDaysToDateKey(getCurrentDateKey(options), 1)
}

export function formatTime(dateLike: string, options: DateContextOptions = {}) {
  const date = asDate(dateLike)
  if (!date) return ""
  return getFormatter(
    "pl-PL",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
    options,
  ).format(date)
}

export function getRelativeDayLabel(dateLike: string, options: DateContextOptions = {}) {
  const key = toDateKey(dateLike, options)
  if (!key) return "—"

  const diff = getDateKeyDiff(key, getCurrentDateKey(options))

  if (diff === 0) return "dziś"
  if (diff === -1) return "wczoraj"
  if (diff === 1) return "jutro"
  if (diff < -1) return `${Math.abs(diff)} dni temu`
  return formatDateKey(key)
}

export function formatRelativeDateTimeShort(dateLike: string, options: DateContextOptions = {}) {
  if (!dateLike) return "—"
  const relative = getRelativeDayLabel(dateLike, options)
  const time = formatTime(dateLike, options)
  return time ? `${relative} ${time}` : relative
}

export function formatDayLabel(dateLike: string, options: DateContextOptions = {}) {
  return getRelativeDayLabel(dateLike, options)
}

export function formatDateKeyWithLocale(
  dateKey: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  return formatDateKeyFromUtc(dateKey, locale, options)
}

export function formatDateKey(dateKey: string, _options: DateContextOptions = {}) {
  return formatDateKeyWithLocale(dateKey, "pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatDateKeyWeekday(
  dateKey: string,
  options: { locale?: string; weekday?: "long" | "short" | "narrow" } = {},
) {
  return formatDateKeyWithLocale(dateKey, options.locale ?? "pl-PL", {
    weekday: options.weekday ?? "short",
  })
}

export function formatDateKeyMonthDay(
  dateKey: string,
  options: { locale?: string; withYear?: boolean; numericMonth?: boolean; day?: "2-digit" | "numeric" } = {},
) {
  return formatDateKeyWithLocale(dateKey, options.locale ?? "pl-PL", {
    day: options.day ?? "numeric",
    month: options.numericMonth ? "2-digit" : "short",
    ...(options.withYear ? { year: "numeric" } : {}),
  })
}

export function formatDateKeyLong(dateKey: string, options: { locale?: string } = {}) {
  return capitalizeFirst(
    formatDateKeyWithLocale(dateKey, options.locale ?? "pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  )
}

export function formatWeekRangeLabel(week: string[], options: { locale?: string } = {}) {
  if (week.length === 0) return "—"

  const first = week[0] ?? ""
  const last = week[week.length - 1] ?? ""
  if (!first || !last) return "—"

  const locale = options.locale ?? "pl-PL"
  const startLabel = formatDateKeyMonthDay(first, { locale, day: "numeric" })
  const endLabel = formatDateKeyMonthDay(last, { locale, day: "numeric", withYear: true })
  return `${startLabel} – ${endLabel}`
}

export function formatDateTime(dateLike: string, options: DateContextOptions = {}) {
  const date = asDate(dateLike)
  if (!date) return "—"
  return getFormatter(
    "pl-PL",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
    options,
  ).format(date)
}

export function capitalizeFirst(value: string) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatLongDate(dateLike: string, options: DateContextOptions = {}) {
  const date = asDate(dateLike)
  if (!date) return "—"
  return capitalizeFirst(
    getFormatter(
      "pl-PL",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
      options,
    ).format(date),
  )
}

export function formatMoney(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0
  return `${safeValue.toLocaleString("pl-PL")} zł`
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function getStatusLabel(status: Lead["status"]) {
  return LEAD_STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status
}

export function getItemTypeMeta(type: WorkItem["type"]) {
  return ITEM_TYPE_OPTIONS.find((item) => item.value === type) ?? ITEM_TYPE_OPTIONS[0]
}

export function getPriorityLabel(priority: Priority) {
  switch (priority) {
    case "high":
      return "Wysoki"
    case "medium":
      return "Średni"
    default:
      return "Niski"
  }
}

export function getLeadActiveItemStats(leadId: string, items: WorkItem[], options: DateContextOptions = {}) {
  const activeItems = items.filter((item) => item.leadId === leadId && item.status !== "done")
  return {
    activeCount: activeItems.length,
    overdueCount: activeItems.filter((item) => isOverdue(item, options)).length,
  }
}

export function getWeekDays(offset = 0, anchor: string | Date = new Date(), options: DateContextOptions = {}) {
  const mondayKey = addDaysToDateKey(getWeekStartDateKey(anchor, options), offset * 7)

  return Array.from({ length: 7 }, (_, index) => addDaysToDateKey(mondayKey, index))
}

export function getMonthGrid(base: string | Date = new Date(), options: DateContextOptions = {}) {
  const baseKey = toDateKey(base, options)
  const parts = getDateKeyParts(baseKey)
  if (!parts) return []

  const firstKey = `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-01`
  const firstDate = dateKeyToUtcDate(firstKey)
  const lastDay = new Date(Date.UTC(parts.year, parts.month, 0, 12, 0, 0, 0)).getUTCDate()
  const startOffset = (firstDate.getUTCDay() + 6) % 7
  const total = Math.ceil((startOffset + lastDay) / 7) * 7
  const gridStartKey = addDaysToDateKey(firstKey, -startOffset)

  return Array.from({ length: total }, (_, index) => addDaysToDateKey(gridStartKey, index))
}

export function cloneSnapshot(snapshot: AppSnapshot): AppSnapshot {
  return JSON.parse(JSON.stringify(snapshot)) as AppSnapshot
}

