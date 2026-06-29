import {
  CASE_STATUS_VALUES,
  normalizeCaseStatus,
  type CaseStatus,
} from '../domain-statuses';
import {
  getCaseDetailPillClassForTone as casePillClass,
  getClientDetailPillClassForTone as clientPillClass,
  type CloseFlowStatusTone,
} from './ui-tones';

export type CaseStatusValue = CaseStatus;
export type CaseItemStatusValue =
  | 'missing'
  | 'uploaded'
  | 'submitted'
  | 'accepted'
  | 'approved'
  | 'rejected'
  | 'sent'
  | 'completed';

export type CaseStatusMeta = {
  value: CaseStatusValue;
  label: string;
  hint: string;
  tone: CloseFlowStatusTone;
  clientPillClass: string;
  caseDetailPillClass: string;
};

export type CaseStatusConfig = CaseStatusMeta;

export type CaseItemStatusMeta = {
  value: CaseItemStatusValue;
  label: string;
};

export const CASE_CLOSED_STATUSES = ['completed', 'done', 'closed', 'archived', 'canceled', 'cancelled'] as const;

const CASE_STATUS_LABELS: Record<CaseStatusValue, string> = {
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

const CASE_STATUS_HINTS: Record<CaseStatusValue, string> = {
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

const CASE_STATUS_TONES: Record<CaseStatusValue, CloseFlowStatusTone> = {
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

export const CASE_STATUS_META_BY_VALUE: Record<CaseStatusValue, CaseStatusMeta> = Object.fromEntries(
  CASE_STATUS_VALUES.map((value) => {
    const tone = CASE_STATUS_TONES[value];
    return [value, {
      value,
      label: CASE_STATUS_LABELS[value],
      hint: CASE_STATUS_HINTS[value],
      tone,
      clientPillClass: clientPillClass(tone),
      caseDetailPillClass: casePillClass(tone),
    }];
  }),
) as Record<CaseStatusValue, CaseStatusMeta>;

export const CASE_STATUS_OPTIONS = CASE_STATUS_VALUES.map((value) => CASE_STATUS_META_BY_VALUE[value]);

export const CASE_ITEM_STATUS_LABELS: Record<CaseItemStatusValue, string> = {
  missing: 'Brak',
  uploaded: 'Do akceptacji',
  submitted: 'Dostarczone',
  accepted: 'Zaakceptowane',
  approved: 'Zaakceptowane',
  rejected: 'Odrzucone',
  sent: 'Wyslane',
  completed: 'Zakonczone',
};

export const CASE_ITEM_STATUS_OPTIONS: readonly CaseItemStatusMeta[] = Object.entries(CASE_ITEM_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as CaseItemStatusValue, label }),
);

export const CASE_ITEM_STATUS_META_BY_VALUE: Record<CaseItemStatusValue, CaseItemStatusMeta> = Object.fromEntries(
  CASE_ITEM_STATUS_OPTIONS.map((option) => [option.value, option]),
) as Record<CaseItemStatusValue, CaseItemStatusMeta>;

export function normalizeCaseItemStatus(status: unknown): CaseItemStatusValue {
  const raw = typeof status === 'string' ? status.trim().toLowerCase() : '';
  return raw in CASE_ITEM_STATUS_META_BY_VALUE ? (raw as CaseItemStatusValue) : 'missing';
}

export function getCaseStatusMeta(status: unknown) {
  return CASE_STATUS_META_BY_VALUE[normalizeCaseStatus(status)];
}

export function getCaseItemStatusMeta(status: unknown) {
  const raw = typeof status === 'string' ? status.trim().toLowerCase() : '';
  if (raw in CASE_ITEM_STATUS_META_BY_VALUE) {
    return CASE_ITEM_STATUS_META_BY_VALUE[raw as CaseItemStatusValue];
  }

  return {
    value: 'missing' as const,
    label: String(status || 'Brak'),
  };
}

export function getCaseStatusLabel(status: unknown) {
  return getCaseStatusMeta(status).label;
}

export function getCaseStatusHint(status: unknown) {
  return getCaseStatusMeta(status).hint;
}

export function getCaseStatusTone(status: unknown) {
  return getCaseStatusMeta(status).tone;
}

export function getCaseClientPillClass(status: unknown) {
  return getCaseStatusMeta(status).clientPillClass;
}

export function getCaseDetailPillClass(status: unknown) {
  return getCaseStatusMeta(status).caseDetailPillClass;
}

export function getCaseItemStatusLabel(status: unknown) {
  return getCaseItemStatusMeta(status).label;
}

export function isClosedCaseStatus(status: unknown) {
  const raw = typeof status === 'string' ? status.trim().toLowerCase() : '';
  if ((CASE_CLOSED_STATUSES as readonly string[]).includes(raw)) return true;
  return (CASE_CLOSED_STATUSES as readonly string[]).includes(normalizeCaseStatus(status));
}
