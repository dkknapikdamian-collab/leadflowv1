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
import { createLocalStorageDriver, createSnapshotStorageAdapter } from "@/lib/data/storage-adapter"
import { buildUserScopedStorageKey } from "@/lib/data/storage-key"
import type {
  AppSnapshot,
  Lead,
  LeadInput,
  RequestStatus,
  SettingsPatch,
  WorkItem,
  WorkItemInput,
} from "@/lib/types"
import type { CaseTemplateInput } from "@/lib/snapshot"
import type { AccessStatusRow } from "@/lib/supabase/access-status"
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
  addCaseTemplate: (payload: CaseTemplateInput) => void
  updateCaseTemplate: (templateId: string, payload: CaseTemplateInput) => void
  deleteCaseTemplate: (templateId: string) => void
  duplicateCaseTemplate: (templateId: string) => void
  setDefaultCaseTemplate: (templateId: string) => void
  issueClientPortalToken: (payload: { caseId: string; tokenHash: string; expiresAt: string }) => void
  revokeClientPortalToken: (tokenId: string, reason?: string) => void
  registerPortalOpened: (tokenId: string) => void
  registerPortalTokenFailure: (tokenHash: string) => void
  addFileAttachment: (payload: {
    caseId: string
    caseItemId?: string | null
    fileName: string
    mimeType: string
    fileSizeBytes: number
    storagePath?: string
    uploadedByRole?: "client" | "operator" | "system"
    uploadedByLabel?: string
  }) => void
  addApproval: (payload: {
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
  }) => void
  addNotification: (payload: {
    userId: string
    channel: "in_app" | "email"
    kind?: string
    dedupeKey?: string
    title: string
    message: string
    relatedLeadId?: string | null
    relatedCaseId?: string | null
    recipient?: string
  }) => void
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

async function loadRemoteSnapshot() {
  const response = await fetch("/api/app/snapshot", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
  })

  if (!response.ok) {
    return null
  }

  return (await response.json().catch(() => null)) as {
    snapshot: AppSnapshot | null
    workspaceId: string | null
    accessStatus: AccessStatusRow | null
  } | null
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

  return response.ok
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
      let nextSnapshot = selected.snapshot

      if (remotePayload?.accessStatus) {
        nextSnapshot = applyAccessStatusToSnapshot(nextSnapshot, remotePayload.accessStatus)
      }

      nextSnapshot = syncSnapshotWithSession(
        nextSnapshot,
        session?.user ?? null,
        remotePayload?.workspaceId ?? nextSnapshot.context.workspaceId ?? null,
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
      void saveRemoteSnapshot(snapshot)
        .then((ok) => {
          if (ok) {
            lastRemoteSyncedRef.current = serialized
          }
        })
        .catch(() => {
          // keep local state as fallback
        })
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [isAuthReady, isReady, session?.user.id, snapshot])

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
      addCaseTemplate: (payload: CaseTemplateInput) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.addCaseTemplate(current, payload), session?.user ?? null),
        ),
      updateCaseTemplate: (templateId: string, payload: CaseTemplateInput) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.updateCaseTemplate(current, templateId, payload), session?.user ?? null),
        ),
      deleteCaseTemplate: (templateId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.deleteCaseTemplate(current, templateId), session?.user ?? null),
        ),
      duplicateCaseTemplate: (templateId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.duplicateCaseTemplate(current, templateId), session?.user ?? null),
        ),
      setDefaultCaseTemplate: (templateId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.setDefaultCaseTemplate(current, templateId), session?.user ?? null),
        ),
      issueClientPortalToken: (payload: { caseId: string; tokenHash: string; expiresAt: string }) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.issueClientPortalToken(current, payload), session?.user ?? null),
        ),
      revokeClientPortalToken: (tokenId: string, reason?: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.revokeClientPortalToken(current, tokenId, reason), session?.user ?? null),
        ),
      registerPortalOpened: (tokenId: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.registerPortalOpened(current, tokenId), session?.user ?? null),
        ),
      registerPortalTokenFailure: (tokenHash: string) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.registerPortalTokenFailure(current, tokenHash), session?.user ?? null),
        ),
      addFileAttachment: (payload) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.addFileAttachment(current, payload), session?.user ?? null),
        ),
      addApproval: (payload) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.addApproval(current, payload), session?.user ?? null),
        ),
      addNotification: (payload) =>
        setSnapshot((current: AppSnapshot) =>
          syncSnapshotWithSession(repository.addNotification(current, payload), session?.user ?? null),
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
