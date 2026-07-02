import * as statusRepositoryReadonly from './status-repository'
import * as dateTimeRepositoryReadonly from './date-time-repository'
import * as visualRepositoryReadonly from './visual-repository'
import * as runtimeAdoptionReadonlyRepository from './runtime-adoption-readonly'
import * as calendarDateTimeBoundaryPlanReadonly from './calendar-date-time-boundary-plan'

export const calendarDateTimeBoundaryReadonlyRuntimeStage = 'LF-PROD-SOT-004I' as const

export const calendarDateTimeBoundaryReadonlyRuntimeMode = 'CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT' as const

export const calendarDateTimeBoundaryReadonlyRuntimeDecision = {
  stage: calendarDateTimeBoundaryReadonlyRuntimeStage,
  mode: calendarDateTimeBoundaryReadonlyRuntimeMode,
  decisionFrom004H: 'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST',
  runtimeImport: 'READONLY_HELPER_IMPORT_ONLY',
  sourceOfTruthUsage: 'READONLY_RUNTIME_IMPORT_NO_OUTPUT_DRIFT',
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeSourceMap = {
  centralIndex: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  decision004H: 'LF-PROD-SOT-004H_FIRST_RUNTIME_IMPORT_DECISION_MAP',
  plan004G: 'LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN',
  appReport004I: '_project/runs/LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT.md',
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeRepositories = {
  statusRepositoryReadonly,
  dateTimeRepositoryReadonly,
  visualRepositoryReadonly,
  runtimeAdoptionReadonlyRepository,
  calendarDateTimeBoundaryPlanReadonly,
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeAllowedImports = [
  './status-repository',
  './date-time-repository',
  './visual-repository',
  './runtime-adoption-readonly',
  './calendar-date-time-boundary-plan',
] as const

export const calendarDateTimeBoundaryReadonlyRuntimeBlockedAreas = [
  'React',
  'DOM',
  'pages',
  'components',
  'ui-system',
  'CSS',
  'Supabase/API',
  'Google Calendar sync',
  'Google Calendar mapper',
  'remote calendar provider',
  'data provider',
  'finance runtime',
  'CaseDetail runtime',
] as const

export const calendarDateTimeBoundaryReadonlyRuntimeHardRules = {
  stage: calendarDateTimeBoundaryReadonlyRuntimeStage,
  mode: calendarDateTimeBoundaryReadonlyRuntimeMode,
  decisionFrom004H: 'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST',
  runtimeImport: 'READONLY_HELPER_IMPORT_ONLY',
  runtimeBehaviorChange: 'FORBIDDEN',
  visibleOutputDrift: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  sqlChange: 'FORBIDDEN',
  supabaseApiChange: 'FORBIDDEN',
  GoogleCalendarSyncChange: 'FORBIDDEN',
  GoogleCalendarMapperChange: 'FORBIDDEN',
  RemoteCalendarBoundaryChange: 'FORBIDDEN',
  CalendarRuntimeAdoption: 'READONLY_HELPER_IMPORT_ONLY',
  TasksRuntimeAdoption: 'READONLY_HELPER_IMPORT_ONLY',
  TodayRuntimeAdoption: 'READONLY_HELPER_IMPORT_ONLY',
  LocalCalendarDayCountChange: 'FORBIDDEN',
  TodayTaskEventCountChange: 'FORBIDDEN',
  TaskStatusLabelChange: 'FORBIDDEN',
  EventStatusLabelChange: 'FORBIDDEN',
  DoneCancelledPendingLabelChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  dateOnlyDefaultChange: 'FORBIDDEN',
  taskDateOnlyDefaultT0900Change: 'FORBIDDEN',
  eventDateOnlyDefaultT0900Change: 'FORBIDDEN',
  financeDateOnlyDefaultT235959Change: 'FORBIDDEN_REFERENCE_ONLY',
  timezonePolicyChange: 'FORBIDDEN',
  localWarsawBusinessDayBoundaryChange: 'FORBIDDEN',
  recurrenceExpansionChange: 'FORBIDDEN',
  calendarItemExpansionChange: 'FORBIDDEN',
  workItemsNormalizeOutputChange: 'FORBIDDEN',
  schedulingOutputChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  sourceOfTruthUsage: 'READONLY_RUNTIME_IMPORT_NO_OUTPUT_DRIFT',
  manualSmokeRequiredByDamian: 'REQUIRED_AND_BLOCKING_BEFORE_NEXT_RUNTIME_IMPORT',
  FinanceRuntimeAdoption: 'FORBIDDEN',
  CaseDetailRuntimeAdoption: 'FORBIDDEN',
  nextRuntimeImportDecision: 'REQUIRED_AFTER_004I_MANUAL_SMOKE',
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeNoDriftPolicy = {
  noOutputDrift: 'READONLY_RUNTIME_IMPORT_NO_OUTPUT_DRIFT',
  runtimeOutput: 'NO_DRIFT',
  visibleOutput: 'NO_DRIFT',
  calendarDayCounts: 'NO_DRIFT',
  todayTaskEventCounts: 'NO_DRIFT',
  statusLabels: 'NO_DRIFT',
  datePrecedence: 'NO_DRIFT',
  dateOnlyDefaults: 'NO_DRIFT',
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeDatePolicy = {
  datePrecedenceChange: 'FORBIDDEN',
  dateOnlyDefaultChange: 'FORBIDDEN',
  taskDateOnlyDefaultT0900Change: 'FORBIDDEN',
  eventDateOnlyDefaultT0900Change: 'FORBIDDEN',
  financeDateOnlyDefaultT235959Change: 'FORBIDDEN_REFERENCE_ONLY',
  timezonePolicyChange: 'FORBIDDEN',
  localWarsawBusinessDayBoundaryChange: 'FORBIDDEN',
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeStatusPolicy = {
  TaskStatusLabelChange: 'FORBIDDEN',
  EventStatusLabelChange: 'FORBIDDEN',
  DoneCancelledPendingLabelChange: 'FORBIDDEN',
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeAdapterContract = {
  stage: calendarDateTimeBoundaryReadonlyRuntimeStage,
  mode: calendarDateTimeBoundaryReadonlyRuntimeMode,
  runtimeImport: 'READONLY_HELPER_IMPORT_ONLY',
  sourceOfTruthUsage: 'READONLY_RUNTIME_IMPORT_NO_OUTPUT_DRIFT',
  helperUsage: 'BOUNDARY_METADATA_REFERENCE_ONLY',
  outputMutation: 'FORBIDDEN',
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeFixturePolicy = [
  'task with scheduledAt: NO_DRIFT',
  'task with dueAt: NO_DRIFT',
  'task with date + time split: NO_DRIFT',
  'task date-only default T09:00: NO_DRIFT',
  'event with startAt: NO_DRIFT',
  'event with date + time split: NO_DRIFT',
  'event date-only default T09:00: NO_DRIFT',
  'local calendar day bucket: NO_DRIFT',
  'Today task/event count fixture: NO_DRIFT',
  'done/cancelled/pending labels fixture: NO_DRIFT',
  'finance date-only T23:59:59 reference-only fixture: NO_DRIFT_REFERENCE_ONLY',
] as const

export const calendarDateTimeBoundaryReadonlyRuntimeManualSmokePolicy = {
  manualSmokeRequiredByDamian: 'REQUIRED_AND_BLOCKING_BEFORE_NEXT_RUNTIME_IMPORT',
  manualSmoke: 'REQUIRED_BEFORE_NEXT_RUNTIME_IMPORT',
  nextRuntimeImportDecision: 'REQUIRED_AFTER_004I_MANUAL_SMOKE',
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeNextStages = {
  after004I: 'MANUAL_SMOKE_REQUIRED_BEFORE_NEXT_RUNTIME_IMPORT',
  nextRuntimeImportDecision: 'REQUIRED_AFTER_004I_MANUAL_SMOKE',
  doNotCreate004JWithoutDamianDecision: true,
} as const

export const calendarDateTimeBoundaryReadonlyRuntimeReport = {
  appReport: '_project/runs/LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT.md',
  obsidianReport: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT.md',
  status: 'CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT_ADDED',
  runtimeOutput: 'NO_DRIFT',
  manualSmoke: 'REQUIRED_BEFORE_NEXT_RUNTIME_IMPORT',
} as const