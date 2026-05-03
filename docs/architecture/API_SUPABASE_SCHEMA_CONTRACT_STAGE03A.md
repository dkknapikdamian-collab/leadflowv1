# CloseFlow â€” Stage03A API/Supabase schema contract map

**Date:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Scope:** API/Supabase schema contract hardening, no UI changes.

## Goal

Stage03A freezes the current API-to-Supabase contract before we remove the remaining runtime schema fallbacks.

This is not a visual stage. It does not add screens, menus, pricing copy, Google Calendar behavior, AI behavior, or lead workflow changes.

The aim is simple:

1. name the canonical JSON contract returned to the frontend,
2. name the canonical Supabase columns expected by API writes,
3. keep legacy aliases isolated in `src/lib/data-contract.ts`,
4. mark remaining runtime schema fallbacks as temporary Stage03B targets,
5. add a guard so future code does not silently spread fallback chaos into UI screens.

## Current source of truth

The frontend should consume normalized camelCase DTOs from `src/lib/data-contract.ts`.

The API should write stable snake_case Supabase columns.

The UI should not guess between `dueAt || scheduledAt || date`, `leadId || lead_id`, `startAt || start_at`, etc. Any compatibility mapping should live in contract helpers, not inside operator screens.

## Canonical JSON DTO contract

### LeadDto

Frontend field | Supabase source | Notes
---|---|---
`id` | `id` | Required identifier.
`workspaceId` | `workspace_id` | Workspace scope. Never trust body workspace for access.
`clientId` | `client_id` | Optional relation to client.
`linkedCaseId` | `linked_case_id` | Canonical lead to case link.
`name` | `name` | Display label.
`company` | `company` | Optional company label.
`email` | `email` | Optional contact email.
`phone` | `phone` | Optional contact phone.
`source` | `source` | Normalized source value.
`status` | `status` | Must go through `normalizeLeadStatus`.
`dealValue` | `value` | Canonical DB column is still `value`.
`priority` | `priority` | Normalized priority.
`createdAt` | `created_at` | ISO or null.
`updatedAt` | `updated_at` | ISO or null.
`movedToServiceAt` | `moved_to_service_at` | Historical handoff timestamp.
`nextActionAt` | `next_action_at` | Legacy next-action date, still used by current app and Google Calendar sync.
`nextActionItemId` | `next_action_item_id` | Optional link to planned action.
`leadVisibility` | `lead_visibility` | Active/archived visibility.
`salesOutcome` | `sales_outcome` | Open/won/lost/moved-to-service state.

### TaskDto

Frontend field | Supabase source | Notes
---|---|---
`id` | `id` | Required identifier.
`workspaceId` | `workspace_id` | Workspace scope.
`title` | `title` | Display title.
`status` | `status` | Must go through `normalizeTaskStatus`.
`type` | `record_type` or `task_type` | Canonical UI type is `type`.
`priority` | `priority` | Normalized priority.
`scheduledAt` | `scheduled_at` / `due_at` | Canonical frontend date for tasks.
`date` | derived from `scheduledAt` | UI helper only.
`leadId` | `lead_id` | Optional relation.
`caseId` | `case_id` | Optional relation.
`clientId` | `client_id` | Optional relation.
`reminderAt` | `reminder_at` | Reminder timestamp.
`recurrenceRule` | `recurrence_rule` | Recurrence contract.
`dueAt` | legacy alias of `scheduledAt` | Compatibility only. New code should use `scheduledAt`.

### EventDto

Frontend field | Supabase source | Notes
---|---|---
`id` | `id` | Required identifier.
`workspaceId` | `workspace_id` | Workspace scope.
`title` | `title` | Display title.
`type` | `record_type` or `event_type` | Canonical UI type is `type`.
`status` | `status` | Must go through `normalizeEventStatus`.
`startAt` | `start_at` / `scheduled_at` | Canonical frontend start date.
`endAt` | `end_at` | Optional end date.
`leadId` | `lead_id` | Optional relation.
`caseId` | `case_id` | Optional relation.
`clientId` | `client_id` | Optional relation.
`reminderAt` | `reminder_at` | Reminder timestamp.
`recurrenceRule` | `recurrence_rule` | Recurrence contract.
`scheduledAt` | legacy alias of `startAt` | Compatibility only. New code should use `startAt`.

