export const LEAD_STATUS_VALUES = [
  'new',
  'contacted',
  'qualification',
  'proposal_sent',
  'waiting_response',
  'negotiation',
  'accepted',
  'won',
  'lost',
  'moved_to_service',
  'archived',
] as const;

export type LeadStatus = (typeof LEAD_STATUS_VALUES)[number];
export type KnownLeadStatus = LeadStatus;

export const CASE_STATUS_VALUES = [
  'new',
  'waiting_on_client',
  'blocked',
  'to_approve',
  'ready_to_start',
  'in_progress',
  'on_hold',
  'completed',
  'canceled',
  'archived',
] as const;

export type CaseStatus = (typeof CASE_STATUS_VALUES)[number];
export type KnownCaseStatus = CaseStatus;

export const TASK_STATUS_VALUES = [
  'todo',
  'scheduled',
  'in_progress',
  'done',
  'canceled',
] as const;

export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];
export type KnownTaskStatus = TaskStatus;

export const EVENT_STATUS_VALUES = [
  'scheduled',
  'in_progress',
  'done',
  'canceled',
] as const;

export type EventStatus = (typeof EVENT_STATUS_VALUES)[number];
export type KnownEventStatus = EventStatus;

export const PORTAL_ITEM_STATUS_VALUES = [
  'missing',
  'requested',
  'submitted',
  'to_verify',
  'needs_changes',
  'approved',
  'rejected',
  'completed',
  'not_applicable',
  'canceled',
] as const;

export type PortalItemStatus = (typeof PORTAL_ITEM_STATUS_VALUES)[number];

export const AI_DRAFT_STATUS_VALUES = [
  'draft',
  'pending',
  'confirmed',
  'converted',
  'canceled',
  'failed',
] as const;

export type AiDraftStatus = (typeof AI_DRAFT_STATUS_VALUES)[number];

export const BILLING_STATUS_VALUES = [
  'trial_active',
  'trial_ending',
  'trial_expired',
  'free_active',
  'paid_active',
  'payment_failed',
  'past_due',
  'inactive',
  'workspace_missing',
  'not_applicable',
  'not_started',
  'awaiting_payment',
  'deposit_paid',
  'partially_paid',
  'fully_paid',
  'commission_pending',
  'commission_due',
  'paid',
  'refunded',
  'written_off',
  'canceled',
] as const;

export type BillingStatus = (typeof BILLING_STATUS_VALUES)[number];
export type AccessState = BillingStatus;

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

type StatusMeta<T extends string> = {
  value: T;
  label: string;
  color?: string;
};

const LEAD_LEGACY_STATUS_MAP: Record<string, LeadStatus> = {
  follow_up: 'waiting_response',
  follow_up_needed: 'waiting_response',
  waiting_for_reply: 'waiting_response',
  waiting_reply: 'waiting_response',
  accepted_waiting_start: 'accepted',
  active_service: 'moved_to_service',
  service: 'moved_to_service',
  closed_won: 'won',
  closed_lost: 'lost',
};

const CASE_LEGACY_STATUS_MAP: Record<string, CaseStatus> = {
  unstarted: 'new',
  collecting_materials: 'waiting_on_client',
  waiting_for_client: 'waiting_on_client',
  waiting_client: 'waiting_on_client',
  to_verify: 'to_approve',
  closed: 'completed',
  done: 'completed',
  cancelled: 'canceled',
};

const TASK_LEGACY_STATUS_MAP: Record<string, TaskStatus> = {
  completed: 'done',
  cancelled: 'canceled',
  postponed: 'scheduled',
  overdue: 'todo',
};

const EVENT_LEGACY_STATUS_MAP: Record<string, EventStatus> = {
  completed: 'done',
  cancelled: 'canceled',
};

const PORTAL_ITEM_LEGACY_STATUS_MAP: Record<string, PortalItemStatus> = {
  uploaded: 'submitted',
  accepted: 'approved',
  to_improve: 'needs_changes',
  done: 'completed',
  cancelled: 'canceled',
};

