# 2026-06-24_STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT

Data/czas: 2026-06-24 HH:mm Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status do wpisania w Obsidian

STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT:
APPLIED_LOCAL_PENDING_TESTS / OWNER_SMOKE_PENDING

## Streszczenie

Wdrozenie dodaje obowiazkowy kontrakt next step dla Owner Control / Today bez tworzenia nowego zrodla prawdy. Owner Control korzysta z istniejacych task/event/follow_up i nextActionAt/followUpAt. Klient jest uwzgledniany tylko gdy faktycznie wymaga obslugi, a ownerless noise nie wraca.

## Pliki repo

- src/lib/owner-control/owner-control-baseline.ts
- src/lib/owner-control/next-move-contract.ts
- src/pages/TodayStable.tsx
- scripts/check-stage-a35b-mandatory-next-step-contract.cjs
- tests/stage-a35b-mandatory-next-step-contract.test.cjs
- _project/runs/STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT.md

## Wyniki testow

Do wykonania lokalnie przez apply script.

## Zakaz / granice

Nie wykonano SQL. Nie dodano tabel. Nie ruszono finansow, billing, Google Calendar, AI Drafts, DudekHome ani .tmp.driveupload.

## Manual smoke

OWNER_SMOKE_PENDING zgodnie z run reportem.

## STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R3

Status: APPLIED_PENDING_COMMANDS / OWNER_SMOKE_PENDING

R2 stopped on a false-positive test: the implementation marker said "without UI redesign", and the test rejected /A35B.*redesign/i. R3 corrects only the brittle test assertion. No SQL, no finance, no billing, no Calendar, no AI Drafts.


## STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R5_CF_RUNTIME_ALLOWLIST_SYNC

Status: APPLIED_LOCAL / VERIFY_PENDING

Zakres:
- zsynchronizowano allowlistę CF-RUNTIME-00 dla plików etapu STAGE-A35B,
- nie zmieniano runtime Owner Control ani Today,
- cel: odblokować verify:closeflow:quiet po zielonym guard/test/build A35B.

Czas zapisu technicznego: 2026-06-24T19:16:42.068Z
