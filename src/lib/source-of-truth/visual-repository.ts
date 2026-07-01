export type VisualRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN_NEEDS_REVIEW'

export type VisualContract = {
  area: string
  sourceFiles: readonly string[]
  activePrimitives: readonly string[]
  cssSources: readonly string[]
  tokenSources: readonly string[]
  tailwindSources: readonly string[]
  inlineStyleRisk: VisualRiskLevel
  patchLayerRisk: VisualRiskLevel
  legacyVisualRisk: VisualRiskLevel
  localColorMaps: readonly string[]
  localToneMaps: readonly string[]
  localBadgeMaps: readonly string[]
  localIconColors: readonly string[]
  typographyPolicy: string
  spacingPolicy: string
  surfacePolicy: string
  radiusPolicy: string
  shadowPolicy: string
  borderPolicy: string
  responsivePolicy: string
  forbiddenPatterns: readonly string[]
  consumers: readonly string[]
  riskMarkers: readonly string[]
  recommendation: string
}

const forbiddenVisualPatchPatterns = [
  'imperative visual patching',
  'runtime child replacement for layout',
  'inline style on action controls',
  'raw page-level button styling',
  'local icon color patches',
  'new stage-only final styling',
  'new CSS patch layer',
  'business status redefinition',
  'date urgency redefinition',
  'visual refactor in 003B',
] as const

export const visualTokenSourceMap = {
  stage: 'LF-PROD-SOT-003B',
  mode: 'READ_ONLY_CONTRACT',
  adoption: 'ADOPTION_DEFERRED_TO_NEXT_STAGE',
  globalTokenSources: [
    'src/index.css',
    'src/styles/design-system/closeflow-tokens.css',
    'src/styles/design-system/closeflow-icons.css',
    'src/styles/closeflow-visual-source-truth.css',
  ],
  competingCssSources: [
    'src/styles/closeflow-record-list-source-truth.css',
    'src/styles/closeflow-modal-visual-system.css',
    'src/styles/closeflow-page-header-card-source-truth.css',
    'src/styles/closeflow-page-header-final-lock.css',
    'src/styles/closeflow-metric-tiles.css',
    'src/styles/closeflow-detail-view-source-truth-stage219.css',
    'src/styles/closeflow-right-rail-source-truth.css',
    'src/styles/finance/closeflow-finance.css',
  ],
  separationRules: [
    'visual tones are not business status truth',
    'date urgency is owned by date-time repository, not visual repository',
    'finance visual taxonomy is separate from finance runtime/data',
    'semantic icon policy is separate from local icon color patches',
    '003B does not choose winners by changing runtime/CSS',
  ],
} as const

const baseContract: VisualContract = {
  area: 'base visual contract',
  sourceFiles: [],
  activePrimitives: [],
  cssSources: [],
  tokenSources: [],
  tailwindSources: [],
  inlineStyleRisk: 'MEDIUM',
  patchLayerRisk: 'HIGH',
  legacyVisualRisk: 'HIGH',
  localColorMaps: ['documented only; no local color map created in 003B'],
  localToneMaps: ['documented only; no local tone map created in 003B'],
  localBadgeMaps: ['documented only; no local badge map created in 003B'],
  localIconColors: ['documented only; icon colors remain legacy risk until adoption stages'],
  typographyPolicy: 'Typography is mapped from existing token/CSS sources before adoption.',
  spacingPolicy: 'Spacing remains mapped only; no page spacing change in 003B.',
  surfacePolicy: 'Surface rules are documented across global, modal, metric and detail CSS sources.',
  radiusPolicy: 'Radius rules stay in existing CSS/token sources until adoption.',
  shadowPolicy: 'Shadow rules stay in existing CSS/token sources until adoption.',
  borderPolicy: 'Border rules stay in existing CSS/token sources until adoption.',
  responsivePolicy: 'Responsive policy is observed from existing shell/detail/list CSS and not changed here.',
  forbiddenPatterns: forbiddenVisualPatchPatterns,
  consumers: [],
  riskMarkers: ['PATCH_LAYER', 'LEGACY_VISUAL', 'DUPLICATE_VISUAL_LOGIC'],
  recommendation: 'Runtime adoption must be planned in LF-PROD-SOT-004A.',
}

