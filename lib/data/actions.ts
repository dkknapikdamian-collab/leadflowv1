import {
  addCaseTemplateSnapshot,
  addApprovalSnapshot,
  addFileAttachmentSnapshot,
  addNotificationSnapshot,
  addItemSnapshot,
  addLeadSnapshot,
  deleteCaseTemplateSnapshot,
  deleteItemSnapshot,
  deleteLeadSnapshot,
  duplicateCaseTemplateSnapshot,
  issueClientPortalTokenSnapshot,
  registerPortalOpenedSnapshot,
  registerPortalTokenFailureSnapshot,
  revokeClientPortalTokenSnapshot,
  setDefaultCaseTemplateSnapshot,
  snoozeItemSnapshot,
  toggleItemDoneSnapshot,
  updateCaseTemplateSnapshot,
  updateItemSnapshot,
  updateLeadSnapshot,
  updateSettingsSnapshot,
  type CaseTemplateInput,
} from "../snapshot"
import type { AppSnapshot, LeadInput, SettingsPatch, WorkItemInput, Lead, RequestStatus, WorkItem } from "../types"

export type AppDataAction =
  | { type: "addLead"; payload: LeadInput }
  | { type: "updateLead"; leadId: string; patch: Partial<Lead> }
  | { type: "deleteLead"; leadId: string }
  | { type: "addItem"; payload: WorkItemInput }
  | { type: "updateItem"; itemId: string; patch: Partial<WorkItem> }
  | { type: "deleteItem"; itemId: string }
  | { type: "toggleItemDone"; itemId: string }
  | { type: "snoozeItem"; itemId: string; nextDate: string }
  | { type: "updateSettings"; patch: SettingsPatch }
  | { type: "addCaseTemplate"; payload: CaseTemplateInput }
  | { type: "updateCaseTemplate"; templateId: string; payload: CaseTemplateInput }
  | { type: "deleteCaseTemplate"; templateId: string }
  | { type: "duplicateCaseTemplate"; templateId: string }
  | { type: "setDefaultCaseTemplate"; templateId: string }
  | { type: "issueClientPortalToken"; payload: { caseId: string; tokenHash: string; expiresAt: string } }
  | { type: "revokeClientPortalToken"; tokenId: string; reason?: string }
  | { type: "registerPortalOpened"; tokenId: string }
  | { type: "registerPortalTokenFailure"; tokenHash: string }
  | {
      type: "addFileAttachment"
      payload: {
        caseId: string
        caseItemId?: string | null
        fileName: string
        mimeType: string
        fileSizeBytes: number
        storagePath?: string
        uploadedByRole?: "client" | "operator" | "system"
        uploadedByLabel?: string
      }
    }
  | {
      type: "addApproval"
      payload: {
        caseId: string
        caseItemId?: string | null
        requestedToEmail: string
        status: RequestStatus
        decision?: "accepted" | "rejected" | "needs_changes" | "option_a" | "option_b" | "option_c" | "submitted" | "answered"
        optionValue?: string
        actorRole?: "client" | "operator" | "system"
        actorLabel?: string
        note: string
        decidedAt?: string
      }
    }
  | {
      type: "addNotification"
      payload: {
        userId: string
        channel: "in_app" | "email"
        kind?: string
        dedupeKey?: string
        title: string
        message: string
        relatedLeadId?: string | null
        relatedCaseId?: string | null
        recipient?: string
      }
    }

function canApplyActionInCurrentAccessMode(snapshot: AppSnapshot, action: AppDataAction) {
  if (snapshot.billing.canCreate) return true
  return (
    action.type === "updateSettings" ||
    action.type === "registerPortalOpened" ||
    action.type === "registerPortalTokenFailure"
  )
}

export function applyAppDataAction(snapshot: AppSnapshot, action: AppDataAction): AppSnapshot {
  if (!canApplyActionInCurrentAccessMode(snapshot, action)) {
    return snapshot
  }

  switch (action.type) {
    case "addLead":
      return addLeadSnapshot(snapshot, action.payload)
    case "updateLead":
      return updateLeadSnapshot(snapshot, action.leadId, action.patch)
    case "deleteLead":
      return deleteLeadSnapshot(snapshot, action.leadId)
    case "addItem":
      return addItemSnapshot(snapshot, action.payload)
    case "updateItem":
      return updateItemSnapshot(snapshot, action.itemId, action.patch)
    case "deleteItem":
      return deleteItemSnapshot(snapshot, action.itemId)
    case "toggleItemDone":
      return toggleItemDoneSnapshot(snapshot, action.itemId)
    case "snoozeItem":
      return snoozeItemSnapshot(snapshot, action.itemId, action.nextDate)
    case "updateSettings":
      return updateSettingsSnapshot(snapshot, action.patch)
    case "addCaseTemplate":
      return addCaseTemplateSnapshot(snapshot, action.payload)
    case "updateCaseTemplate":
      return updateCaseTemplateSnapshot(snapshot, action.templateId, action.payload)
    case "deleteCaseTemplate":
      return deleteCaseTemplateSnapshot(snapshot, action.templateId)
    case "duplicateCaseTemplate":
      return duplicateCaseTemplateSnapshot(snapshot, action.templateId)
    case "setDefaultCaseTemplate":
      return setDefaultCaseTemplateSnapshot(snapshot, action.templateId)
    case "issueClientPortalToken":
      return issueClientPortalTokenSnapshot(snapshot, action.payload)
    case "revokeClientPortalToken":
      return revokeClientPortalTokenSnapshot(snapshot, action.tokenId, action.reason)
    case "registerPortalOpened":
      return registerPortalOpenedSnapshot(snapshot, action.tokenId)
    case "registerPortalTokenFailure":
      return registerPortalTokenFailureSnapshot(snapshot, action.tokenHash)
    case "addFileAttachment":
      return addFileAttachmentSnapshot(snapshot, action.payload)
    case "addApproval":
      return addApprovalSnapshot(snapshot, action.payload)
    case "addNotification":
      return addNotificationSnapshot(snapshot, action.payload)
    default:
      return snapshot
  }
}
