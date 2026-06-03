# STAGE220A21 - Record lists and right rails VST - 2026-06-03

## Cel

Podpiąć listy rekordów i panele boczne pod CloseFlow Visual Source of Truth bez ruszania logiki danych.

## Zmienione pliki

- src/styles/closeflow-visual-source-truth.css
- src/styles/closeflow-record-list-source-truth.css
- src/styles/closeflow-right-rail-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a21-record-lists-rails-vst.cjs
- package.json

## Co podpięto

- record list card,
- record row,
- record index,
- record title,
- record meta,
- list pigułki/statusy,
- list destructive actions,
- template record cards,
- right rail cards,
- right rail list rows,
- right rail title/meta,
- right rail success/warn pills,
- right rail empty states.

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- logika list
- logika paneli bocznych

## Testy

- node scripts/check-stage220a16-visual-source-truth.cjs
- node scripts/check-stage220a16b-visual-foundations.cjs
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-stage220a18-shared-modal-form-vst.cjs
- node scripts/check-stage220a19-cards-badges-metrics-vst.cjs
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/check-stage220a21-record-lists-rails-vst.cjs
- npm run build
