# CloseFlow - CaseDetail no activity notes in workItems - 2026-05-13

## Problem

Historia sprawy dalej wygladala jak dwa systemy, bo buildWorkItems() doklejal activities jako noteItems i renderowal je przez WorkItemRow / case-detail-work-row.

## Decyzja

CaseActivity nalezy do historii, nie do operacyjnych workItems.

## Naprawa

- buildWorkItems przyjmuje tylko tasks, events, items.
- usunieto noteItems tworzone z activities.
- workItems useMemo nie zalezy juz od activities.
- historia nadal renderuje activities przez case-history-row / case-detail-history-row.
- dodano test do quiet release gate.

## Weryfikacja

- node scripts/check-case-detail-no-activity-notes-workitems-2026-05-13.cjs
- node --test tests/case-detail-no-activity-notes-workitems-2026-05-13.test.cjs
- node --check scripts/closeflow-release-check-quiet.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
