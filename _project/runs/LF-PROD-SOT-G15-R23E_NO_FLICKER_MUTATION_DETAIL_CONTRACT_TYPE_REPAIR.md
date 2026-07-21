# LF-PROD-SOT-G15-R23E — No-flicker mutation detail contract type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
IMPLEMENTED_AWAITING_PR_CI_AND_EXACT_SHA_DEPLOY

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
03b53e6a1766cdefaac363041603a87ed2816c12

STAGE_ID:
LF-PROD-SOT-G15-R23E_NO_FLICKER_MUTATION_DETAIL_CONTRACT_TYPE_REPAIR

## Scope

R23E aligns only the TypeScript declaration and export aliases of the existing no-flicker mutation runtime contract.

Runtime file changed:

- `src/lib/work-items/no-flicker-mutation.ts`.

Added declarations:

- action `upsert` in the existing action union;
- optional `item`, relation metadata and business classification fields;
- `WorkItemNoFlickerMutationDetail` type alias;
- `CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION_EVENT` constant alias pointing to the existing event constant.

Verification-only files:

- `tests/lf-prod-sot-g15-r23e-no-flicker-mutation-detail-contract.test.cjs`;
- `scripts/check-g15-r23e-no-flicker-mutation-detail-contract.cjs`;
- `.github/workflows/g15-r23e-no-flicker-mutation-detail-contract.yml`;
- this report.

## Preserved contracts

- event literal remains `closeflow:work-item-no-flicker-mutation` exactly once;
- dispatch still uses `CLOSEFLOW_WORK_ITEM_NO_FLICKER_MUTATION`;
- subscription still uses the same original event constant;
- ID normalization still uses `input.id || input.record`;
- emitter detail and runtime payload are unchanged;
- `ContextActionDialogs.tsx` is unchanged;
- `useWorkItemNoFlickerList.ts` is unchanged;
- package and lockfile unchanged;
- SQL and migrations unchanged;
- Event DELETE and Task DELETE remain local-tombstone-only;
- remote Google Calendar behavior unchanged;
- manual Google Calendar smoke remains deferred by owner.

## Expected verification

- focused R23E tests: PASS;
- R23E guard: PASS;
- R23A active scope guard: PASS;
- active TypeScript debt: `62 -> 59`;
- global errors: `0`;
- non-active errors: `0`;
- first error after R23E: `src/components/EventCreateDialog.tsx(142,23) TS2554`;
- exact changed-file allowlist: 5 files;
- production build: PASS;
- both exact-SHA Vercel deployments: SUCCESS.

## Result

Evidence fields are pending until PR CI and exact-SHA deployments complete. Full lint must not be marked PASS while active TypeScript errors remain.
