# STAGE220A18 - Shared modal and form VST wiring - 2026-06-03

## Cel

Podpiąć wspólne komponenty modal/form/button pod CloseFlow Visual Source of Truth.

## Zmienione pliki

- src/components/ui/dialog.tsx
- src/components/ui/input.tsx
- src/components/ui/textarea.tsx
- src/components/ui/button.tsx
- src/components/ui/select.tsx
- src/styles/closeflow-visual-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a18-shared-modal-form-vst.cjs
- package.json

## Co podpięto

- DialogContent / Overlay / Header / Footer / Title / Description.
- Input.
- Textarea.
- SelectTrigger / SelectContent.
- Button.

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- finanse
- logika formularzy
- walidacje biznesowe

## Testy

- node scripts/check-stage220a16-visual-source-truth.cjs
- node scripts/check-stage220a16b-visual-foundations.cjs
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-stage220a18-shared-modal-form-vst.cjs
- npm run build
