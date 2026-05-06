import { selectFirstAvailable } from './_supabase.js';
import { FREE_LIMITS as PLAN_FREE_LIMITS, getPlanLimits, normalizePlanId, PLAN_IDS, isPlanFeatureEnabled } from '../lib/plans.js';

/* A13_STATIC_CONTRACT_GUARD trial_expired free_active FREE_LIMITS */
/* PHASE0_WORKSPACE_WRITE_ACCESS_RUNTIME_REQ_COMPAT_2026_05_03 */
/* P0_WORKSPACE_WRITE_ACCESS_STATUS_COMPAT_2026_05_03 */
/* BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14 */

export const FREE_LIMITS = PLAN_FREE_LIMITS;

type WorkspaceAccessRow = Record<string, unknown>;

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asLowerText(value: unknown) {
  return asText(value).toLowerCase();
}

function isPastDate(value: unknown) {
  if (!value) return false;
  const parsed = new Date(String(value));
  return Number.isFinite(parsed.getTime()) && parsed.getTime() < Date.now();
}

function asRecord(value: unknown): WorkspaceAccessRow {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as WorkspaceAccessRow : {};
}

function isRequestLike(value: unknown) {
  const row = asRecord(value);
  return Boolean(row.headers || row.method || row.query || row.body || row.url);
}

function makeGateError(message: string, statusCode = 402) {
  const error: any = new Error(message);
  error.status = statusCode;
  error.statusCode = statusCode;
  error.code = message;
  return error;
}

function readWorkspaceStatus(workspaceInput: unknown, statusInput?: unknown) {
  const row = asRecord(workspaceInput);
  const explicitStatus = isRequestLike(statusInput) ? undefined : statusInput;

  return asLowerText(
    explicitStatus
      ?? row.subscription_status
      ?? row.access_status
      ?? row.billing_status
      ?? row.plan_status
      ?? row.status
      ?? 'trial_active',
  );
}

function readNextBillingAt(workspaceInput: unknown, nextBillingAtInput?: unknown) {
  const row = asRecord(workspaceInput);
  return nextBillingAtInput
    ?? row.nextBillingAt
    ?? row.next_billing_at
    ?? row.current_period_end
    ?? row.billing_period_ends_at
    ?? null;
}

function readTrialEndsAt(workspaceInput: unknown, trialEndsAtInput?: unknown) {
  const row = asRecord(workspaceInput);
  return trialEndsAtInput
    ?? row.trialEndsAt
    ?? row.trial_ends_at
    ?? row.trial_until
    ?? row.trialUntil
    ?? null;
}

function readPlanId(workspaceInput: unknown, planInput?: unknown) {
  const row = asRecord(workspaceInput);
  return asLowerText(
    planInput
      ?? row.plan_id
      ?? row.planId
      ?? row.plan
      ?? row.billing_plan
      ?? row.billingPlan
      ?? row.subscription_plan
      ?? row.subscriptionPlan
      ?? row.product_plan
      ?? row.productPlan
      ?? '',
  );
}

function hasFutureDate(value: unknown) {
  if (!value) return false;
  const parsed = new Date(String(value));
  return Number.isFinite(parsed.getTime()) && parsed.getTime() >= Date.now();
}

function isBlankStatus(value: string) {
  return !value || value === 'null' || value === 'undefined';
}

function isPaidPlan(plan: string) {
  return [
    'basic',
    'pro',
    'ai',
    'business',
    'closeflow_basic',
    'closeflow_basic_yearly',
    'closeflow_pro',
    'closeflow_pro_yearly',
    'closeflow_ai',
    'closeflow_ai_yearly',
    'closeflow_business',
    'closeflow_business_yearly',
    'solo_mini',
    'solo_full',
    'team_mini',
    'team_full',
  ].includes(plan);
}


const BILLING_BLOCKED_ACCESS_STATUS_STAGE86B = [
  { status: 'payment_failed', reason: 'Stripe webhook reported failed payment' },
  { status: 'trial_expired', reason: 'Trial expired without paid webhook confirmation' },
  { status: 'inactive', reason: 'No active trial, Free fallback or paid webhook confirmation' },
  { status: 'canceled', reason: 'Subscription canceled by Stripe or user action' },
] as const;

function isBlockedBillingAccessStatus(status: string) {
  return BILLING_BLOCKED_ACCESS_STATUS_STAGE86B.some((entry) => entry.status === status);
}