export const globalVisualContract: VisualContract = {
  ...baseContract,
  area: 'global visual tokens and competing CSS layers',
  sourceFiles: [
    'src/index.css',
    'src/styles/design-system/closeflow-tokens.css',
    'src/styles/design-system/closeflow-icons.css',
    'src/styles/closeflow-visual-source-truth.css',
    'src/styles/closeflow-record-list-source-truth.css',
    'src/styles/closeflow-modal-visual-system.css',
    'src/styles/closeflow-page-header-card-source-truth.css',
    'src/styles/closeflow-page-header-final-lock.css',
    'src/styles/closeflow-metric-tiles.css',
    'src/styles/closeflow-detail-view-source-truth-stage219.css',
    'src/styles/closeflow-right-rail-source-truth.css',
    'src/styles/finance/closeflow-finance.css',
  ],
  activePrimitives: ['src/ui-system/icons/SemanticIcon.tsx', 'src/components/ui-system/ActionIcon.tsx'],
  cssSources: [
    'src/index.css',
    'src/styles/closeflow-visual-source-truth.css',
    'src/styles/closeflow-record-list-source-truth.css',
    'src/styles/closeflow-modal-visual-system.css',
  ],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css', 'src/styles/design-system/closeflow-icons.css'],
  tailwindSources: ['page-level class strings are existing consumers, not adopted here'],
  consumers: ['all application screens', 'shared visual primitives', 'stage CSS files'],
  recommendation: 'Global visual contract documents existing tokens and competing CSS layers. It does not choose winners by changing runtime/CSS.',
}

