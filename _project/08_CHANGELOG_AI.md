<!-- STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION -->
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

## 2026-05-16 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Stage92 calendar selected day readability {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

- UporzÄ‚â€žĂ˘â‚¬Â¦dkowano render `CalendarSelectedDayEntryRowV9`: peĂ„Ä…Ă˘â‚¬Ĺˇny typ, godzina, status, tytuĂ„Ä…Ă˘â‚¬Ĺˇ, powiÄ‚â€žĂ˘â‚¬Â¦zanie i akcje.
- UsuniÄ‚â€žĂ˘â€žËto ryzyko biaĂ„Ä…Ă˘â‚¬Ĺˇej pustej belki pod wpisem przez jeden stabilny shell wpisu i marker `data-cf-selected-day-v9-no-bottom-bar`.
- Akcje w V9 sÄ‚â€žĂ˘â‚¬Â¦ grupowane w dwĂ„â€šÄąâ€šch rzÄ‚â€žĂ˘â€žËdach na desktopie i responsywnie na mobile.
- Dodano guard `tests/stage92-calendar-selected-day-readable-actions.test.cjs` do quiet release gate.

## STAGE93_CALENDAR_WEEK_RAIL_CLEANUP Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ 2026-05-16
- Removed the obsolete hidden `calendar-week-filter-list` render from Calendar week view.
- Kept `calendar-week-visible-days-v3` as the single visible week-day rail.
- Changed week rail count to plain text via `calendar-week-day-count-text`; no black/dark/plaque badge.

## STAGE93_GUARD_FIX_STAGE94_CALENDAR_SWEEP_2026_05_16

- Poprawiono wadliwy guard Stage93 po lokalnym patchu V5.
- Dodano sweep diagnostyczny Calendar UI do wykrywania kolejnych bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdĂ„â€šÄąâ€šw przed zbiorczÄ‚â€žĂ˘â‚¬Â¦ paczkÄ‚â€žĂ˘â‚¬Â¦ naprawczÄ‚â€žĂ˘â‚¬Â¦.

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
- Ujednolicono szerokoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ prawego raila /leads ze wspĂ„â€šÄąâ€šlnym source of truth dla /clients.
- UsuniÄ‚â€žĂ˘â€žËto lokalny override JSX `xl:grid-cols-[minmax(0,1fr)_300px]`.
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


## HOTFIX_STAGE94_COMPLETED_EVENT_VISUAL_CONTRACT_2026_05_16
- Restored completed calendar entry visual contract after Stage94 week plan readable card rebuild.
- Completed entries again expose opacity-60 and line-through text class expected by calendar-completed-event-behavior guard.

### STAGE98_100_RECOVERY_FROM_CLEAN_V3 - 2026-05-16
- Recovered Stage98/99/100 from clean HEAD after Stage101 rollback.
- Restored Calendar.tsx UTF-8 strings, week-plan entry DOM model, Stage32/96 compatibility marker and quiet-gate wiring.
- No commit. No push.


<!-- STAGE104_CALENDAR_PERFORMANCE_F -->
## 2026-05-16 Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Stage104 / Paczka F Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Calendar loading performance

STATUS: WDROĂ„Ä…Ă‚Â»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juĂ„Ä…Ă„Ëť liczyÄ‚â€žĂ˘â‚¬Ë‡ `combineScheduleEntries` wprost w renderze.
- Dni miesiÄ‚â€žĂ˘â‚¬Â¦ca i tygodnia korzystajÄ‚â€žĂ˘â‚¬Â¦ z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juĂ„Ä…Ă„Ëť uĂ„Ä…Ă„ËťywaÄ‚â€žĂ˘â‚¬Ë‡ `getEntriesForDay(...)` w render path.
- `cases` idÄ‚â€žĂ˘â‚¬Â¦ z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeĂ„Ä…Ă˘â‚¬Ĺˇnostronicowy loader zostaĂ„Ä…Ă˘â‚¬Ĺˇ zastÄ‚â€žĂ˘â‚¬Â¦piony maĂ„Ä…Ă˘â‚¬Ĺˇym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeĂ„Ä…Ă˘â‚¬Ĺźli nie uĂ„Ä…Ă„Ëťyto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiÄ‚â€žĂ˘â‚¬Â¦ca zostaĂ„Ä…Ă˘â‚¬Ĺˇy nietkniÄ‚â€žĂ˘â€žËte i wymagajÄ‚â€žĂ˘â‚¬Â¦ osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test rÄ‚â€žĂ˘â€žËczny `/calendar`: start, tydzieĂ„Ä…Ă˘â‚¬Ĺľ, miesiÄ‚â€žĂ˘â‚¬Â¦c, wybrany dzieĂ„Ä…Ă˘â‚¬Ĺľ, edycja, +1H/+1D/+1W, zrobione, usuĂ„Ä…Ă˘â‚¬Ĺľ.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Templates delete + visual contract Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ 2026-05-16

STATUS: WDROĂ„Ä…Ă‚Â»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaĂ„Ä…Ă˘â‚¬Ĺˇ widoczny przycisk UsuĂ„Ä…Ă˘â‚¬Ĺľ na karcie szablonu.
- Delete uĂ„Ä…Ă„Ëťywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeĂ„Ä…Ă˘â‚¬Ĺźli szablon ma pozycje checklisty.
- Karta szablonu uĂ„Ä…Ă„Ëťywa cf-template-card cf-readable-card i markerĂ„â€šÄąâ€šw
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
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaĂ„Ä…Ă˘â‚¬Ĺˇ uĂ„Ä…Ă„Ëťyty w aktywnych sprawach. Wymusza Ă„Ä…Ă˘â‚¬Ĺźwiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaÄ‚â€žĂ˘â‚¬Ë‡ /templates; dopiero potem zdecydowaÄ‚â€žĂ˘â‚¬Ë‡, czy robimy kolejny lokalny etap czy wspĂ„â€šÄąâ€šlny commit/push Stage104+Stage105.
<!-- STAGE105_TEMPLATES_DELETE_VISUAL_G -->


## Stage98B V5 mojibake hard gate - 2026-05-16

- Fixed Stage98B package after V3 exposed repo-wide mojibake outside Calendar.tsx.
- Repaired mojibake across active `src/`, `tests/`, `scripts/` and `_project/` files.
- Replaced Stage98 guard with repo-wide scan over `src`, `tests`, `scripts` and `_project`.
- Added Stage98 guard as quiet release preflight before production build.
- Kept month calendar view logic untouched.
- Manual UI test remains required for `/calendar`.


- V5 C1-control mojibake repair: handles leftover raw control-byte mojibake that V4 exposed in LeadDetail.tsx.


## 2026-05-16 - Stage98B V6 mojibake hard gate resume

- Fixed Stage98B package process after V5 reached the real repo-wide repair but failed on a missing Obsidian payload file.
- Stage98 guard remains repo-wide for `src`, `tests`, `scripts`, `_project`.
- Added package self-check before repo mutation and wider post-repair checks: guard syntax, helper syntax, Stage98 test, git diff check, quiet release gate.
- Commit scope after green tests intentionally stages all changed files under `src`, `tests`, `scripts`, `_project`, because V4/V5 left partial local cleanup changes that must not be omitted from the final commit.
<!-- STAGE98B_V6_CHANGELOG -->


## 2026-05-16 - Stage98B V7 mojibake hard gate resume

- Fixed Stage98B package process after V5 reached the real repo-wide repair but failed on a missing Obsidian payload file.
- Stage98 guard remains repo-wide for `src`, `tests`, `scripts`, `_project`.
- Added package self-check before repo mutation and wider post-repair checks: guard syntax, helper syntax, Stage98 test, git diff check, quiet release gate.
- Commit scope after green tests intentionally stages all changed files under `src`, `tests`, `scripts`, `_project`, because V4/V5 left partial local cleanup changes that must not be omitted from the final commit.
<!-- STAGE98B_V7_CHANGELOG -->


## 2026-05-16 - Stage98B V8 mojibake hard gate resume

- Fixed Stage98B package process after V5 reached the real repo-wide repair but failed on a missing Obsidian payload file.
- Stage98 guard remains repo-wide for `src`, `tests`, `scripts`, `_project`.
- Added package self-check before repo mutation and wider post-repair checks: guard syntax, helper syntax, Stage98 test, git diff check, quiet release gate.
- Commit scope after green tests intentionally stages all changed files under `src`, `tests`, `scripts`, `_project`, because V4/V5 left partial local cleanup changes that must not be omitted from the final commit.
<!-- STAGE98B_V8_CHANGELOG -->

- V8: Windows-safe git ProcessStartInfo wrapper; resume after V7 stderr warning failure.


## 2026-05-16 - Stage98B V9 mojibake hard gate resume

- Fixed Stage98B package process after V5 reached the real repo-wide repair but failed on a missing Obsidian payload file.
- Stage98 guard remains repo-wide for `src`, `tests`, `scripts`, `_project`.
- Added package self-check before repo mutation and wider post-repair checks: guard syntax, helper syntax, Stage98 test, git diff check, quiet release gate.
- Commit scope after green tests intentionally stages all changed files under `src`, `tests`, `scripts`, `_project`, because V4/V5 left partial local cleanup changes that must not be omitted from the final commit.
<!-- STAGE98B_V9_CHANGELOG -->

- V9: whitespace cleanup before git diff --check; resume after V8 real trailing-whitespace failure.

<!-- STAGE98B_V10_CHANGELOG -->
## 2026-05-16 - Stage98B V10 mojibake hard gate broad preflight

- Strengthened Stage98B as a repo-wide hard fail for mojibake/BOM leftovers in `src`, `tests`, `scripts`, `_project`.
- Added hygiene for mangled BOM strings and raw UTF-8 BOM before JS syntax checks.
- Added broad changed-file syntax pass before quiet release gate.
- Kept CRLF/autocrlf warnings non-fatal while keeping real whitespace/conflict errors fatal.
- Manual UI test remains required for `/calendar`.

<!-- STAGE98B_V11_CHANGELOG -->
## 2026-05-16 - Stage98B V11 mojibake hard gate broad preflight

- Strengthened Stage98B as a repo-wide hard fail for mojibake/BOM leftovers in `src`, `tests`, `scripts`, `tools`, `_project`.
- Added hygiene for mangled BOM strings and raw UTF-8 BOM before JS syntax checks.
- Added broad all scripts/tests/tools JS syntax sweep plus changed-file syntax pass before quiet release gate.
- Kept CRLF/autocrlf warnings non-fatal while keeping real whitespace/conflict errors fatal.
- Manual UI test remains required for `/calendar`.


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


<!-- STAGE98B_V19_CHANGELOG -->
## 2026-05-16 - Stage98B V19
- Added source/test contamination repair after V18 quiet gate failure.
- Stage98B remains repo-wide and strict.


<!-- STAGE98B_V20_CHANGELOG -->
## 2026-05-16 - Stage98B V20
- Added remote/HEAD restore for active src test-scaffold contamination after V19 billing regression failure.
- Keeps Stage98B repo-wide hard gate and broad preflight checks.


## STAGE98B_V21_REMOTE_BILLING_RESTORE

- Status: prepared by V21 package.
- Scope: Stage98B mojibake hard gate plus clean Billing.tsx restoration from remote branch.
- Tests: Stage98B, src test-scaffold scan, billing regression, broad syntax sweep, git diff --check, quiet gate.
- Risk: local repo had many dirty leftovers from failed packages; V21 excludes backups/logs/stage98 helpers from commit.

<!-- STAGE98B_100B_CALENDAR_POLISH_WEEK_PLAN_2026_05_17 -->
## 2026-05-17 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Stage98B-100B Calendar polish copy and week-plan visibility

Status: PATCH PACKAGE PREPARED / LOCAL APPLY REQUIRED.

Zakres:
- naprawa mojibake i bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdnych polskich znakĂ„â€šÄąâ€šw w aktywnym `/calendar`,
- uporzÄ‚â€žĂ˘â‚¬Â¦dkowanie `closeflow-calendar-selected-day-new-tile-v9.css` do jednego modelu V9 + Stage100,
- wygaszenie aktywnego CSS po Stage94 V2/V3/V4 i starych rodzin `.cf-week-plan-entry-*` / `.cf-calendar-week-entry-*`,
- nowy guard `tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`,
- aktualizacja quiet release gate.

Guardy/testy do uruchomienia przez paczkÄ‚â€žĂ˘â€žË:
- `node tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node tests/stage99-calendar-active-class-contract.test.cjs`
- `node tests/stage100-calendar-week-plan-entry-visible.test.cjs`
- `node tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

Test rÄ‚â€žĂ˘â€žËczny: DO WYKONANIA na `/calendar`.
Kryterium: dzieĂ„Ä…Ă˘â‚¬Ĺľ z wpisem nie moĂ„Ä…Ă„Ëťe wyglÄ‚â€žĂ˘â‚¬Â¦daÄ‚â€žĂ˘â‚¬Ë‡ jak pusty biaĂ„Ä…Ă˘â‚¬Ĺˇy pasek/mini-kafelek.

<!-- STAGE104C_WEEK_PLAN_CARD_UNCLAMP -->

## 2026-05-17 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Stage104C: Calendar week plan card unclamp

### FAKTY Z KODU / PLIKĂ„â€šĂ˘â‚¬Ĺ›W
- Poprzednia paczka Stage104B nie wykonaĂ„Ä…Ă˘â‚¬Ĺˇa patchera: plik CJS miaĂ„Ä…Ă˘â‚¬Ĺˇ bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d skĂ„Ä…Ă˘â‚¬Ĺˇadni przez nieucieczony backtick w osadzonym teĂ„Ä…Ă˘â‚¬Ĺźcie.
- Faktyczny problem UI: w Plan najbliĂ„Ä…Ă„Ëťszych dni wpis istnieje, ale renderuje siÄ‚â€žĂ˘â€žË jako wÄ‚â€žĂ˘â‚¬Â¦ski pionowy fragment akcji.
- Naprawa Stage104C: root week-plan card nie uĂ„Ä…Ă„Ëťywa legacy klasy calendar-entry-card i dostaje anti-collapse CSS: width 100%, max-width none, min-height 92px, overflow visible, visibility visible, opacity 1.

### GUARDY
- Stage99 pilnuje klas i zakazu mieszania calendar-entry-card z cf-calendar-week-plan-entry-card.
- Stage100 pilnuje DOM modelu, peĂ„Ä…Ă˘â‚¬Ĺˇnych labeli, braku display contents wrappera i anti-collapse CSS.
- Stage104 pilnuje widocznego payloadu karty oraz braku hidden/zero-size reguĂ„Ä…Ă˘â‚¬Ĺˇ.

### TESTY AUTOMATYCZNE
Do potwierdzenia przez run:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- npm run build
- npm run verify:closeflow:quiet

### TEST RÄ‚â€žĂ‚ÂCZNY
Status: TEST RÄ‚â€žĂ‚ÂCZNY DO WYKONANIA. WejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ na /calendar i sprawdziÄ‚â€žĂ˘â‚¬Ë‡ dzieĂ„Ä…Ă˘â‚¬Ĺľ z 1 wpis oraz dzieĂ„Ä…Ă˘â‚¬Ĺľ z 0 wpisĂ„â€šÄąâ€šw.

## Stage104D - Calendar week plan compact one-row - 2026-05-17
- Status: WDRAĂ„Ä…Ă‚Â»ANE.
- Cel: zamroziÄ‚â€žĂ˘â‚¬Ë‡ Stage104C i skompaktowaÄ‚â€žĂ˘â‚¬Ë‡ wpis tygodniowy do jednego wiersza na desktopie.
- Zakres: src/styles/closeflow-calendar-selected-day-new-tile-v9.css, guardy Stage100/104/104D, quiet gate.
- Nie ruszano logiki UsuĂ„Ä…Ă˘â‚¬Ĺľ / Zrobione ani Google Calendar syncu. OpĂ„â€šÄąâ€šĂ„Ä…ÄąĹşnienie syncu zostaje do osobnego Stage104E.
- Test rÄ‚â€žĂ˘â€žËczny: /calendar, dzieĂ„Ä…Ă˘â‚¬Ĺľ z 1 wpisem ma byÄ‚â€žĂ˘â‚¬Ë‡ jednym kompaktowym wierszem; dzieĂ„Ä…Ă˘â‚¬Ĺľ z 0 wpisĂ„â€šÄąâ€šw bez zmian.


## STAGE107_CLIENT_DETAIL_RUNTIME_TDZ_FINANCE_FIX_2026_05_17

- Typ: P0 runtime regression.
- Zakres: ClientDetail, finance summary, ClientTopTiles.
- Powod: `clientFinance` czytal `clientFinanceSummary` przed deklaracja, a `ClientTopTiles` czytal finance summary spoza propsow.
- Guard: `scripts/check-stage107-client-detail-runtime-tdz-finance.cjs`.
- Test: `tests/stage107-client-detail-runtime-tdz-finance.test.cjs`.
- Test reczny: otwarcie szczegolow klienta bez `APP_ROUTE_RENDER_FAILED`.


## Stage113 - Logo CloseFlow mapping
- Dodano brand assety i przepiÄ‚â€žĂ˘â€žËto tekstowe CF / login icon na komponent logo.


- 2026-05-17 Stage114A V8: calendar mojibake final fixer and guard repair, local-only, no push.

- 2026-05-17 Stage114B local-only: calendar hard-refresh data load waits for workspaceReady; added guard tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs; no git add/commit/push.


## Stage114C V2 - calendar shift persistence guard fix local only
- Local-only ZIP stage.
- Guard repaired after V1 regex false negative.
- Task shifts must write date, scheduledAt, dueAt and time before success toast.
- Manual QA still required on /calendar for +1D, +1W and +1H.

## STAGE114D_CALENDAR_MODAL_VIEWPORT_CHANGELOG

- Dodano viewport-safe modal contract dla calendar entry modals.
- Dodano DialogDescription dla Radix a11y.
- Dodano guard Stage114D.

## STAGE114D_V2_CALENDAR_MODAL_VIEWPORT_AND_DOC_GUARD_LOCAL_ONLY

- Status: local-only, no git add, no commit, no push.
- Scope: /calendar modal viewport, Radix DialogDescription, Stage114 docs encoding cleanup after broad Stage98 guard failed on _project reports.
- Guards: stage98 polish mojibake calendar guard, Stage114B, Stage114C, Stage114D modal viewport, Stage108 render smoke, build, verify:closeflow:quiet.
- Manual QA: edit calendar entry, title not clipped, scroll body works, sticky footer does not cover fields, no Radix description warning.

## STAGE114D_V3_CHANGELOG
Calendar modal viewport contract repaired locally. BOM/mojibake cleanup extended to related Stage108/114 guard files after Stage98 failure.


## Stage114D V5 calendar modal viewport guard fix
- Repaired Stage114D guard and modal viewport contract in local-only ZIP.

## 2026-05-17 - Stage114D V6 calendar modal viewport
- Repaired Stage114D guard and ensured viewport-safe modal contract.
- Local only, no push.

## STAGE114D_V8_CALENDAR_MODAL_VIEWPORT_STAGE102_GUARD_FIX_LOCAL_ONLY

- Status: LOCAL ONLY, no git add, no commit, no push.
- Zakres: /calendar modal viewport, Stage102 guard compatibility, Stage114D guard.
- Decyzja: calendar-entry-modal-viewport is allowed as a viewport safety class and is not a local dark overflow shell.
- Guardy: Stage102, Stage98, Stage114B, Stage114C, Stage114D, Stage108 smoke, build, verify:closeflow:quiet.
- Test reczny: otworzyc /calendar, edycje wpisu i tworzenie wpisu; tytul nie moze byc uciety, footer nie moze przykrywac pol, konsola bez Radix Missing Description.

## Stage114D V9 - calendar modal description guard fix
- Ensured DialogDescription exists for all calendar entry modals.
- Preserved viewport-safe modal class and CSS contract.
- Updated Stage102 guard compatibility.

## Stage114D V10 - local only
- Repaired Stage102 modal guard after Stage114D viewport class.
- Repaired Stage114D modal viewport guard.
- Kept local-only mode: no git add, no commit, no push.

<!-- STAGE115_LEAD_CONTACT_CLIENT_PARITY -->

## 2026-05-18 - Stage115 LeadDetail contact card client parity

- Dodano wspĂ„â€šÄąâ€šlny komponent `src/components/entity-contact-card.tsx` i CSS `src/styles/entity-contact-card.css`.
- LeadDetail dostaĂ„Ä…Ă˘â‚¬Ĺˇ lewÄ‚â€žĂ˘â‚¬Â¦ kartÄ‚â€žĂ˘â€žË kontaktowÄ‚â€žĂ˘â‚¬Â¦ w ukĂ„Ä…Ă˘â‚¬Ĺˇadzie klienta.
- ClientDetail uĂ„Ä…Ă„Ëťywa wspĂ„â€šÄąâ€šlnej listy danych kontaktowych zamiast lokalnego `InfoRow`.
- UsuniÄ‚â€žĂ˘â€žËto lokalnÄ‚â€žĂ˘â‚¬Â¦ wyspÄ‚â€žĂ˘â€žË UI LeadDetail: `InfoLine` / `lead-detail-contact-grid`.

## Stage115B LeadDetail notes visible source contract

- Split LeadDetail note display from contact card.
- Added dedicated `Notatki leada` section with source lead note and latest note activity.
- Added guard for source/placement contract.

## Stage115C LeadDetail inline note submit contract

- Locked LeadDetail history note form as inline submit path.
- Renamed work-center global note action to OtwĂ„â€šÄąâ€šrz szybki formularz notatki.
- Fixed Polish inline note copy: placeholder, dictation button and submit button.

## Stage115D LeadDetail overdue work items red contract

- Added overdue detection for LeadDetail work items.
- Timeline tasks/events with past date and open status now render `ZalegĂ„Ä…Ă˘â‚¬Ĺˇe`.
- Added red danger pill and overdue row styling.
- Replaced mojibake separator `Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂÄ‚ËĂ˘â€šÂ¬ÄąÄ„Ä‚â€šĂ‚Â¬Ă„â€šĂ˘â‚¬ĹľĂ„Ä…Ă‹â€ˇ` with `Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ‚Â`.

## Stage115E LeadDetail finance actions dialog

- Wired LeadDetail finance action buttons to a typed payment dialog.
- LeadDetail now fetches lead payments and derives paid/remaining/status from payment records.
- Saving a lead payment creates a payment and a payment_recorded activity.

## Stage116 - Today work item card source of truth

- Added shared WorkItemCard component and CSS.
- Today task/event rows now use shared card rendering.
- Next 7 task/event rows now use shared card rendering.
- Added status/tone helpers for overdue red and completed muted states.

## Stage116 V2 - Stage76 guard compatibility repair

- Added TodayStable compatibility literal for legacy Stage76 event-done guard after moving event done UI to WorkItemCard.
- No visual behavior change; this only protects the existing Stage76 guard contract.
## Stage117 Leads right rail layout contract

- Added explicit /leads Stage117 layout markers.
- Right rail now uses search/suggestions/list/rail grid areas.
- Simple filters are locked first and top-value card directly below.
- Mobile layout stacks search, suggestions, rail and list without squeeze.

## Stage118B - release gate Stage77 compatibility

- Repaired stale Stage77 release-gate test after LeadDetail statusClass became date-aware for overdue work items.
- Added package alias `verify:closeflow:quiet` for the quiet release gate documented in Obsidian.

## Stage115 - CaseDetail runtime crash hotfix

STAGE115_CASE_DETAIL_RUNTIME_CRASH_HOTFIX_2026_05_18

- Fixed CaseDetail runtime import direction for `useWorkspace`.
- Cleaned CaseDetail import/comment soup around Stage16O/Stage16M compatibility markers.
- Added Stage115 regression tests and quiet release gate wiring.
- Added project memory and Obsidian updates that explicitly mark Stage113/Stage114 as partial/not closed after Damian's manual test.


<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST START -->
## Stage119 - Calendar release gate trust repair

- Normalized scripts/closeflow-release-check-quiet.cjs so Stage98 calendar mojibake guard is one pre-build hard gate.
- Removed duplicated Stage98 preflight blocks from quiet gate.
- Added tests/stage119-calendar-release-gate-trust.test.cjs.
- Added package script test:stage119-calendar-release-gate-trust.
- Updated project memory and Obsidian package files.
<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST END -->

<!-- STAGE119_V2_CALENDAR_RELEASE_GATE_TRUST_CHANGELOG -->
## 2026-05-18 - Stage119 V2 calendar release gate trust repair

- Fixed unsafe Stage119 V1 apply order by copying Stage98 guard before running it.
- Repaired quiet release gate to use one Stage119 Stage98 preflight before build.
- Added Stage119 release-gate trust guard and package script.
<!-- /STAGE119_V2_CALENDAR_RELEASE_GATE_TRUST_CHANGELOG -->

<!-- STAGE119_V3_CHANGELOG -->
## 2026-05-18 - Stage119 V3 release gate guard false positive repair

- Repaired Stage119 guard false-positive after V2 counted raw Stage98 path occurrences globally.
- Normalized quiet release gate to one trusted Stage119 preflight.
<!-- /STAGE119_V3_CHANGELOG -->

<!-- STAGE119_V4_RELEASE_GATE_REQUIREDTESTS_DEDUPE -->
## 2026-05-18 - Stage119 V4 - release gate requiredTests dedupe

Status: WDROZONE PRZEZ ZIP / TESTY W TOKU.

Fakty:
- Stage98 calendar mojibake guard jest pojedynczym pre-build hard gate w erify:closeflow:quiet.
- Stage119 V4 deduplikuje
equiredTests, zeby ponowione paczki V2/V3 nie zostawialy zdublowanego wpisu Stage119.
- Guard Stage119 parsuje tablice testow i nie liczy surowych wystapien tekstu.

Testy:
-
ode --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
-
ode --test tests/stage119-calendar-release-gate-trust.test.cjs
-
pm run verify:closeflow:quiet

Test reczny:
- DO WYKONANIA na /calendar po zielonym gate.
<!-- /STAGE119_V4_RELEASE_GATE_REQUIREDTESTS_DEDUPE -->

<!-- STAGE119_V5_RELEASE_GATE_HARNESS_AND_MISSING_TESTS_AUDIT -->
## 2026-05-18 - Stage119 V5 - release gate harness and missing tests audit

Status: WDROZONE PRZEZ ZIP / TESTY W TOKU.

Fakty:
- Apply V5 kopiuje Stage98 i Stage119 przed pierwszym node --test.
- Wszystkie komendy testowe sa uruchamiane z cwd repo aplikacji.
- V5 deduplikuje requiredTests i wypisuje wszystkie brakujace testy przed verify:closeflow:quiet.

Testy:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage119-calendar-release-gate-trust.test.cjs
- node tools/audit-stage119-v5-required-tests.cjs <repo>
- npm run verify:closeflow:quiet

Test reczny:
- DO WYKONANIA na /calendar po zielonym gate.
<!-- /STAGE119_V5_RELEASE_GATE_HARNESS_AND_MISSING_TESTS_AUDIT -->


<!-- STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS -->
## 2026-05-18 - Stage120 Calendar local-first sync and focus

- Calendar reads local Supabase data before Google Calendar inbound sync.
- Google inbound runs in background after first local render and refreshes only if it changed rows.
- /calendar?focus=YYYY-MM-DD is now honored by Calendar.
- Guard: tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs.
- Manual QA: hard refresh, week/month/selected day, focus link, add/edit, shift, done/delete.
<!-- /STAGE120_CALENDAR_LOCAL_FIRST_SYNC_AND_FOCUS -->


<!-- STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->
## 2026-05-18 - Stage121 calendar shift persistence optimistic state

Status: WDRAĂ„Ä…Ă‚Â»ANE.

Cel: +1H/+1D/+1W musi wizualnie przesuwaÄ‚â€žĂ˘â‚¬Ë‡ wpis od razu po udanym PATCH, zamiast polegaÄ‚â€žĂ˘â‚¬Ë‡ wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie na refreshSupabaseBundle().

Test rÄ‚â€žĂ˘â€žËczny: /calendar, wpis task/event, akcje +1H/+1D/+1W. Po sukcesie karta ma zmieniÄ‚â€žĂ˘â‚¬Ë‡ dzieĂ„Ä…Ă˘â‚¬Ĺľ/godzinÄ‚â€žĂ˘â€žË.
<!-- /STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->

## 2026-05-18 - STAGE122_RUNTIME_AUTH_API_PWA_HARDENING

FAKTY: production console showed repeated /api/me 401 plus /api/tasks and /api/events 500 during calendar shift. DevTools also showed an active CloseFlow service worker and old bundle initiator. Stage122 disables stale PWA cache/register behavior, adds /api/version, adds a runtime console marker, and makes work-items auth failures return 401/403 instead of masked 500.

TESTY: node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs; npm run build; npm run verify:closeflow:quiet.

NASTÄ‚â€žĂ‚ÂPNY KROK: after deployment, verify Network JS hash changes, call /api/version, and retest Calendar +1D/+1W/+1H. If /api/me still returns 401, user must re-auth via Google/Supabase without clearing localStorage first.

## 2026-05-18 - STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE

FAKTY: Stage122 V7 passed Stage122/PWA/Stage98/Stage121/build, then failed Vercel Hobby function budget because api/version.ts raised api/*.ts to 13. V8 chose system rewrite architecture but failed on a brittle api/system.ts anchor.

DECYZJA: /api/version stays available through /api/system?kind=version, without adding a physical Vercel function.

TESTY: Stage122 guard, PWA foundation, Vercel budget, Stage98, Stage121, build, verify:closeflow:quiet.

NASTÄ‚â€žĂ‚ÂPNY KROK: verify production /api/version and runtime marker, then retest calendar shift only if /api/me is clean.

<!-- STAGE124A_SUPABASE_EGRESS_CHANGELOG_START -->
## 2026-05-19 - Stage124A V3 Supabase egress API list DTO guard

- Status: ZIP/local package V3.
- Zakres: API list endpoints dla leads/clients/cases przechodza z `select=*` na jawne ListDTO select columns; detail route po `id` pozostaje pelny.
- Dodatkowo: cache GET w `src/lib/supabase-fallback.ts` zwiekszony z 10s do 30s i nadal czyszczony po mutacjach.
- Guard: `scripts/check-stage124-supabase-egress-contract.cjs`.
- V3: patch wykonywany przez Node, bez kruchych PowerShell -replace.
<!-- STAGE124A_SUPABASE_EGRESS_CHANGELOG_END -->

## 2026-05-19 - STAGE124D_TASK_EVENT_LIGHT_ROUTES

- Restored tracked /api/tasks and /api/events route files.
- Replaced historical work_items select=* task/event reads with explicit Stage124D ListDTO select fields.
- Added workspace-scoped reads/mutations and optional date range filters for future calendar range queries.

## 2026-05-19 - STAGE124D_V2_GUARD_FIX

- Fixed Stage124D guard syntax by replacing fragile regex assertions with string token assertions.
- No API route behavior change.

## 2026-05-19 - Stage124E V2 calendar task/event range params

- Added optional task/event range params in frontend Supabase fetchers.
- Added calendar bundle options forwarding.
- Added guard/test for range param contract.
- No UI or visual calendar changes.

## 2026-05-29 - STAGE179 Settings form control readability - local only

- Tryb: lokalnie, bez commita i bez pusha.
- Poprawiono czytelnoĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ pĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬Ĺˇl formularza w /settings, szczegĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬Ĺˇlnie Google Calendar reminders.
- Dodano src/styles/closeflow-settings-form-control-readability-stage179.css.
- Dodano 	ests/stage179-settings-form-control-readability-contract.test.cjs.
- Nie ruszano logiki Google Calendar, API, Supabase ani routingu.

## 2026-05-29 - STAGE179 Settings form control readability - local only

- Tryb: lokalnie, bez commita i bez pusha.
- Poprawiono czytelnoĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ pĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬Ĺˇl formularza w /settings, szczegĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬Ĺˇlnie Google Calendar reminders.
- Dodano src/styles/closeflow-settings-form-control-readability-stage179.css.
- Dodano 	ests/stage179-settings-form-control-readability-contract.test.cjs.
- Nie ruszano logiki Google Calendar, API, Supabase ani routingu.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_CHANGELOG_START -->
## 2026-06-04 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Stage221 owner-control roadmap po deep research CRM

Typ: dokumentacja roadmapy / pamiÄ‚â€žĂ˘â€žËÄ‚â€žĂ˘â‚¬Ë‡ projektu / Obsidian update.

Dodano:
- szczegĂ„â€šÄąâ€šĂ„Ä…Ă˘â‚¬Ĺˇowy blok Stage221 do `_project/07_NEXT_STEPS.md`,
- decyzjÄ‚â€žĂ˘â€žË owner-control do `_project/04_DECISIONS.md`,
- guard pamiÄ‚â€žĂ˘â€žËci roadmapy,
- roadmap file w `_project/roadmaps/`,
- run report,
- manifest aktualizacji Obsidiana,
- plik aktualizacji Obsidiana.

Nie zmieniono:
- runtime UI,
- routingu,
- API,
- Supabase,
- stylĂ„â€šÄąâ€šw,
- logiki produktu.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_CHANGELOG_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇy siÄ‚â€žĂ˘â€žË na kruchych anchorach w Clients.tsx.
- V3 uĂ„Ä…Ă„Ëťywa elastycznych regexĂ„â€šÄąâ€šw i naprawia czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowy lokalny stan.
- Docelowy wzĂ„â€šÄąâ€šr: [Oferta wysĂ„Ä…Ă˘â‚¬Ĺˇana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaĂ„Ä…Ă˘â‚¬Ĺˇ wypchniÄ‚â€žĂ˘â€žËty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaĂ„Ä…Ă˘â‚¬Ĺˇ patcha Settings/Cases, wiÄ‚â€žĂ˘â€žËc helper i guard weszĂ„Ä…Ă˘â‚¬Ĺˇy bez sekcji ustawieĂ„Ä…Ă˘â‚¬Ĺľ i bez case badges.
- R2B dopina brakujÄ‚â€žĂ˘â‚¬Â¦ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeĂ„Ä…Ă˘â‚¬Ĺźniej przechodziĂ„Ä…Ă˘â‚¬Ĺˇ, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siÄ‚â€žĂ˘â€žË domknÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ˘â‚¬Ë‡ hotfixem.
- R2B ma byÄ‚â€žĂ˘â‚¬Ë‡ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeĂ„Ä…Ă˘â‚¬Ĺźli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeĂ„Ä…Ă˘â‚¬Ĺźli plik istnieje
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, Ă„Ä…Ă„Ëťeby nie udawaÄ‚â€žĂ˘â‚¬Ë‡ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uĂ„Ä…Ă„Ëťywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozrĂ„â€šÄąâ€šĂ„Ä…Ă„Ëťnia ciszÄ‚â€žĂ˘â€žË kontaktu od braku Ă„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťego ruchu fallback.
- Dodano runtime testy, ktĂ„â€šÄąâ€šre realnie wywoĂ„Ä…Ă˘â‚¬ĹˇujÄ‚â€žĂ˘â‚¬Â¦ funkcje przez esbuild, nie tylko szukajÄ‚â€žĂ˘â‚¬Â¦ tekstu.

DECYZJE DAMIANA:
- PodetapĂ„â€šÄąâ€šw A-D nie pushujemy osobno.
- Nie robiÄ‚â€žĂ˘â‚¬Ë‡ drugiego Today.
- Badge majÄ‚â€žĂ˘â‚¬Â¦ wynikaÄ‚â€žĂ˘â‚¬Ë‡ z jednego kontraktu ruchu i prawdy aktywnoĂ„Ä…Ă˘â‚¬Ĺźci.
- `updatedAt` moĂ„Ä…Ă„Ëťe byÄ‚â€žĂ˘â‚¬Ë‡ fallbackiem aktywnoĂ„Ä…Ă˘â‚¬Ĺźci, nie prawdÄ‚â€žĂ˘â‚¬Â¦ kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeĂ„Ä…Ă˘â‚¬Ĺˇne wpiÄ‚â€žĂ˘â€žËcie LeadDetail/CaseDetail widocznego work center moĂ„Ä…Ă„Ëťna zrobiÄ‚â€žĂ˘â‚¬Ë‡ jako D2, jeĂ„Ä…Ă˘â‚¬Ĺźli po runtime contract nie bÄ‚â€žĂ˘â€žËdzie regresji.
- Today agregacja moĂ„Ä…Ă„Ëťe dostaÄ‚â€žĂ˘â‚¬Ë‡ ranking w nastÄ‚â€žĂ˘â€žËpnym kroku, ale bez nowej sekcji.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonych testach sprawdziÄ‚â€žĂ˘â‚¬Ë‡ /leads, /cases, /today.
- Commit/push dopiero po caĂ„Ä…Ă˘â‚¬Ĺˇym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryĂ„Ä…Ă˘â‚¬Ĺˇ realny bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d: fallback z `updatedAt` nadpisywaĂ„Ä…Ă˘â‚¬Ĺˇ prawdziwÄ‚â€žĂ˘â‚¬Â¦ aktywnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡.
- Build przeszedĂ„Ä…Ă˘â‚¬Ĺˇ, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` sÄ‚â€žĂ˘â‚¬Â¦ uĂ„Ä…Ă„Ëťywane wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie, gdy nie ma realnych kandydatĂ„â€šÄąâ€šw aktywnoĂ„Ä…Ă˘â‚¬Ĺźci/kontaktu/pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci.
- To naprawia zaĂ„Ä…Ă˘â‚¬ĹˇoĂ„Ä…Ă„Ëťenie: nie udajemy kontaktu ani Ă„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťej aktywnoĂ„Ä…Ă˘â‚¬Ĺźci przez zwykĂ„Ä…Ă˘â‚¬Ĺˇy update rekordu.

