export type CloseFlowStatusTone = 'blue' | 'green' | 'amber' | 'red' | 'neutral' | 'purple' | 'slate';
export type CloseFlowSemanticTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'muted';

export type CloseFlowToneDefinition = {
  label: string;
  badgeClassName: string;
  textClassName: string;
  surfaceClassName: string;
};

export const UI_TONES: Record<CloseFlowSemanticTone, CloseFlowToneDefinition> = {
  neutral: {
    label: 'Neutral',
    badgeClassName: 'bg-slate-100 text-slate-700 border-slate-100',
    textClassName: 'text-slate-700',
    surfaceClassName: 'bg-slate-50 border-slate-100',
  },
  success: {
    label: 'Success',
    badgeClassName: 'bg-emerald-100 text-emerald-700 border-emerald-100',
    textClassName: 'text-emerald-700',
    surfaceClassName: 'bg-emerald-50 border-emerald-100',
  },
  warning: {
    label: 'Warning',
    badgeClassName: 'bg-amber-100 text-amber-700 border-amber-100',
    textClassName: 'text-amber-700',
    surfaceClassName: 'bg-amber-50 border-amber-100',
  },
  danger: {
    label: 'Danger',
    badgeClassName: 'bg-rose-100 text-rose-700 border-rose-100',
    textClassName: 'text-rose-700',
    surfaceClassName: 'bg-rose-50 border-rose-100',
  },
  info: {
    label: 'Info',
    badgeClassName: 'bg-blue-100 text-blue-700 border-blue-100',
    textClassName: 'text-blue-700',
    surfaceClassName: 'bg-blue-50 border-blue-100',
  },
  primary: {
    label: 'Primary',
    badgeClassName: 'bg-purple-100 text-purple-700 border-purple-100',
    textClassName: 'text-purple-700',
    surfaceClassName: 'bg-purple-50 border-purple-100',
  },
  muted: {
    label: 'Muted',
    badgeClassName: 'bg-slate-100 text-slate-600 border-slate-100',
    textClassName: 'text-slate-600',
    surfaceClassName: 'bg-slate-50 border-slate-100',
  },
};

export const STATUS_TONE_TO_SEMANTIC_TONE: Record<CloseFlowStatusTone, CloseFlowSemanticTone> = {
  blue: 'info',
  green: 'success',
  amber: 'warning',
  red: 'danger',
  neutral: 'muted',
  purple: 'primary',
  slate: 'muted',
};

export const LEAD_DETAIL_PILL_CLASS_BY_TONE: Record<CloseFlowStatusTone, string> = {
  blue: 'lead-detail-pill-blue',
  green: 'lead-detail-pill-green',
  amber: 'lead-detail-pill-amber',
  red: 'lead-detail-pill-danger',
  neutral: 'lead-detail-pill-muted',
  purple: 'lead-detail-pill-purple',
  slate: 'lead-detail-pill-muted',
};

export const CLIENT_DETAIL_PILL_CLASS_BY_TONE: Record<CloseFlowStatusTone, string> = {
  blue: 'client-detail-pill-blue',
  green: 'client-detail-pill-green',
  amber: 'client-detail-pill-amber',
  red: 'client-detail-pill-danger',
  neutral: 'client-detail-pill-muted',
  purple: 'client-detail-pill-blue',
  slate: 'client-detail-pill-muted',
};

export const CASE_DETAIL_PILL_CLASS_BY_TONE: Record<CloseFlowStatusTone, string> = {
  blue: 'case-detail-pill-blue',
  green: 'case-detail-pill-green',
  amber: 'case-detail-pill-amber',
  red: 'case-detail-pill-red',
  neutral: 'case-detail-pill-muted',
  purple: 'case-detail-pill-blue',
  slate: 'case-detail-pill-muted',
};

export const ACCESS_TONE_CLASS_BY_SEMANTIC_TONE: Record<CloseFlowSemanticTone, string> = {
  neutral: 'text-slate-700',
  success: 'text-emerald-700',
  warning: 'text-amber-700',
  danger: 'text-rose-700',
  info: 'text-sky-700',
  primary: 'text-purple-700',
  muted: 'text-slate-500',
};

export const ACCESS_CHIP_CLASS_BY_SEMANTIC_TONE: Record<CloseFlowSemanticTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-100',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-100 text-amber-700 border-amber-100',
  danger: 'bg-rose-100 text-rose-700 border-rose-100',
  info: 'bg-sky-100 text-sky-700 border-sky-100',
  primary: 'bg-purple-100 text-purple-700 border-purple-100',
  muted: 'bg-slate-100 text-slate-500 border-slate-100',
};

export function getSemanticToneForStatusTone(tone: CloseFlowStatusTone): CloseFlowSemanticTone {
  return STATUS_TONE_TO_SEMANTIC_TONE[tone] || 'muted';
}

export function getLeadDetailPillClassForTone(tone: CloseFlowStatusTone): string {
  return LEAD_DETAIL_PILL_CLASS_BY_TONE[tone] || LEAD_DETAIL_PILL_CLASS_BY_TONE.neutral;
}

export function getClientDetailPillClassForTone(tone: CloseFlowStatusTone): string {
  return CLIENT_DETAIL_PILL_CLASS_BY_TONE[tone] || CLIENT_DETAIL_PILL_CLASS_BY_TONE.neutral;
}

export function getCaseDetailPillClassForTone(tone: CloseFlowStatusTone): string {
  return CASE_DETAIL_PILL_CLASS_BY_TONE[tone] || CASE_DETAIL_PILL_CLASS_BY_TONE.neutral;
}