function normalizeWorkspaceAccessStatus(workspaceInput: unknown, statusInput?: unknown) {
  const rawStatus = readWorkspaceStatus(workspaceInput, statusInput);
  const plan = readPlanId(workspaceInput);
  const trialEndsAt = readTrialEndsAt(workspaceInput);
  const freePlan = plan === 'free' || plan === 'free_active';
  const trialPlan = plan === 'trial' || plan === 'trial_21d';

  // Runtime repair for rows created before billing/trial bootstrap was fully stable.
  // If the stored subscription_status says expired/inactive but the trial date is still valid,
  // writes must remain allowed. Otherwise basic CRUD can fail with WORKSPACE_WRITE_ACCESS_REQUIRED.
  if ((rawStatus === 'trial_expired' || rawStatus === 'inactive') && hasFutureDate(trialEndsAt)) {
    return 'trial_active';
  }

  // After trial, a workspace can deliberately operate in limited Free mode.
  if (rawStatus === 'free' || rawStatus === 'free_plan' || rawStatus === 'free_user') return 'free_active';
  if (rawStatus === 'trial_expired' && freePlan) return 'free_active';

  // Some older rows stored the plan key in a status-like column.
  if (rawStatus === 'trial' || rawStatus === 'trialing' || rawStatus === 'trial_21d') {
    return isPastDate(trialEndsAt) ? 'trial_expired' : 'trial_active';
  }
  if (rawStatus === 'basic' || rawStatus === 'pro' || rawStatus === 'ai' || rawStatus === 'business' || rawStatus.startsWith('closeflow_')) {
    return 'paid_active';
  }

  if (isBlankStatus(rawStatus) && freePlan) return 'free_active';
  if (isBlankStatus(rawStatus) && isPaidPlan(plan)) return 'paid_active';
  if (isBlankStatus(rawStatus) && trialPlan) return isPastDate(trialEndsAt) ? 'trial_expired' : 'trial_active';

  return rawStatus || 'trial_active';
}

async function selectWorkspaceAccessRow(workspaceId: string) {
  const normalizedWorkspaceId = asText(workspaceId);
  if (!normalizedWorkspaceId) return null;

  try {
    const result = await selectFirstAvailable([
      `workspaces?select=*&id=eq.${encodeURIComponent(normalizedWorkspaceId)}&limit=1`,
    ]);
    const rows = Array.isArray(result?.data) ? result.data as WorkspaceAccessRow[] : [];
    return rows[0] || null;
  } catch {
    return null;
  }
}

// STAGE15_ACCESS_GATE_REQUIRES_WORKSPACE_ID
async function resolveWorkspaceAccessInput(workspaceInput: unknown, statusInput?: unknown) {
  const workspaceId = asText(workspaceInput);

  if (typeof workspaceInput === 'string' && workspaceId) {
    const workspaceRow = await selectWorkspaceAccessRow(workspaceId);
    if (workspaceRow) return workspaceRow;

    // Runtime fallback: workspace ownership/scoping is checked before this billing gate.
    // If the workspace row cannot be read yet, do not block legitimate trial/free users.
    return { id: workspaceId, access_status: 'trial_active' };
  }

  if (isRequestLike(workspaceInput)) {
    throw makeGateError('WORKSPACE_ID_REQUIRED_FOR_ACCESS_GATE', 401);
  }

  return workspaceInput;
}

function isAllowedWriteStatus(status: string, nextBillingAt: unknown) {
  if (isBlockedBillingAccessStatus(status)) return false;
  if (status === 'paid_active' && !isPastDate(nextBillingAt)) return true;
  if (status === 'trial_active' || status === 'trial_ending') return true;
  if (status === 'free_active' || status === 'free') return true;

  // Compatibility with older imported workspace rows and older billing plan labels.
  if (status === 'active' || status === 'trialing' || status === 'trial') return true;
  if (status === 'paid' || status === 'subscription_active') return !isPastDate(nextBillingAt);
  if (status === 'basic' || status === 'pro' || status === 'ai' || status === 'business') return !isPastDate(nextBillingAt);
  if (status.startsWith('closeflow_')) return !isPastDate(nextBillingAt);

  return false;
}

export async function assertWorkspaceWriteAccess(
  workspaceInput: unknown = {},
  statusInput?: unknown,
  nextBillingAtInput?: unknown,
) {
  const workspace = await resolveWorkspaceAccessInput(workspaceInput, statusInput);
  const explicitStatus = isRequestLike(statusInput) ? undefined : statusInput;
  const explicitNextBillingAt = isRequestLike(statusInput) ? undefined : nextBillingAtInput;
  const status = normalizeWorkspaceAccessStatus(workspace, explicitStatus);
  const nextBillingAt = readNextBillingAt(workspace, explicitNextBillingAt);

  if (isAllowedWriteStatus(status, nextBillingAt)) return true;

  throw makeGateError('WORKSPACE_WRITE_ACCESS_REQUIRED', 402);
}


