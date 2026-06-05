const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const FORBIDDEN_ENCODING_CODES = [0xfeff, 0x0139, 0x013d, 0x00c4, 0x00c5, 0x0102];

function read(rel) {
  return fs.readFileSync(rel, 'utf8');
}
function assertCleanFile(rel) {
  const text = read(rel);
  assert.notEqual(text.charCodeAt(0), 0xfeff, rel + ' must not start with BOM');
  for (const code of FORBIDDEN_ENCODING_CODES.slice(1)) {
    assert.equal(text.includes(String.fromCharCode(code)), false, rel + ' must not contain encoding marker U+' + code.toString(16).toUpperCase());
  }
}

test('A35 A36 R4 guard files are clean UTF-8 without BOM or encoding markers', () => {
  [
    'scripts/check-stage220a35-client-commission-finance.cjs',
    'scripts/check-stage220a36-commission-input-model-split.cjs',
    'scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs',
    'tests/stage220a36r4-build-guard-and-case-item-schema-fix.test.cjs',
  ].forEach(assertCleanFile);
});

test('case item POST payload does not write approved_at when production schema lacks it', () => {
  const source = read('api/case-items.ts');
  assert.equal(source.includes('approved_at: body.approvedAt'), false);
  assert.equal(source.includes('approvedAt?: string | null'), false);
  assert.equal(source.includes('created_at: now'), true);
  assert.equal(source.includes('updated_at: now'), true);
});
