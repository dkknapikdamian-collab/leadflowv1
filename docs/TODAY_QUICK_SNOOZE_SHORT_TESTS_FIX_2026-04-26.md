# Today quick snooze short tests fix

Data: 2026-04-26

## Problem

Po twardej poprawce klikalności "Szybko odłóż" stary test nadal szukał starej implementacji z natywnymi przyciskami button.

Przy błędzie test wypisywał prawie cały plik Today.tsx, więc log robił się bardzo długi.

## Zmiana

- test został dopasowany do nowej implementacji role="button"
- test sprawdza krótszy wycinek komponentu, a nie cały plik
- asercje używają krótkich komunikatów zamiast wypisywania całego źródła
- nie zmieniono logiki aplikacji

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
