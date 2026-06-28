import {
  LEAD_STATUS_META,
  LEAD_STATUS_VALUES,
  normalizeLeadStatus,
  type LeadStatus,
} from '../domain-statuses';

export type CloseFlowStatusTone = 'blue' | 'green' | 'amber' | 'red' | 'neutral' | 'purple' | 'slate';
export type LeadStatusValue = LeadStatus;
export type LeadSourceValue =
  | 'instagram'
  | 'facebook'
  | 'messenger'
  | 'whatsapp'
  | 'email'
  | 'form'
  | 'phone'
  | 'referral'
  | 'cold_outreach'
  | 'other';

export type LeadStatusConfig = {
  value: LeadStatusValue;
  label: string;
  tone: CloseFlowStatusTone;
  pillClass: string;
};

export type LeadSourceMeta = {
  value: LeadSourceValue;
  label: string;
};

const LEAD_STATUS_TONES: Record<LeadStatusValue, CloseFlowStatusTone> = {
  new: 'blue',
  contacted: 'blue',
  qualification: 'blue',
  proposal_sent: 'amber',
  waiting_response: 'amber',
  negotiation: 'amber',
  accepted: 'green',
  won: 'green',
  lost: 'neutral',
  moved_to_service: 'purple',
  archived: 'neutral',
};

const LEAD_STATUS_LABEL_OVERRIDES: Partial<Record<LeadStatusValue, string>> = {
  moved_to_service: 'Przeniesiony do obslugi',
};

const LEAD_STATUS_PILL_CLASSES: Record<CloseFlowStatusTone, string> = {
  blue: 'lead-detail-pill-blue',
  green: 'lead-detail-pill-green',
  amber: 'lead-detail-pill-amber',
  red: 'lead-detail-pill-danger',
  neutral: 'lead-detail-pill-muted',
  purple: 'lead-detail-pill-purple',
  slate: 'lead-detail-pill-muted',
};

export const LEAD_STATUS_META_BY_VALUE: Record<LeadStatusValue, LeadStatusConfig> = Object.fromEntries(
  LEAD_STATUS_VALUES.map((value) => {
    const tone = LEAD_STATUS_TONES[value];
    return [value, {
      value,
      label: LEAD_STATUS_LABEL_OVERRIDES[value] || LEAD_STATUS_META[value].label,
      tone,
      pillClass: LEAD_STATUS_PILL_CLASSES[tone],
    }];
  }),
) as Record<LeadStatusValue, LeadStatusConfig>;

export const LEAD_STATUS_OPTIONS = LEAD_STATUS_VALUES.map((value) => LEAD_STATUS_META_BY_VALUE[value]);

export const LEAD_SOURCE_OPTIONS: readonly LeadSourceMeta[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'messenger', label: 'Messenger' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
  { value: 'form', label: 'Formularz' },
  { value: 'phone', label: 'Telefon' },
  { value: 'referral', label: 'Polecenie' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'other', label: 'Inne' },
] as const;

export const LEAD_SOURCE_META_BY_VALUE: Record<LeadSourceValue, LeadSourceMeta> = Object.fromEntries(
  LEAD_SOURCE_OPTIONS.map((option) => [option.value, option]),
) as Record<LeadSourceValue, LeadSourceMeta>;

export function normalizeLeadSource(source: unknown): LeadSourceValue {
  const raw = typeof source === 'string' ? source.trim().toLowerCase() : '';
  return raw in LEAD_SOURCE_META_BY_VALUE ? (raw as LeadSourceValue) : 'other';
}

export function getLeadStatusMeta(status: unknown) {
  return LEAD_STATUS_META_BY_VALUE[normalizeLeadStatus(status)];
}

export function getLeadSourceMeta(source: unknown) {
  return LEAD_SOURCE_META_BY_VALUE[normalizeLeadSource(source)];
}

export function getLeadStatusLabel(status: unknown) {
  return getLeadStatusMeta(status).label;
}

export function getLeadStatusTone(status: unknown) {
  return getLeadStatusMeta(status).tone;
}

export function getLeadStatusPillClass(status: unknown) {
  return getLeadStatusMeta(status).pillClass;
}

export function getLeadSourceLabel(source: unknown) {
  return getLeadSourceMeta(source).label;
}

const CLOSED_LEAD_STATUSES = new Set<LeadStatusValue>([
  'won',
  'lost',
  'moved_to_service',
  'archived',
]);

export function isClosedLeadStatus(status: unknown) {
  return CLOSED_LEAD_STATUSES.has(normalizeLeadStatus(status));
}