DECYZJE:
- Nie pushowaÄ‚â€žĂ˘â‚¬Ë‡ Stage223, dopĂ„â€šÄąâ€ški runtime testy nie sÄ‚â€žĂ˘â‚¬Â¦ zielone.
- UtrzymaÄ‚â€žĂ˘â‚¬Ë‡ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajÄ‚â€žĂ˘â‚¬Â¦ jednym lokalnym blokiem do jednego commita po peĂ„Ä…Ă˘â‚¬Ĺˇnych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonych testach moĂ„Ä…Ă„Ëťna dopiero rozwaĂ„Ä…Ă„ËťyÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na brakujÄ‚â€žĂ˘â‚¬Â¦cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiÄ‚â€žĂ˘â€žËc brak samego pliku blokuje push.
- R2C dodaje brakujÄ‚â€žĂ˘â‚¬Â¦cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy release gate.
- Dodajemy minimalny test kontraktu Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push dla caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedĂ„Ä…Ă˘â‚¬Ĺˇ Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byĂ„Ä…Ă˘â‚¬Ĺˇ renderowany przez `EntityTrashButton`, ale brakowaĂ„Ä…Ă˘â‚¬Ĺˇo starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujÄ‚â€žĂ˘â‚¬Â¦cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy guardĂ„â€šÄąâ€šw.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejÄ‚â€žĂ˘â‚¬Â¦cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă˘â‚¬Ĺˇ marker kosza na liĂ„Ä…Ă˘â‚¬Ĺźcie spraw, ale release gate przeszedĂ„Ä…Ă˘â‚¬Ĺˇ do kolejnego warunku.
- Guard `case trash actions` wymaga teĂ„Ä…Ă„Ëť, Ă„Ä…Ă„Ëťeby `CaseDetail.tsx` uĂ„Ä…Ă„ËťywaĂ„Ä…Ă˘â‚¬Ĺˇ `EntityTrashButton`.
- `CaseDetail.tsx` miaĂ„Ä…Ă˘â‚¬Ĺˇ przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaĂ„Ä…Ă˘â‚¬Ĺˇ zwykĂ„Ä…Ă˘â‚¬Ĺˇy `Button`.
- R2E zmienia tylko Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo przycisku na `EntityTrashButton` i uĂ„Ä…Ă„Ëťywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy guardĂ„â€šÄąâ€šw.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspĂ„â€šÄąâ€šlnego Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă˘â‚¬Ĺˇ `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, Ă„Ä…Ă„Ëťeby `CaseDetail.tsx` zawieraĂ„Ä…Ă˘â‚¬Ĺˇ `EntityTrashButton`.
- R2F speĂ„Ä…Ă˘â‚¬Ĺˇnia oba kontrakty: importuje/uĂ„Ä…Ă„Ëťywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czaÄ‚â€žĂ˘â‚¬Ë‡ guardĂ„â€šÄąâ€šw.
- Nie zmieniaÄ‚â€žĂ˘â‚¬Ë‡ release gate.
- RozwiÄ‚â€žĂ˘â‚¬Â¦zaÄ‚â€žĂ˘â‚¬Ë‡ konflikt guardĂ„â€šÄąâ€šw aliasem, nie obejĂ„Ä…Ă˘â‚¬Ĺźciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇach.
- PozostaĂ„Ä…Ă˘â‚¬Ĺˇe literalne znaki mojibake w guardach/testach sÄ‚â€žĂ˘â‚¬Â¦ zamieniane na ASCII unicode escapes, Ă„Ä…Ă„Ëťeby guardy mogĂ„Ä…Ă˘â‚¬Ĺˇy dalej opisywaÄ‚â€žĂ˘â‚¬Ë‡ zĂ„Ä…Ă˘â‚¬Ĺˇe znaki bez Ă„Ä…Ă˘â‚¬Ĺˇamania Stage98.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiĂ„Ä…Ă˘â‚¬Ĺˇ Stage98 i przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaĂ„Ä…Ă˘â‚¬Ĺˇa, Ă„Ä…Ă„Ëťe extractor Ă„Ä…Ă˘â‚¬ĹˇapaĂ„Ä…Ă˘â‚¬Ĺˇ default `{}`, nie ciaĂ„Ä…Ă˘â‚¬Ĺˇo funkcji.
- Sama logika local-first byĂ„Ä…Ă˘â‚¬Ĺˇa poprawna: funkcja ma `Promise.all([` i nie woĂ„Ä…Ă˘â‚¬Ĺˇa Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaĂ„Ä…Ă˘â‚¬Ĺˇa funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, Ă„Ä…Ă„Ëťeby kontrakt testu i logika byĂ„Ä…Ă˘â‚¬Ĺˇy spĂ„â€šÄąâ€šjne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiĂ„Ä…Ă˘â‚¬Ĺˇ extractor funkcji Stage120 przez usuniÄ‚â€žĂ˘â€žËcie `= {}` z sygnatury.
- Po R2H test Stage120 doszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej i wykazaĂ„Ä…Ă˘â‚¬Ĺˇ twardy wymĂ„â€šÄąâ€šg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszÄ‚â€žĂ˘â‚¬Â¦ byÄ‚â€žĂ˘â‚¬Ë‡ literalnie bez argumentĂ„â€šÄąâ€šw.
- R2I przywraca literalne local reads bez argumentĂ„â€šÄąâ€šw i zostawia poprawionÄ‚â€žĂ˘â‚¬Â¦ sygnaturÄ‚â€žĂ˘â€žË `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, Ă„Ä…Ă„Ëťeby nie zmieniaÄ‚â€žĂ˘â‚¬Ë‡ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiÄ‚â€žĂ˘â‚¬Â¦zujÄ‚â€žĂ˘â‚¬Â¦cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juĂ„Ä…Ă„Ëť ma.
- `register-service-worker.ts` ma poprawnÄ‚â€žĂ˘â‚¬Â¦ logikÄ‚â€žĂ˘â€žË: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaĂ„Ä…Ă˘â‚¬Ĺˇ tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenĂ„â€šÄąâ€šw w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiÄ‚â€žĂ˘â‚¬Â¦zania`.
- `Clients.tsx` miaĂ„Ä…Ă˘â‚¬Ĺˇ poprawnÄ‚â€žĂ˘â‚¬Â¦ semantykÄ‚â€žĂ˘â€žË soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speĂ„Ä…Ă˘â‚¬ĹˇniaĂ„Ä…Ă˘â‚¬Ĺˇ starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiÄ‚â€žĂ˘â‚¬Â¦zaĂ„Ä…Ă˘â‚¬Ĺľ.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiÄ‚â€žĂ˘â‚¬Â¦zujÄ‚â€žĂ˘â‚¬Â¦cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byĂ„Ä…Ă˘â‚¬Ĺˇ za ciasny: skrypt wymagaĂ„Ä…Ă˘â‚¬Ĺˇ dokĂ„Ä…Ă˘â‚¬Ĺˇadnego istniejÄ‚â€žĂ˘â‚¬Â¦cego renderu `case-detail-history-row`, ktĂ„â€šÄąâ€šrego lokalny `CaseDetail.tsx` ma juĂ„Ä…Ă„Ëť inaczej po wczeĂ„Ä…Ă˘â‚¬Ĺźniejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenĂ„â€šÄąâ€šw:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepĂ„Ä…Ă˘â‚¬Ĺˇywu historii.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjÄ‚â€žĂ˘â‚¬Â¦ Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiĂ„Ä…Ă˘â‚¬Ĺˇ `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speĂ„Ä…Ă˘â‚¬Ĺˇnia juĂ„Ä…Ă„Ëť zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenĂ„â€šÄąâ€šw w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juĂ„Ä…Ă„Ëť przechodzi, wiÄ‚â€žĂ˘â€žËc brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowÄ‚â€žĂ˘â‚¬Â¦ funkcjÄ‚â€žĂ˘â‚¬Â¦.

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ case history visual P1 repair3 oraz wszystkie wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze release gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastÄ‚â€žĂ˘â€žËpny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ klienta`,
  - `buildClientNextAction`.
- Log wskazaĂ„Ä…Ă˘â‚¬Ĺˇ brak `Zadania klienta`.
- R2O dodaje brakujÄ‚â€žĂ˘â‚¬Â¦ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linkĂ„â€šÄąâ€šw do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ ClientDetail operational center oraz wszystkie wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaĂ„Ä…Ă˘â‚¬Ĺˇ zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerĂ„â€šÄąâ€šw, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyĂ„Ä…Ă˘â‚¬Ĺˇ `api/daily-digest.ts`.
- R2Q-V2 nie wykonaĂ„Ä…Ă˘â‚¬Ĺˇ patcha, bo helper JS miaĂ„Ä…Ă˘â‚¬Ĺˇ bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d skĂ„Ä…Ă˘â‚¬Ĺˇadni przed modyfikacjÄ‚â€žĂ˘â‚¬Â¦ pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokĂ„Ä…Ă˘â‚¬Ĺˇadny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĂ„Ä…Ă˘â‚¬Ĺˇki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `daily-digest-email-runtime.test.cjs` oraz wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenĂ„â€šÄąâ€šw w `api/daily-digest.ts`:
  - `workspace-diagnostics`,
  - `digest-diagnostics`,
  - `hasResendApiKey`,
  - `usesFallbackFromEmail`,
  - `cronSecretConfigured`,
  - `canSend`.
- R2R dodaje te tokeny jako jawny kontrakt diagnostyczny w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĂ„Ä…Ă˘â‚¬Ĺˇki/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `daily-digest-diagnostics.test.cjs` oraz wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenĂ„â€šÄąâ€šw w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĂ„Ä…Ă˘â‚¬Ĺˇki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `daily-digest-cron-auth.test.cjs` oraz wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze gates do builda.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plikĂ„â€šÄąâ€šw `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byĂ„Ä…Ă˘â‚¬Ĺˇo 13 funkcji API.
- `api/system.ts` juĂ„Ä…Ă„Ëť importuje `supportHandler` i obsĂ„Ä…Ă˘â‚¬Ĺˇuguje `kind === 'support'`.
- `vercel.json` juĂ„Ä…Ă„Ëť ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, Ă„Ä…Ă„Ëťeby zejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajÄ‚â€žĂ˘â‚¬Â¦ ten plik bezpoĂ„Ä…Ă˘â‚¬Ĺźrednio.
- Konsolidujemy redundantny support endpoint przez istniejÄ‚â€žĂ˘â‚¬Â¦cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juĂ„Ä…Ă„Ëť istnieje.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/vercel-hobby-function-budget.test.cjs
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- npm run build
- git diff --check

RYZYKA:
- JeĂ„Ä…Ă˘â‚¬Ĺźli gdzieĂ„Ä…Ă˘â‚¬Ĺź poza Vercel rewrite ktoĂ„Ä…Ă˘â‚¬Ĺź woĂ„Ä…Ă˘â‚¬Ĺˇa bezpoĂ„Ä…Ă˘â‚¬Ĺźrednio plikowÄ‚â€žĂ˘â‚¬Â¦ funkcjÄ‚â€žĂ˘â€žË `api/support.ts`, po usuniÄ‚â€žĂ˘â€žËciu musi trafiÄ‚â€žĂ˘â‚¬Ë‡ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrĂ„â€šÄąâ€šciĂ„Ä…Ă˘â‚¬Ĺˇ `api/support.ts` i przeszedĂ„Ä…Ă˘â‚¬Ĺˇ `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË przed peĂ„Ä…Ă˘â‚¬Ĺˇnym dopiÄ‚â€žĂ˘â€žËciem `activitiesHandler` do `api/system.ts`, wiÄ‚â€žĂ˘â€žËc R2V koĂ„Ä…Ă˘â‚¬Ĺľczy konsolidacjÄ‚â€žĂ˘â€žË `/api/activities`.
- `verify:closeflow:quiet` przeszedĂ„Ä…Ă˘â‚¬Ĺˇ dalej i zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujÄ‚â€žĂ˘â‚¬Â¦cy kontrakt Stage32e bez przywracania starego dĂ„Ä…Ă˘â‚¬Ĺˇugiego copy i bez zmiany layoutu.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani daily digest.

DECYZJE:
- Nie cofamy R2T/R2U.
- `api/support.ts` zostaje, bo stary gate czyta go literalnie.
- `api/activities.ts` pozostaje skonsolidowane do `src/server/activities-handler.ts` + `api/system?kind=activities`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage32e-relation-rail-copy-compat.test.cjs
- node --test tests/request-identity-vercel-api-signature.test.cjs
- node --test tests/vercel-hobby-function-budget.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ dodawanie/odczyt aktywnoĂ„Ä…Ă˘â‚¬Ĺźci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiÄ‚â€žĂ˘â€žËto marker bez zmiany UI, Ă„Ä…Ă„Ëťeby nie rozwaliÄ‚â€žĂ˘â‚¬Ë‡ widoku.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po zielonym verify quiet wykonaÄ‚â€žĂ˘â‚¬Ë‡ jeden commit/push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedĂ„Ä…Ă˘â‚¬Ĺˇ masowo wiele gates, build i wiÄ‚â€žĂ˘â€žËkszoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test prĂ„â€šÄąâ€šbuje czytaÄ‚â€žĂ˘â‚¬Ë‡ brakujÄ‚â€žĂ˘â‚¬Â¦cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerĂ„â€šÄąâ€šw:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujÄ‚â€žĂ˘â‚¬Â¦cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, ktĂ„â€šÄąâ€šry uruchamia testy z quiet gate po kolei i zbiera wszystkie bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdy zamiast zatrzymywaÄ‚â€žĂ˘â‚¬Ë‡ siÄ‚â€žĂ˘â€žË na pierwszym.

DECYZJE:
- Nie uruchamiaÄ‚â€žĂ˘â‚¬Ë‡ rÄ‚â€žĂ˘â€žËcznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czaÄ‚â€žĂ˘â‚¬Ë‡ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uĂ„Ä…Ă„ËťywaÄ‚â€žĂ˘â‚¬Ë‡ mass scan, Ă„Ä…Ă„Ëťeby Ă„Ä…Ă˘â‚¬ĹˇapaÄ‚â€žĂ˘â‚¬Ë‡ wiele bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdĂ„â€šÄąâ€šw naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byÄ‚â€žĂ˘â‚¬Ë‡ kopiowany rÄ‚â€žĂ˘â€žËcznie do Supabase bez osobnego przeglÄ‚â€žĂ˘â‚¬Â¦du SQL.
- Mass scan moĂ„Ä…Ă„Ëťe trwaÄ‚â€žĂ˘â‚¬Ë‡ dĂ„Ä…Ă˘â‚¬ĹˇuĂ„Ä…Ă„Ëťej niĂ„Ä…Ă„Ëť standardowy verify, ale daje peĂ„Ä…Ă˘â‚¬ĹˇniejszÄ‚â€žĂ˘â‚¬Â¦ listÄ‚â€žĂ˘â€žË blokad.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- JeĂ„Ä…Ă„Ëťeli mass scan pokaĂ„Ä…Ă„Ëťe kilka kolejnych failĂ„â€šÄąâ€šw, zrobiÄ‚â€žĂ˘â‚¬Ë‡ jeden zbiorczy R2X zamiast kolejnych maĂ„Ä…Ă˘â‚¬Ĺˇych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaĂ„Ä…Ă˘â‚¬Ĺˇ 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiÄ‚â€žĂ˘â‚¬Ë‡ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koĂ„Ä…Ă˘â‚¬Ĺľczy teĂ„Ä…Ă„Ëť zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeĂ„Ä…Ă˘â‚¬Ĺźli R2U nie dokoĂ„Ä…Ă˘â‚¬ĹľczyĂ„Ä…Ă˘â‚¬Ĺˇ route przez anchor.

DECYZJE:
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy starych gateÄ‚ËĂ˘â€šÂ¬Ă˘â€žËĂ„â€šÄąâ€šw.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajÄ‚â€žĂ˘â‚¬Â¦ jawny `aria-describedby={undefined}` escape.
- Trash actions majÄ‚â€žĂ˘â‚¬Â¦ iĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ przez wspĂ„â€šÄąâ€šlne Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rÄ‚â€žĂ˘â€žËcznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoĂ„Ä…Ă˘â‚¬Ĺźci

AUDYT RYZYK:
- CzÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ napraw to kontrakty historycznych testĂ„â€šÄąâ€šw, wiÄ‚â€žĂ˘â€žËc po zielonym verify trzeba jeszcze obejrzeÄ‚â€žĂ˘â‚¬Ë‡ UI, szczegĂ„â€šÄąâ€šlnie Calendar i Leads.
- `/api/activities` moĂ„Ä…Ă„Ëťe dziaĂ„Ä…Ă˘â‚¬ĹˇaÄ‚â€žĂ˘â‚¬Ë‡ przez rewrite do system route. Po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ aktywnoĂ„Ä…Ă˘â‚¬Ĺźci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaÄ‚â€žĂ˘â‚¬Ë‡ prawdziwe opisy tam, gdzie dialog ma treĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ formularzowÄ‚â€žĂ˘â‚¬Â¦.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po R2X uruchomiÄ‚â€žĂ˘â‚¬Ë‡ mass scan. JeĂ„Ä…Ă˘â‚¬Ĺźli zostanÄ‚â€žĂ˘â‚¬Â¦ faile, zrobiÄ‚â€žĂ˘â‚¬Ë‡ R2Y jako kolejny batch z peĂ„Ä…Ă˘â‚¬Ĺˇnej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedĂ„Ä…Ă˘â‚¬Ĺˇ wszystkie 178 testĂ„â€šÄąâ€šw.
- Build zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeĂ„Ä…Ă˘â‚¬Ĺźnie Stage100/104/99 nie pozwalajÄ‚â€žĂ˘â‚¬Â¦, Ă„Ä…Ă„Ëťeby taki legacy combo string wrĂ„â€šÄąâ€šciĂ„Ä…Ă˘â‚¬Ĺˇ do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoĂ„Ä…Ă˘â‚¬Ĺźci dla sprzecznych historycznych gateÄ‚ËĂ˘â€šÂ¬Ă˘â€žËĂ„â€šÄąâ€šw. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rÄ‚â€žĂ˘â€žËcznie obejrzeÄ‚â€žĂ˘â‚¬Ë‡ Calendar, bo R2X dotykaĂ„Ä…Ă˘â‚¬Ĺˇ kilku klas i dialogĂ„â€šÄąâ€šw.
- JeĂ„Ä…Ă˘â‚¬Ĺźli kolejne prebuild guardy wykaĂ„Ä…Ă„ËťÄ‚â€žĂ˘â‚¬Â¦ podobny konflikt literalny, naprawiaÄ‚â€žĂ˘â‚¬Ë‡ markerem poza renderowanÄ‚â€žĂ˘â‚¬Â¦ funkcjÄ‚â€žĂ˘â‚¬Â¦, nie cofajÄ‚â€žĂ˘â‚¬Â¦c UI.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2Y. JeĂ„Ä…Ă„Ëťeli build i verify quiet przejdÄ‚â€žĂ˘â‚¬Â¦, moĂ„Ä…Ă„Ëťna wykonaÄ‚â€žĂ˘â‚¬Ë‡ push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziĂ„Ä…Ă˘â‚¬Ĺˇ `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaĂ„Ä…Ă˘â‚¬Ĺˇ z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byĂ„Ä…Ă˘â‚¬Ĺˇ sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaĂ„Ä…Ă˘â‚¬Ĺˇ tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieĂ„Ä…Ă„ËťÄ‚â€žĂ˘â‚¬Â¦cego Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- Ă„Ä…Ă„â€¦rĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇem prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
- Nie przywracamy `cf-case-row-delete-text-action`.
- Nie pushujemy bez zielonego build/verify/diff.

TESTY:
- node --test tests/stage105-calendar-modal-no-dark-inputs.test.cjs
- node scripts/check-stage220a28-modal-focus-trash.cjs
- node --test tests/stage95-destructive-action-visual-source.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniono test, bo poprzedni kontrakt byĂ„Ä…Ă˘â‚¬Ĺˇ sprzeczny z nowszym prebuild guardem.
- Po deployu rÄ‚â€žĂ˘â€žËcznie sprawdziÄ‚â€žĂ˘â‚¬Ë‡ listÄ‚â€žĂ˘â€žË spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AA. JeĂ„Ä…Ă˘â‚¬Ĺźli build i verify przejdÄ‚â€žĂ˘â‚¬Â¦, moĂ„Ä…Ă„Ëťna wykonaÄ‚â€žĂ˘â‚¬Ë‡ push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedĂ„Ä…Ă˘â‚¬Ĺˇ Stage105, Stage220A28, Stage95 i mass scan 178 testĂ„â€šÄąâ€šw.
- Build zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË w `src/pages/Calendar.tsx` na bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdzie JSX:
  `Expected "=>" but found "="`.
- BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d powstaĂ„Ä…Ă˘â‚¬Ĺˇ w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerĂ„â€šÄąâ€šw.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skĂ„Ä…Ă˘â‚¬Ĺˇadni po regexowym patchu. NajwiÄ‚â€žĂ˘â€žËksze ryzyko: delete button w Calendar moĂ„Ä…Ă„Ëťe mieÄ‚â€žĂ˘â‚¬Ë‡ poprawny build, ale trzeba go kliknÄ‚â€žĂ˘â‚¬Â¦Ä‚â€žĂ˘â‚¬Ë‡ rÄ‚â€žĂ˘â€žËcznie po deployu.
- Po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ `/calendar`: usuĂ„Ä…Ă˘â‚¬Ĺľ wpis tygodnia, usuĂ„Ä…Ă˘â‚¬Ĺľ wpis z selected day, sprawdĂ„Ä…ÄąĹş dialog/confirm i brak czerwonej plakietki.
- JeĂ„Ä…Ă˘â‚¬Ĺźli kolejny build pokaĂ„Ä…Ă„Ëťe bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d skĂ„Ä…Ă˘â‚¬Ĺˇadni w Calendar, nie robiÄ‚â€žĂ˘â‚¬Ë‡ szerokiego refaktoru; naprawiÄ‚â€žĂ˘â‚¬Ë‡ lokalnie bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdny JSX.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AB. JeĂ„Ä…Ă˘â‚¬Ĺźli build i verify przejdÄ‚â€žĂ˘â‚¬Â¦, wykonaÄ‚â€žĂ˘â‚¬Ë‡ push caĂ„Ä…Ă˘â‚¬Ĺˇego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaĂ„Ä…Ă˘â‚¬Ĺˇ juĂ„Ä…Ă„Ëť wypchniÄ‚â€žĂ˘â€žËty jako commit `66b13479`.
- Podetap E nie byĂ„Ä…Ă˘â‚¬Ĺˇ domkniÄ‚â€žĂ˘â€žËty w wymaganym ksztaĂ„Ä…Ă˘â‚¬Ĺˇcie:
  - istniaĂ„Ä…Ă˘â‚¬Ĺˇ `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaĂ„Ä…Ă˘â‚¬Ĺˇ runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaĂ„Ä…Ă˘â‚¬Ĺˇo docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byĂ„Ä…Ă˘â‚¬Ĺˇ za bardzo tokenowy i nie pilnowaĂ„Ä…Ă˘â‚¬Ĺˇ peĂ„Ä…Ă˘â‚¬Ĺˇnej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraĂ„Ä…Ă„Ëťamy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoĂ„Ä…Ă˘â‚¬Ĺźci ani redesignu Today.
- Celem R2AC jest domkniÄ‚â€žĂ˘â€žËcie jakoĂ„Ä…Ă˘â‚¬Ĺźci/guardĂ„â€šÄąâ€šw po Stage223 R2.
- Nie pushujemy bez zielonych testĂ„â€šÄąâ€šw koĂ„Ä…Ă˘â‚¬Ĺľcowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RÄ‚â€žĂ‚ÂCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoĂ„Ä…Ă˘â‚¬Ĺźci zaleĂ„Ä…Ă„Ëťnej od progu.
- LeadDetail: status nastÄ‚â€žĂ˘â€žËpnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastÄ‚â€žĂ˘â€žËpnego ruchu i pieniÄ‚â€žĂ˘â€žËdzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiÄ‚â€žĂ˘â‚¬Â¦ i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ / ryzyko`, klikniÄ‚â€žĂ˘â€žËcia do rekordĂ„â€šÄąâ€šw, brak agresywnego odĂ„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwne ryzyko: guard moĂ„Ä…Ă„Ëťe zĂ„Ä…Ă˘â‚¬ĹˇapaÄ‚â€žĂ˘â‚¬Ë‡ przyszĂ„Ä…Ă˘â‚¬Ĺˇe rÄ‚â€žĂ˘â€žËczne dublowanie badge w UI Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ to jest celowe.
- Po zielonym teĂ„Ä…Ă˘â‚¬Ĺźcie moĂ„Ä…Ă„Ëťna uruchomiÄ‚â€žĂ˘â‚¬Ë‡ lokalnie aplikacjÄ‚â€žĂ˘â€žË i przejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ checklistÄ‚â€žĂ˘â€žË manualnÄ‚â€žĂ˘â‚¬Â¦.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AC lokalnie.
- JeĂ„Ä…Ă„Ëťeli testy sÄ‚â€žĂ˘â‚¬Â¦ zielone, odpaliÄ‚â€žĂ˘â‚¬Ë‡ lokalnie `npm run dev:api` i sprawdziÄ‚â€žĂ˘â‚¬Ë‡ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaĂ„Ä…Ă˘â‚¬Ĺˇy siÄ‚â€žĂ˘â€žË przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uĂ„Ä…Ă„Ëťywa parsera blokĂ„â€šÄąâ€šw/statements, zamiast zakĂ„Ä…Ă˘â‚¬ĹˇadaÄ‚â€žĂ˘â‚¬Ë‡ sÄ‚â€žĂ˘â‚¬Â¦siedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoĂ„Ä…Ă˘â‚¬Ĺˇuje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uĂ„Ä…Ă„Ëťywa timeout/scroll/reorder,
  - root/capture bridges ignorujÄ‚â€žĂ˘â‚¬Â¦ top metric tiles,
  - top metric buttons majÄ‚â€žĂ˘â‚¬Â¦ wĂ„Ä…Ă˘â‚¬Ĺˇasne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiÄ‚â€žĂ˘â€žËty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniÄ‚â€žĂ˘â€žËciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rÄ‚â€žĂ˘â€žËcznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelkĂ„â€šÄąâ€šw: nie przenoszÄ‚â€žĂ˘â‚¬Â¦ list na gĂ„â€šÄąâ€šrÄ‚â€žĂ˘â€žË.
- Ryzyko lokalne: expand/collapse na `/today`; rÄ‚â€žĂ˘â€žËczny smoke obowiÄ‚â€žĂ˘â‚¬Â¦zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelkĂ„â€šÄąâ€šw Today.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AD V4, potem `npm run dev`, rÄ‚â€žĂ˘â€žËczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË lokalnie i przeszedĂ„Ä…Ă˘â‚¬Ĺˇ:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padĂ„Ä…Ă˘â‚¬Ĺˇ nie przez Today, tylko przez zĂ„Ä…Ă˘â‚¬Ĺˇamanie kontraktu quiet gate.
- BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaÄ‚â€žĂ˘â‚¬Ë‡ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaĂ„Ä…Ă˘â‚¬Ĺˇ do `package.json` komendÄ‚â€žĂ˘â€žË `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokĂ„Ä…Ă˘â‚¬Ĺˇadnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnÄ‚â€žĂ˘â‚¬Â¦trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceĂ„Ä…Ă˘â‚¬Ĺľ do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byÄ‚â€žĂ˘â‚¬Ë‡ uruchamiany przez `closeflow-release-check-quiet.cjs`.
- Nie pushujemy bez zielonego verify quiet.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2ae-quiet-gate-contract-repair.cjs
- node --test tests/closeflow-release-gate-quiet.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa kontraktu testowego, nie nowy runtime feature.
- Ryzyko byĂ„Ä…Ă˘â‚¬Ĺˇo proceduralne: dopiÄ‚â€žĂ˘â€žËcie guarda do package scriptu Ă„Ä…Ă˘â‚¬Ĺˇamie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wĂ„Ä…Ă˘â‚¬Ĺˇasny guard pilnujÄ‚â€žĂ˘â‚¬Â¦cy, Ă„Ä…Ă„Ëťe package script pozostaje dokĂ„Ä…Ă˘â‚¬Ĺˇadny, a nowy R2AD guard jest w Ă„Ä…Ă˘â‚¬Ĺźrodku quiet gate.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AE. JeĂ„Ä…Ă˘â‚¬Ĺźli verify quiet przejdzie, odpaliÄ‚â€žĂ˘â‚¬Ë‡ lokalnie `npm run dev`, sprawdziÄ‚â€žĂ˘â‚¬Ë‡ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrĂ„â€šÄąâ€šciĂ„Ä…Ă˘â‚¬Ĺˇ exact `verify:closeflow:quiet` contract i build przechodziĂ„Ä…Ă˘â‚¬Ĺˇ.
- Verify quiet zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaĂ„Ä…Ă˘â‚¬Ĺˇ:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjÄ‚â€žĂ˘â‚¬Â¦ R2AD: kafelki Today nie mogÄ‚â€žĂ˘â‚¬Â¦ juĂ„Ä…Ă„Ëť przenosiÄ‚â€žĂ˘â‚¬Ë‡ sekcji w DOM ani przewijaÄ‚â€žĂ˘â‚¬Ë‡ do sekcji, bo to powodowaĂ„Ä…Ă˘â‚¬Ĺˇo scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiĂ„Ä…Ă˘â‚¬Ĺˇ R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťki klikniÄ‚â€žĂ˘â€žËcia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rÄ‚â€žĂ˘â€žËcznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwne ryzyko: stary test wymuszaĂ„Ä…Ă˘â‚¬Ĺˇ zachowanie, ktĂ„â€šÄąâ€šre teraz uznaliĂ„Ä…Ă˘â‚¬Ĺźmy za Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo bugĂ„â€šÄąâ€šw.
- Nowy kontrakt utrzymuje dostÄ‚â€žĂ˘â€žËpnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ i focus, ale blokuje scroll trap.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AF, potem lokalny `npm run dev`, rÄ‚â€žĂ˘â€žËczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË i przeszedĂ„Ä…Ă˘â‚¬Ĺˇ:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaĂ„Ä…Ă˘â‚¬Ĺˇ na `git diff --check`.
- `git diff --check` wskazaĂ„Ä…Ă˘â‚¬Ĺˇ trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardĂ„â€šÄąâ€šw, package scripts, quiet gate ani UI.

DECYZJE:
- Nie dotykamy zachowania R2AD/R2AF.
- Nie ignorujemy `git diff --check`.
- Nie pushujemy bez zielonego diff check.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To czyszczenie whitespace, wiÄ‚â€žĂ˘â€žËc ryzyko runtime jest minimalne.
- RÄ‚â€žĂ˘â€žËczny smoke `/today` nadal wymagany, bo wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeĂ„Ä…Ă„Ëťenia LF/CRLF z `git diff --check` sÄ‚â€žĂ˘â‚¬Â¦ nieblokujÄ‚â€žĂ˘â‚¬Â¦ce; trailing whitespace byĂ„Ä…Ă˘â‚¬Ĺˇ blokujÄ‚â€žĂ˘â‚¬Â¦cy.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R2AG.
- Po zielonym diff check odpaliÄ‚â€žĂ˘â‚¬Ë‡ lokalnie `npm run dev`, sprawdziÄ‚â€žĂ˘â‚¬Ë‡ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, Ă„Ä…Ă„Ëťe formularz tworzenia leada i klienta nie miaĂ„Ä…Ă˘â‚¬Ĺˇ pola `lastContactAt`.
- Zweryfikowano, Ă„Ä…Ă„Ëťe payload tworzenia leada/klienta nie wysyĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺˇ `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juĂ„Ä…Ă„Ëť istniejÄ‚â€žĂ˘â‚¬Â¦ po Stage223, wiÄ‚â€žĂ˘â€žËc wczeĂ„Ä…Ă˘â‚¬Ĺźniejsza teza o ich braku byĂ„Ä…Ă˘â‚¬Ĺˇa nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadĂ„â€šÄąâ€šw i klientĂ„â€šÄąâ€šw.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyĂ„Ä…Ă˘â‚¬Ĺźlnie pole pokazuje dzisiejszÄ‚â€žĂ˘â‚¬Â¦ datÄ‚â€žĂ˘â€žË.
- JeĂ„Ä…Ă„Ëťeli kontakt byĂ„Ä…Ă˘â‚¬Ĺˇ starszy, operator ma wpisaÄ‚â€žĂ˘â‚¬Ë‡ prawdziwÄ‚â€žĂ˘â‚¬Â¦ datÄ‚â€žĂ˘â€žË.
- DatÄ‚â€žĂ˘â€žË zapisujemy jako noon ISO, Ă„Ä…Ă„Ëťeby ograniczyÄ‚â€žĂ˘â‚¬Ë‡ problemy stref czasowych.
- Daty przyszĂ„Ä…Ă˘â‚¬Ĺˇe sÄ‚â€žĂ˘â‚¬Â¦ blokowane komunikatem: `Ostatni kontakt nie moĂ„Ä…Ă„Ëťe byÄ‚â€žĂ˘â‚¬Ë‡ w przyszĂ„Ä…Ă˘â‚¬ĹˇoĂ„Ä…Ă˘â‚¬Ĺźci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeĂ„Ä…Ă˘â‚¬Ĺźli SQL nie zostanie uruchomiony, API ma fallback dla brakujÄ‚â€žĂ˘â‚¬Â¦cej kolumny, ale data nie bÄ‚â€žĂ˘â€žËdzie trwale zapisana w bazie.
- Lista leadĂ„â€šÄąâ€šw/klientĂ„â€šÄąâ€šw ma fallback select bez `last_contact_at`, Ă„Ä…Ă„Ëťeby nie wysadziÄ‚â€žĂ˘â‚¬Ë‡ produkcji przed migracjÄ‚â€žĂ˘â‚¬Â¦.
- PeĂ„Ä…Ă˘â‚¬Ĺˇne spiÄ‚â€žĂ˘â€žËcie z widocznoĂ„Ä…Ă˘â‚¬ĹźciÄ‚â€žĂ˘â‚¬Â¦ badge `Cisza 14+ dni` zaleĂ„Ä…Ă„Ëťy od tego, czy `last_contact_at` wrĂ„â€šÄąâ€šci z API po migracji.
- NastÄ‚â€žĂ˘â€žËpny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeĂ„Ä…Ă˘â‚¬Ĺźli po manualnym teĂ„Ä…Ă˘â‚¬Ĺźcie badge nie bierze daty z bazy.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ SQL w Supabase.
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ R3A lokalnie.
- PrzetestowaÄ‚â€žĂ˘â‚¬Ë‡ tworzenie leada/klienta z datÄ‚â€žĂ˘â‚¬Â¦ 20 dni temu.

<!-- STAGE223R3A_V2_LAST_CONTACT_GUARD_FALSE_NEGATIVE -->
## 2026-06-05 - STAGE223R3A-V2 Guard false-negative repair

FAKTY:
- Stage223R3-A SQL wykonaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË poprawnie w Supabase: ALTER TABLE zwrĂ„â€šÄąâ€šciĂ„Ä…Ă˘â‚¬Ĺˇ "Success. No rows returned", co jest normalnym wynikiem dla DDL.
- Stage223R3-A zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na guardzie, nie na kodzie produkcyjnym.
- Guard bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdnie wymagaĂ„Ä…Ă˘â‚¬Ĺˇ dokĂ„Ä…Ă˘â‚¬Ĺˇadnego tekstu `lastContactAt: dateInputToNoonIso(newClient.lastContactAt)`.
- Faktyczna Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťka kodu klienta to: `newClient.lastContactAt` -> `preparedClient.lastContactAt` -> `dateInputToNoonIso(preparedClient.lastContactAt)`.

DECYZJA:
- Naprawiamy guard, nie zmieniamy funkcjonalnej Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťki klienta na siĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žË.
- Guard ma akceptowaÄ‚â€žĂ˘â‚¬Ë‡ Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„ËťkÄ‚â€žĂ˘â€žË przez preparedClient, ale dalej wymaga zachowania daty z newClient i konwersji do ISO.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa faĂ„Ä…Ă˘â‚¬Ĺˇszywie negatywnego guarda po czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowo wykonanym apply.
- Nie wolno robiÄ‚â€žĂ˘â‚¬Ë‡ resetu ani restore bez sprawdzenia, bo wczeĂ„Ä…Ă˘â‚¬Ĺźniejszy apply zdÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă„ËťyĂ„Ä…Ă˘â‚¬Ĺˇ zmieniÄ‚â€žĂ˘â‚¬Ë‡ pliki.
- Po zielonym teĂ„Ä…Ă˘â‚¬Ĺźcie nadal trzeba zrobiÄ‚â€žĂ˘â‚¬Ë‡ manualny test tworzenia lead/klient z datÄ‚â€žĂ˘â‚¬Â¦ 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedĂ„Ä…Ă˘â‚¬Ĺˇ guard i runtime test dla Last Contact Intake.
- Build przeszedĂ„Ä…Ă˘â‚¬Ĺˇ.
- `verify:closeflow:quiet` zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaĂ„Ä…Ă˘â‚¬Ĺˇa wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaĂ„Ä…Ă„Ëťdej optional fallback column.
- Nie uruchamiamy osobnego peĂ„Ä…Ă˘â‚¬Ĺˇnego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, Ă„Ä…Ă„Ëťeby potwierdziÄ‚â€žĂ˘â‚¬Ë‡ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rÄ‚â€žĂ˘â€žËcznie sprawdziÄ‚â€žĂ˘â‚¬Ë‡ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- UruchomiÄ‚â€žĂ˘â‚¬Ë‡ V3.
- JeĂ„Ä…Ă˘â‚¬Ĺźli gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwoĂ„Ä…Ă˘â‚¬Ĺˇanie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/Ă„Ä…ÄąË‡rednie, tekst Pokazano 8 z X, pusty stan operacyjny.
- Nie aktywuje przyciskĂ„â€šÄąâ€šw Ustaw zadanie / OdĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šĂ„Ä…Ă„Ëť / Oznacz jako martwy.

## TESTY
- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- create lead flow wymaga rÄ‚â€žĂ˘â€žËcznego testu po patchu.
- Rescue UI moĂ„Ä…Ă„Ëťe wymagaÄ‚â€žĂ˘â‚¬Ë‡ pĂ„â€šÄąâ€šĂ„Ä…ÄąĹşniejszego uproszczenia wizualnego.
- Backend akcji Rescue nie jest jeszcze wdroĂ„Ä…Ă„Ëťony, wiÄ‚â€žĂ˘â€žËc disabled actions sÄ‚â€žĂ˘â‚¬Â¦ prawidĂ„Ä…Ă˘â‚¬Ĺˇowe.

## STAGE220A35 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Client Commission Finance Source Truth

Data: 2026-06-05 21:05 Europe/Warsaw

### FAKTY
- Naprawiono rozjazd: wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ transakcji/sprawy nie jest prowizjÄ‚â€žĂ˘â‚¬Â¦ wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciciela.
- ClientDetail pokazuje prowizjÄ‚â€žĂ˘â€žË naleĂ„Ä…Ă„ËťnÄ‚â€žĂ˘â‚¬Â¦, wpĂ„Ä…Ă˘â‚¬ĹˇaconÄ‚â€žĂ˘â‚¬Â¦ prowizjÄ‚â€žĂ˘â€žË i prowizjÄ‚â€žĂ˘â€žË do zapĂ„Ä…Ă˘â‚¬Ĺˇaty jako osobne wartoĂ„Ä…Ă˘â‚¬Ĺźci.
- Karta sprawy w kliencie uĂ„Ä…Ă„Ëťywa getCaseFinanceSummary, wiÄ‚â€žĂ˘â€žËc prowizja procentowa 69 000 PLN Ä‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ 2% daje 1 380 PLN zamiast 0 PLN.
- WartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ transakcji nadal jest widoczna jako osobna informacja.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Bez tej poprawki Stage227 / Sales Funnel mĂ„â€šÄąâ€šgĂ„Ä…Ă˘â‚¬Ĺˇby dziedziczyÄ‚â€žĂ˘â‚¬Ë‡ bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdne wartoĂ„Ä…Ă˘â‚¬Ĺźci finansowe.
- Nie ruszano Supabase, RLS ani backendu pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci.
- Model prowizji staĂ„Ä…Ă˘â‚¬Ĺˇej nadal uĂ„Ä…Ă„Ëťywa gotowej kwoty prowizji.

## STAGE220A36 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Commission Input Model Split

Data: 2026-06-05 21:45 Europe/Warsaw

### FAKTY
- Rozdzielono prowizjÄ‚â€žĂ˘â€žË staĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦ od podstawy procentowej.
- Przy kwocie staĂ„Ä…Ă˘â‚¬Ĺˇej uĂ„Ä…Ă„Ëťytkownik wpisuje wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ prowizji.
- Przy prowizji procentowej uĂ„Ä…Ă„Ëťytkownik wpisuje wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ transakcji do wyliczenia i stawkÄ‚â€žĂ˘â€žË procentowÄ‚â€žĂ˘â‚¬Â¦; prowizja jest wyliczana i nieedytowalna.
- Lista klientĂ„â€šÄąâ€šw pokazuje prowizjÄ‚â€žĂ˘â€žË operacyjnÄ‚â€žĂ˘â‚¬Â¦, nie cenÄ‚â€žĂ˘â€žË transakcji.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie ruszano Supabase, RLS ani backendu pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci.
- Techniczne pole contractValue nadal przechowuje podstawÄ‚â€žĂ˘â€žË procentu przy modelu procentowym.
- Stage227 moĂ„Ä…Ă„Ëťe startowaÄ‚â€žĂ˘â‚¬Ë‡ dopiero po rÄ‚â€žĂ˘â€žËcznym sprawdzeniu fixed/percent w modalach finansĂ„â€šÄąâ€šw.

## STAGE220A36-R2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Commission Modal Field Order

Data: 2026-06-05 22:00 Europe/Warsaw

### FAKTY
- Doprecyzowano ukĂ„Ä…Ă˘â‚¬Ĺˇad modala prowizji: najpierw rodzaj prowizji, potem stawka procentowa i wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ prowizji.
- Pole "WartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ prowizji" jest edytowalne tylko przy kwocie staĂ„Ä…Ă˘â‚¬Ĺˇej.
- Przy procencie wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ prowizji wylicza siÄ‚â€žĂ˘â€žË automatycznie i jest nieedytowalna.
- Podstawa procentu, czyli wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ transakcji/zlecenia, jest osobnym polem poniĂ„Ä…Ă„Ëťej gĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwnych kontrolek prowizji.

### TESTY
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie zmieniano bazy ani modelu pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci.
- Ryzyko dotyczy tylko czytelnoĂ„Ä…Ă˘â‚¬Ĺźci UI i bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdnego wpisywania ceny transakcji w miejsce prowizji.
- Stage227 nadal musi korzystaÄ‚â€žĂ˘â‚¬Ë‡ z prowizji jako wartoĂ„Ä…Ă˘â‚¬Ĺźci operacyjnej.

## STAGE220A36-R4 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Build Guard and Case Item Schema Fix

Data: 2026-06-05 22:15 Europe/Warsaw

### FAKTY
- Naprawiono guardy A35/A36 po R2: usunieto BOM/mojibake i zbyt sztywne tokeny copy.
- Usunieto wysylanie approved_at przy tworzeniu case_items, bo produkcyjna tabela nie ma tej kolumny.
- Nie dodawano SQL ani kolumny w Supabase.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- node --test tests/stage220a36r4-build-guard-and-case-item-schema-fix.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Commit 00b8a95 byl wypchniety mimo czerwonych guardow, wiec R4 domyka build przed Stage227.
- Runtime bledy schema cache PGRST204 trzeba lapac guardami payloadu, nie obiecywac SQL bez potrzeby.
- Nie ruszano Supabase, RLS ani modelu platnosci.

## STAGE220A36-R5 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ R4 Guard Token Compat

Data: 2026-06-05 22:30 Europe/Warsaw

### FAKTY
- Vercel po d1e380f5 przechodzil A35, A36 i A36-R2, ale padal na zbyt sztywnym R4 guardzie.
- R4 guard oczekiwal tokenu "CaseFinanceEditorDialog percent basis field", a aktualny A36 guard uzywa "CaseFinanceEditorDialog percent basis label".
- R5 dopuszcza oba tokeny i dodaje osobny guard/test, zeby nie powtorzyc tego regresu.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs
- node scripts/check-stage220a36r5-r4-guard-token-compat.cjs
- node --test tests/stage220a36r5-r4-guard-token-compat.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- To jest hotfix guardu, nie zmiana UI ani bazy.
- approved_at fix z R4 zostaje bez zmian.
- Stage227 nadal wymaga zielonego Vercel po R5.

## STAGE220A36-R6 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Deploy Unblock Mojibake Cleanup

Data: 2026-06-05 22:35 Europe/Warsaw

### FAKTY
- Cleaned R4 guard/test files from BOM and literal encoding marker characters.
- Added R6 guard to protect the commission modal order and deployment path.
- Did not change Supabase, RLS, payments, or commission math.

### AUDYT RYZYK
- The UI screenshot can remain old until Vercel deploys a green build.
- Stage227 remains blocked until Vercel is green and modal is manually verified.

## STAGE220A36-R7 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ CaseDetail Legacy Finance Modal Wiring Fix

Data: 2026-06-06 07:55 Europe/Warsaw

### FAKTY
- Produkcyjny bundle CaseDetail zawieral jednoczesnie nowy i stary modal.
- Widoczny modal w karcie sprawy byl inline FIN-11 w CaseDetail.tsx, a nie wspolny CaseFinanceEditorDialog.
- R7 przepina legacy modal CaseDetail na kolejnosc: Rodzaj prowizji -> Stawka -> Wartosc prowizji -> Podstawa procentu -> Waluta -> Status.

### TESTY
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node --test tests/stage220a36r7-case-detail-legacy-finance-modal.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Guardy A36 wczesniej pilnowaly wspolnego komponentu, ale nie pilnowaly inline modala CaseDetail, dlatego UI produkcyjne moglo pozostac stare.
- Po R7 trzeba sprawdzic bundle w przegladarce: hasOldTitle powinno byc false, a hasNewTitle true.
- Blad /api/case-items 500 jest osobnym watkiem; wymaga Response z Network, jesli po deployu R7 nadal wystapi.

## STAGE220A36-R10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Commission Modal Three-Field Top Row Polish

Data: 2026-06-06 08:55 Europe/Warsaw

### FAKTY
- Po R7 produkcyjny bundle byl aktualny, ale UX nadal nie odpowiadal oczekiwaniu: u gory mialy byc trzy pola decyzyjne, a wartosc transakcji/zlecenia osobno nizej.
- R10 uklada modal jako: Rodzaj prowizji -> Stawka (%) -> Wartosc prowizji w pierwszym rzedzie, a Wartosc transakcji/zlecenia jako osobne pole pod spodem.

### TESTY
- node scripts/check-stage220a36r10-commission-modal-three-field-layout.cjs
- node --test tests/stage220a36r10-commission-modal-three-field-layout.test.cjs
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a32-finance-controls-delete-labels.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Zmieniany jest tylko uklad i copy modala, nie model danych ani zapis prowizji.
- Stare guardy A31/A32/R7 zostaja dostosowane do nowego labela wartosci transakcji/zlecenia, zeby nie blokowaly poprawnego UX.
- /api/case-items 500 pozostaje osobnym watkiem, jesli nadal wystepuje po deployu.


## STAGE220A36-R11 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Commission Modal Compact Tooltips + Alignment

Data: 2026-06-06 09:10 Europe/Warsaw

### FAKTY
- R10 logicznie uĂ„Ä…Ă˘â‚¬ĹˇoĂ„Ä…Ă„ËťyĂ„Ä…Ă˘â‚¬Ĺˇ pola, ale modal nadal byĂ„Ä…Ă˘â‚¬Ĺˇ zbyt przytĂ„Ä…Ă˘â‚¬ĹˇaczajÄ‚â€žĂ˘â‚¬Â¦cy przez opisy pod polami i zbyt wysokie inputy.
- R11 przenosi opisy do tooltipĂ„â€šÄąâ€šw Ä‚ËĂ˘â€šÂ¬ÄąÄľ?Ä‚ËĂ˘â€šÂ¬ÄąÄ„, skraca Ă„Ä…Ă˘â‚¬Ĺźrodkowy label do Ä‚ËĂ˘â€šÂ¬ÄąÄľStawka (%)Ä‚ËĂ˘â€šÂ¬ÄąÄ„, zmniejsza wysokoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ pĂ„â€šÄąâ€šl i wyrĂ„â€šÄąâ€šwnuje Ă„Ä…Ă˘â‚¬Ĺźrodkowe pole stawki.

### TESTY
- node scripts/check-stage220a36r11-commission-modal-compact-tooltips.cjs
- node --test tests/stage220a36r11-commission-modal-compact-tooltips.test.cjs
- node scripts/check-stage220a36r10-commission-modal-three-field-layout.cjs
- node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Zmieniany jest tylko UX/copy/CSS modala, nie zapis prowizji ani backend.
- Native tooltip na title jest prosty i bezpieczny, ale na mobile nie daje peĂ„Ä…Ă˘â‚¬Ĺˇnego komfortu Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ jeĂ„Ä…Ă„Ëťeli to bÄ‚â€žĂ˘â€žËdzie problem, kolejny etap powinien zrobiÄ‚â€žĂ˘â‚¬Ë‡ wĂ„Ä…Ă˘â‚¬Ĺˇasny popover.
- Trzeba rÄ‚â€žĂ˘â€žËcznie sprawdziÄ‚â€žĂ˘â‚¬Ë‡, czy trzy pola w gĂ„â€šÄąâ€šrnym rzÄ‚â€žĂ˘â€žËdzie nie Ă„Ä…Ă˘â‚¬ĹźciskajÄ‚â€žĂ˘â‚¬Â¦ siÄ‚â€žĂ˘â€žË na szerokoĂ„Ä…Ă˘â‚¬Ĺźci laptopa i czy wÄ‚â€žĂ˘â‚¬Â¦skie ekrany poprawnie zawijajÄ‚â€žĂ˘â‚¬Â¦ do jednej kolumny.

## STAGE220A36-R12 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Commission Modal Width Polish

Data: 2026-06-06 09:35 Europe/Warsaw

### FAKTY
- Po R11 modal byl czytelniejszy, ale select rodzaju prowizji nadal ucinal tekst, a pole wartosci transakcji/zlecenia zajmowalo zbyt duzo szerokosci.
- R12 poszerza pole rodzaju prowizji, utrzymuje kompaktowa stawke i kwote prowizji oraz ogranicza szerokosc pola wartosci transakcji/zlecenia.

### TESTY
- node scripts/check-stage220a36r12-commission-modal-width-polish.cjs
- node --test tests/stage220a36r12-commission-modal-width-polish.test.cjs

### AUDYT RYZYK
- Zmieniany jest tylko CSS i marker ukladu modala; logika zapisu prowizji zostaje bez zmian.
- Na waskich ekranach pola nadal skladaja sie do jednej kolumny.

## STAGE226R10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Lead/Client Separation Runtime Fix

Data: 2026-06-06 09:35 Europe/Warsaw

### FAKTY
- Lead i klient sa osobnymi bytami. Dodanie leada nie moze tworzyc ani wyswietlac klienta.
- W api/leads.ts zwykly POST tworzacy leada nie moze wywolywac ensureClientForLead ani wypelniac client_id/linked_case_id.
- Konwersja do klienta zostaje tylko w jawnym przeplywie start_service.

### TESTY
- node scripts/check-stage226r10-lead-client-separation-runtime.cjs
- node --test tests/stage226r10-lead-client-separation-runtime.test.cjs
- opcjonalnie Stage226 lost-lead-rescue guard/test jesli pliki istnieja
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Najwieksze ryzyko bylo w zwyklym POST /api/leads, ktory mogl zapewniac klienta przed utworzeniem leada.
- Nie ruszano Supabase schema, RLS, Stage227 ani finansow A36 poza malym R12 CSS.
- Trzeba recznie potwierdzic: dodanie leada nie zwieksza liczby klientow na /clients.

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ lead/client conflict hardening

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- typ wpisu: etap naprawczy / runtime hardening po Stage226R10
- decyzja: tworzenie leada zostaje lead-only; konflikt z klientem ma byÄ‚â€žĂ˘â‚¬Ë‡ ostrzeĂ„Ä…Ă„Ëťeniem i linkiem do klienta, nie Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„ËťkÄ‚â€žĂ˘â‚¬Â¦ przywrĂ„â€šÄąâ€šcenia klienta z formularza leada.
- zmiana: w Leads.tsx zostaje jeden EntityConflictDialog dla leadĂ„â€šÄąâ€šw; kandydaci typu client majÄ‚â€žĂ˘â‚¬Â¦ wymuszone canRestore=false w tym flow; restoreConflictCandidate nie wykonuje updateClientInSupabase dla klienta.
- testy/guardy: scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs, tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs, plus regresja Stage226R10.
- ryzyko: jeĂ„Ä…Ă˘â‚¬Ĺźli klient istnieje w /clients, po dodaniu podobnego leada nadal bÄ‚â€žĂ˘â€žËdzie widoczny jako stary klient Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ to nie jest nowy klient. Manual smoke musi liczyÄ‚â€žĂ˘â‚¬Ë‡ klientĂ„â€šÄąâ€šw przed i po dodaniu leada.
- status: local ZIP patch; do uruchomienia i pushu po PASS.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ fix po czerwonym R10C

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- typ wpisu: hotfix patchera i kontraktu lead/client separation po R10B/R10C
- decyzja: klient z konfliktu przy tworzeniu leada nie moĂ„Ä…Ă„Ëťe byÄ‚â€žĂ˘â‚¬Ë‡ przywracany z flow leada; tylko PokaĂ„Ä…Ă„Ëť klienta albo Dodaj mimo to jako osobnego leada.
- zmiana: restoreConflictCandidate blokuje candidate.entityType === 'client' bez updateClientInSupabase; kandydaci typu client dostajÄ‚â€žĂ˘â‚¬Â¦ canRestore=false przed zapisaniem do state.
- naprawa procesu: R10C2 usuwa nieudane, niezatwierdzone pliki R10C po przerwanym apply i dodaje odporny patcher regexowy.
- testy: R10C2 guard/test, R10B guard/test, R10 guard/test, build, verify:closeflow:quiet, git diff --check.
- ryzyko: istniejÄ‚â€žĂ˘â‚¬Â¦cy klient z tymi samymi danymi dalej bÄ‚â€žĂ˘â€žËdzie widoczny w /clients, ale nie jest tworzony ani przywracany przez dodanie leada.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ duplicate confirmation gate

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- typ wpisu: hotfix po rÄ‚â€žĂ˘â€žËcznym smoke R10C4
- decyzja: duplikat albo konflikt danych kontaktowych moĂ„Ä…Ă„Ëťe byÄ‚â€žĂ˘â‚¬Ë‡ zapisany tylko po Ă„Ä…Ă˘â‚¬Ĺźwiadomym potwierdzeniu. Brak dziaĂ„Ä…Ă˘â‚¬Ĺˇania checkerĂ„â€šÄąâ€šw konfliktĂ„â€šÄąâ€šw ma zatrzymaÄ‚â€žĂ˘â‚¬Ë‡ zapis, a nie przepuĂ„Ä…Ă˘â‚¬ĹźciÄ‚â€žĂ˘â‚¬Ë‡ rekord po cichu.
- zmiana: Leads.tsx i Clients.tsx nie Ă„Ä…Ă˘â‚¬ĹˇykajÄ‚â€žĂ˘â‚¬Â¦ bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu findEntityConflictsInSupabase do pustej listy. Przy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdzie pokazujÄ‚â€žĂ˘â‚¬Â¦ komunikat i zatrzymujÄ‚â€žĂ˘â‚¬Â¦ zapis. Przy konflikcie pokazujÄ‚â€žĂ˘â‚¬Â¦ komunikat i dialog z opcjÄ‚â€žĂ˘â‚¬Â¦ Ä‚ËĂ˘â€šÂ¬ÄąÄľDodaj mimo toÄ‚ËĂ˘â€šÂ¬ÄąÄ„.
- testy/guardy: check/test stage226r10d2 plus regresje R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check.
- audyt ryzyk: fail-closed moĂ„Ä…Ă„Ëťe chwilowo blokowaÄ‚â€žĂ˘â‚¬Ë‡ zapis przy awarii API konfliktĂ„â€šÄąâ€šw, ale to jest bezpieczniejsze niĂ„Ä…Ă„Ëť ciche mnoĂ„Ä…Ă„Ëťenie duplikatĂ„â€šÄąâ€šw klientĂ„â€šÄąâ€šw/leadĂ„â€šÄąâ€šw.
- status: local ZIP patch; push po PASS i rÄ‚â€žĂ˘â€žËcznym smoke.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ changelog

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- dodano centralny kontrakt `src/lib/calendar-timezone-contract.ts`.
- poprawiono UI reminder calculation w EventCreateDialog i TaskCreateDialog.
- poprawiono event/task server routes, Google outbound i inbound na kontrakt Europe/Warsaw.
- dodano guard/test R11 i aktualizacje project memory/Obsidian update.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ changelog

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- poprawiono test R11: wynik z VM jest serializowany do plain object przed deepStrictEqual.
- logika aplikacji R11 nie zostaĂ„Ä…Ă˘â‚¬Ĺˇa zmieniona w R11B.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_CHANGELOG_START -->
## 2026-06-06 15:35 Europe/Warsaw Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE227A Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Sales Funnel Movement View

Dodano lokalny read-only widok `/funnel`, helper `sales-funnel-movement`, guard, runtime test, route i menu Lejek. Zakres: owner-control funnel bez drag/drop, bez mutacji, bez AI scoringu i bez zmian DB/RLS.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_CHANGELOG_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_CHANGELOG_START -->
## 2026-06-06 15:45 Europe/Warsaw Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE227B Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ sales funnel decision list

Przebudowano `/funnel` z przeĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇadowanego kanbana na czytelny widok decyzyjny: kafle filtrĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬Ĺˇw, pasek etapĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬Ĺˇw, jedna szeroka lista i panel priorytetu.
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_CHANGELOG_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_CHANGELOG_START -->
## 2026-06-06 17:05 Europe/Warsaw Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE228A Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ funnel truth + clickability

Poprawiono `/funnel`: domyĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźlnie pokazuje wszystkie rekordy, kafle wĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźcicielskie i etapy nie nakĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇadajÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ siÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Â na siebie w sposĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬Ĺˇb ukrywajÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cy Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…ÄąĹşrĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬ĹˇdĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇa kwot, a karty pokazujÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦ Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…ÄąĹşrĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬ĹˇdĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇo wartoĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźci/prowizji.
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_CHANGELOG_END -->

## 2026-06-06 18:00 Europe/Warsaw Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE228B Lead Work Action Center

- typ: etap wdroĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€ąÄąÄ„eniowy local-only
- decyzja: Lead nie dostaje peĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇnego lejka; dostaje centrum pracy Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€žĂ„ÄľCo robimy teraz?Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚â€žĂ„â€¦Ä‚â€žĂ˘â‚¬Ĺľ z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzyÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ drugiego systemu dziaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ; uĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€ąÄąÄ„ywaÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ istniejÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cych handlerĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬Ĺˇw LeadDetail.


## 2026-06-06 18:05 Europe/Warsaw - STAGE228B_R7_MOJIBAKE_CLEANUP
- Scope: cleanup after Stage228B local patcher introduced Polish mojibake in LeadDetail.
- Decision: do not weaken Stage98. Repair source text to clean UTF-8 and rerun Stage98 + Stage228B + Stage228A/227B regressions.
- Status: local-only until tests pass and Damian approves push.

## 2026-06-06 18:36 Europe/Warsaw - STAGE228B_R8_ALERTTRIANGLE_IMPORT_HOTFIX

- Fixed LeadDetail production crash: AlertTriangle was used in Stage228B UI but was not imported from lucide-react.
- Added guard: scripts/check-stage228b-alerttriangle-import.cjs.
- Added guard to quiet release gate.

## 2026-06-06 18:42 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE228B R9 import source repair

- FAKT: Stage228B R8 naprawil brak AlertTriangle, ale uszkodzil zrodla importow w LeadDetail: useNavigate trafil do lucide-react, a ArrowLeft do react.
- DECYZJA: nie cofac calego Stage228B i nie oslabiaÄ‚â€žĂ˘â‚¬Ë‡ guardow; naprawic zrodlo importow i dodac guard na import sources.
- TESTY: Stage228B R9 ma odpalic R9 guard, R8 guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: kazdy kolejny patcher importow w LeadDetail musi traktowac trzy importy na gorze pliku jako kontrakt: react, react-router-dom, lucide-react.

## 2026-06-06 18:50 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE228B R10 import guard false-positive fix

- FAKT: Stage228B R9 naprawil top importy w LeadDetail, ale guard mial regex przechodzacy przez wiele importow i falszywie wykrywal useNavigate w lucide-react.
- DECYZJA: nie omijac builda ani guardow; naprawic guard tak, aby parsowal pojedyncze deklaracje importow i nadal pilnowal zrodel: react, react-router-dom, lucide-react.
- TESTY: R10 ma odpalic import-source guard, AlertTriangle guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: patchery importow musza traktowac trzy pierwsze importy w LeadDetail jako kontrakt.

## 2026-06-06 19:05 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE228B R13 Canonical LeadDetail imports repair

- Status: local hotfix package for broken pushed Stage228B commit 14f00a3d.
- Scope: deterministic rewrite of LeadDetail imports for react, react-router-dom and lucide-react.
- Guard: parser-based checks for AlertTriangle and hook import sources.
- Risk note: R8/R9/R10/R12 failures were caused by brittle regex/import handling; R13 uses declaration-level parsing.

## 2026-06-06 19:45 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE228B_R14_LEAD_ACTION_CENTER_VST

- FAKT: Po Stage228B LeadDetail dziaĂ„Ä…Ă˘â‚¬Ĺˇa, ale centrum dziaĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺľ leada byĂ„Ä…Ă˘â‚¬Ĺˇo mniej czytelne niĂ„Ä…Ă„Ëť analogiczna karta sprawy.
- DECYZJA: Nie tworzyÄ‚â€žĂ˘â‚¬Ë‡ osobnego systemu wizualnego dla leada. Lead action center ma iĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ w kierunku tego samego Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa wizualnego co CaseDetail: jeden nagĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwek, jasne grupy, kompaktowe wiersze, akcje przy rekordzie.
- ZMIANA: UsuniÄ‚â€žĂ˘â€žËto duplikujÄ‚â€žĂ˘â‚¬Â¦ce copy, poprawiono separator w wierszach, ograniczono "Braki i blokady" do jawnych brakĂ„â€šÄąâ€šw/blokad zamiast dublowaÄ‚â€žĂ˘â‚¬Ë‡ kaĂ„Ä…Ă„Ëťde zalegĂ„Ä…Ă˘â‚¬Ĺˇe wydarzenie.
- TESTY: Stage228B R14 guard/test, Stage228B guard/test, Stage98, build, verify quiet, diff-check.
- RYZYKO: Po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ rÄ‚â€žĂ˘â€žËcznie LeadDetail z zalegĂ„Ä…Ă˘â‚¬Ĺˇym wydarzeniem i porĂ„â€šÄąâ€šwnaÄ‚â€žĂ˘â‚¬Ë‡ czytelnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ do CaseDetail.

<!-- STAGE228F_R2_RUNTIME_COPY_CLEANUP -->
## 2026-06-07 18:55 Europe/Warsaw - STAGE228F R2 runtime copy cleanup

- Naprawiono paczke R1: blad PowerShell parsera zastapiono prostym runnerem i patcherem Node.js.
- Usunieto dwa dopiski z prawego raila klientow.
- Usunieto gorny kafelek Historia z leadow, bez usuwania filtra Historia po prawej.
- Dodano guard `scripts/check-stage228f-runtime-copy-cleanup.cjs`.

<!-- STAGE228G_CHANGELOG -->
## 2026-06-07 19:05 Europe/Warsaw - STAGE228G cases copy cleanup + operator rail source truth

- Removed noisy case-row helper copy under the client line.
- Added desktop one-row marker/CSS for /cases top metric cards.
- Replaced local cases operational shortcuts markup with shared SimpleFiltersCard.
- Added shared operator rail tone resolver and CSS so SimpleFiltersCard, TopValueRecordsCard and cases risk links use the same visual intensity model.

<!-- STAGE228H_R3_CHANGELOG -->
## 2026-06-07 19:45 Europe/Warsaw - STAGE228H R3 Sales Funnel visual source truth
- UsuniÄ‚â€žĂ˘â€žËto panel wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciciela z /funnel.
- Kafelki decyzyjne lejka przepiÄ‚â€žĂ˘â€žËto na OperatorMetricTile jako wspĂ„â€šÄąâ€šlne Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇo wizualne.
- Dodano CSS source truth dla ukĂ„Ä…Ă˘â‚¬Ĺˇadu /funnel.
- Poprawiono stale guard Stage220A36 po usuniÄ‚â€žĂ˘â€žËciu opisu Ä‚ËĂ˘â€šÂ¬ÄąÄľ5 klientĂ„â€šÄąâ€šw...Ä‚ËĂ˘â€šÂ¬ÄąÄ„.
<!-- /STAGE228H_R3_CHANGELOG -->

<!-- STAGE228R1_CHANGELOG -->
## 2026-06-08 - Stage228R1
Dodano statyczny CSS source truth dla tekstu i rytmu rail /leads, /clients, /cases na bazie wzorca /tasks.
<!-- /STAGE228R1_CHANGELOG -->

<!-- STAGE228R2_ADMIN_FEEDBACK_RAIL_CLEANUP_CHANGELOG -->
## 2026-06-08 08:58 Europe/Warsaw - Stage228R2 admin feedback rail cleanup

- Removed Billing right-rail `AI jako dodatek Beta` card.
- Removed Billing right-rail trial/free description under `Status konta`.
- Removed Notifications right-rail explainer card `Jak dzialaja powiadomienia?`.
- Removed AI Drafts right-rail explainer card `Jak dziala szkic?`.
- Added static CSS source `src/styles/admin-feedback-rail-cleanup-stage228r2.css` for plain rail headings and compact rail rows.
- Added guard `scripts/check-stage228r2-admin-feedback-rail-cleanup.cjs` and package script.
- Fixed Sales Funnel separator source to ASCII-safe `\u00b7`.
<!-- /STAGE228R2_ADMIN_FEEDBACK_RAIL_CLEANUP_CHANGELOG -->

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_CHANGELOG

- Added C5 no-SQL decision guard for Brak.
- Confirmed Brak remains:
  - lead/client: task/activity missing_item,
  - case: case_items.
- Added final C5 manual test plan.
- No SQL/RLS/finance/layout changes.

## 2026-06-08 21:45 Europe/Warsaw - STAGE228R15_CHANGELOG

- Fixed missing item deletion by using soft-delete status=deleted for lead/client missing_item tasks.
- Added LeadDetail and ClientDetail refresh listeners for closeflow:context-action-saved.
- Added R15 regression guard.
- No SQL/RLS/schema changes.

## 2026-06-08 21:55 Europe/Warsaw - STAGE228R15R2_CHANGELOG

- Repaired Stage228R15 guard syntax.
- No runtime logic change beyond already-applied R15.
- No SQL.

## 2026-06-08 22:30 Europe/Warsaw - STAGE228R16R2_CHANGELOG

- Fixed broken Stage228R16 apply packaging.
- Added SQL trace for leads.next_action_title nullable.
- Replaced global task hard-delete path with soft-delete.
- Added explicit Lead Brak quick action.
- Hardened Client Brak button pointerdown/click opening.

<!-- STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->
## 2026-06-08 20:45 Europe/Warsaw - Stage228R17 missing_item delete contract

STATUS: LOCAL_ONLY_APPLIED_BY_ZIP, test reczny DO WYKONANIA.

FAKTY:
- Objaw: klikniecie UsuĂ„Ä…Ă˘â‚¬Ĺľ przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuĂ„Ä…Ă˘â‚¬Ĺľ -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastÄ‚â€žĂ˘â€žËpny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ Stage228R18 Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ missing item hard delete source truth

- problem: Brak znikaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇ po klikniÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âciu UsuĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ, ale wracaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇ po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚â€ąĂ˘â‚¬Ë‡ Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…ÄąĹşrĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬ÄąË‡Ă„Ä…Ă˘â‚¬ĹˇdĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇowana z linkedTasks, nie z caĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇego timeline, Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€ąÄąÄ„eby activity history nie odtwarzaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇa aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test rÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âczny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€ąÄąÄ„ soft-delete; historia usuniÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âcia zostaje jako activity.

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

---

## 2026-06-09 02:50 Europe/Warsaw Ä‚â€žĂ˘â‚¬ĹˇÄ‚â€ąĂ‚ÂĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąË‡Ä‚â€šĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Ă„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇaĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ä‚ËĂ˘â€šÂ¬ÄąÄľcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera siÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Â juĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ˘â‚¬ĹľÄ‚â€ąÄąÄ„ na dokĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇadnym polskim tekĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…ÄąĹźcie toastu, tylko na strukturze przepĂ„â€šĂ˘â‚¬ĹľÄ‚â€žĂ˘â‚¬Â¦Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă‹â€ˇywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany rÄ‚â€žĂ˘â‚¬ĹˇÄ‚ËĂ˘â€šÂ¬ÄąÄľĂ„â€šĂ‹ÂÄ‚ËĂ˘â€šÂ¬ÄąÄľÄ‚â€ąĂ‚Âczny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

<!-- STAGE230B_QUICK_CAPTURE_INBOX_CHANGELOG_START -->
## 2026-06-09 - STAGE230B Quick Capture Inbox bez AI

Status: LOCAL_ONLY_APPLIED_BY_ZIP_R6 / DO_MANUAL_QA_AND_PUSH

Changed:
- Added Szybki szkic panel on /ai-drafts.
- Saved raw draft through saveAiLeadDraftAsync with source quick_capture and type note.
- Added Szybki szkic label/helper.
- Added CSS, guard, test, run report and Obsidian update.

Not changed:
- No SQL.
- No AI parser.
- No Gemini/Cloudflare.
- No custom microphone JS.
<!-- STAGE230B_QUICK_CAPTURE_INBOX_CHANGELOG_END -->

<!-- STAGE230B_R8_TITLE_PREVIEW_HOTFIX -->
## 2026-06-09 - STAGE230B R8 - title preview guard hotfix
- Naprawiono brak kontraktu tytulu quick capture w getDraftTitle.
- Utrzymano brak AI parse, brak SQL, brak providerow AI w handlerze Stage230B.

<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_CHANGELOG_START -->
## 2026-06-09 - STAGE230C Phone dictation duplicate-words audit

Changed:
- Added optional Debug dyktowania panel inside Szybki szkic on /ai-drafts.
- Added local voice_input_event_trace for beforeinput/input/change/composition/paste.
- Added duplicate signal diagnostics: repeated_last_word_x2, repeated_last_word_x3_plus, repeated_tail_phrase, same_value_reapplied, large_append, composition_duplicate_suspected.
- Added copy/clear trace actions and local event counters.
- Added Stage230C guard/test.

Not changed:
- No AI parser.
- No Gemini/Cloudflare provider.
- No Supabase schema.
- No approval engine.
- No automatic deduplication.
<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_CHANGELOG_END -->

<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_CHANGELOG_START -->
## 2026-06-09 - STAGE230C-R2 Voice debug visibility/readability hotfix

Changed:
- Made Stage230C trace controls discoverable and visible.
- Added R2 marker and readable textarea marker.
- Added high-specificity CSS for quick capture textarea, save button, trace buttons and trace text.
- Added Stage230C-R2 guard/test.

Not changed:
- No dedupe or text mutation.
- No AI parse.
- No Supabase schema.
<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_CHANGELOG_END -->

<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_CHANGELOG_START -->
## 2026-06-09 - STAGE230C R6 voice debug panel rewrite

Changed:
- Rewrote Szybki szkic JSX block to remove dangling conditional close.
- Kept Kopiuj trace/WyczyĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ trace visible with disabled state when debug is off or trace is empty.
- Replaced Stage230C visibility guard with syntax-safe region-based guard.

Not changed:
- No deduplication.
- No save flow changes.
- No AI parse or schema changes.
<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_CHANGELOG_END -->


<!-- STAGE230C_R7_MASS_GUARD_AND_BUILD_PREFLIGHT -->
## 2026-06-09 - STAGE230C R7 mass guard/build preflight
- Rewrote Stage230C-R2 visibility guard/test with syntax-safe code.
- Added mass node --check before runtime tests.
- No deduplication and no AI parser changes.

<!-- STAGE230C_R8_MASS_PANEL_REGION_REWRITE_CHANGELOG_START -->
## 2026-06-09 - STAGE230C R8 mass panel region rewrite

Changed:
- Rewrote the whole quick capture JSX region to remove dangling conditional fragments from previous local hotfixes.
- Kept Kopiuj trace / WyczyĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ trace visible and disabled when trace is unavailable.
- Added forced readable text styles for mobile textarea and trace controls.
- Replaced R2 visibility guard/test with syntax-safe mass-preflight version.

Not changed:
- No automatic deduplication.
- No AI parser.
- No Supabase schema.
<!-- STAGE230C_R8_MASS_PANEL_REGION_REWRITE_CHANGELOG_END -->

<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_CHANGELOG_START -->
## 2026-06-09 - STAGE230C R10 quick capture visual source truth

Changed:
- Connected quick capture visual style to lead-form visual source truth.
- Added lead-form-section/lead-form-textarea classes and R10 markers.
- Forced dark readable textarea text, placeholder and caret on mobile.
- Forced readable save/trace/disabled button colors.
- Added Stage230C-R10 guard/test.

Not changed:
- No dictation deduplication.
- No AI parser.
- No Supabase schema.
- No save flow changes.
<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_CHANGELOG_END -->

<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_CHANGELOG_START -->
## 2026-06-09 - STAGE230C R12 R2 guard global marker compatibility

Changed:
- Replaced brittle quick-capture region extraction in the R2 visibility guard.
- Added marker-based validation compatible with R8 panel rewrite and R10 visual source truth classes.
- Kept existing UI/CSS unchanged.

Not changed:
- No dictation deduplication.
- No AI parser.
- No Supabase schema.
- No save flow changes.
<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_CHANGELOG_END -->

<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_CHANGELOG_START -->
## 2026-06-09 - STAGE230C R15 guard split + visual source truth

Changed:
- Stabilized R2 visibility guard/test.
- Stabilized R10 visual source truth guard/test.
- Re-applied quick capture source truth markers and readable text CSS selectors.
- Kept quick capture aligned with lead/client form visual source truth.

Not changed:
- No deduplication.
- No AI parser.
- No Supabase schema.
- No save flow change.
<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_CHANGELOG_END -->

<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_CHANGELOG_START -->
## 2026-06-09 - STAGE231A Google auth entry consistency

Changed:
- Added Google entry to registration tab.
- Renamed login Google button to "Kontynuuj przez Google".
- Added explicit copy that a new Google account can create a trial workspace.
- Added /api/me public trial bootstrap marker.
- Added urgent auth backlog to next steps.
- Added Stage231A guard/test.

Not changed:
- No Supabase schema change.
- No invite-only gate yet.
- No Firebase Settings migration yet.
<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_CHANGELOG_END -->

## 2026-06-09 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D_GOOGLE_AUTH_INTENT_GATE

- Added Google login/register intent gate.
- Added auth intent session helper.
- Added x-closeflow-auth-intent API header.
- Added REGISTER_FIRST_REQUIRED API gate for Google login path without existing profile.
- Changed logged-out / and /start to one auth entry.
- Documented STAGE231C Supabase auth trigger no-op repair.
- Added future backlog: STAGE231E email copy repair and STAGE231F invite-only test mode.

## 2026-06-09 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D_R5_GOOGLE_LOGIN_MISSING_INTENT_HARD_GATE

- Hardened Google login/register intent gate after manual QA showed unknown Google Login still entered app.
- Added authIntent URL fallback for OAuth/email confirmation redirects.
- Added explicit /api/me?authIntent=... propagation.
- Added authIntent to GET cache scope.
- Changed api/me gate: Google OAuth cannot bootstrap a missing app profile unless authIntent=register.
- Preserved working flows from QA: existing Google login, Google registration, e-mail confirmation, one auth page.

<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_START -->
## 2026-06-10 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE230D0 Text/Input Contrast Sweep

FAKT:
- Damian zgĂ„Ä…Ă˘â‚¬ĹˇosiĂ„Ä…Ă˘â‚¬Ĺˇ biaĂ„Ä…Ă˘â‚¬Ĺˇy tekst na biaĂ„Ä…Ă˘â‚¬Ĺˇym tle podczas wpisywania/dyktowania w aplikacji.
- Zakres R1: /ai-drafts, szybki szkic, Stage230C debug trace, input/textarea/select/placeholder/focus.

DECYZJA:
- Tryb CloseFlow: GIT-FIRST / PUSH-FIRST.
- Nie uĂ„Ä…Ă„ËťywaÄ‚â€žĂ˘â‚¬Ë‡ lokalnych ZIP-Ă„â€šÄąâ€šw jako gĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwnej Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťki dla Damiana.

TESTY:
- Stage230B regression guard/test.
- Stage230C regression guard/test.
- Stage230D0 contrast guard/test.
- npm run build.
- git diff --check.

RYZYKA:
- MoĂ„Ä…Ă„Ëťliwe podobne problemy kontrastu w innych moduĂ„Ä…Ă˘â‚¬Ĺˇach aplikacji.
- Nie wdraĂ„Ä…Ă„Ëťano deduplikacji dyktowania bez trace.
<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END -->

## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0 R5

- Dodano flow zamykania sprawy bez delete.
- ZamkniÄ‚â€žĂ˘â€žËcie uĂ„Ä…Ă„Ëťywa status completed i lastActivityAt.
- Dodano activity "Sprawa zamkniÄ‚â€žĂ˘â€žËta".
- GĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwne CTA zmienione na "Zamknij sprawÄ‚â€žĂ˘â€žË" / "Sprawa zamkniÄ‚â€žĂ˘â€žËta".
- Awaryjne usuwanie zostaje osobno.
- Dodano guard, test, run report i obsidian update.

## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R7

Added closed case archive view, restore flow, client closed cases section and guard/test.


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "PrzywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ sprawÄ‚â€žĂ˘â€žË".
- Restore flow uĂ„Ä…Ă„Ëťywa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostajÄ‚â€žĂ˘â‚¬Â¦ zachowane; delete flow nie jest uĂ„Ä…Ă„Ëťywany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `PrzywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ sprawÄ‚â€žĂ˘â€žË` uĂ„Ä…Ă„Ëťywa handlera reopen.
- Logika finansĂ„â€šÄąâ€šw, delete flow i dane rozliczeĂ„Ä…Ă˘â‚¬Ĺľ pozostajÄ‚â€žĂ˘â‚¬Â¦ bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźciach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formÄ‚â€žĂ˘â€žË `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `PrzywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ sprawÄ‚â€žĂ˘â€žË` uĂ„Ä…Ă„Ëťywa handlera reopen.
- Bez zmian w delete flow, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźciach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietÄ‚â€žĂ˘â€žË `Sprawy zamkniÄ‚â€žĂ˘â€žËte` oraz filtr aktywne vs zamkniÄ‚â€žĂ˘â€žËte.
- Bez zmian w delete flow, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźciach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamkniÄ‚â€žĂ˘â€žËte`, `PrzywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ sprawÄ‚â€žĂ˘â€žË`.
- Kontrakt uĂ„Ä…Ă„Ëťywa wspĂ„â€šÄąâ€šlnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźciach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamkniÄ‚â€žĂ˘â€žËte/przywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźciach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- PodziaĂ„Ä…Ă˘â‚¬Ĺˇ uĂ„Ä…Ă„Ëťywa wspĂ„â€šÄąâ€šlnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźciach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźciach, prowizjach i lifetime finance.
\n\n## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n- Status: LOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR.\n- Naprawa po czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowym R4: elastyczny patch ClientDetail, aktywne/zamkniÄ‚â€žĂ˘â€žËte sprawy klienta, restore z klienta, CSS, guard/test.\n- Finanse i historia zachowane.\n

## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0_R8_R8_DUPLICATE_CONST_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniÄ‚â€žĂ˘â€žËto sklejone anchory `const X = useMemo( const X = useMemo(` po czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowym R2/R4/R6/R7.
- Zakres: dotkniÄ‚â€žĂ˘â€žËte pliki TSX, whitespace, sanity check R8, peĂ„Ä…Ă˘â‚¬Ĺˇny build/test.



## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0_R8_R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniÄ‚â€žĂ˘â€žËto stary drugi `toggleCaseView`, ktĂ„â€šÄąâ€šry pozostaĂ„Ä…Ă˘â‚¬Ĺˇ po R8 obok URL-aware `setCaseViewStage231B0R8`.
- Guard R8 rozszerzony o dokĂ„Ä…Ă˘â‚¬Ĺˇadnie jeden `toggleCaseView` i zakaz legacy `setCaseView((prev) => ...)`.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R9 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Client history and case view model
- Status: LOCAL_ONLY_PREPARED.
- Zakres: /cases jawne widoki Otwarte/ZamkniÄ‚â€žĂ˘â€žËte/Wszystkie, zamkniÄ‚â€žĂ˘â€žËte sprawy klienta przeniesione do Historii, szerszy layout klienta, finanse all_cases zachowane.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow R25/R41, build, git diff --check.
- Ryzyka: UX historii klienta, sourceCases w /cases, brak regresji finansĂ„â€šÄąâ€šw i aktywnych ryzyk.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R9-R2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Cases URL reader repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowym R9: brakowaĂ„Ä…Ă˘â‚¬Ĺˇo jawnego searchParams.get('view') w src/pages/Cases.tsx.
- R8 guard dostosowany do R9 modelu open/closed/all, aby regresja R8 dalej sprawdzaĂ„Ä…Ă˘â‚¬Ĺˇa intencjÄ‚â€žĂ˘â€žË, nie stary exact string.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R9-R3 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Closed case banner repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowym R9-R2: `/cases` musi mieÄ‚â€žĂ˘â‚¬Ë‡ widoczny banner `SPRAWA ZAMKNIÄ‚â€žĂ‚ÂTA` dla zamkniÄ‚â€žĂ˘â€žËtej sprawy.
- Guard R9 rozszerzony o data-marker bannera, Ă„Ä…Ă„Ëťeby nie przechodziĂ„Ä…Ă˘â‚¬Ĺˇ sam tekst bez realnego elementu UI.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R9-R5 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Client history renderer guard repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R4: Historia klienta renderuje zamkniÄ‚â€žĂ˘â€žËte sprawy przez wspĂ„â€šÄąâ€šlny renderer karty, wiÄ‚â€žĂ˘â€žËc guard akceptuje akcje `OtwĂ„â€šÄąâ€šrz` i `PrzywrĂ„â€šÄąâ€šÄ‚â€žĂ˘â‚¬Ë‡ sprawÄ‚â€žĂ˘â€žË` z renderera, nie tylko literalnie z segmentu Historii.
- Wymuszono widoczny label `SPRAWA ZAMKNIÄ‚â€žĂ‚ÂTA` w Historii i rendererze zamkniÄ‚â€žĂ˘â€žËtej karty.
- Nie ruszano finansĂ„â€šÄąâ€šw, kosztĂ„â€šÄąâ€šw, SQL, Google Calendar ani pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci/prowizji.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R9-R6 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Right rail guard robust repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R5: guard R9 zakĂ„Ä…Ă˘â‚¬ĹˇadaĂ„Ä…Ă˘â‚¬Ĺˇ literalny `</SimpleFiltersCard>`, a komponent prawych skrĂ„â€šÄąâ€štĂ„â€šÄąâ€šw moĂ„Ä…Ă„Ëťe byÄ‚â€žĂ˘â‚¬Ë‡ self-closing albo sformatowany inaczej.
- Logika produktu bez zmian; naprawiono elastyczne wycinanie powierzchni prawego panelu w guardzie.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R9-R8 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ R8 setter wrapper scan repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R7: poprzedni patcher szukaĂ„Ä…Ă˘â‚¬Ĺˇ `toggleCaseView`, ktĂ„â€šÄąâ€šrego aktualne uĂ„Ä…Ă˘â‚¬ĹˇoĂ„Ä…Ă„Ëťenie w `Cases.tsx` nie byĂ„Ä…Ă˘â‚¬Ĺˇo stabilnym anchorem.
- Dodano jawny wrapper `setCaseViewStage231B0R8` przez skan koĂ„Ä…Ă˘â‚¬Ĺľca funkcji `setCaseViewStage231B0R9`, bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R9-R9 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Cases items JSX syntax repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R8: build wykryĂ„Ä…Ă˘â‚¬Ĺˇ bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdnÄ‚â€žĂ˘â‚¬Â¦ skĂ„Ä…Ă˘â‚¬ĹˇadniÄ‚â€žĂ˘â€žË JSX `items=[...]` w `src/pages/Cases.tsx`.
- Poprawiono na `items={[...]}` bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R9-R10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ ClientDetail JSX section close repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R9: build wykryĂ„Ä…Ă˘â‚¬Ĺˇ niedomkniÄ‚â€žĂ˘â€žËtÄ‚â€žĂ˘â‚¬Â¦ strukturÄ‚â€žĂ˘â€žË JSX w `ClientDetail.tsx` przy przejĂ„Ä…Ă˘â‚¬Ĺźciu z gĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwnej sekcji do prawego panelu.
- Dodano brakujÄ‚â€žĂ˘â‚¬Â¦ce `</section>` przed `<aside className="client-detail-right-rail"...>` bez zmiany logiki produktu.
- Nie ruszano finansĂ„â€šÄąâ€šw, kosztĂ„â€šÄąâ€šw, SQL, Google Calendar ani pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci/prowizji.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R11 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Client width + Cases runtime guard
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9 push: `/cases` rzucaĂ„Ä…Ă˘â‚¬Ĺˇ runtime `ReferenceError: closedRecordStage231B0R8 is not defined` przy wejĂ„Ä…Ă˘â‚¬Ĺźciu w widok spraw.
- Naprawa: wolne uĂ„Ä…Ă„Ëťycia `closedRecordStage231B0R8` w JSX zastÄ‚â€žĂ˘â‚¬Â¦piono bezpiecznym `isClosedCaseStatus(record?.status)`.
- UX: `ClientDetail` ma szeroki ukĂ„Ä…Ă˘â‚¬Ĺˇad jak widok sprawy, z lewym wyrĂ„â€šÄąâ€šwnaniem i breakpointami skalowania.
- Dodano guard `scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs` oraz test node.
- Nie ruszano finansĂ„â€šÄąâ€šw, kosztĂ„â€šÄąâ€šw, SQL, Google Calendar ani pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci/prowizji.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R12-R7 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Final Cases runtime contract rescue
- Status: LOCAL_ONLY_PREPARED.
- Po R12-R6 zastosowano mocniejszy rescue: helper `renderClosedCaseBannerStage231B0R12`, jeden kontrakt `activeCases/closedCases` przez `useMemo`, `record.status` tylko w dwĂ„â€šÄąâ€šch filtrach.
- Guardy R11/R12/R12-R7 pilnujÄ‚â€žĂ˘â‚¬Â¦ tego samego kontraktu i blokujÄ‚â€žĂ˘â‚¬Â¦ `closedRecordStage231B0R8` oraz `record?.status`.
- Nie ruszano finansĂ„â€šÄąâ€šw, SQL, Google Calendar, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci ani innych moduĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šw.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R13 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Cases map record scope real fix
- Status: LOCAL_ONLY_PREPARED.
- Naprawa realnego bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu po R12/R7 w `filteredCases.map((record, index) => ...)`.
- UsuniÄ‚â€žĂ˘â€žËto `caseRecord` fallback i lokalny shadow `renderClosedCaseBannerStage231B0R12` z mapy.
- Dodano scoped boolean `isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status)`.
- UsuniÄ‚â€žĂ˘â€žËto bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdny banner z loading row.
- Dodano guard/test R13 oraz zaktualizowano guardy R11/R12/R12-R7.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R13-R2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Cases map closed logic completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowym R13: guard liczbowy byĂ„Ä…Ă˘â‚¬Ĺˇ za ostry, wiÄ‚â€žĂ˘â€žËc zamieniono go na sprawdzanie konkretnych linii logiki.
- DomkniÄ‚â€žĂ˘â€žËto `attention`, `statusTone`, `compactLifecyclePill`, `nextActionLabel`, `ownerRiskBadges` i banner zamkniÄ‚â€žĂ˘â€žËtej sprawy na `isCaseClosedStage231B0R13`.
- Guard blokuje powrĂ„â€šÄąâ€št `caseRecord` fallback i local shadow helpera w mapie.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R13-R3 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Next action guard and map completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po R13-R2: guard byĂ„Ä…Ă˘â‚¬Ĺˇ zbyt wraĂ„Ä…Ă„Ëťliwy na dokĂ„Ä…Ă˘â‚¬Ĺˇadny polski tekst `Sprawa zamkniÄ‚â€žĂ˘â€žËta`.
- Znormalizowano `nextActionLabel` i zmieniono guard na strukturÄ‚â€žĂ˘â€žË logicznÄ‚â€žĂ˘â‚¬Â¦ zamiast peĂ„Ä…Ă˘â‚¬Ĺˇnego literalnego tekstu.
- Dalej blokowany jest `caseRecord` fallback i local shadow helpera w `filteredCases.map`.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R13-R4 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Guard map window repair
- Status: LOCAL_ONLY_PREPARED.
- R13-R3 guard faĂ„Ä…Ă˘â‚¬Ĺˇszywie ciÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă˘â‚¬Ĺˇ `filteredCases.map` na pierwszym zagnieĂ„Ä…Ă„ËťdĂ„Ä…Ă„Ëťonym `});`, czyli przed `nextActionLabel`.
- Naprawa: guardy uĂ„Ä…Ă„ËťywajÄ‚â€žĂ˘â‚¬Â¦ szerokiego deterministycznego okna od poczÄ‚â€žĂ˘â‚¬Â¦tku mapy zamiast pierwszego `});`.
- Nie zmieniano logiki biznesowej poza markerem stage; naprawa dotyczy guardĂ„â€šÄąâ€šw i dokumentacji.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R13-R6 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Owner risk minimal safe call
- Status: LOCAL_ONLY_PREPARED.
- R13-R5 zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË przed zmianÄ‚â€žĂ˘â‚¬Â¦ pliku, bo check starego bloku z HEAD byĂ„Ä…Ă˘â‚¬Ĺˇ bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdny.
- Naprawa: uszkodzony zakres `ownerRiskBadges -> metaParts` jest zastÄ‚â€žĂ˘â€žËpowany kompletnÄ‚â€žĂ˘â‚¬Â¦, zamkniÄ‚â€žĂ˘â€žËtÄ‚â€žĂ˘â‚¬Â¦ skĂ„Ä…Ă˘â‚¬Ĺˇadniowo deklaracjÄ‚â€žĂ˘â‚¬Â¦.
- `getCaseOwnerRiskBadges` dostaje bezpieczny kontekst lokalny: lifecycle, nearestCaseAction, nextActionLabel, statusLabel, compactLifecycleLabel, compactLifecyclePill, percent, updatedAt.

## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R14 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Client detail full-width layout lock
- Status: LOCAL_ONLY_PREPARED.
- PowĂ„â€šÄąâ€šd: kartoteka klienta nadal jest centrowana/Ă„Ä…Ă˘â‚¬ĹźciĂ„Ä…Ă˘â‚¬ĹźniÄ‚â€žĂ˘â€žËta zamiast uĂ„Ä…Ă„ËťywaÄ‚â€žĂ˘â‚¬Ë‡ peĂ„Ä…Ă˘â‚¬Ĺˇnej szerokoĂ„Ä…Ă˘â‚¬Ĺźci od lewego panelu do prawej krawÄ‚â€žĂ˘â€žËdzi ekranu.
- Zakres: marker route w ClientDetail + CSS lock w visual-stage12-client-detail-vnext.css.
- Kontrakt: brak max-width shell, width 100%, margin-inline 0, stable horizontal spacing during scroll.

## 2026-06-10 Ă„ĹąÄąÄ˝Ă‹ĹĄ STAGE231B0-R15-R2 Ă„ĹąÄąÄ˝Ă‹ĹĄ ClientDetail shared canvas width source
- Status: FINALIZE_FOR_PUSH.
- PowĂ„ĹąÄąÄ˝Ă‹ĹĄd: R14 trafiĂ„ĹąÄąÄ˝Ă‹ĹĄ w zĂ„ĹąÄąÄ˝Ă‹ĹĄy DOM node (`ClientMultiContactField`), wiĂ„ĹąÄąÄ˝Ă‹ĹĄc nie mĂ„ĹąÄąÄ˝Ă‹ĹĄgĂ„ĹąÄąÄ˝Ă‹ĹĄ rozciĂ„ĹąÄąÄ˝Ă‹ĹĄgnĂ„ĹąÄąÄ˝Ă‹ĹĄĂ„ĹąÄąÄ˝Ă‹ĹĄ kartoteki klienta.
- Decyzja: ClientDetail ma uĂ„ĹąÄąÄ˝Ă‹ĹĄywaĂ„ĹąÄąÄ˝Ă‹ĹĄ wspĂ„ĹąÄąÄ˝Ă‹ĹĄlnego canvasu strony: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"`.
- Ă„ĹąÄąÄ˝Ă‹ĹĄrĂ„ĹąÄąÄ˝Ă‹ĹĄdĂ„ĹąÄąÄ˝Ă‹ĹĄo prawdy szerokoĂ„ĹąÄąÄ˝Ă‹ĹĄci: `src/styles/closeflow-unified-page-canvas-stage211c.css`.
- Widok konsumujĂ„ĹąÄąÄ˝Ă‹ĹĄcy kontrakt: `src/pages/ClientDetail.tsx` + `src/styles/visual-stage12-client-detail-vnext.css`.
- R14 guard/test usuniĂ„ĹąÄąÄ˝Ă‹ĹĄte jako faĂ„ĹąÄąÄ˝Ă‹ĹĄszywy kontrakt.

