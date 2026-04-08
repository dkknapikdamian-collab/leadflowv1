import { createInitialSnapshot } from "./seed"
import { createCaseFromLead } from "./domain/lead-case"
import type {
  AppNotification,
  ActivityLogEntry,
  AppSnapshot,
  BillingState,
  Case,
  CaseItem,
  CaseItemStatus,
  CaseTemplate,
  CaseTemplateServiceType,
  CaseStatus,
  ClientPortalToken,
  Contact,
  Lead,
  LeadInput,
  SettingsPatch,
  TemplateItem,
  WorkItem,
  WorkItemInput,
} from "./types"
import { cloneSnapshot, createId, getItemPrimaryDate, nowIso } from "./utils"

const EMPTY_LEAD_TEMPLATE: Lead = {
  id: "",
  workspaceId: null,
  contactId: null,
  caseId: null,
  name: "",
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
  nextActionItemId: null,
  createdAt: "",
  updatedAt: "",
}

const EMPTY_ITEM_TEMPLATE: WorkItem = {
  id: "",
  workspaceId: null,
  leadId: null,
  leadLabel: "",
  recordType: "task",
  type: "task",
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  scheduledAt: "",
  startAt: "",
  endAt: "",
  recurrence: "none",
  reminder: "none",
  createdAt: "",
  updatedAt: "",
  showInTasks: true,
  showInCalendar: false,
}

const LEAD_NEXT_ACTION_PATCH_KEYS: Array<keyof Lead> = [
  "nextActionTitle",
  "nextActionAt",
  "nextActionItemId",
]

const CASE_COMPLETENESS_CHECK_DAYS = 2
const DONE_CASE_ITEM_STATUSES = new Set<CaseItemStatus>(["accepted", "not_applicable"])
const PENDING_CASE_ITEM_STATUSES = new Set<CaseItemStatus>(["none", "request_sent", "delivered"])

function normalizeLead(lead: Partial<Lead> | undefined, initialLead: Lead): Lead {
  return {
    ...initialLead,
    ...lead,
    workspaceId: typeof lead?.workspaceId === "string" ? lead.workspaceId : initialLead.workspaceId ?? null,
    contactId: typeof lead?.contactId === "string" ? lead.contactId : initialLead.contactId ?? null,
    caseId: typeof lead?.caseId === "string" ? lead.caseId : initialLead.caseId ?? null,
    value: typeof lead?.value === "number" && Number.isFinite(lead.value) ? lead.value : initialLead.value,
    nextActionItemId: typeof lead?.nextActionItemId === "string" ? lead.nextActionItemId : null,
  }
}

function normalizeItem(item: Partial<WorkItem> | undefined, initialItem: WorkItem): WorkItem {
  return {
    ...initialItem,
    ...item,
    workspaceId: typeof item?.workspaceId === "string" ? item.workspaceId : initialItem.workspaceId ?? null,
    leadId: typeof item?.leadId === "string" ? item.leadId : initialItem.leadId ?? null,
    leadLabel: typeof item?.leadLabel === "string" ? normalizeLeadLabel(item.leadLabel) : initialItem.leadLabel,
  }
}

function normalizeLeadLabel(value: string | null | undefined) {
  return value?.trim() ?? ""
}

function isLikelyLegacyDemoSnapshot(parsed: Partial<AppSnapshot>) {
  return parsed.context?.seedKind === "demo"
}

function normalizeItemLeadRelation(item: WorkItem, leads: Lead[]): WorkItem {
  if (item.leadId) {
    const linkedLead = leads.find((lead) => lead.id === item.leadId)
    if (linkedLead) {
      return {
        ...item,
        leadId: linkedLead.id,
        leadLabel: linkedLead.name,
      }
    }
  }

  return {
    ...item,
    leadId: null,
    leadLabel: "",
  }
}

function sortItemsForLead(a: WorkItem, b: WorkItem) {
  const left = getItemPrimaryDate(a)
  const right = getItemPrimaryDate(b)
  return left.localeCompare(right) || a.createdAt.localeCompare(b.createdAt)
}

function isActiveNextActionItem(item: WorkItem | null | undefined, leadId: string) {
  return Boolean(item && item.leadId === leadId && item.status !== "done")
}

function getFallbackLeadNextActionItemId(items: WorkItem[], leadId: string) {
  return items
    .filter((item) => item.leadId === leadId && item.status !== "done")
    .sort(sortItemsForLead)[0]?.id ?? null
}

function synchronizeLeadSnapshot(leads: Lead[], items: WorkItem[]) {
  return leads.map((lead) => {
    const linkedItemCandidate = lead.nextActionItemId
      ? items.find((item) => item.id === lead.nextActionItemId && item.leadId === lead.id)
      : null
    const linkedItem = isActiveNextActionItem(linkedItemCandidate, lead.id) ? linkedItemCandidate : null
    const fallbackId = linkedItem ? null : getFallbackLeadNextActionItemId(items, lead.id)
    const effectiveItem = linkedItem ?? (fallbackId ? items.find((item) => item.id === fallbackId) ?? null : null)

    return {
      ...lead,
      nextActionItemId: effectiveItem?.id ?? null,
      nextActionTitle: effectiveItem?.title ?? "",
      nextActionAt: effectiveItem ? getItemPrimaryDate(effectiveItem) : "",
    }
  })
}

