import {
  BILLING_STATUS_LABELS as DOMAIN_BILLING_STATUS_LABELS,
  BILLING_STATUS_VALUES,
  CASE_STATUS_LABELS as DOMAIN_CASE_STATUS_LABELS,
  CASE_STATUS_VALUES,
  EVENT_STATUS_LABELS as DOMAIN_EVENT_STATUS_LABELS,
  EVENT_STATUS_VALUES,
  LEAD_STATUS_META as DOMAIN_LEAD_STATUS_META,
  LEAD_STATUS_VALUES,
  TASK_STATUS_LABELS as DOMAIN_TASK_STATUS_LABELS,
  TASK_STATUS_VALUES,
  type BillingStatus,
  type CaseStatus,
  type EventStatus,
  type LeadStatus,
  type TaskStatus,
} from '../domain-statuses';
import {
  LEAD_STATUS_META_BY_VALUE,
  isClosedLeadStatus,
} from './lead-options';
import {
  CLIENT_HEALTH_OPTIONS,
  CLIENT_SOURCE_OPTIONS,
  PORTAL_STATUS_OPTIONS,
} from './client-options';
import {
  CASE_CLOSED_STATUSES,
  CASE_ITEM_STATUS_OPTIONS,
  CASE_STATUS_META_BY_VALUE,
} from './case-options';
import {
  COMMISSION_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_TYPES,
  type CommissionStatus,
  type PaymentStatus,
} from '../finance/finance-types.js';

export const LF_PROD_SOT_001B_STATUS_REPOSITORY = 'LF-PROD-SOT-001B_STATUS_REPOSITORY' as const;

export type StatusSourceKind = 'source' | 'derived' | 'ui-only' | 'legacy';

export type StatusMeta = {
  value: string;
  label: string;
  tone?: string;
  source: StatusSourceKind;
  entity: string;
  aliases?: readonly string[];
  closed?: boolean;
  readOnly?: boolean;
  sourceFile: string;
  derivedFrom?: string;
  contract?: string;
};

export type StatusRepositorySection = {
  entity: string;
  sourceFiles: readonly string[];
  importedOrAdapted: string;
  notDuplicated: string;
  source: boolean;
  derived: boolean;
  uiOnly: boolean;
  legacy: boolean;
  legacyAliases: Readonly<Record<string, string>>;
  closedValues: readonly string[];
  labels: Readonly<Record<string, string>>;
  tones: Readonly<Record<string, string>>;
  items: readonly StatusMeta[];
  notes?: readonly string[];
};

type OptionWithTone = {
  value: string;
  label: string;
  tone?: string;
  badgeClassName?: string;
};

function labelsFrom(items: readonly StatusMeta[]) {
  return Object.fromEntries(items.map((item) => [item.value, item.label]));
}

function tonesFrom(items: readonly StatusMeta[]) {
  return Object.fromEntries(items.filter((item) => item.tone).map((item) => [item.value, item.tone || '']));
}

function optionToMeta(input: {
  option: OptionWithTone;
  entity: string;
  source: StatusSourceKind;
  sourceFile: string;
  closedValues?: readonly string[];
  aliases?: readonly string[];
  readOnly?: boolean;
  derivedFrom?: string;
  contract?: string;
}): StatusMeta {
  const tone = input.option.tone || input.option.badgeClassName;
  return {
    value: input.option.value,
    label: input.option.label,
    tone,
    source: input.source,
    entity: input.entity,
    aliases: input.aliases,
    closed: Boolean(input.closedValues?.includes(input.option.value)),
    readOnly: input.readOnly,
    sourceFile: input.sourceFile,
    derivedFrom: input.derivedFrom,
    contract: input.contract,
  };
}

const leadLegacyAliases = {
  follow_up: 'waiting_response',
  follow_up_needed: 'waiting_response',
  waiting_for_reply: 'waiting_response',
  waiting_reply: 'waiting_response',
  accepted_waiting_start: 'accepted',
  active_service: 'moved_to_service',
  service: 'moved_to_service',
  closed_won: 'won',
  closed_lost: 'lost',
} as const satisfies Readonly<Record<string, LeadStatus>>;

