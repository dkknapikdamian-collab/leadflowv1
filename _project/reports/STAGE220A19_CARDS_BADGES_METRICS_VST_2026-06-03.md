# STAGE220A19 - Cards badges metrics VST - 2026-06-03

## Cel

Podpiąć wspólne kafelki, badge/chipy/statusy i metryki pod CloseFlow Visual Source of Truth.

## Zmienione pliki

- src/components/ui/card.tsx
- src/components/ui/badge.tsx
- src/styles/closeflow-visual-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a19-cards-badges-metrics-vst.cjs
- package.json

## Co podpięto

- Card.
- CardHeader.
- CardContent.
- CardFooter.
- CardTitle.
- CardDescription.
- Badge.
- Klasy metryk: cf-vst-metric-card, cf-vst-metric-label, cf-vst-metric-number.
- Klasy chipów/badge: cf-vst-badge, cf-vst-chip.

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- finanse
- logika formularzy
- logika kart i list

## Testy

- node scripts/check-stage220a16-visual-source-truth.cjs
- node scripts/check-stage220a16b-visual-foundations.cjs
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-stage220a18-shared-modal-form-vst.cjs
- node scripts/check-stage220a19-cards-badges-metrics-vst.cjs
- npm run build
