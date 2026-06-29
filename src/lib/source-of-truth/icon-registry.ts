import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  Undo2,
  X,
  type LucideIcon,
} from 'lucide-react';

export type AppIconMeta = {
  icon: LucideIcon;
  label: string;
  semanticGroup: 'action' | 'status' | 'navigation' | 'record' | 'system';
};

export const APP_ICONS = {
  add: {
    icon: Plus,
    label: 'Dodaj',
    semanticGroup: 'action',
  },
  alert: {
    icon: AlertTriangle,
    label: 'Alert',
    semanticGroup: 'status',
  },
  calendar: {
    icon: Calendar,
    label: 'Kalendarz',
    semanticGroup: 'record',
  },
  check: {
    icon: CheckCircle2,
    label: 'Gotowe',
    semanticGroup: 'status',
  },
  chevronRight: {
    icon: ChevronRight,
    label: 'Przejdź dalej',
    semanticGroup: 'navigation',
  },
  clock: {
    icon: Clock,
    label: 'Termin',
    semanticGroup: 'status',
  },
  copy: {
    icon: Copy,
    label: 'Kopiuj',
    semanticGroup: 'action',
  },
  externalLink: {
    icon: ExternalLink,
    label: 'Otwórz link',
    semanticGroup: 'navigation',
  },
  fileText: {
    icon: FileText,
    label: 'Dokument',
    semanticGroup: 'record',
  },
  loading: {
    icon: Loader2,
    label: 'Ładowanie',
    semanticGroup: 'system',
  },
  mail: {
    icon: Mail,
    label: 'E-mail',
    semanticGroup: 'record',
  },
  phone: {
    icon: Phone,
    label: 'Telefon',
    semanticGroup: 'record',
  },
  restore: {
    icon: Undo2,
    label: 'Przywróć',
    semanticGroup: 'action',
  },
  search: {
    icon: Search,
    label: 'Szukaj',
    semanticGroup: 'action',
  },
  trash: {
    icon: Trash2,
    label: 'Usuń',
    semanticGroup: 'action',
  },
  close: {
    icon: X,
    label: 'Zamknij',
    semanticGroup: 'action',
  },
} as const satisfies Record<string, AppIconMeta>;

export type IconName = keyof typeof APP_ICONS;

export function getIcon(name: IconName): LucideIcon {
  return APP_ICONS[name].icon;
}

export function getIconLabel(name: IconName): string {
  return APP_ICONS[name].label;
}

export function getIconMeta(name: IconName): AppIconMeta {
  return APP_ICONS[name];
}
