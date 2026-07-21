# LF-PROD-SOT-G15-R23D — Context-action case source narrowing type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
PASS_CODE_CI_AND_EXACT_SHA_DEPLOY_READY_TO_MERGE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
53fdaedbe74525422baeefbe18fb61ec6bc3c989

STAGE_ID:
LF-PROD-SOT-G15-R23D_CONTEXT_ACTION_CASE_SOURCE_NARROWING_TYPE_REPAIR

PR:
#42

VERIFICATION_HEAD:
9b40923cc99260a4971df4e297f25756acd82a31

## Scope

R23D repairs only TS2367 caused by comparing `request.recordType` with `client` inside a branch already narrowed to `case`.

Exact runtime repair:

```ts
source: 'context_action_dialogs_blocker',
```

This is runtime-equivalent to the previous always-false ternary and does not change persistence or business behavior.

## Preserved contracts

- case task payload source remains `context_action_dialogs_blocker` at runtime;
- case activity source remains `STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME`;
- valid client narrowing outside the case branch remains unchanged;
- no-flicker `item` and `record` fields remain unchanged;
- package and lockfile unchanged;
- SQL and migrations unchanged;
- Event DELETE and Task DELETE remain local-tombstone-only;
- remote Google Calendar behavior unchanged;
- manual Google Calendar smoke remains deferred by owner.

## Verification evidence

WORKFLOW_RUN:
29838277995

WORKFLOW_JOB:
88660203983

FOCUSED_R23D_TESTS:
PASS

R23D_GUARD:
PASS

R23A_SCOPE_GUARD:
PASS

DEPENDENCY_MANIFESTS_UNCHANGED:
PASS

CHANGED_FILE_ALLOWLIST:
PASS_EXACT_5_FILES

ACTIVE_TYPE_DEBT_BEFORE:
63

ACTIVE_TYPE_DEBT_AFTER:
62

GLOBAL_ERRORS:
0

NON_ACTIVE_ERRORS:
0

FIRST_ERROR_AFTER_R23D:
`src/components/ContextActionDialogs.tsx(419,11) TS2353 — 'item' does not exist in type 'CloseflowWorkItemNoFlickerMutation'.`

ARTIFACT_ID:
8498320943

ARTIFACT_DIGEST:
sha256:7e9bd1f7d8dcfbcdb29bad8358df143d0052e2d040f73cd5a502b9acf9aead2f

PRODUCTION_BUILD:
PASS

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Interpretation

R23D removes exactly the intended TS2367 error and introduces no global or non-active errors. Full lint remains NOT_PASS because 62 active TypeScript errors remain.

The next stage must be derived only from TS2353 at `ContextActionDialogs.tsx(419,11)` and must not be implemented in this stage.

## Result

RESULT:
PASS_READY_TO_MERGE
