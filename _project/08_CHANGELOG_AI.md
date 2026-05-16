# 08_CHANGELOG_AI - CloseFlow / LeadFlow

## 2026-05-16 - Memory protocol and Obsidian mapping closeout
- Added `_project/00_PROJECT_MEMORY_PROTOCOL.md`.
- Added `_project/STAGE_TEMPLATE_MINIMAL.md`.
- Restored required run checkpoint `_project/runs/2026-05-16_0854_closeflow_memory_protocol_v1.md`.
- Added `DAMIAN_MINIMAL_PROJECT_MEMORY_PROTOCOL_START` marker to `AGENTS.md` without removing V8/V9 blocks.
- Updated next steps for post-push archive/merge stage.
- No runtime UI, routing, product logic, styles or architecture changed.

## 2026-05-15 - V9
- Zastapiono uszkodzona paczke V7.
- PowerShell zostal uproszczony: tresci sa w payload, skrypt tylko je kopiuje i uruchamia guardy.
- Dodano/uzupelniono _project.
- Dopisano zasady do AGENTS.md bez nadpisywania.
- Dodano guard pamieci projektu.
- Dodano synchronizacje do Obsidiana i audyt nazw.

## 2026-05-15 - v14 runtime React StrictMode fix
- Added missing React import in src/main.tsx when React.StrictMode is used.
- Added runtime import guard. No UI/routing/product logic change.

## 2026-05-15 - v14 runtime React StrictMode fix
- Added missing React import in src/main.tsx when React.StrictMode is used.
- Added runtime import guard. No UI/routing/product logic change.

## 2026-05-15 - v15 runtime lazy page default fix
- Added lazyPage wrapper for React.lazy route chunks.
- Added guard for lazy route default/named exports.
- No UI/routing/product logic change intended.

## 2026-05-15 - v16 runtime lazy page default fix
- Added lazyPage route import normalizer after runtime default-export error.
- Fixed v15 Windows npm wrapper failure by using cmd.exe/npm.cmd.
- No UI/routing semantics/product logic change.

## 2026-05-15 - v17 runtime lazy page duplicate cleanup
- Reconstructed App.tsx lazy route block to exactly one lazyPage helper.
- Fixed local duplicate lazyPage introduced by partial v15/v16 runs.

## 2026-05-15 - v18 runtime lazy page default fix
- Reconstructed App.tsx lazy route block to one canonical lazyPage helper.
- Removed duplicate lazyPage declarations left by failed local runs.
- Added stricter guard. No UI/routing/product logic change.

## 2026-05-15 - v19 lazy page runtime fix
- Rebuilt App.tsx lazy route block from clean HEAD to remove failed local v15/v16/v17/v18 duplicates.
- Added stricter guard for lazy route runtime default exports.

## 2026-05-15 - v19 lazy page runtime fix
- Rebuilt App.tsx lazy route block from clean HEAD to remove failed local v15/v16/v17/v18 duplicates.
- Added stricter guard for lazy route runtime default exports.

## 2026-05-16 — Stage92 calendar selected day readability {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

- Uporządkowano render `CalendarSelectedDayEntryRowV9`: pełny typ, godzina, status, tytuł, powiązanie i akcje.
- Usunięto ryzyko białej pustej belki pod wpisem przez jeden stabilny shell wpisu i marker `data-cf-selected-day-v9-no-bottom-bar`.
- Akcje w V9 są grupowane w dwóch rzędach na desktopie i responsywnie na mobile.
- Dodano guard `tests/stage92-calendar-selected-day-readable-actions.test.cjs` do quiet release gate.

## STAGE93_CALENDAR_WEEK_RAIL_CLEANUP — 2026-05-16
- Removed the obsolete hidden `calendar-week-filter-list` render from Calendar week view.
- Kept `calendar-week-visible-days-v3` as the single visible week-day rail.
- Changed week rail count to plain text via `calendar-week-day-count-text`; no black/dark/plaque badge.

## STAGE93_GUARD_FIX_STAGE94_CALENDAR_SWEEP_2026_05_16

- Poprawiono wadliwy guard Stage93 po lokalnym patchu V5.
- Dodano sweep diagnostyczny Calendar UI do wykrywania kolejnych błędów przed zbiorczą paczką naprawczą.

## STAGE94_CALENDAR_CONSOLIDATED_CLEANUP_V3 - Calendar selected-day/week cleanup

