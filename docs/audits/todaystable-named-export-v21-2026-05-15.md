# CloseFlow v21 runtime fix - TodayStable named export

## Scope
- Fix runtime white page after lazyPage hardening.
- Error: Missing lazy page export: TodayStable.

## Cause
- App.tsx loads TodayStable through lazyPage with exportName TodayStable.
- TodayStable had a default export, but runtime deployment still reported missing default export.
- The safest compatibility fix is to expose TodayStable as both default and named export.

## Changed
- src/pages/TodayStable.tsx: added explicit named export `export { TodayStable };`.
- scripts/check-todaystable-named-export-stage89.cjs: guard for App route and TodayStable named export.
- tools/fix-todaystable-named-export-v21.cjs: idempotent local patcher.

## Not changed
- No UI changes.
- No routing semantics changes.
- No product logic changes.

## Verification
- json BOM guard.
- React StrictMode runtime guard.
- lazy page default runtime guard.
- TodayStable named export guard.
- npm run build.
- npm run verify:closeflow:quiet.