import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FIN7_CLIENT_FINANCE_SUMMARY_CONTRACT,
  buildClientFinanceSummary,
  buildFinanceClientSummary,
} from '../src/lib/finance/finance-client-summary';

test('R23 preserves the FIN7 client finance contract and percent commission calculation', () => {
  assert.equal(FIN7_CLIENT_FINANCE_SUMMARY_CONTRACT, 'FIN-7_CLIENT_FINANCE_RELATION_SUMMARY_V1');

  const summary = buildClientFinanceSummary({
    cases: [{
      id: 'case-1',
      contractValue: 10_000,
      commissionMode: 'percent',
      commissionBase: 'contract_value',
      commissionRate: 10,
      commissionStatus: 'due',
      currency: 'PLN',
    }],
    payments: [
      { type: 'deposit', status: 'paid', amount: 3_000, currency: 'PLN' },
      { type: 'refund', status: 'paid', amount: 500, currency: 'PLN' },
      { type: 'commission', status: 'paid', amount: 200, currency: 'PLN' },
    ],
    currency: 'PLN',
  });

  assert.equal(summary.contractValue, 10_000);
  assert.equal(summary.paidAmount, 2_500);
  assert.equal(summary.remainingAmount, 7_500);
  assert.equal(summary.commissionMode, 'percent');
  assert.equal(summary.commissionBase, 'contract_value');
  assert.equal(summary.commissionAmount, 1_000);
  assert.equal(summary.commissionPaidAmount, 200);
  assert.equal(summary.commissionRemainingAmount, 800);
  assert.equal(summary.paidCommissionAmount, 200);
  assert.equal(summary.remainingCommissionAmount, 800);
  assert.equal(summary.commissionStatus, 'due');
  assert.equal(summary.refundAmount, 500);
  assert.equal(summary.paymentCount, 3);
  assert.equal(summary.paidPaymentCount, 3);
});

test('R23 compatibility adapter filters workspace-wide payments before normalization', () => {
  const summary = buildFinanceClientSummary(
    { id: 'client-1', currency: 'PLN' },
    [{
      id: 'case-1',
      clientId: 'client-1',
      contractValue: 8_000,
      commissionMode: 'fixed',
      commissionAmount: 900,
      commissionStatus: 'overdue',
      currency: 'PLN',
    }],
    [
      { clientId: 'client-1', caseId: 'case-1', type: 'deposit', status: 'paid', amount: 2_000, currency: 'PLN' },
      { clientId: 'client-1', caseId: 'case-1', type: 'commission', status: 'paid', amount: 300, currency: 'PLN' },
      { clientId: 'other-client', caseId: 'other-case', type: 'deposit', status: 'paid', amount: 50_000, currency: 'PLN' },
      { clientId: 'client-1', caseId: 'case-1', type: 'deposit', status: 'paid', amount: 500, currency: 'EUR' },
    ],
  );

  assert.equal(summary.contractValue, 8_000);
  assert.equal(summary.paidAmount, 2_000);
  assert.equal(summary.remainingAmount, 6_000);
  assert.equal(summary.commissionAmount, 900);
  assert.equal(summary.commissionPaidAmount, 300);
  assert.equal(summary.commissionRemainingAmount, 600);
  assert.equal(summary.commissionStatus, 'overdue');
  assert.equal(summary.paymentCount, 2);
  assert.equal(summary.currency, 'PLN');
});

test('R23 keeps legacy case paid and remaining fallbacks when no payment rows exist', () => {
  const summary = buildClientFinanceSummary({
    cases: [{
      contractValue: 5_000,
      paidAmount: 1_250,
      remainingAmount: 3_750,
      commissionMode: 'fixed',
      commissionAmount: 600,
      currency: 'PLN',
    }],
  });

  assert.equal(summary.paidAmount, 1_250);
  assert.equal(summary.remainingAmount, 3_750);
  assert.equal(summary.commissionAmount, 600);
  assert.equal(summary.commissionStatus, 'due');
  assert.equal(summary.paymentCount, 0);
});
