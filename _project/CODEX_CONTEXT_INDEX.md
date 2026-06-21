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

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE

Status: TECH_APPLIED_PENDING_OWNER_SMOKE / DO_NOT_START_STAGE232K_BEFORE_SMOKE_AND_PUSH

Zakres:
- R16O guard/test consolidated with final R16Z_R4 visual source truth.
- Final manager layout remains 760px, flex row, readable Blokuje, visible Uzupełnij/Usuń.
- ClientDetail and LeadDetail shared MissingItemsManagerDialog wiring is protected.
- No SQL, no finance, no Calendar, no Owner Control runtime, no CaseDetail runtime.

Tests required before push:
- node scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs
- node --test tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs
- node scripts/check-stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.cjs
- node --test tests/stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.test.cjs
- node scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs
- node --test tests/stage232i4-r16z-r5-missing-manager-close-guard-consolidation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

Next:
- Manual smoke ClientDetail + LeadDetail.
- Only after smoke OK and push PASS consider STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH.

## STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Status: LOCAL APPLY CONTINUATION / guards consolidated before final smoke and push.
Scope: CF-RUNTIME-00 and R16Z_R5 close guard allow the R5_R5 ClientDetail operational center test compatibility repair and R6 final allowlist files. No SQL, finance, Calendar, billing, Owner Control runtime or CaseDetail runtime touched.

## STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Status: APPLIED_LOCAL_PENDING_VERIFY_AND_SMOKE
Scope: guard/test compatibility continuation for polish-mojibake-audit. The audit now skips local stage backup artifacts and huge text-like files before reading them, preventing ERR_STRING_TOO_LONG during verify:closeflow:quiet. No product logic, SQL, finance, Calendar, Owner Control runtime or CaseDetail runtime touched.