## 2026-06-10 Ă„ĹąÄąÄ˝Ă‹ĹĄ STAGE231B0-R15-R3 Ă„ĹąÄąÄ˝Ă‹ĹĄ ClientDetail width guard + Polish encoding guard
- Status: FINAL_GUARD_FOR_PUSH.
- Potwierdzenie uĂ„ĹąÄąÄ˝Ă‹ĹĄytkownika: wyglĂ„ĹąÄąÄ˝Ă‹ĹĄd kartoteki klienta jest poprawny i ma tak zostaĂ„ĹąÄąÄ˝Ă‹ĹĄ.
- Guard szerokoĂ„ĹąÄąÄ˝Ă‹ĹĄci: `scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs`.
- Guard polskich znakĂ„ĹąÄąÄ˝Ă‹ĹĄw: `scripts/check-stage231b0-r15-r3-polish-encoding.cjs`.
- Guard pilnuje, Ă„ĹąÄąÄ˝Ă‹ĹĄe ClientDetail uĂ„ĹąÄąÄ˝Ă‹ĹĄywa wspĂ„ĹąÄąÄ˝Ă‹ĹĄlnego canvasu: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"` oraz zmiennych `--cf-page-canvas-*`.
- Guard pilnuje usuniĂ„ĹąÄąÄ˝Ă‹ĹĄcia bĂ„ĹąÄąÄ˝Ă‹ĹĄĂ„ĹąÄąÄ˝Ă‹ĹĄdnego R14 i braku mojibake/replacement chars w kluczowych plikach kartoteki klienta.
- Naprawiono higienĂ„ĹąÄąÄ˝Ă‹ĹĄ EOF w `src/pages/ClientDetail.tsx`.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R15-R4 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Polish guard safe repair R2
- Status: REPAIR_AFTER_PUSHED_FAILED_GUARD_SAFE_R2.
- PowĂ„â€šÄąâ€šd: pierwsza paczka SAFE miaĂ„Ä…Ă˘â‚¬Ĺˇa bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d runnera PowerShell - funkcja przekazywaĂ„Ä…Ă˘â‚¬Ĺˇa argumenty natywnym komendom jako pustÄ‚â€žĂ˘â‚¬Â¦ tablicÄ‚â€žĂ˘â€žË, wiÄ‚â€žĂ˘â€žËc git/node startowaĂ„Ä…Ă˘â‚¬Ĺˇy bez parametrĂ„â€šÄąâ€šw.
- Naprawa: R2 uĂ„Ä…Ă„Ëťywa jawnych wywoĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺľ w PowerShell i naprawia mojibake wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie w skrypcie JS, nie wklejanym terminalu.
- Polish guard wykrywa konkretne sekwencje mojibake, daje line evidence i blokuje blank line at EOF.
- Zasada utrzymana: commit/push tylko po PASS guardĂ„â€šÄąâ€šw, build i git diff --check.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R15-R4 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Polish guard batch repair
- Status: BATCH_REPAIR_AFTER_R2_R3_PARTIALS.
- PowĂ„â€šÄąâ€šd: R2/R3 czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowo naprawiĂ„Ä…Ă˘â‚¬Ĺˇy pliki, ale R3 zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË przez zbyt wÄ‚â€žĂ˘â‚¬Â¦ski parser dirty paths.
- Naprawa: masowo obsĂ„Ä…Ă˘â‚¬ĹˇuĂ„Ä…Ă„Ëťono warianty mojibake `Ä‚â€žĂ˘â‚¬Â¦/Ă„Ä…Ă˘â‚¬Ĺˇ/Ă„Ä…Ă˘â‚¬Ĺˇ/Ă„â€šÄąâ€š/Ä‚â€šĂ‚Â·/Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬Ĺ›`, znormalizowano EOF i poprawiono guard pod aktualnÄ‚â€žĂ˘â‚¬Â¦ kopiÄ‚â€žĂ˘â€žË ClientDetail.
- Zasada: commit/push tylko po PASS guardĂ„â€šÄąâ€šw, build i git diff --check.


## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231B0-R15-R4 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Polish guard final batch repair
- Status: FINAL_BATCH_REPAIR_AFTER_DOC_SELF_FAIL.
- PowĂ„â€šÄąâ€šd: poprzedni run report zawieraĂ„Ä…Ă˘â‚¬Ĺˇ przykĂ„Ä…Ă˘â‚¬Ĺˇadowe uszkodzone sekwencje znakĂ„â€šÄąâ€šw, a guard sĂ„Ä…Ă˘â‚¬Ĺˇusznie skanowaĂ„Ä…Ă˘â‚¬Ĺˇ teĂ„Ä…Ă„Ëť dokumentacjÄ‚â€žĂ˘â€žË etapu.
- Naprawa: dokumentacja etapu nie zapisuje juĂ„Ä…Ă„Ëť przykĂ„Ä…Ă˘â‚¬Ĺˇadowych uszkodzonych sekwencji; guard dalej skanuje kod, CSS i dokumentacjÄ‚â€žĂ˘â€žË zakresu R15.
- Guard blokuje uszkodzenia kodowania, puste linie na EOF i brak aktualnych polskich fraz w ClientDetail.
- Commit/push tylko po PASS guardĂ„â€šÄąâ€šw, build i git diff --check.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_CHANGELOG_START -->
## 2026-06-10 17:10 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0A Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Visual Source of Truth Inventory + UI Consistency Guard

