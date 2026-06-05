# STAGE223 R2U - Request identity support + activities consolidation hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2T:
  - `vercel-hobby-function-budget.test.cjs` OK
  - daily digest cron/diagnostics/runtime OK
  - PWA OK
  - Stage220A29 OK
  - Stage122 OK
  - ClientDetail OK
  - case-history gates OK
  - panel-delete OK
  - Stage120 OK
  - Stage98 OK
  - Stage113 OK
  - Stage223 OK
  - Stage222 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał się na:
  `tests/request-identity-vercel-api-signature.test.cjs`
- Błąd:
  `ENOENT api/support.ts`
- Przyczyna:
  - R2T usunął `api/support.ts`, żeby zejść z 13 do 12 funkcji.
  - Stary gate czyta `api/support.ts` literalnie.
- Konflikt:
  - `request-identity-vercel-api-signature` wymaga `api/support.ts`,
  - `vercel-hobby-function-budget` wymaga maksymalnie 12 plików `api/*.ts`.

## ZAKRES

- Przywrócić `api/support.ts` jako compatibility shim z `getRequestIdentity(req, body)`.
- Przenieść `api/activities.ts` do `src/server/activities-handler.ts`.
- Usunąć `api/activities.ts`.
- Dopiąć w `api/system.ts`:
  - import `activitiesHandler`,
  - route `kind === 'activities'`.
- Dopiąć w `vercel.json`:
  - `/api/activities -> /api/system?kind=activities`.
- Zachować:
  - `/api/support -> /api/system?kind=support`,
  - `src/server/support-handler.ts`,
  - `api/daily-digest.ts`,
  - wszystkie daily digest kontrakty.

## TESTY

```powershell
node --test tests/request-identity-vercel-api-signature.test.cjs
node --test tests/vercel-hobby-function-budget.test.cjs
node --test tests/daily-digest-cron-auth.test.cjs
node --test tests/daily-digest-diagnostics.test.cjs
node --test tests/daily-digest-email-runtime.test.cjs
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

- `/api/activities` będzie obsłużone przez rewrite do `/api/system?kind=activities`; trzeba po deployu ręcznie sprawdzić aktywności/notatki na leadach, klientach i sprawach.
- Jeśli istnieje bezpośredni import `api/activities.ts` poza Vercel entrypointem, trzeba go przepiąć na `src/server/activities-handler.ts`.

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2U.
