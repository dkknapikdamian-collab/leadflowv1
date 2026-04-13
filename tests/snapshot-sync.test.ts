import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { buildLeadComputedState } from "../lib/domain/lead-state"
import {
  addItemSnapshot,
  addLeadSnapshot,
  deleteItemSnapshot,
  toggleItemDoneSnapshot,
  updateItemSnapshot,
  updateLeadSnapshot,
} from "../lib/snapshot"
import { mergeSnapshotsForSync, resolveSnapshotAfterConflictRefetch } from "../lib/data/snapshot-sync"
import type { Lead, WorkItem } from "../lib/types"

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

test("sync laczy follow-up z telefonu i zmiane statusu leada z laptopa", () => {
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
    nextActionTitle: "Oddzwonic jutro",
    nextActionAt: "2026-04-08T10:00:00.000Z",
  })

  const result = mergeSnapshotsForSync(remote, incoming)
  const mergedLead = result.snapshot.leads.find((lead) => lead.id === leadId)

  assert.equal(result.mergedFromConflict, true)
  assert.ok(mergedLead)
  assert.equal(mergedLead?.status, "contacted")
  assert.equal(mergedLead?.nextActionTitle, "Oddzwonic jutro")
  assert.equal(mergedLead?.nextActionAt, "2026-04-08T10:00:00.000Z")
  assert.equal(typeof mergedLead?.nextActionItemId, "string")
})

test("sync laczy done z telefonu i edycje tego samego taska z laptopa bez utraty zmian", () => {
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
    title: "Nowy tytul taska",
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
  assert.equal(mergedItem?.title, "Nowy tytul taska")
  assert.equal(mergedItem?.scheduledAt, "2026-04-10T12:00:00.000Z")
  assert.equal(mergedLead.nextActionItemId, null)
  assert.equal(computed.hasNextStep, false)
})

test("sync laczy waiting z jednego klienta i nowy next step z drugiego, a isWaitingTooLong liczy sie od nowa", () => {
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
      title: "Odpowiedz na wiadomosc",
      scheduledAt: "2026-04-02T09:00:00.000Z",
      updatedAt: "2026-04-02T10:00:00.000Z",
    }),
  ]

  const remote = updateLeadSnapshot(base, "lead_1", { status: "offer_sent" })
  const incoming = updateLeadSnapshot(base, "lead_1", {
    nextActionTitle: "Sprawdzic odpowiedz",
    nextActionAt: "2026-04-08T10:00:00.000Z",
  })

  const result = mergeSnapshotsForSync(remote, incoming)
  const mergedLead = result.snapshot.leads[0]!
  const computed = buildLeadComputedState(result.snapshot, mergedLead, {
    now: "2026-04-07T08:00:00.000Z",
    timeZone: result.snapshot.settings.timezone,
  })

  assert.equal(result.mergedFromConflict, true)
  assert.equal(mergedLead.status, "offer_sent")
  assert.equal(mergedLead.nextActionTitle, "Sprawdzic odpowiedz")
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
      status: "follow_up",
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
  remoteCanonical.leads[0]!.status = "offer_sent"
  remoteCanonical.leads[0]!.nextActionTitle = "Nowy follow-up"
  remoteCanonical.leads[0]!.nextActionAt = "2026-04-09T12:00:00.000Z"
  remoteCanonical.items[0]!.title = "Nowy follow-up"
  remoteCanonical.items[0]!.scheduledAt = "2026-04-09T12:00:00.000Z"
  remoteCanonical.items[0]!.updatedAt = "2026-04-07T12:05:00.000Z"

  const resolved = resolveSnapshotAfterConflictRefetch(local, remoteCanonical)

  assert.equal(resolved.leads[0]?.status, "offer_sent")
  assert.equal(resolved.leads[0]?.nextActionTitle, "Nowy follow-up")
  assert.equal(resolved.items[0]?.title, "Nowy follow-up")
  assert.equal(resolved.items[0]?.scheduledAt, "2026-04-09T12:00:00.000Z")
})

test("usuniety task nie wraca po merge sync ze starszego snapshotu", () => {
  const base = createInitialSnapshot()
  base.context.workspaceId = "workspace_1"
  base.leads = [
    createLead({
      nextActionTitle: "Task do usuniecia",
      nextActionAt: "2026-04-08T09:00:00.000Z",
      nextActionItemId: "item_1",
    }),
  ]
  base.items = [
    createItem({
      id: "item_1",
      type: "follow_up",
      title: "Task do usuniecia",
      scheduledAt: "2026-04-08T09:00:00.000Z",
    }),
  ]

  const remote = cloneSnapshot(base)
  const incoming = deleteItemSnapshot(base, "item_1")

  const result = mergeSnapshotsForSync(remote, incoming)

  assert.equal(result.snapshot.items.some((item) => item.id === "item_1"), false)
  assert.equal((result.snapshot.deletedWorkItemIds ?? []).includes("item_1"), true)
})

test("refetch po konflikcie nie przywraca lokalnie usunietego taska", () => {
  const base = createInitialSnapshot()
  base.context.workspaceId = "workspace_1"
  base.leads = [
    createLead({
      nextActionTitle: "Task do usuniecia",
      nextActionAt: "2026-04-08T09:00:00.000Z",
      nextActionItemId: "item_1",
    }),
  ]
  base.items = [
    createItem({
      id: "item_1",
      type: "follow_up",
      title: "Task do usuniecia",
      scheduledAt: "2026-04-08T09:00:00.000Z",
    }),
  ]

  const localDeleted = deleteItemSnapshot(base, "item_1")
  const refetchedRemote = cloneSnapshot(base)

  const resolved = resolveSnapshotAfterConflictRefetch(localDeleted, refetchedRemote)

  assert.equal(resolved.items.some((item) => item.id === "item_1"), false)
  assert.equal((resolved.deletedWorkItemIds ?? []).includes("item_1"), true)
})

