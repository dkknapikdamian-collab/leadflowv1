# Stage104 V4 - Calendar performance guard fix local-only

## Status

LOCAL-ONLY. No git add/commit/push.

## Facts

- V2 correctly stopped on failing Stage104 test.
- V3 still had a brittle exact dependency-array expectation.
- V4 changes the guard to assert the actual risk: DOM post-processing must not depend on `selectedDate`.
- Sorting is allowed only inside `buildEntriesByDayKey`, where day buckets are precomputed.
- Month/week render paths must use `getPrecomputedEntriesForDay(...)`.

## Decision

Calendar performance guard should test user-impacting constraints, not fragile formatting.

## Hypothesis

The slow-feeling Calendar was partly caused by DOM post-processing rerunning on selected day clicks. Removing `selectedDate` from those effects should make day clicking feel lighter while preserving data/view/month updates.

## Automatic checks

- `node --test tests/stage104-calendar-loading-performance-contract.test.cjs`
- `node scripts/check-stage104-calendar-loading-performance-contract.cjs`
- `npm run build`
- Optional: `npm run verify:closeflow:quiet` with `-RunQuiet`

## Manual checks

- `/calendar` incognito reload x3.
- Toggle Week/Month x5.
- Click several days.
- Console must not show `APP_ROUTE_RENDER_FAILED`, `ReferenceError`, or `Missing lazy page export`.

## Next step

If manual test is OK, finalize Stage104 with a narrow commit containing only Stage104 files and a matching Obsidian note.
