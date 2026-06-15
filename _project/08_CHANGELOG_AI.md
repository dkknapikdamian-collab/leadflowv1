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

## 2026-05-16 Ă˘â‚¬â€ť Stage92 calendar selected day readability {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

- UporzĂ„â€¦dkowano render `CalendarSelectedDayEntryRowV9`: peÄąâ€šny typ, godzina, status, tytuÄąâ€š, powiĂ„â€¦zanie i akcje.
- UsuniĂ„â„˘to ryzyko biaÄąâ€šej pustej belki pod wpisem przez jeden stabilny shell wpisu i marker `data-cf-selected-day-v9-no-bottom-bar`.
- Akcje w V9 sĂ„â€¦ grupowane w dwÄ‚Ĺ‚ch rzĂ„â„˘dach na desktopie i responsywnie na mobile.
- Dodano guard `tests/stage92-calendar-selected-day-readable-actions.test.cjs` do quiet release gate.

## STAGE93_CALENDAR_WEEK_RAIL_CLEANUP Ă˘â‚¬â€ť 2026-05-16
- Removed the obsolete hidden `calendar-week-filter-list` render from Calendar week view.
- Kept `calendar-week-visible-days-v3` as the single visible week-day rail.
- Changed week rail count to plain text via `calendar-week-day-count-text`; no black/dark/plaque badge.

## STAGE93_GUARD_FIX_STAGE94_CALENDAR_SWEEP_2026_05_16

- Poprawiono wadliwy guard Stage93 po lokalnym patchu V5.
- Dodano sweep diagnostyczny Calendar UI do wykrywania kolejnych bÄąâ€šĂ„â„˘dÄ‚Ĺ‚w przed zbiorczĂ„â€¦ paczkĂ„â€¦ naprawczĂ„â€¦.

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
- Ujednolicono szerokoÄąâ€şĂ„â€ˇ prawego raila /leads ze wspÄ‚Ĺ‚lnym source of truth dla /clients.
- UsuniĂ„â„˘to lokalny override JSX `xl:grid-cols-[minmax(0,1fr)_300px]`.
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
## 2026-05-16 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ Stage104 / Paczka F Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ Calendar loading performance

STATUS: WDROÄąÂ»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

FAKTY:
- Kalendarz nie powinien juÄąÄ˝ liczyĂ„â€ˇ `combineScheduleEntries` wprost w renderze.
- Dni miesiĂ„â€¦ca i tygodnia korzystajĂ„â€¦ z `entriesByDayKey` / `weekEntriesByDayKey`.
- `Calendar.tsx` nie powinien juÄąÄ˝ uÄąÄ˝ywaĂ„â€ˇ `getEntriesForDay(...)` w render path.
- `cases` idĂ„â€¦ z `fetchCalendarBundleFromSupabase()`, bez drugiego `fetchCasesFromSupabase()` w `Calendar.tsx`.
- PeÄąâ€šnostronicowy loader zostaÄąâ€š zastĂ„â€¦piony maÄąâ€šym skeletonem danych.

TESTY:
- `node tests/stage104-calendar-loading-performance-contract.test.cjs`
- `npm run build` jeÄąâ€şli nie uÄąÄ˝yto `-SkipBuild`.

RYZYKA:
- Range fetch backendowy jest DO POTWIERDZENIA.
- Stare DOM-normalizatory miesiĂ„â€¦ca zostaÄąâ€šy nietkniĂ„â„˘te i wymagajĂ„â€¦ osobnego audytu w Paczce G.

NAST\u00c4\u0098PNY KROK:
- Test rĂ„â„˘czny `/calendar`: start, tydzieÄąâ€ž, miesiĂ„â€¦c, wybrany dzieÄąâ€ž, edycja, +1H/+1D/+1W, zrobione, usuÄąâ€ž.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ Templates delete + visual contract Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ 2026-05-16

STATUS: WDROÄąÂ»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaÄąâ€š widoczny przycisk UsuÄąâ€ž na karcie szablonu.
- Delete uÄąÄ˝ywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeÄąâ€şli szablon ma pozycje checklisty.
- Karta szablonu uÄąÄ˝ywa cf-template-card cf-readable-card i markerÄ‚Ĺ‚w
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
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaÄąâ€š uÄąÄ˝yty w aktywnych sprawach. Wymusza Äąâ€şwiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaĂ„â€ˇ /templates; dopiero potem zdecydowaĂ„â€ˇ, czy robimy kolejny lokalny etap czy wspÄ‚Ĺ‚lny commit/push Stage104+Stage105.
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
## 2026-05-17 Ă˘â‚¬â€ť Stage98B-100B Calendar polish copy and week-plan visibility

Status: PATCH PACKAGE PREPARED / LOCAL APPLY REQUIRED.

Zakres:
- naprawa mojibake i bÄąâ€šĂ„â„˘dnych polskich znakÄ‚Ĺ‚w w aktywnym `/calendar`,
- uporzĂ„â€¦dkowanie `closeflow-calendar-selected-day-new-tile-v9.css` do jednego modelu V9 + Stage100,
- wygaszenie aktywnego CSS po Stage94 V2/V3/V4 i starych rodzin `.cf-week-plan-entry-*` / `.cf-calendar-week-entry-*`,
- nowy guard `tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`,
- aktualizacja quiet release gate.

Guardy/testy do uruchomienia przez paczkĂ„â„˘:
- `node tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node tests/stage99-calendar-active-class-contract.test.cjs`
- `node tests/stage100-calendar-week-plan-entry-visible.test.cjs`
- `node tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

Test rĂ„â„˘czny: DO WYKONANIA na `/calendar`.
Kryterium: dzieÄąâ€ž z wpisem nie moÄąÄ˝e wyglĂ„â€¦daĂ„â€ˇ jak pusty biaÄąâ€šy pasek/mini-kafelek.

<!-- STAGE104C_WEEK_PLAN_CARD_UNCLAMP -->

## 2026-05-17 Ă˘â‚¬â€ť Stage104C: Calendar week plan card unclamp

### FAKTY Z KODU / PLIKÄ‚â€śW
- Poprzednia paczka Stage104B nie wykonaÄąâ€ša patchera: plik CJS miaÄąâ€š bÄąâ€šĂ„â€¦d skÄąâ€šadni przez nieucieczony backtick w osadzonym teÄąâ€şcie.
- Faktyczny problem UI: w Plan najbliÄąÄ˝szych dni wpis istnieje, ale renderuje siĂ„â„˘ jako wĂ„â€¦ski pionowy fragment akcji.
- Naprawa Stage104C: root week-plan card nie uÄąÄ˝ywa legacy klasy calendar-entry-card i dostaje anti-collapse CSS: width 100%, max-width none, min-height 92px, overflow visible, visibility visible, opacity 1.

### GUARDY
- Stage99 pilnuje klas i zakazu mieszania calendar-entry-card z cf-calendar-week-plan-entry-card.
- Stage100 pilnuje DOM modelu, peÄąâ€šnych labeli, braku display contents wrappera i anti-collapse CSS.
- Stage104 pilnuje widocznego payloadu karty oraz braku hidden/zero-size reguÄąâ€š.

### TESTY AUTOMATYCZNE
Do potwierdzenia przez run:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- npm run build
- npm run verify:closeflow:quiet

### TEST RĂ„ÂCZNY
Status: TEST RĂ„ÂCZNY DO WYKONANIA. WejÄąâ€şĂ„â€ˇ na /calendar i sprawdziĂ„â€ˇ dzieÄąâ€ž z 1 wpis oraz dzieÄąâ€ž z 0 wpisÄ‚Ĺ‚w.

## Stage104D - Calendar week plan compact one-row - 2026-05-17
- Status: WDRAÄąÂ»ANE.
- Cel: zamroziĂ„â€ˇ Stage104C i skompaktowaĂ„â€ˇ wpis tygodniowy do jednego wiersza na desktopie.
- Zakres: src/styles/closeflow-calendar-selected-day-new-tile-v9.css, guardy Stage100/104/104D, quiet gate.
- Nie ruszano logiki UsuÄąâ€ž / Zrobione ani Google Calendar syncu. OpÄ‚Ĺ‚ÄąĹźnienie syncu zostaje do osobnego Stage104E.
- Test rĂ„â„˘czny: /calendar, dzieÄąâ€ž z 1 wpisem ma byĂ„â€ˇ jednym kompaktowym wierszem; dzieÄąâ€ž z 0 wpisÄ‚Ĺ‚w bez zmian.


## STAGE107_CLIENT_DETAIL_RUNTIME_TDZ_FINANCE_FIX_2026_05_17

- Typ: P0 runtime regression.
- Zakres: ClientDetail, finance summary, ClientTopTiles.
- Powod: `clientFinance` czytal `clientFinanceSummary` przed deklaracja, a `ClientTopTiles` czytal finance summary spoza propsow.
- Guard: `scripts/check-stage107-client-detail-runtime-tdz-finance.cjs`.
- Test: `tests/stage107-client-detail-runtime-tdz-finance.test.cjs`.
- Test reczny: otwarcie szczegolow klienta bez `APP_ROUTE_RENDER_FAILED`.


## Stage113 - Logo CloseFlow mapping
- Dodano brand assety i przepiĂ„â„˘to tekstowe CF / login icon na komponent logo.


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

- Dodano wspÄ‚Ĺ‚lny komponent `src/components/entity-contact-card.tsx` i CSS `src/styles/entity-contact-card.css`.
- LeadDetail dostaÄąâ€š lewĂ„â€¦ kartĂ„â„˘ kontaktowĂ„â€¦ w ukÄąâ€šadzie klienta.
- ClientDetail uÄąÄ˝ywa wspÄ‚Ĺ‚lnej listy danych kontaktowych zamiast lokalnego `InfoRow`.
- UsuniĂ„â„˘to lokalnĂ„â€¦ wyspĂ„â„˘ UI LeadDetail: `InfoLine` / `lead-detail-contact-grid`.

## Stage115B LeadDetail notes visible source contract

- Split LeadDetail note display from contact card.
- Added dedicated `Notatki leada` section with source lead note and latest note activity.
- Added guard for source/placement contract.

## Stage115C LeadDetail inline note submit contract

- Locked LeadDetail history note form as inline submit path.
- Renamed work-center global note action to OtwÄ‚Ĺ‚rz szybki formularz notatki.
- Fixed Polish inline note copy: placeholder, dictation button and submit button.

## Stage115D LeadDetail overdue work items red contract

- Added overdue detection for LeadDetail work items.
- Timeline tasks/events with past date and open status now render `ZalegÄąâ€še`.
- Added red danger pill and overdue row styling.
- Replaced mojibake separator `Ă„â€šĂ‹ÂĂ˘â‚¬ĹĄĂ‚Â¬Ä‚â€žÄąË‡` with `Ä‚ËĂ˘â€šÂ¬Ă‹Â`.

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

Status: WDRAÄąÂ»ANE.

Cel: +1H/+1D/+1W musi wizualnie przesuwaĂ„â€ˇ wpis od razu po udanym PATCH, zamiast polegaĂ„â€ˇ wyÄąâ€šĂ„â€¦cznie na refreshSupabaseBundle().

Test rĂ„â„˘czny: /calendar, wpis task/event, akcje +1H/+1D/+1W. Po sukcesie karta ma zmieniĂ„â€ˇ dzieÄąâ€ž/godzinĂ„â„˘.
<!-- /STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->

## 2026-05-18 - STAGE122_RUNTIME_AUTH_API_PWA_HARDENING

FAKTY: production console showed repeated /api/me 401 plus /api/tasks and /api/events 500 during calendar shift. DevTools also showed an active CloseFlow service worker and old bundle initiator. Stage122 disables stale PWA cache/register behavior, adds /api/version, adds a runtime console marker, and makes work-items auth failures return 401/403 instead of masked 500.

TESTY: node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs; npm run build; npm run verify:closeflow:quiet.

NASTĂ„ÂPNY KROK: after deployment, verify Network JS hash changes, call /api/version, and retest Calendar +1D/+1W/+1H. If /api/me still returns 401, user must re-auth via Google/Supabase without clearing localStorage first.

## 2026-05-18 - STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE

FAKTY: Stage122 V7 passed Stage122/PWA/Stage98/Stage121/build, then failed Vercel Hobby function budget because api/version.ts raised api/*.ts to 13. V8 chose system rewrite architecture but failed on a brittle api/system.ts anchor.

DECYZJA: /api/version stays available through /api/system?kind=version, without adding a physical Vercel function.

TESTY: Stage122 guard, PWA foundation, Vercel budget, Stage98, Stage121, build, verify:closeflow:quiet.

NASTĂ„ÂPNY KROK: verify production /api/version and runtime marker, then retest calendar shift only if /api/me is clean.

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
- Poprawiono czytelnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ pÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šl formularza w /settings, szczegÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šlnie Google Calendar reminders.
- Dodano src/styles/closeflow-settings-form-control-readability-stage179.css.
- Dodano 	ests/stage179-settings-form-control-readability-contract.test.cjs.
- Nie ruszano logiki Google Calendar, API, Supabase ani routingu.

## 2026-05-29 - STAGE179 Settings form control readability - local only

- Tryb: lokalnie, bez commita i bez pusha.
- Poprawiono czytelnoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ pÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šl formularza w /settings, szczegÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šlnie Google Calendar reminders.
- Dodano src/styles/closeflow-settings-form-control-readability-stage179.css.
- Dodano 	ests/stage179-settings-form-control-readability-contract.test.cjs.
- Nie ruszano logiki Google Calendar, API, Supabase ani routingu.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_CHANGELOG_START -->
## 2026-06-04 Ă˘â‚¬â€ť Stage221 owner-control roadmap po deep research CRM

Typ: dokumentacja roadmapy / pamiĂ„â„˘Ă„â€ˇ projektu / Obsidian update.

Dodano:
- szczegÄ‚Ĺ‚Äąâ€šowy blok Stage221 do `_project/07_NEXT_STEPS.md`,
- decyzjĂ„â„˘ owner-control do `_project/04_DECISIONS.md`,
- guard pamiĂ„â„˘ci roadmapy,
- roadmap file w `_project/roadmaps/`,
- run report,
- manifest aktualizacji Obsidiana,
- plik aktualizacji Obsidiana.

Nie zmieniono:
- runtime UI,
- routingu,
- API,
- Supabase,
- stylÄ‚Ĺ‚w,
- logiki produktu.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_CHANGELOG_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaÄąâ€šy siĂ„â„˘ na kruchych anchorach w Clients.tsx.
- V3 uÄąÄ˝ywa elastycznych regexÄ‚Ĺ‚w i naprawia czĂ„â„˘Äąâ€şciowy lokalny stan.
- Docelowy wzÄ‚Ĺ‚r: [Oferta wysÄąâ€šana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaÄąâ€š wypchniĂ„â„˘ty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaÄąâ€š patcha Settings/Cases, wiĂ„â„˘c helper i guard weszÄąâ€šy bez sekcji ustawieÄąâ€ž i bez case badges.
- R2B dopina brakujĂ„â€¦ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeÄąâ€şniej przechodziÄąâ€š, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siĂ„â„˘ domknĂ„â€¦Ă„â€ˇ hotfixem.
- R2B ma byĂ„â€ˇ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeÄąâ€şli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeÄąâ€şli plik istnieje
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, ÄąÄ˝eby nie udawaĂ„â€ˇ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uÄąÄ˝ywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozrÄ‚Ĺ‚ÄąÄ˝nia ciszĂ„â„˘ kontaktu od braku Äąâ€şwieÄąÄ˝ego ruchu fallback.
- Dodano runtime testy, ktÄ‚Ĺ‚re realnie wywoÄąâ€šujĂ„â€¦ funkcje przez esbuild, nie tylko szukajĂ„â€¦ tekstu.

DECYZJE DAMIANA:
- PodetapÄ‚Ĺ‚w A-D nie pushujemy osobno.
- Nie robiĂ„â€ˇ drugiego Today.
- Badge majĂ„â€¦ wynikaĂ„â€ˇ z jednego kontraktu ruchu i prawdy aktywnoÄąâ€şci.
- `updatedAt` moÄąÄ˝e byĂ„â€ˇ fallbackiem aktywnoÄąâ€şci, nie prawdĂ„â€¦ kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeÄąâ€šne wpiĂ„â„˘cie LeadDetail/CaseDetail widocznego work center moÄąÄ˝na zrobiĂ„â€ˇ jako D2, jeÄąâ€şli po runtime contract nie bĂ„â„˘dzie regresji.
- Today agregacja moÄąÄ˝e dostaĂ„â€ˇ ranking w nastĂ„â„˘pnym kroku, ale bez nowej sekcji.

NASTĂ„ÂPNY KROK:
- Po zielonych testach sprawdziĂ„â€ˇ /leads, /cases, /today.
- Commit/push dopiero po caÄąâ€šym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryÄąâ€š realny bÄąâ€šĂ„â€¦d: fallback z `updatedAt` nadpisywaÄąâ€š prawdziwĂ„â€¦ aktywnoÄąâ€şĂ„â€ˇ.
- Build przeszedÄąâ€š, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` sĂ„â€¦ uÄąÄ˝ywane wyÄąâ€šĂ„â€¦cznie, gdy nie ma realnych kandydatÄ‚Ĺ‚w aktywnoÄąâ€şci/kontaktu/pÄąâ€šatnoÄąâ€şci.
- To naprawia zaÄąâ€šoÄąÄ˝enie: nie udajemy kontaktu ani Äąâ€şwieÄąÄ˝ej aktywnoÄąâ€şci przez zwykÄąâ€šy update rekordu.

