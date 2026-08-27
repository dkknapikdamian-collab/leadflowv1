# FRT-022 — CLIENTS WITHOUT CASE

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-022
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/022_clients_without_case.webp
TARGET_ROUTE: /clients
TARGET_STATE: Clients — without active case
MISSION: Reconcile the without-case filtered client state through the existing Clients query and list owners.
CURRENT_RUNTIME_OWNERS: src/pages/Clients.tsx; client/case relation query; shared filter/list/status components.
VISUAL_SOT_OWNERS: LIST_ROWS; SEARCH; BADGES; CARDS_TILES; BUTTONS_ACTIONS.
VISIBLE_CONTROL_INVENTORY: Without-case filter; search; row click; add client; row actions; create case only when real.
BEHAVIOR_TO_PRESERVE: Client/case relation truth, workspace scope, filter transitions and navigation.
KNOWN_REFERENCE_DEVIATIONS: No screenshot-only clients or fake create-case CTA.
ALLOWED_WRITE_SET: Clients relation filter consumers and canonical owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine relation query, filter ownership, row or action gap.
ACCEPTANCE_CRITERIA: Filter derives from real relation data; every control works; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Relation filter/action tests; browser proof; typecheck if TS changes; targeted evidence reuse with matching bindings.
PREDECESSOR: FRT-021
SUCCESSOR: FRT-023

