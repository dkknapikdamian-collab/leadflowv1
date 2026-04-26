# Billing dry-run test order fix

Data: 2026-04-26

## Problem

Test dry-run sprawdzał kolejność wystąpienia tekstu `createStripeBlikCheckout`.

Ten tekst występuje też w imporcie na górze pliku, więc test porównywał blok dryRun z importem, a nie z prawdziwym wywołaniem checkoutu.

## Zmiana

- test szuka teraz konkretnego realnego wywołania:
  `const result: any = await createStripeBlikCheckout`
- dodano test regresyjny, żeby nie wrócić do błędnego sprawdzania po samym imporcie

## Kryterium zakończenia

- `npm.cmd run verify:closeflow:quiet` przechodzi
- `node scripts/scan-polish-mojibake.cjs` przechodzi
