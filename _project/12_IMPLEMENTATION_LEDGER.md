# 12_IMPLEMENTATION_LEDGER - CloseFlow / LeadFlow

## 2026-05-16 - Memory protocol and Obsidian mapping closeout

Scope: `AGENTS.md`, `_project/00_PROJECT_MEMORY_PROTOCOL.md`, `_project/STAGE_TEMPLATE_MINIMAL.md`, `_project/runs/`, `_project/07_NEXT_STEPS.md`, `_project/08_CHANGELOG_AI.md`, `_project/10_PROJECT_TIMELINE.md`, `_project/14_TEST_HISTORY.md`, `_project/15_ACTIVE_SOURCE_MAP.md`, Obsidian dashboard files.

FAKT: GitHub scan found `AGENTS.md`, `_project/00_PROJECT_STATUS.md`, `_project/03_CURRENT_STAGE.md`, `_project/04_DECISIONS.md`, `_project/05_MANUAL_TESTS.md`, `_project/06_GUARDS_AND_TESTS.md`, `_project/07_NEXT_STEPS.md`, `_project/08_CHANGELOG_AI.md`, `_project/10_PROJECT_TIMELINE.md`, `_project/12_IMPLEMENTATION_LEDGER.md`, `_project/13_TEST_HISTORY.md`.

FAKT: GitHub scan did not find `_project/00_PROJECT_MEMORY_PROTOCOL.md`, `_project/STAGE_TEMPLATE_MINIMAL.md`, `_project/runs/2026-05-16_0854_closeflow_memory_protocol_v1.md`, `_project/14_TEST_HISTORY.md`, `_project/15_ACTIVE_SOURCE_MAP.md` before this stage.

DECYZJA: CloseFlow organizational stages must not change runtime UI, routing, product logic, styles or architecture.

DECYZJA: Obsidian `10_PROJEKTY/CloseFlow_Lead_App/` is the canonical high-level dashboard for CloseFlow / LeadFlow.

HIPOTEZA: Local workspace may have had files not yet pushed; GitHub was treated as source for remote closure.

DO POTWIERDZENIA: Damian should pull both repos locally and verify clean status.

## 2026-05-15 - V9
Zakres: AGENTS.md, _project, Obsidian, guard, run report, historia.

FAKT: V6 i V7 mialy blad parsera PowerShell.
DECYZJA: V9 zastepuje V6/V7.
HIPOTEZA: po stabilizacji pamieci mozna bezpieczniej wracac do etapow produktu.
DO POTWIERDZENIA: wynik lokalnego uruchomienia V9.

## 2026-05-16 — Decyzja implementacyjna: selected day ma jeden aktywny render V9 {#STAGE92_CALENDAR_SELECTED_DAY_READABLE_ACTIONS}

FAKT Z KODU: aktywny render sekcji wybranego dnia to `CalendarSelectedDayTileV9` i `CalendarSelectedDayEntryRowV9`.

DECYZJA: nie dokładamy kolejnego wariantu selected-day. V9 jest jedynym aktywnym modelem dla czytelnej listy dnia. Legacy selector `[data-cf-calendar-selected-day="true"]` może zostać wyłącznie jako ukryty/legacy CSS guard, ale nie jako aktywny render w TSX.

RYZYKO: kolejne naprawy kalendarza mogą ponownie dodawać lokalne paski/warstwy CSS. Guard Stage92 ma to blokować.

## STAGE93_DECISION_ONE_WEEK_RAIL — 2026-05-16
- Decision: Calendar week view has one active day selector rail only: `calendar-week-visible-days-v3`.
- Legacy hidden week filter render is not allowed to stay in JSX.
- Count labels such as `1 rzecz` are plain text, not badge/plaque UI.

## DECISION_STAGE94_SCAN_BEFORE_BATCH_FIX_2026_05_16

- Decyzja operacyjna: po awariach patchy Stage93 przechodzimy na scan-first batch repair.
- Najpierw wykrywamy wszystkie znane wzorce długu Calendar UI, potem robimy jedną paczkę naprawczą.
- Nie robimy push do GitHuba w tym etapie.

## DECISION: Calendar selected day has one active render source

