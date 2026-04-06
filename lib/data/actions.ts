import {
  addItemSnapshot,
  addLeadSnapshot,
  deleteItemSnapshot,
  deleteLeadSnapshot,
  snoozeItemSnapshot,
  toggleItemDoneSnapshot,
  updateItemSnapshot,
  updateLeadSnapshot,
  updateSettingsSnapshot,
} from "../snapshot"
import type { AppSnapshot, LeadInput, SettingsPatch, WorkItemInput, Lead, WorkItem } from "../types"

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

export function applyAppDataAction(snapshot: AppSnapshot, action: AppDataAction): AppSnapshot {
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
    default:
      return snapshot
  }
}
