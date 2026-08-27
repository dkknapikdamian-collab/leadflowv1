# FRT-016 — LEAD EVENT

CONTRACT_STATUS: LOCKED
STAGE_ID: FRT-016
REFERENCE_FILE: docs/ui/reference/forteca-calm-light/016_lead_add_event.webp
TARGET_ROUTE: /leads/:leadId
TARGET_STATE: Lead Detail — add event modal
MISSION: Reconcile linked event/meeting creation with the canonical calendar and dialog owners.
CURRENT_RUNTIME_OWNERS: src/components/EventCreateDialog.tsx; calendar-items/event sources; Lead Detail relation; canonical date/select/form owners.
VISUAL_SOT_OWNERS: MODALS; FORMS; CALENDAR; BUTTONS_ACTIONS; ICONS.
VISIBLE_CONTROL_INVENTORY: Event type/date/time; recurrence; reminder; relation; Save; Cancel; close; validation.
BEHAVIOR_TO_PRESERVE: Event persistence, timezone/date semantics, lead relation, workspace scope and calendar refresh.
KNOWN_REFERENCE_DEVIATIONS: Google Calendar integration is not inferred from a screenshot; show only supported sync states.
ALLOWED_WRITE_SET: Event dialog and Lead Detail/calendar integration; canonical modal/form/calendar/action owners; focused tests/guards; stage evidence/receipt and WORKFLOW_STATE.
EXPECTED_ROOT_CAUSE_OR_GAP: Determine date/time payload, relation, sync boundary, dialog or owner gap.
ACCEPTANCE_CRITERIA: Event is real, linked and refreshes the correct view; all controls work; tests, Guardian, browser proof, receipt, commit and remote verification pass.
TEST_PLAN: Date/time/recurrence/relation/action tests; browser proof; typecheck; build if shared event runtime changes.
PREDECESSOR: FRT-015
SUCCESSOR: FRT-017

