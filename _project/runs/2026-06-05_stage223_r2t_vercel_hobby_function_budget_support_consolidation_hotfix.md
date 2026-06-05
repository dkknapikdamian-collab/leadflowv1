# STAGE223 R2T - Vercel Hobby function budget support consolidation hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2S:
  - daily-digest-cron-auth OK
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
  `tests/vercel-hobby-function-budget.test.cjs`
- Failing assertion:
  `api/*.ts count is 13, expected <= 12`
- Lista z logu:
  `activities.ts, billing-checkout.ts, case-items.ts, cases.ts, clients.ts, daily-digest.ts, leads.ts, me.ts, storage-upload.ts, stripe-webhook.ts, support.ts, system.ts, work-items.ts`
- Test liczy tylko pliki `api/*.ts`.
- `api/system.ts` już obsługuje support przez `kind === 'support'`.
- `vercel.json` już przepisuje `/api/support` na `/api/system?kind=support`.
- `api/support.ts` jest redundantny wobec istniejącego system route.

## ZAKRES

- Usunąć `api/support.ts`.
- Nie usuwać `api/daily-digest.ts`, bo daily digest release gates czytają go bezpośrednio.
- Zachować:
  - `src/server/support-handler.ts`,
  - import `supportHandler` w `api/system.ts`,
  - `if (kind === 'support')`,
  - rewrite `/api/support -> /api/system?kind=support`,
  - rewrite `/api/support-requests -> /api/system?kind=support&route=requests`,
  - rewrite `/api/support-forward -> /api/system?kind=support&route=forward`.
- Nie zmieniać `vercel.json`.
- Nie zmieniać Stage223.
- Nie zmieniać Activity Truth.
- Nie zmieniać Today.
- Nie zmieniać Supabase.

## TESTY

```powershell
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

- To jest konsolidacja funkcji Vercel. Support nadal działa przez `/api/support` rewrite, ale fizyczny plik `api/support.ts` nie będzie już osobną funkcją.
- Jeśli jakiś test lub narzędzie wymaga literalnie pliku `api/support.ts`, wtedy trzeba będzie dopisać test/kontrakt wskazujący system route, nie przywracać trzynastej funkcji.

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2T.
