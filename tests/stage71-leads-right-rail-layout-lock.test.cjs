const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/styles/closeflow-leads-right-rail-layout-lock.css'), 'utf8');

test('Stage71 uses grid/flex alignment instead of visual top hacks', () => {
  assert.match(css, /layout-list:has\(\.lead-right-rail\)/);
  assert.match(css, /layout-list:has\(\.lead-top-relations\)/);
  assert.match(css, /grid-column:\s*2/);
  assert.match(css, /grid-row:\s*1/);
  assert.match(css, /align-items:\s*start/);
  assert.doesNotMatch(css, /position\s*:\s*absolute/i);
  assert.doesNotMatch(css, /top\s*:\s*-\s*\d/i);
  assert.doesNotMatch(css, /translateY\s*\(\s*-/i);
});

test('Stage71 keeps nested Najcenniejsze leady at the start of the right rail', () => {
  assert.match(css, /lead-right-rail\s*>\s*\.lead-top-relations/);
  assert.match(css, /order:\s*-10/);
  assert.match(css, /margin-top:\s*0/);
});
