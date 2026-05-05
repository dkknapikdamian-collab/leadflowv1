# Stage86I - P14 guard after Vercel Hobby billing consolidation

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Stage86H poprawnie skonsolidowaĹ‚ billing pod Vercel Hobby, ale stary guard P14 nadal czytaĹ‚ `api/billing.ts`.

Po Stage86H ten plik celowo nie istnieje, bo kaĹĽdy plik w `/api` jest liczony przez Vercel jako osobna Serverless Function.

## Zmiana

- P14 waliduje teraz:
  - `api/billing-checkout.ts` jako checkout + actions entrypoint
  - `api/stripe-webhook.ts` jako raw Stripe webhook entrypoint
  - rewrites w `vercel.json`
  - brak nadmiarowych `api/billing*.ts`
  - limit top-level `/api` <= 12
- aplikator uĹĽywa `git add -A` zamiast sztywnego `git add -u api/billing.ts ...`

## Nie zmieniono

- Stripe runtime
- Google Calendar runtime
- Billing UI
- access gate

## Kryterium zakoĹ„czenia

- Stage86H guard PASS
- Stage86I guard PASS
- P14 PASS
- Stage86B/D PASS
- build PASS
- push na `dev-rollout-freeze`

## Po deployu

Dopiero po udanym deployu testujemy ponownie Stripe checkout. BĹ‚Ä…d `subscription_data in payment mode` powinien zniknÄ…Ä‡, bo aktualny kod uĹĽywa `mode=subscription`.