const AI_DRAFT_LEGACY_STATUS_MAP: Record<string, AiDraftStatus> = {
  approved: 'confirmed',
  done: 'confirmed',
  cancelled: 'canceled',
};

const BILLING_LEGACY_STATUS_MAP: Record<string, BillingStatus> = {
  cancelled: 'canceled',
  canceled_at_period_end: 'canceled',
};

function normalizeRawStatus(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeFromList<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
  legacy: Record<string, T> = {},
): T {
  const raw = normalizeRawStatus(value);
  if (!raw) return fallback;
  const mapped = legacy[raw] || raw;
  return (allowed as readonly string[]).includes(mapped) ? (mapped as T) : fallback;
}

export function normalizeLeadStatus(value: unknown, fallback: LeadStatus = 'new'): LeadStatus {
  return normalizeFromList(value, LEAD_STATUS_VALUES, fallback, LEAD_LEGACY_STATUS_MAP);
}

export function normalizeCaseStatus(value: unknown, fallback: CaseStatus = 'new'): CaseStatus {
  return normalizeFromList(value, CASE_STATUS_VALUES, fallback, CASE_LEGACY_STATUS_MAP);
}

export function normalizeTaskStatus(value: unknown, fallback: TaskStatus = 'todo'): TaskStatus {
  return normalizeFromList(value, TASK_STATUS_VALUES, fallback, TASK_LEGACY_STATUS_MAP);
}

export function normalizeEventStatus(value: unknown, fallback: EventStatus = 'scheduled'): EventStatus {
  return normalizeFromList(value, EVENT_STATUS_VALUES, fallback, EVENT_LEGACY_STATUS_MAP);
}

export function normalizePortalItemStatus(value: unknown, fallback: PortalItemStatus = 'missing'): PortalItemStatus {
  return normalizeFromList(value, PORTAL_ITEM_STATUS_VALUES, fallback, PORTAL_ITEM_LEGACY_STATUS_MAP);
}

export function normalizeAiDraftStatus(value: unknown, fallback: AiDraftStatus = 'pending'): AiDraftStatus {
  return normalizeFromList(value, AI_DRAFT_STATUS_VALUES, fallback, AI_DRAFT_LEGACY_STATUS_MAP);
}

export function normalizeBillingStatus(value: unknown, fallback: BillingStatus = 'inactive'): BillingStatus {
  return normalizeFromList(value, BILLING_STATUS_VALUES, fallback, BILLING_LEGACY_STATUS_MAP);
}

export function normalizeAccessState(value: unknown, fallback: AccessState = 'inactive'): AccessState {
  return normalizeBillingStatus(value, fallback);
}

export const LEAD_STATUS_META: Record<LeadStatus, StatusMeta<LeadStatus>> = {
  new: { value: 'new', label: 'Nowy', color: 'bg-blue-100 text-blue-700' },
  contacted: { value: 'contacted', label: 'Skontaktowany', color: 'bg-indigo-100 text-indigo-700' },
  qualification: { value: 'qualification', label: 'Kwalifikacja', color: 'bg-purple-100 text-purple-700' },
  proposal_sent: { value: 'proposal_sent', label: 'Oferta wyslana', color: 'bg-amber-100 text-amber-700' },
  waiting_response: { value: 'waiting_response', label: 'Czeka na odpowiedz', color: 'bg-orange-100 text-orange-700' },
  negotiation: { value: 'negotiation', label: 'Negocjacje', color: 'bg-pink-100 text-pink-700' },
  accepted: { value: 'accepted', label: 'Zaakceptowany', color: 'bg-cyan-100 text-cyan-700' },
  won: { value: 'won', label: 'Wygrany', color: 'bg-emerald-100 text-emerald-700' },
  lost: { value: 'lost', label: 'Przegrany', color: 'bg-slate-100 text-slate-700' },
  moved_to_service: { value: 'moved_to_service', label: 'W obsludze', color: 'bg-violet-100 text-violet-700' },
  archived: { value: 'archived', label: 'Archiwum', color: 'bg-slate-100 text-slate-700' },
};

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  new: 'Nowa',
  waiting_on_client: 'Czeka na klienta',
  blocked: 'Zablokowana',
  to_approve: 'Do akceptacji',
  ready_to_start: 'Gotowa do startu',
  in_progress: 'W realizacji',
  on_hold: 'Wstrzymana',
  completed: 'Zakonczona',
  canceled: 'Anulowana',
  archived: 'Archiwum',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Do zrobienia',
  scheduled: 'Zaplanowane',
  in_progress: 'W trakcie',
  done: 'Zrobione',
  canceled: 'Anulowane',
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: 'Zaplanowane',
  in_progress: 'W trakcie',
  done: 'Zrobione',
  canceled: 'Anulowane',
};

