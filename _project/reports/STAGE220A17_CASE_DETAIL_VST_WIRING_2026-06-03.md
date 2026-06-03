# STAGE220A17 - CaseDetail VST wiring - 2026-06-03

## Cel

Pierwsze realne przepięcie konkretnych elementów UI na CloseFlow Visual Source of Truth.

## Zakres

Zmieniono:
- src/pages/CaseDetail.tsx
- src/components/confirm-dialog.tsx
- src/styles/closeflow-visual-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a17-case-detail-vst-wiring.cjs
- package.json

## Co podpięto

- Usuń sprawę: cf-vst-button + cf-vst-button-delete + data-cf-vst-kind="delete".
- ConfirmDialog: cf-vst-dialog.
- Historia sprawy: data-cf-vst-kind na typie wpisu.
- Zadanie wykonane: blokada technicznego "done" jako treści.

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- finansów
- logiki kasowania

## Testy

- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- npm run build
