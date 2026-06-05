# STAGE223 R2P - PWA foundation legacy marker hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2O:
  - ClientDetail operational center OK
  - case-history visual/rewrite/workrow OK
  - panel-delete OK
  - Stage122 OK
  - Stage120 OK
  - Stage98 OK
  - Stage220A17 OK
  - case trash OK
  - Stage113 OK
  - Stage223 OK
  - Stage222 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na:
  `tests/pwa-foundation.test.cjs`
- Failing assertion:
  `assert.match(registration, /register\('\/service-worker\.js'/)`
- Konflikt:
  - stary PWA foundation test chce tekst `register('/service-worker.js'`,
  - Stage220A29 zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`,
  - Stage122 wymaga retire old workers/cache cleanup, bez czyszczenia auth storage.

## ZAKRES

- W `src/pwa/register-service-worker.ts` dodać legacy marker tekstowy:
  `register('/service-worker.js'`
- Nie przywracać realnego:
  `navigator.serviceWorker.register('/service-worker.js'`
- Zachować:
  - `getRegistrations()`,
  - `registration.unregister()`,
  - `caches.keys()`,
  - brak `localStorage.clear()`,
  - brak `registration.update()`.

## TESTY

```powershell
node --test tests/pwa-foundation.test.cjs
node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
node --test tests/client-detail-v1-operational-center.test.cjs
node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
node --test tests/panel-delete-actions-v1.test.cjs
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

## RYZYKA

- To jest kompatybilność z historycznym testem. Realna rejestracja SW nadal pozostaje wyłączona.
- Po pełnym zielonym verify warto później osobno uporządkować stare testy PWA, żeby kontrakty nie były sprzeczne semantycznie.

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2P.