export async function assertWorkspaceFeatureAccess(
  workspaceInput: unknown = {},
  featureInput?: unknown,
  planInput?: unknown,
) {
  const featureName = asText(featureInput);
  if (!featureName) {
    throw makeGateError('WORKSPACE_FEATURE_NAME_REQUIRED', 400);
  }

  const workspace = await resolveWorkspaceAccessInput(workspaceInput, planInput);
  const status = normalizeWorkspaceAccessStatus(workspace);
  const nextBillingAt = readNextBillingAt(workspace);
  const plan = readPlanId(workspace, planInput);

  if (!isAllowedWriteStatus(status, nextBillingAt)) {
    throw makeGateError('WORKSPACE_FEATURE_ACCESS_REQUIRED', 402);
  }

  if (isPlanFeatureEnabled(plan, featureName as any, status)) {
    return true;
  }

  throw makeGateError('WORKSPACE_FEATURE_ACCESS_REQUIRED', 402);
}

export async function assertWorkspaceAiAllowed(
  workspaceInput: unknown = {},
  planInput?: unknown,
) {
  if (process.env.VITE_AI_USAGE_UNLIMITED === 'true' && process.env.NODE_ENV !== 'production') return true;

  try {
    return await assertWorkspaceFeatureAccess(workspaceInput, 'fullAi', planInput);
  } catch {
    throw makeGateError('WORKSPACE_AI_ACCESS_REQUIRED', 402);
  }
}


export async function assertWorkspaceFeatureAllowed(
  workspaceInput: unknown = {},
  featureInput?: unknown,
  planInput?: unknown,
) {
  const requestedFeature = asText(featureInput);
  const normalizedFeature = requestedFeature === 'ai' ? 'fullAi' : requestedFeature;

  try {
    return await assertWorkspaceFeatureAccess(workspaceInput, normalizedFeature, planInput);
  } catch (error) {
    if (requestedFeature === 'ai' || requestedFeature === 'fullAi') {
      throw makeGateError('AI_NOT_AVAILABLE_ON_PLAN', 402);
    }
    if (requestedFeature === 'googleCalendar') {
      throw makeGateError('GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN', 402);
    }
    throw error;
  }
}

/*
STAGE16B_PLAN_ACCESS_GATING_MARKERS
backend feature gate: assertWorkspaceFeatureAllowed
feature keys: 'ai' 'googleCalendar'
errors: AI_NOT_AVAILABLE_ON_PLAN GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN
*/

type WorkspaceEntityLimitKey = keyof typeof FREE_LIMITS;

function normalizeLimitKey(entityName: unknown) {
  const raw = asText(entityName);
  const normalized = raw.toLowerCase();
  if (normalized === 'lead' || normalized === 'leads' || normalized === 'active_leads') return 'activeLeads';
  if (normalized === 'task' || normalized === 'tasks' || normalized === 'work_item' || normalized === 'work_items' || normalized === 'active_tasks') return 'activeTasks';
  if (normalized === 'event' || normalized === 'events' || normalized === 'calendar' || normalized === 'active_events') return 'activeEvents';
  if (normalized === 'draft' || normalized === 'drafts' || normalized === 'ai_draft' || normalized === 'ai_drafts' || normalized === 'active_drafts') return 'activeDrafts';
  return raw as WorkspaceEntityLimitKey;
}

function getWorkspaceIdForEntityLimit(workspaceInput: unknown, workspaceRow: unknown) {
  const direct = asText(workspaceInput);
  if (typeof workspaceInput === 'string' && direct) return direct;
  const row = asRecord(workspaceRow);
  return asText(row.id ?? row.workspace_id ?? row.workspaceId);
}

function getWorkspaceEntityLimitQueries(workspaceId: string, key: WorkspaceEntityLimitKey, limit: number) {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  const cappedLimit = Math.max(1, Math.floor(limit) + 1);
  const workspaceFilter = 'workspace_id=eq.' + encodedWorkspaceId;

  if (key === 'activeLeads') {
    return [
      'leads?select=id&' + workspaceFilter + '&lead_visibility=neq.archived&status=neq.moved_to_service&limit=' + cappedLimit,
      'leads?select=id&' + workspaceFilter + '&status=neq.moved_to_service&limit=' + cappedLimit,
      'leads?select=id&' + workspaceFilter + '&limit=' + cappedLimit,
    ];
  }

  if (key === 'activeTasks') {
    return [
      'work_items?select=id&' + workspaceFilter + '&record_type=eq.task&status=neq.done&limit=' + cappedLimit,
      'work_items?select=id&' + workspaceFilter + '&show_in_tasks=is.true&limit=' + cappedLimit,
      'work_items?select=id&' + workspaceFilter + '&type=eq.task&limit=' + cappedLimit,
    ];
  }

  if (key === 'activeEvents') {
    return [
      'work_items?select=id&' + workspaceFilter + '&record_type=eq.event&status=neq.cancelled&limit=' + cappedLimit,
      'work_items?select=id&' + workspaceFilter + '&show_in_calendar=is.true&show_in_tasks=is.false&limit=' + cappedLimit,
      'work_items?select=id&' + workspaceFilter + '&start_at=not.is.null&limit=' + cappedLimit,
    ];
  }

  if (key === 'activeDrafts') {
    return [
      'ai_drafts?select=id&' + workspaceFilter + '&status=in.(pending,draft,failed)&limit=' + cappedLimit,
      'ai_drafts?select=id&' + workspaceFilter + '&status=neq.confirmed&limit=' + cappedLimit,
      'ai_drafts?select=id&' + workspaceFilter + '&limit=' + cappedLimit,
    ];
  }

  return [];
}

