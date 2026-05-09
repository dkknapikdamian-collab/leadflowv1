import {
  Archive,
  ArrowLeft,
  Copy,
  ExternalLink,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react';

export const CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_MINI = 'CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C_MINI';

export type CloseflowActionIconName =
  | 'add'
  | 'edit'
  | 'delete'
  | 'restore'
  | 'search'
  | 'save'
  | 'cancel'
  | 'back'
  | 'copy'
  | 'open'
  | 'archive'
  | 'filter'
  | 'settings';

export type CloseflowActionIconRegistryEntry = {
  action: CloseflowActionIconName;
  icon: LucideIcon;
  label: string;
  allowedUse: string;
};

export const closeflowActionIconRegistry: Record<CloseflowActionIconName, CloseflowActionIconRegistryEntry> = {
  add: {
    action: 'add',
    icon: Plus,
    label: 'Dodaj',
    allowedUse: 'Tworzenie nowego rekordu, wpisu, notatki albo akcji.',
  },
  edit: {
    action: 'edit',
    icon: Pencil,
    label: 'Edytuj',
    allowedUse: 'Edycja istniejącego rekordu lub sekcji formularza.',
  },
  delete: {
    action: 'delete',
    icon: Trash2,
    label: 'Usuń',
    allowedUse: 'Usuwanie lub przenoszenie do kosza, zawsze z zachowaniem istniejących guardów.',
  },
  restore: {
    action: 'restore',
    icon: RotateCcw,
    label: 'Przywróć',
    allowedUse: 'Przywrócenie rekordu, zadania, wydarzenia albo szkicu.',
  },
  search: {
    action: 'search',
    icon: Search,
    label: 'Szukaj',
    allowedUse: 'Pole wyszukiwania, filtr tekstowy albo lupa w pustym stanie.',
  },
  save: {
    action: 'save',
    icon: Save,
    label: 'Zapisz',
    allowedUse: 'Zapis formularza, szkicu lub zmian ustawień.',
  },
  cancel: {
    action: 'cancel',
    icon: X,
    label: 'Anuluj',
    allowedUse: 'Zamykanie, anulowanie lub czyszczenie stanu.',
  },
  back: {
    action: 'back',
    icon: ArrowLeft,
    label: 'Wróć',
    allowedUse: 'Powrót do poprzedniego ekranu lub listy.',
  },
  copy: {
    action: 'copy',
    icon: Copy,
    label: 'Kopiuj',
    allowedUse: 'Kopiowanie treści, linku lub odpowiedzi.',
  },
  open: {
    action: 'open',
    icon: ExternalLink,
    label: 'Otwórz',
    allowedUse: 'Przejście do rekordu, linku, szczegółu lub zewnętrznego widoku.',
  },
  archive: {
    action: 'archive',
    icon: Archive,
    label: 'Archiwizuj',
    allowedUse: 'Archiwizacja szkicu, powiadomienia lub elementu historii.',
  },
  filter: {
    action: 'filter',
    icon: Filter,
    label: 'Filtruj',
    allowedUse: 'Filtry list i paneli operacyjnych.',
  },
  settings: {
    action: 'settings',
    icon: Settings,
    label: 'Ustawienia',
    allowedUse: 'Konfiguracja, preferencje i ustawienia modułu.',
  },
};

export const closeflowFallbackActionIcon = MoreHorizontal;

export function getCloseflowActionIcon(action: CloseflowActionIconName): LucideIcon {
  return closeflowActionIconRegistry[action]?.icon || closeflowFallbackActionIcon;
}

export function getCloseflowActionIconLabel(action: CloseflowActionIconName): string {
  return closeflowActionIconRegistry[action]?.label || action;
}
