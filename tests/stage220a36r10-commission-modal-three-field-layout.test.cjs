const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-case-finance-modal-stage220a30.css', 'utf8');

test('R10 puts three commission controls in the top row and transaction value below', () => {
  const tokens = [
    'data-stage220a36r10-top-row="true"',
    '<span>Rodzaj prowizji</span>',
    '<span>Stawka prowizji (%)</span>',
    '<span>Wartość prowizji</span>',
    '<span>Wartość transakcji / zlecenia</span>',
    'data-stage220a36r10-bottom-row="true"',
    '<span>Waluta</span>',
    '<span>Status prowizji</span>',
  ];
  let last = -1;
  for (const token of tokens) {
    const index = source.indexOf(token);
    assert.notEqual(index, -1, token + ' missing');
    assert.ok(index > last, token + ' out of order');
    last = index;
  }
});

test('R10 keeps fixed vs percent editing rules clear', () => {
  assert.equal(source.includes('data-stage220a36r10-commission-amount-input="fixed-or-calculated"'), true);
  assert.equal(source.includes('data-stage220a36r10-transaction-basis-input="percent-only"'), true);
  assert.equal(source.includes("disabled={financeEditForm.commissionMode !== 'fixed'}"), true);
  assert.equal(source.includes("disabled={financeEditForm.commissionMode !== 'percent'}"), true);
  assert.equal(source.includes('<span>Wartość transakcji / sprawy</span>'), false);
  assert.equal(source.includes('<span>Model prowizji</span>'), false);
  assert.equal(source.includes('<span>Kwota prowizji</span>'), false);
});

test('R10 CSS defines a readable three-field top row', () => {
  assert.equal(css.includes('STAGE220A36_R10_COMMISSION_MODAL_THREE_FIELD_LAYOUT'), true);
  assert.equal(css.includes('.case-finance-edit-top-row-stage220a36r10'), true);
  assert.equal(css.includes('grid-template-columns: minmax(170px, 1.22fr) minmax(110px, 0.72fr) minmax(150px, 1fr)'), true);
});
