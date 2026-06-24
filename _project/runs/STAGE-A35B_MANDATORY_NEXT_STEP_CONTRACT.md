# STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT

Data/czas: 2026-06-24 HH:mm Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

APPLIED_LOCAL_PENDING_TESTS / OWNER_SMOKE_PENDING

## Cel

Owner Control / Today pokazuje realny brak nastepnego kroku operacyjnego dla aktywnych rekordow:
- Lead bez next step,
- Sprawa bez next step,
- Klient bez next step tylko gdy faktycznie wymaga obslugi,
- zalegly next step wyzej niz zwykly brak,
- cisza 7/14+ oraz wysoka wartosc bez ruchu dalej jako sygnaly.

## Zakres techniczny

Zmienione:
- src/lib/owner-control/owner-control-baseline.ts
- src/lib/owner-control/next-move-contract.ts
- src/pages/TodayStable.tsx
- scripts/check-stage-a35b-mandatory-next-step-contract.cjs
- tests/stage-a35b-mandatory-next-step-contract.test.cjs
- _project documentation files

Nie zmieniano SQL, RLS, migracji, finansow, billing, Google Calendar, AI Drafts, LeadDetail, CaseDetail, ClientDetail runtime, DudekHome ani .tmp.driveupload.

## Decyzje wdrozeniowe

- Next step jest agregowany z istniejacych zrodel: task/event/follow_up oraz istniejace pola nextActionAt/followUpAt.
- Nie powstala nowa tabela ani osobne zrodlo prawdy Owner Control.
- Owner Control blokuje ownerless task/event rows: task/event musi miec source Lead/Sprawa/Klient.
- Klient bez next step trafia do Owner Control tylko po przejsciu clientRequiresOwnerControlRecord.
- Duplikat Lead/Client jest tlumiony przez clientIdsWithRelatedRecordProblem.
- Zalegly next step ma priorytet 150, zwykly brak next step 130, blokujace braki z I3 zostaja w osobnym mechanizmie missing item.

## Testy wymagane

```powershell
node scripts/check-stage-a35b-mandatory-next-step-contract.cjs
node --test tests/stage-a35b-mandatory-next-step-contract.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Manual smoke

OWNER_SMOKE_PENDING zgodnie z instrukcja etapu.

## Ryzyka

- Reguly aktywnego klienta moga wymagac doprecyzowania po realnym smoke na produkcyjnych danych.
- Jesli dane klientow maja inne statusy aktywnosci, trzeba dopisac status do ACTIVE_CLIENT_SERVICE_STATUSES, nie robic SQL.

## STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R3 — test false-positive repair

Status: APPLIED_PENDING_COMMANDS

Reason: R2 implementation passed guard and 9/10 tests, but the Today test failed because the stage marker text contained the phrase "without UI redesign" while the test asserted against /A35B.*redesign/i. This was a test false positive, not a runtime failure.

Change: the test now checks that Today still uses the existing TodaySectionKey model and does not add explicit redesign markers/panels.

Manual smoke: OWNER_SMOKE_PENDING.


## STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R5_CF_RUNTIME_ALLOWLIST_SYNC

Status: APPLIED_LOCAL / VERIFY_PENDING

Zakres:
- zsynchronizowano allowlistę CF-RUNTIME-00 dla plików etapu STAGE-A35B,
- nie zmieniano runtime Owner Control ani Today,
- cel: odblokować verify:closeflow:quiet po zielonym guard/test/build A35B.

Czas zapisu technicznego: 2026-06-24T19:16:42.068Z
