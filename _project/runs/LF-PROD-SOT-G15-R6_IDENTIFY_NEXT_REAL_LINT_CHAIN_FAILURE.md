# LF-PROD-SOT-G15-R6 — Identify next real lint-chain failure

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
PASS_FIRST_REAL_LINT_CHAIN_FAILURE_IDENTIFIED

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
fe48efc197b92fb2ab6d23999a50076b4f279c11

BRANCH:
g15-r6-identify-first-lint-failure

## Result

COMMANDS_TOTAL: 27
COMMANDS_PASSED_BEFORE_FAILURE: 0
FIRST_NONZERO_INDEX: 1
FIRST_NONZERO_COMMAND: npm run check:lead-detail-feedback-p1
FIRST_NONZERO_EXIT_CODE: 1
FAILURE_CLASSIFICATION: HISTORICAL_STALE_GUARD_CONFLICT
AFFECTED_PRIMARY_FILE: scripts/check-lead-detail-feedback-p1-2026-05-13.cjs
SUPERSEDING_GUARD: scripts/check-stage78-lead-detail-no-static-ai-followup-card.cjs
WORKFLOW_RUN_ID: 29693249289
WORKFLOW_JOB_ID: 88209560889
FULL_LOG_ARTIFACT: g15-r6-lint-diagnostic-e28effc8e439f688fd9d05c3449d0fc78d3f6d86
DIAGNOSTIC_RUNNER_TESTS: 8 PASS / 0 FAIL
SUPERSEDING_STAGE78_GUARD_AND_TEST: PASS

## First failure

```text
> closeflow@0.0.0 check:lead-detail-feedback-p1
> node scripts/check-lead-detail-feedback-p1-2026-05-13.cjs

FAIL check:lead-detail-feedback-p1: LeadDetail nie renderuje bezpiecznego szkicu follow-up draft-only.
```

## Classification evidence

The failing P1 guard requires `LeadDetail.tsx` to contain `<LeadAiFollowupDraft`.

The later Stage78 guard explicitly forbids both the import and JSX rendering of `LeadAiFollowupDraft` in `LeadDetail.tsx`. Stage78 states that the static right-rail usage is removed while the reusable draft component and AI draft engine remain available. The Stage78 guard and its regression test pass in the same clean checkout.

Current runtime evidence is aligned with Stage78:

- `LeadDetail.tsx` does not import or render the static AI follow-up card;
- `LeadAiFollowupDraft.tsx` still exists;
- the component says AI sends nothing automatically and exposes only draft generation, editing and copy;
- the AI draft engine remains present;
- no runtime repair is required by G15-R6.

Therefore the first lint failure is a historical guard that encodes a superseded UI expectation, not a current product regression.

## Diagnostic design

- parse `scripts.lint` from `package.json` without duplicating the chain;
- preserve command order and quoted `&&` content;
- normalize `npm.cmd` to `npm` only on non-Windows platforms;
- execute one command at a time;
- stop at the first non-zero exit code;
- save complete per-command logs, `diagnostic.json` and `diagnostic.txt`;
- upload the full diagnostic directory as a GitHub Actions artifact;
- publish bounded evidence to PR #17.

RUNTIME_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
TASK_DELETE_CHANGED: NO
EVENT_DELETE_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED
CI_FAILURE_HIDDEN: NO
PRODUCT_REPAIR_IMPLEMENTED_IN_G15_R6: NO

## Acceptance

- diagnostic runner tests: 8 PASS / 0 FAIL;
- original lint order preserved: PASS;
- exact first non-zero command identified: PASS;
- original exit code captured: PASS;
- prior command count recorded: PASS;
- full log artifact uploaded: PASS;
- superseding Stage78 guard and test: PASS;
- cause classified from evidence: PASS;
- one narrow next repair stage proposed: PASS;
- no product repair implemented: PASS.

PROPOSED_NEXT_STAGE:
LF-PROD-SOT-G15-R7_STALE_LEAD_DETAIL_FEEDBACK_P1_GUARD_RECONCILIATION

PROPOSED_R7_SCOPE:
Reconcile only the stale P1 guard with the later Stage78 source of truth. Preserve shared activity-timeline checks and noisy-card removal checks; replace the obsolete requirement to render `<LeadAiFollowupDraft` with assertions that LeadDetail does not render the static card while the reusable draft-only component and AI engine remain intact. Then rerun the sequential lint diagnostic to expose the next real blocker.
