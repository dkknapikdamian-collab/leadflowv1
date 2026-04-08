import { applyAppDataAction, type AppDataAction } from "./actions"
import { createSnapshotStorageAdapter, type SnapshotStorageAdapter } from "./storage-adapter"
import type {
  ActivityType,
  AppSnapshot,
  Case,
  CaseItem,
  CaseTemplate,
  CaseTemplateServiceType,
  Lead,
  LeadInput,
  SettingsPatch,
  TemplateItem,
  WorkItem,
  WorkItemInput,
} from "../types"

export interface AppDataRepository {
  createEmptySnapshot(): AppSnapshot
  loadSnapshot(): AppSnapshot
  commit(snapshot: AppSnapshot, action: AppDataAction): AppSnapshot
  addLead(snapshot: AppSnapshot, payload: LeadInput): AppSnapshot
  updateLead(snapshot: AppSnapshot, leadId: string, patch: Partial<Lead>): AppSnapshot
  deleteLead(snapshot: AppSnapshot, leadId: string): AppSnapshot
  startCaseFromLead(
    snapshot: AppSnapshot,
    leadId: string,
    mode: "empty" | "template" | "template_with_link",
    templateId?: string | null,
  ): AppSnapshot
  issueClientPortalLink(snapshot: AppSnapshot, leadId: string): AppSnapshot
  revokeClientPortalToken(snapshot: AppSnapshot, caseId: string): AppSnapshot
  addItem(snapshot: AppSnapshot, payload: WorkItemInput): AppSnapshot
  updateItem(snapshot: AppSnapshot, itemId: string, patch: Partial<WorkItem>): AppSnapshot
  deleteItem(snapshot: AppSnapshot, itemId: string): AppSnapshot
  toggleItemDone(snapshot: AppSnapshot, itemId: string): AppSnapshot
  snoozeItem(snapshot: AppSnapshot, itemId: string, nextDate: string): AppSnapshot
  addCaseTemplate(
    snapshot: AppSnapshot,
    payload: { title: string; description: string; serviceType: CaseTemplateServiceType },
  ): AppSnapshot
  updateCaseTemplate(snapshot: AppSnapshot, templateId: string, patch: Partial<CaseTemplate>): AppSnapshot
  duplicateCaseTemplate(snapshot: AppSnapshot, templateId: string): AppSnapshot
  setDefaultCaseTemplate(snapshot: AppSnapshot, templateId: string): AppSnapshot
  addTemplateItem(
    snapshot: AppSnapshot,
    payload: { templateId: string; title: string; description: string; kind: TemplateItem["kind"]; required: boolean },
  ): AppSnapshot
  updateTemplateItem(snapshot: AppSnapshot, templateItemId: string, patch: Partial<TemplateItem>): AppSnapshot
  deleteTemplateItem(snapshot: AppSnapshot, templateItemId: string): AppSnapshot
  updateCase(snapshot: AppSnapshot, caseId: string, patch: Partial<Case>): AppSnapshot
  updateCaseItem(snapshot: AppSnapshot, caseItemId: string, patch: Partial<CaseItem>): AppSnapshot
  appendCaseActivity(
    snapshot: AppSnapshot,
    caseId: string,
    activityType: ActivityType,
    source?: "sales" | "operations" | "system",
    payload?: Record<string, unknown>,
    caseItemId?: string | null,
  ): AppSnapshot
  updateSettings(snapshot: AppSnapshot, patch: SettingsPatch): AppSnapshot
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
    startCaseFromLead(snapshot, leadId, mode, templateId) {
      return commit(snapshot, { type: "startCaseFromLead", leadId, mode, templateId })
    },
    issueClientPortalLink(snapshot, leadId) {
      return commit(snapshot, { type: "issueClientPortalLink", leadId })
    },
    revokeClientPortalToken(snapshot, caseId) {
      return commit(snapshot, { type: "revokeClientPortalToken", caseId })
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
    addCaseTemplate(snapshot, payload) {
      return commit(snapshot, { type: "addCaseTemplate", payload })
    },
    updateCaseTemplate(snapshot, templateId, patch) {
      return commit(snapshot, { type: "updateCaseTemplate", templateId, patch })
    },
    duplicateCaseTemplate(snapshot, templateId) {
      return commit(snapshot, { type: "duplicateCaseTemplate", templateId })
    },
    setDefaultCaseTemplate(snapshot, templateId) {
      return commit(snapshot, { type: "setDefaultCaseTemplate", templateId })
    },
    addTemplateItem(snapshot, payload) {
      return commit(snapshot, { type: "addTemplateItem", payload })
    },
    updateTemplateItem(snapshot, templateItemId, patch) {
      return commit(snapshot, { type: "updateTemplateItem", templateItemId, patch })
    },
    deleteTemplateItem(snapshot, templateItemId) {
      return commit(snapshot, { type: "deleteTemplateItem", templateItemId })
    },
    updateCase(snapshot, caseId, patch) {
      return commit(snapshot, { type: "updateCase", caseId, patch })
    },
    updateCaseItem(snapshot, caseItemId, patch) {
      return commit(snapshot, { type: "updateCaseItem", caseItemId, patch })
    },
    appendCaseActivity(snapshot, caseId, activityType, source, payload, caseItemId) {
      return commit(snapshot, { type: "appendCaseActivity", caseId, activityType, source, payload, caseItemId })
    },
    updateSettings(snapshot, patch) {
      return commit(snapshot, { type: "updateSettings", patch })
    },
  }
}
