import { statusRepository, STATUS_REPOSITORY_SOURCE_MAP } from './status-repository'
import { dateTimeRepository, dateTimeSourceMap } from './date-time-repository'
import {
  visualTokenSourceMap,
  globalVisualContract,
  detailViewVisualContract,
  statusToneVisualContract,
  severityToneVisualContract,
} from './visual-repository'
import { runtimeAdoptionReadonly, runtimeAdoptionHardRules } from './runtime-adoption-readonly'
import { listsCardsReadonlyBridge } from './lists-cards-readonly-bridge'
import { formsModalsActionVisualBridge } from './forms-modals-action-visual-readonly-bridge'

export const caseDetailIsolatedAdoptionPlanStage = 'LF-PROD-SOT-004F' as const

export const caseDetailIsolatedAdoptionPlanMode = 'CASEDETAIL_ISOLATED_ADOPTION_PLAN' as const

export const caseDetailIsolatedAdoptionPlanSourceMap = {
  stage: caseDetailIsolatedAdoptionPlanStage,
  mode: caseDetailIsolatedAdoptionPlanMode,
  centralIndex: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  inputRuntimeAdoptionMap: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  previousAppRunReport004D: '_project/runs/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md',
  previousAppRunReport004E: '_project/runs/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md',
  previousObsidianReport004E: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md',
  sourceMapId: 'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP',
  consumerStageId: 'LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN',
  adoptionCategory: 'CASEDETAIL_DO_NOT_TOUCH_YET / HIGH_RISK_RUNTIME_ADOPTION / HIGH_RISK_VISUAL_ADOPTION',
  risk: 'VERY_HIGH',
} as const

export const caseDetailIsolatedAdoptionPlanConsumers = [
  'CaseDetail isolated plan consumer only',
  'CaseDetail anchor map guard consumer only',
  'CaseDetail risk map guard consumer only',
  'CaseDetail manual smoke checklist consumer only',
] as const

export const caseDetailIsolatedAdoptionPlanRepositories = {
  statusRepository,
  STATUS_REPOSITORY_SOURCE_MAP,
  dateTimeRepository,
  dateTimeSourceMap,
  visualTokenSourceMap,
  globalVisualContract,
  detailViewVisualContract,
  statusToneVisualContract,
  severityToneVisualContract,
  runtimeAdoptionReadonly,
  runtimeAdoptionHardRules,
  listsCardsReadonlyBridge,
  formsModalsActionVisualBridge,
  CaseDetailRepositoryImport: 'FORBIDDEN_IN_RUNTIME',
} as const

export const caseDetailIsolatedAdoptionPlanAnchorMap = {
  caseDetailHeaderAnchor: 'header identity, primary metadata and top action zone anchor only',
  caseLifecycleAnchor: 'lifecycle bucket anchor only; no recalculation',
  caseStatusAnchor: 'case status label anchor only; no redefinition',
  serviceWorkspaceAnchor: 'service workspace tabs and panels anchor only',
  historyTimelineAnchor: 'history timeline rendering and order anchor only',
  notesAnchor: 'notes surface anchor only',
  checklistAnchor: 'checklist surface anchor only',
  actionPanelAnchor: 'quick and contextual action panel anchor only',
  rightRailAnchor: 'right rail and owner visible summary anchor only',
  financeSettlementAnchor: 'finance settlement summary anchor only',
  paymentStatusAnchor: 'payment status display anchor only',
  commissionStatusAnchor: 'commission status display anchor only',
  plannedActionsAnchor: 'planned action display and next movement anchor only',
  ownerControlAnchor: 'owner control summary anchor only',
  activityTruthAnchor: 'activity truth and timeline source separation anchor only',
  visualLayoutAnchor: 'visual layout shell and spacing anchor only',
} as const

export const caseDetailIsolatedAdoptionPlanBlockedAreas = [
  'CaseDetail runtime output',
  'CaseDetail repository import in runtime',
  'layout output',
  'case status output',
  'case lifecycle output',
  'activity timeline output',
  'service workspace output',
  'notes output',
  'checklist output',
  'action panel output',
  'right rail output',
  'finance settlement output',
  'payment status output',
  'commission status output',
  'amount calculation output',
  'date precedence output',
  'status label output',
  'badge and color output',
  'Calendar runtime output',
] as const

export const caseDetailIsolatedAdoptionPlanAllowedAreas = [
  'isolated read-only plan',
  'anchor map metadata only',
  'risk map metadata only',
  'no-drift policy metadata only',
  'fixture policy metadata only',
  'manual smoke policy metadata only',
  'guard and test verification only',
  'report and SOT index update only',
] as const

export const caseDetailIsolatedAdoptionPlanRiskMap = {
  overallRisk: 'VERY_HIGH',
  caseDetailRuntimeRisk: 'VERY_HIGH',
  caseDetailVisualRisk: 'VERY_HIGH',
  caseLifecycleRisk: 'HIGH',
  caseStatusRisk: 'HIGH',
  activityTimelineRisk: 'HIGH',
  serviceWorkspaceRisk: 'HIGH',
  notesChecklistRisk: 'HIGH',
  actionPanelRisk: 'HIGH',
  rightRailRisk: 'HIGH',
  financeSettlementRisk: 'VERY_HIGH',
  datePrecedenceRisk: 'HIGH',
  badgeColorRisk: 'HIGH',
  adoptionGate: 'MANUAL_SMOKE_REQUIRED_AND_BLOCKING',
} as const

