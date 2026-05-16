<!-- STAGE103F_DAY_CELL_GUARD_AND_DOC_CLEANUP -->
# Stage103F - day cell guard and doc cleanup

## Goal
Fix the Stage103E blocker: the Stage103 guard required `data-calendar-month-day-cell`, but the active month cell did not include that marker.

## Changes
- Added or confirmed `data-calendar-month-day-cell="true"` on active month cells.
- Confirmed `isPastDay` exists for `is-past` class logic.
- Removed the unused Calendar Badge import when no `<Badge` remains.
- Rewrote Stage103 project-memory entries without mojibake.

## Tests required by script
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage103-calendar-month-grid-day-states.test.cjs`
- `npm run build`
- `node scripts/closeflow-release-check-quiet.cjs`

## Manual test
- Still required in browser.
