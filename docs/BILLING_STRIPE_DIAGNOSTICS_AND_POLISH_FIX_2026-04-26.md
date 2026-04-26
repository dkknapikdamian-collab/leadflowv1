# Billing Stripe/BLIK diagnostics and Polish labels fix

Data: 2026-04-26

## Cel

Sprawdzić płatności bez robienia prawdziwej transakcji oraz poprawić UX strony Billing.

## Zmiany

- usunięto zdublowane normalizeAppUrl w src/server/_stripe.ts
- utrzymano automatyczne dodawanie https:// dla domeny aplikacji
- dodano dryRun do istniejącego api/billing-checkout.ts, bez dodawania nowej funkcji Vercel
- dryRun zwraca status STRIPE_SECRET_KEY i STRIPE_WEBHOOK_SECRET bez ujawniania sekretów
- dodano przycisk Sprawdź płatności w Billing
- poprawiono polskie znaki i widoczne teksty w Billing
- dodano testy regresyjne

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
- Billing pokazuje Test płatności Stripe/BLIK
- przycisk Sprawdź płatności nie przekierowuje do Stripe, tylko pokazuje status konfiguracji