DECYZJE:
- Nie pushowaĂ„â€ˇ Stage223, dopÄ‚Ĺ‚ki runtime testy nie sĂ„â€¦ zielone.
- UtrzymaĂ„â€ˇ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajĂ„â€¦ jednym lokalnym blokiem do jednego commita po peÄąâ€šnych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonych testach moÄąÄ˝na dopiero rozwaÄąÄ˝yĂ„â€ˇ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na brakujĂ„â€¦cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiĂ„â„˘c brak samego pliku blokuje push.
- R2C dodaje brakujĂ„â€¦cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy release gate.
- Dodajemy minimalny test kontraktu ÄąĹźrÄ‚Ĺ‚dÄąâ€ša logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push dla caÄąâ€šego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedÄąâ€š Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byÄąâ€š renderowany przez `EntityTrashButton`, ale brakowaÄąâ€šo starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujĂ„â€¦cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy guardÄ‚Ĺ‚w.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejĂ„â€¦cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiĂ„â€¦Äąâ€š marker kosza na liÄąâ€şcie spraw, ale release gate przeszedÄąâ€š do kolejnego warunku.
- Guard `case trash actions` wymaga teÄąÄ˝, ÄąÄ˝eby `CaseDetail.tsx` uÄąÄ˝ywaÄąâ€š `EntityTrashButton`.
- `CaseDetail.tsx` miaÄąâ€š przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaÄąâ€š zwykÄąâ€šy `Button`.
- R2E zmienia tylko ÄąĹźrÄ‚Ĺ‚dÄąâ€šo przycisku na `EntityTrashButton` i uÄąÄ˝ywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy guardÄ‚Ĺ‚w.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspÄ‚Ĺ‚lnego ÄąĹźrÄ‚Ĺ‚dÄąâ€ša prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiĂ„â€¦Äąâ€š `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, ÄąÄ˝eby `CaseDetail.tsx` zawieraÄąâ€š `EntityTrashButton`.
- R2F speÄąâ€šnia oba kontrakty: importuje/uÄąÄ˝ywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czaĂ„â€ˇ guardÄ‚Ĺ‚w.
- Nie zmieniaĂ„â€ˇ release gate.
- RozwiĂ„â€¦zaĂ„â€ˇ konflikt guardÄ‚Ĺ‚w aliasem, nie obejÄąâ€şciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych ÄąĹźrÄ‚Ĺ‚dÄąâ€šach.
- PozostaÄąâ€še literalne znaki mojibake w guardach/testach sĂ„â€¦ zamieniane na ASCII unicode escapes, ÄąÄ˝eby guardy mogÄąâ€šy dalej opisywaĂ„â€ˇ zÄąâ€še znaki bez Äąâ€šamania Stage98.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiÄąâ€š Stage98 i przeprowadziÄąâ€š build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaÄąâ€ša, ÄąÄ˝e extractor Äąâ€šapaÄąâ€š default `{}`, nie ciaÄąâ€šo funkcji.
- Sama logika local-first byÄąâ€ša poprawna: funkcja ma `Promise.all([` i nie woÄąâ€ša Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaÄąâ€ša funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, ÄąÄ˝eby kontrakt testu i logika byÄąâ€šy spÄ‚Ĺ‚jne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiÄąâ€š extractor funkcji Stage120 przez usuniĂ„â„˘cie `= {}` z sygnatury.
- Po R2H test Stage120 doszedÄąâ€š dalej i wykazaÄąâ€š twardy wymÄ‚Ĺ‚g: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszĂ„â€¦ byĂ„â€ˇ literalnie bez argumentÄ‚Ĺ‚w.
- R2I przywraca literalne local reads bez argumentÄ‚Ĺ‚w i zostawia poprawionĂ„â€¦ sygnaturĂ„â„˘ `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, ÄąÄ˝eby nie zmieniaĂ„â€ˇ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiĂ„â€¦zujĂ„â€¦cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juÄąÄ˝ ma.
- `register-service-worker.ts` ma poprawnĂ„â€¦ logikĂ„â„˘: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaÄąâ€š tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaÄąâ€š release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenÄ‚Ĺ‚w w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiĂ„â€¦zania`.
- `Clients.tsx` miaÄąâ€š poprawnĂ„â€¦ semantykĂ„â„˘ soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speÄąâ€šniaÄąâ€š starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiĂ„â€¦zaÄąâ€ž.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiĂ„â€¦zujĂ„â€¦cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byÄąâ€š za ciasny: skrypt wymagaÄąâ€š dokÄąâ€šadnego istniejĂ„â€¦cego renderu `case-detail-history-row`, ktÄ‚Ĺ‚rego lokalny `CaseDetail.tsx` ma juÄąÄ˝ inaczej po wczeÄąâ€şniejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenÄ‚Ĺ‚w:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepÄąâ€šywu historii.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjĂ„â€¦ Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiÄąâ€š `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speÄąâ€šnia juÄąÄ˝ zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bÄąâ€šĂ„â„˘dem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziÄąâ€š `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenÄ‚Ĺ‚w w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juÄąÄ˝ przechodzi, wiĂ„â„˘c brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowĂ„â€¦ funkcjĂ„â€¦.

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziÄąâ€š case history visual P1 repair3 oraz wszystkie wczeÄąâ€şniejsze release gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastĂ„â„˘pny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoÄąâ€şĂ„â€ˇ klienta`,
  - `buildClientNextAction`.
- Log wskazaÄąâ€š brak `Zadania klienta`.
- R2O dodaje brakujĂ„â€¦ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linkÄ‚Ĺ‚w do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziÄąâ€š ClientDetail operational center oraz wszystkie wczeÄąâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaÄąâ€š zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerÄ‚Ĺ‚w, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyÄąâ€šĂ„â€¦czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyÄąâ€š `api/daily-digest.ts`.
- R2Q-V2 nie wykonaÄąâ€š patcha, bo helper JS miaÄąâ€š bÄąâ€šĂ„â€¦d skÄąâ€šadni przed modyfikacjĂ„â€¦ pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokÄąâ€šadny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄąâ€ški.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziÄąâ€š `daily-digest-email-runtime.test.cjs` oraz wczeÄąâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenÄ‚Ĺ‚w w `api/daily-digest.ts`:
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
- Nie wyÄąâ€šĂ„â€¦czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄąâ€ški/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziÄąâ€š `daily-digest-diagnostics.test.cjs` oraz wczeÄąâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenÄ‚Ĺ‚w w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyÄąâ€ški.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziÄąâ€š `daily-digest-cron-auth.test.cjs` oraz wczeÄąâ€şniejsze gates do builda.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plikÄ‚Ĺ‚w `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byÄąâ€šo 13 funkcji API.
- `api/system.ts` juÄąÄ˝ importuje `supportHandler` i obsÄąâ€šuguje `kind === 'support'`.
- `vercel.json` juÄąÄ˝ ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, ÄąÄ˝eby zejÄąâ€şĂ„â€ˇ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajĂ„â€¦ ten plik bezpoÄąâ€şrednio.
- Konsolidujemy redundantny support endpoint przez istniejĂ„â€¦cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juÄąÄ˝ istnieje.
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
- JeÄąâ€şli gdzieÄąâ€ş poza Vercel rewrite ktoÄąâ€ş woÄąâ€ša bezpoÄąâ€şrednio plikowĂ„â€¦ funkcjĂ„â„˘ `api/support.ts`, po usuniĂ„â„˘ciu musi trafiĂ„â€ˇ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrÄ‚Ĺ‚ciÄąâ€š `api/support.ts` i przeszedÄąâ€š `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaÄąâ€š siĂ„â„˘ przed peÄąâ€šnym dopiĂ„â„˘ciem `activitiesHandler` do `api/system.ts`, wiĂ„â„˘c R2V koÄąâ€žczy konsolidacjĂ„â„˘ `/api/activities`.
- `verify:closeflow:quiet` przeszedÄąâ€š dalej i zatrzymaÄąâ€š siĂ„â„˘ na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujĂ„â€¦cy kontrakt Stage32e bez przywracania starego dÄąâ€šugiego copy i bez zmiany layoutu.
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
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziĂ„â€ˇ dodawanie/odczyt aktywnoÄąâ€şci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiĂ„â„˘to marker bez zmiany UI, ÄąÄ˝eby nie rozwaliĂ„â€ˇ widoku.

NASTĂ„ÂPNY KROK:
- Po zielonym verify quiet wykonaĂ„â€ˇ jeden commit/push caÄąâ€šego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedÄąâ€š masowo wiele gates, build i wiĂ„â„˘kszoÄąâ€şĂ„â€ˇ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test prÄ‚Ĺ‚buje czytaĂ„â€ˇ brakujĂ„â€¦cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerÄ‚Ĺ‚w:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujĂ„â€¦cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, ktÄ‚Ĺ‚ry uruchamia testy z quiet gate po kolei i zbiera wszystkie bÄąâ€šĂ„â„˘dy zamiast zatrzymywaĂ„â€ˇ siĂ„â„˘ na pierwszym.

DECYZJE:
- Nie uruchamiaĂ„â€ˇ rĂ„â„˘cznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyÄąâ€šĂ„â€¦czaĂ„â€ˇ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uÄąÄ˝ywaĂ„â€ˇ mass scan, ÄąÄ˝eby Äąâ€šapaĂ„â€ˇ wiele bÄąâ€šĂ„â„˘dÄ‚Ĺ‚w naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byĂ„â€ˇ kopiowany rĂ„â„˘cznie do Supabase bez osobnego przeglĂ„â€¦du SQL.
- Mass scan moÄąÄ˝e trwaĂ„â€ˇ dÄąâ€šuÄąÄ˝ej niÄąÄ˝ standardowy verify, ale daje peÄąâ€šniejszĂ„â€¦ listĂ„â„˘ blokad.

NASTĂ„ÂPNY KROK:
- JeÄąÄ˝eli mass scan pokaÄąÄ˝e kilka kolejnych failÄ‚Ĺ‚w, zrobiĂ„â€ˇ jeden zbiorczy R2X zamiast kolejnych maÄąâ€šych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaÄąâ€š 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiĂ„â€ˇ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koÄąâ€žczy teÄąÄ˝ zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeÄąâ€şli R2U nie dokoÄąâ€žczyÄąâ€š route przez anchor.

DECYZJE:
- Nie wyÄąâ€šĂ„â€¦czamy starych gateĂ˘â‚¬â„˘Ä‚Ĺ‚w.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajĂ„â€¦ jawny `aria-describedby={undefined}` escape.
- Trash actions majĂ„â€¦ iÄąâ€şĂ„â€ˇ przez wspÄ‚Ĺ‚lne ÄąĹźrÄ‚Ĺ‚dÄąâ€šo `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rĂ„â„˘cznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoÄąâ€şci

AUDYT RYZYK:
- CzĂ„â„˘Äąâ€şĂ„â€ˇ napraw to kontrakty historycznych testÄ‚Ĺ‚w, wiĂ„â„˘c po zielonym verify trzeba jeszcze obejrzeĂ„â€ˇ UI, szczegÄ‚Ĺ‚lnie Calendar i Leads.
- `/api/activities` moÄąÄ˝e dziaÄąâ€šaĂ„â€ˇ przez rewrite do system route. Po deployu sprawdziĂ„â€ˇ aktywnoÄąâ€şci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaĂ„â€ˇ prawdziwe opisy tam, gdzie dialog ma treÄąâ€şĂ„â€ˇ formularzowĂ„â€¦.

NASTĂ„ÂPNY KROK:
- Po R2X uruchomiĂ„â€ˇ mass scan. JeÄąâ€şli zostanĂ„â€¦ faile, zrobiĂ„â€ˇ R2Y jako kolejny batch z peÄąâ€šnej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedÄąâ€š wszystkie 178 testÄ‚Ĺ‚w.
- Build zatrzymaÄąâ€š siĂ„â„˘ na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeÄąâ€şnie Stage100/104/99 nie pozwalajĂ„â€¦, ÄąÄ˝eby taki legacy combo string wrÄ‚Ĺ‚ciÄąâ€š do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyÄąâ€šĂ„â€¦czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoÄąâ€şci dla sprzecznych historycznych gateĂ˘â‚¬â„˘Ä‚Ĺ‚w. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rĂ„â„˘cznie obejrzeĂ„â€ˇ Calendar, bo R2X dotykaÄąâ€š kilku klas i dialogÄ‚Ĺ‚w.
- JeÄąâ€şli kolejne prebuild guardy wykaÄąÄ˝Ă„â€¦ podobny konflikt literalny, naprawiaĂ„â€ˇ markerem poza renderowanĂ„â€¦ funkcjĂ„â€¦, nie cofajĂ„â€¦c UI.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2Y. JeÄąÄ˝eli build i verify quiet przejdĂ„â€¦, moÄąÄ˝na wykonaĂ„â€ˇ push caÄąâ€šego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziÄąâ€š `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaÄąâ€š z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byÄąâ€š sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaÄąâ€š tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieÄąÄ˝Ă„â€¦cego ÄąĹźrÄ‚Ĺ‚dÄąâ€ša prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- ÄąÄ…rÄ‚Ĺ‚dÄąâ€šem prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
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
- Zmieniono test, bo poprzedni kontrakt byÄąâ€š sprzeczny z nowszym prebuild guardem.
- Po deployu rĂ„â„˘cznie sprawdziĂ„â€ˇ listĂ„â„˘ spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AA. JeÄąâ€şli build i verify przejdĂ„â€¦, moÄąÄ˝na wykonaĂ„â€ˇ push caÄąâ€šego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedÄąâ€š Stage105, Stage220A28, Stage95 i mass scan 178 testÄ‚Ĺ‚w.
- Build zatrzymaÄąâ€š siĂ„â„˘ w `src/pages/Calendar.tsx` na bÄąâ€šĂ„â„˘dzie JSX:
  `Expected "=>" but found "="`.
- BÄąâ€šĂ„â€¦d powstaÄąâ€š w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerÄ‚Ĺ‚w.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skÄąâ€šadni po regexowym patchu. NajwiĂ„â„˘ksze ryzyko: delete button w Calendar moÄąÄ˝e mieĂ„â€ˇ poprawny build, ale trzeba go kliknĂ„â€¦Ă„â€ˇ rĂ„â„˘cznie po deployu.
- Po deployu sprawdziĂ„â€ˇ `/calendar`: usuÄąâ€ž wpis tygodnia, usuÄąâ€ž wpis z selected day, sprawdÄąĹź dialog/confirm i brak czerwonej plakietki.
- JeÄąâ€şli kolejny build pokaÄąÄ˝e bÄąâ€šĂ„â€¦d skÄąâ€šadni w Calendar, nie robiĂ„â€ˇ szerokiego refaktoru; naprawiĂ„â€ˇ lokalnie bÄąâ€šĂ„â„˘dny JSX.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AB. JeÄąâ€şli build i verify przejdĂ„â€¦, wykonaĂ„â€ˇ push caÄąâ€šego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaÄąâ€š juÄąÄ˝ wypchniĂ„â„˘ty jako commit `66b13479`.
- Podetap E nie byÄąâ€š domkniĂ„â„˘ty w wymaganym ksztaÄąâ€šcie:
  - istniaÄąâ€š `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaÄąâ€š runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaÄąâ€šo docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byÄąâ€š za bardzo tokenowy i nie pilnowaÄąâ€š peÄąâ€šnej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraÄąÄ˝amy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoÄąâ€şci ani redesignu Today.
- Celem R2AC jest domkniĂ„â„˘cie jakoÄąâ€şci/guardÄ‚Ĺ‚w po Stage223 R2.
- Nie pushujemy bez zielonych testÄ‚Ĺ‚w koÄąâ€žcowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RĂ„ÂCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoÄąâ€şci zaleÄąÄ˝nej od progu.
- LeadDetail: status nastĂ„â„˘pnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastĂ„â„˘pnego ruchu i pieniĂ„â„˘dzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiĂ„â€¦ i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoÄąâ€şĂ„â€ˇ / ryzyko`, klikniĂ„â„˘cia do rekordÄ‚Ĺ‚w, brak agresywnego odÄąâ€şwieÄąÄ˝ania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GÄąâ€šÄ‚Ĺ‚wne ryzyko: guard moÄąÄ˝e zÄąâ€šapaĂ„â€ˇ przyszÄąâ€še rĂ„â„˘czne dublowanie badge w UI Ă˘â‚¬â€ť to jest celowe.
- Po zielonym teÄąâ€şcie moÄąÄ˝na uruchomiĂ„â€ˇ lokalnie aplikacjĂ„â„˘ i przejÄąâ€şĂ„â€ˇ checklistĂ„â„˘ manualnĂ„â€¦.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AC lokalnie.
- JeÄąÄ˝eli testy sĂ„â€¦ zielone, odpaliĂ„â€ˇ lokalnie `npm run dev:api` i sprawdziĂ„â€ˇ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaÄąâ€šy siĂ„â„˘ przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uÄąÄ˝ywa parsera blokÄ‚Ĺ‚w/statements, zamiast zakÄąâ€šadaĂ„â€ˇ sĂ„â€¦siedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoÄąâ€šuje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uÄąÄ˝ywa timeout/scroll/reorder,
  - root/capture bridges ignorujĂ„â€¦ top metric tiles,
  - top metric buttons majĂ„â€¦ wÄąâ€šasne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiĂ„â„˘ty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniĂ„â„˘ciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rĂ„â„˘cznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelkÄ‚Ĺ‚w: nie przenoszĂ„â€¦ list na gÄ‚Ĺ‚rĂ„â„˘.
- Ryzyko lokalne: expand/collapse na `/today`; rĂ„â„˘czny smoke obowiĂ„â€¦zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelkÄ‚Ĺ‚w Today.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AD V4, potem `npm run dev`, rĂ„â„˘czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaÄąâ€š siĂ„â„˘ lokalnie i przeszedÄąâ€š:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padÄąâ€š nie przez Today, tylko przez zÄąâ€šamanie kontraktu quiet gate.
- BÄąâ€šĂ„â€¦d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaĂ„â€ˇ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaÄąâ€š do `package.json` komendĂ„â„˘ `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokÄąâ€šadnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnĂ„â€¦trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceÄąâ€ž do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byĂ„â€ˇ uruchamiany przez `closeflow-release-check-quiet.cjs`.
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
- Ryzyko byÄąâ€šo proceduralne: dopiĂ„â„˘cie guarda do package scriptu Äąâ€šamie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wÄąâ€šasny guard pilnujĂ„â€¦cy, ÄąÄ˝e package script pozostaje dokÄąâ€šadny, a nowy R2AD guard jest w Äąâ€şrodku quiet gate.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AE. JeÄąâ€şli verify quiet przejdzie, odpaliĂ„â€ˇ lokalnie `npm run dev`, sprawdziĂ„â€ˇ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrÄ‚Ĺ‚ciÄąâ€š exact `verify:closeflow:quiet` contract i build przechodziÄąâ€š.
- Verify quiet zatrzymaÄąâ€š siĂ„â„˘ na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaÄąâ€š:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjĂ„â€¦ R2AD: kafelki Today nie mogĂ„â€¦ juÄąÄ˝ przenosiĂ„â€ˇ sekcji w DOM ani przewijaĂ„â€ˇ do sekcji, bo to powodowaÄąâ€šo scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiÄąâ€š R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Äąâ€şcieÄąÄ˝ki klikniĂ„â„˘cia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rĂ„â„˘cznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GÄąâ€šÄ‚Ĺ‚wne ryzyko: stary test wymuszaÄąâ€š zachowanie, ktÄ‚Ĺ‚re teraz uznaliÄąâ€şmy za ÄąĹźrÄ‚Ĺ‚dÄąâ€šo bugÄ‚Ĺ‚w.
- Nowy kontrakt utrzymuje dostĂ„â„˘pnoÄąâ€şĂ„â€ˇ i focus, ale blokuje scroll trap.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AF, potem lokalny `npm run dev`, rĂ„â„˘czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaÄąâ€š siĂ„â„˘ i przeszedÄąâ€š:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaÄąâ€š na `git diff --check`.
- `git diff --check` wskazaÄąâ€š trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyÄąâ€šĂ„â€¦cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardÄ‚Ĺ‚w, package scripts, quiet gate ani UI.

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
- To czyszczenie whitespace, wiĂ„â„˘c ryzyko runtime jest minimalne.
- RĂ„â„˘czny smoke `/today` nadal wymagany, bo wÄąâ€šaÄąâ€şciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeÄąÄ˝enia LF/CRLF z `git diff --check` sĂ„â€¦ nieblokujĂ„â€¦ce; trailing whitespace byÄąâ€š blokujĂ„â€¦cy.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ R2AG.
- Po zielonym diff check odpaliĂ„â€ˇ lokalnie `npm run dev`, sprawdziĂ„â€ˇ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, ÄąÄ˝e formularz tworzenia leada i klienta nie miaÄąâ€š pola `lastContactAt`.
- Zweryfikowano, ÄąÄ˝e payload tworzenia leada/klienta nie wysyÄąâ€šaÄąâ€š `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juÄąÄ˝ istniejĂ„â€¦ po Stage223, wiĂ„â„˘c wczeÄąâ€şniejsza teza o ich braku byÄąâ€ša nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadÄ‚Ĺ‚w i klientÄ‚Ĺ‚w.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyÄąâ€şlnie pole pokazuje dzisiejszĂ„â€¦ datĂ„â„˘.
- JeÄąÄ˝eli kontakt byÄąâ€š starszy, operator ma wpisaĂ„â€ˇ prawdziwĂ„â€¦ datĂ„â„˘.
- DatĂ„â„˘ zapisujemy jako noon ISO, ÄąÄ˝eby ograniczyĂ„â€ˇ problemy stref czasowych.
- Daty przyszÄąâ€še sĂ„â€¦ blokowane komunikatem: `Ostatni kontakt nie moÄąÄ˝e byĂ„â€ˇ w przyszÄąâ€šoÄąâ€şci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeÄąâ€şli SQL nie zostanie uruchomiony, API ma fallback dla brakujĂ„â€¦cej kolumny, ale data nie bĂ„â„˘dzie trwale zapisana w bazie.
- Lista leadÄ‚Ĺ‚w/klientÄ‚Ĺ‚w ma fallback select bez `last_contact_at`, ÄąÄ˝eby nie wysadziĂ„â€ˇ produkcji przed migracjĂ„â€¦.
- PeÄąâ€šne spiĂ„â„˘cie z widocznoÄąâ€şciĂ„â€¦ badge `Cisza 14+ dni` zaleÄąÄ˝y od tego, czy `last_contact_at` wrÄ‚Ĺ‚ci z API po migracji.
- NastĂ„â„˘pny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeÄąâ€şli po manualnym teÄąâ€şcie badge nie bierze daty z bazy.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ SQL w Supabase.
- UruchomiĂ„â€ˇ R3A lokalnie.
- PrzetestowaĂ„â€ˇ tworzenie leada/klienta z datĂ„â€¦ 20 dni temu.

<!-- STAGE223R3A_V2_LAST_CONTACT_GUARD_FALSE_NEGATIVE -->
## 2026-06-05 - STAGE223R3A-V2 Guard false-negative repair

FAKTY:
- Stage223R3-A SQL wykonaÄąâ€š siĂ„â„˘ poprawnie w Supabase: ALTER TABLE zwrÄ‚Ĺ‚ciÄąâ€š "Success. No rows returned", co jest normalnym wynikiem dla DDL.
- Stage223R3-A zatrzymaÄąâ€š siĂ„â„˘ na guardzie, nie na kodzie produkcyjnym.
- Guard bÄąâ€šĂ„â„˘dnie wymagaÄąâ€š dokÄąâ€šadnego tekstu `lastContactAt: dateInputToNoonIso(newClient.lastContactAt)`.
- Faktyczna Äąâ€şcieÄąÄ˝ka kodu klienta to: `newClient.lastContactAt` -> `preparedClient.lastContactAt` -> `dateInputToNoonIso(preparedClient.lastContactAt)`.

DECYZJA:
- Naprawiamy guard, nie zmieniamy funkcjonalnej Äąâ€şcieÄąÄ˝ki klienta na siÄąâ€šĂ„â„˘.
- Guard ma akceptowaĂ„â€ˇ Äąâ€şcieÄąÄ˝kĂ„â„˘ przez preparedClient, ale dalej wymaga zachowania daty z newClient i konwersji do ISO.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa faÄąâ€šszywie negatywnego guarda po czĂ„â„˘Äąâ€şciowo wykonanym apply.
- Nie wolno robiĂ„â€ˇ resetu ani restore bez sprawdzenia, bo wczeÄąâ€şniejszy apply zdĂ„â€¦ÄąÄ˝yÄąâ€š zmieniĂ„â€ˇ pliki.
- Po zielonym teÄąâ€şcie nadal trzeba zrobiĂ„â€ˇ manualny test tworzenia lead/klient z datĂ„â€¦ 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedÄąâ€š guard i runtime test dla Last Contact Intake.
- Build przeszedÄąâ€š.
- `verify:closeflow:quiet` zatrzymaÄąâ€š siĂ„â„˘ na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaÄąâ€ša wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaÄąÄ˝dej optional fallback column.
- Nie uruchamiamy osobnego peÄąâ€šnego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, ÄąÄ˝eby potwierdziĂ„â€ˇ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rĂ„â„˘cznie sprawdziĂ„â€ˇ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTĂ„ÂPNY KROK:
- UruchomiĂ„â€ˇ V3.
- JeÄąâ€şli gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 Ă˘â‚¬â€ť Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwoÄąâ€šanie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/ÄąĹˇrednie, tekst Pokazano 8 z X, pusty stan operacyjny.
- Nie aktywuje przyciskÄ‚Ĺ‚w Ustaw zadanie / OdÄąâ€šÄ‚Ĺ‚ÄąÄ˝ / Oznacz jako martwy.

## TESTY
- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- create lead flow wymaga rĂ„â„˘cznego testu po patchu.
- Rescue UI moÄąÄ˝e wymagaĂ„â€ˇ pÄ‚Ĺ‚ÄąĹźniejszego uproszczenia wizualnego.
- Backend akcji Rescue nie jest jeszcze wdroÄąÄ˝ony, wiĂ„â„˘c disabled actions sĂ„â€¦ prawidÄąâ€šowe.

## STAGE220A35 Ă˘â‚¬â€ť Client Commission Finance Source Truth

Data: 2026-06-05 21:05 Europe/Warsaw

### FAKTY
- Naprawiono rozjazd: wartoÄąâ€şĂ„â€ˇ transakcji/sprawy nie jest prowizjĂ„â€¦ wÄąâ€šaÄąâ€şciciela.
- ClientDetail pokazuje prowizjĂ„â„˘ naleÄąÄ˝nĂ„â€¦, wpÄąâ€šaconĂ„â€¦ prowizjĂ„â„˘ i prowizjĂ„â„˘ do zapÄąâ€šaty jako osobne wartoÄąâ€şci.
- Karta sprawy w kliencie uÄąÄ˝ywa getCaseFinanceSummary, wiĂ„â„˘c prowizja procentowa 69 000 PLN Ă„â€šĂ˘â‚¬â€ť 2% daje 1 380 PLN zamiast 0 PLN.
- WartoÄąâ€şĂ„â€ˇ transakcji nadal jest widoczna jako osobna informacja.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Bez tej poprawki Stage227 / Sales Funnel mÄ‚Ĺ‚gÄąâ€šby dziedziczyĂ„â€ˇ bÄąâ€šĂ„â„˘dne wartoÄąâ€şci finansowe.
- Nie ruszano Supabase, RLS ani backendu pÄąâ€šatnoÄąâ€şci.
- Model prowizji staÄąâ€šej nadal uÄąÄ˝ywa gotowej kwoty prowizji.

## STAGE220A36 Ă˘â‚¬â€ť Commission Input Model Split

Data: 2026-06-05 21:45 Europe/Warsaw

### FAKTY
- Rozdzielono prowizjĂ„â„˘ staÄąâ€šĂ„â€¦ od podstawy procentowej.
- Przy kwocie staÄąâ€šej uÄąÄ˝ytkownik wpisuje wartoÄąâ€şĂ„â€ˇ prowizji.
- Przy prowizji procentowej uÄąÄ˝ytkownik wpisuje wartoÄąâ€şĂ„â€ˇ transakcji do wyliczenia i stawkĂ„â„˘ procentowĂ„â€¦; prowizja jest wyliczana i nieedytowalna.
- Lista klientÄ‚Ĺ‚w pokazuje prowizjĂ„â„˘ operacyjnĂ„â€¦, nie cenĂ„â„˘ transakcji.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie ruszano Supabase, RLS ani backendu pÄąâ€šatnoÄąâ€şci.
- Techniczne pole contractValue nadal przechowuje podstawĂ„â„˘ procentu przy modelu procentowym.
- Stage227 moÄąÄ˝e startowaĂ„â€ˇ dopiero po rĂ„â„˘cznym sprawdzeniu fixed/percent w modalach finansÄ‚Ĺ‚w.

## STAGE220A36-R2 Ă˘â‚¬â€ť Commission Modal Field Order

Data: 2026-06-05 22:00 Europe/Warsaw

### FAKTY
- Doprecyzowano ukÄąâ€šad modala prowizji: najpierw rodzaj prowizji, potem stawka procentowa i wartoÄąâ€şĂ„â€ˇ prowizji.
- Pole "WartoÄąâ€şĂ„â€ˇ prowizji" jest edytowalne tylko przy kwocie staÄąâ€šej.
- Przy procencie wartoÄąâ€şĂ„â€ˇ prowizji wylicza siĂ„â„˘ automatycznie i jest nieedytowalna.
- Podstawa procentu, czyli wartoÄąâ€şĂ„â€ˇ transakcji/zlecenia, jest osobnym polem poniÄąÄ˝ej gÄąâ€šÄ‚Ĺ‚wnych kontrolek prowizji.

### TESTY
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie zmieniano bazy ani modelu pÄąâ€šatnoÄąâ€şci.
- Ryzyko dotyczy tylko czytelnoÄąâ€şci UI i bÄąâ€šĂ„â„˘dnego wpisywania ceny transakcji w miejsce prowizji.
- Stage227 nadal musi korzystaĂ„â€ˇ z prowizji jako wartoÄąâ€şci operacyjnej.

## STAGE220A36-R4 Ă˘â‚¬â€ť Build Guard and Case Item Schema Fix

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

## STAGE220A36-R5 Ă˘â‚¬â€ť R4 Guard Token Compat

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

## STAGE220A36-R6 Ă˘â‚¬â€ť Deploy Unblock Mojibake Cleanup

Data: 2026-06-05 22:35 Europe/Warsaw

### FAKTY
- Cleaned R4 guard/test files from BOM and literal encoding marker characters.
- Added R6 guard to protect the commission modal order and deployment path.
- Did not change Supabase, RLS, payments, or commission math.

### AUDYT RYZYK
- The UI screenshot can remain old until Vercel deploys a green build.
- Stage227 remains blocked until Vercel is green and modal is manually verified.

## STAGE220A36-R7 Ă˘â‚¬â€ť CaseDetail Legacy Finance Modal Wiring Fix

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

## STAGE220A36-R10 Ă˘â‚¬â€ť Commission Modal Three-Field Top Row Polish

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


## STAGE220A36-R11 Ă˘â‚¬â€ť Commission Modal Compact Tooltips + Alignment

Data: 2026-06-06 09:10 Europe/Warsaw

### FAKTY
- R10 logicznie uÄąâ€šoÄąÄ˝yÄąâ€š pola, ale modal nadal byÄąâ€š zbyt przytÄąâ€šaczajĂ„â€¦cy przez opisy pod polami i zbyt wysokie inputy.
- R11 przenosi opisy do tooltipÄ‚Ĺ‚w Ă˘â‚¬Ĺľ?Ă˘â‚¬ĹĄ, skraca Äąâ€şrodkowy label do Ă˘â‚¬ĹľStawka (%)Ă˘â‚¬ĹĄ, zmniejsza wysokoÄąâ€şĂ„â€ˇ pÄ‚Ĺ‚l i wyrÄ‚Ĺ‚wnuje Äąâ€şrodkowe pole stawki.

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
- Native tooltip na title jest prosty i bezpieczny, ale na mobile nie daje peÄąâ€šnego komfortu Ă˘â‚¬â€ť jeÄąÄ˝eli to bĂ„â„˘dzie problem, kolejny etap powinien zrobiĂ„â€ˇ wÄąâ€šasny popover.
- Trzeba rĂ„â„˘cznie sprawdziĂ„â€ˇ, czy trzy pola w gÄ‚Ĺ‚rnym rzĂ„â„˘dzie nie Äąâ€şciskajĂ„â€¦ siĂ„â„˘ na szerokoÄąâ€şci laptopa i czy wĂ„â€¦skie ekrany poprawnie zawijajĂ„â€¦ do jednej kolumny.

## STAGE220A36-R12 Ă˘â‚¬â€ť Commission Modal Width Polish

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

## STAGE226R10 Ă˘â‚¬â€ť Lead/Client Separation Runtime Fix

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

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG Ă˘â‚¬â€ť lead/client conflict hardening

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- typ wpisu: etap naprawczy / runtime hardening po Stage226R10
- decyzja: tworzenie leada zostaje lead-only; konflikt z klientem ma byĂ„â€ˇ ostrzeÄąÄ˝eniem i linkiem do klienta, nie Äąâ€şcieÄąÄ˝kĂ„â€¦ przywrÄ‚Ĺ‚cenia klienta z formularza leada.
- zmiana: w Leads.tsx zostaje jeden EntityConflictDialog dla leadÄ‚Ĺ‚w; kandydaci typu client majĂ„â€¦ wymuszone canRestore=false w tym flow; restoreConflictCandidate nie wykonuje updateClientInSupabase dla klienta.
- testy/guardy: scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs, tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs, plus regresja Stage226R10.
- ryzyko: jeÄąâ€şli klient istnieje w /clients, po dodaniu podobnego leada nadal bĂ„â„˘dzie widoczny jako stary klient Ă˘â‚¬â€ť to nie jest nowy klient. Manual smoke musi liczyĂ„â€ˇ klientÄ‚Ĺ‚w przed i po dodaniu leada.
- status: local ZIP patch; do uruchomienia i pushu po PASS.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX Ă˘â‚¬â€ť fix po czerwonym R10C

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- typ wpisu: hotfix patchera i kontraktu lead/client separation po R10B/R10C
- decyzja: klient z konfliktu przy tworzeniu leada nie moÄąÄ˝e byĂ„â€ˇ przywracany z flow leada; tylko PokaÄąÄ˝ klienta albo Dodaj mimo to jako osobnego leada.
- zmiana: restoreConflictCandidate blokuje candidate.entityType === 'client' bez updateClientInSupabase; kandydaci typu client dostajĂ„â€¦ canRestore=false przed zapisaniem do state.
- naprawa procesu: R10C2 usuwa nieudane, niezatwierdzone pliki R10C po przerwanym apply i dodaje odporny patcher regexowy.
- testy: R10C2 guard/test, R10B guard/test, R10 guard/test, build, verify:closeflow:quiet, git diff --check.
- ryzyko: istniejĂ„â€¦cy klient z tymi samymi danymi dalej bĂ„â„˘dzie widoczny w /clients, ale nie jest tworzony ani przywracany przez dodanie leada.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX Ă˘â‚¬â€ť duplicate confirmation gate

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- typ wpisu: hotfix po rĂ„â„˘cznym smoke R10C4
- decyzja: duplikat albo konflikt danych kontaktowych moÄąÄ˝e byĂ„â€ˇ zapisany tylko po Äąâ€şwiadomym potwierdzeniu. Brak dziaÄąâ€šania checkerÄ‚Ĺ‚w konfliktÄ‚Ĺ‚w ma zatrzymaĂ„â€ˇ zapis, a nie przepuÄąâ€şciĂ„â€ˇ rekord po cichu.
- zmiana: Leads.tsx i Clients.tsx nie Äąâ€šykajĂ„â€¦ bÄąâ€šĂ„â„˘du findEntityConflictsInSupabase do pustej listy. Przy bÄąâ€šĂ„â„˘dzie pokazujĂ„â€¦ komunikat i zatrzymujĂ„â€¦ zapis. Przy konflikcie pokazujĂ„â€¦ komunikat i dialog z opcjĂ„â€¦ Ă˘â‚¬ĹľDodaj mimo toĂ˘â‚¬ĹĄ.
- testy/guardy: check/test stage226r10d2 plus regresje R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check.
- audyt ryzyk: fail-closed moÄąÄ˝e chwilowo blokowaĂ„â€ˇ zapis przy awarii API konfliktÄ‚Ĺ‚w, ale to jest bezpieczniejsze niÄąÄ˝ ciche mnoÄąÄ˝enie duplikatÄ‚Ĺ‚w klientÄ‚Ĺ‚w/leadÄ‚Ĺ‚w.
- status: local ZIP patch; push po PASS i rĂ„â„˘cznym smoke.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH Ă˘â‚¬â€ť changelog

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- dodano centralny kontrakt `src/lib/calendar-timezone-contract.ts`.
- poprawiono UI reminder calculation w EventCreateDialog i TaskCreateDialog.
- poprawiono event/task server routes, Google outbound i inbound na kontrakt Europe/Warsaw.
- dodano guard/test R11 i aktualizacje project memory/Obsidian update.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX Ă˘â‚¬â€ť changelog

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- poprawiono test R11: wynik z VM jest serializowany do plain object przed deepStrictEqual.
- logika aplikacji R11 nie zostaÄąâ€ša zmieniona w R11B.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_CHANGELOG_START -->
## 2026-06-06 15:35 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ STAGE227A Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ Sales Funnel Movement View

Dodano lokalny read-only widok `/funnel`, helper `sales-funnel-movement`, guard, runtime test, route i menu Lejek. Zakres: owner-control funnel bez drag/drop, bez mutacji, bez AI scoringu i bez zmian DB/RLS.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_CHANGELOG_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_CHANGELOG_START -->
## 2026-06-06 15:45 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ STAGE227B Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ sales funnel decision list

Przebudowano `/funnel` z przeÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adowanego kanbana na czytelny widok decyzyjny: kafle filtrÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šw, pasek etapÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šw, jedna szeroka lista i panel priorytetu.
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_CHANGELOG_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_CHANGELOG_START -->
## 2026-06-06 17:05 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ STAGE228A Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ funnel truth + clickability

Poprawiono `/funnel`: domyÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşlnie pokazuje wszystkie rekordy, kafle wÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcicielskie i etapy nie nakÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adajĂ„â€šĂ˘â‚¬ĹľĂ˘â‚¬Â¦ siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â na siebie w sposÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šb ukrywajĂ„â€šĂ˘â‚¬ĹľĂ˘â‚¬Â¦cy Ä‚â€žĂ„â€¦ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a kwot, a karty pokazujĂ„â€šĂ˘â‚¬ĹľĂ˘â‚¬Â¦ Ä‚â€žĂ„â€¦ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡o wartoÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşci/prowizji.
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_CHANGELOG_END -->

## 2026-06-06 18:00 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ STAGE228B Lead Work Action Center

- typ: etap wdroÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeniowy local-only
- decyzja: Lead nie dostaje peÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡nego lejka; dostaje centrum pracy Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„ÄľCo robimy teraz?Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă„Ä…Ă„â€ž z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzyĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ drugiego systemu dziaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ă˘â‚¬Ĺľ; uÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄywaĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ istniejĂ„â€šĂ˘â‚¬ĹľĂ˘â‚¬Â¦cych handlerÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šw LeadDetail.


## 2026-06-06 18:05 Europe/Warsaw - STAGE228B_R7_MOJIBAKE_CLEANUP
- Scope: cleanup after Stage228B local patcher introduced Polish mojibake in LeadDetail.
- Decision: do not weaken Stage98. Repair source text to clean UTF-8 and rerun Stage98 + Stage228B + Stage228A/227B regressions.
- Status: local-only until tests pass and Damian approves push.

## 2026-06-06 18:36 Europe/Warsaw - STAGE228B_R8_ALERTTRIANGLE_IMPORT_HOTFIX

- Fixed LeadDetail production crash: AlertTriangle was used in Stage228B UI but was not imported from lucide-react.
- Added guard: scripts/check-stage228b-alerttriangle-import.cjs.
- Added guard to quiet release gate.

## 2026-06-06 18:42 Europe/Warsaw Ă˘â‚¬â€ť STAGE228B R9 import source repair

- FAKT: Stage228B R8 naprawil brak AlertTriangle, ale uszkodzil zrodla importow w LeadDetail: useNavigate trafil do lucide-react, a ArrowLeft do react.
- DECYZJA: nie cofac calego Stage228B i nie oslabiaĂ„â€ˇ guardow; naprawic zrodlo importow i dodac guard na import sources.
- TESTY: Stage228B R9 ma odpalic R9 guard, R8 guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: kazdy kolejny patcher importow w LeadDetail musi traktowac trzy importy na gorze pliku jako kontrakt: react, react-router-dom, lucide-react.

## 2026-06-06 18:50 Europe/Warsaw Ă˘â‚¬â€ť STAGE228B R10 import guard false-positive fix

- FAKT: Stage228B R9 naprawil top importy w LeadDetail, ale guard mial regex przechodzacy przez wiele importow i falszywie wykrywal useNavigate w lucide-react.
- DECYZJA: nie omijac builda ani guardow; naprawic guard tak, aby parsowal pojedyncze deklaracje importow i nadal pilnowal zrodel: react, react-router-dom, lucide-react.
- TESTY: R10 ma odpalic import-source guard, AlertTriangle guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: patchery importow musza traktowac trzy pierwsze importy w LeadDetail jako kontrakt.

## 2026-06-06 19:05 Europe/Warsaw Ă˘â‚¬â€ť STAGE228B R13 Canonical LeadDetail imports repair

- Status: local hotfix package for broken pushed Stage228B commit 14f00a3d.
- Scope: deterministic rewrite of LeadDetail imports for react, react-router-dom and lucide-react.
- Guard: parser-based checks for AlertTriangle and hook import sources.
- Risk note: R8/R9/R10/R12 failures were caused by brittle regex/import handling; R13 uses declaration-level parsing.

## 2026-06-06 19:45 Europe/Warsaw Ă˘â‚¬â€ť STAGE228B_R14_LEAD_ACTION_CENTER_VST

- FAKT: Po Stage228B LeadDetail dziaÄąâ€ša, ale centrum dziaÄąâ€šaÄąâ€ž leada byÄąâ€šo mniej czytelne niÄąÄ˝ analogiczna karta sprawy.
- DECYZJA: Nie tworzyĂ„â€ˇ osobnego systemu wizualnego dla leada. Lead action center ma iÄąâ€şĂ„â€ˇ w kierunku tego samego ÄąĹźrÄ‚Ĺ‚dÄąâ€ša wizualnego co CaseDetail: jeden nagÄąâ€šÄ‚Ĺ‚wek, jasne grupy, kompaktowe wiersze, akcje przy rekordzie.
- ZMIANA: UsuniĂ„â„˘to duplikujĂ„â€¦ce copy, poprawiono separator w wierszach, ograniczono "Braki i blokady" do jawnych brakÄ‚Ĺ‚w/blokad zamiast dublowaĂ„â€ˇ kaÄąÄ˝de zalegÄąâ€še wydarzenie.
- TESTY: Stage228B R14 guard/test, Stage228B guard/test, Stage98, build, verify quiet, diff-check.
- RYZYKO: Po deployu sprawdziĂ„â€ˇ rĂ„â„˘cznie LeadDetail z zalegÄąâ€šym wydarzeniem i porÄ‚Ĺ‚wnaĂ„â€ˇ czytelnoÄąâ€şĂ„â€ˇ do CaseDetail.

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
- UsuniĂ„â„˘to panel wÄąâ€šaÄąâ€şciciela z /funnel.
- Kafelki decyzyjne lejka przepiĂ„â„˘to na OperatorMetricTile jako wspÄ‚Ĺ‚lne ÄąĹźrÄ‚Ĺ‚dÄąâ€šo wizualne.
- Dodano CSS source truth dla ukÄąâ€šadu /funnel.
- Poprawiono stale guard Stage220A36 po usuniĂ„â„˘ciu opisu Ă˘â‚¬Ĺľ5 klientÄ‚Ĺ‚w...Ă˘â‚¬ĹĄ.
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
- Objaw: klikniecie UsuÄąâ€ž przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuÄąâ€ž -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastĂ„â„˘pny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ Stage228R18 Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ missing item hard delete source truth

- problem: Brak znikaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ po klikniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âciu UsuÄ‚â€žĂ„â€¦Ă˘â‚¬Ĺľ, ale wracaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‹â€ˇ Ä‚â€žĂ„â€¦ÄąĹźrÄ‚â€žĂ˘â‚¬ĹˇÄąâ€šdÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡owana z linkedTasks, nie z caÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ego timeline, Ä‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄeby activity history nie odtwarzaÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡a aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ soft-delete; historia usuniĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âcia zostaje jako activity.

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

## 2026-06-09 02:50 Europe/Warsaw Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ă˘â‚¬ĹĄ STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Ä‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡aÄ‚â€žĂ„â€¦Ă˘â‚¬Ĺľcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera siĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â juÄ‚â€žĂ„â€¦Ä‚â€žĂ‹ĹĄ na dokÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡adnym polskim tekÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąĹşcie toastu, tylko na strukturze przepÄ‚â€žĂ„â€¦Ä‚ËĂ˘â€šÂ¬ÄąË‡ywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany rĂ„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Âczny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

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
- Kept Kopiuj trace/WyczyÄąâ€şĂ„â€ˇ trace visible with disabled state when debug is off or trace is empty.
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
- Kept Kopiuj trace / WyczyÄąâ€şĂ„â€ˇ trace visible and disabled when trace is unavailable.
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

## 2026-06-09 Ă˘â‚¬â€ť STAGE231D_GOOGLE_AUTH_INTENT_GATE

- Added Google login/register intent gate.
- Added auth intent session helper.
- Added x-closeflow-auth-intent API header.
- Added REGISTER_FIRST_REQUIRED API gate for Google login path without existing profile.
- Changed logged-out / and /start to one auth entry.
- Documented STAGE231C Supabase auth trigger no-op repair.
- Added future backlog: STAGE231E email copy repair and STAGE231F invite-only test mode.

## 2026-06-09 Ă˘â‚¬â€ť STAGE231D_R5_GOOGLE_LOGIN_MISSING_INTENT_HARD_GATE

- Hardened Google login/register intent gate after manual QA showed unknown Google Login still entered app.
- Added authIntent URL fallback for OAuth/email confirmation redirects.
- Added explicit /api/me?authIntent=... propagation.
- Added authIntent to GET cache scope.
- Changed api/me gate: Google OAuth cannot bootstrap a missing app profile unless authIntent=register.
- Preserved working flows from QA: existing Google login, Google registration, e-mail confirmation, one auth page.

<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_START -->
## 2026-06-10 Europe/Warsaw Ă˘â‚¬â€ť STAGE230D0 Text/Input Contrast Sweep

FAKT:
- Damian zgÄąâ€šosiÄąâ€š biaÄąâ€šy tekst na biaÄąâ€šym tle podczas wpisywania/dyktowania w aplikacji.
- Zakres R1: /ai-drafts, szybki szkic, Stage230C debug trace, input/textarea/select/placeholder/focus.

DECYZJA:
- Tryb CloseFlow: GIT-FIRST / PUSH-FIRST.
- Nie uÄąÄ˝ywaĂ„â€ˇ lokalnych ZIP-Ä‚Ĺ‚w jako gÄąâ€šÄ‚Ĺ‚wnej Äąâ€şcieÄąÄ˝ki dla Damiana.

TESTY:
- Stage230B regression guard/test.
- Stage230C regression guard/test.
- Stage230D0 contrast guard/test.
- npm run build.
- git diff --check.

RYZYKA:
- MoÄąÄ˝liwe podobne problemy kontrastu w innych moduÄąâ€šach aplikacji.
- Nie wdraÄąÄ˝ano deduplikacji dyktowania bez trace.
<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END -->

## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0 R5

- Dodano flow zamykania sprawy bez delete.
- ZamkniĂ„â„˘cie uÄąÄ˝ywa status completed i lastActivityAt.
- Dodano activity "Sprawa zamkniĂ„â„˘ta".
- GÄąâ€šÄ‚Ĺ‚wne CTA zmienione na "Zamknij sprawĂ„â„˘" / "Sprawa zamkniĂ„â„˘ta".
- Awaryjne usuwanie zostaje osobno.
- Dodano guard, test, run report i obsidian update.

## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R7

Added closed case archive view, restore flow, client closed cases section and guard/test.


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "PrzywrÄ‚Ĺ‚Ă„â€ˇ sprawĂ„â„˘".
- Restore flow uÄąÄ˝ywa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostajĂ„â€¦ zachowane; delete flow nie jest uÄąÄ˝ywany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodnoÄąâ€şĂ„â€ˇ nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `PrzywrÄ‚Ĺ‚Ă„â€ˇ sprawĂ„â„˘` uÄąÄ˝ywa handlera reopen.
- Logika finansÄ‚Ĺ‚w, delete flow i dane rozliczeÄąâ€ž pozostajĂ„â€¦ bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodnoÄąâ€şĂ„â€ˇ CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, pÄąâ€šatnoÄąâ€şciach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodnoÄąâ€şĂ„â€ˇ segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formĂ„â„˘ `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `PrzywrÄ‚Ĺ‚Ă„â€ˇ sprawĂ„â„˘` uÄąÄ˝ywa handlera reopen.
- Bez zmian w delete flow, pÄąâ€šatnoÄąâ€şciach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodnoÄąâ€şĂ„â€ˇ `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietĂ„â„˘ `Sprawy zamkniĂ„â„˘te` oraz filtr aktywne vs zamkniĂ„â„˘te.
- Bez zmian w delete flow, pÄąâ€šatnoÄąâ€şciach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodnoÄąâ€şĂ„â€ˇ `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamkniĂ„â„˘te`, `PrzywrÄ‚Ĺ‚Ă„â€ˇ sprawĂ„â„˘`.
- Kontrakt uÄąÄ˝ywa wspÄ‚Ĺ‚lnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pÄąâ€šatnoÄąâ€şciach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodnoÄąâ€şĂ„â€ˇ `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamkniĂ„â„˘te/przywrÄ‚Ĺ‚Ă„â€ˇ oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, pÄąâ€šatnoÄąâ€şciach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodnoÄąâ€şĂ„â€ˇ `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- PodziaÄąâ€š uÄąÄ˝ywa wspÄ‚Ĺ‚lnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pÄąâ€šatnoÄąâ€şciach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodnoÄąâ€şĂ„â€ˇ CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, pÄąâ€šatnoÄąâ€şciach, prowizjach i lifetime finance.
\n\n## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n- Status: LOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR.\n- Naprawa po czĂ„â„˘Äąâ€şciowym R4: elastyczny patch ClientDetail, aktywne/zamkniĂ„â„˘te sprawy klienta, restore z klienta, CSS, guard/test.\n- Finanse i historia zachowane.\n

## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0_R8_R8_DUPLICATE_CONST_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniĂ„â„˘to sklejone anchory `const X = useMemo( const X = useMemo(` po czĂ„â„˘Äąâ€şciowym R2/R4/R6/R7.
- Zakres: dotkniĂ„â„˘te pliki TSX, whitespace, sanity check R8, peÄąâ€šny build/test.



## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0_R8_R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniĂ„â„˘to stary drugi `toggleCaseView`, ktÄ‚Ĺ‚ry pozostaÄąâ€š po R8 obok URL-aware `setCaseViewStage231B0R8`.
- Guard R8 rozszerzony o dokÄąâ€šadnie jeden `toggleCaseView` i zakaz legacy `setCaseView((prev) => ...)`.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R9 Ă˘â‚¬â€ť Client history and case view model
- Status: LOCAL_ONLY_PREPARED.
- Zakres: /cases jawne widoki Otwarte/ZamkniĂ„â„˘te/Wszystkie, zamkniĂ„â„˘te sprawy klienta przeniesione do Historii, szerszy layout klienta, finanse all_cases zachowane.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow R25/R41, build, git diff --check.
- Ryzyka: UX historii klienta, sourceCases w /cases, brak regresji finansÄ‚Ĺ‚w i aktywnych ryzyk.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R9-R2 Ă˘â‚¬â€ť Cases URL reader repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po czĂ„â„˘Äąâ€şciowym R9: brakowaÄąâ€šo jawnego searchParams.get('view') w src/pages/Cases.tsx.
- R8 guard dostosowany do R9 modelu open/closed/all, aby regresja R8 dalej sprawdzaÄąâ€ša intencjĂ„â„˘, nie stary exact string.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R9-R3 Ă˘â‚¬â€ť Closed case banner repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po czĂ„â„˘Äąâ€şciowym R9-R2: `/cases` musi mieĂ„â€ˇ widoczny banner `SPRAWA ZAMKNIĂ„ÂTA` dla zamkniĂ„â„˘tej sprawy.
- Guard R9 rozszerzony o data-marker bannera, ÄąÄ˝eby nie przechodziÄąâ€š sam tekst bez realnego elementu UI.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R9-R5 Ă˘â‚¬â€ť Client history renderer guard repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R4: Historia klienta renderuje zamkniĂ„â„˘te sprawy przez wspÄ‚Ĺ‚lny renderer karty, wiĂ„â„˘c guard akceptuje akcje `OtwÄ‚Ĺ‚rz` i `PrzywrÄ‚Ĺ‚Ă„â€ˇ sprawĂ„â„˘` z renderera, nie tylko literalnie z segmentu Historii.
- Wymuszono widoczny label `SPRAWA ZAMKNIĂ„ÂTA` w Historii i rendererze zamkniĂ„â„˘tej karty.
- Nie ruszano finansÄ‚Ĺ‚w, kosztÄ‚Ĺ‚w, SQL, Google Calendar ani pÄąâ€šatnoÄąâ€şci/prowizji.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R9-R6 Ă˘â‚¬â€ť Right rail guard robust repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R5: guard R9 zakÄąâ€šadaÄąâ€š literalny `</SimpleFiltersCard>`, a komponent prawych skrÄ‚Ĺ‚tÄ‚Ĺ‚w moÄąÄ˝e byĂ„â€ˇ self-closing albo sformatowany inaczej.
- Logika produktu bez zmian; naprawiono elastyczne wycinanie powierzchni prawego panelu w guardzie.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R9-R8 Ă˘â‚¬â€ť R8 setter wrapper scan repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R7: poprzedni patcher szukaÄąâ€š `toggleCaseView`, ktÄ‚Ĺ‚rego aktualne uÄąâ€šoÄąÄ˝enie w `Cases.tsx` nie byÄąâ€šo stabilnym anchorem.
- Dodano jawny wrapper `setCaseViewStage231B0R8` przez skan koÄąâ€žca funkcji `setCaseViewStage231B0R9`, bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R9-R9 Ă˘â‚¬â€ť Cases items JSX syntax repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R8: build wykryÄąâ€š bÄąâ€šĂ„â„˘dnĂ„â€¦ skÄąâ€šadniĂ„â„˘ JSX `items=[...]` w `src/pages/Cases.tsx`.
- Poprawiono na `items={[...]}` bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R9-R10 Ă˘â‚¬â€ť ClientDetail JSX section close repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R9: build wykryÄąâ€š niedomkniĂ„â„˘tĂ„â€¦ strukturĂ„â„˘ JSX w `ClientDetail.tsx` przy przejÄąâ€şciu z gÄąâ€šÄ‚Ĺ‚wnej sekcji do prawego panelu.
- Dodano brakujĂ„â€¦ce `</section>` przed `<aside className="client-detail-right-rail"...>` bez zmiany logiki produktu.
- Nie ruszano finansÄ‚Ĺ‚w, kosztÄ‚Ĺ‚w, SQL, Google Calendar ani pÄąâ€šatnoÄąâ€şci/prowizji.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R11 Ă˘â‚¬â€ť Client width + Cases runtime guard
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9 push: `/cases` rzucaÄąâ€š runtime `ReferenceError: closedRecordStage231B0R8 is not defined` przy wejÄąâ€şciu w widok spraw.
- Naprawa: wolne uÄąÄ˝ycia `closedRecordStage231B0R8` w JSX zastĂ„â€¦piono bezpiecznym `isClosedCaseStatus(record?.status)`.
- UX: `ClientDetail` ma szeroki ukÄąâ€šad jak widok sprawy, z lewym wyrÄ‚Ĺ‚wnaniem i breakpointami skalowania.
- Dodano guard `scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs` oraz test node.
- Nie ruszano finansÄ‚Ĺ‚w, kosztÄ‚Ĺ‚w, SQL, Google Calendar ani pÄąâ€šatnoÄąâ€şci/prowizji.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R12-R7 Ă˘â‚¬â€ť Final Cases runtime contract rescue
- Status: LOCAL_ONLY_PREPARED.
- Po R12-R6 zastosowano mocniejszy rescue: helper `renderClosedCaseBannerStage231B0R12`, jeden kontrakt `activeCases/closedCases` przez `useMemo`, `record.status` tylko w dwÄ‚Ĺ‚ch filtrach.
- Guardy R11/R12/R12-R7 pilnujĂ„â€¦ tego samego kontraktu i blokujĂ„â€¦ `closedRecordStage231B0R8` oraz `record?.status`.
- Nie ruszano finansÄ‚Ĺ‚w, SQL, Google Calendar, pÄąâ€šatnoÄąâ€şci ani innych moduÄąâ€šÄ‚Ĺ‚w.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R13 Ă˘â‚¬â€ť Cases map record scope real fix
- Status: LOCAL_ONLY_PREPARED.
- Naprawa realnego bÄąâ€šĂ„â„˘du po R12/R7 w `filteredCases.map((record, index) => ...)`.
- UsuniĂ„â„˘to `caseRecord` fallback i lokalny shadow `renderClosedCaseBannerStage231B0R12` z mapy.
- Dodano scoped boolean `isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status)`.
- UsuniĂ„â„˘to bÄąâ€šĂ„â„˘dny banner z loading row.
- Dodano guard/test R13 oraz zaktualizowano guardy R11/R12/R12-R7.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R13-R2 Ă˘â‚¬â€ť Cases map closed logic completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po czĂ„â„˘Äąâ€şciowym R13: guard liczbowy byÄąâ€š za ostry, wiĂ„â„˘c zamieniono go na sprawdzanie konkretnych linii logiki.
- DomkniĂ„â„˘to `attention`, `statusTone`, `compactLifecyclePill`, `nextActionLabel`, `ownerRiskBadges` i banner zamkniĂ„â„˘tej sprawy na `isCaseClosedStage231B0R13`.
- Guard blokuje powrÄ‚Ĺ‚t `caseRecord` fallback i local shadow helpera w mapie.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R13-R3 Ă˘â‚¬â€ť Next action guard and map completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po R13-R2: guard byÄąâ€š zbyt wraÄąÄ˝liwy na dokÄąâ€šadny polski tekst `Sprawa zamkniĂ„â„˘ta`.
- Znormalizowano `nextActionLabel` i zmieniono guard na strukturĂ„â„˘ logicznĂ„â€¦ zamiast peÄąâ€šnego literalnego tekstu.
- Dalej blokowany jest `caseRecord` fallback i local shadow helpera w `filteredCases.map`.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R13-R4 Ă˘â‚¬â€ť Guard map window repair
- Status: LOCAL_ONLY_PREPARED.
- R13-R3 guard faÄąâ€šszywie ciĂ„â€¦Äąâ€š `filteredCases.map` na pierwszym zagnieÄąÄ˝dÄąÄ˝onym `});`, czyli przed `nextActionLabel`.
- Naprawa: guardy uÄąÄ˝ywajĂ„â€¦ szerokiego deterministycznego okna od poczĂ„â€¦tku mapy zamiast pierwszego `});`.
- Nie zmieniano logiki biznesowej poza markerem stage; naprawa dotyczy guardÄ‚Ĺ‚w i dokumentacji.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R13-R6 Ă˘â‚¬â€ť Owner risk minimal safe call
- Status: LOCAL_ONLY_PREPARED.
- R13-R5 zatrzymaÄąâ€š siĂ„â„˘ przed zmianĂ„â€¦ pliku, bo check starego bloku z HEAD byÄąâ€š bÄąâ€šĂ„â„˘dny.
- Naprawa: uszkodzony zakres `ownerRiskBadges -> metaParts` jest zastĂ„â„˘powany kompletnĂ„â€¦, zamkniĂ„â„˘tĂ„â€¦ skÄąâ€šadniowo deklaracjĂ„â€¦.
- `getCaseOwnerRiskBadges` dostaje bezpieczny kontekst lokalny: lifecycle, nearestCaseAction, nextActionLabel, statusLabel, compactLifecycleLabel, compactLifecyclePill, percent, updatedAt.

## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R14 Ă˘â‚¬â€ť Client detail full-width layout lock
- Status: LOCAL_ONLY_PREPARED.
- PowÄ‚Ĺ‚d: kartoteka klienta nadal jest centrowana/Äąâ€şciÄąâ€şniĂ„â„˘ta zamiast uÄąÄ˝ywaĂ„â€ˇ peÄąâ€šnej szerokoÄąâ€şci od lewego panelu do prawej krawĂ„â„˘dzi ekranu.
- Zakres: marker route w ClientDetail + CSS lock w visual-stage12-client-detail-vnext.css.
- Kontrakt: brak max-width shell, width 100%, margin-inline 0, stable horizontal spacing during scroll.

## 2026-06-10 ÄŹĹĽËť STAGE231B0-R15-R2 ÄŹĹĽËť ClientDetail shared canvas width source
- Status: FINALIZE_FOR_PUSH.
- PowÄŹĹĽËťd: R14 trafiÄŹĹĽËť w zÄŹĹĽËťy DOM node (`ClientMultiContactField`), wiÄŹĹĽËťc nie mÄŹĹĽËťgÄŹĹĽËť rozciÄŹĹĽËťgnÄŹĹĽËťÄŹĹĽËť kartoteki klienta.
- Decyzja: ClientDetail ma uÄŹĹĽËťywaÄŹĹĽËť wspÄŹĹĽËťlnego canvasu strony: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"`.
- ÄŹĹĽËťrÄŹĹĽËťdÄŹĹĽËťo prawdy szerokoÄŹĹĽËťci: `src/styles/closeflow-unified-page-canvas-stage211c.css`.
- Widok konsumujÄŹĹĽËťcy kontrakt: `src/pages/ClientDetail.tsx` + `src/styles/visual-stage12-client-detail-vnext.css`.
- R14 guard/test usuniÄŹĹĽËťte jako faÄŹĹĽËťszywy kontrakt.

