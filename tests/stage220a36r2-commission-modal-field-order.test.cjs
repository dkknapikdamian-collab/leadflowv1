const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

describe('STAGE220A36-R2 commission modal field order', () => {
  it('field order starts with commission mode, rate and commission amount', () => {
    const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
    const ordered = [
      'Rodzaj prowizji',
      'Stawka prowizji (%)',
      'Wartość prowizji',
      'Podstawa procentu (wartość transakcji/zlecenia)',
      'Waluta',
      'Status prowizji',
    ];
    const indexes = ordered.map((token) => editor.indexOf(token));
    assert.equal(indexes.every((index) => index >= 0), true);
    assert.deepEqual([...indexes].sort((a, b) => a - b), indexes);
  });

  it('basis field is below top commission controls and is disabled unless percent model is selected', () => {
    const editor = read('src/components/finance/CaseFinanceEditorDialog.tsx');
    const topCommissionIndex = editor.indexOf('Wartość prowizji');
    const basisIndex = editor.indexOf('Podstawa procentu (wartość transakcji/zlecenia)');
    assert.equal(basisIndex > topCommissionIndex, true);
    assert.match(editor, /Podstawa procentu[\s\S]*?disabled=\{!isPercentCommission\}/);
    assert.match(editor, /Wartość prowizji[\s\S]*?readOnly=\{isPercentCommission\}/);
  });
});
