import test from "node:test"
import assert from "node:assert/strict"
import { applyAppDataAction } from "../lib/data/actions"
import { createAppDataRepository } from "../lib/data/repository"
import { createSnapshotStorageAdapter } from "../lib/data/storage-adapter"
import { createInitialSnapshot } from "../lib/seed"

function createMemoryDriver() {
  let raw: string | null = null
  return {
    loadRaw() {
      return raw
    },
    saveRaw(nextRaw: string) {
      raw = nextRaw
    },
  }
}

test("repository prowadzi CRUD przez jedną warstwę i zapisuje snapshot do adaptera", () => {
  const driver = createMemoryDriver()
  const adapter = createSnapshotStorageAdapter(driver)
  const repository = createAppDataRepository(adapter)

  let snapshot = repository.createEmptySnapshot()
  snapshot = repository.addLead(snapshot, {
    name: "Repo Lead",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "Repo task",
    nextActionAt: "2026-04-05T10:00:00.000Z",
  })

  const loaded = repository.loadSnapshot()

  assert.equal(loaded.leads.length, 1)
  assert.equal(loaded.items.length, 1)
  assert.ok(loaded.leads[0]?.nextActionItemId)
  assert.equal(typeof driver.loadRaw(), "string")
})

test("snapshot ma gotowe miejsce na userId, workspaceId, accessStatus i billingStatus", () => {
  const snapshot = createInitialSnapshot()

  assert.deepEqual(snapshot.context, {
    userId: null,
    workspaceId: null,
    accessStatus: "local",
    billingStatus: "local",
  })
})

test("repository zapisuje nowe rekordy z workspaceId z kontekstu snapshotu", () => {
  const adapter = createSnapshotStorageAdapter(createMemoryDriver())
  const repository = createAppDataRepository(adapter)
  const baseSnapshot = createInitialSnapshot()
  const base = {
    ...baseSnapshot,
    context: {
      ...baseSnapshot.context,
      workspaceId: "ws_local_1",
    },
  }

  const withLead = repository.addLead(base, {
    name: "Nowy lead",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "new",
    priority: "medium",
    nextActionTitle: "",
    nextActionAt: "",
  })

  const withItem = repository.addItem(withLead, {
    leadId: null,
    leadLabel: "",
    recordType: "task",
    type: "task",
    title: "Nowe zadanie",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: "",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    showInTasks: true,
    showInCalendar: false,
  })

  assert.equal(withItem.leads[0]?.workspaceId, "ws_local_1")
  assert.equal(withItem.items[0]?.workspaceId, "ws_local_1")
})

test("actions pozostają czystą warstwą mutacji bez persystencji", () => {
  const driver = createMemoryDriver()
  const adapter = createSnapshotStorageAdapter(driver)
  const initialSnapshot = adapter.createEmptySnapshot()
  const nextSnapshot = applyAppDataAction(initialSnapshot, {
    type: "updateSettings",
    patch: { workspaceName: "Nowa nazwa" },
  })

  assert.equal(nextSnapshot.settings.workspaceName, "Nowa nazwa")
  assert.equal(driver.loadRaw(), null)
})

test("centralny model dostepu blokuje mutacje domeny w trybie podgladu", () => {
  const initial = createInitialSnapshot()
  const readOnlySnapshot = {
    ...initial,
    billing: {
      ...initial.billing,
      canCreate: false,
    },
  }

  const afterLead = applyAppDataAction(readOnlySnapshot, {
    type: "addLead",
    payload: {
      name: "Zablokowany lead",
      company: "",
      email: "",
      phone: "",
      source: "Inne",
      value: 0,
      summary: "",
      notes: "",
      status: "new",
      priority: "medium",
      nextActionTitle: "",
      nextActionAt: "",
    },
  })
  const afterSettings = applyAppDataAction(readOnlySnapshot, {
    type: "updateSettings",
    patch: { workspaceName: "Tryb podgladu" },
  })

  assert.equal(afterLead.leads.length, 0)
  assert.equal(afterSettings.settings.workspaceName, "Tryb podgladu")
})
