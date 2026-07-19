# LF-PROD-SOT-G15-R5 — CI lint cross-platform entry repair

TIMESTAMP:
2026-07-19 Europe/Warsaw

STATUS:
IMPLEMENTED_PENDING_STANDARD_CI_PROOF

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
- leave runtime, package dependencies, SQL, schema, RLS and Google behavior unchanged.

RUNTIME_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
TASK_DELETE_CHANGED: NO
EVENT_DELETE_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_APPLICABLE

## Acceptance

- dedicated static test: 6 PASS / 0 FAIL;
- Linux CI Lint starts the full configured lint chain instead of failing on `npm.cmd` lookup;
- standard CI reaches Build and Test or exposes the next real repository failure after lint entry;
- both Vercel deployments succeed;
- no runtime file changes.

PASS semantics: this stage closes only the cross-platform CI entry defect. Any later failure inside a real lint guard is separate evidence and must not be hidden.

NEXT_AFTER_PASS:
SELECT_NEXT_REAL_CI_OR_PRODUCT_BLOCKER_FROM_EVIDENCE
