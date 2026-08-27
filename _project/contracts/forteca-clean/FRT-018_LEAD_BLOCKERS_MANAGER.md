# FRT-018 — LEAD BLOCKERS MANAGER

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-018
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/018_lead_missing_blockers_list.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Lead Detail — missing items/blockers manager
MISSION: Reconcile the blocker manager list and make every visible blocker action real, scoped, and state-safe.
CURRENT_RUNTIME_OWNERS: LeadDetail blocker manager, missing-item list, blocker action/status handlers
VISUAL_SOT_OWNERS: LIST_ROWS=src/styles/owners/closeflow-records-and-rails.css; MODALS=src/styles/owners/closeflow-dialogs.css; BADGES=src/styles/owners/closeflow-records-and-rails.css; BUTTONS_ACTIONS=src/styles/owners/closeflow-actions.css; SURFACES=src/styles/owners/closeflow-surfaces-and-cards.css
VISIBLE_CONTROL_INVENTORY: blocker rows; add blocker; resolve; accept; reject; edit; delete; confirmation; empty; loading; error
BEHAVIOR_TO_PRESERVE: Blocker state transitions remain relation-aware, scoped to the current lead/case, safe for destructive actions, and recoverable on failed mutation.
KNOWN_REFERENCE_DEVIATIONS: Do not implement unsupported blocker transitions or invent backend fields absent from the current runtime contract.
ALLOWED_WRITE_SET: Existing blocker manager/runtime owners; canonical shared visual owners only when the diff proves a shared root cause; targeted tests and stage evidence.
EXPECTED_ROOT_CAUSE_OR_GAP: Identify the actual missing relation, state transition, ownership, or shared visual contract; do not describe the repair as “fixed CSS”.
ACCEPTANCE_CRITERIA: Every visible blocker control is wired to the correct scoped runtime action; confirmations and errors are truthful; no dead control, placeholder, parallel owner, or page-local plaster remains; targeted tests, browser proof, Guardian, review, commit, and remote verification pass.
TEST_PLAN: Reuse valid unchanged evidence only after SHA/worktree/config/dependency/scope/guard/freshness checks; run targeted blocker interaction, mutation/error, typecheck when TS changes, and required browser proof.
PREDECESSOR: FRT-017
SUCCESSOR: FRT-019
