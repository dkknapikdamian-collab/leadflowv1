export type DateTimeContract = {
  entity: string
  sourceFiles: readonly string[]
  sourceFields: readonly string[]
  derivedFields: readonly string[]
  uiOnlyFields: readonly string[]
  legacyFields: readonly string[]
  fallbackOrder: readonly string[]
  consumers: readonly string[]
  timezonePolicy: string
  localDatePolicy: string
  instantPolicy: string
  dateOnlyPolicy: string
  sortPolicy: string
  filterPolicy: string
  formatPolicy: string
  riskMarkers: readonly string[]
  recommendation: string
}

const sourceFiles = {
  dataContract: 'src/lib/data-contract.ts',
  workItemsNormalize: 'src/lib/work-items/normalize.ts',
  taskEventContract: 'src/lib/task-event-contract.ts',
  scheduling: 'src/lib/scheduling.ts',
  calendarItems: 'src/lib/calendar-items.ts',
  calendarOperationalEntryContract: 'src/lib/calendar-operational-entry-contract.ts',
  activityTruth: 'src/lib/activity-truth.ts',
  activityTimeline: 'src/lib/activity-timeline.ts',
  lastContactIntake: 'src/lib/last-contact-intake.ts',
  contactCadenceGrid: 'src/lib/contact-cadence-grid.ts',
  lostLeadRescue: 'src/lib/lost-lead-rescue.ts',
  nextMoveContract: 'src/lib/next-move-contract.ts',
  plannedActions: 'src/lib/planned-actions.ts',
  caseLifecycle: 'src/lib/case-lifecycle-v1.ts',
  ownerControlBaseline: 'src/lib/owner-control/owner-control-baseline.ts',
  financeTypes: 'src/lib/finance/finance-types.ts',
  financeNormalize: 'src/lib/finance/finance-normalize.ts',
  caseFinanceSource: 'src/lib/finance/case-finance-source.ts',
  supabaseFallback: 'src/lib/supabase-fallback.ts',
} as const

const contract = (input: DateTimeContract): DateTimeContract => input

export const leadDateContract = contract({
  entity: 'lead',
  sourceFiles: [sourceFiles.dataContract, sourceFiles.workItemsNormalize, sourceFiles.scheduling, sourceFiles.calendarOperationalEntryContract, sourceFiles.activityTruth, sourceFiles.lastContactIntake, sourceFiles.contactCadenceGrid, sourceFiles.lostLeadRescue, sourceFiles.nextMoveContract],
  sourceFields: ['createdAt', 'updatedAt', 'lastContactAt', 'contactedAt', 'movedToServiceAt', 'caseStartedAt', 'nextActionAt', 'nextStepDueAt', 'followUpAt', 'nextActionDate', 'nextActionTime', 'followUpDate', 'followUpTime'],
  derivedFields: ['silentDays', 'cadenceBucket', 'rescueBucket', 'nearestActionAt'],
  uiOnlyFields: ['lead list next action label', 'silence badge label', 'Today lead row date label', 'Calendar lead shadow label'],
  legacyFields: ['contactedAt', 'nextActionDate', 'nextActionTime', 'followUpDate', 'followUpTime'],
  fallbackOrder: ['nextActionAt', 'followUpAt', 'date+time', 'createdAt'],
  consumers: ['Lead list', 'LeadDetail', 'Today', 'Calendar lead shadow entries', 'contact cadence grid', 'lost lead rescue'],
  timezonePolicy: 'Local Warsaw business-day boundaries are risk-sensitive for silence 7/14 buckets; do not convert to UTC day key in this layer.',
  localDatePolicy: 'Date+time split fields are local UI inputs and only documented here.',
  instantPolicy: 'lastContactAt is explicit field first; createdAt/updatedAt are fallback activity metadata only.',
  dateOnlyPolicy: 'Lead date-only fields are not authoritative operational instants.',
  sortPolicy: 'Nearest action sort follows nextActionAt -> followUpAt -> date+time -> createdAt.',
  filterPolicy: 'Silence and rescue filters must not drift from activity truth.',
  formatPolicy: 'Formatting remains consumer-owned until adoption stage.',
  riskMarkers: ['DUPLICATE_DATE_LOGIC', 'TIMEZONE_RISK', 'LOCAL_TIME_FORMATTER', 'SILENCE_7_14_BUCKET_RISK'],
  recommendation: 'Keep lead next action fallback separate from last contact truth before runtime adoption.',
})

