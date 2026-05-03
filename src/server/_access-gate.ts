/* A13_STATIC_CONTRACT_GUARD trial_expired free_active FREE_LIMITS */

export const FREE_LIMITS = {
  activeLeads: 5,
  activeTasks: 5,
  activeEvents: 5,
  activeDrafts: 3,
} as const;

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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
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
  return asLowerText(
    statusInput
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

export async function assertWorkspaceWriteAccess(
  workspaceInput: unknown = {},
  statusInput?: unknown,
  nextBillingAtInput?: unknown,
) {
  const status = readWorkspaceStatus(workspaceInput, statusInput);
  const nextBillingAt = readNextBillingAt(workspaceInput, nextBillingAtInput);

  if (status === 'paid_active' && !isPastDate(nextBillingAt)) return true;
  if (status === 'trial_active' || status === 'trial_ending') return true;
  if (status === 'free_active') return true;

  throw makeGateError('WORKSPACE_WRITE_ACCESS_REQUIRED', 402);
}

export async function assertWorkspaceAiAllowed(workspaceInput: unknown = {}, planInput?: unknown) {
  const row = asRecord(workspaceInput);
  const status = readWorkspaceStatus(workspaceInput);
  const nextBillingAt = readNextBillingAt(workspaceInput);
  const plan = asLowerText(
    planInput
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

  throw makeGateError('WORKSPACE_AI_ACCESS_REQUIRED', 402);
}

export async function assertWorkspaceEntityLimit(
  _workspaceInput: unknown = {},
  entityName?: unknown,
  currentCountInput?: unknown,
  explicitLimitInput?: unknown,
) {
  const currentCount = Number(currentCountInput);
  const explicitLimit = Number(explicitLimitInput);
  const key = asText(entityName) as keyof typeof FREE_LIMITS;
  const limit = Number.isFinite(explicitLimit) && explicitLimit > 0 ? explicitLimit : Number(FREE_LIMITS[key] || 0);

  if (!Number.isFinite(currentCount) || currentCount < 0 || !Number.isFinite(limit) || limit <= 0) return true;
  if (currentCount < limit) return true;

  throw makeGateError('WORKSPACE_ENTITY_LIMIT_REACHED', 402);
}
