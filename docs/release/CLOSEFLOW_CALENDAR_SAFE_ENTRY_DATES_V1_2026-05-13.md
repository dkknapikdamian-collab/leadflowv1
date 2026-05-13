# CLOSEFLOW_CALENDAR_SAFE_ENTRY_DATES_V1_2026-05-13

## Cel

Naprawić regresję po wejściu w kalendarz:

```txt
TypeError: Cannot read properties of undefined (reading 'split')
at parseISO(...)
```

## Przyczyna

`getEntriesForDay()` w `src/lib/scheduling.ts` wykonywał `parseISO(entry.startsAt)` bez sprawdzenia, czy `entry` oraz `entry.startsAt` istnieją.

Wystarczy jeden legacy/fallback wpis kalendarza bez `startsAt`, aby cały route `/calendar` poleciał przy renderze.

## Zmiany

- `src/lib/scheduling.ts`
  - dodano `getSafeScheduleEntryDate()`,
  - `getEntriesForDay()` ignoruje wpisy bez poprawnego `startsAt`,
  - `entries` jest sprawdzane jako tablica.

- `src/pages/Calendar.tsx`
  - sortowanie wpisów dnia używa `getCalendarEntrySortTime()`,
  - etykieta godziny ma guard dla pustego `startsAt`.

- `scripts/check-calendar-safe-entry-dates-v1.cjs`
  - sprawdza, czy nie wrócił niebezpieczny `parseISO(entry.startsAt)`.

## Kryterium zakończenia

- build przechodzi,
- `/calendar` nie crashuje na wpisie bez `startsAt`,
- panel „Wybrany dzień” dalej renderuje tekst i akcje z V2.
