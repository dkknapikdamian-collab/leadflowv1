import type { CloseFlowStatusTone } from './lead-status';

export const CLIENT_STATUS_VALUES = [
  'new',
  'active',
  'in_progress',
  'waiting',
  'needs_action',
  'on_hold',
  'completed',
  'archived',
] as const;

export type ClientStatus = (typeof CLIENT_STATUS_VALUES)[number];

export type ClientStatusConfig = {
  value: ClientStatus;
  label: string;
  tone: CloseFlowStatusTone;
  pillClass: string;
};

export const CLIENT_STATUS_CONFIG: Record<ClientStatus, ClientStatusConfig> = {
  new: { value: 'new', label: 'Nowy', tone: 'blue', pillClass: 'client-detail-pill-blue' },
  active: { value: 'active', label: 'Aktywny', tone: 'green', pillClass: 'client-detail-pill-green' },
  in_progress: { value: 'in_progress', label: 'W realizacji', tone: 'blue', pillClass: 'client-detail-pill-blue' },
  waiting: { value: 'waiting', label: 'Czeka', tone: 'amber', pillClass: 'client-detail-pill-amber' },
  needs_action: { value: 'needs_action', label: 'Wymaga akcji', tone: 'amber', pillClass: 'client-detail-pill-amber' },
  on_hold: { value: 'on_hold', label: 'Wstrzymany', tone: 'amber', pillClass: 'client-detail-pill-amber' },
  completed: { value: 'completed', label: 'Zakonczony', tone: 'green', pillClass: 'client-detail-pill-green' },
  archived: { value: 'archived', label: 'Archiwum', tone: 'neutral', pillClass: 'client-detail-pill-muted' },
};

export const CLIENT_STATUS_OPTIONS = CLIENT_STATUS_VALUES.map((value) => CLIENT_STATUS_CONFIG[value]);

export function normalizeClientStatus(value: unknown, fallback: ClientStatus = 'active'): ClientStatus {
  const normalized = String(value || '').trim().toLowerCase();
  return (CLIENT_STATUS_VALUES as readonly string[]).includes(normalized) ? normalized as ClientStatus : fallback;
}

export function getClientStatusConfig(value: unknown) {
  return CLIENT_STATUS_CONFIG[normalizeClientStatus(value)];
}

export function getClientStatusLabel(value: unknown) {
  return getClientStatusConfig(value).label;
}

export function getClientStatusPillClass(value: unknown) {
  return getClientStatusConfig(value).pillClass;
}
