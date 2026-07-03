import { todayStatusDateReadonlyRuntimeImportPlanReport } from './today-status-date-readonly-runtime-plan'
import { taskStatus, eventStatus } from './status-repository'
import { taskDateContract, eventDateContract } from './date-time-repository'
import { runtimeAdoptionReadonly } from './runtime-adoption-readonly'
import { calendarDateTimeBoundaryReadonlyRuntimeReport } from './calendar-date-time-boundary-readonly-runtime'

export const todayStatusDateReadonlyRuntimeStage = 'LF-PROD-SOT-004L' as const
export const todayStatusDateReadonlyRuntimeMode = 'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT' as const

export const todayStatusDateReadonlyRuntimeInputPlan = {
  stage: todayStatusDateReadonlyRuntimeStage,
  mode: todayStatusDateReadonlyRuntimeMode,
  inputPlan: 'LF-PROD-SOT-004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN',
  inputDecision: 'TODAY_STATUS_DATE_READONLY_IMPORT_NEXT',
  sourcePlanStatus: todayStatusDateReadonlyRuntimeImportPlanReport.status,
  readyFor004L: todayStatusDateReadonlyRuntimeImportPlanReport.readyFor004L,
} as const

export const todayStatusDateReadonlyRuntimeSourceOfTruthUsage = {
  runtimeImport: 'READONLY_METADATA_IMPORT_ONLY',
  sourceOfTruthUsage: 'READONLY_RUNTIME_BOUNDARY_IMPORT',
  statusRepository: {
    task: taskStatus.contract,
    event: eventStatus.contract,
  },
  dateTimeRepository: {
    task: taskDateContract.dateOnlyPolicy,
    event: eventDateContract.dateOnlyPolicy,
  },
  runtimeAdoptionReadonlyStatus: runtimeAdoptionReadonly.runtimeAdoptionReport.status,
  previousCalendarBoundaryRuntimeStatus: calendarDateTimeBoundaryReadonlyRuntimeReport.status,
} as const

export const todayStatusDateReadonlyRuntimeAllowedImports = [
  './today-status-date-readonly-runtime-plan',
  './status-repository',
  './date-time-repository',
  './runtime-adoption-readonly',
  './calendar-date-time-boundary-readonly-runtime',
] as const

export const todayStatusDateReadonlyRuntimeForbiddenChanges = {
  outputDrift: 'FORBIDDEN',
  TodayTaskEventCountChange: 'FORBIDDEN',
  TodaySectionCountChange: 'FORBIDDEN',
  TodayEmptyStateChange: 'FORBIDDEN',
  TaskStatusLabelChange: 'FORBIDDEN',
  EventStatusLabelChange: 'FORBIDDEN',
  DoneCancelledPendingLabelChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  dateOnlyDefaultChange: 'FORBIDDEN',
  taskDateOnlyDefaultT0900Change: 'FORBIDDEN',
  eventDateOnlyDefaultT0900Change: 'FORBIDDEN',
  localWarsawBusinessDayBoundaryChange: 'FORBIDDEN',
  GoogleCalendarSyncChange: 'FORBIDDEN',
  GoogleCalendarMapperChange: 'FORBIDDEN',
  remoteProviderChange: 'FORBIDDEN',
  UIChange: 'FORBIDDEN',
  CSSChange: 'FORBIDDEN',
  SQLChange: 'FORBIDDEN',
  SupabaseAPIChange: 'FORBIDDEN',
  CaseDetailChange: 'FORBIDDEN',
  FinanceChange: 'FORBIDDEN',
} as const

export const todayStatusDateReadonlyRuntimeNoDriftContract = {
  noOutputDrift: 'NO_OUTPUT_DRIFT',
  runtimeImport: 'READONLY_METADATA_IMPORT_ONLY',
  outputDrift: todayStatusDateReadonlyRuntimeForbiddenChanges.outputDrift,
  visibleOutput: 'NO_DRIFT_BY_STATIC_CONTRACT',
} as const

