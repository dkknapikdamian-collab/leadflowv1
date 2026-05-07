const assert = require('assert/strict');
const { test } = require('node:test');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('top metric tiles use one Today-like visual contract across app', () => {
  const stat = read('src/components/StatShortcutCard.tsx');
  const css = read('src/styles/closeflow-metric-tiles.css');
  const app = read('src/App.tsx');

  assert.match(stat, /STAGE16AK_UNIFIED_TOP_METRIC_TILES/);
  assert.match(stat, /cf-top-metric-tile/);
  assert.match(stat, /text-\[28px\]/);
  assert.match(stat, /min-h-\[92px\]/);
  assert.match(stat, /h-4 w-4/);

  assert.match(css, /STAGE16AK_UNIFIED_TOP_METRIC_TILES_CSS/);
  assert.match(css, /\.cf-html-view \.metric/);
  assert.match(css, /\.stat-card/);
  assert.match(css, /\.summary-card/);
  assert.match(css, /\.dashboard-stat-card/);
  assert.match(css, /font-size:\s*28px/);
  assert.match(css, /--cf-metric-tile-radius/);

  assert.match(app, /closeflow-metric-tiles\.css/);
});

test('unified top metric guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-unified-top-metric-tiles.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
