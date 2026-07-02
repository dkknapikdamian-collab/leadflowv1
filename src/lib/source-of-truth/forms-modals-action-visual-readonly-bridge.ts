import { statusRepository, STATUS_REPOSITORY_SOURCE_MAP } from './status-repository'
import {
  visualTokenSourceMap,
  globalVisualContract,
  buttonActionVisualContract,
  formFieldVisualContract,
  modalDialogVisualContract,
} from './visual-repository'
import { runtimeAdoptionReadonly, runtimeAdoptionHardRules } from './runtime-adoption-readonly'
import { todayReadonlyBridge } from './today-readonly-bridge'
import { listsCardsReadonlyBridge } from './lists-cards-readonly-bridge'

export const formsModalsActionVisualBridgeStage = 'LF-PROD-SOT-004E' as const

export const formsModalsActionVisualBridgeMode = 'FORMS_MODALS_ACTION_VISUAL_BRIDGE' as const

export const formsModalsActionVisualBridgeSourceMap = {
  stage: formsModalsActionVisualBridgeStage,
  mode: formsModalsActionVisualBridgeMode,
  centralIndex: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md',
  inputRuntimeAdoptionMap: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md',
  previousAppRunReport004B: '_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md',
  previousAppRunReport004C: '_project/runs/LF-PROD-SOT-004C_TODAY_STATUS_DATE_VISUAL_READ_ONLY_BRIDGE.md',
  previousAppRunReport004D: '_project/runs/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md',
  previousObsidianReport004D: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004D_LISTS_CARDS_STATUS_DATE_VISUAL_BRIDGE.md',
  sourceMapId: 'LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP',
  consumerStageId: 'LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE',
} as const

export const formsModalsActionVisualBridgeConsumers = [
  'reusable UI primitives read-only inventory consumer',
  'forms read-only inventory consumer',
  'modals read-only inventory consumer',
  'dialogs read-only inventory consumer',
  'action controls read-only inventory consumer',
  'settings visual surfaces read-only inventory consumer',
  'AI drafts visual review surfaces read-only inventory consumer only',
] as const

export const formsModalsActionVisualBridgeRepositories = {
  statusRepository,
  STATUS_REPOSITORY_SOURCE_MAP,
  visualTokenSourceMap,
  globalVisualContract,
  buttonActionVisualContract,
  formFieldVisualContract,
  modalDialogVisualContract,
  runtimeAdoptionReadonly,
  runtimeAdoptionHardRules,
  todayReadonlyBridge,
  listsCardsReadonlyBridge,
  controlledSelectBoundary: 'statusRepository is referenced only for already-centralized controlled select values',
} as const

export const formsModalsActionVisualBridgeAllowedAreas = [
  'read-only bridge contract',
  'guard-only validation',
  'fixture-only no-drift test',
  'manual smoke requirement documentation',
  'forms modals dialogs actions inventory metadata only',
  'settings visual surface metadata only',
  'AI drafts visual review metadata only',
] as const

export const formsModalsActionVisualBridgeBlockedAreas = [
  'forms runtime output',
  'modals runtime output',
  'dialogs runtime output',
  'action controls runtime output',
  'settings runtime output',
  'AI drafts runtime output',
  'AI provider runtime output',
  'AI model choice',
  'CaseDetail runtime output',
  'Calendar runtime output',
  'remote calendar sync',
  'finance runtime output',
  'data writes',
  'CSS and Tailwind layers',
  'component replacement',
  'visual redesign',
] as const

export const formsModalsActionVisualBridgePrimitivePolicies = {
  actionControls: {
    runtimeAdoption: 'NOT_STARTED',
    ActionControlsRuntimeAdoption: 'NOT_STARTED',
    sourceBoundary: 'buttonActionVisualContract plus existing action primitives only',
    noDrift: ['raw button clone', 'local action control clone', 'local icon color patch', 'inline action style', 'new CSS patch layer'],
    risk: 'MEDIUM_HIGH_ACTION_CONTROL_DRIFT_RISK',
  },
  reusablePrimitives: {
    runtimeAdoption: 'NOT_STARTED',
    sourceBoundary: 'globalVisualContract and visualTokenSourceMap only',
    noDrift: ['component replacement', 'className migration', 'visual redesign', 'new primitive clone'],
    risk: 'MEDIUM_VISUAL_PRIMITIVE_CONTRACT_RISK',
  },
} as const

