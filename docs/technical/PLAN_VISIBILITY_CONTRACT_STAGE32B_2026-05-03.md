# PLAN VISIBILITY CONTRACT - Stage 3.2B

**Date:** 2026-05-03  
**Canonical source:** `src/lib/plans.ts`  
**Purpose:** stop future drift between plan definitions, backend gates and UI visibility.

## Main rule

Lower plans must not see higher-plan operational features in normal product flow.

```text
Default: hide unavailable higher-plan features.
Exception: show upsell only in Billing / plan comparison / blocked direct route.
Never show a higher-plan feature as an active button if the backend will block it.
```

## Why

A paying app cannot feel like a locked prototype. If Free users see AI buttons everywhere, the product feels noisy and broken. If Basic users see Google Calendar controls that do not work, the product feels dishonest.

The clean rule is:

```text
Main workflow = only usable functions.
Billing/plan comparison = explain what upgrade unlocks.
Direct URL to blocked feature = show unavailable-in-plan message.
```

## Visibility states

Allowed UI states:

```text
available
hidden_by_plan
upsell_in_billing
blocked_direct_route
requires_config
beta
coming_soon
internal_only
```

Forbidden UI states:

```text
visible_active_but_backend_blocked
visible_success_claim_without_env
visible_ai_action_on_non_ai_plan
visible_google_action_on_basic_or_free
```

## Plan matrix

### Free

**Role:** demo / validation plan.

Visible in normal workflow:

```text
Dashboard / Today basic view
Leads
Clients
Cases
Tasks
Calendar basic local view
Billing / upgrade
Support
Profile settings
PWA install / mobile shell
```

Limits:

```text
activeLeads = 5
activeTasks = 5
activeEvents = 5
activeDrafts = 3
```

Must be hidden in normal workflow:

```text
AI assistant
AI command box
AI reply generator
AI draft generation
Quick AI capture
Google Calendar connect/sync
Daily digest e-mail settings
Weekly report
CSV import
Recurring reminders
Browser notifications
Admin-only AI settings
```

Allowed upsell:

```text
Billing / plan comparison may show: "Dostępne w Basic/Pro/AI".
Blocked direct route may show: "Ta funkcja jest dostępna w planie X".
```

### Basic

**Role:** paid starter CRM for solo service provider.

Visible in normal workflow:

```text
Everything from Free without Free record limits
Browser notifications
Daily digest e-mail settings, only with requires_config when env is missing
Light parser
Light drafts / draft review if it stays strictly draft-only
```

Must be hidden in normal workflow:

```text
Google Calendar connect/sync
Weekly report
CSV import
Recurring reminders
Full AI assistant
AI autonomous commands
AI data search assistant
Admin-only AI settings
```

Important wording:

```text
Basic can have "Szkice" if they are simple draft review.
Basic must not present this as full AI assistant.
```

### Pro

**Role:** operational automation and integrations.

Visible in normal workflow:

```text
Everything from Basic
Google Calendar connect/sync
Weekly report
CSV import
Recurring reminders
```

Must be hidden in normal workflow:

```text
Full AI assistant
AI autonomous commands
AI data search assistant
Admin-only AI settings
```

Important rule:

```text
Pro does not unlock full AI.
```

### AI

**Role:** premium plan with full assistant.

Visible in normal workflow:

```text
Everything from Pro
Full AI assistant
AI command box
AI data search assistant
AI reply suggestions
AI draft generation
AI draft review
```

Still required:

```text
AI must be confirm-first.
AI may create drafts, not final records, unless user explicitly approves.
```

### Trial 21 days

**Role:** full product trial.

Visible in normal workflow:

```text
Everything from AI plan for 21 days
```

After trial expiry:

```text
Data remains readable.
Writes and paid features follow the resulting access status and plan.
```

## Feature minimum plan

| Feature key | Minimum normal plan | Notes |
|---|---|---|
| `browserNotifications` | Basic | PWA shell can stay visible to all; browser notifications start in Basic. |
| `digest` | Basic | If env missing, show requires_config, not fake success. |
| `lightParser` | Basic | Simple parser only. |
| `lightDrafts` | Basic | Draft review only. |
| `googleCalendar` | Pro | Hidden from Free/Basic normal workflow. |
| `weeklyReport` | Pro | Hidden from Free/Basic normal workflow. |
| `csvImport` | Pro | Hidden from Free/Basic normal workflow. |
| `recurringReminders` | Pro | Hidden from Free/Basic normal workflow. |
| `ai` | AI | Full AI only. |
| `fullAi` | AI | Full AI only. |

## UI surfaces

### Main product flow

Examples:

```text
sidebar navigation
Today
LeadDetail
CaseDetail
Calendar
Tasks
Settings normal sections
global quick actions
floating AI widget
```

Rule:

```text
Show only features available in the current plan.
```

### Billing / plan comparison

Rule:

```text
Can show unavailable features as upgrade benefits.
Must clearly say which plan unlocks them.
Must not perform the action from this surface.
```

### Blocked direct route

Rule:

```text
If user opens /ai-drafts or another restricted route directly:
- do not show the functional UI,
- show one clean upgrade message,
- include link to Billing,
- do not fake loading or partial access.
```

## Backend requirement

UI hiding is not enough.

Backend must block with:

```text
assertWorkspaceFeatureAccess(...)
assertWorkspaceAiAllowed(...)
assertWorkspaceEntityLimit(...)
assertWorkspaceWriteAccess(...)
```

## Guard requirement

Future stages must keep these strings and source contracts stable:

```text
PLAN_FEATURE_MINIMUM_PLANS
PLAN_FEATURE_VISIBILITY_RULES
getPlanFeatureVisibility
shouldExposePlanFeature
hidden_by_plan
upsell_in_billing
blocked_direct_route
```

## Next implementation stage

```text
FAZA 3 - Etap 3.2C - Plan-based UI hiding and route blockers
```

Scope:

```text
Sidebar
Layout global actions
Today AI assistant
QuickAiCapture
AiDrafts
Settings Google Calendar
Settings Digest
Billing plan comparison
Direct restricted routes
```
