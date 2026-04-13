"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react"
import { applyAccessStatusToSnapshot } from "@/lib/access/account-status"
import { useAuthSession } from "@/lib/auth/session-provider"
import { createAppDataRepository } from "@/lib/data/repository"
import { choosePreferredSnapshot } from "@/lib/data/snapshot-selection"
import { mergeSnapshotsForSync, resolveSnapshotAfterConflictRefetch } from "@/lib/data/snapshot-sync"
import { createLocalStorageDriver, createSnapshotStorageAdapter } from "@/lib/data/storage-adapter"
import { buildUserScopedStorageKey } from "@/lib/data/storage-key"
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
} from "@/lib/types"
import type { AccessStatusRow } from "@/lib/supabase/access-status"
import { STORAGE_KEY } from "@/lib/utils"

export type AppSyncStatus = "idle" | "syncing" | "saved" | "error"

interface AppStoreValue {
  snapshot: AppSnapshot
  isReady: boolean
  syncStatus: AppSyncStatus
  lastSyncedAt: string | null
  addLead: (payload: LeadInput) => void
  updateLead: (leadId: string, patch: Partial<Lead>) => void
  deleteLead: (leadId: string) => void
  startCaseFromLead: (
    leadId: string,
    mode: "empty" | "template" | "template_with_link",
    templateId?: string | null,
  ) => void
  issueClientPortalLink: (leadId: string) => void
  revokeClientPortalToken: (caseId: string) => void
  addItem: (payload: WorkItemInput) => void
  updateItem: (itemId: string, patch: Partial<WorkItem>) => void
  deleteItem: (itemId: string) => void
  toggleItemDone: (itemId: string) => void
  snoozeItem: (itemId: string, nextDate: string) => void
  addCaseTemplate: (payload: { title: string; description: string; serviceType: CaseTemplateServiceType }) => void
  updateCaseTemplate: (templateId: string, patch: Partial<CaseTemplate>) => void
  duplicateCaseTemplate: (templateId: string) => void
  setDefaultCaseTemplate: (templateId: string) => void
  addTemplateItem: (payload: { templateId: string; title: string; description: string; kind: TemplateItem["kind"]; required: boolean }) => void
  updateTemplateItem: (templateItemId: string, patch: Partial<TemplateItem>) => void
  deleteTemplateItem: (templateItemId: string) => void
  updateCase: (caseId: string, patch: Partial<Case>) => void
  updateCaseItem: (caseItemId: string, patch: Partial<CaseItem>) => void
  appendCaseActivity: (
    caseId: string,
    activityType: ActivityType,
    source?: "sales" | "operations" | "system",
    payload?: Record<string, unknown>,
    caseItemId?: string | null,
  ) => void
  updateSettings: (patch: SettingsPatch) => void
}

interface RemoteSnapshotPayload {
  snapshot: AppSnapshot | null
  workspaceId: string | null
  accessStatus: AccessStatusRow | null
}

interface SaveRemoteSnapshotPayload extends RemoteSnapshotPayload {
  ok: boolean
  mergedFromConflict: boolean
}

const AppStoreContext = createContext<AppStoreValue | null>(null)
const REMOTE_SYNC_INTERVAL_MS = 15000

function syncSnapshotWithSession(
  snapshot: AppSnapshot,
  user: { id: string; email: string | null; displayName: string } | null,
  workspaceId?: string | null,
) {
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
      workspaceId: workspaceId ?? snapshot.context.workspaceId ?? null,
    },
  }
}

function applyRemotePayload(
  payload: RemoteSnapshotPayload | null,
  fallbackSnapshot: AppSnapshot,
  user: { id: string; email: string | null; displayName: string } | null,
) {
  const remoteWorkspaceId = payload?.workspaceId ?? fallbackSnapshot.context.workspaceId ?? null
  let nextSnapshot = payload?.snapshot
    ? syncSnapshotWithSession(payload.snapshot, user, remoteWorkspaceId)
    : syncSnapshotWithSession(fallbackSnapshot, user, remoteWorkspaceId)

  if (payload?.accessStatus) {
    nextSnapshot = applyAccessStatusToSnapshot(nextSnapshot, payload.accessStatus)
  }

  return syncSnapshotWithSession(nextSnapshot, user, remoteWorkspaceId)
}

async function loadRemoteSnapshot() {
  const response = await fetch("/api/app/snapshot", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
  })

  if (!response.ok) {
    return null
  }

  return (await response.json().catch(() => null)) as RemoteSnapshotPayload | null
}

