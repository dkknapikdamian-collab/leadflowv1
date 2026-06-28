# LF-UI-SOT-001 local verify results

Date: 2026-06-28 00:55 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE:
TECHNICAL_GUARDS_PASS / BUILD_PASS / RELEASE_VERIFY_BLOCKED_BY_UNRELATED_LOCAL_CHANGES / MANUAL_SMOKE_PENDING / FULL_ALIAS_POLICY_PENDING

## Local verification confirmed by Damian log

PASS:
- git pull --ff-only origin dev-rollout-freeze
- npm run guard:routes:canonical
- node scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs
- node --test tests/routes-canonical.test.cjs tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs
- npm run build
- git diff --check: no whitespace errors, only LF to CRLF warnings for src/lib/cases.ts and src/lib/options.ts

Not full PASS:
- npm run verify:closeflow:quiet

Reason:
- CF-RUNTIME-00 stopped on unrelated local modified files outside LF-UI-SOT-001 scope.
- Local app workspace still has many modified files not created by this closeout.
- Do not push all local modified files as one commit.

## Out-of-scope local dirty files noted by verify

- scripts/check-a24-lead-to-case-flow.cjs
- scripts/check-fin15-lead-finance-ghosts.cjs
- src/lib/cases.ts
- src/lib/options.ts
- tests/fin15-lead-finance-ghosts.test.cjs
- tests/lead-service-mode-v1.test.cjs
- tests/lead-start-service-case-redirect.test.cjs

## Decision

Core routing closeout is technically green for LF-UI-SOT-001.
Full stage close remains pending because:
- manual browser smoke is not confirmed yet,
- full alias policy is still pending,
- release verify is blocked by unrelated local dirty workspace.

## Manual smoke still required

- /cases
- /cases/:caseId
- /case/:caseId should replace redirect to /cases/:caseId
- /leads
- /leads/:leadId
- lead-to-case handoff, if available
- /
- /today
- /calendar
- /funnel

## Next safe action

Run a separate dirty-worktree segregation stage before pushing any of the local modified runtime/test files.
