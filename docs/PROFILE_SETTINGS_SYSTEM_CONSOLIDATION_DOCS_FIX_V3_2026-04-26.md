# Profile settings system consolidation docs fix v3 - 2026-04-26

## Problem

The regression test still failed because an older documentation file contained the literal standalone endpoint path.
The app runtime was already consolidated.

## Fix

- The docs no longer publish the old standalone endpoint literally.
- The regression test scans runtime code separately from documentation.
- Runtime logic is unchanged.

## Verification

node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
node tests/profile-settings-system-consolidation.test.cjs
npm.cmd run verify:closeflow:quiet
