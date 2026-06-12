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
  0x0102, // Ă
  0x0139, // Ĺ
  0x00c4, // Ä
  0x00c5, // Å
  0x00c2, // Â
  0xfffd, // �
].map((code) => String.fromCharCode(code)).concat(['ďż˝']);

const salesFunnel = read('src/pages/SalesFunnel.tsx');
const css = read('src/styles/sales-funnel-stage231d0f-visual-alignment.css');
const uiAll = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);
const uiRelevant =
  block(uiAll, 'STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12') ||
  block(uiAll, 'STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12') ||
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelOwnerDashboard') - 1200));

const runR4 = read('_project/runs/2026-06-12_STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR.md', true);
const obsidianR4 = read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR.md', true);
const combinedRelevant = [salesFunnel, css, uiRelevant, runR4, obsidianR4].join('\n');

for (const token of badTokens) {
  forbidToken(combinedRelevant, token, 'mojibake token in active stage scope');
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
  'function FunnelOwnerDecisionTile',
  'function FunnelStageFilterChip',
  'function FunnelDecisionSignal',
  'function FunnelDecisionListCard',
  'cf-funnel-owner-decision-tile',
  'cf-funnel-stage-filter-strip',
  'cf-funnel-decision-list-card',
  'cf-funnel-owner-priority-rail',
  'closeflow-metric-tiles.css',
  'sales-funnel-stage231d0f-visual-alignment.css',
]) {
  requireToken(salesFunnel, token, `SalesFunnel ${token}`);
}

for (const token of [
  'FunnelOwnerDashboard',
  'FunnelOwnerDecisionTile',
  'FunnelStageFilterStrip',
  'FunnelDecisionListCard',
  'FunnelOwnerPriorityRail',
]) {
  requireToken(uiRelevant, token, `UI Dictionary ${token}`);
}

for (const token of [
  'Do ruchu teraz',
  'Bez kroku',
  'Cisza 7+',
  'Wysokie ryzyko',
  'Pieniądze',
]) {
  requireToken(salesFunnel, token, `owner filter ${token}`);
}

if (!/lista decyzji/i.test(combinedRelevant)) failures.push('missing owner-dashboard rule: lista decyzji');
if (!/nie kanban/i.test(combinedRelevant) && !/nie jest kanbanem/i.test(combinedRelevant)) failures.push('missing owner-dashboard rule: nie kanban');

for (const token of [
  'function DecisionTile(',
  'function StagePill(',
  'function Signal(',
  '<DecisionTile',
  '<StagePill',
  '<Signal',
  '<DecisionListCard',
  'text-3xl font-black tracking-tight',
  'rounded-2xl border p-4 text-left shadow-sm',
]) {
  forbidToken(salesFunnel, token, 'old local funnel style');
}

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'chart.js', 'recharts']) {
  forbidToken(combinedRelevant, token, 'scope creep token');
}

for (const token of ['onDrag', 'onDrop', 'draggable=', 'KanbanBoard', 'kanban-column', 'data-kanban']) {
  forbidToken(salesFunnel, token, 'kanban/drag runtime token');
}

requireToken(css, 'STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT', 'CSS marker');
requireToken(css, '--cf-funnel-card-shadow', 'funnel shadow token');
requireToken(css, 'not a kanban', 'CSS product rule');

if (failures.length) {
  console.error('STAGE231D0F Funnel owner dashboard visual alignment guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0F Funnel owner dashboard visual alignment guard: PASS');
