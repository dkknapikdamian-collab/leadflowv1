# Stage84H - Lead Detail guard clean

## Cel

Domknąć Stage84 po clean sweepie: UI było już poprawione, ale guardy i testy Stage84 przechowywały literalne przykłady uszkodzonego kodowania jako deny-listę.

## Zakres

- scripts/check-stage84-lead-detail-work-center.cjs
- tests/stage84-lead-detail-work-center.test.cjs
- scripts/check-stage84h-lead-detail-guard-clean.cjs
- tests/stage84h-lead-detail-guard-clean.test.cjs
- package.json

## Zasada

Nie trzymamy uszkodzonych polskich tekstów literalnie w repo, nawet w testach. Guardy budują wzorce z kodów znaków, żeby same nie stały się źródłem problemu.

## Sprawdzenie

- npm.cmd run check:stage84-lead-detail-work-center
- npm.cmd run check:stage84g-lead-detail-polish-clean-sweep
- npm.cmd run check:stage84h-lead-detail-guard-clean
- npm.cmd run check:polish-mojibake
- npm.cmd run build

## Kryterium zakończenia

Lead Detail ma czyste polskie etykiety, a guardy nie zawierają literalnych uszkodzonych napisów.
