export type Priority = "high" | "medium" | "low"
export type LeadStatus =
  | "new"
  | "contacted"
  | "waiting"
  | "followup_needed"
  | "meeting_scheduled"
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
