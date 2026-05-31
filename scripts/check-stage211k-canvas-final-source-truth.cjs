const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/closeflow-canvas-final-source-truth-stage211k.css');
const indexPath = path.join(root, 'src/index.css');
const layoutPath = path.join(root, 'src/components/Layout.tsx');

function fail(msg) {
  console.error(`STAGE211K_CANVAS_FINAL_SOURCE_TRUTH_GUARD_FAIL: ${msg}`);
  process.exit(1);
}

for (const file of [cssPath, indexPath, layoutPath]) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(root, file)}`);
}

const css = fs.readFileSync(cssPath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');
const layout = fs.readFileSync(layoutPath, 'utf8');

const requiredCssMarkers = [
  'STAGE211K_CANVAS_FINAL_SOURCE_TRUTH_2026_05_30',
  '--cf-canvas-bg: #f8fafc !important',
  '--cf-operator-bg: var(--cf-canvas-bg) !important',
  '--cf-operator-bg-soft: var(--cf-canvas-bg) !important',
  '#root .app.closeflow-visual-stage01.cf-html-shell',
  '#root .cf-html-shell [data-shell-main="true"]',
  '#root .cf-html-shell .view.active',
  '#root .cf-html-shell [data-shell-content="true"]',
  '#root .cf-html-shell .cf-route-work-root',
  '#root .cf-html-shell .main-calendar-html',
  '#root .cf-html-shell [class*="-vnext-page"]',
  'section[data-stage16ai-today-tiles-match-lists="true"]',
  'background-image: none !important'
];

for (const marker of requiredCssMarkers) {
  if (!css.includes(marker)) fail(`missing CSS marker: ${marker}`);
}

const importLine = "closeflow-canvas-final-source-truth-stage211k.css";
if (!index.includes(importLine)) fail('src/index.css does not import final canvas source truth');
if (!layout.includes(importLine)) fail('Layout.tsx does not import final canvas source truth after shell styles');

console.log('STAGE211K_CANVAS_FINAL_SOURCE_TRUTH_GUARD_PASS');
