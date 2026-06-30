# LF-PROD-SOT-002A — Mapowanie dat i operacyjnego czasu

## Status

```txt
DATE_TIME_MAP_DONE / LOCAL_GUARDS_PASS / OBSIDIAN_LOCAL_SYNC_DONE_WITH_UNRELATED_DIRTY_FILE / READY_FOR_002B_DATE_TIME_REPOSITORY
```

## Wejście

```txt
Previous stage: LF-PROD-SOT-001B = FULLY_CLOSED / READY_FOR_002A_DATE_MAP
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
Execution mode: REMOTE_GITHUB_AUDIT + LOCAL_GUARD_VERIFICATION / NO_RUNTIME_CHANGE
```

## Wyniki lokalne od Damiana

```txt
git pull --ff-only origin dev-rollout-freeze: PASS / fast-forward 2b5c45ec..27863264
git status --short --branch: PASS / ## dev-rollout-freeze...origin/dev-rollout-freeze
git log --oneline -3: PASS / HEAD 27863264 docs(closeflow): map production date time sources
npm run guard:routes:canonical: PASS / ok true / screensChecked 17
npm run guard:ui:patch-layers: PASS / ok true / knownDebt recorded, no failure
npm run check:polish-mojibake: PASS / OK no Polish mojibake detected
git diff --check: PASS / no output
git status --short --branch after guards: PASS / ## dev-rollout-freeze...origin/dev-rollout-freeze
Obsidian git pull --ff-only origin main: PASS / fast-forward 757e9e5f..516bd433
Obsidian CloseFlow report local sync: DONE
Obsidian unrelated dirty file: 10_PROJEKTY/Audytomat_Strony/04_KIERUNEK_DO_WDROZENIA - P001 - RaportStrony.org.md
Obsidian status: CLOSEFLOW_SYNC_DONE / UNRELATED_DIRTY_FILE_PRESENT
```

## Zakres

```txt
Lead, Client, Case, Task, Event, Payment, Commission, Calendar, Today, Owner Control, Activity Timeline, Work Items, Reminder/snooze, Next move, Last contact, Created/updated timestamps.
```

## DATE_TIME_MAP

### Lead dates

```txt
fields: createdAt, updatedAt, lastContactAt, contactedAt, movedToServiceAt, caseStartedAt, nextActionAt, nextStepDueAt, followUpAt, nextActionDate, nextActionTime, followUpDate, followUpTime
source files: data-contract.ts, work-items/normalize.ts, scheduling.ts, calendar-operational-entry-contract.ts, activity-truth.ts, last-contact-intake.ts, contact-cadence-grid.ts, lost-lead-rescue.ts, Leads.tsx, TodayStable.tsx
formatters: data-contract.toIsoDateTime, last-contact-intake.dateInputToNoonIso, Leads.buildNextActionMeta, Today.formatDateTime
fallback: nextActionAt -> followUpAt -> date+time -> createdAt; last contact explicit field first; updatedAt/createdAt activity fallback only
sort/filter: nearest action, cadence buckets, rescue rows, Today upcoming, Calendar lead shadow entries
UI display: lead list next action, silence badges, Today lead rows, Calendar lead rows
category: SOURCE_OF_TRUTH_CANDIDATE / FALLBACK_DATE / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK / LOCAL_TIME_FORMATTER
recommendation for 002B: central lead date contract with explicit local-day vs instant rules
```

### Client dates

```txt
fields: createdAt, updatedAt, lastActivityAt, lastContactAt, contactedAt, archivedAt, relation timing through cases/tasks/events
source files: data-contract.ts, Clients.tsx, activity-truth.ts, contact-cadence-grid.ts, owner-control-baseline.ts, case-finance-source.ts
fallback: activity truth falls back to updated/created only after real activity candidates
sort/filter: needs_contact, archived, active commission, nearest planned action
category: SOURCE_OF_TRUTH_CANDIDATE / DERIVED_DATE / FALLBACK_DATE / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK
recommendation for 002B: client activity/contact date adapter shared with Lead
```

### Case dates

```txt
fields: startedAt, serviceStartedAt, completedAt, lastActivityAt, createdAt, updatedAt, updatedAt.toDate() legacy object, nearest task/event dates
source files: data-contract.ts, work-items/normalize.ts, Cases.tsx, case-lifecycle-v1.ts, owner-control-baseline.ts
fallback: owner status falls back through nearest planned action or record next action
sort/filter: case views, lifecycle buckets, nearest planned action
category: SOURCE_OF_TRUTH_CANDIDATE / LOCAL_TIME_FORMATTER / LEGACY_DATE / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK
recommendation for 002B: separate lifecycle dates from operational next-move dates
```

### Task dates

```txt
fields: scheduledAt, scheduled_at, scheduledDate, scheduledTime, dueAt, due_at, dueDate, dueTime, dateTime, date, time, startAt, startsAt, reminderAt, completedAt, doneAt, createdAt, updatedAt, recurrence end fields
source files: task-event-contract.ts, work-items/normalize.ts, scheduling.ts, calendar-items.ts, data-contract.ts, TodayStable.tsx, Calendar.tsx
formatters: toDateTimeLocalValueSafe, toDateTimeLocalValue, toIsoDateTime, Calendar/Today local formatters
fallback: scheduled/due/date/start fields; date-only defaults to T09:00; missing start may default to new Date() in normalization/edit draft
sort/filter: nearest planned action, scheduling range, Today overdue/today, Calendar day bucket, upcoming 7 days
category: SOURCE_OF_TRUTH_CANDIDATE / FALLBACK_DATE / LOCAL_SORT_LOGIC / LOCAL_FILTER_LOGIC / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK
recommendation for 002B: centralize task date precedence first; do not change Calendar behavior in same step
```

