import {
  LEAD_STATUS_META,
  LEAD_STATUS_VALUES,
  normalizeLeadStatus,
  type LeadStatus,
} from '../domain-statuses';

export type CloseFlowStatusTone = 'blue' | 'green' | 'amber' | 'red' | 'neutral' | 'purple' | 'slate';

export type LeadStatusConfig = {
  value: LeadStatus;
  label: string;
  tone: CloseFlowStatusTone;
  pillClass: string;
};

const LEAD_STATUS_TONES: Record<LeadStatus, CloseFlowStatusTone> = {
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

const LEAD_STATUS_LABEL_OVERRIDES: Partial<Record<LeadStatus, string>> = {
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

export const LEAD_STATUS_CONFIG: Record<LeadStatus, LeadStatusConfig> = Object.fromEntries(
  LEAD_STATUS_VALUES.map((value) => {
    const tone = LEAD_STATUS_TONES[value];
    return [value, {
      value,
      label: LEAD_STATUS_LABEL_OVERRIDES[value] || LEAD_STATUS_META[value].label,
      tone,
      pillClass: LEAD_STATUS_PILL_CLASSES[tone],
    }];
  }),
) as Record<LeadStatus, LeadStatusConfig>;

export const LEAD_STATUS_OPTIONS = LEAD_STATUS_VALUES.map((value) => LEAD_STATUS_CONFIG[value]);

export function getLeadStatusConfig(value: unknown) {
  return LEAD_STATUS_CONFIG[normalizeLeadStatus(value)];
}

export function getLeadStatusLabel(value: unknown) {
  return getLeadStatusConfig(value).label;
}

export function getLeadStatusTone(value: unknown) {
  return getLeadStatusConfig(value).tone;
}

export function getLeadStatusPillClass(value: unknown) {
  return getLeadStatusConfig(value).pillClass;
}
