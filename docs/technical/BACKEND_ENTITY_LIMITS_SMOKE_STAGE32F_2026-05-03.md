# BACKEND ENTITY LIMITS SMOKE - Stage 3.2F

## Source of truth

```text
src/lib/plans.ts
src/server/_access-gate.ts
```

## Enforced entities

| Entity | Canonical key | Table |
|---|---|---|
| Lead | activeLeads | leads |
| Task | activeTasks | work_items |
| Event | activeEvents | work_items |
| AI draft | activeDrafts | ai_drafts |

## Runtime rule

```text
assertWorkspaceEntityLimit(workspaceId, entityName)
```

When `currentCount` is omitted, the helper counts records itself for Free workspaces.

For non-Free plans, the helper returns true.

## API surfaces

```text
api/leads.ts
api/work-items.ts
src/server/ai-drafts.ts
```

## Error

```text
WORKSPACE_ENTITY_LIMIT_REACHED
```

## Next

```text
FAZA 4 - Etap 4.1 - Data contract map
```
