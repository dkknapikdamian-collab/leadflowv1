# STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE

# STAGE56 - Case quick actions + dictation dedupe - 2026-05-04

## Cel
Naprawić kontrast szybkich akcji w sprawie i ograniczyć dublowanie słów przy dyktowaniu notatek na telefonie.

## Zakres
- src/pages/ClientDetail.tsx
- src/pages/CaseDetail.tsx
- src/styles/visual-stage13-case-detail-vnext.css
- scripts/check-stage56-case-quick-actions-dictation-dedupe.cjs
- tests/stage56-case-quick-actions-dictation-dedupe.test.cjs
- package.json

## Zmieniono
- Dodano deduplikację transkrypcji dla notatek klienta.
- Podbito kontrast szybkich akcji w sprawie.
- Podbito kontrast akcji w wierszach pracy i checklisty.
- Dodano verify:case-operational-ui.

## Weryfikacja
- npm.cmd run check:stage56-case-quick-actions-dictation-dedupe
- npm.cmd run verify:case-operational-ui
- npm.cmd run verify:client-detail-operational-ui
- npm.cmd run build
