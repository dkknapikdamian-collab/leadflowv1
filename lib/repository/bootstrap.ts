import type {
  AccessStatusRecord,
  ProfileRecord,
  SettingsRecord,
  SignupSource,
  WorkspaceMemberRecord,
  WorkspaceRecord,
} from "@/lib/types"

function addDaysIso(iso: string, days: number) {
  const base = new Date(iso)
  base.setUTCDate(base.getUTCDate() + days)
  return base.toISOString()
}

export function createBootstrapRecords(input: {
  userId: string
  workspaceId: string
  normalizedEmail: string
  email: string | null
  displayName: string
  authProvider: SignupSource
  timezone?: string
  invitedByUserId?: string | null
  emailVerified?: boolean
  now?: string
}) {
  const now = input.now ?? new Date().toISOString()
  const timezone = input.timezone ?? "Europe/Warsaw"

  const profile: ProfileRecord = {
    id: input.userId,
    normalizedEmail: input.normalizedEmail,
    email: input.email,
    displayName: input.displayName,
    timezone,
    isEmailVerified: input.emailVerified ?? false,
    signupSource: input.authProvider,
    invitedByUserId: input.invitedByUserId ?? null,
    createdAt: now,
    updatedAt: now,
  }

  const workspace: WorkspaceRecord = {
    id: input.workspaceId,
    ownerUserId: input.userId,
    name: "LeadFlow",
    createdAt: now,
    updatedAt: now,
  }

  const workspaceMember: WorkspaceMemberRecord = {
    workspaceId: input.workspaceId,
    userId: input.userId,
    role: "owner",
    createdAt: now,
  }

  const accessStatus: AccessStatusRecord = {
    workspaceId: input.workspaceId,
    userId: input.userId,
    accessStatus: "trial_active",
    trialStart: now,
    trialEnd: addDaysIso(now, 7),
    paidUntil: null,
    billingCustomerId: null,
    billingSubscriptionId: null,
    planName: "Solo",
    trialUsed: true,
    signupSource: input.authProvider,
    createdAt: now,
    updatedAt: now,
  }

  const settings: SettingsRecord = {
    workspaceId: input.workspaceId,
    userId: input.userId,
    timezone,
    inAppReminders: true,
    emailReminders: false,
    defaultReminder: "1h_before",
    defaultSnooze: "tomorrow",
    workspaceName: "LeadFlow",
    fontScale: "compact",
    viewProfile: "desktop",
    theme: "classic",
    createdAt: now,
    updatedAt: now,
  }

  return {
    profile,
    workspace,
    workspaceMember,
    accessStatus,
    settings,
  }
}
