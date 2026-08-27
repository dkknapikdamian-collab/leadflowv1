# FRT-006 — LEADS AT RISK

CONTRACT_STATUS: ACCEPTED
STAGE_ID: FRT-006
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/006_leads_at_risk.webp
TARGET_ROUTE: /leads
TARGET_STATE: Leads — Zagrożone
MISSION: Reconcile the at-risk Leads state using canonical risk rules, semantic warning tones and real list actions.
CURRENT_RUNTIME_OWNERS: src/pages/Leads.tsx; src/lib/owner-control/owner-risk-rules; lead-health helpers; shared list/status components.
VISUAL_SOT_OWNERS: BADGES; LIST_ROWS; CARDS_TILES; TYPOGRAPHY; SEARCH.
VISIBLE_CONTROL_INVENTORY: Risk filter/KPI; search; shared filters; row navigation; row overflow actions; next-step action when supported.
BEHAVIOR_TO_PRESERVE: Risk classification, warning semantics, workspace scope and existing lead mutation/navigation behavior.
KNOWN_REFERENCE_DEVIATIONS: Do not reclassify business risk from screenshot colors; semantic status source wins.
ALLOWED_WRITE_SET: Leads risk presentation/filter consumers and canonical owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether the gap is risk-to-tone mapping, filter query, row hierarchy or action placement.
ACCEPTANCE_CRITERIA: Risk state is real, semantically toned and fully wired; no local warning palette; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Risk rule/filter and action tests; responsive browser proof; typecheck if TS changes; reuse only matching semantic-owner evidence.
PREDECESSOR: FRT-005
SUCCESSOR: FRT-007
