# Stage86M - Billing / Stripe / Google Calendar regression suite

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Cel

Ten etap dodaje parasol regresji dla caĹ‚ej serii Stage86, ĹĽeby nie wrĂłciĹ‚y bĹ‚Ä™dy, ktĂłre pojawiĹ‚y siÄ™ przy wdraĹĽaniu Billing / Stripe / Google Calendar.

## Chronione klasy bĹ‚Ä™dĂłw

1. `package.json` z UTF-8 BOM.
2. Brak skryptĂłw w `package.json`.
3. BĹ‚Ä…d skĹ‚adni w custom guardach.
4. Przekroczenie limitu Vercel Hobby: max 12 top-level plikĂłw `/api`.
5. PrzywrĂłcenie nadmiarowych funkcji:
   - `api/billing.ts`
   - `api/billing-actions.ts`
   - `api/billing-webhook.ts`
6. Zepsute rewrites:
   - `/api/billing-actions`
   - `/api/billing-webhook`
   - `/api/billing`
7. Stripe checkout w trybie `payment` zamiast `subscription`.
8. Brak BLIK / recurring interval / subscription metadata.
9. Checkout aktywujÄ…cy dostÄ™p bez webhooka.
10. Webhook bez idempotencji albo bez obsĹ‚ugi payment failed.
11. `WORKSPACE_ID_REQUIRED` przez uĹĽycie samego `authContext.workspaceId`.
12. Brak bezpiecznego `resolveRequestWorkspaceId(req, body)`.
13. Brak blokady `payment_failed`, `trial_expired`, `inactive`, `canceled`.
14. Google Calendar bez status/connect/callback/disconnect/sync-inbound/sync-outbound.
15. Google Calendar brak ENV jako config state, nie bĹ‚Ä…d uĹĽytkownika.
16. Brak OAuth state verification i token encryption contract.

## Nowe skrypty

- `check:stage86m-billing-google-regression-suite`
- `test:stage86m-billing-google-regression-suite`
- `verify:stage86-billing-google-hardening`

## Co to NIE zastÄ™puje

To nie zastÄ™puje rÄ™cznego E2E:
- Stripe checkout -> webhook -> paid_active -> refresh -> cancel/resume
- Google OAuth -> status connected -> event sync

Te rzeczy wymagajÄ… prawdziwego deploymentu, ENV i paneli Stripe/Google.

## Kryterium zakoĹ„czenia

- Stage86M check PASS
- Stage86M test PASS
- Stage86K PASS
- P14 PASS
- Stage86B/D PASS
- build PASS
- commit + push