export const formsModalsActionVisualBridgeFormPolicies = {
  forms: {
    runtimeAdoption: 'NOT_STARTED',
    FormsRuntimeAdoption: 'NOT_STARTED',
    sourceBoundary: 'formFieldVisualContract and controlled select boundary only',
    controlledSelectSource: 'statusRepository only where values are already centralized',
    noDrift: ['field order', 'field validation', 'default values', 'submit behavior', 'controlled select source redefinition', 'className change'],
    risk: 'HIGH_DATA_ENTRY_DRIFT_RISK',
  },
  settings: {
    runtimeAdoption: 'NOT_STARTED',
    SettingsRuntimeAdoption: 'NOT_STARTED',
    sourceBoundary: 'visualTokenSourceMap and globalVisualContract only',
    noDrift: ['settings behavior', 'auth or routing boundary', 'provider settings', 'admin toggles'],
    risk: 'MEDIUM_SETTINGS_VISUAL_ONLY_RISK',
  },
} as const

export const formsModalsActionVisualBridgeModalPolicies = {
  modals: {
    runtimeAdoption: 'NOT_STARTED',
    ModalsRuntimeAdoption: 'NOT_STARTED',
    sourceBoundary: 'modalDialogVisualContract only',
    noDrift: ['modal behavior', 'dialog layout', 'overlay behavior', 'footer action order', 'close/cancel behavior'],
    risk: 'HIGH_MODAL_BEHAVIOR_RISK',
  },
  dialogs: {
    runtimeAdoption: 'NOT_STARTED',
    DialogsRuntimeAdoption: 'NOT_STARTED',
    sourceBoundary: 'modalDialogVisualContract plus buttonActionVisualContract only',
    noDrift: ['dialog layout', 'confirm/delete behavior', 'action tone', 'keyboard behavior'],
    risk: 'HIGH_DIALOG_ACTION_RISK',
  },
} as const

export const formsModalsActionVisualBridgeAiDraftPolicies = {
  aiDrafts: {
    runtimeAdoption: 'NOT_STARTED',
    AiDraftsRuntimeAdoption: 'NOT_STARTED',
    sourceBoundary: 'visual review surfaces only',
    statusBoundary: 'AI draft review state must not merge with business status',
    noDrift: ['AI provider change', 'AI model change', 'AI runtime behavior change', 'review state merge with business status', 'send or draft behavior'],
    risk: 'HIGH_AI_RUNTIME_SEPARATION_RISK',
  },
} as const

export const formsModalsActionVisualBridgeHardRules = {
  stage: formsModalsActionVisualBridgeStage,
  mode: formsModalsActionVisualBridgeMode,
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  redesignChange: 'FORBIDDEN',
  componentReplacement: 'FORBIDDEN',
  classNameChange: 'FORBIDDEN',
  inlineStyleChange: 'FORBIDDEN',
  newCssPatchLayer: 'FORBIDDEN',
  localButtonClone: 'FORBIDDEN',
  localActionControlClone: 'FORBIDDEN',
  localIconColorPatch: 'FORBIDDEN',
  dialogLayoutChange: 'FORBIDDEN',
  modalBehaviorChange: 'FORBIDDEN',
  formFieldBehaviorChange: 'FORBIDDEN',
  controlledSelectSourceRedefinition: 'FORBIDDEN',
  aiProviderChange: 'FORBIDDEN',
  aiModelChange: 'FORBIDDEN',
  aiRuntimeBehaviorChange: 'FORBIDDEN',
  aiDraftStatusMergeWithBusinessStatus: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  googleCalendarSyncChange: 'FORBIDDEN',
  financeRuntimeChange: 'FORBIDDEN',
  CaseDetailRuntimeAdoption: 'FORBIDDEN_UNTIL_004F',
  CalendarRuntimeAdoption: 'FORBIDDEN_UNTIL_004G',
  sourceOfTruthUsage: 'GUARDS_TESTS_READONLY_BRIDGE_ONLY',
  FormsRuntimeAdoption: 'NOT_STARTED',
  ModalsRuntimeAdoption: 'NOT_STARTED',
  DialogsRuntimeAdoption: 'NOT_STARTED',
  ActionControlsRuntimeAdoption: 'NOT_STARTED',
  SettingsRuntimeAdoption: 'NOT_STARTED',
  AiDraftsRuntimeAdoption: 'NOT_STARTED',
  visibleOutputDrift: 'FORBIDDEN',
  manualSmokeRequiredByDamian: 'REQUIRED_BEFORE_RUNTIME_IMPORT',
} as const

