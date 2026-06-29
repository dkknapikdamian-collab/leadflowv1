export type ClientHealthValue =
  | 'in_progress'
  | 'onboarding'
  | 'needs_attention'
  | 'in_sales'
  | 'needs_linking'
  | 'unknown';

export type ClientSourceValue = 'client' | 'lead' | 'manual' | 'case' | 'import' | 'unknown';

export type PortalStatusValue = 'enabled' | 'disabled' | 'pending' | 'unknown';

export type ClientHealthInput = {
  daysSinceTouch: number;
  linkedCaseCount: number;
  linkedLeadCount: number;
  portalReady: boolean;
};

export type ClientHealthMeta = {
  value: ClientHealthValue;
  label: string;
  description: string;
  tone: string;
  badgeClassName: string;
};

export type ClientSourceMeta = {
  value: ClientSourceValue;
  label: string;
  description: string;
};

export type PortalStatusMeta = {
  value: PortalStatusValue;
  label: string;
  tone: string;
  badgeClassName: string;
};

export const CLIENT_HEALTH_OPTIONS: ClientHealthMeta[] = [
  {
    value: 'in_progress',
    label: 'W realizacji',
    description: 'Klient ma aktywną sprawę i gotowy portal.',
    tone: 'green',
    badgeClassName: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/20',
  },
  {
    value: 'onboarding',
    label: 'Onboarding',
    description: 'Klient ma sprawę, ale portal nie jest jeszcze gotowy.',
    tone: 'blue',
    badgeClassName: 'bg-sky-500/12 text-sky-500 border-sky-500/20',
  },
  {
    value: 'needs_attention',
    label: 'Wymaga ruchu',
    description: 'Klient nie miał kontaktu przez co najmniej siedem dni.',
    tone: 'amber',
    badgeClassName: 'bg-amber-500/12 text-amber-500 border-amber-500/20',
  },
  {
    value: 'in_sales',
    label: 'W sprzedaży',
    description: 'Klient ma powiązany lead i nie ma jeszcze sprawy.',
    tone: 'indigo',
    badgeClassName: 'bg-indigo-500/12 text-indigo-500 border-indigo-500/20',
  },
  {
    value: 'needs_linking',
    label: 'Do spięcia',
    description: 'Klient wymaga spięcia z leadem, sprawą albo następnym ruchem.',
    tone: 'slate',
    badgeClassName: 'bg-slate-500/12 text-slate-500 border-slate-500/20',
  },
  {
    value: 'unknown',
    label: 'Klient',
    description: 'Status klienta nie jest jeszcze sklasyfikowany.',
    tone: 'slate',
    badgeClassName: 'bg-slate-500/12 text-slate-500 border-slate-500/20',
  },
];

export const CLIENT_SOURCE_OPTIONS: ClientSourceMeta[] = [
  { value: 'client', label: 'Kartoteka klienta', description: 'Rekord pochodzi z tabeli klientów.' },
  { value: 'lead', label: 'Lead', description: 'Rekord klienta został zbudowany z relacji leadowej.' },
  { value: 'case', label: 'Sprawa', description: 'Rekord klienta został zbudowany z relacji sprawy.' },
  { value: 'manual', label: 'Ręcznie', description: 'Rekord klienta został dodany ręcznie.' },
  { value: 'import', label: 'Import', description: 'Rekord klienta pochodzi z importu.' },
  { value: 'unknown', label: 'Nieznane', description: 'Źródło klienta nie jest sklasyfikowane.' },
];

export const PORTAL_STATUS_OPTIONS: PortalStatusMeta[] = [
  { value: 'enabled', label: 'Portal gotowy', tone: 'green', badgeClassName: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/20' },
  { value: 'disabled', label: 'Portal jeszcze niegotowy', tone: 'slate', badgeClassName: 'bg-slate-500/12 text-slate-500 border-slate-500/20' },
  { value: 'pending', label: 'Portal w przygotowaniu', tone: 'amber', badgeClassName: 'bg-amber-500/12 text-amber-500 border-amber-500/20' },
  { value: 'unknown', label: 'Portal nieznany', tone: 'slate', badgeClassName: 'bg-slate-500/12 text-slate-500 border-slate-500/20' },
];

const CLIENT_HEALTH_META_BY_VALUE = new Map(CLIENT_HEALTH_OPTIONS.map((option) => [option.value, option]));
const CLIENT_HEALTH_VALUE_BY_LABEL = new Map(CLIENT_HEALTH_OPTIONS.map((option) => [option.label, option.value]));
const CLIENT_SOURCE_META_BY_VALUE = new Map(CLIENT_SOURCE_OPTIONS.map((option) => [option.value, option]));
const PORTAL_STATUS_META_BY_VALUE = new Map(PORTAL_STATUS_OPTIONS.map((option) => [option.value, option]));

export function deriveClientHealthValue(input: ClientHealthInput): ClientHealthValue {
  if (input.linkedCaseCount > 0 && input.portalReady) return 'in_progress';
  if (input.linkedCaseCount > 0) return 'onboarding';
  if (input.daysSinceTouch >= 7) return 'needs_attention';
  if (input.linkedLeadCount > 0) return 'in_sales';
  return 'needs_linking';
}

export function resolveClientHealthValue(value?: ClientHealthValue | string | null): ClientHealthValue {
  const normalized = String(value || '').trim();
  if (CLIENT_HEALTH_META_BY_VALUE.has(normalized as ClientHealthValue)) return normalized as ClientHealthValue;
  return CLIENT_HEALTH_VALUE_BY_LABEL.get(normalized) || 'unknown';
}

export function getClientHealthMeta(value?: ClientHealthValue | string | null): ClientHealthMeta {
  return CLIENT_HEALTH_META_BY_VALUE.get(resolveClientHealthValue(value)) || CLIENT_HEALTH_META_BY_VALUE.get('unknown')!;
}

export function getClientHealthLabel(input: ClientHealthInput): string {
  return getClientHealthMeta(deriveClientHealthValue(input)).label;
}

export function getClientHealthTone(value?: ClientHealthValue | string | null): string {
  return getClientHealthMeta(value).badgeClassName;
}

export function getClientSourceMeta(value?: ClientSourceValue | string | null): ClientSourceMeta {
  const normalized = String(value || '').trim();
  return CLIENT_SOURCE_META_BY_VALUE.get(normalized as ClientSourceValue) || CLIENT_SOURCE_META_BY_VALUE.get('unknown')!;
}

export function getPortalStatusValue(portalReady?: boolean | null): PortalStatusValue {
  return portalReady ? 'enabled' : 'disabled';
}

export function getPortalStatusMeta(value?: PortalStatusValue | boolean | string | null): PortalStatusMeta {
  if (typeof value === 'boolean') return PORTAL_STATUS_META_BY_VALUE.get(getPortalStatusValue(value))!;
  const normalized = String(value || '').trim();
  return PORTAL_STATUS_META_BY_VALUE.get(normalized as PortalStatusValue) || PORTAL_STATUS_META_BY_VALUE.get('unknown')!;
}

export function getPortalStatusLabel(portalReady?: boolean | null): string {
  return getPortalStatusMeta(getPortalStatusValue(portalReady)).label;
}
