# Stage228R13 - Missing item list and resolved status

- date: 2026-06-08 20:45 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- mode: LOCAL_ONLY_UNTIL_C5

## Cel

Domknac Stage227C4 z planu: lista brakow ma pokazywac status i pozwalac oznaczac brak jako rozwiazany bez SQL.

## Zmiany

- LeadDetail:
  - Braki i blokady filtruje tylko otwarte braki.
  - Dodano akcje Rozwiąż brak.
  - Akcja ustawia task status done i activity missing_item_resolved.
- ClientDetail:
  - Braki i blokady filtruje tylko otwarte braki.
  - Dodano akcje Rozwiąż.
  - Akcja ustawia task status done i activity missing_item_resolved.
- CaseDetail:
  - Bez zmian runtime; guard potwierdza istniejacy status case_items: accepted/rejected i filtr accepted poza aktywnymi brakami.
- Guard:
  - scripts/check-stage228r13-missing-item-status-resolve.cjs
  - package.json check:stage228r13-missing-item-status-resolve
  - prebuild includes R13 guard.

## Testy automatyczne

- node scripts/check-stage228r13-missing-item-status-resolve.cjs
- npm run build
- git diff --check

## Test reczny

1. LeadDetail -> dodaj Brak -> widoczny w Braki i blokady -> klik Rozwiąż brak -> odswiez -> znika z otwartych brakow.
2. ClientDetail -> dodaj Brak -> widoczny w Braki i blokady -> klik Rozwiąż -> odswiez -> znika z otwartych brakow.
3. CaseDetail -> dodaj Brak -> oznacz jako zaakceptowany/rozwiazany w istniejacych kontrolkach -> odswiez -> nie widac w aktywnych brakach.
4. Regresja: Notatka/Zadanie/Wydarzenie/Brak przez ContextActionDialogs nadal otwieraja modale.

## Audyt ryzyk po etapie

- No SQL/RLS/finance change.
- Lead/client use task status done to close missing item.
- Case uses case_items accepted as resolved state.
- Future shared missing_items table remains a separate migration stage if reporting/filtering needs grow.
- Local-only: do not push until C5 batch.
