# CloseFlow / LeadFlow - Stage222 R2B Settings/Cases hotfix

Data: 2026-06-05
Typ wpisu: hotfix po częściowym pushu
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage222 R2B
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE222_R2B_OWNER_RISK_SETTINGS_CASES_HOTFIX
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Commit Stage222 R2 `7ff0bc08` został wypchnięty mimo czerwonego guard/test.
- Build przeszedł, ale Settings section i Cases badges nie były dopięte.
- Hotfix R2B domyka brakujące Settings/Cases.

## DECYZJE

- Nie rollbackować, tylko dopchnąć hotfix.
- Nie używać `git add .`.
- Po zielonych testach push jako osobny commit.

## TESTY

```powershell
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
git diff --check
```

## NASTĘPNY KROK

Commit/push R2B po zielonych testach.
