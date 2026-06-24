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

## STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX

Date/time: 2026-06-21 Europe/Warsaw
Status: LOCAL_APPLY_PENDING_TESTS_AND_OWNER_SMOKE
Scope: LeadDetail Braki/Blokady manager toggle now persists blocker state by writing status + priority + blocksProgress + payload together. Root cause: unchecking Blokuje changed status/blocksProgress but stale priority high made shared manager re-check it after reload.
No SQL, finance, Calendar, billing, Owner Control runtime or CaseDetail runtime touched.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE

Status: TECH_APPLIED_LOCAL / OWNER_SMOKE_REQUIRED.

Zakres:
- Naprawa realnego bug smoke: LeadDetail -> Zobacz wszystkie braki -> checkbox Blokuje wracal jako zaznaczony po silent refresh/F5.
- Przyczyna: MissingItemsManagerDialog.isManagerItemBlocker liczyl blokade przez OR z
aw.status/raw.priority, wiec stare dane activity bridge mogly nadpisac swieze locksProgress=false.
- Naprawa: jawne item.isBlocker / item.blocksProgress ma pierwszenstwo przed raw/payload/status/priority fallback.

Testy:
- R9 guard/test.
- R8 regression.
- R16Z_R5 close regression.
- build / verify / diff-check.

Manual smoke:
- LeadDetail: odznacz Blokuje, F5, checkbox ma zostac odznaczony; zaznacz ponownie, F5, checkbox ma zostac zaznaczony.

Nie ruszac:
- SQL, RLS, finanse, Calendar, billing/trial, Owner Control runtime, CaseDetail runtime.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R10
LeadDetail missing checkbox real runtime fix: direct task/payload state overrides stale activity metadata; newest activity metadata wins.


## STAGE232I4_R16Z_R10_R3 closure

- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK
- owner smoke: LEAD PASS, CLIENT REGRESSION PASS
- current closed stage: STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE
- next allowed stage: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH


# STAGE232I4_R16Z_R10_R3_R4_OVERWRITE_GUARDS_FINAL

- data/czas: 2026-06-21 HH:mm Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK
- owner smoke: LEAD PASS, CLIENT REGRESSION PASS, reported by Damian
- closes: STAGE232I4_R16Z_R10 and R16Z close/status sync
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
- no SQL, no ClientDetail runtime, no CaseDetail runtime, no Calendar, no billing, no Owner Control runtime

<!-- STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS -->

## 2026-06-22 Europe/Warsaw — STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS

Status: APPLIED_PENDING_TEST_OR_PUSH.

Zakres:
- commissionStatus jest wyliczany z opłaconych wpłat prowizji, nie z ręcznego pola legacy,
- edytor finansów nie pokazuje aktywnego selecta statusu prowizji,
- buildCaseFinancePatch nie utrwala ręcznego paid/partially_paid,
- lista Lista wpłat prowizji dostaje tylko płatności type=commission,
- label brzmi Pozostało prowizji do zapłaty.

Nie dotykano: SQL/RLS, Braki/Blokady, MissingItemsManagerDialog, Owner Control, Google Calendar, billing/trial, Node_RED_Kabelki.

Kontekst: etap po zamkniętym STAGE232I4_R16Z_R10. Nie dotykać Braków/Blokad ani Owner Control.

<!-- STAGE232I3_CLOSE_STATUS_SYNC_OWNER_SMOKE_OK -->
## 2026-06-22 22:00 Europe/Warsaw - STAGE232I3_CLOSE_STATUS_SYNC_OWNER_SMOKE_OK

Status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK

Zamknieto:
- STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION.

Dowody:
- Owner Control agreguje Braki/Blokady z Lead / Sprawa / Klient,
- badge zrodla: [Lead], [Sprawa], [Klient],
- dedup: sourceEntityType + sourceEntityId + item.id,
- resolve dziala na zrodlowym item.id przez istniejaca akcje Today,
- guard/test/build/verify/diff-check PASS,
- manual smoke Damian: PASS.

Nie ruszano:
- runtime,
- SQL/RLS,
- finanse,
- kalendarz,
- billing,
- MissingItemsManagerDialog,
- LeadDetail/ClientDetail/CaseDetail runtime.

Next po I3 i K/R3:
- STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH.
<!-- /STAGE232I3_CLOSE_STATUS_SYNC_OWNER_SMOKE_OK -->

<!-- STAGE232G_R0_CALENDAR_BRIEF_CORRECTIONS_2026_06_22_CODEX -->
## 2026-06-22 Europe/Warsaw - STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT

Status: DOCS_ONLY_CORRECTION / STATUS_PRECHECK_REQUIRED

Zakres:
- rejestracja poprawionego briefu audytu R0 kalendarza;
- R0 ma sprawdzic zgodnosc routerow i nie zakladac zamkniecia I3/K bez dowodu;
- R0 ma zweryfikowac lead shadow entries, Today/Calendar parity, aktywne DOM normalizatory, Google background sync i macierz pol akcji.

Zakaz:
- runtime Calendar/Today/Lead/Case/Client,
- SQL,
- finanse,
- Braki/Blokady i Owner Control runtime.

Nastepny krok:
- Damian sprawdza diff tej korekty;
- dopiero potem wykonawca robi realny audyt R0.
<!-- /STAGE232G_R0_CALENDAR_BRIEF_CORRECTIONS_2026_06_22_CODEX -->