export const pageShellVisualContract: VisualContract = {
  ...baseContract,
  area: 'PageShell and Header',
  sourceFiles: ['src/components/Layout.tsx', 'src/styles/visual-stage01-shell.css', 'src/styles/closeflow-page-header-card-source-truth.css', 'src/styles/closeflow-page-header-final-lock.css', 'src/styles/closeflow-page-header-stage6-final-lock.css'],
  activePrimitives: ['src/components/Layout.tsx'],
  cssSources: ['src/styles/visual-stage01-shell.css', 'src/styles/closeflow-page-header-card-source-truth.css', 'src/styles/closeflow-page-header-final-lock.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['shell/page class strings in existing pages'],
  consumers: ['Today.tsx', 'Leads.tsx', 'Clients.tsx', 'Cases.tsx', 'Calendar.tsx', 'Billing.tsx', 'Settings.tsx'],
  riskMarkers: ['LOCAL_LAYOUT_RULE', 'RESPONSIVE_SHELL_RISK'],
  recommendation: 'PageShell/Header contract is read-only in 003B. No layout changes.',
}

export const sidebarVisualContract: VisualContract = {
  ...pageShellVisualContract,
  area: 'Sidebar navigation',
  consumers: ['src/components/Layout.tsx', 'sidebar navigation links', 'main shell spacing'],
  recommendation: 'Sidebar visual policy is documented only. No sidebar behavior or layout change in 003B.',
}

export const metricTileVisualContract: VisualContract = {
  ...baseContract,
  area: 'Metric tiles, cards and kafelki',
  sourceFiles: ['src/styles/closeflow-metric-tiles.css', 'src/components/StatShortcutCard.tsx', 'src/pages/Today.tsx', 'src/pages/TodayStable.tsx', 'src/pages/Dashboard.tsx'],
  activePrimitives: ['src/components/StatShortcutCard.tsx'],
  cssSources: ['src/styles/closeflow-metric-tiles.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['Today metric tiles', 'dashboard/top metric cards'],
  consumers: ['Today metric tiles', 'dashboard/top metric cards', 'amount/count cards'],
  riskMarkers: ['LOCAL_TAILWIND_STYLE', 'DUPLICATE_COMPONENT_PATTERN', 'PATCH_LAYER'],
  recommendation: 'metric tile contract must separate tile structure from status/badge tone logic.',
}

export const recordListVisualContract: VisualContract = {
  ...baseContract,
  area: 'Record lists, rows and tables',
  sourceFiles: ['src/styles/closeflow-record-list-source-truth.css', 'src/pages/Leads.tsx', 'src/pages/Clients.tsx', 'src/pages/Cases.tsx', 'src/pages/Tasks.tsx', 'src/pages/TasksStable.tsx', 'src/pages/Calendar.tsx', 'src/pages/Billing.tsx'],
  activePrimitives: ['src/components/entity-actions.tsx', 'src/components/ui-system/ActionIcon.tsx'],
  cssSources: ['src/styles/closeflow-record-list-source-truth.css', 'src/styles/finance/closeflow-finance.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['Leads list', 'Clients list', 'Cases list', 'Tasks list', 'Calendar rows', 'Billing tables/lists'],
  consumers: ['Leads list', 'Clients list', 'Cases list', 'Tasks list', 'Calendar rows', 'Billing tables/lists'],
  riskMarkers: ['LOCAL_TAILWIND_STYLE', 'LOCAL_ROW_PATTERN', 'ACTION_LAYOUT_DEBT'],
  recommendation: 'record list contract documents row/list patterns only. No row component refactor in 003B.',
}

export const detailViewVisualContract: VisualContract = {
  ...baseContract,
  area: 'Detail views and right rails',
  sourceFiles: ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx', 'src/styles/visual-stage14-lead-detail-vnext.css', 'src/styles/visual-stage12-client-detail-vnext.css', 'src/styles/visual-stage13-case-detail-vnext.css', 'src/styles/closeflow-detail-view-source-truth-stage219.css', 'src/styles/closeflow-right-rail-source-truth.css', 'src/styles/closeflow-case-detail-focus.css', 'src/styles/closeflow-case-history-visual-source-truth.css', 'src/styles/case-detail-stage228r9-shell-rail-lift.css'],
  activePrimitives: ['src/components/entity-actions.tsx', 'src/components/ui-system/ActionIcon.tsx'],
  cssSources: ['src/styles/closeflow-detail-view-source-truth-stage219.css', 'src/styles/closeflow-right-rail-source-truth.css', 'src/styles/visual-stage13-case-detail-vnext.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['LeadDetail', 'ClientDetail', 'CaseDetail'],
  consumers: ['LeadDetail', 'ClientDetail', 'CaseDetail', 'right rail', 'service workspace', 'finance rail', 'quick actions', 'history panels', 'notes/checklists areas'],
  riskMarkers: ['HIGH_RISK_CASE_DETAIL_HOTSPOT', 'PATCH_LAYER', 'LOCAL_LAYOUT_RULE'],
  recommendation: 'CaseDetail is high-risk visual hotspot. 003B is not allowed to refactor it.',
}

export const buttonActionVisualContract: VisualContract = {
  ...baseContract,
  area: 'Buttons and action controls',
  sourceFiles: ['src/components/ui-system/ActionIcon.tsx', 'src/components/entity-actions.tsx', 'src/components/ContextActionDialogs.tsx'],
  activePrimitives: ['src/components/ui-system/ActionIcon.tsx', 'src/components/entity-actions.tsx'],
  cssSources: ['src/styles/closeflow-visual-source-truth.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['primary/secondary/danger/ghost action styles', 'quick actions', 'footer actions', 'icon buttons'],
  consumers: ['primary actions', 'secondary actions', 'danger actions', 'ghost actions', 'quick actions', 'footer actions', 'icon buttons'],
  riskMarkers: ['RAW_BUTTON_DEBT', 'LOCAL_ACTION_PATTERN', 'LOCAL_ICON_COLOR'],
  recommendation: 'buttonActionVisualContract documents allowed action patterns and raw-button debt. No button replacement in 003B.',
}

export const formFieldVisualContract: VisualContract = {
  ...baseContract,
  area: 'Forms and fields',
  sourceFiles: ['src/components/ui/select.tsx', 'src/components/ClientCreateDialog.tsx', 'src/components/finance/PaymentFormDialog.tsx', 'src/components/finance/CommissionFormDialog.tsx', 'src/components/finance/CaseFinanceEditorDialog.tsx', 'src/styles/visual-stage22-event-form-vnext.css', 'src/styles/visual-stage21-task-form-vnext.css'],
  activePrimitives: ['src/components/ui/select.tsx'],
  cssSources: ['src/styles/visual-stage22-event-form-vnext.css', 'src/styles/visual-stage21-task-form-vnext.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['task/event forms', 'client/lead forms', 'finance forms'],
  consumers: ['task/event forms', 'client/lead forms', 'finance forms', 'field labels', 'validation/error states'],
  riskMarkers: ['LOCAL_FORM_SPACING', 'LOCAL_FIELD_STYLE', 'MODAL_FORM_OVERLAP'],
  recommendation: 'formFieldVisualContract documents input/select patterns only. No form UI changes.',
}

export const modalDialogVisualContract: VisualContract = {
  ...baseContract,
  area: 'Modals and dialogs',
  sourceFiles: ['src/components/ClientCreateDialog.tsx', 'src/components/ContextActionDialogs.tsx', 'src/components/finance/PaymentFormDialog.tsx', 'src/components/finance/CommissionFormDialog.tsx', 'src/components/finance/CaseFinanceEditorDialog.tsx', 'src/styles/closeflow-modal-visual-system.css', 'src/styles/closeflow-template-modal-source-truth-stage181n.css'],
  activePrimitives: ['src/components/ContextActionDialogs.tsx'],
  cssSources: ['src/styles/closeflow-modal-visual-system.css', 'src/styles/closeflow-template-modal-source-truth-stage181n.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['ClientCreateDialog', 'ContextActionDialogs', 'finance dialogs', 'event/task/template dialogs'],
  consumers: ['ClientCreateDialog', 'ContextActionDialogs', 'finance dialogs', 'event/task/template dialogs'],
  riskMarkers: ['MODAL_WIDTH_DEBT', 'FOOTER_ACTION_DEBT', 'SURFACE_OVERLAY_RISK'],
  recommendation: 'modalDialogVisualContract documents dialog patterns only. No modal redesign.',
}

export const badgeToneVisualContract: VisualContract = {
  ...baseContract,
  area: 'Badge visual tones',
  sourceFiles: ['src/pages/Leads.tsx', 'src/pages/LeadDetail.tsx', 'src/pages/Clients.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/Cases.tsx', 'src/pages/CaseDetail.tsx', 'src/pages/Tasks.tsx', 'src/pages/Calendar.tsx', 'src/styles/closeflow-visual-source-truth.css'],
  activePrimitives: ['src/ui-system/icons/SemanticIcon.tsx'],
  cssSources: ['src/styles/closeflow-visual-source-truth.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['lead badges', 'client health/source badges', 'case lifecycle badges', 'task/event visual badges', 'finance payment badges'],
  localBadgeMaps: ['lead badges', 'client health/source badges', 'case lifecycle badges', 'task/event visual badges', 'finance payment badges'],
  consumers: ['lead badges', 'client badges', 'case badges', 'task/event badges', 'finance badges'],
  riskMarkers: ['LOCAL_BADGE_MAP', 'STATUS_VISUAL_SEPARATION_REQUIRED'],
  recommendation: 'visual tone contract must not redefine business statuses. Visual badge policy must not redefine business statuses.',
}

export const statusToneVisualContract: VisualContract = {
  ...badgeToneVisualContract,
  area: 'Status visual tones',
  sourceFiles: ['src/lib/source-of-truth/status-repository.ts', ...badgeToneVisualContract.sourceFiles],
  localToneMaps: ['status tone maps are visual-only and remain separate from business status truth'],
  riskMarkers: ['STATUS_REPOSITORY_SEPARATION', 'LOCAL_TONE_MAP'],
  recommendation: 'Status truth stays in status-repository. Visual repository only documents tone policy.',
}

export const severityToneVisualContract: VisualContract = {
  ...badgeToneVisualContract,
  area: 'Severity visual tones',
  sourceFiles: ['src/lib/source-of-truth/date-time-repository.ts', ...badgeToneVisualContract.sourceFiles],
  localToneMaps: ['severity tone maps are visual-only', 'date urgency remains in date-time repository'],
  riskMarkers: ['DATE_TIME_REPOSITORY_SEPARATION', 'LOCAL_SEVERITY_MAP'],
  recommendation: 'Date urgency stays in date-time repository. Visual repository only documents severity tone policy.',
}

export const semanticIconVisualContract: VisualContract = {
  ...baseContract,
  area: 'Semantic icons',
  sourceFiles: ['src/ui-system/icons/SemanticIcon.tsx', 'src/components/ui-system/ActionIcon.tsx', 'src/styles/design-system/closeflow-icons.css', 'src/pages/Calendar.tsx', 'src/pages/Tasks.tsx', 'src/pages/AiDrafts.tsx', 'src/pages/AdminAiSettings.tsx'],
  activePrimitives: ['src/ui-system/icons/SemanticIcon.tsx', 'src/components/ui-system/ActionIcon.tsx'],
  cssSources: ['src/styles/design-system/closeflow-icons.css'],
  tokenSources: ['src/styles/design-system/closeflow-icons.css'],
  tailwindSources: ['lucide imports', 'action icons', 'status icons', 'finance icons', 'calendar/task icons', 'AI/drafts icons'],
  localIconColors: ['lucide imports', 'local icon colors', 'status icons', 'finance icons', 'calendar/task icons', 'AI/drafts icons'],
  consumers: ['action icons', 'status icons', 'finance icons', 'calendar/task icons', 'AI/drafts icons'],
  riskMarkers: ['LOCAL_ICON_COLOR', 'LUCIDE_IMPORT_DEBT', 'SEMANTIC_ICON_REGISTRY_REQUIRED'],
  recommendation: 'semanticIconVisualContract documents semantic icon tone registry. No icon replacement in 003B.',
}

export const financeVisualContract: VisualContract = {
  ...baseContract,
  area: 'Finance visual taxonomy',
  sourceFiles: ['src/pages/Billing.tsx', 'src/styles/finance/closeflow-finance.css', 'src/styles/visual-stage16-billing-vnext.css', 'src/styles/closeflow-billing-visual-taxonomy-stage181z.css', 'src/components/finance/PaymentFormDialog.tsx', 'src/components/finance/CommissionFormDialog.tsx', 'src/components/finance/CaseFinanceEditorDialog.tsx', 'src/components/finance/CaseSettlementPanel.tsx'],
  activePrimitives: ['src/components/ui-system/ActionIcon.tsx'],
  cssSources: ['src/styles/finance/closeflow-finance.css', 'src/styles/visual-stage16-billing-vnext.css', 'src/styles/closeflow-billing-visual-taxonomy-stage181z.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['Billing.tsx', 'payment/commission amount typography', 'settlement cards', 'finance dialogs'],
  consumers: ['Billing.tsx', 'payment forms', 'commission forms', 'settlement cards', 'finance dialogs'],
  riskMarkers: ['FINANCE_RUNTIME_SEPARATION', 'AMOUNT_TYPOGRAPHY_POLICY', 'PAYMENT_TONE_POLICY'],
  recommendation: 'financeVisualContract is separate from finance runtime/data. No finance behavior changes.',
}

export const calendarTaskEventVisualContract: VisualContract = {
  ...baseContract,
  area: 'Calendar, tasks and event visuals',
  sourceFiles: ['src/pages/Tasks.tsx', 'src/pages/TasksStable.tsx', 'src/pages/Calendar.tsx', 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css', 'src/styles/visual-stage22-event-form-vnext.css', 'src/styles/visual-stage21-task-form-vnext.css', 'src/styles/operator-rail-tasks-pattern-stage228r1.css', 'src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css'],
  activePrimitives: ['src/components/ui-system/ActionIcon.tsx'],
  cssSources: ['src/styles/closeflow-calendar-selected-day-new-tile-v9.css', 'src/styles/visual-stage22-event-form-vnext.css', 'src/styles/visual-stage21-task-form-vnext.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['Tasks.tsx', 'TasksStable.tsx', 'Calendar.tsx', 'calendar selected day tile', 'task/event forms', 'done/cancelled/pending visuals'],
  consumers: ['Tasks.tsx', 'TasksStable.tsx', 'Calendar.tsx', 'calendar selected day tile', 'task/event forms', 'done/cancelled/pending visuals'],
  riskMarkers: ['DATE_TIME_REPOSITORY_SEPARATION', 'CALENDAR_TILE_PATCH_LAYER', 'TASK_FORM_PATCH_LAYER'],
  recommendation: 'calendarTaskEventVisualContract is separate from date-time repository. No Calendar runtime or date logic changes.',
}

export const aiDraftVisualContract: VisualContract = {
  ...baseContract,
  area: 'AI drafts and assistant surfaces',
  sourceFiles: ['src/pages/AiDrafts.tsx', 'src/pages/AdminAiSettings.tsx', 'src/components/LeadAiFollowupDraft.tsx', 'src/styles/visual-stage9-ai-drafts-vnext.css'],
  activePrimitives: ['src/ui-system/icons/SemanticIcon.tsx'],
  cssSources: ['src/styles/visual-stage9-ai-drafts-vnext.css'],
  tokenSources: ['src/styles/design-system/closeflow-tokens.css'],
  tailwindSources: ['AiDrafts.tsx', 'AdminAiSettings.tsx', 'LeadAiFollowupDraft', 'assistant/draft cards', 'AI review surfaces'],
  consumers: ['AiDrafts.tsx', 'AdminAiSettings.tsx', 'LeadAiFollowupDraft', 'assistant/draft cards', 'AI review surfaces'],
  riskMarkers: ['AI_SURFACE_SEPARATION', 'LOCAL_ASSISTANT_CARD_STYLE', 'PATCH_LAYER'],
  recommendation: 'AI/drafts surfaces must be included in visual repository. No AI runtime change.',
}

export const visualRepository = {
  stage: 'LF-PROD-SOT-003B',
  mode: 'READ_ONLY_VISUAL_SOURCE_OF_TRUTH_CONTRACT',
  adoption: 'ADOPTION_DEFERRED_TO_NEXT_STAGE',
  visualTokenSourceMap,
  contracts: {
    globalVisualContract,
    pageShellVisualContract,
    sidebarVisualContract,
    metricTileVisualContract,
    recordListVisualContract,
    detailViewVisualContract,
    buttonActionVisualContract,
    formFieldVisualContract,
    modalDialogVisualContract,
    badgeToneVisualContract,
    statusToneVisualContract,
    severityToneVisualContract,
    semanticIconVisualContract,
    financeVisualContract,
    calendarTaskEventVisualContract,
    aiDraftVisualContract,
  },
  hardRules: [
    'No UI change in 003B',
    'No CSS change in 003B',
    'No runtime adoption in 003B',
    'No status-repository change in 003B',
    'No date-time-repository change in 003B',
    'No SQL/Supabase/API change in 003B',
  ],
} as const
