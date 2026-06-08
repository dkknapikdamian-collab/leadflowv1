# Stage228R7 R4 - guard scope paid_amount hotfix

- date: 2026-06-08 14:00 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- previous deployed commit context: e34d822
- issue:
  - Vercel build passed Stage220A14 after R3.
  - Build failed on Stage228R7 guard because it globally forbade "Wpłacono od klienta".
  - That label existed in COMMISSION_BASE_OPTIONS for paid_amount, not in the main commission balance view.
- fix:
  - Rename paid_amount option to "Wpłaty klienta jako podstawa".
  - Narrow Stage228R7 guard to forbid old client-paid metrics only as main Metric labels.
- tests:
  - node scripts/check-stage228r7-commission-balance-truth.cjs
  - npm run build
- risk audit:
  - No finance calculation change.
  - No SQL/migration.
  - This only fixes guard scope and one advanced option label.
