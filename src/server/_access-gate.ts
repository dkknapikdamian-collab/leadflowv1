import { supabaseRequest } from './_supabase.js';
import { assertSupabaseEmailVerifiedForMutation } from './_supabase-auth.js';
import type { AccessState, BillingStatus } from '../lib/domain-statuses.js';
import { FREE_LIMITS as PLAN_FREE_LIMITS, buildPlanAccessModel, type PlanFeatureKey } from '../lib/plans.js';

type WorkspaceAccessRow = {
  id?: string | null;
  plan_id?: string | null;
  planId?: string | null;
  subscription_status?: BillingStatus | null;
  subscriptionStatus?: BillingStatus | null;
  trial_ends_at?: string | null;
  trialEndsAt?: string | null;
  next_billing_at?: string | null;
  nextBillingAt?: string | null;
};

export type WorkspaceWriteAccess = {
  hasWriteAccess: boolean;
  status: AccessState;
};

export const FREE_LIMITS = PLAN_FREE_LIMITS;

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parseDate(value: unknown) {
  const raw = asText(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isFinite(date.getTime()) ? date : null;
}

function isFutureDate(value: unknown) {
  const date = parseDate(value);
  return !!date && date.getTime() > Date.now();
}

function isPastDate(value: unknown) {
  const date = parseDate(value);
  return !!date && date.getTime() < Date.now();
}

function toAccessState(value: unknown): AccessState {
  const status = asText(value);
  return (status || 'inactive') as AccessState;
}

export function getWorkspaceWriteAccess(workspace: WorkspaceAccessRow | null): WorkspaceWriteAccess {
  if (!workspace) {
    return {
      hasWriteAccess: false,
      status: 'workspace_missing',
    };
  }

  const status = toAccessState(workspace.subscription_status ?? workspace.subscriptionStatus);
  const trialEndsAt = workspace.trial_ends_at ?? workspace.trialEndsAt ?? null;
  const nextBillingAt = workspace.next_billing_at ?? workspace.nextBillingAt ?? null;

  if (status === 'paid_active') {
    if (isPastDate(nextBillingAt)) {
      return {
        hasWriteAccess: false,
        status: 'payment_failed',
      };
    }

    return {
      hasWriteAccess: true,
      status: 'paid_active',
    };
  }

  if (status === 'trial_active' || status === 'trial_ending') {
    return {
      hasWriteAccess: isFutureDate(trialEndsAt),
      status: isFutureDate(trialEndsAt) ? status : 'trial_expired',
    };
  }

  if (status === 'free_active') {
    return {
      hasWriteAccess: true,
      status: 'free_active',
    };
  }

  return {
    hasWriteAccess: false,
    status,
  };
}

async function countRows(path: string) {
  const rows = await supabaseRequest(path, {
    method: 'GET',
    headers: { Prefer: 'return=representation' },
  });
  return Array.isArray(rows) ? rows.length : 0;
}

export async function assertWorkspaceEntityLimit(workspaceId: string, entity: 'lead' | 'task' | 'event' | 'ai_draft') {
  const access = await fetchWorkspaceWriteAccess(workspaceId);
  if (access.status !== 'free_active') return;

  if (entity === 'lead') {
    const leads = await countRows(`leads?select=id&workspace_id=eq.${encodeURIComponent(workspaceId)}&lead_visibility=eq.active&limit=${FREE_LIMITS.activeLeads + 1}`);
    if (leads >= FREE_LIMITS.activeLeads) throw new Error('FREE_LIMIT_LEADS_REACHED');
    return;
  }

  if (entity === 'task') {
    const tasks = await countRows(`work_items?select=id&workspace_id=eq.${encodeURIComponent(workspaceId)}&record_type=eq.task&status=not.in.(done,completed,cancelled)&limit=${FREE_LIMITS.activeTasks + 1}`);
    if (tasks >= FREE_LIMITS.activeTasks) throw new Error('FREE_LIMIT_TASKS_REACHED');
    return;
  }

  if (entity === 'event') {
    const events = await countRows(`work_items?select=id&workspace_id=eq.${encodeURIComponent(workspaceId)}&record_type=eq.event&status=not.in.(done,completed,cancelled)&limit=${FREE_LIMITS.activeEvents + 1}`);
    if (events >= FREE_LIMITS.activeEvents) throw new Error('FREE_LIMIT_EVENTS_REACHED');
    return;
  }

  const drafts = await countRows(`ai_drafts?select=id&workspace_id=eq.${encodeURIComponent(workspaceId)}&status=eq.draft&limit=${FREE_LIMITS.activeDrafts + 1}`);
  if (drafts >= FREE_LIMITS.activeDrafts) throw new Error('FREE_LIMIT_AI_DRAFTS_REACHED');
}

function getUnavailableFeatureErrorCode(feature: PlanFeatureKey) {
  if (feature === 'ai' || feature === 'fullAi') return 'AI_NOT_AVAILABLE_ON_PLAN';
  if (feature === 'googleCalendar') return 'GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN';
  if (feature === 'digest') return 'DIGEST_NOT_AVAILABLE_ON_PLAN';
  return 'FEATURE_NOT_AVAILABLE_ON_PLAN';
}

export async function assertWorkspaceFeatureAllowed(workspaceId: string, feature: PlanFeatureKey) {
  const access = await fetchWorkspaceWriteAccess(workspaceId);

  if (!access.hasWriteAccess) {
    throw new Error(`WORKSPACE_WRITE_ACCESS_REQUIRED:${access.status}`);
  }

  if (!access.features[feature]) {
    throw new Error(`${getUnavailableFeatureErrorCode(feature)}:${access.planId}`);
  }

  return access;
}

export async function assertWorkspaceAiAllowed(workspaceId: string) {
  return assertWorkspaceFeatureAllowed(workspaceId, 'ai');
}

export async function assertWorkspaceGoogleCalendarAllowed(workspaceId: string) {
  return assertWorkspaceFeatureAllowed(workspaceId, 'googleCalendar');
}


export async function fetchWorkspaceWriteAccess(workspaceId: string) {
  const rows = await supabaseRequest(
    `workspaces?select=id,plan_id,subscription_status,trial_ends_at,next_billing_at&id=eq.${encodeURIComponent(workspaceId)}&limit=1`,
    {
      method: 'GET',
      headers: { Prefer: 'return=representation' },
    },
  );

  const workspace = Array.isArray(rows) && rows[0] && typeof rows[0] === 'object'
    ? rows[0] as WorkspaceAccessRow
    : null;

  const writeAccess = getWorkspaceWriteAccess(workspace);
  const planAccess = buildPlanAccessModel({
    planId: workspace?.plan_id ?? workspace?.planId ?? null,
    subscriptionStatus: writeAccess.status,
    isTrialActive: writeAccess.status === 'trial_active' || writeAccess.status === 'trial_ending',
  });

  return {
    ...writeAccess,
    planId: planAccess.planId,
    subscriptionStatus: writeAccess.status,
    limits: planAccess.limits,
    features: planAccess.features,
  };
}

export async function assertWorkspaceWriteAccess(workspaceId: string, req?: any) {
  if (req) {
    await assertSupabaseEmailVerifiedForMutation(req);
  }

  const access = await fetchWorkspaceWriteAccess(workspaceId);

  if (!access.hasWriteAccess) {
    throw new Error(`WORKSPACE_WRITE_ACCESS_REQUIRED:${access.status}`);
  }

  return access;
}
