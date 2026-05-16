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

STATUS: WDROĹ»ONE LOKALNIE PO APPLY, TEST RÄCZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juĹĽ liczyÄ‡ `combineScheduleEntries` wprost w renderze.
- Dni miesiÄ…ca i tygodnia korzystajÄ… z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juĹĽ uĹĽywaÄ‡ `getEntriesForDay(...)` w render path.
- `cases` idÄ… z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeĹ‚nostronicowy loader zostaĹ‚ zastÄ…piony maĹ‚ym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeĹ›li nie uĹĽyto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiÄ…ca zostaĹ‚y nietkniÄ™te i wymagajÄ… osobnego audytu w Paczce G.

NASTÄPNY KROK:
- Test rÄ™czny `/calendar`: start, tydzieĹ„, miesiÄ…c, wybrany dzieĹ„, edycja, +1H/+1D/+1W, zrobione, usuĹ„.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G â€” Templates delete + visual contract â€” 2026-05-16

STATUS: WDROĹ»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaĹ‚ widoczny przycisk UsuĹ„ na karcie szablonu.
- Delete uĹĽywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeĹ›li szablon ma pozycje checklisty.
- Karta szablonu uĹĽywa cf-template-card cf-readable-card i markerĂłw ecord-list-source-truth.
- Stary marker data-a16-template-light-ui nie jest aktywnym source of truth dla stylu.

TESTY:
- 
ode tests/stage105-templates-delete-and-visual-contract.test.cjs
- 
pm run build

TEST RÄCZNY:
- DO WYKONANIA na /templates: create/edit/duplicate/delete z confirmami.

RYZYKO:
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaĹ‚ uĹĽyty w aktywnych sprawach. Wymusza Ĺ›wiadome potwierdzenie usuwania wzorca i jego pozycji.

NASTÄPNY KROK:
- PrzetestowaÄ‡ /templates; dopiero potem zdecydowaÄ‡, czy robimy kolejny lokalny etap czy wspĂłlny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->
