const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const indexCss = read('src/index.css');
const stat = read('src/components/StatShortcutCard.tsx');
const css = read('src/styles/eliteflow-metric-tiles-color-font-parity.css');

function fail(message) {
  console.error('[eliteflow-metric-color-font-parity] FAIL: ' + message);
  process.exit(1);
}

const importLine = "@import './styles/eliteflow-metric-tiles-color-font-parity.css';";
if (!indexCss.includes(importLine)) fail('src/index.css missing color/font parity import');
if (!indexCss.trim().endsWith(importLine)) fail('color/font parity CSS must be the final import in src/index.css');

[
  'ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY_2026_05_07',
  'data-eliteflow-metric-tone={tone}',
  'resolveMetricTone',
].forEach((needle) => {
  if (!stat.includes(needle)) fail('StatShortcutCard missing marker: ' + needle);
});

[
  '--eliteflow-value-blue',
  '--eliteflow-value-red',
  '--eliteflow-value-green',
  '--eliteflow-value-purple',
  '[data-eliteflow-metric-tone="blue"] .cf-top-metric-tile-value',
  '[data-eliteflow-metric-tone="red"] .cf-top-metric-tile-icon',
  'background: transparent !important',
  'main[data-p0-tasks-stable-rebuild="true"] > section.grid > button:nth-child(2)',
].forEach((needle) => {
  if (!css.includes(needle)) fail('color/font parity CSS missing marker: ' + needle);
});

console.log('[eliteflow-metric-color-font-parity] OK: metric tiles keep Today shape with semantic colors and clean typography');