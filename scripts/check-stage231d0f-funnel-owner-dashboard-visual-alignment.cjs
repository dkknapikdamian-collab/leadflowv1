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

function requireToken(text, token, label = token) {
  if (!text.includes(token)) failures.push(`missing ${label}: ${token}`);
}

function forbidToken(text, token, label = token) {
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

const badTokens = [
  0x0102, 0x0139, 0x00c4, 0x00c5, 0x00c2, 0xfffd,
].map((code) => String.fromCharCode(code)).concat(['ďż˝']);

const salesFunnel = read('src/pages/SalesFunnel.tsx');
const css = read('src/styles/sales-funnel-stage231d0f-visual-alignment.css');
const uiAll = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);
const uiRelevant =
  block(uiAll, 'STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12') ||
  block(uiAll, 'STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12') ||
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelOwnerDashboard') - 1200));
const relevant = [salesFunnel, css, uiRelevant].join('\n');

for (const token of badTokens) {
  forbidToken(relevant, token, 'mojibake token in active funnel scope');
}

for (const token of [
  'STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT',
  'data-stage227b-decision-list-view="true"',
  'data-stage228a-funnel-truth-clickability="true"',
  'data-stage231d0f-funnel-owner-dashboard="true"',
  'data-stage231d0f-owner-decision-tile="true"',
  'data-stage231d0f-stage-filter-strip="true"',
  'data-stage231d0f-decision-list-card="true"',
  'data-stage231d0f-owner-priority-rail="true"',
  'FunnelOwnerDecisionTile',
  'FunnelStageFilterChip',
  'FunnelDecisionSignal',
  'FunnelDecisionListCard',
  'cf-funnel-owner-decision-tile',
  'cf-funnel-stage-filter-strip',
  'cf-funnel-decision-list-card',
  'cf-funnel-owner-priority-rail',
  'closeflow-metric-tiles.css',
  'sales-funnel-stage231d0f-visual-alignment.css',
]) {
  requireToken(salesFunnel, token, `SalesFunnel ${token}`);
}

if (!/lista decyzji/i.test(relevant)) failures.push('missing owner-dashboard rule: lista decyzji');
if (!/nie kanban/i.test(relevant) && !/nie jest kanbanem/i.test(relevant)) failures.push('missing owner-dashboard rule: nie kanban');

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts']) {
  forbidToken(relevant, token, 'scope creep token');
}

for (const token of ['onDrag', 'onDrop', 'draggable=', 'KanbanBoard', 'kanban-column', 'data-kanban']) {
  forbidToken(salesFunnel, token, 'kanban/drag runtime token');
}

if (failures.length) {
  console.error('STAGE231D0F Funnel owner dashboard visual alignment guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0F Funnel owner dashboard visual alignment guard: PASS');
