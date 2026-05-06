export const TRIAL_DAYS = 21;
export const TRIAL_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000;

export const PLAN_IDS = {
  free: 'free',
  basic: 'basic',
  pro: 'pro',
  ai: 'ai',
  trial: 'trial_21d',
} as const;

export type PlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS];

export const ACCESS_STATUSES = [
  'trial_active',
  'trial_ending',
  'trial_expired',
  'free_active',
  'paid_active',
  'payment_failed',
  'canceled',
  'inactive',
] as const;

export type SubscriptionStatus = (typeof ACCESS_STATUSES)[number] | string;

export const FREE_LIMITS = {
  activeLeads: 5,
  activeTasks: 5,
  activeEvents: 5,
  activeDrafts: 3,
} as const;

export type PlanLimits = {
  activeLeads: number | null;
  activeTasks: number | null;
  activeEvents: number | null;
  activeTasksAndEvents: number | null;
  activeDrafts: number | null;
  aiDaily: number | null;
  aiMonthly: number | null;
};

export type PlanFeatures = {
  /** Pełny asystent AI, wyszukiwanie danych, sugestie i AI drafty w trybie premium. */
  ai: boolean;
  /** Alias czytelny dla UI i przyszłych guardów. */
  fullAi: boolean;
  /** Poranny digest e-mail. */
  digest: boolean;
  /** Lekki parser/szkice z tekstu bez pełnego asystenta AI. */
  lightParser: boolean;
  lightDrafts: boolean;
  /** Synchronizacja z Google Calendar. */
  googleCalendar: boolean;
  /** Raport tygodniowy. */
  weeklyReport: boolean;
  /** Import CSV. */
  csvImport: boolean;
  /** Cykliczne zadania i wydarzenia. */
  recurringReminders: boolean;
  /** Browser notifications. */
  browserNotifications: boolean;
};

export type PlanFeatureKey = keyof PlanFeatures;

export type PlanFeatureVisibility = 'available' | 'hidden_by_plan' | 'upsell_in_billing' | 'blocked_direct_route';

export type PlanVisibilitySurface =
  | 'main_flow'
  | 'sidebar'
  | 'global_action'
  | 'settings'
  | 'billing'
  | 'plan_comparison'
  | 'blocked_direct_route';

export const PLAN_FEATURE_MINIMUM_PLANS: Record<PlanFeatureKey, PlanId> = {
  ai: PLAN_IDS.ai,
  fullAi: PLAN_IDS.ai,
  digest: PLAN_IDS.basic,
  lightParser: PLAN_IDS.basic,
  lightDrafts: PLAN_IDS.basic,
  googleCalendar: PLAN_IDS.pro,
  weeklyReport: PLAN_IDS.pro,
  csvImport: PLAN_IDS.pro,
  recurringReminders: PLAN_IDS.pro,
  browserNotifications: PLAN_IDS.basic,
};

export const PLAN_FEATURE_VISIBILITY_RULES = {
  defaultDeniedVisibility: 'hidden_by_plan' as PlanFeatureVisibility,
  allowedUpsellSurfaces: ['billing', 'plan_comparison', 'blocked_direct_route'] as PlanVisibilitySurface[],
};

export function getMinimumPlanForFeature(feature: PlanFeatureKey): PlanId {
  return PLAN_FEATURE_MINIMUM_PLANS[feature] || PLAN_IDS.ai;
}

export function getPlanFeatureVisibility(
  planId: string | null | undefined,
  feature: PlanFeatureKey,
  subscriptionStatus?: string | null,
  surface: PlanVisibilitySurface = 'main_flow',
): PlanFeatureVisibility {
  if (isPlanFeatureEnabled(planId, feature, subscriptionStatus)) return 'available';
  if (surface === 'blocked_direct_route') return 'blocked_direct_route';
  if (PLAN_FEATURE_VISIBILITY_RULES.allowedUpsellSurfaces.includes(surface)) return 'upsell_in_billing';
  return PLAN_FEATURE_VISIBILITY_RULES.defaultDeniedVisibility;
}

export function shouldExposePlanFeature(
  planId: string | null | undefined,
  feature: PlanFeatureKey,
  subscriptionStatus?: string | null,
  surface: PlanVisibilitySurface = 'main_flow',
) {
  return getPlanFeatureVisibility(planId, feature, subscriptionStatus, surface) !== 'hidden_by_plan';
}


export type PlanDefinition = {
  id: PlanId;
  name: string;
  role: 'demo' | 'starter' | 'main' | 'premium' | 'trial';
  limits: PlanLimits;
  features: PlanFeatures;
};

const UNLIMITED_LIMITS: PlanLimits = {
  activeLeads: null,
  activeTasks: null,
  activeEvents: null,
  activeTasksAndEvents: null,
  activeDrafts: null,
  aiDaily: null,
  aiMonthly: null,
};

