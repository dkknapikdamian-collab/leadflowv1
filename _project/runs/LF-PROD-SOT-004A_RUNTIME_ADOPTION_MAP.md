# LF-PROD-SOT-004A - Mapowanie bezpiecznej adopcji runtime

## Status

RUNTIME_ADOPTION_MAP_DONE / READY_FOR_004B_SAFE_READ_ONLY_RUNTIME_ADOPTION

## Linki SOT / mapy wejsciowe

- Centralny indeks map SOT: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`
- Status map: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-001A_STATUS_MAP.md`
- Status repository: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-001B_STATUS_REPOSITORY.md`
- Date/time map: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-002A_DATE_TIME_MAP.md`
- Date/time repository: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-002B_DATE_TIME_REPOSITORY.md`
- Visual map: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-003A_VISUAL_SOT_MAP.md`
- Visual repository: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-003B_VISUAL_REPOSITORY.md`
- Ten etap tworzy mape wejsciowa dla przyszlych etapow adopcyjnych runtime.
- Nie duplikowac pelnych map; trzymac linki, decyzje, ryzyka i kolejnosc adopcji.

## Wejscie

Previous stage:
LF-PROD-SOT-003B = FULLY_CLOSED / VISUAL_REPOSITORY_ADDED / READY_FOR_004A_RUNTIME_ADOPTION_MAP

Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
HEAD: da1f0fa3
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY

## Zakres

To jest etap mapowania. Runtime adoption: NOT_STARTED.

Nie przepinano runtime. Nie zmieniano UI. Nie zmieniano CSS. Nie zmieniano sortowania, filtrow, badge, kolorow, statusow, dat, Google Calendar sync, Supabase/API, SQL, routing ani auth.

## RUNTIME_ADOPTION_MAP

### Today / TodayStable

- candidate repositories: status-repository, date-time-repository, visual-repository
- files: src/pages/Today.tsx, src/pages/TodayStable.tsx, src/lib/work-items/normalize.ts, src/lib/scheduling.ts, src/lib/calendar-items.ts, src/lib/activity-truth.ts
- current source of truth: mixed runtime logic for status/date/tone/row presentation
- adoption category: TODAY_ADOPTION_CANDIDATE_WITH_MANUAL_SMOKE / HIGH_RISK_DATE_TIME_ADOPTION
- risk: HIGH, because Today combines lead silence, tasks, events, calendar-like buckets, status tones and visual row layout
- safe minimal adoption: read-only helper import only after a dedicated guard proves no sort/filter/date bucket drift
- required guard: future guard must compare Today bucket counts and selected labels before/after helper adoption
- required test: fixture test for task/event/lead date precedence and status labels
- manual smoke: REQUIRED by Damian after future adoption stage
- future stage: LF-PROD-SOT-004C - Today/status/date visual read-only bridge

### Leads / LeadDetail

- candidate repositories: status-repository, date-time-repository, visual-repository
- files: src/pages/Leads.tsx, src/pages/LeadDetail.tsx, src/lib/last-contact-intake.ts, src/lib/contact-cadence-grid.ts, src/lib/lost-lead-rescue.ts, src/lib/next-move-contract.ts
- current source of truth: lead status/options plus local date and visual badge logic
- adoption category: SAFE_HELPER_IMPORT_CANDIDATE for read-only labels; HIGH_RISK_DATE_TIME_ADOPTION for silence/next action buckets
- risk: MEDIUM/HIGH, because lastContactAt, silence 7/14 and next action fallback are business-sensitive
- safe minimal adoption: first expose read-only labels from status/date repositories without changing displayed order or filters
- required guard: compare lead list counts, status buckets, silence markers and next-action labels
- required test: lead fixtures for status aliases and last contact fallback order
- manual smoke: REQUIRED for list, lead detail history and next action display
- future stage: LF-PROD-SOT-004D - Lists/cards status/date visual bridge

### Clients / ClientDetail

- candidate repositories: status-repository, date-time-repository, visual-repository
- files: src/pages/Clients.tsx, src/pages/ClientDetail.tsx, src/lib/activity-truth.ts, src/lib/owner-control/, src/lib/finance/
- current source of truth: client source/health/portal options plus relation-derived activity and finance signals
- adoption category: SAFE_HELPER_IMPORT_CANDIDATE for source/health labels; HIGH_RISK_STATUS_ADOPTION for derived health and portal status
- risk: MEDIUM, because client value/activity/health are derived and can be confused with source status
- safe minimal adoption: labels/read-only metadata only; no client health recalculation in first adoption
- required guard: compare client card labels, source badges, health badges and activity ordering
- required test: client fixtures for source/health/portal separation
- manual smoke: REQUIRED for client list and ClientDetail header/cards
- future stage: LF-PROD-SOT-004D - Lists/cards status/date visual bridge

### Cases / CaseDetail

- candidate repositories: status-repository, date-time-repository, visual-repository
- files: src/pages/Cases.tsx, src/pages/CaseDetail.tsx, src/lib/case-lifecycle-v1.ts, src/lib/planned-actions.ts, src/lib/owner-control/, src/lib/finance/
- current source of truth: case status, lifecycle bucket, activity timeline, finance settlement and local visual layout
- adoption category: CASEDETAIL_DO_NOT_TOUCH_YET / HIGH_RISK_RUNTIME_ADOPTION / HIGH_RISK_VISUAL_ADOPTION
- risk: VERY_HIGH, because CaseDetail contains service workspace, right rail, notes/checklists, settlement, history and action controls
- safe minimal adoption: Cases list can later use read-only labels; CaseDetail requires isolated plan before any import
- required guard: separate future guard for CaseDetail anchors, rail content, service tabs, finance and action panels
- required test: CaseDetail snapshot/anchor tests plus case lifecycle/status separation fixtures
- manual smoke: REQUIRED and blocking
- future stage: LF-PROD-SOT-004F - CaseDetail isolated adoption plan

### Tasks / Calendar

- candidate repositories: status-repository, date-time-repository, visual-repository
- files: src/pages/Tasks.tsx, src/pages/TasksStable.tsx, src/pages/Calendar.tsx, src/lib/scheduling.ts, src/lib/calendar-items.ts, src/lib/calendar-operational-entry-contract.ts, src/lib/work-items/normalize.ts
- current source of truth: task/event contract, scheduling helpers, calendar item expansion and local visual cards
- adoption category: GOOGLE_CALENDAR_BOUNDARY_DO_NOT_TOUCH for gcal sync; HIGH_RISK_DATE_TIME_ADOPTION for local buckets; SAFE_HELPER_IMPORT_CANDIDATE for read-only status labels
- risk: HIGH, because task/event local date policy and Google Calendar boundary must remain separate
- safe minimal adoption: read-only local task/event status and label helpers only; no gcal mapper changes
- required guard: compare local calendar day counts, Today task/event counts and done/cancelled/pending status labels
- required test: task/event fixture with scheduledAt/dueAt/date+time fallback and date-only defaults
- manual smoke: REQUIRED for Calendar, Today and task/event dialogs
- future stage: LF-PROD-SOT-004G - Calendar/date-time boundary adoption plan

### Billing / Finance

- candidate repositories: status-repository, date-time-repository, visual-repository
- files: src/pages/Billing.tsx, src/lib/finance/, src/styles/finance/closeflow-finance.css, CaseDetail settlement rail consumers
- current source of truth: finance runtime/data models, payment/commission statuses, settlement calculations and finance CSS taxonomy
- adoption category: FINANCE_RUNTIME_DO_NOT_TOUCH_YET / HIGH_RISK_STATUS_ADOPTION / HIGH_RISK_DATE_TIME_ADOPTION
- risk: VERY_HIGH, because payment status, commission status, dueAt and settlement math are business facts
- safe minimal adoption: no finance runtime adoption until a finance-specific contract guard exists
- required guard: compare payment statuses, commission status, amounts, settlement labels and due/paid date labels
- required test: finance fixtures for paid-like/due-like aliases and commission derivation
- manual smoke: REQUIRED for Billing and CaseDetail settlement rail
- future stage: separate finance adoption after 004G, not part of first runtime bridge

### Settings / AI drafts

- candidate repositories: visual-repository primarily; status/date-time only if concrete status/date fields are present
- files: src/pages/Settings.tsx, src/pages/AiDrafts.tsx, src/pages/AdminAiSettings.tsx, LeadAiFollowupDraft consumers
- current source of truth: local UI surfaces, AI review state and settings forms
- adoption category: SAFE_READ_ONLY_ADOPTION_CANDIDATE for visual contract; UNKNOWN_NEEDS_REVIEW for AI runtime status semantics
- risk: MEDIUM, because AI drafts may contain review states that should not be confused with business statuses
- safe minimal adoption: only visual policy documentation and UI primitive inventory first
- required guard: ensure no AI runtime/model/provider behavior changes
- required test: AI draft visual surface smoke or static anchor check
- manual smoke: OPTIONAL for first visual-only bridge; REQUIRED for AI behavior changes
- future stage: LF-PROD-SOT-004E - Forms/modals action visual bridge

### Owner Control / Activity Truth / Work Items

- candidate repositories: status-repository, date-time-repository
- files: src/lib/owner-control/, src/lib/activity-truth.ts, src/lib/activity-timeline.ts, src/lib/work-items/normalize.ts
- current source of truth: existing runtime helpers and normalization contracts
- adoption category: SAFE_HELPER_IMPORT_CANDIDATE with strict no-output-drift guard
- risk: MEDIUM/HIGH, because these helpers feed multiple screens and can cause broad invisible runtime drift
- safe minimal adoption: import repository metadata into tests/guards first, then adapter wrappers
- required guard: compare normalized work item counts/types/status/date fields on fixtures
- required test: activity/work-item fixtures covering task, event, payment, missing item and lead moved
- manual smoke: REQUIRED if any visible list changes
- future stage: LF-PROD-SOT-004B - Safe read-only runtime adoption stage 1

### PageShell / Sidebar / UI primitives

- candidate repositories: visual-repository
- files: src/components/Layout.tsx, src/components/, src/ui-system/, src/styles/
- current source of truth: Layout/PageShell, ActionIcon, SemanticIcon, Button/Card/Dialog/Select primitives and layered CSS
- adoption category: SAFE_READ_ONLY_ADOPTION_CANDIDATE for inventory; HIGH_RISK_VISUAL_ADOPTION for actual class/CSS migration
- risk: HIGH for visual refactor; LOW/MEDIUM for read-only documentation imports in guards
- safe minimal adoption: use visualRepository only inside guards/tests/reports first, not runtime components
- required guard: static guard preventing new raw action/icon/patch patterns
- required test: primitive contract presence and no import-cycle test
- manual smoke: REQUIRED after any actual runtime class adoption
- future stage: LF-PROD-SOT-004E - Forms/modals action visual bridge

### Reusable UI primitives / Forms / Modals / Dialogs

- candidate repositories: visual-repository, status-repository only for controlled select values where source is already centralized
- files: src/components/, src/ui-system/, components/ui/select.tsx, ClientCreateDialog, ContextActionDialogs, event/task/template/finance dialogs
- current source of truth: local form components, local dialogs and modal CSS
- adoption category: SAFE_READ_ONLY_ADOPTION_CANDIDATE for inventory; HIGH_RISK_VISUAL_ADOPTION for live visual changes
- risk: MEDIUM/HIGH, because form fields and modals affect data entry and visual consistency
- safe minimal adoption: document allowed primitives and guard future drift before replacing any runtime component
- required guard: no new local action/button/icon clone; no new direct visual patch layer
- required test: static test for dialog/action primitive usage once adoption begins
- manual smoke: REQUIRED for create/edit dialogs
- future stage: LF-PROD-SOT-004E - Forms/modals action visual bridge

## Kolejnosc przyszlych etapow

| Future stage | Scope | Allowed change | Forbidden change | Required guard/test | Manual smoke |
|---|---|---|---|---|---|
| LF-PROD-SOT-004B | Safe read-only runtime adoption stage 1 | repository imports in guards/tests/adapters only | UI/runtime behavior changes | no-output-drift fixture guard | optional unless visible |
| LF-PROD-SOT-004C | Today/status/date visual read-only bridge | read-only labels/helpers behind guards | bucket/order/filter changes | Today counts/date/status guard | required |
| LF-PROD-SOT-004D | Lists/cards status/date visual bridge | list/card read-only labels | status/date source redefinition | list count/status/date fixture test | required |
| LF-PROD-SOT-004E | Forms/modals action visual bridge | primitive inventory/controlled helper plan | redesign, CSS patch, new visual layer | static primitive/dialog guard | required |
| LF-PROD-SOT-004F | CaseDetail isolated adoption plan | plan and anchors only first | CaseDetail refactor in shared stage | CaseDetail anchor/rail/workspace guard | required/blocking |
| LF-PROD-SOT-004G | Calendar/date-time boundary adoption plan | local-vs-gcal adapter map | Google Calendar sync changes | calendar/gcal boundary fixture guard | required/blocking |

## High-risk blockers

| Area | Risk | Why | Decision needed |
|---|---|---|---|
| CaseDetail | VERY_HIGH | workspace, settlement, notes, actions and lifecycle are layered | isolate before adoption |
| Today / TodayStable | HIGH | combines status, dates, tasks, events and visual cards | manual smoke required |
| Calendar / Google Calendar boundary | VERY_HIGH | local UI event dates must stay separate from gcal sync boundary | separate 004G |
| Finance / Billing / settlement | VERY_HIGH | status/date/amount are business facts | finance-specific guard first |
| status/date interaction | HIGH | badges and date urgency can be incorrectly merged | keep repositories separated |
| visual tones vs business statuses | HIGH | visual color must not define business state | strict guard in future stages |
| date urgency vs visual badges | HIGH | urgency is date-time concern, not visual source | strict separation |
| legacy CSS/final-lock/hardfix layers | HIGH | multiple CSS layers can hide regressions | no cleanup in 004A |
| runtime imports/circular dependency | HIGH | source-of-truth imports can create runtime cycles | use guards/tests first |

## DECISION_NEEDED

- Confirm whether 004B may introduce source-of-truth imports only inside tests/guards/adapters, with no visible runtime behavior change.
- Confirm CaseDetail remains blocked from any shared adoption stage until isolated plan 004F.
- Confirm Calendar/Google Calendar boundary remains blocked until isolated plan 004G.
- Confirm finance runtime remains blocked until a finance-specific guard is written.

## DEFERRED_CLEANUP

- Legacy CSS/final-lock/hardfix layers: DEFERRED_CLEANUP, do not delete in 004A.
- Raw button/action/icon drift: DEFERRED_CLEANUP, document only.
- Local status/date/tone maps inside screens/components: UNKNOWN_NEEDS_REVIEW, do not delete.
- Duplicate date fallback logic across Today/Calendar/work-items: DEFERRED_CLEANUP, only map now.
- Patch layers and local visual overrides: DEFERRED_CLEANUP, future audit/adoption stage only.

## Czego nie ruszano

runtime: NOT_TOUCHED
CSS: NOT_TOUCHED
Tailwind config: NOT_TOUCHED
UI components: NOT_TOUCHED
status repository: NOT_TOUCHED
date-time repository: NOT_TOUCHED
visual repository: NOT_TOUCHED
Supabase/API: NOT_TOUCHED
SQL/migrations: NOT_TOUCHED
routing: NOT_TOUCHED
auth: NOT_TOUCHED
data provider: NOT_TOUCHED
Google Calendar sync: NOT_TOUCHED
Finance runtime: NOT_TOUCHED
CaseDetail runtime: NOT_TOUCHED

## Guard/test/build

npm run guard:routes:canonical: PASS_AFTER_LOCAL_RUN
npm run guard:ui:patch-layers: PASS_AFTER_LOCAL_RUN
npm run check:polish-mojibake: PASS_AFTER_LOCAL_RUN
git diff --check: PASS_AFTER_LOCAL_RUN

Build: NOT_REQUIRED_DOCS_ONLY

## Decyzja

LF-PROD-SOT-004A:
RUNTIME_ADOPTION_MAP_DONE / READY_FOR_004B_SAFE_READ_ONLY_RUNTIME_ADOPTION

Nastepny etap:
LF-PROD-SOT-004B - Safe read-only runtime adoption stage 1

004B musi byc osobnym etapem i musi linkowac do mapy 004A.

## Zapis do Obsidiana

data i godzina: 2026-07-01 20:19 Europe/Warsaw
name/alias: LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md
map index: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md
source maps: 001A/001B/002A/002B/003A/003B linked above
save status: APP_PUSHED / OBSIDIAN_PUSHED after local script
git head: da1f0fa3
Obsidian GitHub sync: DONE_AFTER_LOCAL_SCRIPT
Obsidian local sync: DONE_FOR_CLOSEFLOW_TARGET_OR_UNRELATED_DIRTY_FILE_DESCRIBED
tests: guard:routes PASS; guard:ui PASS; mojibake PASS; git diff --check PASS; build NOT_REQUIRED_DOCS_ONLY
risk audit: docs-only map; no runtime/CSS/UI adoption
what was not touched: runtime, CSS, Tailwind, UI components, status/date-time/visual repositories, Supabase/API, SQL/migrations, routing, auth, data provider, Google Calendar sync, Finance runtime, CaseDetail runtime
next step: LF-PROD-SOT-004B as separate stage