async function countWorkspaceEntitiesForLimit(workspaceId: string, key: WorkspaceEntityLimitKey, limit: number) {
  const queries = getWorkspaceEntityLimitQueries(workspaceId, key, limit);
  if (!queries.length) return Number.NaN;

  try {
    const result = await selectFirstAvailable(queries);
    const rows = Array.isArray(result?.data) ? result.data : [];
    return rows.length;
  } catch {
    return Number.NaN;
  }
}

function getWorkspaceCombinedTaskEventQueries(workspaceId: string, limit: number) {
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  const cappedLimit = Math.max(1, Math.floor(limit) + 1);
  const workspaceFilter = 'workspace_id=eq.' + encodedWorkspaceId;
  return [
    'work_items?select=id,record_type&' + workspaceFilter + '&or=(record_type.eq.task,record_type.eq.event)&limit=' + cappedLimit,
    'work_items?select=id,show_in_tasks,show_in_calendar&' + workspaceFilter + '&or=(show_in_tasks.is.true,show_in_calendar.is.true)&limit=' + cappedLimit,
  ];
}

async function countWorkspaceCombinedTasksAndEvents(workspaceId: string, limit: number) {
  const queries = getWorkspaceCombinedTaskEventQueries(workspaceId, limit);
  try {
    const result = await selectFirstAvailable(queries);
    const rows = Array.isArray(result?.data) ? result.data : [];
    return rows.length;
  } catch {
    return Number.NaN;
  }
}

export async function assertWorkspaceEntityLimit(
  workspaceInput: unknown = {},
  entityName?: unknown,
  currentCountInput?: unknown,
  explicitLimitInput?: unknown,
) {
  const key = normalizeLimitKey(entityName) as WorkspaceEntityLimitKey;
  const workspace = await resolveWorkspaceAccessInput(workspaceInput);
  const status = normalizeWorkspaceAccessStatus(workspace);
  const isFreeWorkspace = normalizePlanId(readPlanId(workspace), status) === PLAN_IDS.free;

  if (!isFreeWorkspace) return true;

  const planLimits = getPlanLimits(readPlanId(workspace), status);
  const configuredLimit = planLimits[key];
  const explicitLimit = Number(explicitLimitInput);
  const limit = Number.isFinite(explicitLimit) && explicitLimit > 0 ? explicitLimit : Number(configuredLimit);

  if (!Number.isFinite(limit) || limit <= 0) return true;

  const explicitCurrentCount = Number(currentCountInput);
  const workspaceId = getWorkspaceIdForEntityLimit(workspaceInput, workspace);
  const currentCount = Number.isFinite(explicitCurrentCount)
    ? explicitCurrentCount
    : await countWorkspaceEntitiesForLimit(workspaceId, key, limit);

  if (key === 'activeTasks' || key === 'activeEvents') {
    const combinedLimit = Number(planLimits.activeTasksAndEvents ?? limit);
    if (Number.isFinite(combinedLimit) && combinedLimit > 0) {
      const combinedCount = await countWorkspaceCombinedTasksAndEvents(workspaceId, combinedLimit);
      if (Number.isFinite(combinedCount) && combinedCount >= combinedLimit) {
        const combinedError: any = makeGateError('FREE_LIMIT_ACTIVE_TASKS_EVENTS_REACHED', 402);
        combinedError.entity = 'activeTasksAndEvents';
        combinedError.limit = combinedLimit;
        combinedError.currentCount = combinedCount;
        throw combinedError;
      }
    }
  }

  if (!Number.isFinite(currentCount) || currentCount < 0) return true;
  if (currentCount < limit) return true;

  const error: any = makeGateError('WORKSPACE_ENTITY_LIMIT_REACHED', 402);
  error.entity = key;
  error.limit = limit;
  error.currentCount = currentCount;
  throw error;
}
