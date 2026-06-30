# LF-PROD-SOT-002A — Mapowanie dat i operacyjnego czasu

## Status

```txt
DATE_TIME_MAP_DONE_REMOTE / LOCAL_RG_AND_GUARDS_PENDING / DO_NOT_MOVE_TO_002B
```

## Wejscie

```txt
Previous stage: LF-PROD-SOT-001B = FULLY_CLOSED / READY_FOR_002A_DATE_MAP
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
Execution mode: REMOTE_GITHUB_AUDIT / NO_RUNTIME_CHANGE
```

## Zakres

```txt
Lead, Client, Case, Task, Event, Payment, Commission, Calendar, Today, Owner Control, Activity Timeline, Work Items, Reminder/snooze, Next move, Last contact, Created/updated timestamps.
```

## DATE_TIME_MAP

### Lead dates

- fields: `createdAt`, `updatedAt`, `lastContactAt`, `contactedAt`, `movedToServiceAt`, `caseStartedAt`, `nextActionAt`, `nextStepDueAt`, `followUpAt`, `nextActionDate`, `nextActionTime`, `followUpDate`, `followUpTime`.
- source files: `src/lib/data-contract.ts`, `src/lib/work-items/normalize.ts`, `src/lib/scheduling.ts`, `src/lib/calendar-operational-entry-contract.ts`, `src/lib/owner-control/activity-truth.ts`, `src/lib/owner-control/last-contact-intake.ts`, `src/lib/owner-control/contact-cadence-grid.ts`, `src/lib/owner-control/lost-lead-rescue.ts`, `src/pages/Leads.tsx`, `src/pages/TodayStable.tsx`.
- formatters: `data-contract.toIsoDateTime`, `last-contact-intake.dateInputToNoonIso`, `Leads.buildNextActionMeta`, `Today.formatDateTime`.
- fallback: `nextActionAt -> followUpAt -> date+time -> createdAt`; last contact uses explicit field first, `updatedAt/createdAt` only as activity fallback.
- sort/filter: nearest action, cadence buckets, rescue rows, Today upcoming, Calendar lead shadow entries.
- UI display: lead list next action, silence badges, Today lead rows, Calendar lead rows.
- timezone risk: date-only becomes `T09:00` or noon; `toISOString()` can shift local day.
- duplicate logic: next move and silence computed in `scheduling`, `activity-truth`, `next-move-contract`, `contact-cadence-grid`, `lost-lead-rescue`, page helpers.
- category: `SOURCE_OF_TRUTH_CANDIDATE / FALLBACK_DATE / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK / LOCAL_TIME_FORMATTER`.
- recommendation for 002B: central lead date contract with explicit local-day vs instant rules.

### Client dates

- fields: `createdAt`, `updatedAt`, `lastActivityAt`, `lastContactAt`, `contactedAt`, `archivedAt`, `primaryCaseId` relation timing via cases/tasks/events.
- source files: `src/lib/data-contract.ts`, `src/pages/Clients.tsx`, `src/lib/owner-control/activity-truth.ts`, `src/lib/owner-control/contact-cadence-grid.ts`, `src/lib/owner-control/owner-control-baseline.ts`, `src/lib/finance/case-finance-source.ts`.
- formatters: cadence grid and local page formatters.
- fallback: activity truth falls back to updated/created only after real activity candidates.
- sort/filter: `needs_contact`, `archived`, active commission, nearest planned action.
- UI display: Clients list relation row, cadence filter, owner control.
- timezone risk: archived and contact dates are ISO-normalized; local-day bucketing can shift.
- duplicate logic: cadence and owner-control both consume activity truth; pages also keep local filters.
- category: `SOURCE_OF_TRUTH_CANDIDATE / DERIVED_DATE / FALLBACK_DATE / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK`.
- recommendation for 002B: client activity/contact date adapter shared with Lead.

### Case dates

