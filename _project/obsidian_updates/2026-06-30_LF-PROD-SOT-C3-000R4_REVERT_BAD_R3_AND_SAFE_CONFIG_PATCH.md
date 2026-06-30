# Obsidian update payload — LF-PROD-SOT-C3-000R4_REVERT_BAD_R3_AND_SAFE_CONFIG_PATCH

Date: 2026-06-30 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

Stage: LF-PROD-SOT-C3-000R4_REVERT_BAD_R3_AND_SAFE_CONFIG_PATCH
Status: SAFE_REPAIR_APPLIED / GUARDS_REQUIRED_BEFORE_PUSH

Entry:
Previous R3 local package was unsafe: it committed after a red guard and corrupted Leads.tsx encoding.
R4 repairs this by reverting the bad R3 commit without force push, then applying a UTF-8-safe patch.

Patch:
- Leads page imports lead status options, labels and tone from ../lib/config/lead-status.
- options.ts exports lead status options from ./config/lead-status.

Not touched:
runtime logic, UI layout, CSS, SQL, Supabase, API, auth, routes, Google Calendar runtime, status-repository.ts, legacy aliases.

Close condition:
all local checks pass and repair is pushed to dev-rollout-freeze.