const NO_FEATURES: PlanFeatures = {
  ai: false,
  fullAi: false,
  digest: false,
  lightParser: false,
  lightDrafts: false,
  googleCalendar: false,
  weeklyReport: false,
  csvImport: false,
  recurringReminders: false,
  browserNotifications: false,
};

const BASIC_FEATURES: PlanFeatures = {
  ...NO_FEATURES,
  digest: true,
  lightParser: true,
  lightDrafts: true,
  browserNotifications: true,
};

const PRO_FEATURES: PlanFeatures = {
  ...BASIC_FEATURES,
  googleCalendar: true,
  weeklyReport: true,
  csvImport: true,
  recurringReminders: true,
};

const AI_FEATURES: PlanFeatures = {
  ...PRO_FEATURES,
  ai: true,
  fullAi: true,
};

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  [PLAN_IDS.free]: {
    id: PLAN_IDS.free,
    name: 'Free',
    role: 'demo',
    limits: {
      ...FREE_LIMITS,
      activeTasksAndEvents: 5,
      aiDaily: null,
      aiMonthly: null,
    },
    features: { ...NO_FEATURES },
  },
  [PLAN_IDS.basic]: {
    id: PLAN_IDS.basic,
    name: 'Basic',
    role: 'starter',
    limits: { ...UNLIMITED_LIMITS },
    features: { ...BASIC_FEATURES },
  },
  [PLAN_IDS.pro]: {
    id: PLAN_IDS.pro,
    name: 'Pro',
    role: 'main',
    limits: { ...UNLIMITED_LIMITS },
    features: { ...PRO_FEATURES },
  },
  [PLAN_IDS.ai]: {
    id: PLAN_IDS.ai,
    name: 'AI',
    role: 'premium',
    limits: {
      ...UNLIMITED_LIMITS,
      aiDaily: 30,
      aiMonthly: 300,
    },
    features: { ...AI_FEATURES },
  },
  [PLAN_IDS.trial]: {
    id: PLAN_IDS.trial,
    name: 'Trial 21 dni',
    role: 'trial',
    limits: {
      ...UNLIMITED_LIMITS,
      aiDaily: 30,
      aiMonthly: 300,
    },
    features: { ...AI_FEATURES },
  },
};

const PLAN_ALIASES: Record<string, PlanId> = {
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
  trial_21d: PLAN_IDS.trial,
  trial_active: PLAN_IDS.trial,
  trial_ending: PLAN_IDS.trial,
};

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function normalizePlanId(planId?: string | null, subscriptionStatus?: string | null): PlanId {
  const status = normalizeText(subscriptionStatus);
  const rawPlan = normalizeText(planId);

  if (status === 'trial_active' || status === 'trial_ending') return PLAN_IDS.trial;
  if (status === 'free_active') return PLAN_IDS.free;
  if (status === 'trial_expired' && (!rawPlan || rawPlan === 'trial' || rawPlan === 'trial_21d')) return PLAN_IDS.free;

  if (rawPlan && PLAN_ALIASES[rawPlan]) return PLAN_ALIASES[rawPlan];

  if (status === 'paid_active') return PLAN_IDS.pro;
  if (status === 'inactive' || status === 'payment_failed' || status === 'canceled') {
    return rawPlan && PLAN_ALIASES[rawPlan] ? PLAN_ALIASES[rawPlan] : PLAN_IDS.free;
  }

  return PLAN_IDS.trial;
}

export function getPlanDefinition(planId?: string | null, subscriptionStatus?: string | null): PlanDefinition {
  return PLAN_DEFINITIONS[normalizePlanId(planId, subscriptionStatus)];
}

export function getPlanLimits(planId?: string | null, subscriptionStatus?: string | null): PlanLimits {
  return { ...getPlanDefinition(planId, subscriptionStatus).limits };
}

export function getPlanFeatures(planId?: string | null, subscriptionStatus?: string | null): PlanFeatures {
  return { ...getPlanDefinition(planId, subscriptionStatus).features };
}

export function isPlanFeatureEnabled(planId: string | null | undefined, feature: PlanFeatureKey, subscriptionStatus?: string | null) {
  return Boolean(getPlanFeatures(planId, subscriptionStatus)[feature]);
}

export function buildPlanAccessModel(input: {
  planId?: string | null;
  subscriptionStatus?: string | null;
  isTrialActive?: boolean | null;
}) {
  const subscriptionStatus = input.subscriptionStatus || 'inactive';
  const planId = normalizePlanId(input.planId, subscriptionStatus);
  const definition = PLAN_DEFINITIONS[planId];

  return {
    planId,
    subscriptionStatus,
    limits: { ...definition.limits },
    features: { ...definition.features },
  };
}
