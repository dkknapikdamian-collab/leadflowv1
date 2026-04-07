import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { buildLeadComputedState } from "../lib/domain/lead-state"
import {
  addItemSnapshot,
  addLeadSnapshot,
  toggleItemDoneSnapshot,
  updateItemSnapshot,
  updateLeadSnapshot,
} from "../lib/snapshot"
import { mergeSnapshotsForSync, resolveSnapshotAfterConflictRefetch } from "../lib/data/snapshot-sync"
import type { AppSnapshot, Lead, WorkItem } from "../lib/types"

function cloneSnapshot<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function createLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_1",
    workspaceId: "workspace_1",
    name: "Lead testowy",
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
    nextActionItemId: null,
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-01T09:00:00.000Z",
    ...overrides,
  }
}

function createItem(overrides: Partial<WorkItem> = {}): WorkItem {
  return {
    id: "item_1",
    workspaceId: "workspace_1",
    leadId: "lead_1",
    leadLabel: "Lead testowy",
    recordType: "task",
    type: "task",
    title: "Task",
    description: "",
    status: "todo",
    priority: "medium",
    scheduledAt: "2026-04-07T10:00:00.000Z",
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "none",
    createdAt: "2026-04-06T08:00:00.000Z",
    updatedAt: "2026-04-06T08:00:00.000Z",
    showInTasks: true,
    showInCalendar: false,
    ...overrides,
  }
}

