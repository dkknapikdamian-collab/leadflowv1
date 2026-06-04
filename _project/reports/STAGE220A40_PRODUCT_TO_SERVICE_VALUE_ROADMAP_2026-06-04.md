# STAGE220A40 - Product-to-service value roadmap

## Routing

- project: CloseFlow / LeadFlow
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- Obsidian folder: DO_POTWIERDZENIA

## Principle

Model: sprzedajemy produkt, żeby sprzedawać usługę.

CloseFlow should not compete as a generic CRM by adding the same features under different labels. It should become a light operational system that opens the door to recurring setup, monitoring, cleanup and follow-up operations.

## Decision

The highest-value additions should:

- reduce lost leads and forgotten follow-ups,
- create recurring return behavior,
- support paid setup / monthly operating service,
- avoid heavy customer behavior change,
- avoid large feature bloat,
- provide owner-level visibility.

## User idea saved and refined

Initial user idea:

- add normal reminders,
- add recurring reminders.

Refined decision after discussion:

- do not make lack-of-movement detection a noisy notification system,
- make it a clear operational grid / summary,
- use simple contact cadence signals such as 1 / 2 / 3 / 5 / 7 / 14 days,
- show messages like: `Kontakt 7 dni temu`, `14 dni ciszy`, `Odezwij się`,
- connect the summary to the same conceptual logic as morning digest,
- make it actionable but not spammy.

AI assessment: good direction.

Why:

- basic reminders are commodity,
- recurring reminders are useful only if tied to real business cycles,
- the stronger product advantage is a contact/case movement grid, not another notification stream,
- the service angle is setup, tuning and recurring review of the movement rules.

## Priority 1 - Contact cadence grid and reminder engine

### Goal

Create a reminder/movement system that protects sales movement without turning the app into notification noise.

### Product rule

This should not start as push notifications.

Preferred UX:

- clear grid/card/list inside Today / owner summary,
- direct labels:
  - `Kontakt 1 dzień temu`,
  - `Kontakt 2 dni temu`,
  - `Kontakt 3 dni temu`,
  - `Kontakt 5 dni temu`,
  - `Kontakt 7 dni temu - odezwij się`,
  - `14 dni ciszy - ryzyko utraty`,
- one suggested action, not five alerts,
- option to create/update a task from the row,
- option to mark as contacted,
- option to snooze,
- option to ignore with reason.

### Scope

#### A. One-time reminders

- reminder attached to lead/client/case/task/event/payment,
- due date,
- owner/user,
- status: active, done, snoozed, ignored, overdue,
- complete/snooze/reschedule,
- history entry after action.

#### B. Recurring reminders

- recurrence: daily, weekly, monthly, custom interval,
- optional stop condition,
- linked entity,
- next occurrence generated only when needed,
- no infinite task spam,
- clear label: recurring follow-up / recurring finance / recurring service check.

#### C. Contact cadence grid

- computed from last meaningful activity/contact,
- thresholds configurable by template or manually,
- recommended starter thresholds: 1 / 2 / 3 / 5 / 7 / 14 days,
- display as a compact matrix by risk level:
  - green: recent contact,
  - amber: needs follow-up soon,
  - red: stale / lost-lead risk.

#### D. Same logic as morning digest

The morning digest should not be a separate product logic. It should summarize the same movement engine:

- leads with no next action,
- leads with contact gap over threshold,
- cases with overdue task/event,
- payments/commissions needing action,
- recurring reminders due today,
- stale drafts waiting for approval.

### Differentiator

Not just a task list. The app should make sales movement visible:

- this lead has no next action,
- this person was contacted 7 days ago,
- this person has had 14 days of silence,
- this case has unpaid commission/payment,
- this recurring check is due,
- this follow-up is overdue and blocks sales movement.

### Product-to-service angle

Sell the app, then sell:

- setup of follow-up cadences,
- vertical reminder packs,
- monthly stale-lead cleanup,
- weekly owner movement review,
- tuning of thresholds by industry.

### Stage proposal

`STAGE220A41_CONTACT_CADENCE_GRID_AND_REMINDER_ENGINE`

### Acceptance test

