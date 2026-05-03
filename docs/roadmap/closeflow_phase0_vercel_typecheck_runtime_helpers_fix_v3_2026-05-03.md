# CloseFlow Phase 0: Vercel typecheck runtime helpers fix v3

Naprawia błąd paczki V2 oraz właściwy problem z Vercel TypeScript po buildzie.

Zakres:

- `src/server/_request-scope.ts`: przywrócone eksporty używane przez API Vercel: `requireRequestIdentity`, `requireAdminAuthContext`, `assertWorkspaceOwnerOrAdmin`, `fetchSingleScopedRow`, `requireScopedRow`.
- `src/server/_access-gate.ts`: przywrócone eksporty `FREE_LIMITS`, `assertWorkspaceEntityLimit`, `assertWorkspaceAiAllowed`, bez literalnego błędu TypeScript na statusie dostępu.
- Dodany statyczny test kontraktu dla helperów runtime.
- Skrypt nie wywala się już na `git rm test-results`, gdy folder nie jest śledzony.
- Skrypt uruchamia `npx tsc --noEmit`, żeby lokalnie złapać ten sam typ błędu, który pokazał Vercel.

Powód: Vite build przechodził, ale Vercel osobno typował funkcje API i wykrywał brak eksportów oraz zbyt wąskie sygnatury helperów.
