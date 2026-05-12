const fs = require('fs');
const path = require('path');

const root = process.cwd();
const errors = [];
function file(p) { return path.join(root, p); }
function read(p) { return fs.existsSync(file(p)) ? fs.readFileSync(file(p), 'utf8') : ''; }
function assert(condition, message) { if (!condition) errors.push(message); }
function walk(dir, result = []) {
  if (!fs.existsSync(file(dir))) return result;
  for (const entry of fs.readdirSync(file(dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, result);
    else result.push(rel);
  }
  return result;
}
function extractFunctionBody(source, functionName) {
  const start = source.indexOf(`export function ${functionName}`);
  if (start < 0) return '';
  const braceStart = source.indexOf('{', start);
  if (braceStart < 0) return '';
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart + 1, index);
  }
  return '';
}

const sourcePath = 'src/lib/finance/case-finance-source.ts';
const source = read(sourcePath);
assert(Boolean(source), `${sourcePath} nie istnieje`);
for (const name of [
  'getCaseFinanceValue',
  'getCaseFinanceCurrency',
  'getCaseClientPaidAmount',
  'getCaseCommissionPaidAmount',
  'getCaseCommissionDue',
  'getCaseFinanceSummary',
  'buildCaseFinancePatch',
]) {
  assert(new RegExp(`export function ${name}\\s*\\(`).test(source), `${sourcePath} nie eksportuje ${name}()`);
}
assert(source.includes('paid') && source.includes('fully_paid') && source.includes('deposit_paid') && source.includes('partially_paid'), 'FIN-10 source nie zawiera paid-like statusów z kontraktu');

const patchFn = extractFunctionBody(source, 'buildCaseFinancePatch');
assert(patchFn.includes('contractValue'), 'buildCaseFinancePatch nie mapuje contractValue');
assert(patchFn.includes('commissionMode'), 'buildCaseFinancePatch nie mapuje commissionMode');
const returnStart = patchFn.indexOf('return {');
const returnedObject = returnStart >= 0 ? patchFn.slice(returnStart) : patchFn;
assert(!/\bpaidAmount\s*[:,]/.test(returnedObject), 'buildCaseFinancePatch nie może wysyłać paidAmount jako edytowalnego pola');
assert(!/\bremainingAmount\s*[:,]/.test(returnedObject), 'buildCaseFinancePatch nie może wysyłać remainingAmount jako edytowalnego pola');
assert(!/\bpaid_amount\s*[:,]/.test(returnedObject), 'buildCaseFinancePatch nie może wysyłać paid_amount jako edytowalnego pola');
assert(!/\bremaining_amount\s*[:,]/.test(returnedObject), 'buildCaseFinancePatch nie może wysyłać remaining_amount jako edytowalnego pola');

const panel = read('src/components/finance/CaseSettlementPanel.tsx');
assert(panel.includes('case-finance-source'), 'CaseSettlementPanel nie importuje centralnego FIN-10 source');
assert(panel.includes('getCaseFinanceSummary(record, normalizedPayments)'), 'CaseSettlementPanel nie używa getCaseFinanceSummary(record, payments)');
assert(!panel.includes('buildFinanceSummary('), 'CaseSettlementPanel nadal używa starego buildFinanceSummary');
assert(panel.includes('data-case-settlement-panel="fin10"'), 'CaseSettlementPanel nie ma markeru data-case-settlement-panel=fin10');

const section = read('src/components/finance/CaseSettlementSection.tsx');
assert(section.includes('data-case-settlement-section="fin10"'), 'CaseSettlementSection nie ma markeru FIN-10');

const mini = read('src/components/finance/FinanceMiniSummary.tsx');
assert(!/\.reduce\s*\(/.test(mini), 'FinanceMiniSummary nie może mieć lokalnego reduce po płatnościach/sprawach');
assert(mini.includes('data-fin10-finance-mini-summary="case-source"'), 'FinanceMiniSummary nie ma markeru FIN-10');

const clientFinance = read('src/lib/client-finance.ts');
assert(clientFinance.includes('getClientCasesFinanceSummary'), 'client-finance.ts nie deleguje agregatu klienta do centralnego FIN-10 source');
assert(!clientFinance.includes('VALUE_KEYS'), 'client-finance.ts nadal ma stare lokalne VALUE_KEYS');
assert(!/const PAID_PAYMENT_STATUSES/.test(clientFinance), 'client-finance.ts nadal ma własny zestaw paid statuses');

const caseDetail = read('src/pages/CaseDetail.tsx');
assert(caseDetail.includes('getCaseFinanceSourceSummary'), 'CaseDetail nie deleguje lokalnego summary do FIN-10 source');
assert(caseDetail.includes('buildCaseFinancePatch'), 'CaseDetail nie importuje buildCaseFinancePatch');
assert(!/function getCaseFinanceSummary[\s\S]{0,1600}payments\s*\.filter[\s\S]{0,800}reduce/.test(caseDetail), 'CaseDetail nadal lokalnie redukuje płatności w getCaseFinanceSummary');

const activeUiFiles = [...walk('src/pages'), ...walk('src/components')].filter((p) => /\.(tsx|ts|jsx|js)$/.test(p));
const oldPanelHits = activeUiFiles.filter((p) => read(p).includes('data-case-finance-panel'));
assert(oldPanelHits.length === 0, `Stary aktywny panel data-case-finance-panel nadal istnieje: ${oldPanelHits.join(', ')}`);

const loadingGuard = read('scripts/check-closeflow-case-detail-loading-reference.cjs');
assert(/CaseSettlementPanel\|CaseSettlementSection|CaseSettlementSection/.test(loadingGuard), 'loading reference guard musi akceptować aktualny wrapper CaseSettlementSection');

const pkg = read('package.json');
assert(pkg.includes('check:fin10'), 'package.json nie zawiera check:fin10');
assert(pkg.includes('test:fin10'), 'package.json nie zawiera test:fin10');

if (errors.length) {
  console.error('FIN-10 check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('FIN-10 check passed: jedno źródło prawdy finansów sprawy jest wymuszone.');