async function saveRemoteSnapshot(snapshot: AppSnapshot, options?: { keepalive?: boolean }) {
  const response = await fetch("/api/app/snapshot", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    keepalive: options?.keepalive ?? false,
    body: JSON.stringify({ snapshot }),
  })

  if (!response.ok) {
    return null
  }

  return (await response.json().catch(() => null)) as SaveRemoteSnapshotPayload | null
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
  const [syncStatus, setSyncStatus] = useState<AppSyncStatus>("idle")
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
  const lastRemoteSyncedRef = useRef<string | null>(null)
  const saveSequenceRef = useRef(0)
  const snapshotRef = useRef<AppSnapshot>(snapshot)

  useEffect(() => {
    snapshotRef.current = snapshot
  }, [snapshot])

  useEffect(() => {
    if (!isAuthReady) return

    let cancelled = false

    async function hydrateSnapshot() {
      setIsReady(false)
      setSyncStatus("syncing")

      const localSnapshot = syncSnapshotWithSession(repository.loadSnapshot(), session?.user ?? null)
      const remotePayload = await loadRemoteSnapshot().catch(() => null)
      const remoteSnapshot = remotePayload?.snapshot
        ? syncSnapshotWithSession(remotePayload.snapshot, session?.user ?? null, remotePayload.workspaceId)
        : null
      const localSnapshotWithWorkspace = syncSnapshotWithSession(
        localSnapshot,
        session?.user ?? null,
        remotePayload?.workspaceId ?? localSnapshot.context.workspaceId ?? null,
      )

      const selected = choosePreferredSnapshot(remoteSnapshot, localSnapshotWithWorkspace)
      const nextSnapshot = applyRemotePayload(
        remotePayload
          ? {
              ...remotePayload,
              snapshot: selected.source === "remote" ? remotePayload.snapshot : localSnapshotWithWorkspace,
            }
          : {
              snapshot: localSnapshotWithWorkspace,
              workspaceId: localSnapshotWithWorkspace.context.workspaceId ?? null,
              accessStatus: null,
            },
        localSnapshotWithWorkspace,
        session?.user ?? null,
      )

      const serialized = JSON.stringify(nextSnapshot)

      if (cancelled) return

      lastRemoteSyncedRef.current = selected.source === "remote" ? serialized : null
      setSnapshot(nextSnapshot)
      setIsReady(true)
      setSyncStatus("saved")
      setLastSyncedAt(new Date().toISOString())
    }

    void hydrateSnapshot().catch(() => {
      if (cancelled) return
      setIsReady(true)
      setSyncStatus("error")
    })

    return () => {
      cancelled = true
    }
  }, [isAuthReady, repository, session?.user])

  useEffect(() => {
    const theme = snapshot.settings.theme || "classic"
    document.documentElement.dataset.theme = theme
    document.body.dataset.theme = theme
  }, [snapshot.settings.theme])

  useEffect(() => {
    if (!isReady || !isAuthReady || !session?.user.id) return

    let cancelled = false

    async function pullRemoteSnapshotIntoStore() {
      setSyncStatus("syncing")
      const remotePayload = await loadRemoteSnapshot().catch(() => null)
      if (!remotePayload || cancelled) {
        if (!cancelled) {
          setSyncStatus("error")
        }
        return
      }

      setSnapshot((current) => {
        const currentWithSession = syncSnapshotWithSession(
          current,
          session?.user ?? null,
          remotePayload.workspaceId ?? current.context.workspaceId ?? null,
        )
        const remoteSnapshot = remotePayload.snapshot
          ? syncSnapshotWithSession(remotePayload.snapshot, session?.user ?? null, remotePayload.workspaceId)
          : null

        if (!remoteSnapshot) {
          const nextSnapshot = applyRemotePayload(remotePayload, currentWithSession, session?.user ?? null)
          const nextSerialized = JSON.stringify(nextSnapshot)
          const currentSerialized = JSON.stringify(currentWithSession)
          if (nextSerialized === currentSerialized) {
            return currentWithSession
          }
          return nextSnapshot
        }

        const mergedRemoteAndLocal = mergeSnapshotsForSync(remoteSnapshot, currentWithSession).snapshot
        const nextSnapshot = applyRemotePayload(
          {
            ...remotePayload,
            snapshot: mergedRemoteAndLocal,
          },
          currentWithSession,
          session?.user ?? null,
        )
        const remoteCanonicalSnapshot = applyRemotePayload(remotePayload, currentWithSession, session?.user ?? null)
        const currentSerialized = JSON.stringify(currentWithSession)
        const nextSerialized = JSON.stringify(nextSnapshot)
        const remoteSerialized = JSON.stringify(remoteCanonicalSnapshot)

        if (nextSerialized === currentSerialized) {
          lastRemoteSyncedRef.current = remoteSerialized
          return currentWithSession
        }

        lastRemoteSyncedRef.current = remoteSerialized
        return nextSnapshot
      })

      if (!cancelled) {
        setSyncStatus("saved")
        setLastSyncedAt(new Date().toISOString())
      }
    }

    const intervalId = window.setInterval(() => {
      void pullRemoteSnapshotIntoStore()
    }, REMOTE_SYNC_INTERVAL_MS)

    const handleFocus = () => {
      void pullRemoteSnapshotIntoStore()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void pullRemoteSnapshotIntoStore()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    void pullRemoteSnapshotIntoStore()

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isAuthReady, isReady, session?.user])

  useEffect(() => {
    if (!isReady || !isAuthReady || !session?.user.id) return

    const flushRemoteSnapshot = () => {
      const currentSnapshot = snapshotRef.current
      const serialized = JSON.stringify(currentSnapshot)
      if (lastRemoteSyncedRef.current === serialized) {
        return
      }

      void saveRemoteSnapshot(currentSnapshot, { keepalive: true })
        .then((result) => {
          if (!result) return
          const canonicalSnapshot = applyRemotePayload(result, currentSnapshot, session?.user ?? null)
          lastRemoteSyncedRef.current = JSON.stringify(canonicalSnapshot)
          setSyncStatus("saved")
          setLastSyncedAt(new Date().toISOString())
        })
        .catch(() => {
          setSyncStatus("error")
        })
    }

    const handlePageHide = () => flushRemoteSnapshot()
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushRemoteSnapshot()
      }
    }

    window.addEventListener("pagehide", handlePageHide)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("pagehide", handlePageHide)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isAuthReady, isReady, session?.user])

  useEffect(() => {
    if (!isReady || !isAuthReady || !session?.user.id) return

    const serialized = JSON.stringify(snapshot)
    if (lastRemoteSyncedRef.current === serialized) return

    const timeout = window.setTimeout(() => {
      const requestId = saveSequenceRef.current + 1
      saveSequenceRef.current = requestId
      setSyncStatus("syncing")

      void saveRemoteSnapshot(snapshot)
        .then(async (result) => {
          if (!result) {
            setSyncStatus("error")
            return
          }

          let resolvedPayload: RemoteSnapshotPayload | null = result
          if (result.mergedFromConflict) {
            const refetchedPayload = await loadRemoteSnapshot().catch(() => null)
            const canonicalSnapshot = resolveSnapshotAfterConflictRefetch(snapshot, refetchedPayload?.snapshot ?? result.snapshot)
            resolvedPayload = {
              snapshot: canonicalSnapshot,
              workspaceId: refetchedPayload?.workspaceId ?? result.workspaceId,
              accessStatus: refetchedPayload?.accessStatus ?? result.accessStatus,
            }
          }

          if (saveSequenceRef.current !== requestId) return

          const canonicalSnapshot = applyRemotePayload(resolvedPayload, snapshot, session?.user ?? null)
          const canonicalSerialized = JSON.stringify(canonicalSnapshot)

          setSnapshot((current) => {
            const currentSerialized = JSON.stringify(current)
            if (currentSerialized !== serialized) {
              return current
            }

            lastRemoteSyncedRef.current = canonicalSerialized
            return canonicalSnapshot
          })

          setSyncStatus("saved")
          setLastSyncedAt(new Date().toISOString())
        })
        .catch(() => {
          setSyncStatus("error")
        })
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [isAuthReady, isReady, session?.user, snapshot])

  const value = useMemo<AppStoreValue>(
    () => ({
      snapshot,
      isReady: isReady && isAuthReady,
      syncStatus,
      lastSyncedAt,
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
      startCaseFromLead: (leadId, mode, templateId) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.startCaseFromLead(current, leadId, mode, templateId), session?.user ?? null),
        ),
      issueClientPortalLink: (leadId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.issueClientPortalLink(current, leadId), session?.user ?? null),
        ),
      revokeClientPortalToken: (caseId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.revokeClientPortalToken(current, caseId), session?.user ?? null),
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
      addCaseTemplate: (payload) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.addCaseTemplate(current, payload), session?.user ?? null),
        ),
      updateCaseTemplate: (templateId: string, patch: Partial<CaseTemplate>) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateCaseTemplate(current, templateId, patch), session?.user ?? null),
        ),
      duplicateCaseTemplate: (templateId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.duplicateCaseTemplate(current, templateId), session?.user ?? null),
        ),
      setDefaultCaseTemplate: (templateId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.setDefaultCaseTemplate(current, templateId), session?.user ?? null),
        ),
      addTemplateItem: (payload) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.addTemplateItem(current, payload), session?.user ?? null),
        ),
      updateTemplateItem: (templateItemId: string, patch: Partial<TemplateItem>) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateTemplateItem(current, templateItemId, patch), session?.user ?? null),
        ),
      deleteTemplateItem: (templateItemId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.deleteTemplateItem(current, templateItemId), session?.user ?? null),
        ),
      updateCase: (caseId: string, patch: Partial<Case>) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateCase(current, caseId, patch), session?.user ?? null),
        ),
      updateCaseItem: (caseItemId: string, patch: Partial<CaseItem>) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateCaseItem(current, caseItemId, patch), session?.user ?? null),
        ),
      appendCaseActivity: (
        caseId: string,
        activityType: ActivityType,
        source: "sales" | "operations" | "system" = "operations",
        payload?: Record<string, unknown>,
        caseItemId?: string | null,
      ) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(
            repository.appendCaseActivity(current, caseId, activityType, source, payload, caseItemId),
            session?.user ?? null,
          ),
        ),
      updateSettings: (patch: SettingsPatch) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateSettings(current, patch), session?.user ?? null),
        ),
    }),
    [isAuthReady, isReady, lastSyncedAt, repository, session?.user, snapshot, syncStatus],
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