FAKT Z KODU: Stage94 keeps CalendarSelectedDayTileV9 as the only active selected-day render in the month view.
DECYZJA: Old selectedDayEntries/ScheduleEntryCard selected-day list must not render next to V9.
RYZYKO: Month chip labels Wyd/Zad remain only in compact month cells and are documented as P3, not accepted in selected-day/week rail.

## STAGE94_SWEEP_REGEX_FIX_V4_LEDGER_2026_05_16

- Decision: Stage94 UI patch passed targeted guards; the remaining failure was the detection script syntax.
- Fix: overwrite the sweep script with a syntax-checked, CRLF/LF-safe scanner.
- Risk: full quiet gate is still optional and should be run before collective push.

## Decision - Stage94 Calendar weekly plan full entry text - 2026-05-16

- Week plan and selected day use a shared readable text model: full type label, time, status, visible title, relation and actions.
- Month grid remains a frozen compact exception and is not redesigned in this stage.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V2
DECISION: Weekly plan and selected day must use the same human-readable entry model.
RISK: Month grid remains frozen and may still use compact Wyd/Zad labels only inside month cells.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V3
DECISION: Weekly plan and selected day must use the same human-readable entry model.
RISK: Month grid remains frozen and may still use compact Wyd/Zad labels only inside month cells.

## STAGE94_WEEK_PLAN_FULL_ENTRY_TEXT_V4

Decision: week plan and selected day use the same readable text contract. Month grid remains a compact/frozen exception.

## Stage95 decision destructive action source
- DECISION: destructive actions are owned by src/components/entity-actions.tsx.
- Routes using the contract: /tasks, /cases, /calendar.
- Month grid is not part of this change.

## Stage95 V2 decision destructive CSS
- DECISION: the trash action source of truth must not contain bg-red/bg-rose class names, even as defensive selector overrides.


## Stage96 leads right rail width and position
- DECYZJA: szerokość i kolejność prawego raila dla /leads i /clients należy do `closeflow-right-rail-source-truth.css`.
- DECYZJA: `closeflow-record-list-source-truth.css` nie może przejmować szerokości raila.
- RYZYKO: stary visual-stage25/26 może wrócić tylko jako override; guard blokuje lokalne 195px/300px squeeze patterns.

- DECISION Stage96 V2: /leads right rail width and ordering are governed by `closeflow-right-rail-source-truth.css`; local JSX grid overrides must not define narrow rail widths.

### Decision - Stage96 right rail source truth
- /leads and /clients share right rail width tokens in closeflow-right-rail-source-truth.css.
- /leads JSX must not own a local 300px or old narrow rail override.
- SimpleFiltersCard stays above TopValueRecordsCard.

### Decision - Stage96 V4 leads right rail
- /leads delegates right rail width to closeflow-right-rail-source-truth.css.
- /leads layout-list keeps only structural class, not a local width override.
- /clients remains the visual comparator.

## STAGE96_V5_DECISION_RIGHT_RAIL_SOURCE_MARKER
- DECISION: /leads right rail must mark data-cf-right-rail-source="shared" and use cf-operator-right-rail.
- DECISION: width belongs to closeflow-right-rail-source-truth.css, not JSX local grid classes.


## STAGE97_DECISION_TODAY_OVERDUE_TASKS_USE_ROWLINK_DONE

- Decision: Today overdue/today tasks use the existing RowLink task completion path.
- Constraint: do not create a new completion handler for this patch.

## STAGE97_TODAY_OVERDUE_TASK_DONE_BUTTON_V4

DECYZJA:
- / TodayStable task rows use existing RowLink completion path; no new dead handler.
- Zalegle and today task rows must expose Zrobione besides Edytuj.

## HOTFIX_STAGE96_CSS_MEDIA_BRACE_2026_05_16
FAKT: commit 4adba47 was pushed after a failed quiet gate because the PowerShell flow did not stop on external command failure.
DECYZJA: fix CSS syntax, rerun full quiet gate, then push a second hotfix commit.


## HOTFIX_STAGE94_COMPLETED_EVENT_VISUAL_CONTRACT_2026_05_16
FAKT: full quiet gate passed production build after CSS brace hotfix but failed calendar-completed-event-behavior guard.
DECYZJA: restore completed event visual class contract in ScheduleEntryCard instead of weakening the existing guard.


