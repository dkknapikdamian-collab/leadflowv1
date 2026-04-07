import { reconcileAppSnapshot } from "../snapshot"
import type { AppSnapshot, Lead, WorkItem } from "../types"

export interface SnapshotSyncMergeResult {
  snapshot: AppSnapshot
  mergedFromConflict: boolean
}

function toTimestamp(value: string | null | undefined) {
  if (!value) return 0
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function getLatestIso(...values: Array<string | null | undefined>) {
  let latestValue = ""
  let latestTimestamp = 0

  values.forEach((value) => {
    const timestamp = toTimestamp(value)
    if (timestamp >= latestTimestamp) {
      latestTimestamp = timestamp
      latestValue = value ?? latestValue
    }
  })

  return latestValue
}

function getEarliestIso(...values: Array<string | null | undefined>) {
  let earliestValue = ""
  let earliestTimestamp = Number.POSITIVE_INFINITY

  values.forEach((value) => {
    const timestamp = toTimestamp(value)
    if (!timestamp) return
    if (timestamp <= earliestTimestamp) {
      earliestTimestamp = timestamp
      earliestValue = value ?? earliestValue
    }
  })

  return earliestValue
}

function getLatestUpdatedAt(
  leftUpdatedAt: string | null | undefined,
  rightUpdatedAt: string | null | undefined,
  leftCreatedAt: string | null | undefined,
  rightCreatedAt: string | null | undefined,
) {
  const latestUpdatedAt = getLatestIso(leftUpdatedAt, rightUpdatedAt)
  if (latestUpdatedAt) {
    return latestUpdatedAt
  }

  return getLatestIso(leftCreatedAt, rightCreatedAt)
}

function getRecordTimestamp(record: { updatedAt: string; createdAt: string }) {
  const updatedAtTimestamp = toTimestamp(record.updatedAt)
  if (updatedAtTimestamp > 0) {
    return updatedAtTimestamp
  }

  return toTimestamp(record.createdAt)
}

function pickLatestRecord<T extends { updatedAt: string; createdAt: string }>(left: T, right: T) {
  return getRecordTimestamp(right) >= getRecordTimestamp(left) ? right : left
}

function sortByRecentUpdate<T extends { updatedAt: string; createdAt: string }>(left: T, right: T) {
  return getRecordTimestamp(right) - getRecordTimestamp(left) || right.createdAt.localeCompare(left.createdAt)
}

function stripItemSyncFields(item: WorkItem) {
  const {
    status,
    updatedAt,
    createdAt,
    ...rest
  } = item

  return JSON.stringify(rest)
}

function mergeLeadRecords(remote: Lead, incoming: Lead): Lead {
  const latest = pickLatestRecord(remote, incoming)
  const stale = latest === remote ? incoming : remote

  return {
    ...stale,
    ...latest,
    id: latest.id,
    workspaceId: latest.workspaceId ?? stale.workspaceId ?? null,
    nextActionItemId: latest.nextActionItemId ?? stale.nextActionItemId ?? null,
    nextActionTitle: latest.nextActionTitle || stale.nextActionTitle || "",
    nextActionAt: latest.nextActionAt || stale.nextActionAt || "",
    createdAt: getEarliestIso(remote.createdAt, incoming.createdAt),
    updatedAt: getLatestUpdatedAt(
      remote.updatedAt,
      incoming.updatedAt,
      remote.createdAt,
      incoming.createdAt,
    ),
  }
}

function mergeWorkItemRecords(remote: WorkItem, incoming: WorkItem): WorkItem {
  const latest = pickLatestRecord(remote, incoming)
  const stale = latest === remote ? incoming : remote
  const oneSideDone = remote.status === "done" || incoming.status === "done"
  const hasNonStatusConflict = stripItemSyncFields(remote) !== stripItemSyncFields(incoming)
  const contentSource = remote.status === "done" ? incoming : incoming.status === "done" ? remote : latest
  const mergedBase: WorkItem = {
    ...stale,
    ...latest,
    id: latest.id,
    workspaceId: latest.workspaceId ?? stale.workspaceId ?? null,
    leadId: latest.leadId ?? stale.leadId ?? null,
    leadLabel: latest.leadLabel || stale.leadLabel || "",
    createdAt: getEarliestIso(remote.createdAt, incoming.createdAt),
    updatedAt: getLatestUpdatedAt(
      remote.updatedAt,
      incoming.updatedAt,
      remote.createdAt,
      incoming.createdAt,
    ),
  }

  if (oneSideDone && remote.status !== incoming.status && hasNonStatusConflict) {
    return {
      ...mergedBase,
      ...contentSource,
      id: mergedBase.id,
      workspaceId: contentSource.workspaceId ?? mergedBase.workspaceId ?? null,
      leadId: contentSource.leadId ?? mergedBase.leadId ?? null,
      leadLabel: contentSource.leadLabel || mergedBase.leadLabel || "",
      status: "done",
      createdAt: mergedBase.createdAt,
      updatedAt: mergedBase.updatedAt,
    }
  }

  return {
    ...mergedBase,
    status: oneSideDone ? "done" : latest.status,
  }
}

function mergeCollection<T extends { id: string; updatedAt: string; createdAt: string }>(
  remoteRecords: T[],
  incomingRecords: T[],
  mergeRecord: (remoteRecord: T, incomingRecord: T) => T,
) {
  const remoteById = new Map(remoteRecords.map((record) => [record.id, record]))
  const incomingById = new Map(incomingRecords.map((record) => [record.id, record]))
  const recordIds = new Set([...remoteById.keys(), ...incomingById.keys()])

  return [...recordIds]
    .map((recordId) => {
      const remoteRecord = remoteById.get(recordId) ?? null
      const incomingRecord = incomingById.get(recordId) ?? null

      if (remoteRecord && incomingRecord) {
        return mergeRecord(remoteRecord, incomingRecord)
      }

      return remoteRecord ?? incomingRecord
    })
    .filter((record): record is T => Boolean(record))
    .sort(sortByRecentUpdate)
}

export function mergeSnapshotsForSync(remoteSnapshot: AppSnapshot | null, incomingSnapshot: AppSnapshot): SnapshotSyncMergeResult {
  const normalizedIncoming = reconcileAppSnapshot(incomingSnapshot)

  if (!remoteSnapshot) {
    return {
      snapshot: normalizedIncoming,
      mergedFromConflict: false,
    }
  }

  const normalizedRemote = reconcileAppSnapshot(remoteSnapshot)
  const mergedSnapshot = reconcileAppSnapshot({
    ...normalizedRemote,
    ...normalizedIncoming,
    user: normalizedIncoming.user,
    context: {
      ...normalizedRemote.context,
      ...normalizedIncoming.context,
    },
    billing: normalizedIncoming.billing,
    settings: normalizedIncoming.settings,
    leads: mergeCollection(normalizedRemote.leads, normalizedIncoming.leads, mergeLeadRecords),
    items: mergeCollection(normalizedRemote.items, normalizedIncoming.items, mergeWorkItemRecords),
  })

  return {
    snapshot: mergedSnapshot,
    mergedFromConflict: JSON.stringify(mergedSnapshot) !== JSON.stringify(normalizedIncoming),
  }
}

export function resolveSnapshotAfterConflictRefetch(localSnapshot: AppSnapshot, refetchedRemoteSnapshot: AppSnapshot | null) {
  if (!refetchedRemoteSnapshot) {
    return reconcileAppSnapshot(localSnapshot)
  }

  return reconcileAppSnapshot(refetchedRemoteSnapshot)
}