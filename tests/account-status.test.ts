import test from "node:test"
import assert from "node:assert/strict"
import { applyAccessStatusToSnapshot, getAccountStatusPresentation } from "../lib/access/account-status"
import { createInitialSnapshot } from "../lib/seed"
import type { AccessStatusRow } from "../lib/supabase/access-status"

function createRow(patch: Partial<AccessStatusRow>): AccessStatusRow {
  return {
    workspaceId: "workspace-1",
    userId: "user-1",
    accessStatus: "trial_active",
    trialStart: "2026-04-01T10:00:00.000Z",
    trialEnd: "2026-04-09T10:00:00.000Z",
    paidUntil: null,
    gracePeriodEnd: null,
    accessOverrideMode: null,
    accessOverrideExpiresAt: null,
    accessOverrideNote: null,
    billingCustomerId: null,
    billingSubscriptionId: null,
    planName: "Solo",
    bonusCodeUsed: null,
    bonusKind: null,
    bonusAppliedAt: null,
    ...patch,
  }
}

test("applyAccessStatusToSnapshot ustawia trial aktywny i datę końca triala", () => {
  const snapshot = createInitialSnapshot()
  const next = applyAccessStatusToSnapshot(
    snapshot,
    createRow({
      accessStatus: "trial_active",
      trialEnd: "2026-04-09T10:00:00.000Z",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  assert.equal(next.context.accessStatus, "trial_active")
  assert.equal(next.billing.status, "trial")
  assert.equal(next.billing.canCreate, true)
  assert.equal(next.billing.trialEndsAt, "2026-04-09T10:00:00.000Z")
})

test("applyAccessStatusToSnapshot zapisuje override admina w snapshot context", () => {
  const snapshot = createInitialSnapshot()
  const next = applyAccessStatusToSnapshot(
    snapshot,
    createRow({
      accessStatus: "trial_active",
      accessOverrideMode: "admin_unlimited",
      accessOverrideNote: "System admin bypass for primary owner",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  assert.equal(next.context.accessOverrideMode, "admin_unlimited")
  assert.equal(next.context.accessOverrideNote, "System admin bypass for primary owner")
  assert.equal(next.billing.status, "active")
})

test("applyAccessStatusToSnapshot zachowuje ledy, taski, ustawienia i snapshot po czasowej blokadzie", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [
    {
      id: "lead-1",
      workspaceId: null,
      name: "ACME",
      company: "ACME",
      email: "kontakt@acme.pl",
      phone: "+48 600 000 000",
      source: "LinkedIn",
      value: 1500,
      summary: "ważny lead",
      notes: "ważny lead",
      status: "new",
      priority: "high",
      nextActionTitle: "Oddzwonić",
      nextActionAt: "2026-04-08T10:00:00.000Z",
      nextActionItemId: null,
      createdAt: "2026-04-01T08:00:00.000Z",
      updatedAt: "2026-04-01T08:00:00.000Z",
    },
  ]
  snapshot.items = [
    {
      id: "item-1",
      workspaceId: null,
      leadId: "lead-1",
      recordType: "task",
      type: "task",
      title: "Oddzwonić",
      description: "Oddzwonić do ACME",
      status: "todo",
      priority: "high",
      scheduledAt: "2026-04-08T10:00:00.000Z",
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: "2026-04-01T08:00:00.000Z",
      updatedAt: "2026-04-01T08:00:00.000Z",
      showInTasks: true,
      showInCalendar: false,
    },
  ]
  snapshot.settings.workspaceName = "Moje Leady"
  snapshot.settings.theme = "classic"

  const next = applyAccessStatusToSnapshot(
    snapshot,
    createRow({
      accessStatus: "trial_expired",
      trialEnd: "2026-04-05T10:00:00.000Z",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  assert.equal(next.leads.length, 1)
  assert.equal(next.leads[0]?.name, "ACME")
  assert.equal(next.items.length, 1)
  assert.equal(next.items[0]?.title, "Oddzwonić")
  assert.equal(next.settings.workspaceName, "Moje Leady")
  assert.equal(next.settings.theme, "classic")
  assert.equal(next.context.accessStatus, "trial_expired")
  assert.equal(next.billing.status, "past_due")
})

test("getAccountStatusPresentation oznacza trial kończący się wkrótce", () => {
  const snapshot = applyAccessStatusToSnapshot(
    createInitialSnapshot(),
    createRow({
      accessStatus: "trial_active",
      trialEnd: "2026-04-07T10:00:00.000Z",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  const presentation = getAccountStatusPresentation(snapshot, {
    timeZone: "Europe/Warsaw",
    now: new Date("2026-04-06T08:00:00.000Z"),
  })

  assert.equal(presentation.badgeLabel, "Trial")
  assert.equal(presentation.isExpiringSoon, true)
  assert.equal(presentation.isBlocked, false)
})

test("getAccountStatusPresentation dla admin override pokazuje Admin unlimited", () => {
  const snapshot = applyAccessStatusToSnapshot(
    createInitialSnapshot(),
    createRow({
      accessStatus: "trial_active",
      accessOverrideMode: "admin_unlimited",
      accessOverrideNote: "System admin bypass for primary owner",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  const presentation = getAccountStatusPresentation(snapshot, {
    timeZone: "Europe/Warsaw",
    now: new Date("2026-04-06T08:00:00.000Z"),
  })

  assert.equal(presentation.badgeLabel, "Admin unlimited")
  assert.equal(presentation.isBlocked, false)
})

test("getAccountStatusPresentation dla testera pokazuje Tester access", () => {
  const snapshot = applyAccessStatusToSnapshot(
    createInitialSnapshot(),
    createRow({
      accessStatus: "trial_expired",
      accessOverrideMode: "tester_unlimited",
      accessOverrideExpiresAt: "2026-04-10T10:00:00.000Z",
      accessOverrideNote: "Tester access code",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  const presentation = getAccountStatusPresentation(snapshot, {
    timeZone: "Europe/Warsaw",
    now: new Date("2026-04-06T08:00:00.000Z"),
  })

  assert.equal(presentation.badgeLabel, "Tester access")
  assert.equal(presentation.isBlocked, false)
})