export const clientDateContract = contract({
  entity: 'client',
  sourceFiles: [sourceFiles.dataContract, sourceFiles.activityTruth, sourceFiles.contactCadenceGrid, sourceFiles.ownerControlBaseline, sourceFiles.caseFinanceSource, sourceFiles.workItemsNormalize],
  sourceFields: ['createdAt', 'updatedAt', 'lastActivityAt', 'lastContactAt', 'contactedAt', 'archivedAt', 'relation timing through cases/tasks/events'],
  derivedFields: ['nearestRelatedActivityAt', 'nearestPlannedActionAt', 'clientHealthDate', 'activeCommissionDate'],
  uiOnlyFields: ['client card activity label', 'client relation timing label', 'owner control client row label'],
  legacyFields: ['contactedAt', 'archivedAt'],
  fallbackOrder: ['lastActivityAt', 'lastContactAt', 'related case/task/event date', 'updatedAt', 'createdAt'],
  consumers: ['Clients', 'ClientDetail', 'Owner Control', 'contact cadence grid', 'case finance rollup'],
  timezonePolicy: 'Client contact/activity adapter may share lead day policy, but client cannot invent one fake global status/date.',
  localDatePolicy: 'Relation timing through cases/tasks/events must keep the source entity date.',
  instantPolicy: 'Activity truth falls back to updated/created only after real activity candidates.',
  dateOnlyPolicy: 'No client-only date-only instant is introduced in 002B.',
  sortPolicy: 'Client sorting may use needs-contact, archived, active commission and nearest planned action dates separately.',
  filterPolicy: 'Do not collapse client health/source/portal/activity into one global date filter.',
  formatPolicy: 'Client UI formatting remains consumer-owned until adoption stage.',
  riskMarkers: ['DERIVED_DATE', 'FALLBACK_DATE', 'DUPLICATE_DATE_LOGIC', 'TIMEZONE_RISK'],
  recommendation: 'Share contact/activity date adapter with Lead only where source semantics match.',
})

export const caseDateContract = contract({
  entity: 'case',
  sourceFiles: [sourceFiles.dataContract, sourceFiles.workItemsNormalize, sourceFiles.caseLifecycle, sourceFiles.ownerControlBaseline, sourceFiles.nextMoveContract, sourceFiles.plannedActions],
  sourceFields: ['startedAt', 'serviceStartedAt', 'completedAt', 'lastActivityAt', 'createdAt', 'updatedAt', 'updatedAt.toDate legacy object', 'nearest task/event dates'],
  derivedFields: ['caseLifecycleBucketDate', 'nearestOperationalMoveAt', 'ownerStatusDate'],
  uiOnlyFields: ['case list lifecycle label', 'CaseDetail timeline label', 'Owner Control case row label'],
  legacyFields: ['updatedAt.toDate', 'serviceStartedAt'],
  fallbackOrder: ['nearest task/event date', 'lastActivityAt', 'startedAt', 'createdAt'],
  consumers: ['Cases', 'CaseDetail', 'Owner Control', 'Activity Timeline', 'planned actions'],
  timezonePolicy: 'Case lifecycle dates must stay separate from operational next-move dates.',
  localDatePolicy: 'Case lifecycle labels are local business context, not Google Calendar boundary.',
  instantPolicy: 'completedAt/startedAt are lifecycle instants; nearest task/event dates are operational next-move candidates.',
  dateOnlyPolicy: 'No case-specific date-only default is introduced in 002B.',
  sortPolicy: 'Lifecycle sorting and nearest action sorting must remain separated.',
  filterPolicy: 'Case lifecycle filters must not use operational next-move fallbacks as lifecycle truth.',
  formatPolicy: 'Formatting remains consumer-owned until adoption stage.',
  riskMarkers: ['LEGACY_DATE', 'DUPLICATE_DATE_LOGIC', 'TIMEZONE_RISK', 'LIFECYCLE_OPERATIONAL_SPLIT'],
  recommendation: 'Separate lifecycle date adapter from operational next-move adapter before adoption.',
})

