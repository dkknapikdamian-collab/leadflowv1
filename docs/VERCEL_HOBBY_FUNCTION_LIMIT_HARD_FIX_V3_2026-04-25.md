# CloseFlow — Vercel Hobby serverless function limit hard fix v3

## Problem

Vercel Hobby blokował deployment, bo katalog `api/` przekraczał limit funkcji serverless. Dodatkowo test Stripe BLIK nadal oczekiwał helpera `api/_stripe.ts`, mimo że helper powinien być poza katalogiem `api/`.

## Poprawka

- helpery `api/_*.ts` są przenoszone do `src/server/`,
- `api/service-profiles.ts` jest przenoszony do `src/server/service-profiles.ts`,
- endpoint `/api/service-profiles` działa przez rewrite do `/api/system?kind=service-profiles`,
- test Stripe BLIK czyta helper z `src/server/_stripe.ts`,
- dodany jest test limitu Vercel Hobby.

## Kryterium

W katalogu `api/` zostaje maksymalnie 12 plików `.ts` i żaden helper zaczynający się od `_`.
