# FRT-012 — LEAD EDIT

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-012
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/012_lead_edit_modal.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Edit Lead modal
MISSION: Reconcile populated Lead edit behavior with the canonical form/modal owners and real update mutation.
CURRENT_RUNTIME_OWNERS: src/pages/LeadDetail.tsx; existing lead edit form/mutation; Dialog/FormField/FormFooter and detail refresh.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; SURFACES.
VISIBLE_CONTROL_INVENTORY: Populated fields; validation; Save/Update; Anuluj; close; error/loading states.
BEHAVIOR_TO_PRESERVE: Existing values, update mutation, optimistic/loading semantics, permissions and detail refresh.
KNOWN_REFERENCE_DEVIATIONS: Reference values are not fixtures and may not replace current real record data.
ALLOWED_WRITE_SET: Lead edit runtime and canonical form/modal/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether population, update payload, modal state or shared form ownership is the actual gap.
ACCEPTANCE_CRITERIA: Existing data is preserved and editable through the real mutation; all controls work; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Populate/edit/save/cancel/error tests; detail browser proof; typecheck if TS changes; reuse form-owner evidence only with matching configuration.
PREDECESSOR: FRT-011
SUCCESSOR: FRT-013

