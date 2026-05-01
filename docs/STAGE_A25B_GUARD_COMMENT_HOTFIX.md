# A25b - guard/comment hotfix

## Cel

Naprawić przerwany check A25 po częściowym wdrożeniu A25.

## Problem

Guard `check:a25-nearest-planned-action` blokował wdrożenie, bo w `src/lib/lead-next-action.ts` znajdował tekst `nextActionTitle` w komentarzu.

Kod już delegował do `getNearestPlannedAction(...)`, ale guard był tekstowy i nie odróżniał komentarza od logiki.

## Zmiana

- nadpisano `src/lib/lead-next-action.ts`,
- usunięto z komentarza legacy nazwę pola,
- zachowano delegowanie do `getNearestPlannedAction(...)`.

## Nie zmieniono

- Nie zmieniono UI.
- Nie zmieniono API.
- Nie zmieniono tasków/eventów.
- Nie przywrócono pola tekstowego jako rdzenia logiki.
