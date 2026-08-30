# FRT-035 — CASES READY

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-035
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/035_cases_ready_to_start.webp
TARGET_ROUTE: /cases
TARGET_STATE: Cases — Gotowe do startu
MISSION: Reconcile ready-to-start cases and their real start/action affordances.
CURRENT_RUNTIME_OWNERS: src/pages/Cases.tsx; case readiness helper/status source; shared rows/status/action components.
VISUAL_SOT_OWNERS: LIST_ROWS; BADGES; BUTTONS_ACTIONS; SEARCH; CARDS_TILES.
VISIBLE_CONTROL_INVENTORY: Ready filter; readiness/status badge; row navigation; Start/open action only if a real handler exists; row actions.
BEHAVIOR_TO_PRESERVE: Readiness rules, case lifecycle, scope and current navigation.
KNOWN_REFERENCE_DEVIATIONS: Do not imply that visual readiness means mutation permission.
ALLOWED_WRITE_SET: Cases readiness consumers and canonical list/status/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine readiness rule, filter, action placement or owner gap.
ACCEPTANCE_CRITERIA: Ready state derives from the real source and controls are wired; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Readiness/filter/action tests; browser proof; typecheck if TS changes; build if shared case runtime changes.
PREDECESSOR: FRT-034
SUCCESSOR: FRT-036
