# Layout brand label CloseFlow fix

Data: 2026-04-26

## Cel

Zmiana napisu w lewym górnym rogu aplikacji z "Close Flow" na "CloseFlow".

## Zakres

- src/components/Layout.tsx
- test regresji brandu
- release gate

## Decyzja UX

Nie usuwamy całego napisu, tylko poprawiamy nazwę na krótszą i spójniejszą. To jest bezpieczniejszy wariant, bo użytkownik nadal widzi, w jakiej aplikacji jest.

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
