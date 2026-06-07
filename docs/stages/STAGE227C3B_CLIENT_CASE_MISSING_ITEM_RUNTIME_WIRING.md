# STAGE227C3B — Client + Case Missing Item Runtime Wiring

## Cel
Domknąć brakującą część Stage227C po C3A: klient i sprawa mają mieć spójny wariant szybkiej akcji `Brak`.

## Zakres
- ClientDetail:
  - szybka akcja `Brak`,
  - shared modal `MissingItemQuickActionModal`,
  - zapis lekki jako `task` z `type/status = missing_item`,
  - activity `missing_item_created`,
  - lista `Braki i blokady` oparta o formalny typ/status, nie tylko heurystykę tekstu.
- CaseDetail:
  - bez nowego modelu,
  - potwierdzony istniejący flow `CaseQuickActions -> AddCaseMissingItemDialog -> case_items`.

## Bez SQL
Etap nie dodaje tabel, migracji ani RLS. Case używa istniejącego `case_items`, client używa lekkiego task/activity.

## Testy
- `npm run check:stage227c3b-client-case-missing-item-runtime-wiring`
- `npm run test:stage227c3b-client-case-missing-item-runtime-wiring`
- C3A/C2/F6 regression, jeśli istnieją
- `npm run build`
- `git diff --check`

## Manual
- ClientDetail: klik `Brak`, dodaj `Brak decyzji`, odśwież, sprawdź listę.
- CaseDetail: klik `Brak`, dodaj brak, sprawdź listę elementów sprawy / checklistę.
