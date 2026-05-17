# 14_TEST_HISTORY - CloseFlow / LeadFlow

## 2026-05-16 - Memory protocol and Obsidian mapping closeout

### TESTY AUTOMATYCZNE

- GitHub connector presence checks for required files and markers.
- Dedicated runtime tests were not executed because this was an organizational stage and no runtime UI, routing, product logic, styles or architecture were changed.

### GUARDY

BRAK DEDYKOWANEGO GUARDA DLA ETAPU MAPOWANIA OBSIDIANA — wykonano testy obecnosci plikow i markerow przez GitHub scan.

### TESTY RECZNE

BRAK POTWIERDZONEGO TESTU RECZNEGO — etap organizacyjny, bez zmian runtime UI.

### DO POTWIERDZENIA LOKALNIE

After pulling locally, run:

```powershell
$AppRepo="C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$Vault="C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"

Test-Path "$AppRepo\AGENTS.md"
Test-Path "$AppRepo\_project\00_PROJECT_MEMORY_PROTOCOL.md"
Test-Path "$AppRepo\_project\STAGE_TEMPLATE_MINIMAL.md"
Test-Path "$AppRepo\_project\runs\2026-05-16_0854_closeflow_memory_protocol_v1.md"
Select-String -Path "$AppRepo\AGENTS.md" -Pattern "DAMIAN_MINIMAL_PROJECT_MEMORY_PROTOCOL_START"

Test-Path "$Vault\10_PROJEKTY\CloseFlow_Lead_App\00_START - CloseFlow Lead App.md"
Select-String -Path "$Vault\PROJECTS.md" -Pattern "CloseFlow_Lead_App"

git -C $AppRepo status --short
git -C $Vault status --short
```

## 2026-05-16 — Stage92 calendar selected day readable actions {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

- Test/guard: `node --test tests/stage92-calendar-selected-day-readable-actions.test.cjs`.
- Wymusza pełne typy wpisów, `data-cf-entry-title`, pełny zestaw akcji, brak aktywnego legacy selected-day renderu i brak osobnego pustego paska.
- Status testu ręcznego: TEST RĘCZNY DO WYKONANIA na `/calendar`.

## 2026-05-16 — Stage93 calendar week rail cleanup
- Added and ran `tests/stage93-calendar-week-rail-cleanup.test.cjs`.
- Guard checks no active `calendar-week-filter-list hidden`, no legacy week filter buttons, plain count text, and quiet gate wiring.

## STAGE93_GUARD_FIX_AND_STAGE94_SWEEP_2026_05_16

- `node --test tests/stage93-calendar-week-rail-cleanup.test.cjs` - do wykonania przez skrypt paczki.
- `node scripts/check-closeflow-calendar-ui-sweep-stage94.cjs` - raport diagnostyczny, nie pełny test release.

## STAGE94 calendar consolidated cleanup tests

- Added/updated tests/stage94-calendar-consolidated-cleanup.test.cjs.
- Runs Stage92, Stage93, Stage94 targeted guards from the local ZIP apply script.
- Runs scripts/check-closeflow-calendar-ui-sweep-stage94.cjs as P1/P2 regression scanner.
- Full quiet gate remains optional via -RunQuietGate.

## STAGE94_SWEEP_REGEX_FIX_V4_TEST_HISTORY_2026_05_16

- node --check scripts/check-closeflow-calendar-ui-sweep-stage94.cjs`
- node --test tests/stage92-calendar-selected-day-readable-actions.test.cjs`
- node --test tests/stage93-calendar-week-rail-cleanup.test.cjs`
- node --test tests/stage94-calendar-consolidated-cleanup.test.cjs`
- node scripts/check-closeflow-calendar-ui-sweep-stage94.cjs`

## Stage94 Calendar weekly plan full entry text - 2026-05-16

- Added and ran tests/stage94-calendar-week-plan-full-entry-text.test.cjs.
- Guard verifies full labels, visible data-cf-entry-title, full actions and frozen month grid exception.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V2
- Added/ran `tests/stage94-calendar-week-plan-full-entry-text.test.cjs`.
- Required before push: manual /calendar week view check.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V3
- Added/ran `tests/stage94-calendar-week-plan-full-entry-text.test.cjs`.
- Required before push: manual /calendar week view check.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4

- Target guard: `node --test tests/stage94-calendar-week-plan-full-entry-text.test.cjs`.
- Manual test required: /calendar, week view, full entry title and full type visible.

## Stage95 destructive action guard
- Added and ran tests/stage95-destructive-action-visual-source.test.cjs.
- Existing Stage92/93/94 calendar guards remain optional regression checks in the local apply script.

## Stage95 V2 destructive action guard rerun
- Re-ran tests/stage95-destructive-action-visual-source.test.cjs after removing the CSS selector that contained bg-red/bg-rose class names.


## Stage96 leads right rail width and position
- Guard: `node --test tests/stage96-leads-right-rail-width-position.test.cjs`.
- Sprawdza kolejność SimpleFiltersCard przed TopValueRecordsCard, brak 195px/300px lokalnego override i wspólne CSS variables.

- Stage96 V2: `tests/stage96-leads-right-rail-width-position.test.cjs` guards /leads SimpleFiltersCard before TopValueRecordsCard, shared rail width tokens, no 195px rail, and SimpleFiltersCard import hygiene.

### Stage96 V3 - Leads right rail width/position
- Targeted guard: tests/stage96-leads-right-rail-width-position.test.cjs`
- Scope: /leads right rail width and position parity with /clients.
- Expected: Filtry proste before Najcenniejsze leady; no local narrow rail override.

