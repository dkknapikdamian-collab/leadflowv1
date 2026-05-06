import {
  AdminFeedbackExport,
  AdminPriority,
  AdminReviewItem,
} from './admin-tools-types';
import { readFullAdminFeedbackExport } from './admin-tools-storage';

const ADMIN_FEEDBACK_EXPORT_SANITIZE_STAGE88 = 'admin feedback export sanitizes mojibake and never emits COMMIT_SHA_PLACEHOLDER';

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function buildAdminExportTimestamp(date = new Date()) {
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    '_',
    pad(date.getHours()),
    '-',
    pad(date.getMinutes()),
  ].join('');
}

function getViewport() {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  };
}

function getRoute() {
  return typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '';
}

function getUserAgent() {
  return typeof navigator !== 'undefined' ? navigator.userAgent : '';
}

function getBuildCommit() {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};
  const value =
    metaEnv.VITE_COMMIT_SHA ||
    metaEnv.VITE_GIT_COMMIT_SHA ||
    metaEnv.VITE_VERCEL_GIT_COMMIT_SHA ||
    metaEnv.VITE_DEPLOY_COMMIT ||
    '';

  const normalized = String(value || '').trim();
  return normalized && normalized !== 'COMMIT_SHA_PLACEHOLDER' ? normalized : 'unknown_local_build';
}

const MOJIBAKE_REPLACEMENTS: Array<[string, string]> = [
  ['Kliknięto', 'Kliknięto'],
  ['działa', 'działa'],
  ['naciśnij', 'naciśnij'],
  ['uwagę', 'uwagę'],
  ['treść', 'treść'],
  ['Przenieść', 'Przenieść'],
  ['Przenieść', 'Przenieść'],
  ['Przenieść', 'Przenieść'],
  ['Przenieś', 'Przenieś'],
  ['Zły', 'Zły'],
  ['Usuń', 'Usuń'],
  ['Możesz', 'Możesz'],
  ['kliknąć', 'kliknąć'],
  ['się', 'się'],
  ['stać', 'stać'],
  ['Powód', 'Powód'],
  ['wygląd', 'wygląd'],
  ['błąd', 'błąd'],
  ['przemieść', 'przemieść'],
  ['niżej', 'niżej'],
  ['wyżej', 'wyżej'],
  ['Zmniejszyć', 'Zmniejszyć'],
  ['Powiększyć', 'Powiększyć'],
  ['Dodać', 'Dodać'],
  ['wyraźniejszy', 'wyraźniejszy'],
  ['dużo', 'dużo'],
  ['kliknięcia', 'kliknięcia'],
  ['trafią', 'trafią'],
  ['przeglądarki', 'przeglądarki'],
  ['·', '·'],
];

export function sanitizeAdminFeedbackText(value: string) {
  let next = String(value || '');
  for (const [from, to] of MOJIBAKE_REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  return next;
}

function sanitizeAdminFeedbackPayload<T>(value: T): T {
  if (typeof value === 'string') return sanitizeAdminFeedbackText(value) as T;
  if (Array.isArray(value)) return value.map((item) => sanitizeAdminFeedbackPayload(item)) as T;
  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      output[key] = sanitizeAdminFeedbackPayload(entry);
    }
    return output as T;
  }
  return value;
}

export function buildAdminFeedbackExport(): AdminFeedbackExport {
  return sanitizeAdminFeedbackPayload({
    ...readFullAdminFeedbackExport(),
    generatedAt: new Date().toISOString(),
    commit: getBuildCommit(),
    route: getRoute(),
    userAgent: getUserAgent(),
    viewport: getViewport(),
  });
}

function groupByPriority(items: AdminReviewItem[]) {
  const priorities: AdminPriority[] = ['P0', 'P1', 'P2', 'P3'];
  return priorities.map((priority) => ({
    priority,
    items: items.filter((item) => item.priority === priority),
  }));
}

