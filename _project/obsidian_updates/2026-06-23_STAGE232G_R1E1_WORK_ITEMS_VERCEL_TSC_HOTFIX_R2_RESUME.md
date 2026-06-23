# 2026-06-23_STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME

Data: 2026-06-23 13:35 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status
DO_WDROZENIA_LOKALNIE / HOTFIX_BUILD_BLOCKER

## Problem
Vercel/TypeScript zgłosił blokadę builda w `api/work-items.ts`:

- `Property 'blocksProgress' does not exist...`
- `Cannot find name 'existing'`

Pierwszy hotfix wykrył, że bare `existing` nadal występuje i zatrzymał się przed testami.

## Zakres R2
- naprawa helper-read dla `blocksProgress`,
- usunięcie/zmapowanie bare `existing` do in-scope row variable,
- guard/test,
- `npx tsc --noEmit --pretty false`,
- centralne wpisy projektu.

## Nie ruszać
- Calendar/Today R1F,
- SQL,
- finanse,
- Google OAuth/sync,
- Owner Control.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R3_ALLOWLIST_RESUME
- Data: 2026-06-23 14:25 Europe/Warsaw
- Cel: naprawa CF_RUNTIME_00 allowlist po R1E1/R2, bez zmiany zakresu funkcjonalnego.
- Powód: R2 naprawił api/work-items.ts, ale guard zakresu nie znał wszystkich plików hotfixu.
- Wymagane testy: R2 guard/test, CF_RUNTIME_00, tsc --noEmit, build, verify, diff-check.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R6_COMPLEX_BLOCKSPROGRESS_RESUME
- Data: 2026-06-23 17:25 Europe/Warsaw
- Cel: domknięcie R1E1 po R5: naprawa pozostałego złożonego odczytu .blocksProgress w api/work-items.ts.
- Zakres: api/work-items.ts + dopisek walidacyjny w istniejących raportach R2.
- Test: R1E1 R2 guard/test, CF_RUNTIME_00, scoped TypeScript noEmit, build, verify:closeflow:quiet, diff-check.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R7_SYNTAX_REPAIR_RESUME
- Data: 2026-06-23 17:35 Europe/Warsaw
- Cel: naprawa składni po R6, gdzie marker R6 został błędnie wstawiony w deklarację markera R2 w api/work-items.ts.
- Zakres: api/work-items.ts + dopisek walidacyjny w istniejących raportach R2.
- Test: R1E1 R2 guard/test, CF_RUNTIME_00, scoped TypeScript noEmit, build, verify:closeflow:quiet, diff-check.
