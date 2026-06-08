# Stage228R7 - commission balance truth

- date: 2026-06-08 12:30 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- stage: STAGE228R7_COMMISSION_BALANCE_TRUTH
- scope:
  - CaseDetail right rail payment action now adds commission payment.
  - Client finance cards show transaction value, commission due, commission paid, commission remaining.
  - Case settlement panel hides client paid / client remaining from main commission view.
  - Guard added: scripts/check-stage228r7-commission-balance-truth.cjs
- tests:
  - node scripts/check-stage228r7-commission-balance-truth.cjs
  - npm run build
- manual test:
  1. Set transaction value 100000 and commission 10%.
  2. Add commission payment 1000.
  3. Expect due 10000, paid 1000, remaining 9000.
- risk audit:
  - Existing historical partial/deposit payments remain in history and do not count as commission paid.
  - This stage does not migrate old wrong partial payments into commission payments.
  - Multiple phones/emails are not touched.
