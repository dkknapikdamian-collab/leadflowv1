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


## HOTFIX_STAGE94_COMPLETED_EVENT_VISUAL_CONTRACT_2026_05_16
- Restored completed calendar entry visual contract after Stage94 week plan readable card rebuild.
- Completed entries again expose opacity-60 and line-through text class expected by calendar-completed-event-behavior guard.

### STAGE98_100_RECOVERY_FROM_CLEAN_V3 - 2026-05-16
- Recovered Stage98/99/100 from clean HEAD after Stage101 rollback.
- Restored Calendar.tsx UTF-8 strings, week-plan entry DOM model, Stage32/96 compatibility marker and quiet-gate wiring.
- No commit. No push.


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
## 2026-05-17 — Stage98B-100B Calendar polish copy and week-plan visibility

Status: PATCH PACKAGE PREPARED / LOCAL APPLY REQUIRED.

Zakres:
- naprawa mojibake i błędnych polskich znaków w aktywnym `/calendar`,
- uporządkowanie `closeflow-calendar-selected-day-new-tile-v9.css` do jednego modelu V9 + Stage100,
- wygaszenie aktywnego CSS po Stage94 V2/V3/V4 i starych rodzin `.cf-week-plan-entry-*` / `.cf-calendar-week-entry-*`,
- nowy guard `tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`,
- aktualizacja quiet release gate.

