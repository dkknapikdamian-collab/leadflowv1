import { statusRepository, STATUS_REPOSITORY_SOURCE_MAP } from './status-repository'
import { dateTimeRepository, dateTimeSourceMap } from './date-time-repository'
import { visualTokenSourceMap, globalVisualContract, metricTileVisualContract, recordListVisualContract } from './visual-repository'
import { runtimeAdoptionReadonly, runtimeAdoptionHardRules } from './runtime-adoption-readonly'

export const todayReadonlyBridgeStage = 'LF-PROD-SOT-004C' as const

export const todayReadonlyBridgeMode = 'TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE' as const

export const todayReadonlyBridgeSourceMap = {
  stage: todayReadonlyBridgeStage,
  mode: todayReadonlyBridgeMode,
  centralIndex: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  inputRuntimeAdoptionMap: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  previousAppRunReport: '_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  previousObsidianReport: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  sourceMapId: 'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP',
  consumerStageId: 'LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE',
} as const

export const todayReadonlyBridgeConsumers = [
  'Today audit consumer',
  'TodayStable audit consumer',
  'work items normalize audit consumer',
  'scheduling audit consumer',
  'calendar items audit consumer',
  'activity truth audit consumer',
] as const

export const todayReadonlyBridgeRepositories = {
  statusRepository,
  STATUS_REPOSITORY_SOURCE_MAP,
  dateTimeRepository,
  dateTimeSourceMap,
  visualTokenSourceMap,
  globalVisualContract,
  metricTileVisualContract,
  recordListVisualContract,
  runtimeAdoptionReadonly,
  runtimeAdoptionHardRules,
} as const

export const todayReadonlyBridgeAllowedAreas = [
  'read-only bridge contract',
  'guard-only validation',
  'fixture-only no-drift test',
  'manual smoke requirement documentation',
] as const

export const todayReadonlyBridgeBlockedAreas = [
  'Today runtime output',
  'TodayStable runtime output',
  'sorting logic',
  'filtering logic',
  'date bucket logic',
  'date precedence logic',
  'status labels',
  'badge tone',
  'visual colors',
  'remote calendar sync',
  'data writes',
] as const

export const todayReadonlyBridgeHardRules = {
  stage: todayReadonlyBridgeStage,
  mode: todayReadonlyBridgeMode,
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  sortingChange: 'FORBIDDEN',
  filteringChange: 'FORBIDDEN',
  bucketChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  statusLabelChange: 'FORBIDDEN',
  badgeChange: 'FORBIDDEN',
  colorChange: 'FORBIDDEN',
  googleCalendarSyncChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  sourceOfTruthUsage: 'GUARDS_TESTS_READONLY_BRIDGE_ONLY',
  TodayRuntimeAdoption: 'NOT_STARTED',
  TodayStableRuntimeAdoption: 'NOT_STARTED',
  visibleOutputDrift: 'FORBIDDEN',
  manualSmokeRequiredByDamian: 'REQUIRED_BEFORE_RUNTIME_IMPORT',
} as const

export const todayReadonlyBridgeNoDriftPolicy = {
  visibleOutputDrift: 'FORBIDDEN',
  runtimeBehaviorChange: 'FORBIDDEN',
  sortingChange: 'FORBIDDEN',
  filteringChange: 'FORBIDDEN',
  bucketChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  statusLabelChange: 'FORBIDDEN',
  badgeChange: 'FORBIDDEN',
  colorChange: 'FORBIDDEN',
  calendarSyncBoundaryChange: 'FORBIDDEN',
} as const

export const todayReadonlyBridgeFixturePolicy = [
  {
    fixture: 'lead row candidate',
    policy: 'document status/date/visual source only; do not change date precedence, bucket, status label, badge, tone or color',
  },
  {
    fixture: 'task row candidate',
    policy: 'document status/date/visual source only; do not change date precedence, bucket, status label, badge, tone or color',
  },
  {
    fixture: 'event row candidate',
    policy: 'document status/date/visual source only; do not change date precedence, bucket, status label, badge, tone or color',
  },
] as const

export const todayReadonlyBridgeManualSmokePolicy = {
  manualSmokeRequiredByDamian: 'REQUIRED_BEFORE_RUNTIME_IMPORT',
  smokeScope: 'Today and TodayStable bucket counts, selected labels, status badges and visual tones',
  runtimeImportGate: 'manual smoke must be green before any later runtime import',
} as const

export const todayReadonlyBridgeNextStages = [
  {
    stage: 'LF-PROD-SOT-004D',
    name: 'Lists/cards status/date/visual bridge',
    rule: 'separate future stage; do not start from LF-PROD-SOT-004C',
  },
] as const

export const todayReadonlyBridgeReport = {
  appReport: '_project/runs/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md',
  obsidianReport: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md',
  status: 'TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE_ADDED',
} as const

export const todayReadonlyBridge = {
  todayReadonlyBridgeStage,
  todayReadonlyBridgeMode,
  todayReadonlyBridgeSourceMap,
  todayReadonlyBridgeConsumers,
  todayReadonlyBridgeRepositories,
  todayReadonlyBridgeAllowedAreas,
  todayReadonlyBridgeBlockedAreas,
  todayReadonlyBridgeHardRules,
  todayReadonlyBridgeNoDriftPolicy,
  todayReadonlyBridgeFixturePolicy,
  todayReadonlyBridgeManualSmokePolicy,
  todayReadonlyBridgeNextStages,
  todayReadonlyBridgeReport,
} as const
