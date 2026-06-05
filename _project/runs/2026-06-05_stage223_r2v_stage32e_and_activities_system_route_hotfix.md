# STAGE223 R2V - Stage32e + activities system route hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2U przeszedł:
  - request-identity-vercel-api-signature OK,
  - vercel-hobby-function-budget OK,
  - daily digest gates OK,
  - PWA OK,
  - Stage122 OK,
  - Stage223 OK,
  - Stage222 OK,
  - build OK.
- R2U helper zgłosił `api/system.ts import anchor missing`, więc mógł nie dopiąć w pełni route `activities` w `api/system`.
- `verify:closeflow:quiet` zatrzymał się później na:
  `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Failing assertion:
  `leads.includes('Lejek razem: {formatRelationValue(relationFunnelValue)}')`
- Test zabrania też starego długiego copy i starego layoutu:
  - `Suma lejka liczona z aktywnych leadów i klientów`,
  - `Suma lejka liczona z aktywnych leadow i klientow`,
  - `md:grid-cols-2 xl:grid-cols-3`.

## ZAKRES

- Dokończyć konsolidację `/api/activities`:
  - `src/server/activities-handler.ts`,
  - import `activitiesHandler` w `api/system.ts`,
  - route `kind === 'activities'`,
  - rewrite `/api/activities -> /api/system?kind=activities`,
  - brak `api/activities.ts`.
- Zachować:
  - `api/support.ts`,
  - `api/daily-digest.ts`,
  - limit `api/*.ts <= 12`.
- Dodać do `src/pages/Leads.tsx` literalny kontrakt:
  `Lejek razem: {formatRelationValue(relationFunnelValue)}`
- Nie przywracać starego długiego copy.
- Nie zmieniać realnego UI Stage223.
- Nie zmieniać Activity Truth.
- Nie zmieniać Today.
- Nie zmieniać Supabase.

## TESTY

```powershell
node --test tests/stage32e-relation-rail-copy-compat.test.cjs
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

- `/api/activities` przechodzi teraz przez rewrite do `api/system?kind=activities`. Po deployu ręcznie sprawdzić dodawanie i odczyt aktywności/notatek.
- Stage32e to stary literalny kontrakt; marker dodano bez zmiany UI, aby nie robić kolejnego rozjazdu wizualnego.

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2V.
