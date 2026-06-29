import { APP_ICON_LUCIDE_MAP, type CloseflowAppLucideIcon } from '../../components/ui-system/icon-registry';

export type AppIconMeta = {
  icon: CloseflowAppLucideIcon;
  label: string;
  semanticGroup: 'action' | 'status' | 'navigation' | 'record' | 'system';
};

export const APP_ICONS = {
  add: {
    icon: APP_ICON_LUCIDE_MAP.add,
    label: 'Dodaj',
    semanticGroup: 'action',
  },
  alert: {
    icon: APP_ICON_LUCIDE_MAP.alert,
    label: 'Alert',
    semanticGroup: 'status',
  },
  calendar: {
    icon: APP_ICON_LUCIDE_MAP.calendar,
    label: 'Kalendarz',
    semanticGroup: 'record',
  },
  check: {
    icon: APP_ICON_LUCIDE_MAP.check,
    label: 'Gotowe',
    semanticGroup: 'status',
  },
  chevronRight: {
    icon: APP_ICON_LUCIDE_MAP.chevronRight,
    label: 'Przejdź dalej',
    semanticGroup: 'navigation',
  },
  clock: {
    icon: APP_ICON_LUCIDE_MAP.clock,
    label: 'Termin',
    semanticGroup: 'status',
  },
  copy: {
    icon: APP_ICON_LUCIDE_MAP.copy,
    label: 'Kopiuj',
    semanticGroup: 'action',
  },
  externalLink: {
    icon: APP_ICON_LUCIDE_MAP.externalLink,
    label: 'Otwórz link',
    semanticGroup: 'navigation',
  },
  fileText: {
    icon: APP_ICON_LUCIDE_MAP.fileText,
    label: 'Dokument',
    semanticGroup: 'record',
  },
  loading: {
    icon: APP_ICON_LUCIDE_MAP.loading,
    label: 'Ładowanie',
    semanticGroup: 'system',
  },
  mail: {
    icon: APP_ICON_LUCIDE_MAP.mail,
    label: 'E-mail',
    semanticGroup: 'record',
  },
  phone: {
    icon: APP_ICON_LUCIDE_MAP.phone,
    label: 'Telefon',
    semanticGroup: 'record',
  },
  restore: {
    icon: APP_ICON_LUCIDE_MAP.restore,
    label: 'Przywróć',
    semanticGroup: 'action',
  },
  search: {
    icon: APP_ICON_LUCIDE_MAP.search,
    label: 'Szukaj',
    semanticGroup: 'action',
  },
  trash: {
    icon: APP_ICON_LUCIDE_MAP.trash,
    label: 'Usuń',
    semanticGroup: 'action',
  },
  close: {
    icon: APP_ICON_LUCIDE_MAP.close,
    label: 'Zamknij',
    semanticGroup: 'action',
  },
} as const satisfies Record<string, AppIconMeta>;

export type IconName = keyof typeof APP_ICONS;

export function getIcon(name: IconName): CloseflowAppLucideIcon {
  return APP_ICONS[name].icon;
}

export function getIconLabel(name: IconName): string {
  return APP_ICONS[name].label;
}

export function getIconMeta(name: IconName): AppIconMeta {
  return APP_ICONS[name];
}
