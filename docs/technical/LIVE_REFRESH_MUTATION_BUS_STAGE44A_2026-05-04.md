# LIVE REFRESH MUTATION BUS - Stage 4.4A

## Files

```text
src/lib/supabase-fallback.ts
src/pages/Tasks.tsx
src/pages/Calendar.tsx
scripts/check-faza4-etap44a-live-refresh-mutation-bus.cjs
tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs
```

## Event contract

```ts
CLOSEFLOW_DATA_MUTATED_EVENT = 'closeflow:data-mutated'
```

Payload:

```ts
{
  path: string
  method: string
  entity: string
  occurredAt: string
}
```

## Why this exists

Before this stage, non-GET API calls cleared the GET cache, but mounted screens did not know that another part of the app changed data.

That meant some screens could stay stale until route change or manual refresh.

## Scope

Stage 4.4A covers:

```text
Tasks
Calendar
```

Stage 4.4B covers:

```text
Today
```

## Rule

No full reload.

Use controlled refetch or state update.

## Next

```text
FAZA 4 - Etap 4.4B - Today live refresh listener
```
