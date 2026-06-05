# STAGE223 R2J - Stage122 PWA marker release gate hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2I:
  - Stage120 OK
  - Stage98 OK
  - Stage220A17 OK
  - case trash actions OK
  - Stage113 OK
  - Stage223 OK
  - Stage222 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na:
  `tests/stage122-runtime-auth-api-pwa-hardening.test.cjs`.
- Failing assertion:
  `register-service-worker must carry Stage122 marker`.
- `src/pwa/register-service-worker.ts` ma poprawną logikę:
  - `getRegistrations()`,
  - `registration.unregister()`,
  - `caches.keys()`,
  - brak `localStorage.clear()`,
  - brak runtime re-register.
- `public/service-worker.js` ma już marker Stage122.
- Brakował tylko marker kontraktu w `register-service-worker.ts`.

## ZAKRES

- Dodać do `src/pwa/register-service-worker.ts`:
  `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING`
- Nie zmieniać logiki PWA.
- Nie dotykać auth storage.
- Nie rejestrować service workera w runtime.
- Nie ruszać Activity Truth, Today, Supabase, Google sync.

## TESTY

```powershell
node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
node scripts/check-stage220a17-case-detail-vst-wiring.cjs
node scripts/check-closeflow-case-trash-actions.cjs
node --test tests/stage113-closeflow-logo-source-contract.test.cjs
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-risk-runtime-contract.test.cjs
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2J.
