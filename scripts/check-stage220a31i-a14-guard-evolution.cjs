const fs = require('node:fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) {
  console.error('STAGE220A31I_A14_GUARD_EVOLUTION: FAIL');
  console.error(message);
  process.exit(1);
}
function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(`${label} missing: ${needle}`);
}

const guard = read('scripts/check-stage220a14-finance-scope-guard-lock.cjs');
const caseDetail = read('src/pages/CaseDetail.tsx');
const pkg = JSON.parse(read('package.json'));

requireText(guard, 'caseFinanceUsesA31CommissionBasis', 'A14 guard A31 branch');
requireText(guard, 'data-stage220a31-finance-billing-summary="true"', 'A14 guard A31 marker check');
requireText(guard, 'Wartość transakcji', 'A14 guard A31 transaction label');
requireText(guard, 'Prowizja należna', 'A14 guard A31 commission due label');
requireText(guard, 'Wpłacono prowizji', 'A14 guard A31 commission paid label');
requireText(guard, 'Do zapłaty prowizji', 'A14 guard A31 commission left label');
requireText(caseDetail, 'data-stage220a31-finance-billing-summary="true"', 'CaseDetail A31 billing summary marker');
requireText(caseDetail, 'caseFinanceSourceStage220A26.commissionAmount', 'CaseDetail displays commission amount');
requireText(caseDetail, 'caseFinanceSourceStage220A26.commissionPaidAmount', 'CaseDetail displays paid commission');
requireText(caseDetail, 'caseFinanceSourceStage220A26.commissionRemainingAmount', 'CaseDetail displays remaining commission');
requireText(String(pkg.scripts?.prebuild || ''), 'node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs', 'prebuild A31 guard');

console.log('STAGE220A31I_A14_GUARD_EVOLUTION: OK');
