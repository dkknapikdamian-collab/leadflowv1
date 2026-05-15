# CloseFlow runtime lazy page default fix v16

## FAKT
- Runtime error reported after v14: Cannot read properties of undefined reading default.
- v15 applied local patch but failed before build/commit because npm was invoked through an invalid Windows wrapper.
- v16 uses cmd.exe and npm.cmd for native commands.
- v16 normalizes lazy route imports through lazyPage in src/App.tsx.

## DECYZJA
- This is a runtime hotfix only.
- No route semantics, UI design or product logic changes.
- Commit is scoped to App.tsx, guard, tool and project memory/audit files.

## Manual test
- Redeploy.
- Hard refresh.
- If old chunks remain, clear service worker/cache.