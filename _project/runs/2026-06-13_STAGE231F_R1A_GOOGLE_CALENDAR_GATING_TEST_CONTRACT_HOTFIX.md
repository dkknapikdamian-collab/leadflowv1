# STAGE231F_R1A_GOOGLE_CALENDAR_GATING_TEST_CONTRACT_HOTFIX

Date: 2026-06-13 Europe/Warsaw

## Status
LOCAL_ONLY_PACKAGE.

## Problem
After STAGE231F_R1 the legacy `test:google-calendar-gating` expected an exact handler response:

`{ error: 'GOOGLE_CALENDAR_CONFIG_REQUIRED', missing: cfg.missing }`

STAGE231F_R1 intentionally expanded the response with:

`reason: 'app_not_configured'`

The runtime contract is better, but the old static regex was too strict.

## Change
Updated `tests/google-calendar-gating.test.cjs` so it accepts the expanded 409 configuration-required response and explicitly requires:
- `GOOGLE_CALENDAR_CONFIG_REQUIRED`
- `missing: cfg.missing`
- `reason: 'app_not_configured'`

## Tests
Run:
- npm run test:google-calendar-gating
- node scripts/check-stage231f-r1-google-calendar-user-scope-safety-lock.cjs
- node --test tests/stage231f-r1-google-calendar-user-scope-safety-lock.test.cjs
- npm run test:google-calendar-sync-contract
- npm run build
- git diff --check

## Risk audit
Runtime is not changed. This is a test-contract compatibility hotfix only.