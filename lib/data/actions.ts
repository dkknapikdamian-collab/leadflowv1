import {
  addItemSnapshot,
  addLeadSnapshot,
  addCaseTemplateSnapshot,
  addTemplateItemSnapshot,
  appendCaseActivitySnapshot,
  deleteTemplateItemSnapshot,
  deleteItemSnapshot,
  deleteLeadSnapshot,
  duplicateCaseTemplateSnapshot,
  issueClientPortalLinkSnapshot,
  revokeClientPortalTokenSnapshot,
  setDefaultCaseTemplateSnapshot,
  snoozeItemSnapshot,
  startCaseFromLeadSnapshot,
  updateCaseItemSnapshot,
  updateCaseSnapshot,
  updateCaseTemplateSnapshot,
  updateTemplateItemSnapshot,
  updateItemSnapshot,
  updateLeadSnapshot,
  updateSettingsSnapshot,
} from "../snapshot"
import { resolveSnapshotAccessPolicy } from "../access/policy"
import type {
  ActivityType,
  AppSnapshot,
  Case,
  CaseItem,
  CaseTemplate,
  CaseTemplateServiceType,
  LeadInput,
  SettingsPatch,
  TemplateItem,
  WorkItemInput,
  Lead,
  WorkItem,
} from "../types"

export type AppDataAction =
  | { type: "addLead"; payload: LeadInput }
  | { type: "updateLead"; leadId: string; patch: Partial<Lead> }
  | { type: "deleteLead"; leadId: string }
  | { type: "startCaseFromLead"; leadId: string; mode: "empty" | "template" | "template_with_link"; templateId?: string | null }
  | { type: "issueClientPortalLink"; leadId: string }
  | { type: "revokeClientPortalToken"; caseId: string }
  | { type: "addItem"; payload: WorkItemInput }
  | { type: "updateItem"; itemId: string; patch: Partial<WorkItem> }
  | { type: "deleteItem"; itemId: string }
  | { type: "toggleItemDone"; itemId: string }
  | { type: "snoozeItem"; itemId: string; nextDate: string }
  | { type: "addCaseTemplate"; payload: { title: string; description: string; serviceType: CaseTemplateServiceType } }
  | { type: "updateCaseTemplate"; templateId: string; patch: Partial<CaseTemplate> }
  | { type: "duplicateCaseTemplate"; templateId: string }
  | { type: "setDefaultCaseTemplate"; templateId: string }
  | { type: "addTemplateItem"; payload: { templateId: string; title: string; description: string; kind: TemplateItem["kind"]; required: boolean } }
  | { type: "updateTemplateItem"; templateItemId: string; patch: Partial<TemplateItem> }
  | { type: "deleteTemplateItem"; templateItemId: string }
  | { type: "updateCase"; caseId: string; patch: Partial<Case> }
  | { type: "updateCaseItem"; caseItemId: string; patch: Partial<CaseItem> }
  | {
      type: "appendCaseActivity"
      caseId: string
      activityType: ActivityType
      source?: "sales" | "operations" | "system"
      payload?: Record<string, unknown>
      caseItemId?: string | null
    }
  | { type: "updateSettings"; patch: SettingsPatch }

export function applyAppDataAction(snapshot: AppSnapshot, action: AppDataAction): AppSnapshot {
  const accessPolicy = resolveSnapshotAccessPolicy(snapshot)
  const canMutateData = accessPolicy.canWork

  if (action.type !== "updateSettings" && !canMutateData) {
    return snapshot
  }

  switch (action.type) {
    case "addLead":
      return addLeadSnapshot(snapshot, action.payload)
    case "updateLead":
      return updateLeadSnapshot(snapshot, action.leadId, action.patch)
    case "deleteLead":
      return deleteLeadSnapshot(snapshot, action.leadId)
    case "startCaseFromLead":
      return startCaseFromLeadSnapshot(snapshot, {
        leadId: action.leadId,
        mode: action.mode,
        templateId: action.templateId,
      })
    case "issueClientPortalLink":
      return issueClientPortalLinkSnapshot(snapshot, action.leadId)
    case "revokeClientPortalToken":
      return revokeClientPortalTokenSnapshot(snapshot, action.caseId)
    case "addItem":
      return addItemSnapshot(snapshot, action.payload)
    case "updateItem":
      return updateItemSnapshot(snapshot, action.itemId, action.patch)
    case "deleteItem":
      return deleteItemSnapshot(snapshot, action.itemId)
    case "toggleItemDone": {
      const currentItem = snapshot.items.find((item) => item.id === action.itemId)
      if (!currentItem) return snapshot

      const nextStatus = currentItem.status === "done" ? "todo" : "done"
      return updateItemSnapshot(snapshot, action.itemId, {
        status: nextStatus,
        showInTasks: nextStatus === "done" ? false : currentItem.recordType !== "event",
      })
    }
    case "snoozeItem":
      return snoozeItemSnapshot(snapshot, action.itemId, action.nextDate)
    case "addCaseTemplate":
      return addCaseTemplateSnapshot(snapshot, action.payload)
    case "updateCaseTemplate":
      return updateCaseTemplateSnapshot(snapshot, action.templateId, action.patch)
    case "duplicateCaseTemplate":
      return duplicateCaseTemplateSnapshot(snapshot, action.templateId)
    case "setDefaultCaseTemplate":
      return setDefaultCaseTemplateSnapshot(snapshot, action.templateId)
    case "addTemplateItem":
      return addTemplateItemSnapshot(snapshot, action.payload)
    case "updateTemplateItem":
      return updateTemplateItemSnapshot(snapshot, action.templateItemId, action.patch)
    case "deleteTemplateItem":
      return deleteTemplateItemSnapshot(snapshot, action.templateItemId)
    case "updateCase":
      return updateCaseSnapshot(snapshot, action.caseId, action.patch)
    case "updateCaseItem":
      return updateCaseItemSnapshot(snapshot, action.caseItemId, action.patch)
    case "appendCaseActivity":
      return appendCaseActivitySnapshot(snapshot, {
        caseId: action.caseId,
        type: action.activityType,
        source: action.source,
        payload: action.payload,
        caseItemId: action.caseItemId,
      })
    case "updateSettings":
      return updateSettingsSnapshot(snapshot, action.patch)
    default:
      return snapshot
  }
}
