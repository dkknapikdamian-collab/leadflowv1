# Stage86B â€” access gate billing truth finalizer â€” 2026-05-05

## Cel

DomknÄ…Ä‡ guard P14 po Stage86: pĹ‚atny dostÄ™p ma byÄ‡ potwierdzany przez webhook Stripe, a statusy nieopĹ‚acone lub wygasĹ‚e majÄ… byÄ‡ jawnie zablokowane w access gate.

## Co zmieniono

- Dodano marker `BILLING_WEBHOOK_ONLY_PAID_ACCESS_STAGE14` w `src/server/_access-gate.ts`.
- Dodano jawny katalog statusĂłw blokujÄ…cych zapis:
  - `payment_failed`,
  - `trial_expired`,
  - `inactive`,
  - `canceled`.
- Dodano check Stage86B i test Node.

## Status wdroĹĽenia

- Kodowa gotowoĹ›Ä‡ billing/access: do potwierdzenia po przejĹ›ciu guardĂłw.
- Realny Stripe end-to-end: nadal wymaga testu w Stripe/Vercel, bo automatyczny test lokalny nie widzi sekretĂłw Vercel ani realnego webhooka.
- Realny Google Calendar OAuth/event sync: nadal wymaga testu w aplikacji po ustawieniu ENV.

## Kryterium odhaczenia jako â€žsprawdzone i wdroĹĽoneâ€ť

MoĹĽna oznaczyÄ‡ jako sprawdzone dopiero po dowodzie:

1. `npm.cmd run check:p14-billing-production-validation` przechodzi.
2. Stripe checkout test mode wraca do appki.
3. Webhook ustawia workspace na `paid_active`.
4. OdĹ›wieĹĽenie `/billing` pokazuje aktywny pĹ‚atny dostÄ™p.
5. Cancel i resume aktualizujÄ… Stripe oraz UI.
6. Google Calendar bez ENV pokazuje â€žwymaga konfiguracjiâ€ť.
7. Google Calendar z ENV przechodzi OAuth i synchronizuje testowe wydarzenie.
