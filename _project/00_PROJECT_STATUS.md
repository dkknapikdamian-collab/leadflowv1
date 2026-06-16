# 00_PROJECT_STATUS - CloseFlow / LeadFlow

Status: projekt kodowo-biznesowy w trybie ciaglosci.

Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Lokalna sciezka: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Teza
CloseFlow ma codziennie pokazywac komu odpisac, co ruszyc, czego nie przegapic i ktore leady moga uciec.

## Wymaganie operacyjne
Po kazdym etapie aktualizuj _project, Obsidiana, test history, implementation ledger i run report.

<!-- STAGE228R2_ADMIN_FEEDBACK_RAIL_CLEANUP_STATUS -->
## 2026-06-08 08:58 Europe/Warsaw - Stage228R2 admin feedback rail cleanup

STATUS: LOCAL ONLY, build PASS, test reczny DO WYKONANIA.

FAKT:
- Wdrozono waski cleanup po `closeflow_admin_feedback_2026-06-08_08-43.json`.
- Zakres dotyczy copy/kafelkow prawego raila oraz separatora w `/funnel`.
- Lokalny browser smoke zatrzymal sie na `Ladowanie widoku...`, wiec nie zapisano pelnego sukcesu wizualnego.
<!-- /STAGE228R2_ADMIN_FEEDBACK_RAIL_CLEANUP_STATUS -->

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_STATUS_LOCAL_ONLY

FAKT:
- Brak C1-C5 jest domykany lokalnie bez SQL.
- Ostatni push przed local-only batch: Stage228R12R2.
- Stage228R13/R13R2/R14 pozostaja lokalnie do manualnego PASS C5.

STATUS:
- LOCAL_ONLY_UNTIL_MANUAL_C5_PASS.

<!-- STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->
## 2026-06-08 20:45 Europe/Warsaw - Stage228R17 missing_item delete contract

STATUS: LOCAL_ONLY_APPLIED_BY_ZIP, test reczny DO WYKONANIA.

FAKTY:
- Objaw: klikniecie Usuń przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> Usuń -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze Następny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw — Stage228R18 — missing item hard delete source truth

- problem: Brak znikał po kliknięciu Usuń, ale wracał po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma być usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma być źródłowana z linkedTasks, nie z całego timeline, żeby activity history nie odtwarzała aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test ręczny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niż soft-delete; historia usunięcia zostaje jako activity.

## 2026-06-08 21:50 Europe/Warsaw - STAGE228R18R5_MISSING_ITEM_HARD_DELETE_MASS_PREFLIGHT

### Status
- Stage228R18/R18R2/R18R3/R18R4 were not accepted as runtime fixes because their patch/apply scripts failed before stable runtime change.
- Stage228R18R5 switches to mass preflight and a safer patching strategy.

### Runtime contract
- LeadDetail missing_item delete must call `hardDeleteTaskFromSupabase(taskId)`.
- `hardDeleteTaskFromSupabase` must use `DELETE /api/system?apiRoute=tasks&id=<id>`.
- The lead view must optimistically remove the row and then use a silent refresh.
- The active Brak must not return after hard refresh.

### Guards and tests
- `scripts/check-stage228r18r5-missing-item-hard-delete-source-truth.cjs`
- `tests/stage228r18r5-missing-item-hard-delete-source-truth.test.cjs`
- guard is wired into `package.json` prebuild.

### Manual test
1. Add Brak on LeadDetail.
2. Hard refresh - Brak is visible.
3. Click Usun.
4. Hard refresh - Brak does not return.

### Risk sweep
- Hard delete is intentionally stronger than soft-delete for user-facing missing_item delete.
- The deletion activity stays in history, but it must not recreate active blocker state.
- Similar delete behavior in ClientDetail should be checked after LeadDetail is confirmed.



## 2026-06-08 22:20 Europe/Warsaw - STAGE228R19R2 missing item active source truth

- status: LOCAL_APPLIED_PENDING_MANUAL_TEST
- problem: deleted Brak/missing_item returned after hard refresh because active UI could be rebuilt from non-task/timeline source.
- decision: active Braki on LeadDetail must be sourced only from linkedTasks/work_items, not activity history.
- guard: scripts/check-stage228r19r2-missing-item-active-source-truth.cjs
- test: tests/stage228r19r2-missing-item-active-source-truth.test.cjs
- manual test: add Brak -> hard refresh -> delete -> hard refresh -> Brak does not return.
- risk sweep: ClientDetail may require an analogous source-truth sweep if the same symptom appears there.
- marker: STAGE228R19R2_MISSING_ITEM_ACTIVE_SOURCE_TRUTH

