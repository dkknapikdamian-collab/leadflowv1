import { statusRepository, taskStatus, eventStatus } from './status-repository'
import {
  dateTimeRepository,
  dateTimeSourceMap,
  taskDateContract,
  eventDateContract,
  operationalTodayClockContract,
  calendarGoogleBoundaryContract,
  financeDateContract,
} from './date-time-repository'
import { visualTokenSourceMap, globalVisualContract } from './visual-repository'
import { runtimeAdoptionReadonly, runtimeAdoptionHardRules } from './runtime-adoption-readonly'
import { todayReadonlyBridge } from './today-readonly-bridge'
import { formsModalsActionVisualBridge } from './forms-modals-action-visual-readonly-bridge'
import { caseDetailIsolatedAdoptionPlan } from './casedetail-isolated-adoption-plan'

export const calendarDateTimeBoundaryPlanStage = 'LF-PROD-SOT-004G' as const

export const calendarDateTimeBoundaryPlanMode = 'CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN' as const

export const calendarDateTimeBoundaryPlanSourceMap = {
  stage: calendarDateTimeBoundaryPlanStage,
  mode: calendarDateTimeBoundaryPlanMode,
  centralIndex: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  inputRuntimeAdoptionMap: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  previousAppRunReport004F: '_project/runs/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md',
  previousObsidianReport004F: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md',
  sourceMapId: 'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP',
  consumerStageId: 'LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN',
  adoptionCategory: 'GOOGLE_CALENDAR_BOUNDARY_DO_NOT_TOUCH / HIGH_RISK_DATE_TIME_ADOPTION / SAFE_HELPER_IMPORT_CANDIDATE',
  risk: 'HIGH',
} as const

export const calendarDateTimeBoundaryPlanConsumers = [
  'Calendar date-time boundary plan consumer only',
  'task and event local date policy reviewer only',
  'Today task/event count guard consumer only',
  'Google Calendar boundary reviewer only',
  'first runtime import decision gate after 004G',
] as const

export const calendarDateTimeBoundaryPlanRepositories = {
  statusRepository,
  taskStatus,
  eventStatus,
  dateTimeRepository,
  dateTimeSourceMap,
  taskDateContract,
  eventDateContract,
  operationalTodayClockContract,
  calendarGoogleBoundaryContract,
  financeDateContract,
  visualTokenSourceMap,
  globalVisualContract,
  runtimeAdoptionReadonly,
  runtimeAdoptionHardRules,
  todayReadonlyBridge,
  formsModalsActionVisualBridge,
  caseDetailIsolatedAdoptionPlan,
} as const

export const calendarDateTimeBoundaryPlanLocalDatePolicyMap = {
  taskScheduledAtPrecedence: 'scheduledAt -> scheduled_at -> scheduledDate+scheduledTime -> dateTime -> date+time -> createdAt; PLAN_ONLY',
  taskDueAtPrecedence: 'dueAt -> due_at -> dueDate+dueTime -> scheduledAt fallback; PLAN_ONLY',
  taskDateTimeSplitPrecedence: 'split UI date and time remain local input fields; PLAN_ONLY',
  taskDateOnlyDefaultT0900: 'T09:00 existing local default remains unchanged; PLAN_ONLY',
  eventStartAtPrecedence: 'startAt -> startsAt -> start_at -> starts_at -> scheduledAt -> date+time -> date -> createdAt; PLAN_ONLY',
  eventDateTimeSplitPrecedence: 'event split date and time remain local UI inputs; PLAN_ONLY',
  eventDateOnlyDefaultT0900: 'T09:00 existing local default remains unchanged; PLAN_ONLY',
  calendarLocalDayBucketPolicy: 'local calendar day bucket counts remain existing runtime owned; PLAN_ONLY',
  todayTaskEventBucketPolicy: 'Today task/event counts remain existing runtime owned; PLAN_ONLY',
  localWarsawBusinessDayBoundaryPolicy: 'local Warsaw business day boundary remains unchanged; PLAN_ONLY',
  financeDateOnlyDefaultT235959_REFERENCE_ONLY_NOT_ADOPTED: 'finance T23:59:59 policy is reference-only and not adopted in 004G',
} as const

