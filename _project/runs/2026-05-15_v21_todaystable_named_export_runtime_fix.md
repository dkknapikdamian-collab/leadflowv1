# Run report - v21 TodayStable named export runtime fix

Date: 2026-05-15
Branch: dev-rollout-freeze

## Goal
Fix runtime error: Missing lazy page export: TodayStable.

## Scope
- src/pages/TodayStable.tsx
- scripts/check-todaystable-named-export-stage89.cjs
- tools/fix-todaystable-named-export-v21.cjs
- docs/audits/todaystable-named-export-v21-2026-05-15.md

## Verification planned
- node scripts/check-json-no-bom-stage73b.cjs
- node scripts/check-react-strictmode-runtime-import-stage87.cjs
- node scripts/check-lazy-page-default-runtime-stage88.cjs
- node scripts/check-todaystable-named-export-stage89.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet