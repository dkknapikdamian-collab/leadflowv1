# FRT-002 — TODAY CUSTOMIZE

CONTRACT_STATUS: ACCEPTED
STAGE_ID: FRT-002
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/002_today_customize_view.webp
TARGET_ROUTE: /
TARGET_STATE: Today customize overlay
MISSION: Reconcile the Today customization overlay with the real preference flow, including persistence and truthful close/save behavior.
CURRENT_RUNTIME_OWNERS: src/pages/TodayStable.tsx; existing preferences store/API; canonical Dialog, Checkbox, FormFooter and Button primitives.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; SURFACES; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Dostosuj widok trigger; section checkboxes; Przywróć domyślne; Zapisz; Anuluj; close X; reorder only if a real reorder implementation exists.
BEHAVIOR_TO_PRESERVE: Existing preference persistence, default values, cancel semantics, focus/escape handling and workspace/user boundary.
KNOWN_REFERENCE_DEVIATIONS: Do not fake drag/reorder or persistence because it appears in the image; omit unsupported controls and document the deviation. The current runtime has eight real Today sections (not the reference's six); the two primary cards and the ready-to-start card retain their canonical layout slots, so the visible reorder list truthfully exposes only the six secondary sections. Filters and number-mode controls are not exposed because they are not part of the current runtime preference contract.
ALLOWED_WRITE_SET: Today customization runtime and existing preference owner; canonical dialog/form/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine whether the gap is preference state ownership, modal composition, field wiring or visual-owner drift; do not plaster a page-local overlay.
ACCEPTANCE_CRITERIA: Overlay route/state matches the reference within accepted deviations; controlled fields persist through the real path; every visible control is wired; no dead or fake controls; targeted tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Preference state and dialog action tests; focused responsive browser proof at / with overlay; typecheck if TS changes; reuse unchanged modal-owner evidence only when bindings match.
PREDECESSOR: FRT-001
SUCCESSOR: FRT-003
