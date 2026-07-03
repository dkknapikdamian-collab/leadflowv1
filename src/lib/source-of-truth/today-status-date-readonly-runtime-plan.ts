export const todayStatusDateReadonlyRuntimeImportPlanStage = 'LF-PROD-SOT-004K' as const
export const todayStatusDateReadonlyRuntimeImportPlanMode = 'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN' as const

export const todayStatusDateReadonlyRuntimeImportPlanSourceMap = {
  stage: todayStatusDateReadonlyRuntimeImportPlanStage,
  mode: todayStatusDateReadonlyRuntimeImportPlanMode,
  previousAppRunReport004J: '_project/runs/LF-PROD-SOT-004J_MANUAL_SMOKE_AND_NEXT_RUNTIME_IMPORT_DECISION.md',
  requiredInputDecision: 'MANUAL_SMOKE_PASS_AND_TODAY_STATUS_DATE_READONLY_IMPORT_NEXT',
  nextRuntimeImportCandidate: 'LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT',
} as const

export const todayStatusDateReadonlyRuntimeImportPlanRepositories = {
  statusRepository: 'READONLY_REFERENCE_ONLY',
  taskStatus: 'READONLY_REFERENCE_ONLY',
  eventStatus: 'READONLY_REFERENCE_ONLY',
  dateTimeRepository: 'READONLY_REFERENCE_ONLY',
  dateTimeSourceMap: 'READONLY_REFERENCE_ONLY',
  todayReadonlyBridge: 'READONLY_REFERENCE_ONLY',
} as const

export const todayStatusDateReadonlyRuntimeImportPlanHardRules = {
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  TodayStatusDateReadonlyRuntimeImport: 'NOT_STARTED_IN_004K_PLAN_ONLY',
  TodayRuntimeAdoption: 'NOT_STARTED',
  TodayTaskEventCountChange: 'FORBIDDEN',
  TaskStatusLabelChange: 'FORBIDDEN',
  EventStatusLabelChange: 'FORBIDDEN',
  DoneCancelledPendingLabelChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  dateOnlyDefaultChange: 'FORBIDDEN',
  sourceOfTruthUsage: 'GUARDS_TESTS_BOUNDARY_PLAN_ONLY',
  visibleOutputDrift: 'FORBIDDEN',
  nextRuntimeImportDecision: 'NEXT_RUNTIME_IMPORT_004L_CANDIDATE_AFTER_004K_PASS',
} as const

export const todayStatusDateReadonlyRuntimeImportPlanNoDriftPolicy = todayStatusDateReadonlyRuntimeImportPlanHardRules

export const todayStatusDateReadonlyRuntimeImportPlanFixturePolicy = [
  'task status done anchor: no output change',
  'task status cancelled anchor: no output change',
  'task status pending anchor: no output change',
  'event status anchor: no output change',
  'task scheduledAt anchor: no output change',
  'event startAt anchor: no output change',
  'Today task/event count anchor: no output change',
] as const

export const todayStatusDateReadonlyRuntimeImportPlanManualSmokePolicy = {
  inputSmokeStatusRequired: 'MANUAL_SMOKE_PASS',
  inputNextDecisionRequired: 'TODAY_STATUS_DATE_READONLY_IMPORT_NEXT',
  runtimeImportGate: '004K must pass before 004L can be written',
} as const

export const todayStatusDateReadonlyRuntimeImportPlanNextDecision = {
  nextRuntimeImportCandidate: 'LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT',
  doNotCreate004LIn004K: true,
} as const

export const todayStatusDateReadonlyRuntimeImportPlanReport = {
  appReport: '_project/runs/LF-PROD-SOT-004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN.md',
  status: 'PLAN_ONLY_GITHUB_APPLIED_LOCAL_VERIFICATION_REQUIRED',
} as const
