# Stage122 V7 - PWA registration compatibility

## Scan-first confirmation

- Project: CloseFlow / LeadFlow.
- Branch: `dev-rollout-freeze`.
- Context: Stage122 V6 applied runtime auth/API/PWA hardening, but old `tests/pwa-foundation.test.cjs` still requires literal `register('/service-worker.js'` in `src/pwa/register-service-worker.ts`.

## FAKTY

- Stage122 V6 guard passed.
- Old PWA foundation guard failed because the registration file unregisters old workers and clears CloseFlow CacheStorage, but no longer contains the legacy service worker registration literal.
- The old guard is textual and remains in the full quiet gate.

## ZMIANA

- Keep Stage122 stale-worker cleanup.
- After cleanup, register `/service-worker.js` again with `{ scope: '/' }`.
- The worker itself stays network-only and does not use `event.respondWith()`.

## TESTY

Expected apply checks:
- `node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs`
- `node --test tests/pwa-foundation.test.cjs`
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage121-calendar-shift-lead-branch-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## NASTĘPNY KROK

After deploy, check `/api/version`, console marker `CLOSEFLOW_STAGE122_RUNTIME_MARKER`, Network JS bundle hash, then `/api/me` and calendar shift actions.
