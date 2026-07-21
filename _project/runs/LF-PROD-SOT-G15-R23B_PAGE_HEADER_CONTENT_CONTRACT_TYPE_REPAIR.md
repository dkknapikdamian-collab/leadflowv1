# LF-PROD-SOT-G15-R23B — Page-header content contract type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
PASS_CODE_CI_AND_EXACT_SHA_DEPLOY_READY_TO_MERGE

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
544c6df42612951dcef1971f04c53734e42583d9

STAGE_ID:
LF-PROD-SOT-G15-R23B_PAGE_HEADER_CONTENT_CONTRACT_TYPE_REPAIR

PR:
#40

VERIFICATION_HEAD:
9e28aeeb88c42473487b0949579a5404807ee5bf

## Scope

R23B repairs only the two TypeScript errors caused by the missing required `kicker` field in the `leads` page-header entries.

Runtime changes are limited to adding the same visible value in two existing typed maps:

```ts
kicker: 'LEADY',
```

Changed runtime files:

- `src/components/CloseFlowPageHeaderV2.tsx` — one added line;
- `src/lib/page-header-content.ts` — one added line.

Verification-only files:

- `tests/lf-prod-sot-g15-r23b-page-header-content-contract.test.cjs`;
- `scripts/check-g15-r23b-page-header-content-contract.cjs`;
- `.github/workflows/g15-r23b-page-header-content-contract.yml`;
- this report.

## Preserved contracts

- `CloseFlowPageHeaderContent.kicker` remains required;
- `content.kicker` remains rendered;
- established leads title and description remain unchanged;
- both typed maps remain separate;
- package and lockfile unchanged;
- finance, missing-items, LeadDetail, CaseDetail and ContextActionDialogs unchanged;
- SQL and migrations unchanged;
- Event DELETE and Task DELETE remain local-tombstone-only;
- remote Google Calendar behavior unchanged;
- manual Google Calendar smoke remains deferred by owner.

## Verification evidence

WORKFLOW_RUN:
29829816236

WORKFLOW_JOB:
88631575179

FOCUSED_R23B_TESTS:
PASS

R23B_GUARD:
PASS

R23A_SCOPE_GUARD:
PASS

DEPENDENCY_MANIFESTS_UNCHANGED:
PASS

CHANGED_FILE_ALLOWLIST:
PASS_EXACT_6_FILES

ACTIVE_TYPE_DEBT_BEFORE:
68

ACTIVE_TYPE_DEBT_AFTER:
66

GLOBAL_ERRORS:
0

NON_ACTIVE_ERRORS:
0

FIRST_ERROR_AFTER_R23B:
`src/components/ContextActionDialogs.tsx(201,13) TS2339 — Property 'stopImmediatePropagation' does not exist on type 'MouseEvent<Element, MouseEvent>'.`

ARTIFACT_ID:
8494819370

ARTIFACT_DIGEST:
sha256:297ab730587f1eb985de9c8ecae44b5afe56229425a591bfd63e4be9a21a711c

PRODUCTION_BUILD:
PASS

VERCEL_2_CLOSEFLOW:
SUCCESS

VERCEL_CLOSEDOCKAPP:
SUCCESS

## Interpretation

R23B removes exactly the two intended active TypeScript errors and introduces no global or non-active scope errors. Full lint is not PASS because 66 active TypeScript errors remain.

The next stage must be derived only from the new first error in `src/components/ContextActionDialogs.tsx` and must not expand into a bulk repair.

## Result

Merge to `dev-rollout-freeze` remains the final step. After merge, exact merge-SHA status and the next narrow stage must be recorded.

RESULT:
PASS_READY_TO_MERGE
