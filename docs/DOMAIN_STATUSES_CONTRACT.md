# A20 - domain statuses contract

## Source of truth

The only source of truth for product statuses is:

- `src/lib/domain-statuses.ts`

Supabase schema and backend API use this contract. UI copy is derived from this file and must not create a second status dictionary.

## Canonical statuses

### LeadStatus

- `new`
- `contacted`
- `qualification`
- `proposal_sent`
- `waiting_response`
- `negotiation`
- `accepted`
- `won`
- `lost`
- `moved_to_service`
- `archived`

### CaseStatus

- `new`
- `waiting_on_client`
- `blocked`
- `to_approve`
- `ready_to_start`
- `in_progress`
- `on_hold`
- `completed`
- `canceled`
- `archived`

### TaskStatus

- `todo`
- `scheduled`
- `in_progress`
- `done`
- `canceled`

### EventStatus

- `scheduled`
- `in_progress`
- `done`
- `canceled`

### PortalItemStatus

- `missing`
- `requested`
- `submitted`
- `to_verify`
- `needs_changes`
- `approved`
- `rejected`
- `completed`
- `not_applicable`
- `canceled`

### AiDraftStatus

- `draft`
- `pending`
- `confirmed`
- `converted`
- `canceled`
- `failed`

### BillingStatus

BillingStatus covers workspace access and payment-like operational records:

- `trial_active`
- `trial_ending`
- `trial_expired`
- `free_active`
- `paid_active`
- `payment_failed`
- `past_due`
- `inactive`
- `workspace_missing`
- `not_applicable`
- `not_started`
- `awaiting_payment`
- `deposit_paid`
- `partially_paid`
- `fully_paid`
- `commission_pending`
- `commission_due`
- `paid`
- `refunded`
- `written_off`
- `canceled`

## Legacy mapping

Legacy names are accepted only through normalizers and DB migration repair. New UI/API writes canonical values only.

Examples:

- lead `follow_up`, `follow_up_needed`, `waiting_for_reply` -> `waiting_response`
- lead `active_service` -> `moved_to_service`
- case `waiting_for_client` -> `waiting_on_client`
- case `done`, `closed` -> `completed`
- task/event `completed` -> `done`
- `cancelled` -> `canceled`
- portal item `uploaded` -> `submitted`
- portal item `accepted` -> `approved`

## Firebase blueprint

`firebase-blueprint.json` is legacy only. The archived copy can stay in `docs/legacy/firebase-blueprint.legacy.json`, but product contracts must use Supabase + `src/lib/domain-statuses.ts`.