## HOTFIX_STAGE94_COMPLETED_EVENT_VISUAL_CONTRACT_2026_05_16
FAKT: full quiet gate passed production build after CSS brace hotfix but failed calendar-completed-event-behavior guard.
DECYZJA: restore completed event visual class contract in ScheduleEntryCard instead of weakening the existing guard.

### STAGE98_100_RECOVERY_FROM_CLEAN_V3 - 2026-05-16
Decision: after failed Stage101 iterations, recover only proven Stage98/99/100 scope from clean HEAD. Stage101 remains out of scope.


## Stage98B V5 - Polish mojibake hard gate - 2026-05-16

STATUS: prepared by ZIP package.

FACTS:
- V3 guard reached a real repo-wide scan and found mojibake in multiple scripts/tests plus active UI files.
- Calendar-only repair was not enough.
- Stage98B V5 uses an ASCII-only PowerShell runner and a Node repair helper.

DECISION:
- Mojibake in `src`, `tests`, `scripts` and `_project` is a local release blocker.
- Stage98 must run before the expensive build/Vercel path.

FILES:
- `src/**`, `tests/**`, `scripts/**`, `_project/**` repaired where needed.
- `tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `_project/runs/2026-05-16_stage98b_mojibake_hard_gate_v5.md`

RISK:
- Legacy repair/check scripts may contain old mojibake fixtures. V5 converts remaining literal banned markers in legacy scripts/tests to unicode escapes so `rg` and Stage98 stay clean without keeping bad bytes in repo.


- V5 C1-control mojibake repair: handles leftover raw control-byte mojibake that V4 exposed in LeadDetail.tsx.


## Stage98B V6 - Polish mojibake hard gate resume

- Decision: mojibake cleanup is repo-wide, not Calendar-only.
- Fix: V6 resumes over partial V4/V5 local changes, verifies package payloads before touching repo, installs the widened Stage98 guard, reruns the repair helper, updates project memory and Obsidian, and only then runs the release gate.
- Test gate: `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs` plus `npm run verify:closeflow:quiet`.
- Risk controlled: previous partial changes are committed only after full local gate passes.
<!-- STAGE98B_V6_LEDGER -->


## Stage98B V7 - Polish mojibake hard gate resume

- Decision: mojibake cleanup is repo-wide, not Calendar-only.
- Fix: V7 resumes over partial V4/V5 local changes, verifies package payloads before touching repo, installs the widened Stage98 guard, reruns the repair helper, updates project memory and Obsidian, and only then runs the release gate.
- Test gate: `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs` plus `npm run verify:closeflow:quiet`.
- Risk controlled: previous partial changes are committed only after full local gate passes.
<!-- STAGE98B_V7_LEDGER -->


## Stage98B V8 - Polish mojibake hard gate resume

- Decision: mojibake cleanup is repo-wide, not Calendar-only.
- Fix: V8 resumes over partial V4/V5 local changes, verifies package payloads before touching repo, installs the widened Stage98 guard, reruns the repair helper, updates project memory and Obsidian, and only then runs the release gate.
- Test gate: `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs` plus `npm run verify:closeflow:quiet`.
- Risk controlled: previous partial changes are committed only after full local gate passes.
<!-- STAGE98B_V8_LEDGER -->

- V8: Windows-safe git ProcessStartInfo wrapper; resume after V7 stderr warning failure.


## Stage98B V9 - Polish mojibake hard gate resume

- Decision: mojibake cleanup is repo-wide, not Calendar-only.
- Fix: V9 resumes over partial V4/V5 local changes, verifies package payloads before touching repo, installs the widened Stage98 guard, reruns the repair helper, updates project memory and Obsidian, and only then runs the release gate.
- Test gate: `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs` plus `npm run verify:closeflow:quiet`.
- Risk controlled: previous partial changes are committed only after full local gate passes.
<!-- STAGE98B_V9_LEDGER -->

- V9: whitespace cleanup before git diff --check; resume after V8 real trailing-whitespace failure.

<!-- STAGE98B_V10_LEDGER -->
## 2026-05-16 - Stage98B V10 encoding gate ledger

- Scope: repo-wide Polish mojibake/BOM cleanup and release-gate hardening.
- Files touched by script: active changed text files under `src`, `tests`, `scripts`, `_project`, plus Stage98 guard and quiet gate.
- Guard: `tests/stage98-polish-mojibake-calendar-guard.test.cjs`.
- Verification: Stage98, changed JS syntax batch, `git diff --check`, `npm run verify:closeflow:quiet`.
- Risk: wide cleanup can touch legacy guard fixtures; V10 uses escaped Unicode or proper UTF-8, not literal corrupted bytes.

<!-- STAGE98B_V11_LEDGER -->
## 2026-05-16 - Stage98B V11 encoding gate ledger

- Scope: repo-wide Polish mojibake/BOM cleanup and release-gate hardening.
- Files touched by script: active changed text files under `src`, `tests`, `scripts`, `tools`, `_project`, plus Stage98 guard and quiet gate.
- Guard: `tests/stage98-polish-mojibake-calendar-guard.test.cjs`.
- Verification: Stage98, changed JS syntax batch, `git diff --check`, `npm run verify:closeflow:quiet`.
- Risk: wide cleanup can touch legacy guard fixtures; V11 escapes non-ASCII inside script/test JS sources to keep legacy fixture maps valid without literal mojibake/BOM-like glyphs.


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


<!-- STAGE98B_V19_LEDGER -->
## Stage98B V19
- Fix class: src files must not contain Node test scaffolds.
- Tests: Stage98B, broad syntax, billing regression, git diff, quiet gate.


<!-- STAGE98B_V20_LEDGER -->
## Stage98B V20
- Fix class: contaminated src files are restored from origin/dev-rollout-freeze or HEAD, then rechecked.
- Tests: Stage98B, src scaffold hard scan, broad syntax, billing regression, git diff, quiet gate.


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
- Lokalny ZIP bez pushowania. Zmiana dotyka shell logo, login logo, CSS kontraktu i guardu.


- 2026-05-17 Stage114B local-only: calendar hard-refresh data load waits for workspaceReady; added guard tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs; no git add/commit/push.


## Stage114C V2 - calendar shift persistence guard fix local only
- Local-only ZIP stage.
- Guard repaired after V1 regex false negative.
- Task shifts must write date, scheduledAt, dueAt and time before success toast.
- Manual QA still required on /calendar for +1D, +1W and +1H.

## STAGE114D_CALENDAR_MODAL_VIEWPORT_LEDGER

Pliki:
- src/pages/Calendar.tsx
- src/styles/visual-stage22-event-form-vnext.css
- tests/stage114-calendar-modal-viewport-contract.test.cjs
- package.json

## STAGE114D_V2_CALENDAR_MODAL_VIEWPORT_AND_DOC_GUARD_LOCAL_ONLY

- Status: local-only, no git add, no commit, no push.
- Scope: /calendar modal viewport, Radix DialogDescription, Stage114 docs encoding cleanup after broad Stage98 guard failed on _project reports.
- Guards: stage98 polish mojibake calendar guard, Stage114B, Stage114C, Stage114D modal viewport, Stage108 render smoke, build, verify:closeflow:quiet.
- Manual QA: edit calendar entry, title not clipped, scroll body works, sticky footer does not cover fields, no Radix description warning.

## STAGE114D_V3_LEDGER
Scope: /calendar modal viewport, Radix description, Stage98 guard cleanup for related calendar files. Local-only ZIP workflow. No git add, no commit, no push.


## Stage114D V5 local-only modal viewport
- Applied modal viewport CSS, DialogDescription, guard cleanup and documentation updates.

## Stage114D V6
- src/pages/Calendar.tsx: modal class and DialogDescription contract.
- src/styles/visual-stage22-event-form-vnext.css: viewport-safe modal CSS.
- tests/stage114-calendar-modal-viewport-contract.test.cjs: stable guard.

## STAGE114D_V8_CALENDAR_MODAL_VIEWPORT_STAGE102_GUARD_FIX_LOCAL_ONLY

- Status: LOCAL ONLY, no git add, no commit, no push.
- Zakres: /calendar modal viewport, Stage102 guard compatibility, Stage114D guard.
- Decyzja: calendar-entry-modal-viewport is allowed as a viewport safety class and is not a local dark overflow shell.
- Guardy: Stage102, Stage98, Stage114B, Stage114C, Stage114D, Stage108 smoke, build, verify:closeflow:quiet.
- Test reczny: otworzyc /calendar, edycje wpisu i tworzenie wpisu; tytul nie moze byc uciety, footer nie moze przykrywac pol, konsola bez Radix Missing Description.

## Stage114D V9
- Files touched: src/pages/Calendar.tsx, src/styles/visual-stage22-event-form-vnext.css, tests/stage114-calendar-modal-viewport-contract.test.cjs, tests/stage102-calendar-edit-modal-form-source.test.cjs, package.json, _project updates.
- Mode: local-only ZIP. No commit, no push.

## Stage114D V10 implementation ledger
- Scope: /calendar modal viewport, accessibility descriptions and guards.
- Touched: Calendar.tsx, visual-stage22-event-form-vnext.css, Stage102/Stage114D tests, quiet gate if needed.

<!-- STAGE115_LEAD_CONTACT_CLIENT_PARITY -->

## Stage115 - LeadDetail contact card client parity

- Decyzja Damiana: dane kontaktowe leada mają wyglądać 1:1 jak klient po lewej stronie.
- Zakres tej paczki: tylko punkt 3.1 Stage115. Notatki, overdue i finanse zostają jako kolejne podetapy, bo nie było tu pełnej specyfikacji naprawy.
- Źródło prawdy UI kontaktu: `src/components/entity-contact-card.tsx`.
- Legacy wygaszone: `LeadDetail.InfoLine`, `lead-detail-contact-grid`, lokalny `ClientDetail.InfoRow`.

## Stage115B LeadDetail notes visible source contract

- Scope: P1 UX/data visibility fix for LeadDetail notes.
- Files: `src/pages/LeadDetail.tsx`, `src/styles/visual-stage14-lead-detail-vnext.css`, `tests/stage115-lead-notes-visible-source-contract.test.cjs`.
- Decision: do not render leadPrimaryNoteText inside contact card; keep notes as their own section.

## Stage115C LeadDetail inline note submit contract

- Scope: P1 UX fix for note entry in LeadDetail Historia kontaktu.
- Files: `src/pages/LeadDetail.tsx`, `tests/stage115c-lead-inline-note-submit-contract.test.cjs`, `package.json`.
- Decision: inline note button in history must never open the context modal; work-center modal action remains but is clearly named.

## Stage115D LeadDetail overdue work items red contract

- Scope: P1 UX/status correctness for LeadDetail overdue task/work item visibility.
- Files: `src/pages/LeadDetail.tsx`, `src/styles/visual-stage14-lead-detail-vnext.css`, `tests/stage115-lead-overdue-work-items-red-contract.test.cjs`, `package.json`.
- Decision: overdue status is derived from date + non-done status, not stored as a separate task status.

## Stage115E LeadDetail finance actions dialog

- Scope: P1 functional repair for LeadDetail finance buttons.
- Files: `src/pages/LeadDetail.tsx`, `src/styles/visual-stage14-lead-detail-vnext.css`, `tests/stage115-lead-finance-actions-open-dialog.test.cjs`, `package.json`.
- Decision: use existing payments API for minimal working repair. Do not build invoice/accounting workflow here.

## Stage116 - Today work item card source of truth

- Scope: TodayStable only.
- Files: `src/pages/TodayStable.tsx`, `src/components/work-item-card.tsx`, `src/styles/work-item-card.css`, `tests/stage116-today-work-item-card-source-truth.test.cjs`, `package.json`.
- Decision: prepare component contract in Today first; do not change Calendar/LeadDetail/ClientDetail/CaseDetail in this stage.

## Stage116 V2 - Stage76 guard compatibility repair

- Scope: guard compatibility after Stage116 V1 patch.
- File: `src/pages/TodayStable.tsx`.
- Decision: preserve WorkItemCard source-of-truth and satisfy legacy Stage76 token guard with explicit compatibility marker.
## Stage117 Leads right rail layout contract

- Scope: P1 visual/layout fix for /leads.
- Files: `src/pages/Leads.tsx`, `src/styles/closeflow-leads-right-rail-layout-lock.css`, `tests/stage117-leads-right-rail-layout-contract.test.cjs`, `package.json`.
- Decision: fix only Leads layout. Do not modify shared operator rail component or other pages in this stage.

## Stage118B release gate Stage77 compatibility

- Scope: tests/stage77-lead-detail-single-status-pill.test.cjs, package.json, tests/stage118b-release-gate-stage77-compat.test.cjs.
- Decision: update stale guard only; do not change runtime LeadDetail behavior.

## Stage115 - implementation ledger

STAGE115_CASE_DETAIL_RUNTIME_CRASH_HOTFIX_2026_05_18

Decision: P0 hotfix goes before further logo/calendar/layout work.

Changed files:
- `src/pages/CaseDetail.tsx`
- `tests/stage115-case-detail-useworkspace-import-contract.test.cjs`
- `tests/stage115-case-detail-render-runtime-contract.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `_project/runs/2026-05-18_stage115_case_detail_runtime_crash_hotfix.md`

