# LF-PROD-SOT-002B — Date/time repository

## Status

```txt
DATE_TIME_REPOSITORY_ADDED / PACKAGE_ALIAS_ADDED / GUARD_PASS / TEST_PASS / ROUTE_GUARD_PASS / UI_PATCH_GUARD_PASS / MOJIBAKE_PASS / BUILD_PASS / DIFF_CHECK_PASS / APP_REPO_PUSHED / OBSIDIAN_LOCAL_SYNC_PENDING / READY_FOR_003A_AFTER_OBSIDIAN_LOCAL_PULL
```

## Wejście

```txt
Previous stage: LF-PROD-SOT-002A = CLOSED / READY_FOR_002B_DATE_TIME_REPOSITORY
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
HEAD after app push: f6c7f988
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
Verification log source: Damian local PowerShell run after rebase and push
```

## Zakres

Co dodano:
- `src/lib/source-of-truth/date-time-repository.ts`
- `scripts/guards/verify-lf-prod-sot-002b-date-time-repository.cjs`
- `tests/lf-prod-sot-002b-date-time-repository.test.cjs`
- package alias `verify:lf-prod-sot-002b-date-time-repository`
- `_project/runs/LF-PROD-SOT-002B_DATE_TIME_REPOSITORY.md`
- Obsidian report copy
- read-only adoption: `ADOPTION_DEFERRED_TO_NEXT_STAGE`

Nie przepinano runtime.

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
date-only policy: lead date-only values are not promoted to global source of truth
consumers: LeadDetail, Leads, Today, Calendar, activity truth, cadence/rescue helpers
recommendation: keep repository read-only until dedicated runtime adoption stage

client:
source files: data-contract.ts, work-items/normalize.ts, activity-truth.ts, supabase-fallback.ts
source fields: createdAt, updatedAt, lastActivityAt, lastContactAt, contactedAt, archivedAt, relation timing through cases/tasks/events
derived fields: client activity/contact date adapter can be shared with Lead
ui-only fields: client list/card labels
legacy fields: contactedAt
fallback order: explicit client activity/contact fields, then relation timing only where consumer asks for it
timezone policy: do not invent one fake global status/date
local date policy: relation timing stays relation-scoped
instant policy: explicit timestamps first
date-only policy: no global client date-only source
consumers: Clients, ClientDetail, Today relation rows, activity truth
recommendation: shared adapter allowed, fake global client date forbidden

case:
source files: data-contract.ts, case-lifecycle-v1.ts, activity-truth.ts, planned-actions.ts, supabase-fallback.ts
source fields: startedAt, serviceStartedAt, completedAt, lastActivityAt, createdAt, updatedAt, updatedAt.toDate legacy object, nearest task/event dates
derived fields: lifecycle bucket, operational next move
ui-only fields: case list/card date labels
legacy fields: updatedAt.toDate
fallback order: lifecycle dates separated from nearest task/event operational dates
timezone policy: do not mix lifecycle completion with next-move urgency
local date policy: lifecycle is not a day-key provider
instant policy: explicit lifecycle timestamps first
date-only policy: not defined as global source in 002B
consumers: Cases, CaseDetail, Today, activity truth
recommendation: separate lifecycle dates from operational next-move dates

task:
source files: task-event-contract.ts, scheduling.ts, calendar-items.ts, planned-actions.ts, activity-truth.ts
source fields: scheduledAt, scheduled_at, scheduledDate, scheduledTime, dueAt, due_at, dueDate, dueTime, dateTime, date, time, startAt, startsAt, reminderAt, completedAt, doneAt, createdAt, updatedAt, recurrence end fields
derived fields: local start/due/reminder, recurrence window
ui-only fields: task card labels, Today task row labels, Calendar task labels
legacy fields: scheduled_at, due_at, dateTime, date/time split fields
fallback order: scheduledAt/scheduled_at -> dueAt/due_at -> dateTime -> date+time
timezone policy: local scheduling boundary must remain stable
date-only policy: task date-only currently defaults to T09:00
consumers: TasksStable, Today, Calendar, Activity Timeline, planned actions
recommendation: do not change T09:00 behavior in 002B

event:
source files: task-event-contract.ts, scheduling.ts, calendar-items.ts, calendar-operational-entry-contract.ts, activity-truth.ts
source fields: startAt, start_at, startsAt, starts_at, endAt, end_at, endsAt, scheduledAt, date, time, reminderAt, recurrence end fields, completedAt, doneAt, createdAt, updatedAt
derived fields: local UI start/end/reminder, calendar operational entry
ui-only fields: Calendar event labels, Today event rows, Activity Timeline labels
legacy fields: start_at, starts_at, end_at, endsAt, date/time split fields
fallback order: startAt/start_at/startsAt/starts_at -> scheduledAt -> date+time
policy: local UI event must remain separate from Google Calendar boundary
consumers: Calendar, Today, Activity Timeline, calendar operational entries
recommendation: document boundary only in 002B