test("sync łączy follow-up z telefonu i zmianę statusu leada z laptopa", () => {
  const base = addLeadSnapshot(createInitialSnapshot(), {
    name: "Lead sync",
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
  const leadId = base.leads[0]!.id

  const remote = updateLeadSnapshot(base, leadId, { status: "contacted" })
  const incoming = updateLeadSnapshot(base, leadId, {
    nextActionTitle: "Oddzwonić jutro",
    nextActionAt: "2026-04-08T10:00:00.000Z",
  })

  const result = mergeSnapshotsForSync(remote, incoming)
  const mergedLead = result.snapshot.leads.find((lead) => lead.id === leadId)

  assert.equal(result.mergedFromConflict, true)
  assert.ok(mergedLead)
  assert.equal(mergedLead?.status, "contacted")
  assert.equal(mergedLead?.nextActionTitle, "Oddzwonić jutro")
  assert.equal(mergedLead?.nextActionAt, "2026-04-08T10:00:00.000Z")
  assert.equal(typeof mergedLead?.nextActionItemId, "string")
})

test("sync łączy done z telefonu i edycję tego samego taska z laptopa bez utraty zmian", () => {
  const base = createInitialSnapshot()
  base.context.workspaceId = "workspace_1"
  base.leads = [
    createLead({
      nextActionTitle: "Stary task",
      nextActionAt: "2026-04-08T09:00:00.000Z",
      nextActionItemId: "item_1",
    }),
  ]
  base.items = [
    createItem({
      id: "item_1",
      type: "follow_up",
      title: "Stary task",
      scheduledAt: "2026-04-08T09:00:00.000Z",
    }),
  ]

  const remote = toggleItemDoneSnapshot(base, "item_1")
  const incoming = updateItemSnapshot(base, "item_1", {
    title: "Nowy tytuł taska",
    scheduledAt: "2026-04-10T12:00:00.000Z",
  })

  const result = mergeSnapshotsForSync(remote, incoming)
  const mergedItem = result.snapshot.items.find((item) => item.id === "item_1")
  const mergedLead = result.snapshot.leads[0]!
  const computed = buildLeadComputedState(result.snapshot, mergedLead, {
    now: "2026-04-07T08:00:00.000Z",
    timeZone: result.snapshot.settings.timezone,
  })

  assert.equal(result.mergedFromConflict, true)
  assert.ok(mergedItem)
  assert.equal(mergedItem?.status, "done")
  assert.equal(mergedItem?.title, "Nowy tytuł taska")
  assert.equal(mergedItem?.scheduledAt, "2026-04-10T12:00:00.000Z")
  assert.equal(mergedLead.nextActionItemId, null)
  assert.equal(computed.hasNextStep, false)
})

test("sync łączy waiting z jednego klienta i nowy next step z drugiego, a isWaitingTooLong liczy się od nowa", () => {
  const base = createInitialSnapshot()
  base.context.workspaceId = "workspace_1"
  base.leads = [
    createLead({
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    }),
  ]
  base.items = [
    createItem({
      id: "reply_done",
      type: "reply",
      status: "done",
      title: "Odpowiedź na wiadomość",
      scheduledAt: "2026-04-02T09:00:00.000Z",
      updatedAt: "2026-04-02T10:00:00.000Z",
    }),
  ]

  const remote = updateLeadSnapshot(base, "lead_1", { status: "waiting" })
  const incoming = updateLeadSnapshot(base, "lead_1", {
    nextActionTitle: "Sprawdzić odpowiedź",
    nextActionAt: "2026-04-08T10:00:00.000Z",
  })

  const result = mergeSnapshotsForSync(remote, incoming)
  const mergedLead = result.snapshot.leads[0]!
  const computed = buildLeadComputedState(result.snapshot, mergedLead, {
    now: "2026-04-07T08:00:00.000Z",
    timeZone: result.snapshot.settings.timezone,
  })

  assert.equal(result.mergedFromConflict, true)
  assert.equal(mergedLead.status, "waiting")
  assert.equal(mergedLead.nextActionTitle, "Sprawdzić odpowiedź")
  assert.equal(computed.isWaitingTooLong, true)
  assert.equal(computed.riskReason, "waiting_too_long")
})

test("po edycji next stepu dailyPriorityScore jest liczony na nowo na kanonicznym merge", () => {
  const base = createInitialSnapshot()
  base.context.workspaceId = "workspace_1"
  base.leads = [
    createLead({
      value: 9000,
      priority: "high",
      status: "followup_needed",
      nextActionTitle: "Stary follow-up",
      nextActionAt: "2026-04-05T09:00:00.000Z",
      nextActionItemId: "item_1",
      updatedAt: "2026-04-05T09:00:00.000Z",
    }),
  ]
  base.items = [
    createItem({
      id: "item_1",
      type: "follow_up",
      title: "Stary follow-up",
      scheduledAt: "2026-04-05T09:00:00.000Z",
      updatedAt: "2026-04-05T09:00:00.000Z",
    }),
  ]

  const before = buildLeadComputedState(base, base.leads[0]!, {
    now: "2026-04-07T08:00:00.000Z",
    timeZone: base.settings.timezone,
  })

  const remote = updateLeadSnapshot(base, "lead_1", { status: "contacted" })
  const incoming = updateItemSnapshot(base, "item_1", {
    title: "Nowy follow-up",
    scheduledAt: "2026-04-10T11:00:00.000Z",
  })

  const result = mergeSnapshotsForSync(remote, incoming)
  const mergedLead = result.snapshot.leads[0]!
  const after = buildLeadComputedState(result.snapshot, mergedLead, {
    now: "2026-04-07T08:00:00.000Z",
    timeZone: result.snapshot.settings.timezone,
  })

  assert.equal(result.mergedFromConflict, true)
  assert.equal(mergedLead.status, "contacted")
  assert.equal(mergedLead.nextActionAt, "2026-04-10T11:00:00.000Z")
  assert.equal(after.nextStepOverdue, false)
  assert.ok(after.dailyPriorityScore < before.dailyPriorityScore)
})

test("po konflikcie refetch bierze kanoniczny snapshot z serwera bez miksu starego i nowego stanu", () => {
  const local = createInitialSnapshot()
  local.context.workspaceId = "workspace_1"
  local.leads = [
    createLead({
      status: "contacted",
      nextActionTitle: "Stary follow-up",
      nextActionAt: "2026-04-08T09:00:00.000Z",
      nextActionItemId: "item_1",
    }),
  ]
  local.items = [
    createItem({
      id: "item_1",
      title: "Stary follow-up",
      scheduledAt: "2026-04-08T09:00:00.000Z",
    }),
  ]

  const remoteCanonical = cloneSnapshot(local)
  remoteCanonical.leads[0]!.status = "waiting"
  remoteCanonical.leads[0]!.nextActionTitle = "Nowy follow-up"
  remoteCanonical.leads[0]!.nextActionAt = "2026-04-09T12:00:00.000Z"
  remoteCanonical.items[0]!.title = "Nowy follow-up"
  remoteCanonical.items[0]!.scheduledAt = "2026-04-09T12:00:00.000Z"
  remoteCanonical.items[0]!.updatedAt = "2026-04-07T12:05:00.000Z"

  const resolved = resolveSnapshotAfterConflictRefetch(local, remoteCanonical)

  assert.equal(resolved.leads[0]?.status, "waiting")
  assert.equal(resolved.leads[0]?.nextActionTitle, "Nowy follow-up")
  assert.equal(resolved.items[0]?.title, "Nowy follow-up")
  assert.equal(resolved.items[0]?.scheduledAt, "2026-04-09T12:00:00.000Z")
})