const caseLegacyAliases = {
  unstarted: 'new',
  collecting_materials: 'waiting_on_client',
  waiting_for_client: 'waiting_on_client',
  waiting_client: 'waiting_on_client',
  to_verify: 'to_approve',
  closed: 'completed',
  done: 'completed',
  cancelled: 'canceled',
} as const satisfies Readonly<Record<string, CaseStatus>>;

const taskLegacyAliases = {
  open: 'todo',
  completed: 'done',
  cancelled: 'canceled',
  archived: 'deleted',
  postponed: 'scheduled',
  overdue: 'todo',
} as const satisfies Readonly<Record<string, TaskStatus>>;

const eventLegacyAliases = {
  planned: 'scheduled',
  open: 'scheduled',
  completed: 'done',
  cancelled: 'canceled',
} as const satisfies Readonly<Record<string, EventStatus>>;

const paymentLegacyAliases = {
  pending: 'due',
  awaiting_payment: 'due',
  done: 'paid',
  completed: 'paid',
  settled: 'paid',
  canceled: 'cancelled',
} as const satisfies Readonly<Record<string, PaymentStatus>>;

const commissionLegacyAliases = {
  commission_pending: 'expected',
  commission_due: 'due',
  fully_paid: 'paid',
  paid_in_part: 'partially_paid',
} as const satisfies Readonly<Record<string, CommissionStatus>>;

const billingLegacyAliases = {
  cancelled: 'canceled',
  canceled_at_period_end: 'canceled',
} as const satisfies Readonly<Record<string, BillingStatus>>;

const leadStatusItems = LEAD_STATUS_VALUES.map((value) => {
  const meta = LEAD_STATUS_META_BY_VALUE[value];
  return optionToMeta({
    option: {
      value,
      label: meta.label || DOMAIN_LEAD_STATUS_META[value].label,
      tone: meta.tone,
    },
    entity: 'lead',
    source: 'source',
    sourceFile: 'src/lib/domain-statuses.ts + src/lib/source-of-truth/lead-options.ts',
    closedValues: LEAD_STATUS_VALUES.filter((candidate) => isClosedLeadStatus(candidate)),
    aliases: Object.entries(leadLegacyAliases).filter(([, target]) => target === value).map(([alias]) => alias),
  });
});

export const leadStatus: StatusRepositorySection = {
  entity: 'lead',
  sourceFiles: ['src/lib/domain-statuses.ts', 'src/lib/source-of-truth/lead-options.ts'],
  importedOrAdapted: 'LEAD_STATUS_VALUES + LEAD_STATUS_META_BY_VALUE + isClosedLeadStatus',
  notDuplicated: 'values and main metadata are imported from existing Lead status sources; aliases are documented bridge metadata from domain normalization map',
  source: true,
  derived: false,
  uiOnly: false,
  legacy: true,
  legacyAliases: leadLegacyAliases,
  closedValues: LEAD_STATUS_VALUES.filter((value) => isClosedLeadStatus(value)),
  labels: labelsFrom(leadStatusItems),
  tones: tonesFrom(leadStatusItems),
  items: leadStatusItems,
};

const clientHealthItems = CLIENT_HEALTH_OPTIONS.map((option) => optionToMeta({
  option,
  entity: 'client.health',
  source: 'derived',
  sourceFile: 'src/lib/source-of-truth/client-options.ts',
  readOnly: true,
  derivedFrom: 'deriveClientHealthValue',
  contract: 'clientHealth !== clientSource !== portalStatus',
}));

export const clientHealthStatus: StatusRepositorySection = {
  entity: 'client.health',
  sourceFiles: ['src/lib/source-of-truth/client-options.ts'],
  importedOrAdapted: 'CLIENT_HEALTH_OPTIONS + deriveClientHealthValue contract',
  notDuplicated: 'client health is derived from existing client-options and is not a flat clientStatus',
  source: false,
  derived: true,
  uiOnly: false,
  legacy: false,
  legacyAliases: {},
  closedValues: [],
  labels: labelsFrom(clientHealthItems),
  tones: tonesFrom(clientHealthItems),
  items: clientHealthItems,
};

const clientSourceItems = CLIENT_SOURCE_OPTIONS.map((option) => optionToMeta({
  option,
  entity: 'client.source',
  source: 'source',
  sourceFile: 'src/lib/source-of-truth/client-options.ts',
  contract: 'clientHealth !== clientSource !== portalStatus',
}));

