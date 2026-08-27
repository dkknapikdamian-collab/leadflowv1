# FRT-019 — LEAD NEXT STEP

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-019
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/019_lead_next_step_prompt.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Lead Detail — set next step prompt
MISSION: Reconcile the next-step prompt and persistence using the current Lead action contract.
CURRENT_RUNTIME_OWNERS: src/pages/LeadDetail.tsx next-step prompt; task/event/action source; canonical dialog/form/footer/action owners.
VISUAL_SOT_OWNERS: SURFACES; BUTTONS_ACTIONS; MODALS; FORMS; ICONS.
VISIBLE_CONTROL_INVENTORY: Next-step choice/input; date/time if supported; Save/Set; Cancel; close; follow-up action.
BEHAVIOR_TO_PRESERVE: Next-step semantics, task/event relation, lead status and refresh behavior.
KNOWN_REFERENCE_DEVIATIONS: Prompt options are limited to real domain actions; no screenshot-only automation.
ALLOWED_WRITE_SET: Lead next-step runtime and existing task/event/action owners; canonical modal/form/surface owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine state/payload/handler or visual placement gap.
ACCEPTANCE_CRITERIA: Next step persists via a real handler and is reflected in Lead Detail; all controls work; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Prompt validation/save/cancel and resulting action tests; browser proof; typecheck; build if shared next-step runtime changes.
PREDECESSOR: FRT-018
SUCCESSOR: FRT-020

