# CLOSEFLOW_CALENDAR_SELECTED_DAY_AGENDA_ACTIONS_V2_2026-05-13

## Cel
Naprawic panel `Wybrany dzien` w kalendarzu miesiecznym tak, aby pod wybrana data byly widoczne pelne teksty zadan/wydarzen oraz akcje edycji, przesuniecia, oznaczenia i usuniecia.

## Zakres
- `src/pages/Calendar.tsx`
- `src/styles/closeflow-calendar-selected-day-agenda-actions-v2.css`
- `tools/repair-calendar-selected-day-agenda-v2.cjs`
- `scripts/check-calendar-selected-day-agenda-v2.cjs`
- `package.json`

## Co zmienia etap
1. Panel dnia dostaje osobny marker `data-cf-calendar-selected-day-agenda-v2="true"`.
2. Wpisy dnia sa liczone z `getEntriesForDay(..., selectedDate)`.
3. Panel renderuje pelny `ScheduleEntryCard`, nie mini-wiersze miesiaca.
4. Dostepne akcje w panelu: `Edytuj`, `+1H`, `+1D`, `+1W`, `Zrobione/Przywroc`, `Usun`.
5. CSS jest lokalny dla panelu dnia i nie uzywa szerokiego selektora miesiecznego.

## Czego nie zmienia etap
- Nie zmienia logiki miesiecznej siatki kalendarza.
- Nie zmienia modelu danych task/event.
- Nie rusza innych ekranow.
- Nie usuwa poprzednich plikow repair, zeby nie ryzykowac regresji bez pelnego audytu.

## Weryfikacja
- `node scripts/check-calendar-selected-day-agenda-v2.cjs`
- `npm.cmd run verify:closeflow:quiet`, jesli istnieje
- `npm.cmd run build`

## Test reczny
1. Dodaj zadanie na dzis z dluzszym tytulem.
2. Wejdz w kalendarz miesieczny.
3. Kliknij dzien.
4. Pod miesiacem musi byc widoczny pelny tytul i komplet akcji.
5. Kliknij `+1D`, sprawdz przeniesienie na jutro.
6. Kliknij `Edytuj`, popraw tytul lub date.
7. Kliknij `Usun`, odswiez strone i potwierdz, ze wpis nie wrocil.
