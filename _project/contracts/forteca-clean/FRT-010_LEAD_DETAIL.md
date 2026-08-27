# FRT-010 — LEAD DETAIL

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-010
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/010_lead_detail.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Lead Detail for an active lead
MISSION: Reconcile Lead Detail hierarchy, shared cards/rail/actions and real contextual operations.
CURRENT_RUNTIME_OWNERS: src/pages/LeadDetail.tsx; lead single-record/query helpers; EntityContactCard; ContextActionDialogs; Entity actions and detail rail owners.
VISUAL_SOT_OWNERS: PAGE_SHELL; SURFACES; CARDS_TILES; BUTTONS_ACTIONS; ICONS; RIGHT_RAIL; MODALS; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Back to Leads; Edytuj; overflow; Ustaw kolejny krok; Rozpocznij obsługę/Otwórz sprawę; Zadzwoń; Email; Notatka; Zadanie; Spotkanie; Brak; rail links.
BEHAVIOR_TO_PRESERVE: Lead fetch/workspace scope, existing edit and contextual mutations, tel/mailto behavior, navigation and loading/error states.
KNOWN_REFERENCE_DEVIATIONS: Generated detail copy is not a domain contract; canonical runtime data and actions win.
ALLOWED_WRITE_SET: LeadDetail and directly owned contextual components; canonical detail/action/modal owners; focused tests/guards; milestone build evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine actual hierarchy, owner, route-state or handler gap; diagnose before styling.
ACCEPTANCE_CRITERIA: Active Lead Detail is real, responsive and action-complete; owner integrity and no-plaster guards pass; targeted tests, milestone build, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Detail load/action wiring/regression tests; typecheck; build checkpoint; authenticated browser proof only if current route requires it; reuse LF visual evidence only when bound to same source.
PREDECESSOR: FRT-009
SUCCESSOR: FRT-011

