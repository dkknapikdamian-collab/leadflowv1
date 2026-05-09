#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const write = (rel, text) => fs.writeFileSync(path.join(root, rel), text, 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const fail = (msg) => { throw new Error(msg); };
const ensure = (rel) => { if (!exists(rel)) fail(`Missing file: ${rel}`); };

const activityTestPath = 'tests/activity-command-center.test.cjs';
const unifiedTestPath = 'tests/unified-top-metric-tiles.test.cjs';
const unifiedCheckPath = 'scripts/check-unified-top-metric-tiles.cjs';

[activityTestPath, unifiedTestPath, unifiedCheckPath].forEach(ensure);

let activityTest = read(activityTestPath);
if (activityTest.includes('assert.match(source, /function MetricCard/);')) {
  activityTest = activityTest.replace(
    'assert.match(source, /function MetricCard/);',
    [
      "assert.match(source, /StatShortcutCard/);",
      "  assert.match(source, /activity-stats-grid/);",
      "  assert.doesNotMatch(source, /function MetricCard/);",
    ].join('\n')
  );
}
if (!activityTest.includes('activity-stats-grid')) {
  fail('Activity test was not updated to the StatShortcutCard metric grid contract');
}
write(activityTestPath, activityTest);

const unifiedTest = `const assert = require('assert/strict');
const { test } = require('node:test');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

function assertIncludes(file, needle, label = needle) {
  assert.ok(read(file).includes(needle), file + ' missing: ' + label);
}

test('top metric tiles use final OperatorMetricTile visual contract across app', () => {
  const stat = read('src/components/StatShortcutCard.tsx');
  const operator = read('src/components/ui-system/OperatorMetricTiles.tsx');
  const operatorCss = read('src/styles/closeflow-operator-metric-tiles.css');
  const legacyCss = read('src/styles/closeflow-metric-tiles.css');
  const app = exists('src/App.tsx') ? read('src/App.tsx') : '';
  const indexCss = exists('src/index.css') ? read('src/index.css') : '';

  assert.match(stat, /StatShortcutCard delegates rendering to ui-system OperatorMetricTile/);
  assert.match(stat, /OperatorMetricTile/);
  assert.match(stat, /resolveMetricTone/);
  assert.doesNotMatch(stat, /function MetricCard/);

  assert.match(operator, /CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3/);
  assert.match(operator, /data-cf-operator-metric-tile/);
  assert.match(operator, /data-cf-operator-metric-tone/);
  assert.match(operator, /data-cf-operator-metric-value-tone/);
  assert.match(operator, /data-cf-metric-source-truth/);

  assert.match(operatorCss, /CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3/);
  assert.match(operatorCss, /--cf-operator-metric-radius/);
  assert.match(operatorCss, /\.cf-operator-metric-tile-content/);
  assert.match(operatorCss, /\[data-cf-operator-metric-tone="blue"\]/);
  assert.match(operatorCss, /\[data-cf-operator-metric-tone="red"\]/);
  assert.match(operatorCss, /\.cf-operator-metric-value/);
  assert.match(operatorCss, /\.cf-operator-metric-icon/);

  assert.match(legacyCss, /STAGE16AK_UNIFIED_TOP_METRIC_TILES_CSS/);
  assert.match(legacyCss, /--cf-metric-tile-radius/);

  assert.ok(
    app.includes("closeflow-metric-tiles.css") || indexCss.includes('closeflow-metric-tiles.css'),
    'closeflow-metric-tiles.css must remain globally imported'
  );
  assert.ok(
    app.includes("closeflow-operator-metric-tiles.css") || indexCss.includes('closeflow-operator-metric-tiles.css'),
    'closeflow-operator-metric-tiles.css must remain globally imported'
  );
});

test('unified top metric guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-unified-top-metric-tiles.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
`;
write(unifiedTestPath, unifiedTest);