<!-- STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_CODEX -->
## 2026-06-22 23:35 Europe/Warsaw - STAGE232G R0 actual calendar source-truth audit

Status: R0_AUDIT_COMPLETED / REVIEW_REQUIRED / RUNTIME_NOT_TOUCHED

Key result:
- `CALENDAR_SOURCE_TRUTH_STATUS: PARTIAL`.
- Calendar route and model are real, but Today has separate date/list selectors.
- Next recommended stage: `STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX`.

Do not touch in R1 without explicit scope:
- SQL/RLS,
- finance/commission,
- MissingItems/Owner Control runtime,
- Google OAuth/sync production flow.
<!-- /STAGE232G_R0_ACTUAL_AUDIT_2026_06_22_CODEX -->

<!-- STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_CODEX -->
## 2026-06-23 06:35 Europe/Warsaw - STAGE232G R1A Calendar/Today operational entry contract

Status: R1A_READY_TO_APPLY / CONTRACT_FOUNDATION

Code context:
- `src/lib/calendar-operational-entry-contract.ts` defines the shared operational entry contract.
- `src/lib/scheduling.ts` exports the contract for Calendar/Today follow-up stages.
- Lead shadow entries must not expose complete/restore/delete until R1C makes a source-truth decision.

Do not treat R1A as full Calendar/Today parity closure.
<!-- /STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_CODEX -->


## STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX_CODEX

Data: 2026-06-23 07:25 Europe/Warsaw
Files: pi/work-items.ts, scripts/check-stage232g-r1a-work-items-ts-build-hotfix.cjs, _project/runs/STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX.md.

### STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_CODEX

Date: 2026-06-23 08:20 Europe/Warsaw
Files: TodayStable, Today adapter, R1B guard/test, CF runtime guard allowlist.
Do not treat R1B as Calendar UI parity closure.

### STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_CODEX

Date: 2026-06-23 09:10 Europe/Warsaw
Files: scheduling, lead shadow policy module, R1C guard/test, CF runtime guard allowlist.
Do not treat R1C as Calendar actions final closure.

### STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT_CODEX

Date: 2026-06-23 10:05 Europe/Warsaw
Files: Calendar, TodayStable, operational action policy module, R1D guard/test, CF runtime allowlist.
Do not treat R1D as DOM normalizer cleanup.

### STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE_CODEX

Date: 2026-06-23 11:15 Europe/Warsaw
Files: Calendar.tsx, calendar-dom-normalizer-policy.ts, R1E guard/test, CF runtime allowlist, central docs.
Do not remove month DOM normalizers without manual smoke evidence.

## STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME
- Dotyczy: api/work-items.ts Vercel tsc blocker.
- Następny etap po zielonym/pushu: wrócić do STAGE232G_R1F.

## STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE_CODEX
- Data: 2026-06-23 17:35 Europe/Warsaw
- Dotyczy: finalny parity/smoke gate dla STAGE232G Calendar/Today.
- Źródła prawdy sprawdzane przez guard: R1A operational contract, R1B Today adapter, R1C lead shadow policy, R1D action policy, R1E DOM normalizer policy, R1E1 work-items TS hotfix.
- Po zamknięciu: nie proponować nowych etapów bez błędu z aktualnej serii.

## 2026-06-23 20:05 Europe/Warsaw — STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX

Status: APPLIED_PENDING_GUARDS_AND_MANUAL_SMOKE

Zakres:
- R1G oznaczony jako false-positive smoke fail; nie commitować tamtej poprawki.
- Calendar ma utrzymać zakończony event/task po refreshu przez lokalny retention cache, gdy backendowy bundle tymczasowo nie zwraca done/completed.
- Wpis po Zrobione ma zostać widoczny, przekreślony i przesunięty na dół listy dnia; Przywróć usuwa retention.
- Guard/test: scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs oraz tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs.

Ryzyko:
- Retention działa jako undo-safety-net dla wpisów zakończonych z Calendar w tej przeglądarce. Docelowo backend/API bundle powinien zwracać done/completed zgodnie z polityką Calendar.

<!-- STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC -->
## 2026-06-24 08:00 Europe/Warsaw - STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC

Status: APPLIED_LOCAL_PENDING_GUARDS_BUILD_VERIFY_OWNER_SMOKE_PUSH.

Zakres:
- gap-close istniejacego Owner Control baseline w /today,
- Brak odpowiedzialnego dla aktywnych leadow/spraw,
- Notatka bez follow-upu z istniejacego feedu task/work-item,
- bez nowych kafelkow, bez SQL, bez Calendar/finance/billing.

Guard/test:
- scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs
- tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs

Manual smoke:
- /today, kafelek Wymaga ruchu, ownerless lead/case, note-without-follow-up, refresh/F5, liczniki zgodne z listami.
<!-- /STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC -->

## 2026-06-24 STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE

Status: APPLIED_LOCAL / NEEDS_PUSH / OWNER_SMOKE_PENDING

Decision: remove ownerless / missing responsible person logic from Owner Control. In single-user CloseFlow, a record without ownerId is not an operational issue because Damian is the implicit owner.

Keep active: note without follow-up, missing next step, overdue next step, silence, high-value without safe movement.

Tests: R1 guard/test updated, R2 guard/test added, build and verify quiet required.
