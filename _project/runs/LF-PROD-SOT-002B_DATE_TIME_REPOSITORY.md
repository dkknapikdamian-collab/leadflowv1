# LF-PROD-SOT-002B — Date/time repository

## Status

```txt
DATE_TIME_REPOSITORY_ADDED / GITHUB_CONNECTOR_FILES_ADDED / LOCAL_GUARDS_NOT_RUN / BUILD_NOT_RUN / PACKAGE_ALIAS_PENDING / NOT_READY_FOR_003A_VISUAL_SOT_MAP
```

## Wejście

```txt
Previous stage: LF-PROD-SOT-002A = CLOSED / READY_FOR_002B_DATE_TIME_REPOSITORY
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
HEAD: GITHUB_CONNECTOR_APPLIED_REMOTE
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
```

## Zakres

Dodano:
- `src/lib/source-of-truth/date-time-repository.ts`
- `scripts/guards/verify-lf-prod-sot-002b-date-time-repository.cjs`
- `tests/lf-prod-sot-002b-date-time-repository.test.cjs`
- `_project/runs/LF-PROD-SOT-002B_DATE_TIME_REPOSITORY.md`
- read-only adoption: `ADOPTION_DEFERRED_TO_NEXT_STAGE`

Nie wykonano przez connector:
- `package.json` alias: `PACKAGE_ALIAS_PENDING`
- lokalne testy/build/diff: `NOT_RUN_REMOTE_GITHUB_CONNECTOR`

## DATE_TIME_REPOSITORY_SOURCE_MAP

