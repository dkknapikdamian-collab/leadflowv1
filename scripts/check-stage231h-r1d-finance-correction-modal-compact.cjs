const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}
function assert(condition, message) {
  if (!condition) {
    console.error(`STAGE231H_R1D FAIL: ${message}`);
    process.exit(1);
  }
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const run = read('_project/runs/STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT.md');
const obsidian = read('_project/obsidian_updates/2026-06-14_STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT.md');
const testHistory = exists('_project/13_TEST_HISTORY.md') ? read('_project/13_TEST_HISTORY.md') : '';

assert(caseDetail.includes('STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT'), 'missing R1D source marker');
assert(caseDetail.includes('Koryguj wpłatę/koszt'), 'combined payment/cost modal title missing');
assert(!caseDetail.includes('Status: {getCaseCostStatusLabelStage231H_R1C'), 'cost status chip still visible in correction list');
assert(caseDetail.includes('STAGE231H_R1D: status kosztu jest dostępny w korekcie'), 'cost status removal rationale missing');
assert(!caseDetail.includes('<span>Korekta / prowizja</span>'), 'redundant payment fallback label still visible');
assert(!caseDetail.includes('id="case-payment-status"'), 'commission payment status select still visible');
assert(!caseDetail.includes('id="case-payment-type"'), 'commission payment type select still visible');
assert(caseDetail.includes('data-stage231h-r1d-commission-payment-defaults="status-fully-paid-type-payment"'), 'hidden commission payment default contract missing');
assert(/type:\s*'payment',\s*status:\s*'fully_paid'/.test(caseDetail), 'commission payment save defaults are not fixed as paid payment');
assert(/setCasePaymentDraft\(\{\s*type:\s*'payment',\s*amount:\s*'',\s*status:\s*'fully_paid'/.test(caseDetail), 'commission payment reset default not fully_paid');
assert(caseDetail.includes('data-stage231h-r1c-cost-correction-row="true"'), 'R1C cost row marker missing');
assert(caseDetail.includes('data-stage231h-r1c-select-cost-correction="true"'), 'R1C cost correction action missing');
assert(caseDetail.includes('data-stage231h-r1c-delete-cost-from-history="true"'), 'R1C cost delete action missing');
assert(run.includes('PASS_TECHNICAL_PUSH_READY / MANUAL_UI_REQUIRED'), 'run report must remain technical until manual UI check');
assert(run.includes('SQL: NOT_TOUCHED'), 'run report must document SQL untouched');
assert(run.includes('commission payment status/type selectors removed') || run.includes('Removed commission payment status/type selectors'), 'run report missing commission payment selector decision');
assert(obsidian.includes('DO_TEST_AND_PUSH'), 'Obsidian payload must remain DO_TEST_AND_PUSH until push/manual verification');
assert(testHistory.includes('STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT'), 'test history missing R1D entry');

console.log('STAGE231H_R1D PASS: finance correction modal compact cleanup is guarded.');
