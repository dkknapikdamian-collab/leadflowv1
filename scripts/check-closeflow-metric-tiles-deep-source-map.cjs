#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_VS5T';
function p(rel) { return path.join(root, rel); }
function read(rel) { return fs.readFileSync(p(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(p(rel)); }
function fail(message) { console.error(STAGE + '_CHECK_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }

const required = [
  'scripts/audit-closeflow-metric-tiles-deep-source-map.cjs',
  'scripts/check-closeflow-metric-tiles-deep-source-map.cjs',
  'docs/ui/CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_2026-05-09.md',
  'docs/ui/closeflow-metric-tiles-deep-source-map.generated.json',
  'package.json',
];
for (const rel of required) assert(exists(rel), 'missing file: ' + rel);

const json = JSON.parse(read('docs/ui/closeflow-metric-tiles-deep-source-map.generated.json'));
const doc = read('docs/ui/CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_2026-05-09.md');
const pkg = JSON.parse(read('package.json'));

assert(json.marker === STAGE, 'generated JSON marker mismatch');
assert(json.totals && json.totals.scannedComponentFiles > 0, 'component scan did not run');
assert(json.totals && json.totals.scannedCssFiles > 0, 'css scan did not run');
assert(Array.isArray(json.pages) && json.pages.some((p) => p.rel === 'src/pages/TodayStable.tsx'), 'TodayStable page missing from map');
assert(Array.isArray(json.cssMap), 'css map missing');
assert(json.cssImport && typeof json.cssImport.metricCssImported === 'boolean', 'metric css import evidence missing');
assert(doc.includes('CloseFlow metric tiles deep source map'), 'doc heading missing');
assert(doc.includes('Next implementation direction'), 'next implementation direction missing');
assert(pkg.scripts && pkg.scripts['audit:closeflow-metric-tiles-deep-source-map'], 'package audit script missing');
assert(pkg.scripts && pkg.scripts['check:closeflow-metric-tiles-deep-source-map'], 'package check script missing');
assert(pkg.scripts && pkg.scripts['verify:closeflow-metric-tiles-deep-source-map'], 'package verify script missing');

console.log('CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_VS5T_CHECK_OK');
console.log('conclusion=' + json.conclusion);
console.log('blocking_findings=' + json.totals.blockingFindings);
