# CloseFlow - Stage03D Optional Columns Evidence Gate

**Date:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Scope:** fallback evidence/readiness gate, no runtime behavior changes.

## Goal

Stage03D turns the Stage03B/Stage03C fallback cleanup into an auditable evidence gate.

This stage does **not** claim that every optional column is already present in production Supabase. It documents the opposite where needed: the fallback is allowed only until migration evidence exists.

## Current rule

Every column that remains in these fallback sets must be listed in this document:

```text
OPTIONAL_LEAD_COLUMNS
OPTIONAL_CASE_COLUMNS
OPTIONAL_ACTIVITY_COLUMNS
```

The evidence row must include:

```text
table
column
status
reason
```

## Status vocabulary

Allowed status values:

```text
fallback_allowed_pending_migration_evidence
migration_evidence_required_before_required
ready_to_remove_fallback
```

Current Stage03D default is conservative:

```text
fallback_allowed_pending_migration_evidence
```

That means the fallback is allowed for compatibility, but the column must not be treated as production-required until a separate migration/readiness step proves it.

## DO NOT PROMOTE WITHOUT EVIDENCE

Do not remove a column from fallback or promote it to required until one of these exists:

1. a Supabase migration file that clearly creates/adds the column,
2. a production schema evidence report,
3. a release evidence file referencing the migration and deployment state.

## Evidence matrix

| table | column | status | reason |
|---|---|---|---|
| leads | `is_at_risk` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `partial_payments` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `summary` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `notes` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `priority` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `next_action_title` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `next_action_at` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `next_action_item_id` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `linked_case_id` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `client_id` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `service_profile_id` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `accepted_at` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `case_eligible_at` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `case_started_at` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `billing_status` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `billing_model_snapshot` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `start_rule_snapshot` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `win_rule_snapshot` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `closed_at` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `moved_to_service_at` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `lead_visibility` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `sales_outcome` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `currency` | fallback_allowed_pending_migration_evidence | Lead financial contract now carries currency, but migration rollout evidence is still required before making it hard-required in every environment. |
| leads | `google_calendar_id` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `google_calendar_event_id` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `google_calendar_event_etag` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `google_calendar_html_link` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `google_calendar_synced_at` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `google_calendar_sync_status` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| leads | `google_calendar_sync_error` | fallback_allowed_pending_migration_evidence | Lead fields are used by current API/UI/Google Calendar flows, but production schema evidence is not locked in this stage. |
| cases | `service_profile_id` | fallback_allowed_pending_migration_evidence | Case fields are used during lead-to-case handoff, but production schema evidence is not locked in this stage. |
| cases | `billing_status` | fallback_allowed_pending_migration_evidence | Case fields are used during lead-to-case handoff, but production schema evidence is not locked in this stage. |
| cases | `billing_model_snapshot` | fallback_allowed_pending_migration_evidence | Case fields are used during lead-to-case handoff, but production schema evidence is not locked in this stage. |
| cases | `started_at` | fallback_allowed_pending_migration_evidence | Case fields are used during lead-to-case handoff, but production schema evidence is not locked in this stage. |
| cases | `completed_at` | fallback_allowed_pending_migration_evidence | Case fields are used during lead-to-case handoff, but production schema evidence is not locked in this stage. |
| cases | `last_activity_at` | fallback_allowed_pending_migration_evidence | Case fields are used during lead-to-case handoff, but production schema evidence is not locked in this stage. |
| cases | `created_from_lead` | fallback_allowed_pending_migration_evidence | Case fields are used during lead-to-case handoff, but production schema evidence is not locked in this stage. |
| cases | `service_started_at` | fallback_allowed_pending_migration_evidence | Case fields are used during lead-to-case handoff, but production schema evidence is not locked in this stage. |
| cases | `expected_revenue` | fallback_allowed_pending_migration_evidence | Case financial baseline (potential revenue) is now part of runtime contract, but rollout evidence still controls when fallback can be removed. |
| cases | `paid_amount` | fallback_allowed_pending_migration_evidence | Case financial baseline (paid amount) is now part of runtime contract, but rollout evidence still controls when fallback can be removed. |
| cases | `currency` | fallback_allowed_pending_migration_evidence | Case financial baseline (currency) is now part of runtime contract, but rollout evidence still controls when fallback can be removed. |
| activities | `owner_id` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `actor_id` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `actor_type` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `event_type` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `payload` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `lead_id` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `case_id` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `workspace_id` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `created_at` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |
| activities | `updated_at` | fallback_allowed_pending_migration_evidence | Activity fields are used for audit/history inserts, but production schema evidence is not locked in this stage. |

## Guard

Run:

```text
npm.cmd run check:stage03d-optional-columns-evidence
```

The guard extracts optional columns from `api/leads.ts` and verifies that every column appears in this document.

## What this prevents

This prevents silent drift between code and documentation. If a developer adds a new fallback column, they must also explain its evidence/readiness status.

## Next Stage03E candidate

Create a migration evidence report from actual Supabase SQL/migration files and move columns one by one from:

```text
fallback_allowed_pending_migration_evidence
```

to either:

```text
migration_evidence_required_before_required
```

or:

```text
ready_to_remove_fallback
```

Only after that should we remove fallback entries.
