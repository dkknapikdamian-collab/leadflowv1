import type { AppSnapshot, Lead } from "../types"
import type { DateContextOptions } from "../utils"
import { formatLeadAlarmReasonLabel, getLeadLastTouch, getLeadNextStep } from "./lead-state"
import { buildLeadProcessOperatorSummary } from "./lead-process-operator-summary"

export interface LeadDrawerViewModel {
  process: ReturnType<typeof buildLeadProcessOperatorSummary>
  lastTouchAt: string | null
  lastTouchLabel: string
  nextStepTitle: string
  nextStepAt: string | null
  nextStepLabel: string
  riskLabel: string
  openItemsCount: number
  overdueItemsCount: number
  timelineCount: number
  canStartOperations: boolean
  operationalStatus: string
}

function getOperationalStatus(snapshot: AppSnapshot, lead: Lead) {
  const relatedCase = snapshot.cases?.find((entry) => entry.id === lead.caseId) ?? null
  return relatedCase?.status ?? "not_started"
}

export function buildLeadDrawerViewModel(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
): LeadDrawerViewModel {
  const process = buildLeadProcessOperatorSummary(snapshot, lead, options)
  const nextStep = getLeadNextStep(snapshot, lead, options)
  const lastTouch = getLeadLastTouch(snapshot, lead, options)
  const relatedItems = snapshot.items.filter((item) => item.leadId === lead.id)
  const openItems = relatedItems.filter((item) => item.status !== "done" && item.recordType !== "note")
  const overdueItemsCount = openItems.filter((item) => {
    const primaryDate = item.startAt || item.scheduledAt || item.endAt || ""
    return Boolean(primaryDate) && primaryDate < (options.now ?? new Date().toISOString())
  }).length
  const operationalStatus = getOperationalStatus(snapshot, lead)
  const canStartOperations = process.shouldCreateCase || process.shouldRunCase

  return {
    process,
    lastTouchAt: lastTouch.at,
    lastTouchLabel: lastTouch.at ?? "Brak historii kontaktu",
    nextStepTitle: nextStep.title || process.nextMoveLabel,
    nextStepAt: nextStep.at,
    nextStepLabel: nextStep.title || process.nextMoveLabel,
    riskLabel: formatLeadAlarmReasonLabel(process.riskReason) || "Lead pod kontrolą",
    openItemsCount: openItems.length,
    overdueItemsCount,
    timelineCount: relatedItems.length,
    canStartOperations,
    operationalStatus,
  }
}
