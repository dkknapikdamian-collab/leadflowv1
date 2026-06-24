# STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT

Data/czas: 2026-06-24 21:30 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK

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
- scripts/check-cf-runtime-00-source-truth.cjs
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

## Testy wykonane

```powershell
node scripts/check-cf-runtime-00-source-truth.cjs
node scripts/check-stage-a35b-mandatory-next-step-contract.cjs
node --test tests/stage-a35b-mandatory-next-step-contract.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

Wynik:
- CF-RUNTIME-00 guard: PASS.
- A35B guard: PASS.
- A35B node test: 10/10 PASS.
- npm run build: PASS.
- npm run verify:closeflow:quiet: PASS.
- git diff --check: PASS.
- Selective commit/push: PASS.
- Commit pushed: 3a1bd164 fix(closeflow): enforce mandatory next step owner control contract.

## Manual smoke

MANUAL_SMOKE_OK - push script `PUSH_STAGE_A35B_AFTER_OWNER_SMOKE_OK_REPAIR_R5_2026_06_24.ps1` zostal uruchomiony po sciezce owner-smoke-ok.

## Ryzyka

- Reguly aktywnego klienta moga wymagac doprecyzowania po dalszym realnym smoke na danych produkcyjnych.
- Jesli dane klientow maja inne statusy aktywnosci, trzeba dopisac status do ACTIVE_CLIENT_SERVICE_STATUSES, nie robic SQL.

## STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R3 - test false-positive repair

Status: CLOSED_AS_PART_OF_A35B

Reason: R2 implementation passed guard and 9/10 tests, but the Today test failed because the stage marker text contained the phrase "without UI redesign" while the test asserted against /A35B.*redesign/i. This was a test false positive, not a runtime failure.

Change: the test now checks that Today still uses the existing TodaySectionKey model and does not add explicit redesign markers/panels.

## STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT_REPAIR_R5_CF_RUNTIME_ALLOWLIST_SYNC

Status: CLOSED_AS_PART_OF_A35B

Zakres:
- zsynchronizowano allowliste CF-RUNTIME-00 dla plikow etapu STAGE-A35B,
- nie zmieniano runtime Owner Control ani Today,
- odblokowano verify:closeflow:quiet po zielonym guard/test/build A35B.

## Closeout status sync R2 - 2026-06-24 21:30 Europe/Warsaw

Status: PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK

Zakres:
- docs/status sync only,
- bez zmian runtime,
- bez SQL,
- bez finansow, billing, Google Calendar, AI Drafts, DudekHome i .tmp.driveupload.
