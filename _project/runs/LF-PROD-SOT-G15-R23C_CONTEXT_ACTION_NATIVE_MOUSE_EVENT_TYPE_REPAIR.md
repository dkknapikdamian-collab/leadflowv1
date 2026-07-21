# LF-PROD-SOT-G15-R23C — Context-action native MouseEvent type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
PASS_CODE_CI_AND_EXACT_SHA_DEPLOY_READY_TO_MERGE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
b8045dba2ef25d79475a1c2571fa364d13058908

STAGE_ID:
LF-PROD-SOT-G15-R23C_CONTEXT_ACTION_NATIVE_MOUSE_EVENT_TYPE_REPAIR

PR:
#41

VERIFICATION_HEAD:
096f1737e9dc122a79b3198837d2c26f3adc9251

## Scope

R23C repairs only the three TypeScript errors caused by using React's synthetic `MouseEvent` type for the native `document` click listener in `ContextActionDialogs.tsx`.

Exact runtime repair:

```ts
import { useEffect, useMemo, useState } from 'react';
const capture = (event: globalThis.MouseEvent) => {
```

Runtime file:

- `src/components/ContextActionDialogs.tsx`.

Verification-only files:

- `tests/lf-prod-sot-g15-r23c-context-action-native-mouse-event.test.cjs`;
- `scripts/check-g15-r23c-context-action-native-mouse-event.cjs`;
- `.github/workflows/g15-r23c-context-action-native-mouse-event.yml`;
- this report.

## Preserved contracts

- capture phase remains `true`;
- `preventDefault()`, `stopPropagation()` and `stopImmediatePropagation()` remain unchanged;
- target and context resolution remain unchanged;
- listener registration and cleanup remain unchanged;
- TS2367 at the later record-type comparison remains for the next stage;
- no-flicker `item` and `record` mutation fields remain unchanged;
- package and lockfile unchanged;
- SQL and migrations unchanged;
- Event DELETE and Task DELETE remain local-tombstone-only;
- remote Google Calendar behavior unchanged;
- manual Google Calendar smoke remains deferred by owner.

## Verification evidence

WORKFLOW_RUN:
29832040752

WORKFLOW_JOB:
88638933689

FOCUSED_R23C_TESTS:
PASS

R23C_GUARD:
PASS

R23A_SCOPE_GUARD:
PASS

DEPENDENCY_MANIFESTS_UNCHANGED:
PASS

CHANGED_FILE_ALLOWLIST:
PASS_EXACT_5_FILES

ACTIVE_TYPE_DEBT_BEFORE:
66

ACTIVE_TYPE_DEBT_AFTER:
63

GLOBAL_ERRORS:
0

NON_ACTIVE_ERRORS:
0

FIRST_ERROR_AFTER_R23C:
`src/components/ContextActionDialogs.tsx(294,21) TS2367 — This comparison appears to be unintentional because the types '"case"' and '"client"' have no overlap.`

SECOND_CONTEXT_ACTION_ERROR_AFTER_R23C:
`src/components/ContextActionDialogs.tsx(419,11) TS2353 — 'item' does not exist in type 'CloseflowWorkItemNoFlickerMutation'.`

ARTIFACT_ID:
8495718014

ARTIFACT_DIGEST:
sha256:03d3c2e2b7b96fd997e5c6f942c694c67e8526c6f43f61e5775273a5ed2bdeb7

PRODUCTION_BUILD:
PASS

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Interpretation

R23C removes exactly the three intended active TypeScript errors and introduces no global or non-active scope errors. Full lint is not PASS because 63 active TypeScript errors remain.

The next stage must be derived only from TS2367 at `ContextActionDialogs.tsx(294,21)` and must not include the TS2353 no-flicker mutation contract repair in the same stage.

## Result

RESULT:
PASS_READY_TO_MERGE
