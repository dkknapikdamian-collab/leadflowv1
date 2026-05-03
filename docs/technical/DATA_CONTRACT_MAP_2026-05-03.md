# DATA CONTRACT MAP 2026-05-03

## Status

This is the canonical field and legacy alias map for CloseFlow core records.

The runtime source of truth is:

```text
src/lib/data-contract.ts
DATA_CONTRACT_FIELD_MAP
```

## Rule

New feature code should use canonical DTO fields.

Legacy aliases are allowed only inside normalizers and this map.

## Entities

```text
leads
clients
cases
tasks
events
ai_drafts
activities
workspaces
```

## Canonical DTO fields

### leads

| Canonical | Legacy aliases |
|---|---|
| workspaceId | workspace_id |
| clientId | client_id |
| linkedCaseId | linked_case_id, caseId, case_id |
| dealValue | deal_value, value, amount, estimatedValue, estimated_value |
| nextActionAt | next_action_at, nextStepDueAt, next_step_due_at |
| nextActionItemId | next_action_item_id |
| movedToServiceAt | moved_to_service_at, caseStartedAt, case_started_at |
| leadVisibility | lead_visibility |
| salesOutcome | sales_outcome |

### clients

| Canonical | Legacy aliases |
|---|---|
| workspaceId | workspace_id |
| name | fullName, full_name, clientName, client_name |
| company | companyName, company_name |
| sourcePrimary | source_primary, source |
| lastActivityAt | last_activity_at |
| archivedAt | archived_at |

### cases

| Canonical | Legacy aliases |
|---|---|
| workspaceId | workspace_id |
| clientId | client_id |
| leadId | lead_id |
| clientName | client_name |
| completenessPercent | completeness_percent, completionPercent, completion_percent |
| portalReady | portal_ready |
| startedAt | started_at, serviceStartedAt, service_started_at |

### tasks

| Canonical | Legacy aliases |
|---|---|
| workspaceId | workspace_id |
| scheduledAt | scheduled_at, dueAt, due_at, date, startAt, start_at |
| leadId | lead_id |
| caseId | case_id |
| clientId | client_id |
| leadName | lead_name |
| reminderAt | reminder_at, reminder |
| recurrenceRule | recurrence_rule, recurrence |

### events

| Canonical | Legacy aliases |
|---|---|
| workspaceId | workspace_id |
| startAt | start_at, scheduledAt, scheduled_at, date |
| endAt | end_at |
| leadId | lead_id |
| caseId | case_id |
| clientId | client_id |
| leadName | lead_name |
| reminderAt | reminder_at, reminder |
| recurrenceRule | recurrence_rule, recurrence |

### ai_drafts

| Canonical | Legacy aliases |
|---|---|
| workspaceId | workspace_id |
| rawText | raw_text, text |
| parsedDraft | parsed_draft |
| parsedData | parsed_data |
| linkedRecordId | linked_record_id |
| linkedRecordType | linked_record_type |
| confirmedAt | confirmed_at |
| convertedAt | converted_at |
| cancelledAt | cancelled_at |

### activities

| Canonical | Legacy aliases |
|---|---|
| workspaceId | workspace_id |
| caseId | case_id |
| leadId | lead_id |
| clientId | client_id |
| ownerId | owner_id |
| actorId | actor_id |
| actorType | actor_type |
| eventType | event_type |
| payload | data |

### workspaces

| Canonical | Legacy aliases |
|---|---|
| ownerId | owner_id, userId, user_id |
| planId | plan_id, plan |
| subscriptionStatus | subscription_status |
| accessStatus | access_status |
| trialEndsAt | trial_ends_at, trialEnds, trial_ends |
| createdAt | created_at |
| updatedAt | updated_at |

## Required normalizers

```text
normalizeLeadContract
normalizeClientContract
normalizeCaseContract
normalizeTaskContract
normalizeEventContract
normalizeAiDraftContract
normalizeActivityContract
normalizeWorkspaceContract
```

## Next

```text
FAZA 4 - Etap 4.2 - Normalizacja tasków i eventów
```
