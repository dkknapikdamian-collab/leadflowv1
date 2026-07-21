# LF-PROD-SOT-G15-R23C — Context-action native MouseEvent type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_PR_CI_AND_EXACT_SHA_DEPLOY

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
b8045dba2ef25d79475a1c2571fa364d13058908

STAGE_ID:
LF-PROD-SOT-G15-R23C_CONTEXT_ACTION_NATIVE_MOUSE_EVENT_TYPE_REPAIR

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

## Expected verification

- focused R23C tests: PASS;
- R23C guard: PASS;
- R23A active scope guard: PASS;
- active TypeScript debt: `66 -> 63`;
- global errors: `0`;
- non-active errors: `0`;
- first error after R23C: `src/components/ContextActionDialogs.tsx(294,21) TS2367`;
- exact changed-file allowlist: 5 files;
- production build: PASS;
- both exact-SHA Vercel deployments: SUCCESS.

## Result

Evidence fields are intentionally pending until PR CI and exact-SHA deployments complete. Full lint must not be marked PASS while 63 active TypeScript errors remain.
