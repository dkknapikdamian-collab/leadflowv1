# Stage122 - runtime auth/API/PWA hardening for calendar shift failures

## Scan-first confirmation

- Project: CloseFlow / LeadFlow.
- Repo: `dkknapikdamian-collab/leadflowv1`.
- Branch: `dev-rollout-freeze`.
- Audited files: `src/pages/Calendar.tsx`, `src/lib/calendar-items.ts`, `src/lib/scheduling.ts`, `src/lib/supabase-fallback.ts`, `src/lib/supabase-auth.ts`, `src/pwa/register-service-worker.ts`, `public/service-worker.js`, `api/work-items.ts`, `api/me.ts`, `src/server/_supabase-auth.ts`, `src/server/_request-scope.ts`, Google Calendar inbound/outbound server files.
- User runtime evidence: DevTools showed active service worker, old JS initiator `index-bVcPVjON.js`, repeated `/api/me` 401, `/api/cases` and `/api/leads` 401, and `/api/tasks` `/api/events` 500.

## FAKTY Z KODU / PLIKÓW

- Stage121 code exists on `dev-rollout-freeze` and handles `event`, `task`, and `lead` calendar shift branches.
- `callApi()` only sends `Authorization` when Supabase browser session has an access token.
- Server auth requires a Supabase bearer token and does not trust legacy frontend identity headers alone.
- `api/work-items.ts` masked auth/workspace failures such as missing bearer token as HTTP 500 in some paths.
- Existing service worker was intended to avoid asset caching, but user still had an active worker and old production bundle initiator.

## DECYZJE DAMIANA

- Stop patching calendar UI blindly.
- Fix the runtime/API/auth problem that blocks calendar writes.
- Add Google Calendar disconnect UI later, after runtime/API is stable.

## HIPOTEZY / PROPOZYCJE AI

- Primary hypothesis: production is running stale frontend or stale PWA shell plus missing/invalid Supabase session.
- Secondary hypothesis: task/event writes fail at API auth/workspace layer before calendar shift persistence can be evaluated.

## ZMIANY

- Disable old CloseFlow service worker registrations from the runtime without clearing localStorage/auth.
- Replace `public/service-worker.js` with a network-only retiring worker.
- Add `/api/version` no-store endpoint with commit/stage marker.
- Add `CLOSEFLOW_STAGE122_RUNTIME_MARKER` console marker to confirm new runtime bundle.
- Change `api/work-items.ts` error mapping so auth/workspace errors return 401/403 instead of masked 500.
- Add Stage122 regression guard and wire it into quiet release gate.

## TESTY AUTOMATYCZNE

Expected:
- `node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs`
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage121-calendar-shift-lead-branch-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## TEST RĘCZNY

Status: TEST RĘCZNY DO WYKONANIA.

After deployment:
1. Open `/api/version`; confirm Stage122 marker and current commit.
2. DevTools Console: confirm `CLOSEFLOW_STAGE122_RUNTIME_MARKER`.
3. DevTools Application > Service Workers: confirm old worker is not controlling page after one reload.
4. DevTools Network: confirm `/api/me` is 200 before calendar write tests.
5. Retest Calendar `+1D`, `+1W`, `+1H` on task/event/lead.

## BRAKI I RYZYKA

- If `/api/me` remains 401, the user must re-authenticate through the app login flow. This package cannot manufacture a valid Supabase token.
- If Vercel is not deploying `dev-rollout-freeze`, `/api/version` will expose the wrong commit/branch.
- Google Calendar disconnect UI remains a follow-up stage.

## WPŁYW NA OBSIDIANA

- Add this stage note to `10_PROJEKTY/CloseFlow_Lead_App/`.
- Record the discovered runtime/API cause and the manual verification plan.

## NASTĘPNY KROK

Deploy Stage122 and verify `/api/version`, runtime marker, service worker state, `/api/me`, then calendar shift actions.

## GIT / ZIP STATUS

ZIP stage. Apply with `-DoPush` to commit/push app repo and Obsidian selectively.

## V2 backup fix

FAKT: V1 apply failed before patching because the backup filename generation did not normalize Windows backslashes, so `Copy-Item` tried to write into a nested path under `_backup_local`.

ZMIANA V2: backup uses explicit `.Replace('\\', '_').Replace('/', '_')` and creates the destination parent before copying. Product patch remains the same Stage122 runtime auth/API/PWA hardening.


## V3 apply harness fix

- V2 stopped before product patch because the work-items catch block anchor was too exact.
- V3 replaces the final catch block structurally by matching braces, so it works on the current Stage121/Stage122 local file shape.
- Product direction unchanged: retire stale PWA worker, add /api/version, add runtime marker, classify work-items auth errors as 401/403 instead of 500.
