# Stripe BLIK Vercel API TypeScript fix

Data: 2026-04-25

## Problem

Vercel build przeszedl frontend Vite, ale pozniej TypeScript dla API route pokazal bledy w api/billing-checkout.ts.

TypeScript widzial createStripeBlikCheckout jako union, w ktorym jeden wariant ok:true zawieral tylko konfiguracje Stripe, a nie pelny wynik checkoutu. Przez to Vercel blokowal deployment na polach:

- result.url
- result.sessionId
- result.amount
- result.planId
- result.accessDays

## Poprawka

W api/billing-checkout.ts wynik createStripeBlikCheckout jest jawnie traktowany jako any w endpointzie API.

To jest mala poprawka typowania na granicy API route. Nie zmienia logiki checkoutu, cen ani webhooka.

## Test

Dodano:

tests/billing-checkout-vercel-api-type-guard.test.cjs

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi
- Vercel deploy nie zatrzymuje sie na api/billing-checkout.ts
