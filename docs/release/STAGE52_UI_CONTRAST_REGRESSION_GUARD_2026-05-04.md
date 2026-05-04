# STAGE52 — UI contrast regression guard — 2026-05-04

Marker: STAGE52_UI_CONTRAST_REGRESSION_GUARD

## Cel
Dodać jedną krótką bramkę regresji dla kontrastu po poprawkach Stage49, Stage50 i Stage51.

## Dlaczego
Po kilku punktowych poprawkach kontrastu ryzykiem nie jest już pojedynczy biały tekst na białym tle, tylko przypadkowe cofnięcie poprawek przez kolejną paczkę CSS.

## Zakres
- package.json
- scripts/check-stage52-ui-contrast-regression-guard.cjs
- tests/stage52-ui-contrast-regression-guard.test.cjs
- docs/release/STAGE52_UI_CONTRAST_REGRESSION_GUARD_2026-05-04.md

## Zmieniono
- Dodano check:stage52-ui-contrast-regression-guard.
- Dodano test:stage52-ui-contrast-regression-guard.
- Dodano verify:ui-contrast jako zbiorczą bramkę dla Stage49/50/51/52.
- Guard v2 sprawdza konkretne istniejące selektory, a nie kruchy układ jednego bloku CSS.

## Nie zmieniono
- UI runtime.
- API.
- Supabase.
- Dane użytkownika.
- Routing.

## Weryfikacja
- npm.cmd run check:stage52-ui-contrast-regression-guard
- npm.cmd run verify:ui-contrast
- npm.cmd run build
