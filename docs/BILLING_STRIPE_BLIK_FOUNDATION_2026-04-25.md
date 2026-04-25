# Billing Stripe BLIK foundation

Data: 2026-04-25

## Decyzja

Dla CloseFlow V1 wybieramy Stripe Checkout z karta i BLIK.

## Wazne

BLIK w Stripe jest platnoscia jednorazowa, nie automatyczna subskrypcja. Dlatego model V1 to:

- platnosc za 30 dni dostepu,
- po webhooku: paid_active,
- next_billing_at = +30 dni,
- po terminie access.ts blokuje aktywny dostep jako payment_failed.

## Co dodano

- api/_stripe.ts
- api/billing-checkout.ts
- api/stripe-webhook.ts
- Billing.tsx przekierowuje do Stripe Checkout,
- checkout wymusza payment_method_types card + blik,
- currency = pln,
- helper createBillingCheckoutSessionInSupabase,
- access.ts pilnuje wygasniecia paid_active po nextBillingAt,
- test tests/billing-stripe-blik-foundation.test.cjs.

## Co usunieto lokalnie, jesli bylo

- api/_p24.ts
- api/p24-webhook.ts
- tests/billing-przelewy24-foundation.test.cjs
- docs/BILLING_PRZELEWY24_FOUNDATION_2026-04-25.md
- docs/BILLING_PRZELEWY24_ENV_GUIDE_2026-04-25.md

## ENV na Vercel

Sandbox/test:

STRIPE_SECRET_KEY=<sekretny klucz testowy Stripe>
STRIPE_WEBHOOK_SECRET=<sekret webhooka Stripe>
STRIPE_PRICE_PLN=49
NEXT_PUBLIC_APP_URL=https://closeflowapp.vercel.app

## Stripe Dashboard

W Stripe trzeba wlaczyc BLIK jako metode platnosci oraz miec konto zdolne do obslugi platnosci w PLN.

## Webhook

Endpoint:

https://closeflowapp.vercel.app/api/stripe-webhook

Minimalne eventy:

- checkout.session.completed
- checkout.session.async_payment_succeeded
- checkout.session.async_payment_failed

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi,
- Billing nie ma recznego paid_active,
- klikniecie platnosci tworzy Stripe Checkout,
- po webhooku workspace dostaje paid_active na 30 dni.
