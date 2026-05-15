# CloseFlow runtime React StrictMode fix v14

## FAKT
- Runtime error reported: React is not defined and white page.
- src/main.tsx uses React.StrictMode.
- v14 adds missing React import when needed.
- v14 adds standalone guard scripts/check-react-strictmode-runtime-import-stage87.cjs.

## DECYZJA
- This is a runtime hotfix only.
- No UI, routing or product logic change.
- Do not touch unrelated previous-stage code.

## Manual test
- After deploy: hard refresh page.
- If old chunk remains, unregister service worker / clear site cache and reload.