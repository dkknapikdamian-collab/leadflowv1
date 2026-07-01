export const runtimeAdoptionStage = 'LF-PROD-SOT-004B' as const

export const runtimeAdoptionMode = 'SAFE_READ_ONLY_ADOPTION_STAGE_1' as const

export const runtimeAdoptionSourceMap = {
  centralIndex: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  obsidianSourceMap: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  appRunSourceMap: '_project/runs/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  sourceMapId: 'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP',
  consumerStageId: 'LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1',
} as const

export const safeReadOnlyAdoptionAreas = [
  'Owner Control / Activity Truth / Work Items — guards, tests and adapters only',
  'PageShell / Sidebar / UI primitives — guards, tests and inventory only',
  'Repository boundary checks — status, date-time and visual separation',
  'No-output-drift checks — fixture-based read-only validation',
] as const

export const blockedRuntimeAdoptionAreas = [
  'Today',
  'TodayStable',
  'Leads',
  'LeadDetail',
  'Clients',
  'ClientDetail',
  'Cases',
  'CaseDetail',
  'Tasks',
  'Calendar',
  'Billing',
  'Finance',
  'Settings',
  'AI drafts',
  'Google Calendar sync',
  'Supabase/API',
  'SQL',
] as const

export const runtimeAdoptionHardRules = {
  stage: runtimeAdoptionStage,
  mode: runtimeAdoptionMode,
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  statusRepositoryRuntimeAdoption: 'NOT_STARTED',
  dateTimeRepositoryRuntimeAdoption: 'NOT_STARTED',
  visualRepositoryRuntimeAdoption: 'NOT_STARTED',
  sourceOfTruthUsage: 'GUARDS_TESTS_ADAPTERS_ONLY',
  visibleOutputDrift: 'FORBIDDEN',
} as const

export const runtimeAdoptionRepositoryBoundaries = {
  statusRepositoryRuntimeAdoption: 'NOT_STARTED',
  dateTimeRepositoryRuntimeAdoption: 'NOT_STARTED',
  visualRepositoryRuntimeAdoption: 'NOT_STARTED',
  allowedImportZone: 'scripts/guards, tests, read-only adapters only',
  forbiddenImportZone: 'src/pages, src/components, runtime route modules, Supabase/API, SQL/migrations',
  forbiddenCircularDependency: 'status/date-time/visual repositories must not import runtime-adoption-readonly',
} as const

export const runtimeAdoptionNoOutputDriftPolicy = {
  visibleOutputDrift: 'FORBIDDEN',
  runtimeBehaviorChange: 'FORBIDDEN',
  sortingChange: 'FORBIDDEN',
  filteringChange: 'FORBIDDEN',
  dateBucketChange: 'FORBIDDEN',
  badgeChange: 'FORBIDDEN',
  colorChange: 'FORBIDDEN',
  labelChange: 'FORBIDDEN',
} as const

export const runtimeAdoptionNextStages = [
  {
    stage: 'LF-PROD-SOT-004C',
    name: 'Today/status/date visual read-only bridge',
    rule: 'separate future stage; do not start from LF-PROD-SOT-004B',
  },
] as const

export const runtimeAdoptionReport = {
  appReport: '_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  obsidianReport: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  status: 'SAFE_READ_ONLY_RUNTIME_ADOPTION_STAGE_1_ADDED',
} as const

export const runtimeAdoptionReadonly = {
  runtimeAdoptionStage,
  runtimeAdoptionMode,
  runtimeAdoptionSourceMap,
  safeReadOnlyAdoptionAreas,
  blockedRuntimeAdoptionAreas,
  runtimeAdoptionHardRules,
  runtimeAdoptionRepositoryBoundaries,
  runtimeAdoptionNoOutputDriftPolicy,
  runtimeAdoptionNextStages,
  runtimeAdoptionReport,
} as const
