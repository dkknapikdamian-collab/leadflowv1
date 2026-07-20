# LF-PROD-SOT-G15-R20 — Client inline edit and task edit guard reconciliation

TIMESTAMP:
2026-07-20 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_CI

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
a4770b1333b353074b0f01020a26fb1cd97dfdbf

## Classification

FAILURE_CLASSIFICATION:
HISTORICAL_STALE_CLIENT_CONTACT_COPY_AND_EDIT_LABEL_GUARD

The guard still expected the historical literal labels `Zapisz` / `Edytuj` and `Kopiuj telefon` / `Kopiuj email`. Current ClientDetail uses visible labels `Zapisz dane` / `Edytuj dane`, shared `ClientMultiContactField` editors, a working `copyValue` helper and separate phone/e-mail copy handlers. The duplicated Kontakt tab remains intentionally absent.

Tasks and `topic-contact` still preserve client relations in add/edit flows. Restoring old button copy or a duplicated contact tab would not improve the product and could regress the current ClientDetail source of truth.

## Repair

- keep task add/edit clientId persistence checks;
- keep task status and relation-picker checks;
- keep topic-contact client resolution checks;
- replace historical ClientDetail label literals with current visible labels;
- assert current multi-contact phone/e-mail editor;
- assert actual clipboard helper and phone/e-mail handlers;
- retain duplicate Kontakt-tab rejection;
- add focused executable tests and Ubuntu production-build verification.

## Scope

MUTATED_FILES:
- scripts/check-client-inline-edit-and-task-edit.cjs
- tests/lf-prod-sot-g15-r20-client-inline-edit-task-edit-guard.test.cjs
- .github/workflows/g15-r20-client-inline-edit-task-edit-guard.yml
- this report

PRODUCT_RUNTIME_CHANGED: NO
CLIENT_DETAIL_TSX_CHANGED: NO
TASKS_TSX_CHANGED: NO
TOPIC_CONTACT_TS_CHANGED: NO
CSS_CHANGED: NO
PACKAGE_JSON_CHANGED: NO
DEPENDENCIES_CHANGED: NO
SQL_OR_MIGRATIONS_CHANGED: NO
EVENT_DELETE_CHANGED: NO
TASK_DELETE_CHANGED: NO
REMOTE_GOOGLE_CHANGED: NO
MANUAL_SMOKE: NOT_EXECUTED_DEFERRED_BY_OWNER

## Verification pending

FOCUSED_G15_R20_TESTS:
PENDING_CI

RECONCILED_R20_GUARD:
PENDING_CI

PRODUCTION_BUILD:
PENDING_CI

NEXT_FIRST_NONZERO_COMMAND:
PENDING_DIAGNOSTIC

VERCEL_EXACT_SHA:
PENDING_CHECK

RESULT:
IMPLEMENTED_AWAITING_CI
