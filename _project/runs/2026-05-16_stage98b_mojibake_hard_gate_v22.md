# Stage98B V22 - mojibake hard gate, billing literal restore, wide sweep

## Status
Prepared package. Final status is decided by local run.

## Facts
- V18/V19/V20/V21 reached billing regression after broader Stage98 and syntax checks.
- The failing assertion is in `tests/billing-foundation-test-polish-label-regression.test.cjs` and checks that `tests/billing-stripe-blik-foundation.test.cjs` contains literal `Przejdź do płatności`.
- Prior wide hygiene escaped literal Polish in the foundation test into unicode escapes, which broke the regression test.

## Change
- Restore `src/pages/Billing.tsx`, `tests/billing-stripe-blik-foundation.test.cjs`, and `tests/billing-foundation-test-polish-label-regression.test.cjs` from `origin/dev-rollout-freeze` using byte-safe `git show`.
- Keep Stage98B repo-wide guard.
- Keep broad JS/CJS/MJS syntax sweep.
- Keep billing Polish label regression before quiet release gate.
- Keep command logs in `_backup_local/stage98b_v22_command_logs` only, not committed.

## Tests required
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- broad `node --check` for scripts/tests/tools
- `node --test tests/billing-foundation-test-polish-label-regression.test.cjs`
- `node --test tests/billing-stripe-blik-foundation.test.cjs`
- `git diff --check`
- `npm run verify:closeflow:quiet`

## Obsidian
Update `10_PROJEKTY/CloseFlow_Lead_App/2026-05-16 - Stage98B mojibake hard gate V22.md`.
