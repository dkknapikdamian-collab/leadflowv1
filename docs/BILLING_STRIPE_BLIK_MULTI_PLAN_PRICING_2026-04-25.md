# Stripe BLIK multi-plan pricing

Data: 2026-04-25

## Decyzja

Od razu przechodzimy z jednej ceny STRIPE_PRICE_PLN na cennik wieloplanowy.

## Plany V1

- Basic: 19 PLN / 30 dni albo 190 PLN / rok
- Pro: 39 PLN / 30 dni albo 390 PLN / rok
- Business: 69 PLN / 30 dni albo 690 PLN / rok

## Model techniczny

BLIK w Stripe traktujemy jako platnosc jednorazowa.

- miesięczny okres = 30 dni dostepu
- roczny okres = 365 dni dostepu

Po webhooku Stripe aplikacja zapisuje:

- plan_id z metadata plan_id
- subscription_status = paid_active
- billing_provider = stripe_blik
- next_billing_at = teraz + access_days

## ENV w Vercel

Wymagane:

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL

Opcjonalne override cen:

STRIPE_PRICE_BASIC_MONTHLY_PLN=19
STRIPE_PRICE_BASIC_YEARLY_PLN=190
STRIPE_PRICE_PRO_MONTHLY_PLN=39
STRIPE_PRICE_PRO_YEARLY_PLN=390
STRIPE_PRICE_BUSINESS_MONTHLY_PLN=69
STRIPE_PRICE_BUSINESS_YEARLY_PLN=690

Jesli tych override nie wpiszesz, kod uzyje wartosci domyslnych powyzej.

## Kryterium zakonczenia

- Billing pokazuje 3 plany i przelacznik 30 dni / Rok
- klikniecie planu wysyla planKey i billingPeriod do checkoutu
- Stripe metadata niesie plan_id, billing_period i access_days
- webhook aktualizuje workspace wedlug wybranego planu
