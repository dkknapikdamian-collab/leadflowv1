# 06_GUARDS_AND_TESTS - CloseFlow Lead App

## FAKT
- Added scripts/check-project-memory.cjs.
- Added npm script check:project-memory if package.json exists.

## Commands
- node scripts/check-project-memory.cjs
- npm run check:project-memory
- npm run typecheck
- npm run build
- npm run verify:closeflow:quiet

## DECYZJA
- Failed or skipped checks must be visible in run report.

## HIPOTEZA / PROPOZYCJA
- Add narrower guards in feature stages.

## DO POTWIERDZENIA
- Which commands are hard gates.

## 2026-05-15_22-15-44 - Calendar relation link guard v8
- FAKT: Guard tests/calendar-entry-relation-links.test.cjs was relaxed to accept combined named import from react-router-dom when it includes Link.
- DECYZJA: This is a guard repair only, not a Calendar UI change.
