# Stage86D - Access gate blocked status call

Data: 2026-05-05
Branch: dev-rollout-freeze

## Cel

DomknÄ…Ä‡ Stage86B po bĹ‚Ä™dzie testu, w ktĂłrym helper `isBlockedBillingAccessStatus(status)` istniaĹ‚, ale nie byĹ‚ realnie wywoĹ‚any w `isAllowedWriteStatus`.

## Zmiana

W `src/server/_access-gate.ts` dodano wywoĹ‚anie:

```ts
if (isBlockedBillingAccessStatus(status)) return false;
```

na poczÄ…tku `isAllowedWriteStatus`, przed reguĹ‚ami pozwalajÄ…cymi dla `paid_active`, trial, free i starych aliasĂłw planĂłw.

## Zakres blokady

Statusy blokowane przed aliasami kompatybilnoĹ›ci:

- `payment_failed`
- `trial_expired`
- `inactive`
- `canceled`

## Kryterium zakoĹ„czenia

MuszÄ… przejĹ›Ä‡:

- `node scripts/check-stage86d-access-gate-block-call.cjs`
- `node --test tests/stage86d-access-gate-block-call.test.cjs`
- `npm.cmd run test:stage86b-access-gate-billing-truth`
- `npm.cmd run check:p14-billing-production-validation`
- `npm.cmd run build`

## Status produktu

Kodowy access gate billing moĹĽna oznaczyÄ‡ jako domkniÄ™ty dopiero po przejĹ›ciu powyĹĽszych testĂłw.

Realne Stripe/Google E2E nadal wymaga ENV i testu w aplikacji:
checkout -> webhook -> paid_active -> refresh -> cancel/resume oraz Google OAuth -> event sync.