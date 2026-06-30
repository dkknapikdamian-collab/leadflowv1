# LF-PROD-SOT-C3-001A_STATUS_MAP_ONLY

Status: MAP_DELIVERED_REMOTE / NO_RUNTIME_CHANGE / LOCAL_GIT_CHECK_PENDING

Date: 2026-06-30 14:32 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

This is a status-map-only report. It documents current status owners, duplicates and risk areas. It does not implement status-repository and does not rewire runtime.

## PROJECT_SCAN

Read mode: targeted status scan.

Files read:
- AGENTS.md
- package.json
- src/App.tsx
- src/lib/routes.ts
- src/components/Layout.tsx
- src/lib/domain-statuses.ts
- src/lib/source-of-truth/lead-options.ts
- src/lib/source-of-truth/case-options.ts
- src/lib/source-of-truth/client-options.ts
- src/lib/source-of-truth/schedule-options.ts
- src/lib/options.ts
- src/lib/data-contract.ts
- src/lib/finance/finance-types.ts
- src/lib/finance/finance-normalize.ts
- src/lib/clients.ts
- src/lib/calendar-items.ts
- src/lib/supabase-fallback.ts
- src/pages/Leads.tsx
- src/pages/Cases.tsx
- src/pages/TasksStable.tsx
- src/pages/Templates.tsx
- src/pages/ResponseTemplates.tsx
- api/leads.ts
- api/cases.ts
- api/system.ts

## STATUS_MAP

Lead entity status:
- Owner now: src/lib/domain-statuses.ts plus src/lib/source-of-truth/lead-options.ts.
- Values: new, contacted, qualification, proposal_sent, waiting_response, negotiation, accepted, won, lost, moved_to_service, archived.
- Legacy aliases: follow_up, follow_up_needed, waiting_for_reply, waiting_reply, accepted_waiting_start, active_service, service, closed_won, closed_lost.
- Related local states: leadVisibility, salesOutcome, isAtRisk, movedToServiceAt, linkedCaseId, caseStartedAt.
- Risk: HIGH. leadVisibility and salesOutcome are not the same domain as lead status.

Client state:
- Owner now: src/lib/source-of-truth/client-options.ts and src/lib/clients.ts.
- No single DB status found.
- Derived values: ClientHealthValue, ClientSourceValue, PortalStatusValue, archivedAt.
- Risk: MEDIUM/HIGH. These are derived classifications or lifecycle markers, not one client status.

Case entity status:
- Owner now: src/lib/domain-statuses.ts plus src/lib/source-of-truth/case-options.ts.
- Values: new, waiting_on_client, blocked, to_approve, ready_to_start, in_progress, on_hold, completed, canceled, archived.
- Legacy aliases: unstarted, collecting_materials, waiting_for_client, waiting_client, to_verify, closed, done, cancelled.
- Local UI filters: open, closed, all, waiting, blocked, approval, ready, needs_next_step, linked.
- Risk: HIGH. CaseView and lifecycle buckets are UI/filter state, not DB status.

Case item and blocker state:
- Portal item values: missing, requested, submitted, to_verify, needs_changes, approved, rejected, completed, not_applicable, canceled.
- Local case item values: missing, uploaded, submitted, accepted, approved, rejected, sent, completed.
- Task/blocker exception: missing/block values are preserved in task normalization and must stay separated from generic task status.
- Risk: CRITICAL.

Task status:
- Owner now: src/lib/domain-statuses.ts.
- Values: todo, scheduled, in_progress, done, canceled, deleted.
- Legacy aliases: completed, cancelled, postponed, overdue.
- UI aliases/scopes/groups: open, completed, cancelled, archived, active, today, overdue, done, high, unlinked, upcoming, no_due.
- Risk: HIGH/CRITICAL. UI scopes and grouping are not task status.

Event status:
- Owner now: src/lib/domain-statuses.ts.
- Values: scheduled, in_progress, done, canceled, deleted.
- Legacy aliases: completed, cancelled.
- UI aliases: planned, open, completed, cancelled.
- Risk: HIGH. Event lifecycle must stay separate from calendar sync.

