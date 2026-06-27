export const CF_RUNTIME_00_SOURCE_TRUTH_STAGE_OPEN = 'CF_RUNTIME_00_SOURCE_TRUTH_STAGE_OPEN';
export const MISSING_GUARD_TEST_STAGE_OPEN = 'CF_RUNTIME_00_MISSING_GUARD_TEST_STAGE_OPEN';

export const CASE_DETAIL_CANONICAL_ROUTE_PREFIX = '/cases';
export const CASE_DETAIL_LEGACY_ROUTE_PREFIX = '/case';

const PLAN_IDS = {
  free: 'free',
  basic: 'basic',
  pro: 'pro',
  ai: 'ai',
  trial: 'trial_14d',
};

const PLAN_ALIASES = {
  free: PLAN_IDS.free,
  free_active: PLAN_IDS.free,
  basic: PLAN_IDS.basic,
  closeflow_basic: PLAN_IDS.basic,
  closeflow_basic_yearly: PLAN_IDS.basic,
  pro: PLAN_IDS.pro,
  closeflow_pro: PLAN_IDS.pro,
  closeflow_pro_yearly: PLAN_IDS.pro,
  solo_mini: PLAN_IDS.pro,
  solo_full: PLAN_IDS.pro,
  team_mini: PLAN_IDS.pro,
  team_full: PLAN_IDS.pro,
  ai: PLAN_IDS.ai,
  closeflow_ai: PLAN_IDS.ai,
  closeflow_ai_yearly: PLAN_IDS.ai,
  closeflow_business: PLAN_IDS.ai,
  closeflow_business_yearly: PLAN_IDS.ai,
  business: PLAN_IDS.ai,
  trial: PLAN_IDS.trial,
  trial_14d: PLAN_IDS.trial,
  trial_21d: PLAN_IDS.trial,
  trial_active: PLAN_IDS.trial,
  trial_ending: PLAN_IDS.trial,
};

const KNOWN_ACCESS_STATUSES = new Set([
  'trial_active',
  'trial_ending',
  'trial_expired',
  'free_active',
  'paid_active',
  'payment_failed',
  'canceled',
  'inactive',
]);

const DONE_LIKE_STATUSES = new Set([
  'done',
  'completed',
  'complete',
  'resolved',
  'closed',
  'finished',
  'zrobione',
  'zakonczone',
  'zamkniete',
]);

const CANCELED_LIKE_STATUSES = new Set([
  'canceled',
  'cancelled',
  'cancel',
  'abandoned',
  'void',
  'anulowane',
  'anulowany',
]);

const DELETED_LIKE_STATUSES = new Set([
  'deleted',
  'delete',
  'removed',
  'archived',
  'archive',
  'soft_deleted',
  'trash',
  'trashed',
  'usuniete',
  'usuniety',
  'zarchiwizowane',
]);

const ACTIVE_WORK_STATUSES = new Set([
  'active',
  'open',
  'todo',
  'planned',
  'pending',
  'in_progress',
  'waiting',
  'waiting_for_client',
  'blocked',
  'blocker',
  'missing',
  'missing_item',
  'brak',
  'do_zrobienia',
]);

const MISSING_ITEM_TOKENS = new Set([
  'missing',
  'missing_item',
  'missing_items',
  'brak',
  'braki',
  'brakujace',
  'brakujacy',
  'brakujaca',
  'brak_danych',
  'brak_dokumentu',
  'brak_dokumentow',
]);

const BLOCKER_TOKENS = new Set([
  'blocked',
  'blocker',
  'blockade',
  'blokada',
  'zablokowane',
  'zablokowany',
  'wstrzymane',
  'wstrzymany',
  'stopper',
]);

function normalizeToken(value) {
  if (value === null || value === undefined) return 'unknown';
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
  return normalized || 'unknown';
}

function collectInputTokens(input) {
  if (input === null || input === undefined) return ['unknown'];
  if (typeof input !== 'object') return [normalizeToken(input)];

  const tokens = [];
  const keys = ['type', 'kind', 'status', 'category', 'reason', 'label', 'title', 'name'];
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      const value = input[key];
      if (Array.isArray(value)) {
        for (const item of value) tokens.push(normalizeToken(item));
      } else {
        tokens.push(normalizeToken(value));
      }
    }
  }

  if (Array.isArray(input.tags)) {
    for (const tag of input.tags) tokens.push(normalizeToken(tag));
  }

  return tokens.length ? tokens : ['unknown'];
}

function normalizePlanToken(value) {
  const token = normalizeToken(value);
  return token === 'unknown' ? '' : token;
}

function normalizeAccessStatus(value) {
  const token = normalizeToken(value);
  return KNOWN_ACCESS_STATUSES.has(token) ? token : 'inactive';
}

function resolveExplicitPlanId(planId) {
  const rawPlanId = normalizePlanToken(planId);
  return rawPlanId && PLAN_ALIASES[rawPlanId] ? PLAN_ALIASES[rawPlanId] : null;
}

export function buildCaseDetailPath(caseId) {
  return CASE_DETAIL_CANONICAL_ROUTE_PREFIX + '/' + encodeURIComponent(String(caseId || ''));
}

export function buildLegacyCaseDetailPath(caseId) {
  return CASE_DETAIL_LEGACY_ROUTE_PREFIX + '/' + encodeURIComponent(String(caseId || ''));
}

