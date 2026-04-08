import { CASE_OPERATIONAL_STATUS_OPTIONS } from "../constants"
import type { AppSnapshot, Approval, Case, CaseItem, CaseStatus, Contact } from "../types"
import { getCurrentDateKey, getDateKeyDiff, toDateKey, type DateContextOptions } from "../utils"

export type CaseFilterKey = "all" | "waiting_for_client" | "blocked" | "ready_to_start" | "overdue"

export interface CaseDashboardStats {
  active: number
  waitingForClient: number
  blocked: number
  readyToStart: number
}

export interface CaseDashboardCard {
  id: string
  title: string
  clientName: string
  typeLabel: string
  status: CaseStatus
  statusLabel: string
  completenessPercent: number
  missingElementsCount: number
  dueAt: string | null
  isOverdue: boolean
  lastActivityAt: string
  daysStuck: number
  reminderSent: boolean
  nextMove: string
  needsActionToday: boolean
}

export interface CasesDashboardViewModel {
  stats: CaseDashboardStats
  cards: CaseDashboardCard[]
  needsActionToday: CaseDashboardCard[]
}

const DONE_CASE_ITEM_STATUSES = new Set<CaseItem["status"]>(["accepted", "not_applicable"])
const ACTIVE_CASE_STATUSES = new Set<CaseStatus>([
  "not_started",
  "collecting_materials",
  "waiting_for_client",
  "under_review",
  "ready_to_start",
  "in_progress",
  "blocked",
])

function getStatusLabel(status: CaseStatus) {
  return CASE_OPERATIONAL_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status
}

function getTemplateTypeLabel(snapshot: AppSnapshot, caseRecord: Case) {
  if (!caseRecord.templateId) return "Pusta sprawa"
  const template = snapshot.caseTemplates?.find((item) => item.id === caseRecord.templateId)
  if (!template) return "Sprawa z szablonu"
  return template.title || template.code || "Sprawa z szablonu"
}

function getClientName(contacts: Contact[], caseRecord: Case) {
  return contacts.find((contact) => contact.id === caseRecord.contactId)?.name || "Brak klienta"
}

function getCaseItems(caseItems: CaseItem[], caseId: string) {
  return caseItems.filter((item) => item.caseId === caseId).sort((left, right) => left.sortOrder - right.sortOrder)
}

function getCompleteness(items: CaseItem[]) {
  if (items.length === 0) return { completenessPercent: 0, missingElementsCount: 0 }
  const doneCount = items.filter((item) => DONE_CASE_ITEM_STATUSES.has(item.status)).length
  const requiredMissing = items.filter((item) => item.required && !DONE_CASE_ITEM_STATUSES.has(item.status)).length
  return {
    completenessPercent: Math.round((doneCount / items.length) * 100),
    missingElementsCount: requiredMissing,
  }
}

function getLastActivityAt(snapshot: AppSnapshot, caseRecord: Case) {
  const candidateFromLog =
    snapshot.activityLog
      ?.filter((entry) => entry.caseId === caseRecord.id)
      .map((entry) => entry.createdAt)
      .sort((left, right) => right.localeCompare(left))[0] ?? ""
  return candidateFromLog || caseRecord.updatedAt || caseRecord.createdAt
}

function getReminderSent(caseRecord: Case, items: CaseItem[], approvals: Approval[]) {
  const itemIdSet = new Set(items.map((item) => item.id))
  return approvals.some((approval) => {
    if (approval.status !== "reminder_sent") return false
    if (approval.caseId === caseRecord.id) return true
    return Boolean(approval.caseItemId && itemIdSet.has(approval.caseItemId))
  })
}

function getNextMove(caseRecord: Case, items: CaseItem[], dueAt: string | null, isOverdue: boolean, currentDateKey: string, options: DateContextOptions) {
  const nextPending = items.find((item) => !DONE_CASE_ITEM_STATUSES.has(item.status))
  if (nextPending) return `Uzupełnij: ${nextPending.title}`
  if (caseRecord.status === "waiting_for_client") return "Przypomnij klientowi"
  if (caseRecord.status === "blocked") return "Odblokuj sprawę"
  if (!dueAt) return "Kontynuuj realizację"
  const dueKey = toDateKey(dueAt, options)
  if (dueKey === currentDateKey) return "Domknij etap dziś"
  if (isOverdue) return "Domknij etap po terminie"
  return "Kontynuuj realizację"
}

