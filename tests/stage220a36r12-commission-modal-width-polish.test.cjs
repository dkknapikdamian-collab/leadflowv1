const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-case-finance-modal-stage220a30.css', 'utf8');
test('R12 gives commission type enough room and keeps rate compact', () => {
  assert.equal(caseDetail.includes('data-stage220a36r12-compact-width-polish="true"'), true);
  assert.equal(css.includes('minmax(270px, 1.75fr)'), true);
  assert.equal(css.includes('max-width: 128px'), true);
});
test('R12 keeps transaction value field shorter than full modal width', () => {
  assert.equal(css.includes('width: min(100%, 30rem)'), true);
  assert.equal(css.includes('max-width: 30rem'), true);
});
