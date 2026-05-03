# DATA / BILLING CONTRACT - Plan Source of Truth

**Stage:** FAZA 3 - Etap 3.1  
**Date:** 2026-05-03

## Canonical file

```text
src/lib/plans.ts
```

No other file should define its own independent plan matrix.

## Canonical constants

```text
TRIAL_DAYS = 21
PLAN_IDS.free = free
PLAN_IDS.basic = basic
PLAN_IDS.pro = pro
PLAN_IDS.ai = ai
PLAN_IDS.trial = trial_21d
```

## Canonical access statuses

```text
trial_active
trial_ending
trial_expired
free_active
paid_active
payment_failed
canceled
inactive
```

## Canonical Free limits

```text
activeLeads = 5
activeTasks = 5
activeEvents = 5
activeDrafts = 3
```

## Canonical features

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

## Runtime users of the source of truth

```text
api/me.ts
src/hooks/useWorkspace.ts
src/lib/access.ts
src/server/_access-gate.ts
```

## Guard

```text
npm.cmd run check:faza3-etap31-plan-source-of-truth
```


## Next stage marker

```text
FAZA 3 - Etap 3.2 - Backendowe blokady funkcji
```

Etap 3.2 must prove backend feature gates and limits for actual API endpoints.

## Follow-up

Etap 3.2 must prove backend feature gates and limits for actual API endpoints.
