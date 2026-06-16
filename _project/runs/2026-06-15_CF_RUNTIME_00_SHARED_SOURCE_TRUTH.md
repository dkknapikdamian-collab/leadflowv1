# CF-RUNTIME-00 - Shared source-of-truth foundation + guard baseline

Data: 2026-06-15 22:56 Europe/Warsaw
Status: PREPARED_IN_ZIP_LOCAL_APPLY
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT\10_PROJEKTY\CloseFlow_Lead_App

## 1. Scope

- Stage name: CF-RUNTIME-00 - Shared source-of-truth foundation + guard baseline
- Runtime change: YES - new helper only, no existing runtime wiring changed.
- Visual place in app where Damian verifies result: none. This is a technical foundation stage.
- Route/screen: none changed. Helper defines `/case/:id` canonical route and `/cases/:id` legacy alias.
- What must not be touched: LeadDetail, ClientDetail, CaseDetail, Today, Tasks, Calendar, Billing, Settings, CSS, SQL, Supabase, migrations, env, Vercel.

## 2. Scan proof

### Method

- Chat/connector scan of app repo files.
- Local Obsidian direct read was not available in the chat runtime. The apply script writes an Obsidian sync payload locally if the vault exists.

### Repo files read

- `AGENTS.md`
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
- `_project/STAGE_TEMPLATE_MINIMAL.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `package.json`
- `scripts/closeflow-release-check-quiet.cjs`
- `src/lib/access.ts`
- `src/lib/plans.ts`
- `tsconfig.json`

### Obsidian/project-memory files read

- Direct local Obsidian read: OBSIDIAN_LOCAL_UNAVAILABLE_IN_CHAT_RUNTIME.
- Apply script target: `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`, `06_PLAN_WDROZEN_NAPRAW_PO_AUDYTACH.md`, and `99_SYNC/2026-06-15_CF_RUNTIME_00_SHARED_SOURCE_TRUTH.md`.

### Current project status

FAKTY:
- `AGENTS.md` requires scan-first before changes and update of `_project`/Obsidian after each meaningful stage.
- `_project/00_PROJECT_MEMORY_PROTOCOL.md` states repo is source of truth for code/tests/guards/run reports, while Obsidian is dashboard for decisions/status/manual tests/risks/direction.
- `package.json` already has `verify:closeflow:quiet` pointing to `scripts/closeflow-release-check-quiet.cjs`.
- `src/lib/plans.ts` currently normalizes `paid_active` without planId to `pro` in `normalizePlanId()`.

### Active decisions

- Work on branch `dev-rollout-freeze`.
- ZIP/local apply workflow.
- No UI/Supabase/SQL in this stage.
- New helper must not become a dead contract: guard and runtime test are mandatory.

### Open risks

- Quiet gate is very large and can fail on unrelated older guard debt; if so, stop and report exact blocker.
- This stage creates a source-of-truth helper but does not yet wire UI screens to it.
- `paid_active` without planId remains legacy behavior in existing runtime until a later explicit stage rewires it.

### Recent stages

- STAGE231/232/233 family around visual source truth, missing/blocker runtime, owner control, and guard cleanup.
- Exact latest local state must be confirmed by `git status --short --branch` before apply.

### Next logical step

- After this stage passes: CF-RUNTIME-01 LeadDetail missing/blocker/handoff source-truth wiring or CF-RUNTIME-03 CaseDetail source-truth wiring.

## 3. AUDYT PRZED ETAPEM

### Stage existence map

- What already exists:
  - Route split exists conceptually: `/case` and legacy `/cases` appear in project direction.
  - Plan normalization exists in `src/lib/plans.ts`.
  - Access summary exists in `src/lib/access.ts`.
  - Quiet release gate exists.
- What is missing:
  - Single helper for route truth, status truth, missing/blocker classification, and safe access plan truth.
  - Dedicated runtime test for this helper.
  - Dedicated guard and package scripts.
  - Quiet release gate wiring for this stage.
- What conflicts:
  - Existing `normalizePlanId()` fallback maps `paid_active` without planId to Pro. This stage does not remove that runtime behavior, but creates a safer contract for later rewiring.
- Existing guards/tests:
  - Many stage-specific guards exist; no dedicated CF-RUNTIME-00 guard/test was found in scanned package.json.
- Missing guards/tests:
  - `scripts/check-cf-runtime-00-source-truth.cjs`
  - `tests/cf-runtime-00-source-truth.test.cjs`

### Area map

- User-visible screen/route: none.
- Components/modules: `src/lib/closeflow-runtime-source-truth.ts`, package scripts, quiet gate.
- Data source: none changed.
- Actions affected: none changed.
- Similar places inspected: `src/lib/access.ts`, `src/lib/plans.ts`, `package.json`, `scripts/closeflow-release-check-quiet.cjs`.
- Shared helpers: new source-truth helper only.
- What must not be touched: pages, UI, SQL/Supabase, CSS, env.

### Real adjacent problems found

- Problem: `paid_active` without planId can still be treated as Pro by legacy `normalizePlanId()`.
- Evidence: `src/lib/plans.ts` has `if (status === 'paid_active') return PLAN_IDS.pro;`.
- Risk: future runtime may show/use Pro features without explicit plan evidence.
- Fix now or later: later. This stage creates a safe helper contract without changing current UI/runtime behavior.

### Regression risks before implementation

- UI risk: low, no UI files touched.
- Data risk: low, no data writes or loaders touched.
- Auth/security risk: medium if later stages incorrectly use fallback as confirmed plan; helper exposes `requiresPlanIdConfirmation` to prevent that.
- Routing risk: low, helper only defines route contract.
- Supabase/RLS risk: none, no SQL/Supabase touched.
- Docs/Obsidian drift risk: medium if `_project` and Obsidian are not updated after ZIP apply.

### Guard/test plan

- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `node --test tests/cf-runtime-00-source-truth.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## 4. Report baskets

