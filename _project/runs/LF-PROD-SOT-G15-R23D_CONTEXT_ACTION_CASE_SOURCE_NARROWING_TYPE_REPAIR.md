# LF-PROD-SOT-G15-R23D — Context-action case source narrowing type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_PR_CI_AND_EXACT_SHA_DEPLOY

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
53fdaedbe74525422baeefbe18fb61ec6bc3c989

STAGE_ID:
LF-PROD-SOT-G15-R23D_CONTEXT_ACTION_CASE_SOURCE_NARROWING_TYPE_REPAIR

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

## Expected verification

- focused R23D tests: PASS;
- R23D guard: PASS;
- R23A active scope guard: PASS;
- active TypeScript debt: `63 -> 62`;
- global errors: `0`;
- non-active errors: `0`;
- first error after R23D: `src/components/ContextActionDialogs.tsx(419,11) TS2353`;
- exact changed-file allowlist: 5 files;
- production build: PASS;
- both exact-SHA Vercel deployments: SUCCESS.

## Result

Evidence fields are pending until PR CI and exact-SHA deployments complete. Full lint must not be marked PASS while 62 active TypeScript errors remain.
