# CloseFlow runtime lazy page default fix v17

## FAKT
- v16 failed locally because v15 partially inserted lazyPage and v16 inserted it again.
- v17 reconstructs the App.tsx lazy route block to exactly one lazyPage helper.
- v17 keeps route paths and product logic unchanged.
- v17 adds/updates scripts/check-lazy-page-default-runtime-stage88.cjs.

## DECYZJA
- This is a runtime hotfix only.
- No UI/routing semantics/product logic change.
- Commit only scoped runtime hotfix files and project memory notes.

## Manual test
- After deploy: hard refresh.
- If old chunks remain: unregister service worker / clear site data.