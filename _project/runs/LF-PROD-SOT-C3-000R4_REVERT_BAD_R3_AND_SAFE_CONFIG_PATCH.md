# LF-PROD-SOT-C3-000R4_REVERT_BAD_R3_AND_SAFE_CONFIG_PATCH

Date: 2026-06-30 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

Status: SAFE_REPAIR_APPLIED / GUARDS_REQUIRED_BEFORE_PUSH

## Trigger

Previous local autorun R3 was bad:
- it committed even after guard failure
- it rewrote src/pages/Leads.tsx with mojibake
- guard still failed on options lead status source

## Repair

This stage reverts the bad R3 commit without force push, then reapplies the status config routing safely with UTF-8.

Changed:
- src/pages/Leads.tsx
- src/lib/options.ts

## Scope

Not touched:
- runtime logic
- UI layout
- CSS
- SQL
- Supabase
- API
- auth
- routes
- Google Calendar runtime
- status-repository.ts
- legacy aliases

## Required checks

- git diff --check
- guard routes canonical
- guard ui patch layers
- guard config status source of truth
- polish mojibake check
- repo backup hygiene