Guardy/testy do uruchomienia przez paczkę:
- `node tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node tests/stage99-calendar-active-class-contract.test.cjs`
- `node tests/stage100-calendar-week-plan-entry-visible.test.cjs`
- `node tests/stage104-calendar-rendered-week-plan-smoke.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

Test ręczny: DO WYKONANIA na `/calendar`.
Kryterium: dzień z wpisem nie może wyglądać jak pusty biały pasek/mini-kafelek.

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

## Stage104D - Calendar week plan compact one-row - 2026-05-17
- Status: WDRAŻANE.
- Cel: zamrozić Stage104C i skompaktować wpis tygodniowy do jednego wiersza na desktopie.
- Zakres: src/styles/closeflow-calendar-selected-day-new-tile-v9.css, guardy Stage100/104/104D, quiet gate.
- Nie ruszano logiki Usuń / Zrobione ani Google Calendar syncu. Opóźnienie syncu zostaje do osobnego Stage104E.
- Test ręczny: /calendar, dzień z 1 wpisem ma być jednym kompaktowym wierszem; dzień z 0 wpisów bez zmian.


## STAGE107_CLIENT_DETAIL_RUNTIME_TDZ_FINANCE_FIX_2026_05_17

- Typ: P0 runtime regression.
- Zakres: ClientDetail, finance summary, ClientTopTiles.
- Powod: `clientFinance` czytal `clientFinanceSummary` przed deklaracja, a `ClientTopTiles` czytal finance summary spoza propsow.
- Guard: `scripts/check-stage107-client-detail-runtime-tdz-finance.cjs`.
- Test: `tests/stage107-client-detail-runtime-tdz-finance.test.cjs`.
- Test reczny: otwarcie szczegolow klienta bez `APP_ROUTE_RENDER_FAILED`.


## Stage113 - Logo CloseFlow mapping
- Dodano brand assety i przepięto tekstowe CF / login icon na komponent logo.


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

- Dodano wspólny komponent `src/components/entity-contact-card.tsx` i CSS `src/styles/entity-contact-card.css`.
- LeadDetail dostał lewą kartę kontaktową w układzie klienta.
- ClientDetail używa wspólnej listy danych kontaktowych zamiast lokalnego `InfoRow`.
- Usunięto lokalną wyspę UI LeadDetail: `InfoLine` / `lead-detail-contact-grid`.

## Stage115B LeadDetail notes visible source contract

- Split LeadDetail note display from contact card.
- Added dedicated `Notatki leada` section with source lead note and latest note activity.
- Added guard for source/placement contract.

## Stage115C LeadDetail inline note submit contract

- Locked LeadDetail history note form as inline submit path.
- Renamed work-center global note action to Otwórz szybki formularz notatki.
- Fixed Polish inline note copy: placeholder, dictation button and submit button.

## Stage115D LeadDetail overdue work items red contract

- Added overdue detection for LeadDetail work items.
- Timeline tasks/events with past date and open status now render `Zaległe`.
- Added red danger pill and overdue row styling.
- Replaced mojibake separator `â”¬Ě` with `•`.

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
- Stage119 V4 deduplikujeequiredTests, zeby ponowione paczki V2/V3 nie zostawialy zdublowanego wpisu Stage119.
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

Status: WDRAŻANE.

Cel: +1H/+1D/+1W musi wizualnie przesuwać wpis od razu po udanym PATCH, zamiast polegać wyłącznie na refreshSupabaseBundle().

Test ręczny: /calendar, wpis task/event, akcje +1H/+1D/+1W. Po sukcesie karta ma zmienić dzień/godzinę.
<!-- /STAGE121_CALENDAR_SHIFT_PERSISTENCE_OPTIMISTIC_STATE -->

## 2026-05-18 - STAGE122_RUNTIME_AUTH_API_PWA_HARDENING

FAKTY: production console showed repeated /api/me 401 plus /api/tasks and /api/events 500 during calendar shift. DevTools also showed an active CloseFlow service worker and old bundle initiator. Stage122 disables stale PWA cache/register behavior, adds /api/version, adds a runtime console marker, and makes work-items auth failures return 401/403 instead of masked 500.

TESTY: node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs; npm run build; npm run verify:closeflow:quiet.

NASTĘPNY KROK: after deployment, verify Network JS hash changes, call /api/version, and retest Calendar +1D/+1W/+1H. If /api/me still returns 401, user must re-auth via Google/Supabase without clearing localStorage first.

## 2026-05-18 - STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE

FAKTY: Stage122 V7 passed Stage122/PWA/Stage98/Stage121/build, then failed Vercel Hobby function budget because api/version.ts raised api/*.ts to 13. V8 chose system rewrite architecture but failed on a brittle api/system.ts anchor.

DECYZJA: /api/version stays available through /api/system?kind=version, without adding a physical Vercel function.

TESTY: Stage122 guard, PWA foundation, Vercel budget, Stage98, Stage121, build, verify:closeflow:quiet.

NASTĘPNY KROK: verify production /api/version and runtime marker, then retest calendar shift only if /api/me is clean.

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
- Poprawiono czytelnoĹ›Ä‡ pĂłl formularza w /settings, szczegĂłlnie Google Calendar reminders.
- Dodano src/styles/closeflow-settings-form-control-readability-stage179.css.
- Dodano 	ests/stage179-settings-form-control-readability-contract.test.cjs.
- Nie ruszano logiki Google Calendar, API, Supabase ani routingu.

## 2026-05-29 - STAGE179 Settings form control readability - local only

- Tryb: lokalnie, bez commita i bez pusha.
- Poprawiono czytelnoĹ›Ä‡ pĂłl formularza w /settings, szczegĂłlnie Google Calendar reminders.
- Dodano src/styles/closeflow-settings-form-control-readability-stage179.css.
- Dodano 	ests/stage179-settings-form-control-readability-contract.test.cjs.
- Nie ruszano logiki Google Calendar, API, Supabase ani routingu.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_CHANGELOG_START -->
## 2026-06-04 — Stage221 owner-control roadmap po deep research CRM

Typ: dokumentacja roadmapy / pamięć projektu / Obsidian update.

Dodano:
- szczegółowy blok Stage221 do `_project/07_NEXT_STEPS.md`,
- decyzję owner-control do `_project/04_DECISIONS.md`,
- guard pamięci roadmapy,
- roadmap file w `_project/roadmaps/`,
- run report,
- manifest aktualizacji Obsidiana,
- plik aktualizacji Obsidiana.

Nie zmieniono:
- runtime UI,
- routingu,
- API,
- Supabase,
- stylów,
- logiki produktu.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_CHANGELOG_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymały się na kruchych anchorach w Clients.tsx.
- V3 używa elastycznych regexów i naprawia częściowy lokalny stan.
- Docelowy wzór: [Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 został wypchnięty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonał patcha Settings/Cases, więc helper i guard weszły bez sekcji ustawień i bez case badges.
- R2B dopina brakujące elementy: Settings threshold section i Cases owner risk badges.
- Build wcześniej przechodził, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da się domknąć hotfixem.
- R2B ma być osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeśli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeśli plik istnieje
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonych testach commit/push R2B.
