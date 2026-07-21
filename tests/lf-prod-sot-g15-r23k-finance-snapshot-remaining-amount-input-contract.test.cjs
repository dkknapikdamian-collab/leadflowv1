const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

test('R23K byte-scope guard passes on the exact branch tree', () => {
  const output = execFileSync('node', ['scripts/check-g15-r23k-finance-snapshot-remaining-amount-input-contract.cjs'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.match(output, /^PASS: R23K/m);
});

test('FinanceSnapshotInput accepts the legacy remainingAmount field without making it required', () => {
  const source = read('src/lib/finance/finance-types.ts');
  const inputBlock = source.match(/export type FinanceSnapshotInput = \{([\s\S]*?)\n\};/);
  assert.ok(inputBlock, 'FinanceSnapshotInput block is missing');
  assert.match(inputBlock[1], /remainingAmount\?: number \| string \| null;/);
  assert.doesNotMatch(inputBlock[1], /remainingAmount: number/);
});

test('canonical runtime still derives remainingAmount from contractValue and paidAmount', () => {
  const source = read('src/lib/finance/finance-calculations.ts');
  assert.match(source, /const remainingAmount = calculateRemainingAmount\(contractValue, paidAmount\);/);
  assert.doesNotMatch(source, /data\.remainingAmount/);
});

test('existing FinanceSnapshot compatibility call remains unchanged and cast-free', () => {
  const source = read('src/components/finance/FinanceSnapshot.tsx');
  assert.match(source, /const remainingAmount = pickNumber\(record, \['remainingAmount', 'remaining_amount'\]\);/);
  assert.match(source, /buildFinanceSummary\(\{[\s\S]*?remainingAmount,[\s\S]*?payments,[\s\S]*?commission,/);
  assert.doesNotMatch(source, /remainingAmount\s+as\s+/);
});
