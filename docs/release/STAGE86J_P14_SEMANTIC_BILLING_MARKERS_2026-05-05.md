# Stage86J - P14 semantic billing markers

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Po konsolidacji Stage86H/I runtime i build przechodziĹ‚y, ale P14 nadal mĂłgĹ‚ faĹ‚szywie padaÄ‡ na dokĹ‚adnym tekĹ›cie z polskimi znakami.

To jest kruche, bo semantyka jest waĹĽniejsza niĹĽ literalny tekst z diakrytykami w guardzie.

## Zmiana

- dodano stabilny marker w checkout handlerze:
  - `BILLING_CHECKOUT_WEBHOOK_SOURCE_OF_TRUTH_STAGE86J`
- dodano stabilny marker w Billing UI:
  - `BILLING_UI_WEBHOOK_ACTIVATES_PAID_PLAN_STAGE86J`
- P14 sprawdza markery i semantykÄ™:
  - checkout informuje, ĹĽe dostÄ™p pĹ‚atny aktywuje webhook Stripe
  - Billing UI informuje, ĹĽe aktywny plan pojawia siÄ™ dopiero po webhooku
- nie dokĹ‚adamy ĹĽadnych nowych plikĂłw w `/api`

## Nie zmieniono

- Stripe runtime
- Google Calendar runtime
- access gate logic
- Supabase schema

## Kryterium zakoĹ„czenia

- Stage86H PASS
- Stage86I PASS, jeĹ›li pliki istniejÄ… lokalnie
- Stage86J PASS
- P14 PASS
- Stage86B/D PASS
- build PASS
- commit + push na `dev-rollout-freeze`

## NastÄ™pny test rÄ™czny

Po udanym deployu sprawdziÄ‡ `/billing` ponownie. Stary bĹ‚Ä…d Stripe `subscription_data in payment mode` powinien zniknÄ…Ä‡ po wdroĹĽeniu commitu z aktualnym `mode=subscription`.