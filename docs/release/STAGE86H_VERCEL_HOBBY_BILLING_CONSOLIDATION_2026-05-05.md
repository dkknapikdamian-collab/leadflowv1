# Stage86H - Vercel Hobby billing consolidation

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Deploy na Vercel Hobby padĹ‚ przez limit:

`No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan.`

Dodatkowo uĹĽytkownik zobaczyĹ‚ bĹ‚Ä…d Stripe:

`You can not pass subscription_data in payment mode.`

Ten bĹ‚Ä…d Stripe pochodziĹ‚ z nieaktualnego deploymentu, bo nowy deploy po Stage86G nie przeszedĹ‚. W aktualnym kodzie Stripe checkout uĹĽywa `subscription` mode.

## Decyzja

Nie przechodzimy na Vercel Pro tylko po to, ĹĽeby utrzymaÄ‡ nadmiarowe entrypointy.

Nie usuwamy funkcjonalnoĹ›ci billingowej. Usuwamy tylko nadmiarowe pliki-entrypointy z `/api`, bo kaĹĽdy z nich jest liczony przez Vercel jako osobna serverless function.

## Zmiana

- `api/billing-checkout.ts` obsĹ‚uguje:
  - checkout
  - billing actions: cancel/resume
- `api/stripe-webhook.ts` zostaje jedynym raw webhook entrypointem Stripe
- `vercel.json` mapuje:
  - `/api/billing-actions` -> `/api/billing-checkout?route=actions`
  - `/api/billing-webhook` -> `/api/stripe-webhook?route=webhook`
  - `/api/billing` -> `/api/billing-checkout?route=checkout`
- usuniÄ™to nadmiarowe funkcje:
  - `api/billing.ts`
  - `api/billing-actions.ts`
  - `api/billing-webhook.ts`

## Nie zmieniono

- runtime Stripe handlerĂłw
- Google Calendar
- access gate
- Billing UI
- Supabase schema

## Kryterium zakoĹ„czenia

- Stage86H guard PASS
- Stage86H test PASS
- P14 billing validation PASS
- build PASS
- top-level `/api` function count <= 12

## RÄ™czny test po deployu

1. Vercel deploy przechodzi na Hobby.
2. `/billing` otwiera Stripe checkout.
3. Stripe checkout nie zwraca bĹ‚Ä™du `subscription_data in payment mode`.
4. Webhook `/api/billing-webhook` zwraca 200.
5. Workspace przechodzi na `paid_active`.
6. Cancel/resume dziaĹ‚a przez `/api/billing-actions`.