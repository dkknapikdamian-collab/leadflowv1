import type { AppSnapshot, CaseStatus, WorkItem } from "../types"
import { getItemLeadLabel } from "../utils"
import {
  buildLeadProcessSurfaceSummary,
  buildLeadProcessSurfaceSummaryMap,
  type LeadProcessStage,
} from "./lead-process-surface"

export interface TaskCalendarProcessSurface {
  itemId: string
  leadId: string | null
  leadLabel: string
  hasLinkedLead: boolean
  processStage: LeadProcessStage | null
  processStageLabel: string
  nextMoveLabel: string
  canStartOperations: boolean
  caseId: string | null
  operationalStatus: CaseStatus | null
}

function getProcessStageLabel(stage: LeadProcessStage | null) {
  switch (stage) {
    case "sales_attention":
      return "Sprzedaż wymaga ruchu"
    case "sales_scheduled":
      return "Sprzedaż ustawiona"
    case "ready_for_operations":
      return "Gotowy do operacji"
    case "in_operations":
      return "W operacjach"
    case "closed":
      return "Zamknięty"
    default:
      return "Bez procesu"
  }
}

export function buildTaskCalendarProcessSurface(
  snapshot: AppSnapshot,
  item: WorkItem,
): TaskCalendarProcessSurface {
  const lead = item.leadId ? snapshot.leads.find((entry) => entry.id === item.leadId) ?? null : null
  if (!lead) {
    return {
      itemId: item.id,
      leadId: null,
      leadLabel: getItemLeadLabel(item, snapshot.leads) || "Bez leada",
      hasLinkedLead: false,
      processStage: null,
      processStageLabel: "Bez procesu",
      nextMoveLabel: "Brak powiązanego leada",
      canStartOperations: false,
      caseId: null,
      operationalStatus: null,
    }
  }

  const summary = buildLeadProcessSurfaceSummary(snapshot, lead)
  return {
    itemId: item.id,
    leadId: lead.id,
    leadLabel: lead.name,
    hasLinkedLead: true,
    processStage: summary.stage,
    processStageLabel: getProcessStageLabel(summary.stage),
    nextMoveLabel: summary.nextMoveLabel,
    canStartOperations: summary.canStartOperations,
    caseId: summary.caseId,
    operationalStatus: summary.operationalStatus,
  }
}

export function buildTaskCalendarProcessSurfaceMap(snapshot: AppSnapshot) {
  const leadSurfaceMap = buildLeadProcessSurfaceSummaryMap(snapshot)
  return Object.fromEntries(
    snapshot.items.map((item) => {
      const lead = item.leadId ? snapshot.leads.find((entry) => entry.id === item.leadId) ?? null : null
      if (!lead) {
        return [
          item.id,
          {
            itemId: item.id,
            leadId: null,
            leadLabel: getItemLeadLabel(item, snapshot.leads) || "Bez leada",
            hasLinkedLead: false,
            processStage: null,
            processStageLabel: "Bez procesu",
            nextMoveLabel: "Brak powiązanego leada",
            canStartOperations: false,
            caseId: null,
            operationalStatus: null,
          } satisfies TaskCalendarProcessSurface,
        ]
      }

      const summary = leadSurfaceMap[lead.id]
      return [
        item.id,
        {
          itemId: item.id,
          leadId: lead.id,
          leadLabel: lead.name,
          hasLinkedLead: true,
          processStage: summary.stage,
          processStageLabel: getProcessStageLabel(summary.stage),
          nextMoveLabel: summary.nextMoveLabel,
          canStartOperations: summary.canStartOperations,
          caseId: summary.caseId,
          operationalStatus: summary.operationalStatus,
        } satisfies TaskCalendarProcessSurface,
      ]
    }),
  ) as Record<string, TaskCalendarProcessSurface>
}
