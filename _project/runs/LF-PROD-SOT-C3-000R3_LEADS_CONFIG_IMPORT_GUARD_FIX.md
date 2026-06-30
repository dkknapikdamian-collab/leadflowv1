# LF-PROD-SOT-C3-000R3_LEADS_CONFIG_IMPORT_GUARD_FIX

Date: 2026-06-30 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

Status: LOCAL_PATCH_APPLIED / GUARD_RERUN_REQUIRED

## Trigger

Local guard failed:

guard:config:status-source-of-truth

Failure:

src/pages/Leads.tsx config import missing: ../lib/config/

## Root cause

Leads.tsx imported lead status labels/options/tone directly from source-of-truth/lead-options.
The guard requires active pages to consume status config through ../lib/config/.

## Change

Changed only:

src/pages/Leads.tsx

Import split:

- LEAD_SOURCE_OPTIONS and getLeadSourceLabel stay in source-of-truth/lead-options.
- LEAD_STATUS_OPTIONS, getLeadStatusLabel and getLeadStatusTone move to ../lib/config/lead-status.

## Not touched

runtime logic
UI layout
CSS
SQL
Supabase
API
auth
routes
Google Calendar runtime
status-repository.ts
legacy aliases

## Required checks

git diff --check
git status --short --branch
npm run guard:routes:canonical
npm run guard:ui:patch-layers
npm run guard:config:status-source-of-truth
npm run check:polish-mojibake
npm run check:repo-backup-hygiene
