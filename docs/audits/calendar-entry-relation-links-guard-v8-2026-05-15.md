# CloseFlow - calendar relation links guard v8

## Scope
- FAKT: npm run build passed before this repair.
- FAKT: npm run verify:closeflow:quiet failed only on tests/calendar-entry-relation-links.test.cjs.
- FAKT: src/pages/Calendar.tsx imports Link from react-router-dom, but in a combined named import with useSearchParams.
- DECYZJA: repair the guard, not the UI. The previous assertion was too narrow and rejected a valid import.

## Change
- Updated the guard regex so it accepts named imports that include Link, not only exactly import { Link }.

## Not changed
- UI was not changed.
- Routing was not changed.
- Product logic was not changed.
- Calendar monthly view was not changed.

## Verification
- node scripts/check-json-no-bom-stage73b.cjs
- node scripts/check-project-memory.cjs
- npm run check:project-memory
- npm run build
- npm run verify:closeflow:quiet