# FRT-007 — LEADS HISTORY

CONTRACT_STATUS: ACTIVE
STAGE_ID: FRT-007
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/007_leads_history.webp
TARGET_ROUTE: /leads
TARGET_STATE: Leads — Historia
MISSION: Reconcile the historical Leads state with real archived/won/lost/moved lead data and canonical list ownership.
CURRENT_RUNTIME_OWNERS: src/pages/Leads.tsx; src/lib/leads.ts history query; shared rows, status pills, filters and actions.
VISUAL_SOT_OWNERS: CARDS_TILES; LIST_ROWS; SURFACES; BADGES; SEARCH.
VISIBLE_CONTROL_INVENTORY: History filter; search; row navigation; row actions; restore/rescue action only where backed by a real mutation.
BEHAVIOR_TO_PRESERVE: Historical status meanings, workspace scope, soft-delete semantics and current navigation.
KNOWN_REFERENCE_DEVIATIONS: Do not hardcode screenshot records or turn history into a new data model.
ALLOWED_WRITE_SET: Leads history consumers and canonical owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine the actual historical query, list-owner or action-state gap.
ACCEPTANCE_CRITERIA: History is derived from the real source; controls are wired and semantic; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: History filtering/action tests; browser proof for populated or truthful empty state; typecheck if TS changes; evidence reuse only with matching scope.
PREDECESSOR: FRT-006
SUCCESSOR: FRT-008
