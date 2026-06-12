# STAGE231E2_R6_R2_GUARD_COMPAT_AFTER_R5

Date: 2026-06-13 Europe/Warsaw

## Status
LOCAL_ONLY_PACKAGE.

## Reason
R5 intentionally moved local workspace bootstrap from literal `trial_14d` / explicit 14-day milliseconds to the central plan contract:
- `PLAN_IDS.trial`
- `TRIAL_MS`

Older R2 guard still required literal `planId: 'trial_14d'` and `Date.now() + 14 * 24 * 60 * 60 * 1000`, so it failed after a better centralization.

## Change
Updated `scripts/check-stage231e2-r2-trial-14d-lock.cjs` to accept either:
- centralized `PLAN_IDS.trial` and `TRIAL_MS`, or
- the older literal 14-day implementation.

The guard still blocks:
- active `trial_21d` runtime fallback,
- explicit 21-day duration.

## Tests to run
- node scripts/check-stage231e2-trial-14d-contract.cjs
- node scripts/check-stage231e2-plan-entitlement-matrix.cjs
- node scripts/check-stage231e2-r4-trial-card-access-source.cjs
- node scripts/check-stage231e2-r2-trial-14d-lock.cjs
- node scripts/check-stage231e2-account-trial-bootstrap.cjs
- npm run build
- git diff --check

## Risk audit
This is a guard compatibility patch only. It does not change runtime, billing, trial dates, SQL, Google Calendar, or plan entitlements.