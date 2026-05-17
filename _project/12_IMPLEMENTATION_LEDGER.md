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