test("sync nie gubi case lifecycle, tokenow i notification przy konflikcie runtime", () => {
  const base = createInitialSnapshot()
  base.context.workspaceId = "workspace_1"
  base.contacts = [
    {
      id: "contact_1",
      workspaceId: "workspace_1",
      createdByUserId: "user_1",
      name: "Jan Klient",
      company: "Firma",
      email: "jan@example.com",
      phone: "+48123123123",
      normalizedEmail: "jan@example.com",
      normalizedPhone: "+48123123123",
      createdAt: "2026-04-01T08:00:00.000Z",
      updatedAt: "2026-04-01T08:00:00.000Z",
    },
  ]
  base.cases = [
    {
      id: "case_1",
      workspaceId: "workspace_1",
      contactId: "contact_1",
      sourceLeadId: "lead_1",
      templateId: null,
      createdByUserId: "user_1",
      ownerUserId: "user_1",
      title: "Case testowy",
      description: "",
      status: "collecting_materials",
      blockedByMissingRequired: false,
      priority: "high",
      value: 1000,
      startAt: null,
      dueAt: null,
      closedAt: null,
      createdAt: "2026-04-02T08:00:00.000Z",
      updatedAt: "2026-04-02T08:00:00.000Z",
    },
  ]
  base.caseItems = [
    {
      id: "case_item_1",
      workspaceId: "workspace_1",
      caseId: "case_1",
      templateItemId: null,
      createdByUserId: "user_1",
      ownerUserId: "user_1",
      sortOrder: 100,
      kind: "document",
      title: "Umowa",
      description: "",
      status: "request_sent",
      required: true,
      dueAt: null,
      completedAt: null,
      createdAt: "2026-04-02T08:05:00.000Z",
      updatedAt: "2026-04-02T08:05:00.000Z",
    },
  ]
  base.clientPortalTokens = [
    {
      id: "portal_1",
      workspaceId: "workspace_1",
      caseId: "case_1",
      contactId: "contact_1",
      tokenHash: "hash_1",
      createdByUserId: "user_1",
      expiresAt: "2026-05-01T08:00:00.000Z",
      revokedAt: null,
      lastUsedAt: null,
      createdAt: "2026-04-02T08:10:00.000Z",
      updatedAt: "2026-04-02T08:10:00.000Z",
    },
  ]
  base.notifications = []
  base.activityLog = []

  const remote = cloneSnapshot(base)
  remote.cases![0] = {
    ...remote.cases![0]!,
    status: "waiting_for_client",
    blockedByMissingRequired: true,
    updatedAt: "2026-04-07T10:00:00.000Z",
  }
  remote.caseItems![0] = {
    ...remote.caseItems![0]!,
    status: "delivered",
    updatedAt: "2026-04-07T10:00:00.000Z",
  }
  remote.activityLog = [
    {
      id: "activity_remote",
      workspaceId: "workspace_1",
      actorUserId: "user_1",
      actorContactId: null,
      source: "system",
      type: "case_status_changed",
      leadId: "lead_1",
      caseId: "case_1",
      caseItemId: null,
      attachmentId: null,
      approvalId: null,
      notificationId: null,
      payload: { status: "waiting_for_client" },
      createdAt: "2026-04-07T10:00:00.000Z",
    },
  ]

  const incoming = cloneSnapshot(base)
  incoming.notifications = [
    {
      id: "notif_1",
      workspaceId: "workspace_1",
      caseId: "case_1",
      caseItemId: null,
      leadId: "lead_1",
      contactId: "contact_1",
      channel: "in_app",
      status: "queued",
      title: "Przypomnienie",
      body: "Czekamy na klienta",
      scheduledAt: "2026-04-07T11:00:00.000Z",
      sentAt: null,
      readAt: null,
      createdAt: "2026-04-07T11:00:00.000Z",
      updatedAt: "2026-04-07T11:00:00.000Z",
    },
  ]
  incoming.clientPortalTokens![0] = {
    ...incoming.clientPortalTokens![0]!,
    revokedAt: "2026-04-07T11:05:00.000Z",
    updatedAt: "2026-04-07T11:05:00.000Z",
  }
  incoming.activityLog = [
    {
      id: "activity_local",
      workspaceId: "workspace_1",
      actorUserId: "user_1",
      actorContactId: null,
      source: "operations",
      type: "notification_scheduled",
      leadId: "lead_1",
      caseId: "case_1",
      caseItemId: null,
      attachmentId: null,
      approvalId: null,
      notificationId: "notif_1",
      payload: { channel: "in_app" },
      createdAt: "2026-04-07T11:00:00.000Z",
    },
  ]

  const result = mergeSnapshotsForSync(remote, incoming)
  const mergedCase = result.snapshot.cases?.find((entry) => entry.id === "case_1")
  const mergedCaseItem = result.snapshot.caseItems?.find((entry) => entry.id === "case_item_1")
  const mergedToken = result.snapshot.clientPortalTokens?.find((entry) => entry.id === "portal_1")

  assert.equal(result.mergedFromConflict, true)
  assert.equal(mergedCase?.status, "waiting_for_client")
  assert.equal(mergedCase?.blockedByMissingRequired, true)
  assert.equal(mergedCaseItem?.status, "delivered")
  assert.equal(mergedToken?.revokedAt, "2026-04-07T11:05:00.000Z")
  assert.equal(result.snapshot.notifications?.some((entry) => entry.id === "notif_1"), true)
  assert.equal(result.snapshot.activityLog?.some((entry) => entry.id === "activity_remote"), true)
  assert.equal(result.snapshot.activityLog?.some((entry) => entry.id === "activity_local"), true)
})