- Create lead.
- Add note/contact today.
- Simulate last contact 7 days ago.
- Today/summary shows `Kontakt 7 dni temu - odezwij się`.
- Simulate last contact 14 days ago.
- Summary shows `14 dni ciszy - ryzyko utraty`.
- Snooze hides it until the next due date.
- Mark as contacted updates the activity history and resets contact age.
- Morning digest summary shows the same item.

## Priority 2 - Lost lead rescue / dormant lead recovery

### Goal

Find leads that are silently dying and turn them into one clear action list.

### Scope

- stale lead detector,
- no next action detector,
- no contact in X days,
- unanswered lead status,
- closed-lost reason cleanup,
- bulk create follow-up actions from stale leads,
- owner alert card,
- connection to contact cadence grid.

### UX

Do not show this as generic notifications.

Show it as:

- `Do odzyskania`,
- `Brak ruchu`,
- `Kontakt 7+ dni`,
- `14 dni ciszy`,
- `Brak kolejnego kroku`,
- `Odezwij się dziś`.

Each row should have:

- lead/client name,
- last contact date,
- last action summary,
- suggested next action,
- button: `Odezwij się`,
- button: `Utwórz zadanie`,
- button: `Oznacz jako martwy`,
- button: `Odłóż`.

### Differentiator

Most small teams do not lose leads because they lack a CRM. They lose leads because nothing forces the next move and no one sees the silence early enough.

### Product-to-service angle

Sell:

- lead database cleanup,
- stale lead recovery campaign,
- follow-up script/template package,
- monthly rescue review,
- done-for-you cleanup of silent leads.

### Stage proposal

`STAGE220A42_LOST_LEAD_RESCUE_AND_STALE_PIPELINE`

## Priority 3 - Draft inbox rebuild as operational capture

### Goal

Make manual/AI drafts the fastest way to capture chaos.

### Scope

- one inbox: Szkice do sprawdzenia,
- sources: manual, pasted text, dictation, parser, AI,
- approve as lead/task/event/note,
- editable preview before creation,
- missing-data warnings,
- linked record after approval,
- no silent deletion,
- stale draft summary inside digest/movement grid.

### Differentiator

User does not need to fill CRM forms first. They can dump messy text and approve clean work items.

### Product-to-service angle

Sell:

- setup of capture workflows,
- template/draft cleanup,
- import of old notes/messages,
- monthly review of unapproved drafts.

### Stage proposal

Already planned as `STAGE220A36_AI_DRAFTS_AND_MANUAL_DRAFTS_REBUILD`. Keep it high priority.

## Priority 4 - Business playbook templates

### Goal

Turn CloseFlow from generic app into configured operating flow for a specific industry.

### Scope

Templates by vertical:

- real estate,
- renovations,
- architecture,
- HVAC/local services,
- storage/rental,
- B2B services.

Each template includes:

- lead statuses,
- contact cadence rules,
- follow-up rules,
- recurring reminders,
- task/event templates,
- case checklist,
- finance labels,
- message templates,
- weekly owner report layout.

### Example playbook rule

Real estate starter cadence:

- day 1: first follow-up,
- day 2: second touch if no answer,
- day 3: short message / call attempt,
- day 5: value-based check-in,
- day 7: `Odezwij się`,
- day 14: `Ryzyko utraty kontaktu`.

This is not a universal truth; it is a configurable starting template.

### Differentiator

Generic CRM asks the customer to design their process. CloseFlow should ship with ready operating packs.

### Product-to-service angle

Sell:

- implementation package,
- vertical setup,
- monthly optimization,
- custom playbook.

### Stage proposal

`STAGE220A43_VERTICAL_PLAYBOOK_TEMPLATES`

## Priority 5 - Owner morning digest and weekly report

### Goal

Give the owner a reason to return daily and weekly.

### Daily/morning digest

The daily digest should summarize the same movement engine:

- `Dziś do ruszenia`,
- leads with contact gap over threshold,
- lead/case with no next action,
- overdue follow-ups,
- recurring reminders due today,
- stale drafts waiting for approval,
- payments/commissions needing action.

This digest can start in-app. Email/push can be optional later.

### Weekly report

Weekly report:

- new leads,
- leads without next action,
- overdue follow-ups,
- stale clients,
- open cases,
- unpaid commission/payments,
- completed actions,
- next week risks.

### Differentiator

