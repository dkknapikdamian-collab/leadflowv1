const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BASE_SHA = '2cb2c56d51de1ad7507d36cbbde514895bb84909';
const TYPES_PATH = 'src/lib/finance/finance-types.ts';
const CALCULATIONS_PATH = 'src/lib/finance/finance-calculations.ts';
const SNAPSHOT_PATH = 'src/components/finance/FinanceSnapshot.tsx';

function normalize(text) {
  return String(text).replace(/\r\n/g, '\n');
}

function readCurrent(relativePath) {
  return normalize(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function readBase(relativePath) {
  return normalize(execFileSync('git', ['show', `${BASE_SHA}:${relativePath}`], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }));
}

const baseTypes = readBase(TYPES_PATH);
const currentTypes = readCurrent(TYPES_PATH);
const snapshotInputPaidAmountAnchor = [
  'export type FinanceSnapshotInput = {',
  '  contractValue?: number | string | null;',
  '  paidAmount?: number | string | null;',
  '',
].join('\n');
const compatibilityField = [
  '  /**',
  '   * Backward-compatible input accepted from legacy summary callers.',
  '   * Runtime continues to derive remainingAmount from contractValue - paidAmount.',
  '   */',
  '  remainingAmount?: number | string | null;',
  '',
].join('\n');

assert.ok(
  baseTypes.includes(snapshotInputPaidAmountAnchor),
  'base FinanceSnapshotInput paidAmount anchor is missing',
);
assert.equal(
  baseTypes.split(snapshotInputPaidAmountAnchor).length - 1,
  1,
  'base FinanceSnapshotInput paidAmount anchor must be unique',
);
const expectedTypes = baseTypes.replace(
  snapshotInputPaidAmountAnchor,
  `${snapshotInputPaidAmountAnchor}${compatibilityField}`,
);
assert.equal(
  currentTypes,
  expectedTypes,
  'finance-types.ts must differ from the R23J merge only by the documented optional remainingAmount input field in FinanceSnapshotInput',
);

const baseCalculations = readBase(CALCULATIONS_PATH);
const currentCalculations = readCurrent(CALCULATIONS_PATH);
assert.equal(currentCalculations, baseCalculations, 'finance-calculations.ts must remain byte-for-byte unchanged');
assert.match(
  currentCalculations,
  /const remainingAmount = calculateRemainingAmount\(contractValue, paidAmount\);/,
  'runtime must continue to derive remainingAmount from contractValue and paidAmount',
);
assert.doesNotMatch(currentCalculations, /data\.remainingAmount/, 'runtime must not consume the compatibility input');

assert.equal(
  readCurrent(SNAPSHOT_PATH),
  readBase(SNAPSHOT_PATH),
  'FinanceSnapshot.tsx must remain byte-for-byte unchanged',
);

console.log('PASS: R23K admits the legacy remainingAmount input while preserving canonical finance calculations and FinanceSnapshot runtime byte-for-byte.');