finance/payment/commission:
source files: finance-types.ts, finance-normalize.ts, case-finance-source.ts, activity-truth.ts
source fields: paidAt, paid_at, dueAt, due_at, createdAt, updatedAt, commissionDueAt, dueAt for commission, incurredAt, reimbursedAt
derived fields: payment deadline, commission deadline, cost reimbursement timing
ui-only fields: finance card labels, settlement labels
legacy fields: paid_at, due_at
fallback order: explicit finance timestamp -> due date -> created/updated fallback only where existing consumer already does it
policy: finance date-only uses end-of-day T23:59:59 and stays separate from task/event T09:00
consumers: CaseDetail finance, settlement rail, Activity Timeline payload renderer
recommendation: keep finance deadline policy separate

calendar/google boundary:
source files: calendar-items.ts, calendar-operational-entry-contract.ts, scheduling.ts
source fields: local task/event start/end/reminder/recurrence, Google conflict startAt/endAt, inbound sync throttle timestamp, daysBack 30, daysForward 90, Date.now throttling
derived fields: conflict window, sync window
ui-only fields: Calendar visible rows
legacy fields: provider-specific sync fields
policy: Google Calendar sync untouched in 002B; boundary documented only
consumers: Calendar runtime and Google sync boundary
recommendation: no runtime adoption in 002B

today/owner/work items/activity:
source files: work-items/normalize.ts, owner-control-baseline.ts, activity-truth.ts, activity-timeline.ts
source fields: dateAt, nextMoveAt, silentDays, generatedAt, startsAt, momentRaw, scheduledAt, dueAt, lastContactAt, lastActivityAt, reminderAt, completedAt, happenedAt, createdAt, updatedAt
derived fields: day key, now provider contract, operational truth, UI timeline labels
ui-only fields: Activity Timeline renderer labels, Today section labels
legacy fields: momentRaw, dateAt mixed semantics
policy: Today clock/now provider is documented only; Activity Timeline is UI-only date renderer; Activity Truth decides operational truth
consumers: Today, Owner Control, Work Items, Activity Timeline, Activity Truth
recommendation: adopt only in a later scoped runtime stage
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

- task date-only `T09:00` !== finance date-only `T23:59:59`
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
npm run verify:lf-prod-sot-002b-date-time-repository: PASS
node --test tests/lf-prod-sot-002b-date-time-repository.test.cjs: PASS 7/7
npm run guard:routes:canonical: PASS
npm run guard:ui:patch-layers: PASS
npm run check:polish-mojibake: PASS
npm run build: PASS
git diff --check: PASS
git push origin dev-rollout-freeze: PASS f6c7f988
```

Known build warning:
- `src/lib/supabase-fallback.ts` is both dynamically and statically imported; existing bundling warning, not introduced by 002B.
- large chunk warnings; existing Vite bundle-size warning, not introduced by 002B.

## Ryzyka

- 003A nie może startować, jeśli lokalny Obsidian target nie zostanie zsynchronizowany albo jawnie oznaczony jako `LOCAL_SYNC_PENDING`.
- date-time repository nie może zawierać aktywnej runtime logiki czasu.
- Google Calendar boundary musi zostać tylko opisany.
- Today/Owner Control nie mogą zmienić zachowania.
- finance deadline policy musi zostać osobna od task/event policy.

## Decyzja

```txt
LF-PROD-SOT-002B:
DATE_TIME_REPOSITORY_ADDED / PACKAGE_ALIAS_ADDED / GUARD_PASS / TEST_PASS / BUILD_PASS / APP_REPO_PUSHED / OBSIDIAN_LOCAL_SYNC_PENDING
```

Następny etap:

```txt
LF-PROD-SOT-003A — Mapowanie wizualnego źródła prawdy
```

003A musi być osobnym etapem. Nie startować bez lokalnego pull Obsidiana albo jawnego `LOCAL_SYNC_PENDING`.

## Zapis do Obsidiana

```txt
data i godzina: 2026-07-01 08:14 Europe/Warsaw
name/alias: LF-PROD-SOT-002B_DATE_TIME_REPOSITORY
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-002B_DATE_TIME_REPOSITORY.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-002B_DATE_TIME_REPOSITORY.md
save status: APP_REPORT_UPDATED_REMOTE / OBSIDIAN_REPORT_UPDATE_REQUIRED_REMOTE
action source: Damian local PowerShell PASS log + GitHub remote alias verification
Obsidian GitHub sync: PENDING_UPDATE_AFTER_THIS_APP_REPORT
Obsidian local sync: LOCAL_SYNC_PENDING
tests: GUARD_PASS / TEST_PASS_7_7 / ROUTE_GUARD_PASS / UI_PATCH_GUARD_PASS / MOJIBAKE_PASS / BUILD_PASS / DIFF_CHECK_PASS
risk audit: runtime adoption deferred; no runtime/CSS/SQL/API/Google Calendar changes touched; existing build warnings only
what was not touched: runtime, Today, Calendar, Google Calendar sync, Finance runtime, Owner Control runtime, Supabase/API, SQL/migrations, routing, auth, CSS, layout, UI redesign, data provider
next step: update Obsidian report remote, then pull local Obsidian vault
```
