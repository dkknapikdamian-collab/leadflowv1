# FRT-014 — LEAD TASK

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-014
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/014_lead_add_task.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Lead Detail — add task modal
MISSION: Reconcile the linked task creation modal and real Lead Detail task relation.
CURRENT_RUNTIME_OWNERS: src/components/TaskCreateDialog.tsx; src/pages/LeadDetail.tsx; src/lib/tasks.ts; canonical Dialog/FormField/FormFooter.
VISUAL_SOT_OWNERS: MODALS; FORMS; BUTTONS_ACTIONS; CALENDAR; ICONS.
VISIBLE_CONTROL_INVENTORY: Task title/type/relation/date/time/priority/status/reminder/recurrence; save; cancel; close.
BEHAVIOR_TO_PRESERVE: Task mutation, lead relation, workspace scope, dates/timezone, validation and detail refresh.
KNOWN_REFERENCE_DEVIATIONS: Only fields supported by the real task contract may be displayed.
ALLOWED_WRITE_SET: Task dialog and Lead Detail integration; canonical form/modal/action/calendar owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine field-to-payload, relation, dialog state or action ownership gap.
ACCEPTANCE_CRITERIA: Created task is real and linked to the lead; all controls work; no fake toast/data; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Form validation, relation, submit/cancel and refresh tests; browser proof; typecheck; build if shared task dialog changes.
PREDECESSOR: FRT-013
SUCCESSOR: FRT-015

