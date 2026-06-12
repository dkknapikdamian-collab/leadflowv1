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

const salesFunnel = read('src/pages/SalesFunnel.tsx');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const funnelCss = read('src/styles/sales-funnel-stage231d0f-visual-alignment.css', true);
const uiAll = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);
const uiRelevant = [
  block(uiAll, 'STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12'),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelMetricToneMapR12') - 1600)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelMoneyMetricTile') - 1600)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('MetricTileIconColorSource') - 1600)),
].filter(Boolean).join('\n');
const run = read('_project/runs/2026-06-12_STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE.md', true);
const obsidian = read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE.md', true);
const relevant = [salesFunnel, metricCss, funnelCss, uiRelevant, run, obsidian].join('\n');

const badTokens = [0x0102, 0x0139, 0x00c4, 0x00c5, 0x00c2, 0xfffd].map((code) => String.fromCharCode(code)).concat(['ďż˝']);
for (const token of badTokens) forbidToken(relevant, token, 'mojibake token in active stage scope');

for (const token of [
  'STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE',
  'FUNNEL_OWNER_TILE_TONE_MAP',
  'move_now',
  'no_next_move',
  'silent_7',
  'high_risk',
  'money',
  "tone: 'blue'",
  "tone: 'amber'",
  "tone: 'purple'",
  "tone: 'red'",
  "tone: 'green'",
  'Target',
  'Filter',
  'Clock3',
  'ShieldAlert',
  'PaymentEntityIcon',
  "iconToneKey: 'funnel:move_now:blue:Target'",
  "iconToneKey: 'funnel:no_next_move:amber:Filter'",
  "iconToneKey: 'funnel:silent_7:purple:Clock3'",
  "iconToneKey: 'funnel:high_risk:red:ShieldAlert'",
  "iconToneKey: 'funnel:money:green:PaymentEntityIcon'",
  "valueKind: 'money'",
  "data-cf-metric-value-kind={definition.valueKind || 'count'}",
  'data-eliteflow-metric-tone',
  'cf-top-metric-tile-icon',
  'data-cf-icon-tone-source',
]) {
  requireToken(salesFunnel, token, `SalesFunnel ${token}`);
}

for (const token of [
  '--cf-metric-tone-blue-icon',
  '--cf-metric-tone-amber-icon',
  '--cf-metric-tone-purple-icon',
  '--cf-metric-tone-red-icon',
  '--cf-metric-tone-green-icon',
  '--cf-metric-tone-blue-tile-bg',
  '--cf-metric-tone-amber-tile-bg',
  '--cf-metric-tone-purple-tile-bg',
  '--cf-metric-tone-red-tile-bg',
  '--cf-metric-tone-green-tile-bg',
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-icon svg',
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-icon svg *',
  'stroke: currentColor',
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-icon svg [fill]:not([fill="none"])',
  '[data-cf-metric-value-kind="money"] .cf-top-metric-tile-value',
]) {
  requireToken(metricCss, token, `metric CSS ${token}`);
}

for (const token of [
  '.cf-funnel-owner-decision-tile[data-eliteflow-metric-tone="blue"] svg',
  '.cf-funnel-owner-decision-tile[data-eliteflow-metric-tone="amber"] svg',
  '.cf-funnel-owner-decision-tile[data-eliteflow-metric-tone="purple"] svg',
  '.cf-funnel-owner-decision-tile[data-eliteflow-metric-tone="red"] svg',
  '.cf-funnel-owner-decision-tile[data-eliteflow-metric-tone="green"] svg',
  'nth-child',
]) {
  forbidToken(funnelCss, token, `local funnel owner tile color source ${token}`);
}

for (const token of [
  'FunnelMetricToneMapR12',
  'MetricTileIconColorSource',
  'FunnelMoneyMetricTile',
  'R2/R3/R5/R6/R8 compatibility audit',
]) {
  requireToken(uiRelevant + '\n' + run + '\n' + obsidian, token, `project memory ${token}`);
}

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts', 'onDrag', 'onDrop', 'draggable=', 'KanbanBoard', 'kanban-column', 'data-kanban']) {
  forbidToken(relevant, ` ${token}`, `scope creep token ${token}`);
}

if (failures.length) {
  console.error('STAGE231D0F-R12 Funnel metric colors real CSS enforce guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0F-R12 Funnel metric colors real CSS enforce guard: PASS');
