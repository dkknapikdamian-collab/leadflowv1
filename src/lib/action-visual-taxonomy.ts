// CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1
// CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6_BOM_SAFE
export type CloseFlowActionVisualKind =
  | 'task'
  | 'event'
  | 'note'
  | 'followup'
  | 'deadline'
  | 'meeting'
  | 'call'
  | 'email'
  | 'payment'
  | 'system'
  | 'default';

const NORMALIZE_MAP: Record<string, CloseFlowActionVisualKind> = {
  task: 'task',
  todo: 'task',
  zadanie: 'task',
  tasks: 'task',
  event: 'event',
  wydarzenie: 'event',
  calendar: 'event',
  note: 'note',
  notes: 'note',
  notatka: 'note',
  komentarz: 'note',
  followup: 'followup',
  follow_up: 'followup',
  'follow-up': 'followup',
  kontakt: 'followup',
  lead_followup: 'followup',
  deadline: 'deadline',
  due: 'deadline',
  termin: 'deadline',
  overdue: 'deadline',
  meeting: 'meeting',
  spotkanie: 'meeting',
  appointment: 'meeting',
  call: 'call',
  phone: 'call',
  telefon: 'call',
  email: 'email',
  mail: 'email',
  payment: 'payment',
  platnosc: 'payment',
  płatność: 'payment',
  invoice: 'payment',
  system: 'system',
  activity: 'system',
};

function compactKey(value: unknown): string {
  return String(value || '').trim().toLowerCase();
}

export function normalizeCloseFlowActionVisualKind(value: unknown): CloseFlowActionVisualKind {
  const raw = compactKey(value);
  if (!raw) return 'default';
  return NORMALIZE_MAP[raw] || NORMALIZE_MAP[raw.replace(/\s+/g, '_')] || 'default';
}

export function inferCloseFlowActionVisualKind(row: Record<string, unknown> | null | undefined): CloseFlowActionVisualKind {
  if (!row) return 'default';
  const direct = row.visualKind || row.actionVisualKind || row.actionKind || row.kind || row.type || row.actionType || row.sourceType || row.category;
  const normalizedDirect = normalizeCloseFlowActionVisualKind(direct);
  if (normalizedDirect !== 'default') return normalizedDirect;
  const title = compactKey(row.title || row.name || row.subject || row.label || row.description || row.notes);
  if (/follow[-_ ]?up|oddzwon|wr[oó]c|kontakt/.test(title)) return 'followup';
  if (/deadline|termin|do kiedy|dzi[sś]|jutro/.test(title)) return 'deadline';
  if (/spotkanie|meeting|wizyta/.test(title)) return 'meeting';
  if (/telefon|zadzwo|call/.test(title)) return 'call';
  if (/mail|email|wiadomo[sś][cć]/.test(title)) return 'email';
  if (/p[łl]atno[sś][cć]|faktura|invoice|zaliczka/.test(title)) return 'payment';
  if (/notatka|note|komentarz/.test(title)) return 'note';
  if (/wydarzenie|event|kalendarz/.test(title)) return 'event';
  if (/zadanie|task|todo/.test(title)) return 'task';
  return 'default';
}

export function getCloseFlowActionKindClass(kind: unknown): string {
  return 'cf-action-kind-' + normalizeCloseFlowActionVisualKind(kind);
}

export function getCloseFlowActionVisualClass(row: Record<string, unknown> | null | undefined): string {
  return 'cf-action-kind-' + inferCloseFlowActionVisualKind(row);
}

export function getCloseFlowActionVisualDataKind(row: Record<string, unknown> | null | undefined): CloseFlowActionVisualKind {
  return inferCloseFlowActionVisualKind(row);
}
