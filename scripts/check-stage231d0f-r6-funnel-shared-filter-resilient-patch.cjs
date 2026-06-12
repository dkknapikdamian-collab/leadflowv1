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
const clients = read('src/pages/Clients.tsx');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const funnelCss = read('src/styles/sales-funnel-stage231d0f-visual-alignment.css');
const recordCss = read('src/styles/closeflow-record-list-source-truth.css');
const uiAll = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);
const uiRelevant =
  block(uiAll, 'STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12') ||
  block(uiAll, 'STAGE231D0F_R5_FUNNEL_SHARED_FILTER_CLIENTS_HEADER_REPAIR_2026_06_12') ||
  block(uiAll, 'STAGE231D0F_R4_FUNNEL_SHARED_FILTER_AND_ICONS_2026_06_12') ||
  [
    uiAll.slice(Math.max(0, uiAll.lastIndexOf('SharedFilterStrip') - 1200)),
    uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelStageFilterChip') - 1200)),
    uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelDecisionOpenButton') - 1200)),
    uiAll.slice(Math.max(0, uiAll.lastIndexOf('MetricTileIconColorSource') - 1200)),
  ].join('\n');
const run = read('_project/runs/2026-06-12_STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH.md', true);
const obsidian = read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH.md', true);
const relevant = [salesFunnel, clients, metricCss, funnelCss, recordCss, uiRelevant, run, obsidian].join('\n');

for (const token of badTokens) {
  forbidToken(relevant, token, 'mojibake token in active stage scope');
}

for (const token of [
  'STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH',
  'data-stage231d0f-r6-stage-filter-no-visible-money="true"',
]) {
  requireToken(salesFunnel, token, `SalesFunnel ${token}`);
}

for (const token of [
  'STAGE231D0F_R6_CLIENTS_SHARED_FILTER_RESILIENT_PATCH',
  'data-stage231d0f-r6-client-shared-filter-strip="true"',
  'data-stage231d0f-r6-client-filter-header="true"',
]) {
  requireToken(clients, token, `Clients ${token}`);
}

for (const token of [
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-icon svg',
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-icon svg *',
  'stroke: currentColor',
  'color: currentColor',
]) {
  requireToken(metricCss, token, `metric icon source token ${token}`);
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
  requireToken(salesFunnel, token, `funnel owner tile token ${token}`);
}

if (salesFunnel.includes('cf-funnel-stage-filter-chip-value')) {
  failures.push('visible stage filter money class still rendered in SalesFunnel');
}
requireToken(salesFunnel, 'aria-label={`${label}, ${count} rekordów, wartość ${formatMoney(value, \'PLN\')}`}', 'stage money aria-label');
requireToken(salesFunnel, 'title={`${label}: ${count} rekordów · ${formatMoney(value, \'PLN\')}`}', 'stage money title');

for (const token of [
  '--cf-funnel-open-link-width',
  '.cf-funnel-decision-open-link',
  'width: var(--cf-funnel-open-link-width)',
  'min-width: var(--cf-funnel-open-link-width)',
]) {
  requireToken(funnelCss, token, `open button CSS ${token}`);
}
if (/\.cf-funnel-decision-open-link[\s\S]{0,320}min-width:\s*max-content/.test(funnelCss)) {
  failures.push('funnel open button still uses min-width: max-content');
}

for (const token of [
  'cf-filter-strip',
  'cf-filter-pills',
  'cf-filter-pill',
  'data-stage231d0f-r6-funnel-shared-filter-strip="true"',
]) {
  requireToken(salesFunnel, token, `SalesFunnel shared filter token ${token}`);
}

for (const token of [
  'cf-filter-strip',
  'cf-filter-strip-header',
  'cf-filter-strip-title',
  'cf-filter-strip-description',
  'cf-filter-pills',
  'cf-filter-pill',
  'data-stage231d0f-r6-client-shared-filter-strip="true"',
  'data-stage231d0f-r6-client-filter-header="true"',
]) {
  requireToken(clients, token, `Clients shared filter token ${token}`);
}

for (const token of [
  'SharedFilterStrip',
  'FunnelStageFilterChip',
  'FunnelDecisionOpenButton',
  'MetricTileIconColorSource',
]) {
  requireToken(uiRelevant, token, `UI Dictionary ${token}`);
}

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts']) {
  forbidToken(relevant, token, 'scope creep token');
}

for (const token of ['onDrag', 'onDrop', 'draggable=', 'KanbanBoard', 'kanban-column', 'data-kanban']) {
  forbidToken(salesFunnel + '\n' + clients, token, 'kanban/drag runtime token');
}

if (failures.length) {
  console.error('STAGE231D0F-R6 Funnel shared filter resilient patch guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0F-R6 Funnel shared filter resilient patch guard: PASS');
