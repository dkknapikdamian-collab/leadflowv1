import type { AppSnapshot, WorkItem } from "../types"
import type { DateContextOptions } from "../utils"
import { formatLeadAlarmReasonLabel } from "./lead-state"
import { buildLeadProcessOperatorSummary } from "./lead-process-operator-summary"

export interface WorkItemProcessContext {
  hasLead: boolean
  leadId: string | null
  leadName: string
  operatorMode: "sales" | "operations" | "closed" | "none"
  stage: string | null
  stageLabel: string
  nextMoveLabel: string
  riskLabel: string
  operationalStatus: string | null
  shouldCreateCase: boolean
  shouldRunCase: boolean
  shouldTreatAsClosed: boolean
}

export function buildWorkItemProcessContext(snapshot: AppSnapshot, item: WorkItem, options: DateContextOptions = {}): WorkItemProcessContext {
  const lead = item.leadId ? snapshot.leads.find((entry) => entry.id === item.leadId) : undefined

  if (!lead) {
    return {
      hasLead: false,
      leadId: null,
      leadName: item.leadLabel || "Bez leada",
      operatorMode: "none",
      stage: null,
      stageLabel: "Bez procesu",
      nextMoveLabel: "Brak powiązanego leada",
      riskLabel: "Brak powiązanego leada",
      operationalStatus: null,
      shouldCreateCase: false,
      shouldRunCase: false,
      shouldTreatAsClosed: false,
    }
  }

  const process = buildLeadProcessOperatorSummary(snapshot, lead, options)
  const relatedCase = snapshot.cases?.find((entry) => entry.id === lead.caseId)

  return {
    hasLead: true,
    leadId: lead.id,
    leadName: lead.name,
    operatorMode: process.operatorMode,
    stage: process.stage,
    stageLabel: process.stageLabel,
    nextMoveLabel: process.nextMoveLabel,
    riskLabel: formatLeadAlarmReasonLabel(process.riskReason) || "Lead pod kontrolą",
    operationalStatus: relatedCase?.status ?? null,
    shouldCreateCase: process.shouldCreateCase,
    shouldRunCase: process.shouldRunCase,
    shouldTreatAsClosed: process.shouldTreatAsClosed,
  }
}
