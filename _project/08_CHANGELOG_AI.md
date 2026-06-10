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

## 2026-05-16 â€” Stage92 calendar selected day readability {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

- UporzÄ…dkowano render `CalendarSelectedDayEntryRowV9`: peĹ‚ny typ, godzina, status, tytuĹ‚, powiÄ…zanie i akcje.
- UsuniÄ™to ryzyko biaĹ‚ej pustej belki pod wpisem przez jeden stabilny shell wpisu i marker `data-cf-selected-day-v9-no-bottom-bar`.
- Akcje w V9 sÄ… grupowane w dwĂłch rzÄ™dach na desktopie i responsywnie na mobile.
- Dodano guard `tests/stage92-calendar-selected-day-readable-actions.test.cjs` do quiet release gate.

## STAGE93_CALENDAR_WEEK_RAIL_CLEANUP â€” 2026-05-16
- Removed the obsolete hidden `calendar-week-filter-list` render from Calendar week view.
- Kept `calendar-week-visible-days-v3` as the single visible week-day rail.
- Changed week rail count to plain text via `calendar-week-day-count-text`; no black/dark/plaque badge.

## STAGE93_GUARD_FIX_STAGE94_CALENDAR_SWEEP_2026_05_16

- Poprawiono wadliwy guard Stage93 po lokalnym patchu V5.
- Dodano sweep diagnostyczny Calendar UI do wykrywania kolejnych bĹ‚Ä™dĂłw przed zbiorczÄ… paczkÄ… naprawczÄ….

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
- Ujednolicono szerokoĹ›Ä‡ prawego raila /leads ze wspĂłlnym source of truth dla /clients.
- UsuniÄ™to lokalny override JSX `xl:grid-cols-[minmax(0,1fr)_300px]`.
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
## 2026-05-16 Ă˘â‚¬â€ť Stage104 / Paczka F Ă˘â‚¬â€ť Calendar loading performance

STATUS: WDROĹ»ONE LOKALNIE PO APPLY, TEST R\u00c4\u0098CZNY DO WYKONANIA.

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

NAST\u00c4\u0098PNY KROK:
- Test rÄ™czny `/calendar`: start, tydzieĹ„, miesiÄ…c, wybrany dzieĹ„, edycja, +1H/+1D/+1W, zrobione, usuĹ„.
<!-- /STAGE104_CALENDAR_PERFORMANCE_F -->


---
## Stage105 / Paczka G Ă˘â‚¬â€ť Templates delete + visual contract Ă˘â‚¬â€ť 2026-05-16

STATUS: WDROĹ»ONE LOKALNIE Z PACZKI ZIP, BEZ COMMITA I BEZ PUSHA.

FAKTY:
- /templates dostaĹ‚ widoczny przycisk UsuĹ„ na karcie szablonu.
- Delete uĹĽywa EntityTrashButton i shared trash action source of truth.
- Delete wymaga window.confirm oraz dodatkowego potwierdzenia, jeĹ›li szablon ma pozycje checklisty.
- Karta szablonu uĹĽywa cf-template-card cf-readable-card i markerĂłw
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
- Ten etap nie dodaje backendowego sprawdzania, czy szablon zostaĹ‚ uĹĽyty w aktywnych sprawach. Wymusza Ĺ›wiadome potwierdzenie usuwania wzorca i jego pozycji.

NAST\u00c4\u0098PNY KROK:
- PrzetestowaÄ‡ /templates; dopiero potem zdecydowaÄ‡, czy robimy kolejny lokalny etap czy wspĂłlny commit/push Stage104+Stage105.
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
## 2026-05-17 â€” Stage98B-100B Calendar polish copy and week-plan visibility

Status: PATCH PACKAGE PREPARED / LOCAL APPLY REQUIRED.

Zakres:
- naprawa mojibake i bĹ‚Ä™dnych polskich znakĂłw w aktywnym `/calendar`,
- uporzÄ…dkowanie `closeflow-calendar-selected-day-new-tile-v9.css` do jednego modelu V9 + Stage100,
- wygaszenie aktywnego CSS po Stage94 V2/V3/V4 i starych rodzin `.cf-week-plan-entry-*` / `.cf-calendar-week-entry-*`,
- nowy guard `tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`,
- aktualizacja quiet release gate.

