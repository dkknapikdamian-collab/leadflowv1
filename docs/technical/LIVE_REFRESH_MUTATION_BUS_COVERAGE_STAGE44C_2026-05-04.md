# LIVE REFRESH MUTATION BUS COVERAGE STAGE44C v3

## Source of truth

```text
src/lib/supabase-fallback.ts
```

## Required exports

```text
emitCloseflowDataMutation
subscribeCloseflowDataMutations
```

## Required import in pages

```text
import { subscribeCloseflowDataMutations } from '../lib/supabase-fallback';
```

Required pages:

```text
src/pages/Tasks.tsx
src/pages/Calendar.tsx
src/pages/TodayStable.tsx
```

## Runtime rule

A non-GET API mutation must:

1. clear the API GET cache,
2. emit `closeflow:data-mutated`,
3. let subscribed screens refetch controlled data,
4. avoid full page reload.

## Guard

```text
npm.cmd run check:faza4-etap44c-mutation-bus-coverage-smoke
```

## Manual evidence

```text
manual_live_refresh_evidence_required
```

## Next

```text
FAZA 5 - Etap 5.1 - AI read vs draft intent
```