export const taskDateContract = contract({
  entity: 'task',
  sourceFiles: [sourceFiles.taskEventContract, sourceFiles.workItemsNormalize, sourceFiles.scheduling, sourceFiles.calendarItems, sourceFiles.dataContract, sourceFiles.calendarOperationalEntryContract],
  sourceFields: ['scheduledAt', 'scheduled_at', 'scheduledDate', 'scheduledTime', 'dueAt', 'due_at', 'dueDate', 'dueTime', 'dateTime', 'date', 'time', 'startAt', 'startsAt', 'reminderAt', 'completedAt', 'doneAt', 'createdAt', 'updatedAt', 'recurrence end fields'],
  derivedFields: ['calendarStartAt', 'todayBucket', 'overdueBucket', 'upcomingRangeBucket'],
  uiOnlyFields: ['Today task row label', 'Calendar task tile label', 'task edit date-time local input'],
  legacyFields: ['scheduled_at', 'due_at', 'dateTime', 'date', 'time', 'doneAt'],
  fallbackOrder: ['scheduledAt', 'scheduled_at', 'dueAt', 'due_at', 'scheduledDate+scheduledTime', 'dueDate+dueTime', 'dateTime', 'date+time', 'startAt', 'startsAt', 'createdAt'],
  consumers: ['Today', 'Calendar', 'Task editor', 'work items normalize', 'planned actions'],
  timezonePolicy: 'Task operational dates use local business day semantics until a separate adoption stage changes runtime.',
  localDatePolicy: 'Task date-only policy currently defaults to T09:00; do not change this behavior in 002B.',
  instantPolicy: 'Scheduled/due/reminder instants must remain source-preserving when present.',
  dateOnlyPolicy: 'T09:00 for task/event date-only defaults; finance uses a different policy.',
  sortPolicy: 'Nearest planned action and Today overdue/upcoming sorting must use the same precedence table when adopted later.',
  filterPolicy: 'Today overdue/today/upcoming and Calendar day bucket are documented consumers only in 002B.',
  formatPolicy: 'toDateTimeLocalValueSafe/toIsoDateTime style formatting remains existing-runtime owned.',
  riskMarkers: ['FALLBACK_DATE', 'LOCAL_SORT_LOGIC', 'LOCAL_FILTER_LOGIC', 'DUPLICATE_DATE_LOGIC', 'TIMEZONE_RISK', 'T09:00_DATE_ONLY_POLICY'],
  recommendation: 'Centralize task precedence first; do not change Calendar or Today behavior in 002B.',
})

