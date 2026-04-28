# Stage 09 — naprawa kontraktów testów po V14

## Cel

Domknąć zielony stan po V14 bez zmiany działającej logiki aplikacji.

## Co poprawia

1. Test Stage 03 oczekuje teraz bezpiecznego aliasu `createLeadFromAiDraftApprovalInSupabase`, a nie bezpośredniego `insertLeadToSupabase` w `AiDrafts.tsx`.
2. Test Stage 04 nie blokuje istniejącego szybkiego dodawania leada w `Today.tsx`.
3. `Today.tsx` dostaje marker `AI_DRAFTS_IN_TODAY_STAGE04`, żeby kontrakt etapu był czytelny.
4. Skan kontrolny pilnuje polskich znaków.

## Nie zmieniaj

- Nie zmieniać finalnego zapisu bez zatwierdzenia użytkownika.
- Nie dodawać nowych plików `api/*.ts`.
- Nie usuwać istniejącego szybkiego dodawania leada w `Dziś`.

## Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/ai-draft-approval-stage03.test.cjs
node tests/today-ai-drafts-stage04.test.cjs
```