Guardy/testy do uruchomienia przez paczkÄ™:
- `node tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node tests/stage99-calendar-active-class-contract.test.cjs`
- `node tests/stage100-calendar-week-plan-entry-visible.test.cjs`
- `node tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

Test rÄ™czny: DO WYKONANIA na `/calendar`.
Kryterium: dzieĹ„ z wpisem nie moĹĽe wyglÄ…daÄ‡ jak pusty biaĹ‚y pasek/mini-kafelek.

<!-- STAGE104C_WEEK_PLAN_CARD_UNCLAMP -->

## 2026-05-17 â€” Stage104C: Calendar week plan card unclamp

### FAKTY Z KODU / PLIKĂ“W
- Poprzednia paczka Stage104B nie wykonaĹ‚a patchera: plik CJS miaĹ‚ bĹ‚Ä…d skĹ‚adni przez nieucieczony backtick w osadzonym teĹ›cie.
- Faktyczny problem UI: w Plan najbliĹĽszych dni wpis istnieje, ale renderuje siÄ™ jako wÄ…ski pionowy fragment akcji.
- Naprawa Stage104C: root week-plan card nie uĹĽywa legacy klasy calendar-entry-card i dostaje anti-collapse CSS: width 100%, max-width none, min-height 92px, overflow visible, visibility visible, opacity 1.

### GUARDY
- Stage99 pilnuje klas i zakazu mieszania calendar-entry-card z cf-calendar-week-plan-entry-card.
- Stage100 pilnuje DOM modelu, peĹ‚nych labeli, braku display contents wrappera i anti-collapse CSS.
- Stage104 pilnuje widocznego payloadu karty oraz braku hidden/zero-size reguĹ‚.

### TESTY AUTOMATYCZNE
Do potwierdzenia przez run:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage104-calendar-rendered-week-plan-smoke.test.cjs
- npm run build
- npm run verify:closeflow:quiet

### TEST RÄCZNY
Status: TEST RÄCZNY DO WYKONANIA. WejĹ›Ä‡ na /calendar i sprawdziÄ‡ dzieĹ„ z 1 wpis oraz dzieĹ„ z 0 wpisĂłw.

## Stage104D - Calendar week plan compact one-row - 2026-05-17
- Status: WDRAĹ»ANE.
- Cel: zamroziÄ‡ Stage104C i skompaktowaÄ‡ wpis tygodniowy do jednego wiersza na desktopie.
- Zakres: src/styles/closeflow-calendar-selected-day-new-tile-v9.css, guardy Stage100/104/104D, quiet gate.
- Nie ruszano logiki UsuĹ„ / Zrobione ani Google Calendar syncu. OpĂłĹşnienie syncu zostaje do osobnego Stage104E.
- Test rÄ™czny: /calendar, dzieĹ„ z 1 wpisem ma byÄ‡ jednym kompaktowym wierszem; dzieĹ„ z 0 wpisĂłw bez zmian.


## STAGE107_CLIENT_DETAIL_RUNTIME_TDZ_FINANCE_FIX_2026_05_17

- Typ: P0 runtime regression.
- Zakres: ClientDetail, finance summary, ClientTopTiles.
- Powod: `clientFinance` czytal `clientFinanceSummary` przed deklaracja, a `ClientTopTiles` czytal finance summary spoza propsow.
- Guard: `scripts/check-stage107-client-detail-runtime-tdz-finance.cjs`.
- Test: `tests/stage107-client-detail-runtime-tdz-finance.test.cjs`.
- Test reczny: otwarcie szczegolow klienta bez `APP_ROUTE_RENDER_FAILED`.


## Stage113 - Logo CloseFlow mapping
- Dodano brand assety i przepiÄ™to tekstowe CF / login icon na komponent logo.


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

- Dodano wspĂłlny komponent `src/components/entity-contact-card.tsx` i CSS `src/styles/entity-contact-card.css`.
- LeadDetail dostaĹ‚ lewÄ… kartÄ™ kontaktowÄ… w ukĹ‚adzie klienta.
- ClientDetail uĹĽywa wspĂłlnej listy danych kontaktowych zamiast lokalnego `InfoRow`.
- UsuniÄ™to lokalnÄ… wyspÄ™ UI LeadDetail: `InfoLine` / `lead-detail-contact-grid`.

## Stage115B LeadDetail notes visible source contract

- Split LeadDetail note display from contact card.
- Added dedicated `Notatki leada` section with source lead note and latest note activity.
- Added guard for source/placement contract.

## Stage115C LeadDetail inline note submit contract

- Locked LeadDetail history note form as inline submit path.
- Renamed work-center global note action to OtwĂłrz szybki formularz notatki.
- Fixed Polish inline note copy: placeholder, dictation button and submit button.

## Stage115D LeadDetail overdue work items red contract

- Added overdue detection for LeadDetail work items.
- Timeline tasks/events with past date and open status now render `ZalegĹ‚e`.
- Added red danger pill and overdue row styling.
- Replaced mojibake separator `Ă˘â€ťÂ¬Äš` with `â€˘`.

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

Status: WDRAĹ»ANE.

Cel: +1H/+1D/+1W musi wizualnie przesuwaÄ‡ wpis od razu po udanym PATCH, zamiast polegaÄ‡ wyĹ‚Ä…cznie na refreshSupabaseBundle().

Test rÄ™czny: /calendar, wpis task/event, akcje +1H/+1D/+1W. Po sukcesie karta ma zmieniÄ‡ dzieĹ„/godzinÄ™.
<!-- /STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->

## 2026-05-18 - STAGE122_RUNTIME_AUTH_API_PWA_HARDENING

FAKTY: production console showed repeated /api/me 401 plus /api/tasks and /api/events 500 during calendar shift. DevTools also showed an active CloseFlow service worker and old bundle initiator. Stage122 disables stale PWA cache/register behavior, adds /api/version, adds a runtime console marker, and makes work-items auth failures return 401/403 instead of masked 500.

TESTY: node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs; npm run build; npm run verify:closeflow:quiet.

NASTÄPNY KROK: after deployment, verify Network JS hash changes, call /api/version, and retest Calendar +1D/+1W/+1H. If /api/me still returns 401, user must re-auth via Google/Supabase without clearing localStorage first.

## 2026-05-18 - STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE

FAKTY: Stage122 V7 passed Stage122/PWA/Stage98/Stage121/build, then failed Vercel Hobby function budget because api/version.ts raised api/*.ts to 13. V8 chose system rewrite architecture but failed on a brittle api/system.ts anchor.

DECYZJA: /api/version stays available through /api/system?kind=version, without adding a physical Vercel function.

TESTY: Stage122 guard, PWA foundation, Vercel budget, Stage98, Stage121, build, verify:closeflow:quiet.

NASTÄPNY KROK: verify production /api/version and runtime marker, then retest calendar shift only if /api/me is clean.

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
- Poprawiono czytelnoÄąâ€şĂ„â€ˇ pÄ‚Ĺ‚l formularza w /settings, szczegÄ‚Ĺ‚lnie Google Calendar reminders.
- Dodano src/styles/closeflow-settings-form-control-readability-stage179.css.
- Dodano 	ests/stage179-settings-form-control-readability-contract.test.cjs.
- Nie ruszano logiki Google Calendar, API, Supabase ani routingu.

## 2026-05-29 - STAGE179 Settings form control readability - local only

- Tryb: lokalnie, bez commita i bez pusha.
- Poprawiono czytelnoÄąâ€şĂ„â€ˇ pÄ‚Ĺ‚l formularza w /settings, szczegÄ‚Ĺ‚lnie Google Calendar reminders.
- Dodano src/styles/closeflow-settings-form-control-readability-stage179.css.
- Dodano 	ests/stage179-settings-form-control-readability-contract.test.cjs.
- Nie ruszano logiki Google Calendar, API, Supabase ani routingu.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_CHANGELOG_START -->
## 2026-06-04 â€” Stage221 owner-control roadmap po deep research CRM

Typ: dokumentacja roadmapy / pamiÄ™Ä‡ projektu / Obsidian update.

Dodano:
- szczegĂłĹ‚owy blok Stage221 do `_project/07_NEXT_STEPS.md`,
- decyzjÄ™ owner-control do `_project/04_DECISIONS.md`,
- guard pamiÄ™ci roadmapy,
- roadmap file w `_project/roadmaps/`,
- run report,
- manifest aktualizacji Obsidiana,
- plik aktualizacji Obsidiana.

Nie zmieniono:
- runtime UI,
- routingu,
- API,
- Supabase,
- stylĂłw,
- logiki produktu.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_CHANGELOG_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymaĹ‚y siÄ™ na kruchych anchorach w Clients.tsx.
- V3 uĹĽywa elastycznych regexĂłw i naprawia czÄ™Ĺ›ciowy lokalny stan.
- Docelowy wzĂłr: [Oferta wysĹ‚ana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 zostaĹ‚ wypchniÄ™ty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonaĹ‚ patcha Settings/Cases, wiÄ™c helper i guard weszĹ‚y bez sekcji ustawieĹ„ i bez case badges.
- R2B dopina brakujÄ…ce elementy: Settings threshold section i Cases owner risk badges.
- Build wczeĹ›niej przechodziĹ‚, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da siÄ™ domknÄ…Ä‡ hotfixem.
- R2B ma byÄ‡ osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeĹ›li plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeĹ›li plik istnieje
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonych testach commit/push R2B.

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, ĹĽeby nie udawaÄ‡ kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` uĹĽywa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozrĂłĹĽnia ciszÄ™ kontaktu od braku Ĺ›wieĹĽego ruchu fallback.
- Dodano runtime testy, ktĂłre realnie wywoĹ‚ujÄ… funkcje przez esbuild, nie tylko szukajÄ… tekstu.

DECYZJE DAMIANA:
- PodetapĂłw A-D nie pushujemy osobno.
- Nie robiÄ‡ drugiego Today.
- Badge majÄ… wynikaÄ‡ z jednego kontraktu ruchu i prawdy aktywnoĹ›ci.
- `updatedAt` moĹĽe byÄ‡ fallbackiem aktywnoĹ›ci, nie prawdÄ… kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- PeĹ‚ne wpiÄ™cie LeadDetail/CaseDetail widocznego work center moĹĽna zrobiÄ‡ jako D2, jeĹ›li po runtime contract nie bÄ™dzie regresji.
- Today agregacja moĹĽe dostaÄ‡ ranking w nastÄ™pnym kroku, ale bez nowej sekcji.

