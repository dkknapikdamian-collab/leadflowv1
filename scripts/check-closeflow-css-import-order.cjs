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
function has(rel, needle, label) { assert(read(rel).includes(needle), `${label} missing: ${needle}`); }

const requiredFiles = [
  'src/index.css',
  'src/styles/core/core-contracts.css',
  'src/styles/page-adapters/page-adapters.css',
  'src/styles/legacy/legacy-imports.css',
  'src/styles/temporary/temporary-overrides.css',
  'src/styles/emergency/emergency-hotfixes.css',
  'docs/ui/CLOSEFLOW_CSS_IMPORT_ORDER_2026-05-09.md',
  'scripts/check-closeflow-css-import-order.cjs',
  'package.json',
];

for (const rel of requiredFiles) assert(exists(rel), 'missing file: ' + rel);

const indexCss = read('src/index.css');
const coreCss = read('src/styles/core/core-contracts.css');
const pageCss = read('src/styles/page-adapters/page-adapters.css');
const legacyCss = read('src/styles/legacy/legacy-imports.css');
const temporaryCss = read('src/styles/temporary/temporary-overrides.css');
const emergencyCss = read('src/styles/emergency/emergency-hotfixes.css');
const docs = read('docs/ui/CLOSEFLOW_CSS_IMPORT_ORDER_2026-05-09.md');
const pkg = JSON.parse(read('package.json'));

has('src/index.css', 'CLOSEFLOW_CSS_IMPORT_ORDER_VS3', 'index marker');
has('src/styles/core/core-contracts.css', 'CLOSEFLOW_CSS_IMPORT_ORDER_VS3_CORE_CONTRACTS', 'core marker');
has('src/styles/page-adapters/page-adapters.css', 'CLOSEFLOW_CSS_IMPORT_ORDER_VS3_PAGE_ADAPTERS', 'page adapters marker');
has('src/styles/legacy/legacy-imports.css', 'CLOSEFLOW_CSS_IMPORT_ORDER_VS3_LEGACY_IMPORTS', 'legacy marker');
has('src/styles/temporary/temporary-overrides.css', 'CLOSEFLOW_CSS_IMPORT_ORDER_VS3_TEMPORARY_OVERRIDES', 'temporary marker');
has('src/styles/emergency/emergency-hotfixes.css', 'CLOSEFLOW_CSS_IMPORT_ORDER_VS3_EMERGENCY_HOTFIXES', 'emergency marker');
assert(docs.includes('VS-3'), 'docs missing VS-3 label');
assert(pkg.scripts && pkg.scripts['check:closeflow-css-import-order'] === 'node scripts/check-closeflow-css-import-order.cjs', 'package script check:closeflow-css-import-order missing or wrong');

const orderedMarkers = [
  '/* 1. Tailwind/base */',
  '/* 2. Design system */',
  '/* 3. Core contracts */',
  '/* 4. Page adapters */',
  '/* 5. Legacy imports */',
  '/* 6. Temporary overrides */',
  '/* 7. Emergency hotfixes */',
];

let last = -1;
for (const marker of orderedMarkers) {
  const idx = indexCss.indexOf(marker);
  assert(idx >= 0, 'missing import order marker: ' + marker);
  assert(idx > last, 'import order marker out of order: ' + marker);
  last = idx;
}

function assertBefore(a, b, message) {
  const ai = indexCss.indexOf(a);
  const bi = indexCss.indexOf(b);
  assert(ai >= 0, 'missing import/order item: ' + a);
  assert(bi >= 0, 'missing import/order item: ' + b);
  assert(ai < bi, message + ': ' + a + ' should be before ' + b);
}

assertBefore('@import "tailwindcss";', "@import './styles/design-system/index.css';", 'tailwind must load before design system');
assertBefore("@import './styles/design-system/index.css';", "@import './styles/core/core-contracts.css';", 'design system must load before core contracts');
assertBefore("@import './styles/core/core-contracts.css';", "@import './styles/page-adapters/page-adapters.css';", 'core contracts must load before page adapters');
assertBefore("@import './styles/page-adapters/page-adapters.css';", "@import './styles/legacy/legacy-imports.css';", 'page adapters must load before legacy imports');
assertBefore("@import './styles/legacy/legacy-imports.css';", "@import './styles/temporary/temporary-overrides.css';", 'legacy imports must load before temporary overrides');
assertBefore("@import './styles/temporary/temporary-overrides.css';", "@import './styles/emergency/emergency-hotfixes.css';", 'temporary overrides must load before emergency hotfixes');

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
];
const indexImportLines = indexCss.split(/\r?\n/).filter((line) => line.trim().startsWith('@import'));
for (const line of indexImportLines) {
  for (const forbidden of indexForbidden) {
    assert(!line.includes(forbidden), 'legacy/stage/hotfix import leaked into src/index.css: ' + line.trim());
  }
}