export const clientSourceStatus: StatusRepositorySection = {
  entity: 'client.source',
  sourceFiles: ['src/lib/source-of-truth/client-options.ts'],
  importedOrAdapted: 'CLIENT_SOURCE_OPTIONS',
  notDuplicated: 'client source remains its own dimension, not a merged clientStatus',
  source: true,
  derived: false,
  uiOnly: false,
  legacy: false,
  legacyAliases: {},
  closedValues: [],
  labels: labelsFrom(clientSourceItems),
  tones: tonesFrom(clientSourceItems),
  items: clientSourceItems,
};

const clientPortalItems = PORTAL_STATUS_OPTIONS.map((option) => optionToMeta({
  option,
  entity: 'client.portal',
  source: 'derived',
  sourceFile: 'src/lib/source-of-truth/client-options.ts',
  readOnly: true,
  derivedFrom: 'portalReady -> getPortalStatusValue',
  contract: 'clientHealth !== clientSource !== portalStatus',
}));

export const clientPortalStatus: StatusRepositorySection = {
  entity: 'client.portal',
  sourceFiles: ['src/lib/source-of-truth/client-options.ts'],
  importedOrAdapted: 'PORTAL_STATUS_OPTIONS + getPortalStatusValue contract',
  notDuplicated: 'portal status remains a derived portal dimension, not a merged clientStatus',
  source: false,
  derived: true,
  uiOnly: false,
  legacy: false,
  legacyAliases: {},
  closedValues: ['disabled'],
  labels: labelsFrom(clientPortalItems),
  tones: tonesFrom(clientPortalItems),
  items: clientPortalItems,
};

const caseStatusItems = CASE_STATUS_VALUES.map((value) => {
  const meta = CASE_STATUS_META_BY_VALUE[value];
  return optionToMeta({
    option: { value, label: meta.label || DOMAIN_CASE_STATUS_LABELS[value], tone: meta.tone },
    entity: 'case',
    source: 'source',
    sourceFile: 'src/lib/domain-statuses.ts + src/lib/source-of-truth/case-options.ts',
    closedValues: CASE_CLOSED_STATUSES,
    aliases: Object.entries(caseLegacyAliases).filter(([, target]) => target === value).map(([alias]) => alias),
    contract: 'case.status !== caseLifecycle.bucket',
  });
});

export const caseStatus: StatusRepositorySection = {
  entity: 'case',
  sourceFiles: ['src/lib/domain-statuses.ts', 'src/lib/source-of-truth/case-options.ts'],
  importedOrAdapted: 'CASE_STATUS_VALUES + CASE_STATUS_META_BY_VALUE + CASE_CLOSED_STATUSES',
  notDuplicated: 'source values and UI meta are adapted from existing case status sources; lifecycle is separate',
  source: true,
  derived: false,
  uiOnly: false,
  legacy: true,
  legacyAliases: caseLegacyAliases,
  closedValues: CASE_CLOSED_STATUSES,
  labels: labelsFrom(caseStatusItems),
  tones: tonesFrom(caseStatusItems),
  items: caseStatusItems,
  notes: ['domain-statuses and case-options currently disagree on completed label; 001B records the drift instead of changing runtime copy'],
};

