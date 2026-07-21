# LF-PROD-SOT-G15-R23F — Create-dialog saved-record callback type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
CODE_AND_REMOTE_CI_READY_LOCAL_EXACT_HEAD_GATE_PENDING

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

FINAL_PR_HEAD_RULE:
The local verification result must report `LOCAL_EXACT_HEAD` equal to the current PR #44 head at merge time. The merge request uses GitHub `expected_head_sha` to reject head drift.

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

## Windows CRLF portability repair

The first local exact-head verification on Windows exposed that the focused test and guard compared LF-only strings while the local worktree contained CRLF line endings. The implementation itself was correct: both exact callback declarations and both saved-record callback invocations were present.

The verification files now normalize `CRLF -> LF` in memory before:

- matching callback declarations;
- extracting the submit block;
- reconstructing the R23E base blobs;
- calculating the Git blob SHA.

No runtime source file was changed by this portability repair.

## Remote verification evidence before portability repair

WORKFLOW_RUN:
29843664209

WORKFLOW_JOB:
88678613733

FOCUSED_R23F_TESTS:
PASS_LINUX_LF

R23F_GUARD:
PASS_LINUX_LF

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
8500428823

ARTIFACT_DIGEST:
sha256:c9322526e534e992f6e0d00461505cacb9d627891b07423a95fa1c9934f5b351

PRODUCTION_BUILD:
PASS

## Final gate policy

The owner approved this order because both Vercel projects were rejected by an external Hobby build-rate limit rather than an application build error:

1. current final PR head passes the R23F GitHub workflow;
2. the same exact PR head passes the isolated Windows local package;
3. squash merge PR #44 with `expected_head_sha` equal to the locally verified head;
4. synchronize local `dev-rollout-freeze` to the exact merge SHA;
5. verify both Vercel projects for the merge SHA after the build-rate window recovers.

EXACT_SHA_VERCEL_2_CLOSEFLOW:
DEFERRED_OWNER_APPROVED_BUILD_RATE_LIMIT

EXACT_SHA_VERCEL_CLOSEDOCKAPP:
DEFERRED_OWNER_APPROVED_BUILD_RATE_LIMIT

Vercel is not recorded as PASS before a successful exact merge-SHA deployment.

## Interpretation

R23F removes exactly the two active TypeScript errors caused by zero-argument `onSaved` declarations while retaining the existing saved-record callback runtime. It introduces no global or non-active errors. Full lint is not PASS because 57 active TypeScript errors remain.

The next first error is `CaseFinanceEditorDialog.tsx(94,23) TS2552`, but that file and all finance repairs remain outside this stage.

## Result

RESULT:
LOCAL_EXACT_HEAD_GATE_PENDING

R23F may be squash-merged only after the current final PR head passes both the final GitHub workflow and the isolated Windows local verification. Deployment closeout remains pending until both Vercel projects succeed for the exact merge SHA.
