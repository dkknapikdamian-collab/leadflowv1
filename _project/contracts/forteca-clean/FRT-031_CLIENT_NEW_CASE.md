# FRT-031 — CLIENT NEW CASE

CONTRACT_STATUS: ACTIVE
STAGE_ID: FRT-031
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/031_client_new_case_modal.webp
TARGET_ROUTE: /clients/:clientId
TARGET_STATE: New Case for this Client
MISSION: Reconcile client-context case creation with the real client relation, case mutation and navigation.
CURRENT_RUNTIME_OWNERS: src/components/CreateClientCaseDialog.tsx; ClientDetail; case create source; canonical form/modal/action owners.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; ICONS; SURFACES.
VISIBLE_CONTROL_INVENTORY: case fields; client relation; Save/Create; Cancel; close; validation; success navigation/refresh.
BEHAVIOR_TO_PRESERVE: Client relation, case creation, scope, validation, idempotency and current navigation.
KNOWN_REFERENCE_DEVIATIONS: No screenshot-only case fields or second case-create flow.
ALLOWED_WRITE_SET: Existing client-case dialog/mutation and canonical form/modal/action owners; focused tests/guards; milestone evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine relation payload, form, mutation, navigation or owner gap.
ACCEPTANCE_CRITERIA: Case is real and linked to the client; all controls work; tests, milestone build, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Relation/create/validation/cancel/navigation tests; typecheck; build checkpoint; browser proof; fresh evidence for mutation changes.
PREDECESSOR: FRT-030
SUCCESSOR: FRT-032
