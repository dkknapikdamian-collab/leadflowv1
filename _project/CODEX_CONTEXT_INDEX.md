# CODEX_CONTEXT_INDEX - legacy bridge

Status: LEGACY_BRIDGE
Read policy: REDIRECT_TO_AI_START
Project: CloseFlow / LeadFlow

Ten plik zostaje tylko dla starych workflowow, ktore szukaja CODEX_CONTEXT_INDEX.md.

Nowy start repo:

1. AGENTS.md
2. _project/00_AI_START_SPIS_TRESCI.md
3. Obsidian: 10_PROJEKTY/CloseFlow_Lead_App/00_AI_START_SPIS_TRESCI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md
4. Project TOC fallback: 10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md

Nie czytaj calego repo ani calego _project na podstawie tego pliku.

## 2026-06-17 17:40 Europe/Warsaw - STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT

Status: PASS_PUSHED / CLOSED / AUDIT_CONTRACT_ONLY

Zakres:
- utworzono kontrakt cross-entity Braki/Blokady dla Lead / Case / Client,
- runtime nie byl wdrazany,
- SQL nie byl wdrazany,
- UI nie bylo ruszane.

Deliverables:
- _project/contracts/STAGE232I0_MISSING_BLOCKER_CROSS_ENTITY_CONTRACT.md
- _project/runs/STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT.md
- _project/obsidian_updates/2026-06-17_STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT.md
- scripts/check-stage232i0-missing-blocker-cross-entity-contract.cjs
- tests/stage232i0-missing-blocker-cross-entity-contract.test.cjs

## 2026-06-17 22:45 Europe/Warsaw - STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

Status: PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK

Zakres:
- CaseDetail Braki/Blokady jako missing_item z caseId,
- case_items zostaja legacy/checklist compatibility,
- resolve/delete i historia missing_item_created/resolved/deleted,
- bez SQL, bez ClientDetail runtime, bez Owner Control cross-entity.

Testy:
- guard STAGE232I1: PASS,
- test STAGE232I1: 5/5 PASS,
- CF-RUNTIME-00: PASS,
- build: PASS,
- verify:closeflow:quiet: PASS,
- manual smoke CaseDetail: PASS.

## 2026-06-17 22:55 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: SKIPPED_BY_DAMIAN / NIE WDRAZAC

Powod:
- Damian potwierdzil, ze modal Dodaj brak jest OK,
- nie robimy osobnego visual-fix R8,
- nastepny aktywny etap byl STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME; etap domkniety po guardach, buildzie, verify i manual smoke.

Nastepny etap:
- STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION.

## 2026-06-18 19:56 Europe/Warsaw - STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION

Status: TECH_IN_REPO / LOCAL_GUARDS_PASS / NEEDS_MANUAL_SMOKE

Zakres:
- Owner Control / Today pokazuje aktywne Braki/Blokady z istniejacych task/work item missing_item.
- Zrodla: Lead / Sprawa / Klient.
- Badge zrodla: [Lead], [Sprawa], [Klient].
- Dedup: sourceEntityType + sourceEntityId + item.id.
- Resolve dziala na zrodlowym task.id przez istniejaca akcje Today.
- Bez SQL, bez aktywnego case_items, bez runtime zmian ClientDetail/CaseDetail.

Testy lokalne:
- guard STAGE232I3: PASS.
- node test STAGE232I3: PASS.
- CF-RUNTIME-00: PASS po I3 scope compat.
- build: PASS.
- verify:closeflow:quiet: PASS.
- git diff --check: PASS.

Nastepny krok:
- manual smoke Owner Control, potem status sync I3 close.


## 2026-06-18 Europe/Warsaw — STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST
- Status: TECH_IN_REPO / LOCAL_GUARDS_REQUIRED / NEEDS_MANUAL_SMOKE after implementation.
- Scope: ClientDetail visual/runtime cleanup for Braki/Blokady.
- Decision: move Braki/Blokady client summary into the fourth top tile next to existing ClientTopTiles, following LeadDetail blocker-card visual source truth.
- Source truth stays STAGE232I2 missing_item aggregation: Klient / Lead / Sprawa, no SQL, no case_items active source.
- Guard: scripts/check-stage232i4-client-missing-top-tile-vst.cjs.
- Test: tests/stage232i4-client-missing-top-tile-vst.test.cjs.
- Next after smoke: status sync, then STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH if no regressions.
