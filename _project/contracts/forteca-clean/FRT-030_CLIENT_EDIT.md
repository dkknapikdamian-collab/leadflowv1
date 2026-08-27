# FRT-030 — CLIENT EDIT

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-030
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/030_client_edit_modal.webp
TARGET_ROUTE: /clients/:clientId
TARGET_STATE: Edit Client modal
MISSION: Reconcile populated client editing with the canonical creation/edit form and real update mutation.
CURRENT_RUNTIME_OWNERS: src/components/ClientCreateDialog.tsx edit variant; src/pages/ClientDetail.tsx; client update source; canonical form/modal owners.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; SURFACES.
VISIBLE_CONTROL_INVENTORY: populated client fields; Save; Cancel; close; validation/loading/error states.
BEHAVIOR_TO_PRESERVE: Existing values, update payload, scope, permissions and detail refresh.
KNOWN_REFERENCE_DEVIATIONS: Reference values are not fixtures.
ALLOWED_WRITE_SET: Client edit runtime and canonical form/modal/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine population, update, dialog state or shared-form gap.
ACCEPTANCE_CRITERIA: Client updates through the real mutation and remains consistent across views; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Populate/edit/save/cancel/error tests; browser proof; typecheck if TS changes; reuse matching form evidence.
PREDECESSOR: FRT-029
SUCCESSOR: FRT-031

