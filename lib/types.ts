export type Priority = "high" | "medium" | "low"
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualification"
  | "proposal_sent"
  | "follow_up"
  | "won"
  | "ready_to_start"
  | "lost"

export type SourceOption =
  | "Instagram"
  | "Facebook"
  | "Messenger"
  | "WhatsApp"
  | "E-mail"
  | "Formularz"
  | "Telefon"
  | "Polecenie"
  | "Cold outreach"
  | "LinkedIn"
  | "Strona www"
  | "Inne"

export type ItemRecordType = "task" | "event" | "note"
export type ItemType =
  | "follow_up"
  | "call"
  | "reply"
  | "proposal"
  | "check_reply"
  | "meeting"
  | "deadline"
  | "task"
  | "note"
  | "other"

export type ItemStatus = "todo" | "done" | "snoozed"
export type ReminderRule =
  | "none"
  | "at_time"
  | "1h_before"
  | "tomorrow"
  | "daily"
  | "every_2_days"
  | "weekly"
  | "monthly"
  | "friday"

export type BillingStatus = "local" | "trial" | "active" | "past_due"
export type PlanStatus = Exclude<BillingStatus, "local">
export type FontScale = "compact" | "default" | "large"
export type ViewProfile = "desktop" | "mobile"
export type AccessStatus = "local" | "trial_active" | "trial_expired" | "paid_active" | "payment_failed" | "canceled"
export type AppTheme = "classic" | "midnight"
export type SignupSource = "google" | "email_password" | "invite" | "manual" | "unknown"
export type WorkspaceMemberRole = "owner"
export type BonusKind = "promo_code" | "referral" | "manual"

export interface Lead {
  id: string
  workspaceId?: string | null
  name: string
  company: string
  email: string
  phone: string
  source: SourceOption
  contactId?: string | null
  caseId?: string | null
  value: number
  summary: string
  notes: string
  status: LeadStatus
  priority: Priority
  nextActionTitle: string
  nextActionAt: string
  nextActionItemId: string | null
  createdAt: string
  updatedAt: string
}

export interface WorkItem {
  id: string
  workspaceId?: string | null
  leadId: string | null
  leadLabel?: string
  recordType: ItemRecordType
  type: ItemType
  title: string
  description: string
  status: ItemStatus
  priority: Priority
  scheduledAt: string
  startAt: string
  endAt: string
  recurrence: ReminderRule
  reminder: ReminderRule
  createdAt: string
  updatedAt: string
  showInTasks: boolean
  showInCalendar: boolean
}

export type LeadInput = Omit<Lead, "id" | "createdAt" | "updatedAt" | "nextActionItemId">
export type WorkItemInput = Omit<WorkItem, "id" | "createdAt" | "updatedAt">
export type SettingsPatch = Partial<SettingsState>

export interface BillingState {
  planName: string
  status: PlanStatus
  renewAt: string
  trialEndsAt: string
  canCreate: boolean
}

export interface SettingsState {
  timezone: string
  inAppReminders: boolean
  emailReminders: boolean
  defaultReminder: ReminderRule
  caseReminderFrequency: "daily" | "every_2_days" | "weekly"
  defaultSnooze: "1h" | "tomorrow" | "2d" | "week"
  workspaceName: string
  fontScale: FontScale
  viewProfile: ViewProfile
  theme: AppTheme
}

export interface UserState {
  name: string
  email: string
}

export interface SnapshotContextState {
  userId: string | null
  workspaceId: string | null
  accessStatus: AccessStatus
  billingStatus: BillingStatus
  seedKind?: "demo"
}

export interface AppSnapshot {
  user: UserState
  context: SnapshotContextState
  billing: BillingState
  settings: SettingsState
  leads: Lead[]
  items: WorkItem[]
  caseTemplates: CaseTemplate[]
  templateItems: TemplateItem[]
  fileAttachments: FileAttachment[]
  approvals: Approval[]
  notifications: NotificationRecord[]
  notificationDeliveryLog: NotificationDeliveryLogRecord[]
  clientPortalTokens: ClientPortalTokenRecord[]
  activityLog: ActivityLogRecord[]
}

export interface ProfileRecord {
  id: string
  normalizedEmail: string
  email: string | null
  displayName: string
  timezone: string
  isEmailVerified: boolean
  signupSource: SignupSource
  invitedByUserId: string | null
  createdAt: string
  updatedAt: string
}

