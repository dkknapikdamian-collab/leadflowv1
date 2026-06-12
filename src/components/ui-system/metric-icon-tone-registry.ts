import type { OperatorMetricTone } from './operator-metric-tone-contract';

export const CLOSEFLOW_METRIC_ICON_TONE_SOURCE_TRUTH_R8 =
  'CLOSEFLOW_METRIC_ICON_TONE_SOURCE_TRUTH_R8: icon/entity semantics own metric icon colors across CloseFlow';

export type CloseflowMetricIconTone = OperatorMetricTone;

export type CloseflowMetricIconToneInput = {
  id?: unknown;
  label?: unknown;
  icon?: unknown;
  entity?: unknown;
  semantic?: unknown;
  fallback?: CloseflowMetricIconTone;
};

const RAW_TONES: CloseflowMetricIconTone[] = ['neutral', 'blue', 'amber', 'red', 'green', 'purple'];

const ICON_TONE_BY_KEY: Record<string, CloseflowMetricIconTone> = {
  all: 'neutral',
  wszystkie: 'neutral',
  total: 'neutral',
  razem: 'neutral',
  neutral: 'neutral',
  lost: 'neutral',
  utracone: 'neutral',
  przegrane: 'neutral',
  archiwum: 'neutral',

  lead: 'blue',
  leads: 'blue',
  leady: 'blue',
  target: 'blue',
  cel: 'blue',
  aktywni: 'blue',
  aktywne: 'blue',
  action: 'blue',
  lead_action: 'blue',
  move_now: 'blue',
  movement: 'blue',
  next_move: 'blue',
  'do ruchu teraz': 'blue',
  nowy: 'blue',
  nowe: 'blue',
  kontakt: 'blue',
  kwalifikacja: 'blue',
  'do obslugi': 'blue',
  obsluga: 'blue',

  client: 'green',
  clients: 'green',
  klient: 'green',
  klienci: 'green',
  done: 'green',
  zrobione: 'green',
  gotowe: 'green',
  wygrane: 'green',
  won: 'green',

  money: 'green',
  finanse: 'green',
  finance: 'green',
  payment: 'green',
  payments: 'green',
  platnosci: 'green',
  prowizja: 'green',
  commission: 'green',
  billing: 'green',
  bill: 'green',
  wallet: 'green',
  badge_dollar_sign: 'green',
  credit_card: 'green',
  value: 'green',
  wartosc: 'green',
  przychod: 'green',

  no_next_move: 'amber',
  waiting_no_next_move: 'amber',
  waiting: 'amber',
  czeka: 'amber',
  'czeka na odpowiedz': 'amber',
  'bez kroku': 'amber',
  'bez nastepnego kroku': 'amber',
  silence: 'amber',
  silence_waiting: 'amber',
  silent: 'amber',
  silent_7: 'amber',
  cisza: 'amber',
  clock: 'amber',
  clock3: 'amber',
  oferta: 'amber',
  'oferta wyslana': 'amber',
  negocjacje: 'amber',
  negotiation: 'amber',
  filter: 'amber',

  risk: 'red',
  ryzyko: 'red',
  high_risk: 'red',
  critical: 'red',
  wysokie: 'red',
  shield_alert: 'red',
  alert_triangle: 'red',
  trash: 'red',
  trash2: 'red',
  delete: 'red',
  kosz: 'red',
  zalegle: 'red',
  overdue: 'red',
  blokery: 'red',

  case: 'purple',
  cases: 'purple',
  sprawa: 'purple',
  sprawy: 'purple',
  briefcase: 'purple',
  ai: 'purple',
  sparkles: 'purple',
  template: 'purple',
  templates: 'purple',
  szablon: 'purple',
  szablony: 'purple',
  event: 'purple',
  wydarzenie: 'purple',
  calendar: 'purple',
  upcoming: 'purple',
  'najblizsze 7 dni': 'purple',
  historia: 'purple',
  system: 'purple',
};

const PRIORITY_KEYS = [
  'bez nastepnego kroku',
  'do ruchu teraz',
  'oferta wyslana',
  'czeka na odpowiedz',
  'do obslugi',
  'najblizsze 7 dni',
  'wysokie ryzyko',
  'badge dollar sign',
  'credit card',
  'shield alert',
  'alert triangle',
  'bez kroku',
  'move_now',
  'no_next_move',
  'high_risk',
  'silent_7',
  'payment',
  'payments',
  'commission',
  'billing',
  'finance',
  'money',
  'wallet',
  'trash2',
  'trash',
  'target',
  'filter',
  'clock3',
  'briefcase',
  'case',
  'lead',
  'client',
  'risk',
  'ryzyko',
  'cisza',
  'negocjacje',
  'utracone',
  'wszystkie',
] as const;

export function normalizeCloseflowMetricIconToneKey(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[|/\\()[\]{}:;,.!?]+/g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toneFromRaw(value: unknown): CloseflowMetricIconTone | null {
  const normalized = normalizeCloseflowMetricIconToneKey(value);
  if ((RAW_TONES as string[]).includes(normalized)) return normalized as CloseflowMetricIconTone;
  return ICON_TONE_BY_KEY[normalized] || null;
}

function toneFromText(value: unknown): CloseflowMetricIconTone | null {
  const normalized = normalizeCloseflowMetricIconToneKey(value);
  if (!normalized) return null;
  if (ICON_TONE_BY_KEY[normalized]) return ICON_TONE_BY_KEY[normalized];

  for (const key of PRIORITY_KEYS) {
    const normalizedKey = normalizeCloseflowMetricIconToneKey(key);
    if (normalized === normalizedKey || normalized.includes(normalizedKey)) {
      return ICON_TONE_BY_KEY[normalizedKey] || null;
    }
  }

  return null;
}

export function resolveCloseflowMetricIconTone(input: CloseflowMetricIconToneInput): CloseflowMetricIconTone {
  return (
    toneFromText(input.semantic)
    || toneFromText(input.entity)
    || toneFromText(input.icon)
    || toneFromText(input.id)
    || toneFromText(input.label)
    || toneFromRaw(input.fallback)
    || 'neutral'
  );
}
