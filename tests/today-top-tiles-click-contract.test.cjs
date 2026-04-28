const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const today = fs.readFileSync(path.join(repoRoot, 'src/pages/Today.tsx'), 'utf8');

test('Today top shortcut tiles use direct anchored sections', () => {
  assert.match(today, /TODAY_TOP_TILE_DIRECT_ANCHOR_FIX_V111/);
  assert.match(today, /data-today-top-tiles="true"/);
  assert.match(today, /data-today-shortcut-section=\{shortcutTarget \|\| undefined\}/);
  assert.match(today, /getTodayTopShortcutAnchorId/);
  assert.match(today, /openTodayTopTileShortcut/);
  assert.match(today, /aria-expanded=\{!collapsed\}/);
});
