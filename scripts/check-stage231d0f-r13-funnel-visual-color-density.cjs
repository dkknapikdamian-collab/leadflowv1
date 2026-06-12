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
const funnelCss = read('src/styles/sales-funnel-stage231d0f-visual-alignment.css');
const uiAll = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);
const uiRelevant = [
  block(uiAll, 'STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12'),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelVisualToneR13') - 1600)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelDecisionSignalTone') - 1600)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelDecisionOpenButton') - 1600)),
].filter(Boolean).join('\n');
const run = read('_project/runs/2026-06-12_STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY.md', true);
const obsidian = read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY.md', true);
const relevant = [salesFunnel, metricCss, funnelCss, uiRelevant, run, obsidian].join('\n');

const badTokens = [0x0102, 0x0139, 0x00c4, 0x00c5, 0x00c2, 0xfffd].map((code) => String.fromCharCode(code)).concat(['ďż˝']);
for (const token of badTokens) forbidToken(relevant, token, 'mojibake token in active stage scope');

for (const token of [
  'STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY',
  'data-cf-funnel-entity-type',
  'data-cf-funnel-risk-level',
  'data-cf-funnel-needs-movement',
  'data-cf-funnel-has-value',
  'data-cf-signal-tone',
  "tone={card.entityType === 'case' ? 'purple' : 'blue'}",
  "tone={typeof card.silenceDays === 'number' && card.silenceDays >= 7 ? 'purple' : 'neutral'}",
  "tone={card.hasNextMove ? 'green' : 'amber'}",
  "tone={card.valueAmount > 0 ? 'green' : 'neutral'}",
]) {
  requireToken(salesFunnel, token, `SalesFunnel ${token}`);
}

for (const token of [
  '--cf-metric-tone-blue-surface',
  '--cf-metric-tone-amber-surface',
  '--cf-metric-tone-purple-surface',
  '--cf-metric-tone-red-surface',
  '--cf-metric-tone-green-surface',
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-content::before',
  '[data-eliteflow-metric-tone] .cf-top-metric-tile-icon svg *',
  'stroke: currentColor',
  '[data-cf-metric-value-kind="money"] .cf-top-metric-tile-value',
]) {
  requireToken(metricCss, token, `metric CSS ${token}`);
}

for (const token of [
  '--cf-funnel-open-link-width: 156px',
  'white-space: nowrap',
  'line-height: 1',
  '#root .main-funnel-html .cf-funnel-decision-open-link svg',
  'data-cf-signal-tone="blue"',
  'data-cf-signal-tone="amber"',
  'data-cf-signal-tone="purple"',
  'data-cf-signal-tone="green"',
]) {
  requireToken(funnelCss, token, `funnel CSS ${token}`);
}

for (const token of [
  '--cf-funnel-open-link-width: 132px',
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
  forbidToken(relevant, token, `scope/visual contract token ${token}`);
}

for (const token of [
  'FunnelVisualToneR13',
  'FunnelDecisionSignalTone',
  'FunnelDecisionOpenButton',
]) {
  requireToken(uiRelevant + '\n' + run + '\n' + obsidian, token, `project memory ${token}`);
}

if (failures.length) {
  console.error('STAGE231D0F-R13 Funnel visual color density guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0F-R13 Funnel visual color density guard: PASS');
