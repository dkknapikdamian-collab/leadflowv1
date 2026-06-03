# STAGE220A20 - Calendar status VST - 2026-06-03

## Cel

Podpiąć kalendarz, wydarzenia, zadania, statusy terminów i akcje kalendarza pod CloseFlow Visual Source of Truth.

## Zmienione pliki

- src/pages/Calendar.tsx
- src/styles/closeflow-visual-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a20-calendar-status-vst.cjs
- package.json

## Co podpięto

- Week plan entry card.
- Selected day entry row.
- Typ wpisu: event/task/lead.
- Status wpisu: done/overdue/cancelled/in_progress/planned.
- Akcje: Zrobione, Usuń.
- Semantyczne klasy: success, warning, danger.

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- logika kalendarza
- logika zapisu zadań i wydarzeń

## Testy

- node scripts/check-stage220a16-visual-source-truth.cjs
- node scripts/check-stage220a16b-visual-foundations.cjs
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-stage220a18-shared-modal-form-vst.cjs
- node scripts/check-stage220a19-cards-badges-metrics-vst.cjs
- node scripts/check-stage220a20-calendar-status-vst.cjs
- npm run build
