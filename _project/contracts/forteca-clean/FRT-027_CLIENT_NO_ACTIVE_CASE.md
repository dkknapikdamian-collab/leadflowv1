# FRT-027 — CLIENT WITHOUT ACTIVE CASE

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-027
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/027_client_detail_no_active_case.webp
TARGET_ROUTE: /clients/:clientId
TARGET_STATE: Client Detail — no active case
MISSION: Reconcile the no-active-case Client Detail state using the existing relation truth and real next action.
CURRENT_RUNTIME_OWNERS: src/pages/ClientDetail.tsx; client/case relation source; case creation flow; shared surfaces/actions.
VISUAL_SOT_OWNERS: SURFACES; BUTTONS_ACTIONS; CARDS_TILES; RIGHT_RAIL; BADGES.
VISIBLE_CONTROL_INVENTORY: no-active-case notice; New Case; client actions; navigation; supported archive/edit actions.
BEHAVIOR_TO_PRESERVE: Relation truth, client scope, new-case transition and empty-state behavior.
KNOWN_REFERENCE_DEVIATIONS: Empty state must reflect real data, not a screenshot fixture.
ALLOWED_WRITE_SET: ClientDetail no-case consumer and existing case-create/action owners; canonical surfaces/actions; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine relation query, empty-state hierarchy or new-case handler gap.
ACCEPTANCE_CRITERIA: No-case state is derived from runtime and its CTA works; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Relation-empty/new-case/navigation tests; browser proof; typecheck if TS changes; build if case-create shared path changes.
PREDECESSOR: FRT-026
SUCCESSOR: FRT-028

