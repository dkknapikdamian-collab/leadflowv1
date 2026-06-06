const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

test('CaseDetail legacy finance modal uses requested commission-first order', () => {
  const tokens = [
    '<DialogTitle>Prowizja sprawy</DialogTitle>',
    '<span>Rodzaj prowizji</span>',
    '<span>Stawka prowizji (%)</span>',
    '<span>Wartość prowizji</span>',
    '<span>Wartość transakcji / zlecenia</span>',
    '<span>Waluta</span>',
    '<span>Status prowizji</span>',
  ];
  let last = -1;
  for (const token of tokens) {
    const index = source.indexOf(token);
    assert.notEqual(index, -1, token + ' missing');
    assert.ok(index > last, token + ' is out of order');
    last = index;
  }
});

test('CaseDetail legacy finance modal blocks old confusing copy and controls', () => {
  assert.equal(source.includes('<DialogTitle>Wartość sprawy i prowizja</DialogTitle>'), false);
  assert.equal(source.includes('<span>Wartość transakcji / sprawy</span>'), false);
  assert.equal(source.includes('<span>Model prowizji</span>'), false);
  assert.equal(source.includes('<span>Kwota prowizji</span>'), false);
  assert.equal(source.includes('data-stage220a36r7-commission-amount-input="fixed-or-calculated"'), true);
  assert.equal(source.includes('data-stage220a36r7-percent-basis-input="percent-only"'), true);
});
