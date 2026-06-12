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
const iconRegistry = read('src/components/ui-system/metric-icon-tone-registry.ts');
const operatorTone = read('src/components/ui-system/operator-metric-tone-contract.ts');
const uiIndex = read('src/components/ui-system/index.ts');
const metricCss = read('src/styles/closeflow-metric-tiles.css');
const uiAll = read('_project/UI_DICTIONARY_STAGE231D0A.md', true);

const uiRelevant = [
  block(uiAll, 'STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R5_FUNNEL_SHARED_FILTER_CLIENTS_HEADER_REPAIR_2026_06_12'),
  block(uiAll, 'STAGE231D0F_R4_FUNNEL_SHARED_FILTER_AND_ICONS_2026_06_12'),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('SharedFilterStrip') - 1400)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelIconToneSourceTruth') - 1400)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('MetricTileIconColorSource') - 1400)),
  uiAll.slice(Math.max(0, uiAll.lastIndexOf('FunnelLayoutFrozen') - 1400)),
].filter(Boolean).join('\n');

const run = [
  read('_project/runs/2026-06-12_STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR.md', true),
  read('_project/runs/2026-06-12_STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR.md', true),
  read('_project/runs/2026-06-12_STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR.md', true),
].join('\n');

const obsidian = [
  read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR.md', true),
  read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR.md', true),
  read('_project/obsidian_updates/2026-06-12_STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR.md', true),
].join('\n');

const relevant = [salesFunnel, iconRegistry, operatorTone, uiIndex, metricCss, uiRelevant, run, obsidian].join('\n');

const badTokens = [0x0102, 0x0139, 0x00c4, 0x00c5, 0x00c2, 0xfffd].map((code) => String.fromCharCode(code)).concat(['ďż˝']);
for (const token of badTokens) forbidToken(relevant, token, 'mojibake token in active stage scope');

for (const token of [
  'STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR',
  'data-stage231d0f-r8-layout-frozen="true"',
  'data-stage231d0f-r8-icon-tone-key={definition.iconToneKey}',
  'data-cf-icon-tone-source="closeflow-metric-icon-tone-source-truth-r8"',
  'PaymentEntityIcon',
  'FunnelMoneyMetricIcon',
  'resolveCloseflowMetricIconTone',
  "iconToneKey: 'lead_action:Target'",
  "iconToneKey: 'waiting_no_next_move:Filter'",
  "iconToneKey: 'silence_waiting:Clock3'",
  "iconToneKey: 'risk:ShieldAlert'",
  "iconToneKey: 'finance:PaymentEntityIcon'",
]) {
  requireToken(salesFunnel, token, `SalesFunnel ${token}`);
}

for (const token of [
  'CLOSEFLOW_METRIC_ICON_TONE_SOURCE_TRUTH_R8',
  "lead: 'blue'",
  "target: 'blue'",
  "payment: 'green'",
  "commission: 'green'",
  "billing: 'green'",
  "risk: 'red'",
  "shield_alert: 'red'",
  "silent_7: 'amber'",
  "clock3: 'amber'",
  "case: 'purple'",
  "event: 'purple'",
  'resolveCloseflowMetricIconTone',
]) {
  requireToken(iconRegistry, token, `icon tone registry ${token}`);
}

for (const token of [
  "import { resolveCloseflowMetricIconTone } from './metric-icon-tone-registry';",
  'CLOSEFLOW_METRIC_ICON_TONE_CONTRACT_R8',
  'resolveCloseflowMetricIconTone({ id: input.id, label: input.label, semantic: input.id, fallback: input.tone as OperatorMetricTone })',
]) {
  requireToken(operatorTone, token, `operator tone contract ${token}`);
}

requireToken(uiIndex, "export * from './metric-icon-tone-registry';", 'ui-system export');

for (const token of [
  'STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR',
  '[data-cf-icon-tone-source="closeflow-metric-icon-tone-source-truth-r8"] svg',
  'stroke: currentColor',
]) {
  requireToken(metricCss, token, `metric CSS ${token}`);
}

if (/money:\s*\{[\s\S]{0,320}Icon:\s*ArrowRight/.test(salesFunnel)) {
  failures.push('money tile still uses ArrowRight instead of payment source icon');
}
if (!/silent_7:\s*\{[\s\S]{0,320}semantic:\s*'silence_waiting'/.test(salesFunnel)) {
  failures.push('silent_7 tile is not mapped through silence_waiting semantic tone');
}
if (!/high_risk:\s*\{[\s\S]{0,320}semantic:\s*'risk'/.test(salesFunnel)) {
  failures.push('high_risk tile is not mapped through risk semantic tone');
}
if (!/money:\s*\{[\s\S]{0,420}semantic:\s*'finance'/.test(salesFunnel)) {
  failures.push('money tile is not mapped through finance semantic tone');
}
if (!salesFunnel.includes("label=\"Wszystkie\" count={allCards.length} value={totalValue} tone={resolveCloseflowMetricIconTone({ id: 'all', label: 'Wszystkie', semantic: 'all' })}")) {
  failures.push('all stage filter does not use neutral all semantic tone');
}

for (const token of [
  'SharedFilterStrip',
  'FunnelIconToneSourceTruth',
  'MetricTileIconColorSource',
  'FunnelLayoutFrozen',
]) {
  requireToken(uiRelevant, token, `UI Dictionary ${token}`);
}

for (const token of ['CREATE TABLE', 'ALTER TABLE', 'onDrag', 'onDrop', 'draggable=', 'KanbanBoard', 'kanban-column', 'data-kanban']) {
  forbidToken(relevant, token, 'scope creep token');
}

if (failures.length) {
  console.error('STAGE231D0F-R11 Funnel R6 regression guard resolver repair guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0F-R11 Funnel R6 regression guard resolver repair guard: PASS');
