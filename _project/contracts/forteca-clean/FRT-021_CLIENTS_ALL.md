# FRT-021 — CLIENTS ALL

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-021
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/021_clients_all.webp
TARGET_ROUTE: /clients
TARGET_STATE: Clients — Wszyscy
MISSION: Reconcile the all-clients list with real workspace-scoped data and shared list/search/action owners.
CURRENT_RUNTIME_OWNERS: src/pages/Clients.tsx; client query/source; ListRow/Table; FilterToolbar; StatusPill; ClientCreateDialog and entity actions.
VISUAL_SOT_OWNERS: PAGE_SHELL; SEARCH; LIST_ROWS; BADGES; CARDS_TILES; BUTTONS_ACTIONS; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Add client; search; filter chips; reset/more filters; row navigation; row actions; pagination/sort where present.
BEHAVIOR_TO_PRESERVE: Client directory query, workspace scope, search/filter semantics and existing actions.
KNOWN_REFERENCE_DEVIATIONS: Do not infer client fields or imports from screenshot-only content.
ALLOWED_WRITE_SET: Clients runtime and canonical list/search/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine list hierarchy, filter state, shared card/row or handler gap.
ACCEPTANCE_CRITERIA: All-clients route is real and action-complete; one owner per concern; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Client list/search/filter/action tests; browser proof; typecheck if TS changes; reuse matching list evidence.
PREDECESSOR: FRT-020
SUCCESSOR: FRT-022

