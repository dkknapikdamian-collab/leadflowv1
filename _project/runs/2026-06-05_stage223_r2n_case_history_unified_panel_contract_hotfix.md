# STAGE223 R2N - Case history unified panel contract hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2M:
  - `case-detail-rewrite-build-workitems-final` OK
  - `case-detail-history-workrow-leak-fix` OK
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
  `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`
- Failing assertion:
  `assert.ok(source.includes('case-detail-history-unified-panel'))`
- Test wymaga w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS część testu przeszła, więc brak dotyczy tylko znacznika/zakresu w CaseDetail.

## ZAKRES

- W `src/pages/CaseDetail.tsx` dodać jawny kontrakt:
  `<section className="case-detail-section-card case-detail-history-unified-panel">`
  oraz `Historia sprawy`.
- Nie zmieniać realnej logiki Stage223.
- Nie zmieniać Activity Truth.
- Nie zmieniać Today.
- Nie zmieniać Supabase.
- Nie wyłączać release gate.

## TESTY

```powershell
node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
node --test tests/panel-delete-actions-v1.test.cjs
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

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2N.
