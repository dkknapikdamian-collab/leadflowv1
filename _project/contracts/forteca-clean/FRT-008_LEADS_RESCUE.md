# FRT-008 — LEADS RESCUE

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-008
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/008_leads_rescue.webp
TARGET_ROUTE: /leads
TARGET_STATE: Leads — Do odzyskania
MISSION: Reconcile the rescue-priority Leads state and expose only real next-action flows.
CURRENT_RUNTIME_OWNERS: src/pages/Leads.tsx; src/lib/owner-control/lost-lead-rescue; lead rescue/next-action helpers; shared rows and action dialogs.
VISUAL_SOT_OWNERS: LIST_ROWS; BADGES; BUTTONS_ACTIONS; SEARCH; MODALS.
VISIBLE_CONTROL_INVENTORY: Rescue grouping/priority; search; row navigation; Ustaw kolejny krok; task/prompt flow where supported; row actions.
BEHAVIOR_TO_PRESERVE: Rescue classification, lead ownership, next-step semantics and real task creation boundaries.
KNOWN_REFERENCE_DEVIATIONS: No screenshot-only rescue records, fake prioritization or decorative CTA.
ALLOWED_WRITE_SET: Leads rescue consumers and existing next-step/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether rescue grouping, next-step handler or shared row/action ownership is missing.
ACCEPTANCE_CRITERIA: Rescue list is real and prioritized by canonical rules; every shown CTA works; no plaster; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Rescue classification and next-step action tests; browser proof; typecheck if TS changes; targeted guard reuse only if valid.
PREDECESSOR: FRT-007
SUCCESSOR: FRT-009