const caseLifecycleItems: readonly StatusMeta[] = [
  { value: 'blocked', label: 'Zablokowana', tone: 'red', source: 'derived', entity: 'case.lifecycle', readOnly: true, sourceFile: 'src/lib/case-lifecycle-v1.ts', derivedFrom: 'resolveCaseLifecycleV1', contract: 'case.status !== caseLifecycle.bucket' },
  { value: 'waiting_approval', label: 'Do akceptacji', tone: 'amber', source: 'derived', entity: 'case.lifecycle', readOnly: true, sourceFile: 'src/lib/case-lifecycle-v1.ts', derivedFrom: 'resolveCaseLifecycleV1', contract: 'case.status !== caseLifecycle.bucket' },
  { value: 'ready_to_start', label: 'Gotowa do startu', tone: 'green', source: 'derived', entity: 'case.lifecycle', readOnly: true, sourceFile: 'src/lib/case-lifecycle-v1.ts', derivedFrom: 'resolveCaseLifecycleV1', contract: 'case.status !== caseLifecycle.bucket' },
  { value: 'in_progress', label: 'W realizacji', tone: 'blue', source: 'derived', entity: 'case.lifecycle', readOnly: true, sourceFile: 'src/lib/case-lifecycle-v1.ts', derivedFrom: 'resolveCaseLifecycleV1', contract: 'case.status !== caseLifecycle.bucket' },
  { value: 'completed', label: 'Zakonczona', tone: 'green', source: 'derived', entity: 'case.lifecycle', readOnly: true, closed: true, sourceFile: 'src/lib/case-lifecycle-v1.ts', derivedFrom: 'resolveCaseLifecycleV1', contract: 'case.status !== caseLifecycle.bucket' },
  { value: 'needs_next_step', label: 'Brak kolejnego kroku', tone: 'amber', source: 'derived', entity: 'case.lifecycle', readOnly: true, sourceFile: 'src/lib/case-lifecycle-v1.ts', derivedFrom: 'resolveCaseLifecycleV1', contract: 'case.status !== caseLifecycle.bucket' },
];

export const caseLifecycleStatus: StatusRepositorySection = {
  entity: 'case.lifecycle',
  sourceFiles: ['src/lib/case-lifecycle-v1.ts'],
  importedOrAdapted: 'CaseLifecycleBucketV1 contract from resolveCaseLifecycleV1; kept derived/read-only',
  notDuplicated: 'lifecycle bucket is recorded separately from case.status',
  source: false,
  derived: true,
  uiOnly: false,
  legacy: false,
  legacyAliases: {},
  closedValues: ['completed'],
  labels: labelsFrom(caseLifecycleItems),
  tones: tonesFrom(caseLifecycleItems),
  items: caseLifecycleItems,
};

const taskClosedValues = ['done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted'] as const;
const taskStatusItems = TASK_STATUS_VALUES.map((value) => optionToMeta({
  option: { value, label: DOMAIN_TASK_STATUS_LABELS[value] },
  entity: 'task',
  source: 'source',
  sourceFile: 'src/lib/domain-statuses.ts + src/lib/source-of-truth/schedule-options.ts',
  closedValues: taskClosedValues,
  aliases: Object.entries(taskLegacyAliases).filter(([, target]) => target === value).map(([alias]) => alias),
  contract: 'task.done !== event.done',
}));

export const taskStatus: StatusRepositorySection = {
  entity: 'task',
  sourceFiles: ['src/lib/domain-statuses.ts', 'src/lib/source-of-truth/schedule-options.ts'],
  importedOrAdapted: 'TASK_STATUS_VALUES + schedule-options alias contract',
  notDuplicated: 'task status uses domain values and keeps schedule compatibility aliases separate',
  source: true,
  derived: false,
  uiOnly: false,
  legacy: true,
  legacyAliases: taskLegacyAliases,
  closedValues: taskClosedValues,
  labels: labelsFrom(taskStatusItems),
  tones: {},
  items: taskStatusItems,
};

const eventClosedValues = ['done', 'completed', 'cancelled', 'canceled', 'deleted'] as const;
const eventStatusItems = EVENT_STATUS_VALUES.map((value) => optionToMeta({
  option: { value, label: value === 'done' ? 'Odbyte' : DOMAIN_EVENT_STATUS_LABELS[value] },
  entity: 'event',
  source: 'source',
  sourceFile: 'src/lib/domain-statuses.ts + src/lib/source-of-truth/schedule-options.ts',
  closedValues: eventClosedValues,
  aliases: Object.entries(eventLegacyAliases).filter(([, target]) => target === value).map(([alias]) => alias),
  contract: 'task.done !== event.done',
}));

export const eventStatus: StatusRepositorySection = {
  entity: 'event',
  sourceFiles: ['src/lib/domain-statuses.ts', 'src/lib/source-of-truth/schedule-options.ts'],
  importedOrAdapted: 'EVENT_STATUS_VALUES + schedule-options event label contract',
  notDuplicated: 'event status uses domain values and records schedule-options done label separately from task done',
  source: true,
  derived: false,
  uiOnly: false,
  legacy: true,
  legacyAliases: eventLegacyAliases,
  closedValues: eventClosedValues,
  labels: labelsFrom(eventStatusItems),
  tones: {},
  items: eventStatusItems,
};

