# STAGE223 R2S - Daily digest cron auth contract hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2R:
  - daily-digest-diagnostics OK
  - daily-digest-email-runtime OK
  - PWA foundation OK
  - Stage220A29 OK
  - Stage122 OK
  - ClientDetail operational center OK
  - case-history visual/rewrite/workrow OK
  - panel-delete OK
  - Stage120 OK
  - Stage98 OK
  - Stage220A17 OK
  - case trash OK
  - Stage113 OK
  - Stage223 OK
  - Stage222 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na:
  `tests/daily-digest-cron-auth.test.cjs`
- Failing assertion:
  `x-vercel-cron guard must exist`
- Test wymaga w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`
  - `if (vercelCron) return true;`
  - `if (cronSecret)`
  - `providedSecret === cronSecret`
- Test wymaga też, żeby Vercel Cron check był przed CRON_SECRET check.

## ZAKRES

- W `api/daily-digest.ts` dodać jawny kontrakt cron auth.
- Zachować delegację do canonical:
  `dailyDigestHandler(req, res)`
- Zachować kontrakty:
  - daily digest diagnostics,
  - daily digest runtime,
  - exact `selfTestMode === 'workspace-test'`,
  - workspace hour enforcement.
- Nie zmieniać `vercel.json`.
- Nie zmieniać canonical handlera.
- Nie zmieniać Stage223.
- Nie zmieniać Activity Truth.
- Nie zmieniać Today.
- Nie zmieniać Supabase.

## TESTY

```powershell
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

- `api/daily-digest.ts` nadal jest wrapperem kompatybilności. Prawdziwa logika powinna zostać w `src/server/daily-digest-handler.ts`.
- Po zielonym verify warto później zrobić osobny etap porządkowy historycznych testów, bo część release gates wymaga literalnych markerów.

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2S.