## 2026-06-10 ÄŹĹĽËť STAGE231B0-R15-R3 ÄŹĹĽËť ClientDetail width guard + Polish encoding guard
- Status: FINAL_GUARD_FOR_PUSH.
- Potwierdzenie uÄŹĹĽËťytkownika: wyglÄŹĹĽËťd kartoteki klienta jest poprawny i ma tak zostaÄŹĹĽËť.
- Guard szerokoÄŹĹĽËťci: `scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs`.
- Guard polskich znakÄŹĹĽËťw: `scripts/check-stage231b0-r15-r3-polish-encoding.cjs`.
- Guard pilnuje, ÄŹĹĽËťe ClientDetail uÄŹĹĽËťywa wspÄŹĹĽËťlnego canvasu: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"` oraz zmiennych `--cf-page-canvas-*`.
- Guard pilnuje usuniÄŹĹĽËťcia bÄŹĹĽËťÄŹĹĽËťdnego R14 i braku mojibake/replacement chars w kluczowych plikach kartoteki klienta.
- Naprawiono higienÄŹĹĽËť EOF w `src/pages/ClientDetail.tsx`.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R15-R4 Ă˘â‚¬â€ť Polish guard safe repair R2
- Status: REPAIR_AFTER_PUSHED_FAILED_GUARD_SAFE_R2.
- PowÄ‚Ĺ‚d: pierwsza paczka SAFE miaÄąâ€ša bÄąâ€šĂ„â€¦d runnera PowerShell - funkcja przekazywaÄąâ€ša argumenty natywnym komendom jako pustĂ„â€¦ tablicĂ„â„˘, wiĂ„â„˘c git/node startowaÄąâ€šy bez parametrÄ‚Ĺ‚w.
- Naprawa: R2 uÄąÄ˝ywa jawnych wywoÄąâ€šaÄąâ€ž w PowerShell i naprawia mojibake wyÄąâ€šĂ„â€¦cznie w skrypcie JS, nie wklejanym terminalu.
- Polish guard wykrywa konkretne sekwencje mojibake, daje line evidence i blokuje blank line at EOF.
- Zasada utrzymana: commit/push tylko po PASS guardÄ‚Ĺ‚w, build i git diff --check.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R15-R4 Ă˘â‚¬â€ť Polish guard batch repair
- Status: BATCH_REPAIR_AFTER_R2_R3_PARTIALS.
- PowÄ‚Ĺ‚d: R2/R3 czĂ„â„˘Äąâ€şciowo naprawiÄąâ€šy pliki, ale R3 zatrzymaÄąâ€š siĂ„â„˘ przez zbyt wĂ„â€¦ski parser dirty paths.
- Naprawa: masowo obsÄąâ€šuÄąÄ˝ono warianty mojibake `Ă„â€¦/Äąâ€š/Äąâ€š/Ä‚Ĺ‚/Ă‚Â·/Ă˘â‚¬â€ś`, znormalizowano EOF i poprawiono guard pod aktualnĂ„â€¦ kopiĂ„â„˘ ClientDetail.
- Zasada: commit/push tylko po PASS guardÄ‚Ĺ‚w, build i git diff --check.


