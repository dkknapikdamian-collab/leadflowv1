# CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_RUNTIME_V3_2026-05-13

## Cel
Naprawić runtime crash kalendarza:

```txt
TypeError: Cannot read properties of undefined (reading 'split')
```

Źródło błędu: `date-fns/parseISO()` dostawał `undefined` dla `entry.startsAt` w ścieżce kalendarza.

## Zakres

- `src/lib/scheduling.ts`
  - `getEntriesForDay()` używa bezpiecznego parsera `getSafeScheduleEntryDate()`.
  - Wpisy bez poprawnego `startsAt` są ignorowane zamiast wywracać route.

- `src/pages/Calendar.tsx`
  - sortowanie wpisów nie woła bezpośrednio `parseISO(a.startsAt)`.
  - etykieta godziny nie woła `parseISO(entry.startsAt)` bez walidacji.

- `scripts/check-calendar-safe-entry-dates-runtime-v3.cjs`
  - pilnuje, żeby unsafe patterny nie wróciły.

## Dlaczego
Po wdrożeniu agendy wybranego dnia panel zaczął renderować pełne wpisy. W danych istnieją rekordy legacy/fallback bez poprawnego `startsAt`. Taki rekord nie powinien wywalać całej strony.