Owner does not need to inspect every list. The app tells what is moving and what is stuck.

### Product-to-service angle

Sell:

- weekly/monthly operator report,
- done-for-you review,
- sales process cleanup,
- recurring business review service.

### Stage proposal

`STAGE220A44_OWNER_DIGEST_AND_WEEKLY_REPORT`

## Priority 6 - Payment/commission watchlist

### Goal

Make case finance operational, not just a static value display.

### User question

`6 spoko, ale jak?`

### Answer

Do not build this as another notification feed. Build it as a money-at-risk watchlist connected to cases and digest.

### Scope

#### A. Finance watchlist cards

Show grouped cards:

- `Prowizja do rozliczenia`,
- `Wpłata po terminie`,
- `Brak daty płatności`,
- `Korekta wymaga sprawdzenia`,
- `Duża kwota bez kolejnego kroku`.

#### B. Per-case finance state

Each case should expose:

- transaction value,
- commission mode,
- commission due,
- paid commission/payment,
- remaining commission/payment,
- last payment date,
- next payment reminder date,
- finance status.

#### C. Suggested action

Every finance row should have one next action:

- `Przypomnij o płatności`,
- `Dodaj wpłatę`,
- `Utwórz zadanie`,
- `Oznacz jako rozliczone`,
- `Odłóż do...`,
- `Wyjaśnij korektę`.

#### D. Digest integration

Morning digest should include a money section:

- `3 sprawy z prowizją do rozliczenia`,
- `2 płatności po terminie`,
- `1 korekta do sprawdzenia`,
- total amount at risk.

#### E. Recurring finance reminders

Optional recurring rules:

- monthly service payment,
- recurring rent/storage/service fee,
- recurring commission review,
- payment due every X days/months.

### Differentiator

A small business cares whether money is still on the table. CloseFlow should not just store money data; it should point to uncollected money and one next action.

### Product-to-service angle

Sell:

- finance reminder setup,
- monthly unpaid/commission cleanup,
- process tuning,
- owner money-at-risk report.

### Stage proposal

`STAGE220A45_FINANCE_WATCHLIST_AND_PAYMENT_REMINDERS`

### Acceptance test

- Create case with transaction value 100000 PLN and commission 3 percent.
- Commission due equals 3000 PLN.
- Add payment 1000 PLN.
- Watchlist shows 2000 PLN remaining.
- Add due date in the past.
- Digest shows overdue finance item.
- Snooze or mark resolved removes it from today but keeps history.

## What not to build now

Do not add these as standalone features now:

- generic kanban variants,
- another dashboard that repeats Today,
- CRM fields without workflow impact,
- generic AI chat,
- full email marketing suite,
- full project management clone,
- complex calendar clone before reminder/case logic is stable,
- notification spam for every stale record.

## Recommended order

1. `STAGE220A35_PRODUCTION_READINESS_AUDIT`
2. `STAGE220A41_CONTACT_CADENCE_GRID_AND_REMINDER_ENGINE`
3. `STAGE220A36_AI_DRAFTS_AND_MANUAL_DRAFTS_REBUILD`
4. `STAGE220A42_LOST_LEAD_RESCUE_AND_STALE_PIPELINE`
5. `STAGE220A44_OWNER_DIGEST_AND_WEEKLY_REPORT`
6. `STAGE220A45_FINANCE_WATCHLIST_AND_PAYMENT_REMINDERS`
7. `STAGE220A43_VERTICAL_PLAYBOOK_TEMPLATES`
8. `STAGE220A38_AUTH_BILLING_PLAN_E2E`
9. `STAGE220A39_AUTOMATED_PRODUCTION_SMOKE_AND_BETA_GATE`

## Practical test before building each feature

For every proposed addition, answer:

- Does this prevent a real lost sale, missed follow-up or unpaid amount?
- Does it create repeat return behavior?
- Does it support paid setup or monthly service?
- Does it reduce customer work instead of adding manual admin?
- Can it be tested manually before building a complex system?

If no, it is probably feature bloat.

## Additional note

Competitors already have tasks, reminders, recurring tasks, activity views and overdue activity concepts. CloseFlow should not copy that surface-level feature. The difference should be the opinionated movement grid: contact age, next action, stale leads, money at risk and owner digest.