for (const requiredImport of [
  '../visual-stage01-shell.css',
  '../visual-html-theme-v14.css',
  '../closeflow-vnext-ui-contract.css',
  '../closeflow-action-tokens.css',
  '../closeflow-metric-tiles.css',
]) {
  assert(coreCss.includes(requiredImport), 'core import missing: ' + requiredImport);
}

for (const requiredImport of [
  '../visual-stage02-today.css',
  '../visual-stage03-leads.css',
  '../visual-stage04-lead-detail.css',
  '../visual-stage06-client-detail.css',
  '../visual-stage29-calendar-vnext.css',
  '../stage37-unified-page-head-and-metrics.css',
  '../stage38-metrics-and-relations-polish.css',
]) {
  assert(pageCss.includes(requiredImport), 'page adapter import missing: ' + requiredImport);
}

for (const requiredImport of [
  '../case-detail-simplified.css',
  '../case-detail-stage2.css',
  '../visual-stage3-pipeline-and-case.css',
  '../stage7a-tasks-blue-outline-fix.css',
]) {
  assert(legacyCss.includes(requiredImport), 'legacy import missing: ' + requiredImport);
}

for (const requiredImport of [
  '../eliteflow-final-metric-tiles-hard-lock.css',
  '../eliteflow-sidebar-footer-contrast-repair.css',
  '../stage31-full-mobile-polish.css',
  '../stageA24-today-relations-label-align.css',
]) {
  assert(temporaryCss.includes(requiredImport), 'temporary import missing: ' + requiredImport);
}

for (const requiredImport of [
  '../hotfix-lead-client-right-rail-dark-wrappers.css',
  '../hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css',
  '../hotfix-ai-drafts-right-rail-stage28.css',
  '../eliteflow-admin-feedback-p1-hotfix.css',
  '../closeflow-client-event-modal-runtime-repair.css',
  '../closeflow-a1-client-note-event-lead-visibility-finalizer.css',
  '../closeflow-metric-tile-visual-source-truth.css',
]) {
  assert(emergencyCss.includes(requiredImport), 'emergency import missing: ' + requiredImport);
}

function assertMetadataBlocks(css, marker, label) {
  const blocks = css.split('/* ' + marker).slice(1).map((part) => part.split('*/')[0]);
  assert(blocks.length > 0, label + ' metadata blocks missing');
  for (const [idx, block] of blocks.entries()) {
    for (const field of ['owner:', 'reason:', 'scope:', 'remove_after_stage:']) {
      assert(block.includes(field), `${label} entry ${idx + 1} missing ${field}`);
    }
  }
  return blocks.length;
}

const tempBlocks = assertMetadataBlocks(temporaryCss, 'CLOSEFLOW_TEMPORARY_OVERRIDE_ENTRY', 'temporary override');
const emergencyBlocks = assertMetadataBlocks(emergencyCss, 'CLOSEFLOW_EMERGENCY_HOTFIX_ENTRY', 'emergency hotfix');

assert(docs.includes('Temporary overrides'), 'docs missing temporary layer');
assert(docs.includes('Emergency hotfixes'), 'docs missing emergency layer');
assert(docs.includes('owner'), 'docs missing owner metadata description');
assert(docs.includes('remove_after_stage'), 'docs missing remove_after_stage metadata description');

console.log('CLOSEFLOW_CSS_IMPORT_ORDER_VS3_CHECK_OK');
console.log('order=tailwind,design-system,core,page-adapters,legacy,temporary,emergency');
console.log('temporary_metadata_blocks=' + tempBlocks);
console.log('emergency_hotfix_entries=' + emergencyBlocks);
console.log('index_imports_after_theme=0');