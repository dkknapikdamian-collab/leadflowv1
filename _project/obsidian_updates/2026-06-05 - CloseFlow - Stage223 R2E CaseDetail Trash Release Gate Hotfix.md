# CloseFlow / LeadFlow - Stage223 R2E CaseDetail trash release gate hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / CaseDetail shared trash source
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2E CaseDetail trash release gate hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- CaseDetail miał delete action, ale nie używał `EntityTrashButton`.
- Release gate wymaga wspólnego source of truth dla kosza.
- R2E dopina CaseDetail do `EntityTrashButton` i `trashActionIconClass`.

## DECYZJE

- Nie wyłączać guardów.
- Nie zmieniać release gate.
- Nie zmieniać Activity Truth ani Today.

## TESTY

```powershell
node scripts/check-closeflow-case-trash-actions.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
