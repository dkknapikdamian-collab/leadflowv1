# Billing foundation test Polish label fix

Data: 2026-04-26

## Problem

Po poprawieniu polskich znaków w Billing stary test nadal oczekiwał tekstu bez polskich znaków:

`Przejdz do platnosci`

A aplikacja poprawnie pokazuje:

`Przejdź do płatności`

## Zmiana

- zaktualizowano test foundation dla Stripe/BLIK
- dodano mały test regresyjny pilnujący, żeby test nie wrócił do starej wersji bez polskich znaków

## Kryterium zakończenia

- `npm.cmd run verify:closeflow:quiet` przechodzi
- `node scripts/scan-polish-mojibake.cjs` przechodzi