const paymentLabels: Record<PaymentStatus, string> = {
  planned: 'Zaplanowana',
  due: 'Do zaplaty',
  paid: 'Oplacona',
  cancelled: 'Anulowana',
};

const paymentClosedValues = ['paid', 'cancelled'] as const;
const paymentStatusItems = PAYMENT_STATUSES.map((value) => optionToMeta({
  option: { value, label: paymentLabels[value] },
  entity: 'payment',
  source: 'source',
  sourceFile: 'src/lib/finance/finance-types.ts + src/lib/finance/finance-normalize.ts',
  closedValues: paymentClosedValues,
  aliases: Object.entries(paymentLegacyAliases).filter(([, target]) => target === value).map(([alias]) => alias),
  contract: 'payment.status !== payment.paidLikeCompatibility',
}));

export const paymentStatus: StatusRepositorySection & {
  paymentTypes: readonly string[];
  paidLikeCompatibilityValues: readonly string[];
  dueLikeCompatibilityValues: readonly string[];
} = {
  entity: 'payment',
  sourceFiles: ['src/lib/finance/finance-types.ts', 'src/lib/finance/finance-normalize.ts', 'src/lib/finance/case-finance-source.ts'],
  importedOrAdapted: 'PAYMENT_STATUSES + normalizePaymentStatus; paidLike/dueLike recorded from case-finance-source contract',
  notDuplicated: 'canonical payment status is separate from compatibility paid-like/due-like sets',
  source: true,
  derived: false,
  uiOnly: false,
  legacy: true,
  legacyAliases: paymentLegacyAliases,
  closedValues: paymentClosedValues,
  labels: labelsFrom(paymentStatusItems),
  tones: {},
  items: paymentStatusItems,
  paymentTypes: PAYMENT_TYPES,
  paidLikeCompatibilityValues: ['paid', 'fully_paid', 'deposit_paid', 'partially_paid', 'confirmed', 'settled', 'completed', 'done'],
  dueLikeCompatibilityValues: ['due', 'planned', 'pending', 'awaiting_payment', 'open'],
};

const missingClosedValues = ['resolved', 'deleted', 'done', 'completed', 'closed', 'cancelled', 'canceled', 'archived'] as const;
const missingItemStatusItems: readonly StatusMeta[] = [
  { value: 'missing_item', label: 'Brak', tone: 'amber', source: 'source', entity: 'missing-item', sourceFile: 'src/lib/owner-control/owner-control-missing-blockers.ts', contract: 'active missing source record is task/work-item, not activity history' },
  { value: 'blocking_missing_item', label: 'Blokada', tone: 'red', source: 'source', entity: 'missing-item', sourceFile: 'src/lib/owner-control/owner-control-missing-blockers.ts', contract: 'active missing source record is task/work-item, not activity history' },
  { value: 'blocksProgress', label: 'Blokuje postep', tone: 'red', source: 'derived', entity: 'missing-item', sourceFile: 'src/lib/owner-control/owner-control-missing-blockers.ts', derivedFrom: 'blocksProgress flag', readOnly: true, contract: 'active missing source record is task/work-item, not activity history' },
  ...missingClosedValues.map((value) => ({ value, label: value, tone: 'slate', source: 'legacy' as const, entity: 'missing-item', sourceFile: 'src/lib/owner-control/owner-control-missing-blockers.ts', closed: true, contract: 'closed values cannot resurrect active missing rows' })),
];

export const missingItemStatus: StatusRepositorySection = {
  entity: 'missing-item',
  sourceFiles: ['src/lib/owner-control/owner-control-missing-blockers.ts', 'src/lib/activity-timeline.ts', 'src/lib/source-of-truth/case-options.ts'],
  importedOrAdapted: 'isOwnerMissingControlItem contract + activity timeline label contract; case item legacy kept separate',
  notDuplicated: 'active source record and history label are recorded separately',
  source: true,
  derived: true,
  uiOnly: false,
  legacy: true,
  legacyAliases: { missing: 'missing_item', blocker: 'blocking_missing_item' },
  closedValues: missingClosedValues,
  labels: labelsFrom(missingItemStatusItems),
  tones: tonesFrom(missingItemStatusItems),
  items: missingItemStatusItems,
};

