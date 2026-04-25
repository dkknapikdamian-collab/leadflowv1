# Vercel Hobby function limit test paths fix v4

Data: 2026-04-25

## Problem

Po przeniesieniu helpera Stripe z api/_stripe.ts do src/server/_stripe.ts deployment miesci sie w limicie Vercel Hobby, ale test multi-plan pricing nadal czytal stara sciezke api/_stripe.ts.

## Poprawka

Zaktualizowano testy billing Stripe/BLIK, zeby czytaly:

src/server/_stripe.ts

zamiast:

api/_stripe.ts

## Kryterium zakonczenia

npm.cmd run verify:closeflow:quiet przechodzi.
