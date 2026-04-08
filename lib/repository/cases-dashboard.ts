import type { AppSnapshot, CaseOperationalStatus, Lead, WorkItem } from "../types"
import { getItemPrimaryDate, toDateKey } from "../utils"

export type CaseListFilter = "all" | "waiting_for_client" | "blocked" | "ready_to_start" | "overdue"

export interface CaseListRow {
  id: string
  leadId: string
  caseName: string
  client: string
  typeLabel: string
  salesStatus: Lead["status"]
  operationalStatus: CaseOperationalStatus
  completenessPercent: number
  missingItems: number
  dueAt: string
  lastActivityAt: string
  stalledDays: number
  reminderSent: boolean
  nextMove: string
  requiresMoveToday: boolean
  overdue: boolean
}

export interface CasesDashboardModel {
  all: CaseListRow[]
  filtered: CaseListRow[]
  requiresMoveToday: CaseListRow[]
  stats: {
    active: number
    waitingForClient: number
    blocked: number
    readyToStart: number
  }
}

function resolveTypeLabel(lead: Lead) {
  const notes = (lead.notes || "").toLowerCase()
  if (notes.includes("szablon")) return "z szablonu"
  return "pusta"
}

function resolveOperationalStatus(lead: Lead, relatedItems: WorkItem[]): CaseOperationalStatus {
  const notes = (lead.notes || "").toLowerCase()
  if (notes.includes("[op_status:blocked]")) return "blocked"
  if (notes.includes("[op_status:waiting_for_client]")) return "waiting_for_client"
  if (notes.includes("[op_status:ready_to_start]")) return "ready_to_start"
  if (notes.includes("[op_status:in_progress]")) return "in_progress"

  if (relatedItems.length === 0) return "not_started"

  const activeItems = relatedItems.filter((item) => item.status !== "done")
  if (activeItems.length === 0) return "ready_to_start"

  const requiredPending = activeItems.filter((item) => item.priority === "high")

  const hasOverdue = activeItems.some((item) => toDateKey(getItemPrimaryDate(item)) < toDateKey(new Date()))
  if (hasOverdue && requiredPending.length > 0) return "blocked"
  if (hasOverdue) return "blocked"

  const waitingClient = activeItems.some((item) => {
    const text = `${item.title} ${item.description}`.toLowerCase()
    return text.includes("klient") || text.includes("material")
  })
  if (waitingClient) return "waiting_for_client"

  if (requiredPending.length > 0) return "blocked"

  if (lead.status === "ready_to_start") return "ready_to_start"
  return "in_progress"
}

function resolveDueAt(lead: Lead, relatedItems: WorkItem[]) {
  const pendingDates = relatedItems
    .filter((item) => item.status !== "done")
    .map((item) => getItemPrimaryDate(item))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))

  return pendingDates[0] ?? lead.nextActionAt ?? lead.updatedAt
}

function resolveLastActivityAt(lead: Lead, relatedItems: WorkItem[]) {
  const stamps = [lead.updatedAt, ...relatedItems.map((item) => item.updatedAt)].filter(Boolean).sort((a, b) => b.localeCompare(a))
  return stamps[0] ?? lead.updatedAt
}

function daysStalled(lastActivityAt: string) {
  const oneDayMs = 24 * 60 * 60 * 1000
  const now = new Date()
  const then = new Date(lastActivityAt)
  if (Number.isNaN(then.getTime())) return 0
  return Math.max(0, Math.floor((now.getTime() - then.getTime()) / oneDayMs))
}

function buildCaseRow(lead: Lead, relatedItems: WorkItem[]): CaseListRow {
  const doneCount = relatedItems.filter((item) => item.status === "done").length
  const totalChecklist = Math.max(4, relatedItems.length)
  const completenessPercent = Math.min(100, Math.round((doneCount / totalChecklist) * 100))
  const missingItems = Math.max(0, totalChecklist - doneCount)
  const dueAt = resolveDueAt(lead, relatedItems)
  const lastActivityAt = resolveLastActivityAt(lead, relatedItems)
  const stalledDays = daysStalled(lastActivityAt)
  const operationalStatus = resolveOperationalStatus(lead, relatedItems)
  const overdue = Boolean(dueAt) && toDateKey(dueAt) < toDateKey(new Date()) && operationalStatus !== "closed"
  const reminderSent = relatedItems.some((item) => item.reminder !== "none")
  const nextMove = lead.nextActionTitle || relatedItems.find((item) => item.status !== "done")?.title || "Brak kolejnego ruchu"
  const requiresMoveToday =
    overdue || operationalStatus === "blocked" || operationalStatus === "waiting_for_client" || stalledDays >= 3

  return {
    id: lead.caseId ?? lead.id,
    leadId: lead.id,
    caseName: lead.company ? `${lead.company} - realizacja` : `${lead.name} - realizacja`,
    client: lead.name,
    typeLabel: resolveTypeLabel(lead),
    salesStatus: lead.status,
    operationalStatus,
    completenessPercent,
    missingItems,
    dueAt,
    lastActivityAt,
    stalledDays,
    reminderSent,
    nextMove,
    requiresMoveToday,
    overdue,
  }
}

function filterRows(rows: CaseListRow[], filter: CaseListFilter) {
  if (filter === "all") return rows
  if (filter === "overdue") return rows.filter((row) => row.overdue)
  return rows.filter((row) => row.operationalStatus === filter)
}

export function buildCasesDashboard(snapshot: AppSnapshot, filter: CaseListFilter): CasesDashboardModel {
  const workspaceId = snapshot.context.workspaceId
  const all = snapshot.leads
    .filter((lead) => Boolean(lead.caseId))
    .filter((lead) => !workspaceId || lead.workspaceId === workspaceId)
    .map((lead) => {
      const relatedItems = snapshot.items.filter(
        (item) =>
          item.leadId === lead.id &&
          (!workspaceId || item.workspaceId === workspaceId),
      )
      return buildCaseRow(lead, relatedItems)
    })
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))

  const filtered = filterRows(all, filter)
  const requiresMoveToday = all.filter((row) => row.requiresMoveToday)
  const stats = {
    active: all.filter((row) => row.operationalStatus !== "closed").length,
    waitingForClient: all.filter((row) => row.operationalStatus === "waiting_for_client").length,
    blocked: all.filter((row) => row.operationalStatus === "blocked").length,
    readyToStart: all.filter((row) => row.operationalStatus === "ready_to_start").length,
  }

  return { all, filtered, requiresMoveToday, stats }
}
