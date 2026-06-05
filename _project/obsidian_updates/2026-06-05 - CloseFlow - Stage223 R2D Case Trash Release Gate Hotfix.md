# CloseFlow / LeadFlow - Stage223 R2D Case trash release gate hotfix

Data: 2026-06-05
Typ wpisu: release gate hotfix / missing case trash marker
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2D Case trash release gate hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Stage223 R2C jest zielony do momentu quiet release gate.
- Quiet gate blokuje `case trash actions`.
- W `Cases.tsx` kosz jest, ale brakuje wymaganego markera `data-case-row-delete-action="true"`.
- R2D dodaje marker bez zmiany UI i bez zmiany logiki.

## DECYZJE

- Nie wyłączać guardów.
- Nie zmieniać release gate.
- Dodać brakujący marker kontraktu.

## TESTY

```powershell
node scripts/check-closeflow-case-trash-actions.cjs
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Po zielonym verify quiet: jeden commit/push całego Stage223.
