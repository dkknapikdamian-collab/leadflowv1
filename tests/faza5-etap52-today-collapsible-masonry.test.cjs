const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const today = fs.readFileSync(path.join(root, 'src/pages/Today.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/today-collapsible-masonry.css'), 'utf8');

test('Today sections stay collapsible and keep independent height', () => {
  assert.match(today, /FAZA5_ETAP52_TODAY_COLLAPSIBLE_MASONRY/);
  assert.match(today, /aria-expanded=\{!collapsed\}/);
  assert.match(today, /onClick=\{handleHeaderClick\}/);
  assert.match(today, /data-today-collapsible-section="true"/);
  assert.match(today, /today-independent-section/);
  assert.match(today, /self-start/);
  assert.match(today, /h-fit/);
  assert.match(today, /data-today-tile-body="true"/);
});

test('Today CSS prevents equal-height grid stretch between neighboring sections', () => {
  assert.match(css, /align-self:\s*start\s*!important/);
  assert.match(css, /height:\s*fit-content\s*!important/);
  assert.match(css, /min-height:\s*0\s*!important/);
  assert.match(css, /align-items:\s*start\s*!important/);
  assert.match(css, /\[data-today-tile-card="true"\]/);
});
