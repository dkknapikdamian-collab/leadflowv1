const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('metric tile icons sit in the value row, not as a detached corner badge', () => {
  const card = read('src/components/StatShortcutCard.tsx');
  const css = read('src/styles/closeflow-metric-tiles.css');

  assert.match(card, /STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE/);
  assert.match(card, /cf-top-metric-tile-value-row[\s\S]*cf-top-metric-tile-value[\s\S]*cf-top-metric-tile-icon/);
  assert.match(card, /data-metric-icon-next-to-value="true"/);
  assert.match(css, /\.cf-top-metric-tile-value-row\s*\{/);
  assert.match(css, /justify-content:\s*space-between/);
  assert.match(css, /:not\(:has\(\.metric-icon\)\):not\(:has\(svg\)\)::after/);
});

test('metric tile icon/value guard passes', () => {
  const result = spawnSync(process.execPath, ['scripts/check-metric-tile-icons-next-to-value.cjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
