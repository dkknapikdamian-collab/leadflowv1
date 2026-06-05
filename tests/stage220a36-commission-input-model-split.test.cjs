const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const path = require('node:path');
const esbuild = require('esbuild');

async function loadFinanceSource() {
  const entry = path.join(process.cwd(), 'src/lib/finance/case-finance-source.ts');
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].text;
  const module = { exports: {} };
  const fn = new Function('module', 'exports', 'require', code);
  fn(module, module.exports, require);
  return module.exports;
}

describe('STAGE220A36 commission input model split', () => {
  it('fixed commission enters owner revenue directly without transaction basis', async () => {
    const { buildCaseFinancePatch, getCaseFinanceSummary } = await loadFinanceSource();
    const patch = buildCaseFinancePatch({
      contractValue: 0,
      expectedRevenue: 0,
      currency: 'PLN',
      commissionMode: 'fixed',
      commissionBase: 'contract_value',
      commissionRate: 0,
      commissionAmount: 3000,
      commissionStatus: 'expected',
    });
    const summary = getCaseFinanceSummary(patch, []);
    assert.equal(summary.contractValue, 0);
    assert.equal(summary.commissionMode, 'fixed');
    assert.equal(summary.commissionAmount, 3000);
    assert.equal(summary.commissionRemainingAmount, 3000);
  });

  it('percent commission uses transaction basis and locks calculated commission amount', async () => {
    const { buildCaseFinancePatch, getCaseFinanceSummary } = await loadFinanceSource();
    const patch = buildCaseFinancePatch({
      contractValue: 100000,
      expectedRevenue: 100000,
      currency: 'PLN',
      commissionMode: 'percent',
      commissionBase: 'contract_value',
      commissionRate: 2,
      commissionAmount: null,
      commissionStatus: 'expected',
    });
    const summary = getCaseFinanceSummary(patch, []);
    assert.equal(summary.contractValue, 100000);
    assert.equal(summary.commissionMode, 'percent');
    assert.equal(summary.commissionRate, 2);
    assert.equal(summary.commissionAmount, 2000);
    assert.equal(summary.commissionRemainingAmount, 2000);
  });

  it('client list operational value uses commission, not transaction price', async () => {
    const { getClientCasesFinanceSummary } = await loadFinanceSource();
    const summary = getClientCasesFinanceSummary({
      client: { id: 'client-1' },
      mode: 'all_cases',
      payments: [],
      cases: [
        { id: 'case-1', clientId: 'client-1', contractValue: 100000, expectedRevenue: 100000, commissionMode: 'percent', commissionRate: 2, commissionAmount: 2000 },
      ],
    });
    assert.equal(summary.totalValue, 100000);
    assert.equal(summary.commissionAmount, 2000);
    assert.notEqual(summary.commissionAmount, summary.totalValue);
  });
});
