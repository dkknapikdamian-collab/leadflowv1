const fs = require('fs');

function fail(message) {
  console.error('STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const clients = read('src/pages/Clients.tsx');
const cases = read('src/pages/Cases.tsx');
const recordCss = read('src/styles/closeflow-record-list-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

requireText(clients, 'STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_CONSISTENCY', 'Clients marker');
requireText(clients, 'ChevronRight', 'Clients ChevronRight import/use');
requireText(clients, 'data-stage220a22-client-chevron="true"', 'Client chevron marker');
requireText(clients, 'cf-client-row-open-indicator', 'Client chevron class');
forbidText(clients, '<EntityIcon entity="client"', 'old client entity row icon');

requireText(cases, 'STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_CONSISTENCY', 'Cases marker');
requireText(cases, "import '../styles/closeflow-record-list-source-truth.css';", 'Cases record-list source truth import');

requireText(recordCss, 'STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_CONSISTENCY', 'CSS marker');
requireText(recordCss, '.cf-html-view:is(.main-clients-html, .main-cases-html) .row:not(.row-empty) > .index', 'shared clients/cases index selector');
requireText(recordCss, 'var(--cf-vst-color-primary-soft)', 'index primary soft token');
requireText(recordCss, 'var(--cf-vst-color-primary-border)', 'index primary border token');
requireText(recordCss, 'var(--cf-vst-color-primary-strong)', 'index primary strong token');
requireText(recordCss, '.cf-client-row-open-indicator', 'client chevron CSS');

requireText(doc, 'STAGE220A22 - spójny numer wiersza i chevron', 'doc A22 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a22-client-case-index-chevron.cjs', 'prebuild A22 guard');

console.log('STAGE220A22_CLIENT_CASE_INDEX_CHEVRON_GUARD: OK');