function migrateLegacyLeadActionItems(leads: Lead[], items: WorkItem[]) {
  const nextLeads = leads.map((lead) => ({ ...lead }))
  const nextItems = [...items]

  nextLeads.forEach((lead) => {
    const hasRequestedAction = Boolean(lead.nextActionTitle.trim() && lead.nextActionAt)
    if (!hasRequestedAction) return

    const linkedItem = lead.nextActionItemId
      ? nextItems.find((item) => item.id === lead.nextActionItemId && item.leadId === lead.id)
      : null
    if (linkedItem) return

    const matchedItem = nextItems.find(
      (item) => item.leadId === lead.id && item.title === lead.nextActionTitle.trim() && getItemPrimaryDate(item) === lead.nextActionAt,
    )

    if (matchedItem) {
      lead.nextActionItemId = matchedItem.id
      return
    }

    const created = createLinkedNextActionItem(lead.id, lead, lead.updatedAt || lead.createdAt || nowIso())
    nextItems.unshift(created)
    lead.nextActionItemId = created.id
  })

  return { leads: nextLeads, items: nextItems }
}

export function reconcileAppSnapshot(snapshot: AppSnapshot): AppSnapshot {
  const items = snapshot.items.map((item) => normalizeItemLeadRelation(item, snapshot.leads))
  const leads = synchronizeLeadSnapshot(snapshot.leads, items)
  return {
    ...snapshot,
    leads,
    items,
  }
}

function enforceLinkedNextActionItemShape(
  item: WorkItem,
  leadId: string,
  workspaceId: string | null | undefined,
  leadLabel: string,
): WorkItem {
  return {
    ...item,
    workspaceId: workspaceId ?? item.workspaceId ?? null,
    leadId,
    leadLabel,
    recordType: "task",
    type: "task",
    showInTasks: true,
    showInCalendar: true,
  }
}

function createLinkedNextActionItem(
  leadId: string,
  lead: Pick<Lead, "name" | "nextActionTitle" | "nextActionAt" | "priority" | "workspaceId">,
  now: string,
): WorkItem {
  return enforceLinkedNextActionItemShape(
    {
      ...EMPTY_ITEM_TEMPLATE,
      id: createId("item"),
      workspaceId: lead.workspaceId ?? null,
      leadId,
      leadLabel: "",
      recordType: "task",
      type: "task",
      title: lead.nextActionTitle.trim(),
      description: "",
      status: "todo",
      priority: lead.priority,
      scheduledAt: lead.nextActionAt,
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: now,
      updatedAt: now,
      showInTasks: true,
      showInCalendar: true,
    },
    leadId,
    lead.workspaceId,
    lead.name,
  )
}

function addDaysIso(baseIso: string, days: number) {
  const base = Date.parse(baseIso)
  const ms = Number.isFinite(base) ? base : Date.now()
  return new Date(ms + days * 24 * 60 * 60 * 1000).toISOString()
}

function createOwnerAutomationTask(input: {
  snapshot: AppSnapshot
  title: string
  description: string
  scheduledAt: string
  priority: WorkItem["priority"]
  leadId?: string | null
  marker: string
}) {
  const markerTag = `[auto:${input.marker}]`
  const hasOpenTask = input.snapshot.items.some(
    (item) =>
      item.status !== "done"
      && item.recordType === "task"
      && item.description.includes(markerTag),
  )
  if (hasOpenTask) return null

  const now = nowIso()
  return normalizeItemLeadRelation(
    {
      ...EMPTY_ITEM_TEMPLATE,
      id: createId("item"),
      workspaceId: input.snapshot.context.workspaceId ?? null,
      leadId: input.leadId ?? null,
      leadLabel: "",
      recordType: "task",
      type: "task",
      title: input.title,
      description: `${input.description}\n${markerTag}`,
      status: "todo",
      priority: input.priority,
      scheduledAt: input.scheduledAt,
      startAt: "",
      endAt: "",
      recurrence: "none",
      reminder: "none",
      createdAt: now,
      updatedAt: now,
      showInTasks: true,
      showInCalendar: false,
    },
    input.snapshot.leads,
  )
}

function createSystemActivity(
  snapshot: AppSnapshot,
  caseId: string,
  type: ActivityLogEntry["type"],
  payload: Record<string, unknown>,
  caseItemId?: string | null,
): ActivityLogEntry {
  return {
    id: createId("activity"),
    workspaceId: snapshot.context.workspaceId ?? "workspace_local",
    actorUserId: snapshot.context.userId,
    actorContactId: null,
    source: "system",
    type,
    leadId: null,
    caseId,
    caseItemId: caseItemId ?? null,
    attachmentId: null,
    approvalId: null,
    notificationId: null,
    payload,
    createdAt: nowIso(),
  }
}

function createSystemNotification(
  snapshot: AppSnapshot,
  input: {
    caseId: string
    caseItemId?: string | null
    channel: AppNotification["channel"]
    status?: AppNotification["status"]
    title: string
    body: string
  },
): AppNotification {
  const now = nowIso()
  return {
    id: createId("notif"),
    workspaceId: snapshot.context.workspaceId ?? "workspace_local",
    caseId: input.caseId,
    caseItemId: input.caseItemId ?? null,
    leadId: null,
    contactId: null,
    channel: input.channel,
    status: input.status ?? "queued",
    title: input.title,
    body: input.body,
    scheduledAt: now,
    sentAt: null,
    readAt: null,
    createdAt: now,
    updatedAt: now,
  }
}

