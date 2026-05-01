export type KnownLeadStatus =
  | 'new'
  | 'contacted'
  | 'qualification'
  | 'proposal_sent'
  | 'waiting_response'
  | 'negotiation'
  | 'accepted'
  | 'won'
  | 'lost'
  | 'moved_to_service'
  | 'archived';

export type KnownTaskStatus =
  | 'todo'
  | 'scheduled'
  | 'in_progress'
  | 'done'
  | 'completed'
  | 'cancelled';

export type KnownEventStatus =
  | 'scheduled'
  | 'done'
  | 'completed'
  | 'cancelled';

export type KnownCaseStatus =
  | 'new'
  | 'in_progress'
  | 'waiting_for_client'
  | 'blocked'
  | 'done'
  | 'completed'
  | 'cancelled'
  | 'archived';

export type BillingStatus =
  | 'trial_active'
  | 'trial_ending'
  | 'trial_expired'
  | 'free_active'
  | 'paid_active'
  | 'payment_failed'
  | 'past_due'
  | 'cancelled'
  | 'inactive'
  | 'workspace_missing'
  | (string & {});

export type AccessState =
  | 'workspace_missing'
  | 'trial_active'
  | 'trial_ending'
  | 'trial_expired'
  | 'free_active'
  | 'paid_active'
  | 'payment_failed'
  | 'past_due'
  | 'cancelled'
  | 'inactive'
  | (string & {});

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export function normalizeBillingStatus(value: unknown, fallback: BillingStatus = 'inactive'): BillingStatus {
  const status = typeof value === 'string' ? value.trim() : '';
  return (status || fallback) as BillingStatus;
}

export function normalizeAccessState(value: unknown, fallback: AccessState = 'inactive'): AccessState {
  const status = typeof value === 'string' ? value.trim() : '';
  return (status || fallback) as AccessState;
}