- fields: `startedAt`, `serviceStartedAt`, `completedAt`, `lastActivityAt`, `createdAt`, `updatedAt`, `updatedAt.toDate()` legacy object, nearest task/event dates.
- source files: `src/lib/data-contract.ts`, `src/lib/work-items/normalize.ts`, `src/pages/Cases.tsx`, `src/lib/case-lifecycle-v1.ts`, `src/lib/owner-control/owner-control-baseline.ts`.
- formatters: `Cases.formatNearestCaseAction`, local `new Date`, date-fns `format`.
- fallback: case owner status falls back through nearest planned action or record next action.
- sort/filter: case views, lifecycle buckets, nearest planned action.
- UI display: Cases list, CaseDetail consumers, Owner Control.
- timezone risk: `new Date(action.when)` and Firestore-like `toDate()` bridge.
- duplicate logic: lifecycle vs owner-control vs page-level case view.
- category: `SOURCE_OF_TRUTH_CANDIDATE / LOCAL_TIME_FORMATTER / LEGACY_DATE / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK`.
- recommendation for 002B: case dates should separate lifecycle dates from operational next-move dates.

### Task dates

- fields: `scheduledAt`, `scheduled_at`, `scheduledDate`, `scheduledTime`, `dueAt`, `due_at`, `dueDate`, `dueTime`, `dateTime`, `date`, `time`, `startAt`, `startsAt`, `reminderAt`, `completedAt`, `doneAt`, `createdAt`, `updatedAt`, recurrence end fields.
- source files: `src/lib/task-event-contract.ts`, `src/lib/work-items/normalize.ts`, `src/lib/scheduling.ts`, `src/lib/calendar-items.ts`, `src/lib/data-contract.ts`, `src/pages/TodayStable.tsx`, `src/pages/Calendar.tsx`.
- formatters: `toDateTimeLocalValueSafe`, `toDateTimeLocalValue`, `toIsoDateTime`, Calendar/Today local formatters.
- fallback: scheduled/due/date/start fields; date-only defaults to `T09:00`; missing start may default to `new Date()` in normalization/edit draft.
- sort/filter: nearest planned action, scheduling range, Today overdue/today, Calendar day bucket, upcoming 7 days.
- UI display: Today cards, Calendar cards, task edit drafts, activity timeline.
- timezone risk: local date-only `T09:00`, `parseISO`, `new Date`, `toISOString`, `startOfDay/endOfDay`.
- duplicate logic: task-event-contract, work-items normalize, data-contract, scheduling, Today, Calendar.
- category: `SOURCE_OF_TRUTH_CANDIDATE / FALLBACK_DATE / LOCAL_SORT_LOGIC / LOCAL_FILTER_LOGIC / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK`.
- recommendation for 002B: task date precedence must be centralized first; do not change Calendar behavior in same step.

### Event dates

- fields: `startAt`, `start_at`, `startsAt`, `starts_at`, `endAt`, `end_at`, `endsAt`, `scheduledAt`, `date`, `time`, `reminderAt`, recurrence end fields, `completedAt`, `doneAt`, `createdAt`, `updatedAt`.
- source files: `src/lib/task-event-contract.ts`, `src/lib/work-items/normalize.ts`, `src/lib/scheduling.ts`, `src/lib/calendar-items.ts`, `src/lib/data-contract.ts`, `src/pages/Calendar.tsx`, `src/pages/TodayStable.tsx`.
- formatters: scheduling local datetime, Calendar time label, Today local datetime.
- fallback: startAt/startsAt/scheduledAt/date; endAt fallback may be `start+60min`.
- sort/filter: range expansion, recurrence, Calendar day map, Today events.
- UI display: Calendar entry card, Today events, activity timeline.
- timezone risk: duration math around parsed dates and local formatting.
- duplicate logic: event start normalization appears in task-event-contract, work-items normalize, data-contract, calendar-items, page drafts.
- category: `SOURCE_OF_TRUTH_CANDIDATE / FALLBACK_DATE / GCAL_BOUNDARY / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK`.
- recommendation for 002B: event start/end adapter must define exact local vs UTC semantics.

### Payment / commission dates

- fields: payment `paidAt`, `paid_at`, `dueAt`, `due_at`, `createdAt`, `updatedAt`; commission `dueAt`, `commissionDueAt`; cost `incurredAt`, `reimbursedAt`.
- source files: `src/lib/finance/finance-types.ts`, `src/lib/finance/finance-normalize.ts`, `src/lib/finance/case-finance-source.ts`, `src/lib/data-contract.ts`, `src/lib/supabase-fallback.ts`, `src/pages/Billing.tsx`.
- formatters: finance date normalizer; page-level display needs review.
- fallback: finance date-only is interpreted as end of day `T23:59:59`.
- sort/filter: due/paid counts are mainly status-based; date due is not consistently used for overdue.
- UI display: Billing, Case finance, Activity Timeline.
- timezone risk: finance date-only end-of-day differs from task/event default morning.
- duplicate logic: payment/commission due status vs dueAt date are separate.
- category: `SOURCE_OF_TRUTH_CANDIDATE / DERIVED_DATE / LOCAL_TIMEZONE_LOGIC / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK`.
- recommendation for 002B: finance due date policy must be separate from task/event deadline policy.

