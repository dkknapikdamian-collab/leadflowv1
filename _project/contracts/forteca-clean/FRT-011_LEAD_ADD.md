# FRT-011 — LEAD ADD

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-011
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/011_lead_add_modal.webp
TARGET_ROUTE: /leads
TARGET_STATE: Add Lead modal
MISSION: Reconcile the real Lead creation modal and its post-create flow with the reference while preserving validation and duplicate protection.
CURRENT_RUNTIME_OWNERS: src/components/ClientCreateDialog.tsx lead variant or existing canonical lead-create owner; lead create mutation; Dialog/FormField/FormFooter.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; ICONS; SURFACES.
VISIBLE_CONTROL_INVENTORY: Lead fields; validation; Anuluj/close; Utwórz leada; post-create Dodaj zadanie/Ustaw kolejny krok only if real.
BEHAVIOR_TO_PRESERVE: Lead creation, workspace scope, validation, duplicate detection handoff and list refresh.
KNOWN_REFERENCE_DEVIATIONS: Do not render unsupported follow-up actions or hardcode modal values.
ALLOWED_WRITE_SET: Existing lead-create dialog/mutation and canonical form/modal/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether the gap is field contract, modal owner, validation, duplicate handoff or post-create handler.
ACCEPTANCE_CRITERIA: Real form submits successfully or reports truthful errors; all shown controls work; duplicate path remains distinct; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Controlled field/validation/submit/cancel/duplicate action tests; browser proof of modal; typecheck; build if shared create dialog changes.
PREDECESSOR: FRT-010
SUCCESSOR: FRT-012

