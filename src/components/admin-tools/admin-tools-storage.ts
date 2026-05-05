import {
  ADMIN_TOOLS_STORAGE_KEYS,
  AdminBugItem,
  AdminButtonMatrixItem,
  AdminCopyItem,
  AdminFeedbackExport,
  AdminReviewItem,
  AdminToolsSettings,
  AdminToolMode,
} from './admin-tools-types';

const DEFAULT_SETTINGS: AdminToolsSettings = {
  reviewMode: 'off',
  showOverlay: true,
};

function canUseLocalStorage() {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseLocalStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local admin tools must never break production UI.
  }
}

export function createAdminToolId(prefix = 'admin') {
  const randomPart = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 12);
  return `${prefix}_${Date.now()}_${randomPart}`;
}

export function readActiveAdminTool(): AdminToolMode {
  const value = readJson<AdminToolMode>(ADMIN_TOOLS_STORAGE_KEYS.activeTool, 'off');
  return ['off', 'review', 'buttons', 'bug', 'copy', 'export'].includes(value) ? value : 'off';
}

export function writeActiveAdminTool(value: AdminToolMode) {
  writeJson(ADMIN_TOOLS_STORAGE_KEYS.activeTool, value);
}

export function readAdminToolsSettings(): AdminToolsSettings {
  return { ...DEFAULT_SETTINGS, ...readJson<Partial<AdminToolsSettings>>(ADMIN_TOOLS_STORAGE_KEYS.settings, DEFAULT_SETTINGS) };
}

export function writeAdminToolsSettings(value: AdminToolsSettings) {
  writeJson(ADMIN_TOOLS_STORAGE_KEYS.settings, { ...DEFAULT_SETTINGS, ...value });
}

export function readReviewItems() {
  return readJson<AdminReviewItem[]>(ADMIN_TOOLS_STORAGE_KEYS.reviewItems, []);
}

export function writeReviewItems(items: AdminReviewItem[]) {
  writeJson(ADMIN_TOOLS_STORAGE_KEYS.reviewItems, items);
}

export function appendReviewItem(item: AdminReviewItem) {
  const next = [item, ...readReviewItems()];
  writeReviewItems(next);
  return next;
}

export function readBugItems() {
  return readJson<AdminBugItem[]>(ADMIN_TOOLS_STORAGE_KEYS.bugItems, []);
}

export function writeBugItems(items: AdminBugItem[]) {
  writeJson(ADMIN_TOOLS_STORAGE_KEYS.bugItems, items);
}

export function appendBugItem(item: AdminBugItem) {
  const next = [item, ...readBugItems()];
  writeBugItems(next);
  return next;
}

export function readCopyItems() {
  return readJson<AdminCopyItem[]>(ADMIN_TOOLS_STORAGE_KEYS.copyItems, []);
}

export function writeCopyItems(items: AdminCopyItem[]) {
  writeJson(ADMIN_TOOLS_STORAGE_KEYS.copyItems, items);
}

export function appendCopyItem(item: AdminCopyItem) {
  const next = [item, ...readCopyItems()];
  writeCopyItems(next);
  return next;
}

export function readButtonSnapshots() {
  return readJson<AdminButtonMatrixItem[]>(ADMIN_TOOLS_STORAGE_KEYS.buttonSnapshots, []);
}

export function writeButtonSnapshots(items: AdminButtonMatrixItem[]) {
  writeJson(ADMIN_TOOLS_STORAGE_KEYS.buttonSnapshots, items);
}

export function clearAdminToolsStorage() {
  if (!canUseLocalStorage()) return;
  Object.values(ADMIN_TOOLS_STORAGE_KEYS).forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  });
}

export function readFullAdminFeedbackExport(): Omit<AdminFeedbackExport, 'generatedAt' | 'commit' | 'route' | 'userAgent' | 'viewport'> {
  return {
    version: 'admin_tools_v1',
    reviewItems: readReviewItems(),
    bugItems: readBugItems(),
    copyItems: readCopyItems(),
    buttonSnapshots: readButtonSnapshots(),
    settings: readAdminToolsSettings(),
  };
}

// ADMIN_DEBUG_TOOLBAR_LOCAL_STORAGE_ONLY_STAGE87
