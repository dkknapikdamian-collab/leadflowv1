import test from "node:test"
import assert from "node:assert/strict"
import { applyAccessStatusToSnapshot } from "../lib/access/account-status"
import { applyAppDataAction } from "../lib/data/actions"
import { addLeadSnapshot } from "../lib/snapshot"
import { createInitialSnapshot } from "../lib/seed"

function createBlockedSnapshot() {
  return applyAccessStatusToSnapshot(
    createInitialSnapshot(),
    {
      workspaceId: "workspace-1",
      userId: "user-1",
      accessStatus: "trial_expired",
      trialStart: "2026-04-01T10:00:00.000Z",
      trialEnd: "2026-04-05T10:00:00.000Z",
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
    },
    new Date("2026-04-08T10:00:00.000Z"),
  )
}

test("applyAppDataAction po trialu nie pozwala dodac nowego leada", () => {
  const blockedSnapshot = createBlockedSnapshot()
  const next = applyAppDataAction(blockedSnapshot, {
    type: "addLead",
    payload: {
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
    },
  })

  assert.equal(next.leads.length, blockedSnapshot.leads.length)
})

test("applyAppDataAction po trialu nie pozwala utworzyc nowej sprawy", () => {
  const withWonLead = addLeadSnapshot(createBlockedSnapshot(), {
    name: "Klient sprawy",
    company: "",
    email: "",
    phone: "",
    source: "Inne",
    value: 0,
    summary: "",
    notes: "",
    status: "won",
    priority: "medium",
    nextActionTitle: "",
    nextActionAt: "",
  })
  const leadId = withWonLead.leads[0]!.id

  const next = applyAppDataAction(withWonLead, {
    type: "startCaseFromLead",
    leadId,
    mode: "empty",
    templateId: null,
  })

  assert.equal((next.cases ?? []).length, (withWonLead.cases ?? []).length)
})

test("applyAppDataAction w trybie podgladu dalej pozwala aktualizowac ustawienia", () => {
  const blockedSnapshot = createBlockedSnapshot()
  const next = applyAppDataAction(blockedSnapshot, {
    type: "updateSettings",
    patch: { workspaceName: "Nowa nazwa" },
  })

  assert.equal(next.settings.workspaceName, "Nowa nazwa")
})
