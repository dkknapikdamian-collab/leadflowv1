# Profile settings theme save fix - 2026-04-26

## Problem

Theme save failed with:

PROFILE_SETTINGS_ROW_ID_MISSING

Browser also reported:

apple-mobile-web-app-capable is deprecated. Please include mobile-web-app-capable.

## Fix

- `/api/system?kind=profile-settings` no longer requires an existing profile row id.
- The endpoint finds a profile by id, uid, firebase uid, auth uid, external auth uid or email.
- If no profile exists yet, it creates a minimal profile and saves settings.
- `index.html` includes both mobile web app capable meta tags.
- Added a regression test for the profile settings row id contract.

## Verification

Compact verification is enough:

node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
