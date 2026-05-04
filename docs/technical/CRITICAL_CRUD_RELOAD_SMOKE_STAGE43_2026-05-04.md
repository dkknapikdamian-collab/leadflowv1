# CRITICAL CRUD / RELOAD SMOKE - Stage 4.3

## Files

```text
scripts/smoke-critical-crud.cjs
scripts/check-faza4-etap43-critical-crud-smoke.cjs
tests/faza4-etap43-critical-crud-smoke.test.cjs
docs/release/FAZA4_ETAP43_CRITICAL_CRUD_RELOAD_SMOKE_2026-05-04.md
docs/technical/CRITICAL_CRUD_RELOAD_SMOKE_STAGE43_2026-05-04.md
```

## Runtime smoke target

This smoke targets the same API surface used by the app UI:

```text
/api/leads
/api/tasks
/api/events
/api/system?kind=ai-drafts
/api/leads action=start_service
/api/me
```

`/api/tasks` and `/api/events` are Vercel rewrites to:

```text
/api/work-items?kind=tasks
/api/work-items?kind=events
```

## Authentication

The smoke must run with a real Supabase access token:

```text
CLOSEFLOW_SMOKE_ACCESS_TOKEN
```

Optional workspace hint:

```text
CLOSEFLOW_SMOKE_WORKSPACE_ID
```

The backend must still resolve workspace from server auth/request-scope. The optional workspace header is only a compatibility hint for the same runtime flow used by the frontend.

## Safety

Every generated record name starts with:

```text
CF_SMOKE_43_
```

Cleanup runs best effort unless:

```text
CLOSEFLOW_SMOKE_KEEP_DATA=1
```

## Plan-sensitive AI smoke

AI draft create/confirm/cancel requires a plan/trial with AI access.

If AI is not enabled for the current workspace, the script reports a plan-gated skip unless:

```text
CLOSEFLOW_SMOKE_AI_EXPECTED=1
```

When `CLOSEFLOW_SMOKE_AI_EXPECTED=1`, AI draft failures fail the whole smoke.

## Release rule

Static guards do not replace live smoke.

A release candidate needs:

```text
npm.cmd run smoke:critical-crud
```

run against the exact preview URL and commit being audited.

## Next

```text
FAZA 4 - Etap 4.4 - Live refresh bez ręcznego odświeżania
```