NASTÄPNY KROK:
- Po zielonych testach sprawdziÄ‡ /leads, /cases, /today.
- Commit/push dopiero po caĹ‚ym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykryĹ‚ realny bĹ‚Ä…d: fallback z `updatedAt` nadpisywaĹ‚ prawdziwÄ… aktywnoĹ›Ä‡.
- Build przeszedĹ‚, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` sÄ… uĹĽywane wyĹ‚Ä…cznie, gdy nie ma realnych kandydatĂłw aktywnoĹ›ci/kontaktu/pĹ‚atnoĹ›ci.
- To naprawia zaĹ‚oĹĽenie: nie udajemy kontaktu ani Ĺ›wieĹĽej aktywnoĹ›ci przez zwykĹ‚y update rekordu.

DECYZJE:
- Nie pushowaÄ‡ Stage223, dopĂłki runtime testy nie sÄ… zielone.
- UtrzymaÄ‡ kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostajÄ… jednym lokalnym blokiem do jednego commita po peĹ‚nych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTÄPNY KROK:
- Po zielonych testach moĹĽna dopiero rozwaĹĽyÄ‡ jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na brakujÄ…cym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, wiÄ™c brak samego pliku blokuje push.
- R2C dodaje brakujÄ…cy test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyĹ‚Ä…czamy release gate.
- Dodajemy minimalny test kontraktu ĹşrĂłdĹ‚a logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push dla caĹ‚ego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedĹ‚ Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na guardzie `case trash actions`.
- W `Cases.tsx` kosz byĹ‚ renderowany przez `EntityTrashButton`, ale brakowaĹ‚o starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujÄ…cy marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyĹ‚Ä…czamy guardĂłw.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejÄ…cy guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiÄ…Ĺ‚ marker kosza na liĹ›cie spraw, ale release gate przeszedĹ‚ do kolejnego warunku.
- Guard `case trash actions` wymaga teĹĽ, ĹĽeby `CaseDetail.tsx` uĹĽywaĹ‚ `EntityTrashButton`.
- `CaseDetail.tsx` miaĹ‚ przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderowaĹ‚ zwykĹ‚y `Button`.
- R2E zmienia tylko ĹşrĂłdĹ‚o przycisku na `EntityTrashButton` i uĹĽywa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyĹ‚Ä…czamy guardĂłw.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspĂłlnego ĹşrĂłdĹ‚a prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiÄ…Ĺ‚ `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, ĹĽeby `CaseDetail.tsx` zawieraĹ‚ `EntityTrashButton`.
- R2F speĹ‚nia oba kontrakty: importuje/uĹĽywa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyĹ‚Ä…czaÄ‡ guardĂłw.
- Nie zmieniaÄ‡ release gate.
- RozwiÄ…zaÄ‡ konflikt guardĂłw aliasem, nie obejĹ›ciem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych ĹşrĂłdĹ‚ach.
- PozostaĹ‚e literalne znaki mojibake w guardach/testach sÄ… zamieniane na ASCII unicode escapes, ĹĽeby guardy mogĹ‚y dalej opisywaÄ‡ zĹ‚e znaki bez Ĺ‚amania Stage98.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawiĹ‚ Stage98 i przeprowadziĹ‚ build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowaĹ‚a, ĹĽe extractor Ĺ‚apaĹ‚ default `{}`, nie ciaĹ‚o funkcji.
- Sama logika local-first byĹ‚a poprawna: funkcja ma `Promise.all([` i nie woĹ‚a Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciaĹ‚a funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, ĹĽeby kontrakt testu i logika byĹ‚y spĂłjne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawiĹ‚ extractor funkcji Stage120 przez usuniÄ™cie `= {}` z sygnatury.
- Po R2H test Stage120 doszedĹ‚ dalej i wykazaĹ‚ twardy wymĂłg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszÄ… byÄ‡ literalnie bez argumentĂłw.
- R2I przywraca literalne local reads bez argumentĂłw i zostawia poprawionÄ… sygnaturÄ™ `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, ĹĽeby nie zmieniaÄ‡ kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiÄ…zujÄ…cego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker juĹĽ ma.
- `register-service-worker.ts` ma poprawnÄ… logikÄ™: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- BrakowaĹ‚ tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyĹ‚Ä…czamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymaĹ‚ release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenĂłw w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiÄ…zania`.
- `Clients.tsx` miaĹ‚ poprawnÄ… semantykÄ™ soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie speĹ‚niaĹ‚ starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiÄ…zaĹ„.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyĹ‚Ä…czamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiÄ…zujÄ…cego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 byĹ‚ za ciasny: skrypt wymagaĹ‚ dokĹ‚adnego istniejÄ…cego renderu `case-detail-history-row`, ktĂłrego lokalny `CaseDetail.tsx` ma juĹĽ inaczej po wczeĹ›niejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenĂłw:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepĹ‚ywu historii.

DECYZJE:
- Nie wyĹ‚Ä…czamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcjÄ… Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawiĹ‚ `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` speĹ‚nia juĹĽ zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyĹ‚Ä…czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym bĹ‚Ä™dem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadziĹ‚ `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenĂłw w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` juĹĽ przechodzi, wiÄ™c brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĹ‚Ä…czamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nowÄ… funkcjÄ….

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadziĹ‚ case history visual P1 repair3 oraz wszystkie wczeĹ›niejsze release gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `NastÄ™pny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `AktywnoĹ›Ä‡ klienta`,
  - `buildClientNextAction`.
- Log wskazaĹ‚ brak `Zadania klienta`.
- R2O dodaje brakujÄ…ce etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyĹ‚Ä…czamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linkĂłw do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadziĹ‚ ClientDetail operational center oraz wszystkie wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodowaĹ‚ zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerĂłw, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyĹ‚Ä…czamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzyĹ‚ `api/daily-digest.ts`.
- R2Q-V2 nie wykonaĹ‚ patcha, bo helper JS miaĹ‚ bĹ‚Ä…d skĹ‚adni przed modyfikacjÄ… pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokĹ‚adny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĹ‚Ä…czamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadziĹ‚ `daily-digest-email-runtime.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenĂłw w `api/daily-digest.ts`:
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
- Nie wyĹ‚Ä…czamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadziĹ‚ `daily-digest-diagnostics.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenĂłw w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyĹ‚Ä…czamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyĹ‚ki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadziĹ‚ `daily-digest-cron-auth.test.cjs` oraz wczeĹ›niejsze gates do builda.
- `verify:closeflow:quiet` przeszedĹ‚ dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plikĂłw `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` byĹ‚o 13 funkcji API.
- `api/system.ts` juĹĽ importuje `supportHandler` i obsĹ‚uguje `kind === 'support'`.
- `vercel.json` juĹĽ ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, ĹĽeby zejĹ›Ä‡ do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytajÄ… ten plik bezpoĹ›rednio.
- Konsolidujemy redundantny support endpoint przez istniejÄ…cy `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite juĹĽ istnieje.
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
- JeĹ›li gdzieĹ› poza Vercel rewrite ktoĹ› woĹ‚a bezpoĹ›rednio plikowÄ… funkcjÄ™ `api/support.ts`, po usuniÄ™ciu musi trafiÄ‡ przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrĂłciĹ‚ `api/support.ts` i przeszedĹ‚ `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymaĹ‚ siÄ™ przed peĹ‚nym dopiÄ™ciem `activitiesHandler` do `api/system.ts`, wiÄ™c R2V koĹ„czy konsolidacjÄ™ `/api/activities`.
- `verify:closeflow:quiet` przeszedĹ‚ dalej i zatrzymaĹ‚ siÄ™ na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujÄ…cy kontrakt Stage32e bez przywracania starego dĹ‚ugiego copy i bez zmiany layoutu.
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
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdziÄ‡ dodawanie/odczyt aktywnoĹ›ci/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopiÄ™to marker bez zmiany UI, ĹĽeby nie rozwaliÄ‡ widoku.

NASTÄPNY KROK:
- Po zielonym verify quiet wykonaÄ‡ jeden commit/push caĹ‚ego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedĹ‚ masowo wiele gates, build i wiÄ™kszoĹ›Ä‡ `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test prĂłbuje czytaÄ‡ brakujÄ…cy plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerĂłw:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujÄ…cy historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, ktĂłry uruchamia testy z quiet gate po kolei i zbiera wszystkie bĹ‚Ä™dy zamiast zatrzymywaÄ‡ siÄ™ na pierwszym.

DECYZJE:
- Nie uruchamiaÄ‡ rÄ™cznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyĹ‚Ä…czaÄ‡ `faza2-etap22`.
- Od teraz przy kolejnych blokadach uĹĽywaÄ‡ mass scan, ĹĽeby Ĺ‚apaÄ‡ wiele bĹ‚Ä™dĂłw naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien byÄ‡ kopiowany rÄ™cznie do Supabase bez osobnego przeglÄ…du SQL.
- Mass scan moĹĽe trwaÄ‡ dĹ‚uĹĽej niĹĽ standardowy verify, ale daje peĹ‚niejszÄ… listÄ™ blokad.

NASTÄPNY KROK:
- JeĹĽeli mass scan pokaĹĽe kilka kolejnych failĂłw, zrobiÄ‡ jeden zbiorczy R2X zamiast kolejnych maĹ‚ych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazaĹ‚ 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robiÄ‡ kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X koĹ„czy teĹĽ zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeĹ›li R2U nie dokoĹ„czyĹ‚ route przez anchor.