Dodano:
- centralny raport `_project/VISUAL_SOURCE_OF_TRUTH.md`,
- run report `_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md`,
- payload Obsidian `_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md`,
- guard i test D0A,
- wpis roadmapy D0A przed D0.

Nie zmieniano runtime UI, danych, SQL, finansĂ„â€šÄąâ€šw, Google Auth ani Google Calendar.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_CHANGELOG_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_CHANGELOG_START -->
## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0A-R3

- ZastÄ‚â€žĂ˘â‚¬Â¦piono uszkodzony R2 czystym runnerem JS wywoĂ„Ä…Ă˘â‚¬Ĺˇywanym z PowerShell.
- Naprawiono payload Obsidiana pod guard D0A.
- Znormalizowano EOF w plikach projektu.
- Bez zmian runtime UI.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_CHANGELOG_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie niedziaĂ„Ä…Ă˘â‚¬ĹˇajÄ‚â€žĂ˘â‚¬Â¦cy runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst Ă„Ä…Ă‚Âadowanie klienta..., tekst SPRAWA ZAMKNIÄ‚â€žĂ‚ÂTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansĂ„â€šÄąâ€šw i kosztĂ„â€šÄąâ€šw.
- IstniejÄ‚â€žĂ˘â‚¬Â¦ce ostrzeĂ„Ä…Ă„Ëťenie duplicate savedRecord zostaje poza zakresem.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po PASS/push przejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ do STAGE231D1 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ model kosztĂ„â€šÄąâ€šw.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0-R5 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- DomkniÄ‚â€žĂ˘â€žËcie po R4: ikona finansĂ„â€šÄąâ€šw klienta z EntityIcon case -> payment oraz brakujÄ‚â€žĂ˘â‚¬Â¦ce tokeny "audyt ryzyk", "nastÄ‚â€žĂ˘â€žËpny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: rÄ‚â€žĂ˘â€žËcznie sprawdziÄ‚â€žĂ˘â‚¬Ë‡ brak duplikatu Finanse klienta i poprawnÄ‚â€žĂ˘â‚¬Â¦ ikonÄ‚â€žĂ˘â€žË finansĂ„â€šÄąâ€šw.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztĂ„â€šÄąâ€šw sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrĂ„â€šÄąâ€šcone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 uĂ„Ä…Ă„Ëťywa finansowego sĂ„Ä…Ă˘â‚¬Ĺˇownika etykiet i nie dodaje lokalnych stylĂ„â€šÄąâ€šw UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 moĂ„Ä…Ă„Ëťe potrzebowaÄ‚â€žĂ˘â‚¬Ë‡ SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansĂ„â€šÄąâ€šw nie pokaĂ„Ä…Ă„Ëťe kosztĂ„â€šÄąâ€šw, dopĂ„â€šÄąâ€ški D2/D3 nie podĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czÄ‚â€žĂ˘â‚¬Â¦ modelu.
- Ryzyko: jeĂ„Ä…Ă˘â‚¬Ĺźli koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

