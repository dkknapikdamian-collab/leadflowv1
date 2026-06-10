# STAGE231B0-R11 — Client width + Cases runtime guard

Status: LOCAL_ONLY_PREPARED

## Problem
- Po R9 push widok /cases rzucał runtime: ReferenceError: closedRecordStage231B0R8 is not defined.
- ClientDetail nadal był wizualnie węższy niż CaseDetail i nie trzymał położenia przy skalowaniu.

## Zakres
- src/pages/Cases.tsx
- src/styles/visual-stage12-client-detail-vnext.css
- scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs
- tests/stage231b0-r11-client-width-and-cases-runtime.test.cjs
- _project centralne pliki statusu/testów/ryzyk/historii

## Poza zakresem
- Finanse klienta/sprawy.
- SQL.
- Google Calendar.
- Płatności i prowizje.
- ContextActionDialogs duplicate savedRecord cleanup.

## Testy do wykonania
- node scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs
- node --test tests/stage231b0-r11-client-width-and-cases-runtime.test.cjs
- node scripts/check-stage231b0-r9-client-history-and-case-view-model.cjs
- node --test tests/stage231b0-r9-client-history-and-case-view-model.test.cjs
- node scripts/check-stage231b0-r8-case-archive-relation-truth.cjs
- node --test tests/stage231b0-r8-case-archive-relation-truth.test.cjs
- node scripts/check-stage231b0-case-close-archive-finance-truth.cjs
- node --test tests/stage231b0-case-close-archive-finance-truth.test.cjs
- npm run build
- git diff --check
