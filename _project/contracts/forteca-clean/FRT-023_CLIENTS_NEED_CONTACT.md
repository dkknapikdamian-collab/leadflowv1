# FRT-023 — CLIENTS NEED CONTACT

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-023
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/023_clients_need_contact.webp
TARGET_ROUTE: /clients
TARGET_STATE: Clients — requires contact
MISSION: Reconcile the needs-contact client state using canonical attention semantics and real actions.
CURRENT_RUNTIME_OWNERS: src/pages/Clients.tsx; contact/risk helper; shared StatusPill, ListRow, search and actions.
VISUAL_SOT_OWNERS: BADGES; LIST_ROWS; SEARCH; BUTTONS_ACTIONS; TYPOGRAPHY.
VISIBLE_CONTROL_INVENTORY: Needs-contact filter/badge; search; row navigation; call/email/task/next-step actions where supported.
BEHAVIOR_TO_PRESERVE: Contact-needed classification, semantic warning/danger mapping and existing client actions.
KNOWN_REFERENCE_DEVIATIONS: Do not derive business urgency from image color alone.
ALLOWED_WRITE_SET: Clients attention-state consumers and canonical owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine attention rule, visual tone, filter or action gap.
ACCEPTANCE_CRITERIA: State is real, semantically mapped and action-complete; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Attention/filter/action tests; browser proof; typecheck if TS changes; reuse semantic-owner evidence only when valid.
PREDECESSOR: FRT-022
SUCCESSOR: FRT-024

