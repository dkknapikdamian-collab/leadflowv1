import type {
  ActivityLogEntry,
  Case,
  CaseStatus,
  Contact,
  Lead,
  TemplateItem,
  CaseItem,
} from "../types"
import { createId, nowIso } from "../utils"

const SALES_STATUSES_ALLOWED_FOR_CASE: Lead["status"][] = ["won"]

function normalizeEmail(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase()
}

function normalizePhone(value: string | null | undefined) {
  return (value ?? "").replace(/[^\d+]/g, "")
}

function normalizeText(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase()
}

function buildCaseTitle(lead: Lead) {
  const company = lead.company.trim()
  if (company) {
    return `Realizacja: ${company}`
  }
  return `Realizacja: ${lead.name}`
}

export function canCreateCaseFromLeadStatus(
  leadStatus: Lead["status"],
  transitionStatus?: CaseStatus,
) {
  if (transitionStatus === "ready_to_start") {
    return true
  }
  return SALES_STATUSES_ALLOWED_FOR_CASE.includes(leadStatus)
}

export function findExistingContactForLead(lead: Lead, contacts: Contact[]) {
  if (lead.contactId) {
    const linked = contacts.find((contact) => contact.id === lead.contactId)
    if (linked) return linked
  }

  const targetEmail = normalizeEmail(lead.email)
  if (targetEmail) {
    const byEmail = contacts.find((contact) => normalizeEmail(contact.email) === targetEmail)
    if (byEmail) return byEmail
  }

  const targetPhone = normalizePhone(lead.phone)
  if (targetPhone) {
    const byPhone = contacts.find((contact) => normalizePhone(contact.phone) === targetPhone)
    if (byPhone) return byPhone
  }

  const targetName = normalizeText(lead.name)
  const targetCompany = normalizeText(lead.company)
  if (targetName || targetCompany) {
    const byNameAndCompany = contacts.find((contact) => {
      const sameName = normalizeText(contact.name) === targetName
      const sameCompany = normalizeText(contact.company) === targetCompany
      return sameName && sameCompany
    })
    if (byNameAndCompany) return byNameAndCompany
  }

  return null
}

function buildContactFromLead(input: {
  lead: Lead
  workspaceId: string
  actorUserId?: string | null
  at: string
}): Contact {
  return {
    id: createId("contact"),
    workspaceId: input.workspaceId,
    createdByUserId: input.actorUserId ?? null,
    name: input.lead.name,
    company: input.lead.company,
    email: input.lead.email,
    phone: input.lead.phone,
    normalizedEmail: normalizeEmail(input.lead.email),
    normalizedPhone: normalizePhone(input.lead.phone),
    createdAt: input.at,
    updatedAt: input.at,
  }
}

function buildCaseFromLead(input: {
  lead: Lead
  workspaceId: string
  contactId: string
  actorUserId?: string | null
  at: string
  status?: CaseStatus
}): Case {
  return {
    id: createId("case"),
    workspaceId: input.workspaceId,
    contactId: input.contactId,
    sourceLeadId: input.lead.id,
    templateId: null,
    createdByUserId: input.actorUserId ?? null,
    ownerUserId: input.actorUserId ?? null,
    title: buildCaseTitle(input.lead),
    description: input.lead.summary || input.lead.notes || "",
    status: input.status ?? "not_started",
    priority: input.lead.priority,
    value: input.lead.value,
    startAt: null,
    dueAt: null,
    closedAt: null,
    createdAt: input.at,
    updatedAt: input.at,
  }
}

function buildCaseItemsFromTemplate(input: {
  workspaceId: string
  caseId: string
  templateItems: TemplateItem[]
  actorUserId?: string | null
  at: string
}): CaseItem[] {
  const sortedTemplateItems = [...input.templateItems].sort((left, right) => left.sortOrder - right.sortOrder)
  return sortedTemplateItems.map((templateItem, index) => ({
    id: createId("case_item"),
    workspaceId: input.workspaceId,
    caseId: input.caseId,
    templateItemId: templateItem.id,
    createdByUserId: input.actorUserId ?? null,
    ownerUserId: input.actorUserId ?? null,
    sortOrder: templateItem.sortOrder || (index + 1) * 100,
    kind: templateItem.kind,
    title: templateItem.title,
    description: templateItem.description,
    status: "none",
    required: templateItem.required,
    dueAt: null,
    completedAt: null,
    createdAt: input.at,
    updatedAt: input.at,
  }))
}

export function createCaseFromLead(input: {
  lead: Lead
  workspaceId: string
  contacts: Contact[]
  actorUserId?: string | null
  caseStatus?: CaseStatus
  templateItems?: TemplateItem[]
  now?: string
}) {
  const at = input.now ?? nowIso()
  const caseStatus = input.caseStatus ?? "not_started"

  if (!canCreateCaseFromLeadStatus(input.lead.status, caseStatus)) {
    throw new Error("lead-status-not-eligible-for-case")
  }

  const existingContact = findExistingContactForLead(input.lead, input.contacts)
  const contact = existingContact ?? buildContactFromLead({
    lead: input.lead,
    workspaceId: input.workspaceId,
    actorUserId: input.actorUserId,
    at,
  })

  const caseRecord = buildCaseFromLead({
    lead: input.lead,
    workspaceId: input.workspaceId,
    contactId: contact.id,
    actorUserId: input.actorUserId,
    at,
    status: caseStatus,
  })

  const caseItems = buildCaseItemsFromTemplate({
    workspaceId: input.workspaceId,
    caseId: caseRecord.id,
    templateItems: input.templateItems ?? [],
    actorUserId: input.actorUserId,
    at,
  })

  const activityLog: ActivityLogEntry[] = [
    {
      id: createId("activity"),
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId ?? null,
      actorContactId: null,
      source: "sales",
      type: "lead_converted_to_case",
      leadId: input.lead.id,
      caseId: caseRecord.id,
      caseItemId: null,
      attachmentId: null,
      approvalId: null,
      notificationId: null,
      payload: {
        caseStatus: caseRecord.status,
        contactId: contact.id,
        usedExistingContact: Boolean(existingContact),
      },
      createdAt: at,
    },
    {
      id: createId("activity"),
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId ?? null,
      actorContactId: null,
      source: "operations",
      type: "case_created",
      leadId: input.lead.id,
      caseId: caseRecord.id,
      caseItemId: null,
      attachmentId: null,
      approvalId: null,
      notificationId: null,
      payload: {
        title: caseRecord.title,
        templateItems: caseItems.length,
      },
      createdAt: at,
    },
  ]

  return {
    contact,
    createdContact: existingContact ? null : contact,
    case: caseRecord,
    caseItems,
    leadPatch: {
      contactId: contact.id,
      caseId: caseRecord.id,
    },
    activityLog,
    usedExistingContact: Boolean(existingContact),
  }
}
