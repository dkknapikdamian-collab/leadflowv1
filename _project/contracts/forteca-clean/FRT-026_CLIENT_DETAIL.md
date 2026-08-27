# FRT-026 — CLIENT DETAIL

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-026
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/026_client_detail.webp
TARGET_ROUTE: /clients/:clientId
TARGET_STATE: Client Detail
MISSION: Reconcile Client Detail hierarchy, finance/rail/cards and real contextual actions.
CURRENT_RUNTIME_OWNERS: src/pages/ClientDetail.tsx; client single-record source; EntityContactCard; finance summary; case/task/activity owners.
VISUAL_SOT_OWNERS: PAGE_SHELL; RIGHT_RAIL; CARDS_TILES; SURFACES; MODALS; BUTTONS_ACTIONS; BADGES; RESPONSIVE_DENSITY.
VISIBLE_CONTROL_INVENTORY: Back; Edit; add case; add task/note/event; finance/case links; archive/delete only when real; tabs/sections and rail actions.
BEHAVIOR_TO_PRESERVE: Client data, case relation, finance calculations/labels, workspace scope and current actions.
KNOWN_REFERENCE_DEVIATIONS: Generated client names/data are not fixtures; canonical finance and domain sources win.
ALLOWED_WRITE_SET: ClientDetail and directly connected existing components; canonical detail/finance/card/action/modal owners; focused tests/guards; milestone evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine hierarchy, shared card/rail, finance source or contextual-handler gap.
ACCEPTANCE_CRITERIA: Detail is real, responsive, owner-consistent and action-complete; tests, milestone build, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Detail/action/finance regressions; typecheck; build checkpoint; browser proof; reuse only matching owner/data evidence.
PREDECESSOR: FRT-025
SUCCESSOR: FRT-027

