const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = 'fa793333';
const sourcePath = 'src/lib/finance/finance-client-summary.ts';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function normalizeEol(value) {
  return value.replace(/\r\n/g, '\n');
}

const current = normalizeEol(fs.readFileSync(path.join(root, sourcePath), 'utf8'));
const base = normalizeEol(execFileSync('git', ['show', `${baseSha}:${sourcePath}`], {
  cwd: root,
  encoding: 'utf8',
}));

const oldImport = "import { clampFinanceAmount, calculateCommissionAmount } from './finance-calculations.js';";
const newImport = "import { buildFinanceSummary, clampFinanceAmount, calculateCommissionAmount } from './finance-calculations.js';";
const oldAccumulator = [
  '  let contractValue = 0;',
  '  let casePaidAmount = 0;',
  '  let caseRemainingAmount = 0;',
  '  let commissionAmount = 0;',
].join('\n');
const newAccumulator = [
  '  let contractValue = 0;',
  '  let casePaidAmount = 0;',
  '  let commissionAmount = 0;',
].join('\n');
const oldCaseAccumulator = [
  '    const currency = getCaseCurrency(row, fallbackCurrency);',
  '    const currentContractValue = getCaseContractValue(row);',
  '    const currentPaid = pickNumber(row, CASE_PAID_KEYS, 0);',
  '    const currentRemaining = pickNumber(row, CASE_REMAINING_KEYS, 0);',
  '    contractValue += currentContractValue;',
  '    casePaidAmount += currentPaid;',
  '    caseRemainingAmount += currentRemaining;',
  '    commissionAmount += getCaseCommissionAmount(row, currentContractValue, currentPaid, currency);',
].join('\n');
const newCaseAccumulator = [
  '    const currency = getCaseCurrency(row, fallbackCurrency);',
  '    const currentContractValue = getCaseContractValue(row);',
  '    const currentPaid = pickNumber(row, CASE_PAID_KEYS, 0);',
  '    contractValue += currentContractValue;',
  '    casePaidAmount += currentPaid;',
  '    commissionAmount += getCaseCommissionAmount(row, currentContractValue, currentPaid, currency);',
].join('\n');
const oldReturn = [
  '  const paidAmount = paidCustomerPayments > 0 ? paidCustomerPayments : casePaidAmount;',
  '  const remainingAmount = caseRemainingAmount > 0 ? caseRemainingAmount : Math.max(0, contractValue - paidAmount);',
  '',
  '  return {',
  '    contractValue,',
  '    paidAmount: Math.max(0, paidAmount),',
  "    plannedAmount: normalizedPayments.filter((payment) => payment.status === 'planned').reduce((sum, payment) => sum + payment.amount, 0),",
  "    dueAmount: normalizedPayments.filter((payment) => payment.status === 'due').reduce((sum, payment) => sum + payment.amount, 0),",
  "    refundedAmount: normalizedPayments.filter((payment) => payment.type === 'refund').reduce((sum, payment) => sum + payment.amount, 0),",
  '    remainingAmount,',
  '    commissionAmount,',
  '    paidCommissionAmount,',
  '    commissionStatus: resolveCommissionStatus(cases, commissionAmount, paidCommissionAmount),',
  '    currency: fallbackCurrency,',
  '  };',
].join('\n');
const newReturn = [
  '  const paidAmount = paidCustomerPayments > 0 ? paidCustomerPayments : casePaidAmount;',
  '  const commissionStatus = resolveCommissionStatus(cases, commissionAmount, paidCommissionAmount);',
  '',
  '  return buildFinanceSummary({',
  '    contractValue,',
  '    paidAmount: Math.max(0, paidAmount),',
  '    currency: fallbackCurrency,',
  '    payments: normalizedPayments,',
  '    commission: {',
  "      mode: commissionAmount > 0 ? 'fixed' : 'none',",
  "      base: 'contract_value',",
  '      amount: commissionAmount,',
  '      fixedAmount: commissionAmount,',
  '      paidAmount: paidCommissionAmount,',
  '      status: commissionStatus,',
  '      currency: fallbackCurrency,',
  '    },',
  '  });',
].join('\n');

assert(base.includes(oldImport), 'base must contain the pre-repair finance calculation import');
assert(base.includes(oldAccumulator), 'base must contain the stale remaining accumulator');
assert(base.includes(oldCaseAccumulator), 'base must contain the stale case remaining accumulation');
assert(base.includes(oldReturn), 'base must contain the stale FinanceSummary return shape');
const expected = base
  .replace(oldImport, newImport)
  .replace(oldAccumulator, newAccumulator)
  .replace(oldCaseAccumulator, newCaseAccumulator)
  .replace(oldReturn, newReturn);
assert(current === expected, 'current source must equal base with only canonical FinanceSummary delegation and stale accumulator removal');
assert(current.includes('buildFinanceSummary({'), 'builder must delegate to canonical finance summary calculator');
for (const field of ['plannedAmount:', 'dueAmount:', 'refundedAmount:']) {
  assert(!current.includes(field), `stale output field must be removed: ${field}`);
}
for (const token of ['contractValue', 'paidAmount', 'remainingAmount', 'commissionAmount', 'resolveCommissionStatus', "type !== 'commission'"]) {
  if (token === 'remainingAmount') continue;
  assert(current.includes(token), `FIN-7 source contract must remain present: ${token}`);
}
assert(!current.includes('caseRemainingAmount'), 'legacy client-specific remaining accumulator must not remain outside canonical calculator');
assert(!/\bany\b|@ts-ignore|@ts-expect-error/.test(current), 'finance client summary must not add a type bypass');

console.log('PASS: A2-04 routes FIN-7 output through the canonical FinanceSummary calculator.');
