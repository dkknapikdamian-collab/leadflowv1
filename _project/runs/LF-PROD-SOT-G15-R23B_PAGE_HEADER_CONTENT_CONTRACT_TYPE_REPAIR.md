# LF-PROD-SOT-G15-R23B — Page-header content contract type repair

TIMESTAMP:
2026-07-21 Europe/Warsaw

STATUS:
PR_OPEN_VERIFICATION_PENDING

PROJECT_ID:
closeflow_lead_app

APP_INPUT_HEAD:
544c6df42612951dcef1971f04c53734e42583d9

STAGE_ID:
LF-PROD-SOT-G15-R23B_PAGE_HEADER_CONTENT_CONTRACT_TYPE_REPAIR

## Scope

R23B repairs only the two TypeScript errors caused by the missing required `kicker` field in the `leads` page-header entries.

Runtime changes are limited to adding the same visible value in two existing typed maps:

```ts
kicker: 'LEADY',
```

Changed runtime files:

- `src/components/CloseFlowPageHeaderV2.tsx`;
- `src/lib/page-header-content.ts`.

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
- no dependency or lockfile changes;
- no finance, missing-items, LeadDetail, CaseDetail or ContextActionDialogs changes;
- no SQL or migration changes;
- Event DELETE and Task DELETE remain local-tombstone-only;
- remote Google Calendar behavior remains unchanged;
- manual Google Calendar smoke remains deferred by owner.

## Expected verification

FOCUSED_R23B_TESTS:
PENDING

R23B_GUARD:
PENDING

R23A_SCOPE_GUARD:
PENDING

ACTIVE_TYPE_DEBT_BEFORE:
68

ACTIVE_TYPE_DEBT_EXPECTED_AFTER:
66

EXPECTED_FIRST_ERROR:
`src/components/ContextActionDialogs.tsx(201,13) TS2339`

GLOBAL_ERRORS_EXPECTED:
0

NON_ACTIVE_ERRORS_EXPECTED:
0

PRODUCTION_BUILD:
PENDING

VERCEL_2_CLOSEFLOW:
PENDING

VERCEL_CLOSEDOCKAPP:
PENDING

## Result

R23B is not PASS until the dedicated workflow, exact debt delta, production build, both exact-SHA Vercel deployments and merge to `dev-rollout-freeze` are proven.

RESULT:
VERIFICATION_PENDING