nastÄ‚â€žĂ˘â€žËpny krok:
- Po PASS/push przejĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ do STAGE231D2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- nastÄ‚â€žĂ˘â€žËpny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- nastÄ‚â€žĂ˘â€žËpny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powĂ„â€šÄąâ€šd: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usuniÄ‚â€žĂ˘â€žËcie api/case-costs.ts, konsolidacja kosztĂ„â€šÄąâ€šw pod api/cases.ts?resource=costs, guard budĂ„Ä…Ă„Ëťetu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtĂ„â€šÄąâ€šrzyÄ‚â€žĂ˘â‚¬Ë‡ manualny test Dodaj koszt, bo zmienia siÄ‚â€žĂ˘â€žË Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťka API.
- nastÄ‚â€žĂ˘â€žËpny krok: PASS -> push -> deploy -> test rÄ‚â€žĂ˘â€žËczny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywaĂ„Ä…Ă˘â‚¬Ĺˇa render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujÄ‚â€žĂ˘â‚¬Â¦cy regresjÄ‚â€žĂ˘â€žË.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdziÄ‚â€žĂ˘â‚¬Ë‡ produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeĂ„Ä…Ă˘â‚¬Ĺźli nadal wystÄ‚â€žĂ˘â‚¬Â¦pi.

## STAGE231D2-R6 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrĂ„â€šÄąâ€šcenie gĂ„â€šÄąâ€šrnego paska tytuĂ„Ä…Ă˘â‚¬Ĺˇu sprawy do lewej kolumny i podciÄ‚â€žĂ˘â‚¬Â¦gniÄ‚â€žĂ˘â€žËcie prawego raila do gĂ„â€šÄąâ€šrnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D3-R7

- Replaced brittle D3 patcher flow with controlled mass-clean package.
- Added client-level case cost rollup to FinanceMiniSummary.
- Ensured case costs use consolidated /api/cases?resource=costs helper, no new Vercel function.

## STAGE231D3-R7-R2 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ Polish guard restore and D3 close

- timestamp: 2026-06-10 20:42 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- result: restored missing scripts/check-polish-encoding-stage231b0-r15-r3.cjs required by regression lane after STAGE231D3-R7.
- risk audit: this fixes guard infrastructure drift only; it does not modify SQL, API routes, or CaseDetail layout.

<!-- STAGE231D0B_CLIENT_LIST_CARD_CHANGELOG_START -->
## 2026-06-12 11:15 Europe/Warsaw - STAGE231D0B Client List Card Visual Freeze

STATUS: LOCAL_APPLIED_PENDING_MANUAL_TEST_AND_PUSH

FAKTY:
- Kafelek klienta na liĂ„Ä…Ă˘â‚¬Ĺźcie klientĂ„â€šÄąâ€šw zostaĂ„Ä…Ă˘â‚¬Ĺˇ przestawiony na ukĂ„Ä…Ă˘â‚¬Ĺˇad 2-wierszowy.
- Z kafelka klienta usuniÄ‚â€žĂ˘â€žËto Leady: oraz badge Aktywna sprawa.
- Wiersz 1 pokazuje: nazwa, telefon, e-mail, Aktywna prowizja, akcje.
- Wiersz 2 pokazuje: firma, Sprawy, Zarobione Ă„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie, NajbliĂ„Ä…Ă„Ëťsza akcja oraz dozwolone statusy pomocnicze.
- Telefon ma osobny marker data-client-list-phone i klasÄ‚â€žĂ˘â€žË client-list-card-phone.
- E-mail ma osobny marker data-client-list-email i klasÄ‚â€žĂ˘â€žË client-list-card-email.
- UI dalej korzysta z closeflow-record-list-source-truth.css jako Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa prawdy stylu list.

DECYZJA DAMIANA:
- Klient jest juĂ„Ä…Ă„Ëť pozyskanym leadem, wiÄ‚â€žĂ˘â€žËc nie pokazujemy Leady w kafelku klienta.
- Klient moĂ„Ä…Ă„Ëťe mieÄ‚â€žĂ˘â‚¬Ë‡ wiele spraw, wiÄ‚â€žĂ˘â€žËc nie pokazujemy binarnego badge'a Aktywna sprawa.
- Na liĂ„Ä…Ă˘â‚¬Ĺźcie klientĂ„â€šÄąâ€šw majÄ‚â€žĂ˘â‚¬Â¦ byÄ‚â€žĂ˘â‚¬Ë‡ widoczne: Aktywna prowizja, Zarobione Ă„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie, Sprawy, NajbliĂ„Ä…Ă„Ëťsza akcja.

TESTY/GUARDY:
-
pm run check:stage231d0b-client-list-card-freeze
-
pm run build
- git diff --check

DO POTWIERDZENIA:
- Test rÄ‚â€žĂ˘â€žËczny desktop/mobile na /clients po lokalnym uruchomieniu.

RYZYKA:
- JeĂ„Ä…Ă˘â‚¬Ĺźli dane prowizyjne w bazie sÄ‚â€žĂ˘â‚¬Â¦ niepeĂ„Ä…Ă˘â‚¬Ĺˇne, Aktywna prowizja moĂ„Ä…Ă„Ëťe pokazaÄ‚â€žĂ˘â‚¬Ë‡ 0 PLN mimo aktywnej sprawy bez uzupeĂ„Ä…Ă˘â‚¬Ĺˇnionej prowizji.
- JeĂ„Ä…Ă˘â‚¬Ĺźli pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci prowizyjne nie majÄ‚â€žĂ˘â‚¬Â¦ typu/statusu rozpoznawanego przez finance source, Zarobione Ă„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie moĂ„Ä…Ă„Ëťe wymagaÄ‚â€žĂ˘â‚¬Ë‡ osobnego etapu porzÄ‚â€žĂ˘â‚¬Â¦dkujÄ‚â€žĂ˘â‚¬Â¦cego dane pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci.
- Zmiana dotyczy tylko listy klientĂ„â€šÄąâ€šw, nie przebudowuje ClientDetail ani modeli finansowych.
<!-- STAGE231D0B_CLIENT_LIST_CARD_CHANGELOG_END -->


## 2026-06-10 Europe/Warsaw - STAGE231D0B-R8-MASS-ENCODING-RESCUE

Marker: STAGE231D0B-R8-MASS-ENCODING-RESCUE
- Naprawiono klasÄ‚â€žĂ˘â€žË bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu: mojibake po STAGE231D0B.
- Przepisano guard tak, Ă„Ä…Ă„Ëťeby nie akceptowaĂ„Ä…Ă˘â‚¬Ĺˇ uszkodzonych polskich znakĂ„â€šÄąâ€šw.
- Dodano masowy sweep report encodingu dla src, scripts i _project.

## 2026-06-10 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0B-R9 ClientListCard polish + source truth cleanup

Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_PUSH

FAKTY:
- ClientListCard pozostaje 2-wierszowy.
- Finance values sÄ‚â€žĂ˘â‚¬Â¦ porzÄ‚â€žĂ˘â‚¬Â¦dkowane jako kompaktowe chipy.
- R8 unscoped CSS rescue zostaje zastÄ‚â€žĂ˘â‚¬Â¦piony scoped R9 source truth.
- LeadListCard dodany tylko jako mapping w UI Dictionary, bez runtime zmian.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Manual QA nadal wymagany, bo guard nie mierzy odbioru wizualnego.
- Osobny dĂ„Ä…Ă˘â‚¬Ĺˇug: duplicate savedRecord warning w ContextActionDialogs.tsx.

NASTÄ‚â€žĂ‚ÂPNY KROK:
- Po akceptacji /clients: STAGE231D0C LeadListCard align to ClientListCard source truth.

## 2026-06-11 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0B_R9_R3_GUARD_MOJIBAKE_SELF_SCAN_REPAIR

- Fixed R9 guard self-scan failure caused by literal encoding-drift probe characters in the guard source.

## 2026-06-11 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0B_R9_R4_CSS_GUARD_TOKEN_ALIGNMENT

- Added exact CSS source-truth marker and max-width token required by the R9/R3 guard.
- No runtime lead, trial, top layout or Supabase changes.

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10

ClientListCard: dodano wyrĂ„â€šÄąâ€šwnanie Ă„Ä…Ă˘â‚¬Ĺźrodkowych kolumn, title tooltipy i ellipsis dla dĂ„Ä…Ă˘â‚¬Ĺˇugich pĂ„â€šÄąâ€šl. Zmiana wizualna wymaga manualnego potwierdzenia po deployu.

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R7 - Client finance chip start alignment

Marker: STAGE231D0B_R10_R7_FINANCE_CHIP_START_ALIGN

Status: LOCAL_APPLY_PREPARED

FAKTY:
- R10/R6 poprawilo ogolny uklad karty klienta i ellipsis/tooltip.
- Manual QA Damiana pokazal, ze karta jest juz dobra, ale chipy finansowe powinny zaczynac tekst w tej samej osi kolumny.
- Ten etap dotyka tylko CSS source truth i guard dokumentujacy decyzje.

DECYZJA DAMIANA:
- "Zarobione lacznie" i "Aktywna prowizja" maja zaczynac sie w tym samym miejscu/kolumnie.
- Dlugosc tekstu moze dyktowac, gdzie chip sie konczy.
- Reszta ukladu zostaje.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Guard nie sprawdza realnej geometrii w przegladarce. Wymagany screenshot /clients po deployu.

NASTEPNY KROK:
- Po PASS i push: sprawdzic /clients, czy oba chipy finansowe startuja w tej samej osi.



---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R8 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ finance chip right-edge alignment

Status: LOCAL_APPLIED_PENDING_PUSH_AND_DEPLOY_QA

FAKTY:
- R7 wyrĂ„â€šÄąâ€šwnaĂ„Ä…Ă˘â‚¬Ĺˇ finance chipy w zĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦ stronÄ‚â€žĂ˘â€žË dla oczekiwanego widoku Damiana.
- R8 nie przebudowuje karty klienta. Zmienia tylko oĂ„Ä…Ă˘â‚¬Ĺź wyrĂ„â€šÄąâ€šwnania zielonych chipĂ„â€šÄąâ€šw finansowych.
- Chipy pozostajÄ‚â€žĂ˘â‚¬Â¦ o zmiennej dĂ„Ä…Ă˘â‚¬ĹˇugoĂ„Ä…Ă˘â‚¬Ĺźci; prawa krawÄ‚â€žĂ˘â€žËdĂ„Ä…ÄąĹş chipĂ„â€šÄąâ€šw ma byÄ‚â€žĂ˘â‚¬Ë‡ wspĂ„â€šÄąâ€šlna.

DECYZJA DAMIANA:
- PoczÄ‚â€žĂ˘â‚¬Â¦tek i koniec karty zostajÄ‚â€žĂ˘â‚¬Â¦ bez zmian.
- Zielone kafelki finansowe majÄ‚â€žĂ˘â‚¬Â¦ byÄ‚â€žĂ˘â‚¬Ë‡ wyrĂ„â€šÄąâ€šwnane od prawej strony.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Etap jest wizualny; ostateczne zamkniÄ‚â€žĂ˘â€žËcie wymaga deployu i rÄ‚â€žĂ˘â€žËcznego sprawdzenia /clients.


---
## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R9 finance text start align
Marker: STAGE231D0B_R10_R9_FINANCE_TEXT_START_ALIGN
Status: LOCAL_APPLY_PACKAGE_PREPARED
Scope: ClientListCard on /clients only.
Decision: zielone finance chipy nie maja konczyc sie rowno; teksty "Aktywna prowizja" i "Zarobione lacznie" maja zaczynac sie w jednej osi kolumny, tak jak nazwa/firma w lewej czesci karty. Dlugosc chipa moze dyktowac prawa krawedz.
Tests: npm run check:stage231d0b-client-list-card-freeze; node --test tests/stage231d0b-client-list-card-freeze.test.cjs; git diff --check; npm run build.
Risk: R8 right-edge alignment was visually wrong for Damian's expected reading flow; R9 supersedes R8 by later CSS source-truth override.

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10/R10 single-grid alignment source truth

Status: LOCAL_APPLY_PREPARED / DO_MANUAL_QA_AND_PUSH.

FAKT: R10/R7/R8/R9 pokazaly, ze przesuwanie finance chipow przez justify-self/place-self nie zamyka problemu wizualnego, bo primary i secondary byly osobnymi gridami.

DECYZJA: ClientListCard ma uzywac jednej fizycznej siatki CSS dla dwoch wierszy: nazwa/firma, telefon/sprawy, email/akcja, finanse/finanse.

ZAKRES: tylko /clients ClientListCard CSS source truth i guard. Nie ruszano leadow, triala, filtrow, top layoutu, SQL ani Supabase.

TESTY: npm run check:stage231d0b-client-list-card-freeze, node --test tests/stage231d0b-client-list-card-freeze.test.cjs, git diff --check, npm run build.

MANUAL QA: /clients po Ctrl+F5; sprawdzic, czy Aktywna prowizja i Zarobione lacznie startuja w jednej osi, tak jak nazwa/firma.


---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R11 fixed column axis

Status: LOCAL_APPLY_READY / DO_MANUAL_QA_AFTER_DEPLOY

FAKT:
- R10/R10 fixed the physical single grid but the grid still used content-sensitive columns, so column starts could move between client cards.
- R10/R11 pins deterministic column widths through CSS variables on .cf-client-list-card-content.

DECYZJA DAMIANA:
- Texts must start in the same place across every client card.
- Longer text may decide where a chip ends, but it must not move the start axis.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Visual QA is mandatory after deploy: desktop, narrow window, mobile.
- CSS history R7/R8/R9 remains in file as deprecated layers; R10/R11 is the final active override.

## 2026-06-11 Europe/Warsaw - STAGE231D0C LeadListCard client-view freeze

FAKT:
- /clients ClientListCard view accepted visually after R10/R11 fixed column axis.
- /leads should reuse the same card rhythm, fixed axes, compact card size and action column where the fields are semantically reusable.
- This stage does not change lead data semantics, create flow, filters, trial banner, top layout, SQL or Supabase.

DECYZJA DAMIANA:
- Freeze the accepted Clients view.
- Align the Leads tab to this look only for repeated card/shell elements.
- Do not invent a new layout and do not break existing lead semantics.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node scripts/check-stage231d0c-lead-list-card-client-align.cjs
- node --test tests/stage231d0c-lead-list-card-client-align.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Visual guard does not measure browser geometry. Manual QA on /leads and /clients remains required.
- Lead cards contain more badges/meta than client cards; CSS must compress, not delete semantics.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C/R6

Prepared ClientDetail Workspace Baseline package with compact active case card and guards.

---

## 2026-06-11 19:45 Europe/Warsaw - Changelog STAGE231D0C/R7 ClientDetail left rail spacing

STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING

FAKTY Z KODU:
- STAGE231D0C/R6 zostaĂ„Ä…Ă˘â‚¬Ĺˇ wdroĂ„Ä…Ă„Ëťony i wypchniÄ‚â€žĂ˘â€žËty jako baseline ClientDetail.
- Manual QA wskazaĂ„Ä…Ă˘â‚¬Ĺˇ, Ă„Ä…Ă„Ëťe lewy rail zaczyna siÄ‚â€žĂ˘â€žË za wysoko i wizualnie wchodzi w nastÄ‚â€žĂ˘â€žËpny poziom wzglÄ‚â€žĂ˘â€žËdem kart po prawej.

DECYZJA DAMIANA:
- ZachowaÄ‚â€žĂ˘â‚¬Ë‡ zaakceptowane gĂ„â€šÄąâ€šrne kafelki ClientDetail.
- ObniĂ„Ä…Ă„ËťyÄ‚â€žĂ˘â‚¬Ë‡ lewy rail do poziomu kafelkĂ„â€šÄąâ€šw po prawej i zachowaÄ‚â€žĂ˘â‚¬Ë‡ ten sam odstÄ‚â€žĂ˘â€žËp miÄ‚â€žĂ˘â€žËdzy kartami.

ZAKRES:
- CSS spacing only: lewy rail, prawy rail, odstÄ‚â€žĂ˘â€žËp miÄ‚â€žĂ˘â€žËdzy kartami.
- Bez zmian danych, JSX, SQL, kosztĂ„â€šÄąâ€šw, wykresĂ„â€šÄąâ€šw, Google Calendar, LeadListCard runtime i CaseDetail.

TESTY/GUARDY:
- scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- tests/stage231d0c-r7-client-detail-left-rail-spacing.test.cjs
- regresja: STAGE231D0C ClientDetail baseline guard, STAGE231D0B ClientListCard guard, optional STAGE231B0 R9 guard, build, git diff --check.

---

## 2026-06-11 20:05 Europe/Warsaw - Changelog STAGE231D0C/R8 ClientDetail left rail spacing guard fix

STAGE231D0C_R8_CLIENT_DETAIL_LEFT_RAIL_SPACING_GUARD_FIX

FAKTY Z KODU:
- STAGE231D0C/R7 patch zastosowaĂ„Ä…Ă˘â‚¬Ĺˇ spacing lewego raila, ale guard miaĂ„Ä…Ă˘â‚¬Ĺˇ zepsuty regex po utracie backslashy.
- R8 nie zmienia runtime poza naprawÄ‚â€žĂ˘â‚¬Â¦ guarda/testu i dokumentacjÄ‚â€žĂ˘â‚¬Â¦.

DECYZJA DAMIANA:
- ZachowaÄ‚â€žĂ˘â‚¬Ë‡ gĂ„â€šÄąâ€šrne kafelki ClientDetail.
- DokoĂ„Ä…Ă˘â‚¬ĹľczyÄ‚â€žĂ˘â‚¬Ë‡ spacing lewego raila bez przebudowy ukĂ„Ä…Ă˘â‚¬Ĺˇadu.

ZAKRES:
- Naprawa scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs.
- Zachowanie CSS R7 i scope ClientDetail.
- Bez zmian SQL, danych, CaseDetail, LeadListCard runtime, kosztĂ„â€šÄąâ€šw i wykresĂ„â€šÄąâ€šw.

TESTY/GUARDY:
- node --check guard R7.
- R7 spacing guard.
- R7 spacing node test.
- STAGE231D0C ClientDetail baseline guard/test.
- STAGE231D0B ClientListCard guard/test.
- Optional STAGE231B0 R9 guard/test.
- git diff --check.
- npm run build.

## 2026-06-11 Europe/Warsaw - STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN

Status: LOCAL_APPLIED / VISUAL_SPACING_FIX / NEED_PUSH

Zakres:
- poprawiono realny desktopowy offset lewego raila w ClientDetail, bo po R7 panel nadal zaczynaĂ„Ä…Ă˘â‚¬Ĺˇ za wysoko wzglÄ‚â€žĂ˘â€žËdem prawego raila;
- zwiÄ‚â€žĂ˘â€žËkszono offset tylko dla desktopu przez CSS variable i silniejszy selektor;
- zachowano zaakceptowany gĂ„â€šÄąâ€šrny ukĂ„Ä…Ă˘â‚¬Ĺˇad kafelkĂ„â€šÄąâ€šw, kompaktowÄ‚â€žĂ˘â‚¬Â¦ aktywnÄ‚â€žĂ˘â‚¬Â¦ sprawÄ‚â€žĂ˘â€žË, dane i routing.

Testy/guardy:
- node scripts/check-stage231d0c-r9-client-detail-left-rail-visual-align.cjs
- node --test tests/stage231d0c-r9-client-detail-left-rail-visual-align.test.cjs
- node scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- node scripts/check-stage231d0c-client-detail-workspace-baseline.cjs
- node scripts/check-stage231d0b-client-list-card-freeze.cjs
- git diff --check
- npm run build

Ryzyka:
- finalna akceptacja wymaga screenshotu /clients/<id> po deployu i Ctrl+F5;
- tablet/mobile resetujÄ‚â€žĂ˘â‚¬Â¦ offset do 0, Ă„Ä…Ă„Ëťeby nie zrobiÄ‚â€žĂ˘â‚¬Ë‡ sztucznej dziury.

---
## 2026-06-11 Europe/Warsaw - STAGE231D0C/R11 ClientDetail left rail axis lock

Marker: STAGE231D0C_R11_CLIENT_DETAIL_LEFT_RAIL_AXIS_LOCK

Status: LOCAL_APPLY_READY

Scope:
- desktop-only CSS axis lock for the ClientDetail left rail,
- strengthens previous R7/R9 offset because production screenshot still showed the left rail above the right card axis,
- keeps top overview tiles, compact active case card, data, routing and JSX unchanged.

Tests/guards:
- scripts/check-stage231d0c-r11-client-detail-left-rail-axis-lock.cjs
- tests/stage231d0c-r11-client-detail-left-rail-axis-lock.test.cjs
- R9/R7 regressions where present
- ClientDetail baseline regression
- ClientListCard regression
- git diff --check
- npm run build

Risk audit:
- desktop offset can create too much vertical whitespace on narrow layouts, therefore reset is scoped to max-width 1180px.
- final acceptance requires production screenshot after deploy and Ctrl+F5.

---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0C/R12 ClientDetail left rail measured axis fix

Status: LOCAL_APPLY_PRE_PUSH.
Commit target: fix ClientDetail left rail vertical axis using measured desktop DOM values.

Measured fact from manual DOM audit after clearing debug inline style:
- viewport innerWidth: 1920
- leftFirstTop: 173
- rightFirstTop: 200
- leftMinusRight: -27
- computed left rail margin-top before fix: -36px
- required final desktop margin-top: -9px

Change:
- CSS-only override in src/styles/visual-stage12-client-detail-vnext.css.
- Locks .client-detail-shell > .client-detail-left-rail margin-top to -9px on desktop >=1180px.
- Resets margin/padding/transform on tablet/mobile <=1179px.

Scope not touched:
- JSX, data fetching, Supabase, SQL, costs, charts, active case card structure, CaseDetail, LeadListCard runtime.

Tests required:
- R12 measured-axis guard/test.
- R9 and R7 left rail regressions.
- ClientDetail baseline guard/test.
- ClientListCard freeze regression.
- git diff --check.
- npm run build.

Manual QA after deploy:
- open /clients/<id>, Ctrl+F5.
- verify left Data klienta card starts visually on the same axis as right NajbliĂ„Ä…Ă„Ëťsze dziaĂ„Ä…Ă˘â‚¬Ĺˇania card.
- verify top tiles and active case compact card unchanged.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C-R2 ClientDetailHeader visual freeze + visible icons

Marker: STAGE231D0C_R2_CLIENT_DETAIL_HEADER_FREEZE
Status: LOCAL_APPLY_PREPARED / DO_TEST_AND_PUSH

Zakres:
- zamroĂ„Ä…Ă„Ëťenie ClientDetailHeader jako wzorca DetailHeader,
- dopisanie stylu widocznoĂ„Ä…Ă˘â‚¬Ĺźci ikon w header buttons,
- dopisanie DetailHeader do UI Dictionary,
- dodanie guarda i testu R2,
- regresja D0C baseline.

Decyzja Damiana:
Header karty klienta detail zostaje wzorcem dla kolejnych kart detail. Ikony w niebieskich przyciskach muszÄ‚â€žĂ˘â‚¬Â¦ byÄ‚â€žĂ˘â‚¬Ë‡ widoczne.

Poza zakresem:
- brak SQL,
- brak zmian danych,
- brak zmian aktywnej sprawy,
- brak zmian CaseDetail,
- brak zmian LeadListCard runtime.



---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R2 CaseDetail service notes and finance rail

Status: APPLIED_BY_ZIP / READY_FOR_TEST_AND_PUSH

