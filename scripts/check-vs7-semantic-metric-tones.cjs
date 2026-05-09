#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (msg) => { throw new Error(msg); };
const assert = (cond, msg) => { if (!cond) fail(msg); };
const assertIncludes = (rel, needle) => assert(read(rel).includes(needle), `Missing ${needle} in ${rel}`);

const contract = 'src/components/ui-system/operator-metric-tone-contract.ts';
const runtime = 'src/components/ui-system/OperatorMetricToneRuntime.tsx';
const operator = 'src/components/ui-system/OperatorMetricTiles.tsx';
const layout = 'src/components/Layout.tsx';
const index = 'src/components/ui-system/index.ts';
const css = 'src/styles/closeflow-operator-semantic-tones.css';
const indexCss = 'src/index.css';

[contract, runtime, operator, layout, index, css, indexCss, 'package.json'].forEach((rel) => assert(exists(rel), `Missing file ${rel}`));

assertIncludes(contract, 'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH');
assertIncludes(contract, 'resolveOperatorMetricTone');
assertIncludes(contract, 'normalizeOperatorMetricKey');
assertIncludes(contract, 'CLOSEFLOW_VS7_REPORTED_ADMIN_FEEDBACK_LABELS');

const requiredLabels = [
  'Wszystkie',
  'Nadchodzące',
  'Leady',
  'Sprawy',
  'Szablony',
  'Pozycje',
  'W realizacji',
  'Bez sprawy',
  'Aktywni',
  'Historia',
  'Najbliższe 7 dni',
  'Szkice AI do sprawdzenia',
  'Leady czekające',
];
for (const label of requiredLabels) {
  assertIncludes(contract, label);
}

assertIncludes(operator, "from './operator-metric-tone-contract'");
assertIncludes(operator, 'resolveOperatorMetricTone');
assertIncludes(operator, 'data-cf-operator-metric-icon-tone');
assertIncludes(operator, 'data-cf-semantic-tone');
assertIncludes(runtime, 'MutationObserver');
assertIncludes(runtime, 'Najbliższe 7 dni');
assertIncludes(runtime, 'Szkice AI do sprawdzenia');
assertIncludes(runtime, 'Leady czekające');
assertIncludes(runtime, 'data-cf-semantic-section-card');
assertIncludes(layout, 'OperatorMetricToneRuntime');
assertIncludes(index, './operator-metric-tone-contract');
assertIncludes(index, './OperatorMetricToneRuntime');
assertIncludes(css, 'data-cf-semantic-tone');
assertIncludes(css, 'data-cf-operator-metric-icon-tone');
assertIncludes(indexCss, 'closeflow-operator-semantic-tones.css');

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:vs7-semantic-metric-tones'], 'Missing package script check:vs7-semantic-metric-tones');
assert(String(pkg.scripts.lint || '').includes('check:vs7-semantic-metric-tones'), 'lint must include VS7 guard');

console.log('CLOSEFLOW_VS7_SEMANTIC_METRIC_TONES_OK');
console.log('reported_admin_feedback_labels_covered=' + requiredLabels.length);
