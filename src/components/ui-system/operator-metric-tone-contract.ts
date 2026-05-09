export type OperatorMetricTone = 'neutral' | 'blue' | 'amber' | 'red' | 'green' | 'purple';

export const CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH =
  'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH: semantic label/id/status owns metric tile tone before local screen colors';

const RAW_OPERATOR_TONES: OperatorMetricTone[] = ['neutral', 'blue', 'amber', 'red', 'green', 'purple'];

const TONE_ALIASES: Record<string, OperatorMetricTone> = {
  active: 'blue',
  aktywne: 'blue',
  aktywni: 'blue',
  today: 'blue',
  dzis: 'blue',
  waiting: 'amber',
  czeka: 'amber',
  overdue: 'red',
  risk: 'red',
  ryzyko: 'red',
  done: 'green',
  zrobione: 'green',
  value: 'green',
  wartosc: 'green',
  ai: 'purple',
  drafts: 'purple',
  szkice: 'purple',
  upcoming: 'purple',
  nadchodzace: 'purple',
};

const SEMANTIC_TONE_BY_KEY: Record<string, OperatorMetricTone> = {
  all: 'neutral',
  wszystkie: 'neutral',
  razem: 'neutral',
  total: 'neutral',
  archiwum: 'neutral',
  archiwalne: 'neutral',
  przegrane: 'neutral',
  utracone: 'neutral',
  lost: 'neutral',

  lead: 'blue',
  leady: 'blue',
  aktywne: 'blue',
  aktywni: 'blue',
  aktywny: 'blue',
  dzis: 'blue',
  dzisiaj: 'blue',
  'do ruchu dzis': 'blue',
  'do zrobienia dzis': 'blue',
  'w realizacji': 'blue',
  pozycje: 'blue',
  kategorie: 'blue',

  klient: 'green',
  klienci: 'green',
  wartosc: 'green',
  platnosci: 'green',
  przychod: 'green',
  zrobione: 'green',
  gotowe: 'green',
  zakonczone: 'green',
  akceptacje: 'green',
  zmienne: 'green',

  czekajace: 'amber',
  'leady czekajace': 'amber',
  czeka: 'amber',
  waiting: 'amber',
  'waiting za dlugo': 'amber',
  'bez sprawy': 'amber',
  odlozone: 'amber',
  kosz: 'amber',
  obowiazkowe: 'amber',
  tagi: 'amber',

  zalegle: 'red',
  zagrozone: 'red',
  zagrozenie: 'red',
  ryzyko: 'red',
  'bez ruchu': 'red',
  'bez dzialan': 'red',
  blokery: 'red',
  blokowane: 'red',
  problem: 'red',
  pilne: 'red',

  sprawa: 'purple',
  sprawy: 'purple',
  historia: 'purple',
  system: 'purple',
  szablon: 'purple',
  szablony: 'purple',
  odpowiedzi: 'purple',
  'szkice ai': 'purple',
  'szkice ai do sprawdzenia': 'purple',
  szkice: 'purple',
  drafty: 'purple',
  nadchodzace: 'purple',
  upcoming: 'purple',
  'najblizsze 7 dni': 'purple',
  'do sprawdzenia': 'purple',
};

const KEY_PRIORITY = [
  'szkice ai do sprawdzenia',
  'najblizsze 7 dni',
  'leady czekajace',
  'waiting za dlugo',
  'bez nastepnego kroku',
  'bez zaplanowanej akcji',
  'bez dzialan',
  'bez sprawy',
  'w realizacji',
  'do sprawdzenia',
  'do ruchu dzis',
  'do zrobienia dzis',
  'zalegle',
  'zagrozone',
  'nadchodzace',
  'wszystkie',
  'aktywni',
  'aktywne',
  'historia',
  'szablony',
  'pozycje',
  'sprawy',
  'leady',
  'klienci',
  'wartosc',
  'kosz',
  'tagi',
  'zmienne',
  'kategorie',
];

export function normalizeOperatorMetricKey(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[0-9]+$/g, '')
    .replace(/[|/\\()[\]{}:;,.!?]+/g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toneFromExactKey(key: string): OperatorMetricTone | null {
  if (!key) return null;
  return SEMANTIC_TONE_BY_KEY[key] || TONE_ALIASES[key] || null;
}

function toneFromIncludedKey(key: string): OperatorMetricTone | null {
  if (!key) return null;
  for (const semanticKey of KEY_PRIORITY) {
    if (key === semanticKey || key.includes(semanticKey)) {
      return SEMANTIC_TONE_BY_KEY[semanticKey] || TONE_ALIASES[semanticKey] || null;
    }
  }
  return null;
}

function toneFromRawTone(value: unknown): OperatorMetricTone | null {
  const key = normalizeOperatorMetricKey(value);
  if ((RAW_OPERATOR_TONES as string[]).includes(key)) return key as OperatorMetricTone;
  return TONE_ALIASES[key] || null;
}

function toneFromClassText(value: unknown): OperatorMetricTone | null {
  const key = normalizeOperatorMetricKey(value);
  if (!key) return null;
  if (key.includes('rose') || key.includes('red')) return 'red';
  if (key.includes('emerald') || key.includes('green') || key.includes('teal')) return 'green';
  if (key.includes('purple') || key.includes('violet')) return 'purple';
  if (key.includes('amber') || key.includes('orange') || key.includes('yellow')) return 'amber';
  if (key.includes('blue') || key.includes('sky') || key.includes('indigo')) return 'blue';
  return null;
}

export function resolveOperatorMetricTone(input: {
  id?: unknown;
  label?: unknown;
  tone?: unknown;
  classText?: unknown;
}): OperatorMetricTone {
  const idKey = normalizeOperatorMetricKey(input.id);
  const labelKey = normalizeOperatorMetricKey(input.label);

  return (
    toneFromExactKey(idKey)
    || toneFromExactKey(labelKey)
    || toneFromIncludedKey(idKey)
    || toneFromIncludedKey(labelKey)
    || toneFromRawTone(input.tone)
    || toneFromClassText(input.classText)
    || 'neutral'
  );
}

export function isKnownOperatorMetricSemanticLabel(value: unknown) {
  const key = normalizeOperatorMetricKey(value);
  if (!key) return false;
  return Boolean(toneFromExactKey(key) || toneFromIncludedKey(key));
}

export const CLOSEFLOW_VS7_REPORTED_ADMIN_FEEDBACK_LABELS = [
  'Wszystkie',
  'Nadchodzące',
  'Leady',
  'Sprawy',
  'Szablony',
  'Pozycje',
  'W realizacji',
  'Bez sprawy',
  'Aktywni',
  'Historia',
  'Najbliższe 7 dni',
  'Szkice AI do sprawdzenia',
  'Leady czekające',
] as const;
