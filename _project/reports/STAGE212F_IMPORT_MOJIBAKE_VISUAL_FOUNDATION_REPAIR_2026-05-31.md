# STAGE212F_IMPORT_MOJIBAKE_VISUAL_FOUNDATION_REPAIR_2026-05-31

## Cel
Naprawa po Stage212B-E: import order w src/index.css, mojibake w sidebarze i runtime source truth dla canvasu.

## Fakty
- Stage212B/212C/212D/212E częściowo zmieniały pliki, ale guard zatrzymywał build na import order lub mojibake.
- Canvas źródłowy: #f1f5f9.
- Surface/card: #ffffff.
- Soft surface: #f8fafc.

## Zmienione pliki
- src/index.css
- src/components/Layout.tsx
- src/components/VisualFoundationRuntimeStage212B.tsx
- src/styles/closeflow-visual-foundation-stage212b.css

## Testy
- node scripts/check-stage212f-import-mojibake-visual-foundation-repair.cjs
- npm run build

## Nie ruszano
- Supabase
- RLS
- routing danych
- formularze
- deployment
- push
