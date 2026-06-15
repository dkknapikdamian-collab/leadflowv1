const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('fs');
const path = require('path');

test('R13B guard exists and scans active UI only', () => {
  const guard = fs.readFileSync(path.join('scripts', 'check-stage231h-r1d2-r13b-targeted-polish-encoding-guard.cjs'), 'utf8');
  assert.match(guard, /src\/components/);
  assert.match(guard, /src\/pages/);
  assert.doesNotMatch(guard, /_project\/backups/);
  assert.match(guard, /Polish mojibake remains/);
});

test('R13B guarded mojibake tokens are represented', () => {
  const guard = fs.readFileSync(path.join('scripts', 'check-stage231h-r1d2-r13b-targeted-polish-encoding-guard.cjs'), 'utf8');
  for (const token of ['Ä…', 'Ä‡', 'Ĺ‚', 'Å¼', 'â€™', 'Â']) {
    assert.ok(guard.includes(token), 'missing token ' + token);
  }
});
