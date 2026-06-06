const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) throw new Error(`Missing file: ${relPath}`);
  return fs.readFileSync(fullPath, 'utf8');
}

function requireText(text, needle, label) {
  if (!text.includes(needle)) {
    throw new Error(`STAGE220A31 guard failed: ${label}\nMissing token: ${needle}`);
  }
}

function requireAny(text, needles, label) {
  if (!needles.some((needle) => text.includes(needle))) {
    throw new Error(`STAGE220A31 guard failed: ${label}\nMissing one of: ${needles.join(' | ')}`);
  }
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const css = read('src/styles/closeflow-case-finance-modal-stage220a30.css');
const pkg = JSON.parse(read('package.json'));

const valueWord = 'Warto' + '\u015b' + '\u0107';
const transactionOld = valueWord + ' transakcji / sprawy';
const transactionTask = valueWord + ' transakcji / zlecenia';
const basisOld = 'Podstawa procentu';
const basisLong = basisOld + ' (' + valueWord.toLowerCase() + ' transakcji/zlecenia)';
const percentModel = 'Procent od warto' + '\u015b' + 'ci transakcji';
const commissionDue = 'Prowizja nale' + '\u017c' + 'na';
const commissionPaid = 'Wp' + '\u0142' + 'acono prowizji';
const commissionLeft = 'Do zap' + '\u0142' + 'aty prowizji';

requireText(caseDetail, 'STAGE220A31_FINANCE_MODAL_SAFE_INSET_AND_COMMISSION_BASIS', 'A31 marker');
requireAny(caseDetail, [transactionTask, basisLong, basisOld, transactionOld], 'transaction basis label is explicit');
requireText(caseDetail, percentModel, 'percent commission model label explains basis');
requireAny(caseDetail, ['Stawka prowizji (%)', 'Stawka (%)'], 'commission rate label is explicit');
requireText(caseDetail, commissionDue, 'commission due label exists');
requireText(caseDetail, commissionPaid, 'commission paid label exists');
requireText(caseDetail, commissionLeft, 'commission remaining label exists');
requireText(caseDetail, 'data-stage220a31-finance-preview="true"', 'A31 finance preview marker exists');
requireText(caseDetail, 'data-stage220a31-finance-billing-summary="true"', 'A31 right rail billing summary marker exists');
requireText(caseDetail, 'formatMoney(caseFinanceSourceStage220A26.commissionAmount, caseFinanceSourceStage220A26.currency)', 'right rail shows commission amount as due revenue');
requireText(caseDetail, 'formatMoney(caseFinanceSourceStage220A26.commissionPaidAmount, caseFinanceSourceStage220A26.currency)', 'right rail shows paid commission separately');

requireText(css, 'STAGE220A31', 'CSS has A31 visual requirement marker');
requireText(css, '.case-finance-source-modal-stage220a30', 'finance modal CSS source class exists');
requireAny(css, ['padding: 1.25rem !important;', 'padding: 1.2rem !important;', 'padding: 1.15rem !important;', '--cf-finance-modal-safe-inset'], 'finance modal has safe inner inset');
requireAny(css, ['padding-left: 1.25rem !important;', 'padding-inline: 1.25rem !important;', 'padding: 1.25rem !important;', '--cf-finance-modal-safe-inset'], 'modal fields are not tight to edge');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs', 'prebuild includes A31 guard');

console.log('OK STAGE220A31: finance modal inset and commission basis guard passed.');
