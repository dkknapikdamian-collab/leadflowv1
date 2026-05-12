const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }

test('FIN-11 exposes edit value and commission in the right case finance panel', () => {
  const source = read('src/pages/CaseDetail.tsx');
  const panelIndex = source.indexOf('data-fin11-case-right-finance-panel="true"');
  assert.ok(panelIndex > 0, 'right finance panel marker must exist');
  const actionsIndex = source.indexOf('data-fin11-case-right-finance-actions="true"', panelIndex);
  assert.ok(actionsIndex > panelIndex, 'actions must be inside or after the right finance panel');
  for (const text of ['Edytuj wartość/prowizję', 'Dodaj wpłatę', 'Dodaj płatność prowizji']) {
    assert.ok(source.includes(text), `missing action: ${text}`);
  }
});

test('FIN-11 edit modal uses amount for case value and percent only for commission', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.ok(source.includes('Wartość sprawy / transakcji'));
  assert.ok(source.includes('Procent prowizji'));
  assert.ok(source.includes('Kwota prowizji'));
  assert.ok(source.includes('Procent od wartości'));
  assert.ok(!source.includes('wartość sprawy w procentach'));
});

test('FIN-11 save path persists to case and reloads case payments', () => {
  const source = read('src/pages/CaseDetail.tsx');
  assert.ok(source.includes('updateCaseInSupabase(updatePayload)'));
  assert.ok(source.includes('createPaymentInSupabase({'));
  assert.ok(source.includes('fetchCaseByIdFromSupabase(currentCaseId)'));
  assert.ok(source.includes('fetchPaymentsFromSupabase({ caseId: currentCaseId })'));
  assert.ok(source.includes('setCaseData(nextCase)'));
});