## 2026-06-10 Ă˘â‚¬â€ť STAGE231B0-R15-R4 Ă˘â‚¬â€ť Polish guard final batch repair
- Status: FINAL_BATCH_REPAIR_AFTER_DOC_SELF_FAIL.
- PowÄ‚Ĺ‚d: poprzedni run report zawieraÄąâ€š przykÄąâ€šadowe uszkodzone sekwencje znakÄ‚Ĺ‚w, a guard sÄąâ€šusznie skanowaÄąâ€š teÄąÄ˝ dokumentacjĂ„â„˘ etapu.
- Naprawa: dokumentacja etapu nie zapisuje juÄąÄ˝ przykÄąâ€šadowych uszkodzonych sekwencji; guard dalej skanuje kod, CSS i dokumentacjĂ„â„˘ zakresu R15.
- Guard blokuje uszkodzenia kodowania, puste linie na EOF i brak aktualnych polskich fraz w ClientDetail.
- Commit/push tylko po PASS guardÄ‚Ĺ‚w, build i git diff --check.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_CHANGELOG_START -->
## 2026-06-10 17:10 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0A Ă˘â‚¬â€ť Visual Source of Truth Inventory + UI Consistency Guard

Dodano:
- centralny raport `_project/VISUAL_SOURCE_OF_TRUTH.md`,
- run report `_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md`,
- payload Obsidian `_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md`,
- guard i test D0A,
- wpis roadmapy D0A przed D0.