function hasNonNextActionLeadPatch(patch: Partial<Lead>) {
  return Object.keys(patch).some((key) => !LEAD_NEXT_ACTION_PATCH_KEYS.includes(key as keyof Lead))
}

function shouldUpdateLinkedNextActionItem(patch: Partial<Lead>) {
  return "nextActionTitle" in patch || "nextActionAt" in patch || "priority" in patch
}

export function loadSnapshot(raw: string | null | undefined): AppSnapshot {
  const initial = createInitialSnapshot()
  if (!raw) return initial

  try {
    const parsed = JSON.parse(raw) as Partial<AppSnapshot>
    if (isLikelyLegacyDemoSnapshot(parsed)) return initial

    const leads = Array.isArray(parsed.leads)
      ? parsed.leads.map((lead) => normalizeLead(lead, EMPTY_LEAD_TEMPLATE))
      : initial.leads

    const items = Array.isArray(parsed.items)
      ? parsed.items
          .map((item) => normalizeItem(item, EMPTY_ITEM_TEMPLATE))
          .map((item) => normalizeItemLeadRelation(item, leads))
      : initial.items.map((item) => normalizeItemLeadRelation(item, leads))

    const migrated = migrateLegacyLeadActionItems(leads, items)

    return reconcileAppSnapshot({
      ...initial,
      ...parsed,
      user: {
        ...initial.user,
        ...parsed.user,
      },
      context: {
        ...initial.context,
        ...parsed.context,
      },
      billing: {
        ...initial.billing,
        ...parsed.billing,
      },
      settings: {
        ...initial.settings,
        ...parsed.settings,
      },
      leads: migrated.leads,
      items: migrated.items,
    })
  } catch {
    return initial
  }
}

export function addLeadSnapshot(snapshot: AppSnapshot, payload: LeadInput): AppSnapshot {
  const date = nowIso()
  const nextLeadId = createId("lead")
  const normalizedPayload = normalizeLead(payload, EMPTY_LEAD_TEMPLATE)

  let nextItems = snapshot.items
  let nextActionItemId: string | null = null

  if (normalizedPayload.nextActionTitle.trim() && normalizedPayload.nextActionAt) {
    const linkedItem = createLinkedNextActionItem(nextLeadId, { ...normalizedPayload, workspaceId: snapshot.context.workspaceId ?? null }, date)
    nextActionItemId = linkedItem.id
    nextItems = [linkedItem, ...nextItems]
  }

  const nextLead: Lead = {
    ...normalizedPayload,
    id: nextLeadId,
    workspaceId: snapshot.context.workspaceId ?? null,
    nextActionItemId,
    createdAt: date,
    updatedAt: date,
  }

  return reconcileAppSnapshot({
    ...snapshot,
    leads: [nextLead, ...snapshot.leads],
    items: nextItems,
  })
}

export function updateLeadSnapshot(snapshot: AppSnapshot, leadId: string, patch: Partial<Lead>): AppSnapshot {
  const currentLead = snapshot.leads.find((lead) => lead.id === leadId)
  if (!currentLead) return snapshot

  const leadUpdatedAt = hasNonNextActionLeadPatch(patch) ? nowIso() : currentLead.updatedAt

  const mergedLead: Lead = {
    ...currentLead,
    ...patch,
    updatedAt: leadUpdatedAt,
  }

  let nextItems = [...snapshot.items]
  const linkedItem = currentLead.nextActionItemId
    ? nextItems.find((item) => item.id === currentLead.nextActionItemId && item.leadId === leadId)
    : null
  const wantsLinkedAction = Boolean(mergedLead.nextActionTitle.trim() && mergedLead.nextActionAt)

  if (wantsLinkedAction) {
    if (linkedItem) {
      if (shouldUpdateLinkedNextActionItem(patch)) {
        nextItems = nextItems.map((item) =>
          item.id === linkedItem.id
            ? enforceLinkedNextActionItemShape(
                {
                  ...item,
                  title: mergedLead.nextActionTitle.trim(),
                  priority: mergedLead.priority,
                  scheduledAt: item.startAt ? item.scheduledAt : mergedLead.nextActionAt,
                  startAt: item.startAt ? mergedLead.nextActionAt : item.startAt,
                  endAt: item.endAt && item.startAt ? mergedLead.nextActionAt : item.endAt,
                  updatedAt: nowIso(),
                },
                leadId,
                mergedLead.workspaceId,
                mergedLead.name,
              )
            : item,
        )
      }
      mergedLead.nextActionItemId = linkedItem.id
    } else {
      const created = createLinkedNextActionItem(leadId, mergedLead, nowIso())
      nextItems = [created, ...nextItems]
      mergedLead.nextActionItemId = created.id
    }
  } else if (linkedItem) {
    nextItems = nextItems.filter((item) => item.id !== linkedItem.id)
    mergedLead.nextActionItemId = null
  } else {
    mergedLead.nextActionItemId = null
  }

  const nextLeads = snapshot.leads.map((lead) => (lead.id === leadId ? mergedLead : lead))
  const updatedSnapshot = reconcileAppSnapshot({
    ...snapshot,
    leads: nextLeads,
    items: nextItems,
  })

  const movedToWon = currentLead.status !== "won" && mergedLead.status === "won"
  const shouldAutoCreateCase = movedToWon && !mergedLead.caseId
  if (!shouldAutoCreateCase) return updatedSnapshot

  return startCaseFromLeadSnapshot(updatedSnapshot, {
    leadId,
    mode: "template_with_link",
  })
}

