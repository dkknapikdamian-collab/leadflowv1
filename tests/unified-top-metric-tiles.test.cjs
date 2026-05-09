const assert = require('assert/strict');
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
  assert.match(operatorCss, /.cf-operator-metric-tile-content/);
  assert.match(operatorCss, /\[data-cf-operator-metric-tone="blue"\]/);
  assert.match(operatorCss, /\[data-cf-operator-metric-tone="red"\]/);
  assert.match(operatorCss, /.cf-operator-metric-value/);
  assert.match(operatorCss, /.cf-operator-metric-icon/);

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

/* CLOSEFLOW_VS7_REPAIR5_REGEX_ESCAPE_UNIFIED_METRIC_TEST: data selector regex literals escaped after VS7 repair4. */
