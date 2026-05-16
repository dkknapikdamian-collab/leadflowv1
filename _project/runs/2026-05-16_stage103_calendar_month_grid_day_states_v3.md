<!-- STAGE103_CALENDAR_MONTH_GRID_DAY_STATES_V3_RUN -->
# Stage103 V3 - Calendar month grid day states

## FACTS FROM CODE / FILES
- Active month grid render is in `src/pages/Calendar.tsx` under `calendarView === 'month'`.
- Before Stage103, the month day cell rendered a top Badge count near the day number.
- Before Stage103, `+ wiecej` was a dead `div.calendar-more`.
- Calendar month grid has older CSS repair layers. Stage103 puts the final override in `closeflow-calendar-month-plain-text-rows-v4.css`, which is imported after older month-grid layers.

## DAMIAN DECISIONS
- Today should be lightly green-tinted.
- Past days should be greyed / lower contrast.
- Selected day should have a calm blue border.
- The top count Badge near the date should be removed.
- `+ wiecej` must be a real action, not dead text.

## AI HYPOTHESIS / PROPOSAL
- Minimal safe fix: change the active month-cell render and add a final CSS override in the last imported month-grid CSS file.

## TO CONFIRM
- Manual browser test: today, past days, selected day and clicking `+ wiecej`.

## AUTOMATIC TESTS
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage103-calendar-month-grid-day-states.test.cjs`
- `npm run build`
- `node scripts/closeflow-release-check-quiet.cjs`

## GUARDS
- `tests/stage103-calendar-month-grid-day-states.test.cjs` protects day classes, missing top Badge count, real `+ wiecej` button, selected-day target and final CSS override.

## MANUAL TESTS
- TEST MANUALNY DO WYKONANIA PRZEZ DAMIANA.

## DAMIAN CONFIRMATIONS
- No manual confirmation yet.

## RISKS
- Older month-grid CSS layers still exist, but Stage103 override is placed in the last active month-grid CSS import.
- If browser output differs, inspect computed styles for `.calendar-day-cell` and `.cf-calendar-month-more`.

## OBSIDIAN IMPACT
- CloseFlow Obsidian dashboard records Stage103 and the pending manual test.

## PRODUCT DIRECTION IMPACT
- Month grid stays functionally frozen; only day states and dead `+ wiecej` are changed.

## NEXT STEP
- Damian runs manual test: /calendar -> Month -> today/past/selected/+ wiecej.

## GIT / ZIP STATUS
- Stage103 delivered by local ZIP package and followed by Stage103F cleanup.