export interface WorkspaceRecord {
  id: string
  ownerUserId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceMemberRecord {
  workspaceId: string
  userId: string
  role: WorkspaceMemberRole
  createdAt: string
}

export interface AccessStatusRecord {
  workspaceId: string
  userId: string
  accessStatus: Exclude<AccessStatus, "local">
  trialStart: string
  trialEnd: string
  paidUntil: string | null
  billingCustomerId: string | null
  billingSubscriptionId: string | null
  planName: string
  trialUsed: boolean
  signupSource: SignupSource
  bonusCodeUsed: string | null
  bonusKind: BonusKind | null
  bonusAppliedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface SettingsRecord extends SettingsState {
  workspaceId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface LeadRecord extends Lead {
  workspaceId: string
  createdByUserId: string | null
}

export interface WorkItemRecord extends WorkItem {
  workspaceId: string
  createdByUserId: string | null
}

export type CaseOperationalStatus =
  | "not_started"
  | "collecting_materials"
  | "waiting_for_client"
  | "for_review"
  | "ready_to_start"
  | "in_progress"
  | "blocked"
  | "closed"

export type CaseItemStatus =
  | "none"
  | "request_sent"
  | "submitted"
  | "for_review"
  | "needs_fix"
  | "approved"
  | "not_applicable"

export type RequestStatus = "not_sent" | "sent" | "reminder_sent" | "responded" | "overdue"

export interface Contact {
  id: string
  workspaceId?: string | null
  fullName: string
  company: string
  email: string
  phone: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface CaseRecordDomain {
  id: string
  workspaceId?: string | null
  contactId: string | null
  sourceLeadId: string | null
  title: string
  description: string
  salesStatus: LeadStatus
  operationalStatus: CaseOperationalStatus
  value: number
  startedAt: string
  dueAt: string
  closedAt: string
  createdAt: string
  updatedAt: string
}

export interface CaseTemplate {
  id: string
  workspaceId?: string | null
  name: string
  caseType: string
  description: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type TemplateItemKind = "file" | "decision" | "approval" | "response" | "access"

export interface TemplateItem {
  id: string
  workspaceId?: string | null
  templateId: string
  title: string
  itemType: TemplateItemKind
  description: string
  sortOrder: number
  required: boolean
  createdAt: string
  updatedAt: string
}

export interface CaseItem {
  id: string
  workspaceId?: string | null
  caseId: string
  templateItemId: string | null
  title: string
  description: string
  status: CaseItemStatus
  sortOrder: number
  dueAt: string
  completedAt: string
  createdAt: string
  updatedAt: string
}

export interface FileAttachment {
  id: string
  workspaceId?: string | null
  caseId: string | null
  caseItemId: string | null
  fileName: string
  mimeType: string
  fileSizeBytes: number
  storagePath: string
  uploadedByRole: "client" | "operator" | "system"
  uploadedByLabel: string
  createdAt: string
}

export type ApprovalDecision =
  | "accepted"
  | "rejected"
  | "needs_changes"
  | "option_a"
  | "option_b"
  | "option_c"
  | "submitted"
  | "answered"

export interface Approval {
  id: string
  workspaceId?: string | null
  caseId: string | null
  caseItemId: string | null
  requestedToEmail: string
  status: RequestStatus
  decision: ApprovalDecision
  optionValue: string
  actorRole: "client" | "operator" | "system"
  actorLabel: string
  note: string
  decidedAt: string
  createdAt: string
  updatedAt: string
}

export interface ActivityLogRecord {
  id: string
  workspaceId?: string | null
  actorUserId: string | null
  leadId: string | null
  caseId: string | null
  caseItemId: string | null
  eventScope: "sales" | "operations" | "system"
  eventType: string
  eventTitle: string
  eventPayload: Record<string, unknown>
  createdAt: string
}

export interface NotificationRecord {
  id: string
  workspaceId?: string | null
  userId: string
  channel: "in_app" | "email"
  kind: string
  dedupeKey: string
  title: string
  message: string
  relatedLeadId: string | null
  relatedCaseId: string | null
  readAt: string
  createdAt: string
}

export interface NotificationDeliveryLogRecord {
  id: string
  workspaceId?: string | null
  notificationId: string
  channel: "in_app" | "email"
  recipient: string
  status: "sent" | "queued" | "skipped" | "failed"
  error: string
  sentAt: string
  createdAt: string
}

export interface ClientPortalTokenRecord {
  id: string
  workspaceId?: string | null
  caseId: string
  tokenHash: string
  expiresAt: string
  revokedAt: string
  revokedReason: string
  failedAttempts: number
  lastFailedAt: string
  lockedUntil: string
  lastOpenedAt: string
  createdAt: string
}

