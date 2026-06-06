const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { console.error('STAGE220A36_R10_COMMISSION_MODAL_THREE_FIELD_LAYOUT_FAIL:', message); process.exit(1); }
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
const css = read('src/styles/closeflow-case-finance-modal-stage220a30.css');
const pkg = JSON.parse(read('package.json'));
requireText(caseDetail, 'data-stage220a36r10-commission-layout="true"', 'R10 layout marker');
requireText(caseDetail, 'data-stage220a36r10-top-row="true"', 'R10 top row marker');
requireText(caseDetail, 'data-stage220a36r10-transaction-basis-field="true"', 'R10 transaction basis field marker');
requireText(caseDetail, 'data-stage220a36r10-bottom-row="true"', 'R10 bottom row marker');
requireText(caseDetail, 'data-stage220a36r10-commission-amount-input="fixed-or-calculated"', 'R10 commission amount input marker');
requireText(caseDetail, 'data-stage220a36r10-transaction-basis-input="percent-only"', 'R10 transaction basis input marker');
assertOrder(caseDetail, [
  '<DialogTitle>Prowizja sprawy</DialogTitle>',
  'data-stage220a36r10-top-row="true"',
  '<span>Rodzaj prowizji</span>',
  '<span>Stawka (%)</span>',
  '<span>Wartość prowizji</span>',
  '<span>Wartość transakcji / zlecenia</span>',
  '<span>Waluta</span>',
  '<span>Status prowizji</span>',
], 'CaseDetail commission modal R10 order');
[
  '<span>Wartość transakcji / sprawy</span>',
  '<span>Model prowizji</span>',
  '<span>Kwota prowizji</span>',
  '<span>Podstawa procentu (wartość transakcji/zlecenia)</span>',
  '<div><span>Liczone od wartości transakcji:</span>',
].forEach((token) => forbidText(caseDetail, token, 'old R7/R31/R32 commission modal copy'));
requireText(caseDetail, "value={financeEditForm.commissionMode === 'percent' ? fin11MoneyInput(financeEditPreview.commissionAmount) : financeEditForm.commissionAmount}", 'commission amount displays calculated percent value');
requireText(caseDetail, "value={financeEditForm.commissionMode === 'percent' ? financeEditForm.contractValue : ''}", 'transaction basis is percent-only');
requireText(caseDetail, "disabled={financeEditForm.commissionMode !== 'fixed'}", 'commission amount editable only for fixed');
requireText(caseDetail, "disabled={financeEditForm.commissionMode !== 'percent'}", 'percent controls disabled outside percent');
requireText(css, 'STAGE220A36_R10_COMMISSION_MODAL_THREE_FIELD_LAYOUT', 'R10 CSS marker');
requireText(css, '.case-finance-edit-top-row-stage220a36r10', 'R10 top row CSS');
requireText(css, 'STAGE220A36_R10_COMMISSION_MODAL_THREE_FIELD_LAYOUT', 'R10 CSS marker');
requireText(css, '.case-finance-edit-top-row-stage220a36r10', 'R10 top row CSS');
if (pkg.scripts['check:stage220a36r10-commission-modal-three-field-layout'] !== 'node scripts/check-stage220a36r10-commission-modal-three-field-layout.cjs') fail('package missing R10 check script');
if (pkg.scripts['test:stage220a36r10-commission-modal-three-field-layout'] !== 'node --test tests/stage220a36r10-commission-modal-three-field-layout.test.cjs') fail('package missing R10 test script');
if (!String(pkg.scripts.prebuild || '').includes('node scripts/check-stage220a36r10-commission-modal-three-field-layout.cjs')) fail('prebuild missing R10 guard');
console.log(JSON.stringify({ ok: true, stage: 'STAGE220A36_R10_COMMISSION_MODAL_THREE_FIELD_LAYOUT', guard: 'check:stage220a36r10-commission-modal-three-field-layout' }, null, 2));
