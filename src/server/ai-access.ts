import { RequestAuthError, requireSupabaseRequestContext } from './_supabase-auth.js';
import { requireRequestIdentity, resolveRequestWorkspaceId } from './_request-scope.js';
import { assertWorkspaceAiAllowed, getWorkspaceAiLimits } from './_access-gate.js';
import { supabaseRpc } from './_supabase.js';

export type AiRequestOperation =
  | 'assistant_query'
  | 'assistant_context'
  | 'assistant'
  | 'next_action'
  | 'followup_draft'
  | 'capture_draft'
  | 'ai_config';

export type AiRequestAccessOptions = {
  operation: AiRequestOperation;
  requirePlan?: boolean;
  consumeUsage?: boolean;
};

export type AiRequestAccess = {
  workspaceId: string;
  userId: string;
  isGlobalAdmin: boolean;
  dailyLimit: number | null;
  monthlyLimit: number | null;
};

const MAX_AI_BODY_BYTES = 64 * 1024;
const MAX_AI_TEXT_FIELD_LENGTH = 4000;
const AI_RATE_LIMIT_PER_MINUTE = 8;

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function isGlobalAdmin(context: Awaited<ReturnType<typeof requireSupabaseRequestContext>>) {
  const metadata = context.rawUser?.app_metadata && typeof context.rawUser.app_metadata === 'object'
    ? context.rawUser.app_metadata as Record<string, unknown>
    : {};
  const role = asText(metadata.role || metadata.claims_role).toLowerCase();
  const roles = Array.isArray(metadata.roles)
    ? metadata.roles.map((item) => asText(item).toLowerCase())
    : [];
  return role === 'admin' || roles.includes('admin');
}

function assertInputBudget(bodyInput: unknown) {
  const body = asRecord(bodyInput);
  let serialized = '';
  try {
    serialized = JSON.stringify(body) || '';
  } catch {
    throw new RequestAuthError(400, 'AI_INPUT_INVALID');
  }
  if (Buffer.byteLength(serialized, 'utf8') > MAX_AI_BODY_BYTES) {
    throw new RequestAuthError(413, 'AI_INPUT_TOO_LARGE');
  }

  for (const key of ['query', 'prompt', 'text', 'rawText', 'note', 'goal', 'tone']) {
    const value = body[key];
    if (typeof value === 'string' && value.trim().length > MAX_AI_TEXT_FIELD_LENGTH) {
      throw new RequestAuthError(413, 'AI_INPUT_FIELD_TOO_LARGE');
    }
  }
}

function readUsageResult(value: unknown) {
  const row = Array.isArray(value) ? value[0] : value;
  return row && typeof row === 'object' && !Array.isArray(row)
    ? row as Record<string, unknown>
    : null;
}

async function consumeAiUsage(input: {
  workspaceId: string;
  userId: string;
  operation: AiRequestOperation;
  dailyLimit: number | null;
  monthlyLimit: number | null;
}) {
  if (!input.dailyLimit || !input.monthlyLimit) {
    throw new RequestAuthError(403, 'AI_USAGE_LIMIT_NOT_CONFIGURED');
  }

  let result: unknown;
  try {
    result = await supabaseRpc('consume_ai_usage', {
      p_workspace_id: input.workspaceId,
      p_user_id: input.userId,
      p_operation: input.operation,
      p_daily_limit: input.dailyLimit,
      p_monthly_limit: input.monthlyLimit,
      p_rate_limit: AI_RATE_LIMIT_PER_MINUTE,
    });
  } catch {
    throw new RequestAuthError(503, 'AI_USAGE_STORE_UNAVAILABLE');
  }

  const row = readUsageResult(result);
  if (!row) throw new RequestAuthError(503, 'AI_USAGE_STORE_INVALID_RESPONSE');
  if (row.allowed === true) return row;

  const errorCode = row.reason === 'rate_limit' ? 'AI_RATE_LIMIT_REACHED' : 'AI_USAGE_LIMIT_REACHED';
  throw new RequestAuthError(429, errorCode);
}

export async function requireAiRequestAccess(
  req: any,
  bodyInput: unknown,
  options: AiRequestAccessOptions,
): Promise<AiRequestAccess> {
  assertInputBudget(bodyInput);
  const identity = await requireRequestIdentity(req, bodyInput);
  const context = await requireSupabaseRequestContext(req);
  const workspaceId = await resolveRequestWorkspaceId(req, bodyInput);
  const userId = asText(identity.userId || identity.uid || identity.email);
  if (!userId) throw new RequestAuthError(401, 'AI_USER_CONTEXT_REQUIRED');

  const admin = isGlobalAdmin(context);
  if (options.requirePlan !== false && !admin) {
    await assertWorkspaceAiAllowed(workspaceId);
  }

  const limits = admin
    ? { aiDaily: null, aiMonthly: null }
    : await getWorkspaceAiLimits(workspaceId);

  if (options.consumeUsage !== false && !admin) {
    await consumeAiUsage({
      workspaceId,
      userId,
      operation: options.operation,
      dailyLimit: limits.aiDaily,
      monthlyLimit: limits.aiMonthly,
    });
  }

  return {
    workspaceId,
    userId,
    isGlobalAdmin: admin,
    dailyLimit: limits.aiDaily,
    monthlyLimit: limits.aiMonthly,
  };
}

export function getAiAccessError(error: unknown) {
  const candidate = error && typeof error === 'object' ? error as Record<string, unknown> : {};
  const status = Number(candidate.status ?? candidate.statusCode);
  const code = asText(candidate.code ?? candidate.message) || 'AI_ACCESS_REQUIRED';
  return {
    status: Number.isFinite(status) && status >= 400 && status <= 599 ? status : 500,
    code,
  };
}

export const AI_SERVER_INPUT_BUDGET = {
  maxBodyBytes: MAX_AI_BODY_BYTES,
  maxTextFieldLength: MAX_AI_TEXT_FIELD_LENGTH,
  rateLimitPerMinute: AI_RATE_LIMIT_PER_MINUTE,
};
