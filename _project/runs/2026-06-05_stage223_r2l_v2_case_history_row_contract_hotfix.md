# STAGE223 R2L-V2 - Case history row contract hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2L-V1 nie doszedł do patcha, bo jego walidacja była za ścisła względem lokalnego `CaseDetail.tsx`.
- Log z R2L-V1 pokazuje nadal failing gate:
  `assert.ok(source.includes('<article className="case-history-row"'))`.
- Test `case-detail-history-workrow-leak-fix-2026-05-13` jest literalny i szuka trzech tokenów:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.

## ZAKRES

- W `src/pages/CaseDetail.tsx` dodać jawny kontrakt Stage223 R2L-V2 z trzema wymaganymi tokenami.
- Zachować:
  - `CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13`,
  - `function isCaseActivitySourceForWorkRow`,
  - `isCaseActivitySourceForWorkRow(entry.source)`.
- Nie zmieniać realnego UI historii.
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

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2L-V2.
