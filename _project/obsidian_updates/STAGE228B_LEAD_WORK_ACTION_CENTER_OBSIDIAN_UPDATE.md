# STAGE228B — Lead Work Action Center

- data i godzina: 2026-06-06 18:00 Europe/Warsaw
- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: etap wdrożeniowy local-only

## Decyzja

Lead nie dostaje pełnego lejka. Lead dostaje centrum pracy: „Co robimy teraz?” z zadaniami, wydarzeniami, brakami/blokadami i akcjami kontynuacji historii.

## Zakres

- `LeadDetail.tsx` — środkowa sekcja `Co robimy teraz? / Działania leada`.
- Akcje na wierszach: Edytuj, Jutro, Zrobione, Usuń.
- Szybkie akcje: Dodaj notatkę, Dodaj zadanie, Dodaj wydarzenie, Dodaj brak, Oznacz utracony.
- Guard: `scripts/check-stage228b-lead-work-action-center.cjs`.
- Test: `tests/stage228b-lead-work-action-center.test.cjs`.

## Ryzyka

- Nie tworzyć równoległego systemu pracy nad leadem.
- Używać istniejących handlerów LeadDetail: edycja, reschedule, toggle done, delete.
- Nie mieszać pełnego lejka z kartoteką leada.
