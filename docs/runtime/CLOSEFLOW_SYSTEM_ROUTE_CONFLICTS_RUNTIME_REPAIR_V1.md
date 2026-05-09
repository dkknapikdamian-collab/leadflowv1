# CloseFlow system route conflicts runtime repair v1

Status: runtime repair.

Naprawia dwa błędy po konsolidacji konfliktów lead/client pod `/api/system`:

- `api/system.ts` nie może mieć dwóch deklaracji `const body = parseBody(req.body)` w tym samym handlerze.
- frontend musi mieć eksport `findEntityConflictsInSupabase`, który woła `/api/system?kind=entity-conflicts`, a nie usunięte `/api/entity-conflicts`.

Sprawdzenie:

```powershell
npm run check:closeflow-system-route-conflicts-runtime-v1
npm run check:vercel-hobby-function-limit
npm run check:lead-client-conflict-resolution-v1
npm run build
```
