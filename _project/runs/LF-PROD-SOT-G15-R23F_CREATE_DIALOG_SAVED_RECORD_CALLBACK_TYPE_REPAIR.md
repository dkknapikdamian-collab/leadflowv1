# LF-PROD-SOT-G15-R23F — Create-dialog saved-record callback type repair

TIMESTAMP:
2026-07-21 17:14 Europe/Warsaw

STATUS:
CODE_READY_CI_PENDING

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
a93fdf4df2843e0af0401ca65c97d5a7af62c1aa

STAGE_ID:
LF-PROD-SOT-G15-R23F_CREATE_DIALOG_SAVED_RECORD_CALLBACK_TYPE_REPAIR

IMPLEMENTATION_BRANCH:
agent/g15-r23f-create-dialog-callback-type-repair

## Scope

R23F aligns only the TypeScript declarations of the existing `onSaved` callbacks in the two create dialogs with the saved records already passed by runtime.

Runtime files changed:

- `src/components/EventCreateDialog.tsx`;
- `src/components/TaskCreateDialog.tsx`.

Verification-only files:

- `tests/lf-prod-sot-g15-r23f-create-dialog-saved-record-callback.test.cjs`;
- `scripts/check-g15-r23f-create-dialog-saved-record-callback.cjs`;
- `.github/workflows/g15-r23f-create-dialog-saved-record-callback.yml`;
- this report.

## Implementation

Event callback type:

```ts
onSaved?: (
  createdEvent: Awaited<ReturnType<typeof insertEventToSupabase>>,
) => void | Promise<void>;
```

Task callback type:

```ts
onSaved?: (
  createdTask: Awaited<ReturnType<typeof insertTaskToSupabase>>,
) => void | Promise<void>;
```

## Preserved contracts

- `const createdEvent = await insertEventToSupabase(...)` unchanged;
- `const createdTask = await insertTaskToSupabase(...)` unchanged;
- `await onSaved?.(createdEvent)` unchanged;
- `await onSaved?.(createdTask)` unchanged;
- insert payloads unchanged;
- success toasts unchanged;
- dialog close and form reset order unchanged;
- consumers unchanged;
- package and lockfile unchanged;
- SQL and migrations unchanged;
- Event DELETE and Task DELETE remain local-tombstone-only;
- remote Google Calendar behavior unchanged;
- manual Google Calendar smoke remains deferred by owner.

The R23F guard restores the former callback declaration in memory and verifies the reconstructed Git blob SHA against the exact R23E base blobs. This proves both runtime files are byte-for-byte unchanged outside the two callback type declarations.

## Expected verification

FOCUSED_R23F_TESTS:
PENDING_CI

R23F_GUARD:
PENDING_CI

R23A_SCOPE_GUARD:
PENDING_CI

DEPENDENCY_MANIFESTS_UNCHANGED:
PENDING_CI

CHANGED_FILE_ALLOWLIST:
EXPECTED_EXACT_6_FILES

ACTIVE_TYPE_DEBT_BEFORE:
59

ACTIVE_TYPE_DEBT_EXPECTED_AFTER:
57

GLOBAL_ERRORS_EXPECTED:
0

NON_ACTIVE_ERRORS_EXPECTED:
0

FIRST_ERROR_EXPECTED_AFTER_R23F:
`src/components/finance/CaseFinanceEditorDialog.tsx(94,23) TS2552`

PRODUCTION_BUILD:
PENDING_CI

EXACT_SHA_VERCEL_2_CLOSEFLOW:
PENDING

EXACT_SHA_VERCEL_CLOSEDOCKAPP:
PENDING

## Result

RESULT:
CODE_READY_CI_PENDING

Full lint is not PASS because the expected post-stage active debt remains 57 errors. `CaseFinanceEditorDialog.tsx` and all later errors are outside this stage and were not modified.
