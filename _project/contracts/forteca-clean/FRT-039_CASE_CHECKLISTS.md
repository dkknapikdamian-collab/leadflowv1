# FRT-039 — CASE CHECKLISTS

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-039
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/039_case_detail_checklists.webp
TARGET_ROUTE: /cases/:caseId
TARGET_STATE: Case Detail — tab Checklisty
MISSION: Reconcile the canonical Checklisty tab with real checklist/item data and working item actions.
CURRENT_RUNTIME_OWNERS: src/pages/CaseDetail.tsx Checklisty tab; checklist/item sources; ListRow; StatusPill; existing add/verify/reject/accept handlers.
VISUAL_SOT_OWNERS: SURFACES; LIST_ROWS; MODALS; BADGES; BUTTONS_ACTIONS; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Checklisty tab; progress summary; Add item; checklist rows; verify/reject/accept actions where supported; detail navigation.
BEHAVIOR_TO_PRESERVE: Checklist/item domain, status transitions, case scope and canonical tab navigation.
KNOWN_REFERENCE_DEVIATIONS: The image contains extra generated tabs; ignore them. Canonical tabs are exactly Obsługa/Checklisty/Historia.
ALLOWED_WRITE_SET: CaseDetail Checklisty consumer and existing checklist/item/action owners; canonical surface/list/modal/badge owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine checklist data, row hierarchy, progress calculation or action gap.
ACCEPTANCE_CRITERIA: Checklist tab is real and action-complete; extra screenshot tabs are not implemented; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Checklist load/progress/add/status/action tests; browser proof of the canonical tab; typecheck if TS changes; build if shared checklist runtime changes.
PREDECESSOR: FRT-038
SUCCESSOR: FRT-040