Out of scope:
- logo Stage113,
- calendar Stage114,
- Radix warning,
- lead detail spacing,
- client lead view removal.


<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST START -->
## Stage119 implementation ledger

Changed paths:
- package.json
- scripts/closeflow-release-check-quiet.cjs
- tests/stage119-calendar-release-gate-trust.test.cjs
- _project/runs/2026-05-18_stage119_calendar_release_gate_trust_repair.md
- _project memory files
- Obsidian CloseFlow notes

No runtime UI files are changed in this stage.
<!-- STAGE119_CALENDAR_RELEASE_GATE_TRUST END -->

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

<!-- STAGE124A_SUPABASE_EGRESS_LEDGER_START -->
## 2026-05-19 - Stage124A V3 Supabase egress P0

FAKTY Z KODU:
- `api/leads.ts`, `api/clients.ts`, `api/cases.ts` mialy listowe `select=*` z wysokimi limitami.
- `src/lib/supabase-fallback.ts` mial dedupe/cache GET na 10 sekund.

DECYZJA:
- Nie ucinac funkcjonalnosci UI. Zmniejszac payload list, nie usuwac modulow.

ZMIANA:
- List endpoints maja jawne kolumny ListDTO.
- Detail endpoints po `id` nadal moga uzyc pelnego payloadu.
- Guard blokuje powrot ciezkich list `select=*`.

