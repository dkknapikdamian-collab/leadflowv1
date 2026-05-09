#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function fail(message) {
  console.error('CLOSEFLOW_CSS_IMPORT_ORDER_VS3_FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const requiredFiles = [
  'src/index.css',
  'src/styles/legacy/legacy-imports.css',
  'src/styles/temporary/temporary-overrides.css',
  'src/styles/emergency/emergency-hotfixes.css',
  'docs/ui/CLOSEFLOW_CSS_IMPORT_ORDER_2026-05-09.md',
  'scripts/check-closeflow-css-import-order.cjs',
  'package.json',
];

for (const rel of requiredFiles) {
  assert(exists(rel), 'missing file: ' + rel);
}

const indexCss = read('src/index.css');
const legacyCss = read('src/styles/legacy/legacy-imports.css');
const temporaryCss = read('src/styles/temporary/temporary-overrides.css');
const emergencyCss = read('src/styles/emergency/emergency-hotfixes.css');
const docs = read('docs/ui/CLOSEFLOW_CSS_IMPORT_ORDER_2026-05-09.md');
const pkg = JSON.parse(read('package.json'));

assert(indexCss.includes('CLOSEFLOW_CSS_IMPORT_ORDER_VS3'), 'index marker missing');
assert(legacyCss.includes('CLOSEFLOW_CSS_IMPORT_ORDER_VS3_LEGACY_IMPORTS'), 'legacy marker missing');
assert(temporaryCss.includes('CLOSEFLOW_CSS_IMPORT_ORDER_VS3_TEMPORARY_OVERRIDES'), 'temporary marker missing');
assert(emergencyCss.includes('CLOSEFLOW_CSS_IMPORT_ORDER_VS3_EMERGENCY_HOTFIXES'), 'emergency marker missing');
assert(docs.includes('VS-3'), 'docs missing VS-3 label');
assert(pkg.scripts && pkg.scripts['check:closeflow-css-import-order'], 'package script check:closeflow-css-import-order missing');

const orderedMarkers = [
  '/* 1. tailwind/base */',
  '/* 2. design-system/index.css */',
  '/* 3. layout primitives */',
  '/* 4. component contracts */',
  '/* 5. page adapters */',
  '/* 6. legacy imports */',
  '/* 7. temporary overrides */',
  '/* 8. emergency hotfixes */',
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
assertBefore("@import './styles/design-system/index.css';", '@import "./styles/visual-stage01-shell.css";', 'design system must load before layout primitives');
assertBefore('@import "./styles/visual-stage01-shell.css";', "@import './styles/closeflow-action-tokens.css';", 'layout primitives must load before component contracts');
assertBefore("@import './styles/closeflow-action-tokens.css';", '@import "./styles/visual-stage02-today.css";', 'component contracts must load before page adapters');
assertBefore('@import "./styles/visual-stage02-today.css";', "@import './styles/legacy/legacy-imports.css';", 'page adapters must load before legacy imports');
assertBefore("@import './styles/legacy/legacy-imports.css';", "@import './styles/temporary/temporary-overrides.css';", 'legacy imports must load before temporary overrides');
assertBefore("@import './styles/temporary/temporary-overrides.css';", "@import './styles/emergency/emergency-hotfixes.css';", 'temporary overrides must load before emergency hotfixes');

const firstNonCommentImportBoundary = indexCss.indexOf('@theme');
assert(firstNonCommentImportBoundary > 0, 'missing @theme boundary');
const afterTheme = indexCss.slice(firstNonCommentImportBoundary);
assert(!afterTheme.includes('@import'), 'found @import after @theme boundary');

for (const forbidden of [
  'hotfix-task-stat-tiles-clean.css',
  'hotfix-lead-client-right-rail-dark-wrappers.css',
  'hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css',
  'hotfix-ai-drafts-right-rail-stage28.css',
  'CLIENT_PANEL_EMPTY_WARNING_STRIP_FIX_STAGE_A1',
  'CLOSEFLOW_ADMIN_FEEDBACK_VISUAL_REPAIR_2026_05_08',
]) {
  assert(!indexCss.includes(forbidden), 'hotfix leaked back into src/index.css: ' + forbidden);
}

for (const requiredImport of [
  '../hotfix-task-stat-tiles-clean.css',
  '../hotfix-lead-client-right-rail-dark-wrappers.css',
  '../hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css',
  '../hotfix-ai-drafts-right-rail-stage28.css',
  '../eliteflow-admin-feedback-p1-hotfix.css',
  '../closeflow-client-event-modal-runtime-repair.css',
  '../closeflow-a1-client-note-event-lead-visibility-finalizer.css',
]) {
  assert(emergencyCss.includes(requiredImport), 'emergency import missing: ' + requiredImport);
}

const emergencyEntryBlocks = emergencyCss
  .split('/* CLOSEFLOW_EMERGENCY_HOTFIX_ENTRY')
  .slice(1)
  .map((part) => part.split('*/')[0]);

assert(emergencyEntryBlocks.length >= 9, 'expected at least 9 emergency hotfix metadata entries');

for (const [idx, block] of emergencyEntryBlocks.entries()) {
  for (const field of ['owner:', 'reason:', 'scope:', 'remove_after_stage:']) {
    assert(block.includes(field), `emergency entry ${idx + 1} missing ${field}`);
  }
}

assert(legacyCss.includes("../case-detail-simplified.css"), 'legacy simplified case detail import missing');
assert(temporaryCss.includes("../stage31-full-mobile-polish.css"), 'temporary mobile polish import missing');

console.log('CLOSEFLOW_CSS_IMPORT_ORDER_VS3_CHECK_OK');
console.log('order=tailwind,design-system,layout,components,pages,legacy,temporary,emergency');
console.log('emergency_hotfix_entries=' + emergencyEntryBlocks.length);
console.log('index_imports_after_theme=0');
