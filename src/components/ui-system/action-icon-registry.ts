import {
  Archive,
  ArrowLeft,
  Calendar,
  ClipboardList,
  Copy,
  ExternalLink,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings,
  StickyNote,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react';

export const CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C = 'CLOSEFLOW_ACTION_ICON_REGISTRY_VS2C';

export const ACTION_ICON_MAP = {
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  restore: RotateCcw,
  search: Search,
  save: Save,
  cancel: X,
  back: ArrowLeft,
  copy: Copy,
  open: ExternalLink,
  archive: Archive,
  filter: Filter,
  settings: Settings,
  refresh: RefreshCw,
  calendar: Calendar,
  note: StickyNote,
  task: ClipboardList,
} satisfies Record<string, LucideIcon>;

export type CloseflowActionIconName = keyof typeof ACTION_ICON_MAP;

export type CloseflowActionIconRegistryEntry = {
  action: CloseflowActionIconName;
  icon: LucideIcon;
  label: string;
  allowedUse: string;
};

export const ACTION_ICON_LABELS: Record<CloseflowActionIconName, string> = {
  add: 'Dodaj',
  edit: 'Edytuj',
  delete: 'UsuĹ„',
  restore: 'PrzywrĂłÄ‡',
  search: 'Szukaj',
  save: 'Zapisz',
  cancel: 'Anuluj',
  back: 'WrĂłÄ‡',
  copy: 'Kopiuj',
  open: 'OtwĂłrz',
  archive: 'Archiwizuj',
  filter: 'Filtruj',
  settings: 'Ustawienia',
  refresh: 'OdĹ›wieĹĽ',
  calendar: 'Kalendarz',
  note: 'Notatka',
  task: 'Zadanie',
};

export const ACTION_ICON_ALLOWED_USE: Record<CloseflowActionIconName, string> = {
  add: 'Tworzenie nowego rekordu, wpisu, notatki albo akcji.',
  edit: 'Edycja istniejÄ…cego rekordu lub sekcji formularza.',
  delete: 'Usuwanie albo przenoszenie do kosza, zawsze z zachowaniem istniejÄ…cych guardĂłw.',
  restore: 'PrzywrĂłcenie rekordu, zadania, wydarzenia albo szkicu.',
  search: 'Pole wyszukiwania, filtr tekstowy albo lupa w pustym stanie.',
  save: 'Zapis formularza, szkicu lub zmian ustawieĹ„.',
  cancel: 'Zamykanie, anulowanie albo czyszczenie stanu.',
  back: 'PowrĂłt do poprzedniego ekranu lub listy.',
  copy: 'Kopiowanie treĹ›ci, linku lub odpowiedzi.',
  open: 'PrzejĹ›cie do rekordu, linku, szczegĂłĹ‚u lub zewnÄ™trznego widoku.',
  archive: 'Archiwizacja szkicu, powiadomienia lub elementu historii.',
  filter: 'Filtry list i paneli operacyjnych.',
  settings: 'Konfiguracja, preferencje i ustawienia moduĹ‚u.',
  refresh: 'OdĹ›wieĹĽenie danych, ponowienie synchronizacji albo rÄ™czny re-check.',
  calendar: 'Akcja zwiÄ…zana z kalendarzem, terminem, datÄ… albo widokiem planowania.',
  note: 'Dodanie, otwarcie albo wyrĂłĹĽnienie notatki.',
  task: 'Akcja zwiÄ…zana z zadaniem, wykonaniem albo listÄ… taskĂłw.',
};

export const ACTION_ICON_REGISTRY = Object.fromEntries(
  (Object.keys(ACTION_ICON_MAP) as CloseflowActionIconName[]).map((action) => [
    action,
    {
      action,
      icon: ACTION_ICON_MAP[action],
      label: ACTION_ICON_LABELS[action],
      allowedUse: ACTION_ICON_ALLOWED_USE[action],
    },
  ]),
) as Record<CloseflowActionIconName, CloseflowActionIconRegistryEntry>;

/**
 * Backward-compatible aliases for code written during VS-2C-mini.
 * New code should use ACTION_ICON_MAP and ACTION_ICON_REGISTRY.
 */
export const closeflowActionIconRegistry = ACTION_ICON_REGISTRY;
export const closeflowFallbackActionIcon = MoreHorizontal;

export function getCloseflowActionIcon(action: CloseflowActionIconName): LucideIcon {
  return ACTION_ICON_MAP[action] || closeflowFallbackActionIcon;
}

export function getCloseflowActionIconLabel(action: CloseflowActionIconName): string {
  return ACTION_ICON_LABELS[action] || action;
}

export function getCloseflowActionIconAllowedUse(action: CloseflowActionIconName): string {
  return ACTION_ICON_ALLOWED_USE[action] || '';
}

/* CLOSEFLOW_ACTION_ICON_MAP_SINGLE_SOURCE_OF_TRUTH
   To change the delete/trash icon globally:
   1. change delete: Trash2 to another lucide icon in ACTION_ICON_MAP,
   2. keep the action key "delete",
   3. do not edit page-level imports.
*/