import type { AppSnapshot, Lead } from "../types"
import type { DateContextOptions } from "../utils"
import {
  buildLeadProcessSurfaceSummary,
  type LeadProcessStage,
  type LeadProcessSurfaceSummary,
} from "./lead-process-surface"

export type LeadOperatorMode = "sales" | "operations" | "closed"

export interface LeadProcessOperatorSummary extends LeadProcessSurfaceSummary {
  stageLabel: string
  operatorMode: LeadOperatorMode
  shouldSellNow: boolean
  shouldCreateCase: boolean
  shouldRunCase: boolean
  shouldTreatAsClosed: boolean
}

function getStageLabel(stage: LeadProcessStage) {
  switch (stage) {
    case "sales_attention":
      return "Sprzedaż wymaga ruchu"
    case "sales_scheduled":
      return "Sprzedaż zaplanowana"
    case "ready_for_operations":
      return "Gotowe do uruchomienia operacji"
    case "in_operations":
      return "W operacjach"
    case "closed":
      return "Proces zamknięty"
    default:
      return stage
  }
}

function getOperatorMode(stage: LeadProcessStage): LeadOperatorMode {
  if (stage === "closed") return "closed"
  if (stage === "ready_for_operations" || stage === "in_operations") return "operations"
  return "sales"
}

export function buildLeadProcessOperatorSummary(
  snapshot: AppSnapshot,
  lead: Lead,
  options: DateContextOptions = {},
): LeadProcessOperatorSummary {
  const surface = buildLeadProcessSurfaceSummary(snapshot, lead, options)
  const operatorMode = getOperatorMode(surface.stage)
  const shouldSellNow = operatorMode === "sales"
  const shouldCreateCase = surface.stage === "ready_for_operations" && !surface.hasCase
  const shouldRunCase =
    surface.stage === "in_operations" || (surface.stage === "ready_for_operations" && surface.hasCase)

  return {
    ...surface,
    stageLabel: getStageLabel(surface.stage),
    operatorMode,
    shouldSellNow,
    shouldCreateCase,
    shouldRunCase,
    shouldTreatAsClosed: surface.stage === "closed",
  }
}

export function buildLeadProcessOperatorSummaryMap(
  snapshot: AppSnapshot,
  options: DateContextOptions = {},
) {
  return Object.fromEntries(
    snapshot.leads.map((lead) => [lead.id, buildLeadProcessOperatorSummary(snapshot, lead, options)]),
  ) as Record<string, LeadProcessOperatorSummary>
}
