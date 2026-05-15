# CloseFlow runtime lazy page default fix v18

## FAKT
- v15/v16/v17 left duplicate lazyPage declarations in local src/App.tsx.
- Build failed before commit and push.
- v18 reconstructs the lazy route block between the bootstrap marker and AppRouteFallback.
- v18 requires exactly one lazyPage declaration and no direct page lazy imports.

## DECYZJA
- This is a runtime hotfix only.
- No UI, routing semantics or product logic change.
- Commit only after build and quiet release gate pass.

## Manual test
- After deploy: hard refresh page.
- If old chunk remains: clear site data or unregister service worker and reload.
