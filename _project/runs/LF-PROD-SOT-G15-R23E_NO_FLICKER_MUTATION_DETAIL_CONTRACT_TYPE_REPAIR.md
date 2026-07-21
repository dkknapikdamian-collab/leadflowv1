# LF-PROD-SOT-G15-R23E — No-flicker mutation detail contract type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
PASS_CODE_CI_AWAITING_FINAL_HEAD_EXACT_SHA_DEPLOY

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
03b53e6a1766cdefaac363041603a87ed2816c12

STAGE_ID:
LF-PROD-SOT-G15-R23E_NO_FLICKER_MUTATION_DETAIL_CONTRACT_TYPE_REPAIR

PR:
#43

VERIFICATION_HEAD:
bc8808c8b07b413a2d4f9369ead3e825d9b933e2

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

## Verification evidence

WORKFLOW_RUN:
29840650540

WORKFLOW_JOB:
88668377375

FOCUSED_R23E_TESTS:
PASS

R23E_GUARD:
PASS

R23A_SCOPE_GUARD:
PASS

DEPENDENCY_MANIFESTS_UNCHANGED:
PASS

CHANGED_FILE_ALLOWLIST:
PASS_EXACT_5_FILES

ACTIVE_TYPE_DEBT_BEFORE:
62

ACTIVE_TYPE_DEBT_AFTER:
59

GLOBAL_ERRORS:
0

NON_ACTIVE_ERRORS:
0

FIRST_ERROR_AFTER_R23E:
`src/components/EventCreateDialog.tsx(142,23) TS2554`

ARTIFACT_ID:
8499223927

ARTIFACT_DIGEST:
sha256:518f62c6c54e88e4e5f10bf22b233bee2275450b070e1f2244a1484f4572bde4

PRODUCTION_BUILD:
PASS

## Interpretation

R23E removes exactly the three active TypeScript errors caused by the stale no-flicker mutation declaration and missing export aliases. It introduces no global or non-active errors. Full lint is not PASS because 59 active TypeScript errors remain.

The next stage must be derived only from `EventCreateDialog.tsx(142,23) TS2554`. It must not be implemented in this session.

## Result

RESULT:
PASS_CODE_CI_AWAITING_FINAL_HEAD_EXACT_SHA_DEPLOY

Final PR-head and merge-SHA deployment evidence is recorded in the canonical CloseFlow closeout after the final report commit is verified.
