import { createInitialSnapshot } from "./seed"
import type {
  ActivityLogRecord,
  Approval,
  AppSnapshot,
  BillingState,
  CaseTemplate,
  ClientPortalTokenRecord,
  FileAttachment,
  Lead,
  LeadInput,
  NotificationDeliveryLogRecord,
  NotificationRecord,
  RequestStatus,
  SettingsPatch,
  TemplateItem,
  TemplateItemKind,
  WorkItem,
  WorkItemInput,
} from "./types"
import { checkSecurityRateLimit } from "./security/rate-limit"
import { addDaysAt, addHours, cloneSnapshot, createId, getItemPrimaryDate, nowIso } from "./utils"

const EMPTY_LEAD_TEMPLATE: Lead = {
  id: "",
  workspaceId: null,
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

const EMPTY_CASE_TEMPLATE: CaseTemplate = {
  id: "",
  workspaceId: null,
  name: "",
  caseType: "",
  description: "",
  isDefault: false,
  createdAt: "",
  updatedAt: "",
}

const EMPTY_TEMPLATE_ITEM: TemplateItem = {
  id: "",
  workspaceId: null,
  templateId: "",
  title: "",
  itemType: "file",
  description: "",
  sortOrder: 0,
  required: true,
  createdAt: "",
  updatedAt: "",
}

const EMPTY_FILE_ATTACHMENT: FileAttachment = {
  id: "",
  workspaceId: null,
  caseId: null,
  caseItemId: null,
  fileName: "",
  mimeType: "",
  fileSizeBytes: 0,
  storagePath: "",
  uploadedByRole: "system",
  uploadedByLabel: "",
  createdAt: "",
}

const EMPTY_APPROVAL: Approval = {
  id: "",
  workspaceId: null,
  caseId: null,
  caseItemId: null,
  requestedToEmail: "",
  status: "not_sent",
  decision: "submitted",
  optionValue: "",
  actorRole: "system",
  actorLabel: "",
  note: "",
  decidedAt: "",
  createdAt: "",
  updatedAt: "",
}

const EMPTY_NOTIFICATION: NotificationRecord = {
  id: "",
  workspaceId: null,
  userId: "client_portal",
  channel: "in_app",
  kind: "generic",
  dedupeKey: "",
  title: "",
  message: "",
  relatedLeadId: null,
  relatedCaseId: null,
  readAt: "",
  createdAt: "",
}

const EMPTY_NOTIFICATION_DELIVERY_LOG: NotificationDeliveryLogRecord = {
  id: "",
  workspaceId: null,
  notificationId: "",
  channel: "in_app",
  recipient: "",
  status: "queued",
  error: "",
  sentAt: "",
  createdAt: "",
}

const EMPTY_CLIENT_PORTAL_TOKEN: ClientPortalTokenRecord = {
  id: "",
  workspaceId: null,
  caseId: "",
  tokenHash: "",
  expiresAt: "",
  revokedAt: "",
  revokedReason: "",
  failedAttempts: 0,
  lastFailedAt: "",
  lockedUntil: "",
  lastOpenedAt: "",
  createdAt: "",
}

const EMPTY_ACTIVITY_LOG: ActivityLogRecord = {
  id: "",
  workspaceId: null,
  actorUserId: null,
  leadId: null,
  caseId: null,
  caseItemId: null,
  eventScope: "system",
  eventType: "",
  eventTitle: "",
  eventPayload: {},
  createdAt: "",
}

export interface TemplateItemInput {
  title: string
  itemType: TemplateItemKind
  description: string
  sortOrder: number
  required: boolean
}

export interface CaseTemplateInput {
  name: string
  caseType: string
  description: string
  isDefault: boolean
  items: TemplateItemInput[]
}

function normalizeLead(lead: Partial<Lead> | undefined, initialLead: Lead): Lead {
  return {
    ...initialLead,
    ...lead,
    workspaceId: typeof lead?.workspaceId === "string" ? lead.workspaceId : initialLead.workspaceId ?? null,
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

function normalizeCaseTemplate(template: Partial<CaseTemplate> | undefined, initial: CaseTemplate): CaseTemplate {
  return {
    ...initial,
    ...template,
    workspaceId: typeof template?.workspaceId === "string" ? template.workspaceId : initial.workspaceId ?? null,
    caseType: typeof template?.caseType === "string" ? template.caseType : initial.caseType,
    isDefault: typeof template?.isDefault === "boolean" ? template.isDefault : initial.isDefault,
  }
}

function normalizeTemplateItem(item: Partial<TemplateItem> | undefined, initial: TemplateItem): TemplateItem {
  return {
    ...initial,
    ...item,
    workspaceId: typeof item?.workspaceId === "string" ? item.workspaceId : initial.workspaceId ?? null,
    templateId: typeof item?.templateId === "string" ? item.templateId : initial.templateId,
    sortOrder: typeof item?.sortOrder === "number" ? item.sortOrder : initial.sortOrder,
    required: typeof item?.required === "boolean" ? item.required : initial.required,
  }
}

function normalizeFileAttachment(item: Partial<FileAttachment> | undefined, initial: FileAttachment): FileAttachment {
  return {
    ...initial,
    ...item,
    workspaceId: typeof item?.workspaceId === "string" ? item.workspaceId : initial.workspaceId ?? null,
    caseId: typeof item?.caseId === "string" ? item.caseId : initial.caseId ?? null,
    caseItemId: typeof item?.caseItemId === "string" ? item.caseItemId : initial.caseItemId ?? null,
    fileSizeBytes: typeof item?.fileSizeBytes === "number" ? item.fileSizeBytes : initial.fileSizeBytes,
    uploadedByRole:
      item?.uploadedByRole === "client" || item?.uploadedByRole === "operator" || item?.uploadedByRole === "system"
        ? item.uploadedByRole
        : initial.uploadedByRole,
    uploadedByLabel: typeof item?.uploadedByLabel === "string" ? item.uploadedByLabel : initial.uploadedByLabel,
  }
}

function normalizeApproval(item: Partial<Approval> | undefined, initial: Approval): Approval {
  const decision =
    item?.decision === "accepted" ||
    item?.decision === "rejected" ||
    item?.decision === "needs_changes" ||
    item?.decision === "option_a" ||
    item?.decision === "option_b" ||
    item?.decision === "option_c" ||
    item?.decision === "submitted" ||
    item?.decision === "answered"
      ? item.decision
      : initial.decision

  return {
    ...initial,
    ...item,
    workspaceId: typeof item?.workspaceId === "string" ? item.workspaceId : initial.workspaceId ?? null,
    caseId: typeof item?.caseId === "string" ? item.caseId : initial.caseId ?? null,
    caseItemId: typeof item?.caseItemId === "string" ? item.caseItemId : initial.caseItemId ?? null,
    decision,
    optionValue: typeof item?.optionValue === "string" ? item.optionValue : initial.optionValue,
    actorRole:
      item?.actorRole === "client" || item?.actorRole === "operator" || item?.actorRole === "system"
        ? item.actorRole
        : initial.actorRole,
    actorLabel: typeof item?.actorLabel === "string" ? item.actorLabel : initial.actorLabel,
  }
}

function normalizeNotification(item: Partial<NotificationRecord> | undefined, initial: NotificationRecord): NotificationRecord {
  return {
    ...initial,
    ...item,
    workspaceId: typeof item?.workspaceId === "string" ? item.workspaceId : initial.workspaceId ?? null,
    kind: typeof item?.kind === "string" ? item.kind : initial.kind,
    dedupeKey: typeof item?.dedupeKey === "string" ? item.dedupeKey : initial.dedupeKey,
    relatedLeadId: typeof item?.relatedLeadId === "string" ? item.relatedLeadId : initial.relatedLeadId ?? null,
    relatedCaseId: typeof item?.relatedCaseId === "string" ? item.relatedCaseId : initial.relatedCaseId ?? null,
  }
}

function normalizeNotificationDeliveryLog(
  item: Partial<NotificationDeliveryLogRecord> | undefined,
  initial: NotificationDeliveryLogRecord,
): NotificationDeliveryLogRecord {
  return {
    ...initial,
    ...item,
    workspaceId: typeof item?.workspaceId === "string" ? item.workspaceId : initial.workspaceId ?? null,
    notificationId: typeof item?.notificationId === "string" ? item.notificationId : initial.notificationId,
    recipient: typeof item?.recipient === "string" ? item.recipient : initial.recipient,
    status:
      item?.status === "sent" || item?.status === "queued" || item?.status === "skipped" || item?.status === "failed"
        ? item.status
        : initial.status,
    error: typeof item?.error === "string" ? item.error : initial.error,
    sentAt: typeof item?.sentAt === "string" ? item.sentAt : initial.sentAt,
  }
}

function normalizeClientPortalToken(item: Partial<ClientPortalTokenRecord> | undefined, initial: ClientPortalTokenRecord): ClientPortalTokenRecord {
  return {
    ...initial,
    ...item,
    workspaceId: typeof item?.workspaceId === "string" ? item.workspaceId : initial.workspaceId ?? null,
    revokedReason: typeof item?.revokedReason === "string" ? item.revokedReason : initial.revokedReason,
    failedAttempts: typeof item?.failedAttempts === "number" ? item.failedAttempts : initial.failedAttempts,
    lastFailedAt: typeof item?.lastFailedAt === "string" ? item.lastFailedAt : initial.lastFailedAt,
    lockedUntil: typeof item?.lockedUntil === "string" ? item.lockedUntil : initial.lockedUntil,
    lastOpenedAt: typeof item?.lastOpenedAt === "string" ? item.lastOpenedAt : initial.lastOpenedAt,
  }
}

function normalizeActivityLog(item: Partial<ActivityLogRecord> | undefined, initial: ActivityLogRecord): ActivityLogRecord {
  return {
    ...initial,
    ...item,
    workspaceId: typeof item?.workspaceId === "string" ? item.workspaceId : initial.workspaceId ?? null,
    actorUserId: typeof item?.actorUserId === "string" ? item.actorUserId : initial.actorUserId ?? null,
    leadId: typeof item?.leadId === "string" ? item.leadId : initial.leadId ?? null,
    caseId: typeof item?.caseId === "string" ? item.caseId : initial.caseId ?? null,
    caseItemId: typeof item?.caseItemId === "string" ? item.caseItemId : initial.caseItemId ?? null,
    eventPayload: typeof item?.eventPayload === "object" && item.eventPayload !== null ? item.eventPayload : initial.eventPayload,
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

function getFallbackLeadNextActionItemId(items: WorkItem[], leadId: string) {
  return items
    .filter((item) => item.leadId === leadId && item.status !== "done")
    .sort(sortItemsForLead)[0]?.id ?? null
}

function synchronizeLeadSnapshot(leads: Lead[], items: WorkItem[]) {
  return leads.map((lead) => {
    const linkedItem = lead.nextActionItemId
      ? items.find((item) => item.id === lead.nextActionItemId && item.leadId === lead.id)
      : null
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

function reconcileSnapshot(snapshot: AppSnapshot): AppSnapshot {
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

    return reconcileSnapshot({
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
      caseTemplates: Array.isArray(parsed.caseTemplates)
        ? parsed.caseTemplates.map((template) => normalizeCaseTemplate(template, EMPTY_CASE_TEMPLATE))
        : initial.caseTemplates,
      templateItems: Array.isArray(parsed.templateItems)
        ? parsed.templateItems.map((item) => normalizeTemplateItem(item, EMPTY_TEMPLATE_ITEM))
        : initial.templateItems,
      fileAttachments: Array.isArray(parsed.fileAttachments)
        ? parsed.fileAttachments.map((item) => normalizeFileAttachment(item, EMPTY_FILE_ATTACHMENT))
        : initial.fileAttachments,
      approvals: Array.isArray(parsed.approvals)
        ? parsed.approvals.map((item) => normalizeApproval(item, EMPTY_APPROVAL))
        : initial.approvals,
      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications.map((item) => normalizeNotification(item, EMPTY_NOTIFICATION))
        : initial.notifications,
      notificationDeliveryLog: Array.isArray(parsed.notificationDeliveryLog)
        ? parsed.notificationDeliveryLog.map((item) =>
            normalizeNotificationDeliveryLog(item, EMPTY_NOTIFICATION_DELIVERY_LOG),
          )
        : initial.notificationDeliveryLog,
      clientPortalTokens: Array.isArray(parsed.clientPortalTokens)
        ? parsed.clientPortalTokens.map((item) => normalizeClientPortalToken(item, EMPTY_CLIENT_PORTAL_TOKEN))
        : initial.clientPortalTokens,
      activityLog: Array.isArray(parsed.activityLog)
        ? parsed.activityLog.map((item) => normalizeActivityLog(item, EMPTY_ACTIVITY_LOG))
        : initial.activityLog,
    })
  } catch {
    return initial
  }
}

function setLeadNoteTag(notes: string, key: string, value: string) {
  const pattern = new RegExp(`\\[${key}:[^\\]]*\\]`, "g")
  const stripped = (notes || "").replace(pattern, "").trim()
  const suffix = `[${key}:${value}]`
  return stripped ? `${stripped}\n${suffix}` : suffix
}

function hasOpenAutoTask(items: WorkItem[], leadId: string, key: string) {
  return items.some((item) => item.leadId === leadId && item.status !== "done" && item.title.includes(key))
}

function buildAutoTask(
  workspaceId: string | null,
  leadId: string,
  leadLabel: string,
  title: string,
  description: string,
  scheduledAt: string,
  priority: WorkItem["priority"] = "high",
): WorkItem {
  const date = nowIso()
  return {
    ...EMPTY_ITEM_TEMPLATE,
    id: createId("item"),
    workspaceId,
    leadId,
    leadLabel,
    recordType: "task",
    type: "task",
    title,
    description,
    status: "todo",
    priority,
    scheduledAt,
    startAt: "",
    endAt: "",
    recurrence: "none",
    reminder: "at_time",
    createdAt: date,
    updatedAt: date,
    showInTasks: true,
    showInCalendar: true,
  }
}

function shouldSkipNotificationByDedupe(
  notifications: NotificationRecord[],
  dedupeKey: string,
  now: string,
  cooldownHours = 12,
) {
  const existing = notifications.find((entry) => entry.dedupeKey === dedupeKey)
  if (!existing) return false
  const threshold = new Date(now).getTime() - cooldownHours * 60 * 60 * 1000
  return new Date(existing.createdAt).getTime() >= threshold
}

function queueWorkflowNotification(
  snapshot: AppSnapshot,
  notifications: NotificationRecord[],
  deliveryLog: NotificationDeliveryLogRecord[],
  payload: {
    userId: string
    channel: "in_app" | "email"
    kind: string
    dedupeKey: string
    title: string
    message: string
    relatedLeadId?: string | null
    relatedCaseId?: string | null
    recipient?: string
  },
) {
  const date = nowIso()
  if (shouldSkipNotificationByDedupe(notifications, payload.dedupeKey, date)) {
    return { notifications, deliveryLog }
  }

  const notification: NotificationRecord = {
    ...EMPTY_NOTIFICATION,
    id: createId("notif"),
    workspaceId: snapshot.context.workspaceId ?? null,
    userId: payload.userId,
    channel: payload.channel,
    kind: payload.kind,
    dedupeKey: payload.dedupeKey,
    title: payload.title,
    message: payload.message,
    relatedLeadId: payload.relatedLeadId ?? null,
    relatedCaseId: payload.relatedCaseId ?? null,
    createdAt: date,
  }

  const emailEnabled = snapshot.settings.emailReminders
  const inAppEnabled = snapshot.settings.inAppReminders
  const status =
    payload.channel === "in_app" ? (inAppEnabled ? "sent" : "skipped") : emailEnabled ? "queued" : "skipped"
  const logEntry: NotificationDeliveryLogRecord = {
    ...EMPTY_NOTIFICATION_DELIVERY_LOG,
    id: createId("ndel"),
    workspaceId: snapshot.context.workspaceId ?? null,
    notificationId: notification.id,
    channel: payload.channel,
    recipient: payload.recipient ?? (payload.channel === "email" ? snapshot.user.email || "unknown" : payload.userId),
    status,
    error:
      status === "skipped"
        ? payload.channel === "in_app"
          ? "in-app-reminders-disabled"
          : "email-reminders-disabled"
        : "",
    sentAt: status === "sent" ? date : "",
    createdAt: date,
  }

  return {
    notifications: [notification, ...notifications],
    deliveryLog: [logEntry, ...deliveryLog],
  }
}

function getReminderFrequencyDays(
  frequency: AppSnapshot["settings"]["caseReminderFrequency"],
) {
  if (frequency === "every_2_days") return 2
  if (frequency === "weekly") return 7
  return 1
}

function diffDays(fromIso: string, toIso: string) {
  const from = Date.parse(fromIso)
  const to = Date.parse(toIso)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return 0
  return Math.floor((to - from) / (24 * 60 * 60 * 1000))
}

function runLeadCaseAutomation(snapshot: AppSnapshot): AppSnapshot {
  const workspaceId = snapshot.context.workspaceId ?? null
  const actorName = snapshot.user.name || "Operator"
  let leads = [...snapshot.leads]
  let items = [...snapshot.items]
  let notifications = [...snapshot.notifications]
  let notificationDeliveryLog = [...snapshot.notificationDeliveryLog]
  let clientPortalTokens = [...snapshot.clientPortalTokens]
  let activityLog = [...snapshot.activityLog]
  const cadenceDays = getReminderFrequencyDays(snapshot.settings.caseReminderFrequency)

  for (let index = 0; index < leads.length; index += 1) {
    const lead = leads[index]
    if (lead.status !== "won" && lead.status !== "ready_to_start") continue

    let nextLead = { ...lead }
    let notes = nextLead.notes || ""
    const now = nowIso()
    let caseJustCreated = false
    const notify = (payload: {
      userId: string
      channel: "in_app" | "email"
      kind: string
      dedupeKey: string
      title: string
      message: string
      relatedLeadId?: string | null
      relatedCaseId?: string | null
      recipient?: string
    }) => {
      const queued = queueWorkflowNotification(snapshot, notifications, notificationDeliveryLog, payload)
      notifications = queued.notifications
      notificationDeliveryLog = queued.deliveryLog
    }

    if (!nextLead.caseId) {
      nextLead.caseId = createId("case")
      nextLead.contactId = nextLead.contactId ?? createId("contact")
      notes = setLeadNoteTag(notes, "op_status", "collecting_materials")
      notes = setLeadNoteTag(notes, "case_owner", actorName)
      caseJustCreated = true

      const defaultTemplate =
        snapshot.caseTemplates.find((template) => template.isDefault) ??
        snapshot.caseTemplates[0] ??
        null

      if (defaultTemplate) {
        notes = setLeadNoteTag(notes, "case_template", defaultTemplate.name)
        const templateItems = snapshot.templateItems
          .filter((item) => item.templateId === defaultTemplate.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
        const hasLeadItems = items.some((item) => item.leadId === nextLead.id)

        if (!hasLeadItems) {
          templateItems.forEach((templateItem) => {
            items.push(
              buildAutoTask(
                workspaceId,
                nextLead.id,
                nextLead.name,
                templateItem.title,
                `[AUTO] Start z szablonu: ${defaultTemplate.name}`,
                now,
                templateItem.required ? "high" : "medium",
              ),
            )
          })
        }
      }

      if (!hasOpenAutoTask(items, nextLead.id, "[AUTO_CHECK_COMPLETENESS]")) {
        items.push(
          buildAutoTask(
            workspaceId,
            nextLead.id,
            nextLead.name,
            "[AUTO_CHECK_COMPLETENESS] Sprawdz kompletnosc sprawy",
            "Automatyczny next step po utworzeniu sprawy.",
            addDaysAt(3, 9, 0),
            "high",
          ),
        )
      }

      const hasPortalToken = clientPortalTokens.some((token) => token.caseId === nextLead.caseId && !token.revokedAt)
      if (!hasPortalToken) {
        clientPortalTokens.push({
          ...EMPTY_CLIENT_PORTAL_TOKEN,
          id: createId("cpt"),
          workspaceId,
          caseId: nextLead.caseId,
          tokenHash: createId("pth"),
          expiresAt: addHours(72),
          revokedAt: "",
          createdAt: now,
        })
      }
      notify({
        userId: "owner",
        channel: "in_app",
        kind: "operator_case_created",
        dedupeKey: `operator-case-created:${nextLead.caseId}`,
        title: "Auto: utworzono sprawe po wygranej",
        message: `Lead ${nextLead.name} przeszedl do sprawy operacyjnej.`,
        relatedLeadId: nextLead.id,
        relatedCaseId: nextLead.caseId,
        recipient: snapshot.user.email || "operator",
      })
      notify({
        userId: "owner",
        channel: "email",
        kind: "operator_case_created",
        dedupeKey: `operator-case-created-email:${nextLead.caseId}`,
        title: "Auto: nowa sprawa po wygranym leadzie",
        message: `Sprawa ${nextLead.caseId} zostala uruchomiona i przypisana do ownera.`,
        relatedLeadId: nextLead.id,
        relatedCaseId: nextLead.caseId,
        recipient: snapshot.user.email || "operator@example.com",
      })
      notify({
        userId: "client_portal",
        channel: "in_app",
        kind: "client_link_sent",
        dedupeKey: `client-link-sent:${nextLead.caseId}`,
        title: "Wyslano link",
        message: "Link do panelu klienta zostal przygotowany.",
        relatedLeadId: nextLead.id,
        relatedCaseId: nextLead.caseId,
        recipient: nextLead.email || "client",
      })
      notify({
        userId: "client_portal",
        channel: "email",
        kind: "client_link_sent",
        dedupeKey: `client-link-sent-email:${nextLead.caseId}`,
        title: "Twoj link do panelu sprawy",
        message: "Otrzymujesz bezpieczny link do doslania brakujacych rzeczy.",
        relatedLeadId: nextLead.id,
        relatedCaseId: nextLead.caseId,
        recipient: nextLead.email || "client@example.com",
      })
      activityLog.push({
        ...EMPTY_ACTIVITY_LOG,
        id: createId("log"),
        workspaceId,
        actorUserId: snapshot.context.userId ?? null,
        leadId: nextLead.id,
        caseId: nextLead.caseId,
        eventScope: "operations",
        eventType: "auto_case_created",
        eventTitle: "Automatycznie utworzono sprawe po wygranej",
        eventPayload: { leadStatus: nextLead.status, owner: actorName },
        createdAt: now,
      })
      activityLog.push({
        ...EMPTY_ACTIVITY_LOG,
        id: createId("log"),
        workspaceId,
        actorUserId: snapshot.context.userId ?? null,
        leadId: nextLead.id,
        caseId: nextLead.caseId,
        eventScope: "operations",
        eventType: "portal_link_issued",
        eventTitle: "Wydano link klienta do panelu",
        eventPayload: { recipient: nextLead.email || "" },
        createdAt: now,
      })
    }

    const relatedItems = items.filter((item) => item.leadId === nextLead.id)
    const requiredPending = relatedItems.filter((item) => item.priority === "high" && item.status !== "done")
    const hasReviewToday = relatedItems.some((item) => item.title.includes("[AUTO_REVIEW_TODAY]") && item.status !== "done")
    const allDone = relatedItems.length > 0 && relatedItems.every((item) => item.status === "done")
    const hasSnoozed = relatedItems.some((item) => item.status === "snoozed")

    if (requiredPending.length > 0) {
      notes = setLeadNoteTag(notes, "case_blocked", "true")
      notes = setLeadNoteTag(notes, "op_status", hasSnoozed ? "waiting_for_client" : "blocked")

      if (hasSnoozed && !hasReviewToday) {
        items.push(
          buildAutoTask(
            workspaceId,
            nextLead.id,
            nextLead.name,
            "[AUTO_REVIEW_TODAY] Sprawdz doslane elementy dzis",
            "Automatycznie dodane po doslaniu pliku lub odpowiedzi klienta.",
            now,
            "high",
          ),
        )
      }
      notify({
        userId: "owner",
        channel: "in_app",
        kind: "operator_case_blocked",
        dedupeKey: `operator-case-blocked:${nextLead.caseId}:${now.slice(0, 10)}`,
        title: "Sprawa zablokowana",
        message: `Sprawa ${nextLead.caseId} ma brakujace obowiazkowe elementy.`,
        relatedLeadId: nextLead.id,
        relatedCaseId: nextLead.caseId,
        recipient: snapshot.user.email || "operator",
      })

      if (hasSnoozed) {
        notify({
          userId: "owner",
          channel: "in_app",
          kind: "operator_needs_verification",
          dedupeKey: `operator-needs-verification:${nextLead.caseId}:${now.slice(0, 10)}`,
          title: "Trzeba zweryfikowac",
          message: "Klient doslal elementy. Sprawdz i zatwierdz dzis.",
          relatedLeadId: nextLead.id,
          relatedCaseId: nextLead.caseId,
          recipient: snapshot.user.email || "operator",
        })
      }
    }

    if (!caseJustCreated && requiredPending.length === 0 && allDone) {
      notes = setLeadNoteTag(notes, "case_blocked", "false")
      notes = setLeadNoteTag(notes, "op_status", "ready_to_start")

      if (!hasOpenAutoTask(items, nextLead.id, "[AUTO_READY_NEXT_STEP]")) {
        items.push(
          buildAutoTask(
            workspaceId,
            nextLead.id,
            nextLead.name,
            "[AUTO_READY_NEXT_STEP] Sprawa gotowa do startu - wykonaj kolejny ruch",
            "Automatyczny krok po pelnej kompletnosci.",
            now,
            "high",
          ),
        )
      }

      activityLog.push({
        ...EMPTY_ACTIVITY_LOG,
        id: createId("log"),
        workspaceId,
        actorUserId: snapshot.context.userId ?? null,
        leadId: nextLead.id,
        caseId: nextLead.caseId,
        eventScope: "operations",
        eventType: "auto_case_ready_to_start",
        eventTitle: "Sprawa osiagnela pelna kompletnosc",
        eventPayload: { totalItems: relatedItems.length },
        createdAt: now,
      })
      notify({
        userId: "owner",
        channel: "in_app",
        kind: "operator_case_ready_to_start",
        dedupeKey: `operator-case-ready:${nextLead.caseId}`,
        title: "Sprawa gotowa do startu",
        message: `Sprawa ${nextLead.caseId} osiagnela pelna kompletnosc.`,
        relatedLeadId: nextLead.id,
        relatedCaseId: nextLead.caseId,
        recipient: snapshot.user.email || "operator",
      })
      notify({
        userId: "owner",
        channel: "email",
        kind: "operator_case_ready_to_start",
        dedupeKey: `operator-case-ready-email:${nextLead.caseId}`,
        title: "Sprawa gotowa do startu",
        message: `Mozesz uruchomic realizacje dla sprawy ${nextLead.caseId}.`,
        relatedLeadId: nextLead.id,
        relatedCaseId: nextLead.caseId,
        recipient: snapshot.user.email || "operator@example.com",
      })
    }

    const caseEvents = activityLog
      .filter((entry) => entry.caseId === nextLead.caseId)
      .slice(0, 50)

    caseEvents.forEach((entry) => {
      if (entry.eventType === "file_uploaded" && entry.eventPayload.uploadedByRole === "client") {
        notify({
          userId: "owner",
          channel: "in_app",
          kind: "operator_client_uploaded_file",
          dedupeKey: `operator-file-uploaded:${entry.id}`,
          title: "Klient doslal plik",
          message: "Wplynal nowy plik od klienta.",
          relatedLeadId: nextLead.id,
          relatedCaseId: nextLead.caseId,
          recipient: snapshot.user.email || "operator",
        })
      }
      if (entry.eventType === "approval_decision" && entry.eventPayload.actorRole === "client") {
        notify({
          userId: "owner",
          channel: "in_app",
          kind: "operator_needs_verification",
          dedupeKey: `operator-verify-needed:${entry.id}`,
          title: "Wymagana weryfikacja",
          message: "Klient odpowiedzial lub podjal decyzje. Potrzebna weryfikacja.",
          relatedLeadId: nextLead.id,
          relatedCaseId: nextLead.caseId,
          recipient: snapshot.user.email || "operator",
        })
      }
    })

    if (requiredPending.length > 0) {
      const lastClientTouch = caseEvents
        .filter(
          (entry) =>
            entry.eventType === "file_uploaded" ||
            (entry.eventType === "approval_decision" && entry.eventPayload.actorRole === "client"),
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
      const referenceAt = lastClientTouch?.createdAt || nextLead.updatedAt || now
      const idleDays = diffDays(referenceAt, now)

      if (idleDays >= cadenceDays) {
        notify({
          userId: "owner",
          channel: "in_app",
          kind: "operator_client_idle",
          dedupeKey: `operator-client-idle:${nextLead.caseId}:${now.slice(0, 10)}`,
          title: "Klient nic nie doslal",
          message: `Brak ruchu klienta od ${idleDays} dni.`,
          relatedLeadId: nextLead.id,
          relatedCaseId: nextLead.caseId,
          recipient: snapshot.user.email || "operator",
        })
        notify({
          userId: "client_portal",
          channel: "email",
          kind: "client_missing_items_reminder",
          dedupeKey: `client-missing-items:${nextLead.caseId}:${now.slice(0, 10)}`,
          title: "Przypomnienie o brakujacych elementach",
          message: "Sprawa czeka na Twoje materialy i decyzje.",
          relatedLeadId: nextLead.id,
          relatedCaseId: nextLead.caseId,
          recipient: nextLead.email || "client@example.com",
        })
      }

      const deadlineSoonItem = requiredPending.find((item) => {
        const at = getItemPrimaryDate(item)
        const dueMs = Date.parse(at)
        const nowMs = Date.parse(now)
        if (!Number.isFinite(dueMs) || !Number.isFinite(nowMs)) return false
        return dueMs >= nowMs && dueMs - nowMs <= 24 * 60 * 60 * 1000
      })
      if (deadlineSoonItem) {
        notify({
          userId: "client_portal",
          channel: "email",
          kind: "client_due_soon",
          dedupeKey: `client-due-soon:${nextLead.caseId}:${deadlineSoonItem.id}:${now.slice(0, 10)}`,
          title: "Termin mija",
          message: `Termin elementu "${deadlineSoonItem.title}" mija wkrotce.`,
          relatedLeadId: nextLead.id,
          relatedCaseId: nextLead.caseId,
          recipient: nextLead.email || "client@example.com",
        })
      }

      const needsDecision = requiredPending.some((item) =>
        item.type === "call" || item.type === "meeting" || item.type === "deadline" || item.type === "reply" || item.type === "follow_up",
      )
      if (needsDecision) {
        notify({
          userId: "client_portal",
          channel: "email",
          kind: "client_decision_needed",
          dedupeKey: `client-decision-needed:${nextLead.caseId}:${now.slice(0, 10)}`,
          title: "Odpowiedz lub decyzja potrzebna",
          message: "W panelu sprawy czeka akcja wymagajaca Twojej odpowiedzi.",
          relatedLeadId: nextLead.id,
          relatedCaseId: nextLead.caseId,
          recipient: nextLead.email || "client@example.com",
        })
      }
    }

    nextLead.notes = notes
    leads[index] = nextLead
  }

  return {
    ...snapshot,
    leads,
    items,
    notifications,
    notificationDeliveryLog,
    clientPortalTokens,
    activityLog,
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

  return runLeadCaseAutomation(reconcileSnapshot({
    ...snapshot,
    leads: [nextLead, ...snapshot.leads],
    items: nextItems,
  }))
}

export function updateLeadSnapshot(snapshot: AppSnapshot, leadId: string, patch: Partial<Lead>): AppSnapshot {
  const currentLead = snapshot.leads.find((lead) => lead.id === leadId)
  if (!currentLead) return snapshot

  const mergedLead: Lead = {
    ...currentLead,
    ...patch,
    updatedAt: nowIso(),
  }

  let nextItems = [...snapshot.items]
  const linkedItem = currentLead.nextActionItemId
    ? nextItems.find((item) => item.id === currentLead.nextActionItemId && item.leadId === leadId)
    : null
  const wantsLinkedAction = Boolean(mergedLead.nextActionTitle.trim() && mergedLead.nextActionAt)

  if (wantsLinkedAction) {
    if (linkedItem) {
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
  const statusChanged = typeof patch.status === "string" && patch.status !== currentLead.status
  const statusLog: ActivityLogRecord[] = statusChanged
    ? [
        {
          ...EMPTY_ACTIVITY_LOG,
          id: createId("log"),
          workspaceId: snapshot.context.workspaceId ?? null,
          actorUserId: snapshot.context.userId ?? null,
          leadId,
          caseId: mergedLead.caseId ?? null,
          caseItemId: null,
          eventScope: "sales",
          eventType: "lead_status_changed",
          eventTitle: "Zmieniono status leada",
          eventPayload: {
            from: currentLead.status,
            to: patch.status,
          },
          createdAt: nowIso(),
        },
      ]
    : []
  return runLeadCaseAutomation(reconcileSnapshot({
    ...snapshot,
    leads: nextLeads,
    items: nextItems,
    activityLog: [...statusLog, ...snapshot.activityLog],
  }))
}

export function deleteLeadSnapshot(snapshot: AppSnapshot, leadId: string): AppSnapshot {
  return runLeadCaseAutomation(reconcileSnapshot({
    ...snapshot,
    leads: snapshot.leads.filter((lead) => lead.id !== leadId),
    items: snapshot.items.filter((item) => item.leadId !== leadId),
  }))
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

  return reconcileSnapshot({
    ...snapshot,
    items: [nextItem, ...snapshot.items],
  })
}

export function updateItemSnapshot(snapshot: AppSnapshot, itemId: string, patch: Partial<WorkItem>): AppSnapshot {
  const ownerLead = snapshot.leads.find((lead) => lead.nextActionItemId === itemId) ?? null
  const currentItem = snapshot.items.find((item) => item.id === itemId) ?? null
  const statusChanged = currentItem && typeof patch.status === "string" && patch.status !== currentItem.status

  return runLeadCaseAutomation(reconcileSnapshot({
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
    activityLog: statusChanged
      ? [
          {
            ...EMPTY_ACTIVITY_LOG,
            id: createId("log"),
            workspaceId: snapshot.context.workspaceId ?? null,
            actorUserId: snapshot.context.userId ?? null,
            leadId: currentItem?.leadId ?? null,
            caseId: snapshot.leads.find((lead) => lead.id === currentItem?.leadId)?.caseId ?? null,
            caseItemId: itemId,
            eventScope: "operations",
            eventType: "item_status_changed",
            eventTitle: "Zmieniono status elementu",
            eventPayload: {
              from: currentItem?.status ?? "",
              to: patch.status ?? "",
            },
            createdAt: nowIso(),
          },
          ...snapshot.activityLog,
        ]
      : snapshot.activityLog,
  }))
}

export function deleteItemSnapshot(snapshot: AppSnapshot, itemId: string): AppSnapshot {
  return runLeadCaseAutomation(reconcileSnapshot({
    ...snapshot,
    items: snapshot.items.filter((item) => item.id !== itemId),
  }))
}

export function toggleItemDoneSnapshot(snapshot: AppSnapshot, itemId: string): AppSnapshot {
  const currentItem = snapshot.items.find((item) => item.id === itemId) ?? null
  const nextStatus = currentItem?.status === "done" ? "todo" : "done"
  return runLeadCaseAutomation(reconcileSnapshot({
    ...snapshot,
    items: snapshot.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status: nextStatus,
            updatedAt: nowIso(),
          }
        : item,
    ),
    activityLog: currentItem
      ? [
          {
            ...EMPTY_ACTIVITY_LOG,
            id: createId("log"),
            workspaceId: snapshot.context.workspaceId ?? null,
            actorUserId: snapshot.context.userId ?? null,
            leadId: currentItem.leadId ?? null,
            caseId: snapshot.leads.find((lead) => lead.id === currentItem.leadId)?.caseId ?? null,
            caseItemId: itemId,
            eventScope: "operations",
            eventType: "item_status_changed",
            eventTitle: "Zmieniono status elementu",
            eventPayload: {
              from: currentItem.status,
              to: nextStatus,
            },
            createdAt: nowIso(),
          },
          ...snapshot.activityLog,
        ]
      : snapshot.activityLog,
  }))
}

export function snoozeItemSnapshot(snapshot: AppSnapshot, itemId: string, nextDate: string): AppSnapshot {
  const updatedAt = nowIso()

  return runLeadCaseAutomation(reconcileSnapshot({
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
  }))
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

function normalizeTemplateItemsForInsert(
  workspaceId: string | null,
  templateId: string,
  items: TemplateItemInput[],
) {
  const date = nowIso()
  return items
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item, index) => ({
      ...EMPTY_TEMPLATE_ITEM,
      id: createId("tpl_item"),
      workspaceId,
      templateId,
      title: item.title.trim(),
      itemType: item.itemType,
      description: item.description ?? "",
      sortOrder: index + 1,
      required: item.required,
      createdAt: date,
      updatedAt: date,
    }))
}

export function addCaseTemplateSnapshot(snapshot: AppSnapshot, payload: CaseTemplateInput): AppSnapshot {
  const date = nowIso()
  const templateId = createId("tpl")
  const workspaceId = snapshot.context.workspaceId ?? null

  const template: CaseTemplate = {
    ...EMPTY_CASE_TEMPLATE,
    id: templateId,
    workspaceId,
    name: payload.name.trim(),
    caseType: payload.caseType.trim(),
    description: payload.description ?? "",
    isDefault: payload.isDefault,
    createdAt: date,
    updatedAt: date,
  }

  const nextTemplates = snapshot.caseTemplates.map((entry) =>
    payload.isDefault && entry.caseType === template.caseType ? { ...entry, isDefault: false, updatedAt: date } : entry,
  )
  const nextItems = normalizeTemplateItemsForInsert(workspaceId, templateId, payload.items)

  return {
    ...snapshot,
    caseTemplates: [template, ...nextTemplates],
    templateItems: [...nextItems, ...snapshot.templateItems],
  }
}

export function updateCaseTemplateSnapshot(
  snapshot: AppSnapshot,
  templateId: string,
  payload: CaseTemplateInput,
): AppSnapshot {
  const current = snapshot.caseTemplates.find((entry) => entry.id === templateId)
  if (!current) return snapshot
  const date = nowIso()

  const updatedTemplate: CaseTemplate = {
    ...current,
    name: payload.name.trim(),
    caseType: payload.caseType.trim(),
    description: payload.description ?? "",
    isDefault: payload.isDefault,
    updatedAt: date,
  }

  const nextTemplates = snapshot.caseTemplates
    .map((entry) => {
      if (entry.id === templateId) return updatedTemplate
      if (payload.isDefault && entry.caseType === updatedTemplate.caseType) {
        return { ...entry, isDefault: false, updatedAt: date }
      }
      return entry
    })

  const preservedItems = snapshot.templateItems.filter((item) => item.templateId !== templateId)
  const replacedItems = normalizeTemplateItemsForInsert(snapshot.context.workspaceId ?? null, templateId, payload.items)

  return {
    ...snapshot,
    caseTemplates: nextTemplates,
    templateItems: [...replacedItems, ...preservedItems],
  }
}

export function deleteCaseTemplateSnapshot(snapshot: AppSnapshot, templateId: string): AppSnapshot {
  return {
    ...snapshot,
    caseTemplates: snapshot.caseTemplates.filter((entry) => entry.id !== templateId),
    templateItems: snapshot.templateItems.filter((item) => item.templateId !== templateId),
  }
}

export function duplicateCaseTemplateSnapshot(snapshot: AppSnapshot, templateId: string): AppSnapshot {
  const source = snapshot.caseTemplates.find((entry) => entry.id === templateId)
  if (!source) return snapshot
  const sourceItems = snapshot.templateItems
    .filter((item) => item.templateId === source.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return addCaseTemplateSnapshot(snapshot, {
    name: `${source.name} (kopia)`,
    caseType: source.caseType,
    description: source.description,
    isDefault: false,
    items: sourceItems.map((item) => ({
      title: item.title,
      itemType: item.itemType,
      description: item.description,
      sortOrder: item.sortOrder,
      required: item.required,
    })),
  })
}

export function setDefaultCaseTemplateSnapshot(snapshot: AppSnapshot, templateId: string): AppSnapshot {
  const target = snapshot.caseTemplates.find((entry) => entry.id === templateId)
  if (!target) return snapshot
  const date = nowIso()
  return {
    ...snapshot,
    caseTemplates: snapshot.caseTemplates.map((entry) => {
      if (entry.caseType !== target.caseType) return entry
      return { ...entry, isDefault: entry.id === templateId, updatedAt: date }
    }),
  }
}

export function issueClientPortalTokenSnapshot(
  snapshot: AppSnapshot,
  payload: { caseId: string; tokenHash: string; expiresAt: string },
): AppSnapshot {
  const date = nowIso()
  const workspaceId = snapshot.context.workspaceId ?? null
  const record: ClientPortalTokenRecord = {
    ...EMPTY_CLIENT_PORTAL_TOKEN,
    id: createId("cpt"),
    workspaceId,
    caseId: payload.caseId,
    tokenHash: payload.tokenHash,
    expiresAt: payload.expiresAt,
    revokedAt: "",
    revokedReason: "",
    failedAttempts: 0,
    lastFailedAt: "",
    lockedUntil: "",
    lastOpenedAt: "",
    createdAt: date,
  }

  const lead = snapshot.leads.find((entry) => entry.caseId === payload.caseId) ?? null
  const activityEntry: ActivityLogRecord = {
    ...EMPTY_ACTIVITY_LOG,
    id: createId("log"),
    workspaceId,
    actorUserId: snapshot.context.userId ?? null,
    leadId: lead?.id ?? null,
    caseId: payload.caseId,
    caseItemId: null,
    eventScope: "system",
    eventType: "portal_token_issued",
    eventTitle: "Wydano token portalu klienta",
    eventPayload: {
      expiresAt: payload.expiresAt,
    },
    createdAt: date,
  }

  return {
    ...snapshot,
    clientPortalTokens: [record, ...snapshot.clientPortalTokens],
    activityLog: [activityEntry, ...snapshot.activityLog],
  }
}

export function revokeClientPortalTokenSnapshot(snapshot: AppSnapshot, tokenId: string, reason = "manual_revoke"): AppSnapshot {
  const date = nowIso()
  const target = snapshot.clientPortalTokens.find((token) => token.id === tokenId) ?? null
  const lead = target ? snapshot.leads.find((entry) => entry.caseId === target.caseId) ?? null : null
  return {
    ...snapshot,
    clientPortalTokens: snapshot.clientPortalTokens.map((token) =>
      token.id === tokenId ? { ...token, revokedAt: date, revokedReason: reason } : token,
    ),
    activityLog: target
      ? [
          {
            ...EMPTY_ACTIVITY_LOG,
            id: createId("log"),
            workspaceId: snapshot.context.workspaceId ?? null,
            actorUserId: snapshot.context.userId ?? null,
            leadId: lead?.id ?? null,
            caseId: target.caseId,
            caseItemId: null,
            eventScope: "system",
            eventType: "portal_token_revoked",
            eventTitle: "Odwolano token portalu klienta",
            eventPayload: { tokenId, reason },
            createdAt: date,
          },
          ...snapshot.activityLog,
        ]
      : snapshot.activityLog,
  }
}

export function registerPortalOpenedSnapshot(snapshot: AppSnapshot, tokenId: string): AppSnapshot {
  const date = nowIso()
  const token = snapshot.clientPortalTokens.find((entry) => entry.id === tokenId) ?? null
  if (!token) return snapshot
  const limiter = checkSecurityRateLimit("public-portal-open", `${snapshot.context.workspaceId ?? "local"}:${tokenId}`)
  if (!limiter.ok) return snapshot
  const lead = snapshot.leads.find((entry) => entry.caseId === token.caseId) ?? null

  return {
    ...snapshot,
    clientPortalTokens: snapshot.clientPortalTokens.map((entry) =>
      entry.id === tokenId ? { ...entry, lastOpenedAt: date } : entry,
    ),
    activityLog: [
      {
        ...EMPTY_ACTIVITY_LOG,
        id: createId("log"),
        workspaceId: snapshot.context.workspaceId ?? null,
        actorUserId: null,
        leadId: lead?.id ?? null,
        caseId: token.caseId,
        caseItemId: null,
        eventScope: "system",
        eventType: "portal_opened",
        eventTitle: "Otwarto panel klienta",
        eventPayload: { tokenId },
        createdAt: date,
      },
      ...snapshot.activityLog,
    ],
  }
}

export function registerPortalTokenFailureSnapshot(snapshot: AppSnapshot, tokenHash: string): AppSnapshot {
  const date = nowIso()
  const target = snapshot.clientPortalTokens.find((entry) => entry.tokenHash === tokenHash) ?? null
  if (!target) return snapshot
  const nextFailedAttempts = (target.failedAttempts || 0) + 1
  const lockForMinutes = nextFailedAttempts >= 5 ? 15 : 0
  const lockedUntil =
    lockForMinutes > 0
      ? new Date(new Date(date).getTime() + lockForMinutes * 60 * 1000).toISOString()
      : target.lockedUntil
  const lead = snapshot.leads.find((entry) => entry.caseId === target.caseId) ?? null

  return {
    ...snapshot,
    clientPortalTokens: snapshot.clientPortalTokens.map((entry) =>
      entry.id === target.id
        ? {
            ...entry,
            failedAttempts: nextFailedAttempts,
            lastFailedAt: date,
            lockedUntil,
          }
        : entry,
    ),
    activityLog: [
      {
        ...EMPTY_ACTIVITY_LOG,
        id: createId("log"),
        workspaceId: snapshot.context.workspaceId ?? null,
        actorUserId: null,
        leadId: lead?.id ?? null,
        caseId: target.caseId,
        caseItemId: null,
        eventScope: "system",
        eventType: "portal_token_failed_attempt",
        eventTitle: "Nieudana proba dostepu do portalu klienta",
        eventPayload: {
          tokenId: target.id,
          failedAttempts: nextFailedAttempts,
          lockedUntil,
        },
        createdAt: date,
      },
      ...snapshot.activityLog,
    ],
  }
}

export function addFileAttachmentSnapshot(
  snapshot: AppSnapshot,
  payload: {
    caseId: string
    caseItemId?: string | null
    fileName: string
    mimeType: string
    fileSizeBytes: number
    storagePath?: string
    uploadedByRole?: "client" | "operator" | "system"
    uploadedByLabel?: string
  },
): AppSnapshot {
  const date = nowIso()
  const workspaceId = snapshot.context.workspaceId ?? null
  const limiter = checkSecurityRateLimit(
    "public-upload",
    `${workspaceId ?? "local"}:${payload.caseId}:${payload.caseItemId ?? "none"}`,
  )
  if (!limiter.ok) return snapshot
  const record: FileAttachment = {
    ...EMPTY_FILE_ATTACHMENT,
    id: createId("fa"),
    workspaceId,
    caseId: payload.caseId,
    caseItemId: payload.caseItemId ?? null,
    fileName: payload.fileName,
    mimeType: payload.mimeType,
    fileSizeBytes: payload.fileSizeBytes,
    storagePath: payload.storagePath ?? `/portal/${payload.caseId}/${payload.fileName}`,
    uploadedByRole: payload.uploadedByRole ?? "client",
    uploadedByLabel: payload.uploadedByLabel ?? "Klient",
    createdAt: date,
  }

  return runLeadCaseAutomation({
    ...snapshot,
    fileAttachments: [record, ...snapshot.fileAttachments],
    activityLog: [
      {
        ...EMPTY_ACTIVITY_LOG,
        id: createId("log"),
        workspaceId,
        actorUserId: snapshot.context.userId ?? null,
        caseId: payload.caseId,
        caseItemId: payload.caseItemId ?? null,
        eventScope: "operations",
        eventType: "file_uploaded",
        eventTitle: "Dodano plik do sprawy",
        eventPayload: {
          fileName: payload.fileName,
          mimeType: payload.mimeType,
          sizeBytes: payload.fileSizeBytes,
          uploadedByRole: payload.uploadedByRole ?? "client",
        },
        createdAt: date,
      },
      ...snapshot.activityLog,
    ],
  })
}

export function addApprovalSnapshot(
  snapshot: AppSnapshot,
  payload: {
    caseId: string
    caseItemId?: string | null
    requestedToEmail: string
    status: RequestStatus
    decision?: Approval["decision"]
    optionValue?: string
    actorRole?: "client" | "operator" | "system"
    actorLabel?: string
    note: string
    decidedAt?: string
  },
): AppSnapshot {
  const date = nowIso()
  const workspaceId = snapshot.context.workspaceId ?? null
  const limiter = checkSecurityRateLimit(
    "public-acceptance",
    `${workspaceId ?? "local"}:${payload.caseId}:${payload.caseItemId ?? "none"}`,
  )
  if (!limiter.ok) return snapshot
  const record: Approval = {
    ...EMPTY_APPROVAL,
    id: createId("apr"),
    workspaceId,
    caseId: payload.caseId,
    caseItemId: payload.caseItemId ?? null,
    requestedToEmail: payload.requestedToEmail,
    status: payload.status,
    decision: payload.decision ?? "submitted",
    optionValue: payload.optionValue ?? "",
    actorRole: payload.actorRole ?? "client",
    actorLabel: payload.actorLabel ?? "Klient",
    note: payload.note,
    decidedAt: payload.decidedAt ?? "",
    createdAt: date,
    updatedAt: date,
  }

  return runLeadCaseAutomation({
    ...snapshot,
    approvals: [record, ...snapshot.approvals],
    activityLog: [
      {
        ...EMPTY_ACTIVITY_LOG,
        id: createId("log"),
        workspaceId,
        actorUserId: snapshot.context.userId ?? null,
        caseId: payload.caseId,
        caseItemId: payload.caseItemId ?? null,
        eventScope: "operations",
        eventType: "approval_decision",
        eventTitle: "Zapisano decyzje/akceptacje",
        eventPayload: {
          status: payload.status,
          decision: payload.decision ?? "submitted",
          actorRole: payload.actorRole ?? "client",
        },
        createdAt: date,
      },
      ...snapshot.activityLog,
    ],
  })
}

export function addNotificationSnapshot(
  snapshot: AppSnapshot,
  payload: {
    userId: string
    channel: "in_app" | "email"
    kind?: string
    dedupeKey?: string
    title: string
    message: string
    relatedLeadId?: string | null
    relatedCaseId?: string | null
    recipient?: string
  },
): AppSnapshot {
  const kind = payload.kind ?? "manual"
  const dedupeKey = payload.dedupeKey ?? `manual:${payload.channel}:${createId("dedupe")}`
  if (kind.includes("reminder")) {
    const limiter = checkSecurityRateLimit(
      "reminder-trigger",
      `${snapshot.context.workspaceId ?? "local"}:${payload.relatedCaseId ?? payload.userId}`,
    )
    if (!limiter.ok) {
      return snapshot
    }
  }
  const queued = queueWorkflowNotification(snapshot, snapshot.notifications, snapshot.notificationDeliveryLog, {
    userId: payload.userId,
    channel: payload.channel,
    kind,
    dedupeKey,
    title: payload.title,
    message: payload.message,
    relatedLeadId: payload.relatedLeadId ?? null,
    relatedCaseId: payload.relatedCaseId ?? null,
    recipient: payload.recipient,
  })

  return {
    ...snapshot,
    notifications: queued.notifications,
    notificationDeliveryLog: queued.deliveryLog,
    activityLog: payload.kind?.includes("reminder")
      ? [
          {
            ...EMPTY_ACTIVITY_LOG,
            id: createId("log"),
            workspaceId: snapshot.context.workspaceId ?? null,
            actorUserId: snapshot.context.userId ?? null,
            leadId: payload.relatedLeadId ?? null,
            caseId: payload.relatedCaseId ?? null,
            caseItemId: null,
            eventScope: "system",
            eventType: "reminder_sent",
            eventTitle: "Wyslano przypomnienie",
            eventPayload: {
              channel: payload.channel,
              kind: payload.kind,
              recipient: payload.recipient ?? payload.userId,
            },
            createdAt: nowIso(),
          },
          ...snapshot.activityLog,
        ]
      : snapshot.activityLog,
  }
}

export function resetInitialSnapshot(): AppSnapshot {
  return cloneSnapshot(createInitialSnapshot())
}
