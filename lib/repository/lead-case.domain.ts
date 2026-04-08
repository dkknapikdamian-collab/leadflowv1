import type { ActivityLogRecord, CaseRecordDomain, Contact, Lead, LeadStatus } from "../types"

export interface LeadToCaseInput {
  workspaceId: string
  actorUserId: string | null
  lead: Lead
  existingContacts: Contact[]
  nowIso?: string
}

export interface LeadToCaseResult {
  reusedContactId: string | null
  contactToCreate: Omit<Contact, "id" | "createdAt" | "updatedAt"> | null
  caseToCreate: Omit<CaseRecordDomain, "id" | "createdAt" | "updatedAt">
  leadPatch: Pick<Lead, "caseId" | "contactId">
  activity: Array<Omit<ActivityLogRecord, "id" | "createdAt">>
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

export function canLeadStartCase(status: LeadStatus) {
  return status === "won" || status === "ready_to_start"
}

export function findReusableContact(lead: Lead, contacts: Contact[]) {
  const emailKey = normalize(lead.email)
  const phoneKey = normalize(lead.phone)
  const nameKey = normalize(lead.name)
  const companyKey = normalize(lead.company)

  return (
    contacts.find((contact) => emailKey && normalize(contact.email) === emailKey) ??
    contacts.find((contact) => phoneKey && normalize(contact.phone) === phoneKey) ??
    contacts.find(
      (contact) =>
        nameKey &&
        companyKey &&
        normalize(contact.fullName) === nameKey &&
        normalize(contact.company) === companyKey,
    ) ??
    null
  )
}

export function buildLeadToCaseModel(input: LeadToCaseInput): LeadToCaseResult {
  if (!canLeadStartCase(input.lead.status)) {
    throw new Error("Lead status is not eligible for case creation")
  }

  const nowIso = input.nowIso ?? new Date().toISOString()
  const reusedContact = findReusableContact(input.lead, input.existingContacts)
  const contactId = reusedContact?.id ?? null

  const contactToCreate =
    reusedContact === null
      ? {
          workspaceId: input.workspaceId,
          fullName: input.lead.name,
          company: input.lead.company,
          email: input.lead.email,
          phone: input.lead.phone,
          notes: input.lead.notes,
        }
      : null

  return {
    reusedContactId: contactId,
    contactToCreate,
    caseToCreate: {
      workspaceId: input.workspaceId,
      contactId,
      sourceLeadId: input.lead.id,
      title: input.lead.company ? `${input.lead.company} - start realizacji` : `${input.lead.name} - start realizacji`,
      description: input.lead.summary || input.lead.notes || "",
      salesStatus: input.lead.status,
      operationalStatus: "not_started",
      value: input.lead.value ?? 0,
      startedAt: nowIso,
      dueAt: "",
      closedAt: "",
    },
    leadPatch: {
      caseId: null,
      contactId,
    },
    activity: [
      {
        workspaceId: input.workspaceId,
        actorUserId: input.actorUserId,
        leadId: input.lead.id,
        caseId: null,
        caseItemId: null,
        eventScope: "sales",
        eventType: "lead_to_case_requested",
        eventTitle: "Lead oznaczony do uruchomienia sprawy",
        eventPayload: {
          leadStatus: input.lead.status,
        },
      },
      {
        workspaceId: input.workspaceId,
        actorUserId: input.actorUserId,
        leadId: input.lead.id,
        caseId: null,
        caseItemId: null,
        eventScope: "operations",
        eventType: "case_bootstrap_created",
        eventTitle: "Utworzono szkielet sprawy z leada",
        eventPayload: {
          sourceLeadId: input.lead.id,
          reusedContactId: contactId,
          contactCreated: reusedContact === null,
        },
      },
    ],
  }
}
