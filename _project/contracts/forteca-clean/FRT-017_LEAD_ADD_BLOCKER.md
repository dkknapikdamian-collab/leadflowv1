# FRT-017 — LEAD ADD BLOCKER

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-017
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/017_lead_add_missing_blocker.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Lead Detail — add missing item/blocker modal
MISSION: Reconcile the real missing-item/blocker creation flow without creating a parallel case-item model.
CURRENT_RUNTIME_OWNERS: src/components/AddCaseMissingItemDialog.tsx; Lead Detail blocker host; existing case-item/missing-item mutation and status source.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; BADGES; ICONS.
VISIBLE_CONTROL_INVENTORY: Missing/blocker fields; relation/type/status where supported; Save; Cancel; close; validation.
BEHAVIOR_TO_PRESERVE: Existing case-item relation, workspace scope, status lifecycle, refresh and permission checks.
KNOWN_REFERENCE_DEVIATIONS: “Brak”/blocker semantics come from the current domain contract, not generated screenshot wording.
ALLOWED_WRITE_SET: Existing missing-item/blocker dialog and Lead Detail host; canonical form/modal/action/badge owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine payload, host wiring, status or shared-owner gap.
ACCEPTANCE_CRITERIA: Blocker is persisted and appears in the real list/rail; controls work; no duplicate store; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Create/validation/refresh/status tests; browser proof; typecheck; build if shared missing-item flow changes.
PREDECESSOR: FRT-016
SUCCESSOR: FRT-018

