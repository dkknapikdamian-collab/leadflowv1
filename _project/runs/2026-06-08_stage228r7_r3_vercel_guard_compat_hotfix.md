# Stage228R7 R3 - Vercel guard compatibility hotfix

- date: 2026-06-08 13:35 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- previous commit: a4782820
- issue:
  - Vercel build failed in Stage220A14 legacy guard because Stage228R7 renamed ClientDetail finance labels from old payment/case-value copy to commission-balance copy.
  - Local R7 guard also caught stale/doubled commission wording in CaseDetail.
- fix:
  - Stage220A14 guard now accepts the R7 commission-balance label set when R7 marker is present.
  - CaseDetail duplicate copy fixed: "Koryguj wpłatę prowizji prowizji" and "Historia wpłat prowizji prowizji".
  - R7 guard updated to check the R3 marker and duplicate-copy regressions.
- tests:
  - node scripts/check-stage220a14-finance-scope-guard-lock.cjs
  - node scripts/check-stage228r7-commission-balance-truth.cjs
  - npm run build
- risk audit:
  - This is a guard compatibility hotfix, not a finance calculation change.
  - No SQL, no migration, no multiple contact changes.
