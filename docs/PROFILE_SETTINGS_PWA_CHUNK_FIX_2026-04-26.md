# Profile settings, PWA meta and stale chunk fix - 2026-04-26

## Problems

- `/api/system?kind=profile-settings` returned 500 with `PROFILE_SETTINGS_ROW_ID_MISSING`.
- Browser warned that `apple-mobile-web-app-capable` should be paired with `mobile-web-app-capable`.
- Entering cases could fail with stale hashed asset, for example `Cases-*.js` 404.

## Fix

- Profile settings save no longer requires rowId.
- The endpoint finds profile by row id, uid, firebase uid, auth uid, external auth uid or email.
- If profile is missing, endpoint creates minimal profile and saves settings.
- `index.html` has corrected UTF-8 description and both PWA meta tags.
- Lazy route chunk errors trigger one safe cache clear and page reload.
- Added regression tests.

## Compact verification

node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
