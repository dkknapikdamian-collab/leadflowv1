# FRT-032 — CASES ALL

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-032
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/032_cases_all.webp
TARGET_ROUTE: /cases
TARGET_STATE: Cases — Wszystkie
MISSION: Reconcile the all-cases list with the corrected 032 mapping, real workspace data and shared list/search owners.
CURRENT_RUNTIME_OWNERS: src/pages/Cases.tsx; cases query/source; shared record-list source; ListRow/Table; FilterToolbar; StatusPill.
VISUAL_SOT_OWNERS: PAGE_SHELL; SEARCH; LIST_ROWS; BADGES; CARDS_TILES; BUTTONS_ACTIONS; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Add case; search; status/owner/filter controls; reset/more filters; row navigation; row actions.
BEHAVIOR_TO_PRESERVE: Case list query, workspace scope, status semantics, navigation and current actions.
KNOWN_REFERENCE_DEVIATIONS: 032 is the corrected “all cases” mapping; reference visuals do not override runtime case semantics.
ALLOWED_WRITE_SET: Cases list runtime and canonical list/search/status/action owners; focused tests/guards; milestone evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine list/filter/row/action or shared-owner gap.
ACCEPTANCE_CRITERIA: Correct all-cases state is real and action-complete; no duplicated list owner; tests, milestone build, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Cases list/filter/action tests; typecheck; build checkpoint; browser proof; reuse matching record-list evidence.
PREDECESSOR: FRT-031
SUCCESSOR: FRT-033