### Calendar / Google Calendar boundary

- fields: local task/event start/end/reminder/recurrence, Google conflict `startAt/endAt`, inbound throttle timestamp.
- source files: `src/lib/calendar-items.ts`, `src/pages/Calendar.tsx`, `src/lib/scheduling.ts`, `src/lib/calendar-operational-entry-contract.ts`.
- timezone handling: mixed `parseISO`, `new Date`, `Date.now`, `toISOString`, local `format`.
- gcal boundary: inbound sync is background-only; uses `daysBack: 30`, `daysForward: 90`, throttled by `Date.now`.
- duplicate logic: Calendar has its own day grouping, relation enrichment, completed retention, edit drafts.
- category: `GCAL_BOUNDARY / SUPABASE_BOUNDARY / LOCAL_TIMEZONE_LOGIC / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK`.
- recommendation for 002B: map-only first; Google sync must stay untouched until separate boundary stage.

### Today / Owner Control / Work Items

- fields: `dateAt`, `nextMoveAt`, `silentDays`, `generatedAt`, `startsAt`, `momentRaw`, `scheduledAt`, `dueAt`, `lastContactAt`, `lastActivityAt`, `reminderAt`, `completedAt`.
- source files: `src/pages/TodayStable.tsx`, `src/lib/owner-control/owner-control-baseline.ts`, `src/lib/owner-control/next-move-contract.ts`, `src/lib/owner-control/activity-truth.ts`, `src/lib/owner-control/contact-cadence-grid.ts`, `src/lib/work-items/planned-actions.ts`, `src/lib/work-items/normalize.ts`.
- now/today logic: `new Date()`, injected `now`, `startOfDay`, day key helpers, localDateKey, upcoming 7 days.
- alert/severity logic: next move missing/overdue/today, silence thresholds, high value without safe movement.
- fallback: missing moment -> Today 09:00; note gap uses created/updated/dateAt; next action record fallback.
- duplicate logic: Today, scheduling, owner-control and planned-actions each sort/compare dates.
- category: `DUPLICATE_NOW_LOGIC / LOCAL_SORT_LOGIC / LOCAL_FILTER_LOGIC / TIMEZONE_RISK / SOURCE_OF_TRUTH_CANDIDATE`.
- recommendation for 002B: centralize now provider and day-key logic before any behavior change.

### Activity Timeline

- fields: `happenedAt`, `createdAt`, `updatedAt`, task scheduled/due/reminder, event start/scheduled/date, payment dates via payload.
- source files: `src/lib/activity-timeline.ts`, `src/lib/owner-control/activity-truth.ts`, `src/lib/data-contract.ts`.
- formatter: injected `formatDateTime` or raw string fallback.
- source vs UI-only: activity timeline is UI-only renderer; activity-truth decides operational truth.
- duplicate logic: separate date reading for task/event/payment descriptions.
- category: `UI_ONLY_DATE / LOCAL_TIME_FORMATTER / FALLBACK_DATE / DUPLICATE_DATE_LOGIC`.
- recommendation for 002B: keep activity timeline as consumer, not source.

## Najwazniejsze duplikaty

| Obszar | Duplikat | Pliki | Ryzyko | Rekomendacja |
|---|---|---|---|---|
| Task/Event | Date precedence in multiple normalizers | `task-event-contract.ts`, `work-items/normalize.ts`, `data-contract.ts`, `calendar-items.ts` | same record can get different start day | one precedence table in 002B |
| Today/Calendar | day key and local formatting duplicated | `TodayStable.tsx`, `Calendar.tsx`, `scheduling.ts`, `calendar-operational-entry-contract.ts` | today/upcoming mismatch | shared day-key policy |
| Lead next move | nextAction/followUp fallback duplicated | `scheduling.ts`, `next-move-contract.ts`, `lost-lead-rescue.ts`, `data-contract.ts` | false missing/overdue badge | central lead next-move adapter |
| Silence | days since contact duplicated by consumers | `activity-truth.ts`, `contact-cadence-grid.ts`, `owner-control-baseline.ts`, `lost-lead-rescue.ts` | 7/14 buckets drift | activity-truth remains source |
| Finance due | status-driven due vs dueAt date | `finance-normalize.ts`, `case-finance-source.ts`, `data-contract.ts` | due/overdue can diverge | separate finance date policy |

