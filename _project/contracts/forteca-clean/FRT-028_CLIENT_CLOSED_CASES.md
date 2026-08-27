# FRT-028 — CLIENT CLOSED CASES

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-028
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/028_client_detail_closed_cases.webp
TARGET_ROUTE: /clients/:clientId
TARGET_STATE: Client Detail — closed cases
MISSION: Reconcile closed-case history on Client Detail with real case history and shared row/action owners.
CURRENT_RUNTIME_OWNERS: src/pages/ClientDetail.tsx; client case-history source; case rows/status/actions.
VISUAL_SOT_OWNERS: LIST_ROWS; SURFACES; BUTTONS_ACTIONS; BADGES; RIGHT_RAIL.
VISIBLE_CONTROL_INVENTORY: closed-case rows; open related case; expand/history details; supported restore/reopen actions only if real.
BEHAVIOR_TO_PRESERVE: Case lifecycle semantics, client relation, history and navigation.
KNOWN_REFERENCE_DEVIATIONS: Do not infer reopen/restore capabilities from screenshot copy.
ALLOWED_WRITE_SET: ClientDetail history consumer and canonical rows/surfaces/actions; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine history query, row hierarchy, relation or action gap.
ACCEPTANCE_CRITERIA: Closed cases are real, related and action-safe; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: History/open-related/action tests; browser proof; typecheck if TS changes; targeted build if shared history runtime changes.
PREDECESSOR: FRT-027
SUCCESSOR: FRT-029

