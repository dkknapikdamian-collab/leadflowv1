# LEAD LIMIT PLACEMENT HOTFIX - Stage 3.2H v2

## Contract

`activeLeads` protects creation of new leads only.

## Required placement

```text
assertWorkspaceEntityLimit(workspaceId, 'lead')
await insertLeadWithSchemaFallback(payload)
```

The limit call must be before the real insert, not inside helper functions.

## Forbidden placement

```text
ensureClientForLead
start_service
lead -> case
Rozpocznij obsługę
```

## Why

`Rozpocznij obsługę` creates or finds a client and then creates a case. It must not be blocked by the number of active leads, because the operation is reducing active lead workload.
