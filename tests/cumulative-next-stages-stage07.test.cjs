const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
test('cumulative Stage07 guard exists and checks all previous stages', () => {
  assert.ok(exists('scripts/check-closeflow-cumulative-next-stages.cjs'));
  const source = read('scripts/check-closeflow-cumulative-next-stages.cjs');
  for (const marker of ['Stage01','Stage02','Stage03','Stage04','Stage05','Stage06']) {
    assert.ok(source.includes(marker), `missing ${marker}`);
  }
  assert.match(source, /mojibake/);
});