export const calendarDateTimeBoundaryPlanRemoteBoundaryMap = {
  googleCalendarSyncBoundary: 'Google Calendar sync is remote boundary and remains NOT_TOUCHED in 004G',
  googleCalendarMapperBoundary: 'Google Calendar mapper remains NOT_TOUCHED in 004G',
  remoteCalendarProviderBoundary: 'remote provider boundary remains NOT_TOUCHED in 004G',
  localEventNotGcalBoundary: 'local event display is separate from Google Calendar boundary; PLAN_ONLY',
  noRemoteCalendarMutationIn004G: 'no remote calendar mutation in 004G',
  noGcalMapperChangeIn004G: 'no Google Calendar mapper change in 004G',
} as const

export const calendarDateTimeBoundaryPlanBlockedAreas = [
  'Calendar runtime output',
  'Tasks runtime output',
  'Today runtime output',
  'Google Calendar sync output',
  'Google Calendar mapper output',
  'remote calendar provider output',
  'local calendar day counts output',
  'Today task/event counts output',
  'task/event status label output',
  'done/cancelled/pending label output',
  'date precedence output',
  'date-only defaults output',
  'timezone policy output',
  'recurrence expansion output',
  'calendar item expansion output',
  'normalization output',
  'scheduling output',
  'data writes',
  'UI output',
  'CSS output',
] as const

export const calendarDateTimeBoundaryPlanAllowedAreas = [
  'isolated boundary plan metadata only',
  'local date policy map metadata only',
  'remote calendar boundary map metadata only',
  'risk map metadata only',
  'no-drift policy metadata only',
  'fixture policy metadata only',
  'manual smoke policy metadata only',
  'guard and test verification only',
  'report and SOT index update only',
] as const

export const calendarDateTimeBoundaryPlanRiskMap = {
  overallRisk: 'HIGH',
  dateFallbackRisk: 'HIGH',
  dateOnlyDefaultRisk: 'HIGH',
  localDayBucketRisk: 'HIGH',
  todayCountRisk: 'HIGH',
  googleCalendarBoundaryRisk: 'VERY_HIGH',
  recurrenceRisk: 'HIGH',
  statusLabelRisk: 'MEDIUM_HIGH',
  firstRuntimeImportGate: 'DECISION_NEEDED_AFTER_004G',
} as const

export const calendarDateTimeBoundaryPlanHardRules = {
  stage: calendarDateTimeBoundaryPlanStage,
  mode: calendarDateTimeBoundaryPlanMode,
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  CalendarRuntimeAdoption: 'NOT_STARTED',
  TasksRuntimeAdoption: 'NOT_STARTED',
  TodayRuntimeAdoption: 'NOT_STARTED',
  GoogleCalendarSyncChange: 'FORBIDDEN',
  GoogleCalendarMapperChange: 'FORBIDDEN',
  RemoteCalendarBoundaryChange: 'FORBIDDEN',
  LocalCalendarDayCountChange: 'FORBIDDEN',
  TodayTaskEventCountChange: 'FORBIDDEN',
  TaskStatusLabelChange: 'FORBIDDEN',
  EventStatusLabelChange: 'FORBIDDEN',
  DoneCancelledPendingLabelChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  dateOnlyDefaultChange: 'FORBIDDEN',
  taskDateOnlyDefaultT0900Change: 'FORBIDDEN',
  eventDateOnlyDefaultT0900Change: 'FORBIDDEN',
  financeDateOnlyDefaultT235959Change: 'FORBIDDEN',
  timezonePolicyChange: 'FORBIDDEN',
  localWarsawBusinessDayBoundaryChange: 'FORBIDDEN',
  recurrenceExpansionChange: 'FORBIDDEN',
  calendarItemExpansionChange: 'FORBIDDEN',
  workItemsNormalizeChange: 'FORBIDDEN',
  schedulingChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  sourceOfTruthUsage: 'GUARDS_TESTS_BOUNDARY_PLAN_ONLY',
  visibleOutputDrift: 'FORBIDDEN',
  manualSmokeRequiredByDamian: 'REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT',
  FinanceRuntimeAdoption: 'FORBIDDEN',
  CaseDetailRuntimeAdoption: 'FORBIDDEN',
  firstRuntimeImportDecision: 'DECISION_NEEDED_AFTER_004G',
} as const

