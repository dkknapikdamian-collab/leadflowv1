const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const snapshotPath = path.join(root, 'src/components/finance/FinanceSnapshot.tsx');
const typesPath = path.join(root, 'src/lib/finance/finance-types.ts');
const normalizePath = path.join(root, 'src/lib/finance/finance-normalize.ts');
const guardPath = path.join(root, 'scripts/check-g15-r23i-finance-snapshot-commission-config-type.cjs');

function normalizeLineEndings(source) {
  return source.replace(/\r\n/g, '\n');
}

const snapshotSource = normalizeLineEndings(fs.readFileSync(snapshotPath, 'utf8'));
const typesSource = normalizeLineEndings(fs.readFileSync(typesPath, 'utf8'));
const normalizeSource = normalizeLineEndings(fs.readFileSync(normalizePath, 'utf8'));

test('R23I focused guard passes on LF and CRLF worktrees', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23I/);
});

test('FinanceSnapshot imports the canonical FinanceCommissionConfig type', () => {
  assert.match(
    snapshotSource,
    /import type \{ FinanceCommissionConfig, CommissionMode, CommissionStatus, FinancePayment, FinanceSummary \} from '\.\.\/\.\.\/lib\/finance\/finance-types';/,
  );
  assert.doesNotMatch(snapshotSource, /\bCommissionConfig\b/);
});

test('both FinanceSnapshot helpers use FinanceCommissionConfig without casts', () => {
  assert.match(
    snapshotSource,
    /function buildCommissionConfigFromRecord\(record: FinanceRecord \| null \| undefined, currency: string\): FinanceCommissionConfig \{/,
  );
  assert.match(
    snapshotSource,
    /function buildSummary\(record: FinanceRecord \| null \| undefined, payments: FinancePayment\[\], commission: FinanceCommissionConfig\): FinanceSummary \{/,
  );
  assert.equal(snapshotSource.split('FinanceCommissionConfig').length - 1, 3);
  assert.doesNotMatch(snapshotSource, /as FinanceCommissionConfig/);
});

test('canonical type and normalizer contracts remain unchanged', () => {
  assert.match(typesSource, /export type FinanceCommissionConfig = \{/);
  assert.match(
    normalizeSource,
    /export function normalizeCommissionConfig\(value: Record<string, unknown> \| null \| undefined\): FinanceCommissionConfig \{/,
  );
});