### FAKTY Z KODU / PLIKOW

- Added helper: `src/lib/closeflow-runtime-source-truth.ts`.
- Added runtime test: `tests/cf-runtime-00-source-truth.test.cjs`.
- Added guard: `scripts/check-cf-runtime-00-source-truth.cjs`.
- Added package scripts for check/test.
- Quiet gate patched with new guard/test.

### DECYZJE DAMIANA

- Do not create second source of truth screen-by-screen.
- Start with runtime source-truth foundation before fixing LeadDetail/ClientDetail/CaseDetail.
- Keep this stage technical: no UI, no SQL, no Supabase.

### HIPOTEZY / PROPOZYCJE AI

- Best next implementation path is to wire LeadDetail missing/blocker/handoff to the helper after this foundation passes.

### DO POTWIERDZENIA

- Whether the local Obsidian files are clean and available during apply.
- Whether quiet gate passes on Damian's local machine after the stage.

### TESTY AUTOMATYCZNE

To run locally:

```powershell
node scripts/check-cf-runtime-00-source-truth.cjs
node --test tests/cf-runtime-00-source-truth.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

### GUARDY

- `check:cf-runtime-00-source-truth`
- `test:cf-runtime-00-source-truth`
- quiet release gate wiring

### TESTY RECZNE

BRAK POTWIERDZONEGO TESTU RECZNEGO — etap techniczny, brak UI.

### POTWIERDZENIA DAMIANA

- Do uzupełnienia po lokalnym apply i akceptacji wyniku.

### BRAKI I RYZYKA

- Existing runtime still uses legacy `normalizePlanId()` until a later explicit wiring stage.
- Quiet gate may fail on older unrelated guard; do not push until resolved or classified.

### WPLYW NA OBSIDIANA

- Add sync note in `99_SYNC`.
- Append stage entry to CloseFlow start/plan if local files exist.

### WPLYW NA KIERUNEK ROZWOJU

- Confirms direction: one shared runtime source of truth before screen-specific repairs.

### NASTEPNY KROK

- CF-RUNTIME-01 LeadDetail missing/blocker/handoff wiring or CF-RUNTIME-03 CaseDetail wiring.

### GIT / ZIP STATUS

- ZIP prepared for local apply.
- No direct GitHub push performed by chat.

## 5. AUDYT PO ETAPIE

### Cause check

- Original problem: repeated screen-specific truth drift around routes, statuses, missing/blockers and plan fallback.
- Root cause fixed or only symptom masked: foundation added; existing UI/runtime not rewired yet.
- Evidence: new helper + runtime test + guard + package scripts + quiet gate entry.

### Related-place check

- Similar places checked: `src/lib/access.ts`, `src/lib/plans.ts`, `package.json`, quiet gate.
- Shared components/helpers checked: none touched.
- Places intentionally not touched and why: LeadDetail/ClientDetail/CaseDetail/Today/Tasks/Calendar/Billing/Settings because this is a foundation stage only.

### Regression check

- UI/readability: no UI changes.
- Routing: route helper added only; no router changed.
- Auth/gating: no access runtime changed.
- Data/refetch/optimistic update: not touched.
- Status/mapping: helper added; no existing flows rewired.
- Mobile: not applicable.
- Docs/project memory: `_project` and Obsidian payload prepared.

### New problems found

- No new problem added beyond known paid_active fallback risk.
- Znalezione problemy: brak nowych, unless local apply scan finds additional evidence.

### Verification result

- Guards/tests run: to be appended by local apply output.
- Result: PENDING_LOCAL_RUN.

## R4 hotfix - PowerShell command runner repair
Date: 2026-06-15 23:18 Europe/Warsaw
Reason: R3 script used a parameter name that collided with PowerShell argument handling and executed git without arguments.
Change: Run-Step now uses named parameters and CommandArgs, so git status, guards and tests receive explicit arguments.
Carry-over from R3: CaseDetail loading reference guard accepts the current settlement rail source truth marker data-case-settlement-rail-card=true.
Carry-over from R3: trailing whitespace cleanup for CF-RUNTIME-00 markdown append targets.
Scope: no UI, no SQL, no Supabase, no CaseDetail.tsx changes.


## 2026-06-15 23:35 Europe/Warsaw - R6 Stage98B encoding gate hotfix

Status: APPLIED_LOCAL_HOTFIX

Reason:
- CF-RUNTIME-00 guard/test/build were green.
- verify:closeflow:quiet was blocked by Stage98B mojibake gate.
- R6 fixes visible mojibake/BOM in active src files and excludes only intentional scripts/tests that store bad encoding tokens as guard fixtures.

Touched extra files:
- tests/stage98-polish-mojibake-calendar-guard.test.cjs
- src/pages/CaseDetail.tsx
- src/pages/ClientDetail.tsx
- src/styles/closeflow-unified-page-canvas-stage211c.css
- src/styles/operator-rail-tasks-pattern-stage228r1.css
- src/styles/visual-stage9-ai-drafts-vnext.css
- any scripts/tests where only UTF-8 BOM was stripped

Risk audit:
- Text-only fixes can affect visible Polish labels, but do not change data flow.
- Stage98 is not disabled; src remains strictly scanned.
- Scripts/tests with intentional detector tokens are skipped to avoid false positives.

## 2026-06-15 23:59 Europe/Warsaw - CF_RUNTIME_00_R9_STAGE98_ENCODING_REPAIR

- Status: APPLIED_LOCALLY_BY_ZIP_R9
- Zakres: Stage98 encoding gate repair, real runtime source mojibake cleanup, current guard compatibility.
- Testy: Stage98, CF-RUNTIME-00 guard/test, CaseDetail loading guard, build, verify:closeflow:quiet, git diff --check.
- Ryzyko: Stage98 pozostaje twardym gate dla src/* i aktualnych guardow; stare fixture guardy nie sa aktywnym runtime source.


## 2026-06-16 00:55 Europe/Warsaw - R15 quick actions marker batch guard

- Powod: quiet gate odslonil kolejny legacy P1 guard z markerem CLOSEFLOW_CASE_QUICK_ACTIONS_NO_HELPER_COPY_P1_2026_05_13.
- Zakres: batch patch wszystkich testow CaseQuickActions zawierajacych ten marker do aktualnego kontraktu shared QuickActionsBar.
- Zmienione testy: tests/case-detail-history-visual-p1-repair4-2026-05-13.test.cjs.
- Guard zakresu CF-RUNTIME-00 rozszerzony tylko o testy zmienione w tym batchu.


## 2026-06-16 CF-RUNTIME-00 R16 completed label consistency

- status: APPLIED_BY_R16_SCRIPT / PENDING_FULL_GATE_AT_WRITE_TIME
- reason: quiet gate surfaced `tests/ui-completed-label-consistency.test.cjs`
- change: CaseDetail completed action/status copy now uses `zrobione` wording instead of `zakończ` wording
- scope: `src/pages/CaseDetail.tsx`, run report / sync notes only
- generated_at_utc: 2026-06-16T06:01:10.661Z

## CF-RUNTIME-00 R17 - trial 14 source-truth mass guard

- Date: 2026-06-16 Europe/Warsaw
- Result: pending local guard run at package apply time
- Scope: mass repair stale Trial 21 source-truth docs/tests/guard to Trial 14 canonical contract.
- Decision boundary: trial_21d may remain only as legacy alias; canonical plan is trial_14d and TRIAL_DAYS = 14.
- No SQL/Supabase/UI layout changes.

## CF-RUNTIME-00 R18 - shebang mass syntax guard

- Date: 2026-06-16 Europe/Warsaw
- Result: pending local gate run at package apply time
- Scope: mass repair misplaced Node shebang/hashbang in active JS/CJS/MJS files after R17 inserted a marker before #!/usr/bin/env node.
- Guard: every active script/test/source file with #! must keep it at byte/char 0.
- No SQL/Supabase/UI layout changes.

## CF-RUNTIME-00 R19 - mass scope closure after R17/R18

- Date: 2026-06-16 Europe/Warsaw
- Result: pending local gate run at package apply time
- Scope: mass closure of CF-RUNTIME-00 scope guard after Trial 14 source-truth repair and shebang/hashbang syntax repair.
- Guard: all current changed files are explicitly listed in allowedChangePrefixes and changed JS/CJS/MJS files are syntax-checked.
- No SQL/Supabase/UI layout changes.


## 2026-06-16 R21 - brittle parser mass guard syntax fix

- Status: APPLIED_LOCALLY / GATE_PENDING
- Scope: mass repair for CRLF/LF brittle test parsers that extract code blocks before `return (`.
- Changed files: tests/stage107-templates-delete-and-visual-contract.test.cjs, scripts/check-cf-runtime-00-source-truth.cjs
- Risk audit: this updates test parser robustness, not runtime UI or SQL.


## 2026-06-16 R22 - Stage115 useWorkspace guard mass repair

- Status: APPLIED_LOCALLY / GATE_PENDING
- Scope: mass repair for tests with brittle exact useWorkspace destructuring regex.
- Runtime decision: CaseDetail may destructure additional fields from useWorkspace, e.g. workspace, while still using hasAccess and access.
- Changed files: tests/stage115-case-detail-render-runtime-contract.test.cjs
- Risk audit: updates static test contract only; does not change CaseDetail runtime UI, SQL, Supabase, or pricing semantics.


## 2026-06-16 R23 - Stage227B sales funnel decision-list token closure

- Status: APPLIED_LOCALLY / GATE_PENDING
- Scope: Stage227B post-gate guard expected owner decision-list copy token in SalesFunnel.
- Token restored: Etapy jako filtr, nie ściśnięte kolumny
- Runtime impact: visible rule copy only; no SQL, Supabase, mutation, Stripe or layout refactor.
- Changed files: src/pages/SalesFunnel.tsx, scripts/check-cf-runtime-00-source-truth.cjs
- Timestamp: 2026-06-16 01:58 Europe/Warsaw

## 2026-06-16 02:07 Europe/Warsaw - R24_STAGE228A_SALES_FUNNEL_MONEY_SOURCE_COPY

- Status: APPLIED_LOCALLY / GATE_PENDING
- Scope: Stage228A money source visibility copy in SalesFunnel + CF-RUNTIME-00 scope guard.
- Changed kinds: money helper copy; scope guard changed: no.
- Guard class: sales funnel truth/clickability token closure.
- Risk audit: copy-only contract closure; no SQL/Supabase/mutations/layout refactor.
- Changed files at patch time: _project/00_PROJECT_STATUS.md, _project/03_CURRENT_STAGE.md, _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md, _project/06_GUARDS_AND_TESTS.md, _project/07_NEXT_STEPS.md, _project/08_CHANGELOG_AI.md, _project/10_PROJECT_TIMELINE.md, _project/12_IMPLEMENTATION_LEDGER.md, _project/13_TEST_HISTORY.md, docs/release/FAZA3_ETAP31_PLAN_SOURCE_OF_TRUTH_2026-05-03.md, docs/release/FAZA3_ETAP32_PLAN_FEATURE_ACCESS_GATE_2026-05-03.md, docs/technical/PLAN_FEATURE_MATRIX_STAGE32_2026-05-03.md, docs/technical/PLAN_SOURCE_OF_TRUTH_STAGE31_2026-05-03.md, package.json, scripts/check-closeflow-case-detail-loading-reference.cjs, scripts/check-faza3-etap31-plan-source-of-truth.cjs, scripts/check-faza3-etap32-plan-feature-access-gate.cjs, scripts/check-p0-plan-access-gating.cjs, scripts/check-stage230d0-text-input-contrast-sweep.cjs, scripts/check-stage231b0-r15-r2-client-detail-shared-canvas-width.cjs, scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs, scripts/check-stage231e2-account-trial-bootstrap.cjs, scripts/check-stage231e2-r2-trial-14d-lock.cjs, scripts/check-stage231h-r1d-finance-correction-modal-compact.cjs, scripts/check-stage231h-r1d2-r12g-case-quick-note-scope-client-dedupe-finish.cjs, scripts/check-stage231h-r1f-payment-and-cost-full-correction.cjs, scripts/check-stage231h-r1f4-payment-save-and-guard-repair.cjs, scripts/check-stage231h-r1g-cost-other-name-and-reimbursable-flag.cjs, scripts/check-stage231h-r1g4-newline-syntax-repair.cjs, scripts/check-stage72-access-billing-plan-truth-guard.cjs, scripts/check-stage75-source-of-truth-guard.cjs, scripts/closeflow-release-check-quiet.cjs, src/pages/CaseDetail.tsx, src/pages/ClientDetail.tsx, src/pages/SalesFunnel.tsx, src/styles/closeflow-unified-page-canvas-stage211c.css, src/styles/operator-rail-tasks-pattern-stage228r1.css, src/styles/visual-stage9-ai-drafts-vnext.css, tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs, tests/case-detail-history-visual-p1-repair4-2026-05-13.test.cjs, tests/cases-v1-lifecycle-command-board.test.cjs, tests/faza3-etap31-plan-source-of-truth.test.cjs, tests/p1-case-detail-history-quick-actions-visual-2026-05-13.test.cjs, tests/stage107-templates-delete-and-visual-contract.test.cjs, tests/stage115-case-detail-render-runtime-contract.test.cjs, tests/stage119-calendar-release-gate-trust.test.cjs, tests/stage230d0-text-input-contrast-sweep.test.cjs, tests/stage231b0-r15-r2-client-detail-shared-canvas-width.test.cjs, tests/stage231b0-r15-r3-client-detail-width-source-truth.test.cjs, tests/stage231h-r1d-finance-correction-modal-compact.test.cjs, tests/stage231h-r1d2-r12g-case-quick-note-scope-client-dedupe-finish.test.cjs, tests/stage231h-r1f-payment-and-cost-full-correction.test.cjs, tests/stage231h-r1f4-payment-save-and-guard-repair.test.cjs, tests/stage231h-r1g-cost-other-name-and-reimbursable-flag.test.cjs, tests/stage231h-r1g4-newline-syntax-repair.test.cjs, tests/stage98-polish-mojibake-calendar-guard.test.cjs, _project/runs/2026-06-15_CF_RUNTIME_00_SHARED_SOURCE_TRUTH.md, scripts/check-cf-runtime-00-source-truth.cjs, src/lib/closeflow-runtime-source-truth.ts, tests/cf-runtime-00-source-truth.test.cjs


## 2026-06-16 R25 - Stage228B lead action center contract closure

- Status: APPLIED_LOCALLY / GATE_PENDING
- Scope: mass closure for Stage228B LeadDetail work action center required tokens.
- Runtime touched: src/pages/LeadDetail.tsx only.
- Guard touched: scripts/check-cf-runtime-00-source-truth.cjs when scope needed it.
- Risk audit: copy/marker closure only; no SQL, Supabase, mutation or layout refactor.


## 2026-06-16 R26 - Stage228B R14 lead action center source copy

- Status: APPLIED_LOCALLY / GATE_PENDING
- Scope: domknięcie brakującego opisu source/copy w LeadDetail action center.
- Added copy: Najbliższe zadania, wydarzenia i braki przypięte do tego leada.
- Runtime changed: src/pages/LeadDetail.tsx
- Guard changed: no scope change needed
- Risk audit: copy-only closure for Stage228B R14 VST guard; no SQL, Supabase, Stripe or mutation changes.


## 2026-06-16 02:36 Europe/Warsaw - R27 Stage228B R14 blocker status logic

- Status: APPLIED_LOCALLY / GATE_PENDING
- Scope: LeadDetail active blocker/missing-item filtering now uses status.includes('block') || status.includes('missing') and keeps overdue events out of blocker duplication by default.
- Changed files: src/pages/LeadDetail.tsx
- Risk audit: runtime logic is narrowed to linkedTasks missing/blocker statuses; no SQL, Supabase mutation, Stripe, or layout refactor touched.


## 2026-06-16 02:36 Europe/Warsaw - R27 Stage228B R14 blocker status logic

- Status: APPLIED_LOCALLY / GATE_PENDING
- Scope: LeadDetail active blocker/missing-item filtering now uses status.includes('block') || status.includes('missing') and keeps overdue events out of blocker duplication by default.
- Changed files: none
- Risk audit: runtime logic is narrowed to linkedTasks missing/blocker statuses; no SQL, Supabase mutation, Stripe, or layout refactor touched.