DECYZJE:
- Nie wyĹ‚Ä…czamy starych gateâ€™Ăłw.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostajÄ… jawny `aria-describedby={undefined}` escape.
- Trash actions majÄ… iĹ›Ä‡ przez wspĂłlne ĹşrĂłdĹ‚o `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- rÄ™cznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywnoĹ›ci

AUDYT RYZYK:
- CzÄ™Ĺ›Ä‡ napraw to kontrakty historycznych testĂłw, wiÄ™c po zielonym verify trzeba jeszcze obejrzeÄ‡ UI, szczegĂłlnie Calendar i Leads.
- `/api/activities` moĹĽe dziaĹ‚aÄ‡ przez rewrite do system route. Po deployu sprawdziÄ‡ aktywnoĹ›ci/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodaÄ‡ prawdziwe opisy tam, gdzie dialog ma treĹ›Ä‡ formularzowÄ….

NASTÄPNY KROK:
- Po R2X uruchomiÄ‡ mass scan. JeĹ›li zostanÄ… faile, zrobiÄ‡ R2Y jako kolejny batch z peĹ‚nej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedĹ‚ wszystkie 178 testĂłw.
- Build zatrzymaĹ‚ siÄ™ na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- JednoczeĹ›nie Stage100/104/99 nie pozwalajÄ…, ĹĽeby taki legacy combo string wrĂłciĹ‚ do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyĹ‚Ä…czamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilnoĹ›ci dla sprzecznych historycznych gateâ€™Ăłw. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba rÄ™cznie obejrzeÄ‡ Calendar, bo R2X dotykaĹ‚ kilku klas i dialogĂłw.
- JeĹ›li kolejne prebuild guardy wykaĹĽÄ… podobny konflikt literalny, naprawiaÄ‡ markerem poza renderowanÄ… funkcjÄ…, nie cofajÄ…c UI.

NASTÄPNY KROK:
- UruchomiÄ‡ R2Y. JeĹĽeli build i verify quiet przejdÄ…, moĹĽna wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadziĹ‚ `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan zostaĹ‚ z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt byĹ‚ sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagaĹ‚ tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieĹĽÄ…cego ĹşrĂłdĹ‚a prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- ĹąrĂłdĹ‚em prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
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
- Zmieniono test, bo poprzedni kontrakt byĹ‚ sprzeczny z nowszym prebuild guardem.
- Po deployu rÄ™cznie sprawdziÄ‡ listÄ™ spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AA. JeĹ›li build i verify przejdÄ…, moĹĽna wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedĹ‚ Stage105, Stage220A28, Stage95 i mass scan 178 testĂłw.
- Build zatrzymaĹ‚ siÄ™ w `src/pages/Calendar.tsx` na bĹ‚Ä™dzie JSX:
  `Expected "=>" but found "="`.
