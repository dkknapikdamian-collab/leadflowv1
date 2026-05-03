# CloseFlow - Stage03B System Schema Fallback Boundary

**Date:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Scope:** backend API schema fallback hardening, no UI changes.

## Goal

Stage03B narrows the generic runtime schema fallback in `api/system.ts`.

Before this stage, the generic helpers in `api/system.ts` could remove any missing column from a payload as long as the column existed in the current payload.

That is too loose for production. It can hide real schema drift and make bugs look like successful writes.

## Change

The remaining system fallback is now bounded by `SYSTEM_SCHEMA_FALLBACK_ALLOWED_COLUMNS`.

Allowed fallback tables:

```text
profiles
workspaces
```

Allowed columns are explicit. If Supabase reports a missing column that is not on the allowlist, the error is re-thrown instead of silently deleting the value.

## Why profiles/workspaces are still allowed

These two areas still carry old compatibility debt:

- profile rows can differ between older Firebase-era and Supabase-era shapes,
- workspace billing/settings rows can differ between older and newer migration states.

This stage does not remove that debt fully. It stops it from expanding.

## Stage03B v2 installer fix

The v1 installer used an overly rigid multiline regex to locate the three safe fallback helpers. V2 replaces each helper by function name and brace matching instead.

## Do not change in this stage

- no UI changes,
- no billing behavior changes,
- no Google Calendar changes,
- no auth rewrite,
- no lead workflow changes,
- no schema migration execution.

## Verification

Run:

```text
npm.cmd run check:stage03b-system-fallback-boundary
node --test tests/stage03b-system-fallback-boundary.test.cjs
npm.cmd run build
```

## Next Stage03C candidate

Start the same narrowing for `api/leads.ts` fallback helpers:

- `OPTIONAL_LEAD_COLUMNS`
- `OPTIONAL_CASE_COLUMNS`
- `OPTIONAL_ACTIVITY_COLUMNS`

The next step should either prove the migration contains the columns or keep only a smaller allowlist for truly optional fields.
