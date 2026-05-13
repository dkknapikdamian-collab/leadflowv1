# CloseFlow - CaseDetail rewrite buildWorkItems final - 2026-05-13

## Problem

Duże karty w historii sprawy pochodziły z buildWorkItems(), które doklejało activities jako noteItems do listy pracy operacyjnej.

## Naprawa

- Przepisano cały zakres buildWorkItems() do jednego kontraktu.
- buildWorkItems() przyjmuje tylko tasks, events, items.
- activities nie wchodzą do workItems.
- workItems useMemo nie zależy od activities.
- historia aktywności zostaje w kompaktowych case-history-row / case-detail-history-row.

## Weryfikacja

- node --check scripts/closeflow-release-check-quiet.cjs
- node scripts/check-case-detail-rewrite-build-workitems-final-2026-05-13.cjs
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