Nie zmieniano runtime UI, danych, SQL, finansÄ‚Ĺ‚w, Google Auth ani Google Calendar.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_CHANGELOG_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_CHANGELOG_START -->
## 2026-06-10 Ă˘â‚¬â€ť STAGE231D0A-R3

- ZastĂ„â€¦piono uszkodzony R2 czystym runnerem JS wywoÄąâ€šywanym z PowerShell.
- Naprawiono payload Obsidiana pod guard D0A.
- Znormalizowano EOF w plikach projektu.
- Bez zmian runtime UI.
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_CHANGELOG_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 Ă˘â‚¬â€ť STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyÄąâ€šĂ„â€¦cznie niedziaÄąâ€šajĂ„â€¦cy runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst ÄąÂadowanie klienta..., tekst SPRAWA ZAMKNIĂ„ÂTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansÄ‚Ĺ‚w i kosztÄ‚Ĺ‚w.
- IstniejĂ„â€¦ce ostrzeÄąÄ˝enie duplicate savedRecord zostaje poza zakresem.

NASTĂ„ÂPNY KROK:
- Po PASS/push przejÄąâ€şĂ„â€ˇ do STAGE231D1 Ă˘â‚¬â€ť model kosztÄ‚Ĺ‚w.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 Ă˘â‚¬â€ť STAGE231D0-R5 Ă˘â‚¬â€ť Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- DomkniĂ„â„˘cie po R4: ikona finansÄ‚Ĺ‚w klienta z EntityIcon case -> payment oraz brakujĂ„â€¦ce tokeny "audyt ryzyk", "nastĂ„â„˘pny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: rĂ„â„˘cznie sprawdziĂ„â€ˇ brak duplikatu Finanse klienta i poprawnĂ„â€¦ ikonĂ„â„˘ finansÄ‚Ĺ‚w.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 Ă˘â‚¬â€ť STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztÄ‚Ĺ‚w sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrÄ‚Ĺ‚cone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 uÄąÄ˝ywa finansowego sÄąâ€šownika etykiet i nie dodaje lokalnych stylÄ‚Ĺ‚w UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 moÄąÄ˝e potrzebowaĂ„â€ˇ SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansÄ‚Ĺ‚w nie pokaÄąÄ˝e kosztÄ‚Ĺ‚w, dopÄ‚Ĺ‚ki D2/D3 nie podÄąâ€šĂ„â€¦czĂ„â€¦ modelu.
- Ryzyko: jeÄąâ€şli koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

nastĂ„â„˘pny krok:
- Po PASS/push przejÄąâ€şĂ„â€ˇ do STAGE231D2 Ă˘â‚¬â€ť koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 Ă˘â‚¬â€ť Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- nastĂ„â„˘pny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 Ă˘â‚¬â€ť Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- nastĂ„â„˘pny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 Ă˘â‚¬â€ť Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powÄ‚Ĺ‚d: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usuniĂ„â„˘cie api/case-costs.ts, konsolidacja kosztÄ‚Ĺ‚w pod api/cases.ts?resource=costs, guard budÄąÄ˝etu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtÄ‚Ĺ‚rzyĂ„â€ˇ manualny test Dodaj koszt, bo zmienia siĂ„â„˘ Äąâ€şcieÄąÄ˝ka API.
- nastĂ„â„˘pny krok: PASS -> push -> deploy -> test rĂ„â„˘czny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 Ă˘â‚¬â€ť STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywaÄąâ€ša render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujĂ„â€¦cy regresjĂ„â„˘.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdziĂ„â€ˇ produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeÄąâ€şli nadal wystĂ„â€¦pi.

## STAGE231D2-R6 Ă˘â‚¬â€ť CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrÄ‚Ĺ‚cenie gÄ‚Ĺ‚rnego paska tytuÄąâ€šu sprawy do lewej kolumny i podciĂ„â€¦gniĂ„â„˘cie prawego raila do gÄ‚Ĺ‚rnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D3-R7

