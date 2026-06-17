# STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

- data i godzina: 2026-06-17 21:15 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- status: DO_APPLY_ZIP_R7
- poprzedni etap: STAGE232I0 PASS_PUSHED / CLOSED

## Wpis

Runtime CaseDetail Braki/Blokady zgodnie z I0, po masowej naprawie klasy błędów kotwic.

Zasada:
- nowe Braki/Blokady sprawy = task/work item missing_item z caseId,
- Blokada = blocksProgress=true albo status blocking_missing_item,
- historia = dziennik,
- case_items = legacy/checklist compatibility,
- bez SQL, bez ClientDetail runtime, bez Owner Control cross-entity.

## 2026-06-17 22:35 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: DO_APPLY_ZIP / VISUAL_FIX

Zakres:
- poprawa czytelności modala "Dodaj brak" na ciemnym shellu,
- tytuł, labelki, checkbox helper i tekst pól wymuszone na czytelne kolory,
- bez zmian SQL i bez zmian runtime zapisu/odczytu Braków/Blokad.
