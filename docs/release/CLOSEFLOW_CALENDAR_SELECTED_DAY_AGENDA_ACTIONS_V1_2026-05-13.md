# CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V1_2026-05-13

## Cel

Naprawa panelu „Wybrany dzień” w kalendarzu miesięcznym.

Problem zgłoszony przez użytkownika:

- po kliknięciu dnia w kalendarzu pod spodem pojawiały się puste / białe paski,
- tekst zadań i wydarzeń nie był czytelny,
- brakowało praktycznej obsługi wpisu w tym miejscu: edycji, przesunięcia i usunięcia.

## Decyzja techniczna

Nie dokładamy kolejnego globalnego CSS-plastra do miesiąca.

Panel „Wybrany dzień” ma być osobną agendą dnia i ma renderować pełne karty `ScheduleEntryCard`, a nie mini-wiersze miesięczne.

Miesiąc nadal może mieć krótkie, ucięte wpisy. Panel pod miesiącem musi mieć pełny tekst i akcje.

## Zakres zmiany

- `src/pages/Calendar.tsx`
  - import nowego CSS,
  - wyliczenie `selectedDayAgendaEntries` przez `getEntriesForDay(..., selectedDate)`,
  - render panelu dnia przez `ScheduleEntryCard`,
  - akcje: edycja, przesunięcie, wykonanie/przywrócenie i usunięcie.

- `src/styles/closeflow-calendar-selected-day-agenda-actions-v1.css`
  - lokalne style tylko dla `[data-cf-calendar-selected-day-agenda-v1="true"]`,
  - bez szerokiego selektora miesiąca,
  - bez mieszania z `.cf-calendar-month-text-row` i `.cf-month-entry-chip-structural`.

- `scripts/check-calendar-selected-day-agenda-v1.cjs`
  - guard struktury panelu dnia,
  - guard akcji,
  - guard izolacji CSS.

- `package.json`
  - dodany skrypt `check:calendar:selected-day-agenda-v1`.

## Czego nie zmieniono

- Nie zmieniono logiki siatki miesiąca.
- Nie zmieniono modelu danych tasków/eventów.
- Nie zmieniono routingu.
- Nie zmieniono globalnego systemu kalendarza.

## Test ręczny

1. Dodać zadanie z długim tytułem na dzisiejszy dzień.
2. Wejść w kalendarz miesięczny.
3. Kliknąć dzisiejszy dzień.
4. W panelu „Wybrany dzień” musi być widoczny pełny tytuł.
5. Sprawdzić przyciski: `Edytuj`, `+1H`, `+1D`, `+1W`, `Zrobione`, `Usuń`.
6. Przesunąć wpis o dzień.
7. Odświeżyć aplikację i sprawdzić, czy wpis jest na nowym dniu.
8. Usunąć wpis i sprawdzić, czy nie wraca po reloadzie.
