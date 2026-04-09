import test from "node:test"
import assert from "node:assert/strict"
import {
  canCreateCaseFromLeadStatus,
  createCaseFromLead,
  findExistingContactForLead,
  getLeadToCaseTransitionState,
} from "../lib/domain/lead-case"
import type { Contact, Lead, TemplateItem } from "../lib/types"

function buildLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_1",
    workspaceId: "workspace_1",
    contactId: null,
    caseId: null,
    name: "Jan Kowalski",
    company: "Kowalski Sp. z o.o.",
    email: "jan@example.com",
    phone: "+48 600 111 222",
    source: "Polecenie",
    value: 12000,
    summary: "Lead domknięty sprzedażowo.",
    notes: "Gotowy do startu operacyjnego.",
    status: "won",
    priority: "high",
    nextActionTitle: "Start realizacji",
    nextActionAt: "2026-04-08T10:00:00.000Z",
    nextActionItemId: null,
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-08T09:00:00.000Z",
    ...overrides,
  }
}

function buildContact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: "contact_1",
    workspaceId: "workspace_1",
    createdByUserId: "user_1",
    name: "Jan Kowalski",
    company: "Kowalski Sp. z o.o.",
    email: "jan@example.com",
    phone: "+48 600 111 222",
    normalizedEmail: "jan@example.com",
    normalizedPhone: "+48600111222",
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-08T09:00:00.000Z",
    ...overrides,
  }
}

test("można utworzyć case dla leada po statusie won", () => {
  assert.equal(canCreateCaseFromLeadStatus("won"), true)
  assert.equal(canCreateCaseFromLeadStatus("contacted"), false)
  assert.equal(canCreateCaseFromLeadStatus("contacted", "ready_to_start"), true)
})

test("duplikat klienta nie powstaje, gdy kontakt już istnieje", () => {
  const lead = buildLead()
  const existingContact = buildContact()
  const matched = findExistingContactForLead(lead, [existingContact])
  assert.equal(matched?.id, existingContact.id)

  const transition = createCaseFromLead({
    lead,
    workspaceId: "workspace_1",
    actorUserId: "user_1",
    contacts: [existingContact],
    now: "2026-04-08T10:30:00.000Z",
  })

  assert.equal(transition.usedExistingContact, true)
  assert.equal(transition.createdContact, null)
  assert.equal(transition.contact.id, existingContact.id)
  assert.equal(transition.leadPatch.contactId, existingContact.id)
  assert.equal(transition.leadPatch.caseId, transition.case.id)
  assert.equal(transition.case.sourceLeadId, lead.id)
  assert.equal(transition.lifecycleState.leadRemainsInSalesHistory, true)
  assert.equal(transition.lifecycleState.activeProcessRecord, "case")
})

test("case dostaje relacje do checklisty i activity log", () => {
  const lead = buildLead({ email: "", phone: "" })
  const templateItems: TemplateItem[] = [
    {
      id: "tpl_item_1",
      workspaceId: "workspace_1",
      templateId: "tpl_1",
      createdByUserId: "user_1",
      sortOrder: 100,
      kind: "checklist",
      title: "Podpisana umowa",
      description: "Sprawdź komplet dokumentów",
      required: true,
      defaultDueOffsetDays: 1,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
    {
      id: "tpl_item_2",
      workspaceId: "workspace_1",
      templateId: "tpl_1",
      createdByUserId: "user_1",
      sortOrder: 200,
      kind: "approval",
      title: "Akceptacja klienta",
      description: "Potwierdzenie zakresu",
      required: true,
      defaultDueOffsetDays: 2,
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
    },
  ]

  const transition = createCaseFromLead({
    lead,
    workspaceId: "workspace_1",
    actorUserId: "user_1",
    contacts: [],
    templateItems,
    now: "2026-04-08T10:30:00.000Z",
  })

  assert.equal(transition.caseItems.length, 2)
  assert.equal(transition.caseItems.every((item) => item.caseId === transition.case.id), true)
  assert.equal(transition.activityLog.length, 2)
  assert.equal(transition.activityLog[0]?.type, "lead_converted_to_case")
  assert.equal(transition.activityLog[1]?.type, "case_created")
  assert.equal(transition.checklistStarted, true)
  assert.equal(transition.canGenerateClientPortalLink, true)
})

test("po won lead zostaje w historii sprzedaży, ale aktywnym rekordem procesu staje się case", () => {
  const lifecycle = getLeadToCaseTransitionState({
    leadStatus: "won",
    hasCaseId: true,
  })

  assert.equal(lifecycle.canEnterOperationalStage, true)
  assert.equal(lifecycle.leadRemainsInSalesHistory, true)
  assert.equal(lifecycle.activeProcessRecord, "case")
})
