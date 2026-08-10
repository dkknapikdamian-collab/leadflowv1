const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/lib/finance/finance-client-summary.ts';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-04-finance-client-summary.cjs';
const baseSha = 'fa793333';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-04 guard passes for the canonical FinanceSummary delegation', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-04/);
});

test('A2-04 changes only the stale FIN-7 return contract', () => {
  const historical = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const current = read(sourcePath);
  assert.notEqual(current, historical);
  assert.equal((current.match(/buildFinanceSummary\(/g) || []).length, (historical.match(/buildFinanceSummary\(/g) || []).length + 1);
  for (const field of ['plannedAmount:', 'dueAmount:', 'refundedAmount:']) assert.equal(current.includes(field), false);
  assert.match(current, /payments: normalizedPayments/);
  assert.match(current, /mode: commissionAmount > 0 \? 'fixed' : 'none'/);
  assert.equal(current.includes('caseRemainingAmount'), false);
});

test('A2-04 preserves FIN-7 aggregation inputs and canonical output fields', () => {
  const current = read(sourcePath);
  for (const token of ['input.cases', 'input.payments', 'contractValue', 'paidAmount', 'commissionAmount', 'currency']) {
    assert.match(current, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(current, /buildFinanceSummary\(\{/);
  assert.doesNotMatch(current, /as unknown as|\bany\b|@ts-ignore|@ts-expect-error/);
});

test('A2-04 canonical finalizer preserves client payment and commission semantics', () => {
  const runtimeScript = [
    "import { buildClientFinanceSummary } from './src/lib/finance/finance-client-summary.ts';",
    "const result = buildClientFinanceSummary({ cases: [{ contractValue: 1000, remainingAmount: 250, commissionMode: 'fixed', commissionAmount: 100 }], payments: [{ type: 'partial', status: 'paid', amount: 500 }, { type: 'commission', status: 'paid', amount: 20 }, { type: 'refund', status: 'paid', amount: 50 }] });",
    "if (result.contractValue !== 1000 || result.paidAmount !== 450 || result.remainingAmount !== 550 || result.commissionAmount !== 100 || result.commissionPaidAmount !== 20 || result.refundAmount !== 50) process.exit(1);",
  ].join(' ');
  execFileSync(process.execPath, [path.join(root, 'node_modules', 'tsx', 'dist', 'cli.cjs'), '--eval', runtimeScript], {
    cwd: root,
    encoding: 'utf8',
  });
});
