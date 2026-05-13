# CLOSEFLOW_CALENDAR_SELECTED_DAY_NEW_TILE_V9_MASSFIX_2026-05-13

Cel: masowo uporządkować nieudane próby V4/repair i zastąpić stary panel „Wybrany dzień” nowym, izolowanym kafelkiem agendy dnia.

Zakres:
- czyści częściowe pliki i skrypty V4/repair3/repair5/repair7/repair8,
- usuwa import starego selected-day agenda V2,
- dodaje nowy scope `data-cf-calendar-selected-day-new-tile-v9="true"`,
- wycina legacy DOM `data-cf-calendar-selected-day="true"` z Calendar.tsx,
- zostawia pełne akcje wpisu: Edytuj, +1H, +1D, +1W, Zrobione/Przywróć, Usuń,
- zachowuje kontrakty relacji: Otwórz lead / Otwórz sprawę,
- izoluje CSS od miesięcznej siatki kalendarza,
- ukrywa ewentualny legacy panel CSS-em tylko jako bezpiecznik.

Nie zmienia:
- logiki miesięcznej siatki kalendarza,
- źródeł danych zadań/wydarzeń,
- handlerów update/delete/shift,
- innych zakładek.

Testy:
- `node scripts/check-calendar-selected-day-new-tile-v9-massfix.cjs`
- `npm run verify:closeflow:quiet`
- `npm run build`
