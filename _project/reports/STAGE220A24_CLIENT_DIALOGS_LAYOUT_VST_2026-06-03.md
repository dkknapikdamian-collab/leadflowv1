# STAGE220A24 - Client dialogs and layout VST - 2026-06-03

## Cel

Naprawić problemy wskazane na screenach:
- systemowy komunikat przy przenoszeniu klienta do kosza,
- stary ciemny styl dialogów,
- niewidoczny tekst w szybkim szkicu/textarea,
- zielony motyw CTA w starych modalach,
- panel danych klienta zachodzący/układający się inaczej niż w leadzie.

## Zmienione pliki

- src/pages/Clients.tsx
- src/styles/visual-stage12-client-detail-vnext.css
- src/styles/closeflow-visual-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a24-client-dialogs-layout-vst.cjs
- package.json

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- schema danych

## Testy

- node scripts/check-stage220a24-client-dialogs-layout-vst.cjs
- npm run build
