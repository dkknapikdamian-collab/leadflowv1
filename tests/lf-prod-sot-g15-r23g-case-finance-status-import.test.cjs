const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const dialogPath = path.join(root, 'src/components/finance/CaseFinanceEditorDialog.tsx');
const normalizePath = path.join(root, 'src/lib/finance/finance-normalize.ts');
const guardPath = path.join(root, 'scripts/check-g15-r23g-case-finance-status-import.cjs');

function normalizeLineEndings(source) {
  return source.replace(/\r\n/g, '\n');
}

const dialogSource = normalizeLineEndings(fs.readFileSync(dialogPath, 'utf8'));
const normalizeSource = normalizeLineEndings(fs.readFileSync(normalizePath, 'utf8'));
const exactImport = "import { normalizeCommissionMode, normalizeCommissionStatus, normalizeCurrency } from '../../lib/finance/finance-normalize';";

test('R23G focused guard passes on LF and CRLF worktrees', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23G/);
});

test('CaseFinanceEditorDialog imports normalizeCommissionStatus from the existing finance normalizer', () => {
  assert.equal(dialogSource.split(exactImport).length - 1, 1);
  assert.doesNotMatch(
    dialogSource,
    /import \{ normalizeCommissionMode, normalizeCurrency \} from '\.\.\/\.\.\/lib\/finance\/finance-normalize';/,
  );
});

test('the existing commission-status initialization call is preserved', () => {
  assert.equal(
    dialogSource.split("commissionStatus: normalizeCommissionStatus(summary.commissionStatus || 'not_set'),").length - 1,
    1,
  );
});

test('finance-normalize keeps the canonical normalizeCommissionStatus export', () => {
  assert.match(
    normalizeSource,
    /export function normalizeCommissionStatus\(value: unknown\): CommissionStatus \{\n  return normalizeEnum\(value, COMMISSION_STATUSES, 'not_set'\);\n\}/,
  );
});