### Stage96 V4 - Leads right rail width/position
- Targeted guard: tests/stage96-leads-right-rail-width-position.test.cjs`
- Expected: filters above top value card, shared rail width source truth, no local rail grid class on /leads.

## STAGE96_V5_TEST_HISTORY
- Added/finalized tests/stage96-leads-right-rail-width-position.test.cjs.
- Targeted command: node --test tests/stage96-leads-right-rail-width-position.test.cjs.


## Stage97 test - Today overdue task done button

- Added: tests/stage97-today-overdue-task-done-button.test.cjs.
- Scope: verifies overdue task rows are not edit-only and pass taskId + doneKind=task to RowLink.

## HOTFIX_STAGE96_CSS_MEDIA_BRACE_2026_05_16
- Required: node scripts/closeflow-release-check-quiet.cjs after CSS brace fix.


## HOTFIX_STAGE94_COMPLETED_EVENT_VISUAL_CONTRACT_2026_05_16
- Required: node --test tests/calendar-completed-event-behavior.test.cjs`
- Required: node scripts/closeflow-release-check-quiet.cjs`


## HOTFIX_STAGE94_COMPLETED_EVENT_VISUAL_CONTRACT_2026_05_16
- Required: node --test tests/calendar-completed-event-behavior.test.cjs`
- Required: node scripts/closeflow-release-check-quiet.cjs`

### STAGE98_100_RECOVERY_FROM_CLEAN_V3 - 2026-05-16
Expected checks: Stage98, Stage99, Stage100, Stage32, Stage96 and CloseFlow quiet release gate.

## STAGE102_CALENDAR_EDIT_MODAL_FORM_SOURCE - 2026-05-16

### TESTY AUTOMATYCZNE / GUARDY

- `node --test tests/stage102-calendar-edit-modal-form-source.test.cjs` - target guard.
- `npm run build` - build check.
- `npm run verify:closeflow:quiet` - full quiet gate when requested.
- Stage102C local-only fix: remove mojibake introduced in Stage102 test history before rerunning Stage98.

### TEST RECZNY

Status: `TEST RECZNY DO WYKONANIA` na `/calendar`.

Sprawdzic create event, create task, edit event, edit task, jasne pola/selecty/scroll/stopke i zapis po edycji.

### UWAGA LOCAL-ONLY

Ten fix jest local-only. Skrypt nie tworzy commita i niczego nie wysyla. Po testach decyzja o dalszym ruchu nalezy do Damiana.

<!-- STAGE103_CALENDAR_MONTH_GRID_DAY_STATES_V3_TEST_HISTORY -->
## Stage103 V3 / Stage103F - Calendar month grid day states

Automatic checks:
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage103-calendar-month-grid-day-states.test.cjs`
- `npm run build`
- `node scripts/closeflow-release-check-quiet.cjs`

Manual UI test - TO DO:
1. Open /calendar.
2. Switch to Month.
3. Confirm today has a subtle green tint/border.
4. Confirm past days are greyed but readable.
5. Confirm selected day has a calm blue border.
6. Confirm there is no top count Badge near the day number.
7. Click + wiecej and confirm the selected-day panel is selected/scrolled into view.


<!-- STAGE104_CALENDAR_PERFORMANCE_F -->
## 2026-05-16 â€” Stage104 / Paczka F â€” Calendar loading performance

STATUS: WDROŻONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien już liczyć `combineScheduleEntries` wprost w renderze.
- Dni miesiąca i tygodnia korzystają z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien już używać `getEntriesForDay(...)` w render path.
- `cases` idą z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- Pełnostronicowy loader został zastąpiony małym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeśli nie użyto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiąca zostały nietknięte i wymagają osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test ręczny `/calendar`: start, tydzień, miesiąc, wybrany dzień, edycja, +1H/+1D/+1W, zrobione, usuń.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G â€” Templates delete + visual contract â€” 2026-05-16

