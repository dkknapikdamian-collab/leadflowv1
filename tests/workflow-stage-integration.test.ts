import test from "node:test"
import assert from "node:assert/strict"
import { createInitialSnapshot } from "../lib/seed"
import { createCaseFromLead } from "../lib/domain/lead-case"
import { buildCasesDashboard } from "../lib/domain/cases-dashboard"
import { buildTodayViewModel } from "../lib/today"
import { canEnterOperationalStageFromWon, getPostSaleProcessOwner } from "../lib/domain/won-case-stage-source"
import { caseCanBeReadyToStart, getReadyToStartAutomation } from "../lib/domain/case-ready-start-source"

test("integracja: lead won przechodzi do case bez utraty historii sprzedaży", () => {
  const snapshot = createInitialSnapshot()
  const lead = {
    id: "lead_won_1",
    workspaceId: "workspace_local",
    contactId: null,
    caseId: null,
    name: "Klient Wygrany",
    company: "Forteca Studio",
    email: "kontakt@forteca.studio",
    phone: "+48 600 700 800",
    source: "Polecenie" as const,
    value: 9000,
    summary: "Lead domknięty sprzedażowo.",
    notes: "Przechodzi do uruchomienia klienta.",
    status: "won" as const,
    priority: "high" as const,
    nextActionTitle: "Start sprawy",
    nextActionAt: "2026-04-10T10:00:00.000Z",
    nextActionItemId: null,
    createdAt: "2026-04-08T09:00:00.000Z",
    updatedAt: "2026-04-09T09:00:00.000Z",
  }

  assert.equal(canEnterOperationalStageFromWon(lead.status), true)

  const templateItems = (snapshot.templateItems ?? []).filter((item) => item.templateId === "tpl_onboarding")
  const transition = createCaseFromLead({
    lead,
    workspaceId: "workspace_local",
    contacts: [],
    actorUserId: "user_1",
    templateId: "tpl_onboarding",
    templateItems,
    now: "2026-04-09T10:00:00.000Z",
  })

  assert.equal(lead.status, "won")
  assert.equal(transition.case.sourceLeadId, lead.id)
  assert.equal(transition.leadPatch.caseId, transition.case.id)
  assert.equal(getPostSaleProcessOwner({ leadStatus: lead.status, hasCaseId: true }), "case")
})

test("integracja: kompletna sprawa trafia do ready_to_start i pojawia się w Today", () => {
  const snapshot = createInitialSnapshot()
  const lead = {
    id: "lead_won_2",
    workspaceId: "workspace_local",
    contactId: null,
    caseId: null,
    name: "Klient Start",
    company: "Ready Start Sp. z o.o.",
    email: "start@ready.pl",
    phone: "+48 601 222 333",
    source: "Strona www" as const,
    value: 12000,
    summary: "Lead gotowy do startu po sprzedaży.",
    notes: "Wszystko dostarczone i zaakceptowane.",
    status: "won" as const,
    priority: "high" as const,
    nextActionTitle: "Uruchomić sprawę",
    nextActionAt: "2026-04-10T12:00:00.000Z",
    nextActionItemId: null,
    createdAt: "2026-04-08T09:00:00.000Z",
    updatedAt: "2026-04-09T09:00:00.000Z",
  }

  const templateItems = (snapshot.templateItems ?? []).filter((item) => item.templateId === "tpl_onboarding")
  const transition = createCaseFromLead({
    lead,
    workspaceId: "workspace_local",
    contacts: [],
    actorUserId: "user_1",
    templateId: "tpl_onboarding",
    templateItems,
    now: "2026-04-09T10:00:00.000Z",
  })

  const automation = getReadyToStartAutomation({
    allRequiredSubmitted: true,
    allRequiredVerified: true,
    allRequiredAccepted: true,
  })

  assert.equal(caseCanBeReadyToStart({
    allRequiredSubmitted: true,
    allRequiredVerified: true,
    allRequiredAccepted: true,
  }), true)

  const readyCase = {
    ...transition.case,
    status: automation.nextStatus,
    blockedByMissingRequired: !automation.removeBlocker,
  }

  const acceptedItems = transition.caseItems.map((item) => ({
    ...item,
    status: "accepted" as const,
  }))

  snapshot.contacts = [transition.contact]
  snapshot.cases = [readyCase]
  snapshot.caseItems = acceptedItems
  snapshot.leads = [
    {
      ...lead,
      contactId: transition.leadPatch.contactId,
      caseId: transition.leadPatch.caseId,
    },
  ]

  const dashboard = buildCasesDashboard(snapshot, { now: "2026-04-10T08:00:00.000Z" })
  assert.equal(dashboard.stats.readyToStart, 1)
  assert.equal(dashboard.cards[0]?.missingElementsCount, 0)
  assert.equal(dashboard.cards[0]?.completenessPercent, 100)

  const today = buildTodayViewModel(snapshot, { now: "2026-04-10T08:00:00.000Z" })
  assert.equal(today.commandCenter.sections.readyToStart.length, 1)
  assert.equal(today.commandCenter.sections.readyToStart[0]?.id, readyCase.id)
})
