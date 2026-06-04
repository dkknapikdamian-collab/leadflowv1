# STAGE220A40C - Sales funnel addendum

## Routing

- project: CloseFlow / LeadFlow
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- Obsidian folder: DO_POTWIERDZENIA

## User decision saved

Add `Lejek sprzedaży` to the product/value roadmap.

## Product decision

Sales funnel is a good option, but CloseFlow should not copy a generic CRM pipeline board.

The funnel must be tied to the existing CloseFlow direction:

- contact cadence grid,
- stale lead rescue,
- next action required,
- owner digest,
- finance/money-at-risk watchlist,
- product-to-service setup/playbooks.

## Why it matters

A sales funnel is expected in CRM tools, so missing it weakens credibility. But a plain drag-and-drop board is not enough to beat cheap CRMs.

CloseFlow's angle:

> Funnel is not just where the lead sits. Funnel shows where the lead is stuck, how long since contact, what next action is missing, and what money could be lost.

## Proposed stage

`STAGE220A46_SALES_FUNNEL_MOVEMENT_VIEW`

## Scope

### A. Funnel stages

Starter stages should be simple and configurable:

- `Nowy lead`,
- `Kontakt nawiązany`,
- `W rozmowie`,
- `Oferta / decyzja`,
- `Wygrany`,
- `Przegrany`,
- `Uśpiony / do odzyskania`.

Vertical playbooks can rename or extend them later.

### B. Funnel row/card data

Every lead/deal card should show:

- lead/client name,
- source,
- value or estimated value,
- last contact age,
- next action,
- status risk,
- assigned owner,
- linked case if already converted,
- quick action.

### C. Movement rules

Funnel should highlight:

- no next action,
- contact gap over threshold,
- lead stuck in stage too long,
- lead moved backward,
- stale stage with no activity,
- high-value lead without owner action.

### D. Actions

From a funnel card operator should be able to:

- add follow-up,
- create reminder,
- mark contacted,
- move stage,
- convert to client/case,
- mark lost with reason,
- put into `Do odzyskania`,
- open detail page.

### E. Digest integration

Morning digest and weekly owner report should include funnel sections:

- `Leady bez kolejnego kroku`,
- `Leady stojące 7+ dni`,
- `Leady do odzyskania`,
- `Największe szanse`,
- `Wysoka wartość bez ruchu`,
- `Wygrane/przegrane w tym tygodniu`.

### F. Product-to-service angle

The app opens the door to paid service:

- funnel setup,
- stage cleanup,
- lost-lead rescue,
- monthly funnel review,
- custom funnel per business type,
- migration/import of old pipeline data.

## Acceptance test

- Create 5 leads in different stages.
- Add last-contact dates: today, 3 days, 7 days, 14 days.
- One lead has no next action.
- One high-value lead is stale.
- Funnel shows stage columns.
- Cards show contact-age labels.
- Stale/high-risk cards are clearly visible.
- `Odezwij się`, `Utwórz zadanie`, `Przenieś etap`, `Oznacz jako przegrany` actions exist.
- Morning digest includes the same funnel risks.

## Recommended place in roadmap

Updated order:

1. `STAGE220A35_PRODUCTION_READINESS_AUDIT`
2. `STAGE220A41_CONTACT_CADENCE_GRID_AND_REMINDER_ENGINE`
3. `STAGE220A46_SALES_FUNNEL_MOVEMENT_VIEW`
4. `STAGE220A36_AI_DRAFTS_AND_MANUAL_DRAFTS_REBUILD`
5. `STAGE220A42_LOST_LEAD_RESCUE_AND_STALE_PIPELINE`
6. `STAGE220A44_OWNER_DIGEST_AND_WEEKLY_REPORT`
7. `STAGE220A45_FINANCE_WATCHLIST_AND_PAYMENT_REMINDERS`
8. `STAGE220A43_VERTICAL_PLAYBOOK_TEMPLATES`
9. `STAGE220A38_AUTH_BILLING_PLAN_E2E`
10. `STAGE220A39_AUTOMATED_PRODUCTION_SMOKE_AND_BETA_GATE`

## What not to build

Do not build a heavy CRM clone with many configurable boards first.

V1 should be:

- one simple funnel,
- clear cards,
- contact age,
- next action,
- stuck-risk logic,
- digest integration.

## Summary

Sales funnel is added as a strong product layer, but the differentiator is not the board itself. The differentiator is movement intelligence: contact age, missing next action, stale stage and owner summary.
