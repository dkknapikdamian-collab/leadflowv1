#!/usr/bin/env node
const fs = require('fs');

const failures = [];

function read(path, optional = false) {
  if (!fs.existsSync(path)) {
    if (!optional) failures.push(`missing file: ${path}`);
    return '';
  }
  return fs.readFileSync(path, 'utf8');
}

function must(text, token, label = token) {
  if (!text.includes(token)) failures.push(`missing ${label}: ${token}`);
}

function mustNot(text, token, label = token) {
  if (text.includes(token)) failures.push(`forbidden ${label}: ${token}`);
}

function block(text, markerPrefix) {
  const start = `<!-- ${markerPrefix}_START -->`;
  const end = `<!-- ${markerPrefix}_END -->`;
  const startIndex = text.indexOf(start);
  if (startIndex < 0) return '';
  const endIndex = text.indexOf(end, startIndex);
  if (endIndex < 0) return text.slice(startIndex);
  return text.slice(startIndex, endIndex + end.length);
}

const tsx = read('src/pages/NotificationsCenter.tsx');
const css = read('src/styles/visual-stage10-notifications-vnext.css');
const atlas = read('_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md');
const ui = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);
const run = read('_project/runs/2026-06-12_STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS.md', true);
const obsidian = read('_project/obsidian_updates/2026-06-12_STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS.md', true);

const uiBlock = block(ui, 'STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12');
const activeScope = [tsx, css, atlas, uiBlock, run, obsidian].join('\n');

for (const token of [
  'STAGE231D0H_N1_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP',
  'STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS',
  'data-stage231d0h-n1-notifications-visual-source-cleanup="true"',
  'data-stage231d0h-n1-r3-section-bounds="true"',
  'data-stage231d0h-n1-notifications-metric-renderer="CloseFlowMetricTileV2"',
  'data-eliteflow-metric-tone',
  'cf-top-metric-tile',
  'cf-top-metric-tile-content',
  'cf-top-metric-tile-icon',
  'data-cf-metric-tile-contract="final-vs5"',
]) {
  must(tsx, token, `top tile JSX ${token}`);
}

for (const token of [
  'notifications-today-parity-card',
  'data-notifications-metric-tone',
  'notifications-today-parity-icon',
]) {
  mustNot(tsx, token, `legacy active top tile JSX ${token}`);
}

for (const token of [
  'Ostrzeżenia o konfliktach terminów',
  'data-notification-rail-card="conflicts"',
  'data-stage181aj-conflict-notifications',
  'Gdy terminy będą się nakładać',
]) {
  mustNot(tsx, token, `removed conflict placeholder ${token}`);
}

for (const token of [
  'notifications-list-title',
  'notifications-list-meta',
  'notifications-list-refresh',
  'notifications-list-count',
  'data-stage213c-a-notifications-last-refresh',
]) {
  must(tsx, token, `list header ${token}`);
}

const listTitleStart = tsx.indexOf('className="notifications-list-title"');
const listMetaStart = tsx.indexOf('className="notifications-list-meta"');
if (listTitleStart >= 0 && listMetaStart > listTitleStart) {
  const titleBlock = tsx.slice(listTitleStart, listMetaStart);
  if (titleBlock.includes('data-stage213c-a-notifications-last-refresh')) {
    failures.push('last refresh marker still sits in left title block');
  }
} else {
  failures.push('cannot locate list title/meta block order');
}

for (const token of [
  'data-cf-notification-row-tone',
  'data-cf-notification-row-kind',
  'NotificationRowIcon',
]) {
  must(tsx, token, `row icon ${token}`);
}
mustNot(tsx, 'className="notifications-row-icon cf-severity-dot"', 'row icon old severity dot wrapper');

for (const token of [
  '.notifications-row-icon[data-cf-notification-row-tone="info"]',
  '.notifications-row-icon[data-cf-notification-row-tone="warning"]',
  '.notifications-row-icon[data-cf-notification-row-tone="error"]',
  '.notifications-row-icon[data-cf-notification-row-tone="success"]',
  '.notifications-list-meta',
  '.notifications-list-refresh',
  '.notifications-list-count',
]) {
  must(css, token, `CSS ${token}`);
}

for (const token of [
  'NotificationsMetricTile',
  'NotificationsRowIcon',
  'NotificationsRightRail',
  'NotificationsCenterVisualBaseline',
  'CloseFlowMetricTileV2',
]) {
  must(uiBlock + '\n' + run + '\n' + obsidian, token, `UI Dictionary/run ${token}`);
}

for (const token of [
  '/notifications',
  'Top metric tiles -> CloseFlowMetricTileV2',
  'Right rail cards -> RightRailCard',
  'Rows -> NotificationsRow / RecordListCard derivative',
  'N1 removes conflict placeholder card',
]) {
  must(atlas, token, `atlas ${token}`);
}

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'chart.js', 'recharts', 'onDrag', 'onDrop', 'draggable=', 'KanbanBoard', 'kanban-column', 'data-kanban']) {
  mustNot(activeScope, token, `scope creep ${token}`);
}

for (const token of ['Ă', 'Ĺ', 'Ä', 'Å', 'Â', '�', 'ďż˝', 'â€ž', 'â€ť']) {
  mustNot(activeScope, token, `mojibake in active N1 R3 scope ${token}`);
}

if (failures.length) {
  console.error('STAGE231D0H-N1-R3 Notifications visual source cleanup guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0H-N1-R3 Notifications visual source cleanup guard: PASS');
