# CloseFlow / LeadFlow - Stage222 Owner Risk Rules Foundation

Data: 2026-06-05
Typ wpisu: etap local-only / foundation
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage222 R2 Owner Risk Rules Foundation
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE222_OWNER_RISK_RULES_FOUNDATION
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Dodano helper owner-risk-rules jako jedno źródło prawdy ryzyka.
- Dodano ustawialny próg wysokiej wartości.
- Dodano jawny fallback ustawień owner risk.
- Lead badge korzystają z owner-risk-rules przez helper record-operational-badges.
- Cases dostają badge ryzyka.
- Today nie dostaje nowej sekcji.

## DECYZJE DAMIANA

- Nie budować drugiego Today.
- Ryzyko ma być przy rekordzie i zbiorczo w istniejącej sekcji.
- Próg wysokiej wartości ma być ustawialny.
- Push dopiero po akceptacji.

## DO POTWIERDZENIA

- Backendowy zapis progu w workspace settings / Supabase.

## TESTY

```powershell
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Stage223 — Mandatory Next Move / Next Step Contract.