export const formsModalsActionVisualBridgeNoDriftPolicy = {
  visibleOutputDrift: 'FORBIDDEN',
  runtimeBehaviorChange: 'FORBIDDEN',
  uiChange: 'FORBIDDEN',
  cssChange: 'FORBIDDEN',
  redesignChange: 'FORBIDDEN',
  componentReplacement: 'FORBIDDEN',
  classNameChange: 'FORBIDDEN',
  inlineStyleChange: 'FORBIDDEN',
  newCssPatchLayer: 'FORBIDDEN',
  localButtonClone: 'FORBIDDEN',
  localActionControlClone: 'FORBIDDEN',
  localIconColorPatch: 'FORBIDDEN',
  dialogLayoutChange: 'FORBIDDEN',
  modalBehaviorChange: 'FORBIDDEN',
  formFieldBehaviorChange: 'FORBIDDEN',
  controlledSelectSourceRedefinition: 'FORBIDDEN',
  aiProviderChange: 'FORBIDDEN',
  aiModelChange: 'FORBIDDEN',
  aiRuntimeBehaviorChange: 'FORBIDDEN',
  dataWriteChange: 'FORBIDDEN',
  remoteCalendarBoundaryChange: 'FORBIDDEN',
} as const

export const formsModalsActionVisualBridgeFixturePolicy = [
  {
    fixture: 'action control candidate',
    policy: 'do not change runtime, className, CSS, patch layer, button clone, action clone or icon color patch',
  },
  {
    fixture: 'form field candidate',
    policy: 'do not change field behavior, default values, validation, controlled select source, className or CSS',
  },
  {
    fixture: 'modal/dialog candidate',
    policy: 'do not change modal behavior, dialog layout, footer action order, overlay behavior or close/cancel behavior',
  },
  {
    fixture: 'settings surface candidate',
    policy: 'do not change settings runtime, routing, auth, provider settings, className or CSS',
  },
  {
    fixture: 'AI draft visual surface candidate',
    policy: 'do not change AI provider, model, runtime, send behavior, draft behavior or merge review state with business status',
  },
] as const

export const formsModalsActionVisualBridgeManualSmokePolicy = {
  manualSmokeRequiredByDamian: 'REQUIRED_BEFORE_RUNTIME_IMPORT',
  smokeScope: 'create/edit dialogs, action controls, settings visual surfaces and AI drafts visual review surfaces before later runtime import',
  runtimeImportGate: 'manual smoke must be green before any later runtime import',
} as const

export const formsModalsActionVisualBridgeNextStages = [
  {
    stage: 'LF-PROD-SOT-004F',
    name: 'CaseDetail isolated adoption plan',
    rule: 'CaseDetail runtime adoption remains forbidden until this isolated plan',
  },
  {
    stage: 'LF-PROD-SOT-004G',
    name: 'Calendar and remote calendar boundary plan',
    rule: 'Calendar runtime adoption and remote calendar sync remain forbidden until this isolated plan',
  },
] as const

export const formsModalsActionVisualBridgeReport = {
  appReport: '_project/runs/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md',
  obsidianReport: '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-004E_FORMS_MODALS_ACTION_VISUAL_BRIDGE.md',
  status: 'FORMS_MODALS_ACTION_VISUAL_BRIDGE_REMOTE_ADDED_LOCAL_VERIFICATION_PENDING',
} as const

export const formsModalsActionVisualBridge = {
  formsModalsActionVisualBridgeStage,
  formsModalsActionVisualBridgeMode,
  formsModalsActionVisualBridgeSourceMap,
  formsModalsActionVisualBridgeConsumers,
  formsModalsActionVisualBridgeRepositories,
  formsModalsActionVisualBridgeAllowedAreas,
  formsModalsActionVisualBridgeBlockedAreas,
  formsModalsActionVisualBridgePrimitivePolicies,
  formsModalsActionVisualBridgeFormPolicies,
  formsModalsActionVisualBridgeModalPolicies,
  formsModalsActionVisualBridgeAiDraftPolicies,
  formsModalsActionVisualBridgeHardRules,
  formsModalsActionVisualBridgeNoDriftPolicy,
  formsModalsActionVisualBridgeFixturePolicy,
  formsModalsActionVisualBridgeManualSmokePolicy,
  formsModalsActionVisualBridgeNextStages,
  formsModalsActionVisualBridgeReport,
} as const