export const eventDateContract = contract({
  entity: 'event',
  sourceFiles: [sourceFiles.taskEventContract, sourceFiles.workItemsNormalize, sourceFiles.scheduling, sourceFiles.calendarItems, sourceFiles.dataContract, sourceFiles.calendarOperationalEntryContract],
  sourceFields: ['startAt', 'start_at', 'startsAt', 'starts_at', 'endAt', 'end_at', 'endsAt', 'scheduledAt', 'date', 'time', 'reminderAt', 'recurrence end fields', 'completedAt', 'doneAt', 'createdAt', 'updatedAt'],
  derivedFields: ['calendarStartAt', 'calendarEndAt', 'recurrenceInstances', 'todayEventBucket'],
  uiOnlyFields: ['local UI event label', 'Calendar event tile label', 'Today event row label'],
  legacyFields: ['start_at', 'starts_at', 'end_at', 'date', 'time', 'doneAt'],
  fallbackOrder: ['startAt', 'startsAt', 'start_at', 'starts_at', 'scheduledAt', 'date+time', 'date', 'createdAt'],
  consumers: ['Calendar', 'Today', 'Event editor', 'Google Calendar boundary mapper', 'work items normalize'],
  timezonePolicy: 'Event start/end contract must explicitly separate local UI event from Google Calendar boundary.',
  localDatePolicy: 'Local event date/time is a UI/runtime concern, not changed in 002B.',
  instantPolicy: 'End fallback may be start plus existing runtime duration; repository only documents this risk.',
  dateOnlyPolicy: 'T09:00 for event date-only fallback mirrors task policy until separate adoption.',
  sortPolicy: 'Calendar range expansion and Today event sort remain existing-runtime owned.',
  filterPolicy: 'Calendar day map, recurrence and upcoming filters are documented only.',
  formatPolicy: 'Local display formatting stays in existing consumers.',
  riskMarkers: ['GCAL_BOUNDARY', 'FALLBACK_DATE', 'DUPLICATE_DATE_LOGIC', 'TIMEZONE_RISK', 'LOCAL_EVENT_NOT_GCAL_BOUNDARY'],
  recommendation: 'Define local event adapter and Google Calendar boundary adapter separately before runtime adoption.',
})

export const financeDateContract = contract({
  entity: 'finance',
  sourceFiles: [sourceFiles.financeTypes, sourceFiles.financeNormalize, sourceFiles.caseFinanceSource, sourceFiles.dataContract, sourceFiles.supabaseFallback],
  sourceFields: ['paidAt', 'paid_at', 'dueAt', 'due_at', 'createdAt', 'updatedAt', 'commissionDueAt', 'dueAt for commission', 'incurredAt', 'reimbursedAt'],
  derivedFields: ['overdueFinanceDate', 'paidLikeDate', 'commissionRemainingDateContext', 'costSettlementDateContext'],
  uiOnlyFields: ['finance due label', 'case settlement paid label', 'commission balance date label'],
  legacyFields: ['paid_at', 'due_at'],
  fallbackOrder: ['dueAt', 'due_at', 'paidAt', 'paid_at', 'createdAt'],
  consumers: ['Case finance', 'Client finance rollup', 'Billing', 'Case settlement rail'],
  timezonePolicy: 'Finance due dates are local deadline semantics and must not share task/event morning default.',
  localDatePolicy: 'Finance date-only policy currently uses end-of-day T23:59:59.',
  instantPolicy: 'Paid timestamps are payment facts; due timestamps are deadline facts.',
  dateOnlyPolicy: 'T23:59:59 for finance date-only deadlines; separate from task/event T09:00.',
  sortPolicy: 'Finance sorting is mostly status-driven today; dueAt adoption must be separate.',
  filterPolicy: 'Due/paid filters must distinguish payment status from dueAt date.',
  formatPolicy: 'Finance display formatting remains existing-runtime owned.',
  riskMarkers: ['DERIVED_DATE', 'LOCAL_TIMEZONE_LOGIC', 'DUPLICATE_DATE_LOGIC', 'TIMEZONE_RISK', 'T23:59:59_DATE_ONLY_POLICY'],
  recommendation: 'Keep finance deadline semantics separate from task/event deadlines.',
})

export const paymentDateContract = contract({
  ...financeDateContract,
  entity: 'payment',
  sourceFields: ['paidAt', 'paid_at', 'dueAt', 'due_at', 'createdAt', 'updatedAt'],
  fallbackOrder: ['paidAt', 'paid_at', 'dueAt', 'due_at', 'createdAt'],
  recommendation: 'Payment paid/due dates are facts for settlement, not generic activity dates.',
})

export const commissionDateContract = contract({
  ...financeDateContract,
  entity: 'commission',
  sourceFields: ['commissionDueAt', 'dueAt for commission', 'paidAt', 'paid_at', 'createdAt', 'updatedAt'],
  fallbackOrder: ['commissionDueAt', 'dueAt', 'paidAt', 'paid_at', 'createdAt'],
  recommendation: 'Commission status remains derived from payments; due date policy is finance-specific.',
})

