# Stage228E — LeadDetail guard and color hotfix

Data: 2026-06-06 19:10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: local-only hotfix after Stage228D was pushed with failing guard.

## Problem

Stage228D was rebased and pushed even though `npm run verify:stage228d-lead-detail-real-fix` failed with:

`FAIL Stage228D: inner accordion content must not force white card background`

## Fix

- Added final Stage228E CSS override so the LeadDetail accordion keeps full section color in expanded content.
- Removed white inner surfaces from empty states and work rows inside the colored accordion.
- Repaired the Stage228D guard from brittle exact newline matching to semantic regex checks.
- Added Stage228E guard.

## Tests

- `npm run verify:stage228d-lead-detail-real-fix`
- `npm run verify:stage228e-lead-detail-guard-and-color-hotfix`
- `git diff --check`

## Risk audit

- The push already happened, so this must be committed as a follow-up hotfix, not amended with force push.
- This is CSS/guard scope only. It does not touch Supabase, lead model, CaseDetail, or payment logic.
- Manual UI test still required: LeadDetail accordion sections must look fully colored and the right rail must show Quick Actions instead of Powiązana sprawa.
