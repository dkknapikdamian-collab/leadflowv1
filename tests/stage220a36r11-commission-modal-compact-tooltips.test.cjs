const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-case-finance-modal-stage220a30.css', 'utf8');

test('R11 replaces under-field descriptions with compact tooltips', () => {
  assert.equal(source.includes('data-stage220a36r11-compact-tooltips="true"'), true);
  assert.equal(source.includes('case-finance-help-dot-stage220a36r11'), true);
  assert.equal(source.includes('<small>Aktywne tylko przy procencie.</small>'), false);
  assert.equal(source.includes('<small>Stała: wpisujesz. Procent: system wylicza.</small>'), false);
  assert.equal(source.includes('<small>To jest podstawa procentu'), false);
});

test('R11 keeps the top row logical and makes the middle rate field compact', () => {
  const tokens = [
    '<span>Rodzaj prowizji</span>',
    '<span>Stawka (%)</span>',
    '<span>Wartość prowizji</span>',
    '<span>Wartość transakcji / zlecenia</span>',
  ];
  let last = -1;
  for (const token of tokens) {
    const index = source.indexOf(token);
    assert.notEqual(index, -1, token + ' missing');
    assert.ok(index > last, token + ' is out of order');
    last = index;
  }
});

test('R11 CSS reduces visual weight and aligns the rate field', () => {
  assert.equal(css.includes('STAGE220A36_R11_COMMISSION_MODAL_COMPACT_TOOLTIPS'), true);
  assert.equal(css.includes('min-height: 2.24rem !important;'), true);
  assert.equal(css.includes('[data-stage220a36r10-top-field="commission-rate"]'), true);
  assert.equal(css.includes('case-finance-help-dot-stage220a36r11'), true);
});