export function buildAdminFeedbackMarkdown(exportData: AdminFeedbackExport) {
  const sanitized = sanitizeAdminFeedbackPayload(exportData);
  const lines: string[] = [];
  lines.push('# CloseFlow Admin Feedback Export');
  lines.push('');
  lines.push(`Generated: ${sanitized.generatedAt}`);
  lines.push(`Route: ${sanitized.route}`);
  lines.push(`Commit: ${sanitized.commit}`);
  lines.push(`Viewport: ${sanitized.viewport.width}x${sanitized.viewport.height} @${sanitized.viewport.devicePixelRatio}`);
  lines.push('');
  lines.push('## Blokery P0');
  const blockers = sanitized.reviewItems.filter((item) => item.priority === 'P0');
  if (!blockers.length) lines.push('- Brak');
  blockers.forEach((item) => lines.push(`- ${item.route}: ${item.comment} (${item.target.selectorHint})`));
  lines.push('');

  lines.push('## Uwagi UI');
  groupByPriority(sanitized.reviewItems).forEach((group) => {
    if (!group.items.length) return;
    lines.push(`### ${group.priority}`);
    group.items.forEach((item) => {
      lines.push(`- [${item.type}] ${item.route}: ${item.comment}`);
      lines.push(`  - target: ${item.target.selectorHint} / ${item.target.text}`);
      if (item.currentBehavior) lines.push(`  - obecnie: ${item.currentBehavior}`);
      if (item.expectedBehavior) lines.push(`  - oczekiwane: ${item.expectedBehavior}`);
    });
  });
  lines.push('');

  lines.push('## Button Matrix');
  if (!sanitized.buttonSnapshots.length) lines.push('- Brak skanu');
  sanitized.buttonSnapshots.forEach((item) => {
    lines.push(`- [${item.qaStatus}] ${item.route}: ${item.text || item.selectorHint} (${item.tag}, disabled=${item.disabled}, visible=${item.visible})`);
  });
  lines.push('');

  lines.push('## Bug Notes');
  if (!sanitized.bugItems.length) lines.push('- Brak');
  sanitized.bugItems.forEach((item) => {
    lines.push(`- [${item.priority}] ${item.route}`);
    lines.push(`  - zrobiłem: ${item.whatIDid}`);
    lines.push(`  - stało się: ${item.whatHappened}`);
    lines.push(`  - oczekiwane: ${item.expected}`);
  });
  lines.push('');

  lines.push('## Zmiany tekstów do wdrożenia');
  if (!sanitized.copyItems.length) lines.push('- Brak');
  sanitized.copyItems.forEach((item) => {
    lines.push(`- ${item.route}: "${item.oldText}" -> "${item.proposedText}"`);
    if (item.reason) lines.push(`  - powód: ${item.reason}`);
  });
  lines.push('');

  lines.push('## Dane techniczne');
  lines.push(`- userAgent: ${sanitized.userAgent}`);
  lines.push(`- reviewItems: ${sanitized.reviewItems.length}`);
  lines.push(`- bugItems: ${sanitized.bugItems.length}`);
  lines.push(`- copyItems: ${sanitized.copyItems.length}`);
  lines.push(`- buttonSnapshots: ${sanitized.buttonSnapshots.length}`);
  lines.push('');

  lines.push('## Sugestia pakietów wdrożeniowych');
  lines.push('- Grupuj P0/P1 jako najbliższy hotfix.');
  lines.push('- Grupuj copy changes osobno, żeby nie mieszać z runtime.');
  lines.push('- Button Matrix użyj jako checklisty ekran po ekranie.');

  return lines.join('\n');
}

export function downloadAdminFeedbackFile(filename: string, content: string, mimeType: string) {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const element = document.createElement('a');
  element.href = url;
  element.download = filename;
  element.rel = 'noopener';
  document.body.appendChild(element);
  element.click();
  element.remove();
  URL.revokeObjectURL(url);
}

export function exportAdminFeedbackJson() {
  const data = buildAdminFeedbackExport();
  const timestamp = buildAdminExportTimestamp();
  downloadAdminFeedbackFile(`closeflow_admin_feedback_${timestamp}.json`, JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
}

export function exportAdminFeedbackMarkdown() {
  const data = buildAdminFeedbackExport();
  const timestamp = buildAdminExportTimestamp();
  downloadAdminFeedbackFile(`closeflow_admin_feedback_${timestamp}.md`, buildAdminFeedbackMarkdown(data), 'text/markdown;charset=utf-8');
}

// ADMIN_DEBUG_TOOLBAR_EXPORT_DOWNLOAD_STAGE87
// ADMIN_FEEDBACK_EXPORT_SANITIZE_STAGE88