## Timezone risks

| Obszar | Plik | Ryzyko | Skutek | Rekomendacja |
|---|---|---|---|---|
| Task date-only | `task-event-contract.ts`, `data-contract.ts` | date-only becomes `T09:00` | UTC/local day shift | define local-date-only type |
| Finance due | `finance-normalize.ts` | date-only becomes `T23:59:59` | different policy than task/event | finance-specific deadline semantics |
| Owner Control | `next-move-contract.ts`, `owner-control-baseline.ts` | `new Date` + local `startOfDay` | wrong overdue around midnight | injected clock + local-day helper |
| Activity silence | `activity-truth.ts` | `DAY_MS` raw difference | DST/day boundary drift | calendar-day diff helper |
| Calendar day key | `calendar-operational-entry-contract.ts` | `toISOString().slice(0,10)` | UTC day, not local day | explicit day-key strategy |
| Google sync | `calendar-items.ts` | inbound Google time format boundary | duplicate/shifted events | separate GCAL boundary stage |

## Kandydaci do 002B

```txt
Recommended only, not created in 002A:
src/lib/source-of-truth/date-time-repository.ts

002B should export read-only adapters first:
- dateTimeSourceMap
- leadDateContract
- clientDateContract
- caseDateContract
- taskDateContract
- eventDateContract
- financeDateContract
- operationalTodayClockContract
- calendarGoogleBoundaryContract
```

## Czego nie ruszano

```txt
runtime: NOT_TOUCHED
CSS: NOT_TOUCHED
SQL: NOT_TOUCHED
Supabase/API: NOT_TOUCHED
Google Calendar sync: NOT_TOUCHED
routing: NOT_TOUCHED
auth: NOT_TOUCHED
UI redesign: NOT_TOUCHED
data provider: NOT_TOUCHED
date repository: NOT_CREATED
```

## Guard/test/build

```txt
npm run guard:routes:canonical: NOT_RUN_REMOTE_GITHUB_CONNECTOR
npm run guard:ui:patch-layers: NOT_RUN_REMOTE_GITHUB_CONNECTOR
npm run check:polish-mojibake: NOT_RUN_REMOTE_GITHUB_CONNECTOR
git diff --check: NOT_RUN_REMOTE_GITHUB_CONNECTOR
Build: NOT_REQUIRED_DOCS_ONLY
```

## Ryzyka

```txt
- 002B nie może być big-bang refactorem czasu.
- Timezone musi być jawnie rozdzielony od formatowania UI.
- Google Calendar boundary nie może zostać ruszony bez osobnego etapu.
- Today/Owner Control nie może dostać nowego zachowania przez przypadek.
- new Date() i Date.now() mają mapę, ale lokalny rg musi potwierdzić brak pominiętych plików.
```

## Decyzja

```txt
LF-PROD-SOT-002A:
DATE_TIME_MAP_DONE_REMOTE / LOCAL_GUARDS_PENDING / DO_NOT_MOVE_TO_002B

Następny etap po lokalnym PASS:
LF-PROD-SOT-002B — Date/time repository
002B musi być osobnym etapem.
```

## Zapis do Obsidiana

```txt
data i godzina: 2026-06-30 21:18 Europe/Warsaw
name/alias: LF-PROD-SOT-002A date time map
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-002A_DATE_TIME_MAP.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-002A_DATE_TIME_MAP.md
save status: APP_REPORT_PUSHED_REMOTE / OBSIDIAN_REPORT_PENDING / LOCAL_GUARDS_PENDING
Obsidian GitHub sync: PENDING
Obsidian local sync: LOCAL_SYNC_PENDING
tests: remote docs-only; local guards pending
risk audit: runtime untouched; 002B blocked until local guard PASS
what was not touched: runtime, CSS, SQL, Supabase/API, Google Calendar sync, routing, auth, UI redesign, data provider, date repository
next step: local guards and Obsidian copy
```
