# Stage16J — Billing Stripe BLIK access marker repair

Cel: odblokować finalny release gate `billing-stripe-blik-foundation.test.cjs` bez psucia poprawnego polskiego copy w UI.

Zakres:
- dodaje ASCII marker `Oplacony okres dostepu minal` w `src/lib/access.ts`, wymagany przez legacy test,
- zostawia realne runtime copy z polskimi znakami: `Opłacony okres dostępu minął`,
- nie zmienia billingu, Stripe, planów, webhooków, danych ani backendu.

Bez commita i bez pusha.
