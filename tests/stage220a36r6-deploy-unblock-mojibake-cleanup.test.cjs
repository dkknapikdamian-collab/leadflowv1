const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const FORBIDDEN_ENCODING_CODES = [0xfeff, 0x0139, 0x013d, 0x00c4, 0x00c5, 0x0102];

function read(rel) { return fs.readFileSync(rel, 'utf8'); }
function assertClean(rel) {
  const text = read(rel);
  assert.notEqual(text.charCodeAt(0), 0xfeff, rel + ' has BOM');
  for (const code of FORBIDDEN_ENCODING_CODES.slice(1)) {
    assert.equal(text.includes(String.fromCharCode(code)), false, rel + ' has forbidden encoding marker U+' + code.toString(16).toUpperCase());
  }
}

test('R4/R5 guard and test files stay clean for Stage98 mojibake gate', () => {
  [
    'scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs',
    'tests/stage220a36r4-build-guard-and-case-item-schema-fix.test.cjs',
    'scripts/check-stage220a36r5-r4-guard-token-compat.cjs',
    'tests/stage220a36r5-r4-guard-token-compat.test.cjs',
  ].forEach(assertClean);
});

test('commission modal keeps requested visual order', () => {
  const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
  const modeIdx = editor.indexOf('cf-finance-field--commission-mode');
  const rateIdx = editor.indexOf('cf-finance-field--commission-rate');
  const amountIdx = editor.indexOf('cf-finance-field--commission-amount');
  const basisIdx = editor.indexOf('cf-finance-field--basis');
  assert.equal(modeIdx >= 0, true);
  assert.equal(rateIdx > modeIdx, true);
  assert.equal(amountIdx > rateIdx, true);
  assert.equal(basisIdx > amountIdx, true);
});