export const caseDetailIsolatedAdoptionPlanHardRules = {
  stage: caseDetailIsolatedAdoptionPlanStage,
  mode: caseDetailIsolatedAdoptionPlanMode,
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  layoutChange: 'FORBIDDEN',
  componentReplacement: 'FORBIDDEN',
  CaseDetailRuntimeAdoption: 'NOT_STARTED',
  CaseDetailRepositoryImport: 'FORBIDDEN_IN_RUNTIME',
  caseStatusRedefinition: 'FORBIDDEN',
  caseLifecycleRecalculation: 'FORBIDDEN',
  activityTimelineChange: 'FORBIDDEN',
  serviceWorkspaceChange: 'FORBIDDEN',
  checklistChange: 'FORBIDDEN',
  notesChange: 'FORBIDDEN',
  actionPanelChange: 'FORBIDDEN',
  rightRailChange: 'FORBIDDEN',
  financeSettlementChange: 'FORBIDDEN',
  paymentStatusChange: 'FORBIDDEN',
  commissionStatusChange: 'FORBIDDEN',
  amountCalculationChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  statusLabelChange: 'FORBIDDEN',
  badgeChange: 'FORBIDDEN',
  colorChange: 'FORBIDDEN',
  googleCalendarSyncChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  sourceOfTruthUsage: 'GUARDS_TESTS_ISOLATED_PLAN_ONLY',
  visibleOutputDrift: 'FORBIDDEN',
  manualSmokeRequiredByDamian: 'REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT',
  CalendarRuntimeAdoption: 'FORBIDDEN_UNTIL_004G',
  FinanceRuntimeAdoption: 'FORBIDDEN_IN_004F',
} as const

export const caseDetailIsolatedAdoptionPlanNoDriftPolicy = {
  visibleOutputDrift: 'FORBIDDEN',
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  layoutChange: 'FORBIDDEN',
  componentReplacement: 'FORBIDDEN',
  caseStatusRedefinition: 'FORBIDDEN',
  caseLifecycleRecalculation: 'FORBIDDEN',
  activityTimelineChange: 'FORBIDDEN',
  serviceWorkspaceChange: 'FORBIDDEN',
  checklistChange: 'FORBIDDEN',
  notesChange: 'FORBIDDEN',
  actionPanelChange: 'FORBIDDEN',
  rightRailChange: 'FORBIDDEN',
  financeSettlementChange: 'FORBIDDEN',
  paymentStatusChange: 'FORBIDDEN',
  commissionStatusChange: 'FORBIDDEN',
  amountCalculationChange: 'FORBIDDEN',
  datePrecedenceChange: 'FORBIDDEN',
  statusLabelChange: 'FORBIDDEN',
  badgeChange: 'FORBIDDEN',
  colorChange: 'FORBIDDEN',
  googleCalendarSyncChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
} as const

export const caseDetailIsolatedAdoptionPlanFixturePolicy = [
  {
    fixture: 'CaseDetail header anchor',
    policy: 'do not change runtime, layout, CSS, header identity, top metadata or top action zone',
  },
  {
    fixture: 'Case lifecycle/status anchor',
    policy: 'do not change lifecycle calculation, status label, lifecycle bucket or status visual tone',
  },
  {
    fixture: 'service workspace anchor',
    policy: 'do not change service workspace tabs, panels, notes, checklist or action panel',
  },
  {
    fixture: 'history timeline anchor',
    policy: 'do not change timeline source, order, grouping, copy, date precedence or activity truth separation',
  },
  {
    fixture: 'notes/checklist anchor',
    policy: 'do not change notes, checklist, completion semantics, sorting, visibility or persistence behavior',
  },
  {
    fixture: 'action panel anchor',
    policy: 'do not change contextual actions, quick actions, owner control action semantics or button tones',
  },
  {
    fixture: 'right rail anchor',
    policy: 'do not change right rail grouping, ownership summary, financial summary or visual layout',
  },
  {
    fixture: 'finance settlement anchor',
    policy: 'do not change finance settlement, payment, commission, amount calculation or summary labels',
  },
  {
    fixture: 'payment/commission/amount anchor',
    policy: 'do not change payment status, commission status, amount calculation or settlement precedence',
  },
] as const

export const caseDetailIsolatedAdoptionPlanManualSmokePolicy = {
  manualSmokeRequiredByDamian: 'REQUIRED_AND_BLOCKING_BEFORE_RUNTIME_IMPORT',
  smokeScope: 'CaseDetail header, lifecycle, status, workspace, history, notes, checklist, actions, right rail and settlement surfaces',
  runtimeImportGate: 'manual smoke must be green before any later CaseDetail runtime import',
} as const

export const caseDetailIsolatedAdoptionPlanNextStages = [
  {
    stage: 'LF-PROD-SOT-004G',
    name: 'Calendar date-time boundary adoption plan',
    rule: 'Calendar runtime adoption and remote calendar sync remain forbidden until this isolated plan',
  },
] as const

export const caseDetailIsolatedAdoptionPlanReport = {
  appReport: '_project/runs/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md',
  obsidianReport: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004F_CASEDETAIL_ISOLATED_ADOPTION_PLAN.md',
  status: 'CASEDETAIL_ISOLATED_ADOPTION_PLAN_REMOTE_ADDED_LOCAL_VERIFICATION_PENDING',
} as const
