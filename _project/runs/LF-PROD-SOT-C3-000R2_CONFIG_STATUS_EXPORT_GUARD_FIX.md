# LF-PROD-SOT-C3-000R2_CONFIG_STATUS_EXPORT_GUARD_FIX

Date: 2026-06-30 15:36 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

Status: REMOTE_FIX_PUSHED / LOCAL_RERUN_REQUIRED / NO_RUNTIME_LOGIC_CHANGE

## Trigger

Local check failed on npm run guard:config:status-source-of-truth.

Failure: calendar status config missing TASK_STATUS_LABELS.

## Root cause

src/lib/source-of-truth/schedule-options.ts already defines TASK_STATUS_LABELS and CALENDAR_EVENT_STATUS_LABELS, but src/lib/config/calendar-status.ts did not re-export them.

## Change

Changed only src/lib/config/calendar-status.ts.

Added exports:
- TASK_STATUS_LABELS
- CALENDAR_EVENT_STATUS_LABELS

Remote commit: 87e1109b3a090438405462fda184f7260db11c69

## Not touched

runtime logic, UI, CSS, SQL, Supabase, API, auth, routes, Google Calendar runtime, status-repository.ts, legacy aliases.

## Required local rerun

Run:

cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git pull --ff-only origin dev-rollout-freeze
git status --short --branch
git diff --check
npm run guard:routes:canonical
npm run guard:ui:patch-layers
npm run guard:config:status-source-of-truth
npm run check:polish-mojibake
npm run check:repo-backup-hygiene

If all pass: LOCAL_CHECK_PASS / READY_FOR_001C_DESIGN_ONLY.
If another guard fails: STOP / BLOCKED_BY_NEXT_LOCAL_GUARD_FAILURE.
