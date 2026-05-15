# CloseFlow runtime lazy page default fix v15

## FAKT
- Runtime error reported after v14: APP_ROUTE_RENDER_FAILED and TypeError reading default.
- App routes are loaded through React.lazy.
- React.lazy expects modules resolving to an object with a valid default component.
- v15 adds lazyPage wrapper that accepts module.default or a named export matching the route variable.
- v15 removes unused lucide icon route-name collision import from src/App.tsx when present.

## DECYZJA
- This is a runtime hardening hotfix only.
- No route paths, UI copy, product behavior or business logic are intentionally changed.
- Add a guard so future lazy route chunks cannot silently miss default/named component exports.

## Manual test
- Deploy/redeploy.
- Hard refresh.
- Confirm login/root page renders.
- If the same old chunk remains, clear service worker/site cache.