export const activityDateContract = contract({
  entity: 'activity',
  sourceFiles: [sourceFiles.activityTimeline, sourceFiles.activityTruth, sourceFiles.dataContract, sourceFiles.workItemsNormalize, sourceFiles.taskEventContract, sourceFiles.financeTypes],
  sourceFields: ['happenedAt', 'createdAt', 'updatedAt', 'task scheduled/due/reminder', 'event start/scheduled/date', 'payment dates via payload'],
  derivedFields: ['activityMoment', 'timelineGroupDate', 'operationalTruthDate'],
  uiOnlyFields: ['Activity Timeline renderer date', 'timeline section label', 'payload date label'],
  legacyFields: ['payload payment date variants', 'task legacy date fields', 'event legacy date fields'],
  fallbackOrder: ['happenedAt', 'payload source date', 'createdAt', 'updatedAt'],
  consumers: ['Activity Timeline', 'Activity Truth', 'LeadDetail history', 'CaseDetail history', 'ClientDetail history'],
  timezonePolicy: 'Activity Timeline is UI-only date renderer. Activity Truth decides operational truth.',
  localDatePolicy: 'Timeline grouping may be local UI only and must not become operational source.',
  instantPolicy: 'happenedAt is display truth where present; source records remain operational truth.',
  dateOnlyPolicy: 'Activity payload date-only fields inherit their source entity policy.',
  sortPolicy: 'Timeline sort is display-only and must not drive Today/Owner Control truth.',
  filterPolicy: 'History is not source for active operational items.',
  formatPolicy: 'Activity Timeline formatting remains UI-owned until adoption stage.',
  riskMarkers: ['UI_ONLY_DATE', 'LOCAL_TIME_FORMATTER', 'FALLBACK_DATE', 'DUPLICATE_DATE_LOGIC'],
  recommendation: 'Keep activity timeline as consumer, not source.',
})

export const operationalTodayClockContract = contract({
  entity: 'today-clock',
  sourceFiles: [sourceFiles.ownerControlBaseline, sourceFiles.nextMoveContract, sourceFiles.activityTruth, sourceFiles.contactCadenceGrid, sourceFiles.plannedActions, sourceFiles.workItemsNormalize],
  sourceFields: ['dateAt', 'nextMoveAt', 'silentDays', 'generatedAt', 'startsAt', 'momentRaw', 'scheduledAt', 'dueAt', 'lastContactAt', 'lastActivityAt', 'reminderAt', 'completedAt'],
  derivedFields: ['localDateKey', 'todayBucket', 'overdueBucket', 'upcoming7DaysBucket', 'ownerControlPriority'],
  uiOnlyFields: ['Today row date', 'Owner Control priority label', 'work item chip label'],
  legacyFields: ['momentRaw', 'generatedAt'],
  fallbackOrder: ['nextMoveAt', 'scheduledAt', 'dueAt', 'startsAt', 'dateAt', 'lastActivityAt', 'lastContactAt', 'createdAt'],
  consumers: ['Today', 'Owner Control', 'Work Items', 'Next Move', 'Contact Cadence'],
  timezonePolicy: 'Centralize contract for now provider and day-key logic, but do not change Today behavior in 002B.',
  localDatePolicy: 'local day key is not ISO UTC day key.',
  instantPolicy: 'Clock/now provider is a documented dependency only; this file does not call clock APIs.',
  dateOnlyPolicy: 'Today missing moment may default to existing T09:00 behavior in runtime; not changed here.',
  sortPolicy: 'Today/Owner Control priority sorting must keep existing runtime until adoption.',
  filterPolicy: 'Overdue/today/upcoming and silence filters are documented only.',
  formatPolicy: 'Today date formatting remains consumer-owned.',
  riskMarkers: ['DUPLICATE_NOW_LOGIC', 'LOCAL_SORT_LOGIC', 'LOCAL_FILTER_LOGIC', 'TIMEZONE_RISK', 'LOCAL_DAY_KEY_NOT_UTC'],
  recommendation: 'Define injectable clock/day-key contract before runtime adoption.',
})

