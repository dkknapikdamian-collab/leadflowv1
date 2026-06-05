# CloseFlow / LeadFlow - Stage223 R2 Owner Movement Risk System

Data: 2026-06-05
Typ wpisu: etap local-only / owner movement risk system
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223 R2 Owner Movement Risk System
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Dodano next-move-contract.
- Dodano activity-truth.
- Owner-risk-rules używa obu kontraktów.
- Badge leadów używają activity truth przez record-operational-badges.
- Testy runtime wywołują funkcje przez esbuild.
- Today nie dostaje nowej sekcji.

## DECYZJE DAMIANA

- Nie pushować podetapów A-D osobno.
- Nie udawać kontaktu przez updatedAt.
- Ryzyko ma być przy rekordzie i zbiorczo w istniejącym Today.

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

Sprawdzić testy. Jeśli zielone, przejść do D2 UI work-center albo Today risk ranking.
