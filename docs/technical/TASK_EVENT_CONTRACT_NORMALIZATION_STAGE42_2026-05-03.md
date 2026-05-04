# TASK / EVENT CONTRACT NORMALIZATION - Stage 4.2

## Runtime contract

Canonical normalizers:

```text
normalizeTaskContract
normalizeEventContract
```

Source:

```text
src/lib/data-contract.ts
```

Consumer patched in this stage:

```text
api/work-items.ts
```

## Required behavior

Task read/write API can keep UI compatibility fields, but the base record must be normalized by the canonical contract.

## Task canonical fields

```text
id
workspaceId
title
status
type
priority
scheduledAt
leadId
caseId
clientId
reminderAt
recurrenceRule
createdAt
updatedAt
```

Compatibility output still allowed for UI:

```text
date
dueAt
time
reminder
recurrence
```

## Event canonical fields

```text
id
workspaceId
title
type
status
startAt
endAt
leadId
caseId
clientId
reminderAt
recurrenceRule
createdAt
updatedAt
```

Compatibility output still allowed for UI:

```text
scheduledAt
reminder
recurrence
```

## Forbidden drift

Do not create another private task/event alias chain inside `api/work-items.ts`.

The accepted place for alias mapping is:

```text
src/lib/data-contract.ts
```

## Next

```text
FAZA 4 - Etap 4.3 - CRUD smoke test i reload persistence
```
