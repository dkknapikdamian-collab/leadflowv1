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
const css = read('src/styles/sales-funnel-stage231d0f-visual-alignment.css');
const uiAll = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);
const uiRelevant =
  block(uiAll, 'STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12') ||
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelColorToneMap') - 1200));
const run = read('_project/runs/2026-06-12_STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY.md', true);
const obsidian = read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY.md', true);
const relevant = [salesFunnel, css, uiRelevant, run, obsidian].join('\n');

for (const token of badTokens) {
  forbidToken(relevant, token, 'mojibake token in active stage scope');
}

requireToken(salesFunnel, 'STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY', 'R2 marker');
requireToken(salesFunnel, 'FUNNEL_OWNER_TILE_TONE_MAP', 'owner tone map');

for (const token of [
  'Do ruchu teraz',
  'Bez kroku',
  'Cisza 7+',
  'Wysokie ryzyko',
  'Pieniądze',
  'move_now',
  'no_next_move',
  'silent_7',
  'high_risk',
  'money',
]) {
  requireToken(salesFunnel, token, `owner tile map token ${token}`);
}

for (const token of [
  "tone: 'blue'",
  "tone: 'amber'",
  "tone: 'purple'",
  "tone: 'red'",
  "tone: 'green'",
  'Target',
  'Filter',
  'Clock3',
  'ShieldAlert',
  'ArrowRight',
  'data-eliteflow-metric-tone',
  'cf-top-metric-tile-icon',
  'data-stage231d0f-r2-owner-tile-tone',
]) {
  requireToken(salesFunnel, token, `tone/icon token ${token}`);
}

const hasSharedClientFilter =
  salesFunnel.includes('cf-contact-cadence-strip') &&
  salesFunnel.includes('cf-contact-cadence-pills') &&
  salesFunnel.includes('cf-status-pill') &&
  salesFunnel.includes('pill') &&
  salesFunnel.includes('data-cf-status-tone');

const hasFilterAlias =
  salesFunnel.includes('cf-filter-strip') &&
  salesFunnel.includes('cf-filter-pills') &&
  salesFunnel.includes('cf-filter-pill') &&
  /FunnelStageFilterStrip[\s\S]{0,2000}wspóln/i.test(uiRelevant);

if (!hasSharedClientFilter && !hasFilterAlias) {
  failures.push('stage filters do not use shared client filter classes or documented cf-filter alias');
}

for (const token of [
  'cf-contact-cadence-strip',
  'cf-contact-cadence-pills',
  'cf-status-pill',
  'data-cf-status-tone',
  'cf-filter-strip',
  'cf-filter-pills',
  'cf-filter-pill',
  'resolveFunnelStageFilterTone',
]) {
  requireToken(salesFunnel, token, `stage filter token ${token}`);
}

for (const token of [
  'FunnelColorToneMap',
  'FunnelStageFilterStrip',
  'FunnelOwnerDecisionTile',
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
  console.error('STAGE231D0F-R2 Funnel color/filter parity guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0F-R2 Funnel color/filter parity guard: PASS');