const unifiedCheck = `/* STAGE16AK_UNIFIED_TOP_METRIC_TILES_CHECK */
/* CLOSEFLOW_VS7_REPAIR4_FINAL_OPERATOR_METRIC_GUARD */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (msg) => { console.error('FAIL:', msg); process.exitCode = 1; };
const mustContain = (file, marker, label = marker) => {
  const content = read(file);
  if (!content.includes(marker)) fail(file + ' missing: ' + label);
};
const mustNotContain = (file, marker, label = marker) => {
  const content = read(file);
  if (content.includes(marker)) fail(file + ' should not contain: ' + label);
};
const mustNotExist = (file) => {
  if (fs.existsSync(path.join(root, file))) fail(file + ' should not remain from failed stage');
};
const mustImportOneOf = (marker, files, label) => {
  const ok = files.some((file) => exists(file) && read(file).includes(marker));
  if (!ok) fail('missing global import marker: ' + label);
};

mustContain('src/components/StatShortcutCard.tsx', 'StatShortcutCard delegates rendering to ui-system OperatorMetricTile', 'StatShortcutCard adapter contract');
mustContain('src/components/StatShortcutCard.tsx', 'OperatorMetricTile', 'final shared tile renderer');
mustContain('src/components/StatShortcutCard.tsx', 'resolveMetricTone', 'tone resolver adapter');
mustNotContain('src/components/StatShortcutCard.tsx', 'function MetricCard', 'legacy local MetricCard renderer');

mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3', 'final renderer stage marker');
mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-operator-metric-tile', 'tile data marker');
mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-operator-metric-tone', 'tile tone marker');
mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-operator-metric-value-tone', 'value tone marker');
mustContain('src/components/ui-system/OperatorMetricTiles.tsx', 'data-cf-metric-source-truth', 'source truth marker');

mustContain('src/styles/closeflow-operator-metric-tiles.css', 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3', 'operator metric css marker');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '--cf-operator-metric-radius', 'operator css radius token');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '.cf-operator-metric-tile-content', 'operator tile content selector');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '[data-cf-operator-metric-tone="blue"]', 'blue tone selector');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '[data-cf-operator-metric-tone="red"]', 'red tone selector');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '.cf-operator-metric-value', 'value selector');
mustContain('src/styles/closeflow-operator-metric-tiles.css', '.cf-operator-metric-icon', 'icon selector');

mustContain('src/styles/closeflow-metric-tiles.css', 'STAGE16AK_UNIFIED_TOP_METRIC_TILES_CSS', 'legacy css stage marker kept for compatibility');
mustContain('src/styles/closeflow-metric-tiles.css', '--cf-metric-tile-radius', 'legacy css shared token kept for compatibility');
mustImportOneOf('closeflow-metric-tiles.css', ['src/App.tsx', 'src/index.css'], 'legacy metric css import');
mustImportOneOf('closeflow-operator-metric-tiles.css', ['src/App.tsx', 'src/index.css'], 'operator metric css import');

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:unified-top-metric-tiles'] !== 'node scripts/check-unified-top-metric-tiles.cjs') fail('package.json missing check:unified-top-metric-tiles script');
if (pkg.scripts?.['test:unified-top-metric-tiles'] !== 'node --test tests/unified-top-metric-tiles.test.cjs') fail('package.json missing test:unified-top-metric-tiles script');

mustNotExist('scripts/repair-stage16aj-unified-top-metric-tiles.cjs');
mustNotExist('docs/release/STAGE16AJ_UNIFIED_TOP_METRIC_TILES_2026-05-07.md');

if (!process.exitCode) console.log('OK: unified top metric tile final OperatorMetricTile contract passed.');
`;
write(unifiedCheckPath, unifiedCheck);

console.log('CLOSEFLOW_VS7_REPAIR4_FINAL_METRIC_GUARDS_PATCHED');
console.log('patched=' + [activityTestPath, unifiedTestPath, unifiedCheckPath].join(','));