### Event dates

```txt
fields: startAt, start_at, startsAt, starts_at, endAt, end_at, endsAt, scheduledAt, date, time, reminderAt, recurrence end fields, completedAt, doneAt, createdAt, updatedAt
source files: task-event-contract.ts, work-items/normalize.ts, scheduling.ts, calendar-items.ts, data-contract.ts, Calendar.tsx, TodayStable.tsx
fallback: startAt/startsAt/scheduledAt/date; endAt fallback may be start+60min
sort/filter: range expansion, recurrence, Calendar day map, Today events
category: SOURCE_OF_TRUTH_CANDIDATE / FALLBACK_DATE / GCAL_BOUNDARY / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK
recommendation for 002B: event start/end adapter must define exact local vs UTC semantics
```

### Payment / commission dates

```txt
fields: payment paidAt/paid_at/dueAt/due_at/createdAt/updatedAt; commission dueAt/commissionDueAt; cost incurredAt/reimbursedAt
source files: finance-types.ts, finance-normalize.ts, case-finance-source.ts, data-contract.ts, supabase-fallback.ts, Billing.tsx
fallback: finance date-only is interpreted as end of day T23:59:59
sort/filter: due/paid counts mainly status-based; dueAt date not consistently used for overdue
category: SOURCE_OF_TRUTH_CANDIDATE / DERIVED_DATE / LOCAL_TIMEZONE_LOGIC / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK
recommendation for 002B: finance due date policy must be separate from task/event deadline policy
```

### Calendar / Google Calendar boundary

```txt
fields: local task/event start/end/reminder/recurrence, Google conflict startAt/endAt, inbound throttle timestamp
source files: calendar-items.ts, Calendar.tsx, scheduling.ts, calendar-operational-entry-contract.ts
timezone handling: mixed parseISO, new Date, Date.now, toISOString, local format
gcal boundary: inbound sync is background-only; uses daysBack 30, daysForward 90, throttled by Date.now
category: GCAL_BOUNDARY / SUPABASE_BOUNDARY / LOCAL_TIMEZONE_LOGIC / DUPLICATE_DATE_LOGIC / TIMEZONE_RISK
recommendation for 002B: Google sync must stay untouched until separate boundary stage
```

### Today / Owner Control / Work Items

```txt
fields: dateAt, nextMoveAt, silentDays, generatedAt, startsAt, momentRaw, scheduledAt, dueAt, lastContactAt, lastActivityAt, reminderAt, completedAt
source files: TodayStable.tsx, owner-control-baseline.ts, next-move-contract.ts, activity-truth.ts, contact-cadence-grid.ts, planned-actions.ts, work-items/normalize.ts
now/today logic: new Date(), injected now, startOfDay, day key helpers, localDateKey, upcoming 7 days
fallback: missing moment -> Today 09:00; note gap uses created/updated/dateAt; next action record fallback
category: DUPLICATE_NOW_LOGIC / LOCAL_SORT_LOGIC / LOCAL_FILTER_LOGIC / TIMEZONE_RISK / SOURCE_OF_TRUTH_CANDIDATE
recommendation for 002B: centralize now provider and day-key logic before any behavior change
```

### Activity Timeline

```txt
fields: happenedAt, createdAt, updatedAt, task scheduled/due/reminder, event start/scheduled/date, payment dates via payload
source files: activity-timeline.ts, activity-truth.ts, data-contract.ts
source vs UI-only: activity timeline is UI-only renderer; activity-truth decides operational truth
category: UI_ONLY_DATE / LOCAL_TIME_FORMATTER / FALLBACK_DATE / DUPLICATE_DATE_LOGIC
recommendation for 002B: keep activity timeline as consumer, not source
```

## Najważniejsze duplikaty

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

## Decyzja

```txt
LF-PROD-SOT-002A: CLOSED
READY_FOR_002B_DATE_TIME_REPOSITORY
002B musi być osobnym etapem.
```

## Zapis do Obsidiana

```txt
data i godzina: 2026-06-30 21:27 Europe/Warsaw
name/alias: LF-PROD-SOT-002A date time map closeout
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-002A_DATE_TIME_MAP.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-002A_DATE_TIME_MAP.md
save status: APP_REPORT_PUSHED_REMOTE / OBSIDIAN_REPORT_PUSHED_REMOTE / TECHNICAL_CLOSEOUT_DONE
Obsidian GitHub sync: DONE_REMOTE_FINAL_UPDATE_PENDING_LOCAL_PULL
Obsidian local sync: DONE_BEFORE_FINAL_REMOTE_UPDATE / FINAL_LOCAL_PULL_PENDING_AFTER_THIS_COMMIT
unrelated dirty file: 10_PROJEKTY/Audytomat_Strony/04_KIERUNEK_DO_WDROZENIA - P001 - RaportStrony.org.md
tests: routes canonical PASS / ui patch layers PASS / mojibake PASS / git diff check PASS
risk audit: runtime untouched; 002B may be prepared next after final local pulls
what was not touched: runtime, CSS, SQL, Supabase/API, Google Calendar sync, routing, auth, UI redesign, data provider, date repository
next step: final local pull for app and Obsidian, then prepare LF-PROD-SOT-002B
```

KONIEC ETAPU LF-PROD-SOT-002A
