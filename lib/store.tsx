"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"
import { createAppDataRepository } from "@/lib/data/repository"
import type {
  AppSnapshot,
  Lead,
  LeadInput,
  SettingsPatch,
  WorkItem,
  WorkItemInput,
} from "@/lib/types"

interface AppStoreValue {
  snapshot: AppSnapshot
  isReady: boolean
  addLead: (payload: LeadInput) => void
  updateLead: (leadId: string, patch: Partial<Lead>) => void
  deleteLead: (leadId: string) => void
  addItem: (payload: WorkItemInput) => void
  updateItem: (itemId: string, patch: Partial<WorkItem>) => void
  deleteItem: (itemId: string) => void
  toggleItemDone: (itemId: string) => void
  snoozeItem: (itemId: string, nextDate: string) => void
  updateSettings: (patch: SettingsPatch) => void
}

const AppStoreContext = createContext<AppStoreValue | null>(null)
const repository = createAppDataRepository()

export function AppStoreProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(() => repository.createEmptySnapshot())
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setSnapshot(repository.loadSnapshot())
    setIsReady(true)
  }, [])

  useEffect(() => {
    const theme = snapshot.settings.theme || "classic"
    document.documentElement.dataset.theme = theme
    document.body.dataset.theme = theme
  }, [snapshot.settings.theme])

  const value = useMemo<AppStoreValue>(
    () => ({
      snapshot,
      isReady,
      addLead: (payload: LeadInput) =>
        setSnapshot((current: AppSnapshot) => repository.addLead(current, payload)),
      updateLead: (leadId: string, patch: Partial<Lead>) =>
        setSnapshot((current: AppSnapshot) => repository.updateLead(current, leadId, patch)),
      deleteLead: (leadId: string) => setSnapshot((current: AppSnapshot) => repository.deleteLead(current, leadId)),
      addItem: (payload: WorkItemInput) =>
        setSnapshot((current: AppSnapshot) => repository.addItem(current, payload)),
      updateItem: (itemId: string, patch: Partial<WorkItem>) =>
        setSnapshot((current: AppSnapshot) => repository.updateItem(current, itemId, patch)),
      deleteItem: (itemId: string) => setSnapshot((current: AppSnapshot) => repository.deleteItem(current, itemId)),
      toggleItemDone: (itemId: string) =>
        setSnapshot((current: AppSnapshot) => repository.toggleItemDone(current, itemId)),
      snoozeItem: (itemId: string, nextDate: string) =>
        setSnapshot((current: AppSnapshot) => repository.snoozeItem(current, itemId, nextDate)),
      updateSettings: (patch: SettingsPatch) =>
        setSnapshot((current: AppSnapshot) => repository.updateSettings(current, patch)),
    }),
    [isReady, snapshot],
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const context = useContext(AppStoreContext)
  if (!context) {
    throw new Error("useAppStore must be used inside AppStoreProvider")
  }
  return context
}
