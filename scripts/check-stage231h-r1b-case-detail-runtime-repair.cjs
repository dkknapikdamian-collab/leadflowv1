#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const casePath = path.join(repo, 'src', 'pages', 'CaseDetail.tsx');
const runPath = path.join(repo, '_project', 'runs', 'STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR.md');
const obsPath = path.join(repo, '_project', 'obsidian_updates', '2026-06-14_STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR.md');

function fail(message) {
  console.error(`STAGE231H_R1B FAIL: ${message}`);
  process.exit(1);
}

function read(filePath) {
  if (!fs.existsSync(filePath)) fail(`missing file: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

const source = read(casePath);
const run = read(runPath);
const obs = read(obsPath);

if (source.includes('Dyktuj notatkę')) {
  fail('fake "Dyktuj notatkę" label still exists in CaseDetail.');
}

if (!source.includes('data-stage231h-r1b-dictation-disabled="true"')) {
  fail('disabled/not-promised voice-note marker is missing.');
}

if (!source.includes('Notatka głosowa — wkrótce')) {
  fail('voice-note copy must clearly say it is not active yet.');
}

if (source.includes("item.kind === 'task' || item.kind === 'event' || item.kind === 'missing'")) {
  fail('nextAction still mixes missing with operational task/event fallback.');
}

if (!source.includes("workItems.find((item) => item.kind === 'task' || item.kind === 'event') || null")) {
  fail('nextAction task/event-only fallback is missing.');
}

if (source.includes("contractValue: nextMode === 'percent' ? current.contractValue : ''")) {
  fail('commission mode change still clears contractValue outside percent mode.');
}

if (source.includes("value={financeEditForm.commissionMode === 'percent' ? financeEditForm.contractValue : ''}")) {
  fail('transaction/contract value input is still percent-only.');
}

if (source.includes('data-stage220a36r10-transaction-basis-input="percent-only"')) {
  fail('transaction basis marker still says percent-only.');
}

if (!source.includes('data-stage231h-r1b-contract-value-always-editable="true"')) {
  fail('always-editable contract value marker is missing.');
}

const transactionBasisStart = source.indexOf('data-stage220a36r10-transaction-basis-field="true"');
if (transactionBasisStart < 0) fail('transaction basis field marker is missing.');
const transactionBasisEnd = source.indexOf('</label>', transactionBasisStart);
if (transactionBasisEnd < 0) fail('transaction basis label end not found.');
const transactionBasisBlock = source.slice(transactionBasisStart, transactionBasisEnd);
if (transactionBasisBlock.includes('disabled={financeEditForm.commissionMode !==')) {
  fail('transaction basis input is still disabled by commissionMode.');
}
if (transactionBasisBlock.includes('aria-disabled={financeEditForm.commissionMode !==')) {
  fail('transaction basis input still exposes aria-disabled by commissionMode.');
}

if (source.includes('<DialogTitle>Historia wpłat i korekt</DialogTitle>')) {
  fail('payment history modal still promises full history while using visibleCasePayments.');
}

if (!source.includes('<DialogTitle>Ostatnie 8 wpłat i korekt</DialogTitle>')) {
  fail('payment history modal must be honest about the 8-row visible list.');
}

if (!source.includes('payments: sortCasePayments(casePayments),')) {
  fail('Case history should use full sorted casePayments, not visibleCasePayments.');
}

if (source.includes('payments: visibleCasePayments,')) {
  fail('Case history still uses visibleCasePayments.');
}

if (!run.includes('R1B_RUNTIME_REPAIR') || !run.includes('cost lifecycle left as R1C')) {
  fail('run report does not document R1B scope and cost lifecycle deferment.');
}

if (!obs.includes('STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR')) {
  fail('Obsidian payload missing R1B stage id.');
}

console.log('STAGE231H_R1B PASS: CaseDetail runtime repair contract is guarded.');