STATUS: WDROŻONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostał widoczny przycisk Usuń na karcie szablonu.
- Delete używa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeśli szablon ma pozycje checklisty.
- Karta szablonu używa cf-template-card cf-readable-card i markerów
ecord-list-source-truth.
- Stary marker data-a16-template-light-ui nie jest aktywnym source of truth dla stylu.

TESTY:
-
ode tests/stage105-templates-delete-and-visual-contract.test.cjs
-
pm run build

TEST R\u00c4\u0098CZNY:
- DO WYKONANIA na /templates: create/edit/duplicate/delete z confirmami.

RYZYKO:
- Ten etap nie dodaje backendowego sprawdzania, czy szablon został użyty w aktywnych sprawach. Wymusza świadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- Przetestować /templates; dopiero potem zdecydować, czy robimy kolejny lokalny etap czy wspólny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->


## Stage98B V5 mojibake hard gate - 2026-05-16

AUTOMATIC TESTS REQUIRED BY PACKAGE:
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `npm run verify:closeflow:quiet`

EXPECTED RESULT:
- Stage98 guard returns zero mojibake hits in `src`, `tests`, `scripts` and `_project`.
- Quiet release gate runs Stage98 preflight before production build.

MANUAL TEST:
- `/calendar`: verify Polish labels in selected day, next-days plan, relation links and entry actions.
- Status: TEST RECZNY DO WYKONANIA.


- V5 C1-control mojibake repair: handles leftover raw control-byte mojibake that V4 exposed in LeadDetail.tsx.


## 2026-05-16 - Stage98B V6 mojibake hard gate resume

Expected automatic checks:

- PASS: package self-check finds all payload files.
- PASS: `node --check` on Stage98 guard and repair helper.
- PASS: Stage98 repo-wide mojibake guard.
- PASS: `git diff --check`.
- PASS: `npm run verify:closeflow:quiet`.

Manual check remains required: `/calendar` and `/lead/:id` Polish labels after deployment.
<!-- STAGE98B_V6_TEST_HISTORY -->


## 2026-05-16 - Stage98B V7 mojibake hard gate resume

Expected automatic checks:

- PASS: package self-check finds all payload files.
- PASS: `node --check` on Stage98 guard and repair helper.
- PASS: Stage98 repo-wide mojibake guard.
- PASS: `git diff --check`.
- PASS: `npm run verify:closeflow:quiet`.

Manual check remains required: `/calendar` and `/lead/:id` Polish labels after deployment.
<!-- STAGE98B_V7_TEST_HISTORY -->


## 2026-05-16 - Stage98B V8 mojibake hard gate resume

Expected automatic checks:

- PASS: package self-check finds all payload files.
- PASS: `node --check` on Stage98 guard and repair helper.
- PASS: Stage98 repo-wide mojibake guard.
- PASS: `git diff --check`.
- PASS: `npm run verify:closeflow:quiet`.

Manual check remains required: `/calendar` and `/lead/:id` Polish labels after deployment.
<!-- STAGE98B_V8_TEST_HISTORY -->

- V8: Windows-safe git ProcessStartInfo wrapper; resume after V7 stderr warning failure.


## 2026-05-16 - Stage98B V9 mojibake hard gate resume

Expected automatic checks:

- PASS: package self-check finds all payload files.
- PASS: `node --check` on Stage98 guard and repair helper.
- PASS: Stage98 repo-wide mojibake guard.
- PASS: `git diff --check`.
- PASS: `npm run verify:closeflow:quiet`.

Manual check remains required: `/calendar` and `/lead/:id` Polish labels after deployment.
<!-- STAGE98B_V9_TEST_HISTORY -->

- V9: whitespace cleanup before git diff --check; resume after V8 real trailing-whitespace failure.

<!-- STAGE98B_V10_TEST_HISTORY -->
## 2026-05-16 - Stage98B V10 broad test history

Required checks:
- `node --check tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --check` for every changed `.js/.cjs/.mjs`
- `git diff --check`
- `npm run verify:closeflow:quiet`

Status after package run:
- To be filled by local PowerShell output.
- Manual test: `/calendar` selected-day and week-plan Polish labels.

<!-- STAGE98B_V11_TEST_HISTORY -->
## 2026-05-16 - Stage98B V11 broad test history

Required checks:
- `node --check tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- ``node --check` for all `.js/.cjs/.mjs` under `scripts`, `tests`, `tools`, plus every changed `.js/.cjs/.mjs`
- `git diff --check`
- `npm run verify:closeflow:quiet`

Status after package run:
- To be filled by local PowerShell output.
- Manual test: `/calendar` selected-day and week-plan Polish labels.


<!-- STAGE98B_V16_FINALIZER -->

