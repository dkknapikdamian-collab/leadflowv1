# STAGE220A22 - Client/Case index and chevron consistency - 2026-06-03

## Cel

Poprawić zauważony rozjazd wizualny w realnym widoku po VST:
- numerki przy klientach i sprawach mają mieć ten sam kolor,
- klient ma dostać chevron otwarcia rekordu tak jak sprawa.

## Zmienione pliki

- src/pages/Clients.tsx
- src/pages/Cases.tsx
- src/styles/closeflow-record-list-source-truth.css
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a22-client-case-index-chevron.cjs
- package.json

## Co zmieniono

- W Clients zamieniono ikonę klienta przy koszu na ChevronRight.
- Dodano marker data-stage220a22-client-chevron.
- Cases importuje record-list source truth.
- Dodano wspólny styl index pill dla main-clients-html i main-cases-html.
- Dodano styl chevrona klienta na tokenach VST.

## Nie ruszano

- Supabase
- SQL
- RLS
- API
- routing
- logika list
- logika kasowania

## Testy

- node scripts/check-stage220a22-client-case-index-chevron.cjs
- npm run build
