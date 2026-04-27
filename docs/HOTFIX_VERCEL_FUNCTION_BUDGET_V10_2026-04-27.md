# HOTFIX V10 — Vercel Hobby function budget

Cel: zejść z `api/*.ts` z 14 do 12 funkcji po dodaniu Szkiców AI.

Zmiany:
- przeniesiono logikę `ai-drafts` z `api/ai-drafts.ts` do `src/server/ai-drafts.ts`,
- przeniesiono logikę `assistant-context` z `api/assistant-context.ts` do `src/server/assistant-context.ts`,
- `api/system.ts` obsługuje teraz `kind=ai-drafts` oraz `kind=assistant-context`,
- frontend używa `/api/system?kind=ai-drafts` i `/api/system?kind=assistant-context`,
- usunięto osobne funkcje Vercel `api/ai-drafts.ts` oraz `api/assistant-context.ts`.

Po wdrożeniu uruchomić:

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
```
