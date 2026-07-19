# LF-PROD-SOT-G15-R5 — CI lint cross-platform entry repair

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
PASS_CI_LINT_CROSS_PLATFORM_ENTRY_REPAIR

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
a1388fd76a3b715bb1b05b38aa0f236e5e7ee384

BRANCH:
g15-r5-ci-lint-cross-platform-entry

## Root cause

The Linux GitHub Actions runner executed `npm run lint`, but the configured lint chain starts and ends nested npm calls with Windows-specific `npm.cmd`. The shell could not start that executable on Ubuntu, so CI stopped at the Lint step before Build and Test.

## Repair

- add `scripts/run-lint-cross-platform.cjs`;
- read the existing lint chain from `package.json` without duplicating it;
- use `npm.cmd` on Windows and replace every `npm.cmd` token with `npm` on non-Windows systems;
- preserve child exit status, environment and complete lint chain;
- route only the GitHub Actions Lint step through the portable wrapper;
- provide an explicit dry-run proof that validates normalization without suppressing the real lint execution;
- leave runtime, package dependencies, SQL, schema, RLS and Google behavior unchanged.

RUNTIME_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
TASK_DELETE_CHANGED: NO
EVENT_DELETE_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_APPLICABLE

## Verification evidence

PORTABILITY_WORKFLOW_RUN_ID: 29691990825
PORTABILITY_WORKFLOW_JOB_ID: 88206242274
PORTABILITY_STATIC_TESTS: 7 PASS / 0 FAIL
UBUNTU_DRY_RUN_WRAPPER: PASS
PORTABLE_NPM_EXECUTABLE_ON_LINUX: npm
WINDOWS_ONLY_NPM_CMD_AFTER_NORMALIZATION: NO
STANDARD_CI_WRAPPER_EXECUTED: YES
STANDARD_CI_REAL_LINT_CHAIN_RESULT: NONZERO_NEXT_FAILURE_NOT_RESOLVED
NEXT_REAL_LINT_FAILURE: INSUFFICIENT_EVIDENCE_FROM_AVAILABLE_TRUNCATED_LOG
G15_R4_REGRESSION: PASS
G15_R3_R1_REGRESSION: PASS
VERCEL_2_CLOSEFLOW: SUCCESS
VERCEL_CLOSEDOCKAPP: SUCCESS

## Acceptance

- cross-platform lint entry transformation on Ubuntu: PASS;
- dedicated static tests: 7 PASS / 0 FAIL;
- CI uses the wrapper instead of invoking the Windows-only entry directly: PASS;
- wrapper preserves and executes the actual lint chain: PASS;
- any later non-zero lint guard remains visible and is not converted to PASS: PASS;
- both deployment checks: SUCCESS;
- no runtime file changes: PASS.

PASS semantics: this stage closes only the cross-platform CI entry defect. The next non-zero command inside the historical lint chain is a separate blocker. Its identity is not guessed without a complete log tail.

NEXT_AFTER_PASS:
IDENTIFY_AND_REPAIR_NEXT_REAL_LINT_CHAIN_FAILURE
