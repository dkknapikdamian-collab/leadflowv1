# CloseFlow / LeadFlow - Stage223 R2L-V2 Case history row contract hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / CaseDetail history row contract
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2L-V2 Case history row contract hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- R2L-V1 był zbyt ścisły i zatrzymał się na lokalnym wariancie `CaseDetail.tsx`.
- Quiet release gate dalej wymaga literalnego `case-history-row`.
- R2L-V2 dopina trzy literalne kontrakty wymagane przez test.

## DECYZJE

- Nie wyłączać guarda.
- Nie zmieniać release gate.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
