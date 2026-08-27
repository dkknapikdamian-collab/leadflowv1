# FRT-004 — LEADS ALL

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-004
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/004_leads_all.webp
TARGET_ROUTE: /leads
TARGET_STATE: Leads — Wszystkie
MISSION: Reconcile the all-leads list state with real workspace-scoped data, shared list/card owners and working actions.
CURRENT_RUNTIME_OWNERS: src/pages/Leads.tsx; src/lib/leads.ts; ListRow/Table, FilterToolbar, StatusPill, Entity actions and create/import flows.
VISUAL_SOT_OWNERS: PAGE_SHELL; CARDS_TILES; SEARCH; LIST_ROWS; BADGES; BUTTONS_ACTIONS; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Dodaj leada; Import CSV only if active; search; status/source/risk/cadence filters; Więcej filtrów; Reset; row navigation; row overflow actions.
BEHAVIOR_TO_PRESERVE: Existing lead query, workspace scope, search normalization, pagination/sort, navigation and mutation permissions.
KNOWN_REFERENCE_DEVIATIONS: Do not invent import or filter dimensions absent from runtime contracts.
ALLOWED_WRITE_SET: Leads runtime and its existing data/query owners; canonical list/search/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether list hierarchy, shared row owner, filter state or action wiring causes the mismatch.
ACCEPTANCE_CRITERIA: `/leads` all state is real and loaded; controls are classified and wired; no parallel list/card source; targeted tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Leads filter/search/action tests; typecheck if TS changes; browser proof for all-state and responsive list; reuse matching list-owner evidence.
PREDECESSOR: FRT-003
SUCCESSOR: FRT-005