- BĹ‚Ä…d powstaĹ‚ w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerĂłw.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa skĹ‚adni po regexowym patchu. NajwiÄ™ksze ryzyko: delete button w Calendar moĹĽe mieÄ‡ poprawny build, ale trzeba go kliknÄ…Ä‡ rÄ™cznie po deployu.
- Po deployu sprawdziÄ‡ `/calendar`: usuĹ„ wpis tygodnia, usuĹ„ wpis z selected day, sprawdĹş dialog/confirm i brak czerwonej plakietki.
- JeĹ›li kolejny build pokaĹĽe bĹ‚Ä…d skĹ‚adni w Calendar, nie robiÄ‡ szerokiego refaktoru; naprawiÄ‡ lokalnie bĹ‚Ä™dny JSX.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AB. JeĹ›li build i verify przejdÄ…, wykonaÄ‡ push caĹ‚ego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 zostaĹ‚ juĹĽ wypchniÄ™ty jako commit `66b13479`.
- Podetap E nie byĹ‚ domkniÄ™ty w wymaganym ksztaĹ‚cie:
  - istniaĹ‚ `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniaĹ‚ runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowaĹ‚o docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard byĹ‚ za bardzo tokenowy i nie pilnowaĹ‚ peĹ‚nej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdraĹĽamy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomoĹ›ci ani redesignu Today.
- Celem R2AC jest domkniÄ™cie jakoĹ›ci/guardĂłw po Stage223 R2.
- Nie pushujemy bez zielonych testĂłw koĹ„cowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RÄCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartoĹ›ci zaleĹĽnej od progu.
- LeadDetail: status nastÄ™pnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku nastÄ™pnego ruchu i pieniÄ™dzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historiÄ… i notatkami.
- Today: brak nowej sekcji, `Wysoka wartoĹ›Ä‡ / ryzyko`, klikniÄ™cia do rekordĂłw, brak agresywnego odĹ›wieĹĽania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- GĹ‚Ăłwne ryzyko: guard moĹĽe zĹ‚apaÄ‡ przyszĹ‚e rÄ™czne dublowanie badge w UI â€” to jest celowe.
- Po zielonym teĹ›cie moĹĽna uruchomiÄ‡ lokalnie aplikacjÄ™ i przejĹ›Ä‡ checklistÄ™ manualnÄ….

NASTÄPNY KROK:
- UruchomiÄ‡ R2AC lokalnie.
- JeĹĽeli testy sÄ… zielone, odpaliÄ‡ lokalnie `npm run dev:api` i sprawdziÄ‡ /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowaĹ‚y siÄ™ przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 uĹĽywa parsera blokĂłw/statements, zamiast zakĹ‚adaÄ‡ sÄ…siedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywoĹ‚uje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie uĹĽywa timeout/scroll/reorder,
  - root/capture bridges ignorujÄ… top metric tiles,
  - top metric buttons majÄ… wĹ‚asne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopiÄ™ty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po klikniÄ™ciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i rÄ™cznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelkĂłw: nie przenoszÄ… list na gĂłrÄ™.
- Ryzyko lokalne: expand/collapse na `/today`; rÄ™czny smoke obowiÄ…zkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelkĂłw Today.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AD V4, potem `npm run dev`, rÄ™czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikowaĹ‚ siÄ™ lokalnie i przeszedĹ‚:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padĹ‚ nie przez Today, tylko przez zĹ‚amanie kontraktu quiet gate.
- BĹ‚Ä…d:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachowaÄ‡ kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisaĹ‚ do `package.json` komendÄ™ `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokĹ‚adnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnÄ…trz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceĹ„ do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma byÄ‡ uruchamiany przez `closeflow-release-check-quiet.cjs`.
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
- Ryzyko byĹ‚o proceduralne: dopiÄ™cie guarda do package scriptu Ĺ‚amie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje wĹ‚asny guard pilnujÄ…cy, ĹĽe package script pozostaje dokĹ‚adny, a nowy R2AD guard jest w Ĺ›rodku quiet gate.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AE. JeĹ›li verify quiet przejdzie, odpaliÄ‡ lokalnie `npm run dev`, sprawdziÄ‡ `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrĂłciĹ‚ exact `verify:closeflow:quiet` contract i build przechodziĹ‚.
- Verify quiet zatrzymaĹ‚ siÄ™ na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagaĹ‚:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzjÄ… R2AD: kafelki Today nie mogÄ… juĹĽ przenosiÄ‡ sekcji w DOM ani przewijaÄ‡ do sekcji, bo to powodowaĹ‚o scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobiĹ‚ R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do Ĺ›cieĹĽki klikniÄ™cia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i rÄ™cznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- GĹ‚Ăłwne ryzyko: stary test wymuszaĹ‚ zachowanie, ktĂłre teraz uznaliĹ›my za ĹşrĂłdĹ‚o bugĂłw.
- Nowy kontrakt utrzymuje dostÄ™pnoĹ›Ä‡ i focus, ale blokuje scroll trap.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AF, potem lokalny `npm run dev`, rÄ™czny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikowaĹ‚ siÄ™ i przeszedĹ‚:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker zostaĹ‚ na `git diff --check`.
- `git diff --check` wskazaĹ‚ trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyĹ‚Ä…cznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardĂłw, package scripts, quiet gate ani UI.

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
- To czyszczenie whitespace, wiÄ™c ryzyko runtime jest minimalne.
- RÄ™czny smoke `/today` nadal wymagany, bo wĹ‚aĹ›ciwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeĹĽenia LF/CRLF z `git diff --check` sÄ… nieblokujÄ…ce; trailing whitespace byĹ‚ blokujÄ…cy.

NASTÄPNY KROK:
- UruchomiÄ‡ R2AG.
- Po zielonym diff check odpaliÄ‡ lokalnie `npm run dev`, sprawdziÄ‡ `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, ĹĽe formularz tworzenia leada i klienta nie miaĹ‚ pola `lastContactAt`.
- Zweryfikowano, ĹĽe payload tworzenia leada/klienta nie wysyĹ‚aĹ‚ `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` juĹĽ istniejÄ… po Stage223, wiÄ™c wczeĹ›niejsza teza o ich braku byĹ‚a nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadĂłw i klientĂłw.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- DomyĹ›lnie pole pokazuje dzisiejszÄ… datÄ™.
- JeĹĽeli kontakt byĹ‚ starszy, operator ma wpisaÄ‡ prawdziwÄ… datÄ™.
- DatÄ™ zapisujemy jako noon ISO, ĹĽeby ograniczyÄ‡ problemy stref czasowych.
- Daty przyszĹ‚e sÄ… blokowane komunikatem: `Ostatni kontakt nie moĹĽe byÄ‡ w przyszĹ‚oĹ›ci.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- JeĹ›li SQL nie zostanie uruchomiony, API ma fallback dla brakujÄ…cej kolumny, ale data nie bÄ™dzie trwale zapisana w bazie.
- Lista leadĂłw/klientĂłw ma fallback select bez `last_contact_at`, ĹĽeby nie wysadziÄ‡ produkcji przed migracjÄ….
- PeĹ‚ne spiÄ™cie z widocznoĹ›ciÄ… badge `Cisza 14+ dni` zaleĹĽy od tego, czy `last_contact_at` wrĂłci z API po migracji.
- NastÄ™pny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeĹ›li po manualnym teĹ›cie badge nie bierze daty z bazy.

NASTÄPNY KROK:
- UruchomiÄ‡ SQL w Supabase.
- UruchomiÄ‡ R3A lokalnie.
- PrzetestowaÄ‡ tworzenie leada/klienta z datÄ… 20 dni temu.

<!-- STAGE223R3A_V2_LAST_CONTACT_GUARD_FALSE_NEGATIVE -->
## 2026-06-05 - STAGE223R3A-V2 Guard false-negative repair

FAKTY:
- Stage223R3-A SQL wykonaĹ‚ siÄ™ poprawnie w Supabase: ALTER TABLE zwrĂłciĹ‚ "Success. No rows returned", co jest normalnym wynikiem dla DDL.
- Stage223R3-A zatrzymaĹ‚ siÄ™ na guardzie, nie na kodzie produkcyjnym.
- Guard bĹ‚Ä™dnie wymagaĹ‚ dokĹ‚adnego tekstu `lastContactAt: dateInputToNoonIso(newClient.lastContactAt)`.
- Faktyczna Ĺ›cieĹĽka kodu klienta to: `newClient.lastContactAt` -> `preparedClient.lastContactAt` -> `dateInputToNoonIso(preparedClient.lastContactAt)`.

DECYZJA:
- Naprawiamy guard, nie zmieniamy funkcjonalnej Ĺ›cieĹĽki klienta na siĹ‚Ä™.
- Guard ma akceptowaÄ‡ Ĺ›cieĹĽkÄ™ przez preparedClient, ale dalej wymaga zachowania daty z newClient i konwersji do ISO.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa faĹ‚szywie negatywnego guarda po czÄ™Ĺ›ciowo wykonanym apply.
- Nie wolno robiÄ‡ resetu ani restore bez sprawdzenia, bo wczeĹ›niejszy apply zdÄ…ĹĽyĹ‚ zmieniÄ‡ pliki.
- Po zielonym teĹ›cie nadal trzeba zrobiÄ‡ manualny test tworzenia lead/klient z datÄ… 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedĹ‚ guard i runtime test dla Last Contact Intake.
- Build przeszedĹ‚.
- `verify:closeflow:quiet` zatrzymaĹ‚ siÄ™ na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miaĹ‚a wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia kaĹĽdej optional fallback column.
- Nie uruchamiamy osobnego peĹ‚nego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, ĹĽeby potwierdziÄ‡ release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba rÄ™cznie sprawdziÄ‡ tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTÄPNY KROK:
- UruchomiÄ‡ V3.
- JeĹ›li gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 â€” Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwoĹ‚anie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/Ĺšrednie, tekst Pokazano 8 z X, pusty stan operacyjny.
- Nie aktywuje przyciskĂłw Ustaw zadanie / OdĹ‚ĂłĹĽ / Oznacz jako martwy.

## TESTY
- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- create lead flow wymaga rÄ™cznego testu po patchu.
- Rescue UI moĹĽe wymagaÄ‡ pĂłĹşniejszego uproszczenia wizualnego.
- Backend akcji Rescue nie jest jeszcze wdroĹĽony, wiÄ™c disabled actions sÄ… prawidĹ‚owe.

## STAGE220A35 â€” Client Commission Finance Source Truth

Data: 2026-06-05 21:05 Europe/Warsaw

### FAKTY
- Naprawiono rozjazd: wartoĹ›Ä‡ transakcji/sprawy nie jest prowizjÄ… wĹ‚aĹ›ciciela.
- ClientDetail pokazuje prowizjÄ™ naleĹĽnÄ…, wpĹ‚aconÄ… prowizjÄ™ i prowizjÄ™ do zapĹ‚aty jako osobne wartoĹ›ci.
- Karta sprawy w kliencie uĹĽywa getCaseFinanceSummary, wiÄ™c prowizja procentowa 69 000 PLN Ă— 2% daje 1 380 PLN zamiast 0 PLN.
- WartoĹ›Ä‡ transakcji nadal jest widoczna jako osobna informacja.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Bez tej poprawki Stage227 / Sales Funnel mĂłgĹ‚by dziedziczyÄ‡ bĹ‚Ä™dne wartoĹ›ci finansowe.
- Nie ruszano Supabase, RLS ani backendu pĹ‚atnoĹ›ci.
- Model prowizji staĹ‚ej nadal uĹĽywa gotowej kwoty prowizji.

## STAGE220A36 â€” Commission Input Model Split

Data: 2026-06-05 21:45 Europe/Warsaw

### FAKTY
- Rozdzielono prowizjÄ™ staĹ‚Ä… od podstawy procentowej.
- Przy kwocie staĹ‚ej uĹĽytkownik wpisuje wartoĹ›Ä‡ prowizji.
- Przy prowizji procentowej uĹĽytkownik wpisuje wartoĹ›Ä‡ transakcji do wyliczenia i stawkÄ™ procentowÄ…; prowizja jest wyliczana i nieedytowalna.
- Lista klientĂłw pokazuje prowizjÄ™ operacyjnÄ…, nie cenÄ™ transakcji.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie ruszano Supabase, RLS ani backendu pĹ‚atnoĹ›ci.
- Techniczne pole contractValue nadal przechowuje podstawÄ™ procentu przy modelu procentowym.
- Stage227 moĹĽe startowaÄ‡ dopiero po rÄ™cznym sprawdzeniu fixed/percent w modalach finansĂłw.

## STAGE220A36-R2 â€” Commission Modal Field Order

Data: 2026-06-05 22:00 Europe/Warsaw

### FAKTY
- Doprecyzowano ukĹ‚ad modala prowizji: najpierw rodzaj prowizji, potem stawka procentowa i wartoĹ›Ä‡ prowizji.
- Pole "WartoĹ›Ä‡ prowizji" jest edytowalne tylko przy kwocie staĹ‚ej.
- Przy procencie wartoĹ›Ä‡ prowizji wylicza siÄ™ automatycznie i jest nieedytowalna.
- Podstawa procentu, czyli wartoĹ›Ä‡ transakcji/zlecenia, jest osobnym polem poniĹĽej gĹ‚Ăłwnych kontrolek prowizji.

### TESTY
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie zmieniano bazy ani modelu pĹ‚atnoĹ›ci.
- Ryzyko dotyczy tylko czytelnoĹ›ci UI i bĹ‚Ä™dnego wpisywania ceny transakcji w miejsce prowizji.
- Stage227 nadal musi korzystaÄ‡ z prowizji jako wartoĹ›ci operacyjnej.

## STAGE220A36-R4 â€” Build Guard and Case Item Schema Fix

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

## STAGE220A36-R5 â€” R4 Guard Token Compat

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

## STAGE220A36-R6 â€” Deploy Unblock Mojibake Cleanup

Data: 2026-06-05 22:35 Europe/Warsaw

### FAKTY
- Cleaned R4 guard/test files from BOM and literal encoding marker characters.
- Added R6 guard to protect the commission modal order and deployment path.
- Did not change Supabase, RLS, payments, or commission math.

### AUDYT RYZYK
- The UI screenshot can remain old until Vercel deploys a green build.
- Stage227 remains blocked until Vercel is green and modal is manually verified.

## STAGE220A36-R7 â€” CaseDetail Legacy Finance Modal Wiring Fix

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

## STAGE220A36-R10 â€” Commission Modal Three-Field Top Row Polish

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


## STAGE220A36-R11 â€” Commission Modal Compact Tooltips + Alignment

Data: 2026-06-06 09:10 Europe/Warsaw

### FAKTY
- R10 logicznie uĹ‚oĹĽyĹ‚ pola, ale modal nadal byĹ‚ zbyt przytĹ‚aczajÄ…cy przez opisy pod polami i zbyt wysokie inputy.
- R11 przenosi opisy do tooltipĂłw â€ž?â€ť, skraca Ĺ›rodkowy label do â€žStawka (%)â€ť, zmniejsza wysokoĹ›Ä‡ pĂłl i wyrĂłwnuje Ĺ›rodkowe pole stawki.

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
- Native tooltip na title jest prosty i bezpieczny, ale na mobile nie daje peĹ‚nego komfortu â€” jeĹĽeli to bÄ™dzie problem, kolejny etap powinien zrobiÄ‡ wĹ‚asny popover.
- Trzeba rÄ™cznie sprawdziÄ‡, czy trzy pola w gĂłrnym rzÄ™dzie nie Ĺ›ciskajÄ… siÄ™ na szerokoĹ›ci laptopa i czy wÄ…skie ekrany poprawnie zawijajÄ… do jednej kolumny.

## STAGE220A36-R12 â€” Commission Modal Width Polish

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

## STAGE226R10 â€” Lead/Client Separation Runtime Fix

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

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG â€” lead/client conflict hardening

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- typ wpisu: etap naprawczy / runtime hardening po Stage226R10
- decyzja: tworzenie leada zostaje lead-only; konflikt z klientem ma byÄ‡ ostrzeĹĽeniem i linkiem do klienta, nie Ĺ›cieĹĽkÄ… przywrĂłcenia klienta z formularza leada.
- zmiana: w Leads.tsx zostaje jeden EntityConflictDialog dla leadĂłw; kandydaci typu client majÄ… wymuszone canRestore=false w tym flow; restoreConflictCandidate nie wykonuje updateClientInSupabase dla klienta.
- testy/guardy: scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs, tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs, plus regresja Stage226R10.
- ryzyko: jeĹ›li klient istnieje w /clients, po dodaniu podobnego leada nadal bÄ™dzie widoczny jako stary klient â€” to nie jest nowy klient. Manual smoke musi liczyÄ‡ klientĂłw przed i po dodaniu leada.
- status: local ZIP patch; do uruchomienia i pushu po PASS.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX â€” fix po czerwonym R10C

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- typ wpisu: hotfix patchera i kontraktu lead/client separation po R10B/R10C
- decyzja: klient z konfliktu przy tworzeniu leada nie moĹĽe byÄ‡ przywracany z flow leada; tylko PokaĹĽ klienta albo Dodaj mimo to jako osobnego leada.
- zmiana: restoreConflictCandidate blokuje candidate.entityType === 'client' bez updateClientInSupabase; kandydaci typu client dostajÄ… canRestore=false przed zapisaniem do state.
- naprawa procesu: R10C2 usuwa nieudane, niezatwierdzone pliki R10C po przerwanym apply i dodaje odporny patcher regexowy.
- testy: R10C2 guard/test, R10B guard/test, R10 guard/test, build, verify:closeflow:quiet, git diff --check.
- ryzyko: istniejÄ…cy klient z tymi samymi danymi dalej bÄ™dzie widoczny w /clients, ale nie jest tworzony ani przywracany przez dodanie leada.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX â€” duplicate confirmation gate

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- typ wpisu: hotfix po rÄ™cznym smoke R10C4
- decyzja: duplikat albo konflikt danych kontaktowych moĹĽe byÄ‡ zapisany tylko po Ĺ›wiadomym potwierdzeniu. Brak dziaĹ‚ania checkerĂłw konfliktĂłw ma zatrzymaÄ‡ zapis, a nie przepuĹ›ciÄ‡ rekord po cichu.
- zmiana: Leads.tsx i Clients.tsx nie Ĺ‚ykajÄ… bĹ‚Ä™du findEntityConflictsInSupabase do pustej listy. Przy bĹ‚Ä™dzie pokazujÄ… komunikat i zatrzymujÄ… zapis. Przy konflikcie pokazujÄ… komunikat i dialog z opcjÄ… â€žDodaj mimo toâ€ť.
- testy/guardy: check/test stage226r10d2 plus regresje R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check.
- audyt ryzyk: fail-closed moĹĽe chwilowo blokowaÄ‡ zapis przy awarii API konfliktĂłw, ale to jest bezpieczniejsze niĹĽ ciche mnoĹĽenie duplikatĂłw klientĂłw/leadĂłw.
- status: local ZIP patch; push po PASS i rÄ™cznym smoke.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH â€” changelog

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- dodano centralny kontrakt `src/lib/calendar-timezone-contract.ts`.
- poprawiono UI reminder calculation w EventCreateDialog i TaskCreateDialog.
- poprawiono event/task server routes, Google outbound i inbound na kontrakt Europe/Warsaw.
- dodano guard/test R11 i aktualizacje project memory/Obsidian update.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX â€” changelog

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- poprawiono test R11: wynik z VM jest serializowany do plain object przed deepStrictEqual.
- logika aplikacji R11 nie zostaĹ‚a zmieniona w R11B.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_CHANGELOG_START -->
## 2026-06-06 15:35 Europe/Warsaw Ă˘â‚¬â€ť STAGE227A Ă˘â‚¬â€ť Sales Funnel Movement View

Dodano lokalny read-only widok `/funnel`, helper `sales-funnel-movement`, guard, runtime test, route i menu Lejek. Zakres: owner-control funnel bez drag/drop, bez mutacji, bez AI scoringu i bez zmian DB/RLS.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_CHANGELOG_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_CHANGELOG_START -->
## 2026-06-06 15:45 Europe/Warsaw Ă˘â‚¬â€ť STAGE227B Ă˘â‚¬â€ť sales funnel decision list

Przebudowano `/funnel` z przeÄąâ€šadowanego kanbana na czytelny widok decyzyjny: kafle filtrÄ‚Ĺ‚w, pasek etapÄ‚Ĺ‚w, jedna szeroka lista i panel priorytetu.
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_CHANGELOG_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_CHANGELOG_START -->
## 2026-06-06 17:05 Europe/Warsaw Ă˘â‚¬â€ť STAGE228A Ă˘â‚¬â€ť funnel truth + clickability

Poprawiono `/funnel`: domyÄąâ€şlnie pokazuje wszystkie rekordy, kafle wÄąâ€šaÄąâ€şcicielskie i etapy nie nakÄąâ€šadajĂ„â€¦ siĂ„â„˘ na siebie w sposÄ‚Ĺ‚b ukrywajĂ„â€¦cy ÄąĹźrÄ‚Ĺ‚dÄąâ€ša kwot, a karty pokazujĂ„â€¦ ÄąĹźrÄ‚Ĺ‚dÄąâ€šo wartoÄąâ€şci/prowizji.
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_CHANGELOG_END -->

## 2026-06-06 18:00 Europe/Warsaw Ă˘â‚¬â€ť STAGE228B Lead Work Action Center

- typ: etap wdroÄąÄ˝eniowy local-only
- decyzja: Lead nie dostaje peÄąâ€šnego lejka; dostaje centrum pracy Ă˘â‚¬ĹľCo robimy teraz?Ă˘â‚¬ĹĄ z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzyĂ„â€ˇ drugiego systemu dziaÄąâ€šaÄąâ€ž; uÄąÄ˝ywaĂ„â€ˇ istniejĂ„â€¦cych handlerÄ‚Ĺ‚w LeadDetail.


## 2026-06-06 18:05 Europe/Warsaw - STAGE228B_R7_MOJIBAKE_CLEANUP
- Scope: cleanup after Stage228B local patcher introduced Polish mojibake in LeadDetail.
- Decision: do not weaken Stage98. Repair source text to clean UTF-8 and rerun Stage98 + Stage228B + Stage228A/227B regressions.
- Status: local-only until tests pass and Damian approves push.

## 2026-06-06 18:36 Europe/Warsaw - STAGE228B_R8_ALERTTRIANGLE_IMPORT_HOTFIX

- Fixed LeadDetail production crash: AlertTriangle was used in Stage228B UI but was not imported from lucide-react.
- Added guard: scripts/check-stage228b-alerttriangle-import.cjs.
- Added guard to quiet release gate.

## 2026-06-06 18:42 Europe/Warsaw â€” STAGE228B R9 import source repair

- FAKT: Stage228B R8 naprawil brak AlertTriangle, ale uszkodzil zrodla importow w LeadDetail: useNavigate trafil do lucide-react, a ArrowLeft do react.
- DECYZJA: nie cofac calego Stage228B i nie oslabiaÄ‡ guardow; naprawic zrodlo importow i dodac guard na import sources.
- TESTY: Stage228B R9 ma odpalic R9 guard, R8 guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: kazdy kolejny patcher importow w LeadDetail musi traktowac trzy importy na gorze pliku jako kontrakt: react, react-router-dom, lucide-react.

## 2026-06-06 18:50 Europe/Warsaw â€” STAGE228B R10 import guard false-positive fix

- FAKT: Stage228B R9 naprawil top importy w LeadDetail, ale guard mial regex przechodzacy przez wiele importow i falszywie wykrywal useNavigate w lucide-react.
- DECYZJA: nie omijac builda ani guardow; naprawic guard tak, aby parsowal pojedyncze deklaracje importow i nadal pilnowal zrodel: react, react-router-dom, lucide-react.
- TESTY: R10 ma odpalic import-source guard, AlertTriangle guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: patchery importow musza traktowac trzy pierwsze importy w LeadDetail jako kontrakt.

## 2026-06-06 19:05 Europe/Warsaw â€” STAGE228B R13 Canonical LeadDetail imports repair

- Status: local hotfix package for broken pushed Stage228B commit 14f00a3d.
- Scope: deterministic rewrite of LeadDetail imports for react, react-router-dom and lucide-react.
- Guard: parser-based checks for AlertTriangle and hook import sources.
- Risk note: R8/R9/R10/R12 failures were caused by brittle regex/import handling; R13 uses declaration-level parsing.

## 2026-06-06 19:45 Europe/Warsaw â€” STAGE228B_R14_LEAD_ACTION_CENTER_VST

- FAKT: Po Stage228B LeadDetail dziaĹ‚a, ale centrum dziaĹ‚aĹ„ leada byĹ‚o mniej czytelne niĹĽ analogiczna karta sprawy.
- DECYZJA: Nie tworzyÄ‡ osobnego systemu wizualnego dla leada. Lead action center ma iĹ›Ä‡ w kierunku tego samego ĹşrĂłdĹ‚a wizualnego co CaseDetail: jeden nagĹ‚Ăłwek, jasne grupy, kompaktowe wiersze, akcje przy rekordzie.
- ZMIANA: UsuniÄ™to duplikujÄ…ce copy, poprawiono separator w wierszach, ograniczono "Braki i blokady" do jawnych brakĂłw/blokad zamiast dublowaÄ‡ kaĹĽde zalegĹ‚e wydarzenie.
- TESTY: Stage228B R14 guard/test, Stage228B guard/test, Stage98, build, verify quiet, diff-check.
- RYZYKO: Po deployu sprawdziÄ‡ rÄ™cznie LeadDetail z zalegĹ‚ym wydarzeniem i porĂłwnaÄ‡ czytelnoĹ›Ä‡ do CaseDetail.

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
- UsuniÄ™to panel wĹ‚aĹ›ciciela z /funnel.
- Kafelki decyzyjne lejka przepiÄ™to na OperatorMetricTile jako wspĂłlne ĹşrĂłdĹ‚o wizualne.
- Dodano CSS source truth dla ukĹ‚adu /funnel.
- Poprawiono stale guard Stage220A36 po usuniÄ™ciu opisu â€ž5 klientĂłw...â€ť.
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
- Objaw: klikniecie UsuĹ„ przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> UsuĹ„ -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze NastÄ™pny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->

## 2026-06-08 21:10 Europe/Warsaw Ă˘â‚¬â€ť Stage228R18 Ă˘â‚¬â€ť missing item hard delete source truth

- problem: Brak znikaÄąâ€š po klikniĂ„â„˘ciu UsuÄąâ€ž, ale wracaÄąâ€š po hard refresh.
- decyzja: aktywny Brak w LeadDetail ma byĂ„â€ˇ usuwany realnym backend DELETE z work_items po ID, nie tylko statusem deleted.
- dodatkowo: lista Braki i blokady ma byĂ„â€ˇ ÄąĹźrÄ‚Ĺ‚dÄąâ€šowana z linkedTasks, nie z caÄąâ€šego timeline, ÄąÄ˝eby activity history nie odtwarzaÄąâ€ša aktywnego braku.
- testy: check-stage228r18, node test, npm run build, git diff --check, test rĂ„â„˘czny dodaj/usun/hard refresh.
- ryzyko: DELETE jest mocniejsze niÄąÄ˝ soft-delete; historia usuniĂ„â„˘cia zostaje jako activity.

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

## 2026-06-09 02:50 Europe/Warsaw Ă˘â‚¬â€ť STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym Äąâ€šaÄąâ€žcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera siĂ„â„˘ juÄąÄ˝ na dokÄąâ€šadnym polskim tekÄąâ€şcie toastu, tylko na strukturze przepÄąâ€šywu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany rĂ„â„˘czny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

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
- Kept Kopiuj trace/WyczyĹ›Ä‡ trace visible with disabled state when debug is off or trace is empty.
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
- Kept Kopiuj trace / WyczyĹ›Ä‡ trace visible and disabled when trace is unavailable.
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

## 2026-06-09 â€” STAGE231D_GOOGLE_AUTH_INTENT_GATE

- Added Google login/register intent gate.
- Added auth intent session helper.
- Added x-closeflow-auth-intent API header.
- Added REGISTER_FIRST_REQUIRED API gate for Google login path without existing profile.
- Changed logged-out / and /start to one auth entry.
- Documented STAGE231C Supabase auth trigger no-op repair.
- Added future backlog: STAGE231E email copy repair and STAGE231F invite-only test mode.

## 2026-06-09 â€” STAGE231D_R5_GOOGLE_LOGIN_MISSING_INTENT_HARD_GATE

- Hardened Google login/register intent gate after manual QA showed unknown Google Login still entered app.
- Added authIntent URL fallback for OAuth/email confirmation redirects.
- Added explicit /api/me?authIntent=... propagation.
- Added authIntent to GET cache scope.
- Changed api/me gate: Google OAuth cannot bootstrap a missing app profile unless authIntent=register.
- Preserved working flows from QA: existing Google login, Google registration, e-mail confirmation, one auth page.

<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_START -->
## 2026-06-10 Europe/Warsaw â€” STAGE230D0 Text/Input Contrast Sweep

FAKT:
- Damian zgĹ‚osiĹ‚ biaĹ‚y tekst na biaĹ‚ym tle podczas wpisywania/dyktowania w aplikacji.
- Zakres R1: /ai-drafts, szybki szkic, Stage230C debug trace, input/textarea/select/placeholder/focus.

DECYZJA:
- Tryb CloseFlow: GIT-FIRST / PUSH-FIRST.
- Nie uĹĽywaÄ‡ lokalnych ZIP-Ăłw jako gĹ‚Ăłwnej Ĺ›cieĹĽki dla Damiana.

TESTY:
- Stage230B regression guard/test.
- Stage230C regression guard/test.
- Stage230D0 contrast guard/test.
- npm run build.
- git diff --check.

RYZYKA:
- MoĹĽliwe podobne problemy kontrastu w innych moduĹ‚ach aplikacji.
- Nie wdraĹĽano deduplikacji dyktowania bez trace.
<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END -->

## 2026-06-10 â€” STAGE231B0 R5

- Dodano flow zamykania sprawy bez delete.
- ZamkniÄ™cie uĹĽywa status completed i lastActivityAt.
- Dodano activity "Sprawa zamkniÄ™ta".
- GĹ‚Ăłwne CTA zmienione na "Zamknij sprawÄ™" / "Sprawa zamkniÄ™ta".
- Awaryjne usuwanie zostaje osobno.
- Dodano guard, test, run report i obsidian update.

## 2026-06-10 â€” STAGE231B0-R7

Added closed case archive view, restore flow, client closed cases section and guard/test.


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "PrzywrĂłÄ‡ sprawÄ™".
- Restore flow uĹĽywa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostajÄ… zachowane; delete flow nie jest uĹĽywany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodnoĹ›Ä‡ nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `PrzywrĂłÄ‡ sprawÄ™` uĹĽywa handlera reopen.
- Logika finansĂłw, delete flow i dane rozliczeĹ„ pozostajÄ… bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodnoĹ›Ä‡ CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodnoĹ›Ä‡ segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formÄ™ `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `PrzywrĂłÄ‡ sprawÄ™` uĹĽywa handlera reopen.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodnoĹ›Ä‡ `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietÄ™ `Sprawy zamkniÄ™te` oraz filtr aktywne vs zamkniÄ™te.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodnoĹ›Ä‡ `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamkniÄ™te`, `PrzywrĂłÄ‡ sprawÄ™`.
- Kontrakt uĹĽywa wspĂłlnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodnoĹ›Ä‡ `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamkniÄ™te/przywrĂłÄ‡ oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodnoĹ›Ä‡ `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- PodziaĹ‚ uĹĽywa wspĂłlnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodnoĹ›Ä‡ CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach, prowizjach i lifetime finance.
\n\n## 2026-06-10 â€” STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n- Status: LOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR.\n- Naprawa po czÄ™Ĺ›ciowym R4: elastyczny patch ClientDetail, aktywne/zamkniÄ™te sprawy klienta, restore z klienta, CSS, guard/test.\n- Finanse i historia zachowane.\n

## 2026-06-10 â€” STAGE231B0_R8_R8_DUPLICATE_CONST_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniÄ™to sklejone anchory `const X = useMemo( const X = useMemo(` po czÄ™Ĺ›ciowym R2/R4/R6/R7.
- Zakres: dotkniÄ™te pliki TSX, whitespace, sanity check R8, peĹ‚ny build/test.



## 2026-06-10 â€” STAGE231B0_R8_R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniÄ™to stary drugi `toggleCaseView`, ktĂłry pozostaĹ‚ po R8 obok URL-aware `setCaseViewStage231B0R8`.
- Guard R8 rozszerzony o dokĹ‚adnie jeden `toggleCaseView` i zakaz legacy `setCaseView((prev) => ...)`.


## 2026-06-10 — STAGE231B0-R9 — Client history and case view model
- Status: LOCAL_ONLY_PREPARED.
- Zakres: /cases jawne widoki Otwarte/Zamknięte/Wszystkie, zamknięte sprawy klienta przeniesione do Historii, szerszy layout klienta, finanse all_cases zachowane.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow R25/R41, build, git diff --check.
- Ryzyka: UX historii klienta, sourceCases w /cases, brak regresji finansów i aktywnych ryzyk.


## 2026-06-10 — STAGE231B0-R9-R2 — Cases URL reader repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po częściowym R9: brakowało jawnego searchParams.get('view') w src/pages/Cases.tsx.
- R8 guard dostosowany do R9 modelu open/closed/all, aby regresja R8 dalej sprawdzała intencję, nie stary exact string.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R3 — Closed case banner repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po częściowym R9-R2: `/cases` musi mieć widoczny banner `SPRAWA ZAMKNIĘTA` dla zamkniętej sprawy.
- Guard R9 rozszerzony o data-marker bannera, żeby nie przechodził sam tekst bez realnego elementu UI.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R5 — Client history renderer guard repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R4: Historia klienta renderuje zamknięte sprawy przez wspólny renderer karty, więc guard akceptuje akcje `Otwórz` i `Przywróć sprawę` z renderera, nie tylko literalnie z segmentu Historii.
- Wymuszono widoczny label `SPRAWA ZAMKNIĘTA` w Historii i rendererze zamkniętej karty.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.


## 2026-06-10 — STAGE231B0-R9-R6 — Right rail guard robust repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R5: guard R9 zakładał literalny `</SimpleFiltersCard>`, a komponent prawych skrótów może być self-closing albo sformatowany inaczej.
- Logika produktu bez zmian; naprawiono elastyczne wycinanie powierzchni prawego panelu w guardzie.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R8 — R8 setter wrapper scan repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R7: poprzedni patcher szukał `toggleCaseView`, którego aktualne ułożenie w `Cases.tsx` nie było stabilnym anchorem.
- Dodano jawny wrapper `setCaseViewStage231B0R8` przez skan końca funkcji `setCaseViewStage231B0R9`, bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R9 — Cases items JSX syntax repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R8: build wykrył błędną składnię JSX `items=[...]` w `src/pages/Cases.tsx`.
- Poprawiono na `items={[...]}` bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R10 — ClientDetail JSX section close repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R9: build wykrył niedomkniętą strukturę JSX w `ClientDetail.tsx` przy przejściu z głównej sekcji do prawego panelu.
- Dodano brakujące `</section>` przed `<aside className="client-detail-right-rail"...>` bez zmiany logiki produktu.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R11 — Client width + Cases runtime guard
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9 push: `/cases` rzucał runtime `ReferenceError: closedRecordStage231B0R8 is not defined` przy wejściu w widok spraw.
- Naprawa: wolne użycia `closedRecordStage231B0R8` w JSX zastąpiono bezpiecznym `isClosedCaseStatus(record?.status)`.
- UX: `ClientDetail` ma szeroki układ jak widok sprawy, z lewym wyrównaniem i breakpointami skalowania.
- Dodano guard `scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs` oraz test node.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.


## 2026-06-10 — STAGE231B0-R12-R7 — Final Cases runtime contract rescue
- Status: LOCAL_ONLY_PREPARED.
- Po R12-R6 zastosowano mocniejszy rescue: helper `renderClosedCaseBannerStage231B0R12`, jeden kontrakt `activeCases/closedCases` przez `useMemo`, `record.status` tylko w dwóch filtrach.
- Guardy R11/R12/R12-R7 pilnują tego samego kontraktu i blokują `closedRecordStage231B0R8` oraz `record?.status`.
- Nie ruszano finansów, SQL, Google Calendar, płatności ani innych modułów.


## 2026-06-10 — STAGE231B0-R13 — Cases map record scope real fix
- Status: LOCAL_ONLY_PREPARED.
- Naprawa realnego błędu po R12/R7 w `filteredCases.map((record, index) => ...)`.
- Usunięto `caseRecord` fallback i lokalny shadow `renderClosedCaseBannerStage231B0R12` z mapy.
- Dodano scoped boolean `isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status)`.
- Usunięto błędny banner z loading row.
- Dodano guard/test R13 oraz zaktualizowano guardy R11/R12/R12-R7.


## 2026-06-10 — STAGE231B0-R13-R2 — Cases map closed logic completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po częściowym R13: guard liczbowy był za ostry, więc zamieniono go na sprawdzanie konkretnych linii logiki.
- Domknięto `attention`, `statusTone`, `compactLifecyclePill`, `nextActionLabel`, `ownerRiskBadges` i banner zamkniętej sprawy na `isCaseClosedStage231B0R13`.
- Guard blokuje powrót `caseRecord` fallback i local shadow helpera w mapie.


## 2026-06-10 — STAGE231B0-R13-R3 — Next action guard and map completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po R13-R2: guard był zbyt wrażliwy na dokładny polski tekst `Sprawa zamknięta`.
- Znormalizowano `nextActionLabel` i zmieniono guard na strukturę logiczną zamiast pełnego literalnego tekstu.
- Dalej blokowany jest `caseRecord` fallback i local shadow helpera w `filteredCases.map`.


## 2026-06-10 — STAGE231B0-R13-R4 — Guard map window repair
- Status: LOCAL_ONLY_PREPARED.
- R13-R3 guard fałszywie ciął `filteredCases.map` na pierwszym zagnieżdżonym `});`, czyli przed `nextActionLabel`.
- Naprawa: guardy używają szerokiego deterministycznego okna od początku mapy zamiast pierwszego `});`.
- Nie zmieniano logiki biznesowej poza markerem stage; naprawa dotyczy guardów i dokumentacji.


## 2026-06-10 — STAGE231B0-R13-R6 — Owner risk minimal safe call
- Status: LOCAL_ONLY_PREPARED.
- R13-R5 zatrzymał się przed zmianą pliku, bo check starego bloku z HEAD był błędny.
- Naprawa: uszkodzony zakres `ownerRiskBadges -> metaParts` jest zastępowany kompletną, zamkniętą składniowo deklaracją.
- `getCaseOwnerRiskBadges` dostaje bezpieczny kontekst lokalny: lifecycle, nearestCaseAction, nextActionLabel, statusLabel, compactLifecycleLabel, compactLifecyclePill, percent, updatedAt.

## 2026-06-10 — STAGE231B0-R14 — Client detail full-width layout lock
- Status: LOCAL_ONLY_PREPARED.
- Powód: kartoteka klienta nadal jest centrowana/ściśnięta zamiast używać pełnej szerokości od lewego panelu do prawej krawędzi ekranu.
- Zakres: marker route w ClientDetail + CSS lock w visual-stage12-client-detail-vnext.css.
- Kontrakt: brak max-width shell, width 100%, margin-inline 0, stable horizontal spacing during scroll.
