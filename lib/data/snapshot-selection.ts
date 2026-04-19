import type { AppSnapshot } from "@/lib/types"

export type SnapshotSource = "remote" | "local"

function hasContent(snapshot: AppSnapshot | null) {
  if (!snapshot) return false
  return snapshot.leads.length > 0 || snapshot.items.length > 0
}

function getLatestActivityTimestamp(snapshot: AppSnapshot | null) {
  if (!snapshot) return 0

  const timestamps = [
    ...snapshot.leads.map((lead) => Date.parse(lead.updatedAt || lead.createdAt || "")),
    ...snapshot.items.map((item) => Date.parse(item.updatedAt || item.createdAt || "")),
  ].filter((value) => Number.isFinite(value))

  return timestamps.length > 0 ? Math.max(...timestamps) : 0
}

export function choosePreferredSnapshot(remoteSnapshot: AppSnapshot | null, localSnapshot: AppSnapshot) {
  const remoteHasContent = hasContent(remoteSnapshot)
  const localHasContent = hasContent(localSnapshot)

  if (!remoteSnapshot) {
    return {
      snapshot: localSnapshot,
      source: "local" as SnapshotSource,
    }
  }

  if (remoteHasContent && !localHasContent) {
    return {
      snapshot: remoteSnapshot,
      source: "remote" as SnapshotSource,
    }
  }

  if (!remoteHasContent && localHasContent) {
    return {
      snapshot: localSnapshot,
      source: "local" as SnapshotSource,
    }
  }

  const remoteLatest = getLatestActivityTimestamp(remoteSnapshot)
  const localLatest = getLatestActivityTimestamp(localSnapshot)

  if (localLatest > remoteLatest) {
    return {
      snapshot: localSnapshot,
      source: "local" as SnapshotSource,
    }
  }

  return {
    snapshot: remoteSnapshot,
    source: "remote" as SnapshotSource,
  }
}
