# CloseFlow run - calendar relation link guard v8

## Scope
- FAKT: v7 fixed the package.json BOM/build path.
- FAKT: final blocker from v7 was a false-negative guard in tests/calendar-entry-relation-links.test.cjs.
- DECYZJA: fix the guard to check semantic requirement: Link must be imported from react-router-dom.

## Files intended to change
- tests/calendar-entry-relation-links.test.cjs
- docs/audits/calendar-entry-relation-links-guard-v8-2026-05-15.md
- _project/* project memory report files
- Obsidian CloseFlow lead app report

## Files intentionally not changed
- src/pages/Calendar.tsx
- UI files
- routing
- product logic