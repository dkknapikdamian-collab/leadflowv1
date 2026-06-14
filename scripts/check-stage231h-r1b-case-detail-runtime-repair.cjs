#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const casePath = path.join(repo, 'src', 'pages', 'CaseDetail.tsx');
const financeDialogPath = path.join(repo, 'src', 'components', 'finance', 'CaseFinanceEditorDialog.tsx');
const runPath = path.join(repo, '_project', 'runs', 'STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT.md');
const obsPath = path.join(repo, '_project', 'obsidian_updates', '2026-06-14_STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT.md');
const testHistoryPath = path.join(repo, '_project', '13_TEST_HISTORY.md');

function fail(message) {
  console.error(`STAGE231H_R1B_CLOSEOUT FAIL: ${message}`);
  process.exit(1);
}
function read(filePath) {
  if (!fs.existsSync(filePath)) fail(`missing file: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

const caseSource = read(casePath);
const financeSource = read(financeDialogPath);
const run = read(runPath);
const obs = read(obsPath);
const testHistory = fs.existsSync(testHistoryPath) ? fs.readFileSync(testHistoryPath, 'utf8') : '';
const hasR1cCombinedPaymentCostModal =
  caseSource.includes('STAGE231H_R1C_COST_CORRECTION_MODAL') ||
  caseSource.includes('financeCorrectionRowsStage231H_R1C') ||
  caseSource.includes('data-stage231h-r1c-cost-correction-row="true"');

if (caseSource.includes('Dyktuj notatkę')) fail('fake Dyktuj notatkę label still exists in CaseDetail.');
if (!caseSource.includes('data-stage231h-r1b-dictation-disabled="true"')) fail('disabled voice-note marker missing in CaseDetail.');
if (!caseSource.includes('Notatka głosowa — wkrótce')) fail('honest disabled voice-note copy missing.');
if (caseSource.includes("item.kind === 'task' || item.kind === 'event' || item.kind === 'missing'")) fail('nextAction still mixes missing fallback.');
if (!caseSource.includes("workItems.find((item) => item.kind === 'task' || item.kind === 'event') || null")) fail('task/event-only nextAction fallback missing.');
if (caseSource.includes('payments: visibleCasePayments,')) fail('case history still uses visibleCasePayments.');
if (!caseSource.includes('payments: sortCasePayments(casePayments),')) fail('case history must use full sorted payments.');
if (caseSource.includes('<DialogTitle>Historia wpłat i korekt</DialogTitle>')) fail('payment modal still promises full history.');
if (hasR1cCombinedPaymentCostModal) {
  if (!caseSource.includes('<DialogTitle>Koryguj wpłatę/koszt</DialogTitle>')) fail('R1C combined payment/cost modal title must be Koryguj wpłatę/koszt.');
  if (!caseSource.includes('data-stage231h-r1c-cost-correction-row="true"')) fail('R1C combined title requires visible cost rows in the modal.');
} else if (!caseSource.includes('<DialogTitle>Ostatnie 8 wpłat i korekt</DialogTitle>')) {
  fail('payment modal title must be honest.');
}

const sharedForbidden = [
  "const transactionBasis = form.commissionMode === 'percent' ? contractValue : 0;",
  "const transactionBasis = commissionMode === 'percent' ? parseCaseFinanceNumber(form.contractValue) : 0;",
  "value={isPercentCommission ? form.contractValue : ''}",
  'contractValue: transactionBasis',
  'expectedRevenue: transactionBasis',
];
for (const token of sharedForbidden) {
  if (financeSource.includes(token)) fail(`shared finance editor still contains forbidden token: ${token}`);
}
const sharedInputStart = financeSource.indexOf('data-stage231h-r1b-shared-contract-value-always-editable="true"');
if (sharedInputStart < 0) fail('shared finance editor marker for always-editable contractValue missing.');
const sharedInputEnd = financeSource.indexOf('</label>', sharedInputStart);
if (sharedInputEnd < 0) fail('shared contract value label end not found.');
const sharedInputBlock = financeSource.slice(sharedInputStart, sharedInputEnd);
if (!sharedInputBlock.includes('value={form.contractValue}')) fail('shared finance editor contractValue input is not always bound to form.contractValue.');
if (sharedInputBlock.includes('disabled={!isPercentCommission}') || sharedInputBlock.includes('disabled={')) fail('shared contractValue input is still disabled.');
if (!financeSource.includes('data-stage231h-r1b-shared-contract-value-preview="true"')) fail('shared finance editor preview marker missing.');
if (!financeSource.includes('contractValue: contractValue') || !financeSource.includes('expectedRevenue: contractValue')) fail('shared finance patch must retain contractValue for fixed/none.');

const requiredRunTokens = [
  'R1B_CLOSEOUT_RUNTIME_REPAIR',
  'CaseFinanceEditorDialog shared finance path fixed',
  'case_item source truth decision: two UI entries, one case_items contract',
  'cost lifecycle left as R1C',
  'SQL: NOT_TOUCHED',
];
for (const token of requiredRunTokens) {
  if (!run.includes(token)) fail(`run report missing token: ${token}`);
}
if (run.includes('Status: REQUIRES_R1B_RUNTIME_REPAIR')) fail('closeout report cannot keep R1 requires-runtime status.');
if (!obs.includes('STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT')) fail('Obsidian payload missing closeout stage id.');
if (!testHistory.includes('STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT')) fail('test history missing closeout stage entry.');

console.log('STAGE231H_R1B_CLOSEOUT PASS: CaseDetail runtime closeout and shared finance mapping are guarded.');
