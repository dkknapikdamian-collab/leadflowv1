const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error('STAGE220A36_R7_CASE_DETAIL_LEGACY_FINANCE_MODAL_FAIL:', message); process.exit(1); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
function forbidText(text, token, label) { if (text.includes(token)) fail(label + ' forbidden token still present: ' + token); }
function assertOrder(text, tokens, label) {
  let last = -1;
  for (const token of tokens) {
    const index = text.indexOf(token);
    if (index < 0) fail(label + ' missing ordered token: ' + token);
    if (index <= last) fail(label + ' wrong order near token: ' + token);
    last = index;
  }
}
const caseDetail = read('src/pages/CaseDetail.tsx');
requireText(caseDetail, 'data-stage220a36r7-case-detail-legacy-finance-modal="true"', 'CaseDetail legacy finance modal marker');
requireText(caseDetail, 'data-stage220a36r7-case-detail-finance-order="true"', 'CaseDetail legacy finance modal order marker');
requireText(caseDetail, 'data-stage220a36r7-commission-amount-input="fixed-or-calculated"', 'CaseDetail commission amount source');
requireText(caseDetail, 'data-stage220a36r7-percent-basis-input="percent-only"', 'CaseDetail percent basis source');
requireText(caseDetail, "value={financeEditForm.commissionMode === 'percent' ? fin11MoneyInput(financeEditPreview.commissionAmount) : financeEditForm.commissionAmount}", 'CaseDetail calculated commission value');
requireText(caseDetail, "disabled={financeEditForm.commissionMode !== 'fixed'}", 'CaseDetail fixed-only commission edit');
requireText(caseDetail, "value={financeEditForm.commissionMode === 'percent' ? financeEditForm.contractValue : ''}", 'CaseDetail percent-only basis value');
assertOrder(caseDetail, [
  '<DialogTitle>Prowizja sprawy</DialogTitle>',
  '<span>Rodzaj prowizji</span>',
  '<span>Stawka prowizji (%)</span>',
  '<span>Wartość prowizji</span>',
  '<span>Wartość transakcji / zlecenia</span>',
  '<span>Waluta</span>',
  '<span>Status prowizji</span>',
], 'CaseDetail legacy finance modal field order');
[
  '<DialogTitle>Wartość sprawy i prowizja</DialogTitle>',
  '<span>Wartość transakcji / sprawy</span>',
  '<span>Model prowizji</span>',
  '<span>Kwota prowizji</span>',
  '<div><span>Liczone od wartości transakcji:</span>',
].forEach((token) => forbidText(caseDetail, token, 'CaseDetail old legacy finance modal'));
const pkg = JSON.parse(read('package.json'));
if (pkg.scripts['check:stage220a36r7-case-detail-legacy-finance-modal'] !== 'node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs') fail('package missing R7 check script');
if (pkg.scripts['test:stage220a36r7-case-detail-legacy-finance-modal'] !== 'node --test tests/stage220a36r7-case-detail-legacy-finance-modal.test.cjs') fail('package missing R7 test script');
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36r7-case-detail-legacy-finance-modal.cjs')) fail('prebuild missing R7 guard');
console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_R7_CASE_DETAIL_LEGACY_FINANCE_MODAL_WIRING_FIX', guard: 'check:stage220a36r7-case-detail-legacy-finance-modal' }, null, 2));
