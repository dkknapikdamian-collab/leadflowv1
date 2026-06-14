#!/usr/bin/env node
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const caseSource = fs.readFileSync(path.join(repo, 'src', 'pages', 'CaseDetail.tsx'), 'utf8');
const financeSource = fs.readFileSync(path.join(repo, 'src', 'components', 'finance', 'CaseFinanceEditorDialog.tsx'), 'utf8');
const guardSource = fs.readFileSync(path.join(repo, 'scripts', 'check-stage231h-r1b-case-detail-runtime-repair.cjs'), 'utf8');
const run = fs.readFileSync(path.join(repo, '_project', 'runs', 'STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT.md'), 'utf8');

function hasHonestPaymentHistoryOrCombinedCostTitle() {
  if (caseSource.includes('<DialogTitle>Ostatnie 8 wpłat i korekt</DialogTitle>')) return true;
  return caseSource.includes('<DialogTitle>Koryguj wpłatę/koszt</DialogTitle>') &&
    caseSource.includes('data-stage231h-r1c-cost-correction-row="true"');
}

test('STAGE231H_R1B closeout keeps fake dictation disabled and honest', () => {
  assert.equal(caseSource.includes('Dyktuj notatkę'), false);
  assert.equal(caseSource.includes('Notatka głosowa — wkrótce'), true);
  assert.equal(caseSource.includes('data-stage231h-r1b-dictation-disabled="true"'), true);
});

test('STAGE231H_R1B closeout keeps missing out of nextAction and payment history honest', () => {
  assert.equal(caseSource.includes("item.kind === 'task' || item.kind === 'event' || item.kind === 'missing'"), false);
  assert.equal(caseSource.includes("workItems.find((item) => item.kind === 'task' || item.kind === 'event') || null"), true);
  assert.equal(caseSource.includes('<DialogTitle>Historia wpłat i korekt</DialogTitle>'), false);
  assert.equal(hasHonestPaymentHistoryOrCombinedCostTitle(), true);
  assert.equal(caseSource.includes('payments: sortCasePayments(casePayments),'), true);
});

test('STAGE231H_R1B closeout fixes shared CaseFinanceEditorDialog contractValue for fixed/none', () => {
  assert.equal(financeSource.includes("const transactionBasis = commissionMode === 'percent' ? parseCaseFinanceNumber(form.contractValue) : 0;"), false);
  assert.equal(financeSource.includes("const transactionBasis = form.commissionMode === 'percent' ? contractValue : 0;"), false);
  assert.equal(financeSource.includes("value={isPercentCommission ? form.contractValue : ''}"), false);
  assert.equal(financeSource.includes('data-stage231h-r1b-shared-contract-value-always-editable="true"'), true);
  assert.equal(financeSource.includes('value={form.contractValue}'), true);
  assert.equal(financeSource.includes('contractValue: contractValue'), true);
  assert.equal(financeSource.includes('expectedRevenue: contractValue'), true);
});

test('STAGE231H_R1B closeout guard covers shared finance and R1C-safe title regression patterns', () => {
  assert.equal(guardSource.includes('CaseFinanceEditorDialog.tsx'), true);
  assert.equal(guardSource.includes('shared finance editor still contains forbidden token'), true);
  assert.equal(guardSource.includes('data-stage231h-r1b-shared-contract-value-always-editable'), true);
  assert.equal(guardSource.includes('Koryguj wpłatę/koszt'), true);
  assert.equal(guardSource.includes('data-stage231h-r1c-cost-correction-row'), true);
});

test('STAGE231H_R1B closeout documents case_item decision and cost lifecycle deferment', () => {
  assert.equal(run.includes('case_item source truth decision: two UI entries, one case_items contract'), true);
  assert.equal(run.includes('cost lifecycle left as R1C'), true);
  assert.equal(run.includes('SQL: NOT_TOUCHED'), true);
  assert.equal(run.includes('R1B_CLOSEOUT_RUNTIME_REPAIR'), true);
});
