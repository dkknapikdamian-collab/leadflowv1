# LF-PROD-SOT-G15-R23F — Create-dialog saved-record callback type repair

TIMESTAMP:
2026-07-21 17:22 Europe/Warsaw

STATUS:
PASS_CODE_CI_AWAITING_FINAL_HEAD_EXACT_SHA_DEPLOY

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
a93fdf4df2843e0af0401ca65c97d5a7af62c1aa

STAGE_ID:
LF-PROD-SOT-G15-R23F_CREATE_DIALOG_SAVED_RECORD_CALLBACK_TYPE_REPAIR

IMPLEMENTATION_BRANCH:
agent/g15-r23f-create-dialog-callback-type-repair

PR:
#44

VERIFIED_HEAD:
4a473d48f6bd4a26a7ad443148d0595ea2ec9bfb

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

## Verification evidence

WORKFLOW_RUN:
29843333254

WORKFLOW_JOB:
88677483220

FOCUSED_R23F_TESTS:
PASS

R23F_GUARD:
PASS

R23A_SCOPE_GUARD:
PASS

DEPENDENCY_MANIFESTS_UNCHANGED:
PASS

CHANGED_FILE_ALLOWLIST:
PASS_EXACT_6_FILES

ACTIVE_TYPE_DEBT_BEFORE:
59

ACTIVE_TYPE_DEBT_AFTER:
57

GLOBAL_ERRORS:
0

NON_ACTIVE_ERRORS:
0

FIRST_ERROR_AFTER_R23F:
`src/components/finance/CaseFinanceEditorDialog.tsx(94,23) TS2552`

ARTIFACT_ID:
8500329387

ARTIFACT_DIGEST:
sha256:bf1ed85a785cf91c17f45ab6017d3ff8392c9e95ccc5534a9e07909305b0f11f

PRODUCTION_BUILD:
PASS

EXACT_SHA_VERCEL_2_CLOSEFLOW:
PENDING_BUILD_RATE_LIMIT_RECOVERY

EXACT_SHA_VERCEL_CLOSEDOCKAPP:
PENDING_BUILD_RATE_LIMIT_RECOVERY

## Interpretation

R23F removes exactly the two active TypeScript errors caused by zero-argument `onSaved` declarations while retaining the existing saved-record callback runtime. It introduces no global or non-active errors. Full lint is not PASS because 57 active TypeScript errors remain.

The next first error is `CaseFinanceEditorDialog.tsx(94,23) TS2552`, but that file and all finance repairs remain outside this stage.

## Result

RESULT:
PASS_CODE_CI_AWAITING_FINAL_HEAD_EXACT_SHA_DEPLOY

The final report-only head must pass the same focused workflow and both Vercel projects must succeed for the exact final head before merge. After squash merge, both projects must also succeed for the exact merge SHA.
