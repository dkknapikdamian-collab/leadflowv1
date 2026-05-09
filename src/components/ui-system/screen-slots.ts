/**
 * CLOSEFLOW_SCREEN_PLACEMENT_SLOTS_VS7_2026_05_09
 *
 * Jedno źródło prawdy dla logicznego położenia akcji i paneli na ekranach.
 * Ten plik nie narzuca wyglądu. Blokuje nazewnictwo slotów, żeby Lead / Client / Case
 * mogły być przepinane w te same miejsca bez zgadywania w każdym widoku osobno.
 */

export const CLOSEFLOW_SCREEN_PLACEMENT_SLOTS_STAGE = 'VS-7_SCREEN_PLACEMENT_SLOTS_2026-05-09' as const;

export const CLOSEFLOW_SCREEN_PLACEMENT_SLOTS = [
  'page.primaryActions',
  'page.secondaryActions',
  'detail.headerActions',
  'detail.quickActions',
  'detail.dangerZone',
  'detail.financePanel',
  'detail.notesPanel',
  'detail.tasksPanel',
  'detail.eventsPanel',
  'list.filters',
  'list.search',
  'list.rows',
] as const;

export type CloseflowScreenPlacementSlot = (typeof CLOSEFLOW_SCREEN_PLACEMENT_SLOTS)[number];

export type CloseflowScreenPlacementZone = 'page' | 'detail' | 'list';

export type CloseflowCoreEntityPlacementTarget = 'lead' | 'client' | 'case';

export const CLOSEFLOW_SCREEN_PLACEMENT_SLOT_GROUPS: Record<CloseflowScreenPlacementZone, CloseflowScreenPlacementSlot[]> = {
  page: ['page.primaryActions', 'page.secondaryActions'],
  detail: [
    'detail.headerActions',
    'detail.quickActions',
    'detail.dangerZone',
    'detail.financePanel',
    'detail.notesPanel',
    'detail.tasksPanel',
    'detail.eventsPanel',
  ],
  list: ['list.filters', 'list.search', 'list.rows'],
};

export const CLOSEFLOW_SCREEN_PLACEMENT_SLOT_LABELS: Record<CloseflowScreenPlacementSlot, string> = {
  'page.primaryActions': 'Główne akcje strony',
  'page.secondaryActions': 'Drugorzędne akcje strony',
  'detail.headerActions': 'Akcje w nagłówku szczegółów',
  'detail.quickActions': 'Szybkie akcje rekordu',
  'detail.dangerZone': 'Strefa ryzykownych akcji',
  'detail.financePanel': 'Panel finansowy',
  'detail.notesPanel': 'Panel notatek',
  'detail.tasksPanel': 'Panel zadań',
  'detail.eventsPanel': 'Panel wydarzeń',
  'list.filters': 'Filtry listy',
  'list.search': 'Wyszukiwarka listy',
  'list.rows': 'Wiersze listy',
};

export const CLOSEFLOW_CORE_ENTITY_PLACEMENT_CONTRACT: Record<
  CloseflowCoreEntityPlacementTarget,
  readonly CloseflowScreenPlacementSlot[]
> = {
  lead: CLOSEFLOW_SCREEN_PLACEMENT_SLOTS,
  client: CLOSEFLOW_SCREEN_PLACEMENT_SLOTS,
  case: CLOSEFLOW_SCREEN_PLACEMENT_SLOTS,
} as const;

const CLOSEFLOW_SCREEN_PLACEMENT_SLOT_SET = new Set<string>(CLOSEFLOW_SCREEN_PLACEMENT_SLOTS);

export function isCloseflowScreenPlacementSlot(value: string): value is CloseflowScreenPlacementSlot {
  return CLOSEFLOW_SCREEN_PLACEMENT_SLOT_SET.has(value);
}

export function getCloseflowScreenPlacementZone(slot: CloseflowScreenPlacementSlot): CloseflowScreenPlacementZone {
  return slot.split('.')[0] as CloseflowScreenPlacementZone;
}

export function getCloseflowCoreEntityPlacementSlots(
  entity: CloseflowCoreEntityPlacementTarget,
): readonly CloseflowScreenPlacementSlot[] {
  return CLOSEFLOW_CORE_ENTITY_PLACEMENT_CONTRACT[entity];
}
