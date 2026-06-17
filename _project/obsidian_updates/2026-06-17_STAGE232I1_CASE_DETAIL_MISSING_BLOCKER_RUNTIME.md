# STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

- data i godzina: 2026-06-17 22:45 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- status: PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK
- poprzedni etap: STAGE232I0 PASS_PUSHED / CLOSED
- nastepny etap: STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE albo STAGE232I2, jesli Damian potwierdzi, ze modal jest wizualnie OK.

## Wpis

Runtime CaseDetail Braki/Blokady zgodnie z I0, po masowej naprawie klasy bledow kotwic.

Zasada:
- nowe Braki/Blokady sprawy = task/work item missing_item z caseId,
- Blokada = blocksProgress=true albo status blocking_missing_item,
- historia = dziennik,
- case_items = legacy/checklist compatibility,
- bez SQL, bez ClientDetail runtime, bez Owner Control cross-entity.

## Testy / smoke

Wedlug potwierdzenia Damiana:
- guard STAGE232I1: PASS,
- test STAGE232I1: 5/5 PASS,
- CF-RUNTIME-00 source truth guard: PASS,
- npm run build: PASS,
- npm run verify:closeflow:quiet: PASS,
- manual smoke CaseDetail: PASS.

## Ryzyka po etapie

- stare case_items nadal moga istniec jako legacy/checklist compatibility,
- w razie duplikatu legacy vs task missing_item potrzebny bedzie dedupe hotfix,
- ClientDetail i Owner Control cross-entity nie byly ruszane w tym etapie.

## 2026-06-17 22:35 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: NEXT_OPTIONAL_VISUAL_FIX

Zakres:
- poprawa czytelnosci modala "Dodaj brak" na ciemnym shellu,
- tytul, labelki, checkbox helper i tekst pol wymuszone na czytelne kolory,
- bez zmian SQL i bez zmian runtime zapisu/odczytu Brakow/Blokad.