- Removed wrong-source selectedDayAgendaEntriesV2 variable.
- Consolidated month selected-day area to one active CalendarSelectedDayTileV9 render.
- Removed duplicate selected-day ScheduleEntryCard list and extra Badge count near V9.
- Deduplicated month completed class expression.
- Fixed malformed calendar skin selector from old broad-scope cleanup.
- Updated Stage94 sweep to fail on P1/P2 regressions and allow only documented P3 month-chip shorthand.

## STAGE94_SWEEP_REGEX_FIX_V4_2026_05_16

- Fixed generated Calendar UI sweep script after Stage94 targeted guards passed.
- Scope: scripts/check-closeflow-calendar-ui-sweep-stage94.cjs only plus project/Obsidian notes.
- No commit/push performed.

## Stage94 Calendar weekly plan full entry text - 2026-05-16

- Week plan ScheduleEntryCard now renders full entry type, time, status, visible title, relation and full actions.
- Month grid remains frozen: compact Wyd/Zad labels stay only in month chips.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V2 - Calendar weekly plan full entry text
- Rebuilt `ScheduleEntryCard` to a readable text model aligned with selected-day V9.
- Did not change month grid, date selection, forms, complete/delete/shift logic.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V3 - Calendar weekly plan full entry text
- Rebuilt `ScheduleEntryCard` to a readable text model aligned with selected-day V9.
- Did not change month grid, date selection, forms, complete/delete/shift logic.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4

- Replaced week-plan `ScheduleEntryCard` with a V9-like full text model.
- Added CSS scoped only to `.calendar-week-plan`.
- Fixed the guard extractor to read the complete TSX function body instead of only the signature.

## Stage95 destructive action visual source of truth
- Added one destructive/trash action source of truth for /tasks, /cases and /calendar.
- Trash icon stays red, but the button surface remains white/subtle, not a red plaque.
- No commit/push performed by this local ZIP.

## Stage95 V2 destructive action CSS guard fix
- Removed defensive heavy-red Tailwind class selector from the trash action CSS contract so the source block contains no solid red plaque classes.
- No commit/push performed by this local ZIP.


## Stage96 leads right rail width and position
- Ujednolicono szerokość prawego raila /leads ze wspólnym source of truth dla /clients.
- Usunięto lokalny override JSX `xl:grid-cols-[minmax(0,1fr)_300px]`.
- SimpleFiltersCard pozostaje nad TopValueRecordsCard.
- Dodano guard `tests/stage96-leads-right-rail-width-position.test.cjs`.

- 2026-05-16 Stage96 V2: fixed Leads right rail width/position guard and hardened source truth for /leads vs /clients rail parity.

### Stage96 V3 - Leads right rail width/position guard finalizer
- Fixed Stage96 guard implementation after V2 false failures.
- Removed literal old narrow rail width text from right rail source truth comments.
- Kept /leads list unchanged; right rail width/order remains delegated to shared source truth.

### Stage96 V4 - Leads right rail layout-class finalizer
- Removed local rail width class from the /leads layout-list tag.
- Hardened guard to inspect the Stage25/Stage32 layout tag rather than exact JSX spacing.
- Kept /leads list unchanged.

## STAGE96_V5_LEADS_RIGHT_RAIL_MARKER_FINALIZER
- Finalized /leads right rail shared source marker and operator rail class.
- Kept SimpleFiltersCard before TopValueRecordsCard.
- No commit/push.


## STAGE97_TODAY_OVERDUE_TASK_DONE_BUTTON_V3 - 2026-05-16

- Route: / / TodayStable.
- Added task identity wiring to overdue/today task RowLink rows so existing RowLink completion logic renders the real Zrobione button.
- No new dead handler was introduced; completion still uses markStage79TaskDoneFromRow and updateTaskInSupabase({ id, status: 'done' }).

## STAGE97_TODAY_OVERDUE_TASK_DONE_BUTTON_V4 - 2026-05-16

FAKTY:
- TodayStable overdue/today task rows pass taskId and doneKind=task into RowLink.
- RowLink uses the existing markStage79TaskDoneFromRow/updateTaskInSupabase completion path.
- Stage97 guard avoids fragile regex around /tasks.

DECYZJA:
- Today overdue task rows must not be edit-only.

## HOTFIX_STAGE96_CSS_MEDIA_BRACE_2026_05_16
- Fixed missing closing brace in closeflow-leads-right-rail-layout-lock.css after Stage96 push.
- Reason: full quiet gate build failed on Tailwind/Vite CSS parser before commit was pushed.


## HOTFIX_STAGE94_COMPLETED_EVENT_VISUAL_CONTRACT_2026_05_16
- Restored completed calendar entry visual contract after Stage94 week plan readable card rebuild.
- Completed entries again expose opacity-60 and line-through text class expected by calendar-completed-event-behavior guard.

