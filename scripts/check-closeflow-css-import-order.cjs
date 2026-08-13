#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function file(rel) { return path.join(repo, rel); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(file(rel)); }
function fail(message) { console.error('CLOSEFLOW_CSS_IMPORT_ORDER_VS3_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }

const requiredFiles = [
  'src/index.css',
  'src/styles/core/core-contracts.css',
  'src/styles/page-adapters/page-adapters.css',
  'docs/ui/CLOSEFLOW_CSS_IMPORT_ORDER_2026-05-09.md',
  'scripts/check-closeflow-css-import-order.cjs',
  'package.json',
];
for (const rel of requiredFiles) assert(exists(rel), 'missing file: ' + rel);

const indexCss = read('src/index.css');
const coreCss = read('src/styles/core/core-contracts.css');
const pageCss = read('src/styles/page-adapters/page-adapters.css');
const docs = read('docs/ui/CLOSEFLOW_CSS_IMPORT_ORDER_2026-05-09.md');
const pkg = JSON.parse(read('package.json'));

assert(docs.includes('VS-3'), 'docs missing VS-3 label');
assert(pkg.scripts && pkg.scripts['check:closeflow-css-import-order'] === 'node scripts/check-closeflow-css-import-order.cjs', 'package script check:closeflow-css-import-order missing or wrong');

function assertBefore(a, b, message) {
  const ai = indexCss.indexOf(a);
  const bi = indexCss.indexOf(b);
  assert(ai >= 0, 'missing import/order item: ' + a);
  assert(bi >= 0, 'missing import/order item: ' + b);
  assert(ai < bi, message + ': ' + a + ' should be before ' + b);
}

const tailwindImport = indexCss.includes('@import "tailwindcss";')
  ? '@import "tailwindcss";'
  : '@import "tailwindcss" source("./");';
assertBefore(tailwindImport, "@import './styles/design-system/index.css';", 'tailwind must load before design system');
assertBefore("@import './styles/design-system/index.css';", "@import './styles/core/core-contracts.css';", 'design system must load before core contracts');
assertBefore("@import './styles/core/core-contracts.css';", "@import './styles/page-adapters/page-adapters.css';", 'core contracts must load before page adapters');

const firstNonImportBoundary = indexCss.indexOf('@theme');
assert(firstNonImportBoundary > 0, 'missing @theme boundary');
const afterTheme = indexCss.slice(firstNonImportBoundary);
assert(!afterTheme.includes('@import'), 'found @import after @theme boundary');

const indexForbidden = [
  'visual-stage',
  'hotfix-',
  'eliteflow-',
  'stage30a-',
  'stage31-',
  'stage37-',
  'stage38-',
  'tasks-header-stage',
  'quick-lead-capture-stage',
  'legacy-imports.css',
  'temporary-overrides.css',
  'emergency-hotfixes.css',
];
const indexImportLines = indexCss.split(/\r?\n/).filter((line) => line.trim().startsWith('@import'));
for (const line of indexImportLines) {
  for (const forbidden of indexForbidden) {
    assert(!line.includes(forbidden), 'legacy/stage/hotfix import leaked into src/index.css: ' + line.trim());
  }
}

for (const requiredImport of [
  "@import '../closeflow-vnext-ui-contract.css';",
  "@import '../closeflow-entity-type-tokens.css';",
]) {
  assert(coreCss.includes(requiredImport), 'core import missing: ' + requiredImport);
}
assert(pageCss.includes("@import '../closeflow-entity-data-card.css';"), 'page adapter import missing: closeflow-entity-data-card.css');

const retiredRuntimeLayers = [
  'src/styles/legacy/legacy-imports.css',
  'src/styles/temporary/temporary-overrides.css',
  'src/styles/emergency/emergency-hotfixes.css',
];
for (const rel of retiredRuntimeLayers) {
  assert(!exists(rel), 'retired historical runtime layer still exists: ' + rel);
}

console.log('CLOSEFLOW_CSS_IMPORT_ORDER_VS3_CHECK_OK');
console.log('order=tailwind,design-system,core,page-adapters');
console.log('retired_historical_runtime_layers=0');
console.log('index_imports_after_theme=0');
