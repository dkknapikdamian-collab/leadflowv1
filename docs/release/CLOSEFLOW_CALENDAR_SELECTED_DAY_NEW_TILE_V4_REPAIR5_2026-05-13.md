# CLOSEFLOW CALENDAR SELECTED DAY NEW TILE V4 REPAIR5

Data: 2026-05-13
Branch: dev-rollout-freeze

## Cel

Dokończyć niedokończone wdrożenie V4 po błędzie `git restore --staged` na brakującym pliku Repair4.

## Co naprawia

- Nie używa `git restore --staged` na ślepo dla nieistniejących ścieżek.
- Najpierw sprawdza staged files i unstaged tylko realnie staged targety.
- Przywraca kontrakty źródłowe wymagane przez `verify:closeflow:quiet`:
  - `/leads/${entry.raw.leadId}`
  - `/cases/${entry.raw.caseId}`
  - `Otwórz lead`
  - `Otwórz sprawę`
  - `isCompletedEntry ? 'Przywróć' : 'Zrobione'`
- Wymaga obecności nowego kafelka `data-cf-calendar-selected-day-new-tile-v4="true"`.
- Nie próbuje ponownie nakładać V4 od zera.

## Pliki runtime

- `src/pages/Calendar.tsx`
- `src/styles/closeflow-calendar-selected-day-new-tile-v4.css`

## Kryterium zakończenia

- `npm run verify:closeflow:quiet` przechodzi.
- `npm run build` przechodzi.
- Commit i push przechodzą.