Calendar and Google Calendar:
- Owner now: src/lib/calendar-items.ts plus Google calendar handlers.
- Calendar consumes task/event status and has separate visibility rules.
- Sync state includes connected, scanned, created, updated, deleted, conflicts.
- Risk: CRITICAL. Calendar visibility and external sync are separate domains.

Payment, billing, commission:
- Billing/access values are mixed in src/lib/domain-statuses.ts.
- Payment values live in src/lib/finance/finance-types.ts: planned, due, paid, cancelled.
- Commission mode/base/status live in finance-types and API/data-contract normalizers.
- Risk: CRITICAL. Access, payment, billing and commission must be split before centralization.

Owner Control:
- Owner now: src/lib/owner-control/owner-risk-rules.ts.
- Values are severity/badge keys, not entity statuses.
- Risk: HIGH if mixed into entity status.

Activity:
- Owner now: data contract and activity handlers.
- Uses actorType/eventType/payload taxonomy, not generic status.

Templates and ResponseTemplates:
- No generic status found.
- Lifecycle/content metadata uses archivedAt, isArchived, includeArchived, category, tags and variables.

## DUPLICATE_STATUS_MAP

- Lead: duplicated across domain-statuses, lead-options, API, data contract and page logic. Keep entity status separate from visibility and outcome.
- Case: duplicated across domain-statuses, case-options, API, data contract and page filters. Keep CaseView/lifecycle buckets separate.
- Case item / portal item: two overlapping value sets exist. Requires decision before merge.
- Task: duplicated across domain-statuses, schedule-options, TasksStable, data contract and API client helpers. Missing/blocker and UI grouping must stay separate.
- Event: duplicated across domain-statuses, schedule-options and calendar projection. Calendar sync is separate.
- Finance: billing/access/payment/commission are mixed across several files. Split first.
- Client: health/source/portal are derived, not DB status.
- Templates: archive state is lifecycle metadata, not entity status.

## STATUS_OWNER_DECISION_TABLE

| Domain | Current owner | Proposed owner | Centralize next? | Decision needed |
|---|---|---|---:|---:|
| Lead entity status | domain-statuses + lead-options | status repository candidate | YES | YES |
| Lead visibility/outcome | Leads + data contract | visibility/outcome domains | NO | YES |
| Client health/source/portal | client-options | derived client classification | NO | NO |
| Case entity status | domain-statuses + case-options | status repository candidate | YES | YES |
| Case filters/lifecycle | Cases page + lifecycle helper | local UI/lifecycle | NO | YES |
| Case item/portal item | domain-statuses + case-options | checklist/portal domain | MAYBE | YES |
| Task/Event entity status | domain-statuses | status repository candidate | MAYBE | YES |
| Calendar sync/visibility | calendar-items + handlers | calendar/sync domain | NO | YES |
| Payment/commission/billing | finance + domain-statuses + APIs | finance/access domains | YES, split first | YES |
| Owner risk badges | owner-risk-rules | owner-control domain | NO | NO |
| Activity taxonomy | activity/data contract | activity domain | NO | NO |
| Templates archive | template pages/handlers | template lifecycle | NO | NO |

## HIGH_RISK list

1. Lead status must not be merged with leadVisibility or salesOutcome.
2. Task status must not be merged with UI scopes, groups or blocker semantics.
3. Event status must not be merged with Calendar or Google sync state.
4. Billing/access must not be merged with payment or commission.
5. UI filters must not become DB statuses.
6. Legacy aliases must not be removed without data audit.

## DECISION_NEEDED list

1. Approve domain split: entity status, visibility, finance, UI filters, risk badges.
2. Decide whether Lead and Case status move first.
3. Decide whether Task/Event wait until blocker/calendar semantics are split.
4. Decide whether finance gets a separate repository.
5. Decide whether legacy aliases stay permanent or migration-only.

## Recommendation

Recommended next stage:

LF-PROD-SOT-C3-001B_STATUS_REPOSITORY_DECISION

Alternative if local grep/check finds missing areas:

LF-PROD-SOT-C3-001A_R2_STATUS_MAP_COMPLETION

## Local check still required

Run locally:

git diff --check
git status --short --branch

If clean: MAP_DELIVERED / NO_RUNTIME_CHANGE / READY_FOR_001B_DECISION.
If not clean: STOP / BLOCKED_LOCAL_CHECK_FAILED.
