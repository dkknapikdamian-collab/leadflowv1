"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"
import { useAuthSession } from "@/lib/auth/session-provider"
import { createAppDataRepository } from "@/lib/data/repository"
import { createLocalStorageDriver, createSnapshotStorageAdapter } from "@/lib/data/storage-adapter"
import { buildUserScopedStorageKey } from "@/lib/data/storage-key"
import type {
  AppSnapshot,
  Lead,
  LeadInput,
  SettingsPatch,
  WorkItem,
  WorkItemInput,
} from "@/lib/types"
import { STORAGE_KEY } from "@/lib/utils"

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

function syncSnapshotWithSession(snapshot: AppSnapshot, user: { id: string; email: string | null; displayName: string } | null) {
  return {
    ...snapshot,
    user: {
      ...snapshot.user,
      name: user?.displayName ?? snapshot.user.name,
      email: user?.email ?? snapshot.user.email,
    },
    context: {
      ...snapshot.context,
      userId: user?.id ?? null,
    },
  }
}

export function AppStoreProvider({ children }: PropsWithChildren) {
  const { session, isReady: isAuthReady } = useAuthSession()
  const scopedStorageKey = useMemo(
    () => buildUserScopedStorageKey(STORAGE_KEY, session?.user.id),
    [session?.user.id],
  )
  const repository = useMemo(
    () => createAppDataRepository(createSnapshotStorageAdapter(createLocalStorageDriver(scopedStorageKey))),
    [scopedStorageKey],
  )
  const [snapshot, setSnapshot] = useState<AppSnapshot>(() => repository.createEmptySnapshot())
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isAuthReady) return

    const loadedSnapshot = repository.loadSnapshot()
    setSnapshot(syncSnapshotWithSession(loadedSnapshot, session?.user ?? null))
    setIsReady(true)
  }, [isAuthReady, repository, session?.user])

  useEffect(() => {
    const theme = snapshot.settings.theme || "classic"
    document.documentElement.dataset.theme = theme
    document.body.dataset.theme = theme
  }, [snapshot.settings.theme])

  const value = useMemo<AppStoreValue>(
    () => ({
      snapshot,
      isReady: isReady && isAuthReady,
      addLead: (payload: LeadInput) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.addLead(current, payload), session?.user ?? null),
        ),
      updateLead: (leadId: string, patch: Partial<Lead>) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateLead(current, leadId, patch), session?.user ?? null),
        ),
      deleteLead: (leadId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.deleteLead(current, leadId), session?.user ?? null),
        ),
      addItem: (payload: WorkItemInput) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.addItem(current, payload), session?.user ?? null),
        ),
      updateItem: (itemId: string, patch: Partial<WorkItem>) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateItem(current, itemId, patch), session?.user ?? null),
        ),
      deleteItem: (itemId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.deleteItem(current, itemId), session?.user ?? null),
        ),
      toggleItemDone: (itemId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.toggleItemDone(current, itemId), session?.user ?? null),
        ),
      snoozeItem: (itemId: string, nextDate: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.snoozeItem(current, itemId, nextDate), session?.user ?? null),
        ),
      updateSettings: (patch: SettingsPatch) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateSettings(current, patch), session?.user ?? null),
        ),
    }),
    [isAuthReady, isReady, repository, session?.user, snapshot],
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
