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

## User idea saved

Add normal and recurring reminders.

AI assessment: good idea, but only if implemented as part of a stronger reminder engine, not as a simple calendar clone.

Why:

- basic reminders are commodity,
- recurring reminders are useful for repeated service and follow-up loops,
- the real advantage comes when reminders are tied to lead/case state, aging, missing next action and owner-level alerts.

## Priority 1 - Follow-up and reminder engine

### Goal

Create a reminder system that protects sales movement.

### Scope

- one-time reminders,
- recurring reminders,
- reminder attached to lead/client/case/task/event/payment,
- next-action required flag,
- overdue reminder states,
- snooze,
- complete,
- reschedule,
- reminder history,
- owner view: who/what is stuck.

### Differentiator

Not just a task list. The app should tell the user:

- this lead has no next action,
- this client has not been touched in X days,
- this case has unpaid commission/payment,
- this task repeats every week/month,
- this follow-up is overdue and blocks sales movement.

### Product-to-service angle

Sell the app, then sell:

- setup of follow-up rules,
- recurring reminder pack per business type,
- monthly cleanup of overdue reminders,
- weekly owner report.

### Stage proposal

`STAGE220A41_REMINDER_ENGINE_ONE_TIME_AND_RECURRING`

## Priority 2 - Lost lead rescue / dormant lead recovery

### Goal

Find leads that are silently dying.

### Scope

- stale lead detector,
- no next action detector,
- no contact in X days,
- unanswered lead status,
- closed-lost reason cleanup,
- bulk create reminders from stale leads,
- owner alert card.

### Differentiator

Most small teams do not lose leads because they lack a CRM. They lose leads because nothing forces the next move.

### Product-to-service angle

Sell:

- lead database cleanup,
- stale lead recovery campaign,
- follow-up script/template package,
- monthly rescue review.

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
- no silent deletion.

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
- follow-up rules,
- recurring reminders,
- task/event templates,
- case checklist,
- finance labels,
- message templates,
- weekly owner report layout.

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

## Priority 5 - Owner weekly report

### Goal

Give the owner a reason to return every week.

### Scope

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
- sales process cleanup.

### Stage proposal

`STAGE220A44_OWNER_WEEKLY_REPORT_AND_RISK_DIGEST`

## Priority 6 - Payment/commission watchlist

### Goal

Make case finance operational, not just a static value display.

### Scope

- commission due reminders,
- unpaid payment reminders,
- overdue payment alerts,
- payment correction history,
- owner-level finance card,
- recurring payment/reminder support where needed.

### Differentiator

A small business cares whether money is still on the table.

### Product-to-service angle

Sell:

- finance reminder setup,
- monthly unpaid/commission cleanup,
- process tuning.

### Stage proposal

`STAGE220A45_FINANCE_WATCHLIST_AND_PAYMENT_REMINDERS`

## What not to build now

Do not add these as standalone features now:

- generic kanban variants,
- another dashboard that repeats Today,
- CRM fields without workflow impact,
- generic AI chat,
- full email marketing suite,
- full project management clone,
- complex calendar clone before reminder/case logic is stable.

## Recommended order

1. `STAGE220A35_PRODUCTION_READINESS_AUDIT`
2. `STAGE220A41_REMINDER_ENGINE_ONE_TIME_AND_RECURRING`
3. `STAGE220A36_AI_DRAFTS_AND_MANUAL_DRAFTS_REBUILD`
4. `STAGE220A42_LOST_LEAD_RESCUE_AND_STALE_PIPELINE`
5. `STAGE220A43_VERTICAL_PLAYBOOK_TEMPLATES`
6. `STAGE220A44_OWNER_WEEKLY_REPORT_AND_RISK_DIGEST`
7. `STAGE220A45_FINANCE_WATCHLIST_AND_PAYMENT_REMINDERS`
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
