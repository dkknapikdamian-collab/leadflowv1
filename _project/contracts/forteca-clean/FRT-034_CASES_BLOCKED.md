# FRT-034 — CASES BLOCKED

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-034
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/034_cases_blocked.webp
TARGET_ROUTE: /cases
TARGET_STATE: Cases — Zablokowane
MISSION: Reconcile blocked cases with canonical blocker/status truth and real resolution actions.
CURRENT_RUNTIME_OWNERS: src/pages/Cases.tsx; case blocker/status sources; shared rows, badges and contextual actions.
VISUAL_SOT_OWNERS: LIST_ROWS; BADGES; BUTTONS_ACTIONS; SEARCH; SURFACES.
VISIBLE_CONTROL_INVENTORY: Blocked filter; blocker/status badges; row navigation; open/resolve blocker action only if real; row actions.
BEHAVIOR_TO_PRESERVE: Blocker lifecycle, case scope, status transitions and existing permissions.
KNOWN_REFERENCE_DEVIATIONS: Do not add a transition or resolver from screenshot copy alone.
ALLOWED_WRITE_SET: Cases blocker consumers and canonical row/badge/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine blocker source, state mapping, list hierarchy or handler gap.
ACCEPTANCE_CRITERIA: Blocked state is truthful and action-safe; no dead CTA; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Blocker/status/filter/action tests; browser proof; typecheck if TS changes; build if shared blocker runtime changes.
PREDECESSOR: FRT-033
SUCCESSOR: FRT-035
