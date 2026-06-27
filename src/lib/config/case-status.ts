import {
  CASE_STATUS_VALUES,
  normalizeCaseStatus,
  type CaseStatus,
} from '../domain-statuses';

import type { CloseFlowStatusTone } from './lead-status';

export type CaseStatusConfig = {
  value: CaseStatus;
  label: string;
  hint: string;
  tone: CloseFlowStatusTone;
  clientPillClass: string;
  caseDetailPillClass: string;
};

export const CASE_CLOSED_STATUSES = ['completed', 'done', 'closed', 'archived', 'canceled', 'cancelled'] as const;

const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  new: 'Nowa',
  waiting_on_client: 'Czeka na klienta',
  blocked: 'Zablokowana',
  to_approve: 'Do akceptacji',
  ready_to_start: 'Gotowa do startu',
  in_progress: 'W realizacji',
  on_hold: 'Wstrzymana',
  completed: 'Zamknieta',
  canceled: 'Anulowana',
  archived: 'Archiwum',
};

const CASE_STATUS_HINTS: Record<CaseStatus, string> = {
  new: 'Ustal pierwszy krok i wymagane dane.',
  waiting_on_client: 'Czekasz na odpowiedz lub materialy od klienta.',
  blocked: 'Sprawa stoi. Usun blokery zanim przejdziesz dalej.',
  to_approve: 'Klient cos przeslal. Sprawdz i zaakceptuj albo odrzuc.',
  ready_to_start: 'Sprawa jest gotowa do dalszej pracy operacyjnej.',
  in_progress: 'Sprawa jest w pracy. Pilnuj najblizszej akcji i terminow.',
  on_hold: 'Sprawa jest wstrzymana. Ustal powod i nastepny termin.',
  completed: 'Sprawa zrobiona. Historia zostaje jako slad pracy.',
  canceled: 'Sprawa zostala anulowana.',
  archived: 'Sprawa jest w archiwum.',
};

const CASE_STATUS_TONES: Record<CaseStatus, CloseFlowStatusTone> = {
  new: 'blue',
  waiting_on_client: 'amber',
  blocked: 'red',
  to_approve: 'amber',
  ready_to_start: 'green',
  in_progress: 'blue',
  on_hold: 'amber',
  completed: 'green',
  canceled: 'neutral',
  archived: 'neutral',
};

const CLIENT_PILL_BY_TONE: Record<CloseFlowStatusTone, string> = {
  blue: 'client-detail-pill-blue',
  green: 'client-detail-pill-green',
  amber: 'client-detail-pill-amber',
  red: 'client-detail-pill-danger',
  neutral: 'client-detail-pill-muted',
  purple: 'client-detail-pill-blue',
  slate: 'client-detail-pill-muted',
};

const CASE_DETAIL_PILL_BY_TONE: Record<CloseFlowStatusTone, string> = {
  blue: 'case-detail-pill-blue',
  green: 'case-detail-pill-green',
  amber: 'case-detail-pill-amber',
  red: 'case-detail-pill-red',
  neutral: 'case-detail-pill-muted',
  purple: 'case-detail-pill-blue',
  slate: 'case-detail-pill-muted',
};

export const CASE_STATUS_CONFIG: Record<CaseStatus, CaseStatusConfig> = Object.fromEntries(
  CASE_STATUS_VALUES.map((value) => {
    const tone = CASE_STATUS_TONES[value];
    return [value, {
      value,
      label: CASE_STATUS_LABELS[value],
      hint: CASE_STATUS_HINTS[value],
      tone,
      clientPillClass: CLIENT_PILL_BY_TONE[tone],
      caseDetailPillClass: CASE_DETAIL_PILL_BY_TONE[tone],
    }];
  }),
) as Record<CaseStatus, CaseStatusConfig>;

export const CASE_STATUS_OPTIONS = CASE_STATUS_VALUES.map((value) => CASE_STATUS_CONFIG[value]);

export const CASE_ITEM_STATUS_LABELS: Record<string, string> = {
  missing: 'Brak',
  uploaded: 'Do akceptacji',
  submitted: 'Dostarczone',
  accepted: 'Zaakceptowane',
  approved: 'Zaakceptowane',
  rejected: 'Odrzucone',
  sent: 'Wyslane',
  completed: 'Zakonczone',
};

export function getCaseStatusConfig(value: unknown) {
  return CASE_STATUS_CONFIG[normalizeCaseStatus(value)];
}

export function getCaseStatusLabel(value: unknown) {
  return getCaseStatusConfig(value).label;
}

export function getCaseStatusHint(value: unknown) {
  return getCaseStatusConfig(value).hint;
}

export function getCaseStatusTone(value: unknown) {
  return getCaseStatusConfig(value).tone;
}

export function getCaseClientPillClass(value: unknown) {
  return getCaseStatusConfig(value).clientPillClass;
}

export function getCaseDetailPillClass(value: unknown) {
  return getCaseStatusConfig(value).caseDetailPillClass;
}

export function getCaseItemStatusLabel(value: unknown) {
  const key = String(value || '').trim().toLowerCase();
  return CASE_ITEM_STATUS_LABELS[key] || String(value || 'Brak');
}

export function isClosedCaseStatusValue(value: unknown) {
  return (CASE_CLOSED_STATUSES as readonly string[]).includes(String(value || '').trim().toLowerCase());
}
