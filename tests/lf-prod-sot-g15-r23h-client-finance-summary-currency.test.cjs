const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const clientSummaryPath = path.join(root, 'src/lib/client-finance.ts');
const caseSourcePath = path.join(root, 'src/lib/finance/case-finance-source.ts');
const consumerPath = path.join(root, 'src/components/finance/FinanceMiniSummary.tsx');
const guardPath = path.join(root, 'scripts/check-g15-r23h-client-finance-summary-currency.cjs');

function normalizeLineEndings(source) {
  return source.replace(/\r\n/g, '\n');
}

const clientSource = normalizeLineEndings(fs.readFileSync(clientSummaryPath, 'utf8'));
const caseSource = normalizeLineEndings(fs.readFileSync(caseSourcePath, 'utf8'));
const consumerSource = normalizeLineEndings(fs.readFileSync(consumerPath, 'utf8'));

test('R23H focused guard passes on LF and CRLF worktrees', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23H/);
});

test('public ClientFinanceSummary exposes a required FinanceCurrency', () => {
  assert.match(clientSource, /import type \{ FinanceCurrency \} from '\.\/finance\/finance-types\.js';/);
  assert.match(
    clientSource,
    /source: 'primary_case' \| 'all_active_cases' \| 'all_cases';\n  currency: FinanceCurrency;\n  commissionAmount\?: number;/,
  );
  assert.doesNotMatch(clientSource, /currency\?:/);
});

test('canonical client-cases source returns the selected first summary currency with PLN fallback', () => {
  assert.match(
    caseSource,
    /source: 'primary_case' \| 'all_active_cases' \| 'all_cases';\n  currency: FinanceCurrency;\n  commissionAmount: number;/,
  );
  assert.match(
    caseSource,
    /source: selected\.source,\n    currency: caseSummaries\[0\]\?\.currency \|\| 'PLN',\n    commissionAmount:/,
  );
});

test('FinanceMiniSummary keeps both existing totals.currency consumers unchanged', () => {
  assert.equal(consumerSource.split('totals.currency').length - 1, 2);
});
