# CloseFlow / LeadFlow - Stage223 R2K Panel delete clients contract hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / panel delete clients contract
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2K Panel delete clients contract hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Panel delete test wymaga literalnych tokenów w `Clients.tsx`.
- Semantyka soft-delete już była, ale zapis przez ternary nie przechodził testu.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do komunikatu powiązań.

## DECYZJE

- Nie wyłączać panel delete guard.
- Nie zmieniać release gate.
- Nie dodawać hard delete.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/panel-delete-actions-v1.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