export const calendarDateTimeBoundaryPlanNoDriftPolicy = {
  visibleOutputDrift: 'FORBIDDEN',
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  CalendarRuntimeAdoption: 'NOT_STARTED',
  TasksRuntimeAdoption: 'NOT_STARTED',
  TodayRuntimeAdoption: 'NOT_STARTED',
  datePrecedenceChange: 'FORBIDDEN',
  dateOnlyDefaultChange: 'FORBIDDEN',
  timezonePolicyChange: 'FORBIDDEN',
  GoogleCalendarSyncChange: 'FORBIDDEN',
  GoogleCalendarMapperChange: 'FORBIDDEN',
  LocalCalendarDayCountChange: 'FORBIDDEN',
  TodayTaskEventCountChange: 'FORBIDDEN',
} as const

export const calendarDateTimeBoundaryPlanFixturePolicy = [
  { fixture: 'task scheduledAt anchor', policy: 'do not change runtime, precedence, local default, labels or output' },
  { fixture: 'task dueAt anchor', policy: 'do not change due fallback, sorting, Today count or output' },
  { fixture: 'task date+time split anchor', policy: 'do not change split local input behavior or T09:00 default' },
  { fixture: 'event startAt anchor', policy: 'do not change event start precedence, bucket placement or output' },
  { fixture: 'event date+time split anchor', policy: 'do not change split local input behavior or T09:00 default' },
  { fixture: 'local calendar day bucket anchor', policy: 'do not change calendar local day counts or bucket logic' },
  { fixture: 'Today task/event count anchor', policy: 'do not change Today task/event counts or filters' },
  { fixture: 'Google Calendar boundary anchor', policy: 'do not change Google Calendar mapper, sync or remote boundary' },
  { fixture: 'date-only default T09:00 anchor', policy: 'do not change task/event date-only default' },
  { fixture: 'finance T23:59:59 reference-only anchor', policy: 'finance date-only policy is reference-only and not adopted in 004G' },
] as const

export const calendarDateTimeBoundaryPlanManualSmokePolicy = {
  manualSmokeRequiredByDamian: 'REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT',
  smokeScope: 'Calendar day counts, Today task/event counts, task dialog, event dialog and Google Calendar boundary review before runtime import',
  runtimeImportGate: 'manual smoke plus Damian decision required before first runtime import after 004G',
} as const

export const calendarDateTimeBoundaryPlanNextDecision = {
  firstRuntimeImportDecision: 'DECISION_NEEDED_AFTER_004G',
  doNotCreate004HWithoutDamianDecision: true,
  candidateDirection: 'FIRST_RUNTIME_IMPORT_DECISION_NEEDED',
} as const

export const calendarDateTimeBoundaryPlanReport = {
  appReport: '_project/runs/LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN.md',
  obsidianReport: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN.md',
  status: 'CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN_REMOTE_ADDED_LOCAL_VERIFICATION_PENDING',
} as const

export const calendarDateTimeBoundaryPlan = {
  calendarDateTimeBoundaryPlanStage,
  calendarDateTimeBoundaryPlanMode,
  calendarDateTimeBoundaryPlanSourceMap,
  calendarDateTimeBoundaryPlanConsumers,
  calendarDateTimeBoundaryPlanRepositories,
  calendarDateTimeBoundaryPlanLocalDatePolicyMap,
  calendarDateTimeBoundaryPlanRemoteBoundaryMap,
  calendarDateTimeBoundaryPlanBlockedAreas,
  calendarDateTimeBoundaryPlanAllowedAreas,
  calendarDateTimeBoundaryPlanRiskMap,
  calendarDateTimeBoundaryPlanHardRules,
  calendarDateTimeBoundaryPlanNoDriftPolicy,
  calendarDateTimeBoundaryPlanFixturePolicy,
  calendarDateTimeBoundaryPlanManualSmokePolicy,
  calendarDateTimeBoundaryPlanNextDecision,
  calendarDateTimeBoundaryPlanReport,
} as const
