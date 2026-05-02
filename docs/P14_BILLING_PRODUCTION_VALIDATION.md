# P14 — Billing production validation

## Cel

Billing ma realnie sterować dostępem. Checkout nie może udawać aktywnego planu. Status płatny pochodzi z webhooka Stripe.

## Co zmieniono

- Ujednolicono płatne plany Stripe z modelem produktu:
  - Basic,
  - Pro,
  - AI.
- Stary klucz `business` zostaje tylko jako alias kompatybilności do `ai`.
- Stripe checkout dla AI używa:
  - `planKey = ai`,
  - `planId = closeflow_ai`,
  - `planId yearly = closeflow_ai_yearly`.
- Poprawiono copy:
  - `Uzupelnij` -> `Uzupełnij`.
- UI Billing nie komunikuje już, że checkout success oznacza aktywny plan.
- UI informuje, że aktywny plan pojawia się dopiero po webhooku Stripe.
- Dodano marker w webhooku:
  - `BILLING_WEBHOOK_PAID_ACCESS_SOURCE_OF_TRUTH_STAGE14`.
- Dodano marker w access gate:
  - `BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14`.
- Dodano guard:
  - `check:p14-billing-production-validation`.

## Ręczny test Stripe: dryRun checkout

Z aktywną sesją użytkownika wywołaj checkout dry run:

```json
{
  "workspaceId": "AKTUALNY_WORKSPACE_ID",
  "planKey": "basic",
  "billingPeriod": "monthly",
  "dryRun": true
}
```

Oczekiwane:

- `ok = true`,
- `dryRun = true`,
- `planKey = basic/pro/ai`,
- `planId = closeflow_basic/closeflow_pro/closeflow_ai`,
- `checkoutConfigured` pokazuje, czy jest `STRIPE_SECRET_KEY`,
- `webhookConfigured` pokazuje, czy jest `STRIPE_WEBHOOK_SECRET`.

## Ręczny test Stripe: pełny flow

1. W Vercel ustaw:
   - `STRIPE_SECRET_KEY`,
   - `STRIPE_WEBHOOK_SECRET`,
   - `APP_URL`.
2. W Stripe dodaj webhook endpoint:
   - `https://TWOJA_DOMENA/api/billing?route=webhook`.
3. Zdarzenia do obsługi:
   - `checkout.session.completed`,
   - `checkout.session.async_payment_succeeded`,
   - `customer.subscription.created`,
   - `customer.subscription.updated`,
   - `customer.subscription.deleted`,
   - `invoice.payment_failed`,
   - `checkout.session.async_payment_failed`.
4. Wybierz plan Basic/Pro/AI w UI.
5. Po powrocie z checkout nie oczekuj natychmiastowego `paid_active`, dopóki webhook nie przejdzie.
6. Sprawdź workspace:
   - `plan_id`,
   - `subscription_status = paid_active`,
   - `provider_subscription_id`,
   - `next_billing_at`.
7. Wyślij ten sam webhook drugi raz przez Stripe CLI/Event retry.
8. Oczekiwane:
   - duplicate event nie zmienia stanu drugi raz,
   - endpoint zwraca `duplicate: true`.

## Ważne o BLIK

Checkout jest ustawiony jako `mode=subscription` i zawiera `card` oraz `blik`. Stripe musi runtime potwierdzić, czy BLIK jest dostępny dla tego typu subskrypcji na Twoim koncie. Jeśli Stripe odrzuci BLIK dla subscription, produkcyjny fallback to karta/subskrypcja, a BLIK można zostawić dla płatności jednorazowych/przedłużeń.
