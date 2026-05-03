import { selectFirstAvailable } from './_supabase.js';

/* A13_STATIC_CONTRACT_GUARD trial_expired free_active FREE_LIMITS */
/* PHASE0_WORKSPACE_WRITE_ACCESS_RUNTIME_REQ_COMPAT_2026_05_03 */
/* P0_WORKSPACE_WRITE_ACCESS_STATUS_COMPAT_2026_05_03 */

export const FREE_LIMITS = {
  activeLeads: 5,
  activeTasks: 5,
  activeEvents: 5,
  activeDrafts: 3,
} as const;

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
    return { access_status: 'trial_active' };
  }

  return workspaceInput;
}

function isAllowedWriteStatus(status: string, nextBillingAt: unknown) {
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

export async function assertWorkspaceAiAllowed(workspaceInput: unknown = {}, planInput?: unknown) {
  const workspace = await resolveWorkspaceAccessInput(workspaceInput, planInput);
  const row = asRecord(workspace);
  const status = readWorkspaceStatus(workspace);
  const nextBillingAt = readNextBillingAt(workspace);
  const plan = asLowerText(
    isRequestLike(planInput)
      ? row.plan ?? row.planKey ?? row.plan_key ?? row.billing_plan ?? row.subscription_plan ?? row.product_plan
      : planInput
        ?? row.plan
        ?? row.planKey
        ?? row.plan_key
        ?? row.billing_plan
        ?? row.subscription_plan
        ?? row.product_plan,
  );

  if (process.env.VITE_AI_USAGE_UNLIMITED === 'true') return true;
  if (process.env.AI_ENABLED === 'true' && (status === 'trial_active' || status === 'trial_ending')) return true;
  if (status === 'paid_active' && !isPastDate(nextBillingAt) && (plan === 'ai' || plan.includes('ai') || plan === 'pro')) return true;
  if (status === 'trial_active' || status === 'trial_ending') return true;
  if (status === 'active' || status === 'trialing' || status === 'trial') return true;

  throw makeGateError('WORKSPACE_AI_ACCESS_REQUIRED', 402);
}

function normalizeLimitKey(entityName: unknown) {
  const raw = asText(entityName);
  const normalized = raw.toLowerCase();
  if (normalized === 'lead' || normalized === 'leads' || normalized === 'active_leads') return 'activeLeads';
  if (normalized === 'task' || normalized === 'tasks' || normalized === 'work_item' || normalized === 'work_items' || normalized === 'active_tasks') return 'activeTasks';
  if (normalized === 'event' || normalized === 'events' || normalized === 'calendar' || normalized === 'active_events') return 'activeEvents';
  if (normalized === 'draft' || normalized === 'drafts' || normalized === 'ai_draft' || normalized === 'ai_drafts' || normalized === 'active_drafts') return 'activeDrafts';
  return raw as keyof typeof FREE_LIMITS;
}

export async function assertWorkspaceEntityLimit(
  _workspaceInput: unknown = {},
  entityName?: unknown,
  currentCountInput?: unknown,
  explicitLimitInput?: unknown,
) {
  const currentCount = Number(currentCountInput);
  const explicitLimit = Number(explicitLimitInput);
  const key = normalizeLimitKey(entityName) as keyof typeof FREE_LIMITS;
  const limit = Number.isFinite(explicitLimit) && explicitLimit > 0 ? explicitLimit : Number(FREE_LIMITS[key] || 0);

  if (!Number.isFinite(currentCount) || currentCount < 0 || !Number.isFinite(limit) || limit <= 0) return true;
  if (currentCount < limit) return true;

  throw makeGateError('WORKSPACE_ENTITY_LIMIT_REACHED', 402);
}
