# Stage108 V8 - calendar render-smoke guard local-only

## Status
LOCAL-ONLY. No git add, no commit, no push.

## Scope
- Add render-smoke fixture for selected-day calendar entry.
- Add guard that checks visible rendered content, not only markers.
- Remove orphan CSS selector for V9 selected-day entry.
- Wire Stage108 smoke into quiet release gate exactly once.

## Decision
UI guards must verify user-visible rendered output, not just marker strings.

## Files touched
- tests/fixtures/calendar-entry-fixtures.cjs
- tests/stage108-calendar-render-contract-smoke.test.cjs
- scripts/check-stage108-calendar-render-contract-smoke.cjs
- scripts/closeflow-release-check-quiet.cjs
- src/styles/closeflow-calendar-selected-day-new-tile-v9.css
- _project/06_GUARDS_AND_TESTS.md
- _project/09_NEXT_STEPS.md

## Tests run by package
- node --test tests/stage108-calendar-render-contract-smoke.test.cjs
- npm run build

## User tests after push
1. Open /calendar.
2. Select a day with at least one event or task.
3. Confirm selected-day panel shows full title, full type label, time, status, relation and actions.
4. Confirm console has no ReferenceError, APP_ROUTE_RENDER_FAILED or Missing lazy page export.
5. Toggle Week/Month several times and click several days.

## Production blocker recorded
Stripe must be switched from sandbox/test mode to live mode before production payments.
