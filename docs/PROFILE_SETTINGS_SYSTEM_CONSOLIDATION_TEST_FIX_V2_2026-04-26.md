# Profile settings system consolidation test fix v2 - 2026-04-26

## Problem

The new regression test scanned the `tests` directory and flagged its own fixture string.
The app code was already moved away from the standalone profile settings API.

## Fix

- The regression test now scans only runtime/source/docs directories.
- The standalone endpoint string is assembled from parts so the test file does not flag itself.
- No runtime logic is changed.

## Verification

node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
node tests/profile-settings-system-consolidation.test.cjs
npm.cmd run verify:closeflow:quiet
