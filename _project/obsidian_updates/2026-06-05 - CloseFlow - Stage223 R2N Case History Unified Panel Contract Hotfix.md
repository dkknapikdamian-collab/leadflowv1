# CloseFlow / LeadFlow - Stage223 R2N Case history unified panel contract hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / CaseDetail history unified panel contract
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2N Case history unified panel contract hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Quiet release gate blokuje `case-detail-history-visual-p1-repair3`.
- Brakuje literalnego `case-detail-history-unified-panel` w `CaseDetail.tsx`.
- R2N dopina brakujący kontrakt bez zmiany Stage223.

## DECYZJE

- Nie wyłączać guarda.
- Nie zmieniać release gate.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
