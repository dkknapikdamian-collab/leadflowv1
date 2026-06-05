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

describe('STAGE220A35 client commission finance source truth', () => {
  it('calculates 2 percent commission from 69 000 transaction value as 1 380', async () => {
    const { getCaseFinanceSummary } = await loadFinanceSource();
    const summary = getCaseFinanceSummary({
      id: 'case-1',
      contractValue: 69000,
      expectedRevenue: 69000,
      currency: 'PLN',
      commissionMode: 'percent',
      commissionBase: 'contract_value',
      commissionRate: 2,
      commissionStatus: 'expected',
    }, []);

    assert.equal(summary.contractValue, 69000);
    assert.equal(summary.commissionAmount, 1380);
    assert.equal(summary.commissionPaidAmount, 0);
    assert.equal(summary.commissionRemainingAmount, 1380);
    assert.equal(summary.remainingAmount, 69000);
  });

  it('client summary separates transaction value from commission totals', async () => {
    const { getClientCasesFinanceSummary } = await loadFinanceSource();
    const summary = getClientCasesFinanceSummary({
      client: { id: 'client-1' },
      cases: [{
        id: 'case-1',
        clientId: 'client-1',
        contractValue: 69000,
        expectedRevenue: 69000,
        currency: 'PLN',
        commissionMode: 'percent',
        commissionBase: 'contract_value',
        commissionRate: 2,
      }],
      payments: [],
      mode: 'all_cases',
    });

    assert.equal(summary.totalValue, 69000);
    assert.equal(summary.paidValue, 0);
    assert.equal(summary.remainingValue, 69000);
    assert.equal(summary.commissionAmount, 1380);
    assert.equal(summary.commissionPaidAmount, 0);
    assert.equal(summary.commissionRemainingAmount, 1380);
  });

  it('commission payment reduces commission remaining without pretending client paid transaction value', async () => {
    const { getClientCasesFinanceSummary } = await loadFinanceSource();
    const summary = getClientCasesFinanceSummary({
      client: { id: 'client-1' },
      cases: [{
        id: 'case-1',
        clientId: 'client-1',
        contractValue: 69000,
        currency: 'PLN',
        commissionMode: 'percent',
        commissionBase: 'contract_value',
        commissionRate: 2,
      }],
      payments: [{ id: 'pay-1', caseId: 'case-1', clientId: 'client-1', type: 'commission', status: 'paid', amount: 380, currency: 'PLN' }],
      mode: 'all_cases',
    });

    assert.equal(summary.totalValue, 69000);
    assert.equal(summary.paidValue, 0);
    assert.equal(summary.commissionAmount, 1380);
    assert.equal(summary.commissionPaidAmount, 380);
    assert.equal(summary.commissionRemainingAmount, 1000);
  });

  it('fixed commission remains independent from transaction value', async () => {
    const { getCaseFinanceSummary } = await loadFinanceSource();
    const summary = getCaseFinanceSummary({
      id: 'case-fixed',
      contractValue: 69000,
      currency: 'PLN',
      commissionMode: 'fixed',
      commissionAmount: 2500,
      commissionStatus: 'expected',
    }, []);

    assert.equal(summary.contractValue, 69000);
    assert.equal(summary.commissionAmount, 2500);
    assert.equal(summary.commissionRemainingAmount, 2500);
  });
});
