// STAGE220A16_CLOSEFLOW_VISUAL_SOURCE_TRUTH_TS
// One semantic map for repeated visual meanings. CSS tokens live in closeflow-visual-source-truth.css.

export type CloseFlowVisualKind =
  | 'note'
  | 'task'
  | 'event'
  | 'calendar'
  | 'payment'
  | 'finance'
  | 'status'
  | 'system'
  | 'case-item'
  | 'missing'
  | 'document'
  | 'delete'
  | 'destructive'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'default';

export type CloseFlowVisualToken = {
  label: string;
  colorVar: string;
  softVar: string;
  borderVar: string;
  className: string;
  iconHint: string;
};

export const CLOSEFLOW_VISUAL_SOURCE_TRUTH: Record<CloseFlowVisualKind, CloseFlowVisualToken> = {
  note: { label: 'Notatka', colorVar: '--cf-vst-color-note', softVar: '--cf-vst-color-note-soft', borderVar: '--cf-vst-color-note-border', className: 'cf-vst-kind-note', iconHint: 'StickyNote' },
  task: { label: 'Zadanie', colorVar: '--cf-vst-color-task', softVar: '--cf-vst-color-task-soft', borderVar: '--cf-vst-color-task-border', className: 'cf-vst-kind-task', iconHint: 'ListChecks' },
  event: { label: 'Wydarzenie', colorVar: '--cf-vst-color-event', softVar: '--cf-vst-color-event-soft', borderVar: '--cf-vst-color-event-border', className: 'cf-vst-kind-event', iconHint: 'CalendarClock' },
  calendar: { label: 'Kalendarz', colorVar: '--cf-vst-color-event', softVar: '--cf-vst-color-event-soft', borderVar: '--cf-vst-color-event-border', className: 'cf-vst-kind-event', iconHint: 'CalendarClock' },
  payment: { label: 'Wpłata', colorVar: '--cf-vst-color-payment', softVar: '--cf-vst-color-payment-soft', borderVar: '--cf-vst-color-payment-border', className: 'cf-vst-kind-payment', iconHint: 'Paperclip' },
  finance: { label: 'Finanse', colorVar: '--cf-vst-color-payment', softVar: '--cf-vst-color-payment-soft', borderVar: '--cf-vst-color-payment-border', className: 'cf-vst-kind-payment', iconHint: 'Paperclip' },
  status: { label: 'Status', colorVar: '--cf-vst-color-status', softVar: '--cf-vst-color-status-soft', borderVar: '--cf-vst-color-status-border', className: 'cf-vst-kind-status', iconHint: 'CheckCircle2' },
  system: { label: 'System', colorVar: '--cf-vst-color-status', softVar: '--cf-vst-color-status-soft', borderVar: '--cf-vst-color-status-border', className: 'cf-vst-kind-status', iconHint: 'CheckCircle2' },
  'case-item': { label: 'Element sprawy', colorVar: '--cf-vst-color-case-item', softVar: '--cf-vst-color-case-item-soft', borderVar: '--cf-vst-color-case-item-border', className: 'cf-vst-kind-case-item', iconHint: 'EntityIcon/template' },
  missing: { label: 'Brak', colorVar: '--cf-vst-color-case-item', softVar: '--cf-vst-color-case-item-soft', borderVar: '--cf-vst-color-case-item-border', className: 'cf-vst-kind-case-item', iconHint: 'EntityIcon/template' },
  document: { label: 'Dokument', colorVar: '--cf-vst-color-case-item', softVar: '--cf-vst-color-case-item-soft', borderVar: '--cf-vst-color-case-item-border', className: 'cf-vst-kind-case-item', iconHint: 'EntityIcon/template' },
  delete: { label: 'Usuń', colorVar: '--cf-vst-color-delete', softVar: '--cf-vst-color-delete-soft', borderVar: '--cf-vst-color-delete-border', className: 'cf-vst-kind-delete', iconHint: 'Trash2' },
  destructive: { label: 'Destrukcja', colorVar: '--cf-vst-color-delete', softVar: '--cf-vst-color-delete-soft', borderVar: '--cf-vst-color-delete-border', className: 'cf-vst-kind-delete', iconHint: 'Trash2' },
  primary: { label: 'Główna akcja', colorVar: '--cf-vst-color-primary', softVar: '--cf-vst-color-primary-soft', borderVar: '--cf-vst-color-primary-border', className: 'cf-vst-button-primary', iconHint: 'Plus/Check' },
  success: { label: 'Sukces', colorVar: '--cf-vst-color-success', softVar: '--cf-vst-color-success-soft', borderVar: '--cf-vst-color-task-border', className: 'cf-vst-kind-task', iconHint: 'Check' },
  warning: { label: 'Ostrzeżenie', colorVar: '--cf-vst-color-warning', softVar: '--cf-vst-color-warning-soft', borderVar: '--cf-vst-color-event-border', className: 'cf-vst-kind-event', iconHint: 'AlertCircle' },
  danger: { label: 'Błąd/blokada', colorVar: '--cf-vst-color-danger', softVar: '--cf-vst-color-danger-soft', borderVar: '--cf-vst-color-delete-border', className: 'cf-vst-kind-delete', iconHint: 'AlertCircle' },
  default: { label: 'Domyślne', colorVar: '--cf-vst-text-main', softVar: '--cf-vst-surface-soft', borderVar: '--cf-vst-surface-border', className: 'cf-vst-kind-status', iconHint: 'Circle' },
};

export function getCloseFlowVisualToken(kind: CloseFlowVisualKind | string | null | undefined): CloseFlowVisualToken {
  const key = String(kind || 'default').trim() as CloseFlowVisualKind;
  return CLOSEFLOW_VISUAL_SOURCE_TRUTH[key] || CLOSEFLOW_VISUAL_SOURCE_TRUTH.default;
}

export type CloseFlowSurfaceKind =
  | 'page'
  | 'sidebar'
  | 'right-rail'
  | 'top-card'
  | 'side-card'
  | 'bottom-card'
  | 'modal'
  | 'popover'
  | 'row'
  | 'metric';

export type CloseFlowTypographyRole =
  | 'page-title'
  | 'section-title'
  | 'card-title'
  | 'body'
  | 'label'
  | 'meta'
  | 'metric'
  | 'button';

export const CLOSEFLOW_VISUAL_FOUNDATION_TOKENS = {
  typography: {
    pageTitle: 'cf-vst-text-page-title',
    sectionTitle: 'cf-vst-text-section-title',
    cardTitle: 'cf-vst-text-card-title',
    body: 'cf-vst-text-body',
    meta: 'cf-vst-text-meta',
  },
  surfaces: {
    card: 'cf-vst-card',
    shell: 'cf-vst-shell',
    rightRail: 'cf-vst-right-rail',
    row: 'cf-vst-row',
    dialog: 'cf-vst-dialog',
  },
  actions: {
    button: 'cf-vst-button',
    primary: 'cf-vst-button-primary',
    delete: 'cf-vst-button-delete',
  },
  forms: {
    input: 'cf-vst-input',
  },
  metrics: {
    number: 'cf-vst-metric-number',
  },
} as const;
