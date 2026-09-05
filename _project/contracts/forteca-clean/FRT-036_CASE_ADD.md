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
Repair invariant: one Add Case submit intent has one truthful canonical outcome. Once a canonical case ID exists, checklist/activity/list-refresh failures must not be represented as base-create failure, and replay of the same pending intent must not silently insert another case.
Mandatory proof: pre-insert failure→no case; post-insert failures→created identity retained and truthful recovery; replay same intent→zero additional cases; deliberately new intent may create a distinct case; workspace/client/owner/portal semantics preserved; focused tests + authenticated browser/DB + Guardian + receipt on exact candidate SHA.

## QUALITY LOOP PROMOTION — CFL-FRT036-CLIENT-CREATED-BEFORE-CASE-PREFLIGHT-001
PROMOTION_STATUS: REPAIR_QUEUED_IN_CURRENT_STAGE
VALIDATED_AT_APP_SHA: 425ab6b23b71b6b919143f0f982dc6d1adcad96c
VALIDATED_TREE: e4c3f9dd13e73b32b016f3d208faf3aed14d9ad3

### Repair invariant
A rejected Add Case preflight must not silently persist a new client. Client relation creation and case creation are one logical Add Case intent even if they use separate canonical tables.

### Current defect class
`PRECONDITION_ORDERING / CROSS-ENTITY_PARTIAL_COMMIT`.
At validation SHA, POST `/api/cases` may call `ensureClientForCase()` and insert a new client before later portal-email/configuration or primary-case preflight returns without inserting the case.

### Smallest repair objective
Keep the existing client and case owners. Evaluate every rejectable precondition that does not require a persisted new client before client insertion. If any necessary failure can remain after client persistence, make that boundary explicitly atomic/compensating and truthful rather than leaving an unintended client.

### Mandatory repair tests
- new client + missing portal email → rejection with client delta=0 and case delta=0;
- new client + mail provider unavailable → rejection with client delta=0 and case delta=0;
- primary-case conflict path → no unintended new client;
- case insert failure after preflight → no silently orphaned client, or exact proven compensation;
- valid new-client create → exactly one client and one linked case;
- existing-client create → no duplicate client;
- workspace/lead/owner scope remains unchanged or stronger.

### Acceptance addition
FRT-036 cannot be accepted while an Add Case request can return a pre-case rejection after silently persisting a new client. Acceptance requires exact-candidate failure-injection, canonical client/case DB count proof, authenticated browser proof, required Guardian evidence and the normal FRT-036 receipt.
