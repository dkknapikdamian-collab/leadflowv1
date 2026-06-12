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

const marker = 'STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS';
const system = read('_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md');
const atlas = read('_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md');
const ui = read('_project/UI_DICTIONARY_STAGE231D0A.md');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const run = read('_project/runs/2026-06-12_STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS.md');
const obsidian = read('_project/obsidian_updates/2026-06-12_STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS.md');
const activeUiBlock = block(ui, 'STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12');

const activeScope = [system, atlas, activeUiBlock, run, obsidian].join('\n');

for (const token of [
  marker,
  'CloseFlowMetricTileV2',
  'FunnelMetricTileR13',
  'CloseFlowMetricToneMap',
  'SharedFilterStrip',
  'RecordListCard',
  'RightRailCard',
  'FinanceMetricTile',
]) {
  requireToken(activeScope, token, `active source truth ${token}`);
}

for (const token of [
  '_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md',
  '_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md',
  '_project/UI_DICTIONARY_STAGE231D0A.md',
  'src/styles/closeflow-metric-tiles.css',
]) {
  requireToken(system + '\n' + run, token, `source truth file ${token}`);
}

for (const token of [
  '--cf-metric-tone-blue-surface',
  '--cf-metric-tone-amber-surface',
  '--cf-metric-tone-purple-surface',
  '--cf-metric-tone-red-surface',
  '--cf-metric-tone-green-surface',
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-content',
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-icon',
  '[data-cf-metric-value-kind="money"]',
]) {
  requireToken(metricCss, token, `metric CSS ${token}`);
}

for (const route of [
  '/today',
  '/leads',
  '/funnel',
  '/cases',
  '/case/:caseId',
  '/clients',
  '/clients/:clientId',
  '/tasks',
  '/calendar',
  '/billing',
  '/activity',
  '/notifications',
  '/templates',
  '/response-templates',
  '/settings',
  '/settings/ai',
  '/support',
]) {
  requireToken(atlas, route, `atlas route ${route}`);
}

for (const token of [
  'CREATE TABLE',
  'ALTER TABLE',
  'chart.js',
  'recharts',
  'onDrag',
  'onDrop',
  'draggable=',
  'KanbanBoard',
  'kanban-column',
  'data-kanban',
]) {
  forbidToken(activeScope, token, `scope creep ${token}`);
}

for (const token of ['Ă', 'Ĺ', 'Ä', 'Å', 'Â', '�', 'ďż˝', 'â€ž', 'â€ť']) {
  forbidToken(activeScope, token, `mojibake in active D0G scope ${token}`);
}

if (failures.length) {
  console.error('STAGE231D0G Visual Tile Source Truth Atlas guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0G Visual Tile Source Truth Atlas guard: PASS');
