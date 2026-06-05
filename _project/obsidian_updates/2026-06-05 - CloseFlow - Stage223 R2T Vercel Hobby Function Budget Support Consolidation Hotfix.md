# CloseFlow / LeadFlow - Stage223 R2T Vercel Hobby function budget support consolidation hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / Vercel Hobby function budget
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2T Vercel Hobby function budget support consolidation hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Quiet release gate blokuje `vercel-hobby-function-budget.test.cjs`.
- Limit to maksymalnie 12 plików `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` jest 13 funkcji.
- `api/support.ts` jest redundantny, bo `api/system.ts` obsługuje `kind === 'support'`, a `vercel.json` ma rewrite `/api/support` do system route.
- R2T usuwa `api/support.ts`, żeby wrócić do 12 funkcji.

## DECYZJE

- Nie usuwać `api/daily-digest.ts`, bo historyczne testy daily digest czytają ten plik bezpośrednio.
- Nie zmieniać crona ani `vercel.json`.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/vercel-hobby-function-budget.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