const ownerControlStatusItems: readonly StatusMeta[] = [
  { value: 'critical', label: 'Krytyczne', tone: 'red', source: 'derived', entity: 'owner-control', readOnly: true, sourceFile: 'src/lib/owner-control/owner-control-baseline.ts', derivedFrom: 'buildOwnerControlBaseline severity' },
  { value: 'warning', label: 'Ostrzezenie', tone: 'amber', source: 'derived', entity: 'owner-control', readOnly: true, sourceFile: 'src/lib/owner-control/owner-control-baseline.ts', derivedFrom: 'buildOwnerControlBaseline severity' },
  { value: 'normal', label: 'Normalne', tone: 'slate', source: 'derived', entity: 'owner-control', readOnly: true, sourceFile: 'src/lib/owner-control/owner-control-baseline.ts', derivedFrom: 'buildOwnerControlBaseline severity' },
];

export const ownerControlStatus: StatusRepositorySection = {
  entity: 'owner-control',
  sourceFiles: ['src/lib/owner-control/owner-control-baseline.ts', 'src/lib/owner-control/owner-control-missing-blockers.ts'],
  importedOrAdapted: 'Owner Control severity contract only; runtime is not imported or rewired',
  notDuplicated: 'Owner Control remains a consumer/aggregator, not a source status table',
  source: false,
  derived: true,
  uiOnly: false,
  legacy: false,
  legacyAliases: {},
  closedValues: [],
  labels: labelsFrom(ownerControlStatusItems),
  tones: tonesFrom(ownerControlStatusItems),
  items: ownerControlStatusItems,
};

const activityStatusItems: readonly StatusMeta[] = [
  { value: 'status', label: 'Zmieniono status', source: 'ui-only', entity: 'activity', sourceFile: 'src/lib/activity-timeline.ts', contract: 'activity status labels must use entity formatter where possible' },
  { value: 'task', label: 'Zadanie', source: 'ui-only', entity: 'activity', sourceFile: 'src/lib/activity-timeline.ts' },
  { value: 'event', label: 'Wydarzenie', source: 'ui-only', entity: 'activity', sourceFile: 'src/lib/activity-timeline.ts' },
  { value: 'missing_item', label: 'Brak', source: 'ui-only', entity: 'activity', sourceFile: 'src/lib/activity-timeline.ts', contract: 'activity history is not active missing source' },
  { value: 'payment', label: 'Wplata', source: 'ui-only', entity: 'activity', sourceFile: 'src/lib/activity-timeline.ts' },
  { value: 'billing', label: 'Rozliczenie', source: 'ui-only', entity: 'activity', sourceFile: 'src/lib/activity-timeline.ts' },
  { value: 'lead_moved', label: 'Ten temat jest juz w obsludze', source: 'ui-only', entity: 'activity', sourceFile: 'src/lib/activity-timeline.ts' },
];

export const activityStatus: StatusRepositorySection = {
  entity: 'activity',
  sourceFiles: ['src/lib/activity-timeline.ts'],
  importedOrAdapted: 'activity timeline event type label contract',
  notDuplicated: 'activity remains UI-only timeline formatting, not source status',
  source: false,
  derived: false,
  uiOnly: true,
  legacy: false,
  legacyAliases: {},
  closedValues: [],
  labels: labelsFrom(activityStatusItems),
  tones: {},
  items: activityStatusItems,
};

const commissionLabels: Record<CommissionStatus, string> = {
  not_set: 'Nieustalona',
  expected: 'Oczekiwana',
  due: 'Nalezna',
  partially_paid: 'Czesciowo oplacona',
  paid: 'Oplacona',
  overdue: 'Po terminie',
};

const commissionStatusItems = COMMISSION_STATUSES.map((value) => optionToMeta({
  option: { value, label: commissionLabels[value] },
  entity: 'commission',
  source: 'derived',
  sourceFile: 'src/lib/finance/finance-types.ts + src/lib/finance/finance-normalize.ts + src/lib/finance/case-finance-source.ts',
  closedValues: ['paid'],
  aliases: Object.entries(commissionLegacyAliases).filter(([, target]) => target === value).map(([alias]) => alias),
  readOnly: true,
  derivedFrom: 'deriveCommissionStatus / getCaseFinanceSummary',
  contract: 'commissionStatus = derived/read-only, not manual select',
}));

