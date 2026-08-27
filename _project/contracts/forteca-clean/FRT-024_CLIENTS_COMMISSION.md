# FRT-024 — CLIENTS COMMISSION

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-024
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/024_clients_active_commission.webp
TARGET_ROUTE: /clients
TARGET_STATE: Clients — active commission
MISSION: Reconcile the active-commission client state and finance presentation through canonical finance/status owners.
CURRENT_RUNTIME_OWNERS: src/pages/Clients.tsx; src/components/finance/FinanceMiniSummary.tsx; finance CSS; commission/finance source; shared metric/list components.
VISUAL_SOT_OWNERS: CARDS_TILES; BADGES; SURFACES; LIST_ROWS; BUTTONS_ACTIONS; finance owner.
VISIBLE_CONTROL_INVENTORY: Active commission filter/metric; finance row details; search; client navigation; supported finance actions.
BEHAVIOR_TO_PRESERVE: Commission calculations/labels, finance source, workspace scope and current client actions.
KNOWN_REFERENCE_DEVIATIONS: Finance labels and values come from canonical finance truth; no screenshot-derived totals.
ALLOWED_WRITE_SET: Clients finance consumers and existing finance/metric/status owners; focused tests/guards; milestone evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine finance source, filter, metric tile or list-owner gap.
ACCEPTANCE_CRITERIA: Commission state uses real finance values and shared labels; no local finance palette/row model; tests, milestone build if needed, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Finance/filter/action regression tests; typecheck; build if finance/shared runtime changes; browser proof; reuse finance evidence only with matching source/config.
PREDECESSOR: FRT-023
SUCCESSOR: FRT-025

