#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function fail(message) {
  console.error(`[closeflow-metric-icon-tone-contract] FAIL: ${message}`);
  process.exit(1);
}

const statCard = read('src/components/StatShortcutCard.tsx');
if (!statCard.includes('data-eliteflow-metric-tone={resolvedTone}')) fail('StatShortcutCard must own data-eliteflow-metric-tone.');
if (!statCard.includes('METRIC_TONE_ALIAS')) fail('StatShortcutCard must map semantic tone aliases centrally.');
const forbiddenMojibakeMarkers = [
  'wartoĹ›Ä‡',
  'dziĹ›',
  'pĹ‚atn',
  'obsĹ‚ugi',
  'obowiÄ…zk',
  'Ä…',
  'Ä™',
  'Ĺ‚',
];
for (const marker of forbiddenMojibakeMarkers) {
  if (statCard.includes(marker)) fail(`StatShortcutCard contains mojibake marker: ${marker}`);
}

const metricCss = read('src/styles/closeflow-metric-tiles.css');
[
  '--cf-metric-tone-neutral-value',
  '--cf-metric-tone-blue-value',
  '--cf-metric-tone-amber-value',
  '--cf-metric-tone-red-value',
  '--cf-metric-tone-green-value',
  '--cf-metric-tone-purple-value',
  '[data-eliteflow-metric-tone="blue"] .cf-top-metric-tile-icon',
  '[data-eliteflow-metric-tone="red"] .cf-top-metric-tile-icon',
].forEach((needle) => {
  if (!metricCss.includes(needle)) fail(`closeflow-metric-tiles.css missing: ${needle}`);
});

const targetFiles = [
  'src/pages/AiDrafts.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
];

const forbiddenToneClass = /StatShortcutCard[\s\S]{0,320}iconClassName="[^"]*text-(red|rose|blue|green|purple|amber|indigo)/g;
const forbiddenValueClass = /StatShortcutCard[\s\S]{0,320}valueClassName="[^"]*text-(red|rose|blue|green|purple|amber|indigo)/g;
const forbiddenLocalTileSystem = /className="[^"]*(metric-card|kpi-card|stats-card-v2|tile-v2)[^"]*"/g;

for (const rel of targetFiles) {
  const content = read(rel);
  if (!content.includes('StatShortcutCard')) fail(`${rel} should use StatShortcutCard for metrics.`);
  if (forbiddenToneClass.test(content)) fail(`${rel} defines local metric icon tone class; use semantic tone prop.`);
  if (forbiddenValueClass.test(content)) fail(`${rel} defines local metric value tone class; use semantic tone prop.`);
  if (forbiddenLocalTileSystem.test(content)) fail(`${rel} introduces a local metric tile system.`);
}

const aiDrafts = read('src/pages/AiDrafts.tsx');
if (!aiDrafts.includes('const MetricCard = StatShortcutCard')) fail('AiDrafts should use StatShortcutCard alias for metric cards.');
const aiMetricLines = aiDrafts
  .split('\n')
  .filter((line) => line.includes('<MetricCard ') && line.includes('label='));
if (!aiMetricLines.length) fail('AiDrafts metric card lines were not found.');
for (const line of aiMetricLines) {
  if (!line.includes(' tone=')) fail('AiDrafts metric card is missing semantic tone prop.');
  if (/iconClassName=|valueClassName=|text-(red|rose|blue|green|purple|amber|indigo)/.test(line)) {
    fail('AiDrafts metric card contains local icon/value tone classes; use semantic tone only.');
  }
}

console.log('[closeflow-metric-icon-tone-contract] OK: metric/icon tone contract is centralized');
