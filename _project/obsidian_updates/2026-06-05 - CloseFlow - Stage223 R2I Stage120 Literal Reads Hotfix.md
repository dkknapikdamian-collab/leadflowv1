# CloseFlow / LeadFlow - Stage223 R2I Stage120 literal local reads hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / Stage120 literal reads
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2I Stage120 literal local reads hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2H naprawił parser testu Stage120.
- Test Stage120 wymaga literalnych `fetchTasksFromSupabase()` i `fetchEventsFromSupabase()`.
- R2I przywraca literalne wywołania i nie zmienia Google sync flow.

## DECYZJE

- Nie wyłączać Stage120.
- Nie zmieniać release gate.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
