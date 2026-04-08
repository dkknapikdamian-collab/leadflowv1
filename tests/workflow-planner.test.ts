import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { buildWorkflowNotificationJobs } from "../lib/mail/workflow-planner"

test("workflow planner tworzy kluczowe powiadomienia operatora i klienta bez spamu", () => {
  const snapshot = createInitialSnapshot()
  snapshot.settings.inAppReminders = true
  snapshot.settings.emailReminders = true
  snapshot.settings.defaultReminder = "every_2_days"

  snapshot.contacts = [
    {
      id: "contact_1",
      workspaceId: "workspace_local",
      createdByUserId: null,
      name: "Klient",
      company: "Firma",
      email: "klient@example.com",
      phone: "",
      normalizedEmail: "klient@example.com",
      normalizedPhone: "",
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.cases = [
    {
      id: "case_1",
      workspaceId: "workspace_local",
      contactId: "contact_1",
      sourceLeadId: null,
      templateId: null,
      createdByUserId: null,
      ownerUserId: "operator_local",
      title: "Sprawa waiting",
      description: "",
      status: "waiting_for_client",
      blockedByMissingRequired: true,
      priority: "high",
      value: 1000,
      startAt: null,
      dueAt: null,
      closedAt: null,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
    {
      id: "case_2",
      workspaceId: "workspace_local",
      contactId: "contact_1",
      sourceLeadId: null,
      templateId: null,
      createdByUserId: null,
      ownerUserId: "operator_local",
      title: "Sprawa ready",
      description: "",
      status: "ready_to_start",
      blockedByMissingRequired: false,
      priority: "medium",
      value: 1000,
      startAt: null,
      dueAt: null,
      closedAt: null,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.caseItems = [
    {
      id: "item_1",
      workspaceId: "workspace_local",
      caseId: "case_1",
      templateItemId: null,
      createdByUserId: null,
      ownerUserId: null,
      sortOrder: 100,
      kind: "file",
      title: "Plik",
      description: "",
      status: "request_sent",
      required: true,
      dueAt: "2026-04-08T12:00:00.000Z",
      completedAt: null,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
    {
      id: "item_2",
      workspaceId: "workspace_local",
      caseId: "case_2",
      templateItemId: null,
      createdByUserId: null,
      ownerUserId: null,
      sortOrder: 100,
      kind: "approval",
      title: "Akceptacja",
      description: "",
      status: "under_review",
      required: true,
      dueAt: null,
      completedAt: null,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.activityLog = [
    {
      id: "activity_old",
      workspaceId: "workspace_local",
      actorUserId: null,
      actorContactId: null,
      source: "system",
      type: "case_item_updated",
      leadId: null,
      caseId: "case_1",
      caseItemId: "item_1",
      attachmentId: null,
      approvalId: null,
      notificationId: null,
      payload: {},
      createdAt: "2026-04-05T09:00:00.000Z",
    },
    {
      id: "activity_upload",
      workspaceId: "workspace_local",
      actorUserId: null,
      actorContactId: null,
      source: "system",
      type: "file_uploaded",
      leadId: null,
      caseId: "case_1",
      caseItemId: "item_1",
      attachmentId: null,
      approvalId: null,
      notificationId: null,
      payload: {},
      createdAt: "2026-04-08T07:00:00.000Z",
    },
  ]
  snapshot.clientPortalTokens = [
    {
      id: "token_1",
      workspaceId: "workspace_local",
      caseId: "case_1",
      contactId: "contact_1",
      tokenHash: "abc",
      createdByUserId: null,
      expiresAt: "2026-05-08T09:00:00.000Z",
      revokedAt: null,
      lastUsedAt: null,
      createdAt: "2026-04-08T06:00:00.000Z",
      updatedAt: "2026-04-08T06:00:00.000Z",
    },
  ]

  const jobs = buildWorkflowNotificationJobs({
    snapshot,
    operatorEmail: "operator@example.com",
    operatorDisplayName: "Operator",
    existingDedupeKeys: new Set(),
    now: "2026-04-08T10:00:00.000Z",
  })

  const kinds = new Set(jobs.map((job) => job.kind))
  assert.equal(kinds.has("operator_client_inactive"), true)
  assert.equal(kinds.has("operator_client_uploaded_file"), true)
  assert.equal(kinds.has("operator_verification_required"), true)
  assert.equal(kinds.has("operator_case_ready_to_start"), true)
  assert.equal(kinds.has("client_missing_items_reminder"), true)
  assert.equal(kinds.has("client_due_soon"), true)
  assert.equal(kinds.has("client_link_sent"), true)
  assert.equal(jobs.every((job) => job.title.length > 0 && job.body.length > 0), true)
})

test("workflow planner pomija dedupe i nie duplikuje wysylek", () => {
  const snapshot = createInitialSnapshot()
  snapshot.settings.inAppReminders = true
  snapshot.settings.emailReminders = true
  snapshot.contacts = [
    {
      id: "contact_1",
      workspaceId: "workspace_local",
      createdByUserId: null,
      name: "Klient",
      company: "Firma",
      email: "klient@example.com",
      phone: "",
      normalizedEmail: "klient@example.com",
      normalizedPhone: "",
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.cases = [
    {
      id: "case_1",
      workspaceId: "workspace_local",
      contactId: "contact_1",
      sourceLeadId: null,
      templateId: null,
      createdByUserId: null,
      ownerUserId: "operator_local",
      title: "Sprawa waiting",
      description: "",
      status: "waiting_for_client",
      blockedByMissingRequired: true,
      priority: "high",
      value: 1000,
      startAt: null,
      dueAt: null,
      closedAt: null,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.caseItems = [
    {
      id: "item_1",
      workspaceId: "workspace_local",
      caseId: "case_1",
      templateItemId: null,
      createdByUserId: null,
      ownerUserId: null,
      sortOrder: 100,
      kind: "file",
      title: "Plik",
      description: "",
      status: "request_sent",
      required: true,
      dueAt: null,
      completedAt: null,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]
  snapshot.activityLog = [
    {
      id: "activity_old",
      workspaceId: "workspace_local",
      actorUserId: null,
      actorContactId: null,
      source: "system",
      type: "case_item_updated",
      leadId: null,
      caseId: "case_1",
      caseItemId: "item_1",
      attachmentId: null,
      approvalId: null,
      notificationId: null,
      payload: {},
      createdAt: "2026-04-05T09:00:00.000Z",
    },
  ]

  const key = "wf:operator-client-inactive:workspace_local:case_1:2026-04-08"
  const jobs = buildWorkflowNotificationJobs({
    snapshot,
    operatorEmail: "operator@example.com",
    operatorDisplayName: "Operator",
    existingDedupeKeys: new Set([key]),
    now: "2026-04-08T10:00:00.000Z",
  })

  assert.equal(jobs.some((job) => job.dedupeKey === key), false)
})
