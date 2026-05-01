export const TRIAL_DAYS = 21;

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

export const FREE_LIMITS = {
  activeLeads: 5,
  activeTasks: 5,
  activeEvents: 5,
  activeDrafts: 3,
} as const;