export const ownerControlDateContract = contract({
  ...operationalTodayClockContract,
  entity: 'owner-control',
  consumers: ['Owner Control', 'Today', 'Work Items'],
  recommendation: 'Owner Control is a derived consumer; it must not create a new date truth.',
})

export const calendarGoogleBoundaryContract = contract({
  entity: 'calendar-google-boundary',
  sourceFiles: [sourceFiles.calendarItems, sourceFiles.scheduling, sourceFiles.calendarOperationalEntryContract, sourceFiles.taskEventContract, sourceFiles.workItemsNormalize],
  sourceFields: ['local task/event start/end/reminder/recurrence', 'Google conflict startAt/endAt', 'inbound sync throttle timestamp', 'daysBack 30', 'daysForward 90', 'Date.now throttling'],
  derivedFields: ['localCalendarEntry', 'googleConflictWindow', 'syncBackfillWindow', 'throttleGate'],
  uiOnlyFields: ['Calendar tile label', 'Google conflict warning label'],
  legacyFields: ['start_at', 'end_at', 'starts_at', 'endsAt', 'date', 'time'],
  fallbackOrder: ['local task/event source date', 'Google boundary startAt/endAt', 'sync throttle timestamp'],
  consumers: ['Calendar', 'Google Calendar sync', 'Calendar conflict detection'],
  timezonePolicy: 'Google Calendar sync must remain untouched in 002B. Repository documents boundary only.',
  localDatePolicy: 'Local Calendar day key is separate from Google remote boundary.',
  instantPolicy: 'Google conflict startAt/endAt are boundary instants, not local UI event labels.',
  dateOnlyPolicy: 'Date-only handling inherits task/event local policy before Google boundary conversion.',
  sortPolicy: 'Calendar sorting/range expansion is not changed in 002B.',
  filterPolicy: 'daysBack 30 and daysForward 90 are documented sync windows only.',
  formatPolicy: 'Google Calendar formatting remains sync/runtime-owned.',
  riskMarkers: ['GCAL_BOUNDARY', 'SUPABASE_BOUNDARY', 'LOCAL_TIMEZONE_LOGIC', 'DUPLICATE_DATE_LOGIC', 'TIMEZONE_RISK'],
  recommendation: 'Keep Google Calendar boundary as documentation until a separate adoption stage.',
})

export const dateTimeRepository = {
  leadDateContract,
  clientDateContract,
  caseDateContract,
  taskDateContract,
  eventDateContract,
  financeDateContract,
  paymentDateContract,
  commissionDateContract,
  activityDateContract,
  operationalTodayClockContract,
  ownerControlDateContract,
  calendarGoogleBoundaryContract,
} as const

export const dateTimeSourceMap = Object.fromEntries(
  Object.entries(dateTimeRepository).map(([key, value]) => [
    key,
    {
      entity: value.entity,
      sourceFiles: value.sourceFiles,
      sourceFields: value.sourceFields,
      derivedFields: value.derivedFields,
      uiOnlyFields: value.uiOnlyFields,
      legacyFields: value.legacyFields,
      fallbackOrder: value.fallbackOrder,
      consumers: value.consumers,
      timezonePolicy: value.timezonePolicy,
      localDatePolicy: value.localDatePolicy,
      instantPolicy: value.instantPolicy,
      dateOnlyPolicy: value.dateOnlyPolicy,
      sortPolicy: value.sortPolicy,
      filterPolicy: value.filterPolicy,
      formatPolicy: value.formatPolicy,
      riskMarkers: value.riskMarkers,
      recommendation: value.recommendation,
    },
  ]),
) as Record<keyof typeof dateTimeRepository, DateTimeContract>
