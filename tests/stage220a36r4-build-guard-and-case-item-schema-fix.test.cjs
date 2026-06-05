const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(rel) { return fs.readFileSync(rel, 'utf8'); }

test('A35 and A36 guards are clean UTF-8 without mojibake or BOM', () => {
  for (const rel of [
    'scripts/check-stage220a35-client-commission-finance.cjs',
    'scripts/check-stage220a36-commission-input-model-split.cjs',
  ]) {
    const text = read(rel);
    assert.notEqual(text.charCodeAt(0), 0xfeff, rel + ' must not start with BOM');
    assert.equal(/[ĹĽÄÅ]/u.test(text), false, rel + ' must not contain mojibake markers');
    assert.equal(text.includes('missing token: Prowizja'), false, rel + ' must not hard-code Polish finance copy as required token');
  }
});

test('case item POST payload does not write approved_at when production schema lacks it', () => {
  const source = read('api/case-items.ts');
  assert.equal(source.includes('approved_at: body.approvedAt'), false);
  assert.equal(source.includes('approvedAt?: string | null'), false);
  assert.equal(source.includes('created_at: now'), true);
  assert.equal(source.includes('updated_at: now'), true);
});
