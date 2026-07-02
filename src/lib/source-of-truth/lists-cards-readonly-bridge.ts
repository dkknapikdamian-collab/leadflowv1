import { statusRepository, STATUS_REPOSITORY_SOURCE_MAP } from './status-repository'
import { dateTimeRepository, dateTimeSourceMap } from './date-time-repository'
import { visualTokenSourceMap, recordListVisualContract, badgeToneVisualContract, statusToneVisualContract, severityToneVisualContract } from './visual-repository'
import { runtimeAdoptionReadonly, runtimeAdoptionHardRules } from './runtime-adoption-readonly'
import { todayReadonlyBridge } from './today-readonly-bridge'

export const listsCardsReadonlyBridgeStage = 'LF-PROD-SOT-004D' as const

export const listsCardsReadonlyBridgeMode = 'LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE' as const

export const listsCardsReadonlyBridgeSourceMap = {
  stage: listsCardsReadonlyBridgeStage,
  mode: listsCardsReadonlyBridgeMode,
  centralIndex: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  inputRuntimeAdoptionMap: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  previousAppRunReport004B: '_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  previousAppRunReport004C: '_project/runs/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md',
  previousObsidianReport004B: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  previousObsidianReport004C: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md',
  sourceMapId: 'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP',
  consumerStageId: 'LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE',
} as const

export const listsCardsReadonlyBridgeConsumers = [
  'Leads list audit consumer',
  'Lead cards audit consumer',
  'LeadDetail card metadata audit consumer only',
  'Clients list audit consumer',
  'Client cards audit consumer',
  'ClientDetail card metadata audit consumer only',
  'Cases list audit consumer',
  'Case cards audit consumer only',
] as const

export const listsCardsReadonlyBridgeRepositories = {
  statusRepository,
  STATUS_REPOSITORY_SOURCE_MAP,
  dateTimeRepository,
  dateTimeSourceMap,
  visualTokenSourceMap,
  recordListVisualContract,
  badgeToneVisualContract,
  statusToneVisualContract,
  severityToneVisualContract,
  runtimeAdoptionReadonly,
  runtimeAdoptionHardRules,
  todayReadonlyBridge,
} as const

export const listsCardsReadonlyBridgeAllowedAreas = [
  'read-only bridge contract',
  'guard-only validation',
  'fixture-only no-drift test',
  'manual smoke requirement documentation',
  'lists and cards metadata map only',
] as const

export const listsCardsReadonlyBridgeBlockedAreas = [
  'Leads runtime output',
  'LeadDetail runtime output',
  'Clients runtime output',
  'ClientDetail runtime output',
  'Cases runtime output',
  'CaseDetail runtime output',
  'Today runtime output',
  'TodayStable runtime output',
  'sorting logic',
  'filtering logic',
  'list count logic',
  'card label logic',
  'status bucket logic',
  'status label logic',
  'date precedence logic',
  'silence marker logic',
  'next action label logic',
  'client health calculation',
  'client source and portal merge logic',
  'case lifecycle calculation',
  'badge tone',
  'visual colors',
  'remote calendar sync',
  'data writes',
] as const

export const listsCardsReadonlyBridgeEntityPolicies = {
  leads: {
    entity: 'Leads',
    runtimeAdoption: 'NOT_STARTED',
    LeadsRuntimeAdoption: 'NOT_STARTED',
    sourceBoundaries: ['lead status', 'lead date contract', 'record list visual contract'],
    noDrift: ['list counts', 'status buckets', 'status labels', 'silence markers', 'next-action labels', 'badges and colors'],
    risk: 'MEDIUM_HIGH_DATE_AND_SILENCE_BUCKET_RISK',
  },
  leadDetail: {
    entity: 'LeadDetail',
    runtimeAdoption: 'NOT_STARTED',
    LeadDetailRuntimeAdoption: 'NOT_STARTED',
    sourceBoundaries: ['lead detail card metadata only'],
    noDrift: ['displayed labels', 'history order', 'follow-up copy', 'work action center'],
    risk: 'MEDIUM_HIGH_NEXT_ACTION_FALLBACK_RISK',
  },
  clients: {
    entity: 'Clients',
    runtimeAdoption: 'NOT_STARTED',
    ClientsRuntimeAdoption: 'NOT_STARTED',
    sourceBoundaries: ['client health', 'client source', 'client portal', 'client date contract', 'record list visual contract'],
    noDrift: ['client card labels', 'source badges', 'health badges', 'activity ordering'],
    risk: 'MEDIUM_SOURCE_HEALTH_PORTAL_SEPARATION_RISK',
  },
  clientDetail: {
    entity: 'ClientDetail',
    runtimeAdoption: 'NOT_STARTED',
    ClientDetailRuntimeAdoption: 'NOT_STARTED',
    sourceBoundaries: ['client detail card metadata only'],
    noDrift: ['client health', 'client source', 'client portal', 'activity order'],
    risk: 'MEDIUM_RELATION_ACTIVITY_RISK',
  },
  cases: {
    entity: 'Cases',
    runtimeAdoption: 'NOT_STARTED',
    CasesRuntimeAdoption: 'NOT_STARTED',
    sourceBoundaries: ['case status', 'case lifecycle', 'case date contract', 'record list visual contract'],
    noDrift: ['case list labels', 'case lifecycle/status separation', 'case card badges and colors'],
    risk: 'MEDIUM_CASE_LIFECYCLE_SPLIT_RISK',
  },
  caseDetail: {
    entity: 'CaseDetail',
    runtimeAdoption: 'FORBIDDEN_UNTIL_004F',
    CaseDetailRuntimeAdoption: 'FORBIDDEN_UNTIL_004F',
    sourceBoundaries: ['explicitly out of LF-PROD-SOT-004D'],
    noDrift: ['do not touch CaseDetail'],
    risk: 'HIGH_RISK_CASE_DETAIL_HOTSPOT',
  },
} as const

