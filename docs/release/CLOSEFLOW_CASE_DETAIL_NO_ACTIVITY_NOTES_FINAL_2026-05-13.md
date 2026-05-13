# CloseFlow - CaseDetail no activity notes final - 2026-05-13

## Problem

Poprzednie podejście usuwało objaw w WorkItemRow, ale źródło przecieku było w buildWorkItems().
Ta funkcja doklejała activities jako noteItems do listy pracy operacyjnej.

## Naprawa

- buildWorkItems() nie przyjmuje activities.
- Usunięto noteItems z activities.
- workItems useMemo nie zależy od activities.
- Activity rows zostają wyłącznie w historii: case-history-row / case-detail-history-row.
- Dodano test do quiet release gate.

## Weryfikacja

- node --check scripts/closeflow-release-check-quiet.cjs
- node scripts/check-case-detail-no-activity-notes-final-2026-05-13.cjs
- node --test tests/case-detail-no-activity-notes-final-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
