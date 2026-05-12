# CLOSEFLOW CALENDAR SELECTED DAY FULL TEXT REPAIR12 — 2026-05-12

## Cel

Naprawić czerwone bramki po Repair11 i utwardzić sekcję `Wybrany dzień` bez ruszania zaakceptowanego widoku kalendarza miesięcznego V4.

## Co zmienia Repair12

- aktywny import CSS przechodzi z Repair11 na Repair12,
- `ScheduleEntryCard` dostaje dodatkowy marker `data-cf-calendar-entry-card-repair12="true"`,
- tooltip normalizer omija pełne karty wpisów,
- structural normalizer omija pełne karty wpisów,
- CSS jest scopingowany tylko do `[data-cf-calendar-selected-day="true"]`,
- check i audit kończą proces kodem błędu, jeśli wykryją `[FAIL]`.

## Czego Repair12 nie zmienia

- nie zmienia pliku `src/styles/closeflow-calendar-month-plain-text-rows-v4.css`,
- nie zmienia zaakceptowanego wyglądu siatki miesiąca,
- nie przywraca warstw V5/V6 ani starych Repair2-5,
- nie robi runtime rewrite kafelków miesiąca.

## Weryfikacja

- `node tools/audit-closeflow-calendar-selected-day-full-text-repair12.cjs`,
- `npm.cmd run check:closeflow:calendar-selected-day-full-text-repair12`,
- `git diff -- src/styles/closeflow-calendar-month-plain-text-rows-v4.css --exit-code`,
- `npm.cmd run build`.

## Ręczny test

Wejść w `/calendar`, przełączyć na miesiąc, kliknąć dzień z wpisami i sprawdzić sekcję `Wybrany dzień`.

Oczekiwane:

- pełna etykieta typu: `Zadanie`, `Wydarzenie`, `Lead`,
- obok widoczny tytuł wpisu,
- brak samych skrótów `Zad` / `Wy`,
- miesiąc wizualnie bez zmian względem zaakceptowanego V4.