export const listsCardsReadonlyBridgeHardRules = {
  stage: listsCardsReadonlyBridgeStage,
  mode: listsCardsReadonlyBridgeMode,
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  sortingChange: 'FORBIDDEN',
  filteringChange: 'FORBIDDEN',
  listCountChange: 'FORBIDDEN',
  cardLabelChange: 'FORBIDDEN',
  statusBucketChange: 'FORBIDDEN',
  statusLabelChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  silenceMarkerChange: 'FORBIDDEN',
  nextActionLabelChange: 'FORBIDDEN',
  clientHealthRecalculation: 'FORBIDDEN',
  clientSourcePortalMerge: 'FORBIDDEN',
  caseLifecycleRecalculation: 'FORBIDDEN',
  CaseDetailRuntimeAdoption: 'FORBIDDEN',
  badgeChange: 'FORBIDDEN',
  colorChange: 'FORBIDDEN',
  googleCalendarSyncChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  sourceOfTruthUsage: 'GUARDS_TESTS_READONLY_BRIDGE_ONLY',
  LeadsRuntimeAdoption: 'NOT_STARTED',
  LeadDetailRuntimeAdoption: 'NOT_STARTED',
  ClientsRuntimeAdoption: 'NOT_STARTED',
  ClientDetailRuntimeAdoption: 'NOT_STARTED',
  CasesRuntimeAdoption: 'NOT_STARTED',
  visibleOutputDrift: 'FORBIDDEN',
  manualSmokeRequiredByDamian: 'REQUIRED_BEFORE_RUNTIME_IMPORT',
} as const

export const listsCardsReadonlyBridgeNoDriftPolicy = {
  visibleOutputDrift: 'FORBIDDEN',
  runtimeBehaviorChange: 'FORBIDDEN',
  sortingChange: 'FORBIDDEN',
  filteringChange: 'FORBIDDEN',
  listCountChange: 'FORBIDDEN',
  cardLabelChange: 'FORBIDDEN',
  statusBucketChange: 'FORBIDDEN',
  statusLabelChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  silenceMarkerChange: 'FORBIDDEN',
  nextActionLabelChange: 'FORBIDDEN',
  clientHealthRecalculation: 'FORBIDDEN',
  clientSourcePortalMerge: 'FORBIDDEN',
  caseLifecycleRecalculation: 'FORBIDDEN',
  badgeChange: 'FORBIDDEN',
  colorChange: 'FORBIDDEN',
  remoteCalendarBoundaryChange: 'FORBIDDEN',
} as const

export const listsCardsReadonlyBridgeFixturePolicy = [
  {
    fixture: 'lead list/card candidate',
    policy: 'do not change record count, status buckets, status labels, silence markers, next action labels, badge tone or color',
  },
  {
    fixture: 'client list/card candidate',
    policy: 'do not change record count, health/source/portal separation, activity order, badge tone or color',
  },
  {
    fixture: 'case list/card candidate',
    policy: 'do not change record count, case lifecycle/status separation, badge tone or color; do not touch CaseDetail',
  },
] as const

export const listsCardsReadonlyBridgeManualSmokePolicy = {
  manualSmokeRequiredByDamian: 'REQUIRED_BEFORE_RUNTIME_IMPORT',
  smokeScope: 'Leads, Clients and Cases list counts, selected labels, status buckets, date precedence, badges and visual tones',
  runtimeImportGate: 'manual smoke must be green before any later runtime import',
} as const

export const listsCardsReadonlyBridgeNextStages = [
  {
    stage: 'LF-PROD-SOT-004E',
    name: 'Forms/modals/action visual bridge',
    rule: 'separate future stage; do not start from LF-PROD-SOT-004D',
  },
  {
    stage: 'LF-PROD-SOT-004F',
    name: 'CaseDetail isolated runtime adoption plan',
    rule: 'CaseDetail remains forbidden until this isolated stage',
  },
  {
    stage: 'LF-PROD-SOT-004G',
    name: 'Calendar and remote calendar boundary plan',
    rule: 'remote calendar sync remains forbidden in LF-PROD-SOT-004D',
  },
] as const

export const listsCardsReadonlyBridgeReport = {
  appReport: '_project/runs/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md',
  obsidianReport: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md',
  status: 'LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE_ADDED',
} as const

export const listsCardsReadonlyBridge = {
  listsCardsReadonlyBridgeStage,
  listsCardsReadonlyBridgeMode,
  listsCardsReadonlyBridgeSourceMap,
  listsCardsReadonlyBridgeConsumers,
  listsCardsReadonlyBridgeRepositories,
  listsCardsReadonlyBridgeAllowedAreas,
  listsCardsReadonlyBridgeBlockedAreas,
  listsCardsReadonlyBridgeEntityPolicies,
  listsCardsReadonlyBridgeHardRules,
  listsCardsReadonlyBridgeNoDriftPolicy,
  listsCardsReadonlyBridgeFixturePolicy,
  listsCardsReadonlyBridgeManualSmokePolicy,
  listsCardsReadonlyBridgeNextStages,
  listsCardsReadonlyBridgeReport,
} as const
