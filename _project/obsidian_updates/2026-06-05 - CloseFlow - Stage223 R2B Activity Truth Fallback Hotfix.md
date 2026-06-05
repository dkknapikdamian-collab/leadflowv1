# CloseFlow / LeadFlow - Stage223 R2B Activity Truth fallback hotfix

Data: 2026-06-05
Typ wpisu: hotfix local-only / runtime test fix
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2B Activity Truth fallback hotfix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Stage223 R2 wykrył realny błąd runtime.
- `updatedAt` fallback nadpisywał prawdziwą aktywność.
- R2B rozdziela real activity od fallback activity.

## DECYZJE

- Nie pushować Stage223, dopóki runtime testy nie przejdą.
- Fallback `updatedAt/createdAt` tylko, jeśli nie ma realnej aktywności.

## TESTY

```powershell
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-risk-runtime-contract.test.cjs
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Zielone testy → jeden commit/push całego Stage223 R2.
