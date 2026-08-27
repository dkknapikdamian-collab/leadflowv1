# FRT-001 — TODAY MAIN

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-001
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/001_today_main.webp
TARGET_ROUTE: /
TARGET_STATE: Today main
MISSION: Reconcile the Today main reference with the real loaded Today runtime, preserving real workspace data and wiring every visible action.
CURRENT_RUNTIME_OWNERS: src/pages/TodayStable.tsx; src/components/Layout.tsx; src/components/OperatorTopBarRuntime.tsx; today section/task/event/lead/case sources.
VISUAL_SOT_OWNERS: PAGE_SHELL; CARDS_TILES; BUTTONS_ACTIONS; LIST_ROWS; TYPOGRAPHY/SPACING/SURFACES; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Dostosuj widok; global Dodaj; KPI tile filters; section expand/collapse; quick Add task/event; navigation to Leads/Cases/Tasks/Calendar; search/density controls if present.
BEHAVIOR_TO_PRESERVE: Existing Today data loading, workspace scope, navigation, quick-create handlers and permission/auth boundaries.
KNOWN_REFERENCE_DEVIATIONS: Reference is visual only; decorative or generated controls require real runtime support. Do not infer missing backend features.
ALLOWED_WRITE_SET: Existing Today runtime/components; canonical visual owner files only when evidence requires; focused tests/guards; audit/evidence and _project/runs/forteca-clean/FRT-001_RECEIPT.json; WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine from current route/runtime diff; name the actual missing owner, hierarchy, state or handler contract before changing code. Never record “fixed CSS” as cause.
ACCEPTANCE_CRITERIA: REAL_REFERENCE_RECONCILED=YES; route/state verified; required visual implementation or independently proven no-change; one owner per concern; all required controls wired; dead controls=0; targeted tests, Guardian and real browser proof pass; receipt/state/commit/push/remote verify complete.
TEST_PLAN: Analyze route and owner graph; run action-wiring and relevant Today guards; typecheck if TS changes; build at required milestone/shared-runtime change; browser proof at / with responsive state; reuse only matching evidence.
PREDECESSOR: FRT-000
SUCCESSOR: FRT-002

