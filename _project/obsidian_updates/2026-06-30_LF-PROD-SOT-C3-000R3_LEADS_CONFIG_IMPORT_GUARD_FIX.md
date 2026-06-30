# Obsidian update payload â€” LF-PROD-SOT-C3-000R3_LEADS_CONFIG_IMPORT_GUARD_FIX

Date: 2026-06-30 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

Stage: LF-PROD-SOT-C3-000R3_LEADS_CONFIG_IMPORT_GUARD_FIX
Status: LOCAL_PATCH_APPLIED / GUARD_RERUN_REQUIRED

Entry:

Local guard failed on Leads.tsx because the config status guard requires active pages to import status config through ../lib/config/.
Patch changes Leads.tsx so lead source metadata stays in source-of-truth/lead-options, while lead status options/labels/tone come from ../lib/config/lead-status.

Not touched: runtime logic, UI layout, CSS, SQL, Supabase, API, auth, routes, Google Calendar runtime, status-repository.ts, legacy aliases.

If all local checks pass:
LOCAL_CHECK_PASS / READY_FOR_001C_DESIGN_ONLY

If another guard fails:
STOP / BLOCKED_BY_NEXT_LOCAL_GUARD_FAILURE