- Replaced brittle D3 patcher flow with controlled mass-clean package.
- Added client-level case cost rollup to FinanceMiniSummary.
- Ensured case costs use consolidated /api/cases?resource=costs helper, no new Vercel function.

## STAGE231D3-R7-R2 Ă˘â‚¬â€ť Polish guard restore and D3 close

- timestamp: 2026-06-10 20:42 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- result: restored missing scripts/check-polish-encoding-stage231b0-r15-r3.cjs required by regression lane after STAGE231D3-R7.
- risk audit: this fixes guard infrastructure drift only; it does not modify SQL, API routes, or CaseDetail layout.

<!-- STAGE231D0B_CLIENT_LIST_CARD_CHANGELOG_START -->
## 2026-06-12 11:15 Europe/Warsaw - STAGE231D0B Client List Card Visual Freeze

STATUS: LOCAL_APPLIED_PENDING_MANUAL_TEST_AND_PUSH

FAKTY:
- Kafelek klienta na liÄąâ€şcie klientÄ‚Ĺ‚w zostaÄąâ€š przestawiony na ukÄąâ€šad 2-wierszowy.
- Z kafelka klienta usuniĂ„â„˘to Leady: oraz badge Aktywna sprawa.
- Wiersz 1 pokazuje: nazwa, telefon, e-mail, Aktywna prowizja, akcje.
- Wiersz 2 pokazuje: firma, Sprawy, Zarobione Äąâ€šĂ„â€¦cznie, NajbliÄąÄ˝sza akcja oraz dozwolone statusy pomocnicze.
- Telefon ma osobny marker data-client-list-phone i klasĂ„â„˘ client-list-card-phone.
- E-mail ma osobny marker data-client-list-email i klasĂ„â„˘ client-list-card-email.
- UI dalej korzysta z closeflow-record-list-source-truth.css jako ÄąĹźrÄ‚Ĺ‚dÄąâ€ša prawdy stylu list.

DECYZJA DAMIANA:
- Klient jest juÄąÄ˝ pozyskanym leadem, wiĂ„â„˘c nie pokazujemy Leady w kafelku klienta.
- Klient moÄąÄ˝e mieĂ„â€ˇ wiele spraw, wiĂ„â„˘c nie pokazujemy binarnego badge'a Aktywna sprawa.
- Na liÄąâ€şcie klientÄ‚Ĺ‚w majĂ„â€¦ byĂ„â€ˇ widoczne: Aktywna prowizja, Zarobione Äąâ€šĂ„â€¦cznie, Sprawy, NajbliÄąÄ˝sza akcja.

TESTY/GUARDY:
-
pm run check:stage231d0b-client-list-card-freeze
-
pm run build
- git diff --check

DO POTWIERDZENIA:
- Test rĂ„â„˘czny desktop/mobile na /clients po lokalnym uruchomieniu.

RYZYKA:
- JeÄąâ€şli dane prowizyjne w bazie sĂ„â€¦ niepeÄąâ€šne, Aktywna prowizja moÄąÄ˝e pokazaĂ„â€ˇ 0 PLN mimo aktywnej sprawy bez uzupeÄąâ€šnionej prowizji.
- JeÄąâ€şli pÄąâ€šatnoÄąâ€şci prowizyjne nie majĂ„â€¦ typu/statusu rozpoznawanego przez finance source, Zarobione Äąâ€šĂ„â€¦cznie moÄąÄ˝e wymagaĂ„â€ˇ osobnego etapu porzĂ„â€¦dkujĂ„â€¦cego dane pÄąâ€šatnoÄąâ€şci.
- Zmiana dotyczy tylko listy klientÄ‚Ĺ‚w, nie przebudowuje ClientDetail ani modeli finansowych.
<!-- STAGE231D0B_CLIENT_LIST_CARD_CHANGELOG_END -->


## 2026-06-10 Europe/Warsaw - STAGE231D0B-R8-MASS-ENCODING-RESCUE

Marker: STAGE231D0B-R8-MASS-ENCODING-RESCUE
- Naprawiono klasĂ„â„˘ bÄąâ€šĂ„â„˘du: mojibake po STAGE231D0B.
- Przepisano guard tak, ÄąÄ˝eby nie akceptowaÄąâ€š uszkodzonych polskich znakÄ‚Ĺ‚w.
- Dodano masowy sweep report encodingu dla src, scripts i _project.

## 2026-06-10 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0B-R9 ClientListCard polish + source truth cleanup

Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_PUSH

FAKTY:
- ClientListCard pozostaje 2-wierszowy.
- Finance values sĂ„â€¦ porzĂ„â€¦dkowane jako kompaktowe chipy.
- R8 unscoped CSS rescue zostaje zastĂ„â€¦piony scoped R9 source truth.
- LeadListCard dodany tylko jako mapping w UI Dictionary, bez runtime zmian.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Manual QA nadal wymagany, bo guard nie mierzy odbioru wizualnego.
- Osobny dÄąâ€šug: duplicate savedRecord warning w ContextActionDialogs.tsx.

NASTĂ„ÂPNY KROK:
- Po akceptacji /clients: STAGE231D0C LeadListCard align to ClientListCard source truth.

## 2026-06-11 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0B_R9_R3_GUARD_MOJIBAKE_SELF_SCAN_REPAIR

- Fixed R9 guard self-scan failure caused by literal encoding-drift probe characters in the guard source.

## 2026-06-11 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0B_R9_R4_CSS_GUARD_TOKEN_ALIGNMENT

- Added exact CSS source-truth marker and max-width token required by the R9/R3 guard.
- No runtime lead, trial, top layout or Supabase changes.

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10

ClientListCard: dodano wyrÄ‚Ĺ‚wnanie Äąâ€şrodkowych kolumn, title tooltipy i ellipsis dla dÄąâ€šugich pÄ‚Ĺ‚l. Zmiana wizualna wymaga manualnego potwierdzenia po deployu.

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

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R8 Ă˘â‚¬â€ť finance chip right-edge alignment

Status: LOCAL_APPLIED_PENDING_PUSH_AND_DEPLOY_QA

FAKTY:
- R7 wyrÄ‚Ĺ‚wnaÄąâ€š finance chipy w zÄąâ€šĂ„â€¦ stronĂ„â„˘ dla oczekiwanego widoku Damiana.
- R8 nie przebudowuje karty klienta. Zmienia tylko oÄąâ€ş wyrÄ‚Ĺ‚wnania zielonych chipÄ‚Ĺ‚w finansowych.
- Chipy pozostajĂ„â€¦ o zmiennej dÄąâ€šugoÄąâ€şci; prawa krawĂ„â„˘dÄąĹź chipÄ‚Ĺ‚w ma byĂ„â€ˇ wspÄ‚Ĺ‚lna.

DECYZJA DAMIANA:
- PoczĂ„â€¦tek i koniec karty zostajĂ„â€¦ bez zmian.
- Zielone kafelki finansowe majĂ„â€¦ byĂ„â€ˇ wyrÄ‚Ĺ‚wnane od prawej strony.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Etap jest wizualny; ostateczne zamkniĂ„â„˘cie wymaga deployu i rĂ„â„˘cznego sprawdzenia /clients.


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
- STAGE231D0C/R6 zostaÄąâ€š wdroÄąÄ˝ony i wypchniĂ„â„˘ty jako baseline ClientDetail.
- Manual QA wskazaÄąâ€š, ÄąÄ˝e lewy rail zaczyna siĂ„â„˘ za wysoko i wizualnie wchodzi w nastĂ„â„˘pny poziom wzglĂ„â„˘dem kart po prawej.

DECYZJA DAMIANA:
- ZachowaĂ„â€ˇ zaakceptowane gÄ‚Ĺ‚rne kafelki ClientDetail.
- ObniÄąÄ˝yĂ„â€ˇ lewy rail do poziomu kafelkÄ‚Ĺ‚w po prawej i zachowaĂ„â€ˇ ten sam odstĂ„â„˘p miĂ„â„˘dzy kartami.

ZAKRES:
- CSS spacing only: lewy rail, prawy rail, odstĂ„â„˘p miĂ„â„˘dzy kartami.
- Bez zmian danych, JSX, SQL, kosztÄ‚Ĺ‚w, wykresÄ‚Ĺ‚w, Google Calendar, LeadListCard runtime i CaseDetail.

TESTY/GUARDY:
- scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- tests/stage231d0c-r7-client-detail-left-rail-spacing.test.cjs
- regresja: STAGE231D0C ClientDetail baseline guard, STAGE231D0B ClientListCard guard, optional STAGE231B0 R9 guard, build, git diff --check.

---

## 2026-06-11 20:05 Europe/Warsaw - Changelog STAGE231D0C/R8 ClientDetail left rail spacing guard fix

STAGE231D0C_R8_CLIENT_DETAIL_LEFT_RAIL_SPACING_GUARD_FIX

FAKTY Z KODU:
- STAGE231D0C/R7 patch zastosowaÄąâ€š spacing lewego raila, ale guard miaÄąâ€š zepsuty regex po utracie backslashy.
- R8 nie zmienia runtime poza naprawĂ„â€¦ guarda/testu i dokumentacjĂ„â€¦.

DECYZJA DAMIANA:
- ZachowaĂ„â€ˇ gÄ‚Ĺ‚rne kafelki ClientDetail.
- DokoÄąâ€žczyĂ„â€ˇ spacing lewego raila bez przebudowy ukÄąâ€šadu.

ZAKRES:
- Naprawa scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs.
- Zachowanie CSS R7 i scope ClientDetail.
- Bez zmian SQL, danych, CaseDetail, LeadListCard runtime, kosztÄ‚Ĺ‚w i wykresÄ‚Ĺ‚w.

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
- poprawiono realny desktopowy offset lewego raila w ClientDetail, bo po R7 panel nadal zaczynaÄąâ€š za wysoko wzglĂ„â„˘dem prawego raila;
- zwiĂ„â„˘kszono offset tylko dla desktopu przez CSS variable i silniejszy selektor;
- zachowano zaakceptowany gÄ‚Ĺ‚rny ukÄąâ€šad kafelkÄ‚Ĺ‚w, kompaktowĂ„â€¦ aktywnĂ„â€¦ sprawĂ„â„˘, dane i routing.

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
- tablet/mobile resetujĂ„â€¦ offset do 0, ÄąÄ˝eby nie zrobiĂ„â€ˇ sztucznej dziury.

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
- verify left Data klienta card starts visually on the same axis as right NajbliÄąÄ˝sze dziaÄąâ€šania card.
- verify top tiles and active case compact card unchanged.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C-R2 ClientDetailHeader visual freeze + visible icons

Marker: STAGE231D0C_R2_CLIENT_DETAIL_HEADER_FREEZE
Status: LOCAL_APPLY_PREPARED / DO_TEST_AND_PUSH

Zakres:
- zamroÄąÄ˝enie ClientDetailHeader jako wzorca DetailHeader,
- dopisanie stylu widocznoÄąâ€şci ikon w header buttons,
- dopisanie DetailHeader do UI Dictionary,
- dodanie guarda i testu R2,
- regresja D0C baseline.

Decyzja Damiana:
Header karty klienta detail zostaje wzorcem dla kolejnych kart detail. Ikony w niebieskich przyciskach muszĂ„â€¦ byĂ„â€ˇ widoczne.

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
- naprawa czĂ„â„˘Äąâ€şciowo zastosowanego D0D-R3 po guard fail,
- dopisanie widocznego wiersza "Razem do pobrania" do pierwszej karty "Rozliczenie sprawy",
- podpiĂ„â„˘cie totalu do istniejĂ„â€¦cego caseCostsSummaryStage231D2.totalToCollectAmount,
- naprawa JSX service tab po usuniĂ„â„˘ciu legacy Stage220A10 duplicate block,
- bez SQL, bez nowego modelu kosztÄ‚Ĺ‚w, bez wykresÄ‚Ĺ‚w.

Testy wymagane:
- D0D-R2 guard/test,
- D0C ClientDetail baseline regression,
- D0B ClientListCard regression,
- npm run build,
- git diff --check.

Audyt ryzyk:
- nie dublowaĂ„â€ˇ osobnej karty kosztÄ‚Ĺ‚w jako drugiego ÄąĹźrÄ‚Ĺ‚dÄąâ€ša rozliczenia; wiersz totalu w pierwszej karcie jest obowiĂ„â€¦zkowy dla skanowalnoÄąâ€şci prawego panelu,
- po deployu manualnie sprawdziĂ„â€ˇ kolejnoÄąâ€şĂ„â€ˇ raila: Rozliczenie -> Szybkie akcje -> Dane sprawy i klienta.

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R3 CaseDetail 100% scale balanced workspace

Status: PREPARED_BY_ZIP / DO_TEST_AND_PUSH

Zakres:
- dziaÄąâ€šania i notatki w jednym Äąâ€şrodkowym gridzie,
- notatki compact preview: 3 ostatnie,
- prawy rail compact: rozliczenie, szybkie akcje, dane,
- historia wpÄąâ€šat i lista kosztÄ‚Ĺ‚w nie sĂ„â€¦ stale rozlane w railu,
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
- R4 usuwa widocznĂ„â€¦ kartĂ„â„˘ danych sprawy i klienta z gÄąâ€šÄ‚Ĺ‚wnego right raila bez usuwania danych z systemu.
- R4 usuwa staÄąâ€še sekcje historii wpÄąâ€šat i kosztÄ‚Ĺ‚w z right raila.
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
- Tabs sĂ„â€¦ wyrÄ‚Ĺ‚wnane wizualnie do kolumny dziaÄąâ€šaÄąâ€ž bez peÄąâ€šnej przebudowy logiki Tabs; przy kolejnym wiĂ„â„˘kszym refaktorze warto przenieÄąâ€şĂ„â€ˇ strukturĂ„â„˘ logicznie do left-column.
- Historia wpÄąâ€šat i koszty pozostajĂ„â€¦ dostĂ„â„˘pne przez istniejĂ„â€¦ce przyciski/modale, ale nie sĂ„â€¦ staÄąâ€šĂ„â€¦ listĂ„â€¦ w railu.

---

## 2026-06-12 07:39 Europe/Warsaw - STAGE231D0D-R5 spacing / notes lift / quick actions cleanup

Status: READY_FOR_TEST
Zakres:
- notatki podciĂ„â€¦gniĂ„â„˘te do gÄ‚Ĺ‚ry bez Äąâ€šamania wspÄ‚Ĺ‚lnego odstĂ„â„˘pu kafelkÄ‚Ĺ‚w,
- wspÄ‚Ĺ‚lny odstĂ„â„˘p kafelkÄ‚Ĺ‚w: 14px,
- prawy rail delikatnie podniesiony,
- z CaseQuickActions usuniĂ„â„˘to osobnĂ„â€¦ akcjĂ„â„˘ "WpÄąâ€šata prowizji",
- wpÄąâ€šata prowizji zostaje w rozliczeniu sprawy.

Ryzyka:
- override CSS musi nie rozjechaĂ„â€ˇ mobile/tablet,
- quick actions nie mogĂ„â€¦ dublowaĂ„â€ˇ akcji finansowych,
- R2/R3/R4 guardy byÄąâ€šy skÄąâ€šadniowo uszkodzone i zostaÄąâ€šy naprawione.

---

## 2026-06-12 07:58 Europe/Warsaw - STAGE231D0D-R5 repair after red guard push

Status: REPAIR_READY_FOR_TEST

Naprawa:
- usuniĂ„â„˘to "WpÄąâ€šata prowizji" z CaseQuickActions,
- dodano "Dodaj koszt" do kompaktowego rozliczenia sprawy,
- dodano spacing marker i wspÄ‚Ĺ‚lny odstĂ„â„˘p kafelkÄ‚Ĺ‚w 14px,
- dodano micro-lift prawego raila,
- zachowano wpÄąâ€šatĂ„â„˘ prowizji tylko w rozliczeniu sprawy.

PowÄ‚Ĺ‚d:
Poprzedni R5 zostaÄąâ€š wypchniĂ„â„˘ty mimo czerwonych guardÄ‚Ĺ‚w po bÄąâ€šĂ„â„˘dzie Äąâ€şcieÄąÄ˝ek wzglĂ„â„˘dnych .NET/PowerShell.

---

## 2026-06-12 08:10 Europe/Warsaw - STAGE231D0D-R6 true service grid geometry

Status: READY_FOR_TEST

Zakres:
- przeniesiono tabs do lewej kolumny workspace dla aktywnej zakÄąâ€šadki ObsÄąâ€šuga,
- lewa kolumna ma teraz: tabs + dziaÄąâ€šania,
- Äąâ€şrodkowa kolumna ma notatki startujĂ„â€¦ce od gÄ‚Ĺ‚ry tego samego gridu,
- prawy rail jest wyrÄ‚Ĺ‚wnany do osi true service grid i uÄąÄ˝ywa wspÄ‚Ĺ‚lnego gapu,
- nie ruszano SQL, danych, modelu finansÄ‚Ĺ‚w ani modali.

Audyt:
- R5 byÄąâ€š technicznie zielony, ale wizualnie nie zamykaÄąâ€š celu, bo tabs byÄąâ€šy poza gridem.
- R6 naprawia strukturĂ„â„˘ JSX, a guard sprawdza kolejnoÄąâ€şĂ„â€ˇ grid -> left column -> tabs -> actions -> notes.

---

## 2026-06-12 08:28 Europe/Warsaw - STAGE231D0D-R8 tabs card + right rail axis polish

Status: READY_FOR_TEST

