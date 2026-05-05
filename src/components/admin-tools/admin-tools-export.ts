import {
  AdminFeedbackExport,
  AdminPriority,
  AdminReviewItem,
} from './admin-tools-types';
import { readFullAdminFeedbackExport } from './admin-tools-storage';

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

export function buildAdminFeedbackExport(): AdminFeedbackExport {
  return {
    ...readFullAdminFeedbackExport(),
    generatedAt: new Date().toISOString(),
    commit: 'COMMIT_SHA_PLACEHOLDER',
    route: getRoute(),
    userAgent: getUserAgent(),
    viewport: getViewport(),
  };
}

function groupByPriority(items: AdminReviewItem[]) {
  const priorities: AdminPriority[] = ['P0', 'P1', 'P2', 'P3'];
  return priorities.map((priority) => ({
    priority,
    items: items.filter((item) => item.priority === priority),
  }));
}

export function buildAdminFeedbackMarkdown(exportData: AdminFeedbackExport) {
  const lines: string[] = [];
  lines.push('# CloseFlow Admin Feedback Export');
  lines.push('');
  lines.push(`Generated: ${exportData.generatedAt}`);
  lines.push(`Route: ${exportData.route}`);
  lines.push(`Commit: ${exportData.commit}`);
  lines.push(`Viewport: ${exportData.viewport.width}x${exportData.viewport.height} @${exportData.viewport.devicePixelRatio}`);
  lines.push('');
  lines.push('## Blokery P0');
  const blockers = exportData.reviewItems.filter((item) => item.priority === 'P0');
  if (!blockers.length) lines.push('- Brak');
  blockers.forEach((item) => lines.push(`- ${item.route}: ${item.comment} (${item.target.selectorHint})`));
  lines.push('');

  lines.push('## Uwagi UI');
  groupByPriority(exportData.reviewItems).forEach((group) => {
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
  if (!exportData.buttonSnapshots.length) lines.push('- Brak skanu');
  exportData.buttonSnapshots.forEach((item) => {
    lines.push(`- [${item.qaStatus}] ${item.route}: ${item.text || item.selectorHint} (${item.tag}, disabled=${item.disabled}, visible=${item.visible})`);
  });
  lines.push('');

  lines.push('## Bug Notes');
  if (!exportData.bugItems.length) lines.push('- Brak');
  exportData.bugItems.forEach((item) => {
    lines.push(`- [${item.priority}] ${item.route}`);
    lines.push(`  - zrobiłem: ${item.whatIDid}`);
    lines.push(`  - stało się: ${item.whatHappened}`);
    lines.push(`  - oczekiwane: ${item.expected}`);
  });
  lines.push('');

  lines.push('## Zmiany tekstów do wdrożenia');
  if (!exportData.copyItems.length) lines.push('- Brak');
  exportData.copyItems.forEach((item) => {
    lines.push(`- ${item.route}: "${item.oldText}" -> "${item.proposedText}"`);
    if (item.reason) lines.push(`  - powód: ${item.reason}`);
  });
  lines.push('');

  lines.push('## Dane techniczne');
  lines.push(`- userAgent: ${exportData.userAgent}`);
  lines.push(`- reviewItems: ${exportData.reviewItems.length}`);
  lines.push(`- bugItems: ${exportData.bugItems.length}`);
  lines.push(`- copyItems: ${exportData.copyItems.length}`);
  lines.push(`- buttonSnapshots: ${exportData.buttonSnapshots.length}`);
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
