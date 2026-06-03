const fs = require('fs');

function fail(message) {
  console.error('STAGE220A21_RECORD_LISTS_RAILS_VST_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const vstCss = read('src/styles/closeflow-visual-source-truth.css');
const recordCss = read('src/styles/closeflow-record-list-source-truth.css');
const railCss = read('src/styles/closeflow-right-rail-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

for (const token of [
  'STAGE220A21_RECORD_LISTS_RAILS_VST',
  '.cf-vst-record-list-card',
  '.cf-vst-record-row',
  '.cf-vst-record-index',
  '.cf-vst-record-title',
  '.cf-vst-record-meta',
  '.cf-vst-right-rail-card',
  '.cf-vst-right-rail-row',
  '.cf-vst-right-rail-title',
  '.cf-vst-right-rail-meta',
]) {
  requireText(vstCss, token, 'VST CSS ' + token);
}

for (const token of [
  'STAGE220A21_RECORD_LISTS_VST_WIRING',
  'var(--cf-vst-surface-card)',
  'var(--cf-vst-surface-border)',
  'var(--cf-vst-color-primary-soft)',
  'var(--cf-vst-text-strong)',
  'var(--cf-vst-text-muted)',
  'var(--cf-vst-color-delete)',
]) {
  requireText(recordCss, token, 'record list CSS ' + token);
}

for (const token of [
  'STAGE220A21_RIGHT_RAILS_VST_WIRING',
  '--cf-right-rail-card-bg: var(--cf-vst-surface-card-solid)',
  '--cf-right-rail-card-border: var(--cf-vst-surface-border)',
  '--cf-right-rail-card-text: var(--cf-vst-text-strong)',
  '--cf-right-rail-width-min: var(--cf-vst-layout-right-rail)',
  'var(--cf-vst-color-success)',
  'var(--cf-vst-color-delete-strong)',
]) {
  requireText(railCss, token, 'right rail CSS ' + token);
}

requireText(doc, 'STAGE220A21 - listy rekordów i panele boczne', 'doc A21 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a21-record-lists-rails-vst.cjs', 'prebuild A21 guard');

console.log('STAGE220A21_RECORD_LISTS_RAILS_VST_GUARD: OK');
