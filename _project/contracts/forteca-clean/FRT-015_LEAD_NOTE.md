# FRT-015 — LEAD NOTE

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-015
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/015_lead_add_note.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Lead Detail — add note modal
MISSION: Reconcile real note creation and lead activity refresh through the canonical note/dialog owner.
CURRENT_RUNTIME_OWNERS: src/components/ContextNoteDialog.tsx; Lead Detail activity/note source; notes mutation; canonical Textarea/FormFooter.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; ICONS; SURFACES.
VISIBLE_CONTROL_INVENTORY: Note textarea; relation/context; Save; Cancel; close; validation/loading/error states.
BEHAVIOR_TO_PRESERVE: Note persistence, lead relation, workspace scope and activity reload.
KNOWN_REFERENCE_DEVIATIONS: Generated note copy is not a schema; no empty fake success.
ALLOWED_WRITE_SET: Note dialog/activity consumer and canonical modal/form/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine note payload, relation, dialog lifecycle or owner gap.
ACCEPTANCE_CRITERIA: Note is persisted through the real path and visible in activity; controls work; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Note submit/cancel/error/refresh tests; browser proof; typecheck if TS changes; targeted build only if shared dialog changes.
PREDECESSOR: FRT-014
SUCCESSOR: FRT-016

