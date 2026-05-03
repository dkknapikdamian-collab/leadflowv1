# CloseFlow Phase 0 - Vercel typecheck runtime helpers fix - 2026-05-03

## Cel

Naprawa błędów TypeScript wykrytych dopiero przez Vercel przy budowie funkcji API po commicie d96b704.

## Przyczyna

Frontendowy build Vite przechodził, ale Vercel osobno typował funkcje API. Po wcześniejszej konsolidacji helperów API brakowało kompatybilnych eksportów i sygnatur w:

- src/server/_request-scope.ts
- src/server/_access-gate.ts

## Naprawione kontrakty

- requireRequestIdentity
- requireAdminAuthContext
- assertWorkspaceOwnerOrAdmin
- fetchSingleScopedRow(table, id, workspaceId, code)
- requireScopedRow(table, id, workspaceId, code)
- assertWorkspaceWriteAccess(workspaceId, ...)
- assertWorkspaceAiAllowed(workspaceId, ...)
- assertWorkspaceEntityLimit(workspaceId, entityKind, ...)

## Kontrola

Po wdrożeniu sprawdzić:

- npm run check:polish-mojibake
- npm run verify:closeflow:quiet
- npm run test:critical
- npm run build
- npx tsc --noEmit --pretty false
