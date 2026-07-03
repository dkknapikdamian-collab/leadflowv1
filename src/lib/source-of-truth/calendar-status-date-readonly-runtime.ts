import { eventStatus, taskStatus } from './status-repository'
import { eventDateContract, taskDateContract } from './date-time-repository'
import { runtimeAdoptionReadonly } from './runtime-adoption-readonly'
import { tasksStatusDateReadonlyRuntimeReport } from './tasks-status-date-readonly-runtime'

export const calendarStatusDateReadonlyRuntimeStage = 'LF-PROD-SOT-004O' as const
export const calendarStatusDateReadonlyRuntimeMode = 'CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT' as const
export const calendarStatusDateReadonlyRuntimeInputDecision = {
  previousRuntimeImport: 'LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT',
  ownerDecision: 'LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED',
  previousRuntimeImportStatus: tasksStatusDateReadonlyRuntimeReport.runtimeImport,
  previousSmokeDebtStatus: tasksStatusDateReadonlyRuntimeReport.smokeDebtStatus,
} as const

export const calendarStatusDateReadonlyRuntimeSmokeDebt = {
  smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M',
  smokeDebtStatus: 'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',
  smokeStatus: 'MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS',
  manualSmokePassClaim: 'FORBIDDEN',
  fullManualSmokeRequiredBeforeFinalAcceptance: 'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE',
} as const

export const calendarStatusDateReadonlyRuntimeSourceOfTruthUsage = {
  runtimeImport: 'READONLY_METADATA_IMPORT_ONLY',
  sourceOfTruthUsage: 'READONLY_RUNTIME_BOUNDARY_IMPORT',
  taskStatusSource: taskStatus.contract,
  eventStatusSource: eventStatus.contract,
  taskDateSource: taskDateContract.dateOnlyPolicy,
  eventDateSource: eventDateContract.dateOnlyPolicy,
  runtimeAdoptionReadonlyStatus: runtimeAdoptionReadonly.runtimeAdoptionReport.status,
} as const

export const calendarStatusDateReadonlyRuntimeAllowedImports = [
  './status-repository',
  './date-time-repository',
  './runtime-adoption-readonly',
  './tasks-status-date-readonly-runtime',
] as const

export const calendarStatusDateReadonlyRuntimeForbiddenChanges = {
  outputDrift: 'FORBIDDEN',
  CalendarCountChange: 'FORBIDDEN',
  CalendarStatusLabelChange: 'FORBIDDEN',
  CalendarDatePrecedenceChange: 'FORBIDDEN',
  CalendarDateOnlyDefaultChange: 'FORBIDDEN',
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

export const calendarStatusDateReadonlyRuntimeNoDriftContract = {
  noOutputDrift: 'NO_OUTPUT_DRIFT',
  runtimeImport: 'READONLY_METADATA_IMPORT_ONLY',
  sourceOfTruthUsage: 'READONLY_RUNTIME_BOUNDARY_IMPORT',
  outputDrift: 'FORBIDDEN',
  visibleOutput: 'NO_DRIFT_BY_STATIC_CONTRACT',
} as const

export const calendarStatusDateReadonlyRuntimeStatusContract = {
  CalendarStatusLabelChange: 'FORBIDDEN',
  taskStatusSource: 'READONLY_REFERENCE_ONLY',
  eventStatusSource: 'READONLY_REFERENCE_ONLY',
} as const

export const calendarStatusDateReadonlyRuntimeDateContract = {
  CalendarDatePrecedenceChange: 'FORBIDDEN',
  CalendarDateOnlyDefaultChange: 'FORBIDDEN',
  localWarsawBusinessDayBoundaryChange: 'FORBIDDEN',
  taskDateOnlyDefaultT0900Change: 'FORBIDDEN',
  eventDateOnlyDefaultT0900Change: 'FORBIDDEN',
} as const

export const calendarStatusDateReadonlyRuntimeCountContract = {
  CalendarCountChange: 'FORBIDDEN',
} as const

export const calendarStatusDateReadonlyRuntimeGoogleCalendarContract = {
  NO_GCAL_CHANGE: true,
  GoogleCalendarSyncChange: 'FORBIDDEN',
  GoogleCalendarMapperChange: 'FORBIDDEN',
  remoteProviderChange: 'FORBIDDEN',
} as const

export const calendarStatusDateReadonlyRuntimeManualSmokePolicy = {
  smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M',
  smokeDebtStatus: 'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',
  smokeStatus: 'MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS',
  fullManualSmokeRequiredBeforeFinalAcceptance: 'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE',
} as const

export const calendarStatusDateReadonlyRuntimeNextStages = {
  nextStage: 'NEXT_READONLY_NO_DRIFT_STAGE_OR_FINAL_SMOKE_GATE',
  doNotCreate004PIn004O: true,
} as const

export const calendarStatusDateReadonlyRuntimeReport = {
  stage: calendarStatusDateReadonlyRuntimeStage,
  mode: calendarStatusDateReadonlyRuntimeMode,
  previousRuntimeImport: calendarStatusDateReadonlyRuntimeInputDecision.previousRuntimeImport,
  ownerDecision: calendarStatusDateReadonlyRuntimeInputDecision.ownerDecision,
  smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M',
  smokeDebtStatus: 'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',
  smokeStatus: 'MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS',
  runtimeImport: 'READONLY_METADATA_IMPORT_ONLY',
  sourceOfTruthUsage: 'READONLY_RUNTIME_BOUNDARY_IMPORT',
  outputDrift: 'FORBIDDEN',
  NO_OUTPUT_DRIFT: true,
  NO_GCAL_CHANGE: true,
  CalendarCountChange: 'FORBIDDEN',
  CalendarStatusLabelChange: 'FORBIDDEN',
  CalendarDatePrecedenceChange: 'FORBIDDEN',
  CalendarDateOnlyDefaultChange: 'FORBIDDEN',
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
  fullManualSmokeRequiredBeforeFinalAcceptance: 'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE',
  nextStage: calendarStatusDateReadonlyRuntimeNextStages.nextStage,
} as const