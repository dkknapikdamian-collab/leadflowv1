export const AI_DAILY_COMMAND_LIMIT = 35;
export const AI_ADMIN_DAILY_COMMAND_LIMIT = Number.MAX_SAFE_INTEGER;
export const AI_COMMAND_MAX_LENGTH = 800;

export type AiUsageSnapshot = {
  key: string;
  date: string;
  used: number;
  limit: number;
  remaining: number;
  canUse: boolean;
  adminExempt?: boolean;
};

export type AiUsageOptions = {
  isAdmin?: boolean;
};

export function isAiUsageUnlimited() {
  try {
    return String((import.meta as any).env?.VITE_AI_USAGE_UNLIMITED || '').toLowerCase() === 'true';
  } catch {
    return false;
  }
}


const AI_USAGE_STORAGE_PREFIX = 'closeflow:ai-usage';

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage || null;
  } catch {
    return null;
  }
}

function getDateKey(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeKeyPart(value: unknown, fallback: string) {
  const text = String(value || '').trim().toLowerCase();
  if (!text) return fallback;
  return text.replace(/[^a-z0-9_.:-]/g, '_').slice(0, 80) || fallback;
}

export function buildAiUsageKey(workspaceId?: unknown, userId?: unknown, now = new Date()) {
  const workspace = normalizeKeyPart(workspaceId, 'local-workspace');
  const user = normalizeKeyPart(userId, 'local-user');
  return `${AI_USAGE_STORAGE_PREFIX}:${getDateKey(now)}:${workspace}:${user}`;
}

export function isAiUsageAdminExempt(options?: AiUsageOptions) {
  return options?.isAdmin === true;
}

function readUsedCount(key: string) {
  const storage = getStorage();
  if (!storage) return 0;

  const raw = storage.getItem(key);
  if (!raw) return 0;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function writeUsedCount(key: string, value: number) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(key, String(Math.max(0, Math.floor(value))));
}

export function getAiUsageSnapshot(key: string, limit = AI_DAILY_COMMAND_LIMIT, options?: AiUsageOptions): AiUsageSnapshot {
  const used = Math.max(0, Math.floor(readUsedCount(key)));

  if (isAiUsageAdminExempt(options) || isAiUsageUnlimited()) {
    return {
      key,
      date: getDateKey(),
      used,
      limit: AI_ADMIN_DAILY_COMMAND_LIMIT,
      remaining: AI_ADMIN_DAILY_COMMAND_LIMIT,
      canUse: true,
      adminExempt: true,
    };
  }

  const safeLimit = Math.max(1, Math.floor(limit));
  const remaining = Math.max(0, safeLimit - used);

  return {
    key,
    date: getDateKey(),
    used,
    limit: safeLimit,
    remaining,
    canUse: remaining > 0,
  };
}

export function registerAiUsage(key: string, limit = AI_DAILY_COMMAND_LIMIT, options?: AiUsageOptions): AiUsageSnapshot {
  if (isAiUsageAdminExempt(options) || isAiUsageUnlimited()) {
    return getAiUsageSnapshot(key, limit, options);
  }

  const before = getAiUsageSnapshot(key, limit);
  const nextUsed = Math.min(before.limit, before.used + 1);
  writeUsedCount(key, nextUsed);
  return getAiUsageSnapshot(key, limit);
}

export function resetAiUsageForTests(key: string) {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(key);
}

/* AI_ADMIN_DAILY_COMMAND_LIMIT adminExempt */
