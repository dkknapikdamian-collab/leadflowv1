# FRT-005 — LEADS ACTIVE

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-005
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/005_leads_active.webp
TARGET_ROUTE: /leads
TARGET_STATE: Leads — Aktywne quick filter
MISSION: Reconcile the active-leads filtered state using the shared Leads runtime and filter owner.
CURRENT_RUNTIME_OWNERS: src/pages/Leads.tsx; src/lib/leads.ts; owner-control/status helpers; shared ListRow, MetricTile and StatusPill.
VISUAL_SOT_OWNERS: CARDS_TILES; LIST_ROWS; SEARCH; BADGES; BUTTONS_ACTIONS.
VISIBLE_CONTROL_INVENTORY: Active KPI/filter; search; shared filter chips; row click; row actions; add lead.
BEHAVIOR_TO_PRESERVE: Active status semantics, query scope, filter transitions and existing lead actions.
KNOWN_REFERENCE_DEVIATIONS: Screenshot data is not fixture data; preserve current real empty/loading/error states.
ALLOWED_WRITE_SET: Leads filter/runtime and canonical owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine the actual filter, tile-to-query or visual-owner gap before implementation.
ACCEPTANCE_CRITERIA: Active state is derived from real data/query; shared owners remain singular; all required controls work; targeted tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Filter transition and action-wiring tests; responsive browser proof; typecheck if TS changes; targeted guard reuse only with matching bindings.
PREDECESSOR: FRT-004
SUCCESSOR: FRT-006

