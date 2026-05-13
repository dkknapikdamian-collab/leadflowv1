# CloseFlow - CaseDetail history workrow leak fix - 2026-05-13

## Problem

Historia sprawy miala dwa style, bo czesc historycznych CaseActivity renderowala sie przez roboczy komponent WorkItemRow jako case-detail-work-row.

## Naprawa

- CaseActivity nie renderuje sie juz przez WorkItemRow.
- Historia pozostaje w kompaktowych rowach case-history-row / case-detail-history-row.
- Prawdziwe zadania, wydarzenia i braki nadal moga renderowac sie przez WorkItemRow.

## Weryfikacja

- node scripts/check-case-detail-history-workrow-leak-fix-2026-05-13.cjs
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