export const todayStatusDateReadonlyRuntimeStatusContract = {
  TaskStatusLabelChange: todayStatusDateReadonlyRuntimeForbiddenChanges.TaskStatusLabelChange,
  EventStatusLabelChange: todayStatusDateReadonlyRuntimeForbiddenChanges.EventStatusLabelChange,
  DoneCancelledPendingLabelChange: todayStatusDateReadonlyRuntimeForbiddenChanges.DoneCancelledPendingLabelChange,
  taskStatusSource: 'READONLY_REFERENCE_ONLY',
  eventStatusSource: 'READONLY_REFERENCE_ONLY',
} as const

export const todayStatusDateReadonlyRuntimeDateContract = {
  datePrecedenceChange: todayStatusDateReadonlyRuntimeForbiddenChanges.datePrecedenceChange,
  dateOnlyDefaultChange: todayStatusDateReadonlyRuntimeForbiddenChanges.dateOnlyDefaultChange,
  taskDateOnlyDefaultT0900Change: todayStatusDateReadonlyRuntimeForbiddenChanges.taskDateOnlyDefaultT0900Change,
  eventDateOnlyDefaultT0900Change: todayStatusDateReadonlyRuntimeForbiddenChanges.eventDateOnlyDefaultT0900Change,
  localWarsawBusinessDayBoundaryChange: todayStatusDateReadonlyRuntimeForbiddenChanges.localWarsawBusinessDayBoundaryChange,
} as const

export const todayStatusDateReadonlyRuntimeCountContract = {
  TodayTaskEventCountChange: todayStatusDateReadonlyRuntimeForbiddenChanges.TodayTaskEventCountChange,
  TodaySectionCountChange: todayStatusDateReadonlyRuntimeForbiddenChanges.TodaySectionCountChange,
  TodayEmptyStateChange: todayStatusDateReadonlyRuntimeForbiddenChanges.TodayEmptyStateChange,
} as const

export const todayStatusDateReadonlyRuntimeManualSmokePolicy = {
  manualSmokeRequiredAfter004L: 'REQUIRED',
  manualSmokeRequiredBeforeNextRuntimeImport: 'REQUIRED',
} as const

export const todayStatusDateReadonlyRuntimeNextStages = {
  nextStage: 'LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION',
  doNotCreate004MIn004L: true,
} as const

export const todayStatusDateReadonlyRuntimeReport = {
  stage: todayStatusDateReadonlyRuntimeStage,
  mode: todayStatusDateReadonlyRuntimeMode,
  inputPlan: todayStatusDateReadonlyRuntimeInputPlan.inputPlan,
  inputDecision: todayStatusDateReadonlyRuntimeInputPlan.inputDecision,
  sourcePlanStatus: 'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN_CLOSED',
  runtimeImport: 'READONLY_METADATA_IMPORT_ONLY',
  sourceOfTruthUsage: 'READONLY_RUNTIME_BOUNDARY_IMPORT',
  outputDrift: 'FORBIDDEN',
  TodayTaskEventCountChange: 'FORBIDDEN',
  TodaySectionCountChange: 'FORBIDDEN',
  TodayEmptyStateChange: 'FORBIDDEN',
  TaskStatusLabelChange: 'FORBIDDEN',
  EventStatusLabelChange: 'FORBIDDEN',
  DoneCancelledPendingLabelChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  dateOnlyDefaultChange: 'FORBIDDEN',
  taskDateOnlyDefaultT0900Change: 'FORBIDDEN',
  eventDateOnlyDefaultT0900Change: 'FORBIDDEN',
  localWarsawBusinessDayBoundaryChange: 'FORBIDDEN',
  GoogleCalendarSyncChange: 'FORBIDDEN',
  GoogleCalendarMapperChange: 'FORBIDDEN',
  remoteProviderChange: 'FORBIDDEN',
  UIChange: 'FORBIDDEN',
  CSSChange: 'FORBIDDEN',
  SQLChange: 'FORBIDDEN',
  SupabaseAPIChange: 'FORBIDDEN',
  CaseDetailChange: 'FORBIDDEN',
  FinanceChange: 'FORBIDDEN',
  manualSmokeRequiredAfter004L: 'REQUIRED',
  nextStage: todayStatusDateReadonlyRuntimeNextStages.nextStage,
} as const