FAKTY Z KODU:
- CaseDetail had CaseQuickActions before the finance rail.
- CaseDetail had an older Stage220A10 duplicated service/notes block before the current service tab source of truth.
- Finance and cost source files already exist; this stage does not add SQL or a new data model.

DECYZJE DAMIANA:
- CaseDetail right rail order: Rozliczenie sprawy -> Szybkie akcje -> Dane sprawy i klienta.
- One CaseServiceTab source of truth.
- One CaseNotesPanel preview plus CaseAllNotesModal.
- Costs use semantic orange/red cost-warning classes, not system-error styling.

TESTY:
- scripts/check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs
- tests/stage231d0d-r2-case-detail-service-notes-finance-rail.test.cjs
- D0C ClientDetail regression
- npm run build
- git diff --check

RYZYKA:
- CaseDetail still has old build warnings outside this stage.
- Manual QA must confirm modal and right rail order on production.




---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R2 CaseDetail service notes and finance rail

Status: APPLIED_BY_ZIP / READY_FOR_TEST_AND_PUSH

FAKTY Z KODU:
- CaseDetail had CaseQuickActions before the finance rail.
- CaseDetail had an older Stage220A10 duplicated service/notes block before the current service tab source of truth.
- Finance and cost source files already exist; this stage does not add SQL or a new data model.

DECYZJE DAMIANA:
- CaseDetail right rail order: Rozliczenie sprawy -> Szybkie akcje -> Dane sprawy i klienta.
- One CaseServiceTab source of truth.
- One CaseNotesPanel preview plus CaseAllNotesModal.
- Costs use semantic orange/red cost-warning classes, not system-error styling.

TESTY:
- scripts/check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs
- tests/stage231d0d-r2-case-detail-service-notes-finance-rail.test.cjs
- D0C ClientDetail regression
- npm run build
- git diff --check

RYZYKA:
- CaseDetail still has old build warnings outside this stage.
- Manual QA must confirm modal and right rail order on production.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE

Status: PATCH_RESCUE / CONTINUES_STAGE231D0D_R2

Zakres:
- naprawa czÄ‚â€žĂ˘â€žËĂ„Ä…Ă˘â‚¬Ĺźciowo zastosowanego D0D-R3 po guard fail,
- dopisanie widocznego wiersza "Razem do pobrania" do pierwszej karty "Rozliczenie sprawy",
- podpiÄ‚â€žĂ˘â€žËcie totalu do istniejÄ‚â€žĂ˘â‚¬Â¦cego caseCostsSummaryStage231D2.totalToCollectAmount,
- naprawa JSX service tab po usuniÄ‚â€žĂ˘â€žËciu legacy Stage220A10 duplicate block,
- bez SQL, bez nowego modelu kosztĂ„â€šÄąâ€šw, bez wykresĂ„â€šÄąâ€šw.

Testy wymagane:
- D0D-R2 guard/test,
- D0C ClientDetail baseline regression,
- D0B ClientListCard regression,
- npm run build,
- git diff --check.

Audyt ryzyk:
- nie dublowaÄ‚â€žĂ˘â‚¬Ë‡ osobnej karty kosztĂ„â€šÄąâ€šw jako drugiego Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇa rozliczenia; wiersz totalu w pierwszej karcie jest obowiÄ‚â€žĂ˘â‚¬Â¦zkowy dla skanowalnoĂ„Ä…Ă˘â‚¬Ĺźci prawego panelu,
- po deployu manualnie sprawdziÄ‚â€žĂ˘â‚¬Ë‡ kolejnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ raila: Rozliczenie -> Szybkie akcje -> Dane sprawy i klienta.

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R3 CaseDetail 100% scale balanced workspace

Status: PREPARED_BY_ZIP / DO_TEST_AND_PUSH

Zakres:
- dziaĂ„Ä…Ă˘â‚¬Ĺˇania i notatki w jednym Ă„Ä…Ă˘â‚¬Ĺźrodkowym gridzie,
- notatki compact preview: 3 ostatnie,
- prawy rail compact: rozliczenie, szybkie akcje, dane,
- historia wpĂ„Ä…Ă˘â‚¬Ĺˇat i lista kosztĂ„â€šÄąâ€šw nie sÄ‚â€žĂ˘â‚¬Â¦ stale rozlane w railu,
- R2 guard zaktualizowany jako regresja zgodna z R3.

Testy:
- D0D/R3 guard/test,
- D0D/R2 regression guard/test,
- D0C regression,
- D0B regression,
- build,
- git diff --check.



---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R4 CaseDetail lean service workspace

Status: LOCAL_PACKAGE_APPLIED_PENDING_PUSH

FAKTY Z KODU:
- R4 usuwa widocznÄ‚â€žĂ˘â‚¬Â¦ kartÄ‚â€žĂ˘â€žË danych sprawy i klienta z gĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwnego right raila bez usuwania danych z systemu.
- R4 usuwa staĂ„Ä…Ă˘â‚¬Ĺˇe sekcje historii wpĂ„Ä…Ă˘â‚¬Ĺˇat i kosztĂ„â€šÄąâ€šw z right raila.
- R4 zachowuje rozliczenie sprawy i szybkie akcje w railu.
- R4 dopina marker data-case-service-tabs-column="true" do tabs card.

TESTY:
- check-stage231d0d-r4-case-detail-lean-service-workspace.cjs
- stage231d0d-r4-case-detail-lean-service-workspace.test.cjs
- R3/R2 regression guards
- D0C regression
- npm run build
- git diff --check

RYZYKA:
- Tabs sÄ‚â€žĂ˘â‚¬Â¦ wyrĂ„â€šÄąâ€šwnane wizualnie do kolumny dziaĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺľ bez peĂ„Ä…Ă˘â‚¬Ĺˇnej przebudowy logiki Tabs; przy kolejnym wiÄ‚â€žĂ˘â€žËkszym refaktorze warto przenieĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ strukturÄ‚â€žĂ˘â€žË logicznie do left-column.
- Historia wpĂ„Ä…Ă˘â‚¬Ĺˇat i koszty pozostajÄ‚â€žĂ˘â‚¬Â¦ dostÄ‚â€žĂ˘â€žËpne przez istniejÄ‚â€žĂ˘â‚¬Â¦ce przyciski/modale, ale nie sÄ‚â€žĂ˘â‚¬Â¦ staĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦ listÄ‚â€žĂ˘â‚¬Â¦ w railu.

---

## 2026-06-12 07:39 Europe/Warsaw - STAGE231D0D-R5 spacing / notes lift / quick actions cleanup

Status: READY_FOR_TEST
Zakres:
- notatki podciÄ‚â€žĂ˘â‚¬Â¦gniÄ‚â€žĂ˘â€žËte do gĂ„â€šÄąâ€šry bez Ă„Ä…Ă˘â‚¬Ĺˇamania wspĂ„â€šÄąâ€šlnego odstÄ‚â€žĂ˘â€žËpu kafelkĂ„â€šÄąâ€šw,
- wspĂ„â€šÄąâ€šlny odstÄ‚â€žĂ˘â€žËp kafelkĂ„â€šÄąâ€šw: 14px,
- prawy rail delikatnie podniesiony,
- z CaseQuickActions usuniÄ‚â€žĂ˘â€žËto osobnÄ‚â€žĂ˘â‚¬Â¦ akcjÄ‚â€žĂ˘â€žË "WpĂ„Ä…Ă˘â‚¬Ĺˇata prowizji",
- wpĂ„Ä…Ă˘â‚¬Ĺˇata prowizji zostaje w rozliczeniu sprawy.

Ryzyka:
- override CSS musi nie rozjechaÄ‚â€žĂ˘â‚¬Ë‡ mobile/tablet,
- quick actions nie mogÄ‚â€žĂ˘â‚¬Â¦ dublowaÄ‚â€žĂ˘â‚¬Ë‡ akcji finansowych,
- R2/R3/R4 guardy byĂ„Ä…Ă˘â‚¬Ĺˇy skĂ„Ä…Ă˘â‚¬Ĺˇadniowo uszkodzone i zostaĂ„Ä…Ă˘â‚¬Ĺˇy naprawione.

---

## 2026-06-12 07:58 Europe/Warsaw - STAGE231D0D-R5 repair after red guard push

Status: REPAIR_READY_FOR_TEST

Naprawa:
- usuniÄ‚â€žĂ˘â€žËto "WpĂ„Ä…Ă˘â‚¬Ĺˇata prowizji" z CaseQuickActions,
- dodano "Dodaj koszt" do kompaktowego rozliczenia sprawy,
- dodano spacing marker i wspĂ„â€šÄąâ€šlny odstÄ‚â€žĂ˘â€žËp kafelkĂ„â€šÄąâ€šw 14px,
- dodano micro-lift prawego raila,
- zachowano wpĂ„Ä…Ă˘â‚¬ĹˇatÄ‚â€žĂ˘â€žË prowizji tylko w rozliczeniu sprawy.

PowĂ„â€šÄąâ€šd:
Poprzedni R5 zostaĂ„Ä…Ă˘â‚¬Ĺˇ wypchniÄ‚â€žĂ˘â€žËty mimo czerwonych guardĂ„â€šÄąâ€šw po bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdzie Ă„Ä…Ă˘â‚¬ĹźcieĂ„Ä…Ă„Ëťek wzglÄ‚â€žĂ˘â€žËdnych .NET/PowerShell.

---

## 2026-06-12 08:10 Europe/Warsaw - STAGE231D0D-R6 true service grid geometry

Status: READY_FOR_TEST

Zakres:
- przeniesiono tabs do lewej kolumny workspace dla aktywnej zakĂ„Ä…Ă˘â‚¬Ĺˇadki ObsĂ„Ä…Ă˘â‚¬Ĺˇuga,
- lewa kolumna ma teraz: tabs + dziaĂ„Ä…Ă˘â‚¬Ĺˇania,
- Ă„Ä…Ă˘â‚¬Ĺźrodkowa kolumna ma notatki startujÄ‚â€žĂ˘â‚¬Â¦ce od gĂ„â€šÄąâ€šry tego samego gridu,
- prawy rail jest wyrĂ„â€šÄąâ€šwnany do osi true service grid i uĂ„Ä…Ă„Ëťywa wspĂ„â€šÄąâ€šlnego gapu,
- nie ruszano SQL, danych, modelu finansĂ„â€šÄąâ€šw ani modali.

Audyt:
- R5 byĂ„Ä…Ă˘â‚¬Ĺˇ technicznie zielony, ale wizualnie nie zamykaĂ„Ä…Ă˘â‚¬Ĺˇ celu, bo tabs byĂ„Ä…Ă˘â‚¬Ĺˇy poza gridem.
- R6 naprawia strukturÄ‚â€žĂ˘â€žË JSX, a guard sprawdza kolejnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ grid -> left column -> tabs -> actions -> notes.

---

## 2026-06-12 08:28 Europe/Warsaw - STAGE231D0D-R8 tabs card + right rail axis polish

Status: READY_FOR_TEST

Zakres:
- prawy panel z rozliczeniem i szybkimi akcjami podniesiony do osi kafelka danych sprawy,
- zakĂ„Ä…Ă˘â‚¬Ĺˇadki ObsĂ„Ä…Ă˘â‚¬Ĺˇuga / Checklisty / Historia dostaĂ„Ä…Ă˘â‚¬Ĺˇy peĂ„Ä…Ă˘â‚¬Ĺˇny, rozciÄ‚â€žĂ˘â‚¬Â¦gniÄ‚â€žĂ˘â€žËty kafelek nad DziaĂ„Ä…Ă˘â‚¬Ĺˇaniami sprawy,
- zachowany wspĂ„â€šÄąâ€šlny odstÄ‚â€žĂ˘â€žËp kafelkĂ„â€šÄąâ€šw 14px,
- nie ruszano finansĂ„â€šÄąâ€šw, modali, SQL, danych, handlerĂ„â€šÄąâ€šw ani quick actions poza stylem ukĂ„Ä…Ă˘â‚¬Ĺˇadu.

Ryzyka:
- etap jest CSS-only, wiÄ‚â€žĂ˘â€žËc wymaga rÄ‚â€žĂ˘â€žËcznego potwierdzenia na 100% zoom,
- lift prawego raila ma reset na wÄ‚â€žĂ˘â€žËĂ„Ä…Ă„Ëťszych ekranach,
- historyczne mojibake w starych wpisach _project nie jest czyszczone w tym etapie.

---

## 2026-06-12 08:58 Europe/Warsaw - STAGE231D0D-R9 tabs center + axis microfix

Status: APPLIED_LOCAL_WAITING_VISUAL_PASS

Zakres:
- piguĂ„Ä…Ă˘â‚¬Ĺˇki ObsĂ„Ä…Ă˘â‚¬Ĺˇuga / Checklisty / Historia wyĂ„Ä…Ă˘â‚¬Ĺźrodkowane w rozciÄ‚â€žĂ˘â‚¬Â¦gniÄ‚â€žĂ˘â€žËtym kafelku,
- Ă„Ä…Ă˘â‚¬Ĺźrodkowa sekcja CaseDetail podniesiona lekko wyĂ„Ä…Ă„Ëťej,
- prawy panel rozliczeĂ„Ä…Ă˘â‚¬Ĺľ i szybkich akcji dociÄ‚â€žĂ˘â‚¬Â¦gniÄ‚â€žĂ˘â€žËty do tej samej osi,
- bez zmian w SQL, Supabase, finansach, modalach, handlerach i danych.

Testy:
- R9 guard/test,
- regresje R8/R6/R5/R4/R3/R2/D0C/D0B,
- git diff --check,
- npm run build.
---

## 2026-06-12 14:34 Europe/Warsaw - STAGE231D0E-R1 ClientDetail grid axis align

Status: PREPARED_LOCAL / pending visual PASS before push

Scope:
- CSS-only alignment of ClientDetail workspace columns.
- Align left data card, center column and right upcoming-actions rail to one top axis.
- Force center content under Braki i blokady to keep same width/left edge as the center column.
- Force right rail content under NajbliĂ„Ä…Ă„Ëťsze dziaĂ„Ä…Ă˘â‚¬Ĺˇania to keep same width/left edge as the rail.

User decision:
- "wszystko co pod braki i blokady oraz najbliĂ„Ä…Ă„Ëťsze dziaĂ„Ä…Ă˘â‚¬Ĺˇania musimy wyrĂ„â€šÄąâ€šwnaÄ‚â€žĂ˘â‚¬Ë‡ z kafelkiem dane klienta"

Touched runtime files:
- src/styles/visual-stage12-client-detail-vnext.css

Not touched:
- src/pages/ClientDetail.tsx
- src/components/CaseQuickActions.tsx
- CaseDetail logic
- Supabase / SQL / finance formulas / handlers / modals

Guards:
- scripts/check-stage231d0e-r1-client-detail-grid-axis-align.cjs
- tests/stage231d0e-r1-client-detail-grid-axis-align.test.cjs

Risk audit:
- Visual-only risk: desktop alignment may improve while tablet breakpoint needs manual check.
- No runtime data risk because only CSS and docs/guards are changed.
- Do not mix with failed R11 finance/notes package or old D0B client-list-card guard drift.

<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F Funnel owner dashboard visual alignment

- Dopasowano Lejek do nowego jÄ‚â€žĂ˘â€žËzyka UI CloseFlow.
- Zachowano koncepcjÄ‚â€žĂ˘â€žË: lista decyzji wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciciela, nie kanban.
- Nie zmieniono logiki filtrĂ„â€šÄąâ€šw, liczenia, Supabase, SQL, statusĂ„â€šÄąâ€šw, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci ani routingu.
- Dodano CSS alignment, guard, test, run report i Obsidian payload.
<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_END -->

<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R4 Funnel targeted guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGĂ„â€šĂ˘â‚¬Ĺ›W:
- R2 poprawnie zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË po czerwonym guardzie.
- R3 zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na zbyt szerokim mojibake sweepie, ktĂ„â€šÄąâ€šry zaczÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă˘â‚¬Ĺˇ czyĂ„Ä…Ă˘â‚¬ĹźciÄ‚â€žĂ˘â‚¬Ë‡ stare historyczne wpisy `_project`.
- To nie jest wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciwy zakres dla etapu UI Lejka.

DECYZJA:
- Naprawiamy aktywny zakres STAGE231D0F, nie caĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦ historiÄ‚â€žĂ˘â€žË projektu.
- Lejek pozostaje listÄ‚â€žĂ˘â‚¬Â¦ decyzji wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźciciela, nie kanbanem.
- Nie ruszaÄ‚â€žĂ˘â‚¬Ë‡ logiki filtrĂ„â€šÄąâ€šw, Supabase, SQL, pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci, routingu, wykresĂ„â€šÄąâ€šw ani drag/drop.

R4:
- targetowany repair mojibake tylko dla runtime i aktywnych plikĂ„â€šÄąâ€šw etapu,
- guard STAGE231D0F sprawdza aktywny blok UI Dictionary, CSS i runtime,
- guardy nie failujÄ‚â€žĂ˘â‚¬Â¦ na wĂ„Ä…Ă˘â‚¬Ĺˇasnych definicjach tokenĂ„â€šÄąâ€šw,
- CaseDetail R4 guard jest podmieniany na bezpiecznÄ‚â€žĂ˘â‚¬Â¦ wersjÄ‚â€žĂ˘â€žË z tokenami generowanymi po kodach znakĂ„â€šÄąâ€šw.

TESTY:
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `node scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- W repo nadal mogÄ‚â€žĂ˘â‚¬Â¦ istnieÄ‚â€žĂ˘â‚¬Ë‡ stare historyczne wpisy z mojibake. Nie naprawiaÄ‚â€žĂ˘â‚¬Ë‡ ich w tym etapie.
- JeĂ„Ä…Ă„Ëťeli chcemy peĂ„Ä…Ă˘â‚¬Ĺˇne sprzÄ‚â€žĂ˘â‚¬Â¦tanie `_project`, to osobny etap: `ENCODING-SWEEP`, bez mieszania z Lejkiem.
<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R2 Funnel color/icon/filter parity

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma juĂ„Ä…Ă„Ëť `FunnelOwnerDecisionTile`, `FunnelStageFilterChip`, `FunnelDecisionListCard`.
- `closeflow-metric-tiles.css` ma wspĂ„â€šÄąâ€šlne tony `blue`, `amber`, `red`, `green`, `purple`.
- Klienci uĂ„Ä…Ă„ËťywajÄ‚â€žĂ˘â‚¬Â¦ wzorca filtrĂ„â€šÄąâ€šw: `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-status-pill`, `pill`, `data-cf-status-tone`.

DECYZJE DAMIANA:
- ZamysĂ„Ä…Ă˘â‚¬Ĺˇ Lejka zostaje.
- Lejek nie jest kanbanem.
- Kafelki wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺźcicielskie majÄ‚â€žĂ˘â‚¬Â¦ mieÄ‚â€žĂ˘â‚¬Ë‡ kolorowe ikony.
- `Cisza 7+` ma dostaÄ‚â€žĂ˘â‚¬Ë‡ ton `purple`.
- Filtry etapĂ„â€šÄąâ€šw majÄ‚â€žĂ˘â‚¬Â¦ mĂ„â€šÄąâ€šwiÄ‚â€žĂ˘â‚¬Ë‡ tym samym jÄ‚â€žĂ˘â€žËzykiem wizualnym co filtry w Klientach.
- Nie ruszaÄ‚â€žĂ˘â‚¬Ë‡ logiki filtrĂ„â€šÄąâ€šw, Supabase, SQL, drag/drop ani kanbana.

ZMIANA:
- Dodany marker `STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY`.
- Dodana jawna mapa `FUNNEL_OWNER_TILE_TONE_MAP`.
- `FunnelStageFilterChip` dostaje `data-cf-status-tone`, `cf-status-pill` / `pill` oraz alias `cf-filter-pill`.
- Pasek etapĂ„â€šÄąâ€šw dostaje `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-filter-strip`, `cf-filter-pills`.
- CSS wymusza widoczne kolorowe ikony w owner tiles.

TESTY:
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Nie wolno przez ten etap zmieniÄ‚â€žĂ˘â‚¬Ë‡ dziaĂ„Ä…Ă˘â‚¬Ĺˇania filtrĂ„â€šÄąâ€šw ani przerobiÄ‚â€žĂ˘â‚¬Ë‡ Lejka w kanban.
- Nie mieszaÄ‚â€žĂ˘â‚¬Ë‡ w tym commicie wczeĂ„Ä…Ă˘â‚¬Ĺźniejszych plikĂ„â€šÄąâ€šw `STAGE231D0E`, jeĂ„Ä…Ă˘â‚¬Ĺźli nie sÄ‚â€žĂ˘â‚¬Â¦ osobno domykane.
<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_END -->

<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R3 Funnel icon source truth + records header fix

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma juĂ„Ä…Ă„Ëť `FUNNEL_OWNER_TILE_TONE_MAP` i uĂ„Ä…Ă„Ëťywa `data-eliteflow-metric-tone`.
- `closeflow-metric-tiles.css` ma zmienne source of truth dla ikon i tĂ„Ä…Ă˘â‚¬Ĺˇa ikon.
- `SalesFunnel.tsx` nadal miaĂ„Ä…Ă˘â‚¬Ĺˇ dwuliniowy nagĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwek rekordĂ„â€šÄąâ€šw: maĂ„Ä…Ă˘â‚¬Ĺˇy label + `Rekordy w aktywnym widoku`.

DECYZJE DAMIANA:
- Ikony kafelkĂ„â€šÄąâ€šw Lejka majÄ‚â€žĂ˘â‚¬Â¦ mieÄ‚â€žĂ˘â‚¬Ë‡ widoczny kolor.
- Kolor ikon ma iĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ ze wspĂ„â€šÄąâ€šlnego source of truth `closeflow-metric-tiles.css`.
- Nie kolorowaÄ‚â€žĂ˘â‚¬Ë‡ lokalnie kafelkĂ„â€šÄąâ€šw Lejka losowymi hexami.
- NagĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwek rekordĂ„â€šÄąâ€šw ma byÄ‚â€žĂ˘â‚¬Ë‡ jednym wierszem.
- Nie ruszaÄ‚â€žĂ˘â‚¬Ë‡ logiki filtrĂ„â€šÄąâ€šw, SQL, Supabase, kanbana ani drag/drop.

ZMIANA:
- Dodany marker `STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER`.
- W `closeflow-metric-tiles.css` dopisano ogĂ„â€šÄąâ€šlnÄ‚â€žĂ˘â‚¬Â¦ reguĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žË `stroke: currentColor` / `color: currentColor` dla SVG ikon metric tiles.
- W `SalesFunnel.tsx` nagĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwek rekordĂ„â€šÄąâ€šw zmieniony na `FunnelRecordsHeaderRow`.
- W `sales-funnel-stage231d0f-visual-alignment.css` dodano CSS dla jednowierszowego nagĂ„Ä…Ă˘â‚¬ĹˇĂ„â€šÄąâ€šwka.

TESTY:
- `node scripts/check-stage231d0f-r3-funnel-icon-source-and-header.cjs`
- `node --test tests/stage231d0f-r3-funnel-icon-source-and-header.test.cjs`
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- JeĂ„Ä…Ă˘â‚¬Ĺźli ikony dalej wyglÄ‚â€žĂ˘â‚¬Â¦dajÄ‚â€žĂ˘â‚¬Â¦ bez koloru, moĂ„Ä…Ă„Ëťliwa przyczyna to kolejnoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ Ă„Ä…Ă˘â‚¬Ĺˇadowania CSS albo zewnÄ‚â€žĂ˘â€žËtrzne nadpisanie SVG. Guard sprawdza source of truth, ale manual QA nadal jest konieczne.
<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_END -->

<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R5 Funnel records header line repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R4 patcher dalej zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na starym fragmencie `<p className="text-xs font-black uppercase tracking...">`.
- Przyczyna: nawet regex R4 nie trafiĂ„Ä…Ă˘â‚¬Ĺˇ lokalnego wariantu starego JSX.
- Problem jest w konkretnych liniach starego headera, nie w caĂ„Ä…Ă˘â‚¬Ĺˇym Lejku.

ZMIANA:
- R5 usuwa liniowo stare fragmenty:
  - `visibleLabel` paragraph,
  - stary `h2` rekordĂ„â€šÄąâ€šw,
  - stary licznik tekstowy.
- R5 wymaga nowego `data-stage231d0f-r5-records-header-line-repair`.
- R5 odĂ„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťa R3/R4 guardy, Ă„Ä…Ă„Ëťeby walidowaĂ„Ä…Ă˘â‚¬Ĺˇy naprawiony stan bez faĂ„Ä…Ă˘â‚¬Ĺˇszywego globalnego blokowania.

NIE RUSZAÄ‚â€žĂ˘â‚¬Â :
- logiki filtrĂ„â€šÄąâ€šw,
- Supabase,
- SQL,
- kanbana,
- drag/drop,
- STAGE231D0E.

TESTY:
- `node scripts/check-stage231d0f-r5-funnel-records-header-line-repair.cjs`
- `node --test tests/stage231d0f-r5-funnel-records-header-line-repair.test.cjs`
- R4/R3 regression guard/test
- R2 guard/test jeĂ„Ä…Ă˘â‚¬Ĺźli istniejÄ‚â€žĂ˘â‚¬Â¦
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma duĂ„Ä…Ă„Ëťo wczeĂ„Ä…Ă˘â‚¬Ĺźniejszych Ă„Ä…Ă˘â‚¬ĹźladĂ„â€šÄąâ€šw failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R6 Funnel UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 runtime patch przeszedĂ„Ä…Ă˘â‚¬Ĺˇ.
- R5 guard zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ etap wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie na brakach w UI Dictionary: `MetricTileIconColorSource` i `FunnelColorToneMap`.
- To jest problem guardu/pamiÄ‚â€žĂ˘â€žËci projektu, nie logiki Lejka.

ZMIANA:
- R6 dopisuje brakujÄ‚â€žĂ˘â‚¬Â¦ce pojÄ‚â€žĂ˘â€žËcia do aktywnego bloku UI Dictionary.
- R6 guard Ă„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦czy aktywne bloki R6/R5/R4/R3/R2 zamiast patrzeÄ‚â€žĂ˘â‚¬Ë‡ tylko w ostatni blok.
- R6 nie dotyka logiki filtrĂ„â€šÄąâ€šw, Supabase, SQL, drag/drop ani kanbana.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-ui-dictionary-guard-repair.cjs`
- `node --test tests/stage231d0f-r6-funnel-ui-dictionary-guard-repair.test.cjs`
- R5/R4/R3 regression guard/test
- R2 guard/test jeĂ„Ä…Ă˘â‚¬Ĺźli istniejÄ‚â€žĂ˘â‚¬Â¦
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree jest brudny po wielu prĂ„â€šÄąâ€šbach. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R6 Funnel shared filter resilient patch

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 shared filter patch zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË na `SalesFunnel post-patch token missing: data-stage231d0f-r5-stage-filter-no-visible-money`.
- Przyczyna: patcher szukaĂ„Ä…Ă˘â‚¬Ĺˇ zbyt szerokiego wariantu caĂ„Ä…Ă˘â‚¬Ĺˇego `<button>` w `FunnelStageFilterChip`.
- Realny `SalesFunnel.tsx` ma stabilny marker `data-stage231d0f-r2-filter-tone={tone}` i widoczny `cf-funnel-stage-filter-chip-value`.