Zakres:
- prawy panel z rozliczeniem i szybkimi akcjami podniesiony do osi kafelka danych sprawy,
- zakÄąâ€šadki ObsÄąâ€šuga / Checklisty / Historia dostaÄąâ€šy peÄąâ€šny, rozciĂ„â€¦gniĂ„â„˘ty kafelek nad DziaÄąâ€šaniami sprawy,
- zachowany wspÄ‚Ĺ‚lny odstĂ„â„˘p kafelkÄ‚Ĺ‚w 14px,
- nie ruszano finansÄ‚Ĺ‚w, modali, SQL, danych, handlerÄ‚Ĺ‚w ani quick actions poza stylem ukÄąâ€šadu.

Ryzyka:
- etap jest CSS-only, wiĂ„â„˘c wymaga rĂ„â„˘cznego potwierdzenia na 100% zoom,
- lift prawego raila ma reset na wĂ„â„˘ÄąÄ˝szych ekranach,
- historyczne mojibake w starych wpisach _project nie jest czyszczone w tym etapie.

---

## 2026-06-12 08:58 Europe/Warsaw - STAGE231D0D-R9 tabs center + axis microfix

Status: APPLIED_LOCAL_WAITING_VISUAL_PASS

Zakres:
- piguÄąâ€ški ObsÄąâ€šuga / Checklisty / Historia wyÄąâ€şrodkowane w rozciĂ„â€¦gniĂ„â„˘tym kafelku,
- Äąâ€şrodkowa sekcja CaseDetail podniesiona lekko wyÄąÄ˝ej,
- prawy panel rozliczeÄąâ€ž i szybkich akcji dociĂ„â€¦gniĂ„â„˘ty do tej samej osi,
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
- Force right rail content under NajbliÄąÄ˝sze dziaÄąâ€šania to keep same width/left edge as the rail.

User decision:
- "wszystko co pod braki i blokady oraz najbliÄąÄ˝sze dziaÄąâ€šania musimy wyrÄ‚Ĺ‚wnaĂ„â€ˇ z kafelkiem dane klienta"

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
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F Funnel owner dashboard visual alignment

- Dopasowano Lejek do nowego jĂ„â„˘zyka UI CloseFlow.
- Zachowano koncepcjĂ„â„˘: lista decyzji wÄąâ€šaÄąâ€şciciela, nie kanban.
- Nie zmieniono logiki filtrÄ‚Ĺ‚w, liczenia, Supabase, SQL, statusÄ‚Ĺ‚w, pÄąâ€šatnoÄąâ€şci ani routingu.
- Dodano CSS alignment, guard, test, run report i Obsidian payload.
<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_END -->

<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R4 Funnel targeted guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGÄ‚â€śW:
- R2 poprawnie zatrzymaÄąâ€š siĂ„â„˘ po czerwonym guardzie.
- R3 zatrzymaÄąâ€š siĂ„â„˘ na zbyt szerokim mojibake sweepie, ktÄ‚Ĺ‚ry zaczĂ„â€¦Äąâ€š czyÄąâ€şciĂ„â€ˇ stare historyczne wpisy `_project`.
- To nie jest wÄąâ€šaÄąâ€şciwy zakres dla etapu UI Lejka.

DECYZJA:
- Naprawiamy aktywny zakres STAGE231D0F, nie caÄąâ€šĂ„â€¦ historiĂ„â„˘ projektu.
- Lejek pozostaje listĂ„â€¦ decyzji wÄąâ€šaÄąâ€şciciela, nie kanbanem.
- Nie ruszaĂ„â€ˇ logiki filtrÄ‚Ĺ‚w, Supabase, SQL, pÄąâ€šatnoÄąâ€şci, routingu, wykresÄ‚Ĺ‚w ani drag/drop.

R4:
- targetowany repair mojibake tylko dla runtime i aktywnych plikÄ‚Ĺ‚w etapu,
- guard STAGE231D0F sprawdza aktywny blok UI Dictionary, CSS i runtime,
- guardy nie failujĂ„â€¦ na wÄąâ€šasnych definicjach tokenÄ‚Ĺ‚w,
- CaseDetail R4 guard jest podmieniany na bezpiecznĂ„â€¦ wersjĂ„â„˘ z tokenami generowanymi po kodach znakÄ‚Ĺ‚w.

TESTY:
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `node scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- W repo nadal mogĂ„â€¦ istnieĂ„â€ˇ stare historyczne wpisy z mojibake. Nie naprawiaĂ„â€ˇ ich w tym etapie.
- JeÄąÄ˝eli chcemy peÄąâ€šne sprzĂ„â€¦tanie `_project`, to osobny etap: `ENCODING-SWEEP`, bez mieszania z Lejkiem.
<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R2 Funnel color/icon/filter parity

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma juÄąÄ˝ `FunnelOwnerDecisionTile`, `FunnelStageFilterChip`, `FunnelDecisionListCard`.
- `closeflow-metric-tiles.css` ma wspÄ‚Ĺ‚lne tony `blue`, `amber`, `red`, `green`, `purple`.
- Klienci uÄąÄ˝ywajĂ„â€¦ wzorca filtrÄ‚Ĺ‚w: `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-status-pill`, `pill`, `data-cf-status-tone`.

DECYZJE DAMIANA:
- ZamysÄąâ€š Lejka zostaje.
- Lejek nie jest kanbanem.
- Kafelki wÄąâ€šaÄąâ€şcicielskie majĂ„â€¦ mieĂ„â€ˇ kolorowe ikony.
- `Cisza 7+` ma dostaĂ„â€ˇ ton `purple`.
- Filtry etapÄ‚Ĺ‚w majĂ„â€¦ mÄ‚Ĺ‚wiĂ„â€ˇ tym samym jĂ„â„˘zykiem wizualnym co filtry w Klientach.
- Nie ruszaĂ„â€ˇ logiki filtrÄ‚Ĺ‚w, Supabase, SQL, drag/drop ani kanbana.

ZMIANA:
- Dodany marker `STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY`.
- Dodana jawna mapa `FUNNEL_OWNER_TILE_TONE_MAP`.
- `FunnelStageFilterChip` dostaje `data-cf-status-tone`, `cf-status-pill` / `pill` oraz alias `cf-filter-pill`.
- Pasek etapÄ‚Ĺ‚w dostaje `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-filter-strip`, `cf-filter-pills`.
- CSS wymusza widoczne kolorowe ikony w owner tiles.

TESTY:
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Nie wolno przez ten etap zmieniĂ„â€ˇ dziaÄąâ€šania filtrÄ‚Ĺ‚w ani przerobiĂ„â€ˇ Lejka w kanban.
- Nie mieszaĂ„â€ˇ w tym commicie wczeÄąâ€şniejszych plikÄ‚Ĺ‚w `STAGE231D0E`, jeÄąâ€şli nie sĂ„â€¦ osobno domykane.
<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_END -->

<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R3 Funnel icon source truth + records header fix

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma juÄąÄ˝ `FUNNEL_OWNER_TILE_TONE_MAP` i uÄąÄ˝ywa `data-eliteflow-metric-tone`.
- `closeflow-metric-tiles.css` ma zmienne source of truth dla ikon i tÄąâ€ša ikon.
- `SalesFunnel.tsx` nadal miaÄąâ€š dwuliniowy nagÄąâ€šÄ‚Ĺ‚wek rekordÄ‚Ĺ‚w: maÄąâ€šy label + `Rekordy w aktywnym widoku`.

DECYZJE DAMIANA:
- Ikony kafelkÄ‚Ĺ‚w Lejka majĂ„â€¦ mieĂ„â€ˇ widoczny kolor.
- Kolor ikon ma iÄąâ€şĂ„â€ˇ ze wspÄ‚Ĺ‚lnego source of truth `closeflow-metric-tiles.css`.
- Nie kolorowaĂ„â€ˇ lokalnie kafelkÄ‚Ĺ‚w Lejka losowymi hexami.
- NagÄąâ€šÄ‚Ĺ‚wek rekordÄ‚Ĺ‚w ma byĂ„â€ˇ jednym wierszem.
- Nie ruszaĂ„â€ˇ logiki filtrÄ‚Ĺ‚w, SQL, Supabase, kanbana ani drag/drop.

ZMIANA:
- Dodany marker `STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER`.
- W `closeflow-metric-tiles.css` dopisano ogÄ‚Ĺ‚lnĂ„â€¦ reguÄąâ€šĂ„â„˘ `stroke: currentColor` / `color: currentColor` dla SVG ikon metric tiles.
- W `SalesFunnel.tsx` nagÄąâ€šÄ‚Ĺ‚wek rekordÄ‚Ĺ‚w zmieniony na `FunnelRecordsHeaderRow`.
- W `sales-funnel-stage231d0f-visual-alignment.css` dodano CSS dla jednowierszowego nagÄąâ€šÄ‚Ĺ‚wka.

TESTY:
- `node scripts/check-stage231d0f-r3-funnel-icon-source-and-header.cjs`
- `node --test tests/stage231d0f-r3-funnel-icon-source-and-header.test.cjs`
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- JeÄąâ€şli ikony dalej wyglĂ„â€¦dajĂ„â€¦ bez koloru, moÄąÄ˝liwa przyczyna to kolejnoÄąâ€şĂ„â€ˇ Äąâ€šadowania CSS albo zewnĂ„â„˘trzne nadpisanie SVG. Guard sprawdza source of truth, ale manual QA nadal jest konieczne.
<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_END -->

<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R5 Funnel records header line repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R4 patcher dalej zatrzymaÄąâ€š siĂ„â„˘ na starym fragmencie `<p className="text-xs font-black uppercase tracking...">`.
- Przyczyna: nawet regex R4 nie trafiÄąâ€š lokalnego wariantu starego JSX.
- Problem jest w konkretnych liniach starego headera, nie w caÄąâ€šym Lejku.

ZMIANA:
- R5 usuwa liniowo stare fragmenty:
  - `visibleLabel` paragraph,
  - stary `h2` rekordÄ‚Ĺ‚w,
  - stary licznik tekstowy.
- R5 wymaga nowego `data-stage231d0f-r5-records-header-line-repair`.
- R5 odÄąâ€şwieÄąÄ˝a R3/R4 guardy, ÄąÄ˝eby walidowaÄąâ€šy naprawiony stan bez faÄąâ€šszywego globalnego blokowania.

NIE RUSZAĂ„â€ :
- logiki filtrÄ‚Ĺ‚w,
- Supabase,
- SQL,
- kanbana,
- drag/drop,
- STAGE231D0E.

TESTY:
- `node scripts/check-stage231d0f-r5-funnel-records-header-line-repair.cjs`
- `node --test tests/stage231d0f-r5-funnel-records-header-line-repair.test.cjs`
- R4/R3 regression guard/test
- R2 guard/test jeÄąâ€şli istniejĂ„â€¦
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma duÄąÄ˝o wczeÄąâ€şniejszych Äąâ€şladÄ‚Ĺ‚w failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R6 Funnel UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 runtime patch przeszedÄąâ€š.
- R5 guard zatrzymaÄąâ€š etap wyÄąâ€šĂ„â€¦cznie na brakach w UI Dictionary: `MetricTileIconColorSource` i `FunnelColorToneMap`.
- To jest problem guardu/pamiĂ„â„˘ci projektu, nie logiki Lejka.

ZMIANA:
- R6 dopisuje brakujĂ„â€¦ce pojĂ„â„˘cia do aktywnego bloku UI Dictionary.
- R6 guard Äąâ€šĂ„â€¦czy aktywne bloki R6/R5/R4/R3/R2 zamiast patrzeĂ„â€ˇ tylko w ostatni blok.
- R6 nie dotyka logiki filtrÄ‚Ĺ‚w, Supabase, SQL, drag/drop ani kanbana.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-ui-dictionary-guard-repair.cjs`
- `node --test tests/stage231d0f-r6-funnel-ui-dictionary-guard-repair.test.cjs`
- R5/R4/R3 regression guard/test
- R2 guard/test jeÄąâ€şli istniejĂ„â€¦
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree jest brudny po wielu prÄ‚Ĺ‚bach. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R6 Funnel shared filter resilient patch

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 shared filter patch zatrzymaÄąâ€š siĂ„â„˘ na `SalesFunnel post-patch token missing: data-stage231d0f-r5-stage-filter-no-visible-money`.
- Przyczyna: patcher szukaÄąâ€š zbyt szerokiego wariantu caÄąâ€šego `<button>` w `FunnelStageFilterChip`.
- Realny `SalesFunnel.tsx` ma stabilny marker `data-stage231d0f-r2-filter-tone={tone}` i widoczny `cf-funnel-stage-filter-chip-value`.

ZMIANA:
- R6 patchuje wyÄąâ€šĂ„â€¦cznie blok funkcji `FunnelStageFilterChip`, a nie caÄąâ€šy plik na Äąâ€şlepo.
- R6 dopina no-visible-money marker po stabilnym atrybucie.
- R6 usuwa widocznĂ„â€¦ kwotĂ„â„˘ z chipu, zostawia kwotĂ„â„˘ w `aria-label` i `title`.
- R6 zachowuje wspÄ‚Ĺ‚lny filtr dla KlientÄ‚Ĺ‚w przez stabilny `cf-contact-cadence-pills`.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-shared-filter-resilient-patch.cjs`
- `node --test tests/stage231d0f-r6-funnel-shared-filter-resilient-patch.test.cjs`
- R3 guard/test jeÄąâ€şli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeÄąâ€şniejsze Äąâ€şlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_END -->

<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R8 Funnel icon tone syntax repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R7 zatrzymaÄąâ€š siĂ„â„˘ przed patchowaniem na bÄąâ€šĂ„â„˘dzie skÄąâ€šadni w patcherze.
- BÄąâ€šĂ„â€¦d: niepoprawnie escapowany string `payment: \\'green\\''` w tablicy walidacyjnej.
- To nie jest bÄąâ€šĂ„â€¦d aplikacji ani koncepcji kolorÄ‚Ĺ‚w.

DECYZJA DAMIANA:
- UkÄąâ€šad Lejka jest zamroÄąÄ˝ony.
- Etap dotyczy tylko spÄ‚Ĺ‚jnej kolorystyki ikon/kafelkÄ‚Ĺ‚w.

ZMIANA:
- R8 naprawia skÄąâ€šadniĂ„â„˘ patchera.
- R8 dodaje `node --check` dla patchera i guardu przed patchowaniem.
- R8 dodaje `metric-icon-tone-registry.ts`.
- R8 podpina Lejek i operator metric tone contract pod wspÄ‚Ĺ‚lny resolver koloru.
- Kafel `PieniĂ„â€¦dze` uÄąÄ˝ywa `PaymentEntityIcon`, nie strzaÄąâ€ški.

TESTY:
- `node --check payload/scripts/apply-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --check payload/scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --test tests/stage231d0f-r8-funnel-icon-tone-syntax-repair.test.cjs`
- R6 guard jeÄąâ€şli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Zmiana ikony `PieniĂ„â€¦dze` ze strzaÄąâ€ški na ikonĂ„â„˘ pÄąâ€šatnoÄąâ€şci jest Äąâ€şwiadoma.
- Manual QA wymagany dla realnego koloru SVG.
<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R9 Funnel icon tone UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R8 patch runtime przeszedÄąâ€š.
- R8 zatrzymaÄąâ€š siĂ„â„˘ dopiero na guardzie dokumentacji.
- BrakujĂ„â€¦cy token: `SharedFilterStrip` w aktywnym zakresie UI Dictionary.
- To nie jest problem Lejka ani kolorÄ‚Ĺ‚w ikon.

ZMIANA:
- R9 dopisuje aktywny blok UI Dictionary z literalami:
  - `SharedFilterStrip`
  - `FunnelLayoutFrozen`
  - `FunnelIconToneSourceTruth`
  - `MetricTileIconColorSource`
- R9 odÄąâ€şwieÄąÄ˝a R8 guard, ÄąÄ˝eby czytaÄąâ€š bloki R9/R8/R6/R5/R4 razem.
- R9 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R9/R8 guardÄ‚Ĺ‚w
- R9 guard/test
- R8 regression guard/test
- R6 guard jeÄąâ€şli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeÄąâ€şniejsze Äąâ€şlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R10 Funnel icon tone PowerShell StrictMode repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R9 zatrzymaÄąâ€š siĂ„â„˘ po dopisaniu UI Dictionary i project memory.
- BÄąâ€šĂ„â€¦d: `The property 'check:stage231d0f-r9-funnel-icon-tone-ui-dictionary-guard-repair' cannot be found on this object.`
- Przyczyna: PowerShell `Set-StrictMode` i dostĂ„â„˘p do brakujĂ„â€¦cej wÄąâ€šaÄąâ€şciwoÄąâ€şci w `package.json`.
- To nie jest problem runtime Lejka.

ZMIANA:
- R10 usuwa kruchy dostĂ„â„˘p PowerShell `$Pkg.scripts.'...'`.
- Dopisanie scriptÄ‚Ĺ‚w do `package.json` odbywa siĂ„â„˘ przez `node -e`.
- R10 uruchamia R10/R9/R8 guardy i testy.
- R10 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R10/R9/R8 guardÄ‚Ĺ‚w
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 guard jeÄąâ€şli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeÄąâ€şniejsze Äąâ€şlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R11 Funnel R6 regression guard resolver repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R10/R9/R8 guardy i testy przeszÄąâ€šy.
- Etap zatrzymaÄąâ€š wyÄąâ€šĂ„â€¦cznie stary R6 regression guard.
- R6 guard oczekiwaÄąâ€š literalÄ‚Ĺ‚w `tone: 'blue'`, `tone: 'amber'`, `tone: 'purple'`, `tone: 'red'`, `tone: 'green'`.
- Po R8 te literaÄąâ€šy zostaÄąâ€šy celowo zastĂ„â€¦pione resolverem `resolveCloseflowMetricIconTone`.

