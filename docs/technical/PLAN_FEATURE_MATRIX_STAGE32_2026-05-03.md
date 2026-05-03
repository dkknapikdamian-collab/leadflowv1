# PLAN FEATURE MATRIX - Stage 3.2A

**Date:** 2026-05-03  
**Canonical file:** `src/lib/plans.ts`

## Final matrix for current release track

```text
Free:
- core CRM with limits
- no AI
- no Google Calendar
- no digest e-mail
- no browser notifications

Basic:
- unlimited core CRM
- browser notifications
- daily digest if configured
- light parser
- light drafts
- no Google Calendar
- no full AI

Pro:
- Basic features
- Google Calendar
- weekly report
- CSV import
- recurring reminders
- no full AI

AI:
- Pro features
- full AI assistant

Trial 21 dni:
- AI features for trial period
```

## Backend gates

```text
assertWorkspaceWriteAccess
assertWorkspaceEntityLimit
assertWorkspaceFeatureAccess
assertWorkspaceAiAllowed
```

## Feature keys

```text
ai
fullAi
digest
lightParser
lightDrafts
googleCalendar
weeklyReport
csvImport
recurringReminders
browserNotifications
```

## Current package checks

```text
npm.cmd run check:faza3-etap32-plan-feature-access-gate
node --test tests/faza3-etap32-plan-feature-access-gate.test.cjs
```

## Next package

```text
FAZA 3 - Etap 3.2B - Plan-based UI visibility and feature smoke
```

## Visibility contract

Detailed visibility and upsell rules are locked in:

```text
docs/technical/PLAN_VISIBILITY_CONTRACT_STAGE32B_2026-05-03.md
```

Main rule:

```text
Lower plans must not see higher-plan operational features in normal product flow.
Show upgrade messaging only in Billing / plan comparison / blocked direct route.
```
