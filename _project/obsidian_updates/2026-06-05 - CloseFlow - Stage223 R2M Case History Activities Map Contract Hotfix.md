# CloseFlow / LeadFlow - Stage223 R2M Case history activities.map contract hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / CaseDetail history map contract
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2M Case history activities.map contract hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Quiet release gate blokuje `case-detail-rewrite-build-workitems-final`.
- Brakuje literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- R2M dopina brakujący kontrakt bez zmiany Stage223.

## DECYZJE

- Nie wyłączać guarda.
- Nie zmieniać release gate.
- Nie pushować bez zielonego `verify:closeflow:quiet`.

## TESTY

```powershell
node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
