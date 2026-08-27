# FRT-013 — LEAD DUPLICATE CONFLICT

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-013
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/013_lead_duplicate_conflict.webp
TARGET_ROUTE: /leads
TARGET_STATE: duplicate conflict during real Lead creation flow
MISSION: Reconcile duplicate detection and conflict resolution as a real Lead creation state, not as a Lead Detail state.
CURRENT_RUNTIME_OWNERS: src/components/EntityConflictDialog.tsx; lead duplicate query/mutation; canonical create dialog and navigation.
VISUAL_SOT_OWNERS: MODALS; LIST_ROWS; BUTTONS_ACTIONS; BADGES; SURFACES.
VISIBLE_CONTROL_INVENTORY: Candidate duplicate rows; Open existing; Anuluj; Dodaj mimo to only when the real force-create contract allows it.
BEHAVIOR_TO_PRESERVE: Duplicate detection, workspace scope, safe conflict resolution, explicit force-create semantics and navigation.
KNOWN_REFERENCE_DEVIATIONS: DO_NOT_MODEL_AS_LEAD_DETAIL_STATE. Do not bypass duplicate protection or invent candidate records.
ALLOWED_WRITE_SET: Duplicate/conflict flow and canonical dialog/list/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether detection timing, candidate query, conflict dialog state or resolution handler is missing.
ACCEPTANCE_CRITERIA: Conflict appears only from real creation; every candidate/action is wired and safe; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Duplicate detection/candidate navigation/cancel/force-create tests; browser proof from actual create flow; typecheck; build if shared conflict runtime changes.
PREDECESSOR: FRT-012
SUCCESSOR: FRT-014