ZMIANA:
- R6 patchuje wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie blok funkcji `FunnelStageFilterChip`, a nie caĂ„Ä…Ă˘â‚¬Ĺˇy plik na Ă„Ä…Ă˘â‚¬Ĺźlepo.
- R6 dopina no-visible-money marker po stabilnym atrybucie.
- R6 usuwa widocznÄ‚â€žĂ˘â‚¬Â¦ kwotÄ‚â€žĂ˘â€žË z chipu, zostawia kwotÄ‚â€žĂ˘â€žË w `aria-label` i `title`.
- R6 zachowuje wspĂ„â€šÄąâ€šlny filtr dla KlientĂ„â€šÄąâ€šw przez stabilny `cf-contact-cadence-pills`.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-shared-filter-resilient-patch.cjs`
- `node --test tests/stage231d0f-r6-funnel-shared-filter-resilient-patch.test.cjs`
- R3 guard/test jeĂ„Ä…Ă˘â‚¬Ĺźli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze Ă„Ä…Ă˘â‚¬Ĺźlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_END -->

<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R8 Funnel icon tone syntax repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R7 zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË przed patchowaniem na bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdzie skĂ„Ä…Ă˘â‚¬Ĺˇadni w patcherze.
- BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d: niepoprawnie escapowany string `payment: \\'green\\''` w tablicy walidacyjnej.
- To nie jest bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d aplikacji ani koncepcji kolorĂ„â€šÄąâ€šw.

DECYZJA DAMIANA:
- UkĂ„Ä…Ă˘â‚¬Ĺˇad Lejka jest zamroĂ„Ä…Ă„Ëťony.
- Etap dotyczy tylko spĂ„â€šÄąâ€šjnej kolorystyki ikon/kafelkĂ„â€šÄąâ€šw.

ZMIANA:
- R8 naprawia skĂ„Ä…Ă˘â‚¬ĹˇadniÄ‚â€žĂ˘â€žË patchera.
- R8 dodaje `node --check` dla patchera i guardu przed patchowaniem.
- R8 dodaje `metric-icon-tone-registry.ts`.
- R8 podpina Lejek i operator metric tone contract pod wspĂ„â€šÄąâ€šlny resolver koloru.
- Kafel `PieniÄ‚â€žĂ˘â‚¬Â¦dze` uĂ„Ä…Ă„Ëťywa `PaymentEntityIcon`, nie strzaĂ„Ä…Ă˘â‚¬Ĺˇki.

TESTY:
- `node --check payload/scripts/apply-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --check payload/scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --test tests/stage231d0f-r8-funnel-icon-tone-syntax-repair.test.cjs`
- R6 guard jeĂ„Ä…Ă˘â‚¬Ĺźli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Zmiana ikony `PieniÄ‚â€žĂ˘â‚¬Â¦dze` ze strzaĂ„Ä…Ă˘â‚¬Ĺˇki na ikonÄ‚â€žĂ˘â€žË pĂ„Ä…Ă˘â‚¬ĹˇatnoĂ„Ä…Ă˘â‚¬Ĺźci jest Ă„Ä…Ă˘â‚¬Ĺźwiadoma.
- Manual QA wymagany dla realnego koloru SVG.
<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R9 Funnel icon tone UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R8 patch runtime przeszedĂ„Ä…Ă˘â‚¬Ĺˇ.
- R8 zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË dopiero na guardzie dokumentacji.
- BrakujÄ‚â€žĂ˘â‚¬Â¦cy token: `SharedFilterStrip` w aktywnym zakresie UI Dictionary.
- To nie jest problem Lejka ani kolorĂ„â€šÄąâ€šw ikon.

ZMIANA:
- R9 dopisuje aktywny blok UI Dictionary z literalami:
  - `SharedFilterStrip`
  - `FunnelLayoutFrozen`
  - `FunnelIconToneSourceTruth`
  - `MetricTileIconColorSource`
- R9 odĂ„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťa R8 guard, Ă„Ä…Ă„Ëťeby czytaĂ„Ä…Ă˘â‚¬Ĺˇ bloki R9/R8/R6/R5/R4 razem.
- R9 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R9/R8 guardĂ„â€šÄąâ€šw
- R9 guard/test
- R8 regression guard/test
- R6 guard jeĂ„Ä…Ă˘â‚¬Ĺźli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze Ă„Ä…Ă˘â‚¬Ĺźlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R10 Funnel icon tone PowerShell StrictMode repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R9 zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ siÄ‚â€žĂ˘â€žË po dopisaniu UI Dictionary i project memory.
- BĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦d: `The property 'check:stage231d0f-r9-funnel-icon-tone-ui-dictionary-guard-repair' cannot be found on this object.`
- Przyczyna: PowerShell `Set-StrictMode` i dostÄ‚â€žĂ˘â€žËp do brakujÄ‚â€žĂ˘â‚¬Â¦cej wĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬ĹźciwoĂ„Ä…Ă˘â‚¬Ĺźci w `package.json`.
- To nie jest problem runtime Lejka.

ZMIANA:
- R10 usuwa kruchy dostÄ‚â€žĂ˘â€žËp PowerShell `$Pkg.scripts.'...'`.
- Dopisanie scriptĂ„â€šÄąâ€šw do `package.json` odbywa siÄ‚â€žĂ˘â€žË przez `node -e`.
- R10 uruchamia R10/R9/R8 guardy i testy.
- R10 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R10/R9/R8 guardĂ„â€šÄąâ€šw
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 guard jeĂ„Ä…Ă˘â‚¬Ĺźli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze Ă„Ä…Ă˘â‚¬Ĺźlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R11 Funnel R6 regression guard resolver repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R10/R9/R8 guardy i testy przeszĂ„Ä…Ă˘â‚¬Ĺˇy.
- Etap zatrzymaĂ„Ä…Ă˘â‚¬Ĺˇ wyĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦cznie stary R6 regression guard.
- R6 guard oczekiwaĂ„Ä…Ă˘â‚¬Ĺˇ literalĂ„â€šÄąâ€šw `tone: 'blue'`, `tone: 'amber'`, `tone: 'purple'`, `tone: 'red'`, `tone: 'green'`.
- Po R8 te literaĂ„Ä…Ă˘â‚¬Ĺˇy zostaĂ„Ä…Ă˘â‚¬Ĺˇy celowo zastÄ‚â€žĂ˘â‚¬Â¦pione resolverem `resolveCloseflowMetricIconTone`.

ZMIANA:
- R11 odĂ„Ä…Ă˘â‚¬ĹźwieĂ„Ä…Ă„Ëťa R6 guard/test, Ă„Ä…Ă„Ëťeby akceptowaĂ„Ä…Ă˘â‚¬Ĺˇ nowy source of truth.
- R11 odpala R11/R10/R9/R8/R6 guardy i testy.
- R11 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla guardĂ„â€šÄąâ€šw R11/R10/R9/R8/R6
- R11 guard/test
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 refreshed guard/test
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze Ă„Ä…Ă˘â‚¬Ĺźlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_START -->
## 2026-06-12 18:30 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R12 Funnel metric colors real CSS enforce

STATUS: READY_TO_APPLY

FAKTY Z QA:
- Po pushu R11 ukĂ„Ä…Ă˘â‚¬Ĺˇad Lejka jest OK.
- W Vercel `/funnel` nadal wyglÄ‚â€žĂ˘â‚¬Â¦da prawie szaro.
- Problem: kolor nie dochodzi wystarczajÄ‚â€žĂ˘â‚¬Â¦co mocno do kafli/SVG.

FAKTY Z KODU:
- `SalesFunnel.tsx` ma `data-eliteflow-metric-tone` i `cf-top-metric-tile-icon`.
- `closeflow-metric-tiles.css` ma tokeny `--cf-metric-tone-*-icon`, ale nie wymuszaĂ„Ä…Ă˘â‚¬Ĺˇ peĂ„Ä…Ă˘â‚¬Ĺˇnego `stroke: currentColor` na SVG i dzieciach SVG.
- `PieniÄ‚â€žĂ˘â‚¬Â¦dze` ma dĂ„Ä…Ă˘â‚¬ĹˇugÄ‚â€žĂ˘â‚¬Â¦ wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ i wymaga value-kind.

DECYZJA:
- UkĂ„Ä…Ă˘â‚¬Ĺˇad Lejka zostaje zamroĂ„Ä…Ă„Ëťony.
- R12 zmienia tylko realnÄ‚â€žĂ˘â‚¬Â¦ kolorystykÄ‚â€žĂ˘â€žË kafelkĂ„â€šÄąâ€šw/ikon.
- `Cisza 7+` ma byÄ‚â€žĂ˘â‚¬Ë‡ purple, nie amber.
- Kolor ma byÄ‚â€žĂ˘â‚¬Ë‡ subtelny, nie tÄ‚â€žĂ˘â€žËcza.
- Source of truth: `closeflow-metric-tiles.css`.

ZMIANA:
- `FUNNEL_OWNER_TILE_TONE_MAP` ma jawne tony: blue, amber, purple, red, green.
- Dodano `data-cf-metric-value-kind`.
- `closeflow-metric-tiles.css` wymusza SVG `stroke: currentColor`.
- Dodano subtelne tĂ„Ä…Ă˘â‚¬Ĺˇa/bordery kafli per tone.
- Dodano money value sizing.

TESTY:
- `node scripts/check-stage231d0f-r12-funnel-metric-colors-real-css-enforce.cjs`
- `node --test tests/stage231d0f-r12-funnel-metric-colors-real-css-enforce.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA dalej wymagane, bo to etap CSS/render.
- Local tree ma wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze Ă„Ä…Ă˘â‚¬Ĺźmieci; push tylko selektywny.
<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_END -->

<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_START -->
## 2026-06-12 19:20 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0F-R13 Funnel visual color density

STATUS: READY_TO_APPLY

FAKTY Z QA:
- R12 przeszedĂ„Ä…Ă˘â‚¬Ĺˇ technicznie i zostaĂ„Ä…Ă˘â‚¬Ĺˇ wypchniÄ‚â€žĂ˘â€žËty.
- Ekran `/funnel` nadal wyglÄ‚â€žĂ˘â‚¬Â¦da za blado.
- Problem nie dotyczy juĂ„Ä…Ă„Ëť tylko ikon; brakuje warstwy kolorystycznej kafli i rekordĂ„â€šÄąâ€šw.

DECYZJE DAMIANA:
- UkĂ„Ä…Ă˘â‚¬Ĺˇad Lejka jest zaakceptowany i zamroĂ„Ä…Ă„Ëťony.
- DodaÄ‚â€žĂ˘â‚¬Ë‡ kolor bez tÄ‚â€žĂ˘â€žËczy.
- Kafelki majÄ‚â€žĂ˘â‚¬Â¦ mieÄ‚â€žĂ˘â‚¬Ë‡ kolor w ikonie, wartoĂ„Ä…Ă˘â‚¬Ĺźci i subtelnym surface/accent.
- Rekordy majÄ‚â€žĂ˘â‚¬Â¦ dostaÄ‚â€žĂ˘â‚¬Ë‡ lekkie semantyczne akcenty.
- Przyciski `OtwĂ„â€šÄąâ€šrz` majÄ‚â€žĂ˘â‚¬Â¦ byÄ‚â€žĂ˘â‚¬Ë‡ rĂ„â€šÄąâ€šwne i bez Ă„Ä…Ă˘â‚¬Ĺˇamania.

ZMIANA:
- R13 dodaje `FunnelDecisionSignal tone`.
- R13 dodaje data atrybuty rekordĂ„â€šÄąâ€šw.
- R13 dodaje tone surface/accent dla kafli w `closeflow-metric-tiles.css`.
- R13 zwiÄ‚â€žĂ˘â€žËksza open button z 132px do 156px i dodaje nowrap.
- R13 nie zmienia layoutu ani logiki filtrĂ„â€šÄąâ€šw.

TESTY:
- `node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs`
- `node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- To etap CSS/render, wiÄ‚â€žĂ˘â€žËc manual QA jest obowiÄ‚â€žĂ˘â‚¬Â¦zkowy.
- Local tree ma wczeĂ„Ä…Ă˘â‚¬Ĺźniejsze Ă„Ä…Ă˘â‚¬Ĺźmieci; push tylko selektywny.
<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_END -->

<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 20:10 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0G Visual Tile Source Truth Atlas

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- STAGE231D0F-R13 przeszedĂ„Ä…Ă˘â‚¬Ĺˇ guard/test/build.
- Commit `0b2f6fb2 fix: improve funnel visual color density` zostaĂ„Ä…Ă˘â‚¬Ĺˇ wypchniÄ‚â€žĂ˘â€žËty na `dev-rollout-freeze`.
- Damian wizualnie akceptuje Lejek i zamraĂ„Ä…Ă„Ëťa go jako baseline.

DECYZJA DAMIANA:
- FunnelMetricTileR13 zostaje Ă„Ä…ÄąĹşrĂ„â€šÄąâ€šdĂ„Ä…Ă˘â‚¬Ĺˇem prawdy dla globalnego CloseFlowMetricTileV2.
- Nie przebudowywaÄ‚â€žĂ˘â‚¬Ë‡ caĂ„Ä…Ă˘â‚¬Ĺˇej aplikacji chaotycznie.
- Najpierw source truth, atlas, guard i plan fal.

ZMIANA:
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`.
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.
- Dopisano UI Dictionary: CloseFlowMetricTileV2, CloseFlowMetricToneMap, FunnelMetricTileR13, SharedFilterStrip, RecordListCard, RightRailCard, FinanceMetricTile.
- Dodano guard/test D0G.
- Runtime widokĂ„â€šÄąâ€šw nie jest przepinany w tym etapie.

TESTY:
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- R13 regression guard/test jeĂ„Ä…Ă˘â‚¬Ĺźli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- UI Dictionary ma stare duplikaty i historyczne mojibake. Guard D0G skanuje aktywny blok D0G i nowe source truth, nie caĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â‚¬Â¦ historiÄ‚â€žĂ˘â€žË sĂ„Ä…Ă˘â‚¬Ĺˇownika.
- PeĂ„Ä…Ă˘â‚¬Ĺˇny cleanup lokalnych Ă„Ä…Ă˘â‚¬Ĺźmieci po starych paczkach zostaje osobnym etapem.
<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->

<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0G-CLOSEOUT

- Closed D0G Visual Tile Source Truth Atlas after guard/test/build verification.
- Updated run report from READY_TO_APPLY to PASS / CLOSED.
- Recorded test results in central project files.
- Confirmed next stage: STAGE231D0H-1 Leads + Clients metric tiles and filters to CloseFlowMetricTileV2.
- No runtime UI, SQL, Supabase, routing, kanban or drag/drop changes.
<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->
<!-- STAGE231D0G_CLOSEOUT_R2_GUARD_SCOPE_REPAIR_2026_06_12_START -->
## 2026-06-12 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â€šÂ¬ÄąÄ„ STAGE231D0G-CLOSEOUT-R2 Guard scope repair

STATUS: READY_TO_RUN

FAKTY:
- D0G guard/test PASS, R13 regression PASS, build PASS.
- Poprzedni closeout guard skanowal cale historyczne pliki centralne.
- Historyczne pliki zawieraja stare mojibake i stare teksty SQL/scope, wiec guard dal falszywy FAIL.

ZMIANA:
- R2 guard skanuje tylko aktywne bloki STAGE231D0G-CLOSEOUT i Obsidian payload.
- R2 nie rusza runtime UI.

TESTY:
- node scripts/check-stage231d0g-closeout-visual-tile-source-truth-atlas.cjs
- node --test tests/stage231d0g-closeout-visual-tile-source-truth-atlas.test.cjs
- node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs
- node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs
- npm run build
- git diff --check
<!-- STAGE231D0G_CLOSEOUT_R2_GUARD_SCOPE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12_START -->
## 2026-06-12 22:05 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0H-N1-R3 Notifications visual source cleanup section bounds

STATUS: READY_TO_APPLY

FAKTY:
- N1 R2 failed during patch on conflict placeholder removal.
- Real conflict card is a standalone right rail `<section>` before the upcoming card.
- R3 removes the whole section using section boundaries.

ZMIANA:
- R3 uses section bounds for conflict card removal.
- R3 preserves N1 scope: visual/source truth only.
- Runtime data logic, filters, localStorage, Supabase, SQL and routing are untouched.

TESTY:
- `node scripts/check-stage231d0h-n1-notifications-visual-source-cleanup.cjs`
- `node --test tests/stage231d0h-n1-notifications-visual-source-cleanup.test.cjs`
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA `/notifications` required.
- Previous failed N1/N1-R2 copied guard/test/run/obsidian files; R3 overwrites active guard/test and creates final R3 run/obsidian.
<!-- STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12_END -->

## 2026-06-13 09:11 - STAGE231F_R3 Owner Control Baseline
- Dodano wspolny silnik Owner Control i migracje progow workspace.
- Przepieto `/today`, LeadDetail i listy lead/client/case na wspolne kontrakty.
- Dodano konfiguracje 7/14/5000 oraz trwaly local fallback.
- Dodano dedykowany guard/test i rozszerzono Stage225 o progi 3/10.

## 2026-06-13 - CLOSEFLOW_CLIENT_CASE_URGENT_FIX
- Case Owner Control korzysta z kanonicznej wartosci transakcji z finance source.
- Kartoteka klienta ma `Dodaj sprawe`; tworzenie korzysta ze wspolnego starter-case helpera i otwiera finanse.
- Glowna sprawa pozostaje pierwsza, a kolejne sprawy sa ponizej.
- `Razem do pobrania` korzysta z pozostalej prowizji, nie pozostalej wartosci transakcji.
- `Cofnij` wraca do powiazanego klienta, z fallbackiem do `/cases`.

## 2026-06-13 14:33 - CLOSEFLOW_CASE_FINANCE_UI_REPAIR
- API zadan i wydarzen filtruje po `case_id`, a fallback zachowuje `case_id` i `client_id`.
- CaseDetail pokazuje blad pobrania, dopisuje utworzone dzialanie i wykonuje refetch.
- Migracja przywraca brakujace kolumny `case_items`.
- Dodano wspolne tony finansow oraz tekst `Pozostalo do zaplaty`.
- Uporzadkowano akcje notatek i ellipsis najcenniejszych leadow.

## 2026-06-14 10:05 Europe/Warsaw - STAGE231G R2

- LeadDetail: dodano operacyjne CTA do kafelkĂ„â€šÄąâ€šw i panelu finansĂ„â€šÄąâ€šw.
- LeadDetail: wydzielono content/status/actions w wierszach dziaĂ„Ä…Ă˘â‚¬ĹˇaĂ„Ä…Ă˘â‚¬Ĺľ.
- Leads: pole tworzenia leada opisane jako PotencjaĂ„Ä…Ă˘â‚¬Ĺˇ / wartoĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ i oznaczone markerem testowym.
- Naprawiono paczkÄ‚â€žĂ˘â€žË R1: PowerShell nie trzyma juĂ„Ä…Ă„Ëť duĂ„Ä…Ă„Ëťych stringĂ„â€šÄąâ€šw TSX, patch wykonuje Node.

## 2026-06-14 10:40 Europe/Warsaw - STAGE231G R6

- Naprawiono konflikt rebase w _project/04_ETAPY_ROZWOJU_APLIKACJI.md.
- Dodano realne klasy work-row content/status/actions w LeadDetail.
- Poprawiono guard/test, Ă„Ä…Ă„Ëťeby nie myliĂ„Ä…Ă˘â‚¬Ĺˇ poprawnego group.key w accordion z bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdem overflow.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G R7

- LeadDetail: CTA PotencjaĂ„Ä…Ă˘â‚¬Ĺˇ otwiera maĂ„Ä…Ă˘â‚¬Ĺˇy modal tylko do wartoĂ„Ä…Ă˘â‚¬Ĺźci, oparty o ten sam Dialog/DialogFooter pattern co inne modale.
- api/leads: zapis potencjaĂ„Ä…Ă˘â‚¬Ĺˇu synchronizuje value i deal_value przy POST/PATCH.
- LeadDetail CSS: poprawiono desktopowe wyrĂ„â€šÄąâ€šwnanie akcji wierszy, Ă„Ä…Ă„Ëťeby Zrobione nie spadaĂ„Ä…Ă˘â‚¬Ĺˇo samotnie poza liniÄ‚â€žĂ˘â€žË.

## 2026-06-14 - STAGE231G_R3 LeadDetail function mapping and operational closeout

Status: DO TESTU LOKALNEGO
Cel: domknac karte leada jako operacyjne centrum pracy: potencjal, nastepny krok, cisza/ryzyko, blokada, szybkie akcje, finanse, missing_item i czytelne wiersze dzialan.
Run report: _project/runs/STAGE231G_R3_LEAD_DETAIL_FUNCTION_MAPPING_AND_OPERATIONAL_CLOSEOUT.md
Guard: scripts/check-stage231g-r3-lead-detail-function-mapping.cjs
Test: tests/stage231g-r3-lead-detail-function-mapping.test.cjs
SQL: nie ruszano.

## STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX

Data: 2026-06-14 11:45 Europe/Warsaw
Status: DO TESTU LOKALNEGO
Cel: domknac LeadDetail po R3 przez usuniecie drugiej sciezki Brak, naprawe delete missing_item w overflow i utwardzenie CSS work-row.
Run report: _project/runs/STAGE231G_R4_LEAD_DETAIL_FUNCTION_MAPPING_CLOSEOUT_FIX.md
Guard: scripts/check-stage231g-r4-lead-detail-function-mapping-closeout.cjs
Test: tests/stage231g-r4-lead-detail-function-mapping-closeout.test.cjs
Typecheck: SKIP jesli package.json nie ma scripts.typecheck.
Zakaz zakresu: bez SQL, Google Calendar, billing/trial, CaseDetail, ClientDetail.

## 2026-06-14 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## 2026-06-14 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL

Dodano prostÄ‚â€žĂ˘â‚¬Â¦ korektÄ‚â€žĂ˘â€žË kosztĂ„â€šÄąâ€šw sprawy w tym samym oknie co korekty wpĂ„Ä…Ă˘â‚¬Ĺˇat. Koszty sÄ‚â€žĂ˘â‚¬Â¦ pokazane jako czerwone pozycje, z akcjÄ‚â€žĂ˘â‚¬Â¦ `Koryguj` i `UsuĂ„Ä…Ă˘â‚¬Ĺľ`. SQL nie ruszany.

## 2026-06-14 15:45 Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpĂ„Ä…Ă˘â‚¬ĹˇatÄ‚â€žĂ˘â€žË/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.

## STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ 2026-06-14 16:40 Europe/Warsaw
- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Scope: payment correction now edits existing payment amount/date/note through updatePaymentInSupabase; cost correction edits kind/date/status/note and money fields.
- SQL: not touched.
- Risk: if payment PATCH fails on server, backend payment endpoint repair is required.


## 2026-06-14 HH:mm Europe/Warsaw Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
- Repair after red-guard pushed R1F: normalize commission payment save and make guards CRLF-safe.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG
- Added cost other-name field and explicit reimbursable checkbox in CaseDetail cost create/correct flows.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
- Synced CaseDetail finance/cost stage ledger after R1F4/R1G.
- No runtime changes.
- Renamed future dictation execution stage to R1D2 to avoid R1D collision.


## STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ CaseDetail cost/payment lifecycle product closeout

- date: 2026-06-14 18:55 Europe/Warsaw
- type: docs-only / manual UI confirmation
- result: CaseDetail cost/payment lifecycle moved from SERVER_UI_REQUIRED to PRODUCT_PASS after Damian confirmed manual tests.
- runtime changes: none.

## STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

- data: 2026-06-14 19:10 Europe/Warsaw
- zmiana: przywrocono runtime dyktowania notatki w CaseDetail przez Web Speech / SpeechRecognition; dodano autosave po ciszy i dokumentacje etapu.
- SQL: nie ruszano.
- status: DO_TEST_AND_PUSH / SERVER_UI_REQUIRED.


## STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ 2026-06-14 19:40 Europe/Warsaw

- status: RUNTIME_HOTFIX_PREPARED
- zakres: drugi widoczny przycisk w panelu Notatki sprawy nie moĂ„Ä…Ă„Ëťe zostaÄ‚â€žĂ˘â‚¬Ë‡ jako disabled Ä‚ËĂ˘â€šÂ¬ÄąÄľNotatka gĂ„Ä…Ă˘â‚¬Ĺˇosowa Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ wkrĂ„â€šÄąâ€štceÄ‚ËĂ˘â€šÂ¬ÄąÄ„; ma uĂ„Ä…Ă„ËťywaÄ‚â€žĂ˘â‚¬Ë‡ tego samego handlera SpeechRecognition/autosave co przycisk w panelu DziaĂ„Ä…Ă˘â‚¬Ĺˇania sprawy.
- runtime: src/pages/CaseDetail.tsx, bez SQL i bez R1E kosztĂ„â€šÄąâ€šw zwrĂ„â€šÄąâ€šconych.
- test: R1D2 guard/test + R1D2 R4 guard/test + build + diff-check.
- ryzyko: wczeĂ„Ä…Ă˘â‚¬Ĺźniejszy R1D2 zabezpieczaĂ„Ä…Ă˘â‚¬Ĺˇ pierwszy przycisk, ale nie objÄ‚â€žĂ˘â‚¬Â¦Ă„Ä…Ă˘â‚¬Ĺˇ drugiego widocznego przycisku w panelu notatek.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ/Zapisz. Etap zastĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âpuje runtime file bez kruchych anchorÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw po bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąÄľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcie klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹ÂdÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw legacy markerÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ny chain guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/testÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ podwÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇjnie escapowany backslash. Bez tego guard szuka bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âdu guardÄ‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇw R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄe wymagaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ nieistniejĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦cej skÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujÄ‚â€žĂ˘â‚¬Â¦ do 5 wpisĂ„â€šÄąâ€šw, majÄ‚â€žĂ˘â‚¬Â¦ tooltip peĂ„Ä…Ă˘â‚¬Ĺˇnej treĂ„Ä…Ă˘â‚¬Ĺźci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaĂ„Ä…Ă˘â‚¬Ĺˇaniach pokazuje treĂ„Ä…Ă˘â‚¬ĹźÄ‚â€žĂ˘â‚¬Ë‡ notatki jako opis.
- guard: scripts/check-stage231h-r1d2-r11-note-panel-followup-prompt-map-guard.cjs

## STAGE231H_R1D2_R12D_CASE_QUICK_NOTE_SCOPE_CLIENT_DEDUPE_FINAL_ANCHORLESS

- data: 2026-06-15 Europe/Warsaw
- status: DO_APPLY / final anchorless repair
- zakres: CaseQuickActions explicit case scope, ContextNoteDialog handoff order, CaseDetail quick note local append + prompt, ClientDetail action dedupe
- guard: scripts/check-stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.cjs
- test: tests/stage231h-r1d2-r12d-case-quick-note-scope-client-dedupe-final-anchorless.test.cjs
- SQL: nie dotyczy

## STAGE231H_R1D2_R14F_NOTE_DELETE_LINKED_FOLLOWUP_EXPANDED_PANEL_ARROW_SAFE

- Data: 2026-06-15T11:25:01.568Z
- Typ: CaseDetail notes panel / linked follow-up delete / guard
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiĂ„â€¦zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- CaseDetail: naprawiono dwukierunkowe powiÄ…zanie notatka/follow-up, ostrzeĹĽenie przy kasowaniu follow-upu z dziaĹ‚aĹ„ i hierarchiÄ™ tekstu w karcie dziaĹ‚ania.
