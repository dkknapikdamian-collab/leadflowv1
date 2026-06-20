# STAGE232I4_R16R_MISSING_MANAGER_PRODUCTION_FIT_NO_HORIZONTAL_SCROLL

Date/time: 2026-06-20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel
Naprawić produkcyjny wygląd wspólnego managera Braki / Blokady po R16Q:
- usunąć poziomy scroll,
- usunąć górny formularz dodawania z managera,
- usunąć filler "Kartoteka klienta",
- usunąć etykietę "Nazwa braku" z kart,
- zagęścić wiersze tak, żeby każdy brak był widoczny w jednym rzędzie.

## Zakres
Tylko:
- src/components/detail/MissingItemsManagerDialog.tsx
- guard R16R
- test R16R
- run report
- Obsidian payload

## Nie ruszać
- ClientDetail logika
- SQL
- Owner Control
- finanse
- kalendarz
- billing/trial
- CaseDetail runtime

## Testy
Wykonać:
- node scripts/check-stage232i4-r16r-missing-manager-production-fit-no-horizontal-scroll.cjs
- node --test tests/stage232i4-r16r-missing-manager-production-fit-no-horizontal-scroll.test.cjs
- npm run build
- git diff --check

## Smoke
Otworzyć ClientDetail -> Braki / Blokady:
- brak poziomego scrolla,
- brak górnego formularza dodawania,
- brak tekstu Kartoteka klienta,
- brak etykiety Nazwa braku w kartach,
- pozycje zwarte, akcje widoczne od razu.
