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
import { resolveSnapshotAfterConflictRefetch } from "@/lib/data/snapshot-sync"
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

interface AppStoreValue {
  snapshot: AppSnapshot
  isReady: boolean
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

async function saveRemoteSnapshot(snapshot: AppSnapshot) {
  const response = await fetch("/api/app/snapshot", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
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
  const lastRemoteSyncedRef = useRef<string | null>(null)
  const saveSequenceRef = useRef(0)

  useEffect(() => {
    if (!isAuthReady) return

    let cancelled = false

    async function hydrateSnapshot() {
      setIsReady(false)

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
    }

    void hydrateSnapshot()

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

    const serialized = JSON.stringify(snapshot)
    if (lastRemoteSyncedRef.current === serialized) return

    const timeout = window.setTimeout(() => {
      const requestId = saveSequenceRef.current + 1
      saveSequenceRef.current = requestId

      void saveRemoteSnapshot(snapshot)
        .then(async (result) => {
          if (!result) return

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
        })
        .catch(() => {
          // keep local state as fallback
        })
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [isAuthReady, isReady, session?.user, snapshot])

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
