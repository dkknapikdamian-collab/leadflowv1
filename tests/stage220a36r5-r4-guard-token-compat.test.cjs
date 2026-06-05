const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('STAGE220A36-R5 R4 guard accepts A36 label token and historical field token', () => {
  const r4 = fs.readFileSync('scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs', 'utf8');
  assert.match(r4, /function requireAnyText/);
  assert.match(r4, /CaseFinanceEditorDialog percent basis label/);
  assert.match(r4, /CaseFinanceEditorDialog percent basis field/);
  assert.doesNotMatch(r4, /requireText\(a36,\s*'CaseFinanceEditorDialog percent basis field'/);
});

test('STAGE220A36-R5 current A36 guard still uses label token', () => {
  const a36 = fs.readFileSync('scripts/check-stage220a36-commission-input-model-split.cjs', 'utf8');
  assert.match(a36, /CaseFinanceEditorDialog percent basis label/);
});
