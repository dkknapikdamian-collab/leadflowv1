# FRT-020 — LEAD START CASE

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-020
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/020_lead_start_case.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Lead Detail — start service/create case
MISSION: Reconcile the canonical Lead-to-Client/Case transition and its modal with real mutations and safe navigation.
CURRENT_RUNTIME_OWNERS: src/components/LeadStartServiceDialog.tsx; LeadDetail contextual action; client/case creation service and navigation.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; SURFACES; ICONS.
VISIBLE_CONTROL_INVENTORY: Start service; case/client fields; confirmation; Cancel; close; success/error navigation.
BEHAVIOR_TO_PRESERVE: Existing lead-to-client/case domain transition, workspace scope, idempotency, validation and permission boundaries.
KNOWN_REFERENCE_DEVIATIONS: This stage may transition entity context; do not invent a second case flow or remove existing product safeguards.
ALLOWED_WRITE_SET: LeadStartServiceDialog and directly connected existing transition owners; canonical form/modal/action owners; focused tests/guards; milestone build evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine transition payload, dialog, navigation or duplicate-flow gap.
ACCEPTANCE_CRITERIA: Transition is real, safe and idempotent; actions are wired; tests, milestone build, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Transition/action/idempotency/scope tests; browser proof from Lead Detail; typecheck and milestone build; fresh evidence required for mutation changes.
PREDECESSOR: FRT-019
SUCCESSOR: FRT-021

