export type AdminToolMode = 'off' | 'review' | 'buttons' | 'bug' | 'copy' | 'export';
export type AdminReviewMode = 'off' | 'collect' | 'browse';
export type AdminPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type AdminReviewType =
  | 'visual'
  | 'position'
  | 'copy'
  | 'behavior'
  | 'bug'
  | 'mobile'
  | 'performance'
  | 'other';

export type AdminTargetRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

export type AdminViewportSnapshot = {
  width: number;
  height: number;
  devicePixelRatio: number;
};

export type AdminScrollSnapshot = {
  x: number;
  y: number;
};

export type AdminElementTarget = {
  tag: string;
  text: string;
  ariaLabel: string;
  title: string;
  role: string;
  id: string;
  className: string;
  dataAttributes: Record<string, string>;
  selectorHint: string;
  candidateIndex: number;
  candidateCount: number;
  composedPathSummary: string[];
  rect: AdminTargetRect;
  scroll: AdminScrollSnapshot;
  viewport: AdminViewportSnapshot;
  route: string;
  screen: string;
};

export type AdminTargetCandidate = {
  element: HTMLElement;
  score: number;
  reason: string;
  target: AdminElementTarget;
};

export type AdminReviewItem = {
  id: string;
  kind: 'ui_review';
  createdAt: string;
  status: 'todo' | 'done' | 'ignored';
  priority: AdminPriority;
  type: AdminReviewType;
  route: string;
  screen: string;
  comment: string;
  currentBehavior: string;
  expectedBehavior: string;
  target: AdminElementTarget;
  rect: AdminTargetRect;
  viewport: AdminViewportSnapshot;
  scroll: AdminScrollSnapshot;
};

export type AdminButtonMatrixItem = {
  id: string;
  kind: 'button_matrix_item';
  route: string;
  text: string;
  selectorHint: string;
  tag: string;
  role: string;
  disabled: boolean;
  visible: boolean;
  rect: AdminTargetRect;
  qaStatus: 'unchecked' | 'ok' | 'bug' | 'move' | 'rename' | 'remove';
};

export type AdminBugItem = {
  id: string;
  kind: 'bug_note';
  createdAt: string;
  route: string;
  whatIDid: string;
  whatHappened: string;
  expected: string;
  priority: AdminPriority;
  target?: AdminElementTarget | null;
  userAgent: string;
  viewport: AdminViewportSnapshot;
};

export type AdminCopyItem = {
  id: string;
  kind: 'copy_review';
  createdAt: string;
  route: string;
  oldText: string;
  proposedText: string;
  reason: string;
  priority: AdminPriority;
  target: AdminElementTarget;
};

export type AdminToolsSettings = {
  reviewMode: AdminReviewMode;
  showOverlay: boolean;
};

export type AdminFeedbackExport = {
  version: 'admin_tools_v1';
  generatedAt: string;
  commit: string;
  route: string;
  userAgent: string;
  viewport: AdminViewportSnapshot;
  reviewItems: AdminReviewItem[];
  bugItems: AdminBugItem[];
  copyItems: AdminCopyItem[];
  buttonSnapshots: AdminButtonMatrixItem[];
  settings: AdminToolsSettings;
};

export const ADMIN_TOOLS_STORAGE_KEYS = {
  activeTool: 'closeflow:admin-tools:active-tool:v1',
  reviewItems: 'closeflow:admin-tools:review-items:v1',
  bugItems: 'closeflow:admin-tools:bug-items:v1',
  copyItems: 'closeflow:admin-tools:copy-items:v1',
  buttonSnapshots: 'closeflow:admin-tools:button-snapshots:v1',
  settings: 'closeflow:admin-tools:settings:v1',
} as const;

export const ADMIN_TOOLS_MARKERS = {
  toolbar: 'ADMIN_DEBUG_TOOLBAR_STAGE87',
  localOnly: 'ADMIN_DEBUG_TOOLBAR_LOCAL_STORAGE_ONLY_STAGE87',
  noBackend: 'ADMIN_DEBUG_TOOLBAR_NO_BACKEND_STAGE87',
  targeting: 'ADMIN_DEBUG_TOOLBAR_COMPOSED_PATH_TARGETING_STAGE87',
  export: 'ADMIN_DEBUG_TOOLBAR_EXPORT_DOWNLOAD_STAGE87',
} as const;
