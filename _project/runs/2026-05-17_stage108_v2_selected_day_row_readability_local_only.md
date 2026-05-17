# Stage108 V2 - selected day row readability local-only

Status: LOCAL TEST ONLY. No git add, commit or push.

## Goal
Fix selected-day row readability in Calendar without changing month grid logic.

## Facts
- Touched target: src/styles/closeflow-calendar-selected-day-new-tile-v9.css
- JSX already renders selected-day entry as meta + title + relation + single-row actions.
- This package is local-only because visual changes need Damian approval first.

## Change
- Meta/type/time/status rendered as plain inline text.
- Title starts directly after meta.
- Relation stays after title.
- Actions stay on the right.
- Orphan selector before @media removed to reduce CSS minify warnings.

## Tests
- node scripts/check-stage108-calendar-selected-day-row-readability.cjs
- node --test tests/stage108-calendar-selected-day-row-readability.test.cjs
- npm run build unless -SkipBuild is used

## Manual test
Open /calendar and check selected-day panel:
- type/time/status are readable,
- title starts after status,
- row does not drift to the right,
- action buttons remain readable.

## Next step
Commit and push only after Damian confirms visual result.
