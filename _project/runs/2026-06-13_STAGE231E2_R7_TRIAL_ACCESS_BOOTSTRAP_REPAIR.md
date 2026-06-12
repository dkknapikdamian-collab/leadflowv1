# STAGE231E2_R7_TRIAL_ACCESS_BOOTSTRAP_REPAIR_FIX2

Date: 2026-06-13 Europe/Warsaw  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze

## Status
LOCAL_ONLY_PACKAGE.

## Why FIX2 exists
The first R7 package used a brittle exact text anchor in `api/me.ts`. The current branch contains the same logic with different line/format context, so the apply script failed before runtime changes. FIX2 uses safer anchors and idempotent checks.

## Problem
Manual screen showed:
- `PLAN: Trial`
- `DOSTÄP: Trial wygasĹ‚`
- no visible trial/access status card in sidebar

This is a product FAIL because a new/test account cannot be used to validate Google Calendar while access is expired.

## Change
- `api/me.ts`
  - adds `STAGE231E2_R7_TRIAL_ACCESS_BOOTSTRAP_REPAIR`;
  - repairs non-historical profile/identity trial bootstrap when trial status is active/ending but `trial_ends_at` is missing or past;
  - passes `workspaceResolutionMode` into `ensureWorkspace`;
  - does not silently reactivate `historical_mapping` or `explicit_fallback` workspaces.
- `src/components/Layout.tsx`
  - sidebar card now shows access status for active trial, expired trial, payment failure, canceled/inactive and paid active;
  - active trial still cannot render `Trial 0 dni`.
- `scripts/check-stage231e2-trial-14d-contract.cjs`
  - extended with R7 checks.
- `scripts/check-stage231e2-r7-trial-access-bootstrap-repair.cjs`
  - new dedicated guard.

## Tests to run
- node scripts/check-stage231e2-r7-trial-access-bootstrap-repair.cjs
- node scripts/check-stage231e2-trial-14d-contract.cjs
- node scripts/check-stage231e2-plan-entitlement-matrix.cjs
- node scripts/check-stage231e2-r4-trial-card-access-source.cjs
- node scripts/check-stage231e2-r2-trial-14d-lock.cjs
- node scripts/check-stage231e2-account-trial-bootstrap.cjs
- npm run build
- git diff --check

## Manual test
Create/login fresh test account and verify:
- Settings: Plan Trial + Access active trial, not expired;
- Sidebar: visible trial/access status;
- Billing: trial date about +14 days.

## Risk audit
- No SQL is included.
- Existing old/historical `trial_expired` workspaces are not reactivated silently.
- If the same user is actually linked to a historical expired workspace, the next step is a data decision/admin action, not silent code repair.