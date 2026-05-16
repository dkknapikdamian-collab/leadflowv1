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

- node --check scripts/check-closeflow-calendar-ui-sweep-stage94.cjs
- node --test tests/stage92-calendar-selected-day-readable-actions.test.cjs
- node --test tests/stage93-calendar-week-rail-cleanup.test.cjs
- node --test tests/stage94-calendar-consolidated-cleanup.test.cjs
- node scripts/check-closeflow-calendar-ui-sweep-stage94.cjs

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
- Targeted guard: tests/stage96-leads-right-rail-width-position.test.cjs
- Scope: /leads right rail width and position parity with /clients.
- Expected: Filtry proste before Najcenniejsze leady; no local narrow rail override.

### Stage96 V4 - Leads right rail width/position
- Targeted guard: tests/stage96-leads-right-rail-width-position.test.cjs
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
- Required: node --test tests/calendar-completed-event-behavior.test.cjs
- Required: node scripts/closeflow-release-check-quiet.cjs


## HOTFIX_STAGE94_COMPLETED_EVENT_VISUAL_CONTRACT_2026_05_16
- Required: node --test tests/calendar-completed-event-behavior.test.cjs
- Required: node scripts/closeflow-release-check-quiet.cjs

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
## Stage103 V3 â€” Calendar month grid day states

Automatyczne:
- 
ode tests/stage103-calendar-month-grid-day-states.test.cjs
- 
ode scripts/closeflow-release-check-quiet.cjs

RÄ™czne â€” DO WYKONANIA:
1. WejĹ›Ä‡ w /calendar.
2. PrzeĹ‚Ä…czyÄ‡ na MiesiÄ…c.
3. SprawdziÄ‡ zielonkawy aktualny dzieĹ„.
4. SprawdziÄ‡ szare stare dni.
5. SprawdziÄ‡ spokojny niebieski border selected day.
6. PotwierdziÄ‡ brak gĂłrnego licznika przy dacie.
7. KliknÄ…Ä‡ + wiÄ™cej i potwierdziÄ‡ przewiniÄ™cie/wybĂłr panelu dnia.