function isCaseOverdue(caseRecord: Case, options: DateContextOptions) {
  if (!caseRecord.dueAt || caseRecord.status === "closed") return false
  return getDateKeyDiff(toDateKey(caseRecord.dueAt, options), getCurrentDateKey(options)) < 0
}

function isCaseNeedingActionToday(card: CaseDashboardCard, currentDateKey: string, options: DateContextOptions) {
  if (card.status === "waiting_for_client" || card.status === "blocked") return true
  if (card.isOverdue) return true
  if (card.daysStuck >= 3 && card.status !== "closed") return true
  if (card.missingElementsCount > 0 && (card.status === "ready_to_start" || card.status === "collecting_materials")) return true
  const dueKey = card.dueAt ? toDateKey(card.dueAt, options) : ""
  return Boolean(dueKey && dueKey === currentDateKey)
}

export function buildCasesDashboard(snapshot: AppSnapshot, options: DateContextOptions = {}): CasesDashboardViewModel {
  const dateOptions = {
    timeZone: snapshot.settings.timezone,
    ...options,
  }

  const contacts = snapshot.contacts ?? []
  const cases = snapshot.cases ?? []
  const caseItems = snapshot.caseItems ?? []
  const approvals = snapshot.approvals ?? []
  const currentDateKey = getCurrentDateKey(dateOptions)

  const cards = cases.map((caseRecord) => {
    const items = getCaseItems(caseItems, caseRecord.id)
    const { completenessPercent, missingElementsCount } = getCompleteness(items)
    const lastActivityAt = getLastActivityAt(snapshot, caseRecord)
    const daysStuck = Math.max(0, getDateKeyDiff(currentDateKey, toDateKey(lastActivityAt, dateOptions)))
    const isOverdue = isCaseOverdue(caseRecord, dateOptions)
    const reminderSent = getReminderSent(caseRecord, items, approvals)
    const nextMove = getNextMove(caseRecord, items, caseRecord.dueAt, isOverdue, currentDateKey, dateOptions)

    const card: CaseDashboardCard = {
      id: caseRecord.id,
      title: caseRecord.title,
      clientName: getClientName(contacts, caseRecord),
      typeLabel: getTemplateTypeLabel(snapshot, caseRecord),
      status: caseRecord.status,
      statusLabel: getStatusLabel(caseRecord.status),
      completenessPercent,
      missingElementsCount,
      dueAt: caseRecord.dueAt,
      isOverdue,
      lastActivityAt,
      daysStuck,
      reminderSent,
      nextMove,
      needsActionToday: false,
    }

    return {
      ...card,
      needsActionToday: isCaseNeedingActionToday(card, currentDateKey, dateOptions),
    }
  })

  cards.sort((left, right) => {
    return (
      Number(right.needsActionToday) - Number(left.needsActionToday) ||
      Number(right.isOverdue) - Number(left.isOverdue) ||
      right.daysStuck - left.daysStuck ||
      right.title.localeCompare(left.title, "pl")
    )
  })

  return {
    stats: {
      active: cards.filter((card) => ACTIVE_CASE_STATUSES.has(card.status)).length,
      waitingForClient: cards.filter((card) => card.status === "waiting_for_client").length,
      blocked: cards.filter((card) => card.status === "blocked").length,
      readyToStart: cards.filter((card) => card.status === "ready_to_start").length,
    },
    cards,
    needsActionToday: cards.filter((card) => card.needsActionToday),
  }
}

export function filterCaseCards(cards: CaseDashboardCard[], filter: CaseFilterKey) {
  switch (filter) {
    case "waiting_for_client":
      return cards.filter((card) => card.status === "waiting_for_client")
    case "blocked":
      return cards.filter((card) => card.status === "blocked")
    case "ready_to_start":
      return cards.filter((card) => card.status === "ready_to_start")
    case "overdue":
      return cards.filter((card) => card.isOverdue)
    default:
      return cards
  }
}
