# CLOSEFLOW_CALENDAR_SELECTED_DAY_NEW_TILE_V4_2026-05-13

## Cel

Usunąć brzydki, sklejony panel `Wybrany dzień` i zastąpić go jednym nowym kafelkiem dziennym.

## Zakres

- `src/pages/Calendar.tsx`
- `src/styles/closeflow-calendar-selected-day-new-tile-v4.css`
- `scripts/check-calendar-selected-day-new-tile-v4.cjs`
- `tools/repair-calendar-selected-day-new-tile-v4.cjs`
- `package.json`

## Zasada

Nie ruszamy siatki miesiąca V4. Mini wpisy miesiąca zostają osobne. Wybrany dzień ma własny kafelek i własny marker:

```txt
data-cf-calendar-selected-day-new-tile-v4="true"
```

## Wymagane zachowanie

W nowym kafelku wpisy mają renderować się przez `ScheduleEntryCard`, więc zostają akcje:

- Edytuj
- +1D
- +1W
- +1H
- Zrobione / Przywróć
- Usuń

## Guard

```bash
npm run check:calendar:selected-day-new-tile-v4
```
