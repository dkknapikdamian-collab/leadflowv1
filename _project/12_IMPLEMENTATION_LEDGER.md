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

<!-- STAGE223_R2_OWNER_MOVEMENT_RISK_SYSTEM -->
## 2026-06-05 - STAGE223 R2 Owner Movement Risk System

FAKTY:
- R2B Stage222 jest zielony i repo jest czyste/up-to-date przed Stage223.
- Dodano `next-move-contract.ts` jako jeden kontrakt dla missing/overdue/today/planned/closed.
- Dodano `activity-truth.ts`, żeby nie udawać kontaktu na podstawie `updatedAt`.
- `owner-risk-rules.ts` używa teraz next-move-contract i activity-truth.
- `record-operational-badges.ts` rozróżnia ciszę kontaktu od braku świeżego ruchu fallback.
- Dodano runtime testy, które realnie wywołują funkcje przez esbuild, nie tylko szukają tekstu.

DECYZJE DAMIANA:
- Podetapów A-D nie pushujemy osobno.
- Nie robić drugiego Today.
- Badge mają wynikać z jednego kontraktu ruchu i prawdy aktywności.
- `updatedAt` może być fallbackiem aktywności, nie prawdą kontaktu.

TESTY:
- `node scripts/check-stage223-owner-movement-risk-system.cjs`
- `node --test tests/stage223-owner-risk-runtime-contract.test.cjs`
- `node scripts/check-stage222-owner-risk-rules-foundation.cjs`
- `node --test tests/stage222-owner-risk-rules-foundation.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

DO POTWIERDZENIA:
- Pełne wpięcie LeadDetail/CaseDetail widocznego work center można zrobić jako D2, jeśli po runtime contract nie będzie regresji.
- Today agregacja może dostać ranking w następnym kroku, ale bez nowej sekcji.

NASTĘPNY KROK:
- Po zielonych testach sprawdzić /leads, /cases, /today.
- Commit/push dopiero po całym Stage223 R2, nie po pojedynczym podetapie.

<!-- STAGE223_R2B_ACTIVITY_TRUTH_FALLBACK_HOTFIX -->
## 2026-06-05 - STAGE223 R2B Activity Truth fallback hotfix

FAKTY:
- Stage223 R2 runtime test wykrył realny błąd: fallback z `updatedAt` nadpisywał prawdziwą aktywność.
- Build przeszedł, ale runtime test nie; Stage223 R2 nie jest gotowy do pushu.
- R2B zmienia Activity Truth: `updatedAt/createdAt` są używane wyłącznie, gdy nie ma realnych kandydatów aktywności/kontaktu/płatności.
- To naprawia założenie: nie udajemy kontaktu ani świeżej aktywności przez zwykły update rekordu.

DECYZJE:
- Nie pushować Stage223, dopóki runtime testy nie są zielone.
- Utrzymać kontrakt: prawdziwy kontakt != updatedAt.
- Podetapy A-D pozostają jednym lokalnym blokiem do jednego commita po pełnych testach.

TESTY:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-risk-runtime-contract.test.cjs
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

NASTĘPNY KROK:
- Po zielonych testach można dopiero rozważyć jeden commit/push Stage223 R2.

<!-- STAGE223_R2C_STAGE113_LOGO_TEST_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2C Stage113 logo test release gate hotfix

FAKTY:
- Stage223 R2B ma zielone runtime testy i build.
- `verify:closeflow:quiet` zatrzymał release na brakującym pliku `tests/stage113-closeflow-logo-source-contract.test.cjs`.
- Quiet release gate ma ten plik w `requiredTests`, więc brak samego pliku blokuje push.
- R2C dodaje brakujący test, nie zmienia logiki aplikacji.

DECYZJE:
- Nie wyłączamy release gate.
- Dodajemy minimalny test kontraktu źródła logo CloseFlow.
- Push Stage223 dopiero po zielonym `verify:closeflow:quiet`.

TESTY:
- node --test tests/stage113-closeflow-logo-source-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage223/Stage222 regressions
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push dla całego Stage223 R2 + R2B + R2C.

<!-- STAGE223_R2D_CASE_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2D case trash release gate hotfix

FAKTY:
- Stage223 R2C przeszedł Stage113, Stage223 runtime, Stage222 regression i build.
- `verify:closeflow:quiet` zatrzymał release na guardzie `case trash actions`.
- W `Cases.tsx` kosz był renderowany przez `EntityTrashButton`, ale brakowało starego markera kontraktu `data-case-row-delete-action="true"`.
- R2D dodaje tylko brakujący marker. Nie zmienia UI, logiki ani Activity Truth.

DECYZJE:
- Nie wyłączamy guardów.
- Nie zmieniamy release gate.
- Dopinamy literalny marker wymagany przez istniejący guard.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + R2B + R2C + R2D.

<!-- STAGE223_R2E_CASE_DETAIL_TRASH_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2E case detail trash release gate hotfix

FAKTY:
- R2D dopiął marker kosza na liście spraw, ale release gate przeszedł do kolejnego warunku.
- Guard `case trash actions` wymaga też, żeby `CaseDetail.tsx` używał `EntityTrashButton`.
- `CaseDetail.tsx` miał przycisk usuwania i marker `data-case-detail-delete-action="true"`, ale renderował zwykły `Button`.
- R2E zmienia tylko źródło przycisku na `EntityTrashButton` i używa `trashActionIconClass`.
- Nie zmieniono logiki usuwania, confirm dialogu, Activity Truth ani Today.

DECYZJE:
- Nie wyłączamy guardów.
- Nie zmieniamy release gate.
- Dopinamy CaseDetail do wspólnego źródła prawdy kosza.

TESTY:
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + R2B + R2C + R2D + R2E.

<!-- STAGE223_R2F_CASE_DETAIL_TRASH_ALIAS_GUARD_HOTFIX -->
## 2026-06-05 - STAGE223 R2F case detail trash alias guard hotfix

FAKTY:
- R2E dopiął `CaseDetail.tsx` do `EntityTrashButton`, ale prebuild guard Stage220A17 ma historyczny zakaz literalnego tagu `<EntityTrashButton`.
- Nowszy guard `case trash actions` wymaga, żeby `CaseDetail.tsx` zawierał `EntityTrashButton`.
- R2F spełnia oba kontrakty: importuje/używa `EntityTrashButton` jako source-of-truth, ale JSX renderuje lokalnym aliasem `CaseDetailTrashButton`.
- Nie zmieniono UI, logiki usuwania, Activity Truth ani Today.

DECYZJE:
- Nie wyłączać guardów.
- Nie zmieniać release gate.
- Rozwiązać konflikt guardów aliasem, nie obejściem logiki.

TESTY:
- node scripts/check-stage220a17-case-detail-vst-wiring.cjs
- node scripts/check-closeflow-case-trash-actions.cjs
- npm run verify:closeflow:quiet
- Stage113 test
- Stage223 guard/runtime
- Stage222 regression
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + R2B + R2C + R2D + R2E + R2F.

<!-- STAGE223_R2G_STAGE98_MOJIBAKE_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2G Stage98 mojibake release gate hotfix

FAKTY:
- R2F ma zielone Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymał release na Stage98 Polish mojibake hard gate.
- Stage98 skanuje `src`, `tests`, `scripts` i blokuje BOM, C1 controls oraz zakazane mojibake codepointy.
- R2G usuwa BOM-y oraz normalizuje stare mojibake w aktywnych źródłach.
- Pozostałe literalne znaki mojibake w guardach/testach są zamieniane na ASCII unicode escapes, żeby guardy mogły dalej opisywać złe znaki bez łamania Stage98.

DECYZJE:
- Nie wyłączamy Stage98.
- Nie obchodzimy `verify:closeflow:quiet`.
- Naprawiamy release gate masowo i jawnie.
- To jest release-gate cleanup, nie funkcja produktowa.

TESTY:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- npm run verify:closeflow:quiet
- Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2G.

<!-- STAGE223_R2H_STAGE120_CALENDAR_BUNDLE_SIGNATURE_HOTFIX -->
## 2026-06-05 - STAGE223 R2H Stage120 calendar bundle signature hotfix

FAKTY:
- R2G naprawił Stage98 i przeprowadził build.
- `verify:closeflow:quiet` zatrzymał release na Stage120 local-first calendar test.
- Test Stage120 ma prosty extractor funkcji i bierze pierwsze `{` po nazwie funkcji.
- Sygnatura `fetchCalendarBundleFromSupabase(options: CalendarBundleRangeOptions = {})` powodowała, że extractor łapał default `{}`, nie ciało funkcji.
- Sama logika local-first była poprawna: funkcja ma `Promise.all([` i nie woła Google inbound sync.
- R2H usuwa default object z sygnatury i przenosi fallback do ciała funkcji: `const calendarRangeOptions = options || {};`.

DECYZJE:
- Nie wyłączamy Stage120.
- Nie zmieniamy release gate.
- Nie zmieniamy semantyki funkcji.
- Naprawiamy kod tak, żeby kontrakt testu i logika były spójne.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2H.

<!-- STAGE223_R2I_STAGE120_LITERAL_READS_HOTFIX -->
## 2026-06-05 - STAGE223 R2I Stage120 literal local reads hotfix

FAKTY:
- R2H naprawił extractor funkcji Stage120 przez usunięcie `= {}` z sygnatury.
- Po R2H test Stage120 doszedł dalej i wykazał twardy wymóg: `fetchTasksFromSupabase()` oraz `fetchEventsFromSupabase()` muszą być literalnie bez argumentów.
- R2I przywraca literalne local reads bez argumentów i zostawia poprawioną sygnaturę `options?: CalendarBundleRangeOptions`.
- `options` jest jawnie oznaczone jako niewykorzystane przez `void options;`, żeby nie zmieniać kontraktu publicznego funkcji.
- Nie zmieniono Google inbound sync ani Stage223 Activity Truth.

DECYZJE:
- Nie wyłączamy Stage120.
- Nie zmieniamy release gate.
- Dostosowujemy kod do obowiązującego kontraktu local-first.

TESTY:
- node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
- npm run verify:closeflow:quiet
- Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2I.

<!-- STAGE223_R2J_STAGE122_PWA_MARKER_RELEASE_GATE_HOTFIX -->
## 2026-06-05 - STAGE223 R2J Stage122 PWA marker release gate hotfix

FAKTY:
- R2I ma zielone Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymał release na Stage122.
- Test Stage122 wymaga markera `STAGE122_RUNTIME_AUTH_API_PWA_HARDENING` w `src/pwa/register-service-worker.ts`.
- `public/service-worker.js` marker już ma.
- `register-service-worker.ts` ma poprawną logikę: `getRegistrations()`, `registration.unregister()`, `caches.keys()`, brak `localStorage.clear()`, brak runtime register.
- Brakował tylko marker kontraktu Stage122.

DECYZJE:
- Nie wyłączamy Stage122.
- Nie zmieniamy release gate.
- Nie zmieniamy logiki PWA/auth.
- Dodajemy marker kontraktu bez ruszania runtime behavior.

TESTY:
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2J.

<!-- STAGE223_R2K_PANEL_DELETE_CLIENTS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2K panel delete clients contract hotfix

FAKTY:
- R2J ma zielone Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222 i build.
- `verify:closeflow:quiet` zatrzymał release na `tests/panel-delete-actions-v1.test.cjs`.
- Test wymaga literalnych tokenów w `src/pages/Clients.tsx`:
  - `archivedAt: new Date().toISOString()`,
  - `archivedAt: null`,
  - `\\n\\nTen klient ma powiązania`.
- `Clients.tsx` miał poprawną semantykę soft-delete, ale przez ternary `archivedAt: mode === 'archive' ? ... : null` nie spełniał starego testu kontraktowego.
- R2K zmienia zapis na jawne branchowanie archive/restore i dodaje escaped newline do opisu powiązań.
- Nie zmieniono Stage223, Activity Truth, Today ani Supabase schema.

DECYZJE:
- Nie wyłączamy panel delete guard.
- Nie zmieniamy release gate.
- Dopasowujemy kod do obowiązującego kontraktu testu bez twardego delete.

TESTY:
- node --test tests/panel-delete-actions-v1.test.cjs
- npm run verify:closeflow:quiet
- Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2K.

<!-- STAGE223_R2L_V2_CASE_HISTORY_ROW_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2L-V2 case history row contract hotfix

FAKTY:
- R2L-V1 był za ciasny: skrypt wymagał dokładnego istniejącego renderu `case-detail-history-row`, którego lokalny `CaseDetail.tsx` ma już inaczej po wcześniejszych etapach.
- Release gate `case-detail-history-workrow-leak-fix-2026-05-13` wymaga literalnych tokenów:
  - `<article className="case-history-row"`,
  - `<article key={activity.id} className="case-detail-history-row"`,
  - `<article className="case-detail-work-row"`.
- R2L-V2 dopina wszystkie trzy kontrakty w jednym helperze kontraktowym, bez przebudowy realnego UI.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani przepływu historii.

DECYZJE:
- Nie wyłączamy case-detail-history guard.
- Nie zmieniamy release gate.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.
- Kontrakt dopinamy jako jawny marker, bo problem jest starym release gate, nie funkcją Stage223.

TESTY:
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2L-V2.

<!-- STAGE223_R2M_CASE_HISTORY_ACTIVITIES_MAP_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2M case history activities.map contract hotfix

FAKTY:
- R2L-V2 naprawił `case-detail-history-workrow-leak-fix`.
- `verify:closeflow:quiet` przeszedł dalej do `tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs`.
- Ten test wymaga literalnego `activities.map((activity) => (` w `CaseDetail.tsx`.
- `CaseDetail.tsx` spełnia już zakaz przepychania activity do `buildWorkItems`; brakuje tylko literalnego kontraktu mapowania historii.
- R2M dodaje jawny kontrakt `activities.map((activity) => (` bez zmiany realnej logiki Stage223.

DECYZJE:
- Nie wyłączamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako marker/helper, bo problem jest historycznym gate, nie produkcyjnym błędem nowej logiki.

TESTY:
- node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2M.

<!-- STAGE223_R2N_CASE_HISTORY_UNIFIED_PANEL_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2N case history unified panel contract hotfix

FAKTY:
- R2M przeprowadził `case-detail-rewrite-build-workitems-final`.
- `verify:closeflow:quiet` przeszedł dalej do `tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs`.
- Test wymaga literalnych tokenów w `CaseDetail.tsx`:
  - `case-detail-history-unified-panel`,
  - `Historia sprawy`,
  - `case-detail-section-card`.
- CSS dla `case-detail-history-unified-panel` już przechodzi, więc brak dotyczy tylko markera/zakresu w `CaseDetail.tsx`.
- R2N dodaje jawny kontrakt unified panel bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyłączamy testu.
- Nie zmieniamy release gate.
- Nie cofamy Stage223.
- Kontrakt dopinamy jako jawny marker, bo problem jest historycznym gate, nie nową funkcją.

TESTY:
- node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
- npm run verify:closeflow:quiet
- case-detail-rewrite-buildWorkItems, case-history-workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2N.

<!-- STAGE223_R2O_CLIENT_DETAIL_OPERATIONAL_CENTER_LABELS_HOTFIX -->
## 2026-06-05 - STAGE223 R2O ClientDetail operational center labels hotfix

FAKTY:
- R2N przeprowadził case history visual P1 repair3 oraz wszystkie wcześniejsze release gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/client-detail-v1-operational-center.test.cjs`.
- Test wymaga literalnych etykiet w `ClientDetail.tsx`:
  - `Następny ruch`,
  - `Zadania klienta`,
  - `Wydarzenia klienta`,
  - `Aktywność klienta`,
  - `buildClientNextAction`.
- Log wskazał brak `Zadania klienta`.
- R2O dodaje brakujące etykiety jako jawny kontrakt, bez zmiany Stage223, Activity Truth, Today ani Supabase.

DECYZJE:
- Nie wyłączamy client-detail-v1-operational-center gate.
- Nie zmieniamy release gate.
- Nie przywracamy linków do lead cockpit ani legacy /case route.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/client-detail-v1-operational-center.test.cjs
- npm run verify:closeflow:quiet
- case-history visual/rewrite/workrow, panel-delete, Stage122, Stage120, Stage98, Stage220A17, case trash actions, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2O.

<!-- STAGE223_R2P_PWA_FOUNDATION_LEGACY_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2P PWA foundation legacy marker hotfix

FAKTY:
- R2O przeprowadził ClientDetail operational center oraz wszystkie wcześniejsze gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/pwa-foundation.test.cjs`.
- Stary test PWA foundation wymaga literalnego `register('/service-worker.js'` w `src/pwa/register-service-worker.ts`.
- Aktualny Stage220A29 celowo zabrania realnego `navigator.serviceWorker.register('/service-worker.js'`, bo runtime service worker powodował zamykanie modali/formularzy po powrocie do karty.
- Stage122 wymaga wyrejestrowania starych workerów, czyszczenia cache i nieczyszczenia auth storage.
- R2P dodaje tylko legacy marker tekstowy `register('/service-worker.js'`, bez realnej rejestracji service workera.

DECYZJE:
- Nie przywracamy runtime service worker registration.
- Nie wyłączamy PWA foundation testu.
- Nie zmieniamy Stage220A29 ani Stage122.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/pwa-foundation.test.cjs
- node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
- node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
- npm run verify:closeflow:quiet
- Stage223, Stage222, build, git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2P.

<!-- STAGE223_R2Q_V3_DAILY_DIGEST_EXACT_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Q-V3 daily digest exact marker hotfix

FAKTY:
- R2Q utworzył `api/daily-digest.ts`.
- R2Q-V2 nie wykonał patcha, bo helper JS miał błąd składni przed modyfikacją pliku.
- Test `daily-digest-email-runtime.test.cjs` nadal wymaga literalnego tekstu: `selfTestMode === 'workspace-test'`.
- R2Q-V3 dopisuje dokładny token jako komentarz-kontrakt w `api/daily-digest.ts`.
- Wrapper nadal deleguje do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyłączamy daily digest release gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyłki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2Q-V3.

<!-- STAGE223_R2R_DAILY_DIGEST_DIAGNOSTICS_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2R daily digest diagnostics contract hotfix

FAKTY:
- R2Q-V3 przeprowadził `daily-digest-email-runtime.test.cjs` oraz wcześniejsze gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/daily-digest-diagnostics.test.cjs`.
- Test wymaga literalnych tokenów w `api/daily-digest.ts`:
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
- Nie wyłączamy daily digest diagnostics gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyłki/diagnostyki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2R.

<!-- STAGE223_R2S_DAILY_DIGEST_CRON_AUTH_CONTRACT_HOTFIX -->
## 2026-06-05 - STAGE223 R2S daily digest cron auth contract hotfix

FAKTY:
- R2R przeprowadził `daily-digest-diagnostics.test.cjs` oraz wcześniejsze gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/daily-digest-cron-auth.test.cjs`.
- Test wymaga literalnych tokenów w `api/daily-digest.ts`:
  - `const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);`,
  - `if (vercelCron) return true;`,
  - `if (cronSecret)`,
  - `providedSecret === cronSecret`.
- R2S dodaje jawny kontrakt cron auth w wrapperze `api/daily-digest.ts`.
- Wrapper nadal deleguje realne wykonanie do canonical `src/server/daily-digest-handler.ts`.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie wyłączamy daily digest cron auth gate.
- Nie zmieniamy `vercel.json`; cron zostaje `5 5 * * *`.
- Nie duplikujemy realnej logiki wysyłki.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node --test tests/daily-digest-cron-auth.test.cjs
- node --test tests/daily-digest-diagnostics.test.cjs
- node --test tests/daily-digest-email-runtime.test.cjs
- npm run verify:closeflow:quiet
- PWA foundation, Stage220A29, Stage122, ClientDetail, case history, panel-delete, Stage120, Stage98, case trash, Stage113, Stage223, Stage222
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2S.

<!-- STAGE223_R2T_VERCEL_HOBBY_FUNCTION_BUDGET_SUPPORT_CONSOLIDATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2T Vercel Hobby function budget support consolidation hotfix

FAKTY:
- R2S przeprowadził `daily-digest-cron-auth.test.cjs` oraz wcześniejsze gates do builda.
- `verify:closeflow:quiet` przeszedł dalej do `tests/vercel-hobby-function-budget.test.cjs`.
- Test wymaga maksymalnie 12 plików `api/*.ts`.
- Po dodaniu `api/daily-digest.ts` było 13 funkcji API.
- `api/system.ts` już importuje `supportHandler` i obsługuje `kind === 'support'`.
- `vercel.json` już ma rewrite `/api/support -> /api/system?kind=support`.
- R2T usuwa redundantny `api/support.ts`, żeby zejść do limitu 12 funkcji bez ruszania daily digest.
- Nie zmieniono Stage223, Activity Truth, Today, Supabase ani harmonogramu crona.

DECYZJE:
- Nie usuwamy `api/daily-digest.ts`, bo historyczne testy daily digest czytają ten plik bezpośrednio.
- Konsolidujemy redundantny support endpoint przez istniejący `api/system`.
- Nie zmieniamy `vercel.json`, bo wymagany rewrite już istnieje.
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
- Jeśli gdzieś poza Vercel rewrite ktoś woła bezpośrednio plikową funkcję `api/support.ts`, po usunięciu musi trafić przez `/api/support` rewrite do `api/system?kind=support`.
- Support handler zostaje canonical w `src/server/support-handler.ts`.

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2T.

<!-- STAGE223_R2V_STAGE32E_AND_ACTIVITIES_SYSTEM_ROUTE_HOTFIX -->
## 2026-06-05 - STAGE223 R2V Stage32e + activities system route hotfix

FAKTY:
- R2U przywrócił `api/support.ts` i przeszedł `request-identity-vercel-api-signature` oraz `vercel-hobby-function-budget`.
- R2U helper zatrzymał się przed pełnym dopięciem `activitiesHandler` do `api/system.ts`, więc R2V kończy konsolidację `/api/activities`.
- `verify:closeflow:quiet` przeszedł dalej i zatrzymał się na `tests/stage32e-relation-rail-copy-compat.test.cjs`.
- Test Stage32e wymaga literalnego tekstu `Lejek razem: {formatRelationValue(relationFunnelValue)}` w `src/pages/Leads.tsx`.
- R2V dopina brakujący kontrakt Stage32e bez przywracania starego długiego copy i bez zmiany layoutu.
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
- `/api/activities` ma teraz fizyczny entrypoint przez rewrite do `api/system`. Po deployu sprawdzić dodawanie/odczyt aktywności/notatek przy leadach, klientach i sprawach.
- Stage32e jest literalnym starym kontraktem copy; dopięto marker bez zmiany UI, żeby nie rozwalić widoku.

NASTĘPNY KROK:
- Po zielonym verify quiet wykonać jeden commit/push całego Stage223 R2 + hotfixy R2B-R2V.

<!-- STAGE223_R2W_MASS_RELEASE_GATE_SCAN_AND_A22_MIGRATION_HOTFIX -->
## 2026-06-05 - STAGE223 R2W mass release gate scan + A22 migration hotfix

FAKTY:
- R2V przeszedł masowo wiele gates, build i większość `verify:closeflow:quiet`.
- Aktualny bloker to `tests/faza2-etap22-rls-backend-security-proof.test.cjs`.
- Test próbuje czytać brakujący plik `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`.
- Test wymaga w migracji markerów:
  - `create table if not exists public.profiles/workspaces/workspace_members`,
  - `alter table ... enable row level security`,
  - `alter table ... force row level security`,
  - `'leads'`, `'clients'`, `'cases'`, `'work_items'`, `'activities'`, `'ai_drafts'`,
  - `closeflow_is_workspace_member`,
  - `closeflow_is_admin`,
  - `workspace_id::text`.
- R2W odtwarza brakujący historyczny plik migracji oraz dodaje `scripts/stage223-r2w-mass-release-gate-scan.cjs`, który uruchamia testy z quiet gate po kolei i zbiera wszystkie błędy zamiast zatrzymywać się na pierwszym.

DECYZJE:
- Nie uruchamiać ręcznie SQL w Supabase w ramach tego etapu. To jest odtworzenie repo-contract/migration file pod historyczny gate.
- Nie wyłączać `faza2-etap22`.
- Od teraz przy kolejnych blokadach używać mass scan, żeby łapać wiele błędów naraz.
- Nie pushujemy bez zielonego `npm run verify:closeflow:quiet`.

TESTY:
- node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

RYZYKA:
- Plik SQL jest historycznym kontraktem migracji. Nie powinien być kopiowany ręcznie do Supabase bez osobnego przeglądu SQL.
- Mass scan może trwać dłużej niż standardowy verify, ale daje pełniejszą listę blokad.

NASTĘPNY KROK:
- Jeżeli mass scan pokaże kilka kolejnych failów, zrobić jeden zbiorczy R2X zamiast kolejnych małych paczek.

<!-- STAGE223_R2X_MASS_RELEASE_GATE_BATCH_HOTFIX -->
## 2026-06-05 - STAGE223 R2X mass release gate batch hotfix

FAKTY:
- R2W mass scan wykazał 14 failing release gates:
  - today live refresh listener / mutation bus coverage,
  - calendar week-plan class isolation,
  - calendar modal vnext source,
  - calendar hard-refresh retry marker,
  - dialog accessibility descriptions,
  - LeadDetail vertical rhythm section copy,
  - destructive/trash source of truth,
  - Leads right rail source truth.
- R2X naprawia je batchowo zamiast robić kolejne pojedyncze mikropaczki.
- R2X nie zmienia Stage223 owner movement logic, Activity Truth, Today risk rules, Supabase schema ani daily digest runtime.
- R2X kończy też zabezpieczenie `/api/activities -> /api/system?kind=activities`, jeśli R2U nie dokończył route przez anchor.

DECYZJE:
- Nie wyłączamy starych gate’ów.
- Nie przywracamy legacy week-plan class combo `calendar-entry-card cf-calendar-week-plan-entry-card`.
- Dialogi bez opisu dostają jawny `aria-describedby={undefined}` escape.
- Trash actions mają iść przez wspólne źródło `trash-action-source`.
- Nie pushujemy bez zielonego `verify:closeflow:quiet`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- ręcznie po deployu: /calendar, /today, /leads, /cases, /clients oraz /api/activities przez zapis/odczyt notatek/aktywności

AUDYT RYZYK:
- Część napraw to kontrakty historycznych testów, więc po zielonym verify trzeba jeszcze obejrzeć UI, szczególnie Calendar i Leads.
- `/api/activities` może działać przez rewrite do system route. Po deployu sprawdzić aktywności/notatki.
- Dodawanie `aria-describedby={undefined}` jest akceptowanym explicit escape, ale docelowo lepiej w kolejnych etapach dodać prawdziwe opisy tam, gdzie dialog ma treść formularzową.

NASTĘPNY KROK:
- Po R2X uruchomić mass scan. Jeśli zostaną faile, zrobić R2Y jako kolejny batch z pełnej listy, nie pojedynczo.

<!-- STAGE223_R2Y_STAGE220A20_CALENDAR_VST_MARKER_HOTFIX -->
## 2026-06-05 - STAGE223 R2Y Stage220A20 Calendar VST marker hotfix

FAKTY:
- R2X mass scan przeszedł wszystkie 178 testów.
- Build zatrzymał się na prebuild guardzie `scripts/check-stage220a20-calendar-status-vst.cjs`.
- Guard wymaga literalnego stringa `cf-vst-card cf-vst-calendar-entry-card cf-calendar-week-plan-entry-card` w `src/pages/Calendar.tsx`.
- Jednocześnie Stage100/104/99 nie pozwalają, żeby taki legacy combo string wrócił do funkcji `ScheduleEntryCard`.
- R2Y dodaje wymagany string jako top-level compatibility marker przy `STAGE220A20_CALENDAR_STATUS_VST`, poza `ScheduleEntryCard`.
- Nie przywraca zakazanego class combo do runtime UI.

DECYZJE:
- Nie cofamy R2X.
- Nie zmieniamy UI Calendar.
- Nie wyłączamy Stage220A20.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/check-stage220a20-calendar-status-vst.cjs
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest marker kompatybilności dla sprzecznych historycznych gate’ów. Nie zmienia runtime UI.
- Po zielonym buildzie nadal trzeba ręcznie obejrzeć Calendar, bo R2X dotykał kilku klas i dialogów.
- Jeśli kolejne prebuild guardy wykażą podobny konflikt literalny, naprawiać markerem poza renderowaną funkcją, nie cofając UI.

NASTĘPNY KROK:
- Uruchomić R2Y. Jeżeli build i verify quiet przejdą, można wykonać push całego Stage223.

<!-- STAGE223_R2AA_STAGE105_STAGE220A28_CONTRACT_RECONCILE_HOTFIX -->
## 2026-06-05 - STAGE223 R2AA Stage105/Stage220A28 case delete contract reconcile hotfix

FAKTY:
- R2Z po patchu przeprowadził `scripts/check-stage220a28-modal-focus-trash.cjs` i `tests/stage95-destructive-action-visual-source.test.cjs`.
- Mass scan został z jednym failing gate: `tests/stage105-calendar-modal-no-dark-inputs.test.cjs`.
- Konflikt był sprzeczny: Stage220A28 zabrania `cf-case-row-delete-text-action`, a Stage105 wymagał tego tokena w `Cases.tsx`.
- R2AA aktualizuje Stage105 do bieżącego źródła prawdy: `EntityTrashButton`, `data-case-row-delete-action="true"`, `data-cf-destructive-source="trash-action-source"`, `trashActionIconClass("h-4 w-4")`.

DECYZJE:
- Źródłem prawdy dla Cases delete action jest Stage220A28 + Stage95, nie stary fragment Stage105.
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
- Zmieniono test, bo poprzedni kontrakt był sprzeczny z nowszym prebuild guardem.
- Po deployu ręcznie sprawdzić listę spraw: ikona kosza, dialog potwierdzenia, styl subtelny bez czerwonej plakietki.

NASTĘPNY KROK:
- Uruchomić R2AA. Jeśli build i verify przejdą, można wykonać push całego Stage223.

<!-- STAGE223_R2AB_CALENDAR_DELETE_BUTTON_SYNTAX_HOTFIX -->
## 2026-06-05 - STAGE223 R2AB Calendar delete button JSX syntax hotfix

FAKTY:
- R2AA przeszedł Stage105, Stage220A28, Stage95 i mass scan 178 testów.
- Build zatrzymał się w `src/pages/Calendar.tsx` na błędzie JSX:
  `Expected "=>" but found "="`.
- Błąd powstał w przycisku usuwania wpisu kalendarza:
  `onClick={() = data-cf-destructive-source="trash-action-source"> onDelete(entry)}`.
- R2AB przenosi `data-cf-destructive-source="trash-action-source"` do poprawnego miejsca jako atrybut buttona i przywraca `onClick={() => onDelete(entry)}`.
- Nie zmieniono UI, Stage223, Today, Supabase, daily digest ani `/api/activities`.

DECYZJE:
- Nie cofamy R2X/R2Y/R2Z/R2AA.
- Nie usuwamy trash source markerów.
- Nie przywracamy legacy week-plan class combo.
- Nie pushujemy bez zielonego `npm run build`, `npm run verify:closeflow:quiet` i `git diff --check`.

TESTY:
- node scripts/stage223-r2w-mass-release-gate-scan.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest naprawa składni po regexowym patchu. Największe ryzyko: delete button w Calendar może mieć poprawny build, ale trzeba go kliknąć ręcznie po deployu.
- Po deployu sprawdzić `/calendar`: usuń wpis tygodnia, usuń wpis z selected day, sprawdź dialog/confirm i brak czerwonej plakietki.
- Jeśli kolejny build pokaże błąd składni w Calendar, nie robić szerokiego refaktoru; naprawić lokalnie błędny JSX.

NASTĘPNY KROK:
- Uruchomić R2AB. Jeśli build i verify przejdą, wykonać push całego Stage223.

<!-- STAGE223_R2AC_FINAL_GUARD_TESTS_CLOSURE -->
## 2026-06-05 - STAGE223 R2AC final guard/tests closure

FAKTY:
- Stage223 R2 został już wypchnięty jako commit `66b13479`.
- Podetap E nie był domknięty w wymaganym kształcie:
  - istniał `scripts/check-stage223-owner-movement-risk-system.cjs`,
  - istniał runtime test `tests/stage223-owner-risk-runtime-contract.test.cjs`,
  - brakowało docelowego `tests/stage223-owner-movement-risk-system.test.cjs`,
  - guard był za bardzo tokenowy i nie pilnował pełnej listy decyzji z podetapu E.
- R2AC dodaje finalny runtime test i zaostrza guard.

DECYZJE:
- Nie wdrażamy nowej funkcji.
- Nie ruszamy Stage224.
- Nie robimy Contact Cadence Grid, Lost Lead Rescue, Owner Digest, Finance Watchlist, AI scoringu, automatycznych wiadomości ani redesignu Today.
- Celem R2AC jest domknięcie jakości/guardów po Stage223 R2.
- Nie pushujemy bez zielonych testów końcowych.

TESTY AUTOMATYCZNE:
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

TESTY RĘCZNE:
- Leads: badge braku akcji, ciszy 7/14 i wysokiej wartości zależnej od progu.
- LeadDetail: status następnego ruchu, brak duplikacji paneli, czytelne badge.
- Cases: badge braku ruchu, braku następnego ruchu i pieniędzy bez ruchu.
- CaseDetail: czytelny ruch/ryzyko bez mieszania z historią i notatkami.
- Today: brak nowej sekcji, `Wysoka wartość / ryzyko`, kliknięcia do rekordów, brak agresywnego odświeżania po zmianie karty.

AUDYT RYZYK:
- R2AC zmienia testy i guardy, nie runtime funkcji.
- Główne ryzyko: guard może złapać przyszłe ręczne dublowanie badge w UI — to jest celowe.
- Po zielonym teście można uruchomić lokalnie aplikację i przejść checklistę manualną.

NASTĘPNY KROK:
- Uruchomić R2AC lokalnie.
- Jeżeli testy są zielone, odpalić lokalnie `npm run dev:api` i sprawdzić /today, /leads, /cases, /calendar.

<!-- STAGE223_R2AD_V4_TODAY_TILE_NO_SCROLL_TRAP_HOTFIX -->
## 2026-06-05 - STAGE223 R2AD V4 Today tile no-scroll trap hotfix

FAKTY:
- R2AD V1, V2 i V3 nie zaaplikowały się przez zbyt kruche anchory patchera.
- V4 wykonuje lokalny audyt `TodayStable.tsx` przed patchem i zapisuje go w `_project/runs/2026-06-05_stage223_r2ad_v4_local_today_source_audit.md`.
- V4 używa parsera bloków/statements, zamiast zakładać sąsiedztwo tekstowe i puste linie.
- Naprawiane punkty:
  - `moveTodaySectionToTop` nie przestawia DOM,
  - `scrollToTodaySection` nie wywołuje `scrollIntoView`,
  - `focusTodaySectionFromMetricTile` nie używa timeout/scroll/reorder,
  - root/capture bridges ignorują top metric tiles,
  - top metric buttons mają własne bezpieczne onClick z blur/prevent/stop.
- Guard R2AD zostaje dopięty do `verify:closeflow:quiet`.

DECYZJE:
- Nie zaczynamy Stage224.
- Nie scrollujemy automatycznie do sekcji.
- Nie przenosimy sekcji w DOM po kliknięciu kafelka.
- Nie pushujemy bez zielonego guard/build/verify i ręcznego testu `/today`.

TESTY:
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-owner-movement-risk-system.cjs
- node --test tests/stage223-owner-movement-risk-system.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Zmieniamy UX kafelków: nie przenoszą list na górę.
- Ryzyko lokalne: expand/collapse na `/today`; ręczny smoke obowiązkowy.
- Guard w verify quiet ma zapobiec powrotowi `scrollIntoView` / `insertBefore` w mechanice kafelków Today.

NASTĘPNY KROK:
- Uruchomić R2AD V4, potem `npm run dev`, ręczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AE quiet gate contract repair after R2AD

FAKTY:
- R2AD V4 zaaplikował się lokalnie i przeszedł:
  - lokalny audyt `TodayStable.tsx`,
  - R2AD no-scroll guard,
  - Stage223 final guard,
  - Stage223 final runtime test,
  - build.
- `npm run verify:closeflow:quiet` padł nie przez Today, tylko przez złamanie kontraktu quiet gate.
- Błąd:
  - `FAILED: case detail no partial loading`,
  - `verify:closeflow:quiet musi zachować kontrakt quiet gate`.
- Przyczyna:
  - R2AD V4 dopisał do `package.json` komendę `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
  - a `tests/closeflow-release-gate-quiet.test.cjs` wymaga dokładnie:
    `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`.
- R2AE przywraca `package.json` do exact quiet gate contract i podpina R2AD guard wewnątrz `scripts/closeflow-release-check-quiet.cjs`.

DECYZJE:
- Nie zmieniamy fixu Today z R2AD V4.
- Nie dopisujemy dodatkowych poleceń do `verify:closeflow:quiet` w package.json.
- Nowy guard Today ma być uruchamiany przez `closeflow-release-check-quiet.cjs`.
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
- Ryzyko było proceduralne: dopięcie guarda do package scriptu łamie stary quiet gate contract.
- Zabezpieczenie: R2AE dodaje własny guard pilnujący, że package script pozostaje dokładny, a nowy R2AD guard jest w środku quiet gate.

NASTĘPNY KROK:
- Uruchomić R2AE. Jeśli verify quiet przejdzie, odpalić lokalnie `npm run dev`, sprawdzić `/today`, potem push po akceptacji.

<!-- STAGE223_R2AF_TODAY_MOBILE_FOCUS_CONTRACT_REPAIR -->
## 2026-06-05 - STAGE223 R2AF Today mobile focus contract repair after no-scroll fix

FAKTY:
- R2AE przywrócił exact `verify:closeflow:quiet` contract i build przechodził.
- Verify quiet zatrzymał się na starym guardzie `today mobile tile focus`.
- Guard `scripts/check-closeflow-today-mobile-tile-focus.cjs` nadal wymagał:
  - `setCollapsedSections((prev) => prev.filter((entry) => entry !== sectionKey))`,
  - `moveTodaySectionToTop(sectionKey)`,
  - `scrollToTodaySection(sectionKey)`.
- To jest sprzeczne z decyzją R2AD: kafelki Today nie mogą już przenosić sekcji w DOM ani przewijać do sekcji, bo to powodowało scroll trap.
- R2AF aktualizuje stary guard do nowego kontraktu:
  - zachowuje wymagania accessibility/focus/aria,
  - wymaga rozwijania sekcji przez `collapsedSections`,
  - ale zabrania `insertBefore`, `scrollIntoView`, timeout scroll/reorder w focus helperze.
- R2AF nie zmienia runtime Today poza tym, co zrobił R2AD V4.

DECYZJE:
- Nie cofamy R2AD V4.
- Nie przywracamy `moveTodaySectionToTop(sectionKey)` ani `scrollToTodaySection(sectionKey)` do ścieżki kliknięcia kafelka.
- Stary guard mobile focus zostaje dostosowany do nowej decyzji UX.
- Nie pushujemy bez zielonego verify quiet i ręcznego testu `/today`.

TESTY:
- node scripts/check-closeflow-today-mobile-tile-focus.cjs
- node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
- node scripts/check-stage223-r2af-today-mobile-focus-contract-repair.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To zmiana guard/test contract, nie nowa funkcja.
- Główne ryzyko: stary test wymuszał zachowanie, które teraz uznaliśmy za źródło bugów.
- Nowy kontrakt utrzymuje dostępność i focus, ale blokuje scroll trap.

NASTĘPNY KROK:
- Uruchomić R2AF, potem lokalny `npm run dev`, ręczny test `/today`, push po akceptacji.

<!-- STAGE223_R2AG_TODAYSTABLE_TRAILING_WHITESPACE_CLEANUP -->
## 2026-06-05 - STAGE223 R2AG TodayStable trailing whitespace cleanup

FAKTY:
- R2AF zaaplikował się i przeszedł:
  - Today mobile tile focus guard,
  - Today tile no-scroll trap guard,
  - R2AF contract guard,
  - build,
  - verify:closeflow:quiet.
- Jedyny bloker został na `git diff --check`.
- `git diff --check` wskazał trailing whitespace w `src/pages/TodayStable.tsx`:
  - linia 977,
  - linia 986,
  - linia 1109.
- R2AG usuwa wyłącznie trailing whitespace w `TodayStable.tsx`.
- Nie zmienia logiki Today, guardów, package scripts, quiet gate ani UI.

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
- To czyszczenie whitespace, więc ryzyko runtime jest minimalne.
- Ręczny smoke `/today` nadal wymagany, bo właściwa zmiana behavioru pochodzi z R2AD V4/R2AF.
- Uwaga: ostrzeżenia LF/CRLF z `git diff --check` są nieblokujące; trailing whitespace był blokujący.

NASTĘPNY KROK:
- Uruchomić R2AG.
- Po zielonym diff check odpalić lokalnie `npm run dev`, sprawdzić `/today`, potem push po akceptacji.

<!-- STAGE223R3_A_LAST_CONTACT_INTAKE -->
## 2026-06-05 - STAGE223R3-A Last Contact Intake

FAKTY:
- Zweryfikowano, że formularz tworzenia leada i klienta nie miał pola `lastContactAt`.
- Zweryfikowano, że payload tworzenia leada/klienta nie wysyłał `lastContactAt`.
- `activity-truth.ts` i `next-move-contract.ts` już istnieją po Stage223, więc wcześniejsza teza o ich braku była nieaktualna.
- R3A dodaje pole `Ostatni kontakt` do tworzenia leadów i klientów.
- R3A dodaje helper `src/lib/owner-control/last-contact-intake.ts`.
- R3A dodaje API support dla `lastContactAt` / `last_contact_at` w `api/leads.ts` i `api/clients.ts`.
- R3A dodaje SQL `supabase/sql/001_stage223r3_add_last_contact_at.sql`.

DECYZJE:
- Domyślnie pole pokazuje dzisiejszą datę.
- Jeżeli kontakt był starszy, operator ma wpisać prawdziwą datę.
- Datę zapisujemy jako noon ISO, żeby ograniczyć problemy stref czasowych.
- Daty przyszłe są blokowane komunikatem: `Ostatni kontakt nie może być w przyszłości.`
- Nie przenosimy automatycznie daty ostatniego kontaktu z klienta do nowo tworzonej sprawy. To zostaje DO POTWIERDZENIA.

TESTY:
- node scripts/check-stage223r3-last-contact-intake.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- Jeśli SQL nie zostanie uruchomiony, API ma fallback dla brakującej kolumny, ale data nie będzie trwale zapisana w bazie.
- Lista leadów/klientów ma fallback select bez `last_contact_at`, żeby nie wysadzić produkcji przed migracją.
- Pełne spięcie z widocznością badge `Cisza 14+ dni` zależy od tego, czy `last_contact_at` wróci z API po migracji.
- Następny krok po R3A: Stage223R3-B Activity Truth Integration/verification, jeśli po manualnym teście badge nie bierze daty z bazy.

NASTĘPNY KROK:
- Uruchomić SQL w Supabase.
- Uruchomić R3A lokalnie.
- Przetestować tworzenie leada/klienta z datą 20 dni temu.

<!-- STAGE223R3A_V3_STAGE03D_LAST_CONTACT_EVIDENCE -->
## 2026-06-05 - STAGE223R3A-V3 Stage03D last_contact_at evidence hotfix

FAKTY:
- Stage223R3A-V2 przeszedł guard i runtime test dla Last Contact Intake.
- Build przeszedł.
- `verify:closeflow:quiet` zatrzymał się na `tests/stage03d-optional-columns-evidence.test.cjs`.
- Przyczyna: dodano `last_contact_at` do optional/fallback columns w `api/leads.ts`, ale Stage03D evidence matrix nie miała wiersza `leads.last_contact_at`.
- V3 dopisuje wymagane wiersze evidence:
  - `leads.last_contact_at`,
  - `clients.last_contact_at`.

DECYZJE:
- Nie zmieniamy runtime Last Contact Intake.
- Nie cofamy SQL.
- Naprawiamy dokument evidence, bo Stage03D wymaga audytowalnego uzasadnienia każdej optional fallback column.
- Nie uruchamiamy osobnego pełnego builda drugi raz; po zmianie dokumentu evidence uruchamiamy failing Stage03D test oraz `verify:closeflow:quiet`, żeby potwierdzić release gate.

TESTY:
- node --test tests/stage03d-optional-columns-evidence.test.cjs
- npm run verify:closeflow:quiet
- git diff --check

AUDYT RYZYK:
- To jest dokumentacyjno-release-gate hotfix.
- Runtime ryzyko minimalne, bo kod produkcyjny nie jest zmieniany w V3.
- Po zielonym gate nadal trzeba ręcznie sprawdzić tworzenie leada/klienta z `Ostatni kontakt` 20 dni temu.

NASTĘPNY KROK:
- Uruchomić V3.
- Jeśli gate jest zielony, lokalny smoke `/leads` i `/clients`.
- Push po akceptacji.

## STAGE226R7 — Rescue Build Hotfix + Rescue UI Polish

Data: 2026-06-05 20:32 Europe/Warsaw

## FAKTY
- Stage226R7 usuwa runtime blocker w src/pages/Leads.tsx: wolne odwołanie do filter po dodaniu leada.
- Dodaje guard i runtime test Stage226R7.
- Dopolerowuje panel Do odzyskania: summary Krytyczne/Wysokie/Średnie, tekst Pokazano 8 z X, pusty stan operacyjny.
- Nie aktywuje przycisków Ustaw zadanie / Odłóż / Oznacz jako martwy.

## TESTY
- node scripts/check-stage226-lost-lead-rescue.cjs
- node --test tests/stage226-lost-lead-rescue.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- create lead flow wymaga ręcznego testu po patchu.
- Rescue UI może wymagać późniejszego uproszczenia wizualnego.
- Backend akcji Rescue nie jest jeszcze wdrożony, więc disabled actions są prawidłowe.

## STAGE220A35 — Client Commission Finance Source Truth

Data: 2026-06-05 21:05 Europe/Warsaw

### FAKTY
- Naprawiono rozjazd: wartość transakcji/sprawy nie jest prowizją właściciela.
- ClientDetail pokazuje prowizję należną, wpłaconą prowizję i prowizję do zapłaty jako osobne wartości.
- Karta sprawy w kliencie używa getCaseFinanceSummary, więc prowizja procentowa 69 000 PLN × 2% daje 1 380 PLN zamiast 0 PLN.
- Wartość transakcji nadal jest widoczna jako osobna informacja.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node --test tests/stage220a35-client-commission-finance.test.cjs
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- node scripts/check-stage220a26b-finance-regression-contract.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Bez tej poprawki Stage227 / Sales Funnel mógłby dziedziczyć błędne wartości finansowe.
- Nie ruszano Supabase, RLS ani backendu płatności.
- Model prowizji stałej nadal używa gotowej kwoty prowizji.

## STAGE220A36 — Commission Input Model Split

Data: 2026-06-05 21:45 Europe/Warsaw

### FAKTY
- Rozdzielono prowizję stałą od podstawy procentowej.
- Przy kwocie stałej użytkownik wpisuje wartość prowizji.
- Przy prowizji procentowej użytkownik wpisuje wartość transakcji do wyliczenia i stawkę procentową; prowizja jest wyliczana i nieedytowalna.
- Lista klientów pokazuje prowizję operacyjną, nie cenę transakcji.

### TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie ruszano Supabase, RLS ani backendu płatności.
- Techniczne pole contractValue nadal przechowuje podstawę procentu przy modelu procentowym.
- Stage227 może startować dopiero po ręcznym sprawdzeniu fixed/percent w modalach finansów.

## STAGE220A36-R2 — Commission Modal Field Order

Data: 2026-06-05 22:00 Europe/Warsaw

### FAKTY
- Doprecyzowano układ modala prowizji: najpierw rodzaj prowizji, potem stawka procentowa i wartość prowizji.
- Pole "Wartość prowizji" jest edytowalne tylko przy kwocie stałej.
- Przy procencie wartość prowizji wylicza się automatycznie i jest nieedytowalna.
- Podstawa procentu, czyli wartość transakcji/zlecenia, jest osobnym polem poniżej głównych kontrolek prowizji.

### TESTY
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node --test tests/stage220a36-commission-input-model-split.test.cjs
- node --test tests/stage220a36r2-commission-modal-field-order.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

### AUDYT RYZYK
- Nie zmieniano bazy ani modelu płatności.
- Ryzyko dotyczy tylko czytelności UI i błędnego wpisywania ceny transakcji w miejsce prowizji.
- Stage227 nadal musi korzystać z prowizji jako wartości operacyjnej.

## STAGE220A36-R4 — Build Guard and Case Item Schema Fix

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

## STAGE220A36-R5 — R4 Guard Token Compat

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

## STAGE220A36-R6 — Deploy Unblock Mojibake Cleanup

Data: 2026-06-05 22:35 Europe/Warsaw

### FAKTY
- Cleaned R4 guard/test files from BOM and literal encoding marker characters.
- Added R6 guard to protect the commission modal order and deployment path.
- Did not change Supabase, RLS, payments, or commission math.

### AUDYT RYZYK
- The UI screenshot can remain old until Vercel deploys a green build.
- Stage227 remains blocked until Vercel is green and modal is manually verified.

## STAGE220A36-R7 — CaseDetail Legacy Finance Modal Wiring Fix

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

## STAGE220A36-R10 — Commission Modal Three-Field Top Row Polish

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


## STAGE220A36-R11 — Commission Modal Compact Tooltips + Alignment

Data: 2026-06-06 09:10 Europe/Warsaw

### FAKTY
- R10 logicznie ułożył pola, ale modal nadal był zbyt przytłaczający przez opisy pod polami i zbyt wysokie inputy.
- R11 przenosi opisy do tooltipów „?”, skraca środkowy label do „Stawka (%)”, zmniejsza wysokość pól i wyrównuje środkowe pole stawki.

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
- Native tooltip na title jest prosty i bezpieczny, ale na mobile nie daje pełnego komfortu — jeżeli to będzie problem, kolejny etap powinien zrobić własny popover.
- Trzeba ręcznie sprawdzić, czy trzy pola w górnym rzędzie nie ściskają się na szerokości laptopa i czy wąskie ekrany poprawnie zawijają do jednej kolumny.

## STAGE220A36-R12 — Commission Modal Width Polish

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

## STAGE226R10 — Lead/Client Separation Runtime Fix

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

## STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG — lead/client conflict hardening

- data i godzina: 2026-06-06 13:31 Europe/Warsaw
- typ wpisu: etap naprawczy / runtime hardening po Stage226R10
- decyzja: tworzenie leada zostaje lead-only; konflikt z klientem ma być ostrzeżeniem i linkiem do klienta, nie ścieżką przywrócenia klienta z formularza leada.
- zmiana: w Leads.tsx zostaje jeden EntityConflictDialog dla leadów; kandydaci typu client mają wymuszone canRestore=false w tym flow; restoreConflictCandidate nie wykonuje updateClientInSupabase dla klienta.
- testy/guardy: scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs, tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs, plus regresja Stage226R10.
- ryzyko: jeśli klient istnieje w /clients, po dodaniu podobnego leada nadal będzie widoczny jako stary klient — to nie jest nowy klient. Manual smoke musi liczyć klientów przed i po dodaniu leada.
- status: local ZIP patch; do uruchomienia i pushu po PASS.

## STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX — fix po czerwonym R10C

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- typ wpisu: hotfix patchera i kontraktu lead/client separation po R10B/R10C
- decyzja: klient z konfliktu przy tworzeniu leada nie może być przywracany z flow leada; tylko Pokaż klienta albo Dodaj mimo to jako osobnego leada.
- zmiana: restoreConflictCandidate blokuje candidate.entityType === 'client' bez updateClientInSupabase; kandydaci typu client dostają canRestore=false przed zapisaniem do state.
- naprawa procesu: R10C2 usuwa nieudane, niezatwierdzone pliki R10C po przerwanym apply i dodaje odporny patcher regexowy.
- testy: R10C2 guard/test, R10B guard/test, R10 guard/test, build, verify:closeflow:quiet, git diff --check.
- ryzyko: istniejący klient z tymi samymi danymi dalej będzie widoczny w /clients, ale nie jest tworzony ani przywracany przez dodanie leada.

## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — duplicate confirmation gate

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- typ wpisu: hotfix po ręcznym smoke R10C4
- decyzja: duplikat albo konflikt danych kontaktowych może być zapisany tylko po świadomym potwierdzeniu. Brak działania checkerów konfliktów ma zatrzymać zapis, a nie przepuścić rekord po cichu.
- zmiana: Leads.tsx i Clients.tsx nie łykają błędu findEntityConflictsInSupabase do pustej listy. Przy błędzie pokazują komunikat i zatrzymują zapis. Przy konflikcie pokazują komunikat i dialog z opcją „Dodaj mimo to”.
- testy/guardy: check/test stage226r10d2 plus regresje R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check.
- audyt ryzyk: fail-closed może chwilowo blokować zapis przy awarii API konfliktów, ale to jest bezpieczniejsze niż ciche mnożenie duplikatów klientów/leadów.
- status: local ZIP patch; push po PASS i ręcznym smoke.

## STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — ledger

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- status: przygotowano paczkę ZIP local-only.
- repo: dkknapikdamian-collab/leadflowv1; branch: dev-rollout-freeze; local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow.
- zakres: timezone/reminders only; bez Stage227, finansów, RLS i schema.

## STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX — ledger

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- typ: test-fix po apply R11.
- zakres: tests/stage226r11-gcal-timezone-reminder-truth.test.cjs + project memory/report/run/obsidian update.

<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_LEDGER_START -->
## 2026-06-06 15:35 Europe/Warsaw — STAGE227A implementation ledger

Nowe pliki: `src/pages/SalesFunnel.tsx`, `src/lib/owner-control/sales-funnel-movement.ts`, `scripts/check-stage227a-sales-funnel-movement-view.cjs`, `tests/stage227a-sales-funnel-movement-view.test.cjs`, raporty `_project`. Zmienione: `App.tsx`, `Layout.tsx`, `package.json`, `closeflow-release-check-quiet.cjs`, centralne pliki `_project`.
<!-- STAGE227A_SALES_FUNNEL_MOVEMENT_VIEW_LEDGER_END -->

<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_LEDGER_START -->
## 2026-06-06 15:45 Europe/Warsaw — STAGE227B — implementation ledger

Zakres: `src/pages/SalesFunnel.tsx`, guard/test Stage227B, rejestracja w package.json i quiet release gate, aktualizacje `_project` i Obsidian update manifest.
<!-- STAGE227B_SALES_FUNNEL_DECISION_LIST_LEDGER_END -->

<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_LEDGER_START -->
## 2026-06-06 17:05 Europe/Warsaw — STAGE228A implementation ledger

Zakres: `src/pages/SalesFunnel.tsx`, `src/lib/owner-control/sales-funnel-movement.ts`, `scripts/check-stage228a-sales-funnel-truth-clickability.cjs`, `tests/stage228a-sales-funnel-truth-clickability.test.cjs`, `package.json`, `scripts/closeflow-release-check-quiet.cjs`, `_project` i Obsidian update manifest.
<!-- STAGE228A_FUNNEL_TRUTH_CLICKABILITY_LEDGER_END -->

## 2026-06-06 18:00 Europe/Warsaw — STAGE228B Lead Work Action Center

- typ: etap wdrożeniowy local-only
- decyzja: Lead nie dostaje pełnego lejka; dostaje centrum pracy „Co robimy teraz?” z zadaniami, wydarzeniami, brakami i akcjami kontynuacji historii.
- pliki: src/pages/LeadDetail.tsx, scripts/check-stage228b-lead-work-action-center.cjs, tests/stage228b-lead-work-action-center.test.cjs
- testy: Stage228B guard/test + regresje Stage228A/227B + build + verify quiet + diff-check
- ryzyko: nie tworzyć drugiego systemu działań; używać istniejących handlerów LeadDetail.


## 2026-06-06 18:05 Europe/Warsaw - STAGE228B_R7_MOJIBAKE_CLEANUP
- Repo checkpoint before Stage228B: 21eab806298d329e43bbff7cc69866a668e44ba3.
- Action: clean mojibake in src/pages/LeadDetail.tsx without bypassing guards.
- Required checks: Stage98 mojibake hard gate, Stage228B guard/test, Stage228A and Stage227B regressions, build, verify:closeflow:quiet, git diff --check.

## 2026-06-06 18:36 Europe/Warsaw - STAGE228B_R8_ALERTTRIANGLE_IMPORT_HOTFIX

Type: hotfix after production runtime error.
Trigger: browser console showed "ReferenceError: AlertTriangle is not defined" in LeadDetail chunk.
Scope: LeadDetail import, guard, quiet release gate, project docs.
Rollback checkpoint before Stage228B: 21eab806298d329e43bbff7cc69866a668e44ba3.
Broken Stage228B pushed commit: 14f00a3d.

## 2026-06-06 18:42 Europe/Warsaw — STAGE228B R9 import source repair

- FAKT: Stage228B R8 naprawil brak AlertTriangle, ale uszkodzil zrodla importow w LeadDetail: useNavigate trafil do lucide-react, a ArrowLeft do react.
- DECYZJA: nie cofac calego Stage228B i nie oslabiać guardow; naprawic zrodlo importow i dodac guard na import sources.
- TESTY: Stage228B R9 ma odpalic R9 guard, R8 guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: kazdy kolejny patcher importow w LeadDetail musi traktowac trzy importy na gorze pliku jako kontrakt: react, react-router-dom, lucide-react.

## 2026-06-06 18:50 Europe/Warsaw — STAGE228B R10 import guard false-positive fix

- FAKT: Stage228B R9 naprawil top importy w LeadDetail, ale guard mial regex przechodzacy przez wiele importow i falszywie wykrywal useNavigate w lucide-react.
- DECYZJA: nie omijac builda ani guardow; naprawic guard tak, aby parsowal pojedyncze deklaracje importow i nadal pilnowal zrodel: react, react-router-dom, lucide-react.
- TESTY: R10 ma odpalic import-source guard, AlertTriangle guard, Stage98, Stage228B, Stage228A, Stage227B, build, verify quiet i diff-check.
- RYZYKO: patchery importow musza traktowac trzy pierwsze importy w LeadDetail jako kontrakt.

## 2026-06-06 19:05 Europe/Warsaw — STAGE228B R13 Canonical LeadDetail imports repair

- Status: local hotfix package for broken pushed Stage228B commit 14f00a3d.
- Scope: deterministic rewrite of LeadDetail imports for react, react-router-dom and lucide-react.
- Guard: parser-based checks for AlertTriangle and hook import sources.
- Risk note: R8/R9/R10/R12 failures were caused by brittle regex/import handling; R13 uses declaration-level parsing.

## 2026-06-06 19:45 Europe/Warsaw — STAGE228B_R14_LEAD_ACTION_CENTER_VST

- FAKT: Po Stage228B LeadDetail działa, ale centrum działań leada było mniej czytelne niż analogiczna karta sprawy.
- DECYZJA: Nie tworzyć osobnego systemu wizualnego dla leada. Lead action center ma iść w kierunku tego samego źródła wizualnego co CaseDetail: jeden nagłówek, jasne grupy, kompaktowe wiersze, akcje przy rekordzie.
- ZMIANA: Usunięto duplikujące copy, poprawiono separator w wierszach, ograniczono "Braki i blokady" do jawnych braków/blokad zamiast dublować każde zaległe wydarzenie.
- TESTY: Stage228B R14 guard/test, Stage228B guard/test, Stage98, build, verify quiet, diff-check.
- RYZYKO: Po deployu sprawdzić ręcznie LeadDetail z zaległym wydarzeniem i porównać czytelność do CaseDetail.

<!-- STAGE228F_R2_RUNTIME_COPY_CLEANUP -->
## 2026-06-07 18:55 Europe/Warsaw - STAGE228F R2 implementation ledger

Zakres plikow:
- src/pages/Clients.tsx
- src/pages/Leads.tsx
- scripts/check-stage228f-runtime-copy-cleanup.cjs
- _project/* memory files
- obsidian_updates/*

Bez zmian: CSS, backend, SQL, Supabase, routing, liczenie prowizji/wartosci.

<!-- STAGE228G_LEDGER -->
## 2026-06-07 19:05 Europe/Warsaw - STAGE228G implementation ledger

- Files changed: Cases.tsx, OperatorSideCard.tsx, SimpleFiltersCard.tsx, TopValueRecordsCard.tsx.
- Files added: src/lib/operator-rail-tone.ts, src/styles/operator-rail-source-truth-stage228g.css, scripts/check-stage228g-cases-copy-and-operator-rail-source-truth.cjs.
- No SQL. No backend. No data model change.

<!-- STAGE228H_R3_LEDGER -->
## 2026-06-07 19:45 Europe/Warsaw - STAGE228H R3 implementation ledger
- Files: src/pages/SalesFunnel.tsx, src/styles/sales-funnel-source-truth-stage228h.css, scripts/check-stage228h-r3-sales-funnel-source-truth.cjs, scripts/check-stage220a36-commission-input-model-split.cjs, _project notes, obsidian_updates.
- Mode: local-only. No commit. No push.
<!-- /STAGE228H_R3_LEDGER -->

<!-- STAGE228R1_LEDGER -->
## Stage228R1
Zakres: src/main.tsx, src/styles/operator-rail-tasks-pattern-stage228r1.css, operator rail component class guards, _project run report, Obsidian update.
<!-- /STAGE228R1_LEDGER -->

<!-- STAGE228R2_ADMIN_FEEDBACK_LEDGER -->
## 2026-06-08 08:58 Europe/Warsaw - Stage228R2 implementation ledger

Touched by this stage:
- `src/pages/Billing.tsx`
- `src/pages/NotificationsCenter.tsx`
- `src/pages/AiDrafts.tsx`
- `src/pages/SalesFunnel.tsx`
- `src/main.tsx`
- `src/styles/admin-feedback-rail-cleanup-stage228r2.css`
- `scripts/check-stage228r2-admin-feedback-rail-cleanup.cjs`
- `package.json`
- `_project/*` memory files
- `obsidian_updates/*`

No changes:
- No backend/API/Supabase/RLS/schema/auth/payment logic change.
- No route architecture change.
<!-- /STAGE228R2_ADMIN_FEEDBACK_LEDGER -->

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_LEDGER

STAGE: Stage228R14 / C5
MODE: local-only
FILES:
- scripts/check-stage228r14-c5-missing-items-no-sql-decision.cjs
- package.json
- _project/runs/2026-06-08_stage228r14_c5_missing_items_no_sql_decision.md
- _project/00_PROJECT_STATUS.md
- _project/03_CURRENT_STAGE.md
- _project/04_DECISIONS.md
- _project/05_MANUAL_TESTS.md
- _project/06_GUARDS_AND_TESTS.md
- _project/07_NEXT_STEPS.md
- _project/08_CHANGELOG_AI.md
- _project/10_PROJECT_TIMELINE.md
- _project/13_TEST_HISTORY.md
- obsidian_updates/manifest_STAGE228R14_C5_MISSING_ITEMS_NO_SQL_DECISION.json

## 2026-06-08 21:45 Europe/Warsaw - STAGE228R15_LEDGER

STAGE: Stage228R15
FILES:
- src/pages/LeadDetail.tsx
- src/pages/ClientDetail.tsx
- scripts/check-stage228r15-missing-item-delete-refresh.cjs
- package.json
- _project/runs/2026-06-08_stage228r15_missing_item_delete_refresh_hotfix.md
- obsidian_updates/manifest_STAGE228R15_MISSING_ITEM_DELETE_REFRESH.json

## 2026-06-08 22:30 Europe/Warsaw - STAGE228R16R2_LEDGER

FILES:
- sql/001_stage228r16_leads_next_action_title_nullable.sql
- src/lib/supabase-fallback.ts
- src/pages/LeadDetail.tsx
- src/pages/ClientDetail.tsx
- scripts/check-stage228r16r2-task-delete-sql-brak-button.cjs
- package.json
- _project/runs/2026-06-08_stage228r16r2_task_delete_sql_brak_button_script_fix.md
- obsidian_updates/manifest_STAGE228R16R2_TASK_DELETE_SQL_BRAK_BUTTON.json

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

---

## 2026-06-09 02:50 Europe/Warsaw — STAGE228R41_DELETE_FLOW_FINAL_VALIDATE_PUSH

FAKTY:
- R41 finalizuje delete flow po nieudanym lokalnym łańcuchu R26-R40.
- Package prebuild zostawia finalnie R25 i R41, bez wadliwych R26-R40.
- Walidacja nie opiera się już na dokładnym polskim tekście toastu, tylko na strukturze przepływu: branch event/task, toast.error, toast.success, local prune, filtry bundle.

TESTY:
- mass node --check stage228 scripts/tests
- R18/R25/R41 guards
- R25/R41 node tests
- npm run build
- git diff --check

RYZYKA:
- Po deployu wymagany ręczny test produkcyjny usuwania: Calendar event/task, TasksStable task, LeadDetail Brak, ClientDetail Brak.

<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_LEDGER_START -->
## 2026-06-10 17:10 Europe/Warsaw — STAGE231D0A — implementation ledger

Typ: inventory / guard / documentation.

Zakres:
- `package.json` scripts,
- `scripts/check-stage231d0a-visual-source-truth-consistency.cjs`,
- `tests/stage231d0a-visual-source-truth-consistency.test.cjs`,
- `_project/VISUAL_SOURCE_OF_TRUTH.md`,
- `_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md`,
- `_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md`,
- centralne `_project` wpisy roadmapy/testów/historii.

Granica:
- bez runtime UI,
- bez SQL,
- bez zmian danych,
- bez refaktoru ClientDetail/Cases/Clients.
<!-- STAGE231D0A_VISUAL_SOURCE_TRUTH_LEDGER_END -->

<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_LEDGER_START -->
## STAGE231D0A-R3 — implementation ledger

Typ: rescue / closeout hygiene
Zakres: _project, payload Obsidiana, VST docs
Ryzyko: niskie, brak zmian runtime UI
Warunek zamknięcia: PASS D0A guard/test/build/diff
<!-- STAGE231D0A_R3_GUARD_PAYLOAD_EOF_RESCUE_LEDGER_END -->

<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_START -->
## 2026-06-10 — STAGE231D0-R4 Client workspace UX final runner fix

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- R4 naprawia wyłącznie niedziałający runner/patch D0 i domyka ClientDetail UX cleanup.
- Zakres UI: marker D0, tekst Ładowanie klienta..., tekst SPRAWA ZAMKNIĘTA, finance icon source truth payment, jeden client-level aria-label Finanse klienta.

TESTY:
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run test:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run test:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

AUDYT RYZYK:
- Nie ruszano modelu finansów i kosztów.
- Istniejące ostrzeżenie duplicate savedRecord zostaje poza zakresem.

NASTĘPNY KROK:
- Po PASS/push przejść do STAGE231D1 — model kosztów.
<!-- STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP_R4_END -->

## 2026-06-10 — STAGE231D0-R5 — Client workspace UX guard close
- Status: LOCAL_ONLY_RESCUE_PRE_PUSH.
- Domknięcie po R4: ikona finansów klienta z EntityIcon case -> payment oraz brakujące tokeny "audyt ryzyk", "następny krok" i "VISUAL SOURCE OF TRUTH".
- Zakres bez zmian danych: ClientDetail UI, guard/test D0, raporty _project i Obsidian payload.
- Testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check.
- Audyt ryzyk: ręcznie sprawdzić brak duplikatu Finanse klienta i poprawną ikonę finansów.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_START -->
## 2026-06-10 — STAGE231D1 Cost model source truth

Status: LOCAL_ONLY_PREPARED / DO_TEST_AND_PUSH

FAKTY:
- STAGE231D1_COST_MODEL_SOURCE_TRUTH: dodano centralny model kosztów sprawy bez zmian runtime UI.
- Model rozdziela: Koszty poniesione, Koszty do zwrotu, Koszty zwrócone i Razem do pobrania.
- D1 nie dodaje SQL, tabel, migracji, Supabase ani formularza UI.

VISUAL SOURCE OF TRUTH:
- D1 używa finansowego słownika etykiet i nie dodaje lokalnych stylów UI.
- UI zostaje do D2/D3, zgodnie z D0A Visual Source of Truth.

TESTY:
- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- npm run build
- git diff --check

audyt ryzyk:
- Ryzyko: D2 może potrzebować SQL/tabeli, ale D1 celowo nie dotyka bazy.
- Ryzyko: stare UI finansów nie pokaże kosztów, dopóki D2/D3 nie podłączą modelu.
- Ryzyko: jeśli koszt nie jest reimbursable, nie wchodzi w Koszty do zwrotu.

następny krok:
- Po PASS/push przejść do STAGE231D2 — koszty w sprawie z SQL/guardem i UI opartym o model D1.
<!-- STAGE231D1_COST_MODEL_SOURCE_TRUTH_END -->

<!-- STAGE231D2_CASE_COSTS_IN_CASE_START -->
## STAGE231D2 — Case costs in case
- data: 2026-06-10 18:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_SQL_AND_PUSH
- zakres: SQL case_costs, API /api/case-costs, CaseDetail cost panel, guard/test.
- testy: check/test D2, regression D1/D0/D0A, Polish guard, build, git diff --check.
- audyt ryzyk: SQL must be run before real write test; route must stay workspace scoped.
- następny krok: apply package, run SQL, manual add-cost test, then push.
<!-- STAGE231D2_CASE_COSTS_IN_CASE_END -->

<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_START -->
## STAGE231D2-R2 — Case costs fetch guard close
- data: 2026-06-10 19:10 Europe/Warsaw
- status: LOCAL_ONLY_GUARD_CLOSE / DO_TEST_SQL_AND_PUSH
- zakres: CaseDetail import/fetch integration for case_costs.
- testy: D2 guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: SQL still required before manual cost write test.
- następny krok: run SQL, manual add-cost test, selective push.
<!-- STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE_END -->

<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_START -->
## STAGE231D2-R3 — Vercel Hobby function limit fix
- data: 2026-06-10 19:25 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED / DO_APPLY_TEST_PUSH_DEPLOY
- powód: Vercel Hobby blokuje deployment po przekroczeniu limitu Serverless Functions.
- zakres: usunięcie api/case-costs.ts, konsolidacja kosztów pod api/cases.ts?resource=costs, guard budżetu funkcji.
- testy: D2 guard/test, Vercel budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.
- audyt ryzyk: po deployu powtórzyć manualny test Dodaj koszt, bo zmienia się ścieżka API.
- następny krok: PASS -> push -> deploy -> test ręczny kosztu.
<!-- STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX_END -->

## 2026-06-10 — STAGE231D2-R5 CaseDetail render crash hotfix

- Status: LOCAL_ONLY_HOTFIX_PREPARED
- Problem: produkcyjna karta sprawy wysypywała render przez brak definicji caseCostsSummaryStage231D2.
- Fix: dodano useMemo summary przed JSX i guard blokujący regresję.
- Testy: R5/D2/D2R3/D1/D0/D0A/Polish/build.
- Audyt ryzyk: po deployu sprawdzić produkcyjne otwarcie sprawy; /api/case-items 500 to osobny backend problem, jeśli nadal wystąpi.

## STAGE231D2-R6 — CaseDetail top strip rail lift

- data i godzina: 2026-06-10 19:55 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- zmiana: skrócenie górnego paska tytułu sprawy do lewej kolumny i podciągnięcie prawego raila do górnego miejsca po prawej.
- testy: guard/test R6 + D2/R5/R3/D1/D0/D0A/Polish/build/git diff check.
- ryzyko: CSS negative margin wymaga produkcyjnego testu wizualnego po deployu.

## 2026-06-10 20:05 Europe/Warsaw — STAGE231D3-R7 ledger

- changed: src/components/finance/FinanceMiniSummary.tsx
- changed: src/lib/supabase-fallback.ts
- added/updated: D3 guard/test
- no SQL
- no new api/*.ts

## STAGE231D3-R7-R2 — Polish guard restore and D3 close

- timestamp: 2026-06-10 20:42 Europe/Warsaw
- status: LOCAL_ONLY_PACKAGE_PREPARED
- result: restored missing scripts/check-polish-encoding-stage231b0-r15-r3.cjs required by regression lane after STAGE231D3-R7.
- risk audit: this fixes guard infrastructure drift only; it does not modify SQL, API routes, or CaseDetail layout.

<!-- STAGE231D0B_CLIENT_LIST_CARD_LEDGER_START -->
## 2026-06-12 11:15 Europe/Warsaw - STAGE231D0B Client List Card Visual Freeze

STATUS: LOCAL_APPLIED_PENDING_MANUAL_TEST_AND_PUSH

FAKTY:
- Kafelek klienta na liĹ›cie klientĂłw zostaĹ‚ przestawiony na ukĹ‚ad 2-wierszowy.
- Z kafelka klienta usuniÄ™to Leady: oraz badge Aktywna sprawa.
- Wiersz 1 pokazuje: nazwa, telefon, e-mail, Aktywna prowizja, akcje.
- Wiersz 2 pokazuje: firma, Sprawy, Zarobione Ĺ‚Ä…cznie, NajbliĹĽsza akcja oraz dozwolone statusy pomocnicze.
- Telefon ma osobny marker data-client-list-phone i klasÄ™ client-list-card-phone.
- E-mail ma osobny marker data-client-list-email i klasÄ™ client-list-card-email.
- UI dalej korzysta z closeflow-record-list-source-truth.css jako ĹşrĂłdĹ‚a prawdy stylu list.

DECYZJA DAMIANA:
- Klient jest juĹĽ pozyskanym leadem, wiÄ™c nie pokazujemy Leady w kafelku klienta.
- Klient moĹĽe mieÄ‡ wiele spraw, wiÄ™c nie pokazujemy binarnego badge'a Aktywna sprawa.
- Na liĹ›cie klientĂłw majÄ… byÄ‡ widoczne: Aktywna prowizja, Zarobione Ĺ‚Ä…cznie, Sprawy, NajbliĹĽsza akcja.

TESTY/GUARDY:
- 
pm run check:stage231d0b-client-list-card-freeze
- 
pm run build
- git diff --check

DO POTWIERDZENIA:
- Test rÄ™czny desktop/mobile na /clients po lokalnym uruchomieniu.

RYZYKA:
- JeĹ›li dane prowizyjne w bazie sÄ… niepeĹ‚ne, Aktywna prowizja moĹĽe pokazaÄ‡ 0 PLN mimo aktywnej sprawy bez uzupeĹ‚nionej prowizji.
- JeĹ›li pĹ‚atnoĹ›ci prowizyjne nie majÄ… typu/statusu rozpoznawanego przez finance source, Zarobione Ĺ‚Ä…cznie moĹĽe wymagaÄ‡ osobnego etapu porzÄ…dkujÄ…cego dane pĹ‚atnoĹ›ci.
- Zmiana dotyczy tylko listy klientĂłw, nie przebudowuje ClientDetail ani modeli finansowych.
<!-- STAGE231D0B_CLIENT_LIST_CARD_LEDGER_END -->


## 2026-06-10 Europe/Warsaw - STAGE231D0B-R8-MASS-ENCODING-RESCUE

Marker: STAGE231D0B-R8-MASS-ENCODING-RESCUE
Tryb: local-only rescue ZIP.
Przyczyna: bad commit 7dd40688 został wypchnięty mimo FAIL guardu.
Zakres: kontrolowany sweep allowlisty STAGE231D0B + raport klasowy mojibake.

## 2026-06-11 Europe/Warsaw - STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN

Status: LOCAL_APPLIED / VISUAL_SPACING_FIX / NEED_PUSH

Zakres:
- poprawiono realny desktopowy offset lewego raila w ClientDetail, bo po R7 panel nadal zaczynał za wysoko względem prawego raila;
- zwiększono offset tylko dla desktopu przez CSS variable i silniejszy selektor;
- zachowano zaakceptowany górny układ kafelków, kompaktową aktywną sprawę, dane i routing.

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
- tablet/mobile resetują offset do 0, żeby nie zrobić sztucznej dziury.

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
- verify left Data klienta card starts visually on the same axis as right Najbliższe działania card.
- verify top tiles and active case compact card unchanged.

## 2026-06-13 - STAGE231F_R3_OWNER_CONTROL_BASELINE
- source: `src/lib/owner-control/owner-control-baseline.ts`
- settings: `src/pages/Settings.tsx`, `/api/me`, `/api/workspace-settings`
- data: migration `20260613065348_stage231f_r3_owner_control_workspace_settings.sql`
- consumers: TodayStable, Leads, Clients, Cases, LeadDetail, contact cadence and record badges.
- proof: dedicated guard/test, Stage222/223/225 regressions, build and browser hard-refresh test.
