# CloseFlow / LeadFlow - Stage223 R2F CaseDetail trash alias guard hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / guard conflict
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2F CaseDetail trash alias guard hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2E spełnił nowszy case trash guard, ale złamał starszy Stage220A17 guard.
- Starszy guard zabrania literalnego `<EntityTrashButton`.
- Nowszy guard wymaga tokenu `EntityTrashButton`.
- R2F używa aliasu `CaseDetailTrashButton = EntityTrashButton`.

## DECYZJE

- Nie wyłączać guardów.
- Nie zmieniać release gate.
- Nie zmieniać UI ani logiki usuwania.

## TESTY

```powershell
node scripts/check-stage220a17-case-detail-vst-wiring.cjs
node scripts/check-closeflow-case-trash-actions.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
