# FRT-033 — CASES WAITING CLIENT

CONTRACT_STATUS: ACTIVE
STAGE_ID: FRT-033
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/033_cases_waiting_for_client.webp
TARGET_ROUTE: /cases
TARGET_STATE: Cases — Czekają na klienta
MISSION: Reconcile the corrected waiting-for-client case state using canonical case status and list owners.
CURRENT_RUNTIME_OWNERS: src/pages/Cases.tsx; case status source/helpers; shared rows and StatusPill.
VISUAL_SOT_OWNERS: LIST_ROWS; BADGES; SEARCH; CARDS_TILES; BUTTONS_ACTIONS.
VISIBLE_CONTROL_INVENTORY: Waiting filter; search; row navigation; contact/next-step action only when real; row overflow actions.
BEHAVIOR_TO_PRESERVE: Case status semantics, scope, filtering and existing actions.
KNOWN_REFERENCE_DEVIATIONS: 033 mapping is explicitly “waiting for client”; do not reuse a different screenshot interpretation.
ALLOWED_WRITE_SET: Cases status/filter consumers and canonical owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine status mapping, filter query, row or action gap.
ACCEPTANCE_CRITERIA: Waiting state derives from real status and all controls work; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Status/filter/action tests; browser proof; typecheck if TS changes; reuse status evidence only with matching source/config.
PREDECESSOR: FRT-032
SUCCESSOR: FRT-034
