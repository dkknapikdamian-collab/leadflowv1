# Profile settings system consolidation fix - 2026-04-26

## Problem

Adding a standalone profile settings API increased direct Vercel API functions to 13.
The project budget test requires direct API files to stay within the Hobby limit.

## Fix

- Remove the standalone profile settings API file.
- Use existing `api/system.ts` with `kind=profile-settings`.
- Patch system profile settings save so a profile row id is optional.
- If the profile row has no id, update by firebase uid, auth uid, external auth uid or email.
- Rewrite runtime calls to the consolidated system route.

## Verification

Compact verification:

node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
node tests/profile-settings-system-consolidation.test.cjs
npm.cmd run verify:closeflow:quiet