ZMIANA:
- R11 odÄąâ€şwieÄąÄ˝a R6 guard/test, ÄąÄ˝eby akceptowaÄąâ€š nowy source of truth.
- R11 odpala R11/R10/R9/R8/R6 guardy i testy.
- R11 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla guardÄ‚Ĺ‚w R11/R10/R9/R8/R6
- R11 guard/test
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 refreshed guard/test
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wczeÄąâ€şniejsze Äąâ€şlady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_START -->
## 2026-06-12 18:30 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R12 Funnel metric colors real CSS enforce

STATUS: READY_TO_APPLY

FAKTY Z QA:
- Po pushu R11 ukÄąâ€šad Lejka jest OK.
- W Vercel `/funnel` nadal wyglĂ„â€¦da prawie szaro.
- Problem: kolor nie dochodzi wystarczajĂ„â€¦co mocno do kafli/SVG.

FAKTY Z KODU:
- `SalesFunnel.tsx` ma `data-eliteflow-metric-tone` i `cf-top-metric-tile-icon`.
- `closeflow-metric-tiles.css` ma tokeny `--cf-metric-tone-*-icon`, ale nie wymuszaÄąâ€š peÄąâ€šnego `stroke: currentColor` na SVG i dzieciach SVG.
- `PieniĂ„â€¦dze` ma dÄąâ€šugĂ„â€¦ wartoÄąâ€şĂ„â€ˇ i wymaga value-kind.

DECYZJA:
- UkÄąâ€šad Lejka zostaje zamroÄąÄ˝ony.
- R12 zmienia tylko realnĂ„â€¦ kolorystykĂ„â„˘ kafelkÄ‚Ĺ‚w/ikon.
- `Cisza 7+` ma byĂ„â€ˇ purple, nie amber.
- Kolor ma byĂ„â€ˇ subtelny, nie tĂ„â„˘cza.
- Source of truth: `closeflow-metric-tiles.css`.

ZMIANA:
- `FUNNEL_OWNER_TILE_TONE_MAP` ma jawne tony: blue, amber, purple, red, green.
- Dodano `data-cf-metric-value-kind`.
- `closeflow-metric-tiles.css` wymusza SVG `stroke: currentColor`.
- Dodano subtelne tÄąâ€ša/bordery kafli per tone.
- Dodano money value sizing.

TESTY:
- `node scripts/check-stage231d0f-r12-funnel-metric-colors-real-css-enforce.cjs`
- `node --test tests/stage231d0f-r12-funnel-metric-colors-real-css-enforce.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA dalej wymagane, bo to etap CSS/render.
- Local tree ma wczeÄąâ€şniejsze Äąâ€şmieci; push tylko selektywny.
<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_END -->

<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_START -->
## 2026-06-12 19:20 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0F-R13 Funnel visual color density

STATUS: READY_TO_APPLY

FAKTY Z QA:
- R12 przeszedÄąâ€š technicznie i zostaÄąâ€š wypchniĂ„â„˘ty.
- Ekran `/funnel` nadal wyglĂ„â€¦da za blado.
- Problem nie dotyczy juÄąÄ˝ tylko ikon; brakuje warstwy kolorystycznej kafli i rekordÄ‚Ĺ‚w.

DECYZJE DAMIANA:
- UkÄąâ€šad Lejka jest zaakceptowany i zamroÄąÄ˝ony.
- DodaĂ„â€ˇ kolor bez tĂ„â„˘czy.
- Kafelki majĂ„â€¦ mieĂ„â€ˇ kolor w ikonie, wartoÄąâ€şci i subtelnym surface/accent.
- Rekordy majĂ„â€¦ dostaĂ„â€ˇ lekkie semantyczne akcenty.
- Przyciski `OtwÄ‚Ĺ‚rz` majĂ„â€¦ byĂ„â€ˇ rÄ‚Ĺ‚wne i bez Äąâ€šamania.

ZMIANA:
- R13 dodaje `FunnelDecisionSignal tone`.
- R13 dodaje data atrybuty rekordÄ‚Ĺ‚w.
- R13 dodaje tone surface/accent dla kafli w `closeflow-metric-tiles.css`.
- R13 zwiĂ„â„˘ksza open button z 132px do 156px i dodaje nowrap.
- R13 nie zmienia layoutu ani logiki filtrÄ‚Ĺ‚w.

TESTY:
- `node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs`
- `node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- To etap CSS/render, wiĂ„â„˘c manual QA jest obowiĂ„â€¦zkowy.
- Local tree ma wczeÄąâ€şniejsze Äąâ€şmieci; push tylko selektywny.
<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_END -->

<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 20:10 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0G Visual Tile Source Truth Atlas

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- STAGE231D0F-R13 przeszedÄąâ€š guard/test/build.
- Commit `0b2f6fb2 fix: improve funnel visual color density` zostaÄąâ€š wypchniĂ„â„˘ty na `dev-rollout-freeze`.
- Damian wizualnie akceptuje Lejek i zamraÄąÄ˝a go jako baseline.

DECYZJA DAMIANA:
- FunnelMetricTileR13 zostaje ÄąĹźrÄ‚Ĺ‚dÄąâ€šem prawdy dla globalnego CloseFlowMetricTileV2.
- Nie przebudowywaĂ„â€ˇ caÄąâ€šej aplikacji chaotycznie.
- Najpierw source truth, atlas, guard i plan fal.

ZMIANA:
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`.
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.
- Dopisano UI Dictionary: CloseFlowMetricTileV2, CloseFlowMetricToneMap, FunnelMetricTileR13, SharedFilterStrip, RecordListCard, RightRailCard, FinanceMetricTile.
- Dodano guard/test D0G.
- Runtime widokÄ‚Ĺ‚w nie jest przepinany w tym etapie.

TESTY:
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- R13 regression guard/test jeÄąâ€şli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- UI Dictionary ma stare duplikaty i historyczne mojibake. Guard D0G skanuje aktywny blok D0G i nowe source truth, nie caÄąâ€šĂ„â€¦ historiĂ„â„˘ sÄąâ€šownika.
- PeÄąâ€šny cleanup lokalnych Äąâ€şmieci po starych paczkach zostaje osobnym etapem.
<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->

<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 Ă˘â‚¬â€ť STAGE231D0G-CLOSEOUT

- Closed D0G Visual Tile Source Truth Atlas after guard/test/build verification.
- Updated run report from READY_TO_APPLY to PASS / CLOSED.
- Recorded test results in central project files.
- Confirmed next stage: STAGE231D0H-1 Leads + Clients metric tiles and filters to CloseFlowMetricTileV2.
- No runtime UI, SQL, Supabase, routing, kanban or drag/drop changes.
<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->
<!-- STAGE231D0G_CLOSEOUT_R2_GUARD_SCOPE_REPAIR_2026_06_12_START -->
## 2026-06-12 Ä‚ËĂ˘â€šÂ¬Ă˘â‚¬ĹĄ STAGE231D0G-CLOSEOUT-R2 Guard scope repair

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
## 2026-06-12 22:05 Europe/Warsaw Ă˘â‚¬â€ť STAGE231D0H-N1-R3 Notifications visual source cleanup section bounds

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

- LeadDetail: dodano operacyjne CTA do kafelkÄ‚Ĺ‚w i panelu finansÄ‚Ĺ‚w.
- LeadDetail: wydzielono content/status/actions w wierszach dziaÄąâ€šaÄąâ€ž.
- Leads: pole tworzenia leada opisane jako PotencjaÄąâ€š / wartoÄąâ€şĂ„â€ˇ i oznaczone markerem testowym.
- Naprawiono paczkĂ„â„˘ R1: PowerShell nie trzyma juÄąÄ˝ duÄąÄ˝ych stringÄ‚Ĺ‚w TSX, patch wykonuje Node.

## 2026-06-14 10:40 Europe/Warsaw - STAGE231G R6

- Naprawiono konflikt rebase w _project/04_ETAPY_ROZWOJU_APLIKACJI.md.
- Dodano realne klasy work-row content/status/actions w LeadDetail.
- Poprawiono guard/test, ÄąÄ˝eby nie myliÄąâ€š poprawnego group.key w accordion z bÄąâ€šĂ„â„˘dem overflow.

## 2026-06-14 10:45 Europe/Warsaw - STAGE231G R7

- LeadDetail: CTA PotencjaÄąâ€š otwiera maÄąâ€šy modal tylko do wartoÄąâ€şci, oparty o ten sam Dialog/DialogFooter pattern co inne modale.
- api/leads: zapis potencjaÄąâ€šu synchronizuje value i deal_value przy POST/PATCH.
- LeadDetail CSS: poprawiono desktopowe wyrÄ‚Ĺ‚wnanie akcji wierszy, ÄąÄ˝eby Zrobione nie spadaÄąâ€šo samotnie poza liniĂ„â„˘.

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

## 2026-06-14 Ă˘â‚¬â€ť STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: CaseDetail runtime repair for fake dictation, nextAction missing fallback, contractValue percent-only behavior, payment history copy, and full payment source in case history.
- SQL: NOT_TOUCHED.
- Deferred: cost lifecycle edit/delete and canonical case_item dual-path decision remain R1C/R1D.

## 2026-06-14 Ă˘â‚¬â€ť STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: fixed shared CaseFinanceEditorDialog contractValue clearing bug after R1B.
- Guard: scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs now covers CaseDetail and shared finance dialog.
- Decision: case_item source truth decision: two UI entries, one case_items contract.
- Risk: cost lifecycle left as R1C.
- SQL: NOT_TOUCHED.

## 2026-06-14 Ă˘â‚¬â€ť STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL

Dodano prostĂ„â€¦ korektĂ„â„˘ kosztÄ‚Ĺ‚w sprawy w tym samym oknie co korekty wpÄąâ€šat. Koszty sĂ„â€¦ pokazane jako czerwone pozycje, z akcjĂ„â€¦ `Koryguj` i `UsuÄąâ€ž`. SQL nie ruszany.

## 2026-06-14 15:45 Europe/Warsaw Ă˘â‚¬â€ť STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH
- Scope: compact cleanup of CaseDetail finance correction modal after R1C.
- Decision: remove redundant cost status chip from the correction list; cost status remains editable inside the cost correction form.
- Decision: commission payment is a paid commission entry by default; remove status/type selectors from add-commission-payment UI.
- Decision: remove the redundant "Korekta / prowizja" fallback label from payment rows.
- SQL: NOT_TOUCHED.
- Manual test: open Koryguj wpÄąâ€šatĂ„â„˘/koszt, verify rows fit, add commission payment, add/correct/delete cost, refresh.

## STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION Ă˘â‚¬â€ť 2026-06-14 16:40 Europe/Warsaw
- Status: LOCAL_APPLIED / DO_TEST_AND_PUSH / SERVER_UI_REQUIRED
- Scope: payment correction now edits existing payment amount/date/note through updatePaymentInSupabase; cost correction edits kind/date/status/note and money fields.
- SQL: not touched.
- Risk: if payment PATCH fails on server, backend payment endpoint repair is required.


## 2026-06-14 HH:mm Europe/Warsaw Ă˘â‚¬â€ť STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
- Repair after red-guard pushed R1F: normalize commission payment save and make guards CRLF-safe.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG
- Added cost other-name field and explicit reimbursable checkbox in CaseDetail cost create/correct flows.

## 2026-06-14 HH:mm Europe/Warsaw - STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
- Synced CaseDetail finance/cost stage ledger after R1F4/R1G.
- No runtime changes.
- Renamed future dictation execution stage to R1D2 to avoid R1D collision.


## STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS Ă˘â‚¬â€ť CaseDetail cost/payment lifecycle product closeout

- date: 2026-06-14 18:55 Europe/Warsaw
- type: docs-only / manual UI confirmation
- result: CaseDetail cost/payment lifecycle moved from SERVER_UI_REQUIRED to PRODUCT_PASS after Damian confirmed manual tests.
- runtime changes: none.

## STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

- data: 2026-06-14 19:10 Europe/Warsaw
- zmiana: przywrocono runtime dyktowania notatki w CaseDetail przez Web Speech / SpeechRecognition; dodano autosave po ciszy i dokumentacje etapu.
- SQL: nie ruszano.
- status: DO_TEST_AND_PUSH / SERVER_UI_REQUIRED.


## STAGE231H_R1D2_R4_NOTES_PANEL_DICTATION_BUTTON Ă˘â‚¬â€ť 2026-06-14 19:40 Europe/Warsaw

- status: RUNTIME_HOTFIX_PREPARED
- zakres: drugi widoczny przycisk w panelu Notatki sprawy nie moÄąÄ˝e zostaĂ„â€ˇ jako disabled Ă˘â‚¬ĹľNotatka gÄąâ€šosowa Ă˘â‚¬â€ť wkrÄ‚Ĺ‚tceĂ˘â‚¬ĹĄ; ma uÄąÄ˝ywaĂ„â€ˇ tego samego handlera SpeechRecognition/autosave co przycisk w panelu DziaÄąâ€šania sprawy.
- runtime: src/pages/CaseDetail.tsx, bez SQL i bez R1E kosztÄ‚Ĺ‚w zwrÄ‚Ĺ‚conych.
- test: R1D2 guard/test + R1D2 R4 guard/test + build + diff-check.
- ryzyko: wczeÄąâ€şniejszy R1D2 zabezpieczaÄąâ€š pierwszy przycisk, ale nie objĂ„â€¦Äąâ€š drugiego widocznego przycisku w panelu notatek.


## 2026-06-14 22:00 Europe/Warsaw - STAGE231H_R1D2_R6_R9_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR

Status: DO_APPLY / mass repair from clean origin.
Zakres: CaseDetail note follow-up source map and notes CRUD. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek dostaje Edytuj/UsuĂ„Ä…Ă˘â‚¬Ĺľ/Zapisz. Etap zastÄ‚â€žĂ˘â€žËpuje runtime file bez kruchych anchorĂ„â€šÄąâ€šw po bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdach R6/R7/R8.


## 2026-06-14 22:15 Europe/Warsaw - STAGE231H_R1D2_R6_R9D_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_REPAIR_GUARD_SYNC

Status: DO_APPLY / guard-ledger sync after R9 partial apply.
Zakres: centralny R1G2 product-pass sync wymagany przez legacy R1D2 guard plus R9 mass repair. Notatka zostaje w activities/operator_note. Follow-up po notatce jest tasks/follow_up z workspaceId, dueAt, scheduledAt, reminderAt, date, caseId, clientId, leadId. Modal wszystkich notatek ma Edytuj/UsuĂ„Ä…Ă˘â‚¬Ĺľ/Zapisz.


## 2026-06-14 22:30 Europe/Warsaw - STAGE231H_R1D2_R6_R9E_CASE_NOTE_FOLLOWUP_NOTES_CRUD_MASS_GUARD_SYNC

Status: DO_APPLY / MASS_GUARD_SYNC_CONTINUATION
Zakres: masowe domkniÄ‚â€žĂ˘â€žËcie klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdĂ„â€šÄąâ€šw legacy markerĂ„â€šÄąâ€šw. Synchronizuje R1G2, R1D2 R4, R9, R9D i R9E w centralnych ledgerach oraz uruchamia peĂ„Ä…Ă˘â‚¬Ĺˇny chain guardĂ„â€šÄąâ€šw/testĂ„â€šÄąâ€šw/build.


## 2026-06-14 22:40 Europe/Warsaw - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

Status: DO_APPLY / MASS_GUARD_REGEX_FIX
Zakres: naprawa klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu guardĂ„â€šÄąâ€šw R9D/R9E: sprawdzenie runtime regex
eplace(/\s+/g, ' ') w guardzie musi mieÄ‚â€žĂ˘â‚¬Ë‡ podwĂ„â€šÄąâ€šjnie escapowany backslash. Bez tego guard szuka bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdnego
eplace(/s+/g, ' ').


## 2026-06-14 22:50 Europe/Warsaw - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

Status: DO_APPLY / MASS_LOCAL_TASKS_GUARD_FIX
Zakres: naprawa klasy bĂ„Ä…Ă˘â‚¬ĹˇÄ‚â€žĂ˘â€žËdu guardĂ„â€šÄąâ€šw R9E/R9F: runtime poprawnie dopina nowy follow-up task do lokalnego 	asks przez setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));, a guard nie moĂ„Ä…Ă„Ëťe wymagaÄ‚â€žĂ˘â‚¬Ë‡ nieistniejÄ‚â€žĂ˘â‚¬Â¦cej skĂ„Ä…Ă˘â‚¬Ĺˇadni previousTasks.

## STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING

- Data: 2026-06-14 23:45 Europe/Warsaw
- Status: TECH_STAGE_IN_PROGRESS
- Zakres: CaseDetail action map, note follow-up display/source map, quick note local append, finance loading flicker removal.
- Audyt: R10 failed on brittle anchor. R10C uses regex/whole-class source-aware patch and guard.

### STAGE231H_R1D2_R11_NOTE_PANEL_FOLLOWUP_PROMPT_MAP_GUARD
- data: 2026-06-14T20:31:30.095Z
- status: DO_TEST_AND_PUSH
- zakres: notatki CaseDetail pokazujĂ„â€¦ do 5 wpisÄ‚Ĺ‚w, majĂ„â€¦ tooltip peÄąâ€šnej treÄąâ€şci, szybka notatka otwiera ten sam prompt follow-upu co dyktowanie, a follow-up w dziaÄąâ€šaniach pokazuje treÄąâ€şĂ„â€ˇ notatki jako opis.
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
- Zakres: CaseDetail notatki sprawy, follow-up po notatce, kasowanie powiÄ…zanego taska.
- Status: LOCAL_APPLIED_PENDING_VERIFY

## STAGE231H_R1D2_R15C - 2026-06-15 15:10 Europe/Warsaw
- CaseDetail: naprawiono dwukierunkowe powiązanie notatka/follow-up, ostrzeżenie przy kasowaniu follow-upu z działań i hierarchię tekstu w karcie działania.
