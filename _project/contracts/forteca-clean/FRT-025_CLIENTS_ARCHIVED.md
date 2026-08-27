# FRT-025 — CLIENTS ARCHIVED

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-025
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/025_clients_archived.webp
TARGET_ROUTE: /clients
TARGET_STATE: Clients — archived
MISSION: Reconcile archived clients with existing archive/restore safety and canonical list/action owners.
CURRENT_RUNTIME_OWNERS: src/pages/Clients.tsx; client archive/trash source; EntityTrashButton; ConfirmDialog; shared rows/status.
VISUAL_SOT_OWNERS: LIST_ROWS; MODALS; BUTTONS_ACTIONS; BADGES; SURFACES.
VISIBLE_CONTROL_INVENTORY: Archived filter; Restore; delete only if allowed; confirmation; row navigation/actions.
BEHAVIOR_TO_PRESERVE: Archive/restore semantics, scope, confirmation and retention rules.
KNOWN_REFERENCE_DEVIATIONS: Never make irreversible action visible only because it appears in the image.
ALLOWED_WRITE_SET: Clients archive consumers and existing trash/confirm/list/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine archive query, action ownership, confirmation or restore gap.
ACCEPTANCE_CRITERIA: Archived state is real and safe; destructive controls are explicit/wired; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Archive/restore/confirmation/scope tests; browser proof; typecheck if TS changes; build if shared archive runtime changes.
PREDECESSOR: FRT-024
SUCCESSOR: FRT-026