### CaseDto

Frontend field | Supabase source | Notes
---|---|---
`id` | `id` | Required identifier.
`workspaceId` | `workspace_id` | Workspace scope.
`clientId` | `client_id` | Optional client link.
`leadId` | `lead_id` | Canonical source lead link.
`title` | `title` | Case title.
`clientName` | `client_name` | Display contact.
`status` | `status` | Must go through `normalizeCaseStatus`.
`completenessPercent` | `completeness_percent` | Integer 0-100.
`portalReady` | `portal_ready` | Boolean.
`startedAt` | `started_at` or `service_started_at` | Operational start timestamp.
`createdAt` | `created_at` | ISO or null.
`updatedAt` | `updated_at` | ISO or null.

### ActivityDto

Frontend field | Supabase source | Notes
---|---|---
`id` | `id` | Required identifier.
`workspaceId` | `workspace_id` | Workspace scope.
`caseId` | `case_id` | Optional case link.
`leadId` | `lead_id` | Optional lead link.
`clientId` | `client_id` | Optional client link.
`ownerId` | `owner_id` | Optional owner.
`actorId` | `actor_id` | Optional actor.
`actorType` | `actor_type` | Defaults to `operator`.
`eventType` | `event_type` | Canonical activity type.
`payload` | `payload` | JSON object.
`createdAt` | `created_at` | ISO or null.
`updatedAt` | `updated_at` | ISO or null.

## Canonical write-side API rules

1. API write payloads should use snake_case Supabase columns.
2. API responses should be normalized before returning to UI.
3. UI screens should consume camelCase DTOs.
4. `workspace_id` must come from request scope helpers, not from raw request body.
5. Legacy aliases are allowed only in normalizers or named migration/fallback helpers.
6. Missing-column fallbacks are temporary, must be named, and must be guarded.

## Temporary fallbacks that still exist after Stage03A

These are known debt, not a green light to copy the pattern.

### `api/leads.ts`

Currently keeps named fallbacks for optional columns:

- `insertLeadWithSchemaFallback`
- `updateLeadWithSchemaFallback`
- `insertCaseWithSchemaFallback`
- `insertActivityWithSchemaFallback`
- `OPTIONAL_LEAD_COLUMNS`
- `OPTIONAL_CASE_COLUMNS`
- `OPTIONAL_ACTIVITY_COLUMNS`

Reason: older Supabase schemas may not yet have every optional column used by the product.

Stage03B target: replace these fallbacks with explicit migration confirmation and one stable write contract.

### `api/system.ts`

Currently keeps generic safety wrappers:

- `safeInsert`
- `safeUpdateById`
- `safeUpdateWhere`

Reason: profile/workspace/admin recovery code still supports old profile/workspace shapes.

Stage03B target: make these wrappers narrower or move compatibility into explicit contract helpers.

## DO NOT after this stage

- Do not add new `body.workspaceId` based access decisions.
- Do not add new UI-level field guessing like `dueAt || scheduledAt || date`.
- Do not add silent missing-column fallbacks without a named helper and a guard.
- Do not create another data-contract helper in a random page component.
- Do not add schema migrations without updating this contract map or the Stage03B cleanup plan.

## Stage03B recommended scope

Next stage should start removing the worst fallback sources in this order:

1. profile/workspace generic `safeInsert` / `safeUpdate*` fallback in `api/system.ts`,
2. lead optional column fallback in `api/leads.ts`,
3. remaining direct alias guessing in operator pages,
4. migration guard proving required columns exist before production release.

## Verification

Run:

```text
npm.cmd run check:stage03a-api-schema-contract
node --test tests/stage03a-api-schema-contract.test.cjs
npm.cmd run build
```

Completion criterion: the app has a documented and guarded API/Supabase contract, and remaining fallback chaos is explicitly tracked instead of hidden.
