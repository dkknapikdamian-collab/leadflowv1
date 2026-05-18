# Stage117 - Leads right rail layout contract

## Status
LOCAL ZIP/PUSH PACKAGE PREPARED.

## Scan-first confirmation
- Repo: CloseFlow / leadflowv1.
- Branch expected: dev-rollout-freeze.
- Read files before patch: src/pages/Leads.tsx, src/styles/closeflow-leads-right-rail-layout-lock.css, src/styles/closeflow-right-rail-source-truth.css, package.json.
- Active source of truth for this stage: /leads layout-list + right rail CSS lock.

## FAKTY Z FEEDBACKU
- Filtry proste mają być wyżej, na równi z wyszukiwarką.
- Najcenniejsze leady mają być pod filtrami, bez nakładania.
- Layout ma być stabilny przy zoom 80%, 90%, 100%.
- Mobile ma zachować kolejność bez ścisku.

## FAKTY Z KODU
- Leads.tsx renders search inside left stack and right rail as layout-list sibling.
- Existing CSS had Stage71/Stage96 rules with 1221px breakpoint and top/padding overrides.
- SimpleFiltersCard is already before TopValueRecordsCard in JSX, but layout needed a stronger explicit grid contract.

## ZMIANY
- Added Stage117 markers to /leads layout, search, suggestions, list and right rail.
- Added CSS grid areas: search/suggestions/list on the left and rail spanning from the search row on desktop.
- Locked SimpleFiltersCard order 0 and TopValueRecordsCard order 1.
- Mobile stacks search, suggestions, rail, list.
- Added guard and package script.

## TESTY AUTOMATYCZNE
- npm run check:stage117-leads-right-rail-layout-contract
- npm run build

## TEST RĘCZNY DO WYKONANIA
1. Open /leads at desktop 100% zoom.
2. Confirm right rail starts at search height.
3. Confirm Filtry proste is first.
4. Confirm Najcenniejsze leady is directly below filters without overlap.
5. Repeat at 90% and 80% zoom.
6. Check mobile width: order should be search, suggestions if present, filters/top-value rail, list, without squeeze.

## OBSIDIAN
Prepared note: 2026-05-18 - CloseFlow Stage117 Leads right rail layout contract.md

## BRAKI I RYZYKA
- This is a CSS/layout contract. It does not rewrite operator rail component internals.
- If screenshots show individual card content too tall, that should be a separate micro-stage for card density.

## NEXT
Manual QA and screenshots before migrating similar layout rules elsewhere.