## 2026-06-13 - STAGE231F_R3 Owner Control Baseline
- Status: IMPLEMENTED_LOCAL_PASS_READY_FOR_SELECTIVE_PUSH.
- `/today` ma wspolny silnik Owner Control i pelna kolejke `Co masz zrobic dzisiaj`.
- Progi workspace: 7/14/5000 domyslnie, konfigurowalne w Ustawienia -> Aplikacja.
- Browser QA potwierdzil zapis 3/10 i trwalosc po twardym refreshu.

## 2026-06-13 - Pilny pakiet kartotek klienta i sprawy (ID: DO_POTWIERDZENIA)
- Status: LOCAL_IMPLEMENTED_AUTOMATED_PASS_MANUAL_PENDING.
- Naprawiono wartosc sprawy w Owner Control, `Razem do pobrania`, dodawanie kolejnej sprawy z klienta i powrot do klienta.
- Backup: `_local_backups/URGENT_CLIENT_CASE_FIX_20260613_124545/`.
- Build i dedykowany guard: PASS; manualny test UI: DO WYKONANIA.

## 2026-06-13 - Pakiet dzialan sprawy, finansow i czytelnosci UI (ID: DO_POTWIERDZENIA)
- Status: LOCAL_IMPLEMENTED_AUTOMATED_PASS_MANUAL_PENDING.
- Naprawiono filtrowanie zadan i wydarzen po `case_id`, jawny blad pobierania oraz natychmiastowe dopisanie utworzonego dzialania.
- Dodano migracje kanonicznych kolumn `case_items`, wspolny kontrakt kolorow finansowych, porzadek notatek i ellipsis leadow.
- Backup: `_local_backups/DO_POTWIERDZENIA_CASE_FINANCE_UI_20260613_142044/`.

## 2026-06-14 08:55 Europe/Warsaw - SQL case_items kanoniczne kolumny i test reczny
- Status: SQL_EXECUTED_SUCCESS / MANUAL_TEST_PASS.
- SQL: `SQL-20260614-001` zapisany w `_project/15_SQL_LEDGER_AND_TESTED_SQL.md`.
- Zakres: `public.case_items` - kanoniczne kolumny, w tym `description`, `order_index`, `user_id`, `owner_user_id`, `created_by_user_id`.
- Wynik Supabase: migracja wykonana komunikatem `Success. No rows returned`.
- Guard SQL: PASS; wymagane kolumny zwrocily status `OK`.
- Test reczny: ZALICZONY wedlug potwierdzenia Damiana.
- Ryzyko: `sort_order` i `order_index` istnieja rownolegle; nie usuwac zadnej kolumny bez osobnego audytu mapperow runtime.
- Nastepny krok: kazdy kolejny SQL zapisywac w centralnym SQL ledgerze i dopisywac wynik guarda/testu.


<!-- CF_RUNTIME_00_SHARED_SOURCE_TRUTH_2026_06_15_START -->
## 2026-06-15 22:56 Europe/Warsaw — CF-RUNTIME-00 Shared source-of-truth foundation

Status: PREPARED_IN_ZIP_LOCAL_APPLY
Typ: techniczny fundament / guard baseline
Zakres: route truth, status truth, missing/blocker truth, access/plan truth wrapper.

Dodane pliki:
- `src/lib/closeflow-runtime-source-truth.ts`
- `tests/cf-runtime-00-source-truth.test.cjs`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- `_project/runs/2026-06-15_CF_RUNTIME_00_SHARED_SOURCE_TRUTH.md`

Testy/guardy:
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `node --test tests/cf-runtime-00-source-truth.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

Czego nie ruszano:
- UI, LeadDetail, ClientDetail, CaseDetail, Today, Tasks, Calendar, Billing, Settings, CSS, SQL, Supabase, migrations, env.

Ryzyko:
- istniejący fallback `paid_active -> pro` w `src/lib/plans.ts` pozostaje do późniejszego etapu runtime wiring; helper tylko daje bezpieczny kontrakt.

Następny krok:
- CF-RUNTIME-01 LeadDetail missing/blocker/handoff wiring albo CF-RUNTIME-03 CaseDetail wiring.
<!-- CF_RUNTIME_00_SHARED_SOURCE_TRUTH_2026_06_15_END -->
