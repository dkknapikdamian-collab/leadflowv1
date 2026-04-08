import assert from "node:assert/strict"
import test from "node:test"
import { buildLeadToCaseModel, canLeadStartCase, findReusableContact } from "../lib/repository/lead-case.domain"
import type { Contact, Lead } from "../lib/types"

const baseLead: Lead = {
  id: "lead-1",
  workspaceId: "ws-1",
  name: "Jan Kowalski",
  company: "Kowalski Studio",
  email: "jan@studio.pl",
  phone: "+48 501 000 111",
  source: "E-mail",
  value: 15000,
  summary: "Start wdrozenia po akceptacji",
  notes: "Klient gotowy na kickoff",
  status: "won",
  priority: "high",
  nextActionTitle: "Kickoff",
  nextActionAt: "2026-04-10T10:00:00.000Z",
  nextActionItemId: null,
  createdAt: "2026-04-08T10:00:00.000Z",
  updatedAt: "2026-04-08T10:00:00.000Z",
}

test("canLeadStartCase pozwala tylko dla won i ready_to_start", () => {
  assert.equal(canLeadStartCase("won"), true)
  assert.equal(canLeadStartCase("ready_to_start"), true)
  assert.equal(canLeadStartCase("new"), false)
  assert.equal(canLeadStartCase("qualification"), false)
})

test("findReusableContact znajduje kontakt po email", () => {
  const contacts: Contact[] = [
    {
      id: "contact-1",
      workspaceId: "ws-1",
      fullName: "Jan Kowalski",
      company: "Kowalski Studio",
      email: "jan@studio.pl",
      phone: "",
      notes: "",
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
  ]

  const result = findReusableContact(baseLead, contacts)
  assert.equal(result?.id, "contact-1")
})

test("buildLeadToCaseModel nie tworzy duplikatu kontaktu, gdy kontakt juz istnieje", () => {
  const contacts: Contact[] = [
    {
      id: "contact-1",
      workspaceId: "ws-1",
      fullName: "Jan Kowalski",
      company: "Kowalski Studio",
      email: "jan@studio.pl",
      phone: "+48 501 000 111",
      notes: "",
      createdAt: "2026-04-08T10:00:00.000Z",
      updatedAt: "2026-04-08T10:00:00.000Z",
    },
  ]

  const result = buildLeadToCaseModel({
    workspaceId: "ws-1",
    actorUserId: "user-1",
    lead: baseLead,
    existingContacts: contacts,
    nowIso: "2026-04-08T12:00:00.000Z",
  })

  assert.equal(result.reusedContactId, "contact-1")
  assert.equal(result.contactToCreate, null)
  assert.equal(result.caseToCreate.sourceLeadId, "lead-1")
  assert.equal(result.caseToCreate.contactId, "contact-1")
})

test("buildLeadToCaseModel tworzy kontakt, gdy brak dopasowania", () => {
  const result = buildLeadToCaseModel({
    workspaceId: "ws-1",
    actorUserId: "user-1",
    lead: { ...baseLead, email: "new@studio.pl", phone: "" },
    existingContacts: [],
    nowIso: "2026-04-08T12:00:00.000Z",
  })

  assert.equal(result.reusedContactId, null)
  assert.ok(result.contactToCreate)
  assert.equal(result.contactToCreate?.email, "new@studio.pl")
  assert.equal(result.caseToCreate.sourceLeadId, "lead-1")
})
