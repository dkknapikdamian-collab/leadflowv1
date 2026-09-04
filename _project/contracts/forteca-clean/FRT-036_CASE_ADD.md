# FRT-036 — CASE ADD

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-036
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/036_case_add_modal.webp
TARGET_ROUTE: /cases
TARGET_STATE: Add Case modal
MISSION: Reconcile the generic case creation modal with the real case mutation, validation and list refresh.
CURRENT_RUNTIME_OWNERS: src/components/CreateClientCaseDialog.tsx generic case variant; case create source; canonical Dialog/FormField/FormFooter.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; ICONS; SURFACES.
VISIBLE_CONTROL_INVENTORY: Case fields; client relation if applicable; validation; Create; Cancel; close; error/loading states.
BEHAVIOR_TO_PRESERVE: Case creation, client relation, workspace scope, validation and list refresh.
KNOWN_REFERENCE_DEVIATIONS: Do not invent fields or convert the client-context flow into a second store.
ALLOWED_WRITE_SET: Existing case-create dialog/mutation and canonical form/modal/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine form contract, relation, mutation, modal or refresh gap.
ACCEPTANCE_CRITERIA: Case is created through the real path; controls work; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Form/validation/submit/cancel/relation tests; browser proof; typecheck; build if shared create runtime changes.
PREDECESSOR: FRT-035
SUCCESSOR: FRT-037

## QUALITY LOOP PROMOTION — CFL-FRT036-PARTIAL-CREATE-FALSE-FAILURE-001

PROMOTION_STATUS: REPAIR_QUEUED_IN_CURRENT_STAGE
VALIDATED_AT_APP_SHA: 2abb05c43362cd02294d9e6c8ef3d0b64c1b021c
VALIDATED_TREE: 5140e605174dcaf61bcec7ece854fbfd24d50d3b

### Repair invariant

One Add Case submit intent must have one truthful canonical outcome. Before the base case insert, a failure may be reported as case creation failure. Once a canonical case ID exists, later checklist/activity enrichment or list-refresh failures must not be represented as if the case itself was not created, and replay of the same pending create intent must not silently insert a duplicate case.

### Current defect class

`PARTIAL_COMMIT / FALSE_FAILURE / NON_IDEMPOTENT_RETRY_BOUNDARY`.

At the validated SHA, the real create orchestration persists the base case before optional checklist/activity work, while the UI also performs `refreshCases()` after creation. These fallible post-insert operations share the same outer create-failure catch. Therefore a persisted case can coexist with the message `Nie udało się utworzyć sprawy`, leaving a normal retry able to issue another create. Portal-email failure already uses partial-success semantics and must remain truthful rather than being regressed.

### Smallest repair objective

Keep one existing canonical case-create path and make its commit boundary explicit:

1. Preserve the created case identity immediately after canonical base persistence succeeds.
2. Classify checklist/activity failures after persistence as post-create partial failure/recovery, not base-create failure.
3. Treat list refresh failure after persistence as refresh/reconciliation failure, not create failure; retain the created case identity and retry/reconcile the read model independently.
4. Add or reuse one bounded workspace-scoped create-intent/idempotency mechanism at the existing canonical mutation owner so retransmission of the same logical pending submit returns/reconciles the already-created case rather than inserting another. Do not create a second store/router/state owner.
5. Preserve current workspace/client/owner scope checks, primary-case conflict semantics, and existing portal-link partial-success behavior.

### Semantic anchors — current at validation only

Before implementation, re-read fresh HEAD and remap by semantics rather than line number:

- `src/pages/Cases.tsx` — `handleCreateCase`, `refreshCases`
- `src/lib/cases/create-client-case.ts` — `createStarterCaseForClient`
- `api/cases.ts` — POST case-create branch and existing insert owner
- `tests/forteca-frt-036-cases-add.test.cjs` — focused create-path coverage

### Mandatory repair tests

- pre-insert failure → no case and truthful create failure;
- base insert success + checklist existing-read failure → created case remains truthfully acknowledged/recoverable;
- base insert success + checklist item failure → no false base-create failure;
- base insert success + activity failure → no false base-create failure;
- base insert success + list refresh failure → no false base-create failure and no second create required to reconcile UI;
- replay the same create intent after each post-insert failure → canonical case count increases by zero;
- a deliberately new create intent with identical business fields can still create a distinct case;
- workspace/client/owner authorization and primary-case conflict behavior remain unchanged or stronger;
- current portal email failure remains partial success/warning;
- existing FRT-036 focused tests plus exact browser/DB proof pass.

### Acceptance addition

FRT-036 cannot be accepted while a source-proven path can persist a case and report that creation failed. Acceptance requires exact-candidate proof of one canonical case for one replayed create intent, truthful post-create failure messaging/recovery, deterministic failure-injection tests, real authenticated browser plus canonical DB evidence, required Guardian evidence, and the normal FRT-036 receipt bound to the same candidate SHA.