export const commissionStatus: StatusRepositorySection = {
  entity: 'commission',
  sourceFiles: ['src/lib/finance/finance-types.ts', 'src/lib/finance/finance-normalize.ts', 'src/lib/finance/case-finance-source.ts'],
  importedOrAdapted: 'COMMISSION_STATUSES + normalizeCommissionStatus + derived getCaseFinanceSummary contract',
  notDuplicated: 'commission status is read-only derived from payments and commission amount',
  source: false,
  derived: true,
  uiOnly: false,
  legacy: true,
  legacyAliases: commissionLegacyAliases,
  closedValues: ['paid'],
  labels: labelsFrom(commissionStatusItems),
  tones: {},
  items: commissionStatusItems,
  notes: ['buildCaseFinancePatch writes commissionStatus cache as not_set; runtime derived status comes from getCaseFinanceSummary'],
};

const billingStatusItems = BILLING_STATUS_VALUES.map((value) => optionToMeta({
  option: { value, label: DOMAIN_BILLING_STATUS_LABELS[value] },
  entity: 'billing',
  source: 'source',
  sourceFile: 'src/lib/domain-statuses.ts',
  closedValues: ['canceled', 'inactive', 'not_applicable', 'written_off'],
  aliases: Object.entries(billingLegacyAliases).filter(([, target]) => target === value).map(([alias]) => alias),
}));

export const billingStatus: StatusRepositorySection = {
  entity: 'billing',
  sourceFiles: ['src/lib/domain-statuses.ts'],
  importedOrAdapted: 'BILLING_STATUS_VALUES + BILLING_STATUS_LABELS',
  notDuplicated: 'billing status remains its own section and is not mixed with payment/commission',
  source: true,
  derived: false,
  uiOnly: false,
  legacy: true,
  legacyAliases: billingLegacyAliases,
  closedValues: ['canceled', 'inactive', 'not_applicable', 'written_off'],
  labels: labelsFrom(billingStatusItems),
  tones: {},
  items: billingStatusItems,
};

export const caseItemStatus: StatusRepositorySection = {
  entity: 'case-item',
  sourceFiles: ['src/lib/source-of-truth/case-options.ts'],
  importedOrAdapted: 'CASE_ITEM_STATUS_OPTIONS only for legacy checklist/case_items compatibility',
  notDuplicated: 'case item status is separate from missingItemStatus active source record',
  source: true,
  derived: false,
  uiOnly: false,
  legacy: true,
  legacyAliases: { accepted: 'approved' },
  closedValues: ['accepted', 'approved', 'rejected', 'completed'],
  labels: Object.fromEntries(CASE_ITEM_STATUS_OPTIONS.map((option) => [option.value, option.label])),
  tones: {},
  items: CASE_ITEM_STATUS_OPTIONS.map((option) => optionToMeta({
    option,
    entity: 'case-item',
    source: 'legacy',
    sourceFile: 'src/lib/source-of-truth/case-options.ts',
    closedValues: ['accepted', 'approved', 'rejected', 'completed'],
    contract: 'caseItem.status !== missingItemStatus',
  })),
};

export const statusRepository = {
  leadStatus,
  clientHealthStatus,
  clientSourceStatus,
  clientPortalStatus,
  caseStatus,
  caseLifecycleStatus,
  caseItemStatus,
  taskStatus,
  eventStatus,
  paymentStatus,
  missingItemStatus,
  ownerControlStatus,
  activityStatus,
  commissionStatus,
  billingStatus,
} as const;

export type StatusRepository = typeof statusRepository;

export const STATUS_REPOSITORY_SOURCE_MAP = Object.fromEntries(
  Object.entries(statusRepository).map(([key, section]) => [key, {
    entity: section.entity,
    sourceFile: section.sourceFiles.join(' + '),
    importedOrAdapted: section.importedOrAdapted,
    notDuplicated: section.notDuplicated,
    derivedUiOnlyLegacyHandling: {
      source: section.source,
      derived: section.derived,
      uiOnly: section.uiOnly,
      legacy: section.legacy,
      legacyAliases: section.legacyAliases,
    },
  }]),
) as Readonly<Record<keyof StatusRepository, unknown>>;