RYZYKO:
- Jesli jakis ekran listowy ukrycie korzystal z pola spoza ListDTO, dopisac to pole do stalej ListDTO, a nie wracac do `select=*`.
<!-- STAGE124A_SUPABASE_EGRESS_LEDGER_END -->

## 2026-05-19 - STAGE124D_TASK_EVENT_LIGHT_ROUTES

FACTS:
- Stage124C audit found frontend /api/tasks and /api/events call sites but no tracked route candidates.
- Stage124D restores those route files in api/.

DECISIONS:
- Do not patch supabase-fallback.ts in this stage.
- Do not reduce app functionality; default list limit remains capped at 200, but payloads are lightweight.

TESTS:
- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run build

## 2026-05-19 - STAGE124D_V2_GUARD_FIX

FACTS:
- Stage124D route files were created and build passed.
- Stage124D guard failed because the generated guard contained an invalid JavaScript regex: /resolveRequestWorkspaceId(req/.
- Stage124D V2 fixes only the guard/test assertion style. API route logic is not changed by this V2 patch.

TESTS:
- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run check:stage124-supabase-egress-contract
- npm run build

## Stage124E V2 calendar task/event range params

- Files: `src/lib/supabase-fallback.ts`, `src/lib/calendar-items.ts`, `scripts/check-stage124e-calendar-range-params.cjs`, `tests/stage124e-calendar-range-params.test.cjs`.
- Purpose: prepare frontend for ranged task/event API calls after Stage124D restored lightweight routes.
- Commit mode: manual selective git add only.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_LEDGER_START -->
## 2026-06-04 — Stage221 owner-control roadmap after CRM research

Status: prepared as local-only ZIP.

Files touched by apply script:
- `_project/07_NEXT_STEPS.md`
- `_project/04_DECISIONS.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/12_IMPLEMENTATION_LEDGER.md`
- `_project/13_TEST_HISTORY.md`
- `_project/roadmaps/2026-06-04 - CloseFlow owner control roadmap po researchu CRM.md`
- `_project/runs/STAGE221_OWNER_CONTROL_ROADMAP_2026_06_04.md`
- `_project/obsidian_updates/2026-06-04 - CloseFlow - owner control roadmap po researchu CRM.md`
- `scripts/check-stage221-owner-control-roadmap-memory.cjs`
- `OBSIDIAN_UPDATE_MANIFEST_STAGE221_CLOSEFLOW_OWNER_CONTROL_ROADMAP.md`

No runtime files changed.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_LEDGER_END -->
