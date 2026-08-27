# FRT-029 — CLIENT ADD

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-029
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/029_client_add_modal.webp
TARGET_ROUTE: /clients
TARGET_STATE: Add Client modal
MISSION: Reconcile the canonical client creation modal, validation and post-create flow.
CURRENT_RUNTIME_OWNERS: src/components/ClientCreateDialog.tsx; client create mutation; Dialog/FormField/FormFooter; Clients list refresh.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; ICONS; SURFACES.
VISIBLE_CONTROL_INVENTORY: Client fields; validation; Anuluj/close; Utwórz klienta; supported follow-up actions only when real.
BEHAVIOR_TO_PRESERVE: Client creation, scope, duplicate/validation behavior, list refresh and permissions.
KNOWN_REFERENCE_DEVIATIONS: Do not hardcode generated client data or follow-up controls.
ALLOWED_WRITE_SET: Existing client-create dialog/mutation and canonical form/modal/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine field contract, modal owner, mutation, validation or refresh gap.
ACCEPTANCE_CRITERIA: Client is created through the real path; every shown control works; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Form/validation/submit/cancel/refresh tests; browser proof; typecheck; build if shared create dialog changes.
PREDECESSOR: FRT-028
SUCCESSOR: FRT-030

