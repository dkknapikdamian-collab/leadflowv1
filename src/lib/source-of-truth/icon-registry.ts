import { Activity, Users, Wallet } from 'lucide-react';
import { ACTION_ICON_MAP } from '../../components/ui-system/action-icon-registry';
import { semanticIconConfig } from '../../ui-system/icons/SemanticIcon';
import type { CloseflowAppLucideIcon } from '../../components/ui-system/icon-registry';

export type AppIconMeta = {
  icon: CloseflowAppLucideIcon;
  label: string;
  semanticGroup: 'action' | 'status' | 'navigation' | 'record' | 'system';
};

export const APP_ICONS = {
  add: {
    icon: ACTION_ICON_MAP.add,
    label: 'Dodaj',
    semanticGroup: 'action',
  },
  activity: {
    icon: Activity,
    label: 'Aktywność',
    semanticGroup: 'system',
  },
  alert: {
    icon: semanticIconConfig.risk_alert.defaultIcon,
    label: 'Alert',
    semanticGroup: 'status',
  },
  calendar: {
    icon: ACTION_ICON_MAP.calendar,
    label: 'Kalendarz',
    semanticGroup: 'record',
  },
  check: {
    icon: semanticIconConfig.task_status.defaultIcon,
    label: 'Gotowe',
    semanticGroup: 'status',
  },
  chevronRight: {
    icon: semanticIconConfig.navigation.defaultIcon,
    label: 'Przejdź dalej',
    semanticGroup: 'navigation',
  },
  clock: {
    icon: semanticIconConfig.time.defaultIcon,
    label: 'Termin',
    semanticGroup: 'status',
  },
  copy: {
    icon: ACTION_ICON_MAP.copy,
    label: 'Kopiuj',
    semanticGroup: 'action',
  },
  externalLink: {
    icon: ACTION_ICON_MAP.open,
    label: 'Otwórz link',
    semanticGroup: 'navigation',
  },
  fileText: {
    icon: semanticIconConfig.note.defaultIcon,
    label: 'Dokument',
    semanticGroup: 'record',
  },
  loading: {
    icon: semanticIconConfig.loading.defaultIcon,
    label: 'Ładowanie',
    semanticGroup: 'system',
  },
  mail: {
    icon: semanticIconConfig.email.defaultIcon,
    label: 'E-mail',
    semanticGroup: 'record',
  },
  phone: {
    icon: semanticIconConfig.phone.defaultIcon,
    label: 'Telefon',
    semanticGroup: 'record',
  },
  restore: {
    icon: ACTION_ICON_MAP.restore,
    label: 'Przywróć',
    semanticGroup: 'action',
  },
  search: {
    icon: ACTION_ICON_MAP.search,
    label: 'Szukaj',
    semanticGroup: 'action',
  },
  trash: {
    icon: ACTION_ICON_MAP.delete,
    label: 'Usuń',
    semanticGroup: 'action',
  },
  users: {
    icon: Users,
    label: 'Leady',
    semanticGroup: 'record',
  },
  wallet: {
    icon: Wallet,
    label: 'Wartość',
    semanticGroup: 'record',
  },
  close: {
    icon: ACTION_ICON_MAP.cancel,
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
