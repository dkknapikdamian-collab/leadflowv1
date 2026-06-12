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
  0x0102,
  0x0139,
  0x00c4,
  0x00c5,
  0x00c2,
  0xfffd,
].map((code) => String.fromCharCode(code)).concat(['ďż˝']);

const salesFunnel = read('src/pages/SalesFunnel.tsx');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const funnelCss = read('src/styles/sales-funnel-stage231d0f-visual-alignment.css');
const uiAll = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);

const uiRelevant = [
  block(uiAll, 'STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R4_FUNNEL_RECORDS_HEADER_REGEX_REPAIR_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12'),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('MetricTileIconColorSource') - 1400)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelColorToneMap') - 1400)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelRecordsHeaderRow') - 1400)),
].filter(Boolean).join('\n');

const run = read('_project/runs/2026-06-12_STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR.md', true);
const obsidian = read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR.md', true);
const relevant = [salesFunnel, metricCss, funnelCss, uiRelevant, run, obsidian].join('\n');

for (const token of badTokens) {
  forbidToken(relevant, token, 'mojibake token in active stage scope');
}

for (const token of [
  'data-stage231d0f-r3-records-header-row="true"',
  'cf-funnel-records-header-row',
  'cf-funnel-records-title',
  'cf-funnel-records-count',
]) {
  requireToken(salesFunnel + '\n' + funnelCss, token, `records header token ${token}`);
}

if (
  !salesFunnel.includes('data-stage231d0f-r5-records-header-line-repair="true"') &&
  !salesFunnel.includes('data-stage231d0f-r4-records-header-regex-repair="true"')
) {
  failures.push('missing R5/R4 records header repair marker');
}

if (salesFunnel.includes('<p className="text-xs font-black uppercase tracking') && salesFunnel.includes('{visibleLabel}</p>')) {
  failures.push('old visibleLabel paragraph still present in SalesFunnel');
}

if (salesFunnel.includes('<h2 className="text-xl font-black') && salesFunnel.includes('Rekordy w aktywnym widoku</h2>')) {
  failures.push('old records h2 title still present in SalesFunnel');
}

for (const token of [
  'STAGE231D0F_R3_METRIC_TILE_ICON_COLOR_SOURCE',
  '--cf-metric-tone-blue-icon',
  '--cf-metric-tone-amber-icon',
  '--cf-metric-tone-purple-icon',
  '--cf-metric-tone-red-icon',
  '--cf-metric-tone-green-icon',
  'stroke: currentColor',
  'color: currentColor',
]) {
  requireToken(metricCss, token, `metric source token ${token}`);
}

for (const token of [
  'FUNNEL_OWNER_TILE_TONE_MAP',
  'data-eliteflow-metric-tone',
  'cf-top-metric-tile-icon',
  "tone: 'blue'",
  "tone: 'amber'",
  "tone: 'purple'",
  "tone: 'red'",
  "tone: 'green'",
]) {
  requireToken(salesFunnel, token, `funnel tile token ${token}`);
}

for (const token of [
  'MetricTileIconColorSource',
  'FunnelRecordsHeaderRow',
  'FunnelColorToneMap',
]) {
  requireToken(uiRelevant, token, `UI Dictionary ${token}`);
}

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts']) {
  forbidToken(relevant, token, 'scope creep token');
}

for (const token of ['onDrag', 'onDrop', 'draggable=', 'KanbanBoard', 'kanban-column', 'data-kanban']) {
  forbidToken(salesFunnel, token, 'kanban/drag runtime token');
}

if (failures.length) {
  console.error('STAGE231D0F-R4 Funnel records header regex repair guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0F-R4 Funnel records header regex repair guard: PASS');
