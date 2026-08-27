# FRT-003 — GLOBAL ADD

CONTRACT_STATUS: ACCEPTED
STAGE_ID: FRT-003
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/003_global_add_menu.webp
TARGET_ROUTE: GLOBAL_APP_SHELL
TARGET_STATE: global Add menu open
MISSION: Reconcile the global Add menu in the real application shell and verify each supported creation action reaches its canonical flow.
CURRENT_RUNTIME_OWNERS: src/components/OperatorTopBarRuntime.tsx; src/components/Layout.tsx; existing ClientCreateDialog, TaskCreateDialog, EventCreateDialog and other registered creation flows.
VISUAL_SOT_OWNERS: PAGE_SHELL; MODALS; BUTTONS_ACTIONS; ICONS; FORMS.
VISIBLE_CONTROL_INVENTORY: Add trigger; Lead; Klient; Sprawa; Zadanie; Wydarzenie; Szkic only when feature is active; outside click; Escape; focus/close behavior.
BEHAVIOR_TO_PRESERVE: Global shell navigation, supported creation mutations, workspace scope, validation, permission gates and dialog lifecycle.
KNOWN_REFERENCE_DEVIATIONS: Decorative AI/generated menu entries are not product requirements; unsupported entries must not be rendered as dead buttons.
ALLOWED_WRITE_SET: Global shell/add-menu and existing creation-flow owners; canonical visual owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether the gap is shell placement, menu state ownership, route-to-dialog wiring or an unsupported reference control; no duplicate global registry.
ACCEPTANCE_CRITERIA: Global menu is reachable from the real shell; every rendered item invokes a real handler; close/focus behavior works; owner integrity, targeted tests, milestone build, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Menu interaction/action-wiring tests; build checkpoint; browser proof on a representative authenticated or credential-free state as required by the current runtime; no owner credential request solely for FRT-000 history.
PREDECESSOR: FRT-002
SUCCESSOR: FRT-004
