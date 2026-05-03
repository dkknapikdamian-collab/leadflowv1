# CloseFlow - Stage03C Leads Schema Fallback Boundary

**Date:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Scope:** `api/leads.ts` schema fallback boundary, no UI changes.

## Goal

Stage03C continues the Stage03B cleanup pattern for `api/leads.ts`.

The lead API still needs compatibility fallback for older Supabase schemas, but that fallback must be explicit and bounded.

## Change

This stage introduces one table-aware fallback boundary:

```text
LEAD_SCHEMA_FALLBACK_ALLOWED_COLUMNS
shouldDropMissingColumnForLeadFallback(...)
```

Allowed fallback tables:

```text
leads
cases
activities
```

The existing column sets remain the source of truth:

```text
OPTIONAL_LEAD_COLUMNS
OPTIONAL_CASE_COLUMNS
OPTIONAL_ACTIVITY_COLUMNS
```

The four fallback helpers now call one predicate instead of repeating direct column checks:

```text
insertLeadWithSchemaFallback
updateLeadWithSchemaFallback
insertCaseWithSchemaFallback
insertActivityWithSchemaFallback
```

## Why this matters

Before Stage03C, the fallback logic was still scattered:

```text
!OPTIONAL_LEAD_COLUMNS.has(missingColumn)
!OPTIONAL_CASE_COLUMNS.has(missingColumn)
!OPTIONAL_ACTIVITY_COLUMNS.has(missingColumn)
```

That is not catastrophic, but it is harder to audit and easier to copy incorrectly.

After Stage03C, there is one clear rule:

```text
Only drop a missing column if it belongs to the explicit allowlist for the target table and exists in the current payload.
```

## Do not change in this stage

- no UI changes,
- no Google Calendar behavior changes,
- no lead status/business workflow changes,
- no billing behavior changes,
- no database migration execution.

## Verification

Run:

```text
npm.cmd run check:stage03c-leads-fallback-boundary
node --test tests/stage03c-leads-fallback-boundary.test.cjs
npm.cmd run build
```

## Next Stage03D candidate

Add migration/readiness evidence for the columns still marked optional. The goal is to decide which columns are truly optional and which should become required before production release.