export function isCanonicalCaseDetailPath(pathname) {
  const path = String(pathname || '').split(/[?#]/)[0];
  return path === CASE_DETAIL_CANONICAL_ROUTE_PREFIX || path.startsWith(CASE_DETAIL_CANONICAL_ROUTE_PREFIX + '/');
}

export function isLegacyCaseDetailPath(pathname) {
  const path = String(pathname || '').split(/[?#]/)[0];
  return path === CASE_DETAIL_LEGACY_ROUTE_PREFIX || path.startsWith(CASE_DETAIL_LEGACY_ROUTE_PREFIX + '/');
}

export function isCaseDetailPath(pathname) {
  return isCanonicalCaseDetailPath(pathname) || isLegacyCaseDetailPath(pathname);
}

export function normalizeRuntimeStatus(value) {
  return normalizeToken(value);
}

export function isDoneLikeStatus(status) {
  return DONE_LIKE_STATUSES.has(normalizeRuntimeStatus(status));
}

export function isCanceledLikeStatus(status) {
  return CANCELED_LIKE_STATUSES.has(normalizeRuntimeStatus(status));
}

export function isDeletedLikeStatus(status) {
  return DELETED_LIKE_STATUSES.has(normalizeRuntimeStatus(status));
}

export function isActiveWorkStatus(status) {
  const normalizedStatus = normalizeRuntimeStatus(status);
  if (isDoneLikeStatus(normalizedStatus) || isCanceledLikeStatus(normalizedStatus) || isDeletedLikeStatus(normalizedStatus)) {
    return false;
  }
  return ACTIVE_WORK_STATUSES.has(normalizedStatus);
}

export function isMissingItemLike(input) {
  return collectInputTokens(input).some((token) => MISSING_ITEM_TOKENS.has(token));
}

export function isBlockerLike(input) {
  return collectInputTokens(input).some((token) => BLOCKER_TOKENS.has(token));
}

export function buildRuntimeAccessPlanTruth(input = {}) {
  const rawPlanId = normalizePlanToken(input.planId);
  const rawSubscriptionStatus = normalizeRuntimeStatus(input.subscriptionStatus || 'inactive');
  const subscriptionStatus = normalizeAccessStatus(rawSubscriptionStatus);
  const explicitPlanId = resolveExplicitPlanId(rawPlanId);

  if (subscriptionStatus === 'trial_active' || subscriptionStatus === 'trial_ending') {
    return {
      subscriptionStatus,
      rawSubscriptionStatus,
      rawPlanId: rawPlanId || null,
      effectivePlanId: PLAN_IDS.trial,
      confirmedPlanId: PLAN_IDS.trial,
      legacyFallbackPlanId: null,
      planSource: 'trial_status',
      isPlanConfirmed: true,
      isPaidStatusActive: false,
      isConfirmedPaidPlan: false,
      requiresPlanIdConfirmation: false,
      hasSafeFallback: true,
    };
  }

  if (subscriptionStatus === 'free_active' || subscriptionStatus === 'trial_expired') {
    return {
      subscriptionStatus,
      rawSubscriptionStatus,
      rawPlanId: rawPlanId || null,
      effectivePlanId: PLAN_IDS.free,
      confirmedPlanId: PLAN_IDS.free,
      legacyFallbackPlanId: null,
      planSource: 'free_status',
      isPlanConfirmed: true,
      isPaidStatusActive: false,
      isConfirmedPaidPlan: false,
      requiresPlanIdConfirmation: false,
      hasSafeFallback: true,
    };
  }

  if (explicitPlanId) {
    return {
      subscriptionStatus,
      rawSubscriptionStatus,
      rawPlanId,
      effectivePlanId: explicitPlanId,
      confirmedPlanId: explicitPlanId,
      legacyFallbackPlanId: null,
      planSource: 'explicit_plan',
      isPlanConfirmed: true,
      isPaidStatusActive: subscriptionStatus === 'paid_active',
      isConfirmedPaidPlan: subscriptionStatus === 'paid_active' && explicitPlanId !== PLAN_IDS.free && explicitPlanId !== PLAN_IDS.trial,
      requiresPlanIdConfirmation: false,
      hasSafeFallback: true,
    };
  }

  if (subscriptionStatus === 'paid_active') {
    return {
      subscriptionStatus,
      rawSubscriptionStatus,
      rawPlanId: rawPlanId || null,
      effectivePlanId: PLAN_IDS.free,
      confirmedPlanId: null,
      legacyFallbackPlanId: PLAN_IDS.pro,
      planSource: 'fallback_status',
      isPlanConfirmed: false,
      isPaidStatusActive: true,
      isConfirmedPaidPlan: false,
      requiresPlanIdConfirmation: true,
      hasSafeFallback: true,
    };
  }

  if (rawSubscriptionStatus !== subscriptionStatus) {
    return {
      subscriptionStatus,
      rawSubscriptionStatus,
      rawPlanId: rawPlanId || null,
      effectivePlanId: PLAN_IDS.free,
      confirmedPlanId: null,
      legacyFallbackPlanId: null,
      planSource: 'unknown_status',
      isPlanConfirmed: false,
      isPaidStatusActive: false,
      isConfirmedPaidPlan: false,
      requiresPlanIdConfirmation: false,
      hasSafeFallback: true,
    };
  }

  return {
    subscriptionStatus,
    rawSubscriptionStatus,
    rawPlanId: rawPlanId || null,
    effectivePlanId: PLAN_IDS.free,
    confirmedPlanId: PLAN_IDS.free,
    legacyFallbackPlanId: null,
    planSource: 'inactive_status',
    isPlanConfirmed: true,
    isPaidStatusActive: false,
    isConfirmedPaidPlan: false,
    requiresPlanIdConfirmation: false,
    hasSafeFallback: true,
  };
}
