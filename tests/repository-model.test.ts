import test from "node:test"
import assert from "node:assert/strict"
import { REPOSITORY_TABLES } from "../lib/repository/schema"
import { createBootstrapRecords } from "../lib/repository/bootstrap"

test("REPOSITORY_TABLES zawiera główne tabele ETAPU 3", () => {
  assert.deepEqual(REPOSITORY_TABLES, {
    profiles: "profiles",
    workspaces: "workspaces",
    workspaceMembers: "workspace_members",
    accessStatus: "access_status",
    settings: "settings",
    contacts: "contacts",
    leads: "leads",
    cases: "cases",
    caseTemplates: "case_templates",
    templateItems: "template_items",
    caseItems: "case_items",
    fileAttachments: "file_attachments",
    approvals: "approvals",
    activityLog: "activity_log",
    notifications: "notifications",
    clientPortalTokens: "client_portal_tokens",
    workItems: "work_items",
  })
})

test("createBootstrapRecords buduje spójny startowy model konta i workspace", () => {
  const records = createBootstrapRecords({
    userId: "user-1",
    workspaceId: "workspace-1",
    normalizedEmail: "damian@example.com",
    email: "damian@example.com",
    displayName: "Damian",
    authProvider: "google",
    emailVerified: true,
    now: "2026-04-06T10:00:00.000Z",
  })

  assert.equal(records.profile.id, "user-1")
  assert.equal(records.profile.signupSource, "google")
  assert.equal(records.profile.isEmailVerified, true)
  assert.equal(records.workspace.id, "workspace-1")
  assert.equal(records.workspace.ownerUserId, "user-1")
  assert.equal(records.workspaceMember.workspaceId, "workspace-1")
  assert.equal(records.accessStatus.workspaceId, "workspace-1")
  assert.equal(records.accessStatus.userId, "user-1")
  assert.equal(records.accessStatus.accessStatus, "trial_active")
  assert.equal(records.accessStatus.trialEnd, "2026-04-13T10:00:00.000Z")
  assert.equal(records.accessStatus.bonusCodeUsed, null)
  assert.equal(records.accessStatus.bonusKind, null)
  assert.equal(records.accessStatus.bonusAppliedAt, null)
  assert.equal(records.settings.workspaceId, "workspace-1")
  assert.equal(records.settings.workspaceName, "LeadFlow")
})