## Stage98B V16 mojibake hard gate finalizer

- Status: package-run finalizer after V15 raw BOM regression in quiet gate.
- Scope: repo-wide encoding hygiene, Stage98B preflight in quiet release gate, broad syntax sweep for scripts/tests/tools, whitespace diff check and quiet release gate.
- Decision: encoding hygiene must run after every generated write, especially after hardening quiet gate.
- Manual test: calendar UI still requires Damian confirmation after push.


<!-- STAGE98B_V17_SAFE_GUARD_FINALIZER -->

## Stage98B V17 safe guard finalizer

- Status: resume-safe finalizer after V16 false-positive guard corruption.
- Scope: safe ASCII Stage98B guard, repo-wide encoding hygiene, quiet release gate preflight, broad syntax sweep for scripts/tests/tools, whitespace diff check and quiet release gate.
- Decision: Stage98 guard must not contain literal bad fragments that hygiene can erase into empty strings.
- Manual test: calendar UI still requires Damian confirmation after push.


<!-- STAGE98B_V18_SAFE_GUARD_FINALIZER -->

## Stage98B V18 safe guard finalizer

- Status: resume-safe finalizer after V16 false-positive guard corruption.
- Scope: safe ASCII Stage98B guard, repo-wide encoding hygiene, quiet release gate preflight, broad syntax sweep for scripts/tests/tools, whitespace diff check and quiet release gate.
- Decision: Stage98 guard must not contain literal bad fragments that hygiene can erase into empty strings.
- Manual test: calendar UI still requires Damian confirmation after push.


<!-- STAGE98B_V19_TEST_HISTORY -->
## Stage98B V19
- V18 reached quiet gate and exposed Billing.tsx/source-test contamination.
- V19 restores contaminated src files from HEAD before broad verification.


<!-- STAGE98B_V20_TEST_HISTORY -->
## Stage98B V20
- V19 reached billing regression but restore-from-HEAD was insufficient.
- V20 uses origin/dev-rollout-freeze first and validates Billing.tsx before continuing.


## STAGE98B_V21_REMOTE_BILLING_RESTORE

- Status: prepared by V21 package.
- Scope: Stage98B mojibake hard gate plus clean Billing.tsx restoration from remote branch.
- Tests: Stage98B, src test-scaffold scan, billing regression, broad syntax sweep, git diff --check, quiet gate.
- Risk: local repo had many dirty leftovers from failed packages; V21 excludes backups/logs/stage98 helpers from commit.

<!-- STAGE98B_100B_CALENDAR_POLISH_WEEK_PLAN_TESTS_2026_05_17 -->
## Stage98B-100B Calendar polish and week plan visibility — test history

Automatyczne testy wymagane przez paczkę:
- `node tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node tests/stage99-calendar-active-class-contract.test.cjs`
- `node tests/stage100-calendar-week-plan-entry-visible.test.cjs`
- `node tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

Status testu ręcznego: `TEST RĘCZNY DO WYKONANIA`.

Do sprawdzenia na `/calendar`:
- brak mojibake w `Plan najbliższych dni`, licznikach i akcjach,
- dzień z `1 wpis` pokazuje typ, godzinę, status, tytuł, relację i akcje,
- brak pustego białego mini-kafelka,
- dzień z `0 wpisów` pokazuje `Brak wpisów.`.

<!-- STAGE104C_WEEK_PLAN_CARD_UNCLAMP -->

## 2026-05-17 — Stage104C: Calendar week plan card unclamp

### FAKTY Z KODU / PLIKÓW
- Poprzednia paczka Stage104B nie wykonała patchera: plik CJS miał błąd składni przez nieucieczony backtick w osadzonym teście.
- Faktyczny problem UI: w Plan najbliższych dni wpis istnieje, ale renderuje się jako wąski pionowy fragment akcji.
- Naprawa Stage104C: root week-plan card nie używa legacy klasy calendar-entry-card i dostaje anti-collapse CSS: width 100%, max-width none, min-height 92px, overflow visible, visibility visible, opacity 1.

### GUARDY
- Stage99 pilnuje klas i zakazu mieszania calendar-entry-card z cf-calendar-week-plan-entry-card.
- Stage100 pilnuje DOM modelu, pełnych labeli, braku display contents wrappera i anti-collapse CSS.
- Stage104 pilnuje widocznego payloadu karty oraz braku hidden/zero-size reguł.

### TESTY AUTOMATYCZNE
Do potwierdzenia przez run:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- npm run build
- npm run verify:closeflow:quiet

### TEST RĘCZNY
Status: TEST RĘCZNY DO WYKONANIA. Wejść na /calendar i sprawdzić dzień z 1 wpis oraz dzień z 0 wpisów.
