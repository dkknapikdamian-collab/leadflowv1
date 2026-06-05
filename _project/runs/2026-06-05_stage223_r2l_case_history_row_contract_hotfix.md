# STAGE223 R2L - Case history row contract hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2K:
  - panel-delete-actions-v1 OK
  - Stage122 OK
  - Stage120 OK
  - Stage98 OK
  - Stage220A17 OK
  - case trash actions OK
  - Stage113 OK
  - Stage223 OK
  - Stage222 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na:
  `tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs`.
- Failing assertion:
  `assert.ok(source.includes('<article className="case-history-row"'))`
- Test wymaga, żeby CaseDetail zachował oddzielny kompaktowy renderer historii i nie przepuszczał activity history przez WorkItemRow.

## ZAKRES

- W `src/pages/CaseDetail.tsx` dodać brakujący kontrakt:
  `<article className="case-history-row"`
- Zachować:
  - `CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13`,
  - `function isCaseActivitySourceForWorkRow`,
  - `isCaseActivitySourceForWorkRow(entry.source)`,
  - `case-detail-history-row`,
  - `case-detail-work-row`.
- Nie zmieniać Stage223.
- Nie zmieniać Activity Truth.
- Nie zmieniać Today.
- Nie zmieniać Supabase.

## TESTY

```powershell
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

## RYZYKA

- To nadal jest stary release-gate cleanup. Jeżeli quiet release przejdzie do kolejnego starego testu, traktować go jako osobny gate, nie jako błąd Stage223.
- Po tych cleanupach przed pushem konieczne jest `git status --short` i selektywne staged files, bez `git add .`.

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2L.
