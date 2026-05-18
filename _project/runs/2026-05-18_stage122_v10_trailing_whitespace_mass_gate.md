# Stage122 V10 - trailing whitespace mass gate repair

## Scan-first confirmation

- Project: CloseFlow / LeadFlow.
- Branch expected: `dev-rollout-freeze`.
- Context: Stage122 V9 applied runtime auth/API/PWA hardening but stopped at `git diff --check` because `api/system.ts` had trailing whitespace around the injected `/api/version` system route.

## FAKTY Z LOGU

- Stage122 V9 patch applied.
- Failure occurred before tests: `api/system.ts:811: trailing whitespace`.
- No product runtime failure was shown in this log; this is a hygiene gate failure.

## ZMIANY V10

- Stage122 patcher now strips trailing whitespace from all touched Stage122 files after applying changes.
- Apply harness also runs an explicit whitespace cleanup before `git diff --check`.
- Keeps the V9 architecture: `/api/version` rewrites to `/api/system?kind=version`, no physical `api/version.ts`, network-only service worker, clear auth/workspace error status mapping.

## TESTY AUTOMATYCZNE

Expected apply checks:
- `git diff --check` on touched Stage122 paths.
- `node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs`
- `node --test tests/pwa-foundation.test.cjs`
- `node --test tests/vercel-hobby-function-budget.test.cjs`
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage121-calendar-shift-lead-branch-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## NASTĘPNY KROK

After push, verify production `/api/version`, console marker and whether stale JS bundle is gone. Then retest `/api/me` and Calendar shift actions.
