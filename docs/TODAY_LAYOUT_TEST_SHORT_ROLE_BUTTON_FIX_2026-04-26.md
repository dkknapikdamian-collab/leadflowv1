# Today layout test short role button fix

Data: 2026-04-26

## Problem

Po poprawce klikalności "Szybko odłóż" test układu nadal oczekiwał starego dokładnego ciągu klas dla natywnych przycisków.

Nowa implementacja celowo używa elementów role="button", żeby nie psuć kliknięć wewnątrz klikalnej karty.

Dodatkowo stary test przy błędzie wypisywał cały Today.tsx.

## Zmiana

- test sprawdza wycinek komponentu TodayEntrySnoozeBar zamiast całego pliku
- test akceptuje nową implementację role="button"
- test nadal pilnuje, żeby tekst przycisków się nie łamał przez whitespace-nowrap
- komunikaty błędów są krótkie
- logika aplikacji nie została zmieniona

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