```txt
lead:
source files: data-contract.ts, work-items/normalize.ts, scheduling.ts, calendar-operational-entry-contract.ts, activity-truth.ts, last-contact-intake.ts, contact-cadence-grid.ts, lost-lead-rescue.ts, next-move-contract.ts
source fields: createdAt, updatedAt, lastContactAt, contactedAt, movedToServiceAt, caseStartedAt, nextActionAt, nextStepDueAt, followUpAt, nextActionDate, nextActionTime, followUpDate, followUpTime
derived fields: silentDays, cadenceBucket, rescueBucket, nearestActionAt
ui-only fields: lead list next action label, silence badge label, Today lead row date label, Calendar lead shadow label
legacy fields: contactedAt, nextActionDate, nextActionTime, followUpDate, followUpTime
fallback order: nextActionAt -> followUpAt -> date+time -> createdAt
timezone policy: protect local silence 7/14 buckets
local date policy: split date/time fields are UI inputs only
instant policy: lastContactAt explicit field first
consumers: Lead list, LeadDetail, Today, Calendar, contact cadence grid, lost lead rescue
recommendation: keep lead next action fallback separate from last contact truth

client:
source files: data-contract.ts, activity-truth.ts, contact-cadence-grid.ts, owner-control-baseline.ts, case-finance-source.ts, work-items/normalize.ts
source fields: createdAt, updatedAt, lastActivityAt, lastContactAt, contactedAt, archivedAt, relation timing through cases/tasks/events
derived fields: nearestRelatedActivityAt, nearestPlannedActionAt, clientHealthDate, activeCommissionDate
ui-only fields: client card activity label, client relation timing label, owner control client row label
legacy fields: contactedAt, archivedAt
fallback order: lastActivityAt -> lastContactAt -> related case/task/event date -> updatedAt -> createdAt
recommendation: client can share Lead contact adapter but cannot invent one fake global status/date

case:
source files: data-contract.ts, work-items/normalize.ts, case-lifecycle-v1.ts, owner-control-baseline.ts, next-move-contract.ts, planned-actions.ts
source fields: startedAt, serviceStartedAt, completedAt, lastActivityAt, createdAt, updatedAt, updatedAt.toDate legacy object, nearest task/event dates
derived fields: caseLifecycleBucketDate, nearestOperationalMoveAt, ownerStatusDate
ui-only fields: case list lifecycle label, CaseDetail timeline label, Owner Control case row label
legacy fields: updatedAt.toDate, serviceStartedAt
fallback order: nearest task/event date -> lastActivityAt -> startedAt -> createdAt
recommendation: lifecycle dates must be separated from operational next-move dates

task:
source files: task-event-contract.ts, work-items/normalize.ts, scheduling.ts, calendar-items.ts, data-contract.ts, calendar-operational-entry-contract.ts
source fields: scheduledAt, scheduled_at, scheduledDate, scheduledTime, dueAt, due_at, dueDate, dueTime, dateTime, date, time, startAt, startsAt, reminderAt, completedAt, doneAt, createdAt, updatedAt, recurrence end fields
derived fields: calendarStartAt, todayBucket, overdueBucket, upcomingRangeBucket
ui-only fields: Today task row label, Calendar task tile label, task edit date-time local input
legacy fields: scheduled_at, due_at, dateTime, date, time, doneAt
fallback order: scheduledAt -> scheduled_at -> dueAt -> due_at -> scheduledDate+scheduledTime -> dueDate+dueTime -> dateTime -> date+time -> startAt -> startsAt -> createdAt
local date policy: task date-only policy currently defaults to T09:00
recommendation: do not change Calendar or Today behavior in 002B

event:
source files: task-event-contract.ts, work-items/normalize.ts, scheduling.ts, calendar-items.ts, data-contract.ts, calendar-operational-entry-contract.ts
source fields: startAt, start_at, startsAt, starts_at, endAt, end_at, endsAt, scheduledAt, date, time, reminderAt, recurrence end fields, completedAt, doneAt, createdAt, updatedAt
fallback order: startAt -> startsAt -> start_at -> starts_at -> scheduledAt -> date+time -> date -> createdAt
recommendation: event start/end contract separates local UI event from Google Calendar boundary

finance/payment/commission:
source files: finance-types.ts, finance-normalize.ts, case-finance-source.ts, data-contract.ts, supabase-fallback.ts
source fields: paidAt, paid_at, dueAt, due_at, createdAt, updatedAt, commissionDueAt, dueAt for commission, incurredAt, reimbursedAt
legacy fields: paid_at, due_at
fallback order: dueAt -> due_at -> paidAt -> paid_at -> createdAt
local date policy: finance date-only policy currently uses end-of-day T23:59:59
recommendation: finance deadline policy remains separate from task/event T09:00 policy

Today / Owner Control / Work Items:
source files: owner-control-baseline.ts, next-move-contract.ts, activity-truth.ts, contact-cadence-grid.ts, planned-actions.ts, work-items/normalize.ts
source fields: dateAt, nextMoveAt, silentDays, generatedAt, startsAt, momentRaw, scheduledAt, dueAt, lastContactAt, lastActivityAt, reminderAt, completedAt
fallback order: nextMoveAt -> scheduledAt -> dueAt -> startsAt -> dateAt -> lastActivityAt -> lastContactAt -> createdAt
recommendation: centralize now provider/day-key contract, but do not change Today behavior in 002B

Activity Timeline:
source files: activity-timeline.ts, activity-truth.ts, data-contract.ts, work-items/normalize.ts, task-event-contract.ts, finance-types.ts
source fields: happenedAt, createdAt, updatedAt, task scheduled/due/reminder, event start/scheduled/date, payment dates via payload
fallback order: happenedAt -> payload source date -> createdAt -> updatedAt
recommendation: Activity Timeline is UI-only date renderer. Activity Truth decides operational truth.

Calendar / Google Calendar boundary:
source files: calendar-items.ts, scheduling.ts, calendar-operational-entry-contract.ts, task-event-contract.ts, work-items/normalize.ts
source fields: local task/event start/end/reminder/recurrence, Google conflict startAt/endAt, inbound sync throttle timestamp, daysBack 30, daysForward 90, Date.now throttling
recommendation: Google Calendar sync must remain untouched in 002B. Repository documents boundary only.
```

## Eksporty repository

