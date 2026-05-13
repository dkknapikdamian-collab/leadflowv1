# CloseFlow - P1A no global focus refresh - 2026-05-13

## Zgloszenie

Admin feedback wskazal, ze strony maja tendencje do odswiezania sie po zmianie zakladki przegladarki i wracaja do wczesniejszego ekranu.

## Decyzja

Usuwamy globalny interval/focus/visibility profile refresh z App.tsx. Zostaje tylko initial profile sync po starcie aplikacji lub zmianie sesji.

## Powod

Globalny refresh na focus/visibility jest zbyt agresywny dla widokow szczegolow i utrudnia prace operatora.

## Zmienione pliki

- src/App.tsx
- scripts/check-p1a-no-global-focus-refresh-2026-05-13.cjs
- tests/p1a-no-global-focus-refresh-2026-05-13.test.cjs
- scripts/closeflow-release-check-quiet.cjs
- package.json

## Weryfikacja

- npm.cmd run check:p1a-no-global-focus-refresh
- npm.cmd run test:p1a-no-global-focus-refresh
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet