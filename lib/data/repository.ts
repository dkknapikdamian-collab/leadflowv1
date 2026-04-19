import { applyAppDataAction, type AppDataAction } from "./actions"
import { createSnapshotStorageAdapter, type SnapshotStorageAdapter } from "./storage-adapter"
import type { AppSnapshot, Lead, LeadInput, SettingsPatch, WorkItem, WorkItemInput } from "../types"

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
  }
}
