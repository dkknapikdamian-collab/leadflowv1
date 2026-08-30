# FRT-040 — CASE HISTORY

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-040
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/040_case_detail_history.webp
TARGET_ROUTE: /cases/:caseId
TARGET_STATE: Case Detail — tab Historia
MISSION: Reconcile the canonical case history timeline with real activity data, semantic event styling and related-record actions.
CURRENT_RUNTIME_OWNERS: src/pages/CaseDetail.tsx Historia tab; history/activity source; timeline/ListRow; closeflow visual source truth and semantic icon/status registry.
VISUAL_SOT_OWNERS: LIST_ROWS; SURFACES; BADGES; ICONS; BUTTONS_ACTIONS; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Historia tab; timeline rows; expand technical payload only if safe; open related record; filters/actions only when real.
BEHAVIOR_TO_PRESERVE: Activity ordering, event semantics, case scope, related navigation and privacy boundaries.
KNOWN_REFERENCE_DEVIATIONS: The image contains extra generated tabs; ignore them. Canonical tabs are exactly Obsługa/Checklisty/Historia. Do not expose sensitive payload merely to match a screenshot.
ALLOWED_WRITE_SET: CaseDetail history consumer and existing activity/timeline/semantic owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine history source, timeline hierarchy, semantic mapping or related-action gap.
ACCEPTANCE_CRITERIA: History is real, ordered, semantically owned and action-safe; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: History ordering/semantic/expand/related-navigation tests; browser proof; typecheck if TS changes; build if shared history runtime changes.
PREDECESSOR: FRT-039
SUCCESSOR: FRT-041
