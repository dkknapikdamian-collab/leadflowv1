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

test("applyAccessStatusToSnapshot blokuje tworzenie po payment_failed", () => {
  const snapshot = createInitialSnapshot()
  const next = applyAccessStatusToSnapshot(
    snapshot,
    createRow({
      accessStatus: "payment_failed",
      paidUntil: "2026-04-10T10:00:00.000Z",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  assert.equal(next.context.accessStatus, "payment_failed")
  assert.equal(next.billing.status, "past_due")
  assert.equal(next.billing.canCreate, false)
})

test("applyAccessStatusToSnapshot zachowuje ledy, taski, ustawienia i snapshot po czasowej blokadzie", () => {
  const snapshot = createInitialSnapshot()
  snapshot.leads = [
    {
      id: "lead-1",
      workspaceId: "workspace-1",
      name: "ACME",
      company: "ACME",
      email: "",
      phone: "",
      source: "Strona www",
      value: 0,
      summary: "",
      notes: "ważny lead",
      status: "new",
      priority: "high",
      nextActionTitle: "",
      nextActionAt: "",
      nextActionItemId: null,
      createdAt: "2026-04-01T08:00:00.000Z",
      updatedAt: "2026-04-01T08:00:00.000Z",
    },
  ]
  snapshot.items = [
    {
      id: "item-1",
      workspaceId: "workspace-1",
      leadId: "lead-1",
      recordType: "task",
      type: "task",
      title: "Oddzwonić",
      description: "",
      status: "todo",
      priority: "medium",
      scheduledAt: "2026-04-08T08:00:00.000Z",
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

test("getAccountStatusPresentation dla planu aktywnego pokazuje aktywne konto", () => {
  const snapshot = applyAccessStatusToSnapshot(
    createInitialSnapshot(),
    createRow({
      accessStatus: "paid_active",
      paidUntil: "2026-05-01T10:00:00.000Z",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  const presentation = getAccountStatusPresentation(snapshot, {
    timeZone: "Europe/Warsaw",
    now: new Date("2026-04-06T08:00:00.000Z"),
  })

  assert.equal(presentation.badgeLabel, "Aktywne konto")
  assert.equal(presentation.isBlocked, false)
})

test("getAccountStatusPresentation dla anulowanego planu przed końcem okresu nie blokuje od razu", () => {
  const snapshot = applyAccessStatusToSnapshot(
    createInitialSnapshot(),
    createRow({
      accessStatus: "canceled",
      paidUntil: "2026-04-10T10:00:00.000Z",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  const presentation = getAccountStatusPresentation(snapshot, {
    timeZone: "Europe/Warsaw",
    now: new Date("2026-04-06T08:00:00.000Z"),
  })

  assert.equal(presentation.badgeLabel, "Kończy się z końcem okresu")
  assert.equal(presentation.isBlocked, false)
})

test("getAccountStatusPresentation dla trial_expired pokazuje blokadę", () => {
  const snapshot = applyAccessStatusToSnapshot(
    createInitialSnapshot(),
    createRow({
      accessStatus: "trial_expired",
      trialEnd: "2026-04-05T10:00:00.000Z",
    }),
    new Date("2026-04-06T08:00:00.000Z"),
  )

  const presentation = getAccountStatusPresentation(snapshot, {
    timeZone: "Europe/Warsaw",
    now: new Date("2026-04-06T08:00:00.000Z"),
  })

  assert.equal(presentation.badgeLabel, "Trial wygasł")
  assert.equal(presentation.isBlocked, true)
})
