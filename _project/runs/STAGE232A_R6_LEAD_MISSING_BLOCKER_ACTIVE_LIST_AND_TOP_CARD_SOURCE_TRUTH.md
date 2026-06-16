# STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH

- data i godzina: 2026-06-16 04:08 Europe/Warsaw
- status: PASS_LOCAL_DO_SPRAWDZENIA
- typ: implementation stage / R6-R2 resilient repair
- zakres: aktywne Braki/Blokady w LeadDetail + metadata persistence z MissingItem modal
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Scan
R6 i R6-R1 przerwaly przed zmianami przez kruche kotwice patchera.
R6-R2 patchuje po strukturze realnych funkcji i selectorow:
- isMissingItemTimelineEntry
- isWorkItemOverdue
- activeMissingItemEntriesStage228R19R2
- leadBlockerEntries
- insertTaskToSupabase

## Zmiany
- LeadDetail: activeMissingItemEntriesStage232AR6 z linkedTasks.
- LeadDetail: leadBlockerEntries jako subset przez isLeadBlockerTaskStage232AR6.
- ContextActionDialogs: task missing_item dostaje missingKind/blocksProgress/blockScope/payload.
- Guard/test R6 dodane.

## Testy
Do wykonania przez apply:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

## Manual smoke
- TEST BRAK R6 bez blokady: Braki tak, Blokada nie, historia tak.
- TEST BLOKADA R6 z blocksProgress: Braki tak, Blokada tak, historia tak.
- Hard refresh: metadata zostaje.
- Rozwiazanie braku usuwa z aktywnych, zostawia w historii.


## 2026-06-16 04:20 Europe/Warsaw - STAGE232A_R6_R3_CF_RUNTIME_SCOPE_GUARD_COMPAT

Status: PASS_LOCAL_DO_SPRAWDZENIA

Korekta:
- R6-R2 przeszedl patch, guard R6, test R6 i build.
- verify:closeflow:quiet zatrzymal sie na CF-RUNTIME-00 source truth guard, bo stary guard blokowal pliki R6 jako out-of-scope.
- R6-R3 rozszerza allowlist CF-RUNTIME scope guarda o jawne pliki R6.
- To nie zmienia logiki LeadDetail/ContextActionDialogs; to kompatybilnosc guardow po zamknietym CF-RUNTIME-00.

Testy:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check
