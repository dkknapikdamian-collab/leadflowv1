import { loadSnapshot, resetInitialSnapshot } from "../snapshot"
import type { AppSnapshot } from "../types"
import { STORAGE_KEY } from "../utils"

export interface SnapshotPersistenceDriver {
  loadRaw(): string | null
  saveRaw(raw: string): void
}

export interface SnapshotStorageAdapter {
  createEmptySnapshot(): AppSnapshot
  loadSnapshot(): AppSnapshot
  saveSnapshot(snapshot: AppSnapshot): void
}

export function createLocalStorageDriver(storageKey: string = STORAGE_KEY): SnapshotPersistenceDriver {
  return {
    loadRaw() {
      if (typeof window === "undefined") return null
      return window.localStorage.getItem(storageKey)
    },
    saveRaw(raw: string) {
      if (typeof window === "undefined") return
      window.localStorage.setItem(storageKey, raw)
    },
  }
}

export function createSnapshotStorageAdapter(
  driver: SnapshotPersistenceDriver = createLocalStorageDriver(),
): SnapshotStorageAdapter {
  return {
    createEmptySnapshot() {
      return resetInitialSnapshot()
    },
    loadSnapshot() {
      return loadSnapshot(driver.loadRaw())
    },
    saveSnapshot(snapshot: AppSnapshot) {
      driver.saveRaw(JSON.stringify(snapshot))
    },
  }
}
