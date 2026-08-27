# FRT-009 — LEADS TRASH

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-009
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/009_leads_trash.webp
TARGET_ROUTE: /leads
TARGET_STATE: Leads — Kosz / archiwalne
MISSION: Reconcile the soft-delete/trash Leads state with safe restore and deletion controls.
CURRENT_RUNTIME_OWNERS: src/pages/Leads.tsx; lead archive/trash query and mutations; EntityTrashButton; ConfirmDialog; shared rows.
VISUAL_SOT_OWNERS: LIST_ROWS; MODALS; BUTTONS_ACTIONS; BADGES; SURFACES.
VISIBLE_CONTROL_INVENTORY: Archived filter; Restore; hard delete only if permitted; Empty trash only if a real bulk flow exists; confirmation dialogs.
BEHAVIOR_TO_PRESERVE: Soft-delete semantics, confirmation safety, workspace scope, restore and existing retention policy.
KNOWN_REFERENCE_DEVIATIONS: Never expose irreversible hard delete or bulk empty as a dead/screenshot-only control.
ALLOWED_WRITE_SET: Leads trash consumers and existing delete/confirm owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether archive query, delete action ownership, confirmation or restore wiring is the real gap.
ACCEPTANCE_CRITERIA: Destructive controls are explicit, safe and wired; no hidden broken element; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Restore/delete confirmation and scope tests; browser proof for trash state; typecheck if TS changes; build if shared delete runtime changes.
PREDECESSOR: FRT-008
SUCCESSOR: FRT-010

