# FRT-037 — CASE EDIT

CONTRACT_STATUS: ACTIVE
STAGE_ID: FRT-037
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/037_case_edit_modal.webp
TARGET_ROUTE: /cases/:caseId
TARGET_STATE: Edit Case modal
MISSION: Reconcile populated Case editing with the real update mutation and canonical form/modal owners.
CURRENT_RUNTIME_OWNERS: src/pages/CaseDetail.tsx edit dialog; case update source; canonical form/modal/action owners.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; SURFACES.
VISIBLE_CONTROL_INVENTORY: populated case fields; Save; Cancel; close; validation/loading/error states.
BEHAVIOR_TO_PRESERVE: Existing case values, update payload, scope, permissions and detail refresh.
KNOWN_REFERENCE_DEVIATIONS: Reference values are not fixtures.
ALLOWED_WRITE_SET: CaseDetail edit runtime and canonical form/modal/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine population, update, dialog state or owner gap.
ACCEPTANCE_CRITERIA: Case updates through the real mutation; controls work; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Populate/edit/save/cancel/error tests; browser proof; typecheck if TS changes; build if shared case edit runtime changes.
PREDECESSOR: FRT-036
SUCCESSOR: FRT-038