export function deleteLeadSnapshot(snapshot: AppSnapshot, leadId: string): AppSnapshot {
  return reconcileAppSnapshot({
    ...snapshot,
    leads: snapshot.leads.filter((lead) => lead.id !== leadId),
    items: snapshot.items.filter((item) => item.leadId !== leadId),
  })
}

export function addItemSnapshot(snapshot: AppSnapshot, payload: WorkItemInput): AppSnapshot {
  const date = nowIso()
  const nextItem = normalizeItemLeadRelation(
    {
      ...payload,
      id: createId("item"),
      workspaceId: payload.workspaceId ?? snapshot.context.workspaceId ?? null,
      createdAt: date,
      updatedAt: date,
    },
    snapshot.leads,
  )

  return reconcileAppSnapshot({
    ...snapshot,
    items: [nextItem, ...snapshot.items],
  })
}

export function updateItemSnapshot(snapshot: AppSnapshot, itemId: string, patch: Partial<WorkItem>): AppSnapshot {
  const ownerLead = snapshot.leads.find((lead) => lead.nextActionItemId === itemId) ?? null

  return reconcileAppSnapshot({
    ...snapshot,
    items: snapshot.items.map((item) => {
      if (item.id !== itemId) return item

      const nextItem = normalizeItemLeadRelation(
        {
          ...item,
          ...patch,
          updatedAt: nowIso(),
        },
        snapshot.leads,
      )

      if (!ownerLead) return nextItem
      return enforceLinkedNextActionItemShape(nextItem, ownerLead.id, ownerLead.workspaceId, ownerLead.name)
    }),
  })
}

export function deleteItemSnapshot(snapshot: AppSnapshot, itemId: string): AppSnapshot {
  return reconcileAppSnapshot({
    ...snapshot,
    items: snapshot.items.filter((item) => item.id !== itemId),
  })
}

export function toggleItemDoneSnapshot(snapshot: AppSnapshot, itemId: string): AppSnapshot {
  return reconcileAppSnapshot({
    ...snapshot,
    items: snapshot.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status: item.status === "done" ? "todo" : "done",
            updatedAt: nowIso(),
          }
        : item,
    ),
  })
}

export function snoozeItemSnapshot(snapshot: AppSnapshot, itemId: string, nextDate: string): AppSnapshot {
  const updatedAt = nowIso()

  return reconcileAppSnapshot({
    ...snapshot,
    items: snapshot.items.map((item) => {
      if (item.id !== itemId) return item

      const isEvent = item.recordType === "event" || Boolean(item.startAt)
      if (!isEvent) {
        return {
          ...item,
          status: "snoozed",
          scheduledAt: nextDate,
          startAt: "",
          endAt: "",
          updatedAt,
        }
      }

      const sourceStart = Date.parse(item.startAt || item.scheduledAt || nextDate)
      const sourceEnd = Date.parse(item.endAt)
      const nextStart = Date.parse(nextDate)
      const defaultDurationMs = 30 * 60 * 1000
      const durationMs = Number.isFinite(sourceStart) && Number.isFinite(sourceEnd) && sourceEnd > sourceStart
        ? sourceEnd - sourceStart
        : defaultDurationMs
      const nextEnd = Number.isFinite(nextStart)
        ? new Date(nextStart + durationMs).toISOString()
        : nextDate

      return {
        ...item,
        status: "snoozed",
        scheduledAt: "",
        startAt: nextDate,
        endAt: nextEnd,
        updatedAt,
      }
    }),
  })
}

export function updateBillingSnapshot(snapshot: AppSnapshot, patch: Partial<BillingState>): AppSnapshot {
  return {
    ...snapshot,
    billing: {
      ...snapshot.billing,
      ...patch,
    },
  }
}

export function updateSettingsSnapshot(snapshot: AppSnapshot, patch: SettingsPatch): AppSnapshot {
  return {
    ...snapshot,
    settings: {
      ...snapshot.settings,
      ...patch,
    },
  }
}

export interface StartCaseFromLeadSnapshotInput {
  leadId: string
  mode: "empty" | "template" | "template_with_link"
  templateId?: string | null
}

function resolveWorkspaceId(snapshot: AppSnapshot, lead: Lead) {
  return lead.workspaceId || snapshot.context.workspaceId || "workspace_local"
}

