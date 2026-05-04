# STAGE57_CASE_CREATE_ACTION_HUB

# STAGE57 - Case create action hub - 2026-05-04

## Cel
W sprawie szybkie akcje mają pozwalać dodać zadanie, wydarzenie albo notatkę, a nie tylko notatkę.

## Zakres
- src/pages/CaseDetail.tsx
- src/styles/visual-stage13-case-detail-vnext.css
- scripts/check-stage57-case-create-action-hub.cjs
- tests/stage57-case-create-action-hub.test.cjs
- package.json

## Zmieniono
- Dodano panel dodawania do sprawy z trzema akcjami: Zadanie, Wydarzenie, Notatka.
- Każda akcja otwiera istniejące oryginalne okno dodawania.
- Zadania i wydarzenia są dalej tworzone z caseId, leadId i clientId z aktualnej sprawy.
- Wydarzenie nie wymaga daty na etapie otwierania/dodawania, jeżeli użytkownik chce ją uzupełnić później.
- Dodano verify:case-create-flow i rozszerzono verify:case-operational-ui.

## Weryfikacja
- npm.cmd run check:stage57-case-create-action-hub
- npm.cmd run verify:case-create-flow
- npm.cmd run verify:case-operational-ui
- npm.cmd run build
