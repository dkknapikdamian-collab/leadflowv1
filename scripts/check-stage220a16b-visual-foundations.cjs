const fs = require('fs');

function fail(message) {
  console.error('STAGE220A16B_VISUAL_FOUNDATIONS_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const css = read('src/styles/closeflow-visual-source-truth.css');
const ts = read('src/lib/closeflow-visual-source-truth.ts');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

for (const token of [
  '--cf-vst-font-family-app',
  '--cf-vst-font-size-page-title',
  '--cf-vst-font-size-section-title',
  '--cf-vst-font-size-card-title',
  '--cf-vst-font-size-body',
  '--cf-vst-font-size-meta',
  '--cf-vst-font-size-metric',
  '--cf-vst-font-weight-heavy',
  '--cf-vst-line-height-body',
  '--cf-vst-space-md',
  '--cf-vst-layout-page-max',
  '--cf-vst-layout-right-rail',
  '--cf-vst-card-padding',
  '--cf-vst-button-height-md',
  '--cf-vst-input-height',
  '--cf-vst-modal-width-md',
  '--cf-vst-icon-size-md',
  '--cf-vst-tab-height',
  '--cf-vst-metric-value-size',
  '--cf-vst-z-modal',
]) {
  requireText(css, token, 'foundation CSS token');
}

for (const utility of [
  '.cf-vst-text-page-title',
  '.cf-vst-text-section-title',
  '.cf-vst-text-card-title',
  '.cf-vst-text-body',
  '.cf-vst-text-meta',
  '.cf-vst-shell',
  '.cf-vst-right-rail',
  '.cf-vst-row',
  '.cf-vst-button',
  '.cf-vst-input',
]) {
  requireText(css, utility, 'foundation utility');
}

requireText(ts, 'CloseFlowSurfaceKind', 'TS surface kind');
requireText(ts, 'CloseFlowTypographyRole', 'TS typography role');
requireText(ts, 'CLOSEFLOW_VISUAL_FOUNDATION_TOKENS', 'TS foundation tokens');

requireText(doc, 'STAGE220A16B - pełniejsze fundamenty UI', 'doc A16B section');
requireText(doc, 'Typografia', 'doc typography section');
requireText(doc, 'Powierzchnie', 'doc surfaces section');
requireText(doc, 'Formularze i modale', 'doc forms modals section');
requireText(doc, 'Kolejność realnego przepinania', 'doc wiring order');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a16b-visual-foundations.cjs', 'prebuild A16B guard');

console.log('STAGE220A16B_VISUAL_FOUNDATIONS_GUARD: OK');