function normalizeTemplateCode(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function nextTemplateSortOrder(items: TemplateItem[]) {
  const max = items.reduce((acc, entry) => Math.max(acc, entry.sortOrder), 0)
  return max + 100
}

function normalizeTemplateDefaults(templates: CaseTemplate[]) {
  const byServiceType = new Map<CaseTemplateServiceType, string>()
  templates.forEach((entry) => {
    if (!entry.isDefault) return
    if (!byServiceType.has(entry.serviceType)) {
      byServiceType.set(entry.serviceType, entry.id)
    }
  })

  return templates.map((entry) => {
    const expectedDefaultId = byServiceType.get(entry.serviceType)
    if (!expectedDefaultId) return entry
    return {
      ...entry,
      isDefault: entry.id === expectedDefaultId,
    }
  })
}

function getTemplateCollection(snapshot: AppSnapshot) {
  return [...(snapshot.caseTemplates ?? [])]
}

function getTemplateItemCollection(snapshot: AppSnapshot) {
  return [...(snapshot.templateItems ?? [])]
}

function ensureWorkspaceId(snapshot: AppSnapshot, fallback = "workspace_local") {
  return snapshot.context.workspaceId ?? fallback
}

export interface CreateCaseTemplateInput {
  title: string
  description: string
  serviceType: CaseTemplateServiceType
}

export function addCaseTemplateSnapshot(snapshot: AppSnapshot, input: CreateCaseTemplateInput): AppSnapshot {
  const now = nowIso()
  const templates = getTemplateCollection(snapshot)
  const sameType = templates.filter((entry) => entry.serviceType === input.serviceType)
  const nextTemplate: CaseTemplate = {
    id: createId("tpl"),
    workspaceId: ensureWorkspaceId(snapshot),
    createdByUserId: snapshot.context.userId,
    code: normalizeTemplateCode(input.title) || createId("template"),
    title: input.title.trim() || "Nowy szablon",
    description: input.description.trim(),
    serviceType: input.serviceType,
    isDefault: sameType.length === 0,
    createdAt: now,
    updatedAt: now,
  }

  return {
    ...snapshot,
    caseTemplates: normalizeTemplateDefaults([nextTemplate, ...templates]),
  }
}

export function updateCaseTemplateSnapshot(snapshot: AppSnapshot, templateId: string, patch: Partial<CaseTemplate>): AppSnapshot {
  const now = nowIso()
  const templates = getTemplateCollection(snapshot)
  if (!templates.some((entry) => entry.id === templateId)) return snapshot

  const updated = templates.map((entry) => {
    if (entry.id !== templateId) return entry
    const nextTitle = typeof patch.title === "string" ? patch.title.trim() : entry.title
    return {
      ...entry,
      ...patch,
      title: nextTitle || entry.title,
      code: typeof patch.code === "string" ? normalizeTemplateCode(patch.code) || entry.code : entry.code,
      updatedAt: now,
    }
  })

  return {
    ...snapshot,
    caseTemplates: normalizeTemplateDefaults(updated),
  }
}

export function duplicateCaseTemplateSnapshot(snapshot: AppSnapshot, templateId: string): AppSnapshot {
  const sourceTemplate = (snapshot.caseTemplates ?? []).find((entry) => entry.id === templateId)
  if (!sourceTemplate) return snapshot

  const now = nowIso()
  const nextTemplateId = createId("tpl")
  const sourceItems = (snapshot.templateItems ?? []).filter((entry) => entry.templateId === templateId)
  const duplicatedTemplate: CaseTemplate = {
    ...sourceTemplate,
    id: nextTemplateId,
    code: `${normalizeTemplateCode(sourceTemplate.code)}_copy`,
    title: `${sourceTemplate.title} (kopia)`,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
  }

  const duplicatedItems = sourceItems.map((entry) => ({
    ...entry,
    id: createId("tpl_item"),
    templateId: nextTemplateId,
    createdAt: now,
    updatedAt: now,
  }))

  return {
    ...snapshot,
    caseTemplates: [duplicatedTemplate, ...(snapshot.caseTemplates ?? [])],
    templateItems: [...duplicatedItems, ...(snapshot.templateItems ?? [])],
  }
}

export function setDefaultCaseTemplateSnapshot(snapshot: AppSnapshot, templateId: string): AppSnapshot {
  const templates = getTemplateCollection(snapshot)
  const selected = templates.find((entry) => entry.id === templateId)
  if (!selected) return snapshot

  const updated = templates.map((entry) => {
    if (entry.serviceType !== selected.serviceType) return entry
    return {
      ...entry,
      isDefault: entry.id === selected.id,
      updatedAt: nowIso(),
    }
  })

  return {
    ...snapshot,
    caseTemplates: updated,
  }
}

export interface CreateTemplateItemInput {
  templateId: string
  title: string
  description: string
  kind: TemplateItem["kind"]
  required: boolean
}

export function addTemplateItemSnapshot(snapshot: AppSnapshot, input: CreateTemplateItemInput): AppSnapshot {
  const template = (snapshot.caseTemplates ?? []).find((entry) => entry.id === input.templateId)
  if (!template) return snapshot
  const now = nowIso()
  const collection = getTemplateItemCollection(snapshot)
  const inTemplate = collection.filter((entry) => entry.templateId === input.templateId)

  const nextItem: TemplateItem = {
    id: createId("tpl_item"),
    workspaceId: template.workspaceId,
    templateId: input.templateId,
    createdByUserId: snapshot.context.userId,
    sortOrder: nextTemplateSortOrder(inTemplate),
    kind: input.kind,
    title: input.title.trim() || "Nowa pozycja",
    description: input.description.trim(),
    required: input.required,
    defaultDueOffsetDays: null,
    createdAt: now,
    updatedAt: now,
  }

  return {
    ...snapshot,
    templateItems: [...collection, nextItem],
  }
}

export function updateTemplateItemSnapshot(snapshot: AppSnapshot, templateItemId: string, patch: Partial<TemplateItem>): AppSnapshot {
  const now = nowIso()
  const items = getTemplateItemCollection(snapshot)
  if (!items.some((entry) => entry.id === templateItemId)) return snapshot

  return {
    ...snapshot,
    templateItems: items.map((entry) => {
      if (entry.id !== templateItemId) return entry
      return {
        ...entry,
        ...patch,
        title: typeof patch.title === "string" ? patch.title.trim() || entry.title : entry.title,
        description: typeof patch.description === "string" ? patch.description.trim() : entry.description,
        updatedAt: now,
      }
    }),
  }
}

export function deleteTemplateItemSnapshot(snapshot: AppSnapshot, templateItemId: string): AppSnapshot {
  const items = getTemplateItemCollection(snapshot)
  if (!items.some((entry) => entry.id === templateItemId)) return snapshot

  return {
    ...snapshot,
    templateItems: items.filter((entry) => entry.id !== templateItemId),
  }
}

function getTemplateItemsForStartMode(
  snapshot: AppSnapshot,
  mode: StartCaseFromLeadSnapshotInput["mode"],
  templateId?: string | null,
) {
  if (mode === "empty") {
    return {
      selectedTemplateId: null,
      templateItems: [] as TemplateItem[],
    }
  }
  if (templateId) {
    const selected = (snapshot.caseTemplates ?? []).find((entry) => entry.id === templateId)
    if (!selected) {
      return {
        selectedTemplateId: null,
        templateItems: [] as TemplateItem[],
      }
    }
    return {
      selectedTemplateId: selected.id,
      templateItems: (snapshot.templateItems ?? []).filter((item) => item.templateId === selected.id),
    }
  }

  const fallbackTemplate = snapshot.caseTemplates?.find((item) => item.isDefault) ?? snapshot.caseTemplates?.[0]
  return {
    selectedTemplateId: fallbackTemplate?.id ?? null,
    templateItems: fallbackTemplate ? (snapshot.templateItems ?? []).filter((item) => item.templateId === fallbackTemplate.id) : [],
  }
}

function createPortalToken(caseId: string, workspaceId: string, contactId: string, now: string): ClientPortalToken {
  const expiresAt = new Date(Date.parse(now) + 1000 * 60 * 60 * 24 * 30).toISOString()
  return {
    id: createId("portal"),
    workspaceId,
    caseId,
    contactId,
    tokenHash: createId("cpt"),
    createdByUserId: null,
    expiresAt,
    revokedAt: null,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now,
  }
}

function ensureCaseCollections(snapshot: AppSnapshot) {
  return {
    contacts: [...(snapshot.contacts ?? [])] as Contact[],
    cases: [...(snapshot.cases ?? [])] as Case[],
    caseItems: [...(snapshot.caseItems ?? [])] as CaseItem[],
    activityLog: [...(snapshot.activityLog ?? [])] as ActivityLogEntry[],
    clientPortalTokens: [...(snapshot.clientPortalTokens ?? [])] as ClientPortalToken[],
    notifications: [...(snapshot.notifications ?? [])] as AppNotification[],
    items: [...snapshot.items] as WorkItem[],
  }
}

export function startCaseFromLeadSnapshot(snapshot: AppSnapshot, input: StartCaseFromLeadSnapshotInput): AppSnapshot {
  const lead = snapshot.leads.find((entry) => entry.id === input.leadId)
  if (!lead || lead.caseId) return snapshot

  const now = nowIso()
  const workspaceId = resolveWorkspaceId(snapshot, lead)
  const collections = ensureCaseCollections(snapshot)
  const templateSelection = getTemplateItemsForStartMode(snapshot, input.mode, input.templateId)
  const caseStatus: CaseStatus = lead.status === "won" ? "collecting_materials" : "ready_to_start"

  const transition = createCaseFromLead({
    lead,
    workspaceId,
    actorUserId: snapshot.context.userId ?? "operator_local",
    contacts: collections.contacts,
    caseStatus,
    templateId: templateSelection.selectedTemplateId,
    templateItems: templateSelection.templateItems,
    now,
  })

  const nextContacts = transition.createdContact ? [transition.createdContact, ...collections.contacts] : collections.contacts
  const portalToken = createPortalToken(transition.case.id, transition.case.workspaceId, transition.contact.id, now)
  const nextClientPortalTokens = [portalToken, ...collections.clientPortalTokens]

  const nextLeads = snapshot.leads.map((entry) =>
    entry.id === lead.id
      ? {
          ...entry,
          ...transition.leadPatch,
          updatedAt: now,
        }
      : entry,
  )

  const ownerTask = createOwnerAutomationTask({
    snapshot,
    title: `Sprawdz kompletnosc: ${transition.case.title}`,
    description: "Automat po utworzeniu sprawy. Sprawdz, czy klient doslal wymagane materialy.",
    scheduledAt: addDaysIso(now, CASE_COMPLETENESS_CHECK_DAYS),
    priority: "high",
    leadId: lead.id,
    marker: `case-completeness-check-${transition.case.id}`,
  })

  const nextNotifications = [
    createSystemNotification(snapshot, {
      caseId: transition.case.id,
      channel: "in_app",
      title: "Nowa sprawa po statusie wygrany",
      body: `Utworzono sprawe ${transition.case.title} i przypisano do ownera.`,
    }),
    ...(snapshot.settings.emailReminders && transition.contact.email
      ? [
          createSystemNotification(snapshot, {
            caseId: transition.case.id,
            channel: "email",
            title: "Start realizacji",
            body: `Rozpoczynamy zbieranie materialow do sprawy ${transition.case.title}.`,
          }),
        ]
      : []),
    ...collections.notifications,
  ]

  const automationActivity: ActivityLogEntry[] = [
    createSystemActivity(snapshot, transition.case.id, "case_status_changed", {
      status: caseStatus,
      reason: "auto_after_won",
      ownerUserId: snapshot.context.userId,
    }),
    createSystemActivity(snapshot, transition.case.id, "notification_scheduled", {
      channel: "in_app",
      kind: "case_started",
    }),
  ]

  if (snapshot.settings.emailReminders && transition.contact.email) {
    automationActivity.push(
      createSystemActivity(snapshot, transition.case.id, "notification_scheduled", {
        channel: "email",
        kind: "case_start_email",
      }),
    )
  }

  return reconcileAppSnapshot({
    ...snapshot,
    leads: nextLeads,
    contacts: nextContacts,
    cases: [
      {
        ...transition.case,
        blockedByMissingRequired: false,
      },
      ...collections.cases,
    ],
    caseItems: [...transition.caseItems, ...collections.caseItems],
    activityLog: [...automationActivity, ...transition.activityLog, ...collections.activityLog],
    clientPortalTokens: nextClientPortalTokens,
    notifications: nextNotifications,
    items: ownerTask ? [ownerTask, ...collections.items] : collections.items,
  })
}

export function issueClientPortalLinkSnapshot(snapshot: AppSnapshot, leadId: string): AppSnapshot {
  const lead = snapshot.leads.find((entry) => entry.id === leadId)
  if (!lead?.caseId) return snapshot

  const linkedCase = snapshot.cases?.find((entry) => entry.id === lead.caseId)
  if (!linkedCase) return snapshot

  const contactId = linkedCase.contactId || lead.contactId
  if (!contactId) return snapshot

  const now = nowIso()
  const collections = ensureCaseCollections(snapshot)
  const token = createPortalToken(linkedCase.id, linkedCase.workspaceId, contactId, now)

  return {
    ...snapshot,
    clientPortalTokens: [token, ...collections.clientPortalTokens],
  }
}

export function revokeClientPortalTokenSnapshot(snapshot: AppSnapshot, caseId: string): AppSnapshot {
  const now = nowIso()
  const tokens = snapshot.clientPortalTokens ?? []
  if (!tokens.some((entry) => entry.caseId === caseId && !entry.revokedAt)) return snapshot

  return {
    ...snapshot,
    clientPortalTokens: tokens.map((entry) =>
      entry.caseId === caseId && !entry.revokedAt
        ? {
            ...entry,
            revokedAt: now,
            updatedAt: now,
          }
        : entry,
    ),
  }
}

export function updateCaseSnapshot(snapshot: AppSnapshot, caseId: string, patch: Partial<Case>): AppSnapshot {
  const now = nowIso()
  const cases = snapshot.cases ?? []
  const caseRecord = cases.find((entry) => entry.id === caseId)
  if (!caseRecord) return snapshot

  const nextCases = cases.map((entry) => {
    if (entry.id !== caseId) return entry
    return {
      ...entry,
      ...patch,
      updatedAt: now,
    }
  })

  return {
    ...snapshot,
    cases: nextCases,
  }
}

function resolveCaseItemCompletedAt(status: CaseItemStatus, currentCompletedAt: string | null) {
  if (status === "accepted" || status === "not_applicable") {
    return currentCompletedAt ?? nowIso()
  }
  return null
}

function deriveAutomatedCaseStatus(caseRecord: Case, caseItems: CaseItem[]) {
  const requiredItems = caseItems.filter((item) => item.required)
  const hasNeedsCorrection = requiredItems.some((item) => item.status === "needs_correction")
  const hasUnderReview = requiredItems.some((item) => item.status === "under_review")
  const hasPending = requiredItems.some((item) => PENDING_CASE_ITEM_STATUSES.has(item.status))
  const allDone = requiredItems.length > 0 && requiredItems.every((item) => DONE_CASE_ITEM_STATUSES.has(item.status))

  if (hasNeedsCorrection) {
    return { status: "blocked" as CaseStatus, blockedByMissingRequired: true }
  }
  if (hasPending) {
    return { status: "waiting_for_client" as CaseStatus, blockedByMissingRequired: true }
  }
  if (hasUnderReview) {
    return { status: "under_review" as CaseStatus, blockedByMissingRequired: false }
  }
  if (allDone) {
    return { status: "ready_to_start" as CaseStatus, blockedByMissingRequired: false }
  }

  return {
    status: caseRecord.status,
    blockedByMissingRequired: Boolean(caseRecord.blockedByMissingRequired),
  }
}

export function updateCaseItemSnapshot(snapshot: AppSnapshot, caseItemId: string, patch: Partial<CaseItem>): AppSnapshot {
  const now = nowIso()
  const caseItems = snapshot.caseItems ?? []
  const existing = caseItems.find((entry) => entry.id === caseItemId)
  if (!existing) return snapshot

  const status =
    patch.status && patch.status !== existing.status
      ? patch.status
      : existing.status

  const nextCaseItems = caseItems.map((entry) => {
    if (entry.id !== caseItemId) return entry
    return {
      ...entry,
      ...patch,
      completedAt: resolveCaseItemCompletedAt(status, entry.completedAt),
      updatedAt: now,
    }
  })

  const caseRecord = (snapshot.cases ?? []).find((entry) => entry.id === existing.caseId)
  if (!caseRecord) {
    return {
      ...snapshot,
      caseItems: nextCaseItems,
    }
  }

  const caseItemsForCase = nextCaseItems.filter((entry) => entry.caseId === caseRecord.id)
  const nextStatusState = deriveAutomatedCaseStatus(caseRecord, caseItemsForCase)

  const nextCases = (snapshot.cases ?? []).map((entry) =>
    entry.id === caseRecord.id
      ? {
          ...entry,
          status: nextStatusState.status,
          blockedByMissingRequired: nextStatusState.blockedByMissingRequired,
          updatedAt: now,
        }
      : entry,
  )

  const nextActivity = [...(snapshot.activityLog ?? [])]
  const nextNotifications = [...(snapshot.notifications ?? [])]
  let nextItems = [...snapshot.items]

  if (existing.status !== "under_review" && status === "under_review") {
    const reviewTask = createOwnerAutomationTask({
      snapshot,
      title: `Zweryfikuj doslany element: ${existing.title}`,
      description: "Automat po doslaniu od klienta. Sprawdz i zatwierdz albo odeslij do poprawy.",
      scheduledAt: now,
      priority: "high",
      leadId: caseRecord.sourceLeadId,
      marker: `case-item-review-${existing.caseId}-${existing.id}`,
    })

    if (reviewTask) {
      nextItems = [reviewTask, ...nextItems]
      nextActivity.unshift(
        createSystemActivity(snapshot, caseRecord.id, "case_item_updated", {
          status: "under_review",
          reason: "auto_after_upload_or_delivery",
          caseItemId: existing.id,
        }, existing.id),
      )
      nextNotifications.unshift(
        createSystemNotification(snapshot, {
          caseId: caseRecord.id,
          caseItemId: existing.id,
          channel: "in_app",
          title: "Element do weryfikacji",
          body: `${existing.title} zostal doslany i czeka na sprawdzenie dzis.`,
        }),
      )
    }
  }

  if (caseRecord.status !== nextStatusState.status || Boolean(caseRecord.blockedByMissingRequired) !== nextStatusState.blockedByMissingRequired) {
    nextActivity.unshift(
      createSystemActivity(snapshot, caseRecord.id, "case_status_changed", {
        status: nextStatusState.status,
        blockedByMissingRequired: nextStatusState.blockedByMissingRequired,
        reason: "auto_case_completeness_transition",
      }),
    )
  }

  if (nextStatusState.status === "ready_to_start" && caseRecord.status !== "ready_to_start") {
    const startTask = createOwnerAutomationTask({
      snapshot,
      title: `Sprawa gotowa do startu: ${caseRecord.title}`,
      description: "Automat po pelnej kompletnosci. Rozpocznij kolejny etap realizacji.",
      scheduledAt: now,
      priority: "high",
      leadId: caseRecord.sourceLeadId,
      marker: `case-ready-to-start-${caseRecord.id}`,
    })
    if (startTask) {
      nextItems = [startTask, ...nextItems]
      nextNotifications.unshift(
        createSystemNotification(snapshot, {
          caseId: caseRecord.id,
          channel: "in_app",
          title: "Sprawa gotowa do startu",
          body: `${caseRecord.title} ma komplet wymaganych elementow.`,
        }),
      )
    }
  }

  return {
    ...snapshot,
    cases: nextCases,
    caseItems: nextCaseItems,
    activityLog: nextActivity,
    notifications: nextNotifications,
    items: nextItems,
  }
}

export interface AppendCaseActivityInput {
  caseId: string
  type: ActivityLogEntry["type"]
  source?: ActivityLogEntry["source"]
  payload?: Record<string, unknown>
  caseItemId?: string | null
}

export function appendCaseActivitySnapshot(snapshot: AppSnapshot, input: AppendCaseActivityInput): AppSnapshot {
  const workspaceId = snapshot.context.workspaceId
  if (!workspaceId) return snapshot

  const activity: ActivityLogEntry = {
    id: createId("activity"),
    workspaceId,
    actorUserId: snapshot.context.userId,
    actorContactId: null,
    source: input.source ?? "operations",
    type: input.type,
    leadId: null,
    caseId: input.caseId,
    caseItemId: input.caseItemId ?? null,
    attachmentId: null,
    approvalId: null,
    notificationId: null,
    payload: input.payload ?? {},
    createdAt: nowIso(),
  }

  return {
    ...snapshot,
    activityLog: [activity, ...(snapshot.activityLog ?? [])],
  }
}

export function resetInitialSnapshot(): AppSnapshot {
  return cloneSnapshot(createInitialSnapshot())
}
