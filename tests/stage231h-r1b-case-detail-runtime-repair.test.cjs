const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const caseSource = fs.readFileSync(path.join(repo, 'src', 'pages', 'CaseDetail.tsx'), 'utf8');
const guardSource = fs.readFileSync(path.join(repo, 'scripts', 'check-stage231h-r1b-case-detail-runtime-repair.cjs'), 'utf8');
const runReport = fs.readFileSync(path.join(repo, '_project', 'runs', 'STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR.md'), 'utf8');

test('STAGE231H_R1B disables fake dictation instead of opening normal note dialog', () => {
  assert.equal(caseSource.includes('Dyktuj notatkę'), false);
  assert.match(caseSource, /data-stage231h-r1b-dictation-disabled="true"/);
  assert.match(caseSource, /Notatka głosowa — wkrótce/);
});

test('STAGE231H_R1B keeps missing out of nextAction fallback', () => {
  assert.equal(caseSource.includes("item.kind === 'task' || item.kind === 'event' || item.kind === 'missing'"), false);
  assert.match(caseSource, /workItems\.find\(\(item\) => item\.kind === 'task' \|\| item\.kind === 'event'\) \|\| null/);
});

test('STAGE231H_R1B makes contract value editable regardless of commission mode', () => {
  assert.equal(caseSource.includes("contractValue: nextMode === 'percent' ? current.contractValue : ''"), false);
  assert.equal(caseSource.includes("value={financeEditForm.commissionMode === 'percent' ? financeEditForm.contractValue : ''}"), false);
  assert.match(caseSource, /data-stage231h-r1b-contract-value-always-editable="true"/);
});

test('STAGE231H_R1B makes payment history copy honest and full case history uses all payments', () => {
  assert.equal(caseSource.includes('<DialogTitle>Historia wpłat i korekt</DialogTitle>'), false);
  assert.match(caseSource, /<DialogTitle>Ostatnie 8 wpłat i korekt<\/DialogTitle>/);
  assert.match(caseSource, /payments: sortCasePayments\(casePayments\),/);
});

test('STAGE231H_R1B guard blocks known regression patterns', () => {
  assert.match(guardSource, /Dyktuj notatkę/);
  assert.match(guardSource, /contractValue/);
  assert.match(guardSource, /visibleCasePayments/);
  assert.match(runReport, /cost lifecycle left as R1C/);
});
