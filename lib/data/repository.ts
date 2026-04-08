import { applyAppDataAction, type AppDataAction } from "./actions"
import { createSnapshotStorageAdapter, type SnapshotStorageAdapter } from "./storage-adapter"
import type { AppSnapshot, Lead, LeadInput, RequestStatus, SettingsPatch, WorkItem, WorkItemInput } from "../types"
import type { CaseTemplateInput } from "../snapshot"

export interface AppDataRepository {
  createEmptySnapshot(): AppSnapshot
  loadSnapshot(): AppSnapshot
  commit(snapshot: AppSnapshot, action: AppDataAction): AppSnapshot
  addLead(snapshot: AppSnapshot, payload: LeadInput): AppSnapshot
  updateLead(snapshot: AppSnapshot, leadId: string, patch: Partial<Lead>): AppSnapshot
  deleteLead(snapshot: AppSnapshot, leadId: string): AppSnapshot
  addItem(snapshot: AppSnapshot, payload: WorkItemInput): AppSnapshot
  updateItem(snapshot: AppSnapshot, itemId: string, patch: Partial<WorkItem>): AppSnapshot
  deleteItem(snapshot: AppSnapshot, itemId: string): AppSnapshot
  toggleItemDone(snapshot: AppSnapshot, itemId: string): AppSnapshot
  snoozeItem(snapshot: AppSnapshot, itemId: string, nextDate: string): AppSnapshot
  updateSettings(snapshot: AppSnapshot, patch: SettingsPatch): AppSnapshot
  addCaseTemplate(snapshot: AppSnapshot, payload: CaseTemplateInput): AppSnapshot
  updateCaseTemplate(snapshot: AppSnapshot, templateId: string, payload: CaseTemplateInput): AppSnapshot
  deleteCaseTemplate(snapshot: AppSnapshot, templateId: string): AppSnapshot
  duplicateCaseTemplate(snapshot: AppSnapshot, templateId: string): AppSnapshot
  setDefaultCaseTemplate(snapshot: AppSnapshot, templateId: string): AppSnapshot
  issueClientPortalToken(snapshot: AppSnapshot, payload: { caseId: string; tokenHash: string; expiresAt: string }): AppSnapshot
  revokeClientPortalToken(snapshot: AppSnapshot, tokenId: string, reason?: string): AppSnapshot
  registerPortalOpened(snapshot: AppSnapshot, tokenId: string): AppSnapshot
  registerPortalTokenFailure(snapshot: AppSnapshot, tokenHash: string): AppSnapshot
  addFileAttachment(
    snapshot: AppSnapshot,
    payload: {
      caseId: string
      caseItemId?: string | null
      fileName: string
      mimeType: string
      fileSizeBytes: number
      storagePath?: string
      uploadedByRole?: "client" | "operator" | "system"
      uploadedByLabel?: string
    },
  ): AppSnapshot
  addApproval(
    snapshot: AppSnapshot,
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
    },
  ): AppSnapshot
  addNotification(
    snapshot: AppSnapshot,
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
    },
  ): AppSnapshot
}

export function createAppDataRepository(adapter: SnapshotStorageAdapter = createSnapshotStorageAdapter()): AppDataRepository {
  function commit(snapshot: AppSnapshot, action: AppDataAction) {
    const nextSnapshot = applyAppDataAction(snapshot, action)
    adapter.saveSnapshot(nextSnapshot)
    return nextSnapshot
  }

  return {
    createEmptySnapshot() {
      return adapter.createEmptySnapshot()
    },
    loadSnapshot() {
      return adapter.loadSnapshot()
    },
    commit,
    addLead(snapshot, payload) {
      return commit(snapshot, { type: "addLead", payload })
    },
    updateLead(snapshot, leadId, patch) {
      return commit(snapshot, { type: "updateLead", leadId, patch })
    },
    deleteLead(snapshot, leadId) {
      return commit(snapshot, { type: "deleteLead", leadId })
    },
    addItem(snapshot, payload) {
      return commit(snapshot, { type: "addItem", payload })
    },
    updateItem(snapshot, itemId, patch) {
      return commit(snapshot, { type: "updateItem", itemId, patch })
    },
    deleteItem(snapshot, itemId) {
      return commit(snapshot, { type: "deleteItem", itemId })
    },
    toggleItemDone(snapshot, itemId) {
      return commit(snapshot, { type: "toggleItemDone", itemId })
    },
    snoozeItem(snapshot, itemId, nextDate) {
      return commit(snapshot, { type: "snoozeItem", itemId, nextDate })
    },
    updateSettings(snapshot, patch) {
      return commit(snapshot, { type: "updateSettings", patch })
    },
    addCaseTemplate(snapshot, payload) {
      return commit(snapshot, { type: "addCaseTemplate", payload })
    },
    updateCaseTemplate(snapshot, templateId, payload) {
      return commit(snapshot, { type: "updateCaseTemplate", templateId, payload })
    },
    deleteCaseTemplate(snapshot, templateId) {
      return commit(snapshot, { type: "deleteCaseTemplate", templateId })
    },
    duplicateCaseTemplate(snapshot, templateId) {
      return commit(snapshot, { type: "duplicateCaseTemplate", templateId })
    },
    setDefaultCaseTemplate(snapshot, templateId) {
      return commit(snapshot, { type: "setDefaultCaseTemplate", templateId })
    },
    issueClientPortalToken(snapshot, payload) {
      return commit(snapshot, { type: "issueClientPortalToken", payload })
    },
    revokeClientPortalToken(snapshot, tokenId, reason) {
      return commit(snapshot, { type: "revokeClientPortalToken", tokenId, reason })
    },
    registerPortalOpened(snapshot, tokenId) {
      return commit(snapshot, { type: "registerPortalOpened", tokenId })
    },
    registerPortalTokenFailure(snapshot, tokenHash) {
      return commit(snapshot, { type: "registerPortalTokenFailure", tokenHash })
    },
    addFileAttachment(snapshot, payload) {
      return commit(snapshot, { type: "addFileAttachment", payload })
    },
    addApproval(snapshot, payload) {
      return commit(snapshot, { type: "addApproval", payload })
    },
    addNotification(snapshot, payload) {
      return commit(snapshot, { type: "addNotification", payload })
    },
  }
}
