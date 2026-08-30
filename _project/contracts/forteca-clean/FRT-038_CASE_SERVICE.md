# FRT-038 — CASE SERVICE

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-038
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/038_case_detail_service.webp
TARGET_ROUTE: /cases/:caseId
TARGET_STATE: Case Detail — tab Obsługa
MISSION: Reconcile the primary Case Detail service/operations tab with real case data, rail, checklists and contextual actions.
CURRENT_RUNTIME_OWNERS: src/pages/CaseDetail.tsx; case service/items/tasks/events/finance sources; shared detail shell, rows and action dialogs.
VISUAL_SOT_OWNERS: PAGE_SHELL; RIGHT_RAIL; LIST_ROWS; SURFACES; MODALS; BUTTONS_ACTIONS; BADGES; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: canonical tabs; service items; add task/note/event/blocker; edit; status actions; related client; case delete only through safe existing flow.
BEHAVIOR_TO_PRESERVE: Case scope, lifecycle, service-item semantics, canonical tabs and existing mutations.
KNOWN_REFERENCE_DEVIATIONS: Case Detail primary tabs remain exactly Obsługa/Checklisty/Historia; generated details do not add tabs.
ALLOWED_WRITE_SET: CaseDetail Obsługa consumers and existing contextual components; canonical detail/rail/list/modal/action owners; focused tests/guards; milestone build evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine service hierarchy, shared owner, relation or handler gap.
ACCEPTANCE_CRITERIA: Obsługa route/tab is real, responsive and action-complete; owner and no-plaster guards pass; tests, milestone build, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Case Detail route/tab/action/regression tests; typecheck; build checkpoint; browser proof; reuse only matching shared-owner evidence.
PREDECESSOR: FRT-037
SUCCESSOR: FRT-039
