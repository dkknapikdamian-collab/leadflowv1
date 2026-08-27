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

