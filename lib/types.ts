export type Priority = "high" | "medium" | "low"
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualification"
  | "offer_sent"
  | "follow_up"
  | "won"
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
export type CaseStatus =
  | "not_started"
  | "collecting_materials"
  | "waiting_for_client"
  | "under_review"
  | "ready_to_start"
  | "in_progress"
  | "blocked"
  | "closed"
export type CaseItemKind =
  | "task"
  | "checklist"
  | "milestone"
  | "document"
  | "approval"
  | "file"
  | "decision"
  | "response"
  | "access"
export type CaseTemplateServiceType = "website" | "branding" | "ads_campaign" | "client_onboarding" | "custom"
export type CaseItemStatus =
  | "none"
  | "request_sent"
  | "delivered"
  | "under_review"
  | "needs_correction"
  | "accepted"
  | "not_applicable"
export type ApprovalStatus = "not_sent" | "sent" | "reminder_sent" | "answered" | "overdue"
export type AttachmentScope = "case" | "case_item"
export type ActivitySource = "sales" | "operations" | "system"
export type ActivityType =
  | "lead_created"
  | "lead_updated"
  | "lead_status_changed"
  | "lead_converted_to_case"
  | "case_created"
  | "case_updated"
  | "case_status_changed"
  | "case_item_created"
  | "case_item_updated"
  | "case_item_completed"
  | "file_uploaded"
  | "approval_requested"
  | "approval_decision"
  | "notification_scheduled"
  | "notification_sent"
  | "reminder_triggered"
export type NotificationChannel = "in_app" | "email" | "sms"
export type NotificationStatus = "queued" | "sent" | "failed" | "read" | "dismissed"

export type LeadAlarmReason =
  | "missing_next_step"
  | "next_step_overdue"
  | "waiting_too_long"
  | "high_value_stale"
  | "inactive_too_long"
  | "too_many_open_actions"
  | "no_followup_after_meeting"
  | "no_followup_after_proposal"

export type LeadRiskState = "ok" | "at_risk"

export interface Lead {
  id: string
  workspaceId?: string | null
  contactId?: string | null
  caseId?: string | null
  name: string
  company: string
  email: string
  phone: string
  source: SourceOption
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

export interface Contact {
  id: string
  workspaceId: string
  createdByUserId?: string | null
  name: string
  company: string
  email: string
  phone: string
  normalizedEmail: string
  normalizedPhone: string
  createdAt: string
  updatedAt: string
}

export interface CaseTemplate {
  id: string
  workspaceId: string
  createdByUserId?: string | null
  code: string
  title: string
  description: string
  serviceType: CaseTemplateServiceType
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface TemplateItem {
  id: string
  workspaceId: string
  templateId: string
  createdByUserId?: string | null
  sortOrder: number
  kind: CaseItemKind
  title: string
  description: string
  required: boolean
  defaultDueOffsetDays: number | null
  createdAt: string
  updatedAt: string
}

export interface Case {
  id: string
  workspaceId: string
  contactId: string
  sourceLeadId: string | null
  templateId: string | null
  createdByUserId?: string | null
  ownerUserId: string | null
  title: string
  description: string
  status: CaseStatus
  priority: Priority
  value: number
  startAt: string | null
  dueAt: string | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CaseItem {
  id: string
  workspaceId: string
  caseId: string
  templateItemId: string | null
  createdByUserId?: string | null
  ownerUserId: string | null
  sortOrder: number
  kind: CaseItemKind
  title: string
  description: string
  status: CaseItemStatus
  required: boolean
  dueAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface FileAttachment {
  id: string
  workspaceId: string
  caseId: string | null
  caseItemId: string | null
  scope: AttachmentScope
  uploadedByUserId?: string | null
  fileName: string
  fileType: string
  fileSizeBytes: number
  storagePath: string
  createdAt: string
}

export interface Approval {
  id: string
  workspaceId: string
  caseId: string | null
  caseItemId: string | null
  requestedByUserId?: string | null
  reviewerUserId: string | null
  reviewerContactId: string | null
  status: ApprovalStatus
  title: string
  description: string
  dueAt: string | null
  decidedAt: string | null
  decisionNote: string
  createdAt: string
  updatedAt: string
}

export interface ActivityLogEntry {
  id: string
  workspaceId: string
  actorUserId: string | null
  actorContactId: string | null
  source: ActivitySource
  type: ActivityType
  leadId: string | null
  caseId: string | null
  caseItemId: string | null
  attachmentId: string | null
  approvalId: string | null
  notificationId: string | null
  payload: Record<string, unknown>
  createdAt: string
}

export interface AppNotification {
  id: string
  workspaceId: string
  caseId: string | null
  caseItemId: string | null
  leadId: string | null
  contactId: string | null
  channel: NotificationChannel
  status: NotificationStatus
  title: string
  body: string
  scheduledAt: string
  sentAt: string | null
  readAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ClientPortalToken {
  id: string
  workspaceId: string
  caseId: string
  contactId: string
  tokenHash: string
  createdByUserId?: string | null
  expiresAt: string
  revokedAt: string | null
  lastUsedAt: string | null
  createdAt: string
  updatedAt: string
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
  contacts?: Contact[]
  cases?: Case[]
  caseTemplates?: CaseTemplate[]
  templateItems?: TemplateItem[]
  caseItems?: CaseItem[]
  fileAttachments?: FileAttachment[]
  approvals?: Approval[]
  activityLog?: ActivityLogEntry[]
  notifications?: AppNotification[]
  clientPortalTokens?: ClientPortalToken[]
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

export interface ContactRecord extends Contact {}
export interface CaseTemplateRecord extends CaseTemplate {}
export interface TemplateItemRecord extends TemplateItem {}
export interface CaseRecord extends Case {}
export interface CaseItemRecord extends CaseItem {}
export interface FileAttachmentRecord extends FileAttachment {}
export interface ApprovalRecord extends Approval {}
export interface ActivityLogRecord extends ActivityLogEntry {}
export interface NotificationRecord extends AppNotification {}
export interface ClientPortalTokenRecord extends ClientPortalToken {}