export const PORTAL_ITEM_STATUS_LABELS: Record<PortalItemStatus, string> = {
  missing: 'Brakuje',
  requested: 'Poproszono',
  submitted: 'Dostarczone',
  to_verify: 'Do sprawdzenia',
  needs_changes: 'Do poprawy',
  approved: 'Zatwierdzone',
  rejected: 'Odrzucone',
  completed: 'Zakonczone',
  not_applicable: 'Nie dotyczy',
  canceled: 'Anulowane',
};

export const AI_DRAFT_STATUS_LABELS: Record<AiDraftStatus, string> = {
  draft: 'Szkic',
  pending: 'Do sprawdzenia',
  confirmed: 'Zatwierdzony',
  converted: 'Zamieniony na rekord',
  canceled: 'Anulowany',
  failed: 'Blad',
};

export const BILLING_STATUS_LABELS: Record<BillingStatus, string> = {
  trial_active: 'Trial aktywny',
  trial_ending: 'Trial konczy sie',
  trial_expired: 'Trial wygasl',
  free_active: 'Free aktywny',
  paid_active: 'Platny aktywny',
  payment_failed: 'Platnosc nieudana',
  past_due: 'Po terminie',
  inactive: 'Nieaktywny',
  workspace_missing: 'Brak workspace',
  not_applicable: 'Nie dotyczy',
  not_started: 'Nie rozpoczeto',
  awaiting_payment: 'Czeka na platnosc',
  deposit_paid: 'Zaliczka oplacona',
  partially_paid: 'Czesciowo oplacone',
  fully_paid: 'W pelni oplacone',
  commission_pending: 'Prowizja oczekuje',
  commission_due: 'Prowizja nalezna',
  paid: 'Oplacone',
  refunded: 'Zwrocone',
  written_off: 'Spisane',
  canceled: 'Anulowane',
};

export const LEAD_STATUS_OPTIONS = LEAD_STATUS_VALUES.map((value) => LEAD_STATUS_META[value]);

export function getLeadStatusMeta(value: unknown) {
  return LEAD_STATUS_META[normalizeLeadStatus(value)];
}

export function getCaseStatusLabel(value: unknown) {
  return CASE_STATUS_LABELS[normalizeCaseStatus(value)];
}

export function getTaskStatusLabel(value: unknown) {
  return TASK_STATUS_LABELS[normalizeTaskStatus(value)];
}

export function getEventStatusLabel(value: unknown) {
  return EVENT_STATUS_LABELS[normalizeEventStatus(value)];
}

export function getPortalItemStatusLabel(value: unknown) {
  return PORTAL_ITEM_STATUS_LABELS[normalizePortalItemStatus(value)];
}

export function getAiDraftStatusLabel(value: unknown) {
  return AI_DRAFT_STATUS_LABELS[normalizeAiDraftStatus(value)];
}

export function getBillingStatusLabel(value: unknown) {
  return BILLING_STATUS_LABELS[normalizeBillingStatus(value)];
}