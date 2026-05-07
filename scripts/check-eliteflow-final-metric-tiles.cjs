const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const indexCss = read('src/index.css');
const stat = read('src/components/StatShortcutCard.tsx');
const lockCss = read('src/styles/eliteflow-final-metric-tiles-hard-lock.css');

function fail(message) {
  console.error('[eliteflow-final-metric-tiles] FAIL: ' + message);
  process.exit(1);
}

const finalImport = "@import './styles/eliteflow-final-metric-tiles-hard-lock.css';";
const colorImport = "@import './styles/eliteflow-metric-tiles-color-font-parity.css';";
if (!indexCss.includes(finalImport)) fail('src/index.css does not import final metric tile hard lock');
if (!indexCss.includes(colorImport)) fail('src/index.css does not import metric tile color/font parity layer');
if (indexCss.lastIndexOf(finalImport) > indexCss.lastIndexOf(colorImport)) {
  fail('final metric tile hard lock must load before color/font parity layer');
}
const trimmed = indexCss.trim();
if (!trimmed.endsWith(colorImport)) fail('metric tile color/font parity import must be the last non-empty line in src/index.css');

if (stat.includes("'cf-top-metric-tile-content metric'") || stat.includes('"cf-top-metric-tile-content metric"')) {
  fail('StatShortcutCard visible content still carries legacy .metric class, which lets old page CSS create nested broken tiles');
}
if (stat.includes("active ? 'is-active active'") || stat.includes('active ? "is-active active"')) {
  fail('StatShortcutCard still adds legacy .active class to visible content');
}
if (!stat.includes('data-eliteflow-today-metric-lock="true"')) {
  fail('StatShortcutCard is missing data-eliteflow-today-metric-lock marker');
}

[
  'ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK_2026_05_07',
  'html body #root [data-stat-shortcut-card][data-eliteflow-today-metric-lock="true"]',
  '.main-leads-html',
  'main[data-p0-tasks-stable-rebuild="true"] > section.grid',
  'grid-template-columns: repeat(4, minmax(0, 1fr)) !important',
  'background-image: none !important',
].forEach((needle) => {
  if (!lockCss.includes(needle)) fail('lock CSS missing required marker: ' + needle);
});

console.log('[eliteflow-final-metric-tiles] OK: hard lock loads before color/font parity and blocks legacy blue metric tiles');