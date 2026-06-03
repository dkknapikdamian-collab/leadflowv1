const fs = require('fs');

function fail(message) {
  console.error('STAGE220A16_VISUAL_SOURCE_TRUTH_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const app = read('src/App.tsx');
const css = read('src/styles/closeflow-visual-source-truth.css');
const ts = read('src/lib/closeflow-visual-source-truth.ts');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

requireText(app, "import './styles/closeflow-visual-source-truth.css';", 'App global import');

for (const token of [
  '--cf-vst-color-note',
  '--cf-vst-color-task',
  '--cf-vst-color-event',
  '--cf-vst-color-payment',
  '--cf-vst-color-status',
  '--cf-vst-color-case-item',
  '--cf-vst-color-delete',
  '--cf-vst-color-primary',
  '--cf-vst-surface-card',
  '--cf-vst-metric-number-color',
]) {
  requireText(css, token, 'CSS token');
}

for (const kind of ['note', 'task', 'event', 'calendar', 'payment', 'finance', 'status', 'case-item', 'delete', 'primary']) {
  requireText(ts, kind, 'TS visual kind ' + kind);
}

requireText(ts, 'CLOSEFLOW_VISUAL_SOURCE_TRUTH', 'TS source map');
requireText(doc, 'wizualne źródło prawdy', 'repo visual doc');
requireText(doc, 'Usuń, kasowanie, destrukcja', 'delete mapping in doc');
requireText(doc, 'Kafelki i liczby', 'cards and metrics rule in doc');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a16-visual-source-truth.cjs', 'prebuild Stage220A16 guard');

console.log('STAGE220A16_VISUAL_SOURCE_TRUTH_GUARD: OK');