```txt
dateTimeSourceMap
leadDateContract
clientDateContract
caseDateContract
taskDateContract
eventDateContract
financeDateContract
paymentDateContract
commissionDateContract
activityDateContract
operationalTodayClockContract
ownerControlDateContract
calendarGoogleBoundaryContract
dateTimeRepository
```

## Najważniejsze rozdzielenia

- task date-only T09:00 !== finance date-only T23:59:59
- local day key !== ISO UTC day key
- Google Calendar boundary !== local event
- Activity Timeline UI-only !== Activity Truth operational truth
- Lead next action fallback !== last contact truth
- Today clock/now provider !== runtime behavior change

## Ograniczone podpięcie runtime

```txt
ADOPTION_DEFERRED_TO_NEXT_STAGE
```

Nie przepinano runtime.

## Czego nie ruszano

```txt
runtime: NOT_TOUCHED
Today: NOT_TOUCHED
Calendar: NOT_TOUCHED
Google Calendar sync: NOT_TOUCHED
Finance runtime: NOT_TOUCHED
Owner Control runtime: NOT_TOUCHED
Supabase/API: NOT_TOUCHED
SQL/migrations: NOT_TOUCHED
routing: NOT_TOUCHED
auth: NOT_TOUCHED
CSS: NOT_TOUCHED
layout: NOT_TOUCHED
UI redesign: NOT_TOUCHED
data provider: NOT_TOUCHED
```

## Guard/test/build

```txt
npm run verify:lf-prod-sot-002b-date-time-repository: NOT_RUN / PACKAGE_ALIAS_PENDING
node scripts/guards/verify-lf-prod-sot-002b-date-time-repository.cjs: NOT_RUN_REMOTE_GITHUB_CONNECTOR
node --test tests/lf-prod-sot-002b-date-time-repository.test.cjs: NOT_RUN_REMOTE_GITHUB_CONNECTOR
npm run guard:routes:canonical: NOT_RUN_REMOTE_GITHUB_CONNECTOR
npm run guard:ui:patch-layers: NOT_RUN_REMOTE_GITHUB_CONNECTOR
npm run check:polish-mojibake: NOT_RUN_REMOTE_GITHUB_CONNECTOR
npm run build: NOT_RUN_REMOTE_GITHUB_CONNECTOR
git diff --check: NOT_RUN_REMOTE_GITHUB_CONNECTOR
```

## Ryzyka

- 003A nie może startować, jeśli 002B nie ma lokalnego PASS.
- `date-time-repository.ts` nie może zawierać aktywnej runtime logiki czasu.
- Google Calendar boundary musi zostać tylko opisany.
- Today/Owner Control nie mogą zmienić zachowania.
- finance deadline policy musi zostać osobna od task/event policy.
- `package.json` alias jest nadal do dopisania lokalnie.

## Decyzja

```txt
LF-PROD-SOT-002B:
DATE_TIME_REPOSITORY_ADDED / PACKAGE_ALIAS_PENDING / LOCAL_REVERIFY_PENDING / NOT_READY_FOR_003A_VISUAL_SOT_MAP

Następny etap:
LF-PROD-SOT-003A — Mapowanie wizualnego źródła prawdy

003A musi być osobnym etapem i nie może startować przed lokalnym PASS 002B.
```

## Zapis do Obsidiana

```txt
data i godzina: 2026-07-01 18:00 Europe/Warsaw
name/alias: LF-PROD-SOT-002B date time repository partial remote implementation
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-002B_DATE_TIME_REPOSITORY.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-002B_DATE_TIME_REPOSITORY.md
save status: APP_REPORT_PUSHED_REMOTE / OBSIDIAN_REPORT_PENDING
Obsidian GitHub sync: PENDING
Obsidian local sync: LOCAL_SYNC_PENDING
tests: NOT_RUN_REMOTE_GITHUB_CONNECTOR
risk audit: runtime untouched; 002B needs package alias and local verification before closeout
what was not touched: runtime, CSS, SQL, Supabase/API, Google Calendar sync, routing, auth, UI redesign, data provider
next step: dopisać package alias lokalnie, uruchomić guard/test/build/diff, potem zsynchronizować Obsidian
```
